---
name: docker-up
description: Start, rebuild, or stop the local Docker Compose stack (Postgres 16, MinIO, app on port 8080). Local only.
---

# docker-up

Local Compose only. Hosts, ports, and env files are `docs/modules/infra.md`. Do not restate them.

## Start
From the repo root, with Docker running:

```bash
docker compose up --build
```

`npm run docker:up` is the same command. First start builds `Dockerfile` and migrates because the example env sets `MIGRATE_ON_BOOT=1`.

Day-to-day source edits (still Postgres and MinIO, still `APP_ENV=local`):

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

`npm run docker:dev` is that command. It uses `Dockerfile.dev`, which Elastic Beanstalk does not build. Restart the app container after code changes so it runs `npm run build` again.

## Check
`GET http://localhost:8080/healthz` returns 200 when Postgres answers `SELECT 1`. A 503 means the database check failed; wait for migrations and retry. On Windows PowerShell, call `curl.exe`, not `curl`.

Auth headers for API calls are in `docs/modules/auth.md` (`AUTH_MODE=dev-header`). Do not use them against preview or production.

## Stop
`docker compose down` stops the stack and keeps volumes.

`docker compose down -v` deletes the Postgres and MinIO volumes. Do not run it unless the human asked to wipe local data.

## Gates
- This skill does not touch Elastic Beanstalk, RDS, or Route 53.
- Do not put secrets in `aws/env/docker.env.example`. Optional keys go in gitignored `aws/env/docker.env`, then `docker compose up --build`.
- If port 5432 or 8080 is taken, change only the host side of that mapping in `docker-compose.yml`. Leave the container port and the `DATABASE_URL` host `postgres` as they are (`docs/ENVIRONMENTS.md`).
