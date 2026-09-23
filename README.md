# Buildovate contractor websites

The existing platform now renders Robles Roofing with the original cinematic site design. Open `/s/robles-roofing` on the deployed platform. The original separate Robles preview is not modified.

## Running the source

Node 22.13+ is needed for the local SQLite test adapter. Run `npm ci`, `npm run build`, then `npm run dev -- --host 0.0.0.0 --port 4173`. `node tests/platform.mjs` runs server tests; `node tests/presentation.mjs` checks rendered template integration.

The AWS runtime has two local paths, both described in `docs/ENVIRONMENTS.md`. The quick path is in-process (`DATABASE_DRIVER=pglite`, `BUCKET_DRIVER=memory`, `npm run aws:start`). The Docker path (`npm run docker:up`) runs Postgres 16, MinIO, and the app on port 8080. Put `OPENAI_API_KEY` in gitignored `aws/env/docker.env`, not in the example file.

Production uses the Cloudflare Worker in `dist/server/index.js`, D1 binding `DB`, R2 binding `BUCKET`, and the schema migrations in `drizzle`. Sites owns the deployment bindings. Keep `.openai/hosting.json` attached to this existing Site; do not reuse its project ID for a new installation.

The Vite server and `tests/preview-fixture.mjs` are LOCAL TEST ONLY: disposable in-memory records, sample photos, and an injected test identity. They are not imported by the production Worker. Never deploy the Vite test adapter as a production authentication solution. Production identity continues to use the trusted Sites identity headers.

## What changed

- Roofing with Craft/Cinematic presentation uses the ported original hero video, typography, sections, five comparison choices, process infographic, material collages, gallery, and mobile dock.
- Business facts, contact links, services, hero, owner name/photo, and portfolio are populated from saved tenant data. Owner-photo visibility has its own saved toggle.
- A generated roof-cutaway illustration has three synchronized states. Desktop uses a bounded sticky section; mobile uses buttons without pinning. Reduced-motion disables transitions and pinning. Markers share the image viewBox and transform.
- Map search, six filters, synchronized gallery selection, photo-only view, pin comparison previews, project links, and phone links. Errors preserve the gallery alternative.
- Project cover image and photo ordering, with server-side ownership checks. Photos remain resized and metadata-stripped; uploaded files and all project records continue to use D1/R2.
- Additional Clean, Editorial, and Blueprint treatments are selectable. These provide different compositions but are not an automatic agency-quality design generator. Each new trade still needs its own approved copy and imagery.

## Verification performed

Browser QA used Chrome with an isolated local database and actual stock JPEG uploads. No test jobs or leads were added to the deployed database.

- Desktop hero visually reviewed at approximately 1333 CSS pixels wide.
- All five comparison choices clicked and their selected state checked; slider keyboard interaction checked.
- Process recommendation step clicked and its explanatory content checked.
- Cutaway Protect state visually checked for aligned overlays.
- Mobile layout reviewed in a 390px iframe (375px content plus browser scrollbar), with no document horizontal overflow; mobile call dock visible.
- Mobile cutaway button tested; computed layout confirmed `position: static`.
- Two test project records, before/after JPEG uploads, review and publish exercised against the Worker fixture.
- City filter reduced results to one; matching map pin opened a before/after preview; project story opened; inquiry submission returned a saved confirmation.
- Server tests: tenant isolation, editor/viewer limits, private draft media, cross-tenant cover/order rejection, escaped content, origin checks, inquiry attribution, backup file copies and restore concurrency, duplicate isolation, revocation.
- Render tests: five comparisons/five process steps, required map and inquiry markup, exact Robles SEO title, local asset existence, no unresolved template tokens, no invented rating/count, noindex metadata, optional owner photo.

Limits: mobile-width browser QA is not real-device iOS/Android testing. Reduced-motion rules were inspected, not OS-emulated. No Lighthouse/Core Web Vitals score is claimed. Public map tiles need network availability and attribution; gallery browsing remains available if tiles fail.

