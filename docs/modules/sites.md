# Module: sites

## Purpose
A tenant is one contractor website: draft settings, a published snapshot, memberships, and the public `/s/:slug` page. Provisioning does not create a separate hosting account per contractor (`OPERATIONS.md`).

## Server
- **Routes** (from `src/api.js` unless noted):
  - `GET /api/session` — current user or null, and whether any admin exists
  - `POST /api/setup` — owner bootstrap; see `auth.md`
  - `POST /api/accept` — consume a tenant invite token
  - `GET /api/tenants` — all tenants for platform admin, otherwise memberships with `active=1`
  - `POST /api/tenants` — platform admin creates a tenant (`preset=robles` or a design kit)
  - `GET /api/tenants/:id` — tenant, role, projects, photos, last 150 inquiries
  - `PUT /api/tenants/:id` — save draft settings (`write`)
  - `GET /api/tenants/:id/readiness` — content checks from `src/builder.js`
  - `POST /api/tenants/:id/render` — preview HTML without saving (`write`)
  - `POST /api/tenants/:id/publish` — copy settings into `published`, status `published` (`owner`)
  - `POST /api/tenants/:id/unpublish` — status `draft`, `published` null (`owner`)
  - `POST /api/tenants/:id/duplicate` — new tenant with layout only (`admin`)
  - `GET /api/pipeline` — admin sales stages (`src/builder.js` `STAGES`)
  - `GET|POST /api/tenants/:id/sales` — admin manual sales record
  - `POST /api/public/:slug/inquiries` — published site only; origin check; consent; rate limit (`src/worker.js`)
  - Public HTML in `src/worker.js`: `GET /s/:slug`, `GET /s/:slug/projects/:id`. `?preview=1` requires `access`. Otherwise `status=published` and a non-null `published` snapshot.
- **Tables**: `tenants` (`slug` unique, `settings` draft JSON, `published` snapshot JSON, `version`, `status` default `draft`), `members`, `invites`, `projects` (draft `data` + `published`), `inquiries`, `sales` (one row per tenant), `domains`, `audit`.
- **Code**: `src/api.js`, `src/core.js`, `src/worker.js`, `src/views.js` (`sitePage`), `src/operations.js` (snapshot before publish).
- **Auth**: see `docs/modules/auth.md`. Summary: platform `admin` sees every tenant; members need an active row; publish/unpublish/invites/domains/backups require owner (platform admin counts as owner-level via `access`).

### Publish
`POST .../publish` requires the client `version` to match, a phone with at least 10 digits, service area, headline, at least one service, and `approved: true`. It writes a backup (`Before website publish`) then sets `published=settings` and `status='published'`. Optimistic concurrency: zero row changes returns 409. Unpublish clears `published`. Saving a draft does not publish. Public routes read `published`, not `settings`, except preview.

### Memberships
`POST /api/tenants/:id/invites` (owner) creates an email-bound invite for `owner`, `editor`, or `viewer`. The token is returned once in `/join#…` and stored as `token_hash`. Expires in seven days. `POST /api/accept` requires the signed-in email to match. Duplicate membership updates the role and reactivates.

`duplicate` copies trade, template, color, kit, design, effects, sections, and service **names** only. It does not copy contact facts, photos, projects, or memberships.

### Domains
`GET|POST /api/tenants/:id/domains` stores a hostname and a `buildovate-…` TXT token. `POST /api/tenants/:id/domains/:id/verify` looks up `_buildovate.{hostname}` TXT via `https://cloudflare-dns.com/dns-query`. Ownership verification does not mark the domain hosted or TLS-ready (`OPERATIONS.md`). Automated registrar DNS and SSL are not implemented (`README.md`).

### Sales stages
`STAGES` in `src/builder.js`: `Prospect`, `Preview ready`, `Presented`, `Changes requested`, `Approved`, `Paid`, `Domain connected`, `Launched`. Default amount `750`. Stage index ≥ 4 requires owner approval and a note; ≥ 5 a payment reference; ≥ 6 a domain note; the last stage a launch note. These are manual records. They do not send messages, charge anyone, or configure hosting (`README.md`).

## Browser
- **Pages**: `/s/:slug`, `/s/:slug/projects/:id`, `/preview/:slug` (member), `/` workspace. `GET /robots.txt` is `Disallow: /`. HTML responses send `x-robots-tag: noindex, nofollow`.
- **Scripts / data**: `public/site.js`, `public/app.js`, `public/site.css`.
- **Calls**: tenant routes above. Editor preview uses `POST .../render`.

## Business rules
- Slug: `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`.
- Trades must be keys of `public/trade-library.json`. The string `General contracting` is normalized to `General Contractors` on save.
- Templates: `craft`, `clean`, `editorial`, `blueprint`, `cinematic` (`src/core.js`).
- Inquiries: name, phone (10–15 digits), `consent===true`, optional published `projectId`. More than 3 per phone per tenant per 24h returns 429. A non-empty `website` field is treated as spam and returns `{ok:true}` without saving.
- All pages stay noindex until an intentional public launch (`OPERATIONS.md`).
- Canonicals point at this platform, not `roblesroofingca.com` (`README.md`).

## Gotchas
- `tenants.status` default is `draft`. A published flag in settings is not how publication works; `status` plus the `published` column is.
- Platform admin without a `members` row still passes `access` as role `admin`. A missing membership for a non-admin returns 404 (`Website not found.`), not 403.
- Unknown: which slugs are live on preview or production. The README refers to `/s/robles-roofing` on the deployed platform. This repo does not list production rows.

## Related modules
`auth`, `design` (kit applied at create), `media` (photos on the tenant), `workspace` (extra records keyed by tenant id), `engagement` (public chat and reviews on a published site).

## Sources
`db/schema.ts`, `src/api.js`, `src/core.js`, `src/worker.js`, `src/builder.js`, `src/views.js`, `src/operations.js`, `OPERATIONS.md`, `README.md`, `public/trade-library.json`.
