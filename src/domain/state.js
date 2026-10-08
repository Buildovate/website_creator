export const RECHECK_MS=3*60*1000;
export function domainStatus(plan,proof={},time=Date.now()){
 const fresh=Number.isFinite(Date.parse(proof.checkedAt))&&time-Date.parse(proof.checkedAt)>=0&&time-Date.parse(proof.checkedAt)<=RECHECK_MS*2;
 const site=proof.site||{};
 const loading=fresh&&site.ok===true&&site.tenantId===plan.tenantId&&site.url==='https://www.'+plan.hostname;
 const checks={www:fresh&&proof.www===true,bare:fresh&&proof.bare===true,ssl:fresh&&proof.ssl===true,site:loading};
 const live=plan.ownership==='verified'&&checks.www&&checks.bare&&checks.ssl&&checks.site;
 return {checks,live,fresh,connected:proof.connected===true,message:proof.error||'',checkedAt:proof.checkedAt||null};
}
export function needsDomainHelp(plan,status,time=Date.now()){
 return !!plan.addedAt&&!status.live&&time-Date.parse(plan.addedAt)>=48*60*60*1000;
}
