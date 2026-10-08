import {identity,must} from '../core.js';
import {catalog,getProduct} from '../platform/catalog.ts';
import {WORKSPACE_FEATURES,paidFeatureEnabled} from './gating.js';

const first=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).first();
const rows=async(env,sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results;
function stripeUrl(value){
  if(typeof value!=='string')return null;
  try{const url=new URL(value);return url.protocol==='https:'&&(url.hostname==='stripe.com'||url.hostname.endsWith('.stripe.com'))?url.href:null}catch{return null}
}
async function authorizedTenant(req,env,tenantId){
  const user=await identity(req,env);
  must(await first(env,'SELECT id FROM tenants WHERE id=?',tenantId),'Website not found.',404);
  if(!user.admin)must(await first(env,'SELECT id FROM members WHERE tenant_id=? AND user_id=? AND active=1',tenantId,user.id),'Website not found.',404);
}
export async function billingSummary(env,tenantId){
  const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
  const ledger=await rows(env,'SELECT id,sku,amount_cents,period_start,period_end,reference,status,created_at FROM payment_ledger WHERE tenant_id=? ORDER BY created_at DESC,id DESC LIMIT 100',tenantId);
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
  const connected=!!(env.STRIPE_SECRET_KEY&&env.STRIPE_PUBLISHABLE_KEY&&env.STRIPE_WEBHOOK_SECRET);
  const access={};
  for(const [feature,rule] of Object.entries(WORKSPACE_FEATURES))access[feature]={allowed:await paidFeatureEnabled(env,tenantId,feature),plan:rule.plan};
  return {plan:state?.site_owned?'Owner':state?.plan??null,status:state?.status??'none',renewsAt:state?.renews_at??null,renewalAmountCents,minimumMonths:catalog.rentalPolicy.monthlyMinimumMonths,minimumEndsAt:state?.minimum_ends_at??null,buyoutAmountCents:getProduct('SITE-BUYOUT').priceCents,hosting:state?.site_owned?{sku:'OWNER-HOSTING',amountCents:5000,status:state.hosting_status??'pending_checkout'}:null,paymentMethod:connected?'Manage in Stripe Portal':'Payments not connected',portalState:connected?'pending_configuration':'not_connected',receipts,access,connectionState:connected?'test_configured':'not_connected'};
}
export async function billingApi(req,env,url){
  const match=url.pathname.match(/^\/api\/payments\/tenants\/([A-Za-z0-9_-]+)\/billing$/);
  must(match,'Not found.',404);must(req.method==='GET','Method not supported.',405);
  await authorizedTenant(req,env,match[1]);
  return billingSummary(env,match[1]);
}
