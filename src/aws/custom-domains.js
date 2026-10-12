import {createHash} from 'node:crypto';
import {CloudFrontClient,CreateDistributionTenantCommand,GetDistributionTenantCommand,UpdateDistributionTenantCommand,DeleteDistributionTenantCommand} from '@aws-sdk/client-cloudfront';
import {ACMClient,RequestCertificateCommand,DescribeCertificateCommand,DeleteCertificateCommand,ListCertificatesCommand,ListTagsForCertificateCommand} from '@aws-sdk/client-acm';
import {STSClient,AssumeRoleCommand} from '@aws-sdk/client-sts';
import {Route53Client,ListResourceRecordSetsCommand,ChangeResourceRecordSetsCommand} from '@aws-sdk/client-route-53';
import {customDomainsLive} from '../domain/adapters.js';
import {DOMAIN_REGION,cleanDomain} from '../domain/guide.js';
import {createDomainChecks} from '../domain/checks.js';
import {requestPublicHttps} from './domain-https.js';

const absent = error => ['EntityNotFound','ResourceNotFoundException'].includes(error.name);
const digest = value => createHash('sha256').update(value).digest('hex');
const normal = value => String(value || '').toLowerCase().replace(/\.$/,'');
export function domainRoleCredentials(env,{sts = new STSClient({region:DOMAIN_REGION,maxAttempts:3,requestHandler:{requestTimeout:15000,connectionTimeout:3000}}),clock = Date.now} = {}) {
  let cached, pending;
  return async () => {
    if (cached && cached.expiration.getTime()-clock() > 60000) return cached;
    if (!pending) pending = sts.send(new AssumeRoleCommand({RoleArn:env.DOMAINS_ROLE_ARN,RoleSessionName:'website-custom-domains',DurationSeconds:3600})).then(({Credentials:c}) => {
      if (!c?.AccessKeyId || !c?.SecretAccessKey || !c?.SessionToken || !c?.Expiration) throw Error('Domain role credentials unavailable.');
      cached = {accessKeyId:c.AccessKeyId,secretAccessKey:c.SecretAccessKey,sessionToken:c.SessionToken,expiration:new Date(c.Expiration)};
      return cached;
    }).finally(() => { pending = null; });
    return pending;
  };
}
export function createDomainProvisioner({env,cloudfront,acm,route53} = {}) {
  if (!customDomainsLive(env)) throw Error('Custom-domain live adapter is disabled.');
  const tags = plan => [{Key:'env',Value:env.CF_TENANT_TAG_ENV},{Key:'tenantId',Value:plan.tenantId},{Key:'domainOperation',Value:plan.operationId}];
  const nameFor = plan => 'bv-'+digest(env.CF_TENANT_TAG_ENV+':'+plan.tenantId+':'+plan.operationId).slice(0,40);
  const expectedDomains = (plan,guide) => ['www.'+cleanDomain(plan.hostname),...(guide.method === 'forward'?[]:[plan.hostname])];
  async function getTenant(identifier) { try { return await cloudfront.send(new GetDistributionTenantCommand({Identifier:identifier})); } catch (error) { if (absent(error)) return null; throw error; } }
  function assertTenant(result,plan) {
    const t = result.DistributionTenant;
    if (!t || t.Name !== nameFor(plan) || t.DistributionId !== env.CF_MT_DISTRIBUTION_ID || t.ConnectionGroupId !== env.CF_CONNECTION_GROUP_ID) throw Error('CloudFront tenant does not match this domain operation.');
    return t;
  }
  async function recoverCertificate(plan) {
    let NextToken;
    do {
      const result = await acm.send(new ListCertificatesCommand({NextToken,CertificateStatuses:['PENDING_VALIDATION','ISSUED','INACTIVE','EXPIRED','VALIDATION_TIMED_OUT','REVOKED','FAILED']}));
      for (const c of result.CertificateSummaryList || []) if (normal(c.DomainName) === 'www.'+plan.hostname) {
        const found = await acm.send(new ListTagsForCertificateCommand({CertificateArn:c.CertificateArn}));
        if (tags(plan).every(tag => found.Tags?.some(item => item.Key === tag.Key && item.Value === tag.Value))) return c.CertificateArn;
      }
      NextToken = result.NextToken;
    } while (NextToken);
    return null;
  }
  async function certificate(arn) {
    try { return (await acm.send(new DescribeCertificateCommand({CertificateArn:arn}))).Certificate; }
    catch (error) { if (absent(error)) return null; throw error; }
  }
  return {
    async reconcile({plan,guide,save}) {
      let state = {...plan.provisioning};
      const persist = async patch => { state = {...state,...patch}; await save(state); };
      if (!state.certificateArn) {
        const recovered = await recoverCertificate(plan);
        const arn = recovered || (await acm.send(new RequestCertificateCommand({DomainName:'www.'+plan.hostname,SubjectAlternativeNames:[plan.hostname],ValidationMethod:'DNS',IdempotencyToken:digest(plan.operationId).slice(0,32),Tags:tags(plan)}))).CertificateArn;
        if (!arn) throw Error('Certificate request did not return an ARN.');
        await persist({certificateArn:arn,status:'pending',active:false});
      }
      const cert = await certificate(state.certificateArn);
      if (cert && (normal(cert.DomainName) !== 'www.'+plan.hostname || !cert.SubjectAlternativeNames?.includes(plan.hostname))) throw Error('Certificate does not match this domain.');
      const records = (cert?.DomainValidationOptions || []).filter(item => item.ResourceRecord?.Type === 'CNAME').map(item => ({type:'CNAME',name:item.ResourceRecord.Name,value:item.ResourceRecord.Value,purpose:'Validate HTTPS certificate'}));
      await persist({certificateStatus:cert?.Status || 'PENDING_VALIDATION',validationRecords:records.length?records:state.validationRecords || []});
      let current = await getTenant(state.tenantId || nameFor(plan));
      if (!current) {
        try {
          current = await cloudfront.send(new CreateDistributionTenantCommand({Name:nameFor(plan),DistributionId:env.CF_MT_DISTRIBUTION_ID,ConnectionGroupId:env.CF_CONNECTION_GROUP_ID,Domains:expectedDomains(plan,guide).map(Domain => ({Domain})),Enabled:false,Tags:{Items:tags(plan)}}));
        } catch (error) { if (error.name !== 'EntityAlreadyExists') throw error; current = await getTenant(nameFor(plan)); }
        if (!current) throw Error('CloudFront tenant unavailable.');
        await persist({tenantId:assertTenant(current,plan).Id,etag:current.ETag});
      }
      let t = assertTenant(current,plan);
      const ready = cert?.Status === 'ISSUED' && !!plan.switchApprovedAt && !!plan.addedAt, domains = expectedDomains(plan,guide);
      if (t.Enabled !== ready || t.Customizations?.Certificate?.Arn !== (ready?state.certificateArn:undefined) || JSON.stringify((t.Domains || []).map(x=>x.Domain).sort()) !== JSON.stringify([...domains].sort())) {
        current = await cloudfront.send(new UpdateDistributionTenantCommand({Id:t.Id,IfMatch:current.ETag,Enabled:ready,DistributionId:t.DistributionId,ConnectionGroupId:t.ConnectionGroupId,Domains:domains.map(Domain=>({Domain})),...(t.Parameters?.length?{Parameters:t.Parameters}:{}),...(ready?{Customizations:{...t.Customizations,Certificate:{Arn:state.certificateArn}}}:{})}));
        t = assertTenant(current,plan);
      }
      await persist({tenantId:t.Id,etag:current.ETag,tenantStatus:t.Status,domains,active:ready && t.Enabled === true && t.Status === 'Deployed' && domains.every(host => t.Domains?.some(d => d.Domain === host && d.Status === 'active')),status:ready?'deploying':'pending'});
      if (state.active) await persist({status:'active'});
      return state;
    },
    async inspect({plan}) {
      const p = plan.provisioning || {}, cert = p.certificateArn?await certificate(p.certificateArn):null;
      const result = p.tenantId?await getTenant(p.tenantId):null;
      const t = result?assertTenant(result,plan):null;
      return {certificateStatus:cert?.Status || 'MISSING',tenantStatus:t?.Status || 'MISSING',ready:cert?.Status === 'ISSUED' && t?.Enabled === true && t.Status === 'Deployed' && t.Customizations?.Certificate?.Arn === p.certificateArn && (p.domains || []).length > 0 && p.domains.every(host => t.Domains?.some(d => d.Domain === host && d.Status === 'active'))};
    },
    async disconnect({plan,save}) {
      let state = {...plan.provisioning};
      const persist = async patch => { state = {...state,...patch}; await save(state); };
      const result = await getTenant(state.tenantId || nameFor(plan));
      if (result) {
        const tenant = assertTenant(result,plan);
        if (tenant.Enabled) {
          const disabled = await cloudfront.send(new UpdateDistributionTenantCommand({Id:tenant.Id,IfMatch:result.ETag,Enabled:false}));
          await persist({active:false,status:'deleting',etag:disabled.ETag});
          return state; // A later pass reads the deployed ETag before deleting.
        }
        if (tenant.Status !== 'Deployed') { await persist({active:false,status:'deleting'}); return state; }
        try { await cloudfront.send(new DeleteDistributionTenantCommand({Id:tenant.Id,IfMatch:result.ETag})); } catch (error) { if (!absent(error)) throw error; }
        await persist({tenantDeleted:true,active:false,status:'deleting'});
      }
      if (state.certificateArn) {
        try { await acm.send(new DeleteCertificateCommand({CertificateArn:state.certificateArn})); } catch (error) { if (!absent(error)) throw error; }
      }
      await persist({active:false,status:'deleted',tenantDeleted:true,certificateDeleted:true});
      return state;
    },
    // Only a registered-domain integration with its own verified hosted-zone binding can call this.
    // The wizard shows records and never silently edits contractor DNS.
    async publishValidationRecords({plan,hostedZoneId,registeredHostname}) {
      if (cleanDomain(registeredHostname) !== plan.hostname || !hostedZoneId) throw Error('A verified registered-domain hosted zone is required.');
      const records = plan.provisioning?.validationRecords || [];
      if (records.some(r => r.type !== 'CNAME' || !normal(r.name).endsWith('.'+plan.hostname))) throw Error('Validation record escapes the registered domain.');
      const current = await route53.send(new ListResourceRecordSetsCommand({HostedZoneId:hostedZoneId}));
      const changes = records.filter(r => !current.ResourceRecordSets?.some(item => normal(item.Name) === normal(r.name) && item.Type === 'CNAME' && item.ResourceRecords?.some(x => normal(x.Value) === normal(r.value)))).map(r => ({Action:'UPSERT',ResourceRecordSet:{Name:r.name,Type:'CNAME',TTL:300,ResourceRecords:[{Value:r.value}]}}));
      if (changes.length) await route53.send(new ChangeResourceRecordSetsCommand({HostedZoneId:hostedZoneId,ChangeBatch:{Changes:changes}}));
      return {changed:changes.length};
    }
  };
}
export function createLiveDomainAdapters(env,{clients,dns,https} = {}) {
  if (!customDomainsLive(env)) return {provisioner:null,checks:null};
  const credentials = clients?undefined:domainRoleCredentials(env);
  const config = {region:DOMAIN_REGION,maxAttempts:3,credentials,requestHandler:{requestTimeout:15000,connectionTimeout:3000}};
  const provisioner = createDomainProvisioner({env,cloudfront:clients?.cloudfront || new CloudFrontClient(config),acm:clients?.acm || new ACMClient(config),route53:clients?.route53 || new Route53Client(config)});
  const checks = createDomainChecks({...(dns?{dns}:{}),https:https || requestPublicHttps,inspect:args => provisioner.inspect(args)});
  return {provisioner,checks};
}
