import {createHmac,timingSafeEqual,randomUUID} from 'node:crypto';
import {getProduct,getPlanEntitlements,monthlyMinimumEnd} from '../platform/catalog.ts';
import {configureEntitlements} from '../entitlements.js';
import {markPastDue,paymentClock} from './lifecycle.js';
import {finishOwnership} from './ownership.js';
import {dispatchSettled} from './checkout.ts';

const accepted=new Set(['checkout.session.completed','invoice.paid','invoice.payment_failed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','charge.refunded','charge.dispute.created']);
const iso=value=>typeof value==='number'?new Date(value*1000).toISOString():value;
const now=()=>new Date().toISOString();
const query=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const first=(env,sql,...args)=>query(env,sql,...args).first();
const run=(env,sql,...args)=>query(env,sql,...args).run();

export function verifyStripeSignature(raw,header,secret,clock=Date.now()){
  if(!secret?.startsWith('whsec_')||!header)return false;
  const parts=Object.fromEntries(header.split(',').map(part=>part.trim().split('=',2)));
  const timestamp=Number(parts.t);
  if(!Number.isSafeInteger(timestamp)||Math.abs(clock-timestamp*1000)>300000)return false;
  const expected=createHmac('sha256',secret).update(`${timestamp}.${raw}`).digest();
  return header.split(',').filter(part=>part.trim().startsWith('v1=')).some(part=>{
    const hex=part.trim().slice(3);
    if(!/^[a-f0-9]{64}$/i.test(hex))return false;
    const actual=Buffer.from(hex,'hex');
    return actual.length===expected.length&&timingSafeEqual(actual,expected);
  });
}

async function tenantFor(env,object){
  const supplied=object.metadata?.tenantId??object.parent?.subscription_details?.metadata?.tenantId??object.subscription_details?.metadata?.tenantId;
  const customer=typeof object.customer==='string'?object.customer:object.customer?.id;
  const known=customer?await first(env,'SELECT tenant_id FROM payment_state WHERE customer_id=?',customer):null;
  if(supplied&&known&&supplied!==known.tenant_id)throw new Error('Payment tenant does not match customer.');
  return supplied??known?.tenant_id??null;
}
async function stateFor(env,tenantId,customer){
  if(!tenantId)return null;
  if(!await first(env,'SELECT id FROM tenants WHERE id=?',tenantId))throw new Error('Unknown payment tenant.');
  await run(env,"INSERT OR IGNORE INTO payment_state(tenant_id,status) VALUES(?,'none')",tenantId);
  const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
  if(customer&&state.customer_id&&state.customer_id!==customer)throw new Error('Payment customer does not match tenant.');
  if(customer&&!state.customer_id)await run(env,'UPDATE payment_state SET customer_id=? WHERE tenant_id=?',customer,tenantId);
  return state;
}
function priced(sku,amount){
  const row=getProduct(sku);
  if(!row?.active||row.priceCents===null)throw new Error(`Inactive or unpriced payment SKU: ${sku}`);
  if(row.priceCents!==amount)throw new Error(`Payment amount does not match catalog: ${sku}`);
  if(sku==='SITE-BUYOUT'&&amount!==150000)throw new Error('SITE-BUYOUT must be exactly $1,500.');
  return row;
}
async function audit(env,tenantId,action,detail){await run(env,'INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',randomUUID(),tenantId,action,detail,now());}
async function settle(env,{tenantId,sku,amount,periodStart,periodEnd,reference,eventId,eventCreated,approvedChange=null}){
  const row=approvedChange?getProduct(sku):priced(sku,amount);
  if(approvedChange&&(approvedChange.tenant_id!==tenantId||approvedChange.target_sku!==sku||approvedChange.amount_cents!==amount||!['requesting','requested','settled'].includes(approvedChange.status)))throw Error('Proration amount does not match approved server quote.');
  const start=iso(periodStart??eventCreated),end=iso(periodEnd??'9999-12-31T23:59:59.999Z');
  const id=`${reference}:${sku}:${start}`;
  const inserted=await run(env,"INSERT OR IGNORE INTO payment_ledger(id,tenant_id,sku,amount_cents,period_start,period_end,reference,status,created_at) VALUES(?,?,?,?,?,?,?,'paid',?)",id,tenantId,sku,amount,start,end,reference,now());
  if(!inserted.meta.changes){const existing=await first(env,'SELECT tenant_id,sku,amount_cents,status FROM payment_ledger WHERE id=?',id);if(!existing||existing.tenant_id!==tenantId||existing.sku!==sku||existing.amount_cents!==amount||existing.status!=='paid')throw Error('Settlement ledger does not match event.');}
  const keys=row.planId?getPlanEntitlements(row.planId):row.entitlementKeys;
  let repaired=false;
  for(const item of keys){if(await first(env,'SELECT id FROM payment_entitlements WHERE ledger_id=? AND tenant_id=? AND key=?',id,tenantId,item.key))continue;repaired=true;await run(env,"INSERT INTO payment_entitlements(id,ledger_id,tenant_id,key,quantity,used,period_end,source,status) VALUES(?,?,?,?,?,0,?,?,'active')",id+':'+item.key,id,tenantId,item.key,item.quantity,end,sku);}
  if(row.planId){
    const previous=await stateFor(env,tenantId);
    if(!previous.site_owned&&eventCreated>=previous.status_event_at&&!(previous.past_due_since&&paymentClock(env)>=Date.parse(previous.past_due_since)+30*86400000)){
      const started=previous.started_at??start;
      const minimum=row.cadence==='month'?monthlyMinimumEnd(started):null;
      await run(env,"UPDATE payment_state SET plan=?,status='active',renews_at=?,started_at=?,minimum_ends_at=?,site_available=1,past_due_since=NULL,data_hold_until=NULL WHERE tenant_id=?",row.planId,end,started,minimum,tenantId);
    }
  }
  if(sku==='SITE-OWN'||sku==='SITE-BUYOUT'){
    const ownedState=await stateFor(env,tenantId);
    if(!ownedState.site_owned){
    await run(env,"UPDATE payment_entitlements SET status='revoked' WHERE tenant_id=? AND source LIKE 'PLAN-%' AND status='active'",tenantId);
    await run(env,"UPDATE payment_state SET plan=NULL,status='active',site_owned=1,hosting_sku='OWNER-HOSTING',hosting_amount_cents=5000,hosting_status='pending_checkout',site_available=1,past_due_since=NULL WHERE tenant_id=?",tenantId);
    }
    await finishOwnership(env,tenantId,id);
    await audit(env,tenantId,'site.owned',`${sku}:${id}; OWNER-HOSTING $50/month pending checkout`);
  }
  if(sku==='OWNER-HOSTING'){const previous=await stateFor(env,tenantId);if(eventCreated>=previous.status_event_at&&!(previous.past_due_since&&paymentClock(env)>=Date.parse(previous.past_due_since)+30*86400000))await run(env,"UPDATE payment_state SET hosting_status='active',renews_at=?,past_due_since=NULL,site_available=1 WHERE tenant_id=?",end,tenantId);}
  if(approvedChange)await run(env,"UPDATE payment_plan_changes SET status='settled' WHERE id=?",approvedChange.id);
  if(inserted.meta.changes||repaired)await dispatchSettled({tenantId,sku,ledgerId:id,amountCents:amount,periodStart:start,periodEnd:end});
  return true;
}

