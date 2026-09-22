import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { generateKeyPairSync, sign } from 'node:crypto';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { translateSql } from '../src/aws/sql.js';
import { loadDrizzleStatements, orderMigrationStatements } from '../src/aws/ddl.js';
import { createD1Adapter } from '../src/aws/d1.js';
import { applyMigrations } from '../src/aws/migrate.js';
import { createPgliteExecutor } from '../src/aws/pglite.js';
import { createMemoryBucket, createS3Bucket, createAssets } from '../src/aws/s3.js';
import { applyAuth, authConfig, clearAuthCache, OPENAI_API_ORIGIN } from '../src/aws/auth.js';
import { assertRuntimeConfig } from '../src/aws/env.js';
import { createHandler, createRuntime, listen, rewriteSitesChrome } from '../src/aws/server.js';

const now = '2026-09-22T12:00:00.000Z';

function b64(value) {
  const raw = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value));
  return raw.toString('base64url');
}

function jwt(privateKey, header, payload) {
  const encoded = `${b64(header)}.${b64(payload)}`;
  const signature = sign(header.alg === 'RS256' ? 'RSA-SHA256' : 'sha256', Buffer.from(encoded), header.alg === 'ES256' ? { key: privateKey, dsaEncoding: 'ieee-p1363' } : privateKey);
  return `${encoded}.${b64(signature)}`;
}

function claims(extra = {}) {
  return { exp: Math.floor(Date.now() / 1000) + 600, ...extra };
}

assert.equal(
  translateSql("SELECT '?' AS q WHERE a=? AND json_extract(data,'$.revoked')=0"),
  `SELECT '?' AS "q" WHERE a=$1 AND json_extract(data,'$.revoked')='0'`
);
assert.equal(
  translateSql("SELECT json_extract(p.data,'$.displayName') AS displayName"),
  `SELECT json_extract(p.data,'$.displayName') AS "displayName"`
);
assert.equal(
  translateSql('INSERT OR IGNORE INTO health (id,data,created_at) VALUES (?,?,?)'),
  'INSERT INTO health (id,data,created_at) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING'
);
assert.equal(translateSql("SELECT json_extract(data,'$.name')=?"), "SELECT json_extract(data,'$.name')=$1");

const ordered = orderMigrationStatements(loadDrizzleStatements('drizzle'));
const tables = ordered.filter(entry => /^\s*CREATE\s+TABLE\b/i.test(entry.sql)).map(entry => entry.sql.match(/CREATE\s+TABLE\s+(\w+)/i)[1]);
assert.ok(tables.indexOf('tenants') < tables.indexOf('backups'));
assert.ok(tables.indexOf('tenants') < tables.indexOf('projects'));
assert.ok(tables.indexOf('projects') < tables.indexOf('photos'));
assert.ok(tables.indexOf('chat_threads') < tables.indexOf('chat_messages'));
assert.ok(ordered.findIndex(entry => /CREATE\s+TABLE/i.test(entry.sql)) < ordered.findIndex(entry => /ALTER\s+TABLE/i.test(entry.sql)));
assert.ok(ordered.findIndex(entry => /ALTER\s+TABLE/i.test(entry.sql)) < ordered.findIndex(entry => /CREATE\s+(UNIQUE\s+)?INDEX/i.test(entry.sql)));
assert.ok(ordered.at(-1).sql.startsWith('INSERT'));
assert.equal(ordered.some(entry => entry.sql.includes('randomblob') || entry.sql.includes('`')), false);

const previewErrors = assertRuntimeConfig({
  APP_ENV: 'preview', NODE_ENV: 'production', AWS_REGION: 'us-west-1', AUTH_MODE: 'alb-oidc',
  DATABASE_URL: 'postgresql://website_creator@localhost/website_creator', S3_BUCKET: 'buildovate-website-creator-preview',
  BUCKET_DRIVER: '', DATABASE_DRIVER: '',
});
assert.deepEqual(previewErrors, []);
assert.ok(assertRuntimeConfig({
  APP_ENV: 'production', NODE_ENV: 'production', AWS_REGION: 'us-west-1', AUTH_MODE: 'alb-oidc',
  DATABASE_URL: 'postgresql://localhost/website_creator', S3_BUCKET: 'buildovate-website-creator-preview',
}).some(error => error.includes('buildovate-website-creator-production')));
assert.ok(assertRuntimeConfig({
  APP_ENV: 'preview', NODE_ENV: 'production', AWS_REGION: 'us-west-1', AUTH_MODE: 'alb-oidc',
  DATABASE_URL: 'postgresql://localhost/website_creator', S3_BUCKET: 'buildovate-website-creator-preview', BUCKET_DRIVER: 'memory',
}).some(error => error.includes('memory')));
assert.ok(assertRuntimeConfig({
  APP_ENV: 'production', NODE_ENV: 'production', AWS_REGION: 'us-west-1', AUTH_MODE: 'dev-header',
  DATABASE_URL: 'postgresql://localhost/website_creator', S3_BUCKET: 'buildovate-website-creator-production',
}).some(error => error.includes('dev-header')));

