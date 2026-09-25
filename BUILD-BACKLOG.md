# BUILD BACKLOG

Completed: **#001–#015, #010A, #007A, #004B–#004F, #004F-v2 and #004L** (whole-section integration gaps remain in BUILD-STATUS; #011 real K23 content remains Needs review). **#004G-v3: Done, supplied portrait and desktop frame sequences verified.** #027A additions are queued only and #027A remains Not started. #004H-finish, #004I, #004I-v2, #004I-v3 and #004I-v4 are Done with passing performance, accessibility and regression gates. Next to execute: **#015F — Contractor forms**, followed by #016. #015E, #015D, #015C, #015B and #015-v2 are Done. #015A automated acceptance is complete; Joe’s real-iPhone camera check remains pending. No ticket is currently marked In progress; #015F and #016 remain Not started. Existing ticket numbers are unchanged.

## Session contract

1. Read the selected ticket and only its referenced pack section(s), plus necessary source files and owning module guidance. Do not reread/re-summarize all five packs. Read a linked companion only for the paragraph explicitly needed by that ticket. The original packs remain the blueprint; latest user corrections win.
2. Each ticket is estimated at 3–6 active engineering hours and must fit within one working day (8 hours). External approval waiting is not implementation time. If inspection reveals a larger change, split it into new numbered tickets **before** coding; do not silently enlarge a ticket or call a partial result complete.
3. Keep dependencies real: work in phase/number order; Phase 1 Roofing acceptance precedes other-trade rollout. Within each provider, connection/capability precedes delivery. Catalog/payment/entitlements and jobs precede paid automation; consent/domain/approval precede messages/spend. If blocked, record the blocker and propose the next numbered unblocked ticket; do not start it in the same session.
4. All file paths are repo-relative. Existing paths are edit candidates; **(new)** means a proposed file/directory, not current functionality. `drizzle/` means the next correctly ordered migration if schema changes require one. Add focused tests where the acceptance boundary warrants them. Do not edit compiled `dist` or unrelated CRM software.
5. Keys refer to NEEDS-KEYS.md. No key/access: show a clearly labeled Not connected / Pending / Manual export stub. Never produce a fake successful response, loan offer, image, send receipt, metric or payment. A stub ticket can finish with stub evidence; its live-integration ticket/section stays open.
6. Finish by showing a screenshot for visual changes or actual test output for behavior; record the evidence and remaining gap in BUILD-STATUS.md. Mark the ticket Done only after its acceptance checks run. Fixture success is not live-provider success.
7. Commit the completed ticket and status update. This is now authorized for future tickets and supersedes the earlier no-commit default; it does **not** authorize push, merge, deployment, production changes, customer messages or spend. Stage only ticket changes; preserve unrelated existing dirty work. Never use a blanket `git add -A` here. Explain any inability to make an isolated, reproducible commit rather than bundling old work silently.
8. Stop after that ticket. Report ticket number, evidence, commit, remaining blocker/stub (if any), and **the next ticket number**. Update the current ticket’s state in this backlog as well.
9. Implement only in `C:/Users/joe/website_creator` (Website Design). Do not edit `Buildovate/buildovate`, including `crm-backend`, `crm-frontend` or CRM backoffice. No ticket authorizes pushing or deploying staging. Website forms → CRM Leads and CRM jobsite photos → Project Map belong only to adapter tickets #156–#158 against a documented sandbox API. If the CRM repository itself must change, stop and tell Joe; that work needs a separate branch/PR for Louie to merge.
10. Email is **SendGrid only, with per-contractor subusers (K17)**. No SES; `RESEND_API_KEY` is not delivery. No cold email. Consent and suppression checks are required before any send, including queued sends.
11. Phase 1 priority is the Roofing homeowner selling site (#001–#028). Perfect Roofing before #029+ trade rollouts. If Higgsfield K02 is unavailable, implement clearly labeled film stubs for #024–#027, record their live media gates, and still finish #028. Films must not block the selling site; stub evidence never claims the films exist.

12. Every ticket that touches a contractor-facing platform/admin screen must pass the standing platform mobile acceptance rule below at **390×844** and **1440×900 desktop**, with a phone screenshot in its evidence. Public-site mobile checks do not substitute for platform checks.

Scope: Website Design only. Retain the 14 existing trades, and queue Concrete and Pools as two additional trade families; Remodel is a specialist rollout sharing General Contractors primitives. Preserve existing templates, good media, scroll hero, sticky header, selected services, uploaded branding, source reviews and approved Project Map. Latest financing direction is calculator → Get Financing Options → configured provider flow; no lender marketing showcase. All external account state is unverified unless NEEDS-KEYS records a confirmed fact or Joe explicitly confirms a connection for the selected ticket.

Pricing source for affected tickets: read only the referenced W/AB/AF pricing paragraphs and the named rows in `docs/product/PACK4_CATALOG_DELTA.md`. Do not reread all packs or invent SKU contents. Planning does not provision accounts or authorize any charges.

## Standing platform mobile acceptance

Applies to every ticket that adds or changes a signed-in platform screen: questionnaire, dashboard, inquiry inbox, preview/publish, settings, photo/media upload, and any other existing or future platform screen. The contractor must be able to complete the same authorized workflow on a phone as on desktop.

- Verify **390×844 CSS pixels** and **1440×900 desktop**. No horizontal scrolling, clipped content or off-screen actions; navigation, tables, dialogs and drawers must fit or reflow.
- Every interactive tap target must be at least **44×44 CSS pixels**, including icon buttons, tabs and labeled selection controls. All text must be readable without zoom; form input text must be at least 16px to avoid focus zoom.
- Keep **save/publish actions sticky and reachable** on screens that provide them, with clear draft/saving/saved/error states. Respect phone safe areas and the on-screen keyboard; sticky controls must not cover fields, validation messages or other actions. Preserve existing role restrictions and publish confirmation.
- Photo/media upload must support **taking a photo straight from the phone camera**, as well as choosing an existing photo. Verify capture → preview → upload → saved media, plus cancellation, permission denial and retry/error handling. Do not require a desktop transfer. Preserve tenant ownership, validation and existing draft/publication boundaries.
- Each affected screen needs at least one **real 390×844 phone-viewport screenshot** in the ticket's evidence, plus desktop verification and notes showing its primary workflow was completed. Camera acceptance additionally requires a real phone/browser capture check; an emulated viewport or preselected test file alone is not proof that the camera opens. Record device/browser and outcome. Missing checks remain outstanding, not Passed.

Existing source requirements are narrower: [Pack 1 §M](docs/product/01-CORE-SITE-A-N.md) specifies guided questionnaire intake, save draft and publish validation; [Pack 3 §X2.B](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) calls for mobile jobsite-photo uploads; [Pack 4 §AD3/AE4b](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) requires owner dashboards to work on phones and be thumb-friendly. The [analytics dashboard wireframes](docs/product/PACK4_ANALYTICS_ADS.md#analytics-dashboard-wireframes) specify one column, 16px padding, 44px+ controls and no horizontal chart scrolling. The [Pack 1 release checklist](docs/product/PACK1_CORE_SITE_SPEC.md) includes mobile browser review, and #011 records desktop/mobile Questionnaire evidence. These requirements and isolated checks do not establish that the entire existing platform passes this rule. This standing rule extends acceptance to all platform screens; it is not a claim of completed implementation.

## Phase 1 — the homeowner website that sells; Roofing first

Tickets #001–#041C, including the queued #004M–#004R variants, #004J/#004K showpieces and per-trade signature insertions. Execute #004M–#004R before #004J; #004J and #004K follow in that order.

### #001 — Resolve the Roofing review-lookup test mismatch

- State: **Done** · Estimate: **3h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P.
- Files to touch: `src/reviews.js`; `public/engagement-ui.js` (contract inspected, unchanged); `tests/engagement-providers.mjs` (existing regression, unchanged); `tests/review-lookup.mjs` (new focused regression); `docs/modules/engagement.md` (contract documentation).
- Done when: Establish the intended response contract, correct the smallest stale fixture or code defect, and show both provider and reference-proof tests passing. Do not fabricate a live account.
- External keys/accounts: None.
- Evidence (2026-09-24): freshly bundled server; `node tests/review-lookup.mjs`, `node tests/engagement-providers.mjs`, and `node tests/reference-proof.mjs` all exit 0. The pre-existing provider test passed unchanged. Profile-form response compatibility was restored while explicit Google/Yelp business search remains supported. External calls were mocked; no live account connection is claimed. See BUILD-STATUS for exact output and the commit locator.

### #002 — Lock the Roofing homeowner journey

- State: **Done** · Estimate: **4h** (≤1 day).
- Pack section: [`F`](docs/product/01-CORE-SITE-A-N.md) §F; [`G`](docs/product/01-CORE-SITE-A-N.md) §G.
- Files to touch: `src/conversion-page.js`; `src/platform/conversion.ts`; `tests/conversion-references.mjs`; `tests/fixtures/roofing-journey.mjs`; `scripts/preview-roofing-journey.mjs`; `docs/build-evidence/002/`; `docs/modules/design.md` (ticket note only).
- Done when: One Roofing fixture has clear repair/replacement intent, immediate inquiry/call actions, selected services, sticky header and the existing scroll hero; show desktop/mobile screenshots.
- External keys/accounts: None.
- Evidence (2026-09-24): conversion/Roofing regression exit 0; scroll controller 8/8; client typecheck exit 0. Desktop/mobile screenshots and a successful local browser inquiry are saved in [ticket #002 evidence](docs/build-evidence/002/README.md). Repair/replacement copy is conditional on selected services; hero motion and sticky navigation are preserved.

### #003 — Add draft/published page data contracts

- State: **Done** (2026-09-24) · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/platform/website-pages.ts` **(new)**; `src/core.js`; `src/api.js` (save/render/create/publish ownership checks); `tests/website-pages.mjs` **(new)**; `docs/modules/sites.md` (contract note); `docs/build-evidence/003/README.md` **(new)**.
- Done when: Typed service, FAQ, About and city records have stable IDs/slugs, length limits and tenant-owned media references; draft edits do not alter the published snapshot.
- External keys/accounts: None.
- Evidence: [#003 executed tests](docs/build-evidence/003/README.md): 11/11 contract/API tests; fresh server bundle, TypeScript, constitution/settings, conversion/Roofing and reference-proof regressions exit 0. Page renderers/editors remain in later tickets; no public page routes added.

### #004 — Render a Roofing service-detail page

- State: **Done** (2026-09-24) · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H.
- Files to touch: `src/website-pages.js` **(new)**; `src/worker.js`; `public/website-pages.css` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: One selected roofing service renders headline, scope, art, FAQ and contextual inquiry on its own URL; unknown/unpublished service returns 404 and private preview requires membership.
- External keys/accounts: None.

- Evidence: [#004 executed tests](docs/build-evidence/004/README.md): 13/13 page contract, access, media and inquiry tests; fresh server bundle and reference-proof, conversion/Roofing, constitution regressions pass. Local fixture only. Grid linking remains #005.

### #004B — Premium design standard

- State: **Done** · Evidence: [004B](docs/build-evidence/004B/README.md) · Estimate: **8h** (≤1 day). User-requested insertion before #005.
- Scope: Roofing service detail and reusable premium trade-page tokens/components; generated cinematic hero, editable headline, truthful profile trust strip, four generated warning-sign cards, four-step revealed timeline, accessible generated/uploaded before-after comparison, real-source reviews, FAQ and final CTA. Reduced motion and brand contrast required.
- Files: service renderer, shared trade-page styles/script, profile/page contracts and Questionnaire controls, generated assets, tests and docs/build-evidence/004B.
- Done when: draft/publish and privacy tests pass, all eight design requirements work, full-page desktop/mobile captures are saved and changes committed.
- External dependencies: built-in image generation for committed assets; no runtime generation integration or live reviews claimed.

### #004C — Roofing service-page playbook pass

- State: **Done** · Evidence: [004C](docs/build-evidence/004C/README.md) · Estimate: **8h**. User-requested insertion before #005.
- Scope: section 6 checklist, truthful optional reviews, isolated sales samples, value CTAs, hierarchy/icons, configured financing calculator/disclosure and service-tagged promotion unlock into one inquiry.
- Evidence: docs/build-evidence/004C; full desktop/mobile sales-preview screenshots and tested public/sample boundaries. No provider connection, push or deployment implied.

### #004D — Financing calculator redesign (service page)

- State: **Done** · Evidence: [004D](docs/build-evidence/004D/README.md) · Estimate: **8h** (≤1 day). User-requested insertion before #005.
- Scope: contractor-configured program comparison, service-range project slider/input, down payment choices, computed badges, principal/interest chart, same-inquiry plan prefill, reduced-motion count-up and labeled four-program sales preview. Required APR/term/down payment, deferred-interest labels and saved lender disclosure.
- Done when: payment math, badges, empty hiding and prefill tests pass; desktop/mobile screenshots, evidence, BUILD-STATUS update and local commit. No lender integration or redirect.
- External keys/accounts: None; saved confirmed terms only (K05–K07 remain unconnected).

### #004E — Visual storytelling pass (service page)

- State: **Done — placeholder mode** · Evidence: [004E](docs/build-evidence/004E/README.md) · Estimate: **8h** (≤1 day). #004D accepted. Supplied Roofing still used; its pending drone/cutout handoff is now resolved by #004F. #004E evidence remains the historical placeholder state.
- Goal: make the text-heavy page self-explanatory through visual storytelling and award-level motion matching the hero scroll effect.
- Warning signs: small custom animated illustrations (drip through ceiling stain, lifting shingle, granules in gutter), play once on entry; one line of card text.
- Roof anatomy: house cross-section separates into shingles, underlayment, decking, flashing and gutters on scroll; hover/tap hotspots explain “what fails here” and “what the repair fixes.”
- How it works: scroll-drawn progress line lights each step; illustration and time chip per step. Repair vs replace meter driven by roof age/damage level. Count-up trust numbers. Slow continuous review marquee. Subtle rain on dark final CTA.
- Rules: approximately 40 words maximum per section body; each section leads with a visual; one custom illustration style matching the hero, no clip-art mix. Respect reduced motion; 60fps mobile, lazy loading, no layout shift, high Lighthouse performance. Anatomy, timeline and meter must be reusable trade-config-driven components.
- Cinematic motion kit — reusable per-trade components driven by trade configuration:
  - Hero: scroll-scrubbed FPV drone dive from sky → through clouds → over the neighborhood → onto the roof → settling on the house front. Play a configured image sequence or video set; use a placeholder sequence until real renders are supplied. Mobile uses a lighter short loop; prefers-reduced-motion uses a still poster.
  - Depth-masked headline: large hero headline behind the house/roofline cutout and in front of the sky, using a layered foreground cutout and parallax. Reusable across trades.
  - Spatial callouts: Flashing, Underlayment, Valley and Ridge vent labels pinned to roof points and tracking the moving scroll camera; transition into the roof anatomy section. Store anchor/tracking data in trade config.
  - Anatomy X-ray mode: roof dissolves into a glowing truss/layer wireframe showing the leak path. Trade-config-driven equivalents include HVAC ductwork/airflow and plumbing pipe runs.
  - Art direction: calm, premium and competent. No glitch text, floating people or gimmicks. Existing reduced-motion, mobile-performance, lazy-loading and layout-stability rules apply to the entire kit.
- Asset handoff deliverable: add NEEDS-ASSETS.md listing every motion-kit clip, sequence, foreground cutout, wireframe/leak-path asset and fallback expected per trade, with exact filename, length, resolution and frame count (mark still assets as one frame with no duration), so renders can be produced to spec. Include desktop hero, mobile short loop, reduced-motion poster and any synchronized masks/tracking requirements. Clearly distinguish placeholders from supplied production renders; implementation does not commission or generate production assets.
- Scope gate: one implementation day for the shared controller, vector placeholder sequence and service-page effects; production rendering is not part of this ticket. Expected Roofing input files: `docs/build-evidence/assets/roofing/roofing-house-still.png`, `roofing-drone-dive-16x9.mp4`, `roofing-drone-dive-9x16.mp4`. Use supplied files when present, placeholders otherwise.
- Evidence required: desktop/mobile screenshots and a short screen recording showing the scroll effects and cinematic motion kit. Build now; verify reduced motion, mobile, reverse scrolling and failed-media fallback.

### #004F — Wire supplied Roofing cinematic media

- State: **Done** · Evidence: [004F](docs/build-evidence/004F/README.md) · Estimate: **6h** (≤1 day). Supplied-media continuation of #004E only.
- Inspect source duration/resolution/final frames; encode H.264 MP4 + WebM under 4 MB desktop and 2 MB mobile; connect scroll-scrubbed hero slots.
- Replace polygon with real alpha cutout, preserve still/reduced-motion fallback, protect copy readability and enlarge mobile X-ray.
- Evidence: start/middle/end desktop/mobile screenshots, new scroll recording, media probes and browser checks. Update NEEDS-ASSETS and BUILD-STATUS, commit, stop. No push.
- External keys/accounts: none for supplied media; built-in imagegen performs requested alpha extraction.

#004F-v2 mini-fix: **Done** after the approved revised WebM budgets. Full-resolution H.264 and lower-resolution two-pass WebM delivery replaced; six-frame GOP, desktop/mobile blend, screenshots and both scroll recordings verified. [Evidence](docs/build-evidence/004F-v2/README.md).

### #004G — Hero polish on desktop and mobile

- State: **Done via #004G-v3**. [Final evidence](docs/build-evidence/004G-v3/README.md).
- Supplied v3 clips use 60/40 canvas frames under the whole-sequence byte ceilings; static desktop tail compressed to four slots. Matching portrait/landscape final stills, bottom-anchored mobile frame, headline preserved, desktop house mask and reduced-motion zero sequence downloads verified.
- Desktop/mobile screenshots and recordings pass. No push or deployment.

### #004G-v4 — Drone hero framing and two-way scrub

- State: **Done**. [Final evidence](docs/build-evidence/004G-v4/README.md).
- Cropped tracked portrait, opening-frame first paint, adjacent loaded-frame playback both directions, unchanged headline and seamless handoff.
- Six mobile Lighthouse audits pass all gates; clean contrast fixed. Full regression, touch/keyboard, reduced-motion and no-JS evidence pass. Local commit only; #004I remains queued.

### #004H — Motion kit v2, part 1 (Roofing)

- State: **Done via #004H-finish**. [Final evidence](docs/build-evidence/004H/README.md).
- LayerExplode, RevealCompare A/B/C and KineticText verified at 1440×900 and 390×844 in both styles, including rest/mid/finished/reduced-motion, touch/keyboard checks and both recordings.
- Final phone audits: bold 100 Performance / 100 Accessibility / 0.0095 CLS; clean 97 / 96 / 0.0095. Three attempts used. All 43 regression commands pass. Motion/style code remains under 60KB gzip.
- No push or deployment. #004I was completed in its own ticket.

### #004I — Motion kit v2, part 2 (Roofing)

- State: **Done**. [Final screenshots, recordings, audits and tests](docs/build-evidence/004I/README.md).
- StickyStack replaces Roofing's process list with three visual pinned cards and optional keyboard/touch index. A/B/C layouts and bold/clean token styles pass 12/12 browser profiles; static no-JS and reduced-motion states remain readable.
- StatsMask renders only individually confirmed questionnaire facts, counts numeric facts in view and fills a gable-shaped photo. Drop, sun, flame and validated logo mask options are available. Missing/unconfirmed facts disappear; zero confirmed facts omit the section. License IDs stay static.
- Final mobile Lighthouse: bold Performance 100/100/99; clean 100/98/99; all Accessibility 100 and CLS <=0.00953. Full 43/43 regression suite passes. Motion/render/style code is 35,471 bytes gzip <=61,440. Drone hero #004G-v4 unchanged. Local commit only; #013 is next.

### #004I-v2 — StickyStack and StatsMask recording fixes (Roofing)

- State: **Done**. [Transition screenshots, two recordings, six Lighthouse reports and test results](docs/build-evidence/004I-v2/README.md).
- Bounded scroll slots keep the pinned heading and complete paragraph in front until the next card enters below them. At 390×844 each mobile card fits between the step tabs and bottom action bar; its image occupies 43% of the card.
- Stats counters count up once on first grid entry, then remain at their confirmed final values through reverse scrolling and re-entry. Headline: “The numbers behind the work.” Confirmation rules, photo masks, both styles/layouts and #004G-v4 drone hero remain unchanged.
- Browser overlap and replay assertions pass 12/12 profiles; reduced motion, no JS, touch and keyboard pass. Full regressions 43/43. Mobile Lighthouse bold Performance 97/100/100 and clean 98/100/100; Accessibility 100 in all six, CLS <=0.00953. Motion/render/style source 35,676 gzip bytes / 61,440. Local commit only; #013 is next.

### #004I-v3 — StickyStack and StatsMask polish

- State: **Done**. [Failing baseline, final samples, handoffs, recordings, reports and regressions](docs/build-evidence/004I-v3/README.md).
- Whole-card fades, tight phone cards, fixed image size, stable accurate tab indicators; no note, text collisions or empty panels. Trust-safe static rating/reviews, one-time years/jobs counters, decoded-photo reveal and corrected subline.
- Six Lighthouse audits pass all gates; 4896 samples and all browser/regression profiles pass. Motion 36584/61440 gzip bytes. Drone #004G-v4 unchanged. Local commit only; #013 remains next.

### #004I-v4 — StickyStack handoff continuity
- State: **Done** (2026-09-24). Overlapping panels with non-overlapping legible copy; intact Decide release into stats; compact scene; equal phone cards and fixed images. Every v3 gate and the drone hero remain intact.
- Evidence: [baseline, sampled checks, distinct phone captures, recordings and all acceptance gates](docs/build-evidence/004I-v4/README.md). Local commit only, no push/deployment. #013 remains next and unstarted.

### #004L — Roofing owner section photo

- State: **Done** (2026-09-25). The owner story's dark band now pairs its tilted quote card with a responsive, lazy-loaded owner/operator sample portrait. The sample carries `isSample: true`, an on-photo replacement label, a media-needed readiness check and an approval checklist note. The existing owner upload flow selects the real photo and removes the overlay.
- Evidence: [desktop and phone captures, upload-state comparison, media credit and full regressions](docs/build-evidence/004L/README.md). Local commit only; no push or deployment. #015E remains the next queued ticket.

### #004M — Scroll Before/After variant (Astra High)

- State: **Queued** · Run before #004J. Preserve existing templates: add an inspiration-based variant to the current before/after section, selected by a deterministic per-site variation seed that can be overridden in settings. If the seed does not yet exist, add it in this ticket. Keep the classic slider as the other variant.
- Scope: Pin the section while a frame sequence or short video scrubs with scroll progress. Add a thin progress line and 3–5 short step labels that crossfade. Add a site-wide Motion on/off toggle. Use a static before/after pair with captions for reduced motion; lazy-load media, avoid clipping at 390px, and keep mobile Lighthouse Performance ≥90.
- Media: Generate **Roofing only** with the connected Higgsfield Ultra workflow, using image-to-video from a same-angle “before” still: worn roof → tear-off → underlayment → new roof → rain runoff. Store the media in `assets/transformations/roofing/` with `manifest.json` containing step labels, source, license and `isSample: true`. Show a “Concept project” tag wherever sample media appears. Document the folder contract and Higgsfield export resolution, fps, length and frame-extraction settings in `docs/product/TRANSFORMATION-MEDIA.md`.
- Gate: Review and approve the Roofing frames before generating **any other trade's** transformation media. Each later trade ticket generates only its own media when that ticket runs. Capture desktop/390px screenshots, scroll in both directions, reduced-motion/no-JS fallback, and automated checks; do not redesign existing templates.

### #004N — Big-number variant (Sol High)

- State: **Queued** · Run before #004J. Add a variant of the existing stats section: one oversized stat over faint oversized background words. Select it with the per-site variation seed, leaving the current presentation available.
- Facts gate: Use only the contractor's own confirmed data or a visibly cited source. Render no number when neither exists. Add an automatic check that blocks unsourced stats; verify both variants at desktop and 390px, including reduced motion.

### #004O — Outcome chips (Sol High)

- State: **Queued** · Run before #004J. Add an optional overlay to an existing owner, process or project photo. Floating chips such as “Inspection booked,” “Permit approved,” “Warranty registered” and “Financing approved” reveal in a staggered sequence. Label the entire treatment as a **process example**, never a claim about the contractor or a customer.
- The per-site variation seed chooses whether chips appear and which eligible photo carries them. Keep the underlying photo and copy readable, provide static reduced-motion/no-JS states, and verify phone and desktop layouts.

### #004P — Short headline sets (Sol High)

- State: **Queued** · Run before #004J. Add alternate four-to-six-word, one-idea-per-screen headline options to existing sections. Keep each current headline as one option, and select the option deterministically through the per-site variation seed.
- Preserve each site's saved content and factual claims; verify desktop, 390px and repeatable output for the same seed. Do not redesign the surrounding templates.

### #004Q — “See it in your yard” AR (Astra High)

- State: **Queued** · Run before #004J. Add an optional section for product trades: Patios first, then pergolas, garage doors, fencing and HVAC units. Use `<model-viewer>` to offer a life-size phone-camera placement through Scene Viewer or WebXR on Android and AR Quick Look (USDZ) on iPhone, with a rotatable 3D view on desktop. Lazy-load it and show a graceful static fallback when AR is unsupported.
- Start with 2–3 generic patio covers. Put `.glb`, `.usdz` and a manifest with dimensions, colors, source, license and `isSample` in `assets/ar/<trade>/`; document the contract in `docs/product/AR-MODELS.md`. Show “Preview only, actual size and finish vary.” The “Get a quote for this” CTA carries the selected model and color into the inquiry. Verify AR/fallback routing, privacy, desktop and 390px usability.

### #004R — “See it on your home” photo visualizer (Sol High; Astra if review fails)

- State: **Queued** · Run before #004J. Let a homeowner upload a home photo and choose roof color, paint, flooring, landscaping or patio cover. Return an AI image labeled “AI concept preview, not a guarantee of final results.” Require name, phone and address to view it, and create an inquiry linked to the private photo and selected option.
- Keep uploaded photos private to the contractor; add rate limits and abuse protection. Add the required AI image key to `NEEDS-KEYS.md` when this ticket runs and use an explicit mock mode until the key exists. Verify authorization, retention, inquiry linkage, mobile/desktop layout and failure states; do not imply the preview is a final-result promise.

**Variant direction and media credit gate:** These are additions to sections already in use, not template redesigns. The per-site variation seed creates a different, repeatable mix for each contractor and remains manually overridable. Higgsfield Ultra is connected, but #004M spends generation credits on Roofing only; no other trade transformation media is generated until its own ticket runs after Roofing frame approval.

### #004J — Roofing signature: Storm Pass (Astra High)

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Run after #004R. Signature source: [TRADE-SIGNATURES.md §1](docs/product/TRADE-SIGNATURES.md). This is the one interactive centerpiece directly below the existing drone hero; it does not replace that hero or redesign the Roofing template.
- Scope: Drag a storm cloud across the house; bounded rain/hail particles reveal roof-zone hail bruises, a lifted tab and a gutter dent. Clear the sky, circle the markers and light a six-item inspection checklist linked to those markers. Build reusable `ScrubStage` (#25: drag/slider/scroll/Play progress, snap points, keyboard, live-region text and reduced-motion state buttons), `AmbientLayer` particles and `HotspotCallouts`. Reuse #004H roof art or the #004F still. Reduced motion offers Before / After the storm / What we check.
- Done when: The signature meets [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md) gates: added whole-page motion JS ≤60 KB gzip, lazy loading outside first paint/LCP, mobile production Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, static informative no-JS and reduced-motion states, ≥44px touch track with `touch-action:pan-y` and Play, keyboard slider/live region, and desktop 1440×900 plus phone 390×844 rest/mid/finish/reduced/no-JS screenshots and scroll recordings in `docs/build-evidence/004J/`. “Free” inspection, storm-location, damage, insurance, price and result claims appear only when individually verified; AI result images carry one “AI example” label. Record #020 overlap without merging tickets. No new scroll library or paid media generation; list needed raster in `NEEDS-ASSETS.md` and use a labeled placeholder. Commit locally; no push or deploy.
- External keys/accounts: None for placeholder implementation; verified weather observations remain with #160/#161.

### #004K — Patio signature: Shade Clock (Astra High)

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Run after #004J; wire it as an option on the existing Patios kit, with full adoption in #030. Signature source: [TRADE-SIGNATURES.md §6](docs/product/TRADE-SIGNATURES.md). Do not redesign the Patio template.
- Scope: A time slider from 8 am to 7 pm moves the sun and sweeps a patio-cover shadow across the furniture, with a “Table: in shade / in sun” chip. Solid / Lattice / Louvered chips swap the aluminum cover; Louvered adds Open/Close blades and striped versus solid shade. Optional Rain and N/E/S/W orientation controls. Reuse `ScrubStage`; add `AmbientLayer` shadow mode and `SwatchConfigurator`. Reduced motion offers Morning / Noon / Evening state buttons.
- Done when: The [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md) motion, production Lighthouse, no-JS, reduced-motion, touch, keyboard, honesty and evidence gates pass, with 1440×900 and 390×844 captures and scroll recordings in `docs/build-evidence/004K/`. Shade is explicitly illustrative unless calculated from the site's latitude and date; no temperature-drop number, weather-resistance specification, motorized or rain-sensor behavior without a recorded manufacturer or contractor source. No new scroll library or paid media generation; use labeled placeholders and record asset needs. Commit locally; no push or deploy.
- External keys/accounts: None for illustrative shade mode.

### #005 — Connect the selected-service grid to detail pages

- State: **Done** · Evidence: [005](docs/build-evidence/005/README.md) · Estimate: **4h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H.
- Files to touch: `src/showcase.js`; `src/conversion-page.js`; `src/website-pages.js` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: Only contractor-selected services get tiles and links; all eight Roofing services can be selected; removing/reordering a draft service does not break the published site.
- External keys/accounts: None.

### #006 — Add the Roofing FAQ route

- State: **Done** · Evidence: [006](docs/build-evidence/006/README.md) · Estimate: **4h** (≤1 day).
- Pack section: [`L`](docs/product/01-CORE-SITE-A-N.md) §L.
- Files to touch: `src/website-pages.js` **(new)**; `src/site-polish.js`; `tests/website-pages.mjs` **(new)**.
- Done when: FAQ page/navigation work from published data; optional financing/promo answers disappear with their features; no answer invents guarantees or pricing.
- External keys/accounts: None.

### #007 — Add the Roofing About route

- State: **Done** · Evidence: [007](docs/build-evidence/007/README.md) · Estimate: **4h** (≤1 day).
- Pack section: [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/website-pages.js` **(new)**; `src/site-polish.js`; `public/website-pages.css` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: About page uses owner-confirmed story and owned images; logo displays; absent portrait has an honest designed fallback; no generated employee is implied.
- External keys/accounts: None.

### #007A — Redesign Roofing About for trust

- State: **Done** · Evidence: [007A](docs/build-evidence/007A/README.md) · User-requested insertion after #007, scope one day.
- Add optional individually confirmed business trust facts and Questionnaire inputs; 3–5 available trust stats directly under hero with accessible count-up (never fill missing facts).
- Use owned owner/crew photo in hero or designed trade truck/crew illustration; three icon-led claim/proof cards; up to 60 story words and at most two business-name mentions.
- Recent published project tiles and service-area map chip; hide work section when no projects qualify. Preserve preview, ownership and publication boundaries.
- Evidence: desktop/mobile screenshots and tests in docs/build-evidence/007A/README.md. Commit and stop; no push. External keys: none.

### #008 — Model trust selections and evidence

- State: **Done** · Evidence: [008](docs/build-evidence/008/README.md) · Estimate: **4h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P.
- Files to touch: `src/platform/trust.ts` **(new)**; `src/core.js`; `tests/trust.mjs` **(new)**.
- Done when: Each network has enabled/profile/evidence/expiry fields with HTTPS validation; unverifiable memberships/ratings cannot be published as established facts.
- External keys/accounts: None.

### #009 — Render the Roofing trust strip

- State: **Done** · Evidence: [009](docs/build-evidence/009/README.md) · Estimate: **5h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P.
- Files to touch: `src/trust.js` **(new)**; `src/conversion-page.js`; `public/trust.css` **(new)**; `tests/trust.mjs` **(new)**.
- Done when: Only approved selected networks render, with accessible names, licensed/approved marks or text fallback; no invented stars; missing feed shows source link/Not connected.
- External keys/accounts: K03, K04 for live excerpts; K22 for marks.

### #010 — Verify Roofing map, logo and review placement

- State: **Done** · Evidence: [010](docs/build-evidence/010/README.md) · Estimate: **3h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/project-map.js`; `src/conversion-page.js`; `tests/reference-proof.mjs`.
- Done when: Desktop/mobile screenshots show real approved project records, logo, source attribution and useful empty states; private data stays private; mocked results are labeled in test evidence.
- External keys/accounts: None.

### #010A — Put source review cards in the first screen

- State: **Done** · Evidence: [010A](docs/build-evidence/010A/README.md). User-requested follow-up to #010.
- Removed the large house photo from connected reviews; display-font heading and spaced subtitle lead directly to stars, short source quote, reviewer name and original link. Provider details follow the cards.
- Desktop/mobile first-screen evidence, long-quote and service-layout checks pass. Existing source aggregates, attribution, policy links, no-key/source-link fallbacks and service empty hiding remain intact. Mocked fixtures do not establish live provider capability (K03/K04/K22 remain open).

### #011 — Add publication rules for required legal facts

- State: **Done — Needs review fallback; K23 content pending** · Estimate: **5h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`S`](docs/product/02-CREATIVE-TRUST-O-T.md) §S.
- Files to touch: `src/platform/legal-policy.ts` **(new)**; `src/platform/constitution.ts`; `tests/legal-policy.mjs` **(new)**.
- Done when: A reviewed policy can require a license disclosure and suppress unsupported optional claims; missing policy remains Needs review, never presented as legal compliance.
- External keys/accounts: K23 (reviewed policy content; not an API key).
- Executed evidence: [#011](docs/build-evidence/011/README.md); publication/permissions/expiry/restore tests and desktop/mobile Questionnaire screenshots. Footer placement is #012.

### #012 — Finish footer empty states and policy placement

- State: **Done** · Estimate: **4h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`S`](docs/product/02-CREATIVE-TRUST-O-T.md) §S.
- Files to touch: `src/site-polish.js`; `public/site-polish.css`; `tests/constitution.mjs`.
- Done when: All-hidden locations leave no headings/spacers; required policy fields remain visible; multiple-location layouts and legal links work at desktop/mobile widths.
- Executed evidence: [#012](docs/build-evidence/012/README.md), 22 tests and desktop/mobile screenshots for four footer states. Real K23 content remains pending; no policy approval is implied.
- External keys/accounts: None.

### #013 — Complete footer social identities

- State: **Done** · Estimate: **3h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E.
- Files to touch: `src/social-icons.js`; `src/platform/constitution.ts`; `src/site-polish.js`; `tests/constitution.mjs`.
- Done when: Missing required social identities are supported with accessible icons, approved profile URLs and per-network toggles; disabled links disappear.
- Executed evidence: [#013](docs/build-evidence/013/README.md), 22 focused tests, build/typecheck, and desktop/mobile enabled/disabled browser captures. URLs require a contractor-saved HTTPS value and enabled toggle; public changes require owner publication.
- External keys/accounts: K22 permitted marks are unverified; generic local icon/text fallback avoids a new asset dependency.

### #014 — Carry page context into homeowner inquiries

- State: **Done** · Estimate: **5h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`N`](docs/product/01-CORE-SITE-A-N.md) §N.
- Files to touch: `src/client/site/inquiries.ts`; `src/worker.js`; `src/form-fields.js`; `tests/website-pages.mjs` **(new)**.
- Done when: Service/city/source context reaches the correct tenant inquiry; consent, honeypot, validation, rate limits and draft restrictions remain enforced. No marketing enrollment.
- Executed evidence: [#014](docs/build-evidence/014/README.md), 30 focused page/inquiry tests, 43/43 full regression commands and actual desktop/mobile submission/preview checks. Context is normalized into the existing inquiry message; no marketing enrollment or delivery.
- External keys/accounts: None.

### #015 — Finish Roofing promotion display states

- State: **Done** · Estimate: **5h** (≤1 day).
- Pack section: [`A`](docs/product/01-CORE-SITE-A-N.md) §A.
- Files to touch: `src/constitution-pages.js`; `src/conversion-page.js`; `public/constitution.css`; `tests/constitution.mjs`.
- Done when: Current, upcoming, expired and no-offer fixtures show correct content/timezones/terms; homepage strips obey the page switch; no false countdown or free-claim promise.
- Executed evidence: [#015](docs/build-evidence/015/README.md), eight promotion-state scenarios, 43/43 regression commands, desktop/mobile browser checks and no-JS evidence. Explicit UTC dates, current-only quizzes and published homepage/page-switch behavior verified.
- External keys/accounts: None.

### #015A — Mobile-friendly platform pass

- State: **Automated acceptance complete — manual iPhone check pending for Joe** · Estimate: **6h initial estimate** (≤1 day; apply the session-contract split rule before coding if the audit reveals a larger implementation).
- Queue: Immediately after #015, which is Done, and before #015B and #016. No existing ticket is renumbered. The automated implementation is complete; #015-v2 and #015B are Done; #015C–#015F are next.
- References: [Standing platform mobile acceptance](#standing-platform-mobile-acceptance); [Pack 1](docs/product/01-CORE-SITE-A-N.md) §M; [Pack 3](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X2.B; [Pack 4](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD3/AE4b; [dashboard wireframes](docs/product/PACK4_ANALYTICS_ADS.md#analytics-dashboard-wireframes). Owning modules: workspace, sites and media.
- Scope: Inventory **every platform screen built so far**, including contractor questionnaire and subsections, dashboard, inquiry inbox/list/detail, preview and publish controls, settings, photo/media upload and galleries, navigation, dialogs and drawers. Include other existing platform/admin screens in the inventory; do not limit the pass to those named examples or to public-site previews. Audit empty, populated, validation/error and long-content states under the roles that can access them.
- Files to touch: existing platform shell/views, workspace client modules and their styles as identified by the inventory, including src/views.js, src/client/workspace/ and applicable public/ styles/scripts; existing media upload client; tests/platform-mobile.mjs **(new)**; docs/build-evidence/015A/ **(new)**. No separate Contractor CRM changes, new external integrations or public-site redesign.
- Done when: Audit every inventoried screen at 390×844 and 1440×900, fix every failure of the standing rule, and complete the primary authorized workflows on a phone: questionnaire edit/save/reopen, dashboard navigation, inquiry read/detail, private preview and explicit publish of a disposable local fixture, settings save/reopen, and camera/gallery upload with saved-media verification. No horizontal scroll; all tap targets ≥44×44px; readable text without zoom; sticky save/publish actions remain reachable with the keyboard open; camera upload works directly from the phone. Preserve desktop behavior, roles, tenant isolation, validation and draft/published boundaries. Audit-only notes or screenshots of public websites do not complete this ticket.
- Verification/evidence: Save a screen-by-screen audit matrix with fixes and pass/fail results, at least one phone screenshot per screen and representative desktop screenshots, actual workflow results, automated overflow/target-size checks and relevant regression output to docs/build-evidence/015A/README.md. Include real-device camera/browser details and capture/upload evidence, with cancellation/denied permission/retry checks. Do not mark Done while an inventoried screen or camera workflow is unverified. Use local fictional fixtures; no external sends or real customer publication. Update BUILD-STATUS and this ticket only after acceptance; commit locally, no push or deploy.
- External keys/accounts: None for local platform work. Device requirement: a phone/browser with camera access for the capture acceptance check; do not substitute emulation for that evidence.

- Accepted exception from Joe: commit #015A now with automated evidence; **Real iPhone camera upload remains a pending manual check for Joe**, not a passed result. Keep the secured pairing script for later use. [Evidence and audit matrix](docs/build-evidence/015A/README.md): 44/44 regression commands and 200 phone/desktop state checks pass.

### #015-v2 — Roofing promotion review fixes

- State: **Done** · Estimate: **5h** (≤1 day).
- Queue: #015 review follow-up, after #015A's automated pass and before #015B. See [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) for the adjacent platform restoration queue.
- Scope: Add a business time-zone setting defaulting to `America/Los_Angeles`; display promotion dates in that zone as short dates, with no “UTC” label or seconds. At phone width, replace the header navigation cut off after “PROM” with one menu button containing every navigation link and tap-to-call. Replace the public raw `<No guarantee>` placeholder with finished copy and prevent placeholder tokens from rendering publicly.
- Done when: Promotion dates use the saved business zone across day and daylight-saving boundaries; the complete phone menu works by touch and keyboard; no public page emits placeholder tokens. Preserve desktop navigation, offer eligibility and draft/published boundaries.
- Verification/evidence: Add automated date/menu/placeholder regression checks, including a public-render assertion that fails on placeholder tokens. Save 390×844 phone and 1440×900 desktop screenshots, test output and mobile acceptance results under `docs/build-evidence/015-v2/`.
- Executed evidence: [#015-v2](docs/build-evidence/015-v2/README.md), 44/44 full regression commands; #015 desktop/mobile states and no-JS checks; business-zone save/reopen; phone menu and date captures.
- External keys/accounts: None. Local commit only; no push or deployment.

### #015B — Platform mobile polish

- State: **Done** · Estimate: **5h** (≤1 day).
- Queue: Review findings from #015A (`e2b8418`); complete after #015A's automated pass and before #016. Joe's real-iPhone camera check for #015A remains pending separately.
- Scope — Platform mobile polish:
  1. Contacts on phones: make trade filter chips one horizontally swipeable row or a dropdown, so the first contacts are visible without scrolling at 390×844.
  2. Remove the sticky “Publish changes” bar from Contacts, Calendar and any other CRM-style list with nothing to publish. Show it only on screens that change the public website.
  3. Style the file picker and “Take a photo” buttons with platform button styles instead of browser defaults. On phones, show only one “Upload photographs” action: the sticky one.
  4. Style “+ Add contact” as a primary button.
- Done when: All four findings are resolved at 390×844 without losing touch/keyboard access or desktop behavior. Contacts are visible without scrolling past wrapped filters; CRM-style lists have no publish bar; mobile upload has one clearly styled action; Add contact is visually primary.
- Verification/evidence: Capture affected phone and desktop screens, verify the actions and navigation with touch/keyboard, and run the relevant platform mobile regressions. Results: [#015B evidence](docs/build-evidence/015B/README.md).
- External keys/accounts: None. No separate Contractor CRM changes.

### #015C — Contacts restore: bulk actions, call-outcome filter and inline notes

- State: **Done** (2026-09-25) · Estimate: **6h** (≤1 day).
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §4, using `.data/sites-v11-recovery/public/crm-enhancements.js`, `public/sales-upgrade-ui.js`, `src/sales-upgrade.js` and v11 bulk tests for behavior. Keep the recovery directory intact; port behavior into the current modules, not whole files.
- Scope: Restore row checkboxes and select-page for both global Sales CRM and contractor Contacts. Add a sticky bulk bar for Assign team, Change stage (with the manual-Paid notice), Export CSV (UTF-8 BOM and formula-injection guard) and Delete (preserve appointments, documents and audit history; cancel pending reminders). A scoped server bulk endpoint must enforce per-record optimistic versions and report changed/skipped counts. Restore the call-outcome filter including “Never called” and a scoped, versioned inline notes Save. Remove the dead `legacyContacts` bulk toolbar.
- Done when: All actions enforce role/tenant boundaries, stale versions do not overwrite changes, and the list works by touch and keyboard at 390×844 without obscuring contacts; desktop behavior remains usable.
- Verification/evidence: Automated bulk, cross-tenant, stale-version, export-escaping and notes tests; 390×844 phone and 1440×900 desktop screenshots plus platform mobile acceptance output in [#015C evidence](docs/build-evidence/015C/README.md).
- External keys/accounts: None. No separate Contractor CRM changes.

### #015D — Contacts restore: callbacks and contact detail

- State: **Done** (2026-09-25) · Estimate: **5h** (≤1 day).
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §4, using `.data/sites-v11-recovery/public/sales-upgrade-ui.js`, `public/crm-enhancements.js`, `src/workspace.js` and `src/crm-next.js` for behavior. Keep the recovery directory intact.
- Scope: Add Call Back from row and detail, with a local-time picker, 15/30/45/60-minute reservation, status, assignees and notes. Create a `callback` calendar event, log the attempt and set next-callback time; distinguish callbacks in all calendar views and reopen the callback editor. Never send a prospect invitation. Make Book Appt a visible row action. Restore the detail profile header (initials, trade and demo badges) and Next callback summary. Preserve website/design/payment/callback system-link fields on edit and duplicate merge.
- Platform mobile review follow-up from #015B: On phones, Calendar opens to an upcoming-appointments list instead of the month grid. Style the arrow, Today and Settings buttons with platform button styles, and capitalize the view names.
- Done when: Callback creation and edit keep the contact and calendar in sync, preserve protected fields and tenant boundaries, and work by touch and keyboard at 390×844 and on desktop.
- Verification/evidence: Automated callback, preserve-on-edit and tenant-isolation tests; 390×844 phone and 1440×900 desktop screenshots and platform mobile acceptance output in [#015D evidence](docs/build-evidence/015D/README.md).
- External keys/accounts: None; no prospect message is sent.

### #015E — Contact-to-website linkage and appointment prep

- State: **Done** (2026-09-25) · Estimate: **6h** (≤1 day).
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §4, using `.data/sites-v11-recovery/public/sales-upgrade-ui.js`, `public/flow-ui.js`, `public/app.js`, `src/sales-upgrade.js` and `src/workspace.js` for behavior. Keep the recovery directory intact.
- Scope: Let an admin link a contact to an existing contractor website; show the linked customer in the Websites table and a Portal action on linked Customers rows under current admin permissions. From an appointment, add Prepare design (a private contact-prefilled website draft) and Built/Shown stage shortcuts. Show upcoming walkthroughs needing a design on staff Overview. Add meeting interests, 15–120-minute duration and stored reminder email/SMS preference toggles to the appointment editor. Show Not connected when delivery is unavailable; do not send email/SMS. Payments, invoices and preview emails remain with #051–#057 and #140/#140A.
- Done when: Linkage, portal access, draft creation, stage shortcuts and appointment preferences are scoped and auditable; phone workflows meet the standing mobile rule and desktop remains usable.
- Verification/evidence: Automated role/tenant, link preservation, private-draft and appointment tests; 390×844 phone and 1440×900 desktop screenshots and platform mobile acceptance output in [#015E evidence](docs/build-evidence/015E/README.md).
- External keys/accounts: None for stored preferences; live delivery remains gated by its provider tickets.

### #015F — Contractor forms: multi-step capture and inquiry linkage

- State: **Not started** · Estimate: **6h** (≤1 day).
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §4, using `.data/sites-v11-recovery/public/lead-steps.js`, `public/launch-refinements-ui.js` and the v11 submission dashboard for behavior. Keep the recovery directory intact.
- Scope: Restore the four-step homeowner form. Save contact details after step 1 and update the same inquiry on later steps with an idempotent capture key, retaining consent, honeypot, rate limits and #014 page context. Replace the plain contractor Forms list with Forms & submissions counts and filters for form and Partial/Complete status. Give each Inquiries entry its status and an Open contact link to the auto-captured contact. Never enroll partial inquiries in marketing.
- Done when: Partial-to-complete updates stay single-record and tenant-scoped; previews/drafts cannot submit; contractor controls and homeowner form satisfy the standing 390×844 mobile rule and remain usable on desktop.
- Verification/evidence: Automated partial-to-complete, idempotency, cross-tenant, consent and preview/draft tests; 390×844 phone and 1440×900 desktop screenshots and platform mobile acceptance output under `docs/build-evidence/015F/`.
- External keys/accounts: None; no external delivery.

### #016 — Persist quiz completion evidence

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/constitution-pages.js`; `db/schema.ts`; `drizzle/`; `tests/promotion-unlocks.mjs` **(new)**.
- Done when: Eligible quiz success creates a scoped completion receipt; expiry/replay/rate limits are tested; the reward code is absent before successful verification.
- External keys/accounts: None.

### #017 — Expose honest financing connection states

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`C`](docs/product/01-CORE-SITE-A-N.md) §C.
- Files to touch: `src/platform/constitution.ts`; `src/constitution-pages.js`; `src/client/workspace/questionnaire.ts`; `tests/trades-financing.mjs`.
- Done when: Enabled financing with zero ready providers has a clear Not connected/estimate fallback; one/two/three confirmed links work; calculator assumptions never become offers. Missing-provider mode is explicitly a stub.
- External keys/accounts: K05–K07 missing; this ticket is stub/link-state work only.

### #018 — Add one Roofing CTA burst and pricing placement

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`F`](docs/product/01-CORE-SITE-A-N.md) §F.
- Files to touch: `src/conversion-page.js`; `src/client/site/conversion.ts`; `public/conversion.css`; `tests/conversion-references.mjs`.
- Done when: One approved burst decorates an actual action; keyboard/touch/reduced-motion work; exactly one pricing CTA uses a saved allowed placement, with no fake urgency.
- External keys/accounts: None.

### #019 — Build accessible thumbnail motion primitives

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`O`](docs/product/02-CREATIVE-TRUST-O-T.md) §O.
- Files to touch: `src/client/site/service-motion.ts` **(new)**; `public/service-motion.css` **(new)**; `tests/service-motion.mjs` **(new)**.
- Done when: 3D flip plus two restrained effects preserve readable front content, keyboard/touch access and a static reduced-motion mode; no service detail is hover-only.
- External keys/accounts: None.

