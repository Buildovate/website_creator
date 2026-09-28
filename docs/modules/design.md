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


## #007A — About trust design

Roofing About uses src/about-page.js, public/about-trust.css/js with the shared trade-page components. Directly under the hero, confirmed stats use static accessible facts with visual numeric count-up; reduced motion and no-JS retain final values, and license IDs never animate. Three icon-led cards use confirmed proof or neutral request guidance. Owned portraits are allowed in this About hero by Joe's explicit override; the missing-photo treatment is a labeled native SVG Roofing truck. Recent projects reuse published gallery photos, with no fabricated project placeholders. The concise story keeps at most 60 words. [Evidence](../build-evidence/007A/README.md).

## Roofing network strip — #009

src/trust.js renders only approved selected Roofing networks through publicTrustSelections. public/trust.css/js provide the dark proof band, <=5 static row or >5 native carousel, arrows/dots/keyboard and no-autoplay reduced-motion/no-JS fallback. Network names are the K22 text fallback; no brand marks or affiliations are inferred. Owner-entered ratings require current evidence and display owner-confirmed/date attribution. Zero entries omits the section. Both homepage renderers support five selected placements; the service renderer supports service-hero. Public reads remain published snapshots. Existing review feeds are independent; no provider calls are added. [Evidence](../build-evidence/009/README.md).

## #004G — hero framing, seeking and handover

The premium Roofing service hero uses full-frame portrait contain/top framing on phones. Copy remains above the mask inside a fixed dark backing; four mobile links below the hero open and focus anatomy details. Desktop retains registered still callouts. Mobile chapter labels describe the supplied near-house approach; the portrait source lacks the desktop sky opening/full house, tracked in NEEDS-ASSETS.

The controller removes the video poster so the decoded opening frame is visible. Scroll sets a target; exponential easing and a 0.18-second maximum step produce intermediate seeks with only one pending decode. The last 0.3 decoded seconds blend into the existing still with a smooth curve and real-time fade guard. The stage inherits the measured header offset, preventing a final-position shift. Pause/offscreen/visibility/reduced-motion guards and H.264/WebM/still fallbacks remain. Six-frame delivery GOP unchanged. [Before/after evidence](../build-evidence/004G/README.md).


## #004H — partial Roofing homepage motion v2

The roof-repair journey now imports LayerExplode, RevealCompare and KineticText through src/trade-motion.js. public/trade-motion.js exposes its event-driven scheduler for the lazily imported v2 interactions. Saved cleanDesign fields motionLayout (A/B/C), motionStyle (bold-industrial/clean-modern), and motionAnatomy (layers/legacy) choose the presentation. Existing cutaway remains reachable. Source token/component options and actual measurements are in [004H evidence](../build-evidence/004H/README.md). This ticket is **Partial**, stopped after two mobile Performance failures; complete browser/recording evidence and conversion regression acceptance remain open. #004I is backlog-only.

## #004G-v3 — current service hero

Supersedes the video-seeking and top-anchored framing notes above: the supplied v3 clips are WebP canvas sequences (60 landscape / 40 portrait frames). Two low-priority workers load after the first paint; eight decoded bitmaps bound memory. The final frame shares the responsive still URL. Mobile is bottom anchored with the actions above the house and unchanged headline; desktop retains the foreground mask. Reduced motion makes no sequence requests. [Evidence](../build-evidence/004G-v3/README.md).

## #004H-finish — phone loading and final motion acceptance

The Roofing motion homepage uses responsive AVIF/WebP finished stills and media-specific high-priority preloads. scripts/build-roofing-critical.mjs derives initial CSS from the complete source bundles. src/roofing-performance.js gates remaining styles/scripts on the hero LCP with a bounded fallback; full styles append after initial CSS. The worker avoids inferring a real shared header from selector text embedded in that CSS. The v3 service hero uses the same loading gate. Full component state/reduced-motion matrix, both recordings, touch/keyboard QA, full regressions and phone reports now pass the ticket gates. [Final evidence and measured limits](../build-evidence/004H/README.md). #004I remains queued only.


## #004G-v4 — current service-flight framing and playback

The portrait uses a tracked central crop (40 WebP frames in public/assets/trade-motion/v4) with the exact final frame as its still. The preloaded static opening is identical to frame 0; reduced motion and no JS show the final still. All media planes share the same fit. The controller loads consecutively and traverses adjacent frames within the contiguous loaded prefix in either direction. Headline placement and desktop final foreground layering are preserved. Clean motion-layer sticky panels have an explicit token surface for contrast. [Six final phone audits and complete QA](../build-evidence/004G-v4/README.md).


