# Module: design

## Purpose
Chooses how a contractor site looks: trade kits, layout compositions, cinematic films, and saved design recipes. It does not invent business facts.

## Server
- **Routes**:
  - `GET /design-preview/:kit/:layout` — `layout` is `immersive`, `editorial`, or `studio` (`src/worker.js`). Staff may open it without a tenant. Anyone else must pass `?tenant=` and have `access`.
  - `GET /design-preview/:kit/:layout/pricing` — same gate (`src/pricing.js`).
  - `GET|POST /api/design-library` — platform admin only (`src/saved-designs.js`).
  - Kit choice is also an input to `POST /api/tenants` and draft settings (`designKit`, `template`, `effects`, `design`). See `sites.md`.
- **Tables**: no dedicated design table. Kit id and variant live in `tenants.settings` / `tenants.published`. Saved templates are `workspace_records` handled by `src/saved-designs.js` (global, admin-only). Usage counts mean distinct contractor websites, not page views (`OPERATIONS.md`).
- **Code**: `src/design-kits.js`, `src/design-variant.js`, `src/cinematic.js`, `src/showcase.js`, `src/trade-components.js`, `src/cutaway.js`, `src/saved-designs.js`.
- **Auth**: library previews are staff, or a member of the `tenant` query param. Applying a kit to a draft uses tenant `write`.

### Kits
`public/design-kits.json` kits: `roofing` (RIDGELINE), `patios` (OPEN AIR), `plumbing` (FLOW STATE), `hvac` (ATMOSPHERE), `electrical` (CURRENT), `landscaping` (FIELDWORK), `general-contractors` (FORM & FOUNDATION). Also `flooring`, `painting`, `fencing`, `garage-doors`, and `pest-control`: twelve trades matching `public/trade-library.json`. Each kit has `trade`, `layout` (`immersive` | `editorial` | `studio`), `color`, `headline`, `direction`, `prompt`, `recipes`, and `videoPoster`.

`kitDefaults` maps layout to template: immersive → `cinematic`, editorial → `editorial`, studio → `blueprint`.

`effectKeys` in `src/design-kits.js`: `reveal`, `parallax`, `marquee`, `servicePicker`, `process`, `stickyNav`, `cutaway`, `serviceImages`, `commercial`, `ctaBands`, `projectMap`, `readingProgress`, `spotlight`, `chapterRail`, `planning`, `titleMotion`, `scrollStory`. A missing flag defaults to on (`!== false`).

`cleanDesign` (`src/design-variant.js`) supports the six visual fields below plus `serviceLayout`, `ownerLayout`, `sectionOrder`, `storyIntensity`, `storyTreatment`, `bannerArt`, and `headlineMotion` (thirteen total):

| Field | Values (first is default) |
|---|---|
| `font` | `display`, `editorial`, `modern` |
| `cards` | `classic`, `framed`, `soft` |
| `rhythm` | `balanced`, `airy`, `compact` |
| `heroFrame` | `standard`, `arch`, `offset` |
| `entrance` | `rise`, `mask`, `soft` |
| `palette` | `brand`, `ocean`, `copper`, `violet` |

`public/design-recipes.json` is a reviewed recipe list (`reviewed: 2026-09-16`) with query strings that select those values. The composer randomizes checked dimensions and locks unchecked ones. It composes CSS and interactions. It does not ask a model to rewrite source (`DESIGN_RESEARCH.md`).

### Films and cutaways
`public/trade-films.json` and `public/pricing-films.json` point at `/assets/films/*.mp4` plus posters. `trade-films.json` durations in file are `12` with chapters at 0 / 3 / 8 seconds. `docs/chat-pricing-release.md` describes a later 15-second set; if those numbers disagree, the JSON in `public/` is what the page loads. Transcripts say the clips are illustrative, not completed contractor work.

`public/cutaways.json` plus `src/cutaway.js` are conceptual SVG annotations on generated base images, not engineering diagrams (`DESIGN_RESEARCH.md`). `public/service-art.json` and `public/service-copy.json` map specialty names to art. Unknown service names do not get unrelated artwork (`DESIGN_RESEARCH.md`).

Roofing map demos: three labeled scenarios when no real projects exist and `showDemoProjects` is not false. They are not completed jobs (`README.md`).

## Browser
- **Pages**: design preview routes above; kit sections rendered inside `/s/:slug` by `src/showcase.js` / `src/views.js`.
- **Scripts / data**: `public/design-kits.json`, `public/design-recipes.json`, `public/trade-films.json`, `public/pricing-films.json`, `public/trade-library.json`, `public/cutaways.json`, `public/service-art.json`, `public/service-copy.json`, `src/client/site/cinematic.js`, `src/client/site/cinematic-controls.js`, `src/client/site/cutaway.js`, `src/client/site/showcase.js`, `src/client/site/trade-components.js`, and the matching CSS files.
- **Calls**: `/api/design-library` from the admin composer. Preview routes are HTML.