### #020 — Complete one distinct Roofing mid-page story

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`G`](docs/product/01-CORE-SITE-A-N.md) §G.
- Files to touch: `src/conversion-page.js`; `public/conversion.css`; `public/assets/stories/roofing.svg` **(new)**; `tests/conversion-references.mjs`.
- Done when: Roofing narrative explains a real planning decision with relevant graphics; hero footage is not repeated; motion does not block CTA access and has a static fallback.
- External keys/accounts: None.

### #021 — Render five Roofing city pages

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`N`](docs/product/01-CORE-SITE-A-N.md) §N.
- Files to touch: `src/website-pages.js` **(new)**; `src/site-polish.js`; `tests/website-pages.mjs` **(new)**.
- Done when: Five contractor-approved cities resolve to unique owned pages and footer links; context reaches the inquiry; cities are not represented as branch offices.
- External keys/accounts: None.

### #022 — Add a local ebook preview and consent capture stub

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`I`](docs/product/01-CORE-SITE-A-N.md) §I.
- Files to touch: `src/ebook.js` **(new)**; `src/worker.js`; `tests/ebook.mjs` **(new)**.
- Done when: One Roofing ebook renders/downloads with an honest preview label; capture records explicit purpose/consent; email status says Delivery not connected and never Sent.
- External keys/accounts: K17, K18 needed later for real email; stub here.

