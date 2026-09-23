# Module: infra

## Purpose
Where this website app runs: local Compose, the AWS adapter, and the documented preview and production hosts. Not the Contractor CRM.

## Server
- **Routes**: `GET /healthz` on the AWS process (`src/aws/server.js`) runs `SELECT 1` and returns 200 only when Postgres answers. Body includes `ok`, `service: "website-creator"`, `environment` (`APP_ENV`), `region`, `bucket`, `authMode`, `database`, and `openai.configured` (true only when `OPENAI_API_KEY` is present). It does not call OpenAI. Elastic Beanstalk health check path is `/healthz` (`.ebextensions/healthcheck.config`, matcher `200`). `/` is not a database check.
- **Tables**: none owned here. Schema is authored as SQLite in `db/schema.ts` and `drizzle/`. `src/aws/migrate.js` rewrites those statements for Postgres and records them in `schema_migrations`.
- **Code**: `src/aws/server.js`, `src/aws/env.js`, `src/aws/migrate.js`, `Dockerfile`, `Procfile`, `docker-compose.yml`, `docker-compose.dev.yml`.
- **Auth**: see `docs/modules/auth.md`.

### Documented AWS names (`us-west-1`, account `846588355042`)

From `src/aws/env.js`, `docs/ENVIRONMENTS.md`, and `docs/AWS_MIGRATION.md`. Do not use CRM apps `buildovate-staging` / `buildovate-production` or CRM Aurora.

| | Preview | Production |
|---|---|---|
| Public host | `preview.website.buildovate.com` | `website.buildovate.com` |
| Branch | `staging` | `main` |
| Elastic Beanstalk app | `buildovate-website-creator-preview` | `buildovate-website-creator-production` |
| Elastic Beanstalk environment | `website-creator-preview` | `website-creator-production` |
| Postgres instance name | `website-creator-preview-postgres` | `website-creator-production-postgres` |
| Database name | `website_creator` | `website_creator` |
| S3 bucket | `buildovate-website-creator-preview` | `buildovate-website-creator-production` |
| Config template | `aws/env/preview.env.example` | `aws/env/production.env.example` |

`APP_ENV` must be `local`, `preview`, or `production`. For preview and production, `S3_BUCKET` must be the bucket in that table and `AWS_REGION` must be `us-west-1`. `S3_ENDPOINT` and static S3 keys are refused unless `APP_ENV=local`. `DATABASE_DRIVER=pglite` and `BUCKET_DRIVER=memory` are local only, and are also refused when `NODE_ENV=production`.

RDS notes in `docs/AWS_MIGRATION.md`: PostgreSQL 16, private, `PGSSLMODE=require`, `PGSSL_REJECT_UNAUTHORIZED=0` until the Amazon RDS CA bundle is on the image. Real `DATABASE_URL` hosts are not in git. The example URLs use a `.example.us-west-1.rds.amazonaws.com` placeholder.

Preview template sets `MIGRATE_ON_BOOT=1`. Production template sets `MIGRATE_ON_BOOT=0` and says to run `npm run aws:migrate` before shifting traffic. The container is `Dockerfile` (Node 22, port 8080, `node src/aws/server.js`). `Procfile` is only for an EB Node.js platform zip; the Docker platform is the supported artifact.

ChatGPT Sites remains a fallback runtime: Worker `src/worker.js` built to `dist/server/index.js`, D1 binding `DB`, R2 binding `BUCKET`. The Sites project id lives only in `.openai/hosting.json`. Do not copy it elsewhere or reuse it for a new Site.

### Local

| Path | What runs | Env file |
|---|---|---|
| Quick | in-process pglite + memory bucket, `npm run aws:start`, port 8080 | `aws/env/local.env.example` |
| Compose | Postgres 16 (`5432`), MinIO API `9000` / console `9001`, app `8080` | `aws/env/docker.env.example`, then gitignored `aws/env/docker.env` |
| Edit loop | `npm run docker:dev` (`Dockerfile.dev`, source bind mounts). EB does not build that Dockerfile | same Compose env files |

Compose project name is `website-creator`. Inside the network the hostnames are `postgres` and `minio`. From the host, use `localhost` and the published ports. Local bucket name is `website-creator-local`. Local MinIO root user and password are the defaults written in `docker-compose.yml` and `aws/env/docker.env.example`. They are not preview or production credentials.

`npm run docker:up` is `docker compose up --build`. `npm run docker:down` is `docker compose down`. `docker compose down -v` deletes the Postgres and MinIO volumes.

A frequent checkout on Louie's MSI is `D:\Nothing\buildovate-website`. Client Joe's install checklist is `setup.md` (do not fork that procedure).

### Env files (names only)

Passthrough provider names loaded by `src/aws/env.js` when set: `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_CHAT_MODEL`, `GOOGLE_PLACES_API_KEY`, `YELP_API_KEY`, `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_HOST_USER_ID`, `RESEND_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. Values are not stored in git. Defaults in examples for the model names are `gpt-4.1-mini`.

### CI

`.github/workflows/ci.yml` runs on push to `develop`, `staging`, and `main`, and on pull requests into `staging` and `main`. It does not run on pull requests whose base is `develop`. Steps: `npm ci`, `npm run build`, `npm run test:aws`, Node 22.

## Browser
- **Pages**: none. `/healthz` is JSON.
- **Scripts / data**: none.
- **Calls**: none.

## Business rules
- Promotion is a pull request `develop` → `staging`, then `staging` → `main`. DNS cutover is manual and is not done by this repo. Procedure: `promote` skill. Detail: `docs/ENVIRONMENTS.md`.
- `docs/ENVIRONMENTS.md` "Current status" says Elastic Beanstalk, RDS, Cognito, and DNS are not provisioned by that change, and that no production traffic had moved as of that document. Whether those resources have since been created outside this repo is not recorded here. The names above are the names the code and docs require, not a live inventory.
- Do not commit `aws/env/docker.env` or `.env`.

## Gotchas
- `docker compose up --build` builds the production `Dockerfile`. Day-to-day edits use the dev override so that image tag is not replaced (`website-creator-app-dev`).
- Compose requires Compose v2.24+ (`docker compose`, not `docker-compose`). `.gitattributes` keeps Compose files and Dockerfiles as LF.
- `GET /healthz` can return 503 while Postgres is down or migrations are still running.
- Unknown: live RDS endpoints, live EB environment URLs, and whether Route 53 already points the public hostnames at this app. Not in git.

## Related modules
`auth` (how the process identifies users), `media` (which bucket the process uses).

## Sources
`docs/ENVIRONMENTS.md`, `docs/AWS_MIGRATION.md`, `setup.md`, `src/aws/env.js`, `src/aws/server.js`, `src/aws/migrate.js`, `docker-compose.yml`, `docker-compose.dev.yml`, `Dockerfile`, `Dockerfile.dev`, `Procfile`, `.ebextensions/healthcheck.config`, `aws/env/*.example`, `.github/workflows/ci.yml`, `.openai/hosting.json`, `package.json`.
