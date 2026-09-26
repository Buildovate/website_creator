export const REGION = 'us-west-1';
export const ACCOUNT = '846588355042';

export const BUCKETS = {
  preview: 'buildovate-website-creator-preview',
  production: 'buildovate-website-creator-production',
};

export const EB_APPS = {
  preview: 'buildovate-website-creator-preview',
  production: 'buildovate-website-creator-production',
};

export const EB_ENVS = {
  preview: 'website-creator-preview',
  production: 'website-creator-production',
};

const PASSTHROUGH = [
  'EXPENSE_VAULT_KEY',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'OPENAI_CHAT_MODEL',
  'GOOGLE_PLACES_API_KEY',
  'YELP_API_KEY',
  'ZOOM_ACCOUNT_ID',
  'ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET',
  'ZOOM_HOST_USER_ID',
  'RESEND_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
];

export function loadEnv(source = process.env) {
  const env = {
    APP_ENV: source.APP_ENV || 'local',
    WORKSPACE_OWNER_EMAIL: source.WORKSPACE_OWNER_EMAIL || '',
    NODE_ENV: source.NODE_ENV || 'development',
    AWS_REGION: source.AWS_REGION || REGION,
    PORT: source.PORT || '8080',
    LISTEN_HOST: source.LISTEN_HOST || (source.APP_ENV && source.APP_ENV !== 'local' ? '0.0.0.0' : '127.0.0.1'),
    AUTH_MODE: source.AUTH_MODE || '',
    AUTH_SESSION_TTL_SECONDS: source.AUTH_SESSION_TTL_SECONDS || '3600',
    APP_ORIGIN: source.APP_ORIGIN || '',
    AUTH_ALB_SIGNER: source.AUTH_ALB_SIGNER || '',
    AUTH_ALB_COOKIE_NAME: source.AUTH_ALB_COOKIE_NAME || 'AWSELBAuthSessionCookie',
    AUTH_OIDC_CLIENT_ID: source.AUTH_OIDC_CLIENT_ID || '',
    AUTH_ALLOW_DEV_HEADERS: source.AUTH_ALLOW_DEV_HEADERS || '',
    AUTH_OIDC_ISSUER: source.AUTH_OIDC_ISSUER || '',
    COGNITO_USER_POOL_ID: source.COGNITO_USER_POOL_ID || '',
    COGNITO_CLIENT_ID: source.COGNITO_CLIENT_ID || '',
    COGNITO_REGION: source.COGNITO_REGION || '',
    AUTH_LOGOUT_URL: source.AUTH_LOGOUT_URL || '',
    DATABASE_URL: source.DATABASE_URL || '',
    DATABASE_DRIVER: source.DATABASE_DRIVER || '',
    PGLITE_DATA_DIR: source.PGLITE_DATA_DIR || '',
    PGSSLMODE: source.PGSSLMODE || '',
    PGSSL_REJECT_UNAUTHORIZED: source.PGSSL_REJECT_UNAUTHORIZED || '',
    PG_POOL_MAX: source.PG_POOL_MAX || '',
    S3_BUCKET: source.S3_BUCKET || '',
    S3_ENDPOINT: source.S3_ENDPOINT || '',
    S3_FORCE_PATH_STYLE: source.S3_FORCE_PATH_STYLE || '',
    S3_ACCESS_KEY_ID: source.S3_ACCESS_KEY_ID || '',
    S3_SECRET_ACCESS_KEY: source.S3_SECRET_ACCESS_KEY || '',
    BUCKET_DRIVER: source.BUCKET_DRIVER || '',
    MIGRATE_ON_BOOT: source.MIGRATE_ON_BOOT || '',
    ASSETS_ROOT: source.ASSETS_ROOT || '',
    GEOIP_DB_PATH: source.GEOIP_DB_PATH || '',
    GEOIP_TRUSTED_PROXIES: source.GEOIP_TRUSTED_PROXIES || '',
  };
  for (const key of PASSTHROUGH) if (source[key]) env[key] = source[key];
  return env;
}

