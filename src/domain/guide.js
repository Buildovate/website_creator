export const DOMAIN_ENV_KEYS=['CF_MT_DISTRIBUTION_ID','CF_CONNECTION_GROUP_ID','CF_ROUTING_ENDPOINT','CUSTOM_DOMAIN_CNAME_TARGET','DOMAINS_ROLE_ARN','CF_TENANT_TAG_ENV','PLATFORM_HOSTS','CLOUDFRONT_ALIAS_ZONE_ID','CUSTOM_DOMAIN_APEX_IPS','CUSTOM_DOMAINS_LIVE','DOMAIN_RECHECK_INTERVAL_MS'];
export const DOMAIN_REGION='us-east-1';
export const PROVIDERS=['Detect automatically','Route 53','Cloudflare','Other flattening DNS','GoDaddy','Namecheap','Squarespace','Wix','IONOS','Other'];
export function cleanDomain(value){
 const domain=String(value||'').trim().toLowerCase().replace(/^www\./,'');
 if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)||domain.length>240||/\.(?:local|internal|localhost)$/.test(domain))throw Error('Enter a domain only, such as example.com.');
 return domain;
}
export function detectProvider(nameservers=[]){
 const ns=nameservers.map(x=>String(x).toLowerCase().replace(/\.$/,'')).join(' ');
 if(/\bns-[\w.-]+\.awsdns-[\w.-]+/.test(ns))return 'Route 53';
 if(/\.ns\.cloudflare\.com\b/.test(ns))return 'Cloudflare';
 if(/\.domaincontrol\.com\b/.test(ns))return 'GoDaddy';
 if(/\.registrar-servers\.com\b/.test(ns))return 'Namecheap';
 if(/\.squarespacedns\.com\b/.test(ns))return 'Squarespace';
 return 'Other';
}
export function domainGuide(plan,env={}){
 const target=String(env.CUSTOM_DOMAIN_CNAME_TARGET||env.CF_ROUTING_ENDPOINT||'').trim().replace(/\.$/,'');
 const aliasZone=String(env.CLOUDFRONT_ALIAS_ZONE_ID||'');
 const provider=plan.provider==='Detect automatically'?(plan.detectedProvider||'Other'):plan.provider;
 const method=provider==='Route 53'?'alias':['Cloudflare','Other flattening DNS'].includes(provider)?'flatten':'forward';
 const records=[{type:'TXT',name:'_buildovate.'+plan.hostname,value:plan.token||'',purpose:'Confirm ownership'},{type:'CNAME',name:'www',value:target,purpose:'Point www to your website'}],steps=[];
 if(method==='alias')steps.push('In Route 53, create a bare-domain alias to the hosting target. Use the alias hosted zone shown below.');
 else if(method==='flatten')steps.push('At your DNS host, set the bare domain (@) to the hosting target using CNAME flattening, ALIAS or ANAME. In Cloudflare, use DNS-only while connecting.');
 else {
 const locations={GoDaddy:'Open your domain → DNS → Forwarding → Domain.',Namecheap:'Open Domain List → Manage → Redirect Domain.',Squarespace:'Open Domains → your domain → Website → Domain forwarding.',Wix:'Open your domain’s forwarding settings.',IONOS:'Open Domains & SSL → your domain → Adjust destination.'};
 steps.push(locations[provider]||'Open the forwarding settings at the registrar where you bought your domain.');
 steps.push('Set a permanent (301), unmasked forward from '+plan.hostname+' to https://www.'+plan.hostname+'. Check that both HTTP and HTTPS bare-domain visits redirect there.');
 }
 const ips=String(env.CUSTOM_DOMAIN_APEX_IPS||'').split(',').map(x=>x.trim()).filter(x=>/^(?:\d{1,3}\.){3}\d{1,3}$/.test(x)&&x.split('.').every(n=>Number(n)<=255));
 if(ips.length){records.push(...ips.map(value=>({type:'A',name:'@',value,purpose:'Configured bare-domain alternative'})));steps.push('Only if your hosting administrator directs you to use this alternative, replace bare-domain A records with the configured values listed here.');}
 records.push(...(plan.provisioning?.validationRecords||[]));
 if(method==='alias'&&env.CF_ROUTING_ENDPOINT)records.push(...[plan.hostname,'www.'+plan.hostname].map(host=>({type:'TXT',name:'_cf-challenge.'+host,value:env.CF_ROUTING_ENDPOINT,purpose:'Confirm CloudFront alias ownership'})));
 return {target,aliasZone,provider,method,records,steps,configured:!!target&&(method!=='alias'||!!aliasZone)};
}