## Business rules
- Business name, contacts, services, and brand color stay as saved when a composition is applied. Publication stays a separate action (`DESIGN_RESEARCH.md`).
- Do not invent reviews, ratings, project counts, warranties, team members, or completed jobs. Illustrative assets stay labeled.
- Reduced motion keeps content and disables pinning/transitions (`README.md`, `DESIGN_RESEARCH.md`).
- Creative brief text is stored. It is not automatically sent to a model (`OPERATIONS.md`).
- The former Robles renderer stays active for existing non-kit sites (`OPERATIONS.md`).

## Gotchas
- `DESIGN_RESEARCH.md` says six configurable effects. `effectKeys` in code lists fifteen. The code list is the one the server saves.
- Film duration prose in `docs/chat-pricing-release.md` (15 seconds, 1280×720) may be ahead of `public/trade-films.json` (`duration: 12`). Trust the JSON the page embeds until someone updates it.
- `CINEMATIC_ASSETS.json` at the repo root is a credit/manifest file. It is not imported by `src/design-kits.js`.
- Unknown: which kit ids are selected on live tenants. Not in git.

## Related modules
`sites` (settings fields and publish), `media` (owner-supplied photos override kit art), `engagement` (pricing page film and review section).

## Sources
`DESIGN_RESEARCH.md`, `OPERATIONS.md`, `README.md`, `docs/chat-pricing-release.md`, `public/design-kits.json`, `public/design-recipes.json`, `public/trade-films.json`, `public/pricing-films.json`, `public/trade-library.json`, `public/cutaways.json`, `src/design-kits.js`, `src/design-variant.js`, `src/cinematic.js`, `src/showcase.js`, `src/saved-designs.js`, `src/worker.js`, `src/pricing.js`.


## Shared footer and navigation — local, 2026-09-23/24

The Pack 0 increment adds `settings.platform` (schema in `src/platform/constitution.ts`), a Questionnaire draft editor, published Financing/Promotions pages, a public same-origin quiz-unlock endpoint, and shared footer/location/social settings. New pages default off; public reads use published snapshots; owner publication and existing tenant roles remain unchanged. This work is local and not deployed. Exact behavior, limitations and the full A–AE checklist: [Pack 0 implementation](../product/PACK0_IMPLEMENTATION.md).


## Website experience redesign — local, 2026-09-24

Financing and Promotions now have custom illustrated heroes, stronger CTAs, benefit/process sections, ticket-style rewards, a visual calculator and trade-specific scroll-scrubbed films. Footer social profiles use local accessible SVGs. Reduced motion and pause controls are supported. This work is not deployed. See [experience implementation and validation](../product/EXPERIENCE_REDESIGN.md).


## Customer-intent reference experiences

Read [standing conversion design principles](../product/CONVERSION_DESIGN_PRINCIPLES.md) for all subsequent public design work. Three opt-in `settings.journey` values (`roof-repair`, `hvac-replacement`, `patio-design`) select `src/conversion-page.js` through the shared showcase renderer; `standard` preserves the existing renderer. The journey must match the website trade. `settings.conversionBrief` stores planning audience/problem/source and optional public headline/introduction/differentiator/next-step copy. Public custom copy only renders when confirmed. See `src/platform/conversion.ts`.

Previews use the existing authenticated `/design-preview/:kit/:layout?journey=...` route. The trade library links to them; creation and Questionnaire include journey selectors. Visual composition updates preserve journey/brief; reference rendering currently honors font, cards, reveal, cutaway, projectMap and hero scrollStory. It does not claim every legacy visual dimension changes a reference. Saved style favorites still store visual styles, not customer briefs or journeys.

References use one main inquiry form, real configured services, contextual selection, project city/timing, request-appropriate CTAs, FAQs, real review-profile links only after confirmation, and optional existing portfolio content. All three references use the existing full-film scrub controller in the hero while preserving their customer-intent copy. The sticky header is measured for film and anchor offsets. The animation can be disabled in the Questionnaire; reduced motion and media errors use a static scene. Educational cutaways remain below the services. Forms use the shared same-origin, consent-protected inquiry transport. Public settings still come from published snapshots. Missing owner sections no longer get About links. The generic pricing CTA now reads Request an estimate; unsupported Free estimate copy was removed.

Local verification: `npm run build`, `npm run typecheck:client`, `npm run test:conversion`, and existing design/scroll/constitution/client suites. Disposable local preview: `node .data/conversion-preview.mjs`, port 8094, three slugs matching the journey IDs. This is not a staging or production release.


