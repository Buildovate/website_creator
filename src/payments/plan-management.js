import {catalog,getProduct} from '../platform/catalog.ts';
import {must,uid} from '../core.js';

const first=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).first();
const run=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).run();
const pricedWebsiteSkus=Object.freeze(['PLAN-WEBSITE-MONTH','PLAN-WEBSITE-YEAR']);
const nowIso=clock=>new Date(clock).toISOString();

export async function rentalDetails(env,tenantId,clock=Date.now()){
  const state=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
  if(!state||state.site_owned)return {kind:state?.site_owned?'owned':'none',currentSku:null,periodEnd:null,cancel:null,switchTargets:[]};
  const ledger=await first(env,"SELECT sku,period_end FROM payment_ledger WHERE tenant_id=? AND status='paid' AND sku IN ('PLAN-WEBSITE-MONTH','PLAN-WEBSITE-YEAR') ORDER BY period_start DESC,created_at DESC,id DESC LIMIT 1",tenantId);
  if(!ledger||!state.plan)return {kind:'none',currentSku:null,periodEnd:null,cancel:null,switchTargets:[]};
  const annual=ledger.sku==='PLAN-WEBSITE-YEAR';
  const periodEnd=ledger.period_end;
  const minimumEndsAt=annual?null:state.minimum_ends_at;
  const beforeMinimum=!!minimumEndsAt&&clock<Date.parse(minimumEndsAt);
  const expired=clock>=Date.parse(periodEnd);
  const scheduled=await first(env,"SELECT id FROM payment_audit WHERE tenant_id=? AND action='subscription.cancel_requested' AND detail=? LIMIT 1",tenantId,state.subscription_id??'');
  const cancel={allowed:!beforeMinimum&&!expired&&!scheduled&&state.status!=='canceled',minimumEndsAt,periodEnd,scheduled:!!scheduled||state.status==='canceled',reason:beforeMinimum?'Three-month rental minimum':expired?'Paid period ended':null,noRefund:annual,siteComesDown:true,siteExport:false,domainRetained:true,dataHoldDays:catalog.rentalPolicy.cancel.dataHoldDays};
  return {kind:annual?'annual':'monthly',currentSku:ledger.sku,periodEnd,cancel,switchTargets:pricedWebsiteSkus.filter(sku=>sku!==ledger.sku).map(sku=>({sku,priceCents:getProduct(sku).priceCents,cadence:getProduct(sku).cadence}))};
}

function adapterFor(env){return env.PAYMENT_BILLING_ADAPTER??null;}
function validateSwitch(details,targetSku){
  must(details.kind==='monthly'||details.kind==='annual','Only a renter can change plans.',409);
  must(details.cancel?.scheduled!==true,'Cancellation is already scheduled.',409);
  must(pricedWebsiteSkus.includes(targetSku),'Price coming soon or plan unavailable.',400);
  must(targetSku!==details.currentSku,'That is already your current plan.',409);
  const target=getProduct(targetSku);
  must(target?.active&&Number.isSafeInteger(target.priceCents),'Price coming soon or plan unavailable.',400);
  return target;
}
async function subscriptionFor(env,tenantId){
  const state=await first(env,'SELECT subscription_id FROM payment_state WHERE tenant_id=?',tenantId);
  must(state?.subscription_id,'Subscription is not connected.',409);
  return state.subscription_id;
}
function validateIdempotencyKey(key){must(typeof key==='string'&&/^[A-Za-z0-9_-]{8,128}$/.test(key),'One idempotency key is required per click.',400);}

export async function quotePlanSwitch(env,tenantId,targetSku,clock=Date.now()){
  const details=await rentalDetails(env,tenantId,clock),target=validateSwitch(details,targetSku);
  const adapter=adapterFor(env);
  if(!adapter)return {state:'not_connected',message:'Payments not connected'};
  const subscriptionId=await subscriptionFor(env,tenantId);
  const quote=await adapter.previewSwitch({tenantId,subscriptionId,currentSku:details.currentSku,targetSku:target.sku,targetPriceCents:target.priceCents});
  must(quote?.id&&Number.isSafeInteger(quote.amountDueCents)&&quote.amountDueCents>=0,'Payment quote unavailable.',503);
  return {state:'quoted',quoteId:quote.id,targetSku:target.sku,targetPriceCents:target.priceCents,amountDueCents:quote.amountDueCents,effectiveAt:quote.effectiveAt??nowIso(clock)};
}

export async function confirmPlanSwitch(env,tenantId,{targetSku,quoteId,idempotencyKey},clock=Date.now()){
  validateIdempotencyKey(idempotencyKey);
  must(typeof quoteId==='string'&&quoteId.length<=120,'Choose a current payment quote.',400);
  const details=await rentalDetails(env,tenantId,clock),target=validateSwitch(details,targetSku);
  const adapter=adapterFor(env);
  if(!adapter)return {state:'not_connected',message:'Payments not connected'};
  const subscriptionId=await subscriptionFor(env,tenantId);
  const result=await adapter.confirmSwitch({tenantId,subscriptionId,currentSku:details.currentSku,targetSku:target.sku,targetPriceCents:target.priceCents,quoteId,idempotencyKey});
  must(result?.accepted===true,'Plan switch was not accepted.',503);
  await run(env,'INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',uid(),tenantId,'plan.change_requested',`${details.currentSku}->${target.sku}; quote ${quoteId}`,nowIso(clock));
  return {state:'awaiting_settlement',targetSku:target.sku,message:'Plan change requested. Your plan changes after confirmed payment.'};
}

export async function requestRentalCancellation(env,tenantId,idempotencyKey,clock=Date.now()){
  validateIdempotencyKey(idempotencyKey);
  const details=await rentalDetails(env,tenantId,clock);
  must(details.kind==='monthly'||details.kind==='annual','Owned sites do not have a rental plan to cancel.',409);
  must(!details.cancel.scheduled,'Cancellation is already scheduled.',409);
  must(details.cancel.allowed,details.cancel.minimumEndsAt?`Monthly rental cannot be canceled before ${details.cancel.minimumEndsAt}.`:'Rental cannot be canceled now.',409);
  const adapter=adapterFor(env);
  if(!adapter)return {state:'not_connected',message:'Payments not connected'};
  const subscriptionId=await subscriptionFor(env,tenantId);
  const result=await adapter.scheduleCancellation({tenantId,subscriptionId,atPeriodEnd:true,periodEnd:details.periodEnd,idempotencyKey});
  must(result?.accepted===true,'Cancellation was not scheduled.',503);
  await run(env,'INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',uid(),tenantId,'subscription.cancel_requested',subscriptionId,nowIso(clock));
  return {state:'scheduled',periodEnd:details.periodEnd,noRefund:details.cancel.noRefund,message:'Cancellation scheduled for the paid period end. The site stays up until then.'};
}
