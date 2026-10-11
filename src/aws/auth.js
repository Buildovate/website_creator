import { createPublicKey, verify } from 'node:crypto';

// The Worker still reads oai-authenticated-user-* (the ChatGPT Sites contract).
// On AWS those headers are stripped from the client and set only after one of
// the modes below succeeds. Platform roles stay in the admins/members tables;
// the IdP only proves user id and email.

const ID_HEADER = 'oai-authenticated-user-id';
const EMAIL_HEADER = 'oai-authenticated-user-email';
const SKEW_MS = 60_000;
const keyCache = new Map();

export function authMode(env) {
  if (env.AUTH_MODE) return env.AUTH_MODE;
  return env.NODE_ENV === 'production' ? 'alb-oidc' : 'dev-header';
}

export function authConfig(env, fetchImpl = globalThis.fetch) {
  return {
    mode: authMode(env),
    appEnv: env.APP_ENV || 'local',
    sessionTtl: Number(env.AUTH_SESSION_TTL_SECONDS || 3600),
    albSigner: env.AUTH_ALB_SIGNER || '',
    albCookieName: env.AUTH_ALB_COOKIE_NAME || 'AWSELBAuthSessionCookie',
    oidcClientId: env.AUTH_OIDC_CLIENT_ID || '',
    nodeEnv: env.NODE_ENV || 'development',
    allowDevHeaders: env.AUTH_ALLOW_DEV_HEADERS === '1',
    region: env.AWS_REGION || 'us-west-1',
    issuer: env.AUTH_OIDC_ISSUER || '',
    userPoolId: env.COGNITO_USER_POOL_ID || '',
    clientId: env.COGNITO_CLIENT_ID || '',
    cognitoRegion: env.COGNITO_REGION || env.AWS_REGION || 'us-west-1',
    logoutUrl: safeHttpUrl(env.AUTH_LOGOUT_URL),
    fetch: fetchImpl,
  };
}

function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.href;
  } catch {
    return '';
  }
}

function cleanId(value) {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  if (!id || id.length > 200 || /[\u0000-\u001f\u007f]/.test(id)) return null;
  return id;
}

