# Buildovate Websites — initial private release

This is a separate platform prototype with persistent records. It does not modify the existing Robles Roofing Site or the existing Buildovate CRM.

## Implemented

- Server-authorized Buildovate administrator and per-website owner/editor/viewer membership, bound to a ChatGPT user ID after accepting an email-bound, hashed, seven-day access link.
- Owner initialization is restricted to the verified `yoelengel18@gmail.com` identity. The platform then uses the stored user ID for administrator authorization. No password database or public signup is implemented.
- Website provisioning creates an isolated database record and `/s/<slug>` route in this application. It does not create a separate hosting account or deployment per contractor.
- Draft settings, services, brand photographs, project details and photo uploads. Publishing uses separate saved snapshots, with optimistic concurrency checks.
- Public-style contractor pages, service grids, map filters, before/after comparison, project stories and attributed inquiries.
- Copy a site's layout settings and service names into a new site without copying its private data, contact facts, photos, project records or memberships.
- Per-website backups before publish and restore, plus manual backup. Each backup copies all tenant photographs to separate R2 keys, and stores a SHA-256 checked JSON snapshot of settings, projects, photos and inquiries.
- Restore resets backed-up settings and projects to draft, unpublishes all tenant projects and the website, retains newer projects and existing inquiries, and preserves memberships/domain records. Optimistic restore guards prevent a conflicting restore from mutating the other records.
- DNS TXT ownership requests and manual verification using Cloudflare DNS over HTTPS. No domain is marked hosted or TLS-ready by this verification.
- Manual D1 and R2 write/read health checks, check history, audit records, and recorded server errors.

## Not connected / launch requirements

- This deployed Site is owner-private. Site sharing must permit a recipient before that person can reach sign-in or accept an application invitation. Sending invitation links does not change platform-level sharing.
- Authentication is ChatGPT sign-in. A contractor-native identity provider, password reset, and account lifecycle need a separate integration before broader customer rollout.
- Custom hostname routing, DNS record changes, and TLS certificate issuance are not automated. The domain screen is an ownership-verification workflow, not completed custom-domain hosting.
- No scheduled backup job, independent off-platform archive, retention deletion policy, uptime polling, alert delivery, or email/SMS inquiry notification is configured.
- The JSON download includes stored photo references, not embedded media. R2 media copies are usable for in-platform restores, not an independent disaster-recovery export.
- This code supports up to 60 photos per website, resized to 1600px and 2MB each; uses no background task queue. Large-account pagination, rate controls, resource quotas and load testing need work before scale-up.
- Source versioning uses the Site repository. Runtime database state and storage objects are not in Git.
- All pages remain noindex, including published contractor routes. Remove that policy only as part of an intentional public launch with canonical domains configured.
- No existing Robles project uploads, inquiries, or runtime data are copied into this new platform. The Robles creation preset contains the business facts supplied by the user only.

## Verification

`npm run build` then `node tests/platform.mjs` uses SQLite with foreign keys and an R2 test adapter to exercise role enforcement, tenant isolation, invitation binding/reuse, private media, draft/public snapshots, inquiries, photo backups, stale restore conflicts, restore behavior, duplication and health checks. It does not test actual customer sign-in, actual cloud DNS, real TLS or production load.

DNS documentation: https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/

## Sales operations and project stories

- Project detail pages use a shared responsive case-study layout with verified stored facts, optional real comparison pairs, narrative chapters, selected photos and related stories. Demo stories remain explicitly illustrative.
- Contacts CSV import now includes explicit source-to-destination mapping and review. Unknown columns may map to an existing field, become a custom text column, or be explicitly skipped. Up to 30 custom fields per contact are stored inside the existing scoped record; they are editable and shown in the contacts table. Existing duplicate contacts remain untouched. XLSX files must be exported as CSV.
- Contact and website sales screens open a prepopulated document draft. Customer preview is unsaved and inert; save and publish remain explicit actions. Getting Paid → Manage payment connection explains the hosted-link workflow and links to Stripe settings. No runtime Stripe credentials, checkout creation, or webhook processing are configured.
- Commission statements use global workspace records with administrator-only writes and own-email-only operator reads. One statement per month/member/role. Commission is calculated from manually reconciled collections net of refunds; base, bonus, adjustment and quota are separately entered. Paid requires an external payout reference but does not send money or claim processor verification. Never sum credited collections across roles as unique company revenue.
- Launch navigation contains the operational launch gates and a proposed 30-second commercial storyboard. It does not claim those integrations or a video render are complete.

Validation: sales-ops, workspace, CRM, and presentation tests passed. No new migrations. Browser visual QA was not run in this update.

## Project experience and trade catalog