### #023 — Persist a stable generation manifest

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`J`](docs/product/01-CORE-SITE-A-N.md) §J.
- Files to touch: `src/platform/generation.ts` **(new)**; `src/design-variant.js`; `src/saved-designs.js`; `tests/generation.mjs` **(new)**.
- Done when: Regeneration preserves business facts, selected services and URLs; records a new generation ID and locked choices; missing creative jobs are Pending, not silently reused as new AI work.
- External keys/accounts: None.

### #023A — Restore the scroll-story hero editor

- State: **Not started** · Estimate: **5h** (≤1 day). Dependency: #023 generation manifest and the existing approved hero media pipeline.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/scroll-story-ui.js` as a behavior reference only; keep the recovery directory intact.
- Scope: Restore contractor controls for the existing scroll-story hero without replacing approved imagery or bypassing the generation manifest. Save a private draft, preview it, and require explicit publication. Preserve reduced-motion and no-JS fallbacks and media provenance.
- Done when: Authorized edits round-trip, a public hero changes only after publish, and editor controls work at 390×844 and 1440×900 with touch/keyboard.
- Verification/evidence: Draft/publish and media-validation tests plus phone and desktop screenshots under `docs/build-evidence/023A/`.
- External keys/accounts: None for approved existing media; new generation remains gated by K02.

