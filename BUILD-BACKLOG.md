# BUILD BACKLOG

Completed: **#001–#002**. Next ticket: **#003 — Add draft/published page data contracts**. Execute one ticket per session; all later tickets remain Not started. Ticket evidence and remaining gaps live in BUILD-STATUS.md.

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

Scope: Website Design only. Retain the 14 trades, existing good media, scroll hero, sticky header, selected services, uploaded branding, source reviews and approved Project Map. Latest financing direction is calculator → Get Financing Options → configured provider flow; no lender marketing showcase. All external account state is unverified unless NEEDS-KEYS records a confirmed fact.

Pricing source for affected tickets: read only the referenced W/AB/AF pricing paragraphs and the named rows in `docs/product/PACK4_CATALOG_DELTA.md`. Do not reread all packs or invent SKU contents. Planning does not provision accounts or authorize any charges.

## Phase 1 — the homeowner website that sells; Roofing first

Tickets #001–#041.

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

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/platform/website-pages.ts` **(new)**; `src/core.js`; `tests/website-pages.mjs` **(new)**.
- Done when: Typed service, FAQ, About and city records have stable IDs/slugs, length limits and tenant-owned media references; draft edits do not alter the published snapshot.
- External keys/accounts: None.

### #004 — Render a Roofing service-detail page

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H.
- Files to touch: `src/website-pages.js` **(new)**; `src/worker.js`; `public/website-pages.css` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: One selected roofing service renders headline, scope, art, FAQ and contextual inquiry on its own URL; unknown/unpublished service returns 404 and private preview requires membership.
- External keys/accounts: None.

### #005 — Connect the selected-service grid to detail pages

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H.
- Files to touch: `src/showcase.js`; `src/conversion-page.js`; `src/website-pages.js` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: Only contractor-selected services get tiles and links; all eight Roofing services can be selected; removing/reordering a draft service does not break the published site.
- External keys/accounts: None.

### #006 — Add the Roofing FAQ route

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`L`](docs/product/01-CORE-SITE-A-N.md) §L.
- Files to touch: `src/website-pages.js` **(new)**; `src/site-polish.js`; `tests/website-pages.mjs` **(new)**.
- Done when: FAQ page/navigation work from published data; optional financing/promo answers disappear with their features; no answer invents guarantees or pricing.
- External keys/accounts: None.

### #007 — Add the Roofing About route

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/website-pages.js` **(new)**; `src/site-polish.js`; `public/website-pages.css` **(new)**; `tests/website-pages.mjs` **(new)**.
- Done when: About page uses owner-confirmed story and owned images; logo displays; absent portrait has an honest designed fallback; no generated employee is implied.
- External keys/accounts: None.

### #008 — Model trust selections and evidence

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P.
- Files to touch: `src/platform/trust.ts` **(new)**; `src/core.js`; `tests/trust.mjs` **(new)**.
- Done when: Each network has enabled/profile/evidence/expiry fields with HTTPS validation; unverifiable memberships/ratings cannot be published as established facts.
- External keys/accounts: None.

### #009 — Render the Roofing trust strip

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P.
- Files to touch: `src/trust.js` **(new)**; `src/conversion-page.js`; `public/trust.css` **(new)**; `tests/trust.mjs` **(new)**.
- Done when: Only approved selected networks render, with accessible names, licensed/approved marks or text fallback; no invented stars; missing feed shows source link/Not connected.
- External keys/accounts: K03, K04 for live excerpts; K22 for marks.

### #010 — Verify Roofing map, logo and review placement

- State: **Not started** · Estimate: **3h** (≤1 day).
- Pack section: [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `src/project-map.js`; `src/conversion-page.js`; `tests/reference-proof.mjs`.
- Done when: Desktop/mobile screenshots show real approved project records, logo, source attribution and useful empty states; private data stays private; mocked results are labeled in test evidence.
- External keys/accounts: None.

### #011 — Add publication rules for required legal facts

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`S`](docs/product/02-CREATIVE-TRUST-O-T.md) §S.
- Files to touch: `src/platform/legal-policy.ts` **(new)**; `src/platform/constitution.ts`; `tests/legal-policy.mjs` **(new)**.
- Done when: A reviewed policy can require a license disclosure and suppress unsupported optional claims; missing policy remains Needs review, never presented as legal compliance.
- External keys/accounts: K23 (reviewed policy content; not an API key).

### #012 — Finish footer empty states and policy placement