async function revoke(env,reference,action){
  const ledgers=(await query(env,"SELECT * FROM payment_ledger WHERE reference=? AND status='paid'",reference).all()).results;
  if(!ledgers.length)return false;
  for(const ledger of ledgers){
    await run(env,"UPDATE payment_ledger SET status='refunded' WHERE id=? AND status='paid'",ledger.id);
    await run(env,"UPDATE payment_entitlements SET status='revoked' WHERE ledger_id=? AND status='active'",ledger.id);
    if(ledger.sku==='SITE-OWN'||ledger.sku==='SITE-BUYOUT')await run(env,"UPDATE payment_state SET site_owned=0,status='canceled',site_available=0,hosting_status='canceled' WHERE tenant_id=?",ledger.tenant_id);
    await audit(env,ledger.tenant_id,action,ledger.id);
  }
  return true;
}
function invoiceSku(line,object){
 const explicit=line.price?.metadata?.sku??line.price?.lookup_key?.split('@')[0]??line.metadata?.sku;
 if(explicit)return explicit;
 const raw=line.metadata?.skus??object.parent?.subscription_details?.metadata?.skus??object.subscription_details?.metadata?.skus;
 const skus=String(raw??'').split(',').filter(Boolean);
 if(skus.length===1)return skus[0];
 throw new Error('Paid invoice line has no unambiguous SKU.');
}
async function processEvent(env,event){
  const object=event.data?.object??{};
  if(!accepted.has(event.type))return true;
  if(event.type==='charge.refunded'||event.type==='charge.dispute.created'){
    const reference=object.payment_intent??object.id??object.charge;
    return reference?revoke(env,reference,event.type):false;
  }
  const tenantId=await tenantFor(env,object);
  if(!tenantId)return false;
  const customer=typeof object.customer==='string'?object.customer:object.customer?.id;
  await stateFor(env,tenantId,customer);
  const created=event.created??Math.floor(Date.now()/1000);
  if(event.type==='checkout.session.completed'){
    const skus=String(object.metadata?.skus??'').split(',').filter(Boolean);
    if(!skus.length)throw new Error('Checkout has no server catalog SKUs.');
    if(object.mode==='payment'){
      if(object.payment_status!=='paid')return true;
      if(skus.length!==1)throw new Error('One-time settlement must identify one SKU.');
      await settle(env,{tenantId,sku:skus[0],amount:object.amount_total,reference:object.payment_intent??object.id,eventId:event.id,eventCreated:created});
    }else if(object.mode==='subscription'){
      if(object.subscription)await run(env,'UPDATE payment_state SET subscription_id=? WHERE tenant_id=?',object.subscription,tenantId);
    }else throw new Error('Unknown checkout mode.');
    return true;
  }
  if(event.type==='invoice.paid'){
    const lines=object.lines?.data??[];
    if(!lines.length)throw new Error('Paid invoice has no lines.');
    const changeId=object.metadata?.paymentChangeId??object.parent?.subscription_details?.metadata?.paymentChangeId;
    const savedChange=changeId?await first(env,'SELECT * FROM payment_plan_changes WHERE id=? AND tenant_id=?',changeId,tenantId):null;
    // Subscription metadata survives renewal. A settled quote must not price a later full-price invoice.
    const fullRenewal=savedChange?.status==='settled'&&lines.every(l=>!l.proration&&!l.parent?.subscription_item_details?.proration&&getProduct(invoiceSku(l,object))?.priceCents===l.amount);
    if(changeId&&!fullRenewal){
      const change=savedChange;
      const subscription=object.subscription??object.parent?.subscription_details?.subscription;
      const net=lines.reduce((n,l)=>n+l.amount,0),tax=(object.total_taxes||[]).filter(x=>x.tax_behavior==='exclusive').reduce((n,x)=>n+x.amount,0),gross=net+tax;
      if(!change||change.kind!=='upgrade'||!['requesting','requested','settled'].includes(change.status)||change.subscription_id!==subscription||!Number.isSafeInteger(net)||net<0||net!==change.line_net_cents||tax!==change.tax_cents||gross!==change.amount_cents||(object.amount_paid!==undefined&&object.amount_paid!==gross)||(object.amount_due!==undefined&&object.amount_due!==gross))throw Error('Proration amount does not match approved server quote.');
      if(lines.some(l=>!Number.isSafeInteger(l.amount)||![change.current_sku,change.target_sku].includes(invoiceSku(l,object))))throw Error('Unexpected proration line.');
      await settle(env,{tenantId,sku:change.target_sku,amount:gross,periodStart:change.effective_at,periodEnd:change.period_end,reference:object.payment_intent??object.id,eventId:event.id,eventCreated:created,approvedChange:change});
      const current=await first(env,'SELECT status_event_at,past_due_since FROM payment_state WHERE tenant_id=?',tenantId);
      if(created>=current.status_event_at&&!(current.past_due_since&&paymentClock(env)>=Date.parse(current.past_due_since)+30*86400000))await run(env,"UPDATE payment_state SET status='active',status_event_at=? WHERE tenant_id=?",created,tenantId);return true;
    }
    for(const line of lines){const sku=invoiceSku(line,object);if(!sku)throw new Error('Paid invoice line has no SKU.');priced(sku,line.amount);}
    for(const line of lines){
      const sku=invoiceSku(line,object);
      if(!sku)throw new Error('Paid invoice line has no SKU.');
      await settle(env,{tenantId,sku,amount:line.amount,periodStart:line.period?.start??created,periodEnd:line.period?.end,reference:object.payment_intent??object.charge??object.id,eventId:event.id,eventCreated:created});
    }
    const current=await first(env,'SELECT status_event_at,past_due_since FROM payment_state WHERE tenant_id=?',tenantId);
    if(created>=current.status_event_at&&!(current.past_due_since&&paymentClock(env)>=Date.parse(current.past_due_since)+30*86400000))await run(env,"UPDATE payment_state SET status='active',status_event_at=?,past_due_since=NULL WHERE tenant_id=?",created,tenantId);
    return true;
  }
  const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
  if(event.type==='invoice.payment_failed'){
    const changeId=object.metadata?.paymentChangeId??object.parent?.subscription_details?.metadata?.paymentChangeId??object.subscription_details?.metadata?.paymentChangeId;
    const subscription=object.subscription??object.parent?.subscription_details?.subscription??object.subscription_details?.subscription;
    const change=changeId?await first(env,'SELECT * FROM payment_plan_changes WHERE id=? AND tenant_id=?',changeId,tenantId):null;
    const lines=object.lines?.data||[],prorated=lines.length>0&&lines.every(l=>l.proration===true||l.parent?.subscription_item_details?.proration===true);
    if(change?.kind==='upgrade'&&['requesting','requested'].includes(change.status)&&change.subscription_id===subscription&&prorated&&lines.reduce((n,l)=>n+l.amount,0)===change.line_net_cents&&state.status==='active'&&Date.parse(change.period_end)>paymentClock(env)){
      await audit(env,tenantId,'plan.change_payment_failed','Upgrade not paid; the already-paid current plan remains active.');return true;
    }
    if(created>=state.status_event_at){await markPastDue(env,tenantId,created);await audit(env,tenantId,'payment.past_due','Seven-day grace; pause day 8; rental cancellation day 30. Reminders queued locally.');}
    return true;
  }
  if(event.type.startsWith('customer.subscription.')){
    if(state.site_owned){if(event.type==='customer.subscription.deleted'&&object.id===state.hosting_subscription_id){const end=iso(object.current_period_end??created);await run(env,"UPDATE payment_state SET hosting_stop_at=?,hosting_status='ending' WHERE tenant_id=?",end,tenantId);}else if(object.id===state.hosting_subscription_id&&object.status==='past_due')await markPastDue(env,tenantId,created);return true;}
    if(object.id)await run(env,'UPDATE payment_state SET subscription_id=? WHERE tenant_id=?',object.id,tenantId);
    if(created<state.status_event_at)return true;
    if(event.type==='customer.subscription.deleted'){
      const end=iso(object.current_period_end??created),expired=Date.parse(end)<=paymentClock(env);
      await run(env,"UPDATE payment_state SET status='canceled',status_event_at=?,renews_at=?,site_available=?,data_hold_until=? WHERE tenant_id=?",created,end,expired?0:1,expired?new Date(Date.parse(end)+90*86400000).toISOString():null,tenantId);
      if(expired){await run(env,"UPDATE payment_entitlements SET status='revoked' WHERE tenant_id=? AND source LIKE 'PLAN-%' AND status='active'",tenantId);await audit(env,tenantId,'subscription.canceled','Unused rental entitlements revoked; domain retained; data held 90 days.');}
      else await audit(env,tenantId,'subscription.cancel_scheduled',`Rental remains until ${end}; domain retained.`);
    }else if(object.status==='past_due'){
      await markPastDue(env,tenantId,created);
    }
    return true;
  }
  return true;
}