- Project pages now open with a draggable before/after comparison, photograph thumbnails, stage filters, full-screen photo viewer, specifications, narrative, and one project-attributed inquiry form. Sample stories use explicitly labeled stock reference photos of different jobs; they are not real before/after transformations. Real projects display the saved, validated comparison pair.
- Project size, duration, summary, scope and material details are optional saved fields. Project editing exposes readiness indicators and a draft link. Opening the uploader saves the current project form first, preventing lost copy.
- Seven trade libraries, each with eight candidate specialties, are shared by onboarding and service/project editing. Specialty choices are not automatically published business claims. Lead records/imports preserve a specialty field. Legacy General contracting settings normalize to General Contractors when saved.
- Tests verify comparison/gallery markup and assets, one real project-attributed form, saved inquiry/contact, disabled draft form, project-spec persistence, all seven provisioning paths, and lead-specialty persistence. No new database migrations. Browser visual QA was not performed.
- External launch integrations listed above remain outstanding: this update does not configure payments, public hostname routing, SMS/email delivery, external access, or scheduled operations.

## Trade design kits

- Seven creative kits in public/design-kits.json supply three working visual layouts (immersive, editorial, studio), six configurable effects, a master prompt and reusable component recipes. Each new kit website is rendered by the same showcase renderer as its preview. The former Robles renderer stays active for existing non-kit websites.
- Library previews are authenticated Buildovate-staff-only routes; they use example services and disabled forms. The creation dialog carries the chosen layout and requires at least one explicitly selected specialty. New accounts start with saved business details and a private draft, not a published site.
- Existing draft templates can apply their trade's kit, replacing headline, palette/layout and effects while preserving business details, existing services and projects. Draft publication remains explicit.
- Controls: section reveals, shallow desktop hero drift, pausable location ribbon, service-to-form selection, interactive/static process chapters, sticky navigation/mobile dock. Reduced motion disables animation. No scroll hijacking or WebGL.
- Creative brief text is saved for future revisions, not automatically run through an AI model. Marketing copy does not contain kit names or invented reviews, ratings, credentials, or project counts.
- Six AI-generated illustrative hero assets added for patios, plumbing, HVAC, electrical, landscaping, general contractors; optimized WebP. Roofing reuses the existing stock photograph. Original owner-supplied images override these assets.
- Design-kit tests verify all 21 preview combinations, staff access, applied settings, effect switches, creative-brief persistence, selected specialties, invalid creation gates. Existing project and workspace tests passed. No browser visual QA or new runtime integrations in this release.

## Trade composer, imagery, custom fields and review sources
- Trade Library → Prompt recipes opens the composer. Website → Templates → Open design composer applies a reviewed combination to the draft. Regeneration randomizes checked dimensions; uncheck to lock. No model credentials are needed for this bounded composition engine.
- Cutaway and service-image switches are available in design settings. Assets are illustrative and optimized WebP. Reduced-motion modes retain all content and controls.
- Website → Forms → Edit form supports text, textarea, email, phone, number, date, dropdown, radio, single checkbox and checkbox groups. Custom forms are published separately and linked from the site footer.
- Website → Reviews accepts source URLs, provider identifiers, policy URLs and owner confirmation. Google live API requires server secret GOOGLE_PLACES_API_KEY with Places API enabled; Yelp requires YELP_API_KEY. Never put keys in business settings or browser code. They are not connected by this deployment.
- Google review loading requires privacy/terms URLs. Visitor-triggered live lookups have a per-tenant daily cap of 100 requests and no content caching. Monitor provider billing before enabling at scale. Aggregate ratings are never recalculated from selected excerpts.

## Saved design collection and trade films
- Explore Design now opens the full composer, including regeneration, four curated directions, previous-design recovery, preview devices, saving and reuse. Checkbox locks apply to randomization; curated directions intentionally replace the full visual direction.
- Saved templates are global admin-only records with normalized layout, palette, typography, framing, reveal, spacing and effect settings. Saving an identical combination returns its existing record. Contractor business copy, contacts, uploaded photos and credentials are not copied into templates.
- Usage counts mean distinct contractor websites, not page views or repeated saves. Matching existing draft/published sites are included when saving; future creations, applications and duplications are recorded. Historical usage survives later design changes. Templates not previously saved cannot reconstruct every deleted historical design.
- Seven local MP4s are 12-second AI-generated architectural transformation films with audio, not real jobsite footage. All are user-initiated, muted initially, preload none, and have generated concept posters and visual-story text alternatives. Native controls, chapter selection, replay and sound toggling are available.
- Trade previews include three labeled illustrative map examples. Real contractor map sections use actual published records and a truthful empty state. New optional components include contact bands, commercial section, map, reading-progress line, chapter rail, service hover lighting and planning questions.

## Cinematic transformation revision
- All seven trade films use generated moving architectural scenes. AI concept labels remain visible. The AR-style overlay is a visual guide, not a sensor-based scan or live camera augmented-reality feature.
- Each separate system explorer retains its high-quality base image; SVG locator paths, halos and user-controlled scanning sit above it. Tours stop offscreen or when the page is hidden. Reduced-motion users advance one detail at a time.
- Film prompts and asset provenance are retained in CINEMATIC_ASSETS.json. The regeneration composer reuses the generated film for its trade; it does not submit new paid video-generation jobs.
