# Module: media

## Purpose
Stores contractor JPEG uploads and backup copies. Public kit images and films under `public/assets/` are static files, not objects in this bucket. See `design.md` for those.

## Server
- **Routes**:
  - `POST /api/tenants/:id/photos` — `write`. Query: `projectId`, `stage`, `caption`. Body is the JPEG bytes (not JSON).
  - `GET /media/:photoId` — `src/worker.js`. Serves `image/jpeg` from the bucket. Public when the photo is the published logo, owner photo, hero, a published project's listed photo, or a published blog cover. Otherwise requires `access` on the tenant.
  - `GET|POST /api/tenants/:id/backups` — owner. `POST` takes a manual snapshot.
  - `POST /api/tenants/:id/backups/:backupId/restore` — owner, body `confirm: true`, plus the tenant `version` (`src/api.js` → `restore` in `src/operations.js`).
  - `GET /api/tenants/:id/backups/:backupId/download` — owner. JSON snapshot, not embedded media (`OPERATIONS.md`).
  - `POST /api/control/profile-photo` and `GET /api/control/avatar/:userId` — staff profile JPEG under `profiles/{userId}/…` (`src/control.js`).
- **Tables**: `photos` (`tenant_id`, `project_id` nullable, `object_key`, `caption`, `stage`, `bytes`). `backups` (`object_key`, `reason`, `bytes`, `checksum`).
- **Code**: `src/aws/s3.js` (`get`, `put`, `head`, `delete`), `src/core.js` `jpeg()`, `src/operations.js` `snapshot`, `src/api.js` photo and backup tails.
- **Auth**: upload is tenant `write`. Public `GET /media/:id` is the exception above. Backup and restore are owner. Profile photos are staff-only.

### Object storage
The Worker calls `env.BUCKET`. Bindings:

| Runtime | Bucket |
|---|---|
| ChatGPT Sites | R2 binding `BUCKET` |
| AWS preview | S3 `buildovate-website-creator-preview` |
| AWS production | S3 `buildovate-website-creator-production` |
| Compose local | MinIO bucket `website-creator-local` via `S3_ENDPOINT` |
| Quick local | `BUCKET_DRIVER=memory` (lost when the process exits) |

`createS3Bucket` uses the AWS SDK credential chain (instance role on Elastic Beanstalk). Static keys are refused unless `APP_ENV=local`. With `S3_ENDPOINT` set, the client uses path-style URLs and checksums only when required (MinIO). Preview and production do not set an endpoint. LocalStack is not used.

`env.ASSETS` reads built files from `dist/client` (fallback `public/`) and rejects paths that escape that directory. That is the static tree, not uploaded photos.

Upload key shape: `photos/{tenantId}/{id}.jpg`. Backup media: `backups/{tenantId}/{backupId}/media/{photoId}.jpg`. Profile: `profiles/{userId}/{id}.jpg`.

`jpeg()` in `src/core.js` requires SOI/EOI markers and strips APP0–APP15 and comment segments (metadata). Non-JPEG is rejected. Photo `POST` limit is 2MB (`bytes(req, 2*1024*1024)`). Cap is 60 photos per tenant. Project stages: `before`, `during`, `after`. Without a project, stage must be `brand`.

`snapshot` copies every tenant photo into new keys, then stores a SHA-256 JSON snapshot (settings, projects, photos, inquiries, and workspace records — see `src/operations.js`). A missing object fails the backup; it does not mark a partial backup complete. Publish takes a snapshot with reason `Before website publish` before flipping status.

## Browser
- **Pages**: images in `/s/:slug` and the editor use `/media/:id`. MinIO console on the local stack is `http://localhost:9001` (`docs/ENVIRONMENTS.md`).
- **Scripts / data**: upload UI in `public/app.js`. No separate media app.
- **Calls**: `POST /api/tenants/:id/photos`, `GET /media/:id`.

## Business rules
- Draft and private project photos are not public. Cross-tenant cover and photo-order changes are rejected (`README.md` verification notes).
- `OPERATIONS.md` says photos are resized to 1600px. The server checks JPEG structure and the 2MB cap. A resize step, if any, is in the browser uploader — confirm in `public/app.js` before claiming the server resizes.
- Backups are in-platform copies. The JSON download does not embed media (`OPERATIONS.md`). There is no scheduled backup job in this repo.
- Staff profile photos are served only to signed-in staff (`CRM-RELEASE.md`).

## Gotchas
- Memory bucket and pglite are disposable. Compose volumes survive `docker compose down` and die on `docker compose down -v`.
- `POST /api/health` (admin) probes database and object storage together. `GET /healthz` probes only the database (`docs/AWS_MIGRATION.md`).
- S3 bucket names are enforced at boot for preview and production (`src/aws/env.js`). A wrong bucket refuses to start.
- Unknown: whether preview or production instances have actually written objects. `docs/AWS_MIGRATION.md` says tests have not sent traffic to the real buckets.

## Related modules
`infra` (bucket names and MinIO), `sites` (who may upload and when `/media` is public), `workspace` (blog cover id must be a photo on that tenant).

## Sources
`src/aws/s3.js`, `src/aws/env.js`, `src/core.js`, `src/api.js`, `src/operations.js`, `src/worker.js`, `src/control.js`, `db/schema.ts`, `docker-compose.yml`, `docs/AWS_MIGRATION.md`, `docs/ENVIRONMENTS.md`, `OPERATIONS.md`, `README.md`, `CRM-RELEASE.md`.
