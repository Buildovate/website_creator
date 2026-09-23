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
`public/design-kits.json` kits: `roofing` (RIDGELINE), `patios` (OPEN AIR), `plumbing` (FLOW STATE), `hvac` (ATMOSPHERE), `electrical` (CURRENT), `landscaping` (FIELDWORK), `general-contractors` (FORM & FOUNDATION). Same seven trades as `public/trade-library.json`. Each kit has `trade`, `layout` (`immersive` | `editorial` | `studio`), `color`, `headline`, `direction`, `prompt`, `recipes`, and `videoPoster`.

`kitDefaults` maps layout to template: immersive → `cinematic`, editorial → `editorial`, studio → `blueprint`.

`effectKeys` in `src/design-kits.js`: `reveal`, `parallax`, `marquee`, `servicePicker`, `process`, `stickyNav`, `cutaway`, `serviceImages`, `commercial`, `ctaBands`, `projectMap`, `readingProgress`, `spotlight`, `chapterRail`, `planning`. A missing flag defaults to on (`!== false`).

`cleanDesign` (`src/design-variant.js`) allows only:

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
- **Scripts / data**: `public/design-kits.json`, `public/design-recipes.json`, `public/trade-films.json`, `public/pricing-films.json`, `public/trade-library.json`, `public/cutaways.json`, `public/service-art.json`, `public/service-copy.json`, `public/cinematic.js`, `public/cinematic-controls.js`, `public/cutaway.js`, `public/showcase.js`, `public/trade-components.js`, and the matching CSS files.
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
