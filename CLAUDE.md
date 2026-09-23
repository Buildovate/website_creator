## Knowledge layers (read this first)

- Roles: `.claude/agents/` (`web-dev`, `reviewer`).
- Domain: `docs/modules/` — read the owning module before editing that area.
- Map: `docs/KNOWLEDGE_ARCHITECTURE.md`.
- This file is universal conventions only.

# CLAUDE.md — website_creator

This repo is the **Website Design Department** product (`Buildovate/website_creator`): a Node app that builds contractor websites. It is not the Laravel/Nuxt Contractor CRM. Do not deploy it onto CRM Elastic Beanstalk apps `buildovate-staging` or `buildovate-production`, and do not point it at CRM Aurora.

## Available commands

Skills live in `.claude/skills/<name>/SKILL.md`. Invoke by name:

- `local-setup` — bring up a local machine from `setup.md` (client Joe or a developer checkout)
- `docker-up` — start or stop the Compose stack (Postgres 16, MinIO, app on port 8080)
- `pr-review` — read-only review of the branch diff, or one module against its doc
- `promote` — open the next promotion PR (`develop` → `staging` → `main`) after an explicit confirm

## Load domain docs

Before changing code, name the module and read `docs/modules/<module>.md`. If the change crosses modules, read each one. Do not invent endpoints, env vars, DNS names, or AWS resource names that are not in the module or the code.

| Area | Module |
|---|---|
| Hosts, Compose, env files, EB/RDS/S3 names | `docs/modules/infra.md` |
| `AUTH_MODE`, identity headers, Cognito/OIDC | `docs/modules/auth.md` |
| Tenants, publish, memberships, `/s/:slug` | `docs/modules/sites.md` |
| Kits, cinematic layouts, films, variants | `docs/modules/design.md` |
| Workspace records, builder, control APIs | `docs/modules/workspace.md` |
| Uploaded photos, backups, object storage | `docs/modules/media.md` |
| Chat, reviews, pricing, provider connections | `docs/modules/engagement.md` |

Code wins when a doc is stale. Update the one module that owns the fact. Leave `setup.md` and `OPERATIONS.md` in place; they remain sources for local setup and product boundaries.

## Environments (pointers only)

Full topology: `docs/modules/infra.md` and `docs/ENVIRONMENTS.md`.

- Local: `APP_ENV=local`. Quick path uses `aws/env/local.env.example`. Compose uses `aws/env/docker.env.example` plus gitignored `aws/env/docker.env`.
- Preview template: `aws/env/preview.env.example`. Production template: `aws/env/production.env.example`.
- Live preview and production auth is documented in `docs/modules/auth.md`. The example files are templates, not proof of the live setting.

## Secrets

Never invent, print, or commit secrets. Real keys belong only in gitignored `aws/env/docker.env`, the process environment, Elastic Beanstalk environment properties, or Secrets Manager. Do not put them in `*.env.example`, chat, or docs. `aws/env/docker.env` and `.env` are gitignored.

## Git

```
main      ← production (website.buildovate.com)
staging   ← preview candidate (preview.website.buildovate.com)
develop   ← integration; feature PRs land here
```

Promotion is a pull request from `develop` to `staging`, then from `staging` to `main`. DNS cutover is a separate manual step. Use the `promote` skill. Do not merge unless the human asks. Do not commit or push unless asked. Never commit directly to `main`.

Commit subjects when a commit is requested: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

## Code search

Search is grep-based (Grep/Glob plus targeted reads). There is no semantic index.

1. Search the symbol and its naming variants, then check `docs/modules/` for the owner.
2. Enumerate call sites before changing a symbol.
3. Treat markdown as possibly stale. Verify against code.
