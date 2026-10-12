# Module: sites

Custom-host serving and the flagged CloudFront/ACM backend are documented in [CUSTOM-DOMAINS.md](../release/CUSTOM-DOMAINS.md). `src/domain/routing.js` restricts non-platform hosts to verified active published tenants and the existing rental rules. `src/domain/plan.js` owns provisioning checkpoints, leases, checks and deferred cleanup; Node AWS adapters live in `src/aws/custom-domains.js`. `CUSTOM_DOMAINS_LIVE` defaults off.

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
- **Scripts / data**: `src/client/site/index.ts`, `src/client/workspace/legacy-workspace.js`, `public/site.css`.
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


## Questionnaire, financing and promotions — local, 2026-09-23/24

The Pack 0 increment adds `settings.platform` (schema in `src/platform/constitution.ts`), a Questionnaire draft editor, published Financing/Promotions pages, a public same-origin quiz-unlock endpoint, and shared footer/location/social settings. New pages default off; public reads use published snapshots; owner publication and existing tenant roles remain unchanged. This work is local and not deployed. Exact behavior, limitations and the full A–AE checklist: [Pack 0 implementation](../product/PACK0_IMPLEMENTATION.md).


## Website experience redesign — local, 2026-09-24

`settings.platform.neighborhood` controls a shared city-aware banner and owner-confirmed city-specific review evidence. Public `GET /api/public/:slug/location` uses the published snapshot; `?preview=1` requires membership. Neutral copy is used without approved evidence. Questionnaire changes remain draft until publication. This work is not deployed. See [experience implementation and validation](../product/EXPERIENCE_REDESIGN.md).


