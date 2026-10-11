---
name: local-setup
description: Set up a local website_creator checkout from setup.md (Docker Compose, or pglite only if Docker cannot run). Does not deploy.
---

# local-setup

Bring up this repo on a developer machine or on Joe's machine. The checklist already lives in `setup.md`. Follow that file. Do not copy it into this skill.

## Steps
1. Read `setup.md` and `docs/modules/infra.md` (local section only).
2. Work at the repo root (`docker-compose.yml`, `Dockerfile`, `package.json`, `aws/env/docker.env.example` must exist).
3. Prefer `develop` when the tree is clean. If the tree is dirty, do not reset or stash. Continue with the files already there (`setup.md`).
4. Install only the tools `setup.md` lists as missing. Do not install the AWS CLI, Cognito tooling, the Elastic Beanstalk CLI, LocalStack, or Python for a local run.
5. Use the Docker Compose stack (Postgres 16, MinIO, app on port 8080). Use the pglite path in `setup.md` only after Docker cannot be installed or still fails after a reboot.
6. Leave provider secrets blank unless the human supplies one. If they do, write it only into gitignored `aws/env/docker.env`. Do not print that file, `docker compose config`, or the key. Do not write the key into `aws/env/docker.env.example`.

## Done when
`GET /healthz` returns HTTP 200 and JSON with `ok: true`, `environment: "local"`, `database.ok: true`, and `authMode: "dev-header"` (`setup.md`). Tell the human the URLs `setup.md` lists. Do not deploy. Do not commit.
