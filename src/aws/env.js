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
    NODE_ENV: source.NODE_ENV || 'development',
    AWS_REGION: source.AWS_REGION || REGION,
    PORT: source.PORT || '8080',
    AUTH_MODE: source.AUTH_MODE || '',
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
  return errors;
}
