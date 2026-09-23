# Knowledge Architecture — website_creator

This repository is the Website Design Department product (`Buildovate/website_creator`): a Node website app. It is not the Contractor CRM. Do not copy CRM modules, Prisma, or CDK into this tree.

Every fact lives in exactly one layer. Agents assemble context from the layers. They do not restate them.

```
Layer 1  CLAUDE.md                 → CONVENTIONS   (auto-loaded, always in context)
Layer 2  docs/modules/*.md         → DOMAIN        (nouns; loaded on demand, Step 0)
Layer 3  .claude/agents/*.md       → ROLES         (who does what)
Layer 4  .claude/skills/*/SKILL.md → PROCEDURES    (verbs)
```

Rule of thumb: **nouns → modules, verbs → skills, roles → agents, universal laws → CLAUDE.md.**

There is no `tools/` script layer in this repo. Deterministic commands are the npm scripts in `package.json` (`build`, `aws:migrate`, `aws:start`, `test:aws`, `docker:up`, `docker:dev`, `docker:down`). Skills call those; they do not reimplement them.

---

## Layer 1 — `CLAUDE.md`

Root `CLAUDE.md` is the only always-loaded file. It keeps only what applies to every task:

- what this repo is
- branch and promotion rules (`develop` → `staging` → `main`)
- pointers to env files and `docs/modules/`
- never invent secrets; never merge unless asked

It does not hold deploy steps, table lists, or endpoint catalogs. Those live in modules and skills.

## Layer 2 — `docs/modules/`

One doc per domain, shaped by `docs/modules/_TEMPLATE.md`. These are the home for nouns. Existing long-form sources stay where they are; modules point at them instead of copying them:

| Still the source of truth | What stays there |
|---|---|
| `setup.md` | Client/Codex local install checklist (Joe) |
| `OPERATIONS.md` | Product boundaries and release notes |
| `docs/ENVIRONMENTS.md` | Branch flow, runtime table, local commands |
| `docs/AWS_MIGRATION.md` | AWS adapter behavior and deploy notes |
| `DESIGN_RESEARCH.md` | Trade-experience revision notes |
| `docs/chat-pricing-release.md` | Chat, reviews, pricing, films release notes |
| `CRM-RELEASE.md` | Sales-workspace revision notes |

| Module | Covers | Mine from |
|---|---|---|
| `infra.md` | Hosts, region, EB/RDS/S3 names, Compose, env files, DNS names as documented | `docs/ENVIRONMENTS.md`, `docs/AWS_MIGRATION.md`, `src/aws/env.js`, `docker-compose*.yml`, `aws/env/*.example` |
| `auth.md` | `AUTH_MODE`, `src/aws/auth.js`, local dev headers, Cognito/OIDC status | `src/aws/auth.js`, `src/aws/env.js`, env examples, `docs/AWS_MIGRATION.md` |
| `sites.md` | Tenants, publish, memberships, public site routes | `db/schema.ts`, `src/api.js`, `src/core.js`, `src/worker.js` |
| `design.md` | Design kits, cinematic layouts, trade films, variants | `DESIGN_RESEARCH.md`, `public/*.json`, `src/design-kits.js`, `src/design-variant.js`, `src/cinematic.js` |
| `workspace.md` | Builder/workspace UI and workspace-record APIs | `src/workspace.js`, `src/builder.js`, `src/control.js`, `public/app.js` |
| `media.md` | Uploaded JPEG objects, backups, MinIO/S3/R2 | `src/aws/s3.js`, `src/operations.js`, `src/api.js` photo routes |
| `engagement.md` | Chat, reviews, pricing inquiries, provider connections | `src/engagement.js`, `src/reviews.js`, `src/pricing.js`, `docs/chat-pricing-release.md` |

Code is the source of truth when a doc and the code disagree. Mark unknowns in the module; do not fill them in.

## Layer 3 — `.claude/agents/`

Claude Code roles for this repo (not cloud Grok bots). They name the modules to read and the skills to run. They do not duplicate either.

| Agent | Job |
|---|---|
| `web-dev.md` | Implement website-creator changes after reading the owning module |
| `reviewer.md` | Read-only review against the diff and the module docs |

## Layer 4 — `.claude/skills/`

Procedures with steps and stop-points. The inventory lives in root `CLAUDE.md` → Available commands (one home). Each `SKILL.md` description is a single trigger line. Skills point at modules. Anything that touches staging or production has an explicit confirm-with-human step.

---

## How to add knowledge

1. If it is true for every task, it belongs in `CLAUDE.md` only when it is a convention. Otherwise it does not go there.
2. If it is a noun (a table, route, host, or rule), update the one module doc. Create a new module only when the code has a domain the table above does not cover.
3. If it is a verb with steps, add or edit one skill. Do not paste the steps into an agent or a module.
4. If `setup.md`, `OPERATIONS.md`, or `docs/ENVIRONMENTS.md` already owns the procedure or the boundary, link it. Do not delete those files and do not fork a second copy.

## Definition of done

- [ ] Root `CLAUDE.md` holds conventions only, with pointers to modules and skills
- [ ] `docs/modules/_TEMPLATE.md` exists and every module doc follows it
- [ ] Each module claim is backed by a file in this repo; unknowns are marked unknown
- [ ] `.claude/agents/` roles point at modules and skills and do not restate them
- [ ] `.claude/skills/` procedures exist; staging and production steps have a confirm gate
- [ ] `README.md` points here; `setup.md` and `OPERATIONS.md` are still present
- [ ] No application runtime change (docs and `.claude` only)
- [ ] Work is on a feature branch with a pull request into `develop`, not merged