export function assertRuntimeConfig(env) {
  const errors = [];
  if (!['local', 'preview', 'production'].includes(env.APP_ENV)) errors.push(`APP_ENV must be local, preview, or production (received ${env.APP_ENV})`);
  if (env.APP_ENV === 'preview' || env.APP_ENV === 'production') {
    if (env.BUCKET_DRIVER === 'memory') errors.push('BUCKET_DRIVER=memory is only for APP_ENV=local');
    if (env.DATABASE_DRIVER === 'pglite') errors.push('DATABASE_DRIVER=pglite is only for APP_ENV=local');
    if (env.S3_BUCKET !== BUCKETS[env.APP_ENV]) errors.push(`S3_BUCKET must be ${BUCKETS[env.APP_ENV]} for APP_ENV=${env.APP_ENV}`);
    if (env.AWS_REGION !== REGION) errors.push(`AWS_REGION must be ${REGION} for the existing website_creator buckets`);
  }
  if (env.NODE_ENV === 'production' && env.DATABASE_DRIVER === 'pglite') errors.push('DATABASE_DRIVER=pglite cannot be used when NODE_ENV=production');
  if (env.NODE_ENV === 'production' && env.BUCKET_DRIVER === 'memory') errors.push('BUCKET_DRIVER=memory cannot be used when NODE_ENV=production');
  if (env.DATABASE_DRIVER === 'pglite') {
    if (env.APP_ENV !== 'local') errors.push('DATABASE_DRIVER=pglite is local only');
  } else if (!env.DATABASE_URL) errors.push('DATABASE_URL is required');
  if (env.BUCKET_DRIVER !== 'memory' && !env.S3_BUCKET && env.APP_ENV !== 'local') errors.push('S3_BUCKET is required');
  if (env.APP_ENV !== 'local') {
    if (env.S3_ENDPOINT) errors.push('S3_ENDPOINT is only allowed when APP_ENV=local');
    if (env.S3_ACCESS_KEY_ID || env.S3_SECRET_ACCESS_KEY) errors.push('S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are only allowed when APP_ENV=local');
  }
  if ((env.S3_ACCESS_KEY_ID && !env.S3_SECRET_ACCESS_KEY) || (!env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY)) {
    errors.push('S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must both be set');
  }
  if (env.AUTH_MODE && !['alb-oidc', 'cognito', 'dev-header', 'disabled'].includes(env.AUTH_MODE)) errors.push(`Unsupported AUTH_MODE ${env.AUTH_MODE}`);
  if (env.AUTH_MODE === 'dev-header' && env.NODE_ENV === 'production' && env.AUTH_ALLOW_DEV_HEADERS !== '1') {
    errors.push('AUTH_MODE=dev-header is refused when NODE_ENV=production unless AUTH_ALLOW_DEV_HEADERS=1 is set deliberately');
  }
  const mode = env.AUTH_MODE || (env.NODE_ENV === 'production' ? 'alb-oidc' : 'dev-header');
  if (mode === 'dev-header' && env.APP_ENV !== 'local') errors.push('AUTH_MODE=dev-header is local only');
  const ttl = Number(env.AUTH_SESSION_TTL_SECONDS || 3600);
  if (!Number.isInteger(ttl) || ttl < 60 || ttl > 86400) errors.push('AUTH_SESSION_TTL_SECONDS must be 60–86400');
  if (env.APP_ENV !== 'local' && mode !== 'disabled' && !env.APP_ORIGIN) errors.push('APP_ORIGIN is required for shared authentication');
  if (env.APP_ORIGIN) {
    try {
      const url = new URL(env.APP_ORIGIN);
      if (!['http:','https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) errors.push('APP_ORIGIN must be an origin without credentials, path, query or fragment');
      if (env.APP_ENV !== 'local' && url.protocol !== 'https:') errors.push('Shared APP_ORIGIN requires HTTPS');
      if (env.APP_ENV === 'local' && !['localhost','127.0.0.1','[::1]'].includes(url.hostname)) errors.push('Local APP_ORIGIN must use loopback');
    } catch { errors.push('APP_ORIGIN must be a valid origin'); }
  }
  if (mode === 'alb-oidc' && !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(env.AUTH_ALB_COOKIE_NAME || 'AWSELBAuthSessionCookie')) errors.push('Invalid AUTH_ALB_COOKIE_NAME');
  if (mode === 'cognito' && (!env.COGNITO_USER_POOL_ID || !env.COGNITO_CLIENT_ID)) errors.push('Cognito requires COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID');
  if (mode === 'alb-oidc' && (!env.AUTH_ALB_SIGNER || !env.AUTH_OIDC_ISSUER || !env.AUTH_OIDC_CLIENT_ID)) errors.push('ALB requires AUTH_ALB_SIGNER, AUTH_OIDC_ISSUER and AUTH_OIDC_CLIENT_ID');
  return errors;
}
