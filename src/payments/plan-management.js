import {getBillingAdapter} from './billing-adapter.js';
import {catalog,getProduct} from '../platform/catalog.ts';import {must,uid} from '../core.js';import {paymentClock} from './lifecycle.js';
const first=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).first();
const run=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).run();
const nowIso=clock=>new Date(clock).toISOString();
const planSkus=catalog.products.filter(p=>p.planId&&p.active).map(p=>p.sku);
const adapterFor=getBillingAdapter;
export async function rentalDetails(env,tenantId,clock=paymentClock(env)){
 const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
 if(!state||state.site_owned)return {kind:state?.site_owned?'owned':'none',currentSku:null,periodEnd:null,cancel:null,switchTargets:[]};
 const ledger=await first(env,"SELECT sku,period_start,period_end FROM payment_ledger WHERE tenant_id=? AND status='paid' AND sku LIKE 'PLAN-%' ORDER BY period_start DESC,created_at DESC,id DESC LIMIT 1",tenantId);
 if(!ledger||!state.plan)return {kind:'none',currentSku:null,periodEnd:null,cancel:null,switchTargets:[]};
 const current=getProduct(ledger.sku),annual=current.cadence==='year',periodEnd=ledger.period_end,minimumEndsAt=annual?null:state.minimum_ends_at;
 const beforeMinimum=!!minimumEndsAt&&clock<Date.parse(minimumEndsAt),expired=clock>=Date.parse(periodEnd);
 const scheduled=await first(env,"SELECT id FROM payment_audit WHERE tenant_id=? AND action='subscription.cancel_requested' AND detail=? LIMIT 1",tenantId,state.subscription_id??'');
 const cancel={allowed:!beforeMinimum&&!expired&&!scheduled&&state.status!=='canceled',minimumEndsAt,periodEnd,scheduled:!!scheduled||state.status==='canceled',reason:beforeMinimum?'Three-month rental minimum':expired?'Paid period ended':null,noRefund:true,siteComesDown:true,siteExport:false,domainRetained:true,dataHoldDays:catalog.rentalPolicy.cancel.dataHoldDays};
 return {kind:annual?'annual':'monthly',currentSku:ledger.sku,periodStart:ledger.period_start,periodEnd,cancel,switchTargets:planSkus.filter(sku=>sku!==ledger.sku&&getProduct(sku).cadence===current.cadence).map(sku=>({sku,name:getProduct(sku).name,priceCents:getProduct(sku).priceCents,cadence:getProduct(sku).cadence})),cadenceChange:'Changing billing cadence needs an approved effective-date rule.'};
}
function validateSwitch(details,targetSku){
 must(details.kind==='monthly'||details.kind==='annual','Only a renter can change plans.',409);must(!details.cancel?.scheduled,'Cancellation is already scheduled.',409);
 const target=getProduct(targetSku);must(target?.planId&&target.active&&Number.isSafeInteger(target.priceCents),'Plan unavailable.',400);
 must(targetSku!==details.currentSku,'That is already your current plan.',409);must(target.cadence===getProduct(details.currentSku).cadence,'Changing billing cadence is not available yet.',409);return target;
}
async function subscriptionFor(env,tenantId){const s=await first(env,'SELECT subscription_id FROM payment_state WHERE tenant_id=?',tenantId);must(s?.subscription_id,'Subscription is not connected.',409);return s.subscription_id;}
function validateIdempotencyKey(key){must(typeof key==='string'&&/^[A-Za-z0-9_-]{8,128}$/.test(key),'One idempotency key is required per click.',400);}
export async function quotePlanSwitch(env,tenantId,targetSku,clock=paymentClock(env)){
 const d=await rentalDetails(env,tenantId,clock),target=validateSwitch(d,targetSku),current=getProduct(d.currentSku),kind=target.priceCents>current.priceCents?'upgrade':'downgrade';
 const adapter=await adapterFor(env);if(!adapter)return {state:'not_connected',message:'Payments not connected'};
 const subscriptionId=await subscriptionFor(env,tenantId);
 const q=kind==='upgrade'?await adapter.previewSwitch({tenantId,subscriptionId,currentSku:d.currentSku,targetSku,targetPriceCents:target.priceCents}):{id:uid(),amountDueCents:0,effectiveAt:d.periodEnd};
 must(q?.id&&Number.isSafeInteger(q.amountDueCents)&&q.amountDueCents>=0,'Payment quote unavailable.',503);
 const effectiveAt=kind==='downgrade'?d.periodEnd:q.effectiveAt??nowIso(clock),lineNetCents=q.lineNetCents??q.amountDueCents,taxCents=q.taxCents??0;must(Number.isSafeInteger(lineNetCents)&&lineNetCents>=0&&Number.isSafeInteger(taxCents)&&taxCents>=0&&lineNetCents+taxCents===q.amountDueCents,'Payment quote totals do not match.',503);
 await run(env,"INSERT INTO payment_plan_changes(id,tenant_id,subscription_id,current_sku,target_sku,amount_cents,line_net_cents,tax_cents,kind,period_end,effective_at,expires_at,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,'quoted',?)",q.id,tenantId,subscriptionId,d.currentSku,targetSku,q.amountDueCents,lineNetCents,taxCents,kind,d.periodEnd,effectiveAt,nowIso(clock+300000),nowIso(clock));
 return {state:'quoted',kind,quoteId:q.id,targetSku,targetName:target.name,targetPriceCents:target.priceCents,amountDueCents:q.amountDueCents,effectiveAt};
}
export async function confirmPlanSwitch(env,tenantId,{targetSku,quoteId,idempotencyKey},clock=paymentClock(env)){
 validateIdempotencyKey(idempotencyKey);const q=await first(env,'SELECT * FROM payment_plan_changes WHERE id=? AND tenant_id=?',quoteId,tenantId);
 must(q&&q.target_sku===targetSku,'Choose a current payment quote.',400);
 if(q.idempotency_key===idempotencyKey&&['requested','settled','scheduled'].includes(q.status))return {state:q.kind==='downgrade'?'scheduled':'awaiting_settlement',targetSku,message:q.kind==='downgrade'?'Downgrade scheduled for your next renewal. No refund or credit.':'Plan change requested. Your plan changes after confirmed payment.'};
 must((q.status==='quoted'||(q.status==='requesting'&&q.idempotency_key===idempotencyKey))&&Date.parse(q.expires_at)>=clock,'Payment quote expired. Review the switch again.',409);
 const d=await rentalDetails(env,tenantId,clock),target=validateSwitch(d,targetSku);must(q.current_sku===d.currentSku,'Current plan changed. Review a new quote.',409);
 const adapter=await adapterFor(env);if(!adapter)return {state:'not_connected',message:'Payments not connected'};
 // Persist the expected net charge before the provider call. Retries use the same key.
 const claimed=await run(env,"UPDATE payment_plan_changes SET idempotency_key=?,status='requesting' WHERE id=? AND (status='quoted' OR (status='requesting' AND idempotency_key=?))",idempotencyKey,q.id,idempotencyKey);must(claimed.meta.changes===1,'This payment quote has already been submitted.',409);
 const input={tenantId,subscriptionId:q.subscription_id,currentSku:d.currentSku,targetSku,targetPriceCents:target.priceCents,quoteId,paymentChangeId:q.id,periodEnd:q.period_end,idempotencyKey};
 const result=q.kind==='downgrade'?await adapter.scheduleDowngrade(input):await adapter.confirmSwitch(input);
 must(result?.accepted===true,'Plan change was not accepted.',503);
 await run(env,"UPDATE payment_plan_changes SET status=? WHERE id=? AND status<>'settled'",q.kind==='downgrade'?'scheduled':'requested',q.id);
 await run(env,'INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',uid(),tenantId,'plan.change_requested',d.currentSku+'->'+targetSku+'; quote '+quoteId,nowIso(clock));
 return {state:q.kind==='downgrade'?'scheduled':'awaiting_settlement',targetSku,message:q.kind==='downgrade'?'Downgrade scheduled for your next renewal. No refund or credit.':'Plan change requested. Your plan changes after confirmed payment.'};
}
export async function requestRentalCancellation(env,tenantId,idempotencyKey,clock=paymentClock(env)){
  validateIdempotencyKey(idempotencyKey);
  const details=await rentalDetails(env,tenantId,clock);
  must(details.kind==='monthly'||details.kind==='annual','Owned sites do not have a rental plan to cancel.',409);
  must(!details.cancel.scheduled,'Cancellation is already scheduled.',409);
  must(details.cancel.allowed,details.cancel.minimumEndsAt?`Monthly rental cannot be canceled before ${details.cancel.minimumEndsAt}.`:'Rental cannot be canceled now.',409);
  const adapter=await adapterFor(env);
  if(!adapter)return {state:'not_connected',message:'Payments not connected'};
  const subscriptionId=await subscriptionFor(env,tenantId);
  const result=await adapter.scheduleCancellation({tenantId,subscriptionId,atPeriodEnd:true,periodEnd:details.periodEnd,idempotencyKey});
  must(result?.accepted===true,'Cancellation was not scheduled.',503);
  await run(env,'INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',uid(),tenantId,'subscription.cancel_requested',subscriptionId,nowIso(clock));
  return {state:'scheduled',periodEnd:details.periodEnd,noRefund:details.cancel.noRefund,message:'Cancellation scheduled for the paid period end. The site stays up until then.'};
}