const executor = await createPgliteExecutor();
const migrated = await applyMigrations((sql, params) => executor.query(sql, params));
assert.ok(migrated.applied > 10);
const again = await applyMigrations((sql, params) => executor.query(sql, params));
assert.equal(again.applied, 0);
const nested = await executor.query(`SELECT json_extract('{"a":{"b":"c"}}', '$.a.b') AS v`);
assert.equal(nested.rows[0].v, 'c');

const db = createD1Adapter(executor);
await db.prepare('INSERT INTO admins (user_id,email,role,created_at) VALUES (?,?,?,?)').bind('u2', 'c@d.co', 'admin', now).run();
await db.prepare('INSERT INTO workspace_records (id,scope,kind,data,created_at,updated_at) VALUES (?,?,?,?,?,?)').bind('profile-u2', 'global', 'profile', JSON.stringify({ displayName: 'Ada', photoKey: 'profiles/u2/a.jpg' }), now, now).run();
await db.prepare('INSERT INTO workspace_records (id,scope,kind,data,created_at,updated_at) VALUES (?,?,?,?,?,?)').bind('inv', 'global', 'staff_invite', JSON.stringify({ revoked: 0, usedAt: null, tokenHash: 'abc' }), now, now).run();
await db.prepare("INSERT INTO tenants (id,slug,name,settings,created_at,updated_at) VALUES (?,?,?,?,?,?)").bind('t1', 'north', 'North', JSON.stringify({ name: 'North', _restore: 'nonce' }), now, now).run();

const invite = await db.prepare("SELECT id FROM workspace_records WHERE json_extract(data,'$.revoked')=0 AND json_extract(data,'$.tokenHash')=? AND json_extract(data,'$.usedAt') IS NULL").bind('abc').first();
assert.equal(invite.id, 'inv');
const restored = await db.prepare("SELECT id FROM tenants WHERE json_extract(settings,'$._restore')=?").bind('nonce').first();
assert.equal(restored.id, 't1');
await db.prepare("UPDATE workspace_records SET data=json_set(data,'$.lastActivity',?) WHERE id=?").bind('Website inquiry', 'inv').run();
const activity = JSON.parse((await db.prepare('SELECT data FROM workspace_records WHERE id=?').bind('inv').first()).data);
assert.equal(activity.lastActivity, 'Website inquiry');
assert.equal(activity.tokenHash, 'abc');

const member = await db.prepare("SELECT 'seen-'||a.user_id AS seen, json_extract(p.data,'$.displayName') AS displayName, json_extract(p.data,'$.photoKey') IS NOT NULL AS hasPhoto FROM admins a LEFT JOIN workspace_records p ON p.id='profile-'||a.user_id AND p.kind='profile' WHERE a.user_id=?").bind('u2').first();
assert.equal(member.seen, 'seen-u2');
assert.equal(member.displayName, 'Ada');
assert.equal(Boolean(member.hasPhoto), true);

const count = await db.prepare('SELECT COUNT(*) AS n FROM admins').first();
assert.equal(count.n, 1);
assert.equal(typeof count.n, 'number');

const inserted = await db.prepare('INSERT OR IGNORE INTO health (id,data,created_at) VALUES (?,?,?)').bind('h1', '{}', now).run();
const ignored = await db.prepare('INSERT OR IGNORE INTO health (id,data,created_at) VALUES (?,?,?)').bind('h1', '{}', now).run();
assert.equal(inserted.meta.changes, 1);
assert.equal(ignored.meta.changes, 0);

