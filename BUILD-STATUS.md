# BUILD STATUS

## Waiting on Joe

None for the current queue. #004F-v2 was cleared after the approved revised-budget delivery and browser QA passed.

Audit: 2026-09-24. Scope: the current local `C:/Users/joe/website_creator` working tree, including pre-existing uncommitted work. Branch at audit: `feature/local-environment-setup`; HEAD `f9f4ec6`. This is not a staging/production audit. All five packs are received; their existence does not implement their requirements.

**Done** means the entire section’s applicable behavior runs, has evidence, and has no missing required integration. **Partial** means a relevant portion actually runs, with the remainder stated. **Not started** means only plans or reusable foundations exist for that feature. “Unsure” appears wherever the evidence cannot resolve a claim. No section is marked Done solely because constants, a mock, an environment-variable check, a creative brief or a provider link exists.

No feature code was changed during the initial Step 1 audit. Ticket #001–#010 and #007A changes and fresh evidence are recorded below. Tests use isolated local fixtures and mocked external services. Their passes do not prove a production connection. No private environment files, credentials or external account configuration were inspected.

Whole-section totals: **0 Done / 18 Partial / 14 Not started**. A whole-section score is not a count of working individual features.

| Section | Status | Files / implementation location | What runs / evidence | Missing or unsure |
|---|---|---|---|---|
| A. Promotions page | Partial | `src/constitution-pages.js`; `src/client/site/constitution.ts`; `public/constitution.css` | Published page, inquiry form, date-filtered offers and quiz unlock run (E1). | Roofing-specific display polish, contextual strips, full unlock menu and distinct page films. |
| B. Financing page / calculator | Partial | `src/constitution-pages.js`; `src/platform/constitution.ts`; `src/client/site/constitution.ts` | Amortization, editable comparisons and Get Financing Options disclosure for 1–3 confirmed links run (E1/E2). | Live offers/prequalification and provider status handling. Joe says no lenders are connected. Link selection is not offer retrieval. |
| C. Financing / social setup and permissions | Partial | `src/platform/constitution.ts`; `src/client/workspace/questionnaire.ts`; `src/api.js` | Page switches, confirmed application URLs and social switches save as draft (E1). | Provider onboarding/connection states, enabled-but-zero-live state, calculator defaults and field-level Office restrictions. |
| D. Four distinct financing/promotion films | Not started | `src/constitution-pages.js`; `public/trade-build-films.json`; `src/client/site/constitution.ts` | Reusable homepage-film scrub controller exists; this is supporting code only. | Four dedicated clips (ambient + scrub on each page), approval, separate slots and fallbacks. Existing reused homepage footage does not satisfy D. |
| E. Footer and legal audit | Partial | `src/site-polish.js`; `src/social-icons.js`; `src/platform/constitution.ts` | Shared footer, generic legal routes, visibility controls and financing disclosure run (E1). | Required-license policy, bonding-claim restrictions, complete jurisdiction/provider copy, missing social identities and public empty-state audit. Legal suitability is unsure; not verified by tests. |
| F. CTA psychology / burst / pricing placement | Partial | `src/conversion-page.js`; `src/design-personality.js`; `src/client/site/conversion.ts` | Intent-specific CTA copy, service preselection and reference journeys run (E3). #002 locks Roofing repair/replacement messaging to selected offerings, with desktop/mobile and saved-inquiry evidence. | Approved trade burst library, controlled one-per-site randomized pricing placement and full page-family coverage. |
| G. Mid-page trade story | Partial | `src/scroll-story.js`; `src/craft-story.js`; `src/hero-timelapse.js`; `src/conversion-page.js` | Existing trade scroll scenes, films and reference cutaways render. #002 verifies the preserved Roofing hero reaches its last frame, reverses, and retains sticky navigation; controller tests pass 8/8. | New per-trade mid-page compositions tied to approved regeneration manifests, distinct from the homepage hero. |
| H. Individual service landing pages | Partial | `src/website-pages.js`; `src/showcase.js`; `src/conversion-page.js`; `tests/website-pages.mjs` | #004 renders enabled selected Roofing detail pages. #005 connects both homepage grids using stable slugs and snapshot visibility; all eight services, draft removal/reordering and preview access verified. [Evidence](docs/build-evidence/005/README.md). | Page editors, other page-family features, creative generation and full H coverage remain open. |
| I. Unique ebook capture / email delivery | Not started | `src/workspace.js`; `src/platform/constitution.ts` | No ebook renderer/capture/delivery implementation found. | Per-generation title/cover/PDF, consent, capture, delivery worker and failure/retry UI. |
| J. Unique creative regeneration | Partial | `src/design-variant.js`; `src/design-personality.js`; `src/saved-designs.js`; `src/client/workspace/legacy-workspace.js` | Layout/recipe composer and saved designs exist; assets and facts are preserved. | Generation manifest, new per-customer artwork/content, job lifecycle, locked choices and approved activation. Recipe variation is not AI regeneration. |
| K. Sales Rep product | Partial | `src/crm.js`; `src/control.js`; `src/workspace.js`; `src/client/workspace/legacy-workspace.js` | Staff/operator roles and manual own-commission access run (E5). | Dedicated Sales Rep permissions, 50/50 sales-goals calculator, verified progress/streaks and explainer. Manual commission rows are not a verified payout ledger. |
| L. General trade FAQ page | Partial | `src/conversion-page.js`; `src/platform/conversion.ts`; `src/platform/website-pages.ts`; `src/api.js`; `tests/website-pages.mjs` | Inline FAQs run (E3). #003 adds persisted grouped FAQ records, stable question IDs, bounded answers and financing/promotion dependency fields. | Dedicated backoffice FAQ editing/seeding and all-trade coverage remain open. #006 renders enabled published Roofing FAQ records, groups visible answers, filters financing/promotion dependencies and adds navigation plus matching FAQPage structured data. [Evidence](docs/build-evidence/006/README.md). |
| M. Questionnaire / backoffice consolidation | Partial | `src/client/workspace/questionnaire.ts`; `src/client/workspace/service-selection.ts`; `src/platform/constitution.ts` | Business facts, selected services, logo selection, hero and options switches work (E1/E3). | New page fields, media/brand intake, integration status, structured locations/hours and safe consolidation of duplicate editing screens. |
| N. Five city landing pages | Partial | `src/site-polish.js`; `src/client/workspace/questionnaire.ts`; `src/neighborhood.js`; `src/platform/website-pages.ts`; `tests/website-pages.mjs` | Existing city inputs/banner; #003 saves up to five unique city records with stable slugs and same-collection service references, isolated from the public snapshot. | Unique rendered city pages, truthful local content, form context and footer links; a city record does not establish an office. |
| O. Service thumbnail effect library | Not started | `src/design-variant.js`; `src/client/site/showcase.js`; `public/showcase.css` | Generic layout/card/reveal variants exist, not the specified service-effect picker. | Approved effect library including accessible 3D flip, picker, reduced motion, locks and regeneration assignment. |
| P. Trust strip / source reviews | Partial | `src/platform/trust.ts`; `src/trust.js`; `public/trust.css/js`; `src/reviews.js` | #008 source/evidence/expiry contract and publication gates; #009 selected Roofing row/carousel with text/source-link fallback; #010 map/logo/privacy checks and #010A first-screen source cards pass on desktop/mobile. [Latest evidence](docs/build-evidence/010A/README.md). | K22 permitted marks, #047 editor, live Google/Yelp account validation and broader page/trade adoption remain open. Owner-confirmed data and mocked tests do not establish live verification. |
| Q. About page / logo-on-uniform portrait | Partial | `src/website-pages.js`; `src/site-polish.js`; `src/worker.js`; `src/platform/website-pages.ts`; `tests/website-pages.mjs` | #007 renders enabled published Roofing About records with confirmed story/why-us copy, owned uploaded portraits/logos, and an honest designed no-person fallback. Private previews and media grants are tested. #007A adds individually confirmed trust fields/Questionnaire, stat band, photo/truck hero, proof cards, concise story and published project tiles. [Latest evidence](docs/build-evidence/007A/README.md). | Dedicated editor, unique copy/portrait generation and regeneration respecting title locks remain open. AI portrait mode uses a designed fallback; no generation integration is claimed. |
| R. Vertical trade Shorts | Not started | `public/trade-build-films.json`; `public/trade-craft-films.json` | Existing landscape trade films are supporting assets, not the required vertical Shorts. | Approved 12–15 second 9:16 deliverables, captions/phone/end card and all 14 trades including Windows/Doors and Solar. |
| S. Company fields / multiple locations | Partial | `src/platform/constitution.ts`; `src/client/workspace/questionnaire.ts`; `src/site-polish.js` | Eight field toggles, extra locations and published visibility pass E1. | Full S still incomplete: structured hours, primary/reorder/archive model, total-ten migration, empty-card suppression and proof/license policy. Earlier core-controls Done wording was too broad. |
| T. Earned promotion tasks | Partial | `src/platform/constitution.ts`; `src/constitution-pages.js`; `src/client/site/constitution.ts` | Same-origin quiz validation, code reveal and expiry run (E1). | Other task types, persisted completion/redemption evidence, abuse limits and honest pending/manual verification for unsupported social actions. |
| U. AI promotion artwork | Not started | `src/client/workspace/questionnaire.ts`; `src/constitution-pages.js` | Promo editor currently saves text/quiz fields. No app image job found. | Generate-on-save job, brand input, approval/regenerate/version controls, storage and retries. Images created in chat are not an in-app integration. |
| V. Real UGC module / paid AI video packs | Not started | `src/api.js`; `src/aws/s3.js`; `src/workspace.js` | JPEG upload and static film playback are supporting code only. | Video upload/transcode, rights, variable slots, moderated samples, entitlements and AI explainer ordering. No fabricated customer testimonials. |
| W. Price Book / 15-minute close offer | Partial | `src/platform/constitution.ts`; `src/workspace.js`; `src/client/workspace/legacy-workspace.js` | Four catalog constants; manual proposal/invoice amount, hosted link and acceptance locking run (E6). | Versioned shared SKU line items, full catalog, settlement/entitlements, server-timed add-on-only 10% offer and immutable expiry. No automatic payments claimed. |
| X. Distribution / project media | Partial | `src/api.js`; `src/project-map.js`; `src/workspace.js`; `src/engagement.js` | Approved project photos/map and scoped records work (E4/E6). | Social/GBP OAuth, channel adapters, captions, durable approved publish queue, retries and real delivery receipts. Footer profile links do not connect accounts. |
| Y. Monthly content calendar | Not started | `src/workspace.js`; `src/control.js` | Calendar appointments and held follow-ups are unrelated scaffolding. | Content month model, generated captions/creatives, review, scheduling, channel delivery and plan entitlements. |
| Z. Upsell education videos | Not started | `src/client/workspace/legacy-workspace.js` | Commercial storyboard text exists; no complete Z media pack found. | Approved contractor-only hero/micro clips and placement on sales, invoice and backoffice surfaces. |
| AA. Remote Website ↔ Contractor CRM sync | Not started | `src/crm.js`; `src/workspace.js`; `src/project-map.js` | Local captureContact writes this app’s workspace records (E3/E6). | Remote contract/auth, lead delivery, photo import, rights, dedupe, retries and explainer. Separate CRM remains untouched. |
| AB. Seasonal recommendations | Not started | `src/platform/constitution.ts`; `src/workspace.js` | Manually dated promotions are reusable foundations only. | Seasonal rules/reminders, recommendations, brand creatives/Shorts, approval, plan quota/renewal and promotion lifecycle. |
| AC. Eight creative products | Not started | `src/neighborhood.js`; `src/project-map.js`; `src/workspace.js` | City personalization/project storage exist; neither is proof of the eight AC features. | Weather homepage, storm companion, job binder, past-customer referrals, Spanish switch, crew QR, HOA packet and factual competitor comparison. |
| AD. GA4 / Growth dashboard | Not started | `src/control.js`; `src/workspace.js` | Connection UI explicitly says analytics not connected; manual health/visibility records exist. | Verified GA authorization, consent-aware measurement, reporting, no-data dashboard, qualified-lead attribution and approved Growth tasks. |
| AE. Paid ads from approved media | Not started | `src/control.js`; `src/workspace.js` | No campaign delivery adapter found. | Account connections, creative drafts, exact-budget approval, publication, spend reporting and stop controls. No spend authorization inferred. |
| AF. Contractor email marketing | Not started | `src/workspace.js`; `src/control.js`; `src/crm.js` | Follow-up drafts explicitly held; RESEND_API_KEY flag is not a delivery worker. | SendGrid per-contractor subuser/domain setup (no SES or Resend delivery), permissioned lists, templates/graphics, suppression/unsubscribe, approved sends, webhooks and honest reporting. Current sender/account access unsure. |

