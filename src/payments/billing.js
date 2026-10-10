import {getBillingAdapter,billingConnectionConfigured} from './billing-adapter.js';
import {identity,must,body} from '../core.js';
import {catalog,getProduct} from '../platform/catalog.ts';
import {WORKSPACE_FEATURES,paidFeatureEnabled} from './gating.js';
import {rentalDetails,quotePlanSwitch,confirmPlanSwitch,requestRentalCancellation} from './plan-management.js';

const first=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).first();
const rows=async(env,sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results;
function stripeUrl(value){
  if(typeof value!=='string')return null;
  try{const url=new URL(value);return url.protocol==='https:'&&(url.hostname==='stripe.com'||url.hostname.endsWith('.stripe.com'))?url.href:null}catch{return null}
}
async function authorizedTenant(req,env,tenantId,change=false){
  const user=await identity(req,env);
  must(await first(env,'SELECT id FROM tenants WHERE id=?',tenantId),'Website not found.',404);
  if(!user.admin)must(await first(env,'SELECT id FROM members WHERE tenant_id=? AND user_id=? AND active=1'+(change?" AND role='owner'":''),tenantId,user.id),'Website not found.',404);
}
export async function billingSummary(env,tenantId){
  const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
  const ledger=await rows(env,'SELECT id,sku,amount_cents,period_start,period_end,reference,status,created_at FROM payment_ledger WHERE tenant_id=? ORDER BY period_start DESC,created_at DESC,id DESC LIMIT 100',tenantId);
  const events=await rows(env,"SELECT type,payload FROM payment_events WHERE processed=1 AND type IN ('invoice.paid','checkout.session.completed') ORDER BY created_at DESC LIMIT 500");
  const links=new Map();
  for(const item of events){
    const object=JSON.parse(item.payload).data?.object??{};
    const reference=object.payment_intent??object.charge??object.id;
    if(!reference||links.has(reference))continue;
    links.set(reference,{invoiceUrl:stripeUrl(object.hosted_invoice_url),receiptUrl:stripeUrl(object.receipt_url)});
  }
  const receipts=ledger.map(item=>({sku:item.sku,amountCents:item.amount_cents,currency:'USD',paidAt:item.created_at,status:item.status,invoiceUrl:links.get(item.reference)?.invoiceUrl??null,receiptUrl:links.get(item.reference)?.receiptUrl??null}));
  const activeRow=state?.site_owned?ledger.find(item=>item.sku==='OWNER-HOSTING'&&item.status==='paid'):ledger.find(item=>item.sku.startsWith('PLAN-')&&item.status==='paid');
  const renewalAmountCents=state?.status==='canceled'?null:activeRow?getProduct(activeRow.sku)?.priceCents??null:null;
  const connected=billingConnectionConfigured(env);
  const rental=await rentalDetails(env,tenantId);
  const access={};
  for(const [feature,rule] of Object.entries(WORKSPACE_FEATURES))access[feature]={allowed:await paidFeatureEnabled(env,tenantId,feature),plan:rule.plan};
  return {tenantId,plan:state?.site_owned?'Owner':state?.plan??null,status:state?.status??'none',renewsAt:state?.renews_at??null,renewalAmountCents,minimumMonths:catalog.rentalPolicy.monthlyMinimumMonths,minimumEndsAt:state?.minimum_ends_at??null,buyoutAmountCents:getProduct('SITE-BUYOUT').priceCents,hosting:state?.site_owned?{sku:'OWNER-HOSTING',amountCents:5000,status:state.hosting_status??'pending_checkout'}:null,paymentMethod:connected?'Manage in Stripe Portal':'Payments not connected',portalState:(connected||env.PAYMENT_BILLING_ADAPTER?.portal)&&state?.customer_id?'ready':'not_connected',receipts,access,connectionState:connected?'test_configured':'not_connected',actionsAvailable:!!env.PAYMENT_BILLING_ADAPTER||connected,rental};
}
export async function billingApi(req,env,url){
  const match=url.pathname.match(/^\/api\/payments\/tenants\/([A-Za-z0-9_-]+)\/billing(?:\/(switch-quote|switch|cancel|portal))?$/);
  must(match,'Not found.',404);
  const action=match[2];
  must(action?req.method==='POST':req.method==='GET','Method not supported.',405);
  await authorizedTenant(req,env,match[1],!!action);
  if(!action)return billingSummary(env,match[1]);
  const input=await body(req);
  if(action==='portal'){
    const adapter=await getBillingAdapter(env),state=await first(env,'SELECT customer_id FROM payment_state WHERE tenant_id=?',match[1]);
    if(!adapter?.portal||!state?.customer_id)return {state:'not_connected',message:'Payments not connected'};
    const result=await adapter.portal({customerId:state.customer_id,returnUrl:url.origin+'/'});
    const target=stripeUrl(result?.url);must(target,'Payment portal unavailable.',503);return {state:'ready',url:target};
  }
  if(action==='switch-quote')return quotePlanSwitch(env,match[1],input.targetSku);
  if(action==='switch')return confirmPlanSwitch(env,match[1],input);
  return requestRentalCancellation(env,match[1],input.idempotencyKey);
}