const conflict = await db.prepare("INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,'global','user_seen',?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at").bind('seen-u2', JSON.stringify({ lastSeen: now }), now, now).run();
assert.equal(conflict.meta.changes, 1);

await assert.rejects(() => db.batch([
  db.prepare('INSERT INTO health (id,data,created_at) VALUES (?,?,?)').bind('h2', '{}', now),
  db.prepare('INSERT INTO health (id,data,created_at) VALUES (?,?,?)').bind('h2', '{}', now),
]));
assert.equal(await db.prepare('SELECT id FROM health WHERE id=?').bind('h2').first(), null);
assert.equal((await db.prepare('SELECT id FROM health WHERE id=?').bind('h1').first()).id, 'h1');

const memory = createMemoryBucket();
await memory.put('photos/a.jpg', new Uint8Array([1, 2, 3]), { httpMetadata: { contentType: 'image/jpeg' } });
await memory.put('backups/snap.json', '{"ok":true}', { httpMetadata: { contentType: 'application/json' } });
assert.equal(await (await memory.get('backups/snap.json')).text(), '{"ok":true}');
assert.equal((await memory.head('photos/a.jpg')).size, 3);
const copied = await memory.get('photos/a.jpg');
await memory.put('backups/copy.jpg', copied.body, { httpMetadata: { contentType: 'image/jpeg' } });
assert.deepEqual([...(await memory.get('backups/copy.jpg')).body], [1, 2, 3]);
await memory.delete('photos/a.jpg');
assert.equal(await memory.get('photos/a.jpg'), null);

const store = new Map();
const s3 = createS3Bucket({
  bucket: 'buildovate-website-creator-preview',
  region: 'us-west-1',
  client: {
    async send(command) {
      const input = command.input;
      assert.equal(input.Bucket, 'buildovate-website-creator-preview');
      if (command instanceof PutObjectCommand) {
        store.set(input.Key, { body: Buffer.from(input.Body), type: input.ContentType });
        return {};
      }
      if (command instanceof GetObjectCommand) {
        const hit = store.get(input.Key);
        if (!hit) {
          const error = new Error('missing');
          error.name = 'NoSuchKey';
          error.$metadata = { httpStatusCode: 404 };
          throw error;
        }
        return { ContentType: hit.type, Body: { async transformToByteArray() { return new Uint8Array(hit.body); } } };
      }
      if (command instanceof HeadObjectCommand) {
        const hit = store.get(input.Key);
        if (!hit) {
          const error = new Error('missing');
          error.name = 'NotFound';
          error.$metadata = { httpStatusCode: 404 };
          throw error;
        }
        return { ContentLength: hit.body.length };
      }
      if (command instanceof DeleteObjectCommand) {
        store.delete(input.Key);
        return {};
      }
      throw new Error(`Unexpected ${command.constructor.name}`);
    },
  },
});
await s3.put('health/1', 'buildovate-health', { httpMetadata: { contentType: 'text/plain' } });
assert.equal(await (await s3.get('health/1')).text(), 'buildovate-health');
assert.equal((await s3.head('health/1')).size, 'buildovate-health'.length);
await s3.delete('health/1');
assert.equal(await s3.get('health/1'), null);
assert.equal(await s3.head('health/1'), null);

const assets = createAssets('public');
const css = await assets.fetch(new Request('http://localhost/app.css'));
assert.equal(css.status, 200);
assert.match(css.headers.get('content-type'), /text\/css/);
assert.equal((await assets.fetch(new Request('http://localhost/../package.json'))).status, 404);

