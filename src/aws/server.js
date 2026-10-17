import {createLiveDomainAdapters} from './custom-domains.js';
import {customDomainsLive,recheckInterval} from '../domain/adapters.js';
import {isPlatformHost,normalizeHost,domainNotFound} from '../domain/routing.js';
import {createGeoLookup} from './geoip.js';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';
import { isIP } from 'node:net';
import { applyAuth, resolveUser, authConfig, OPENAI_API_ORIGIN } from './auth.js';
import { createAuthHttp, AuthError, responseHeaders, workspacePage, workspaceErrorPage } from '../../dist/auth/index.js';
import { assertRuntimeConfig, loadEnv } from './env.js';
import { createD1Adapter } from './d1.js';
import { applyMigrations } from './migrate.js';
import { backfillServicePageSettings } from '../service-backfill.js';
import { createAssets, createMemoryBucket, createS3Bucket, createS3Client } from './s3.js';

const HOP = new Set(['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'host', 'expect', 'content-length']);

function nodeHeaders(req) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null || HOP.has(key)) continue;
    if (Array.isArray(value)) for (const item of value) headers.append(key, item);
    else headers.set(key, value);
  }
  return headers;
}

function isLoadBalancerHealthCheck(req, pathname) {
  if (pathname !== '/healthz' || req.method !== 'GET' || req.headers['user-agent'] !== 'ELB-HealthChecker/2.0') return false;
  const host = normalizeHost(req.headers.host);
  if (!host || isIP(host) !== 4) return false;
  const octets = host.split('.').map(Number);
  return octets[0] === 10 ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168);
}

export function requestUrl(req, env = {}) {
  const rawPath = req.url || '/';
  if (!rawPath.startsWith('/') || rawPath.startsWith('//') || /[\r\n\\]/.test(rawPath)) throw new AuthError('Invalid request URL.');
  let origin;
  if (env.APP_ORIGIN) origin = new URL(env.APP_ORIGIN).origin;
  else {
    const host = String(req.headers.host || 'localhost');
    if (!/^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/.test(host)) throw new AuthError('Unrecognized local host.', 400);
    origin = 'http://' + host;
  }
  // Explicit canonical origin: forwarding headers never select it.
  return origin + rawPath;
}

async function databaseOk(db) {
  const started = Date.now();
  const row = await db.prepare('SELECT 1 AS ok').first();
  if (!row || Number(row.ok) !== 1) throw new Error('Unexpected database probe result');
  return Date.now() - started;
}

export function createHandler({ worker, env, db, auth }) {
  const authHttp = createAuthHttp(db, auth, resolveUser);
  return async function handle(req, res) {
    let url;
    for(const [key,value] of Object.entries(responseHeaders())) res.setHeader(key,value);
    try {
      url = new URL(requestUrl(req, env));
      for(const [key,value] of Object.entries(responseHeaders(url,env.APP_ENV))) res.setHeader(key,value);
      if (!isPlatformHost(env,req.headers.host || url.host) && !isLoadBalancerHealthCheck(req, url.pathname)) {
        const host=normalizeHost(req.headers.host || url.host);
        if(!host) {await writeResponse(res,domainNotFound(),auth);return;}
        const customUrl=new URL(url.pathname+url.search,(env.APP_ENV==='local'?'http://':'https://')+host);
        const method=req.method||'GET',hasBody=method!=='GET'&&method!=='HEAD';
        const incoming=new Request(customUrl,{method,headers:nodeHeaders(req),body:hasBody?Readable.toWeb(req):undefined,...(hasBody?{duplex:'half'}:{})});
        // No platform cookie/session/provider authentication is evaluated for a custom host.
        await writeResponse(res,await worker.fetch(incoming,{...env,AUTH_RUNTIME:'aws'}),auth);return;
      }
      if (url.pathname === '/healthz') {
        if (req.method !== 'GET') { sendJson(res,405,{error:'Method not supported.'}); return; }
        const body = {
          ok: false,
          service: 'website-creator',
          environment: env.APP_ENV,
          region: env.AWS_REGION,
          bucket: env.BUCKET?.bucket || env.S3_BUCKET || env.BUCKET_DRIVER || 'memory',
          authMode: auth.mode,
          database: { ok: false },
          openai: { origin: OPENAI_API_ORIGIN, configured: Boolean(env.OPENAI_API_KEY) },
        };
        try {
          body.database = { ok: true, ms: await databaseOk(db) };
          body.ok = true;
          sendJson(res, 200, body);
        } catch (error) {
          console.error('healthz database check failed', error.message || error);
          body.database = { ok: false };
          sendJson(res, 503, body);
        }
        return;
      }
      const headers = nodeHeaders(req);
      const method = req.method || 'GET';
      const hasBody = method !== 'GET' && method !== 'HEAD';
      const incoming = new Request(url, {
        method, headers,
        body: hasBody ? Readable.toWeb(req) : undefined,
        ...(hasBody ? { duplex: 'half' } : {}),
      });
      const context = await authHttp.context(incoming);
      req.user = context.user;
      const authResponse = await authHttp.route(incoming, context, req.socket.remoteAddress || 'unknown');
      if (authResponse) { await writeResponse(res, authResponse, auth); return; }
      const authed = await applyAuth(incoming, auth, context.user);
      const location = /^\/api\/public\/[^/]+\/location$/.test(url.pathname) ? env.GEOIP_LOOKUP?.(req) : null;
      let response = await worker.fetch(authed, { ...env, AUTH_RUNTIME:'aws', VISITOR_LOCATION:location });
      if (url.pathname === '/api/session' && response.ok) {
        const body = await response.json();
        response = new Response(JSON.stringify({
          ...body, authMode:auth.mode, loginUrl:'/login', logoutUrl:'/auth/logout',
          providerLogoutUrl:auth.logoutUrl || '', expiresAt:context.session?.expires_at || null,
          csrfToken:context.session?.csrf_token || null,
        }), {status:200,headers:{'content-type':'application/json','cache-control':'no-store',
          ...(context.cookie ? {'set-cookie':context.cookie} : {})}});
      }
      if (response.status === 401 && !url.pathname.startsWith('/api/') && (response.headers.get('content-type')||'').includes('text/html')) {
        response = new Response(null,{status:303,headers:{location:'/login?returnTo='+encodeURIComponent(url.pathname+url.search),'cache-control':'no-store'}});
      }
      if (response.status >= 400 && workspacePage(url)) response = new Response(workspaceErrorPage(response.status),{status:response.status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
      await writeResponse(res, response, auth);
    } catch (error) {
      if (!(error instanceof AuthError)) console.error('Request failed', url?.pathname || '/', error.code || error.name);
      if (!res.headersSent) {
        const status=error instanceof AuthError ? error.status : error.code === 'AUTH_CONFIG' ? 500 : 503;
        if(url && workspacePage(url)) await writeResponse(res,new Response(workspaceErrorPage(status),{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}}),auth);
        else sendJson(res,status,{error:error instanceof AuthError ? error.message : 'Service temporarily unavailable.'});
      }
      else res.end();
    }
  };
}

function sendJson(res, status, body) {
  const raw = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(raw),
  });
  res.end(raw);
}

