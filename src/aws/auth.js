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
  if (payload.nbf && payload.nbf * 1000 - SKEW_MS > now) return false;
  if (!payload.exp || payload.exp * 1000 + SKEW_MS < now) return false;
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
  keyCache.set(keyId, { value, until: Date.now() + 60 * 60 * 1000 });
  return value;
}

export function clearAuthCache() {
  keyCache.clear();
}

async function verifiedClaims(token, { algAllowed, keyFor, issuer }) {
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
  if (!payload || typeof payload !== 'object' || !timingOk(payload)) return null;
  if (issuer && payload.iss !== issuer) return null;
  let key;
  try {
    key = await keyFor(header.kid);
  } catch (error) {
    console.warn('Auth key lookup failed', error.message || error);
    return null;
  }
  const signature = Buffer.from(parts[2], 'base64url');
  const ok = verifySignature(header.alg, `${parts[0]}.${parts[1]}`, signature, key);
  if (!ok) return null;
  return payload;
}

async function albUser(headers, config) {
  const token = headers.get('x-amzn-oidc-data');
  if (!token) return null;
  const payload = await verifiedClaims(token, {
    algAllowed: ['ES256'],
    issuer: config.issuer,
    async keyFor(kid) {
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(kid)) throw new Error('Unexpected ALB key id');
      const pem = await cached(`alb:${config.region}:${kid}`, async () => {
        const response = await config.fetch(`https://public-keys.auth.elb.${config.region}.amazonaws.com/${kid}`);
        if (!response.ok) throw new Error(`ALB public key HTTP ${response.status}`);
        return response.text();
      });
      return createPublicKey(pem);
    },
  });
  if (!payload) return null;
  return identity(payload.sub, payload.email, payload.username || payload['cognito:username']);
}

async function cognitoUser(headers, config) {
  if (!config.userPoolId) {
    console.warn('AUTH_MODE=cognito requires COGNITO_USER_POOL_ID');
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
      const jwks = await cached(`cognito:${issuer}`, async () => {
        const response = await config.fetch(`${issuer}/.well-known/jwks.json`);
        if (!response.ok) throw new Error(`Cognito JWKS HTTP ${response.status}`);
        return response.json();
      });
      const jwk = jwks.keys?.find(key => key.kid === kid);
      if (!jwk) throw new Error('Cognito signing key not found');
      return createPublicKey({ key: jwk, format: 'jwk' });
    },
  });
  if (!payload || payload.token_use !== 'id') return null;
  if (config.clientId && payload.aud !== config.clientId) return null;
  return identity(payload.sub, payload.email, payload['cognito:username']);
}

function devUser(headers, config) {
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

export async function applyAuth(request, config) {
  const headers = new Headers(request.headers);
  headers.delete(ID_HEADER);
  headers.delete(EMAIL_HEADER);
  const user = await resolveUser(headers, config);
  headers.delete('x-amzn-oidc-data');
  headers.delete('x-amzn-oidc-identity');
  headers.delete('x-amzn-oidc-accesstoken');
  if (config.mode === 'cognito') headers.delete('authorization');
  if (user) {
    headers.set(ID_HEADER, user.id);
    headers.set(EMAIL_HEADER, user.email);
  }
  return new Request(request, { headers });
}

export const OPENAI_API_ORIGIN = 'https://api.openai.com';