export async function applyVerifiedEvent(env,event){
  if(!event?.id||!event?.type||!env.DB)throw new Error('Invalid verified payment event.');
  configureEntitlements(env.DB);
  const inserted=await run(env,'INSERT OR IGNORE INTO payment_events(id,type,payload,tenant_id,processed,created_at) VALUES(?,?,?,NULL,0,?)',event.id,event.type,JSON.stringify(event),now());
  if(!inserted.meta.changes){const previous=await first(env,'SELECT payload,processed FROM payment_events WHERE id=?',event.id);if(previous.payload!==JSON.stringify(event))throw Error('Payment event ID has different contents.');if(previous.processed)return {duplicate:true,processed:0};}
  let processed=0;
  const pending=(await query(env,'SELECT id,payload FROM payment_events WHERE processed=0 ORDER BY created_at,id').all()).results;
  for(const item of pending){
    let done;
    try{done=await processEvent(env,JSON.parse(item.payload));}
    catch(error){if(item.id===event.id)await run(env,'DELETE FROM payment_events WHERE id=? AND processed=0',item.id);throw error;}
    if(done){await run(env,'UPDATE payment_events SET processed=1 WHERE id=?',item.id);processed++;}
  }
  return {duplicate:false,processed};
}

export async function handleWebhook(request,env){
  if(request.method!=='POST')return new Response('Method not supported',{status:405});
  if(!env.STRIPE_WEBHOOK_SECRET)return new Response('Payments not connected',{status:503});
  const raw=await request.text();
  if(!verifyStripeSignature(raw,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET))return new Response('Invalid Stripe signature',{status:400});
  try{return Response.json(await applyVerifiedEvent(env,JSON.parse(raw)));}
  catch(error){return Response.json({error:error.message},{status:400});}
}
