---
name: promote
description: Open the next promotion pull request from develop to staging, or staging to main, after an explicit human confirm. Does not merge and does not change DNS.
---

# promote

Move code along `develop` → `staging` → `main`. Topology and hostnames are `docs/modules/infra.md` and `docs/ENVIRONMENTS.md`. Do not restate them. Do not merge. Do not edit Route 53.

## Confirm gate (required before any remote write)
Stop and ask the human which step they want. Do not infer it.

| Step | Pull request | Confirm prompt |
|---|---|---|
| Preview candidate | `develop` → `staging` | "Open a PR from develop into staging?" |
| Production candidate | `staging` → `main` | "Open a PR from staging into main? This is the production branch." |

Without an explicit yes for that step, stop. A yes for staging is not a yes for main. A yes to open a PR is not a yes to merge.

## Before opening the PR
1. Read `docs/modules/infra.md` gates and `docs/ENVIRONMENTS.md` "Required gates".
2. `git fetch origin develop staging main`.
3. Say which commits are in the source branch and not in the target. If the source is behind, stop and report that. Do not force-push.
4. CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm run build`, and `npm run test:aws` on pull requests into `staging` and `main`. It does not run on pull requests into `develop`. Mention that in the PR body.
5. Do not run `npm run aws:migrate` against preview or production, and do not change Elastic Beanstalk env vars, unless the human confirmed that exact command in this conversation. Migrations on production are a release step with `MIGRATE_ON_BOOT=0` (`docs/modules/infra.md`).

## Open the PR
- Base is `staging` or `main` as confirmed above. Head is the source branch.
- Title states the direction, for example `Promote develop to staging`.
- Body lists the commits, the gates not yet run (browser, tenant-isolation, rollback), and this line: DNS is not changed by this PR.
- Leave the PR open. Merging is a separate human action.

## Do not
- Do not deploy by hand, cut DNS, or copy preview secrets into production.
- Do not set `AUTH_MODE` away from the live value documented in `docs/modules/auth.md` as part of promotion. Cognito and ALB OIDC are still open work.
- Do not target CRM applications `buildovate-staging` or `buildovate-production`.