### #024 — Produce and attach one Financing ambient clip

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`D`](docs/product/01-CORE-SITE-A-N.md) §D; [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `public/planning-films.json` **(new)**; `src/constitution-pages.js`; `src/client/site/constitution.ts`; `tests/planning-motion.mjs`.
- Done when: One distinct approved Roofing clip and poster are attached to the correct slot; ambient can pause or scroll reaches the full duration; reduced-motion/network failure shows its poster. If K02 is unavailable, a working clearly labeled missing-media stub with an accessible static fallback satisfies this ticket in stub mode; show evidence and retain the live film gate in BUILD-STATUS/NEEDS-KEYS. Continue to #028 without blocking the selling site.
- External keys/accounts: K02.

### #025 — Produce and attach one Financing scroll clip

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`D`](docs/product/01-CORE-SITE-A-N.md) §D; [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `public/planning-films.json` **(new)**; `src/constitution-pages.js`; `src/client/site/constitution.ts`; `tests/planning-motion.mjs`.
- Done when: One distinct approved Roofing clip and poster are attached to the correct slot; ambient can pause or scroll reaches the full duration; reduced-motion/network failure shows its poster. If K02 is unavailable, a working clearly labeled missing-media stub with an accessible static fallback satisfies this ticket in stub mode; show evidence and retain the live film gate in BUILD-STATUS/NEEDS-KEYS. Continue to #028 without blocking the selling site.
- External keys/accounts: K02.

### #026 — Produce and attach one Promotions ambient clip

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`D`](docs/product/01-CORE-SITE-A-N.md) §D; [`A`](docs/product/01-CORE-SITE-A-N.md) §A.
- Files to touch: `public/planning-films.json` **(new)**; `src/constitution-pages.js`; `src/client/site/constitution.ts`; `tests/planning-motion.mjs`.
- Done when: One distinct approved Roofing clip and poster are attached to the correct slot; ambient can pause or scroll reaches the full duration; reduced-motion/network failure shows its poster. If K02 is unavailable, a working clearly labeled missing-media stub with an accessible static fallback satisfies this ticket in stub mode; show evidence and retain the live film gate in BUILD-STATUS/NEEDS-KEYS. Continue to #028 without blocking the selling site.
- External keys/accounts: K02.

### #027 — Produce and attach one Promotions scroll clip

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`D`](docs/product/01-CORE-SITE-A-N.md) §D; [`A`](docs/product/01-CORE-SITE-A-N.md) §A.
- Files to touch: `public/planning-films.json` **(new)**; `src/constitution-pages.js`; `src/client/site/constitution.ts`; `tests/planning-motion.mjs`.
- Done when: One distinct approved Roofing clip and poster are attached to the correct slot; ambient can pause or scroll reaches the full duration; reduced-motion/network failure shows its poster. If K02 is unavailable, a working clearly labeled missing-media stub with an accessible static fallback satisfies this ticket in stub mode; show evidence and retain the live film gate in BUILD-STATUS/NEEDS-KEYS. Continue to #028 without blocking the selling site.
- External keys/accounts: K02.

### #027A — Polish the Roofing hero story and headline choice

