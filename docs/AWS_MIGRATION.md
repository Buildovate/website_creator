# AWS runtime for the website creator

The website creator is the Worker in `src/worker.js`. ChatGPT Sites runs that Worker with D1 (`env.DB`), R2 (`env.BUCKET`), optional `env.ASSETS`, and trusted identity headers. This document is the AWS path for the same Worker. It does not describe the Laravel/Nuxt CRM, and it does not reuse CRM infrastructure.

Account `846588355042`, region `us-west-1`.

Do not use:

- Elastic Beanstalk applications `buildovate-staging` or `buildovate-production`
- CRM Aurora databases

Create instead:

| | Preview | Production |
|---|---|---|
| Elastic Beanstalk application | `buildovate-website-creator-preview` | `buildovate-website-creator-production` |
| Elastic Beanstalk environment | `website-creator-preview` | `website-creator-production` |
| Postgres (new RDS, not Aurora CRM) | `website-creator-preview-postgres` | `website-creator-production-postgres` |
| Database name | `website_creator` | `website_creator` |
| S3 (already exists; do not recreate) | `arn:aws:s3:::buildovate-website-creator-preview` | `arn:aws:s3:::buildovate-website-creator-production` |
| Config template | `aws/env/preview.env.example` | `aws/env/production.env.example` |

DNS for `preview.website.buildovate.com` and `website.buildovate.com` is manual and is not part of this change. Keep the Site deployment in place until preview has been checked on AWS.

## Runtime

`src/aws/server.js` is a Node HTTP server. It turns each incoming request into a Fetch `Request`, calls the built Worker `dist/server/index.js` (`fetch(request, env)`), and writes the `Response` back. Outbound `fetch` is Node's global fetch, so calls to `https://api.openai.com` leave the instance over normal HTTPS. No Sites proxy is in that path. The instance security group must allow outbound TCP 443.

`/healthz` runs `SELECT 1` and returns 200 only when Postgres answers. It does not write a row and it does not call OpenAI. Elastic Beanstalk should use that path (`.ebextensions/healthcheck.config` sets `HealthCheckPath` to `/healthz`). `/` stays a public HTML shell and is not a database check. The existing authenticated `POST /api/health` still probes database and object storage together.

Scripts:

- `npm run build` — Worker bundle and `dist/client` static files
- `npm run aws:migrate` — apply Postgres migrations
- `npm run aws:start` — listen on `PORT` (default `8080`)
- `npm run test:aws` — adapter tests

The container image is the supported deploy artifact (`Dockerfile`, Node 22, port 8080). `Procfile` is only for an EB Node.js platform zip; prefer the Docker platform.

## Database

Drizzle still authors SQLite migrations in `drizzle/`. The AWS migrator (`src/aws/migrate.js`) rewrites them:

- backticks removed, `ALTER TABLE ... ADD` becomes `ADD COLUMN`
- `CREATE TABLE` statements ordered so PostgreSQL foreign keys point at tables that already exist (SQLite allowed forward references; Postgres does not)
- `json_extract` and `json_set` created in `aws/postgres/000_sqlite_compat.sql`
- `randomblob` / `strftime` in the seed migration rewritten to Postgres functions
- applied statements recorded in `schema_migrations`

The query adapter (`src/aws/d1.js`) keeps the Worker SQL unchanged:

- `?` placeholders become `$1`, `$2`, … (not inside string literals)
- `INSERT OR IGNORE` becomes `INSERT ... ON CONFLICT DO NOTHING`
- `json_extract(...) = 0` compares text, matching SQLite's loose comparison
- `AS displayName` is quoted so PostgreSQL does not fold the alias to lowercase (SQLite kept that casing)
- `prepare().bind().first/all/run` and `batch()` match the D1 calls in `src/core.js`, including `meta.changes` and rollback of the whole batch

`COUNT(*)` is parsed as a JavaScript number. Tables stay `text` / `integer` columns; JSON is stored as text and read with `JSON.parse`, the same as D1.

Preview may set `MIGRATE_ON_BOOT=1`. Production should run `npm run aws:migrate` as a release step with `MIGRATE_ON_BOOT=0`, then shift traffic. Use a Postgres role that can create tables. Take a snapshot before the first production migration. There is no online data copy from D1 in this change; preview and production start empty unless you load a dump separately.

