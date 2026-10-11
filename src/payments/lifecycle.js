const day=86400000;
export const paymentClock=env=>typeof env.PAYMENT_CLOCK==='function'?env.PAYMENT_CLOCK():Date.now();
const first=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).first();
const run=(env,sql,...a)=>env.DB.prepare(sql).bind(...a).run();
// Read-only, including the first access. The scheduled maintenance is the write path.
export async function paymentAvailability(env,tenantId,clock=paymentClock(env)){
 const s=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);
 if(!s)return {state:'live',editorLocked:false,pastDueDay:null};
 const elapsed=s.past_due_since?Math.max(0,Math.floor((clock-Date.parse(s.past_due_since))/day)):null;
 if(s.status==='past_due'&&elapsed!==null)return {state:elapsed>=30?'unavailable':elapsed>=8?'paused':'live',editorLocked:elapsed>=8,pastDueDay:elapsed};
 if(s.site_owned){const stopped=s.site_available===0||s.hosting_status==='stopped'||(s.hosting_stop_at&&clock>=Date.parse(s.hosting_stop_at));return {state:stopped?'unavailable':'live',editorLocked:!!stopped,pastDueDay:null};}
 const ended=(s.status==='canceled'&&s.site_available===0)||(s.status==='canceled'&&s.renews_at&&clock>=Date.parse(s.renews_at));
 return {state:ended?'unavailable':'live',editorLocked:!!ended,pastDueDay:null};
}
export async function markPastDue(env,tenantId,created){
 const s=await first(env,'SELECT * FROM payment_state WHERE tenant_id=?',tenantId);if(created<s.status_event_at)return;
 const since=s.past_due_since||new Date(created*1000).toISOString();
 await run(env,"UPDATE payment_state SET status='past_due',status_event_at=?,past_due_since=? WHERE tenant_id=?",created,since,tenantId);
 await maintainPaymentLifecycle(env,tenantId);
}
export async function maintainPaymentLifecycle(env,tenantId=null,clock=paymentClock(env)){
 const q=env.DB.prepare('SELECT * FROM payment_state'+(tenantId?' WHERE tenant_id=?':''));
 const states=(await (tenantId?q.bind(tenantId):q).all()).results;
 for(const s of states){
  if(['past_due','canceled'].includes(s.status)&&s.past_due_since){const elapsed=Math.floor((clock-Date.parse(s.past_due_since))/day);
   const tenant=await first(env,'SELECT settings FROM tenants WHERE id=?',s.tenant_id),owner=await first(env,"SELECT email FROM members WHERE tenant_id=? AND role='owner' AND active=1 ORDER BY created_at,id LIMIT 1",s.tenant_id),email=owner?.email||JSON.parse(tenant?.settings||'{}').email||null;
   for(const n of [0,7,8,29])if(elapsed>=n)await run(env,"INSERT OR IGNORE INTO payment_reminders(id,tenant_id,past_due_since,day,status,recipient,subject,message,created_at) VALUES(?,?,?,?,'queued_local',?,?,?,?)",s.tenant_id+':'+s.past_due_since+':'+n,s.tenant_id,s.past_due_since,n,email,'Update your website payment',n<8?'Your payment needs attention. Update payment in Billing. Your site stays live during the seven-day grace period.':n<29?'Your website is temporarily unavailable. Update payment in Billing to restore it before day 30.':s.site_owned?'Your hosting ends on day 30 unless payment recovers. Your ownership and static-file download remain available.':'Your rental ends on day 30 unless payment recovers. Your domain stays yours; site data is held for 90 days.',new Date(clock).toISOString());
   if(elapsed>=30){const cutoff=Date.parse(s.past_due_since)+30*day;await run(env,"UPDATE payment_state SET status='canceled',site_available=0,domain_retained=1,data_hold_until=? WHERE tenant_id=?",new Date(cutoff+90*day).toISOString(),s.tenant_id);await run(env,"UPDATE payment_entitlements SET status='revoked' WHERE tenant_id=? AND source LIKE 'PLAN-%'",s.tenant_id);if(s.site_owned)await run(env,"UPDATE payment_state SET hosting_status='stopped' WHERE tenant_id=?",s.tenant_id);}

   if(elapsed>=30){
    // A local cancellation is immediate. Retrying the provider cancellation never charges, refunds or deletes data.
    const key='delinquent:'+s.tenant_id+':'+s.past_due_since,done=await first(env,'SELECT id FROM payment_audit WHERE id=?',key+':done');
    if(!done){let confirmed=false;try{const {getBillingAdapter}=await import('./billing-adapter.js'),adapter=await getBillingAdapter(env),subscriptionId=s.site_owned?s.hosting_subscription_id:s.subscription_id;if(adapter?.cancelDelinquentSubscription&&subscriptionId)confirmed=(await adapter.cancelDelinquentSubscription({tenantId:s.tenant_id,subscriptionId,idempotencyKey:key})).accepted===true;}catch{/* Remains queued locally; the next scheduled pass reuses the same key. */}
     await run(env,'INSERT OR IGNORE INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES(?,?,?,?,?)',key+(confirmed?':done':':pending'),s.tenant_id,confirmed?'subscription.delinquency_canceled':'subscription.delinquency_cancel_pending',confirmed?'Cancelled without proration or invoice; no refund.':'Not connected or adapter unavailable; cancellation queued locally.',new Date(clock).toISOString());
    }
   }
  }
  if(s.site_owned&&s.hosting_stop_at&&clock>=Date.parse(s.hosting_stop_at))await run(env,"UPDATE payment_state SET hosting_status='stopped',site_available=0 WHERE tenant_id=?",s.tenant_id);
  if(!s.site_owned&&!s.past_due_since&&s.status==='canceled'&&s.renews_at&&clock>=Date.parse(s.renews_at)){await run(env,'UPDATE payment_state SET site_available=0,data_hold_until=? WHERE tenant_id=?',new Date(Date.parse(s.renews_at)+90*day).toISOString(),s.tenant_id);await run(env,"UPDATE payment_entitlements SET status='revoked' WHERE tenant_id=? AND source LIKE 'PLAN-%'",s.tenant_id);}
 }
}
export function pausedSiteResponse(){return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Temporarily unavailable</title><style>body{margin:0;background:#f4f7fb;color:#172d47;font:18px/1.6 system-ui}main{max-width:38rem;margin:12vh auto;padding:32px}h1{font-size:clamp(28px,5vw,42px);line-height:1.2}p{max-width:32rem}</style></head><body><main><h1>This website is temporarily unavailable</h1><p>Please check back later.</p></main></body></html>',{status:503,headers:{'content-type':'text/html;charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex','retry-after':'86400'}});}
