# Module: workspace

## Purpose
The signed-in builder: Launch Pad and the other contractor screens, plus global staff records (contacts, calendar, commissions). Public pages that read published workspace records are included here; chat and reviews are `engagement.md`.

## Server
- **Routes**:
  - `/api/workspace/:scope/:kind` and optional `/:id` and `/:action` (`src/workspace.js`). Methods: `GET`, `POST`, `PUT`. Non-GET requires `Origin` to match the request URL.
  - Scope `global` is staff-only. Contractors pass a tenant id and go through `access`.
  - Kinds: `pages`, `forms`, `submissions`, `followups`, `visibility`, `plan`, `leads`, `payments`, `contacts`, `calendar`, `blog`, `commissions`.
  - Global kinds that are allowed: `leads`, `payments`, `contacts`, `calendar`, `commissions`. `leads` and `payments` and `commissions` are not valid on a tenant scope.
  - `GET /api/workspace/:scope/connections` — provider flags (not a stored kind).
  - `POST /api/workspace/:tenant/support` — platform admin audit entry only.
  - `POST /api/workspace/:tenant/ai` — research draft for an empty copy field when the plan allows `ai` and `OPENAI_API_KEY` is set. Hourly cap 20 (`ai.requested`).
  - `POST /api/workspace/:scope/:kind/:id/publish` and `.../unpublish` for `pages`, `forms`, `payments`, `visibility`, `blog`.
  - `POST /api/workspace/:scope/leads/import` — up to 250 rows; scope cap 500 (`src/workspace.js`).
  - `src/crm-next.js` also serves `/api/crm/:scope/:op` and `/api/workspace/:scope/contacts|leads` (dedupe, bulk stage, list/board). Global requires `staff`.
  - `GET|POST /api/tenants/:id/playbooks` (`src/crm.js`) — list four playbooks or insert their steps as disabled follow-ups.
  - `GET /api/team`, `POST /api/team/invite`, `POST /api/team/revoke`, `POST /api/team/accept` — platform staff (`admin` or `operator`).
  - `src/control.js` under `/api/control/` (staff): `profile`, `profile-photo`, `avatar/:id`, `settings`, `followups`, `searches`, `signals`.
  - Public: `GET|POST /s/:slug/pages/:pageSlug`, `GET|POST /s/:slug/forms/:id` (`publicWorkspace`). `GET /s/:slug/blog` (`src/blog.js`). `GET /proposal/:token` for a published global payment document.
- **Tables**: `workspace_records` (`scope`, `kind`, `data` JSON, optional `published`, `version`). Tenant scope is the tenant id. Global scope is the string `global`.
- **Code**: `src/workspace.js`, `src/crm-next.js`, `src/crm.js`, `src/control.js`, `src/blog.js`, `src/builder.js` (readiness), `src/form-fields.js`, `src/zoom.js` (global calendar only).
- **Auth**: tenant `GET` is `read` (viewer included). Writes are `write` except `followups` (`owner`), `plan` and `support` (`admin`). Plan changes are platform admin only. Commission writes are admin; operators may `GET` only their own email. Global leads/contacts/calendar are staff. Global financial records are not for operators (`README.md`).

### Plans and lead stages
Plans: `Starter`, `Growth`, `Pro`, `Custom`. Feature flags: `pages`, `forms`, `followups`, `visibility`, `ai`. A missing flag is treated as enabled (`!== false`).

Lead/contact stages: `New`, `Called`, `Booked`, `Built`, `Shown`, `Paid`, `Lost`. `Paid` is a manual label, not payment proof (`README.md`).

Follow-up channels: `email` or `sms`. Saving a step sets `status` to `Awaiting delivery integration` and `enabled` only when the client sends `enabled: true`. Playbook apply inserts steps with `enabled: false`. No delivery worker is implemented (`README.md`, `CRM-RELEASE.md`).

Calendar statuses: `Scheduled`, `Completed`, `Cancelled`, `No-show`. Overlapping scheduled appointments for the same assignee are rejected. Zoom sync runs only for the global calendar when `meetingType` is `Zoom` and Zoom env vars are all set (`src/zoom.js`). Contractor calendars are not connected to Zoom. Host start URLs and access tokens are not stored.

Payment document types: `Proposal`, `Quote`, `Agreement`, `Invoice`, `Pay link`. Hosted URL hostnames allowed: `buy.stripe.com`, `checkout.stripe.com`, `www.paypal.com`, `paypal.me`, `square.link`. Acceptance stores a typed name, consent string, time, and SHA-256 of the published JSON. Accepted rows cannot be edited or unpublished. This is not a certified signature service and not a verified payment (`CRM-RELEASE.md`).

Blog: migration `0003` adds starter drafts. Public blog requires the site published (or `?preview=1`) and plan feature `pages` not false. Posts need their own `published` snapshot.

## Browser
- **Pages**: `/` dashboard (`src/views.js`). Draft preview `/preview/:slug` (1280 / 768 / 390 CSS pixels in the editor notes, `README.md`). Public pages and forms under `/s/:slug/`. `/proposal/:token`. `/team-join` for staff invites.
- **Scripts / data**: `src/client/workspace/legacy-workspace.js`, `public/control-ui.js`, `public/crm-enhancements.js`, `public/workspace-public.js`, `public/blog.js`, `public/excel-reader.js` (loaded by the dashboard).
- **Calls**: `/api/workspace/…`, `/api/team`, `/api/control/…`, `/api/session`.

