import {one,all,run,db,uid,now,must,body,access,identity,log} from '../core.js';
import {cleanDomain,domainGuide,detectProvider,PROVIDERS} from './guide.js';
import {domainStatus,needsDomainHelp} from './state.js';
import {domainAdapters,recheckInterval} from './adapters.js';
import {clearDomainLookup} from './routing.js';
import {paymentClock} from '../payments/lifecycle.js';
import {renderDomainInstructions} from './view.js';

const recordId=id=>'domain-plan-'+id;
const rowFor=(env,id)=>one(env,"SELECT * FROM workspace_records WHERE id=? AND scope=? AND kind='domain_plan'",recordId(id),id);
function view(row,env) {
  if(!row)return {plan:null,version:0};
  const plan=JSON.parse(row.data);delete plan.operationLease;
  return {plan,version:row.version,guide:domainGuide(plan,env),status:domainStatus(plan,plan.proof),recheckMs:recheckInterval(env)};
}
async function replace(env,row,data) {
  const r=await run(env,'UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND version=?',JSON.stringify(data),now(),row.id,row.version);
  must(r.meta.changes,'Domain setup changed. Reload to review the latest records.',409);
  clearDomainLookup(env);
  return rowFor(env,data.tenantId);
}
function available(row) {
  if(row) { const lease=JSON.parse(row.data).operationLease;must(!lease||Date.parse(lease.until)<=Date.now(),'A domain operation is in progress. Try again shortly.',409); }
}
// The versioned, expiring database lease also coordinates separate EB processes.
// Every external result is checkpointed before the next operation starts.
async function operate(env,row,work,time) {
  available(row);let plan=JSON.parse(row.data),current=row;
  const owner=uid();plan.operationLease={owner,until:new Date(Date.now()+120000).toISOString()};
  current=await replace(env,current,plan);
  const persist=async()=>{if(plan.operationLease)plan.operationLease.until=new Date(Date.now()+120000).toISOString();current=await replace(env,current,plan);};
  const save=async provisioning=>{plan.provisioning=provisioning;await persist();};
  try { await work(plan,save,persist);delete plan.lastError; }
  catch(error) {
    if(error.status===409)throw error;
    plan.lastError='Domain operation unavailable. Your saved records are unchanged; the next check will retry.';
    plan.proof={connected:true,checkedAt:new Date(time).toISOString(),error:plan.lastError};
    plan.nextCheckAt=new Date(time+recheckInterval(env)).toISOString();
  } finally {
    const latest=await rowFor(env,plan.tenantId);
    if(JSON.parse(latest.data).operationLease?.owner===owner) {delete plan.operationLease;await replace(env,current,plan);}
  }
  return view(await rowFor(env,plan.tenantId),env);
}
export async function checkDomainPlan(env,row,time=paymentClock(env)) {
  return operate(env,row,async(plan,save,persist)=>{
    const {checks,provisioner}=domainAdapters(env),guide=domainGuide(plan,env),stamp=new Date(time).toISOString();
    must(!plan.disconnectedAt&&!['disconnecting','deleted'].includes(plan.lifecycle),'Save the domain again before reconnecting.');
    if(provisioner?.reconcile&&guide.configured) await provisioner.reconcile({plan,guide,save});
    else if(!plan.provisioning)plan.provisioning={status:'not_connected',active:false,validationRecords:[]};
    let proof={connected:false,checkedAt:stamp};
    if(plan.addedAt&&checks?.check) {
      const result=await checks.check({hostname:plan.hostname,tenantId:plan.tenantId,token:plan.token,guide,plan});
      proof={connected:true,checkedAt:stamp,www:result.www===true,bare:result.bare===true,ssl:result.ssl===true,site:result.site||{},...(result.cloudfront!==undefined?{cloudfront:result.cloudfront===true,certificateStatus:result.certificateStatus,tenantStatus:result.tenantStatus}:{})};
      plan.ownership=result.ownership==='verified'?'verified':'pending';
      await run(env,'UPDATE domains SET ownership=?,checked_at=? WHERE id=? AND tenant_id=?',plan.ownership,stamp,plan.domainId,plan.tenantId);
    }
    plan.proof=proof;plan.nextCheckAt=new Date(time+recheckInterval(env)).toISOString();await persist();
    if(needsDomainHelp(plan,domainStatus(plan,proof,time),time)) {
      await run(env,"INSERT OR IGNORE INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'domain_help',?,?,?)",'domain-help-'+plan.domainId,plan.tenantId,JSON.stringify({hostname:plan.hostname,status:'Pending internal help',reason:'Not live 48 hours after records added',createdAt:stamp,delivery:'Not connected'}),stamp,stamp);
    }
  },time);
}
async function cleanupDomain(env,row,time) {
  return operate(env,row,async(plan,save)=>{
    plan.lifecycle='disconnecting';plan.disconnectedAt=plan.disconnectedAt||new Date(time).toISOString();plan.proof={connected:false};
    const {provisioner}=domainAdapters(env);
    const state={...plan.provisioning,active:false,status:'deleting'};await save(state);
    await run(env,"UPDATE domains SET ownership='pending' WHERE id=? AND tenant_id=?",plan.domainId,plan.tenantId);
    if(provisioner?.disconnect) await provisioner.disconnect({plan,save});
    else if(!state.tenantId&&!state.certificateArn)await save({...state,status:'deleted'});
    if(plan.provisioning?.status==='deleted')plan.lifecycle='deleted';
    plan.nextCheckAt=new Date(time+recheckInterval(env)).toISOString();
  },time);
}
export async function maintainDomainPlans(env,time=paymentClock(env)) {
  const rows=await all(env,"SELECT * FROM workspace_records WHERE kind='domain_plan'");
  for(const row of rows) {
    try {
      const p=JSON.parse(row.data),billing=await one(env,'SELECT status,data_hold_until FROM payment_state WHERE tenant_id=?',p.tenantId);
      const expiredHold=billing?.status==='canceled'&&billing.data_hold_until&&Date.parse(billing.data_hold_until)<=time;
      if(p.lifecycle==='deleted')continue;
      if(expiredHold||p.lifecycle==='disconnecting') {if(!p.nextCheckAt||Date.parse(p.nextCheckAt)<=time||expiredHold&&!p.disconnectedAt)await cleanupDomain(env,row,time);}
      else if(!p.disconnectedAt&&(p.addedAt||p.provisioning?.status==='pending'||p.provisioning?.status==='deploying')&&(!p.nextCheckAt||Date.parse(p.nextCheckAt)<=time)) await checkDomainPlan(env,row,time);
    } catch(error) { if(error.status!==409)console.error('Domain maintenance unavailable; retry pending.',error.name); }
  }
}
export async function domainPlanApi(req,env,tenantId,op='') {
  const recovery=req.method==='GET'||op==='disconnect';
  await access(req,env,tenantId,'owner',{readOnly:recovery,paymentRecovery:recovery});const row=await rowFor(env,tenantId);
  if(req.method==='GET'&&!op)return view(row,env);
  must(req.method==='POST','Method not supported.',405);const v=await body(req);
  must(Number(v.version)===(row?.version||0),'Domain setup changed. Reload before continuing.',409);available(row);
  if(op==='disconnect') {must(row,'No domain connected.');const result=await cleanupDomain(env,row,paymentClock(env));await log(env,await identity(req,env),tenantId,'domain.disconnected',result.plan.hostname);return result;}
  if(op==='check') {must(row,'Save your domain first.');return checkDomainPlan(env,row);}
  if(op==='added') {
    must(row,'Save your domain first.');const p=JSON.parse(row.data);must(!p.disconnectedAt,'Save the domain again before reconnecting.');
    must(domainGuide(p,env).configured,'Hosting target is not connected. Ask Buildovate before changing website DNS.');must(v.approved===true,'Approve the website switch before applying routing records.');
    p.switchApprovedAt=p.switchApprovedAt||now();p.addedAt=p.addedAt||now();return checkDomainPlan(env,await replace(env,row,p));
  }
  must(!op,'Not found.',404);let hostname;try{hostname=cleanDomain(v.hostname);}catch(error){must(false,error.message);}
  must(PROVIDERS.includes(v.provider),'Choose where your domain is managed.');
  const previous=row?JSON.parse(row.data):null;
  must(!previous||previous.hostname===hostname||!previous.provisioning?.certificateArn||previous.lifecycle==='deleted','Disconnect the current domain and wait for cleanup before changing it.',409);
  must(!previous?.disconnectedAt||previous.lifecycle==='deleted','Domain cleanup is still pending. Try again after it finishes.',409);
  let detectedProvider='Other',nameservers=[],detection='Not connected';
  const {checks}=domainAdapters(env);if(checks?.nameservers){try{nameservers=await checks.nameservers(hostname);detectedProvider=detectProvider(nameservers);detection='Detected from nameservers';}catch{detection='Detection unavailable. Choose your provider below.';}}
  const matches=await all(env,'SELECT * FROM domains WHERE hostname IN (?,?)',hostname,'www.'+hostname);
  must(matches.every(domain=>domain.tenant_id===tenantId),'This domain is already assigned to another website.',409);
  const existing=matches.find(domain=>domain.hostname===hostname)||matches[0];
  const domain=existing||{id:uid(),token:'buildovate-'+uid(),ownership:'pending'};
  const continuing=previous?.hostname===hostname&&!previous.disconnectedAt;
  const plan={...(continuing?previous:{}),tenantId,domainId:domain.id,hostname,operationId:continuing?previous.operationId:uid(),provider:v.provider,detectedProvider,nameservers,detection,token:domain.token,ownership:continuing?previous.ownership:domain.ownership};
  if(continuing&&previous.provider!==v.provider)plan.proof={connected:false};
  const stamp=now(),statements=[];
  if(!existing)statements.push(db(env).prepare('INSERT INTO domains(id,tenant_id,hostname,token,created_at) VALUES(?,?,?,?,?)').bind(domain.id,tenantId,hostname,domain.token,stamp));
  else if(existing.hostname!==hostname)statements.push(db(env).prepare('UPDATE domains SET hostname=? WHERE id=? AND tenant_id=?').bind(hostname,domain.id,tenantId));
  if(row)statements.push(db(env).prepare('UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND version=?').bind(JSON.stringify(plan),stamp,row.id,row.version));
  else statements.push(db(env).prepare("INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'domain_plan',?,?,?)").bind(recordId(tenantId),tenantId,JSON.stringify(plan),stamp,stamp));
  const results=await db(env).batch(statements);must(results.at(-1).meta.changes,'Domain setup changed. Reload before continuing.',409);clearDomainLookup(env);
  await log(env,await identity(req,env),tenantId,'domain.plan.saved',hostname);
  return checkDomainPlan(env,await rowFor(env,tenantId));
}
export async function domainGuidePage(req,env,tenantId) {
  await access(req,env,tenantId,'owner',{readOnly:true,paymentRecovery:true});const data=view(await rowFor(env,tenantId),env);
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Your domain instructions</title><link rel="stylesheet" href="/platform.css"></head><body class="bv-platform"><main class="bv-domain"><h1>Your web address</h1><p>Your current site stays up until you approve the switch.</p>'+renderDomainInstructions(data,false)+'<p><a class="bv-button" href="/">Return to your dashboard</a></p><p>With JavaScript off, these saved instructions remain readable. Enable JavaScript to save a domain or run a check in the dashboard.</p></main></body></html>';
}