- State: **Not started** · Estimate: **6h** (≤1 day). Inserted before #028; existing ticket numbers and adapter references stay unchanged.
- Pack section: Core Pack §§F–G (hero/copy), §M (contractor controls), with Joe’s 2026-09-24 correction taking precedence.
- Files to touch: `src/conversion-page.js`; `src/platform/conversion.ts`; `src/scroll-story.js`; `src/hero-timelapse.js`; `public/scroll-story.js`; `src/client/workspace/questionnaire.ts`; the existing Roofing imagery/sequence configuration located during this ticket; `tests/conversion-references.mjs`; `tests/scroll-story.mjs`; `docs/build-evidence/027A/` **(new)**.
- Done when: (1) Keep the designed/generated hero imagery; do not replace it with real contractor photos. The finished roof is shown first and trusses remain story step 1. Verify forward/reverse scrolling and reduced-motion fallback. (2) Remove the “illustrative concept” note everywhere it appears in rendered site content; search source/variants and check the Roofing page family. (3) Add one additional direct headline option selectable in the contractor backoffice; show that the selection saves as draft and appears after publish. (4) Keep current CTA labels exactly unchanged. Show desktop/mobile screenshots and test output before #028.
- External keys/accounts: None for reusing existing generated imagery. This ticket does not authorize replacement films or generation spend.
- Added after #004C acceptance (queued only): warmer, more confident copy with less legal-sounding hedging; prominently surface response time/emergency service only when supplied by the contractor profile. Fix “How it works” step number/icon alignment (01–04). Use consistent section numbering or remove it. Remove footer line “Labeled illustrative and stock imagery does not depict completed work by this business.” Keep the small AI-example label under the before/after slider. Queue clarification from #007A: remove this footer disclaimer site-wide, including the wording variant “Labeled illustrations and stock imagery does not depict completed work by this business”; do not implement this removal in #007A.
- Queued only (2026-09-24 overnight queue): remove image captions such as “Designed truck illustration · not a crew photograph” throughout the Roofing page family; retain only the AI-example label beneath the before/after comparison. When an uploaded logo already contains the business name, omit the duplicate text name in the header. Raise the hero headline about 20px. These changes belong to #027A; do not implement them in #004F-v2 or #008–#010.
- Queued only after #010A (2026-09-24): make the “Check the source” strip shorter, with permitted platform logos only where mark rights are established (K22); otherwise retain the readable platform-name/source-link fallback. Show a star rating and review count only when confirmed under the existing #008–#010 source/evidence rules. Use a compact 2×2 layout on mobile; preserve accessible source links, selected networks, missing-data hiding and truthful attribution. Save desktop/mobile evidence when #027A is built.
- Queued only in #004G: format per-location footer phone displays as `(805) 555-0111` while preserving the normalized `tel:` destination. Do not implement during #004G.
- Queued only in the #004F-v2 / #011–#012 follow-up: condense Google and Yelp details below the review cards into one compact rating badge per source (permitted logo or readable source-name fallback, confirmed provider rating, review count and source link). Preserve required source attribution/policy links and missing-data fallbacks. Remove the public “Refresh reviews” button; retain refresh controls in the backoffice only. Do not implement these changes during #011 or #012.
- Caption scope clarification, queued only: remove “Concept imagery · your project will be individual” and similar concept/illustration image captions across the site and rendered variants. Keep only the required AI-example label immediately beneath the before/after comparison. This adds to the already queued truck/footer caption removals; it is not implemented in #010A or this backlog update.
- Financing polish (queued 2026-09-24; do not implement in #004E): add a compact comparison chart with one bar per plan and monthly/total-cost views so low-monthly versus least-total tradeoffs are visual; move financing onto the dark premium band with lime accents; format budget with commas (e.g. $6,000).
- Homepage polish (queued 2026-09-24; do not build in #006): give every service tile its own unique image, with no duplicates (installation and replacement currently share one); use the service-page display font for homepage section headings; on mobile use two compact service columns or a horizontal swipe row instead of one full-screen card per service; remove the empty band under the homepage header. Verify desktop/mobile and image uniqueness when #027A is executed.
- Queued only after #006; do not implement in #007:

Roofing FAQ default answers. Rewrite every default Roofing FAQ answer to be concrete and helpful instead of evasive. Each answer is 40–70 words, written in plain homeowner language to CONVERSION-PLAYBOOK.md tone. Answers should give typical warning signs, rough timelines (for example "most repairs take a day; a full replacement usually takes 2–4 days depending on size and weather"), what drives the price (roof size, pitch, material, layers to remove, decking damage, permits), and when repair versus replacement usually makes sense (for example "repair usually makes sense when damage is limited to one area and the roof is under about 15 years old; replacement is worth discussing when leaks appear in several places or shingles are curling across the roof"). Never state prices, guarantees, warranties or insurance outcomes. End each answer with a soft next step where it fits ("Describe what you're seeing and we'll tell you which applies."). Done when no answer uses empty phrases like "it depends on the condition" without then explaining what it depends on.

FAQ group eyebrows. Replace the repeated "Your questions, explained" label with a unique eyebrow per group, drawn from the trade config: Services becomes "Repair or replace", Planning & price becomes "Cost and timing", and the other groups get short, specific labels in the same style. Done when no two groups share an eyebrow.

- Scope note: Logged only; #027A remains before #028 and is not implemented by #004D or #004E.

### #028 — Approve the Roofing homeowner reference

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`A`](docs/product/01-CORE-SITE-A-N.md) §A; [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `tests/roofing-acceptance.mjs` **(new)**; `docs/product/ROOFING_ACCEPTANCE.md` **(new)**.
- Done when: #027A is complete; home/service/FAQ/About/city/promo/finance/footer/form paths pass local route and asset checks; show desktop/mobile screenshots, no overflow and a saved inquiry. Explicit stubs and outstanding external gates are listed; #024–#027 may pass in clearly labeled stub mode when K02 is unavailable. Missing films do not block this Roofing acceptance gate; no deployment.
- External keys/accounts: None.

### #028A — Design styles

- State: **Not started** · Estimate: **8h** (≤1 day).
- Scope: Preserve existing templates. Add four or five configurable inspiration-based style variations per trade within the current section system; each variation defines its type pairing, palette, corner radius, spacing rhythm and light or dark surface treatment. The deterministic per-site seed from #004M chooses a variation unless the contractor overrides it.
- Done when: The Roofing site renders correctly in every existing template and added style variation, preserving content, permissions, responsive behavior and accessibility without a template redesign.
- External keys/accounts: None.

### #028B — Section layout variants

- State: **Not started** · Estimate: **8h** (≤1 day).
- Scope: Add at least three layout variants each for hero, services, process, financing, reviews and final CTA. Every variant uses the same trade configuration and factual contractor data.
- Done when: Every section variant passes the existing tests and reduced-motion checks, with no broken responsive layout or content loss.
- External keys/accounts: None.

### #028C — Uniqueness generator

- State: **Not started** · Estimate: **8h** (≤1 day).
- Dependency: #023 generation manifest, #028A design styles and #028B section variants.
- Scope: Given contractor inputs and the deterministic, overridable per-site seed introduced in #004M, select style and section variants on existing templates, generate copy only from the contractor's facts, and save the selected choices in the #023 generation manifest.
- Done when: Three fictional Roofing contractors with different inputs produce homepages that do not look like one template; show the three results side by side and preserve deterministic output for the same inputs and seed.
- External keys/accounts: K01 only if application copy generation is enabled; otherwise use the ticket's honest missing-access behavior.

### #028D — Media library fallback

- State: **Not started** · Estimate: **8h** (≤1 day).
- Scope: For each trade, curate about ten approved hero clips that can be recolored to the contractor's palette, plus per-contractor AI stills. Record provenance, approval and fallback behavior for every asset.
- Done when: The approved fallback library works through trade configuration without inventing contractor work or proof. Custom per-contractor video remains disabled until #028F passes.
- External keys/accounts: K01 for application-generated stills and K02 for new video production when required; approved existing assets need no new key.

### #028E — Review packet

- State: **Not started** · Estimate: **8h** (≤1 day).
- Scope: Every generated site produces a review-packet folder containing desktop and mobile screenshots of every page, video frames at 0%, 25%, 50%, 75% and 100%, checklist results against `docs/product/CONVERSION-PLAYBOOK.md`, and a list of every legal or financing claim.
- Done when: The packet is complete and reproducible, and nothing publishes without a recorded approval tied to that generated version.
- External keys/accounts: None.

### #028F — Automatic QA gate

- State: **Not started** · Estimate: **8h** (≤1 day).
- Dependency: #028E review packet.
- Scope: Automate checks for layout overflow, broken images, video consistency (the house must not change between frames), missing disclosures, placeholder text and unverified reviews. Route borderline results to human or AI review.
- Done when: Definite failures block approval, borderline results cannot pass without a recorded review decision, and passing evidence is attached to the generated version. Custom per-contractor video remains off until this gate passes.
- External keys/accounts: K01 only if AI review is used; deterministic checks and human review require none.

### Trade rollout and signature map

The 16 trade families retain their existing templates. [TRADE-SIGNATURES.md](docs/product/TRADE-SIGNATURES.md) §0–§16 supplies the primary interaction and shared honesty, access and performance rules. Each signature ticket also owns **one** “Scroll before/after scene (Higgsfield, generated when this ticket runs)” from the table below. Its media goes in `assets/transformations/<trade>/` with step labels, source, license and `isSample: true` in `manifest.json`; sample output is tagged “Concept project.” **No non-Roofing transformation is generated until #004M Roofing frames receive review approval.** Later trades generate their own media only during their own S ticket, never in a shared batch. Existing rollout tickets remain separate from signature work.

| Trade family | Rollout | Signature |
|---|---|---|
| Roofing | #001–#028 | #004J Storm Pass; #004M transformation reference |
| HVAC | #029 | #029S Comfort Map |
| Patios | #030 | #004K Shade Clock; #030S transformation adoption |
| Plumbing | #031 | #031S Leak Tracer |
| Electrical | #032 | #032S Lights On |
| Landscaping | #033 | #033S Four Seasons Yard |
| General Contractors / Remodel | #034 and #041C | #034S and #041CS Demo Day |
| Flooring | #035 | #035S Plank Run |
| Painting | #036 | #036S Brush Pass |
| Fencing | #037 | #037S Post by Post |
| Garage Doors | #038 | #038S Door Lift |
| Pest Control | #039 | #039S Seal the House |
| Windows / Doors | #040 | #040S Heat Bounce |
| Solar | #041 | #041S Sun Path |
| Concrete | #041A | #041AS The Pour |
| Pools | #041B | #041BS Fill & Glow |

### #029 — Apply the approved page system to HVAC

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/hvac.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #029S — HVAC signature: Comfort Map

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #029. Source: [TRADE-SIGNATURES.md §2](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A hot house glows red, then cools to blue room by room; the scene is illustrative unless temperatures come from confirmed measurements. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/hvac/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Comfort Map from §2; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/029S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/hvac/` **(new)**, trade config and focused tests, `docs/build-evidence/029S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #030 — Apply the approved page system to Patios

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/patios.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #030S — Patios signature: Shade Clock adoption

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #030. Source: [TRADE-SIGNATURES.md §6](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A bare backyard becomes a covered patio as the shade line sweeps across the furniture; #004K remains the early showpiece interaction, so this ticket extends that same signature instead of adding a second centerpiece. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/patios/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Shade Clock adoption from §6; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/030S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/patios/` **(new)**, trade config and focused tests, `docs/build-evidence/030S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #031 — Apply the approved page system to Plumbing

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/plumbing.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #031S — Plumbing signature: Leak Tracer

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #031. Source: [TRADE-SIGNATURES.md §3](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A ceiling stain reveals the leak behind the wall, then the fitting repair and a dry room. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/plumbing/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Leak Tracer from §3; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/031S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/plumbing/` **(new)**, trade config and focused tests, `docs/build-evidence/031S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #032 — Apply the approved page system to Electrical

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/electrical.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #032S — Electrical signature: Lights On

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #032. Source: [TRADE-SIGNATURES.md §4](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A dark house at dusk gains light room by room; service labels appear only for services the contractor offers. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/electrical/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Lights On from §4; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/032S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/electrical/` **(new)**, trade config and focused tests, `docs/build-evidence/032S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #033 — Apply the approved page system to Landscaping

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/landscaping.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #033S — Landscaping signature: Four Seasons Yard

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #033. Source: [TRADE-SIGNATURES.md §9](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A dead yard becomes golden-hour curb appeal, without claiming a real completed project. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/landscaping/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Four Seasons Yard from §9; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/033S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/landscaping/` **(new)**, trade config and focused tests, `docs/build-evidence/033S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #034 — Apply the approved page system to General Contractors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/general-contractors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #034S — General Contractors / Remodel signature: Demo Day

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #034. Source: [TRADE-SIGNATURES.md §7](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A gutted room moves through framing to a finished kitchen; this is the General Contractors option, with a Remodel-specialist rollout in #041C. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/general-contractors/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Demo Day from §7; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/034S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/general-contractors/` **(new)**, trade config and focused tests, `docs/build-evidence/034S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #035 — Apply the approved page system to Flooring

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/flooring.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #035S — Flooring signature: Plank Run

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #035. Source: [TRADE-SIGNATURES.md §14](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): Old carpet peels back to new hardwood or tile, with finish choices limited to contractor-confirmed products. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/flooring/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Plank Run from §14; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/035S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/flooring/` **(new)**, trade config and focused tests, `docs/build-evidence/035S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #036 — Apply the approved page system to Painting

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/painting.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #036S — Painting signature: Brush Pass

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #036. Source: [TRADE-SIGNATURES.md §8](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A fresh-color line sweeps across a faded exterior; color names match available contractor choices. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/painting/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Brush Pass from §8; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/036S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/painting/` **(new)**, trade config and focused tests, `docs/build-evidence/036S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #037 — Apply the approved page system to Fencing

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/fencing.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #037S — Fencing signature: Post by Post

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #037. Source: [TRADE-SIGNATURES.md §11](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A leaning fence becomes new boards and the gate closes. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/fencing/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Post by Post from §11; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/037S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/fencing/` **(new)**, trade config and focused tests, `docs/build-evidence/037S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #038 — Apply the approved page system to Garage Doors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/garage-doors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #038S — Garage Doors signature: Door Lift

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #038. Source: [TRADE-SIGNATURES.md §15](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A dented door is replaced and the new door rises open; motor or safety features require a recorded product source. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/garage-doors/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Door Lift from §15; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/038S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/garage-doors/` **(new)**, trade config and focused tests, `docs/build-evidence/038S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #039 — Apply the approved page system to Pest Control

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/pest-control.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #039S — Pest Control signature: Seal the House

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #039. Source: [TRADE-SIGNATURES.md §16](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A house cutaway shows trouble spots clearing; no chemical, safety, efficacy or pest-free claim is implied. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/pest-control/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Seal the House from §16; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/039S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/pest-control/` **(new)**, trade config and focused tests, `docs/build-evidence/039S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #040 — Apply the approved page system to Windows/Doors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/windows-doors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #040S — Windows / Doors signature: Heat Bounce

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #040. Source: [TRADE-SIGNATURES.md §12](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A same-angle old window becomes a fitted new window, then an illustrative heat-flow layer changes; no efficiency figure appears without a recorded manufacturer source. Create this trade's own same-angle image-to-video media only after #004M Roofing frame approval. Store it in `assets/transformations/windows-doors/` with `manifest.json` step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Heat Bounce from §12; approve its final per-site interaction scope before build. Add it to the existing trade template as a variation chosen by the site seed.
- Done when: The scene and signature pass the shared [§0 rules](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, factual source gates, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/040S/`. Preserve existing templates; local commit only, no push or deploy.
- Files: `assets/transformations/windows-doors/` **(new)**, trade config and focused tests, `docs/build-evidence/040S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #041 — Apply the approved page system to Solar

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/solar.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #041S — Solar signature: Sun Path

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #041. Source: [TRADE-SIGNATURES.md §5](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A bare roof gains panels, then the sun path lights the panels; omit production, bill and tax-credit numbers without a dated verified source. Generate same-angle image-to-video media for this trade only after #004M Roofing frame approval. Store it in `assets/transformations/solar/` with a `manifest.json` for step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Sun Path from §5; approve its final per-site interaction scope before build. Add it as a seeded variation of the existing template. Battery behavior appears only if that product is sold.
- Done when: The scene and signature pass [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, confirmed facts only, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/041S/`. Local commit only; no push or deploy.
- Files: `assets/transformations/solar/` **(new)**, trade config and focused tests, `docs/build-evidence/041S/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #041A — Apply the approved page system to Concrete

- State: **Not started — backlog only** · Estimate: **6h** (≤1 day). Queue after #041 in Phase 1, one trade per ticket.
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Scope: Create a Concrete trade rollout, not a redesign of other trades. Preserve existing templates, register a selectable service list and reviewed page content, and use honest missing-media states. List required hero, still and fallback assets in `NEEDS-ASSETS.md`; generation is deferred to the paired signature ticket after the Roofing approval gate.
- Files to touch: `public/site-content/concrete.json` **(new)**; `public/design-kits.json`; focused website-page tests; `NEEDS-ASSETS.md`.
- Done when: After #028 and #028A–#028F, this one trade's enabled pages and selected-service links work; facts and media are reviewed, missing claims hide, and desktop 1440×900 plus phone 390×844 screenshots, reduced-motion capture and tests are saved in `docs/build-evidence/041A/`. Existing trades remain working. Local commit only; no push or deploy.
- External keys/accounts: None.

### #041AS — Concrete signature: The Pour

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #041A. Source: [TRADE-SIGNATURES.md §10](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A cracked driveway moves through forms and pour to a finished stamped surface; finish and slab specifications require confirmed contractor or manufacturer inputs. Generate same-angle image-to-video media for this trade only after #004M Roofing frame approval. Store it in `assets/transformations/concrete/` with a `manifest.json` for step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): The Pour from §10; approve its final per-site interaction scope before build. Add it as a seeded variation of the existing template.
- Done when: The scene and signature pass [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, confirmed facts only, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/041AS/`. Local commit only; no push or deploy.
- Files: `assets/transformations/concrete/` **(new)**, trade config and focused tests, `docs/build-evidence/041AS/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #041B — Apply the approved page system to Pools

- State: **Not started — backlog only** · Estimate: **6h** (≤1 day). Queue after #041 in Phase 1, one trade per ticket.
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Scope: Create a Pools trade rollout, not a redesign of other trades. Preserve existing templates, register a selectable service list and reviewed page content, and use honest missing-media states. List required hero, still and fallback assets in `NEEDS-ASSETS.md`; generation is deferred to the paired signature ticket after the Roofing approval gate.
- Files to touch: `public/site-content/pools.json` **(new)**; `public/design-kits.json`; focused website-page tests; `NEEDS-ASSETS.md`.
- Done when: After #028 and #028A–#028F, this one trade's enabled pages and selected-service links work; facts and media are reviewed, missing claims hide, and desktop 1440×900 plus phone 390×844 screenshots, reduced-motion capture and tests are saved in `docs/build-evidence/041B/`. Existing trades remain working. Local commit only; no push or deploy.
- External keys/accounts: None.

### #041BS — Pools signature: Fill & Glow

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #041B. Source: [TRADE-SIGNATURES.md §13](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): An empty yard becomes a pool; water fills to the tile line and night lights turn on. AI result media stays clearly labeled. Generate same-angle image-to-video media for this trade only after #004M Roofing frame approval. Store it in `assets/transformations/pools/` with a `manifest.json` for step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Fill & Glow from §13; approve its final per-site interaction scope before build. Add it as a seeded variation of the existing template.
- Done when: The scene and signature pass [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, confirmed facts only, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/041BS/`. Local commit only; no push or deploy.
- Files: `assets/transformations/pools/` **(new)**, trade config and focused tests, `docs/build-evidence/041BS/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

### #041C — Apply the approved page system to Remodel

- State: **Not started — backlog only** · Estimate: **6h** (≤1 day). Queue after #041 in Phase 1, one trade per ticket.
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Scope: Create a Remodel-specialist rollout that can share General Contractors' #034 page primitives and signature component without duplicating its content or attributing work to the wrong business. Preserve existing templates, register a selectable service list and reviewed page content, and use honest missing-media states. List required hero, still and fallback assets in `NEEDS-ASSETS.md`; generation is deferred to the paired signature ticket after the Roofing approval gate.
- Files to touch: `public/site-content/remodel.json` **(new)**; `public/design-kits.json`; focused website-page tests; `NEEDS-ASSETS.md`.
- Done when: After #028 and #028A–#028F, this one trade's enabled pages and selected-service links work; facts and media are reviewed, missing claims hide, and desktop 1440×900 plus phone 390×844 screenshots, reduced-motion capture and tests are saved in `docs/build-evidence/041C/`. Existing trades remain working. Local commit only; no push or deploy.
- External keys/accounts: None.

### #041CS — Remodel signature: Demo Day

- State: **Not started — backlog only** · Estimate: **8h** (≤1 day). Queue beside #041C. Source: [TRADE-SIGNATURES.md §7](docs/product/TRADE-SIGNATURES.md).
- Scroll before/after scene (Higgsfield, generated when this ticket runs): A gutted room moves through framing to a finished kitchen. Reuse #034S mechanics, but generate dedicated Remodel media only when #041CS runs. Generate same-angle image-to-video media for this trade only after #004M Roofing frame approval. Store it in `assets/transformations/remodel/` with a `manifest.json` for step labels, source, license and `isSample: true`; label it “Concept project.”
- Signature interaction (spec to be supplied): Demo Day from §7; approve its final per-site interaction scope before build. Add it as a seeded variation of the existing template. The result is a concept until a customer-approved project supplies real media.
- Done when: The scene and signature pass [TRADE-SIGNATURES.md §0](docs/product/TRADE-SIGNATURES.md): ≤60 KB gzip added whole-page motion JS, production mobile Lighthouse Performance ≥85 / Accessibility ≥95 / CLS ≤0.05, lazy loading, confirmed facts only, static no-JS and reduced-motion states, touch/keyboard controls, and 1440×900 plus 390×844 screenshots and scroll recordings in `docs/build-evidence/041CS/`. Local commit only; no push or deploy.
- Files: `assets/transformations/remodel/` **(new)**, trade config and focused tests, `docs/build-evidence/041CS/` **(new)**.
- External keys/accounts: Connected Higgsfield Ultra generation only for this trade when its ticket runs.

## Phase 2 — contractor backoffice and one-time upsells

Tickets #042–#103.

### #042 — Edit one service page in backoffice

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`M`](docs/product/01-CORE-SITE-A-N.md) §M; [`H`](docs/product/01-CORE-SITE-A-N.md) §H.
- Files to touch: `src/client/workspace/pages.ts` **(new)**; `src/platform/website-pages.ts` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: Owner/editor can edit one selected service page, save a versioned draft and preview it; only authorized publication changes public content.
- External keys/accounts: None.

### #043 — Wire FAQ/About/city editors to the same page model

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`M`](docs/product/01-CORE-SITE-A-N.md) §M; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/client/workspace/pages.ts` **(new)**; `src/client/workspace/questionnaire.ts`; `tests/website-pages.mjs` **(new)**.
- Done when: Reusable editor fields save these three page types without divergent copies of business facts; preview and validation errors retain edits.
- External keys/accounts: None.

### #044 — Enforce backoffice field permissions

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`C`](docs/product/01-CORE-SITE-A-N.md) §C; [`M`](docs/product/01-CORE-SITE-A-N.md) §M.
- Files to touch: `src/api.js`; `src/core.js`; `src/client/workspace/questionnaire.ts`; `tests/workspace-owner.mjs`.
- Done when: Owner/Office/editor/viewer rules for the scoped fields are server-enforced; tampered payload tests cannot bypass publish, integration or legal controls.
- External keys/accounts: None.

### #045 — Structure and manage company locations

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`M`](docs/product/01-CORE-SITE-A-N.md) §M; [`S`](docs/product/02-CREATIVE-TRUST-O-T.md) §S.
- Files to touch: `src/platform/constitution.ts`; `src/client/workspace/locations.ts` **(new)**; `src/site-polish.js`; `tests/locations.mjs` **(new)**.
- Done when: Primary transfer, structured hours/timezone, reorder/archive and total-ten cap work; existing eleventh records survive migration for owner resolution; draft changes stay private.
- External keys/accounts: None.

### #046 — Finish the promotion editor

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`A`](docs/product/01-CORE-SITE-A-N.md) §A; [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/client/workspace/promotions.ts` **(new)**; `src/platform/constitution.ts`; `tests/constitution.mjs`.
- Done when: Create/edit/duplicate/disable one offer with dates, eligibility, task and preview; invalid terms cannot publish; saving does not unlock a code or deliver media.
- External keys/accounts: None.

### #047 — Expose trust and social controls

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P; [`E`](docs/product/01-CORE-SITE-A-N.md) §E.
- Files to touch: `src/client/workspace/trust.ts` **(new)**; `src/client/workspace/questionnaire.ts`; `tests/trust.mjs` **(new)**.
- Done when: Owner selects networks/profile links, confirms evidence and sees the public strip preview; disconnected review feeds are labeled; profile URLs do not imply OAuth.
- External keys/accounts: K03/K04 only for live lookup; K22 for marks.

### #048 — Add thumbnail effect selection and lock

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`O`](docs/product/02-CREATIVE-TRUST-O-T.md) §O; [`J`](docs/product/01-CORE-SITE-A-N.md) §J.
- Files to touch: `src/client/workspace/questionnaire.ts`; `src/platform/generation.ts` **(new)**; `tests/service-motion.mjs` **(new)**.
- Done when: A saved effect applies to service tiles; regenerate varies only unlocked choices; mobile/reduced-motion fallback works.
- External keys/accounts: None.

### #048A — Review an existing website for new-tenant import

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: authorized tenant creation and current design-kit controls.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/launch-refinements-ui.js` and `src/website-import.js` for behavior; keep the recovery directory intact.
- Scope: Let an authorized operator provide a contractor-owned website URL, review bounded source findings and choose which business details/service suggestions enter a private new-tenant draft. Do not scrape private pages, infer legal/trust claims, or publish imported copy automatically. Missing research capability stays a labeled manual-entry path; never present guessed facts as verified.
- Done when: Import suggestions have source/approval state, can be rejected, cannot cross tenants, and preserve existing create-site fields. Phone 390×844 and desktop 1440×900 workflows meet the standing mobile rule.
- Verification/evidence: URL/source, permission, draft and no-provider tests plus phone/desktop screenshots under `docs/build-evidence/048A/`.
- External keys/accounts: K01 only if approved AI research is used; otherwise manual review.

### #048B — Assign a reviewed design to a customer

- State: **Not started** · Estimate: **5h** (≤1 day). Dependency: #028C and #048A.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/design-studio-ui.js` and `src/design-studio.js` for behavior; keep the recovery directory intact.
- Scope: Restore customer/contact selection for a generated design and save the assignment as a private, versioned draft. Use only confirmed service/business facts; keep the Price Book and invoice workflow in #049–#053. No automatic customer email, purchase or publication.
- Done when: Assignments respect roles/tenant scope and survive reload without altering the public website; phone/desktop platform acceptance passes.
- Verification/evidence: Assignment/authorization tests and 390×844 phone plus 1440×900 desktop screenshots under `docs/build-evidence/048B/`.
- External keys/accounts: None for saved assignment; optional research remains under #048A.

### #049 — Create versioned Price Book data contracts

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/platform/catalog.ts` **(new)**; `db/schema.ts`; `drizzle/`; `tests/catalog.mjs` **(new)**.
- Done when: SKU/version, billing cadence, quantity, integer cents and eligibility validate on the server; published invoices cannot change when a catalog version changes.
- External keys/accounts: None.

### #050 — Load the approved catalog and corrections

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W; [`AB`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AB; [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/platform/catalog.ts` **(new)**; `tests/catalog.mjs` **(new)**.
- Done when: Pack 3 SKUs and the specifically superseding Pack 4 catalog/pricing rows reconcile with a machine-checked fixture; no invented Plus quantities, discount arithmetic or recurring terms.
- External keys/accounts: None.

### #051 — Add itemized invoice selection

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/workspace.js`; `src/client/workspace/invoices.ts` **(new)**; `tests/invoices.mjs` **(new)**.
- Done when: An authorized user chooses catalog SKUs/quantities; server totals and immutable line snapshots are shown; hosted links/manual status do not imply payment settlement.
- External keys/accounts: None.

### #052 — Implement the server close-offer clock

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/close-offer.js` **(new)**; `db/schema.ts`; `drizzle/`; `tests/close-offer.mjs` **(new)**.
- Done when: Server-owned 900-second expiry never resets on refresh; 10% applies only to eligible add-on fees; expired/replayed/changed-cart requests are correctly repriced.
- External keys/accounts: None.

### #053 — Show the close offer in invoice UI

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/client/workspace/invoices.ts` **(new)**; `public/invoice.css` **(new)**; `tests/close-offer.mjs` **(new)**.
- Done when: Countdown reflects server state, explains the actual discount and expiry, survives refresh and never discounts homeowner loans/media spend or ineligible renewals.
- External keys/accounts: None.

### #054 — Specify the payment connection and honest stub

- State: **Not started** · Estimate: **3h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/payments/provider.ts` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/payments.mjs` **(new)**.
- Done when: Owner-selected processor capability and account needs are recorded; disconnected UI cannot charge; no undocumented provider endpoints are invented.
- External keys/accounts: K09 (processor/account decision pending).

### #055 — Create one approved sandbox checkout

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/payments/provider.ts` **(new)**; `src/payments/checkout.ts` **(new)**; `tests/payments.mjs` **(new)**.
- Done when: For the selected approved processor, one sandbox checkout uses server-priced invoice lines and idempotency; no production charge or secret exposure. Missing access leaves this ticket open.
- External keys/accounts: K09.

### #056 — Verify payment callbacks and settlement

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W.
- Files to touch: `src/payments/webhooks.ts` **(new)**; `db/schema.ts`; `drizzle/`; `tests/payments.mjs` **(new)**.
- Done when: Verified signed sandbox events settle an invoice once; bad signatures, duplicate/out-of-order events and wrong tenant/amount are rejected.
- External keys/accounts: K09.

### #057 — Grant and revoke paid entitlements

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W; [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/entitlements.js` **(new)**; `src/payments/webhooks.ts` **(new)**; `tests/entitlements.mjs` **(new)**.
- Done when: Verified settlement grants only purchased quantities; refund/revocation is audited and idempotent; a manual Paid label grants nothing.
- External keys/accounts: None.

### #057A — Restore the manual domain launch wizard

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: existing domain ownership/TXT verification; do not confuse this with #126 email-sending DNS.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/launch-ui.js`, `src/launch.js` and `public/domain-guides.json` for behavior; keep the recovery directory intact.
- Scope: Guide an owner through choose, verify, connect and secure, then launch. Show registrar-specific manual instructions and real verification state; never claim DNS, TLS or publication succeeded without proof. No registrar write is authorized by this ticket.
- Done when: The wizard preserves progress, handles failed/pending checks honestly and requires the existing publish approval. It works at 390×844 and 1440×900.
- Verification/evidence: Domain-state/permission tests and phone/desktop screenshots under `docs/build-evidence/057A/`.
- External keys/accounts: Domain owner/DNS access needed for live connection; manual guide works without it.

### #057B — Restore the contractor setup-progress rail

- State: **Not started** · Estimate: **5h** (≤1 day). Dependency: #057A and existing questionnaire/readiness steps.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/portal-ui.js` and `src/portal-setup.js` for behavior; keep the recovery directory intact.
- Scope: Show accurate setup progress and Save & continue between the existing business, media, website, domain and approval sections. A step completes only from persisted evidence; pending domain/payment/provider states remain pending.
- Done when: Progress survives reload, does not skip required approval, and phone/desktop navigation meets the standing mobile rule.
- Verification/evidence: Progress/accessibility tests plus 390×844 phone and 1440×900 desktop screenshots under `docs/build-evidence/057B/`.
- External keys/accounts: None for the rail; provider steps retain their own gates.

### #058 — Add durable creative job leases

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U; [`J`](docs/product/01-CORE-SITE-A-N.md) §J.
- Files to touch: `src/jobs/store.js` **(new)**; `db/schema.ts`; `drizzle/`; `tests/jobs.mjs` **(new)**.
- Done when: One job can be queued/leased/retried/cancelled with tenant ownership and idempotency; a crashed worker cannot duplicate a billable generation.
- External keys/accounts: None.

### #059 — Add image-provider connection and missing-key stub

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/media/image-provider.js` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/image-provider.mjs` **(new)**.
- Done when: No-key response is explicitly Not connected with no fabricated output; key presence alone never reports verified connection; fixture mode cannot enter public production output.
- External keys/accounts: K01 for eventual live mode; no key required for stub tests.

### #060 — Generate one promotion image through the app

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U.
- Files to touch: `src/media/image-provider.js` **(new)**; `src/jobs/worker.js` **(new)**; `src/aws/s3.js`; `tests/promo-art.mjs` **(new)**.
- Done when: An approved configured account completes one image job with business/offer facts and private stored output; provider errors retain the last approved image and show retry status.
- External keys/accounts: K01, K08 for deployed storage.

### #061 — Review and activate promotion artwork

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U.
- Files to touch: `src/client/workspace/promotions.ts` **(new)**; `src/constitution-pages.js`; `tests/promo-art.mjs` **(new)**.
- Done when: Preview/regenerate/approve are distinct; only published approved asset version reaches the homeowner page; pending/failed jobs never replace the last good artwork.
- External keys/accounts: None.

### #062 — Accept a private UGC video upload

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/media/video-upload.js` **(new)**; `src/worker.js`; `src/aws/s3.js`; `tests/video-upload.mjs` **(new)**.
- Done when: Tenant-owned upload validates type/size/rights and remains private; invalid files and cross-tenant access fail; existing JPEG route is unchanged.
- External keys/accounts: K08 only for deployed storage.

### #063 — Transcode one video and create its poster

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/jobs/video-worker.js` **(new)**; `src/media/video-upload.js` **(new)**; `tests/video-transcode.mjs` **(new)**.
- Done when: One local worker produces bounded web playback variants/poster with explicit pending/failed states; corrupt input cannot execute a shell or replace approved output.
- External keys/accounts: None.

### #064 — Render variable UGC slots and moderation

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/client/workspace/ugc.ts` **(new)**; `src/ugc.js` **(new)**; `public/ugc.css` **(new)**; `tests/ugc.mjs` **(new)**.
- Done when: Owner can choose more than two slots within entitlement; rights/approval govern display; real customer evidence and labeled AI explainers are distinct; demo testimonials never leak live.
- External keys/accounts: None.

### #065 — Create a truthful AI explainer order

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/client/workspace/ugc.ts` **(new)**; `src/entitlements.js` **(new)**; `src/jobs/store.js` **(new)**; `tests/ugc.mjs` **(new)**.
- Done when: Paid pack/extra-video quantities create reviewable briefs, consume capacity once and never instruct an AI presenter to invent customer experiences.
- External keys/accounts: None.

### #066 — Validate Higgsfield access and add an honest adapter stub

- State: **Not started** · Estimate: **3h** (≤1 day).
- Pack section: [`D`](docs/product/01-CORE-SITE-A-N.md) §D; [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R; [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V; [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `src/media/video-provider.js` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/video-provider.mjs` **(new)**.
- Done when: Record actual authorized Ultra workflow/API capability; unsupported API automation says Manual production required; no imagined endpoint or Completed clip.
- External keys/accounts: K02.

### #067 — Complete one approved video-provider job

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`V`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §V.
- Files to touch: `src/media/video-provider.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/video-provider.mjs` **(new)**.
- Done when: One supported authorized generation or explicit manual-import job has real output, poster, provenance and approval; polling/cancel/failure are bounded. Missing access leaves live work open.
- External keys/accounts: K02, K08 for deployed assets.

### #068 — Generate and approve a branded About portrait

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/media/image-provider.js` **(new)**; `src/client/workspace/pages.ts` **(new)**; `src/website-pages.js` **(new)**; `tests/about-portrait.mjs` **(new)**.
- Done when: One owner-approved logo/person-reference job stays private until approval; generated person is not claimed as an actual employee; original approved photo remains recoverable.
- External keys/accounts: K01.

### #069 — Generate a unique ebook artifact

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`I`](docs/product/01-CORE-SITE-A-N.md) §I; [`J`](docs/product/01-CORE-SITE-A-N.md) §J.
- Files to touch: `src/ebook.js` **(new)**; `src/media/image-provider.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/ebook.mjs` **(new)**.
- Done when: Two generation IDs produce separately versioned title/cover/layout artifacts with stable capture URLs; output passes page/render checks and awaits approval; email stays disconnected until AF work.
- External keys/accounts: K01.

### #070 — Add Sales Rep capability boundaries

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`K`](docs/product/01-CORE-SITE-A-N.md) §K.
- Files to touch: `src/core.js`; `src/crm.js`; `src/client/workspace/shell.ts`; `tests/sales-ops.mjs`.
- Done when: Explicit rep capability sees only authorized prospects/own data and cannot edit owner integrations or payments; homeowner routes expose no sales tools.
- External keys/accounts: None.

### #071 — Add the rep financial-goals calculator

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`K`](docs/product/01-CORE-SITE-A-N.md) §K.
- Files to touch: `src/client/workspace/rep-goals.ts` **(new)**; `src/platform/rep-goals.ts` **(new)**; `tests/rep-goals.mjs` **(new)**.
- Done when: 50/50 rules and editable targets produce explainable monthly math; projected earnings are distinguished from verified collected revenue.
- External keys/accounts: None.

### #072 — Add verified rep progress and streaks

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`K`](docs/product/01-CORE-SITE-A-N.md) §K.
- Files to touch: `src/rep-progress.js` **(new)**; `src/client/workspace/rep-goals.ts` **(new)**; `tests/rep-goals.mjs` **(new)**.
- Done when: Only audited eligible events advance progress once; corrections/refunds reconcile; private adult presentation shows no fabricated accomplishments.
- External keys/accounts: None.

### #073 — Produce one Roofing vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/roofing/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #074 — Produce one HVAC vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/hvac/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #075 — Produce one Patios vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/patios/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #076 — Produce one Plumbing vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/plumbing/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #077 — Produce one Electrical vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/electrical/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #078 — Produce one Landscaping vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/landscaping/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #079 — Produce one General Contractors vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/general-contractors/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #080 — Produce one Flooring vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/flooring/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #081 — Produce one Painting vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/painting/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #082 — Produce one Fencing vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/fencing/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #083 — Produce one Garage Doors vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/garage-doors/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #084 — Produce one Pest Control vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/pest-control/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #085 — Produce one Windows/Doors vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/windows-doors/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #086 — Produce one Solar vertical Short

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`R`](docs/product/02-CREATIVE-TRUST-O-T.md) §R.
- Files to touch: `public/trade-shorts.json` **(new)**; `public/assets/shorts/solar/` **(new)**; `tests/shorts.mjs` **(new)**.
- Done when: One approved 12–15s 9:16 Short has trade-specific pain/pro-arrival/action, correct business/phone tokens, captions and poster; demo branding is explicit. Generate only this trade in the session.
- External keys/accounts: K02.

### #087 — Produce one Sales Rep introduction clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`K`](docs/product/01-CORE-SITE-A-N.md) §K.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #088 — Produce one Website add-ons hero clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #089 — Produce one UGC education clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #090 — Produce one Media Publish education clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #091 — Produce one Content Month / Presence education clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #092 — Produce one Jobsite-to-map education clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #093 — Produce one Close-offer education clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`Z`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Z.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One clip uses the referenced brief, accurate price/terms and reviewed business tokens; appears only on the appropriate private sales/invoice surface; caption/poster/failure state verified.
- External keys/accounts: K02.

### #094 — Verify Service Finance merchant capability and onboarding

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`C`](docs/product/01-CORE-SITE-A-N.md) §C.
- Files to touch: `src/financing/sfc.js` **(new)**; `src/client/workspace/financing.ts` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: Document permitted merchant/API flow from approved provider access; store scoped connection metadata securely; unsupported/live-unavailable capability is a labeled stub, not a promise of offer retrieval.
- External keys/accounts: K05.

### #095 — Implement one Service Finance sandbox handoff/result flow

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `src/financing/sfc.js` **(new)**; `src/financing/results.js` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: One documented provider-approved request/result path is exercised with real sandbox access and consent; returns authentic provider terms or application handoff as permitted; absent API access keeps ticket open.
- External keys/accounts: K05.

### #096 — Verify Wisetack merchant capability and onboarding

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`C`](docs/product/01-CORE-SITE-A-N.md) §C.
- Files to touch: `src/financing/wisetack.js` **(new)**; `src/client/workspace/financing.ts` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: Document permitted merchant/API flow from approved provider access; store scoped connection metadata securely; unsupported/live-unavailable capability is a labeled stub, not a promise of offer retrieval.
- External keys/accounts: K06.

