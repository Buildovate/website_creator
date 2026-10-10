import {identity,must,body,uid} from '../core.js';
import {catalog,getProduct} from '../platform/catalog.ts';
import {createCheckout} from './checkout.ts';

export const DOMAIN_CONNECT_FOR_ME_SKU='DOMAIN-CONNECT-FOR-ME';
const first=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).first();
const rows=async(env,sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results;
const addOn=row=>row?.category==='Website Add-ons';

async function authorizedTenant(req,env,tenantId,change){
  const user=await identity(req,env);
  must(await first(env,'SELECT id FROM tenants WHERE id=?',tenantId),'Website not found.',404);
  if(user.admin)return true;
  const member=await first(env,'SELECT id,role FROM members WHERE tenant_id=? AND user_id=? AND active=1'+(change?" AND role='owner'":''),tenantId,user.id);
  must(member,'Website not found.',404);
  return member.role==='owner';
}

async function deliveryMap(env,tenantId){
  const audit=await rows(env,"SELECT action,detail FROM payment_audit WHERE tenant_id=? AND action IN ('addon.delivery.in_progress','addon.delivery.delivered') ORDER BY insertion_seq,id",tenantId);
  const status=new Map();
  for(const item of audit)status.set(item.detail,item.action.endsWith('delivered')?'Delivered':'In progress');
  return status;
}

export async function addOnSummary(env,tenantId,canBuy=true){
  const ledger=await rows(env,"SELECT id,sku,amount_cents,created_at FROM payment_ledger WHERE tenant_id=? AND status='paid' ORDER BY created_at DESC,id DESC",tenantId);
  const owned=ledger.filter(item=>addOn(getProduct(item.sku)));
  const ownedSkus=new Set(owned.map(item=>item.sku));
  const delivery=await deliveryMap(env,tenantId);
  const available=catalog.products.filter(row=>addOn(row)&&row.active&&row.priceCents!==null&&!ownedSkus.has(row.sku)).map(row=>({sku:row.sku,name:row.name,description:row.description,priceCents:row.priceCents,cadence:row.cadence}));
  const checkoutState=!canBuy?'read_only':env.PAYMENT_CHECKOUT_SERVICE||env.STRIPE_SECRET_KEY&&env.STRIPE_PUBLISHABLE_KEY&&env.STRIPE_WEBHOOK_SECRET?'ready':'not_connected';
  return {tenantId,available,owned:owned.map(item=>({ledgerId:item.id,sku:item.sku,name:getProduct(item.sku).name,amountCents:item.amount_cents,paidAt:item.created_at,deliveryStatus:delivery.get(item.id)??'Pending'})),checkoutState};
}

export async function markAddOnDelivery(env,ledgerId,status){
  must(['In progress','Delivered'].includes(status),'Choose a delivery status.');
  const ledger=await first(env,'SELECT id,tenant_id,sku,status FROM payment_ledger WHERE id=?',ledgerId);
  must(ledger&&ledger.status==='paid'&&addOn(getProduct(ledger.sku)),'Verified add-on payment not found.',404);
  const current=(await deliveryMap(env,ledger.tenant_id)).get(ledgerId)??'Pending';
  if(current===status)return {status};
  must(current!=='Delivered'&&!(current==='Pending'&&status==='Delivered'),'Start delivery before marking it delivered.',409);
  await env.DB.prepare('INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)').bind(uid(),ledger.tenant_id,status==='Delivered'?'addon.delivery.delivered':'addon.delivery.in_progress',ledgerId,new Date().toISOString()).run();
  return {status};
}

export async function requestAddOnCheckout(env,tenantId,input){
  must(input&&typeof input==='object'&&!Array.isArray(input)&&Object.keys(input).every(key=>['sku','idempotencyKey'].includes(key)),'Client amount or unsupported add-on field rejected.');
  must(typeof input.sku==='string'&&/^[A-Z0-9-]{1,80}$/.test(input.sku),'Choose an add-on.');
  must(typeof input.idempotencyKey==='string'&&/^[A-Za-z0-9_-]{8,128}$/.test(input.idempotencyKey),'One idempotency key is required per click.');
  const row=getProduct(input.sku);
  must(addOn(row)&&row.active&&row.priceCents!==null,'Add-on is not available.',409);
  must(!await first(env,"SELECT id FROM payment_ledger WHERE tenant_id=? AND sku=? AND status='paid' LIMIT 1",tenantId,input.sku),'This add-on is already owned.',409);
  const checkout=env.PAYMENT_CHECKOUT_SERVICE?.createCheckout??createCheckout;
  return checkout({tenantId,items:[{sku:input.sku,quantity:1}],returnPath:'/',idempotencyKey:input.idempotencyKey});
}

export async function addOnApi(req,env,url){
  const match=url.pathname.match(/^\/api\/payments\/tenants\/([A-Za-z0-9_-]+)\/add-ons(?:\/(checkout))?$/);
  must(match,'Not found.',404);
  const purchase=!!match[2];
  must(req.method===(purchase?'POST':'GET'),'Method not supported.',405);
  const canBuy=await authorizedTenant(req,env,match[1],purchase);
  return purchase?requestAddOnCheckout(env,match[1],await body(req)):addOnSummary(env,match[1],canBuy);
}
