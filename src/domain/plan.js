import {one,all,run,db,uid,now,must,body,access,identity,log,e} from '../core.js';
import {cleanDomain,domainGuide,detectProvider,PROVIDERS} from './guide.js';
import {domainStatus,needsDomainHelp,RECHECK_MS} from './state.js';
import {renderDomainInstructions} from './view.js';
const recordId=id=>'domain-plan-'+id;
async function rowFor(env,id){return one(env,"SELECT * FROM workspace_records WHERE id=? AND scope=? AND kind='domain_plan'",recordId(id),id);}
function view(row,env){if(!row)return {plan:null,version:0};const plan=JSON.parse(row.data);return {plan,version:row.version,guide:domainGuide(plan,env),status:domainStatus(plan,plan.proof)};}
async function replace(env,row,data){const r=await run(env,'UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND version=?',JSON.stringify(data),now(),row.id,row.version);must(r.meta.changes,'Domain setup changed. Reload to review the latest records.',409);}
export async function checkDomainPlan(env,row,time=Date.now()){
 const plan=JSON.parse(row.data),stamp=new Date(time).toISOString();let proof={connected:false,checkedAt:stamp};
 if(env.DOMAIN_CHECKS?.check){try{
 const result=await env.DOMAIN_CHECKS.check({hostname:plan.hostname,tenantId:plan.tenantId,token:plan.token,guide:domainGuide(plan,env)});
 proof={connected:true,checkedAt:stamp,www:result.www===true,bare:result.bare===true,ssl:result.ssl===true,site:result.site||{}};
 if(result.ownership==='verified')plan.ownership='verified';else plan.ownership='pending';
 await run(env,'UPDATE domains SET ownership=?,checked_at=? WHERE id=? AND tenant_id=?',plan.ownership,stamp,plan.domainId,plan.tenantId);
 }catch{proof={connected:true,checkedAt:stamp,error:'Check unavailable. Your saved records are unchanged; try again.'};}}
 plan.proof=proof;plan.nextCheckAt=new Date(time+RECHECK_MS).toISOString();await replace(env,row,plan);
 const status=domainStatus(plan,proof,time);
 if(needsDomainHelp(plan,status,time)){
 // Internal pending request only. No notification, booking or delivery is invented.
 const id='domain-help-'+plan.domainId;
 await run(env,"INSERT OR IGNORE INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'domain_help',?,?,?)",id,plan.tenantId,JSON.stringify({hostname:plan.hostname,status:'Pending internal help',reason:'Not live 48 hours after records added',createdAt:stamp,delivery:'Not connected'}),stamp,stamp);
 }
 return view(await rowFor(env,plan.tenantId),env);
}
export async function maintainDomainPlans(env,time=Date.now()){
 const rows=await all(env,"SELECT * FROM workspace_records WHERE kind='domain_plan'");
 for(const row of rows){const p=JSON.parse(row.data);if(p.addedAt&&(!p.nextCheckAt||Date.parse(p.nextCheckAt)<=time))await checkDomainPlan(env,row,time);}
}
export async function domainPlanApi(req,env,tenantId,op=''){
 const auth=await access(req,env,tenantId,'owner');const row=await rowFor(env,tenantId);
 if(req.method==='GET'&&!op)return view(row,env);
 must(req.method==='POST','Method not supported.',405);const v=await body(req);must(Number(v.version)===(row?.version||0),'Domain setup changed. Reload before continuing.',409);
 if(op==='check'){must(row,'Save your domain first.');return checkDomainPlan(env,row);}
 if(op==='added'){must(row,'Save your domain first.');const p=JSON.parse(row.data);must(domainGuide(p,env).configured,'Hosting target is not connected. Ask Buildovate before changing website DNS.');must(v.approved===true,'Approve the website switch before applying routing records.');p.switchApprovedAt=p.switchApprovedAt||now();p.addedAt=p.addedAt||now();await replace(env,row,p);return checkDomainPlan(env,await rowFor(env,tenantId));}
 must(!op,'Not found.',404);let hostname;try{hostname=cleanDomain(v.hostname);}catch(error){must(false,error.message);}
 must(PROVIDERS.includes(v.provider),'Choose where your domain is managed.');
 let detectedProvider='Other',nameservers=[],detection='Not connected';
 if(env.DOMAIN_CHECKS?.nameservers){try{nameservers=await env.DOMAIN_CHECKS.nameservers(hostname);detectedProvider=detectProvider(nameservers);detection='Detected from nameservers';}catch{detection='Detection unavailable. Choose your provider below.';}}
 const existing=await one(env,'SELECT * FROM domains WHERE hostname=?',hostname);must(!existing||existing.tenant_id===tenantId,'This domain is already assigned to another website.',409);
 const domain=existing||{id:uid(),token:'buildovate-'+uid(),ownership:'pending'};
 const previous=row?JSON.parse(row.data):null,unchanged=previous?.hostname===hostname&&previous?.provider===v.provider;
 const plan={tenantId,domainId:domain.id,hostname,provider:v.provider,detectedProvider,nameservers,detection,token:domain.token,ownership:domain.ownership,...(unchanged?{addedAt:previous.addedAt,switchApprovedAt:previous.switchApprovedAt,nextCheckAt:previous.nextCheckAt,proof:previous.proof}:{})};
 const stamp=now(),statements=[];
 if(!existing)statements.push(db(env).prepare('INSERT INTO domains(id,tenant_id,hostname,token,created_at) VALUES(?,?,?,?,?)').bind(domain.id,tenantId,hostname,domain.token,stamp));
 if(row)statements.push(db(env).prepare('UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND version=?').bind(JSON.stringify(plan),stamp,row.id,row.version));
 else statements.push(db(env).prepare("INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'domain_plan',?,?,?)").bind(recordId(tenantId),tenantId,JSON.stringify(plan),stamp,stamp));
 const results=await db(env).batch(statements);must(results.at(-1).meta.changes,'Domain setup changed. Reload before continuing.',409);
 await log(env,await identity(req,env),tenantId,'domain.plan.saved',hostname);
 return view(await rowFor(env,tenantId),env);
}
export async function domainGuidePage(req,env,tenantId){
 const auth=await access(req,env,tenantId,'owner'),data=view(await rowFor(env,tenantId),env);
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Your domain instructions</title><link rel="stylesheet" href="/platform.css"></head><body class="bv-platform"><main class="bv-domain"><h1>Your web address</h1><p>Your current site stays up until you approve the switch.</p>'+renderDomainInstructions(data,false)+'<p><a class="bv-button" href="/">Return to your dashboard</a></p><p>With JavaScript off, these saved instructions remain readable. Enable JavaScript to save a domain or run a check in the dashboard.</p></main></body></html>';
}