## Existing operational boundaries

This remains a private, noindex platform. Custom domain routing/SSL, non-workspace contractor access, scheduled backups, continuous monitoring, and outbound notifications require their previously identified integrations. No new claim of production readiness is made for these services.

Project descriptions are manually reviewed factual fields. AI drafting and voice transcription are not connected; no model-generated story or successful transcription is simulated. Canonicals point at the real platform, not roblesroofingca.com. Public search launch needs a deliberate indexing/sitemap/structured-data pass once customer domains and public access are configured. Existing UUID project URLs remain stable.

## Recommended next additions

| Priority | Enhancement | Customer value | Effort | Ongoing maintenance |
|---|---|---|---|---|
| 1 | Curated project collections for sales calls | High: show relevant jobs quickly | Medium | Low |
| 2 | Downloadable project QR codes | Medium: connect yard signs to real work | Low | Low |
| 3 | Reviewed voice-note-to-story drafts | High: reduce contractor typing | Medium | Medium: model cost, factual review |
| 4 | Approved social-post drafts | Medium: reuse documented work | Medium | Medium; no automatic posting |

## Asset credits

Original photos and video retain the credits in the cinematic footer (Pexels, Wikimedia Commons, CC BY/CC BY-SA and public-domain sources). They are labeled illustrative and are not Robles projects. The roof cutaway is an AI-generated educational illustration. Real owner photos and jobsite photos must be supplied with permission.

## Visual editor and sales workflow update

Manage a website to find Readiness, Editor, and (for Buildovate administrators) Sales. The global Pipeline groups every website by a manually recorded sales stage. No sales stage sends a message, charges a customer, grants access, or configures hosting.

The editor previews unsaved content through an authorized server render, with desktop/tablet/mobile frame widths, section visibility and ordering, a customization panel, brand-image selection, contact details, and SEO fields. Save draft persists content with optimistic concurrency; publication remains a separate owner/admin action. Existing sites retain their default section order until edited. Regeneration is not implemented and never overwrites existing sites.

Readiness checks distinguish presence of content from verification. CRM import and lead sync remain disconnected; inquiries remain in the platform. Private presentation links do not grant recipient access.

The sales table is introduced by the additive `0001_natural_vulcan.sql` migration. Sales notes are admin-only and are not included in contractor content backups/restores. Stage history is recorded in the existing audit log. Later stages require explicit manual approval/payment/domain/launch references; these are not automated verification.

Additional verification: `node tests/builder.mjs` covers server-side preview without persistence, escaped input, section ordering and hiding, foreign-image rejection, sales concurrency and evidence gates, role access, and draft/publication separation. Browser checks exercised the Editor, Desktop/Mobile widths, headline preview, hiding Before & After, reordering Process, saving draft, and the Pipeline. These use only local disposable test data.

## Backoffice expansion

New durable workspace records support custom forms and submissions, additional pages,
search profiles, plan entitlements, follow-up sequence drafts, global leads, and sales
documents. New migrations are append-only. Public forms/pages require a published
website and a published record. Plan restrictions apply server-side. Buildovate support
access is audited under the administrator's own identity.

Contractor entry points: Launch Pad, Owner photo, Design templates, Pages,
Forms & submissions, Search visibility, Plan & add-ons, Follow-ups, and Domains.
Draft preview is `/preview/:slug`, with 1280/768/390 CSS-pixel viewports. The existing
visual editor also supports these device widths. The browser service blocked navigation
to the new standalone preview route during this session; its authenticated server route
was verified by integration tests, while the backoffice flows were exercised visually.

Lead CSV import accepts company/name/email/phone/city/notes/stage, up to 250 rows
per import and 500 records in this release. Stages are New, Called, Booked, Built,
Shown, Paid, Lost. Lead stage Paid is a manual CRM classification, not payment proof.
Sales documents support a published immutable approval snapshot and optional validated
hosted payment URLs. Approval records are not verified payment events. Existing private
platform access still applies to shared document URLs.