Customer-intent references (local): `settings.journey` and `settings.conversionBrief` are normalized on the server. Journey selection is available at creation and in the Questionnaire; briefs and reference-specific confirmed messaging live in the Questionnaire. Save remains draft-only. See [design](design.md#customer-intent-reference-experiences) and [standing design principles](../product/CONVERSION_DESIGN_PRINCIPLES.md).

## First-class page data contracts — ticket #003

`settings.websitePages` is `{version:1,pages:[...]}` normalized by `src/platform/website-pages.ts`. Its discriminated records are service, FAQ, About and city pages, separate from generic workspace `pages` records. Service/city slugs are generated once (or supplied validly), retained on title edits and immutable for an existing ID; FAQ/About use fixed slugs. Persist returned IDs when editing/reordering. Limits, media slots and type-specific fields are declared in `PAGE_LIMITS` and the exported types. Content is plain text; future HTML renderers must escape it.

The existing tenant PUT, render and create APIs accept these records. Omission preserves a previous collection for older clients; explicit `{version:1,pages:[]}` clears only the draft. New pages default disabled. Publication retains the existing owner/version/approval gate and snapshot copy. `validateWebsitePageMedia` checks every referenced photo against this tenant on input and again before publish. References can point to owned brand or project photos; they never imply project approval or grant public access. Media stores photo IDs, alt text and captions; arbitrary media URLs are rejected.

No dedicated page renderer, page editor, public page-image grant or AI portrait generation is added in #003. Those are separate tickets. Existing snapshots/backups retain the new JSON automatically; restore remains draft-only and layout duplication excludes page content/media. Executed evidence: [#003 tests](../build-evidence/003/README.md).


## Roofing service detail — ticket #004
GET /s/:slug/services/:service-slug renders enabled Roofing service records whose serviceName exactly matches a selected service. Public reads use the published snapshot; private ?preview=1 requires active tenant access and disables inquiry submission. Unknown, disabled, unselected or unpublished services return 404. The page uses the existing same-origin consent-protected inquiry handler, retaining service/city/timing in the inquiry message. Breadcrumb Services currently points to the home service section; grid/detail linking remains #005.

Published enabled selected service records explicitly publish their owned hero/bannerOne/bannerTwo photo references through /media/:id. Thumbnail references and other page kinds do not grant access. Draft references remain private. Rendering checks ownership again; static existing service illustrations are the fallback. This does not publish a photo's parent project or other project photos. Page editors, regeneration, all-trade rollout and broader section H requirements remain separate tickets.

## Ticket #004B — premium service rendering and editing

Supersedes #004 service-image behavior: the hero is always generated; only a complete tenant-owned bannerOne/bannerTwo comparison pair can grant public service-page photo access. Unpaired references and hero references stay private under this grant. Questionnaire now edits service headlines, comparison selection and confirmed serviceProfile facts; draft/publish boundaries are unchanged. See [design standard](../TRADE_DESIGN_SYSTEM.md) and [executed evidence](../build-evidence/004B/README.md).

## #004C — sales-preview boundary

GET /sales-preview/:slug/services/:service requires tenant access and a tenant with neither published status nor snapshot. Samples are renderer-only, inquiries disabled. Published /s routes ignore sample query parameters. Questionnaire provides the preview link. See [004C evidence](../build-evidence/004C/README.md).


## #004D — service budget and inquiry context

ServicePage.typicalPriceRange is an optional {min,max} dollar range (0 < min < max <= 1,000,000). Its midpoint initializes the service comparison. Without a range or migrated legacy amount, payment estimates wait for a visitor-entered cost. The same inquiry handler records selected plan ID/name, approximate monthly payment, project amount, down payment and APR/term alongside financing interest. Values are visitor preferences, not an approved offer. Existing draft/publish isolation and consent rules remain unchanged.


## Roofing FAQ route — ticket #006

GET /s/:slug/faq (optional trailing slash) renders only an enabled Roofing FAQ record. It uses the published snapshot unless authenticated ?preview=1 requests the draft. Other methods return 405; missing/disabled/unpublished/non-Roofing pages return 404. Header/footer/service links follow the same enabled-record rule and preserve preview context. No tenant is automatically seeded or published.

Questions are grouped by saved category (blank becomes Roofing questions). Financing/promotions dependencies follow the corresponding platform enabled flags; hidden questions are also excluded from FAQPage JSON-LD and empty groups. All saved text is escaped, including script delimiters in JSON-LD. Related service links use visibleServicePages. FAQ media records grant no public photo access; the hero reuses the generated Roofing still. Native disclosures work without JavaScript; the shared trade-page script enhances the menu/header. Existing tenant page-data APIs are unchanged; the dedicated editor and other trades remain later work. [Evidence](../build-evidence/006/README.md).


## Roofing About route — ticket #007

GET /s/:slug/about (optional trailing slash) uses an enabled Roofing About record from the published snapshot, or the draft with authenticated ?preview=1. Missing/disabled/unpublished/non-Roofing pages return 404, unsupported methods 405. Shared header/footer and the Roofing reference/service/FAQ navigation link to enabled About pages; no automatic seeding or publication occurs.

The existing platform.questionnaire.factsConfirmed flag gates custom About title, intro, SEO text, story and why-us points; absent confirmation uses neutral copy. An empty confirmed About story falls back to the confirmed Questionnaire story. Text is escaped. The existing titleLocked value is preserved; no regeneration occurs. Owned logos display, and only owned uploaded_photo portraits render. Missing/hidden/ai_logo_shirt portraits show designed brand artwork labeled as not a team portrait. The hero remains generated Roofing art. See [007 evidence](../build-evidence/007/README.md). Dedicated About editing/generation remains later work.


## About trust redesign — #007A

settings.businessTrust is normalized by src/platform/business-trust.ts. Every optional fact has a separate confirmed key (license combines number/state, Google combines rating/count/HTTPS Google source). Incomplete groups cannot confirm. Omission preserves prior values for older editors; an explicit empty object clears them. Questionnaire input changes clear only the edited group's confirmation. Owner publication remains the existing snapshot gate; no legacy fact is automatically re-confirmed or synced from a provider.

src/about-page.js replaces #007's About layout: uploaded About portrait or visible owned ownerPhotoId in the hero, otherwise labeled vector truck artwork. This follows Joe's About-only hero override. The About story is displayed at <=60 words; custom story/title still require Questionnaire facts confirmation. The trust band uses at most five individually confirmed facts, renders fewer rather than inventing data, and has static final accessible text plus visual count-up. The three proof cards select confirmed evidence or neutral homeowner guidance; confirmed insurance=false is explicitly negative. No projects means no work section. Recent tiles use only approved published project snapshots and photo IDs belonging to those projects; drafts are never shown even in About preview. A service-area map chip links to the existing homepage Project Map.

The footer's redundant name heading is omitted only for About, keeping header/copyright branding. The disclaimer remains pending #027A. Existing service profile and footer fact controls are unchanged. See [007A evidence](../build-evidence/007A/README.md).

## Trust selections — #008

settings.trust is normalized by src/platform/trust.ts and preserved when omitted by older editors. Explicit {} clears it. Sixteen supported network types have bounded source/profile/approval/evidence/expiry fields; known profile domains require HTTPS. Owner publication calls validateTrustPublication before snapshotting; enabled rating/credential claims require approved profiles and current confirmed source evidence. State-license claims additionally require businessTrust.confirmed.license plus number/state. publicTrustSelections filters expired or incomplete evidence again at render time. No provider is contacted, no logo rights inferred and no private evidence note should enter public markup. The dedicated editor is #047; [#008 evidence](../build-evidence/008/README.md).

## Roofing proof verification — #010

Kit project stories now return to #projects; legacy non-kit cinematic routes still use #area. The Roofing empty Project Map has concise no-photo copy and links to the existing inquiry. Expanded reference-proof tests cover snapshot isolation for project edits, post-publication private uploads, draft logos/review links, cross-tenant logo rejection and unpublish revocation. Browser evidence includes actual API-created approved records with fictional content, mocked Google/Yelp source results, no-feed/no-logo/no-project/no-map/no-JS states. Direct worker private-media denial is 401; the HTTP auth wrapper sends an unauthenticated browser to login via 303 without serving JPEG bytes. [#010 evidence](../build-evidence/010/README.md).

## Reviewed legal facts — #011

`settings.platform.legal` is normalized by `src/platform/legal-policy.ts`: business jurisdiction/license state plus an optional administrator-controlled policy record with jurisdiction/trade scope, review identity/date/reference, expiry and explicit required-license/optional-claim rules. Missing records remain Needs review and retain publication fallback; an attached invalid, stale, mismatched or incomplete policy blocks publication. No inferred state rules or legal certification.

Tenant PUT preserves omitted legal settings for older editors and permits only platform administrators to alter policy records. Restore preserves the current administrative policy while restoring other draft content. Questionnaire edits only business jurisdiction/state; readiness exposes status and missing facts. Public rendering withholds structured positive insurance/bonding claims unless a current policy permits them and the business has supplied the existing attestation. Confirmed negative insurance disclosures remain negative. Arbitrary prose is not certified or analyzed. Real reviewed content is K23; footer required-field placement follows in #012. [Evidence](../build-evidence/011/README.md).

## Footer collapse and required placement — #012

`websiteFooter` renders contact columns only when they contain visible contact content. A location name alone does not create a column. Empty primary/additional regions have no heading, border or reserved gap; configured nav, service areas, social and legal links remain. The primary contact block spans mobile width; additional locations use responsive columns.

The bound reviewed policy's required license number/state and supplied footer disclosure render independently of visibility toggles, with one license line. Missing values are never invented; publication gates come from #011. Existing financing estimate text appears only while financing is enabled, with supplied longer text in a native details disclosure. Optional insurance/bonding still requires the #011 policy and existing attestation. Legal and preview links retain the published/draft access boundary. No real K23 policy is seeded. [Evidence](../build-evidence/012/README.md).


## Footer social identities — ticket #013

`SOCIALS` in `src/platform/constitution.ts` is the shared eight-network list: Facebook, Instagram, YouTube, TikTok, Google Business, LinkedIn, X/Twitter and Nextdoor. Questionnaire controls derive from it. Each network defaults disabled with an empty URL; an enabled entry must have a complete HTTPS URL. The footer renders only known, enabled entries with a URL, as labeled keyboard-focusable links opening in a new tab. Disabling a profile hides its link without hiding the other profiles.

Tenant draft/published snapshot rules still apply: an edit appears in authenticated preview, and the public footer changes only after owner publication. No contractor profile is seeded or inferred. The new icons are local SVGs; Google Business uses a generic location symbol because K22 permitted brand marks/profile evidence are unavailable. The social row makes no rating, certification or provider-connection claim. See [#013 evidence](../build-evidence/013/README.md).


## Homeowner inquiry context — ticket #014

The shared browser handler sends plain notes plus service, projectCity (or city/data-city), sourcePage and optional timing/financing/promotion fields. src/form-fields.js inquiryMessage validates and formats these into the existing bounded inquiries.message column, preserving compatibility with the inbox and contact capture. Same-origin source paths must belong to the destination tenant; query strings/fragments are dropped. Known service/city source records and project defaults use published data, never the draft. Missing explicit context falls back to the site root and existing notes are retained. Source attribution remains visitor-supplied, not proof of identity.

The public endpoint rejects preview request flags, source URLs and referrers. The client suppresses preview/sample paths. Existing same-origin, strict contact consent, phone/name, honeypot, owned published project and three-per-phone/tenant/day checks remain. No marketing permission or outbound delivery is created. No new city renderer or schema migration is included. [#014 evidence](../build-evidence/014/README.md).

## Roofing promotion display states — #015

Promotions pages show enabled current/upcoming/expired groups with start/end instants stored in UTC and visible short dates in the published business time zone (default `America/Los_Angeles`). Only current offers expose quizzes; the existing API rechecks start-inclusive/end-exclusive eligibility on submission. Disabled offers are hidden. The conversion homepage promotion strip follows the page switch and preserves preview context; no-current states use neutral copy. Public reads remain published snapshots, and draft quizzes remain disabled. Dates and states render on each page request; no countdown is added. Receipt persistence and replay/rate-limit extensions were subsequently added by #016 (below). [Executed evidence](../build-evidence/015/README.md).


## Roofing promotion review fixes — #015-v2

`settings.platform.timeZone` is a validated IANA business setting in the Questionnaire. Missing values default to `America/Los_Angeles`; an older editor that omits it preserves the prior value. The public Promotions page formats visible start/end dates in the published zone as short dates. The stored ISO instants still decide inclusive starts, exclusive ends and quiz eligibility. Questionnaire `datetime-local` offer inputs continue to use the editing device’s local time, labeled separately from the public display zone.

The shared site header uses a native `<details>` phone menu. It contains the same available links as desktop plus a dialable business phone when supplied; no JavaScript is required to open it. Rendered promotion fields replace the legacy `<No guarantee>` token with neutral final copy and remove other angle/curly placeholder tokens. [Tests and captures](../build-evidence/015-v2/README.md).


## Quiz completion evidence — #016

The existing public promotion-unlock endpoint now returns a no-store Response from src/promotion-evidence.js. Migration 0006 persists tenant/offer/revision/browser-scoped quiz receipts and fixed-window quota rows. Successful answer verification commits receipt and audit atomically, rechecks current publication and expiry, and only then returns the reward code and receipt reference. The unique scope makes repeat/concurrent success idempotent. Both public quiz clients first establish an HttpOnly same-site scoped cookie so retrying a lost success response retains its receipt. Quotas are 8 requests per offer/browser and 100 per tenant per 15-minute window, including session start, with 429/Retry-After. No IP headers are trusted. A receipt is anonymous browser evidence, not household identity or redemption. Existing preview and no-JavaScript rules remain. New server/browser suites and 28 screenshots: [#016 evidence](../build-evidence/016/README.md).


## #021 Roofing city editorial pages

The existing core-site-pages.js /s/:slug/areas/:city route uses roofingCityEditorial from city-editorial.js for Roofing in Oxnard, Ventura, Camarillo, Thousand Oaks and Santa Paula. Coverage still requires the contractor serviceAreas record and public output still uses the published snapshot. There is no new city schema or route family. Each profile supplies unique copy, four FAQs, metadata and distinct installed representative photographs. roofing-city.css scopes the static editorial design; roofing-city.js only handles failed photographs. Native skip/FAQ/CTA navigation works without JavaScript.

Roofing footer names now link to the first five configured city pages, retaining preview queries. The repetitive neighborhood footer band is omitted only for these editorial pages. Their city-prefilled form reuses site.js and the existing public inquiry API. form-fields.js accepts serviceAreas-owned city source routes as well as legacy enabled websitePages records, so city and source persist to the inbox without creating parallel records. Empty services/nearby lists are omitted. Tests: roofing-cities.mjs and roofing-cities-browser.mjs; evidence: docs/build-evidence/021/README.md.


## #022 local Roofing ebook

The dedicated /s/:slug/resources/before-you-decide-on-your-roof route in src/ebook.js reuses tenant access/publication, source validation and the existing inquiries inbox. Business settings stores ebook.enabled plus reviewedRevision; published output requires both and the current guide revision. Private noindex previews show Sample, and their requests/PDFs use an isolated mode. The two PDFs are bundled private server assets, never public static URLs.

Migration 0007 adds ebook_receipts linked to inquiry IDs. Exact consent wording, purpose, server timestamp and submitted contact details are recorded; unique tenant/revision/mode/browser scope and atomic receipt/inquiry/audit writes make retries idempotent. Existing promotion_unlock_limits is reused with ebook-prefixed hash keys. The quiz code remains unchanged. Public requests reuse local captureContact; no vendor or storage call occurs. A browser-bound receipt is required to download, with tenant access also required for preview. Settings removal revokes publication/download. Delivery is always Not connected; K17/K18 gate future email. Tests: ebook.mjs and ebook-browser.mjs; evidence: docs/build-evidence/022/README.md.


## #023 generation snapshot metadata

Full tenant loads validate generationManifest and adopt older snapshots using their effective saved seeds and choices. Metadata adoption keeps the content version and publication state unchanged and independently records draft/published choices. Corrupt manifests fail validation; they are not regenerated. Normal authorized draft saves synchronize the record; publication still copies the existing draft snapshot with owner approval. Backup restore validates/adopts the original generation record before restoring as draft. generation_manifests keeps immutable history bound to tenant_id; no CRM inbox or workspace record schema is repurposed. The Design templates screen reuses the phone menu and sticky Save flow. Details and role checks are in the design module and #023 evidence.


## #023A — Hero editor

The Hero workspace screen edits existing scrollStory settings through tenant PUT/render and owner publication. Owners/admins must unlock the #023 Scroll Story choice first; editor/viewer mutations fail server-side. Every selected photo is checked against the tenant on create/render/save/publish; public media access uses published references only. New journey hero overrides require scrollStory.editorVersion=1; existing sites render identically until intentionally edited. #023 keeps its existing revision history and stable treatment seeds. See [evidence](../build-evidence/023A/README.md).

## #028A style snapshots

`siteStyle` and `siteStyleSeed` live in the existing tenant settings/published JSON. `cleanSiteStyle` validates the four ids and unsigned seed, preserves omitted values, and retains a stored seed across saves. Creation and duplication use `stableSiteStyleSeed`; no database migration is needed. Existing draft write and owner publish permissions are unchanged.

The public worker applies the published style to every successful `/s/:slug` HTML response. Authorized `?preview=1&siteStyle=classic` previews may try an unsaved look and propagate that choice through the site's own links. Public style query parameters cannot override the published snapshot. The editor render endpoint uses the same decorator. Current adds no style markup or asset links.

## #028E review packets and publication approval

`src/review-packets.js` stores private versioned artifacts under `review-packets/<site-id>/<sha256>/` in the existing object bucket. The version digest covers saved contractor-controlled settings, the #023 manifest, project/photo metadata and public workspace content. Review source/display configuration is included; live Google/Yelp excerpts, provider counts and provider averages are excluded. A dated evidence snapshot is labeled "Reviews shown at time of review — live reviews may differ." It never replaces the published live feed. Same-version capture replay retains this snapshot.

Staff routes: `GET /admin/review-packets/:id`; `GET|POST /api/tenants/:id/review-packet`; `POST .../decision`; `GET .../file?version=<hash>&path=<artifact>`. They require staff identity and existing tenant access; mutations retain same-origin/session/CSRF protections. Only staff can approve/reject. Rejection requires a reason; approval requires all 24 Playbook checklist acknowledgements and complete, intact evidence. Records use the existing `workspace_records` kind `review_approval`, plus `approval.json` in the packet. No migration.

The default target is `website`. Individual project/page/form/blog/visibility publication uses `?target=project:<id>` or the corresponding workspace kind and ID. A packet previews that specific publication against the existing published website (saved draft settings before the website's first publication). Other drafts are not implicitly published. The existing publish APIs require an approved, complete packet for the exact current target/version and verify stored file hashes. Existing owner permission, factual/media validation, version checks, backup and unpublish behavior remain. Saving or regenerating invalidates previous approval; live review updates do not. The staff screen links from the generation panel. A missing local capture binding is explicitly Not connected and blocks publishing.

Automatic generation/save preparation creates a version folder; the host queues and serializes local browser capture. The private capture view reads proposed content without changing publication state. Captured pages are static/reduced-motion views at 1440 and 390; every used local clip has five decoded time samples. Claims/consent text includes page and DOM location. Checklist results remain staff judgments, never an invented automatic certification. Packet media records retain library rights/approval references and Sample status.


## Automatic review QA — #028F

The existing #028E capture now runs deterministic layout, media, video-consistency, disclosure, placeholder, review-source and primary-action checks at 390, 768 and 1440. `src/aws/review-capture.js`, `qa-capture.js`, `qa-browser.js` and `src/qa-gate.js` write version/manifest-bound `qa-report.json` and its readable summary, including measured thresholds, locations, crops and evidence hashes. Every Fail blocks approval. Borderline checks require a staff decision with a reason, identity, UTC time and matching version/manifest/report hashes; a contractor owner cannot clear their own checks. Publication requires both the clear QA report and the existing exact-version #028E approval. Controlled edits invalidate them; live review changes remain excluded. AI review is not connected and custom per-contractor video remains off.

The existing staff review-packet screen shows blocking crops, pending human decisions and collapsed passes. No new provider or dependency is used. Capture still decodes every image, including hidden images. Closed project lightboxes contain no source-free image: the selected source and existing alt are inserted on open and removed on close. QA routing substitutes only the exact project-map OpenStreetMap tile URL pattern with the checked-in neutral schematic PNG and records its hash and local uses per capture; every other external request remains blocked. This is a QA fixture, not a production map-provider change.

Frozen detector bytes are preserved by the file-specific Git attribute. Exact page-type recognition entries and their negative fixtures must continue to satisfy the round-4 SHA-256 restoration proof; do not broaden generic selectors or tolerances. See [#028F evidence and approved-change table](../build-evidence/028F/README.md).

## Launch decisions — 2026-10-10

Payment availability is read-only. Days 0–7 after the first payment failure keep a published site live; days 8–29 return a noindex, no-store HTTP 503 and deny editor writes. Day 30 cancels rental access, returns 404 and fixes the existing data hold at 90 days; the domain stays with the contractor. Verified payment before day 30 restores access without a fee. Billing and the ownership/refund-protected static export retain recovery access; membership and owner/admin checks still run first. Maintenance writes the timeline and locally queued reminders; it sends nothing. See docs/build-evidence/LAUNCH-DECISIONS/README.md for tested behavior and deferred restart/hosting boundaries.