function headerObject(response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie' || key === 'content-length') return;
    headers[key] = value;
  });
  const cookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
  if (cookies.length) headers['set-cookie'] = cookies;
  return headers;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

// The Worker HTML still names the ChatGPT Sites login. That control does not
// authenticate this process. Rewrite it only on the AWS response path.
export function rewriteSitesChrome(html, auth) {
  let out = html.replaceAll('Sign in with ChatGPT', 'Sign in required');
  out = out.replaceAll(/href="\/signin-with-chatgpt\?[^"]*"/g, 'href="/login"');
  const signOut = auth?.logoutUrl
    ? `<a href="${escapeHtml(auth.logoutUrl)}">Sign out</a>`
    : '<span>Sign-out is handled by the identity provider</span>';
  out = out.replaceAll('<a target="_top" href="/signout-with-chatgpt?return_to=%2F">Sign out</a>', signOut);
  return out;
}

async function writeResponse(res, response, auth) {
  const type = response.headers.get('content-type') || '';
  const headers = headerObject(response);
  if (type.includes('text/html')) {
    const html = rewriteSitesChrome(await response.text(), auth);
    headers['content-length'] = Buffer.byteLength(html);
    res.writeHead(response.status, headers);
    res.end(html);
    return;
  }
  res.writeHead(response.status, headers);
  if (!response.body) {
    res.end();
    return;
  }
  await new Promise((resolve, reject) => {
    const body=Readable.fromWeb(response.body);res.once('close',()=>{body.destroy();resolve()});body.on('error',reject);body.pipe(res).on('finish', resolve).on('error', reject);
  });
}