function cleanEmail(value) {
  if (value == null || value === '') return '';
  const email = String(value).trim().toLowerCase();
  if (!email) return '';
  if (email.length > 320 || /[\u0000-\u001f\u007f\s]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function identity(sub, emailClaim, username) {
  const id = cleanId(sub);
  if (!id) return null;
  const email = cleanEmail(emailClaim || (typeof username === 'string' && username.includes('@') ? username : ''));
  if (email == null) return null;
  if (!email) return null;
  return { id, email };
}

function decodePart(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

function timingOk(payload) {
  const now = Date.now();
  if (payload.nbf !== undefined && (!Number.isFinite(Number(payload.nbf)) || Number(payload.nbf) * 1000 - SKEW_MS > now)) return false;
  if (!Number.isFinite(Number(payload.exp)) || Number(payload.exp) <= 0 || Number(payload.exp) * 1000 + SKEW_MS < now) return false;
  return true;
}

function verifySignature(alg, signingInput, signature, key) {
  if (alg === 'ES256') return verify('sha256', Buffer.from(signingInput), { key, dsaEncoding: 'ieee-p1363' }, signature);
  if (alg === 'RS256') return verify('RSA-SHA256', Buffer.from(signingInput), key, signature);
  return false;
}

async function cached(keyId, loader) {
  const hit = keyCache.get(keyId);
  if (hit && hit.until > Date.now()) return hit.value;
  const value = await loader();
  if (keyCache.size >= 128) keyCache.delete(keyCache.keys().next().value);
  keyCache.set(keyId, { value, until: Date.now() + 60 * 60 * 1000 });
  return value;
}

export function clearAuthCache() {
  keyCache.clear();
}

async function verifiedClaims(token, { algAllowed, keyFor, issuer, alb }) {
  if (typeof token !== 'string' || token.length < 20 || token.length > 16000) return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(part => !part)) return null;
  let header;
  let payload;
  try {
    header = decodePart(parts[0]);
    payload = decodePart(parts[1]);
  } catch {
    return null;
  }
  if (!header || header.alg === 'none' || !algAllowed.includes(header.alg) || !header.kid) return null;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const timing = alb ? header : payload;
  if (!timingOk(timing)) return null;
  if (issuer && timing.iss !== issuer) return null;
  if (alb && (header.signer !== alb.signer || header.client !== alb.client)) return null;
  let key;
  try {
    key = await keyFor(header.kid);
  } catch (error) {
    console.warn('Auth key lookup failed');
    return null;
  }
  const signature = Buffer.from(parts[2], 'base64url');
  try { if (!verifySignature(header.alg, `${parts[0]}.${parts[1]}`, signature, key)) return null; }
  catch { return null; }
  return payload;
}

async function albUser(headers, config) {
  const token = headers.get('x-amzn-oidc-data');
  if (!token || !config.albSigner || !config.issuer || !config.oidcClientId) return null;
  const payload = await verifiedClaims(token, {
    alb: { signer: config.albSigner, client: config.oidcClientId },
    algAllowed: ['ES256'],
    issuer: config.issuer,
    async keyFor(kid) {
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(kid)) throw new Error('Unexpected ALB key id');
      const pem = await cached(`alb:${config.region}:${kid}`, async () => {
        const response = await config.fetch(`https://public-keys.auth.elb.${config.region}.amazonaws.com/${kid}`, {signal:AbortSignal.timeout(5000)});
        if (!response.ok) throw new Error(`ALB public key HTTP ${response.status}`);
        return response.text();
      });
      return createPublicKey(pem);
    },
  });
  if (!payload || ![true,'true'].includes(payload.email_verified)) return null;
  return identity(payload.sub, payload.email);
}

async function cognitoUser(headers, config) {
  if (!config.userPoolId || !config.clientId || !/^[a-z]{2}-[a-z]+-\d_[A-Za-z0-9]+$/.test(config.userPoolId)) {
    console.warn('Cognito configuration is incomplete');
    return null;
  }
  const header = headers.get('authorization') || '';
  const token = header.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return null;
  const issuer = `https://cognito-idp.${config.cognitoRegion}.amazonaws.com/${config.userPoolId}`;
  const payload = await verifiedClaims(token, {
    algAllowed: ['RS256'],
    issuer,
    async keyFor(kid) {
      if (typeof kid !== 'string' || kid.length > 200) throw new Error('Invalid key id');
      const cacheKey = `cognito:${issuer}`;
      const loader = async () => {
        const response = await config.fetch(`${issuer}/.well-known/jwks.json`, {signal:AbortSignal.timeout(5000)});
        if (!response.ok) throw new Error('JWKS unavailable');
        return response.json();
      };
      let jwks = await cached(cacheKey, loader);
      let jwk = jwks.keys?.find(key => key.kid === kid && key.kty === 'RSA' && (!key.use || key.use === 'sig') && (!key.alg || key.alg === 'RS256'));
      const refreshKey = cacheKey + ':refresh';
      if (!jwk && (!keyCache.get(refreshKey) || keyCache.get(refreshKey).until < Date.now())) {
        keyCache.set(refreshKey,{value:null,until:Date.now()+30_000});
        keyCache.delete(cacheKey);
        jwks = await cached(cacheKey,loader);
        jwk = jwks.keys?.find(key => key.kid === kid && key.kty === 'RSA' && (!key.use || key.use === 'sig') && (!key.alg || key.alg === 'RS256'));
      }
      if (!jwk) throw new Error('Cognito signing key not found');
      return createPublicKey({ key: jwk, format: 'jwk' });
    },
  });
  if (!payload || payload.token_use !== 'id' || payload.email_verified !== true) return null;
  if (payload.aud !== config.clientId) return null;
  return identity(payload.sub, payload.email);
}

function devUser(headers, config) {
  if (config.appEnv !== 'local') return null;
  if (config.nodeEnv === 'production' && !config.allowDevHeaders) return null;
  const id = headers.get('x-buildovate-user-id');
  if (!id) return null;
  return identity(id, headers.get('x-buildovate-user-email'));
}

export async function resolveUser(headers, config) {
  if (config.mode === 'disabled') return null;
  if (config.mode === 'dev-header') return devUser(headers, config);
  if (config.mode === 'alb-oidc') return albUser(headers, config);
  if (config.mode === 'cognito') return cognitoUser(headers, config);
  const error = new Error(`Unsupported AUTH_MODE "${config.mode}"`);
  error.code = 'AUTH_CONFIG';
  throw error;
}

export async function applyAuth(request, config, resolvedUser = undefined) {
  const headers = new Headers(request.headers);
  headers.delete(ID_HEADER);
  headers.delete(EMAIL_HEADER);
  const user = resolvedUser === undefined ? await resolveUser(headers, config) : resolvedUser;
  for (const key of [...headers.keys()]) if (key.startsWith('oai-authenticated-user-') || key.startsWith('x-buildovate-')) headers.delete(key);
  headers.delete('x-amzn-oidc-data');
  headers.delete('x-amzn-oidc-identity');
  headers.delete('x-amzn-oidc-accesstoken');
  headers.delete('authorization');
  if (user) {
    headers.set(ID_HEADER, user.id);
    headers.set(EMAIL_HEADER, user.email);
  }
  return new Request(request, { headers });
}

export const OPENAI_API_ORIGIN = 'https://api.openai.com';