## Evidence: initial audit and ticket #001

| ID | Existing command | Result | What it establishes |
|---|---|---|---|
| E1 | `node tests/constitution.mjs` | PASS | Settings/calculator; roles and publication; quiz expiry; 84 legal-preview links. |
| E2 | `node tests/trades-financing.mjs` | PASS | New trade render/assets and 1/2/3 finance links; no live lenders tested. |
| E3 | `node tests/conversion-references.mjs` | PASS | Three reference journeys, service selection, inquiry persistence and draft boundaries. |
| E4 | `node tests/reference-proof.mjs` | PASS | Project/logo privacy, no-key review fallback and mocked provider attribution. |
| E5 | `node tests/sales-ops.mjs` | PASS | Manual commission math, own-record access and optimistic writes. |
| E6 | `node tests/workspace.mjs` | PASS | Roles, pages/forms, plan gates, proposal locking, uploads and backups. |
| E7 | `node tests/engagement-providers.mjs` | PASS (#001) | Previously failed at result.google[0]. Existing test now passes unchanged: profile matching, rating/filter integrity, provider excerpts and draft access. |
| E8 | `node tests/review-lookup.mjs` | PASS (#001) | Both lookup request/response contracts, no-key fallback, provider failure, auth/origin, invalid URLs, no save/publish side effects and shared rate limit. |

Step 1: E1–E6 exited 0; E7 failed with `TypeError: Cannot read properties of undefined (reading '0')`. Ticket #001: a fresh server bundle plus E4, E7 and E8 all exited 0. Other suites were not rerun for this scoped repair. The defect affected the actual profile-matching UI as well as its test; it was not a stale-test-only failure. Historical browser/build evidence in `docs/product/IMPLEMENTATION_ROADMAP.md` is not a new live-provider test.

## Boundaries and future updates

- Roofing must be the first completed homeowner reference (#001–#028); perfect it before #029+ trade rollouts. Preserve all 14 templates/media. If K02 is missing, #024–#027 use tested labeled film stubs; finish #028 with external gates listed. Films do not block the selling site.
- Financing follows the latest user direction: calculator → **Get Financing Options →** → enabled providers. No public lender showcase; no pretend live rates. Joe confirmed no lender connections on 2026-09-24.
- Existing local copy, motion, selected services, sticky navigation, logo, review sources and Project Map are preservation requirements.
- A key-dependent stub can satisfy a ticket explicitly scoped as a stub, but never upgrades the corresponding live integration/whole section to Done. Record it as Partial or Not started here and keep the live ticket open.
- At each ticket close, update the relevant rows and append evidence below: ticket number, commands/results or screenshot path, remaining gap, connection mode and commit. Do not fabricate an executed check or infer a production release from local tests.
- Implement only in `C:/Users/joe/website_creator`. No edits to Buildovate/buildovate or CRM backend/frontend/backoffice, and no push/staging deployment from tickets. #156–#158 alone cover documented sandbox CRM adapters. Required CRM-code changes trigger a stop/report and separate branch/PR for Louie.
- SendGrid only with per-contractor subusers, no SES/Resend delivery or cold email; consent and suppression precede any send.
- The repo already has substantial dirty work. Ticket commits must preserve unrelated earlier work; stage only the ticket changes, never `git add -A`.

## Ticket evidence log

### #001 — Done (2026-09-24)

- Cause: the server returned `{provider, results}` for profile-form submissions while the running backoffice `bindReviewSection` and existing test expected `{google, yelpBusinessId, status}`. The older profile validation/no-key behavior had also been lost.
- Fix: preserve the profile-form contract, URL validation, parsed Yelp identity and honest setup fallback; keep the explicit Google/Yelp business-search contract through shared provider-search code. Lookup cannot save/confirm/publish profiles.
- Scope: `src/reviews.js` lookup implementation, new `tests/review-lookup.mjs`, the lookup contract line in `docs/modules/engagement.md`, plus the four build-control documents. Existing `public/engagement-ui.js` and `tests/engagement-providers.mjs` are unchanged. No CRM repo, push, deployment, customer message or live provider request.
- Verification: rebuilt `dist/server/index.js` with esbuild from `src/worker.js`; build exited 0. All three commands below exited 0 on the local working tree:

```text
node tests/review-lookup.mjs
PASS review lookup: profile-form compatibility, Google/Yelp business search, missing-key fallback, invalid profile/origin/auth rejection, empty matches, upstream failure, draft/publish isolation and shared hourly limit. All external responses mocked; no live connections or messages.

node tests/engagement-providers.mjs
PASS mocked providers: SMS verification, alert addressing, signed inbound replies, webhook replay deduplication, changed-phone re-verification, Google match/filter/aggregate integrity, Yelp excerpts and private draft access. No real messages or provider requests sent.

node tests/reference-proof.mjs
PASS reference proof: published project map, unpublished isolation, owner visibility, logo privacy/publish, connected review placement, no-key fallback and mocked provider attribution/filtering.
```

- Remaining: section P stays Partial. Trust-strip delivery and actual provider access are separate tickets. Mocked test responses are not connected live accounts.
- Commit locator: `fix: restore review lookup compatibility (#001)`; use `git log -1 --format=%h --grep='restore review lookup compatibility'` for its hash. Only the lookup portion of previously modified source/module files is included; prior unrelated work remains uncommitted. Build-control files created in Step 1 are included with these requested corrections.
- At #001 close, the next ticket was #002; see its completed entry below.

### #002 — Done (2026-09-24)

- Change: Roofing copy/CTAs now cover repair and replacement only when both services are selected; repair-only wording remains available. Existing headline, hero film, sticky header, call links and contractor-selected services remain intact. Other trade copy is unchanged.
- Evidence: [full commands, browser checks and screenshots](docs/build-evidence/002/README.md). Fresh server bundle, conversion/Roofing regressions and direct client typecheck exited 0; scroll controller passed 8/8. Browser checked 1440×900 and 390×844, full-film scrubbing/reverse, sticky header, mobile navigation, service preselection, overflow and a saved local inquiry.
- Screenshots: [desktop hero](docs/build-evidence/002/roofing-desktop.png), [mobile hero](docs/build-evidence/002/roofing-mobile.png), [desktop services](docs/build-evidence/002/roofing-services-desktop.png), [mobile saved request](docs/build-evidence/002/roofing-mobile-request.png).
- Connection mode: local, synthetic fixture, memory storage, no keys and no external delivery. Separate CRM, staging and production untouched.
- Remaining: F/G stay Partial; later CTA/mid-page-story work is not part of this ticket. No new feature section is marked wholly Done.
- Commit locator: `fix: lock Roofing homeowner journey (#002)` (`git log -1 --format=%h --grep='lock Roofing homeowner journey'`). Only ticket source/test/fixture/evidence files, the design-module ticket note and build ledgers are included. Previously untracked reference scaffolding in the three ticket-listed files is recorded; unrelated dirty work remains uncommitted.
- At #002 close, the next ticket was #003; see its completed entry below.

### #003 — Done (2026-09-24)

- Implemented `settings.websitePages` version 1: typed service, FAQ, About and city records; generated/stable IDs, stable slugs, singleton FAQ/About URLs, bounded content (64 KB aggregate), 24-service/5-city limits and valid city → service references. New records default disabled. Titles can change without changing saved URLs.
- Page media contains uploaded photo IDs plus alt/caption text. Save, render, creation and publication enforce tenant ownership, including rechecking stale stored drafts. These contracts support owned brand/project media references; they do not change public media access or claim that a project is approved.
- Older editors omitting `websitePages` retain it. Explicit clearing/deletion changes only draft settings; publication copies the reviewed snapshot. Existing editor/owner/viewer roles, origin checks, version conflicts, backups/restores and layout-only duplication remain enforced.
- Executed evidence: [commands and actual output](docs/build-evidence/003/README.md). Fresh server bundle PASS; #003 suite **11 passed / 0 failed**; TypeScript exit 0; constitution/settings, conversion/Roofing and reference-proof regressions PASS. Local in-memory fixtures; no external accounts/keys are needed or claimed.
- Remaining: service/FAQ/About/city renderers, backoffice controls, public page-media exposure and feature-specific readiness belong to later tickets. No new page route or homepage UI was added. Whole-section counts remain **0 Done / 17 Partial / 15 Not started**; H remains a data foundation.
- Scope: `src/api.js` was added to the ticket file list because tenant media ownership must be enforced where settings enter/publish. Only #003 deltas of previously dirty core/API/module files are staged. Validation covers the current local working tree; pre-existing uncommitted foundations/assets are not bundled into this commit, so it is not a clean-checkout release certification.
- Commit locator: `feat: add draft and published page contracts (#003)`.
- **Next ticket: #004 — Render a Roofing service-detail page.** Stop; #004 has not started.

### #027A — Queued before #028 (Not started)

Joe’s corrected Roofing polish ticket is recorded in BUILD-BACKLOG.md: preserve designed/generated hero imagery (no real contractor-photo substitution), show the finished roof first while retaining trusses as story step 1, remove the “illustrative concept” note everywhere it appears, add one more direct backoffice headline option, and leave CTA labels unchanged. #027A must precede #028. This session only logs it; no polish behavior is claimed complete.

### #004 — Done (2026-09-24)

- Added Roofing service-detail rendering, responsive sticky navigation, service art, FAQ, scope/process/materials and a preselected inquiry using the existing transport. Public reads use the published snapshot; private previews require membership and cannot submit. Unknown/disabled/unselected/unpublished services return 404. Only rendered published service media grants new public access.
- Evidence: [executed #004 test output](docs/build-evidence/004/README.md): fresh server bundle exit 0; website-pages 13/13; reference-proof, conversion/Roofing and constitution regressions exit 0. No visual/browser sign-off claimed.
- Connection mode: isolated local fixtures; no external keys needed, no live provider or remote CRM integration. Section H remains Partial; grid linking is #005 and editors/creative work remain later tickets.
- Commit locator: `feat: render Roofing service detail pages (#004)`. Commit isolates this ticket from pre-existing uncommitted foundations/assets; tests certify the current working tree, not a clean-checkout release.
- Roofing polish #027A is confirmed logged before #028 and remains Not started.
- **Next ticket: #005.** Stop; no other ticket executed.

### Baseline verification and #004 visual evidence — 2026-09-24

- Separate commit `218229b` (`baseline foundations`) commits the runtime/client/auth/build/migration/test/assets needed by #001–#004. No push.
- A clean clone of that exact commit with freshly installed locked dependencies passed the build, TypeScript and all 34 executable test files (36/36 commands); Git status remained clean. ffprobe is required for video decoding; the optional local GeoIP database is not needed for the test suite.
- [#004 evidence](docs/build-evidence/004/README.md) now includes desktop (1440×1000) and mobile (390×844) screenshots, mobile inquiry context, the reusable fictional fixture and complete clean-checkout test outputs. No page redesign, real customer inquiry or deployment.
- The prior #001–#004 uncommitted-foundation limitation is resolved. Remaining untracked planning/audit documents are not runtime dependencies. **Next ticket remains #005; not started.**

### #004B — Done (2026-09-24)

- Roofing service detail redesigned with a generated cinematic hero, editable headline, confirmed profile trust strip, four image cards, four-step revealed timeline, generated/uploaded comparison, source reviews, FAQ and dark final CTA. Empty trust fields stay hidden; no claims are invented.
- Shared standard established in docs/TRADE_DESIGN_SYSTEM.md and public/trade-page.css/js for future trade detail pages, with brand contrast, responsive typography and reduced motion. Questionnaire edits remain draft-only until normal publication.
- [Full-page desktop/mobile screenshots and executed outputs](docs/build-evidence/004B/README.md). Build, TypeScript and all 35 tests pass (37/37 commands). Generated images are committed with prompt provenance; the local fictional fixture uses no real contractor photos or reviews.
- Comparison media permissions rechecked: only the complete rendered published pair grants service-page access. Generated hero replaces the old hero-photo grant. Existing tenant, selected-service, preview and inquiry boundaries remain covered.
- Section H stays Partial; future trade rollout/editor work and #027A remain separate. Commit locator: feat: establish premium trade-page design standard (#004B). No push/deployment. **Next ticket #005, not started. Stop.**

### #004C — Done (2026-09-24)

- Applied CONVERSION-PLAYBOOK section 6: [24 PASS / 0 FAIL, full sales-preview desktop/mobile screenshots and tests](docs/build-evidence/004C/README.md). Value-led first-person CTAs, taller desktop hero/larger headline, icon-led inclusions/process and no public empty review band.
- Authenticated unpublished-prospect sales preview has a persistent sample notice, sample trust, exactly three fictional reviews, financing and a generated promo graphic. Samples stay outside settings; public/query-string routes cannot enable them, and published sites cannot open/redeem sample mode.
- Real financing requires a confirmed configured partner, confirmed bounded terms and saved footer-legal disclosure. Visual three-step flow/calculator and form note hide when unconfigured. CTA preselects interest in the existing inquiry; no lender exits or invented offers.
- Active service-tagged promotions render banner/card and reuse the server-checked one-question unlock. Code stays absent until success, then feeds the same inquiry. Expired/unmatched offers hide; preview sample unlock is protected by membership, origin and session CSRF.
- Full build, TypeScript and all 36 test files passed (38/38 commands); final affected tests and TypeScript rerun after browser CSRF correction pass. Public omission and sample interactions verified in browser; no overflow at desktop/mobile.
- K03–K07 live provider state unchanged/unverified or not connected; sample mode is not a live integration. Section H remains Partial. Commit locator: feat: apply Roofing conversion playbook (#004C). No push/deploy. **Next #005, not started. Stop.**


### #004D — Done (2026-09-24): service-page financing comparison

- #004C accepted by Joe. #004D replaces its single-program service calculator with all enabled, confirmed contractor-configured programs. Each card carries monthly payment, APR, term, down payment, total cost and any deferred-interest label. Badges derive from the current calculated payments/totals; zero APR derives the No interest badge. Ties share badges.
- Shared amortization, live project slider/input, None/10%/20% down payments, principal/interest chart and reduced-motion-aware count-up. A saved service typical price range defaults the budget to its midpoint; missing ranges require visitor input (legacy examples retain their saved cost). Choose this plan prefills the existing inquiry with the plan, monthly estimate, project amount, down payment and terms. No lender redirect.
- Questionnaire edits program lists and service price ranges. Legacy single-program settings migrate; explicit empty lists hide. Missing confirmation, configured partner or footer disclosure also hides. Four visibly labeled sales-preview programs use 9.99%/132, 7.99%/73, 5.99%/58 and 0%/18; existing draft-only sample boundaries remain enforced.
- Evidence: [004D README, desktop/mobile screenshots and test logs](docs/build-evidence/004D/README.md). Full build, TypeScript and all 37 executable test files passed (39 commands); focused final checks repeated after the visual refinements. Browser verified four desktop cards, mobile swipe/no document overflow, live down-payment math and same-form prefill. No console warnings/errors observed.
- Connection mode: local, isolated fixtures and manually configured terms. K05–K07 remain not connected; no live offers, approvals, prequalification, provider calls, push or deployment. Whole section B remains Partial.
- Queued only: #004E immediately after #004D; #027A copy/alignment/numbering/footer-label additions remain before #028. No #004E or #027A implementation performed.
- Commit locator: `feat: compare configured service financing plans (#004D)`. Next ticket: **#004E**, not started. Stop here.


### #004E — Done in authorized placeholder mode (2026-09-24)

- #004D accepted by Joe. Added a reusable cinematic service-page kit: scroll camera, layered headline/roof cutout, tracked roof labels linked to anatomy, X-ray/layer views, warning animations, scroll process, educational repair/replace meter, confirmed-year count-up, pausable existing-review motion and subtle final-CTA rain. Video, image-sequence and synchronized-mask slots are trade-config driven. HVAC ductwork and plumbing paths are renderer/config examples; no later trade rollout.
- Used the supplied Roofing still (optimized to 296 KB WebP); both requested MP4s were absent. Current camera/cutout are placeholders, not a rendered FPV flight. Mobile uses a light loop; reduced motion shows a still and unloads video. Production render requirements for all 14 trades are in [NEEDS-ASSETS.md](NEEDS-ASSETS.md).
- [Desktop/mobile screenshots, actual scroll recording, browser assertions and test logs](docs/build-evidence/004E/README.md). Build, TypeScript and six affected regression suites pass (eight commands). Browser verified reverse scrolling, roof/disclosure links, X-ray, meter, pause, reduced motion, mobile layout, failed media, configured video seeking and sequence frames. Recording decoded successfully. Lighthouse/physical-device 60fps not certified; production media remains a later asset gate.
- #027A updated only: plan comparison chart, dark/lime financing band and comma-formatted budget remain queued. No financing implementation changes in #004E. Section H/G and other broad pack rows stay Partial. K02 remains unverified; no asset-generation spend, push, deployment or customer messages.
- Commit locator: `feat: add trade cinematic motion kit (#004E)`. Next ticket: **#005**, not started. Stop.


### #004F — Done (2026-09-24): supplied Roofing media

- Inspected both input files with full-frame decoding: desktop 1920×1080, 8.042 s, 193 frames; mobile 1080×1920, 5.042 s, 121 frames. Both end on the supplied house; mobile is a tighter crop. Source final-frame screenshots and probes are saved.
- Wired H.264 MP4 plus VP9 WebM: desktop 3.131/3.131 MB, mobile 1.251/1.423 MB. Frame counts retained; no audio, short GOP, MP4 fast-start. Both orientations now scrub through the real clips with scroll. WebM alternate, error-to-poster fallback, reverse seek, frozen pause and reduced-motion no-film behavior were exercised.
- Replaced the SVG polygon with an imagegen alpha cutout of the house/chimney/trees. CSS uses its alpha over original poster pixels; final camera blends into this registered still for the headline depth effect. No guessed tracking over flight; roof callouts return only at landing.
- Added a dark gradient behind hero paragraph/actions and enlarged mobile X-ray to near full width with the control directly beneath. NEEDS-ASSETS marks Roofing clips supplied and records final encodes.
- [Desktop/mobile start-middle-end screenshots, both scroll recordings, final frames, cutout provenance and test evidence](docs/build-evidence/004F/README.md). Build, TypeScript and seven relevant suites pass (nine commands). Desktop/mobile browser checks include actual MP4 and WebM playback/seeking, no overflow and no observed page errors.
- Commit locator: `feat: wire supplied Roofing cinematic media (#004F)`. No push or deployment. #027A unchanged and queued. Next ticket **#005**, not started. Stop.


### Planning update — #028A–#028F queued (2026-09-24)

- Inserted six Not started tickets after the Roofing acceptance ticket #028 and before the second-trade rollout #029: configurable design styles, section layout variants, a manifest-backed uniqueness generator, a curated media fallback library, per-generation review packets and an automatic approval-blocking QA gate.
- The sequence keeps Roofing as the proving ground before HVAC and later trades. #028C depends on #023, #028A and #028B; #028F depends on #028E and gates custom per-contractor video from #028D.
- No implementation, generation, screenshots, provider calls, push or deployment occurred in this planning-only update. Current next executable ticket remains **#005**.

### #005 — Done (2026-09-24): selected-service grid links

- Both standard showcase and Roofing reference grids link selected services to enabled detail records using stable saved slugs. Missing/disabled detail pages retain contextual inquiry links; unselected services get no tiles. Tenant previews retain `?preview=1`; library samples keep inquiry links.
- All eight Roofing offerings verified. Draft removal, service/page reordering and disabling do not alter published tiles or destinations; explicit publication applies the revised selection.
- [Desktop/mobile screenshots, test output and reproduction](docs/build-evidence/005/README.md). Build and TypeScript pass; four relevant suites pass (17 reported tests, zero failures). Browser verifies both renderers at 1440×1000 and 390×844, detail navigation, service prefill, reduced-motion content and no overflow or page errors.
- Section H stays Partial. Commit locator: `feat: connect selected Roofing service grids (#005)`. No push or deployment. Next ticket: **#006**, not started. Stop.


### #006 — Done (2026-09-24): Roofing FAQ route

- GET /s/:slug/faq renders an enabled Roofing FAQ record from the published snapshot. Member-only preview reads draft data; disabled, missing, unpublished and non-Roofing pages return 404. Page navigation preserves preview context.
- Grouped native disclosures reuse the premium trade design, generated Roofing still, accessible mobile menu and existing contact journey. Homepage, service and footer navigation reach the FAQ. Related links use enabled selected service records and enabled financing/promotions. Dependent answers disappear together with their groups and JSON-LD entries when the relevant feature is off. Saved text is escaped; no automatic pricing, warranties or availability claims are added.
- [Desktop/mobile screenshots, test output and reproduction](docs/build-evidence/006/README.md). Build (276 referenced assets/14 kits), TypeScript, 18 reported regression tests and Chrome desktop/mobile checks pass. Keyboard disclosures, both homepage menus, service/contact navigation, reduced motion and no overflow/page errors verified.
- Connection mode: disposable local fixtures only; fictional confirmed financing link under example.test, never visited. No live integration, customer request, push or deployment. Section L stays Partial: dedicated editor/seeding and other-trade rollout remain open.
- #027A additions queued only: unique service-tile images (including installation/replacement), service-page display font for homepage headings, compact two-column or swipe mobile grid, and removal of the homepage header’s empty band. None of these four visual changes was built in #006.
- Commit locator: `feat: add published Roofing FAQ route (#006)`. Next ticket: **#007**, not started. Stop.


### #007 — Done (2026-09-24): Roofing About route

- GET /s/:slug/about renders only enabled Roofing About records. Public reads use the published snapshot; authenticated previews read draft data. Both homepage renderers, service/FAQ pages and the shared footer link to the About route while preserving preview context.
- Custom title/introduction/SEO/story/why-us copy requires the existing Questionnaire factsConfirmed flag. Without confirmation, neutral copy appears; no invented story or claims are inserted. Confirmed Questionnaire story is a fallback when the About story is blank. Saved titles, including locked titles, are displayed without regeneration.
- The generated Roofing hero stays separate from the owned uploaded portrait. The header displays an owned selected logo; missing/hidden/AI portraits use labeled designed roofline artwork, never a generated employee. Only an enabled published uploaded_photo portrait grants new public photo access; draft, AI-mode, unrelated and other-tenant photos remain private. No parent project is published by this grant.
- [Desktop/mobile screenshots, test output and reproduction](docs/build-evidence/007/README.md). Build (276 referenced assets/14 kits), TypeScript, 20 reported tests and Chrome desktop/mobile verification pass. Browser checks cover logos/images, fallback and uploaded image slot, both homepage menus, keyboard skip/menu, service/contact links, reduced motion, no overflow and no page errors.
- #027A was missing the FAQ answer and eyebrow items. Added both exactly as Joe supplied, queue only. FAQ answer copy and group eyebrows remain unchanged in this ticket.
- Local disposable fixture only; no provider connections, generation, customer messages, push or deployment. Section Q remains Partial: editor and copy/portrait generation are later work.
- Commit locator: `feat: add published Roofing About route (#007)`. Next ticket: **#008**, not started. Stop.


### #007A — Done (2026-09-24): About trust redesign

- Added optional businessTrust facts with individual confirmations: years, license number/state, insured yes/no, crew size, workmanship warranty years, credentials, Google rating/count/source and completed jobs. Questionnaire edits clear that fact's confirmation; draft saves and publication remain separate. Existing service-profile data is not silently promoted into these confirmations.
- The About hero now uses an owned uploaded About portrait or visible owner/crew photo, otherwise a designed vector Roofing truck (not the house). This user-requested About-only exception supersedes the prior generated-only hero rule for this route. No AI employee or vehicle ownership is implied.
- Directly below the hero, up to five confirmed stats show accessible count-up numbers, with final facts preserved without JavaScript/reduced motion; license identifiers remain static. With fewer than three available facts, only those facts render; zero facts hides the band. Three icon cards select confirmed proof, using neutral next-step guidance where evidence is absent. Insurance No is explicit, never an insured claim.
- Story display is capped at 60 words and repeated company-name copy is removed (header and copyright retain the name). Recent work contains up to three approved published project images and a service-area map chip. No qualifying published project means no work section; no generic lone service link.
- [Desktop/mobile screenshots, Questionnaire evidence and test output](docs/build-evidence/007A/README.md). Build, TypeScript and 22 regression tests pass. Desktop/mobile browser checks pass for layout, count values/reduced motion, cards, story/name limits, project links, empty states, owned hero and no overflow/page errors. Real Questionnaire mount with authenticated local API saves verifies edit → confirmation reset → draft save → explicit reconfirmation while published values remain unchanged.
- #027A already contained the footer disclaimer removal. Clarified site-wide removal and the wording variant supplied by Joe; the disclaimer is still present in #007A.
- Connection mode: local fictional fixtures. Trust facts are owner-confirmed manual data, not live Google/license/insurance verification. Dedicated generation, broader trust-library work and other-trade adoption remain open; Q stays Partial. No push, deployment, generation spend or customer messages.
- Commit locator: `feat: redesign Roofing About around confirmed trust (#007A)`. Next ticket **#008**, not started. Stop.

### Overnight queue item 0 — Done (2026-09-24): #027A additions only

- Queued caption removal (keep the before/after AI label), no duplicated business name beside a logo containing it, and a roughly 20px higher hero headline. No rendered behavior changed. Verified the #027A text and diff. Next: #004F-v2, then #008, #009 and #010; stop after #010. User's explicit queue overrides the ordinary one-ticket session rule.
- Commit locator: docs: queue Roofing caption and header polish (#027A).

### #004F-v2 — Blocked (2026-09-24)

- Reran the requested encoder against approved regenerated clips. Input probes confirm 7.542s/181 and 5.042s/121 frames. Dynamic frame-count capture fixes the old hardcoded 193-frame assumption.
- Two WebM budget fix attempts failed; [actual outputs/source frames](docs/build-evidence/004F-v2/README.md). No delivery replacement, final blend sign-off or refreshed scroll recordings claimed. Existing media is untouched. Build and two media/service regression tests pass.
- #027A hero +20px upward request was queued in item 0. Commit locator: chore: record regenerated Roofing media encoding blocker (#004F-v2). Continue #008, #009, #010.

### #008 — Done (2026-09-24): trust selections and evidence

- Added bounded trust settings with 16 supported networks, selection/order/layout/placements, HTTPS network profiles, explicit approval, optional rating/count/credential and source evidence/check/expiry dates. Older editor omission preserves; explicit clear changes only draft.
- Selected ratings/credentials fail publication without current confirmed evidence; state-license claims also require confirmed license number/state. Public selection logic rechecks expiry at read time. No live verification or legacy auto-confirmation.
- [Desktop/mobile screenshots and output](docs/build-evidence/008/README.md): build, TypeScript, five contract/API/constitution/reference-proof tests and browser checks pass. Saved contract does not introduce public markup yet; private draft notes stay private.
- Local fictional fixtures; no keys/provider calls or marks required. P stays Partial: renderer #009, controls #047 and actual provider validation remain. Commit locator: feat: model trust selections and evidence (#008). Continue #009.

### #009 — Done in source-link/text fallback mode (2026-09-24)

- Roofing selected trust profiles render as a premium static row or accessible native carousel. Both homepages support selected hero/services/reviews/form/footer positions; service detail supports below-hero proof. No random selections or inferred affiliations. Empty, expired and unapproved selections hide.
- Text network names are the K22 fallback. Optional ratings use current owner-confirmed evidence and show that attribution/date; credentials get no stars. The component makes no provider request. Existing Google/Yelp excerpt adapters remain separate and unverified live (K03/K04).
- [Desktop/mobile screenshots and test output](docs/build-evidence/009/README.md): build, types, 26 tests and desktop/mobile/no-JS browser checks pass. Arrows/dots/native swipe/keyboard/reduced-motion, source links, private draft boundaries and no overflow/errors verified.
- P remains Partial: #047 controls, permitted network marks, actual live-account validation, optional other-page placements and trade rollout remain open. No generation, messages, push or deployment. Commit locator: feat: render selected Roofing trust profiles (#009). Continue #010, then stop.

### #010 — Done (2026-09-24): Roofing map, logo and reviews

- Verified actual approved/published project records and uploaded logo in desktop/mobile browsers. Test contents/photos/logo are fictional local QA; Google/Yelp responses are mocked and visibly labeled. Live OpenStreetMap tiles loaded with attribution. Real customer proof is not invented.
- Fixed kit project-story return links to #projects, the actual homepage map anchor; legacy non-kit cinematic #area behavior remains. Roofing map empty copy is now concise with a direct request action; other trades retain their wording.
- [Screenshots and executed output](docs/build-evidence/010/README.md): build, TypeScript, nine reported tests and desktop/mobile browser checks pass. City/search/reset, map/list/popup comparison, original aggregate/source attribution, missing feed/logo/map, no-JS links and no overflow/page errors verified.
- Draft project edits, private/unpublished projects, post-publication uploads, draft logo/review settings and cross-tenant logo selection remain private. Unpublishing revokes story/map/media access. Browser harness now inspects the correct 303 login redirect instead of following it to a 200 login page; direct API denial is 401.
- No live provider validation, inquiry submission, paid generation, customer messages, push or deployment. Missing real customer proof assets are in NEEDS-ASSETS; K03/K04/K22 remain open. P stays Partial. Commit locator: fix: verify Roofing proof placement and map return (#010).
- **Stopped after #010 as requested.** #011 is not started. #004F-v2 remains blocked after two encoding fixes; Waiting on Joe contains the question and evidence. Queue item 0 and #008–#010 each have separate commits.

### #004F-v2 approved resolution follow-up — Blocked (2026-09-24)

- Retried the previous two-pass encoder at exactly the authorized WebM dimensions (1600×900 desktop; 900×1600 mobile configured). H.264 stays at full input resolution (1920×1080 / 1080×1920); the six-frame GOP and byte budgets remain unchanged.
- Desktop H.264 passed at 3,045,346 bytes. Desktop WebM failed at 4,385,462 bytes. Stopped on that gate; mobile was not encoded. No further quality/GOP/bitrate changes attempted.
- [Encoding output, actual probes and reproducible script](docs/build-evidence/004F-v2/README.md). Delivery hashes unchanged; browser screenshots, recordings and final blend sign-off remain pending.
- Commit locator: `chore: record approved WebM resolution retry (#004F-v2)`. Continue only the separately requested #010A and #027A queue update; #011 remains not started.

### #010A — Done (2026-09-24): first-screen review cards

- Removed the large house graphic from connected reviews. Cards now lead with source stars, a short excerpt, reviewer name and original link; the heading uses the display font with 18px desktop / 16px mobile subtitle spacing. Provider summaries follow the cards.
- Shared service pages load review styles and preserve readable contrast. Source cards remain still; missing excerpts still hide service review sections. No-key, outage and no-JavaScript source-link fallbacks, independent provider aggregates, attribution and policy links are retained.
- [Desktop/mobile screenshots, long-quote and service captures, browser measurements and tests](docs/build-evidence/010A/README.md). Build passes; 10 focused tests pass. The complete first card fits before the mobile sticky action bar. Fixtures are clearly labeled fictional; no live provider connection is claimed. K03/K04/K22 remain open in NEEDS-KEYS.md.
- Commit locator: `fix: put source review cards in the first screen (#010A)`. Remaining requested work: #027A backlog-only additions; then stop. #011 not started.

### #027A follow-up additions — Queued only (2026-09-24)

- Added a shorter “Check the source” strip, permitted platform marks (K22; text/source-link fallback otherwise), confirmed star rating/review count, and compact 2×2 mobile layout to #027A. Existing selection, evidence and source-link rules remain requirements.
- Added site-wide removal of “Concept imagery · your project will be individual” and similar image captions, retaining only the required AI label beneath before/after. Existing duplicate header-name and hero +20px-up requests remain queued.
- Documentation diff checked; no #027A product code built. Commit locator: `docs: queue compact source strip and caption cleanup (#027A)`.
- **Stopped as requested.** #011 was not started. #004F-v2 failed its approved resolution retry and is logged under Waiting on Joe; delivery replacement and browser recapture remain pending. #010A passes with desktop/mobile evidence. Three requested steps are recorded in separate commits. No push, deployment, paid generation or external messages.

### #004F-v2 — Done (2026-09-24): revised budgets and refreshed delivery

- Two-pass WebM is 1440×810 / 720×1280 at 4,225,862 / 1,072,050 bytes, under the approved 4,500,000 / 2,500,000 limits. H.264 stays full resolution at 3,043,291 / 1,358,304 bytes, under unchanged 4,000,000 / 2,000,000 limits. All four preserve the full frame counts and six-frame GOP. Updated the encoder budget gate and replaced delivery files.
- [Desktop/mobile start/middle/end screenshots, blend evidence, both scroll recordings and test output](docs/build-evidence/004F-v2/README.md). Browser QA passes; visual inspection confirms the end frame fades into the aligned house still. Build and 3 media/service regressions pass.
- Cleared this ticket from Waiting on Joe. Commit locator: `fix: deliver refreshed Roofing films within revised budgets (#004F-v2)`. Next: #027A backlog-only review badge/refresh additions, then #011 and #012; stop after #012.

### #027A review-detail follow-up — Queued only (2026-09-24)

- Added one compact rating badge per Google/Yelp source beneath the cards: permitted mark or text fallback, confirmed rating/count and source link. Preserve attribution, policy links and source-data fallbacks.
- Queued removal of the public Refresh reviews button; keep refresh in the backoffice only. No rendered changes made in this step.
- Documentation diff checked. Commit locator: `docs: queue compact review badges and private refresh (#027A)`. Continue #011, then #012, then stop.