### #097 — Implement one Wisetack sandbox handoff/result flow

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `src/financing/wisetack.js` **(new)**; `src/financing/results.js` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: One documented provider-approved request/result path is exercised with real sandbox access and consent; returns authentic provider terms or application handoff as permitted; absent API access keeps ticket open.
- External keys/accounts: K06.

### #098 — Verify Sunbit merchant capability and onboarding

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`C`](docs/product/01-CORE-SITE-A-N.md) §C.
- Files to touch: `src/financing/sunbit.js` **(new)**; `src/client/workspace/financing.ts` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: Document permitted merchant/API flow from approved provider access; store scoped connection metadata securely; unsupported/live-unavailable capability is a labeled stub, not a promise of offer retrieval.
- External keys/accounts: K07.

### #099 — Implement one Sunbit sandbox handoff/result flow

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `src/financing/sunbit.js` **(new)**; `src/financing/results.js` **(new)**; `tests/financing-providers.mjs` **(new)**.
- Done when: One documented provider-approved request/result path is exercised with real sandbox access and consent; returns authentic provider terms or application handoff as permitted; absent API access keeps ticket open.
- External keys/accounts: K07.

### #100 — Aggregate enabled financing results and failures

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`B`](docs/product/01-CORE-SITE-A-N.md) §B.
- Files to touch: `src/financing/results.js` **(new)**; `src/constitution-pages.js`; `src/client/site/constitution.ts`; `tests/financing-providers.mjs` **(new)**.
- Done when: One/two/three approved providers show their actual supported results after Get Financing Options; partial timeouts/revocation are clear; no assumed universal application or hard/soft-credit claim.
- External keys/accounts: K05–K07 for live modes.