Provider dependencies deliberately remain inactive:
- Domains: registrar-specific TXT guidance and real ownership verification are available.
  Automated registrar authorization requires a supported domain-connection provider,
  validated routing targets, domain-to-tenant host resolution, and SSL lifecycle handling.
  No registrar passwords are accepted, and DNS traffic is not redirected by this release.
- AI: configure server-side OPENAI_API_KEY using Sites secrets; OPENAI_MODEL is optional
  (default gpt-4.1-mini). Responses web_search generates research drafts only for copy
  fields. Business identifiers/credentials and project inspection facts require human
  input. Research is rate-limited, source-linked, and remains subject to review. API
  credentials were unavailable, so live generation has not been exercised.
- Follow-ups: sequence configuration is persistent; delivery and scheduling are not
  implemented/connected. Before activation, add tenant sender verification, email/SMS
  providers, consent records, opt-out and reply webhooks, quiet hours, idempotent jobs,
  retry handling, and a scheduler. Saving a step sends nothing.
- Payments: automatic checkout generation, signed event verification, refunds, and
  accounting synchronization need a payment integration. No card details are stored.

Backups now include tenant workspace records as well as copied photographs. Restore
returns backed-up pages/forms/search profiles to draft, while retaining current
submissions, follow-up settings, and plan controls. Global leads and sales documents
are not part of contractor website backups.

Run `node tests/workspace.mjs` after building for role isolation, origins, draft privacy,
form submissions, plan enforcement, AI configuration gates, imports, approvals,
photo selection, and workspace restoration checks. Fixtures are test-only.

## CRM, team access, and blog release

- Global Contacts and Leads share the existing lead records, with trade lists, search,
  stage/assignee filters, sorting, pagination, CSV import, bulk stages, and list/board
  views. Contractor Contacts are isolated and updated by new website inquiries.
- Global and contractor calendars store internal appointments linked to contacts,
  with timezone-aware display and an overlap check for the same assignee. They do not
  synchronize external calendars, send invitations, or provide public booking yet.
- Four follow-up playbooks create disabled editable steps: new inquiries, estimate
  follow-up, appointment reminders, and post-project feedback. Message delivery and
  trigger scheduling remain inactive; no messages are sent by applying a playbook.
- The Team screen belongs to the platform owner. Email-bound seven-day invitations
  support administrator and sales-operator roles. Operators may access global contacts
  and calendars, but not global financial records or unassigned contractor workspaces.
  Revoking platform access preserves separately granted contractor memberships.
- Private Sites sharing remains an outer access gate. Team and contractor invitations
  do not automatically add recipients to the hosting access policy. Returning contractors
  with one assigned website open directly on their Launch Pad after ChatGPT sign-in.
- The journal at /s/:slug/blog has categories, search, article covers, excerpts, reading
  time, and independent draft/publication states. Three generic planning guides are
  provisioned as editable drafts; migration 0003 adds them to the existing Robles tenant
  without publishing. Blog records and cover image references are included in backups.
- Roofing maps show three explicitly labeled demonstration scenarios when no real
  projects exist and showDemoProjects is not false. They do not count as completed jobs,
  accept project-linked inquiries, or populate real project records.
- The cinematic estimate planner has been replaced by one actual submission form.
  The old materials section is removed. Owner portraits use a bounded two-column layout.
- Eight service images are AI-generated fictional illustrations, compressed to WebP,
  matched by roofing service category, and labeled as illustrations rather than job proof.

Verification: tests/crm.mjs covers staff boundaries, invitation consumption/revocation,
appointment linkage and conflicts, disabled playbooks, blog privacy, demo rendering,
contact-form changes, and scoped inquiry-to-contact capture. Earlier security and
backup-recovery tests remain applicable. Live payment and messaging provider behavior
has not been tested because those services are not connected.
