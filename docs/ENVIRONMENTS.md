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

```bash
npm ci
npm run build
# optional: set -a && source aws/env/local.env.example && set +a
DATABASE_DRIVER=pglite BUCKET_DRIVER=memory AUTH_MODE=dev-header APP_ENV=local MIGRATE_ON_BOOT=1 npm run aws:start
```

Send `x-buildovate-user-id` and `x-buildovate-user-email` while `AUTH_MODE=dev-header`. That mode is refused when `NODE_ENV=production`. The in-process database is disposable and is not a substitute for preview or production Postgres.

## Current status

GitHub source control and the branch structure are in place. The AWS adapter, container image, and environment templates are in the repo. Elastic Beanstalk, RDS, Cognito, and DNS are not provisioned by this change, and no production traffic has moved.