export async function createRuntime(options = {}) {
  const env = { ...loadEnv(process.env), ...options.env };
  const errors = options.skipConfigCheck ? [] : assertRuntimeConfig(env);
  if (errors.length) {
    const error = new Error(errors.join('\n'));
    error.code = 'CONFIG';
    throw error;
  }
  const executor = options.executor || await createExecutor(env);
  if (env.MIGRATE_ON_BOOT === '1' && !options.skipMigrate) await applyMigrations((sql, params) => executor.query(sql, params));
  const db = options.db || createD1Adapter(executor);
  await backfillServicePageSettings(db);
  const bucket = options.bucket || await createBucket(env);
  const assetsRoot = env.ASSETS_ROOT || (existsSync('dist/client') ? 'dist/client' : 'public');
  const runtimeEnv = { ...env, GEOIP_LOOKUP:await createGeoLookup(env), DB: db, BUCKET: bucket, ASSETS: createAssets(path.resolve(assetsRoot),{templateMediaOrigin:env.TEMPLATE_MEDIA_ORIGIN,fallbackRoot:env.APP_ENV==='local'?path.resolve('public'):''}) };
  if(options.domainChecks)runtimeEnv.DOMAIN_CHECKS=options.domainChecks;
  if(options.domainProvisioner)runtimeEnv.DOMAIN_PROVISIONER=options.domainProvisioner;
  if(customDomainsLive(runtimeEnv)) {
    const adapters=createLiveDomainAdapters(runtimeEnv,options.domainAdapterOptions);
    runtimeEnv.DOMAIN_CHECKS=options.domainChecks||adapters.checks;
    runtimeEnv.DOMAIN_PROVISIONER=options.domainProvisioner||adapters.provisioner;
  }
  const worker = options.worker || await loadWorker();
  const reviewJobs=new Map();let reviewCaptureTail=Promise.resolve();
  runtimeEnv.REVIEW_QUEUE=(key,task)=>{if(reviewJobs.has(key))return reviewJobs.get(key);const job=Promise.resolve().then(task).catch(error=>console.error('Review capture failed',error.message)).finally(()=>reviewJobs.delete(key));reviewJobs.set(key,job);return job};
  if(options.reviewCapture)runtimeEnv.REVIEW_CAPTURE=options.reviewCapture;
  else if(runtimeEnv.REVIEW_BROWSER_MODULE){const {createReviewCapture}=await import('./review-capture.js');runtimeEnv.REVIEW_CAPTURE=createReviewCapture({browserModule:runtimeEnv.REVIEW_BROWSER_MODULE,executablePath:runtimeEnv.REVIEW_BROWSER_EXECUTABLE})}
  if(runtimeEnv.REVIEW_CAPTURE){const capture=runtimeEnv.REVIEW_CAPTURE;runtimeEnv.REVIEW_CAPTURE=args=>{const next=reviewCaptureTail.then(()=>capture(args));reviewCaptureTail=next.catch(()=>{});return next}}
  const auth = options.auth || authConfig(runtimeEnv);
  return {
    env: runtimeEnv,
    executor,
    auth,
    handler: createHandler({ worker, env: runtimeEnv, db, auth }),
    async maintainDomains(){await worker.scheduled?.({domainOnly:true},runtimeEnv);},
    async maintain(){await worker.scheduled?.({},runtimeEnv);},
    async close() { while(reviewJobs.size)await Promise.allSettled([...reviewJobs.values()]);await executor.close?.(); },
  };
}

async function createExecutor(env) {
  if (env.DATABASE_DRIVER === 'pglite') {
    const { createPgliteExecutor } = await import('./pglite.js');
    return createPgliteExecutor(env.PGLITE_DATA_DIR);
  }
  const { createPgExecutor, createPgPool } = await import('./pg.js');
  return createPgExecutor(createPgPool(env));
}

async function createBucket(env) {
  if (env.BUCKET_DRIVER === 'memory' || (!env.S3_BUCKET && env.APP_ENV === 'local')) return createMemoryBucket();
  return createS3Bucket({ bucket: env.S3_BUCKET, region: env.AWS_REGION, client: await createS3Client(env) });
}

async function loadWorker() {
  const file = path.resolve('dist/server/index.js');
  if (!existsSync(file)) throw new Error('dist/server/index.js is missing. Run npm run build before starting the AWS runtime.');
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

export async function listen(runtime, port = Number(runtime.env.PORT || 8080)) {
  const server = createServer(runtime.handler);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, runtime.env.LISTEN_HOST || (runtime.env.APP_ENV === 'local' ? '127.0.0.1' : '0.0.0.0'), resolve);
  });
  return server;
}

async function main() {
  const runtime = await createRuntime();
  const server = await listen(runtime);
  const maintenance=()=>runtime.maintain().catch(()=>console.error('Expense recurring maintenance failed; it will retry.'));
  await maintenance();
  const expenseTimer=setInterval(maintenance,60*60*1000);expenseTimer.unref();
  // Domain checks have a separate cadence; expense billing keeps its hourly timer.
  const domainTimer=setInterval(()=>runtime.maintainDomains().catch(()=>console.error('Domain check unavailable; next scheduled check will retry.')),recheckInterval(runtime.env));domainTimer.unref();
  const address = server.address();
  console.log(`website-creator listening on ${address.port} env=${runtime.env.APP_ENV} auth=${runtime.auth.mode} region=${runtime.env.AWS_REGION} bucket=${runtime.env.BUCKET.bucket || runtime.env.BUCKET.driver} openai=${OPENAI_API_ORIGIN}`);
  const shutdown = () => {
    clearInterval(expenseTimer);
    clearInterval(domainTimer);
    server.close();
    runtime.close().catch(() => {});
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  main().catch(error => {
    console.error(error.message || error);
    process.exit(1);
  });
}
