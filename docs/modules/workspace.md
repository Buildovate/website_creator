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

## #004C — service conversion controls

Questionnaire now edits service finance terms and required footer disclosure, promotion service tags/AI graphic selection, and links to authenticated unpublished sales preview. Saving remains draft-only. The existing inquiry transport includes financing interest and an unlocked code in its message while retaining consent and preview suppression.


## #004D — Questionnaire financing controls

The service fieldsets edit typical project-cost minimum/maximum. Financing supports adding/removing up to 24 named programs with APR, term, configured partner, enabled/confirmation and deferred-interest fields. Saving remains draft-only; programs do not establish merchant enrollment or retrieve rates. Empty lists hide service-page financing. Footer-legal disclosure remains required for rendering. [Evidence](../build-evidence/004D/README.md).

## Questionnaire legal review — #011

The legal policy panel shows Needs review, Required facts missing or Reviewed policy on file. Business jurisdiction and license state save to the draft; review metadata is read-only. Existing tenant PUT enforces administrator-only policy changes, and publication checks the attached policy. No actual jurisdiction policy is seeded. [Evidence](../build-evidence/011/README.md).


## Platform phone layout — #015A

The dashboard entrypoint loads src/client/workspace/mobile.ts and platform-mobile.css. At 700px and below, a labeled Website screen selector activates the existing section handlers, tables become labeled records, forms/dialogs reflow, and a fixed action dock forwards the current save/publish controls. The dock moves into an open dialog's top layer, respects inherited disabled state, and uses visualViewport offsets for the keyboard. The screen selector remains usable for viewers. Desktop contacts/boards wrap within the available workspace. The editor fits its virtual preview width using a bounded transformed iframe.