Reference refinement (updated for Pack 2): enabled empty portfolios show the honest Project Map empty state; authenticated library previews show labeled sample projects, configured chat remains inline beside the inquiry, and reference section order is not rearranged by legacy section settings. Services must match the selected journey. The common film controller ignores an empty deferred-source error until a source has actually been assigned; real media errors still show the finished static scene. The regression suite covers this below-fold case.


## Pack 2 creative and proof direction

Pack 2 (O-T) is specified in [the creative/trust specification](../product/PACK2_CREATIVE_TRUST_SPEC.md), with twelve-trade About/Shorts prompts in its companion. These are not completed runtime integrations. [Local refinements](../product/PACK2_LOCAL_REFINEMENTS.md) records the implemented map/branding/review/calculator work. `websiteBrand` in `src/site-polish.js` prefers the uploaded logo, otherwise a house mark; reference headers validate available photo ownership. `src/project-map.js` provides an honest zero-project section; actual published portfolio data retains the existing map and filters. `src/showcase.js` now supplies labeled sample portfolios to reference previews. Shared header branding stays inline and responsive. The existing hero, selected services and contact form are preserved.

## Windows/Doors and Solar — local, 2026-09-24

The library now has 14 kits: `windows-doors` / `Windows/Doors` / Daylight, and `solar` / `Solar` / Sunward add eight selectable services each. Each has one generated concept hero and eight SVG service illustrations; their optional `kit.art.banner/detail` references avoid nonexistent hardcoded trade-art paths. `kit.intro` supplies trade-specific first-screen copy. They use the existing five-chapter image scroll story until suitable trade-specific films exist; original 12-trade videos remain untouched. Home/pricing/blog and all three layouts are covered. See `docs/product/IMPLEMENTATION_ROADMAP.md` and `TRADE_FINANCING_ASSETS.md`.

Mobile QA also corrected the legacy showcase rule that hid all but the last navigation link. Shared navigation now retains all links in a horizontally scrollable sticky row. The updated showcase stylesheet reference is versioned to avoid stale browser caches.


## Ticket #002 — Roofing journey acceptance

Roofing reference copy uses repair/replacement language only when both services are selected (`roofingJourneyCopy` in `src/platform/conversion.ts`); repair-only sites retain repair-specific language. The existing hero, sticky header and service-selection transport remain unchanged. `tests/fixtures/roofing-journey.mjs` and `scripts/preview-roofing-journey.mjs` supply a disposable local acceptance fixture on port 8096. See [ticket #002 evidence](../build-evidence/002/README.md) for desktop/mobile screenshots, browser inquiry and tests. This is local working-tree evidence, not a deployment.

## Ticket #004B — shared premium trade pages

See [the design standard](../TRADE_DESIGN_SYSTEM.md). Roofing service detail now uses the shared tp-* components, generated hero/sign/comparison assets, responsive brand tokens and reduced-motion-aware reveal. Future trade detail renderers must reuse this system with their own images and copy. [Evidence](../build-evidence/004B/README.md).

## #004C — playbook refinement

Roofing detail reuses #004B with larger hero/type, benefit-led inclusion cards, process icons and optional financing/promotion components. The [24-item checklist and screenshots](../build-evidence/004C/README.md) are the acceptance reference for future detail-page work.


## #004E — trade cinematic service-page kit

Shared renderer/config: src/trade-motion.js and src/trade-motion-config.js; progressive controller/styles: public/trade-motion.js/css. Only Roofing service detail is wired. Existing homepage films are unchanged. Supplied Roofing still is optimized to public/assets/trade-motion/roofing-house-still.webp; drone files remain missing. Configured desktop video seeks with scroll or uses an image sequence; mobile selects its short loop; reduced motion unloads film and presents the still. Config holds synchronized mask frames and tracked anchors for future real footage; without tracking, real-footage labels hide. SVG placeholders share camera transforms with their anchors. Anatomy wireframe supports roof, ductwork and pipe kinds. See [asset handoff](../../NEEDS-ASSETS.md) and [004E evidence](../build-evidence/004E/README.md).


## #004F — supplied Roofing flight media

Supersedes the Roofing placeholder portion of #004E: public/assets/trade-motion holds H.264/VP9 desktop and portrait encodes plus a real alpha cutout. Both viewport modes use scroll seeking; no mobile autoplay loop. Controller tries H.264 then WebM, coalesces seeks to the latest scroll position and unloads film for reduced motion. At landing it blends into the original poster; CSS uses the cutout alpha over original image pixels so the headline sits behind the house. Flight tracking is not supplied, so callouts show only on the final registered still. Hero copy has a dark gradient. Mobile anatomy uses a tight viewBox and an in-flow X-ray control. [004F evidence](../build-evidence/004F/README.md).