Local development has two paths, both `APP_ENV=local`. The quick path sets `DATABASE_DRIVER=pglite` (devDependency, in-process Postgres) and `BUCKET_DRIVER=memory`. The Docker Compose path uses Postgres 16 and MinIO (`docker compose up --build`). `pglite` is refused when `APP_ENV` is `preview` or `production`, and when `NODE_ENV=production`. Commands, ports, and where to put `OPENAI_API_KEY` are in `docs/ENVIRONMENTS.md`.

RDS notes:

- PostgreSQL 16, private subnets, not publicly accessible
- inbound 5432 only from the Elastic Beanstalk instance security group
- `PGSSLMODE=require`
- `PGSSL_REJECT_UNAUTHORIZED=0` until the Amazon RDS CA bundle is added to the image (the connection is still encrypted)
- store `DATABASE_URL` in the EB environment or Secrets Manager, never in git

## Object storage

`src/aws/s3.js` implements the R2 methods the Worker calls: `get`, `put`, `head`, `delete`. `put` accepts strings, byte arrays, and the body returned by `get` (backup copies). The AWS SDK default credential chain is used, so an instance role is enough on Elastic Beanstalk. Do not put access keys in `aws/env/preview.env.example` or `aws/env/production.env.example`.

The Docker Compose stack points the same client at MinIO. `S3_ENDPOINT`, `S3_FORCE_PATH_STYLE`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY` are loaded from the environment and refused unless `APP_ENV=local`. With an endpoint set, the client uses path-style URLs and calculates checksums only when the operation requires them, which is what this MinIO release accepts. Unset, the client stays region-only, which is the preview and production shape. LocalStack is not used.

Preview instance role, bucket only:

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
  "Resource": "arn:aws:s3:::buildovate-website-creator-preview/*"
}
```

Production uses the same actions on `arn:aws:s3:::buildovate-website-creator-production/*`. The app refuses to boot when `APP_ENV=preview` or `production` and `S3_BUCKET` is not the bucket for that environment. `BUCKET_DRIVER=memory` is local only.

`env.ASSETS` reads files from `dist/client` (the built `public/` tree) and rejects paths that escape that directory.

## Auth

The Worker still calls `person()` / `identity()` in `src/core.js`, which read `oai-authenticated-user-id` and `oai-authenticated-user-email`. On AWS those headers are deleted from the incoming request and set again only when the adapter accepts an identity. Sending the Sites headers yourself does nothing. The ChatGPT “Sign in with ChatGPT” link and the sidebar sign-out control are rewritten on this server only. The link text becomes “Sign in required”. Sign-out points at `AUTH_LOGOUT_URL` when that is an http(s) URL (use the Cognito or ALB logout URL); otherwise the page says sign-out is handled by the identity provider. The Worker source is unchanged, so the Site keeps its original links.

The identity provider does not grant platform roles. After sign-in, `/api/setup` and the existing invite tables decide who is an administrator, owner, editor, or viewer. The IdP must supply a stable `sub` and an `email` claim. Email is stored lowercased and must match invitation email, the same rule as Sites.

### `alb-oidc` (preview and production default)

Put the environment behind an Application Load Balancer with an HTTPS listener and an OIDC authenticate action (Cognito or another OIDC provider). The load balancer verifies the user and sets `x-amzn-oidc-data`. Elastic Beanstalk's proxy forwards that header. The adapter:

1. Requires `alg` `ES256`, a `kid`, and an unexpired `exp` (60 second skew).
2. Fetches the matching public key from `https://public-keys.auth.elb.us-west-1.amazonaws.com/{kid}` and verifies the signature.
3. If `AUTH_OIDC_ISSUER` is set, requires the token `iss` to match it.
4. Maps `sub` and `email` onto the Worker headers, then drops the load-balancer token headers.

Security group: the instances accept HTTP only from the load balancer. A client that can reach an instance directly can forge `x-amzn-oidc-data`. Do not open the instance port to the internet.

Configure the IdP to include the email scope. The load balancer must send `X-Forwarded-Proto: https` so form origin checks (`Origin` versus the request URL) succeed.

### `cognito` (when the app verifies tokens itself)

Set `AUTH_MODE=cognito`, `COGNITO_USER_POOL_ID`, `COGNITO_REGION` (`us-west-1`), and `COGNITO_CLIENT_ID`. Clients send `Authorization: Bearer` with a Cognito **ID token** (`token_use` `id`, `aud` equal to the client id). The adapter verifies `RS256` against the pool JWKS and checks the issuer `https://cognito-idp.us-west-1.amazonaws.com/{pool id}`. Access tokens are rejected because they do not carry the email this app uses for invitations. The bearer header is removed before the Worker runs.

