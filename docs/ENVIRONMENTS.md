# Buildovate deployment environments

This repository is the website creator (Cloudflare Worker today, AWS runtime in `src/aws/`). It is not the Laravel/Nuxt CRM. Do not deploy it onto the CRM Elastic Beanstalk applications `buildovate-staging` or `buildovate-production`, and do not point it at the CRM Aurora databases.

## Branch flow

- `develop`: development work. Open pull requests into `develop`.
- `staging`: release-candidate code for the preview environment.
- `main`: approved production code.

Promotion stays a pull request from `develop` to `staging`, then from `staging` to `main`. DNS cutover is a separate manual step. This change does not edit Route 53.

## Runtimes

| | ChatGPT Sites (current) | AWS preview | AWS production |
|---|---|---|---|
| Branch | whatever is deployed on the Site | `staging` | `main` |
| App | Worker `src/worker.js` → `dist/server/index.js` | Same worker behind `src/aws/server.js` | Same worker behind `src/aws/server.js` |
| Database | D1 binding `env.DB` | New Postgres `website-creator-preview-postgres`, database `website_creator` | New Postgres `website-creator-production-postgres`, database `website_creator` |
| Objects | R2 binding `env.BUCKET` | S3 `buildovate-website-creator-preview` | S3 `buildovate-website-creator-production` |
| Compute | Sites | Elastic Beanstalk app `buildovate-website-creator-preview`, environment `website-creator-preview` | Elastic Beanstalk app `buildovate-website-creator-production`, environment `website-creator-production` |
| Region | n/a | `us-west-1` (account `846588355042`) | `us-west-1` (account `846588355042`) |
| Public host (later) | current Site host | `preview.website.buildovate.com` | `website.buildovate.com` |

The S3 buckets already exist (private, AES256, versioning on). The Elastic Beanstalk apps and Postgres instances are new and are not created by this repository. Config templates are `aws/env/preview.env.example` and `aws/env/production.env.example`.

ChatGPT Sites remains the running fallback until a preview deploy is verified and DNS is changed by hand. The Sites project id in `.openai/hosting.json` stays attached to the existing Site.

## Auth

Sites injects `oai-authenticated-user-id` and `oai-authenticated-user-email`. The AWS process strips those headers from clients and sets them only after its own check. Preview and production use `AUTH_MODE=alb-oidc` (load balancer JWT) or `AUTH_MODE=cognito` (Cognito ID token). `AUTH_MODE=dev-header` is local only. Details are in `docs/AWS_MIGRATION.md`.

Platform roles still live in the `admins` and `members` tables. The identity provider only establishes the user id and email. The first administrator is still the existing owner bootstrap (`yoelengel18@gmail.com` via `/api/setup`).

## Required gates

Every promotion should include:

1. Successful CI build (`npm ci`, `npm run build`, `npm run test:aws`).
2. Responsive preview check at desktop, tablet, and mobile widths.
3. Database migration review (`npm run aws:migrate` against that environment's Postgres).
4. Tenant-isolation and authorization checks.
5. Payment and messaging changes tested in sandbox mode.
6. A rollback reference for the previous production release.
7. `/healthz` returning 200 from the environment that is about to take traffic.

## Local AWS runtime

Two local paths. Both use `APP_ENV=local` and `AUTH_MODE=dev-header`. Neither one is preview or production, and neither one changes Elastic Beanstalk, RDS, or Route 53.

Send `x-buildovate-user-id` and `x-buildovate-user-email` on API requests. `AUTH_MODE=dev-header` is refused when `NODE_ENV=production` unless `AUTH_ALLOW_DEV_HEADERS=1` is set on purpose. Do not set that flag on a shared environment.

### Quick path (no Docker)

In-process Postgres and an in-memory bucket. Disposable. This is the fastest loop when you do not need a real database or object store.

```bash
npm ci
npm run build
# optional: set -a && source aws/env/local.env.example && set +a
DATABASE_DRIVER=pglite BUCKET_DRIVER=memory AUTH_MODE=dev-header APP_ENV=local MIGRATE_ON_BOOT=1 npm run aws:start
```

The process listens on port 8080. `GET /healthz` returns 200 when the in-process database answers.

### Docker path (Postgres and MinIO)

Docker Desktop with Compose v2 (`docker compose`, not the old `docker-compose` binary). From the repository root:

```bash
docker compose up --build
```

The same command from PowerShell or cmd:

```powershell
docker compose up --build
```

`npm run docker:up` and `npm run docker:down` wrap those commands. The first start builds the production `Dockerfile` (the same file Elastic Beanstalk builds) and applies migrations because `MIGRATE_ON_BOOT=1`.

| Service | Image | Host port | Purpose |
|---|---|---|---|
| `app` | local build of `Dockerfile` | 8080 | website creator |
| `postgres` | `postgres:16` | 5432 | database `website_creator` |
| `minio` | Quay MinIO | 9000 (API), 9001 (console) | S3-compatible bucket `website-creator-local` |

`GET http://localhost:8080/healthz` returns 200 once Postgres accepts `SELECT 1`. A 503 means the database check failed; wait for the `app` container to finish migrations and try again. The MinIO API is `http://localhost:9000`. The browser console is `http://localhost:9001`. The local root user and password are the MinIO defaults `minioadmin` / `minioadmin`, also written in `docker-compose.yml` and `aws/env/docker.env.example`. They are not preview or production credentials.

Inside the Compose network the app uses hostname `postgres` and `http://minio:9000`. From the host machine those names do not resolve; use `localhost` and the published ports. If port 5432 or 8080 is already taken, change the host side of that mapping in `docker-compose.yml` (the left number). Leave the container port and the `DATABASE_URL` host `postgres` as they are.

`src/aws/s3.js` talks to MinIO with `S3_ENDPOINT`, `S3_FORCE_PATH_STYLE=1`, and the static keys above. Those settings are refused unless `APP_ENV=local`. Preview and production keep the AWS SDK credential chain and do not set an endpoint. The Compose stack does not use LocalStack.

Stop the stack with `docker compose down`. `docker compose down -v` also deletes the Postgres and MinIO volumes.

#### OPENAI_API_KEY

Do not commit a key. Compose always loads `aws/env/docker.env.example`, which leaves `OPENAI_API_KEY` empty. Copy that file and put the key only in the copy:

```powershell
Copy-Item aws\env\docker.env.example aws\env\docker.env
notepad aws\env\docker.env
docker compose up --build
```

```bash
cp aws/env/docker.env.example aws/env/docker.env
# edit OPENAI_API_KEY, then:
docker compose up --build
```

`aws/env/docker.env` is gitignored. Compose loads it after the example, so its values override the blanks. Restart the `app` service after changing it (`docker compose up --build`). `/healthz` does not call OpenAI. Its JSON includes `openai.configured`, which is true only when the key is present in the container.

On Windows, `curl` in PowerShell is an alias for `Invoke-WebRequest`. Use `curl.exe` for the health check:

```powershell
curl.exe http://localhost:8080/healthz
curl.exe http://localhost:8080/api/session -H "x-buildovate-user-id: local-user" -H "x-buildovate-user-email: you@example.com"
```

#### Edit loop

`docker compose up --build` rebuilds the production image, which is the right check before a deploy and a slow loop for small source edits. For day-to-day edits, bind-mount the source with the dev override (still Postgres and MinIO, still `APP_ENV=local`):

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

`npm run docker:dev` is the same command. That override uses `Dockerfile.dev`, which Elastic Beanstalk does not build. Restart the app container after code changes so it runs `npm run build` again. Git is set to keep Compose files and Dockerfiles as LF (`.gitattributes`) so those shell commands do not pick up `CR` on Windows.

## Current status

GitHub source control and the branch structure are in place. The AWS adapter, container image, and environment templates are in the repo. Elastic Beanstalk, RDS, Cognito, and DNS are not provisioned by this change, and no production traffic has moved.