## #004I — Roofing process stack and confirmed stats

The roof-repair homepage now uses `StickyStack` for its three reviewed process steps, with an optional native-link index, A/B/C layout variants, and the same bold/clean token choices as #004H. The component reserves its scroll space before lazy enhancement; reduced motion and no JS show static cards. `StatsMask` consumes `cleanBusinessTrust` and requires each fact's own confirmation. The count-up affects only visual numeric copies; semantic final values and license IDs are static. Empty confirmation sets omit the section. Its photo mask defaults to gable, with drop/sun/flame/validated-logo choices for later trades. Images are lazy, and the Roofing drone hero stays unchanged. [Screenshots, recordings and gates](../build-evidence/004I/README.md).


## #004I-v2 — bounded process cards and one-time counters

Each StickyStack card pins within its own scroll slot, so the next card enters below the outgoing copy and cannot paint through a heading or paragraph. The mobile card height reserves the shared header, step tabs and bottom action bar; image height is 43%. Keyboard/touch index offsets target the card's actual pin. Reduced motion and no JS use static cards. StatsMask counts numeric visual copies once from first grid entry and keeps final text on re-entry; its photo mask and per-field confirmation gates are unchanged. [Transition evidence and measured gates](../build-evidence/004I-v2/README.md).


## #004I-v3 — current process handoffs and trust-safe stats

The stack uses one pinned stage with intact cards fading/scaling in place, including a fade before the last stage releases. A/B/C and both styles share stable active-tab geometry. Mobile images stay 200px high and card copy determines panel height; the duplicate note is removed. Only years/jobs animate, once; rating, review count, warranty and license remain final. Stats photo loading starts near the section and awaits decode before the masked photo can appear; the container has no placeholder fill. Static fallbacks and drone #004G-v4 are preserved. [Failing v2 baseline and final v3 acceptance](../build-evidence/004I-v3/README.md).


## #004I-v4 — current continuous process handoffs

Supersedes the v3 disjoint fade and final fade-before-release: complete panels overlap with a minimum peak opacity of 0.6; copy/captions use disjoint legibility intervals and the active step switches at the midpoint. The compact pinned scene retains its introduction. Decide releases intact, with tabs/introduction clearing before header contact and stats entering directly below. Phone B specificity is corrected so every image remains 200px; enhanced cards share the measured content height. All v3 trust/decode/fallback behavior and #004G-v4 drone code/media are preserved. [V4 baseline and final acceptance](../build-evidence/004I-v4/README.md).


## #004W-v4 service and core visuals

`src/service-detail.js` is the sole service renderer, including the compatibility export in `website-pages.js`. It preserves authored content and data gates. `public/service-art.json` maps 132 unique heroes; `public/service-media.json` maps 264 unique scope/process photographs. `service-showpiece.js` supplies trade-correct dimensional SVG assemblies; its small browser controller animates only the signature section with reversible scroll progress and anchored labels, with static reduced-motion/no-JS output. Generated photos are representative scope media, not customer projects. Full previews use Sample tags and noindex; published comparison requires distinct owned photos. Financing uses the shared site typography/palette and preview-only unit loan math with adjacent APR/term, never an inferred service price. `city-editorial.js` holds the reviewed local copy. [Evidence](../build-evidence/004W-v4/README.md).

## #170 catalog extension

The shared JSON kit catalog now exposes 17 trades. Concrete/Groundwork and Pools/Stillwater are enabled; Locksmith/Keyline adds eight service briefs. Library, create, prepare, composer and questionnaire use those existing catalogs. Questionnaire kit changes refresh explicit service choices and save trade/kit only to the draft. `formatDesignName` is reserved for preview artwork; `formatTemplateName` retains trade context in template titles and selectors. Generated still provenance and local verification are in `docs/build-evidence/170/`.

## #170A — public visual correctness

Service detail artwork now resolves the exact trade/service through `servicePhoto` and uses existing generated raster photography for former diagram, scope, package and FAQ slots. Unknown services get no substitute artwork. Existing Windows/Doors and Solar hero SVGs depict their own services; package/FAQ photo slots use their raster service photos. The generic roof assembly, material stack and fake dimensional overlay are removed from universal service pages. This supersedes the earlier shared AR-house description.

The homepage owns its review region; the public response decorator adds one only when absent. One CTA band and one craft inquiry remain. Preview feedback contains no invented quote or rating, including optional chapter mode. `projectMapSurface` provides server-rendered, keyboard-linked pins; previews use configured service cities. Published maps require real, non-sample projects with numeric coordinates. Tiles progressively enhance the static map and failures retain it. Empty published maps are omitted. City pages combine local context and FAQs beside service photography with a tighter rhythm. See #170A evidence.