clearAuthCache();
const ec = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const pem = ec.publicKey.export({ type: 'spki', format: 'pem' });
const albFetch = async url => {
  assert.equal(url, 'https://public-keys.auth.elb.us-west-1.amazonaws.com/kid1');
  return new Response(pem);
};
const albConfig = { ...authConfig({ AUTH_MODE: 'alb-oidc', AWS_REGION: 'us-west-1', NODE_ENV: 'production' }), fetch: albFetch };
const albToken = jwt(ec.privateKey, { alg: 'ES256', kid: 'kid1' }, claims({ sub: 'user-1', email: 'Owner@Example.com' }));
const albRequest = await applyAuth(new Request('http://localhost/api/session', {
  headers: { 'x-amzn-oidc-data': albToken, 'oai-authenticated-user-id': 'spoof', 'oai-authenticated-user-email': 'spoof@evil.test' },
}), albConfig);
assert.equal(albRequest.headers.get('oai-authenticated-user-id'), 'user-1');
assert.equal(albRequest.headers.get('oai-authenticated-user-email'), 'owner@example.com');
assert.equal(albRequest.headers.get('x-amzn-oidc-data'), null);
const expired = await applyAuth(new Request('http://localhost/api/session', {
  headers: { 'x-amzn-oidc-data': jwt(ec.privateKey, { alg: 'ES256', kid: 'kid1' }, { sub: 'user-1', email: 'owner@example.com', exp: 10 }) },
}), albConfig);
assert.equal(expired.headers.get('oai-authenticated-user-id'), null);
const noneAlg = `${b64({ alg: 'none', kid: 'kid1' })}.${b64(claims({ sub: 'user-1', email: 'owner@example.com' }))}.`;
const rejected = await applyAuth(new Request('http://localhost/api/session', { headers: { 'x-amzn-oidc-data': noneAlg } }), albConfig);
assert.equal(rejected.headers.get('oai-authenticated-user-id'), null);

const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = rsa.publicKey.export({ format: 'jwk' });
jwk.kid = 'ck1';
jwk.alg = 'RS256';
jwk.use = 'sig';
const issuer = 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_example';
const cognitoFetch = async url => {
  assert.equal(url, `${issuer}/.well-known/jwks.json`);
  return Response.json({ keys: [jwk] });
};
const cognitoConfig = {
  ...authConfig({ AUTH_MODE: 'cognito', NODE_ENV: 'production', COGNITO_USER_POOL_ID: 'us-west-1_example', COGNITO_CLIENT_ID: 'client', COGNITO_REGION: 'us-west-1' }),
  fetch: cognitoFetch,
};
const idToken = jwt(rsa.privateKey, { alg: 'RS256', kid: 'ck1' }, claims({ sub: 'cog-1', email: 'person@example.com', token_use: 'id', aud: 'client', iss: issuer }));
const cognitoRequest = await applyAuth(new Request('http://localhost/api/session', { headers: { authorization: `Bearer ${idToken}` } }), cognitoConfig);
assert.equal(cognitoRequest.headers.get('oai-authenticated-user-id'), 'cog-1');
assert.equal(cognitoRequest.headers.get('authorization'), null);
const wrongAudience = jwt(rsa.privateKey, { alg: 'RS256', kid: 'ck1' }, claims({ sub: 'cog-1', email: 'person@example.com', token_use: 'id', aud: 'other', iss: issuer }));
const audienceRejected = await applyAuth(new Request('http://localhost/api/session', { headers: { authorization: `Bearer ${wrongAudience}` } }), cognitoConfig);
assert.equal(audienceRejected.headers.get('oai-authenticated-user-id'), null);

const devOk = await applyAuth(new Request('http://localhost/api/session', {
  headers: { 'x-buildovate-user-id': 'local-1', 'x-buildovate-user-email': 'Dev@Example.com', 'oai-authenticated-user-id': 'spoof' },
}), authConfig({ AUTH_MODE: 'dev-header', NODE_ENV: 'development' }));
assert.equal(devOk.headers.get('oai-authenticated-user-id'), 'local-1');
assert.equal(devOk.headers.get('oai-authenticated-user-email'), 'dev@example.com');
const devBlocked = await applyAuth(new Request('http://localhost/api/session', {
  headers: { 'x-buildovate-user-id': 'local-1', 'x-buildovate-user-email': 'dev@example.com' },
}), authConfig({ AUTH_MODE: 'dev-header', NODE_ENV: 'production' }));
assert.equal(devBlocked.headers.get('oai-authenticated-user-id'), null);