- State: **Not started** · Estimate: **4h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`S`](docs/product/02-CREATIVE-TRUST-O-T.md) §S.
- Files to touch: `src/site-polish.js`; `public/site-polish.css`; `tests/constitution.mjs`.
- Done when: All-hidden locations leave no headings/spacers; required policy fields remain visible; multiple-location layouts and legal links work at desktop/mobile widths.
- External keys/accounts: None.

### #013 — Complete footer social identities

- State: **Not started** · Estimate: **3h** (≤1 day).
- Pack section: [`E`](docs/product/01-CORE-SITE-A-N.md) §E.
- Files to touch: `src/social-icons.js`; `src/platform/constitution.ts`; `src/site-polish.js`; `tests/constitution.mjs`.
- Done when: Missing required social identities are supported with accessible icons, approved profile URLs and per-network toggles; disabled links disappear.
- External keys/accounts: K22 only if brand assets need permission.

### #014 — Carry page context into homeowner inquiries

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`N`](docs/product/01-CORE-SITE-A-N.md) §N.
- Files to touch: `src/client/site/inquiries.ts`; `src/worker.js`; `src/form-fields.js`; `tests/website-pages.mjs` **(new)**.
- Done when: Service/city/source context reaches the correct tenant inquiry; consent, honeypot, validation, rate limits and draft restrictions remain enforced. No marketing enrollment.
- External keys/accounts: None.

### #015 — Finish Roofing promotion display states

- State: **Not started** · Estimate: **5h** (≤1 day).
- Pack section: [`A`](docs/product/01-CORE-SITE-A-N.md) §A.
- Files to touch: `src/constitution-pages.js`; `src/conversion-page.js`; `public/constitution.css`; `tests/constitution.mjs`.
- Done when: Current, upcoming, expired and no-offer fixtures show correct content/timezones/terms; homepage strips obey the page switch; no false countdown or free-claim promise.
- External keys/accounts: None.

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

### #028 — Approve the Roofing homeowner reference

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`A`](docs/product/01-CORE-SITE-A-N.md) §A; [`B`](docs/product/01-CORE-SITE-A-N.md) §B; [`E`](docs/product/01-CORE-SITE-A-N.md) §E; [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`P`](docs/product/02-CREATIVE-TRUST-O-T.md) §P; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `tests/roofing-acceptance.mjs` **(new)**; `docs/product/ROOFING_ACCEPTANCE.md` **(new)**.
- Done when: Home/service/FAQ/About/city/promo/finance/footer/form paths pass local route and asset checks; show desktop/mobile screenshots, no overflow and a saved inquiry. Explicit stubs and outstanding external gates are listed; #024–#027 may pass in clearly labeled stub mode when K02 is unavailable. Missing films do not block this Roofing acceptance gate; no deployment.
- External keys/accounts: None.

### #029 — Apply the approved page system to HVAC

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/hvac.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #030 — Apply the approved page system to Patios

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/patios.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #031 — Apply the approved page system to Plumbing

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/plumbing.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #032 — Apply the approved page system to Electrical

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/electrical.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #033 — Apply the approved page system to Landscaping

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/landscaping.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #034 — Apply the approved page system to General Contractors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/general-contractors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #035 — Apply the approved page system to Flooring

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/flooring.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #036 — Apply the approved page system to Painting

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/painting.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #037 — Apply the approved page system to Fencing

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/fencing.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #038 — Apply the approved page system to Garage Doors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/garage-doors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #039 — Apply the approved page system to Pest Control

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/pest-control.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #040 — Apply the approved page system to Windows/Doors

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/windows-doors.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

### #041 — Apply the approved page system to Solar

- State: **Not started** · Estimate: **6h** (≤1 day).
- Pack section: [`H`](docs/product/01-CORE-SITE-A-N.md) §H; [`L`](docs/product/01-CORE-SITE-A-N.md) §L; [`N`](docs/product/01-CORE-SITE-A-N.md) §N; [`Q`](docs/product/02-CREATIVE-TRUST-O-T.md) §Q.
- Files to touch: `public/site-content/solar.json` **(new)**; `public/design-kits.json`; `tests/website-pages.mjs` **(new)**.
- Done when: After the Roofing acceptance gate, this one trade has its own reviewed page content/configuration, chosen-service links and honest media/empty states; render every enabled page and show one mobile screenshot. Do not roll out other trades in this ticket.
- External keys/accounts: None.

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
- Files to touch: `src/integrations/crm.js` **(new)**; `tests/crm-adapter.mjs` **(new)**.
- Done when: Contract, tenant mapping, permitted fields and authentication requirements are recorded from real remote documentation; missing access is Not connected; local capture is not reported as sync.
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