### #101 — Verify video-watch promotion tasks

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/promotion-tasks.js` **(new)**; `src/client/site/constitution.ts`; `tests/promotion-unlocks.mjs` **(new)**.
- Done when: Server-scoped completion receipts reject simple skipped/replayed completion claims; unsupported verification stays Pending; no reward is labeled earned without the configured evidence.
- External keys/accounts: None.

### #102 — Add photo and social task review

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/promotion-tasks.js` **(new)**; `src/client/workspace/promotions.ts` **(new)**; `tests/promotion-unlocks.mjs` **(new)**.
- Done when: Photo consent/private storage and owner evidence review work; share/tag tasks use explicit manual verification unless a real approved channel capability exists; never require positive reviews.
- External keys/accounts: K08 only for deployed private storage.

### #103 — Add confirmed-estimate promotion tasks

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/promotion-tasks.js` **(new)**; `src/client/workspace/promotions.ts` **(new)**; `tests/promotion-unlocks.mjs` **(new)**.
- Done when: Only the configured verified request/owner-confirmed appointment event unlocks; submitting an inquiry is never advertised as a booked time slot; duplicate completions are harmless.
- External keys/accounts: None.

## Phase 3 — monthly add-ons and growth

Tickets #104–#169.

### #104 — Add monthly plan lifecycle and quotas

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`W`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §W; [`Y`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Y; [`AB`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AB; [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/entitlements.js` **(new)**; `src/payments/webhooks.ts` **(new)**; `tests/subscriptions.mjs` **(new)**.
- Done when: Approved sandbox subscription/renewal/cancel events change quotas once; canceled/failed accounts cannot silently create new billable jobs; old invoices keep snapshots.
- External keys/accounts: K09.

### #105 — Store channel connections securely

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/store.js` **(new)**; `db/schema.ts`; `drizzle/`; `tests/connections.mjs` **(new)**.
- Done when: Tenant-scoped tokens use the approved secret-storage mechanism, expiration/revocation are explicit, and no token reaches page HTML or logs; no-key adapters say Not connected.
- External keys/accounts: K08 (deployed secret storage).

### #105A — Define Inbox connections and show a disconnected conversation shell

- State: **Not started** · Estimate: **5h** (≤1 day). Dependency: #105 secure connection storage.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/launch-ui.js`, `public/flow-ui.js` and `src/inbox.js` for behavior; keep the recovery directory intact.
- Scope: Restore admin/staff Inbox navigation, search/thread layout and contact context with explicit Not connected states. Document permitted Gmail inbound and Twilio SMS capabilities and add their missing access/evidence rows to NEEDS-KEYS before live integration. Outbound email remains SendGrid-only under K17; no Gmail send, SMS send or fake messages.
- Done when: The shell is role-scoped and truthful without keys, and phone/desktop platform acceptance passes.
- Verification/evidence: Role/no-key/navigation tests plus 390×844 phone and 1440×900 desktop screenshots under `docs/build-evidence/105A/`.
- External keys/accounts: Gmail OAuth and Twilio capability/credentials unverified; key entries required before #105B/#105C.

### #105B — Connect one approved inbound Gmail mailbox

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: #105A and approved Gmail OAuth scopes/account.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2 and `.data/sites-v11-recovery/src/inbox.js`; keep the recovery directory intact.
- Scope: Securely connect one permitted staff mailbox for read/search/thread sync, with revocation, expiry, audit and contact matching. Keep outgoing email on the SendGrid-only path; no Gmail reply is authorized.
- Done when: One authorized test mailbox has real read results; no access gives Not connected, and tenant/staff isolation holds. Phone/desktop platform acceptance passes.
- Verification/evidence: OAuth/scope, stale-token and isolation tests plus phone/desktop screenshots under `docs/build-evidence/105B/`.
- External keys/accounts: Approved Gmail OAuth app/account/scopes, to be recorded in NEEDS-KEYS.

### #105C — Connect one approved inbound SMS thread source

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: #105A and approved Twilio capability/number.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2 and `.data/sites-v11-recovery/src/inbox.js`; keep the recovery directory intact.
- Scope: Verify signed inbound SMS events, deduplicate and attach threads to the correct staff/contact scope. Show disconnected and delivery-failure states honestly. No outbound SMS or prospect invitation is authorized.
- Done when: Real sandbox inbound events appear once and cross-tenant/forged events fail; phone/desktop platform acceptance passes.
- Verification/evidence: Signature, duplicate, scope and no-key tests plus phone/desktop screenshots under `docs/build-evidence/105C/`.
- External keys/accounts: Approved Twilio account, number and webhook signing material, to be recorded in NEEDS-KEYS.

### #105D — Validate a Google Calendar connection for appointments

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: #105 secure storage and #015D callbacks.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2 and `.data/sites-v11-recovery/src/calendar-connection.js`; keep the recovery directory intact.
- Scope: Verify approved Google Calendar OAuth capability and connect one test calendar with bounded two-way appointment/callback mapping, conflict handling and revocation. Without access, keep local calendar events and show Not connected; never claim synchronization.
- Done when: One authorized sandbox calendar round-trips without duplicate or cross-tenant events; phone/desktop platform acceptance passes.
- Verification/evidence: OAuth, replay/conflict, isolation and no-key tests plus phone/desktop screenshots under `docs/build-evidence/105D/`.
- External keys/accounts: Approved Google Calendar OAuth scopes/account, to be recorded in NEEDS-KEYS.

### #106 — Authorize one Facebook Pages account

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/facebook.js` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/connections.mjs` **(new)**.
- Done when: With approved app/account access, connect/revoke one owned profile; verify actual supported scopes/capabilities and keep unsupported modes as labeled stubs.
- External keys/accounts: K10.

### #107 — Publish one approved Facebook Pages post

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/publish/facebook.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: A single explicitly approved test post has idempotency, real receipt/status and a readable failure path; no auto-post occurs on save or account connection.
- External keys/accounts: K10.

### #108 — Authorize one Instagram account

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/instagram.js` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/connections.mjs` **(new)**.
- Done when: With approved app/account access, connect/revoke one owned profile; verify actual supported scopes/capabilities and keep unsupported modes as labeled stubs.
- External keys/accounts: K11.

### #109 — Publish one approved Instagram post

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/publish/instagram.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: A single explicitly approved test post has idempotency, real receipt/status and a readable failure path; no auto-post occurs on save or account connection.
- External keys/accounts: K11.

### #110 — Authorize one Google Business Profile account

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/gbp.js` **(new)**; `src/client/workspace/connections.ts` **(new)**; `tests/connections.mjs` **(new)**.
- Done when: With approved app/account access, connect/revoke one owned profile; verify actual supported scopes/capabilities and keep unsupported modes as labeled stubs.
- External keys/accounts: K12.

### #111 — Publish one approved Google Business Profile post

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/publish/gbp.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: A single explicitly approved test post has idempotency, real receipt/status and a readable failure path; no auto-post occurs on save or account connection.
- External keys/accounts: K12.

### #112 — Add approved job-photo caption drafts

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/media/captions.js` **(new)**; `src/client/workspace/media.ts` **(new)**; `tests/captions.mjs` **(new)**.
- Done when: One owned photo yields an editable caption using confirmed job facts; EXIF/exact-address privacy and channel constraints are enforced; no automatic external publish.
- External keys/accounts: K01.

### #113 — Create a content-month draft model

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`Y`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Y.
- Files to touch: `src/content-month.js` **(new)**; `src/client/workspace/content-month.ts` **(new)**; `tests/content-month.mjs` **(new)**.
- Done when: A versioned month contains dated editable channel slots and approval state; timezone/collision/entitlement validation runs with no external sends.
- External keys/accounts: None.

### #114 — Generate one Roofing content month

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`Y`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Y.
- Files to touch: `src/content-month.js` **(new)**; `src/media/captions.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/content-month.mjs` **(new)**.
- Done when: One draft month has fact-grounded captions and referenced creative jobs; owner can reject/replace slots; failed assets are not labeled publish-ready.
- External keys/accounts: K01, K02 only for requested video slots.