The shared observer must continue past already initialized camera inputs; returning from that loop strands the action dock in a closed dialog. tests/platform-mobile.mjs checks all inventoried phone/desktop states, real dock geometry, save/reopen, preview/publish isolation and editor/viewer permissions. Physical phone acceptance is tracked separately in [#015A evidence](../build-evidence/015A/README.md). No public website or separate Contractor CRM implementation changed.


## Business time zone — #015-v2

The Questionnaire’s Business section saves a validated `settings.platform.timeZone`, defaulting to `America/Los_Angeles`. The public promotion date display reads the published snapshot; draft saves do not alter it. Legacy editors that omit the field retain the previous zone. Offer start/end `datetime-local` inputs remain in the editing device’s local time, which the form labels explicitly. [Platform phone/desktop save evidence](../build-evidence/015-v2/README.md).

### #015B platform mobile polish

The shared phone CSS keeps Contacts trade tabs in one scrollable row, while the workspace heading offers Publish changes only in public website editing sections. Photo file inputs and camera buttons use the platform button language; the phone upload submit is represented once in the fixed action dock. The same #015A browser harness verifies these states and its full screen inventory. [Screenshots and test results](../build-evidence/015B/README.md).

### #015C Contacts restore

Global Sales CRM and contractor Contacts share the scoped `crm-next` bulk endpoint for assign, stage and delete. It validates record versions and reports changed/skipped counts. The scoped inline notes endpoint updates only notes with an optimistic version check. The client adds select-page, a sticky bulk bar, guarded UTF-8 CSV export, call-outcome filtering and editable notes. At phone width, search and a Filters dialog sit above compact contact cards; desktop uses the table and inline controls. [Tests and screenshots](../build-evidence/015C/README.md). The `.data/sites-v11-recovery` reference remains untouched.

### #015D Callbacks and contact detail

`POST`/`PUT /api/workspace/:scope/contacts/:id/callback` validates the contact and callback versions, team assignees, 15/30/45/60-minute reservation and same-scope calendar conflicts. It writes a `callback` calendar record and updates the contact’s scheduling activity and next callback; ordinary calendar edits cannot change callback records. Follow-up staging excludes callbacks, and the callback editor sends no prospect invitation. Contact edits preserve existing website, design, payment and callback link fields. Phone Calendar starts in Upcoming; callbacks use a distinct event treatment in every calendar view. [Tests and screenshots](../build-evidence/015D/README.md). The v11 recovery tree remains unchanged.


## Admin Expenses & Margin — #015G

Admin-only /admin/expenses and /api/admin/expenses are enforced by identity().admin, including receipts and CSV exports. Revenue navigation is admin-only. Operator and contractor access returns 403; private HTML participates in the existing session policy. src/expenses.js stores expense_vendor, expense_product, expense_entry, expense_bill, expense_revenue, expense_rule and encrypted expense_credential records in global workspace_records. Every API read/export and mutation is audited; writes use optimistic versions. Receipts are private objects under expenses/receipts, downloaded with attachment and nosniff headers; 5 MB PDF/PNG/JPEG limit.

Initialize loads nine unknown-rate vendors, six unpriced products and the immutable local evidence import (318 Higgsfield generations / 636 credits). Repeated initialization preserves edits and never duplicates history. Product/rate edits need no code change. Negative ledger amounts are refunds. Reconciled revenue references an existing sales document, site and product; signed documents, CRM Paid labels and commission attribution never become revenue automatically. Recurring Operating bills allocate costs evenly across published sites at posting; Development stays outside running cost and operating margin. No historical active-site roster is inferred. Unknown Operating costs suppress margin; unknown Development costs suppress payback, which also requires real positive margin. CSV import is pending, with stable source IDs; bank/receipt links prevent duplicate expense recognition. A new vendor supports manual/CSV/receipt workflows immediately.

Existing OpenAI and Places fetches use expenseFetch: actual connected response usage, provider/model/effort and known site/product are retained. Higgsfield has an internal self-meter hook for a future connected generation path. These hooks make no extra external request. Imports are Not connected; Sync posts nothing. The encrypted credential API is admin-only and returns only stored status, never ciphertext or plaintext. No live connector consumes credentials yet. See NEEDS-KEYS.md and docs/build-evidence/015G/README.md for the explicit live gates.

UI: src/client/workspace/expenses.js and public/expenses-admin.css. Seven views, date ranges, scoped drill-downs, CSV export, native focus-trapped edit dialogs, sticky Save, phone cards, 44px targets, loading/empty/error/offline/partial states. No public template or drone asset changed.


### #015GA expense dashboard polish

The expense UI adds recorded-data charts in src/client/workspace/expense-charts.js, four KPI cards, scoped phone menu, pill navigation and native drill/editor sheets. Chart rendering reuses the existing posted/priced math and never fills missing rates with observations. src/expense-plans.js contains the three approved internal catalog prices and unknown Metricool pack rates. A versioned admin-only catalog seed upgrades initialized #015G registries once while preserving supplied prices and rates; new initialization also applies it. Product metadata now includes annual prepay, setup fee, billing period and social-post allowance. No accounting, import, access or real-history changes. This does not activate public billing or #015H. Evidence: docs/build-evidence/015GA/README.md.


## #017 — financing setup states

The Questionnaire retains incomplete lender selections, supports the five named lenders plus Other/None, and labels API status Not connected separately from a confirmed business link. Saving does not connect a provider or publish. The master control writes financing.requested and enabled together; normalized enabled is the derived public-availability flag, while requested preserves setup intent. Public availability requires current supplied terms and a confirmed link; None hides financing without deleting settings. The existing role/save/publish boundary and phone action dock are reused. New programs start with blank APR and term, not guessed defaults. Disclosure editing is labeled for /legal. Offline save failures retain answers and explain retry. Evidence: ../build-evidence/017/README.md.

## #028A Look of your site

The contractor's Design settings switcher adds Look of your site alongside Design locks and Creative direction. `src/client/workspace/site-look.js` renders four real homepage hero previews in script-disabled iframes, sized to their cards. Each Preview link opens the authorized full-site preview. One Save look action uses the existing tenant draft API; the existing Publish action remains separate. Editors can save a look; viewers can inspect previews but cannot save; only existing owner/admin permissions allow publication. Offline, failed and stale saves retain the selected option.

Design-lock status uses ordinary draft/live wording, and its heading reads “Choices to keep when we refresh your site.” Existing lock and regeneration behavior is retained. The mobile platform dock remains the only visible Save action on its screen.

## Launch decisions — 2026-10-10

Game's Estimator quest reads a saved, offered service's price range; Marketing reads a saved GBP/review link or a tenant-scoped connected social account. No completion or XP rows are fabricated. Billing uses /api/payments/tenants/:id/billing with owner/admin POST actions own and stop-hosting, plus the existing switch/cancel/portal paths. Same-cadence upgrades settle a guarded prorated difference; downgrades start next renewal. Ownership costs $1,500 with no paid-rent credit. Connected owner hosting is $50/month at the confirmed next paid cycle. If no future paid cycle exists, scheduling stays Pending instead of charging immediately. Live Stripe keys remain rejected; see docs/build-evidence/LAUNCH-DECISIONS/README.md.
