import {one} from '../core.js';
import {cleanDomain} from './guide.js';
import {paymentAvailability,pausedSiteResponse} from '../payments/lifecycle.js';

const caches = new WeakMap();
export function normalizeHost(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (/^\[::1\](?::[0-9]{1,5})?$/.test(raw)) return '[::1]';
  if (!raw || /[\s/@?#\\,]/.test(raw)) return null;
  const match = raw.match(/^([^:]+)(?::([0-9]{1,5}))?$/);
  if (!match || (match[2] && (+match[2] < 1 || +match[2] > 65535))) return null;
  const host = match[1].replace(/\.$/,'');
  return /^[a-z0-9.-]+$/.test(host) && !host.includes('..') ? host : null;
}
export function isPlatformHost(env, host) {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  const configured = String(env.PLATFORM_HOSTS || '').split(',').filter(Boolean);
  if (configured.length) return configured.some(item => normalizeHost(item) === normalized);
  // Legacy/offline Worker fixtures have no host configuration. Live runtime refuses this.
  if (!env.APP_ORIGIN) return true;
  return normalized === new URL(env.APP_ORIGIN).hostname || ['localhost','127.0.0.1','[::1]'].includes(normalized);
}
export function clearDomainLookup(env) { if (env.DB) caches.delete(env.DB); }
export function domainNotFound() {
  return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website not found</title><main><h1>Website not found</h1><p>This web address is not connected to a published website.</p></main></html>',{status:404,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex'}});
}
async function lookup(env, host) {
  let base; try { base = cleanDomain(host); } catch { return null; }
  if (host !== base && host !== 'www.'+base) return null;
  const time = Date.now();
  let cache = caches.get(env.DB); if (!cache) { cache = new Map(); caches.set(env.DB,cache); }
  const hit = cache.get(host); if (hit && hit.until > time) return hit.value;
  const row = await one(env,"SELECT d.id AS domainId,d.tenant_id AS tenantId,d.hostname,d.ownership,w.data FROM domains d JOIN workspace_records w ON w.scope=d.tenant_id AND w.id=('domain-plan-' || d.tenant_id) AND w.kind='domain_plan' WHERE d.hostname=?",base);
  let value = null;
  if (row && row.ownership === 'verified') {
    const plan = JSON.parse(row.data);
    if (plan.domainId === row.domainId && plan.tenantId === row.tenantId && plan.hostname === base && plan.ownership === 'verified' && plan.switchApprovedAt && plan.addedAt && !plan.disconnectedAt && !['disconnecting','deleted'].includes(plan.lifecycle) && plan.provisioning?.active === true) value = {tenantId:row.tenantId,base};
  }
  if (cache.size >= 1024) cache.delete(cache.keys().next().value);
  cache.set(host,{value,until:time+(value?5000:1000)});
  return value;
}
function stripSiteBase(value, slug) {
  const base = '/s/'+slug;
  return value.split(base+'/').join('/').split(base+'?').join('/?').split(base+'#').join('/#')
    .split(base+'"').join('/"').split(base+"'").join("/'").split(base+'<').join('/<');
}
// Return null only for platform hosts; custom hosts cannot enter platform/auth routes.
export async function routeCustomDomain(req, env, render) {
  const url = new URL(req.url), host = normalizeHost(req.headers.get('host') || url.host);
  if (isPlatformHost(env,host)) return null;
  if (!host) return domainNotFound();
  const mapping = await lookup(env,host); if (!mapping) return domainNotFound();
  const tenant = await one(env,"SELECT id,slug,status,published FROM tenants WHERE id=?",mapping.tenantId);
  if (!tenant || tenant.status !== 'published' || !tenant.published || url.searchParams.has('preview')) return domainNotFound();
  const availability = await paymentAvailability(env,tenant.id);
  if (availability.state === 'paused') return pausedSiteResponse();
  if (availability.state !== 'live') return domainNotFound();
  if (url.pathname === '/robots.txt') return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+url.origin+'/sitemap.xml\n',{headers:{'content-type':'text/plain','cache-control':'no-store'}});
  const publicApi = '/api/public/'+tenant.slug;
  const staticAsset = /^\/assets\//.test(url.pathname) || /^\/[a-z0-9][a-z0-9_.-]*\.(?:css|js|woff2?|ico)$/.test(url.pathname);
  const media = /^\/media\/[^/]+$/.test(url.pathname);
  if (media && !(await one(env,'SELECT id FROM photos WHERE id=? AND tenant_id=?',url.pathname.slice(7),tenant.id))) return domainNotFound();
  if (url.pathname.startsWith('/api/')) {
    if (!url.pathname.startsWith(publicApi+'/')) return domainNotFound();
  } else if (url.pathname.startsWith('/s/')) {
    if (url.pathname !== '/s/'+tenant.slug && !url.pathname.startsWith('/s/'+tenant.slug+'/')) return domainNotFound();
  } else if (!staticAsset && !media) {
    if (/^\/(?:auth|login|logout|app|admin|preview|sales-preview|domain-guide|healthz|join|team-join)(?:\/|$)/.test(url.pathname)) return domainNotFound();
    url.pathname = '/s/'+tenant.slug+(url.pathname === '/'?'':url.pathname);
  }
  const headers = new Headers(req.headers);
  for (const name of [...headers.keys()]) if (/^(?:cookie|authorization|oai-authenticated-|x-buildovate-|x-amzn-oidc-)/.test(name)) headers.delete(name);
  headers.set('host',host);
  const forwarded = new Request(url,req); // Keeps the original origin for public form CSRF checks.
  const response = await render(new Request(forwarded,{headers}),env);
  if (response.status === 404 || response.status === 401 || response.status === 403) return domainNotFound();
  const outHeaders = new Headers(response.headers); outHeaders.delete('set-cookie');
  if (outHeaders.has('location')) outHeaders.set('location',stripSiteBase(outHeaders.get('location'),tenant.slug));
  if (response.ok && !staticAsset) outHeaders.set('x-buildovate-tenant',tenant.id);
  const type = outHeaders.get('content-type') || '';
  if (type.includes('text/html') || type.includes('xml')) {
    outHeaders.delete('content-length');
    return new Response(stripSiteBase(await response.text(),tenant.slug),{status:response.status,headers:outHeaders});
  }
  return new Response(response.body,{status:response.status,headers:outHeaders});
}