## #018 Roofing action and pricing placement

The roof-repair journey alone renders src/roofing-cta.js, backed by src/platform/roofing-cta.ts. Roofing settings retain approved priceBook.items and a roofingCta slot (after-services / after-story), lock, generation, burst toggle and selected price ID. Saved settings and publication snapshots own the placement; render never randomizes it. Owner controls live in the existing Questionnaire; tenant PUT enforces owner access for placement changes while ordinary editor saves preserve it. Missing or ineligible public prices omit the entire panel. Preview-only Sample markup is never saved. Inline shingle motion is CSS-only and disabled for touch/reduced motion; anchors use measured header offsets. See docs/build-evidence/018/README.md and tests/roofing-cta{,-browser}.mjs. Other journeys, hero/drone assets and financing logic are unchanged.


## #019 accessible thumbnail primitives

Roofing Services overview uses src/platform/thumbnail-motion.ts for persisted thumb_motion_effect, thumb_motion_locked and thumb_motion_seed and shared image markup. The supported choices are none, flip_3d, zoom_overlay and border_draw. src/client/site/service-motion.ts only gates decorative enhancement on image decode; public/service-motion.css confines 120ms motion to images/frames under fine-pointer hover and no reduced-motion preference. Copy and native service links never move or disappear. Failed rear imagery retains a static front; no JS leaves useful native links. Owner Questionnaire controls include a real three-card preview; tenant PUT protects changing the owner choice. Generation uses equally weighted seeded choices; a lock preserves the previous choice. This root ticket implements three primitives, not all fifteen Pack O effects. Homepage/CTA and other trades remain unchanged. Evidence: docs/build-evidence/019/README.md.


## #020 Roofing planning chapter

src/roofing-story.js adds one photographic planning story to the Roofing roof-repair journey after the existing layer scene and before gallery content. The saved effects.planning switch controls it; a relevant selected service is required. Existing representative Roofing service imagery remains attributed, with an additional Sample label only in noindex preview. Public output has no sample label or empty chapter. Native inquiry links reuse service preselection; only decorative path/rules settle at 120ms on fine-pointer desktop. Touch, reduced-motion and no-JS retain the full static content. Existing hero, process, CTA and thumbnail modules are preserved. See docs/build-evidence/020/README.md.


## #023 stable generation manifest

The manifest is server-owned metadata inside each existing tenant draft/published snapshot. src/platform/generation.ts validates its version, identity, choices, locks and digest; src/generation.js inventories existing catalog/rendered asset references and coordinates adoption/regeneration. The original cleanDesign options are exported from design-variant.js, not duplicated. Existing thumbnail and CTA locks/seeds are preserved. Generic saves cannot forge a manifest or bypass locked composition choices.

GET /api/tenants/:id/generation exposes the saved choices and tenant-scoped history. POST accepts version plus action locks/regenerate and requires owner/admin. Regeneration changes approved unlocked options, keeps facts/services/URLs/protected content and leaves new AI assets Pending / Not connected. The existing composer stores its Vary flags using manifest lock keys; library recipes retain optional locks. Current settings, normal saves and republishing do not reroll choices. Existing sites are adopted with a compare-and-swap metadata write, without publishing a draft. Migration 0008 stores immutable generation_manifests history; all 17 kits have identical before/after rendering proof. See docs/build-evidence/023/README.md for the regeneration checklist and limits.

## #028A site styles

`src/design-styles.js` supplies Current, Bold, Fresh and Classic configurations for all 17 installed kits. They reuse installed Barlow and DM Sans font files plus the system Georgia stack. Each configuration defines typography, palette, radius, spacing and surface treatment; sections, factual copy, media and CTA labels come from the existing renderers. `public/site-styles.css` supplies the three opt-in skins. Uploaded logos receive a neutral contrast plate in those skins.

`stableSiteStyleSeed(tenantId)` is the single FNV-1a adapter reserved for replacement by #004M. New tenants and duplicates receive a stored seed. A saved `siteStyle` overrides it. Legacy sites with neither field remain Current to preserve existing sites; their renderer remains an identity operation. The generation manifest records the style and seed only when present, and refresh retains them. This ticket does not implement #028B section variants.

Current retains its final presentation except the requested shared-header alignment and Joe-approved minimal AA color corrections. Reduced-motion first-paint CSS now matches the existing controller's settled static layout. See [#028A evidence](../build-evidence/028A/README.md) for the four approved final color values, before/after captures and passing checks.