This mode is the right one if there is no ALB authenticate action in front of the process. It is not wired to a hosted login UI in this repository; point users at the Cognito hosted UI or your own login page and send the ID token to the app.

### `dev-header` (local only)

`x-buildovate-user-id` and `x-buildovate-user-email` are accepted when `NODE_ENV` is not `production`. Preview and production refuse this mode unless `AUTH_ALLOW_DEV_HEADERS=1` is set on purpose. Do not set that flag on a shared environment. `aws/env/local.env.example` shows the quick in-process combination (`DATABASE_DRIVER=pglite`, `BUCKET_DRIVER=memory`). `aws/env/docker.env.example` shows the Compose combination (`APP_ENV=local`, `AUTH_MODE=dev-header`, Postgres, MinIO). Copy it to gitignored `aws/env/docker.env` before adding `OPENAI_API_KEY`.

### `disabled`

No user is attached. Public pages still render. Anything that calls `identity()` returns 401.

## Deploy (us-west-1)

These steps create new resources. They do not change DNS and they do not touch the CRM apps.

1. Create two RDS PostgreSQL 16 instances (names above), database `website_creator`, private, encrypted, backups on. Create a database user. Put each URL in that environment's secrets.
2. Create an IAM role for each environment with the S3 object permissions above, plus the usual Elastic Beanstalk EC2 trust. No static keys.
3. Create an ECR repository or let `eb deploy` build the `Dockerfile`. Platform: Docker, region `us-west-1`.
4. Create the two EB applications and environments listed above. Instance type can be small for preview. Attach the instance profile. Set environment properties from the matching `aws/env/*.env.example`, replacing `PASSWORD` and filling provider secrets in the console or Secrets Manager. Never commit those values.
5. Confirm the environment health check URL is `/healthz` and the process port is `8080`.
6. Build and deploy the image. For preview, `MIGRATE_ON_BOOT=1` applies migrations on boot. For production, run migrations before traffic moves:

   ```bash
   DATABASE_URL='postgresql://…' APP_ENV=production AWS_REGION=us-west-1 \
     S3_BUCKET=buildovate-website-creator-production npm run aws:migrate
   ```

7. Add an HTTPS listener and the OIDC action on the environment load balancer. Restrict instance ingress to that load balancer.
8. Smoke test through the EB URL (not the public DNS name): `/healthz` is 200, `/api/session` is anonymous until the load balancer login, `/api/setup` works once as the owner email, a draft site saves, and `POST /api/health` reports database and storage ok.
9. Generate a short research or chat reply with `OPENAI_API_KEY` set, and confirm the instance can open `https://api.openai.com`. A missing key must fail closed inside the existing product checks, not by blocking all egress.
10. Leave Route 53 unchanged until that smoke test is accepted. When you do cut over later: lower TTL, point the preview name, then the production name, and keep the Site deployment available for rollback.

Rollback of the app is a previous EB application version. Rollback of a migration is a restored RDS snapshot; the migrator does not generate down migrations.

## Sites

The Worker, D1 migrations, and `.openai/hosting.json` are unchanged so the current Site keeps deploying. New work should be verified on the AWS preview environment. After DNS moves, the Site is a fallback only. Removing the Site project is a later decision, not this change.

## Tests and gaps

`npm run test:aws` covers SQL translation, applying the real Drizzle files to Postgres (in-process), D1 `batch` rollback, `json_extract` / `json_set` / `INSERT OR IGNORE`, the S3 command shim against the preview bucket name, the local MinIO client settings (endpoint, path style, static keys, checksum mode) and the refusal of those settings outside `APP_ENV=local`, memory-bucket backup copies, static file serving, spoofed Sites headers, ALB ES256 and Cognito RS256 verification, `/healthz` success and database failure, owner setup, tenant create, storage health, and a live HTTPS call to `https://api.openai.com/v1/models` (expect 401 without a real key).

Not covered here, and still required before calling an environment live:

- Elastic Beanstalk, RDS, Cognito, and IAM are not created by the tests or by this repo
- no traffic has been sent to the real S3 buckets
- the existing `tests/platform.mjs` suite still targets SQLite, and this checkout has no `public/assets/roofing.jpg`, so that file exits before its assertions. `npm run test:aws` is the AWS check
- no browser pass of an Elastic Beanstalk URL, because that environment is not up. The local HTTP server was exercised for `/`, `/healthz`, session, setup, tenant create, storage health, and `/app.css`
- DNS, certificates for the public names, and retirement of the Site are not done