const httpDb = await createPgliteExecutor();
const runtime = await createRuntime({
  executor: httpDb,
  env: {
    APP_ENV: 'local',
    NODE_ENV: 'development',
    AUTH_MODE: 'dev-header',
    DATABASE_DRIVER: 'pglite',
    BUCKET_DRIVER: 'memory',
    AWS_REGION: 'us-west-1',
    PORT: '0',
    MIGRATE_ON_BOOT: '1',
  },
});
const server = await listen(runtime, 0);
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
try {
  const health = await fetch(`${base}/healthz`);
  assert.equal(health.status, 200);
  const healthBody = await health.json();
  assert.equal(healthBody.ok, true);
  assert.equal(healthBody.database.ok, true);
  assert.equal(healthBody.environment, 'local');
  assert.equal(healthBody.openai.origin, OPENAI_API_ORIGIN);

  const spoof = await fetch(`${base}/api/session`, { headers: { 'oai-authenticated-user-id': 'admin', 'oai-authenticated-user-email': 'yoelengel18@gmail.com' } });
  assert.equal((await spoof.json()).user, null);

  const ownerHeaders = {
    origin: base,
    'content-type': 'application/json',
    'x-buildovate-user-id': 'owner',
    'x-buildovate-user-email': 'yoelengel18@gmail.com',
  };
  const setup = await fetch(`${base}/api/setup`, { method: 'POST', headers: ownerHeaders, body: '{}' });
  assert.equal(setup.status, 200, await setup.clone().text());

  const session = await fetch(`${base}/api/session`, { headers: { 'x-buildovate-user-id': 'owner', 'x-buildovate-user-email': 'YoelEngel18@gmail.com' } });
  const sessionBody = await session.json();
  assert.equal(sessionBody.user.email, 'yoelengel18@gmail.com');
  assert.equal(sessionBody.user.admin, true);

  const created = await fetch(`${base}/api/tenants`, {
    method: 'POST',
    headers: ownerHeaders,
    body: JSON.stringify({ preset: 'robles', slug: 'roof-aws' }),
  });
  assert.equal(created.status, 200, await created.clone().text());
  assert.equal((await created.json()).tenant.slug, 'roof-aws');
  assert.equal((await fetch(`${base}/s/roof-aws`)).status, 404);
  const missing = await (await fetch(`${base}/s/roof-aws`)).text();
  assert.match(missing, /Sign in required/);
  assert.doesNotMatch(missing, /signin-with-chatgpt|Sign in with ChatGPT/);

  const home = await fetch(`${base}/`);
  const homeHtml = await home.text();
  assert.equal(home.status, 200);
  assert.match(homeHtml, /Website management/);
  assert.match(homeHtml, /Sign in required/);
  assert.doesNotMatch(homeHtml, /signout-with-chatgpt|Sign in with ChatGPT/);
  assert.equal(
    rewriteSitesChrome('<a target="_top" href="/signout-with-chatgpt?return_to=%2F">Sign out</a>', { logoutUrl: 'https://example.com/logout?return=1' }),
    '<a href="https://example.com/logout?return=1">Sign out</a>'
  );

  const check = await fetch(`${base}/api/health`, { method: 'POST', headers: ownerHeaders });
  const checkBody = await check.json();
  assert.equal(check.status, 200, JSON.stringify(checkBody));
  assert.equal(checkBody.check.database.ok, true);
  assert.equal(checkBody.check.storage.ok, true);

  const stylesheet = await fetch(`${base}/app.css`);
  assert.equal(stylesheet.status, 200);
  assert.match(stylesheet.headers.get('content-type'), /text\/css/);
  const robots = await fetch(`${base}/robots.txt`);
  assert.match(await robots.text(), /Disallow/);
} finally {
  await new Promise(resolve => server.close(resolve));
  await runtime.close();
}

const down = createServer(createHandler({
  worker: { async fetch() { throw new Error('unused'); } },
  env: { APP_ENV: 'local', AWS_REGION: 'us-west-1' },
  db: { prepare() { return { async first() { throw new Error('database offline'); } }; } },
  auth: { mode: 'disabled' },
}));
await new Promise(resolve => down.listen(0, '127.0.0.1', resolve));
try {
  const failed = await fetch(`http://127.0.0.1:${down.address().port}/healthz`);
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).database.ok, false);
} finally {
  await new Promise(resolve => down.close(resolve));
}

const egress = await fetch(`${OPENAI_API_ORIGIN}/v1/models`, {
  headers: { authorization: 'Bearer test-not-a-secret' },
  signal: AbortSignal.timeout(15000),
});
assert.equal(egress.status, 401);
await egress.body?.cancel();

await executor.close();
console.log('PASS: SQL translation, Postgres migrations, D1 adapter, S3 shim, ALB/Cognito/dev auth, /healthz, static assets, OpenAI egress.');
