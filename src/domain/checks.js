import {cleanDomain} from './guide.js';
export function publicAddress(ip) {
  // IPv6 is deliberately refused until a complete special-use range policy is available.
  const a = String(ip).split('.').map(Number);
  return a.length === 4 && a.every(n=>Number.isInteger(n)&&n>=0&&n<=255) && ![0,10,127].includes(a[0]) &&
    !(a[0]===169&&a[1]===254) && !(a[0]===172&&a[1]>=16&&a[1]<=31) && !(a[0]===192&&a[1]===168) &&
    !(a[0]===100&&a[1]>=64&&a[1]<=127) && !(a[0]===192&&a[1]===0) && !(a[0]===192&&a[1]===2) &&
    !(a[0]===198&&[18,19,51].includes(a[1])) && !(a[0]===203&&a[1]===0&&a[2]===113) && a[0]<224;
}
// No caller is installed by the runtime unless CUSTOM_DOMAINS_LIVE=1, or a test injects one.
export function createDomainChecks({fetcher=fetch,dns:resolver,https,inspect}={}) {
  const request=(url,options={})=>fetcher(url,{...options,signal:AbortSignal.timeout(7000)});
  async function dns(name,type) {
    if (resolver) return resolver(name,type);
    const u=new URL('https://cloudflare-dns.com/dns-query');u.searchParams.set('name',name);u.searchParams.set('type',type);
    const r=await request(u.href,{headers:{accept:'application/dns-json'}});if(!r.ok)throw Error('DNS check unavailable.');
    const body=await r.json();if(body.Status!==0)return [];
    return (body.Answer||[]).filter(a=>a.type===({A:1,CNAME:5,TXT:16,NS:2}[type])).map(a=>String(a.data));
  }
  const normal=v=>String(v).toLowerCase().replace(/\.$/,'');
  async function addresses(host) {
    const ips=await dns(host,'A');
    return ips.length>0&&ips.every(publicAddress)?ips:[];
  }
  const probe=(url,ips)=>https?https(url,{addresses:ips}):request(url,{redirect:'manual'});
  return {
    nameservers:async hostname=>dns(cleanDomain(hostname),'NS'),
    async check({hostname,tenantId,token,guide,plan}) {
      hostname=cleanDomain(hostname);if(!guide.configured)throw Error('Hosting target not connected.');
      const [txt,cname,wwwIPs,bareIPs,provider]=await Promise.all([dns('_buildovate.'+hostname,'TXT'),dns('www.'+hostname,'CNAME'),addresses('www.'+hostname),addresses(hostname),inspect?inspect({plan}):null]);
      const ownership=txt.some(v=>v.replaceAll('"','').replace(/\s+/g,'')===token)?'verified':'pending';
      const www=wwwIPs.length>0&&cname.some(v=>normal(v)===normal(guide.target));
      let ssl=false,site={ok:false,tenantId,url:'https://www.'+hostname},bare=false;
      const ready=!inspect||provider?.ready===true;
      if(www&&ready) {
        try { const r=await probe(site.url,wwwIPs);ssl=true;site={...site,ok:r.ok&&r.headers.get('x-buildovate-tenant')===tenantId}; } catch { /* Failed TLS/reachability stays pending. */ }
      }
      if(bareIPs.length&&ready) {
        try {
          const r=await probe('https://'+hostname,bareIPs),location=r.headers.get('location');
          if(location) { const u=new URL(location,'https://'+hostname);bare=[301,308].includes(r.status)&&u.protocol==='https:'&&u.hostname==='www.'+hostname&&!u.port&&!u.username&&!u.password; }
          else bare=r.ok&&r.headers.get('x-buildovate-tenant')===tenantId;
        } catch { /* Registrar forwarding must also support HTTPS. */ }
      }
      return {ownership,www,bare,ssl,site,...(provider?{certificateStatus:provider.certificateStatus,tenantStatus:provider.tenantStatus,cloudfront:provider.ready===true}:{})};
    }
  };
}
