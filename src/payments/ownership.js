import {getBillingAdapter} from './billing-adapter.js';
import {createCheckout} from './checkout.ts';import {must} from '../core.js';import {paymentClock} from './lifecycle.js';
const first=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).first();
const run=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).run();
export async function requestSitePurchase(env,tenantId,idempotencyKey){
 must(! (await first(env,'SELECT site_owned FROM payment_state WHERE tenant_id=?',tenantId))?.site_owned,'You already own this site.',409);
 const checkout=env.PAYMENT_CHECKOUT_SERVICE?.createCheckout??createCheckout;
 return checkout({tenantId,items:[{sku:'SITE-BUYOUT',quantity:1}],returnPath:'/',idempotencyKey},env);
}
export async function finishOwnership(env,tenantId,ledgerId){
 const s=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);if(s.hosting_subscription_id)return;
 const adapter=await getBillingAdapter(env);if(!adapter?.startOwnerHosting)return;
 const clock=paymentClock(env),starts=s.renews_at&&Date.parse(s.renews_at)>clock?s.renews_at:null;
 // Never guess a next cycle or charge hosting immediately after a one-time purchase.
 if(!starts){
  const key='owner:'+ledgerId+':end-rental',done=await first(env,'SELECT id FROM payment_audit WHERE id=?',key);
  if(s.subscription_id&&!done&&adapter.cancelDelinquentSubscription){const ended=await adapter.cancelDelinquentSubscription({tenantId,subscriptionId:s.subscription_id,idempotencyKey:key});must(ended?.accepted,'Rental cancellation is pending.',503);await run(env,'INSERT OR IGNORE INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',key,tenantId,'ownership.rental_ended','No proration, invoice, refund or credit.',new Date(clock).toISOString());}
  await run(env,"UPDATE payment_state SET hosting_status='pending_schedule' WHERE tenant_id=?",tenantId);
  return;
 }
 const result=await adapter.startOwnerHosting({tenantId,subscriptionId:s.subscription_id,customerId:s.customer_id,amountCents:5000,startsAt:starts,idempotencyKey:'owner:'+ledgerId});
 must(result?.accepted&&result.subscriptionId,'Owner hosting could not be scheduled.',503);
 await run(env,"UPDATE payment_state SET hosting_status='scheduled',hosting_subscription_id=?,hosting_starts_at=?,hosting_stop_at=NULL WHERE tenant_id=?",result.subscriptionId,starts,tenantId);
}
export async function stopOwnerHosting(env,tenantId,idempotencyKey,clock=paymentClock(env)){
 must(typeof idempotencyKey==='string'&&/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey),'One idempotency key is required per click.',400);
 const s=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);must(s?.site_owned===1,'Only a site owner can stop hosting.',403);
 if(s.hosting_stop_at)return {state:'scheduled',periodEnd:s.hosting_stop_at,message:'Hosting ends at the paid period end. Your static-file download remains available.'};
 const adapter=await getBillingAdapter(env);if(!adapter?.stopHosting||!s.hosting_subscription_id)return {state:'not_connected',message:'Owner hosting is not connected. Your static-file download is available.'};
 const end=s.renews_at&&Date.parse(s.renews_at)>clock?s.renews_at:new Date(clock).toISOString();
 const r=await adapter.stopHosting({tenantId,subscriptionId:s.hosting_subscription_id,periodEnd:end,idempotencyKey});must(r?.accepted,'Hosting cancellation could not be scheduled.',503);
 await run(env,"UPDATE payment_state SET hosting_status='ending',hosting_stop_at=? WHERE tenant_id=?",end,tenantId);
 return {state:'scheduled',periodEnd:end,message:'Hosting ends at the paid period end. No refund or credit. Download your static files from Website settings.'};
}
