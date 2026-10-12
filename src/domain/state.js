export const RECHECK_MS=3*60*1000;
export function domainStatus(plan,proof={},time=Date.now()){
 const fresh=Number.isFinite(Date.parse(proof.checkedAt))&&time-Date.parse(proof.checkedAt)>=0&&time-Date.parse(proof.checkedAt)<=RECHECK_MS*2;
 const site=proof.site||{};
 const loading=fresh&&site.ok===true&&site.tenantId===plan.tenantId&&site.url==='https://www.'+plan.hostname;
 const checks={www:fresh&&proof.www===true,bare:fresh&&proof.bare===true,ssl:fresh&&proof.ssl===true,site:loading};
 const live=!plan.disconnectedAt&&!['disconnecting','deleted'].includes(plan.lifecycle)&&plan.ownership==='verified'&&checks.www&&checks.bare&&checks.ssl&&checks.site&&proof.cloudfront!==false;
 return {stage:live?'live':proof.error?'failed':plan.ownership==='verified'?(plan.switchApprovedAt?'connecting':'verified'):plan.addedAt?'verifying':'chosen',checks,live,fresh,connected:proof.connected===true,message:proof.error||'',checkedAt:proof.checkedAt||null};
}
export function needsDomainHelp(plan,status,time=Date.now()){
 return !!plan.addedAt&&!status.live&&time-Date.parse(plan.addedAt)>=48*60*60*1000;
}

// Shared read interface used by Game and the domain wizard; no network or writes.
export async function getDomainStatus(tenantId,db){
 if(!db)return {state:'not_connected'};
 const row=await db.prepare("SELECT data FROM workspace_records WHERE id=? AND scope=? AND kind='domain_plan'").bind('domain-plan-'+tenantId,tenantId).first();
 if(!row)return {stage:'none',live:false,connected:false};
 const plan=JSON.parse(row.data);if(plan.tenantId!==tenantId)throw Error('Domain record tenant mismatch.');
 return {...domainStatus(plan,plan.proof),hostname:plan.hostname};
}
