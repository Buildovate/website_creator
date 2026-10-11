import {assertTestEnvironment} from './checkout.ts';
import {getProduct} from '../platform/catalog.ts';
const instances=new WeakMap();
export function billingConnectionConfigured(env){assertTestEnvironment(env);return !!(env.STRIPE_SECRET_KEY&&env.STRIPE_PUBLISHABLE_KEY&&env.STRIPE_WEBHOOK_SECRET);}
export function createBillingAdapter({stripe,env}){
 assertTestEnvironment(env);const quotes=new Map();
 async function subscription(input){const s=await stripe.subscriptions.retrieve(input.subscriptionId);if(s.metadata?.tenantId!==input.tenantId)throw Error('Subscription tenant mismatch.');if(s.items?.data?.length!==1)throw Error('Subscription has unsupported items.');return s;}
 async function price(sku){const row=getProduct(sku),found=await stripe.prices.list({lookup_keys:[sku+'@'+row.version],limit:1}),p=found.data[0];if(!row.active||p?.active!==true||p.lookup_key!==sku+'@'+row.version||p.unit_amount!==row.priceCents||p.currency!=='usd'||p.metadata?.sku!==sku||p.metadata?.version!==String(row.version)||p.recurring?.interval!==row.cadence)throw Error('Stripe TEST price is not synced to catalog.');return p;}
 return {
  async portal({customerId,returnUrl}){const r=await stripe.billingPortal.sessions.create({customer:customerId,return_url:returnUrl});return {url:r.url};},
  async previewSwitch(input){const s=await subscription(input),p=await price(input.targetSku),time=Math.floor(Date.now()/1000),item={id:s.items.data[0].id,price:p.id};const invoice=await stripe.invoices.createPreview({subscription:s.id,subscription_details:{items:[item],proration_date:time,proration_behavior:'always_invoice'}});const net=invoice.subtotal??invoice.amount_due,tax=(invoice.total_taxes||[]).filter(x=>x.tax_behavior==='exclusive').reduce((n,x)=>n+x.amount,0);if(!Number.isSafeInteger(invoice.amount_due)||invoice.amount_due<0||!Number.isSafeInteger(net)||net<0||(invoice.total!==undefined&&invoice.total!==invoice.amount_due)||net+tax!==invoice.amount_due)throw Error('Payment quote unavailable: credits, prior balances or unsupported adjustments cannot be applied.');const id=crypto.randomUUID();quotes.set(id,{...input,item,time,expires:Date.now()+300000});return {id,amountDueCents:invoice.amount_due,lineNetCents:net,taxCents:tax,effectiveAt:new Date(time*1000).toISOString()};},
  async confirmSwitch(input){const q=quotes.get(input.quoteId);if(!q||q.expires<Date.now()||q.tenantId!==input.tenantId||q.subscriptionId!==input.subscriptionId||q.targetSku!==input.targetSku)throw Error('Payment quote expired. Review the switch again.');await subscription(input);await stripe.subscriptions.update(input.subscriptionId,{items:[q.item],proration_date:q.time,proration_behavior:'always_invoice',payment_behavior:'pending_if_incomplete',metadata:{tenantId:input.tenantId,skus:input.targetSku,catalogVersion:String(getProduct(input.targetSku).version),paymentChangeId:input.paymentChangeId}},{idempotencyKey:input.idempotencyKey});return {accepted:true};},
  async scheduleDowngrade(input){
   const s=await subscription(input),p=await price(input.targetSku);
   const schedule=s.schedule?await stripe.subscriptionSchedules.retrieve(typeof s.schedule==='string'?s.schedule:s.schedule.id):await stripe.subscriptionSchedules.create({from_subscription:s.id},{idempotencyKey:input.idempotencyKey+':create'});
   if(!schedule.current_phase)throw Error('Subscription schedule has no current phase.');
   await stripe.subscriptionSchedules.update(schedule.id,{end_behavior:'release',proration_behavior:'none',phases:[{start_date:schedule.current_phase.start_date,end_date:Math.floor(Date.parse(input.periodEnd)/1000),items:[{price:s.items.data[0].price.id,quantity:1}],proration_behavior:'none'},{items:[{price:p.id,quantity:1}],proration_behavior:'none',metadata:{tenantId:input.tenantId,skus:input.targetSku,catalogVersion:String(getProduct(input.targetSku).version)}}]},{idempotencyKey:input.idempotencyKey});return {accepted:true};
  },
  async startOwnerHosting(input){
   const p=await price('OWNER-HOSTING');let method;
   if(input.subscriptionId){const s=await subscription(input);method=typeof s.default_payment_method==='string'?s.default_payment_method:s.default_payment_method?.id;await stripe.subscriptions.cancel(s.id,{prorate:false,invoice_now:false},{idempotencyKey:input.idempotencyKey+':end-rental'});}
   const start=Math.floor(Date.parse(input.startsAt)/1000),future=start>Math.floor(Date.now()/1000);
   const s=await stripe.subscriptions.create({customer:input.customerId,items:[{price:p.id}],payment_settings:{payment_method_types:['card']},...(method?{default_payment_method:method}:{}),...(future?{trial_end:start}:{}),proration_behavior:'none',metadata:{tenantId:input.tenantId,skus:'OWNER-HOSTING',catalogVersion:String(getProduct('OWNER-HOSTING').version)}},{idempotencyKey:input.idempotencyKey+':hosting'});
   return {accepted:true,subscriptionId:s.id};
  },
  async cancelDelinquentSubscription(input){await subscription(input);await stripe.subscriptions.cancel(input.subscriptionId,{prorate:false,invoice_now:false},{idempotencyKey:input.idempotencyKey});return {accepted:true};},
  async stopHosting(input){await subscription(input);await stripe.subscriptions.update(input.subscriptionId,{cancel_at_period_end:true},{idempotencyKey:input.idempotencyKey});return {accepted:true};},
  async scheduleCancellation(input){await subscription(input);await stripe.subscriptions.update(input.subscriptionId,{cancel_at_period_end:true},{idempotencyKey:input.idempotencyKey});return {accepted:true};}
 };
}
export async function getBillingAdapter(env){
 if(env.PAYMENT_BILLING_ADAPTER)return env.PAYMENT_BILLING_ADAPTER;
 if(!billingConnectionConfigured(env))return null;
 if(!instances.has(env)){const {default:Stripe}=await import('stripe');instances.set(env,createBillingAdapter({stripe:new Stripe(env.STRIPE_SECRET_KEY),env}));}
 return instances.get(env);
}