Contractor entry points named in `README.md`: Launch Pad, Owner photo, Design templates, Pages, Forms & submissions, Search visibility, Plan & add-ons, Follow-ups, Domains.

## Business rules
- Public forms and pages require a published website and a published record.
- Form submissions require `consent===true`. Preview forms do not accept posts. Same honeypot and 3-per-day cap pattern as site inquiries.
- Custom form field types and limits: `DESIGN_RESEARCH.md` (ten types, up to twenty custom fields). Fixed name/email/phone/consent fields remain.
- Restore of a website backup returns pages/forms/search profiles to draft and keeps current submissions, follow-up settings, and plan controls. Global leads and sales documents are not in contractor website backups (`README.md`).
- XLSX import uses `read-excel-file` (`CRM-RELEASE.md`). `OPERATIONS.md` still says XLSX must be exported as CSV for an earlier contacts importer. The later CRM path accepts CSV and XLSX; do not assume both sentences describe the same function. Check `src/crm-next.js` before changing import.
- Contacts may be deleted while financial and appointment records remain (`CRM-RELEASE.md`).
- Buildovate support access is audited under the administrator's own identity (`README.md`).

## Gotchas
- `workspace_records` is a generic table. Kind-specific rules are in `clean()` in `src/workspace.js`, not in SQL checks.
- `connections` is a virtual kind (env flags only) and is not in the `kinds` array.
- Follow-up `enabled: true` still does not send mail or SMS. The row status says delivery is not connected.
- Unknown: which plans are assigned on live tenants. Not in git.

## Related modules
`sites` (tenant id is the scope), `auth` (staff vs member), `design` (saved designs are global workspace records), `media` (blog cover photo must be a tenant photo), `engagement` (chat config is separate from follow-up drafts).

## Sources
`src/workspace.js`, `src/crm-next.js`, `src/crm.js`, `src/control.js`, `src/blog.js`, `src/builder.js`, `src/zoom.js`, `src/views.js`, `db/schema.ts`, `README.md`, `OPERATIONS.md`, `CRM-RELEASE.md`, `DESIGN_RESEARCH.md`.


## Questionnaire tab — local, 2026-09-23/24

The Pack 0 increment adds `settings.platform` (schema in `src/platform/constitution.ts`), a Questionnaire draft editor, published Financing/Promotions pages, a public same-origin quiz-unlock endpoint, and shared footer/location/social settings. New pages default off; public reads use published snapshots; owner publication and existing tenant roles remain unchanged. This work is local and not deployed. Exact behavior, limitations and the full A–AE checklist: [Pack 0 implementation](../product/PACK0_IMPLEMENTATION.md).


Customer-intent references (local): `settings.journey` and `settings.conversionBrief` are normalized on the server. Journey selection is available at creation and in the Questionnaire; briefs and reference-specific confirmed messaging live in the Questionnaire. Save remains draft-only. See [design](design.md#customer-intent-reference-experiences) and [standing design principles](../product/CONVERSION_DESIGN_PRINCIPLES.md).

Questionnaire service controls (local): trade-library checkboxes plus existing custom services edit the same `settings.services` list as the Services tab. Existing selected descriptions and order survive. Save updates the draft only; the existing role and publication rules apply. `service-selection.ts` deduplicates choices and enforces one to 24 selections. The hero checkbox keeps `effects.scrollStory` and `scrollStory.enabled` consistent. Custom additions, description edits and ordering remain in Services.


## Pack 3 commercial and CRM specification — local documentation, 2026-09-23

[Pack 3 U–AA](../product/PACK3_UPSELLS_MEDIA_CRM_SPEC.md) records the proposed versioned Price Book, invoice lines, verified-payment entitlements, 900-second close offer, media/content backoffice and remote CRM adapter. [Catalog details](../product/PACK3_PRICE_BOOK.md) preserve all 45 supplied SKUs plus explicit billing variants and proposed CRM setup. Existing payment records do not implement this ledger or prove payment settlement. `src/crm.js` local contact capture is not a connection to the separate Contractor CRM. No runtime/CRM/deployment change was made in that documentation increment. Pack 4 is now received; see the subsequent specification note below.


## Pack 4 growth and marketing specification — documentation only, 2026-09-23

[Pack 4 AB–AF](../product/PACK4_GROWTH_ADS_EMAIL_SPEC.md) and its [catalog delta](../product/PACK4_CATALOG_DELTA.md) specify seasonal drops, eight creative products, analytics/Growth, approved paid advertising and contractor email. All five files are received; [index](../product/SPECIFICATION_INDEX.md) links their implementation boundaries. No new runtime surfaces or external connections are implemented by these documents. A GA measurement ID is not reporting authorization; existing local contact capture is not remote CRM sync; current form contact consent does not grant marketing consent. Read the per-channel approval/suppression/budget rules before implementing a delivery worker.
