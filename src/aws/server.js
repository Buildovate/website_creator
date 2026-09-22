import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';
import { applyAuth, authConfig, OPENAI_API_ORIGIN } from './auth.js';
import { assertRuntimeConfig, loadEnv } from './env.js';
import { createD1Adapter } from './d1.js';
import { applyMigrations } from './migrate.js';
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

export function requestUrl(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost').split(',')[0].trim();
  return `${proto}://${host}${req.url}`;
}

async function databaseOk(db) {
  const started = Date.now();
  const row = await db.prepare('SELECT 1 AS ok').first();
  if (!row || Number(row.ok) !== 1) throw new Error('Unexpected database probe result');
  return Date.now() - started;
}

export function createHandler({ worker, env, db, auth }) {
  return async function handle(req, res) {
    const url = new URL(requestUrl(req));
    try {
      if (url.pathname === '/healthz') {
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
      const authed = await applyAuth(new Request(url, { headers }), auth);
      const method = req.method || 'GET';
      const hasBody = method !== 'GET' && method !== 'HEAD';
      const request = new Request(url, {
        method,
        headers: authed.headers,
        body: hasBody ? Readable.toWeb(req) : undefined,
        ...(hasBody ? { duplex: 'half' } : {}),
      });
      const response = await worker.fetch(request, env);
      await writeResponse(res, response, auth);
    } catch (error) {
      console.error('Request failed', url.pathname, error);
      if (!res.headersSent) sendJson(res, error.code === 'AUTH_CONFIG' ? 500 : 503, { error: 'Service temporarily unavailable.' });
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
  out = out.replaceAll(/href="\/signin-with-chatgpt\?[^"]*"/g, 'href="/"');
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
    Readable.fromWeb(response.body).pipe(res).on('finish', resolve).on('error', reject);
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
  const bucket = options.bucket || await createBucket(env);
  const assetsRoot = env.ASSETS_ROOT || (existsSync('dist/client') ? 'dist/client' : 'public');
  const runtimeEnv = { ...env, DB: db, BUCKET: bucket, ASSETS: createAssets(path.resolve(assetsRoot)) };
  const worker = options.worker || await loadWorker();
  const auth = options.auth || authConfig(runtimeEnv);
  return {
    env: runtimeEnv,
    executor,
    auth,
    handler: createHandler({ worker, env: runtimeEnv, db, auth }),
    async close() { await executor.close?.(); },
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
    server.listen(port, '0.0.0.0', resolve);
  });
  return server;
}

async function main() {
  const runtime = await createRuntime();
  const server = await listen(runtime);
  const address = server.address();
  console.log(`website-creator listening on ${address.port} env=${runtime.env.APP_ENV} auth=${runtime.auth.mode} region=${runtime.env.AWS_REGION} bucket=${runtime.env.BUCKET.bucket || runtime.env.BUCKET.driver} openai=${OPENAI_API_ORIGIN}`);
  const shutdown = () => {
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