### #115 — Schedule approved channel jobs

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X; [`Y`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Y.
- Files to touch: `src/jobs/scheduler.js` **(new)**; `src/publish/queue.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: Only approved immutable versions run at the saved timezone; leases, cancellation, retry/backoff and duplicate prevention work; no-key jobs remain blocked.
- External keys/accounts: K10–K12 for actual delivery.

### #116 — Support export for other requested channels

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/publish/export.js` **(new)**; `src/client/workspace/media.ts` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: YouTube/TikTok/LinkedIn/Nextdoor capabilities are explicitly Unknown/manual until authorized; export bundle contains approved media/caption, with no false Published status.
- External keys/accounts: K13–K16 for future automated publishing.

### #117 — Verify and wire one YouTube publishing capability

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/youtube.js` **(new)**; `src/publish/youtube.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: Use a documented approved account/app flow for one media type only; show a real test receipt if available. If access/product does not permit automation, retain export stub and keep live capability explicitly unimplemented.
- External keys/accounts: K13.

### #118 — Verify and wire one TikTok publishing capability

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/tiktok.js` **(new)**; `src/publish/tiktok.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: Use a documented approved account/app flow for one media type only; show a real test receipt if available. If access/product does not permit automation, retain export stub and keep live capability explicitly unimplemented.
- External keys/accounts: K14.

### #119 — Verify and wire one LinkedIn publishing capability

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/linkedin.js` **(new)**; `src/publish/linkedin.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: Use a documented approved account/app flow for one media type only; show a real test receipt if available. If access/product does not permit automation, retain export stub and keep live capability explicitly unimplemented.
- External keys/accounts: K15.

### #120 — Verify and wire one Nextdoor publishing capability

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/connections/nextdoor.js` **(new)**; `src/publish/nextdoor.js` **(new)**; `tests/publishing.mjs` **(new)**.
- Done when: Use a documented approved account/app flow for one media type only; show a real test receipt if available. If access/product does not permit automation, retain export stub and keep live capability explicitly unimplemented.
- External keys/accounts: K16.

### #121 — Add seasonal recommendation rules

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AB`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AB.
- Files to touch: `src/seasonal.js` **(new)**; `src/client/workspace/seasonal.ts` **(new)**; `tests/seasonal.mjs` **(new)**.
- Done when: A fixed clock produces relevant Roofing recommendations with lead time, timezone and dismissal; recommendations do not invent dates, discounts, weather events or urgency.
- External keys/accounts: None.

### #122 — Turn one seasonal choice into reviewed creative

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AB`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AB; [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U.
- Files to touch: `src/seasonal.js` **(new)**; `src/jobs/store.js` **(new)**; `src/client/workspace/promotions.ts` **(new)**; `tests/seasonal.mjs` **(new)**.
- Done when: One approved seasonal offer creates versioned graphics/optional-video jobs and draft campaign slots; owner must approve terms and final output; quotas/renewal pricing are respected.
- External keys/accounts: K01, K02 for optional video.

### #123 — Add email permission and suppression records

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/recipients.js` **(new)**; `db/schema.ts`; `drizzle/`; `tests/email-consent.mjs` **(new)**.
- Done when: Imported contacts require consent provenance; contact-request consent is not marketing consent; opt-out, complaint and invalid-address suppression override lists.
- External keys/accounts: None.

### #124 — Validate SendGrid tenancy and add setup state

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/sendgrid.js` **(new)**; `src/client/workspace/email-setup.ts` **(new)**; `tests/email-setup.mjs` **(new)**.
- Done when: Approved account/subuser/IP capabilities are recorded per tenant; missing access shows Not connected. Credentials never appear in UI; no provider provisioning is guessed.
- External keys/accounts: K17.

### #125 — Verify sending domain and reply identity

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/domain.js` **(new)**; `src/client/workspace/email-setup.ts` **(new)**; `tests/email-setup.mjs` **(new)**.
- Done when: Domain ownership, required provider DNS records and reply-to state are checked before enabling sending; Failed/Needs action never show Ready.
- External keys/accounts: K17, K18.

### #126 — Automate authorized sending-domain DNS only

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/domain.js` **(new)**; `src/connections/dns.js` **(new)**; `tests/email-domain.mjs` **(new)**.
- Done when: For one explicitly authorized DNS zone/provider, preview required changes and apply only approved records; verify propagation and preserve unrelated records. No registrar access means manual setup stub.
- External keys/accounts: K18.

### #127 — Build reusable email rendering and preview

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/render.js` **(new)**; `src/client/workspace/email-editor.ts` **(new)**; `tests/email-render.mjs` **(new)**.
- Done when: One responsive template renders desktop/mobile previews, real links, alt text, identity and required unsubscribe/footer; missing images have fallbacks and text-only alternative.
- External keys/accounts: None.

### #127A — Restore appointment reminder templates and outbox staging

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: #015E stored preferences and #127 rendering/preview.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/flow-ui.js`, `src/communications.js` and `src/control.js` for behavior; keep the recovery directory intact.
- Scope: Add a branded appointment confirmation/morning/one-hour reminder template studio with editable preview and explicit On hold/Ready/Expired outbox states. Keep transactional reminders separate from marketing consent and #140–#142 campaigns; do not send without connected delivery, recipient authorization and suppression checks.
- Done when: Saved templates and staged status reflect actual eligibility, with no-key mode never showing Sent. Phone/desktop platform acceptance passes.
- Verification/evidence: Template, status-transition, consent/no-key tests plus 390×844 phone and 1440×900 desktop screenshots under `docs/build-evidence/127A/`.
- External keys/accounts: K17/K18 for future SendGrid email; SMS delivery requires separately verified provider access.

### #128 — Import the four fully written trade email sets

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/library.js` **(new)**; `public/email-library.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Import existing approved-source drafts for Roofing/HVAC/Patios/General Contractors with explicit review status; validate tokens/links; no plan/calendar idea is mislabeled as finished copy.
- External keys/accounts: None.

### #129 — Add a reviewed starter email set for Plumbing

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/plumbing.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #130 — Add a reviewed starter email set for Electrical

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/electrical.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #131 — Add a reviewed starter email set for Landscaping

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/landscaping.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #132 — Add a reviewed starter email set for Flooring

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/flooring.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #133 — Add a reviewed starter email set for Painting

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/painting.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #134 — Add a reviewed starter email set for Fencing

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/fencing.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #135 — Add a reviewed starter email set for Garage Doors

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/garage-doors.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #136 — Add a reviewed starter email set for Pest Control

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/pest-control.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #137 — Add a reviewed starter email set for Windows/Doors

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/windows-doors.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #138 — Add a reviewed starter email set for Solar

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `public/email-library/solar.json` **(new)**; `tests/email-library.mjs` **(new)**.
- Done when: Three distinct starter campaigns for this trade have finished subject/body/CTA, reviewed graphics references and valid business tokens. Explicitly record remaining yearly-calendar slots as drafts, not completed campaigns.
- External keys/accounts: K01 only for new image generation.

### #139 — Generate per-campaign email artwork

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF; [`U`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §U.
- Files to touch: `src/email/artwork.js` **(new)**; `src/media/image-provider.js` **(new)**; `tests/email-render.mjs` **(new)**.
- Done when: One approved campaign gets brand-aware image variants with alt text and mobile fallback; render/approval is separate from sending and duplicate jobs do not consume credit twice.
- External keys/accounts: K01.

### #140 — Send one approved test email

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/sendgrid.js` **(new)**; `src/email/send.js` **(new)**; `tests/email-send.mjs` **(new)**.
- Done when: Server validates exact approved content/recipient scope, permissions and domain readiness; one explicitly authorized test recipient gets a real message and provider receipt; no-key mode is a labeled stub.
- External keys/accounts: K17, K18.

### #140A — Rebuild the approved customer preview and purchase journey

- State: **Not started** · Estimate: **6h** (≤1 day). Dependency: #051–#057, #057A–#057B and #140 for any real preview email.
- Reference: [platform gap audit](docs/product/PLATFORM-GAP-AUDIT.md) §2, using `.data/sites-v11-recovery/public/website-sales-ui.js`, `public/checkout-simulation.js`, `public/launch-public.js`, `src/website-sales.js` and `src/website-invoice.js` for behavior; keep the recovery directory intact.
- Scope: Restore an approved per-contact website invoice/preview and a scoped purchase path through payment, questionnaire, domain and approval. The global Contacts payment column shows verified or explicit unverified/test status, and Send Preview uses only approved #140 delivery after consent/recipient checks. No simulation grants entitlements or claims payment. Preserve the local sales-preview boundary.
- Done when: Preview access, status, handoffs and failure states are accurate; no payment or message occurs without its separate authorization. Phone/desktop platform acceptance passes.
- Verification/evidence: Authorization, preview, status and no-key tests plus 390×844 phone and 1440×900 desktop screenshots under `docs/build-evidence/140A/`.
- External keys/accounts: K09 for live payment; K17/K18 for approved SendGrid delivery. No production purchase authorized.

### #141 — Handle signed email events and unsubscribe

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/webhooks.js` **(new)**; `src/email/recipients.js` **(new)**; `tests/email-events.mjs` **(new)**.
- Done when: Verified provider events dedupe bounce/complaint/delivery; one-click opt-out suppresses future queued sends; invalid signatures and cross-tenant events fail.
- External keys/accounts: K17.

### #142 — Schedule approved email batches with limits

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/scheduler.js` **(new)**; `src/jobs/scheduler.js` **(new)**; `tests/email-send.mjs` **(new)**.
- Done when: Approved immutable campaign/segment snapshots send in bounded batches, recheck suppression, retry safely and stop on cancellation; annual plans create review tasks, not silent sends.
- External keys/accounts: K17, K18.

### #143 — Show honest email results

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/email/reporting.js` **(new)**; `src/client/workspace/email-results.ts` **(new)**; `tests/email-events.mjs` **(new)**.
- Done when: Dashboard separates delivered/bounced/clicked from estimated opens; no-data state is clear; unavailable replies are not implied synchronized.
- External keys/accounts: K17 for actual event data.

### #144 — Deliver the approved ebook by email

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`I`](docs/product/01-CORE-SITE-A-N.md) §I; [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `src/ebook.js` **(new)**; `src/email/send.js` **(new)**; `tests/ebook.mjs` **(new)**.
- Done when: Requested ebook gets one authorized transactional delivery with limited download access and retries; marketing remains separate; absent sender is Delivery not connected.
- External keys/accounts: K17, K18.

### #145 — Connect GA4 reporting authorization

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AD`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD.
- Files to touch: `src/analytics/ga4.js` **(new)**; `src/client/workspace/analytics.ts` **(new)**; `tests/analytics.mjs` **(new)**.
- Done when: Verify access to the chosen property with actual approved credentials; ID-only state is not Connected; missing/revoked access yields an honest stub.
- External keys/accounts: K19.

### #146 — Instrument consent-aware homeowner events

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AD`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD.
- Files to touch: `src/client/site/analytics.ts` **(new)**; `src/worker.js`; `tests/analytics-events.mjs` **(new)**.
- Done when: With approved configuration/consent, events distinguish click, accepted inquiry and confirmed outcome; duplicate events/PII are blocked; no key/config means no pretend traffic.
- External keys/accounts: K19.

### #147 — Build the measured Growth dashboard

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AD`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD.
- Files to touch: `src/analytics/ga4.js` **(new)**; `src/client/workspace/analytics.ts` **(new)**; `tests/analytics.mjs` **(new)**.
- Done when: One property/date range shows fetched traffic and accepted-inquiry metrics with freshness/source labels and empty/error states; clicks are not reported as revenue.
- External keys/accounts: K19.

### #148 — Generate a reviewed Growth task list

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AD`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD.
- Files to touch: `src/growth.js` **(new)**; `src/client/workspace/growth.ts` **(new)**; `tests/growth.mjs` **(new)**.
- Done when: Evidence-backed suggestions cite their actual inputs and create approval-required local tasks; lack of data gives an honest insufficient-data state; nothing publishes or spends automatically.
- External keys/accounts: K01, K19.

### #149 — Connect one Meta ads account

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/meta.js` **(new)**; `src/client/workspace/ads.ts` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: Approved account access and supported capabilities are verified; no-key state is Not connected; authorization alone does not create campaigns.
- External keys/accounts: K20.

### #150 — Connect one Google Ads account

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/google.js` **(new)**; `src/client/workspace/ads.ts` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: Approved customer/account access is verified and scoped; developer/API approval requirements are checked from current provider documentation; no account access is guessed.
- External keys/accounts: K21.

### #151 — Draft an ad from one approved asset

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/drafts.js` **(new)**; `src/client/workspace/ads.ts` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: A versioned creative/landing-page/audience/budget draft uses only approved owned media; no ad is submitted or spend started.
- External keys/accounts: K01 only for requested copy/creative generation.

### #152 — Enforce exact-budget owner approval

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/approval.js` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: Owner approval binds content/account/currency/budget/schedule version; edits invalidate it; non-owner/tampered/replayed approvals cannot authorize spend.
- External keys/accounts: None.

### #153 — Submit one approved Meta test campaign

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/meta.js` **(new)**; `src/ads/approval.js` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: One supported paused/test campaign is created with exact approved inputs and real receipt; if provider cannot provide a non-spending test path, leave stub and require separate explicit live-spend authorization.
- External keys/accounts: K20.

### #154 — Submit one approved Google test campaign

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/google.js` **(new)**; `src/ads/approval.js` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: One supported paused/test campaign is created with exact approved inputs and real receipt; if provider cannot provide a non-spending test path, leave stub and require separate explicit live-spend authorization.
- External keys/accounts: K21.

### #155 — Report ad status, spend and stop state

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE.
- Files to touch: `src/ads/reporting.js` **(new)**; `src/client/workspace/ads.ts` **(new)**; `tests/ads.mjs` **(new)**.
- Done when: Fetch actual account spend/status, label attribution limits and confirm pause/stop receipt; stale/failed reads are visible and a budget cap is not claimed without enforcement.
- External keys/accounts: K20, K21.

### #156 — Define the remote CRM adapter and stub

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`AA`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §AA.
- Files to touch: `src/integrations/crm.js` **(new)**; `src/client/workspace/` contractor CRM status view; `tests/crm-adapter.mjs` **(new)**.
- Done when: Contract, tenant mapping, permitted fields and authentication requirements are recorded from real remote documentation; the contractor CRM status screen shows Website → CRM inquiry queue and CRM → Project stories with Pending authorization/Not connected states; local capture is not reported as sync. Use `.data/sites-v11-recovery/public/portal-ui.js` and `src/launch.js` only as behavior references, preserving the recovery directory. Test role/tenant/no-key states and capture 390×844 phone and 1440×900 desktop screenshots under `docs/build-evidence/156/`; satisfy the standing platform mobile rule.
- External keys/accounts: K24.

### #157 — Deliver one website lead to the remote sandbox

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AA`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §AA.
- Files to touch: `src/integrations/crm.js` **(new)**; `src/jobs/worker.js` **(new)**; `tests/crm-adapter.mjs` **(new)**.
- Done when: An authorized sandbox receives one scoped consent-bearing lead once; retries/deduplication/mapping failures are tested; no changes to the CRM codebase.
- External keys/accounts: K24.

### #158 — Import one consented CRM project photo

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AA`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §AA; [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X.
- Files to touch: `src/integrations/crm.js` **(new)**; `src/project-map.js`; `tests/crm-adapter.mjs` **(new)**.
- Done when: One authorized remote photo retains rights/source and enters a private project draft; exact locations are protected; no automatic publication or cross-tenant access.
- External keys/accounts: K24, K08 for deployed storage.

### #159 — Create the CRM explainer clip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AA`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §AA.
- Files to touch: `public/sales-films.json` **(new)**; `src/client/workspace/sales-media.ts` **(new)**; `tests/sales-media.mjs` **(new)**.
- Done when: One reviewed clip accurately separates implemented sync from planned capabilities; private contractor placement has captions/poster and no homeowner CRM sales copy.
- External keys/accounts: K02.

### #160 — Add weather-homepage rules and no-data stub

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/weather.js` **(new)**; `src/conversion-page.js`; `tests/weather-homepage.mjs` **(new)**.
- Done when: Owner-approved rules change only approved banners using fresh bounded data; no provider/no-data state stays neutral; no invented storm alert or automatic discount.
- External keys/accounts: K25 (provider not chosen).

### #161 — Connect one weather observation source

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/weather.js` **(new)**; `src/connections/weather.js` **(new)**; `tests/weather-homepage.mjs` **(new)**.
- Done when: Document permitted provider use, retrieve one location’s current data, enforce expiry/fallback and keep visitor IP private; no-key mode remains a labeled stub.
- External keys/accounts: K25.

### #162 — Build the Roofing storm companion

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/storm.js` **(new)**; `src/website-pages.js` **(new)**; `tests/creative-products.mjs` **(new)**.
- Done when: Homeowner can collect an approved inspection/document checklist; no claim outcome or coverage guarantee; private uploads and export permissions are tested.
- External keys/accounts: None.

### #163 — Build one downloadable job binder

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/binder.js` **(new)**; `src/client/workspace/projects.ts` **(new)**; `tests/creative-products.mjs` **(new)**.
- Done when: One approved project exports versioned photos/docs with provenance and permission checks; missing content is explicit, links expire as designed, and unrelated project data cannot leak.
- External keys/accounts: None.

### #164 — Add past-customer referral verification

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC; [`T`](docs/product/02-CREATIVE-TRUST-O-T.md) §T.
- Files to touch: `src/creative/referral.js` **(new)**; `src/promotion-tasks.js` **(new)**; `tests/promotion-unlocks.mjs` **(new)**.
- Done when: A confirmed past-customer referral has scoped attribution and reward eligibility, abuse/replay checks and explicit approval; no reward for a positive review.
- External keys/accounts: None.

### #165 — Add the Roofing Spanish language path

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/i18n.js` **(new)**; `public/locales/roofing.es.json` **(new)**; `src/website-pages.js` **(new)**; `tests/localization.mjs` **(new)**.
- Done when: One reviewed Roofing page family has usable language switching and persisted form context; missing translated content is labeled/falls back honestly; offers/legal facts do not change between languages.
- External keys/accounts: K26 (human translation review; not an API key).

### #166 — Add crew/truck QR destination and attribution

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/qr.js` **(new)**; `src/worker.js`; `tests/creative-products.mjs` **(new)**.
- Done when: One stable, owner-approved QR URL reaches the intended service page and records privacy-aware source context; destination edits do not require printing a new code.
- External keys/accounts: None.

### #167 — Build one HOA packet export

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/hoa.js` **(new)**; `src/client/workspace/projects.ts` **(new)**; `tests/creative-products.mjs` **(new)**.
- Done when: One homeowner-approved packet includes factual scope/materials/photos, clear missing fields and scoped export; never claims HOA approval or permit compliance.
- External keys/accounts: None.

### #168 — Add factual competitor comparison

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC.
- Files to touch: `src/creative/comparison.js` **(new)**; `src/website-pages.js` **(new)**; `tests/creative-products.mjs` **(new)**.
- Done when: Only dated, sourced and owner-approved comparisons render; unsupported allegations/ratings/savings are rejected; source expiry hides or flags stale claims.
- External keys/accounts: None.

### #169 — Review the monthly-product release candidate

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`X`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §X; [`Y`](docs/product/03-UPSELLS-MEDIA-CRM-U-AA.md) §Y; [`AB`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AB; [`AC`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AC; [`AD`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AD; [`AE`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AE; [`AF`](docs/product/04-GROWTH-ADS-EMAIL-AB-AF.md) §AF.
- Files to touch: `tests/monthly-acceptance.mjs` **(new)**; `docs/product/MONTHLY_ACCEPTANCE.md` **(new)**.
- Done when: Show local evidence for subscriptions, consent, approval, failure/no-key states and one supported end-to-end test per enabled provider; list blocked live capabilities and remaining content slots. No implicit production release.
- External keys/accounts: None.

## Completion coverage and honest remaining scope

These are implementation slices, not a promise that a single starter catalog or successful provider fixture completes an entire pack. The email starters deliberately do not represent a finished year of campaigns; the yearly calendar remains review-driven and new content is generated/approved through the implemented workflow. At each phase acceptance gate, reconcile every relevant BUILD-STATUS row. If any required behavior, trade-specific asset, language or provider is still missing, retain Partial and add small numbered follow-up tickets before claiming the section Done. Never silently drop unsupported integrations or requirements.

No deployment ticket is included. After a reviewed candidate exists, staging/production release remains a separate user-authorized action. No feature ticket has been started by this audit.
