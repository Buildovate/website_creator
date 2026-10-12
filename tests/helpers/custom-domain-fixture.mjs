import {DEFAULT} from '../../src/core.js';
export const fixtureOrigin='https://platform.example.test';
export const domainConfig={PLATFORM_HOSTS:'platform.example.test',CUSTOM_DOMAIN_CNAME_TARGET:'sites.fixture.example.test',CF_ROUTING_ENDPOINT:'routing.fixture.example.test',CLOUDFRONT_ALIAS_ZONE_ID:'ZONE_FIXTURE',CUSTOM_DOMAIN_APEX_IPS:'',CUSTOM_DOMAINS_LIVE:'0'};
export function fakeDomainAdapters(state={live:true}) {
  state.calls=[];
  return {
    provisioner:{
      async reconcile({plan,save}) {state.calls.push('reconcile');await save({...plan.provisioning,certificateArn:'arn:fixture:certificate/'+plan.operationId,tenantId:'cf-fixture-'+plan.domainId,certificateStatus:state.live?'ISSUED':'PENDING_VALIDATION',tenantStatus:state.live?'Deployed':'InProgress',status:state.live?'active':'pending',active:!!state.live&&!!plan.addedAt,validationRecords:[{type:'CNAME',name:'_certificate.'+plan.hostname,value:'_validation.acm.fixture.example.test',purpose:'Validate HTTPS certificate'}]});},
      async disconnect({plan,save}) {state.calls.push('disconnect');if(state.cleanupFails)throw Error('Fixture cleanup interrupted');await save({...plan.provisioning,active:false,status:'deleted'});}
    },
    checks:{
      nameservers:async()=>['ns1.domaincontrol.com'],
      async check({hostname,tenantId}) {state.calls.push('check');if(state.checkBarrier)await state.checkBarrier;return {ownership:'verified',www:!!state.live,bare:!!state.live,ssl:!!state.live,cloudfront:!!state.live,site:{ok:!!state.live,tenantId,url:'https://www.'+hostname}};}
    }
  };
}
export async function seedConnectedDomain(DB,{tenantId='tenant_123',slug='pay-test',hostname='contractor.example',published=true}={}) {
  const settings={...DEFAULT,name:'Published Domain Fixture',phone:'8055550198',trade:'Roofing',area:'Ventura'};
  await DB.prepare('UPDATE tenants SET slug=?,settings=?,published=?,status=? WHERE id=?').bind(slug,JSON.stringify({...settings,name:'Private Draft Fixture'}),published?JSON.stringify(settings):null,published?'published':'draft',tenantId).run();
  const plan={tenantId,domainId:'domain-'+tenantId,hostname,provider:'GoDaddy',token:'proof-fixture',operationId:'operation-'+tenantId,ownership:'verified',addedAt:'2026-01-01',switchApprovedAt:'2026-01-01',provisioning:{tenantId:'cf-fixture',active:true,status:'active'},proof:{checkedAt:new Date().toISOString(),connected:true,www:true,bare:true,ssl:true,site:{ok:true,tenantId,url:'https://www.'+hostname}}};
  await DB.prepare("INSERT INTO domains(id,tenant_id,hostname,token,ownership,created_at) VALUES(?,?,?,?,'verified','2026-01-01')").bind(plan.domainId,tenantId,hostname,plan.token).run();
  await DB.prepare("INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'domain_plan',?,'2026-01-01','2026-01-01')").bind('domain-plan-'+tenantId,tenantId,JSON.stringify(plan)).run();
  return plan;
}
