# #005 — Selected-service grid links

Completed locally on 2026-09-24. Both homepage renderers link contractor-selected Roofing services to enabled detail pages using saved slugs. Missing or disabled detail records retain contextual inquiry links. Unselected services get no tiles. Design-library samples retain inquiry links because they have no tenant detail routes.

## Screenshots

Chrome: desktop 1440×1000, mobile 390×844. Viewport captures show the start of each grid; browser assertions check all eight tiles and links, including those below the viewport. Detail screenshots follow a real Roof repair click.

| Renderer | Desktop | Mobile |
|---|---|---|
| Roofing reference | [Grid](desktop-roof-repair-grid.png) | [Grid](mobile-roof-repair-grid.png) |
| Standard showcase | [Grid](desktop-standard-grid.png) | [Grid](mobile-standard-grid.png) |
| Detail destination | [Roof repair](desktop-detail.png) | [Roof repair](mobile-detail.png) |

## Test output

| Check | Result | Output |
|---|---|---|
| `node build.mjs` | Pass; 276 assets, 14 kits | [Build](build.txt) |
| `node node_modules/typescript/bin/tsc -p tsconfig.auth.json` | Exit 0; no diagnostics | [TypeScript](typecheck.txt) |
| `node --test tests/website-pages.mjs tests/conversion-references.mjs tests/scroll-story.mjs tests/premium-service.mjs` | 17 reported tests passed, zero failures | [Full output](tests.txt) |
| `node scripts/capture-service-grid.cjs` | Both renderers on desktop/mobile pass | [Browser assertions](browser.txt) |

The #005 API regression covers all eight offerings, custom stable slugs, selected order, removed services, disabled/missing detail records, preview links and access, frozen publication during draft edits, and revised routes after explicit publication. Existing suites cover selection persistence, detail media/access, conversion inquiries and original trade-film behavior.

Browser checks count eight tiles/links, click through to Roof repair, verify its inquiry service is prefilled, check reduced-motion content, assert no horizontal document overflow, and collect page errors (none). Data is fictional and local; no customer inquiry is sent.

## Reproduce

1. Run `node build.mjs`, then `node scripts/preview-service-grid.mjs` (port 8098, in-memory database/bucket).
2. Open `http://127.0.0.1:8098/s/grid-roof-repair#services` and `http://127.0.0.1:8098/s/grid-standard#services`.
3. Run `node scripts/capture-service-grid.cjs`. It uses Playwright; optionally set `PLAYWRIGHT_MODULE` to the installed package path and `CHROME_PATH` to the local Chrome executable.

Scope is #005 only. Existing grid styling and detail presentation are retained. Full pack H, standalone service overview/editor work and later trade rollout remain open. No push or deployment.
