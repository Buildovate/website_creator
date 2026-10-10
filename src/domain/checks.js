import {cleanDomain} from './guide.js';
// Inert until explicitly enabled. Tests inject every DNS/HTTPS response locally.
export function createDomainChecks({fetcher=fetch}={}){
 const request=(url,options={})=>fetcher(url,{...options,signal:AbortSignal.timeout(7000)});
 async function dns(name,type){const u=new URL('https://cloudflare-dns.com/dns-query');u.searchParams.set('name',name);u.searchParams.set('type',type);const r=await request(u.href,{headers:{accept:'application/dns-json'}});if(!r.ok)throw Error('DNS check unavailable.');const body=await r.json();if(body.Status!==0)return [];return (body.Answer||[]).filter(a=>a.type===({A:1,CNAME:5,TXT:16,NS:2}[type])).map(a=>String(a.data));}
 const normal=v=>v.toLowerCase().replace(/\.$/,'');
 function publicIPv4(ip){const a=ip.split('.').map(Number);return a.length===4&&a.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&![0,10,127].includes(a[0])&&!(a[0]===169&&a[1]===254)&&!(a[0]===172&&a[1]>=16&&a[1]<=31)&&!(a[0]===192&&a[1]===168)&&!(a[0]===100&&a[1]>=64&&a[1]<=127)&&a[0]<224;}
 async function safeHost(host){const ips=await dns(host,'A');return ips.length>0&&ips.every(publicIPv4);}
 return {
  nameservers:async hostname=>dns(cleanDomain(hostname),'NS'),
  async check({hostname,tenantId,token,guide}){
   hostname=cleanDomain(hostname);if(!guide.configured)throw Error('Hosting target not connected.');
   const [txt,cname,wwwSafe,bareSafe]=await Promise.all([dns('_buildovate.'+hostname,'TXT'),dns('www.'+hostname,'CNAME'),safeHost('www.'+hostname),safeHost(hostname)]);
   const ownership=txt.some(v=>v.replaceAll('"','')===token)?'verified':'pending',www=wwwSafe&&cname.some(v=>normal(v)===normal(guide.target));
   let ssl=false,site={ok:false,tenantId,url:'https://www.'+hostname},bare=false;
   if(www){const r=await request(site.url,{redirect:'manual'});ssl=true;site={...site,ok:r.ok&&r.headers.get('x-buildovate-tenant')===tenantId};}
   if(bareSafe){const r=await request('https://'+hostname,{redirect:'manual'});const location=r.headers.get('location');if(location){const u=new URL(location,'https://'+hostname);bare=[301,308].includes(r.status)&&u.protocol==='https:'&&u.hostname==='www.'+hostname;}else bare=r.ok&&r.headers.get('x-buildovate-tenant')===tenantId;}
   return {ownership,www,bare,ssl,site};
  }
 };
}
