# #004W-v3 — visual pass and evidence

**Status: Partial.** Four Higgsfield stills were generated for Roof repair, Roof replacement, HVAC air conditioning installation and Plumbing leak detection. The shared service renderer now has distinct hero sources, service-specific diagrams and hotspots, conditional before/after comparison, scope cards, a designed price prompt and phone actions. Core pages have filled visual heroes, warmer city copy and trade treatments. Financing uses the site's green material palette. The phone menu highlights the current page, and rendered links omit the ↗ symbol.

## Captures

Chrome captures used 1440×900 desktop and 390×844 phone viewports. The local fixture supplied published pages and a private financing preview. Every route returned HTTP 200, had one H1, zero horizontal overflow and no browser page errors. [Machine results](capture-results.json).

| Page | Desktop | 390px phone |
| --- | --- | --- |
| Roof repair | [Screenshot](roof-repair-desktop.png) | [Screenshot](roof-repair-phone.png) |
| Roof replacement | [Screenshot](roof-replacement-desktop.png) | [Screenshot](roof-replacement-phone.png) |
| HVAC installation | [Screenshot](hvac-installation-desktop.png) | [Screenshot](hvac-installation-phone.png) |
| Plumbing leak detection | [Screenshot](plumbing-leak-desktop.png) | [Screenshot](plumbing-leak-phone.png) |
| Services | [Screenshot](services-desktop.png) | [Screenshot](services-phone.png) |
| Oxnard city page | [Screenshot](oxnard-desktop.png) | [Screenshot](oxnard-phone.png) |
| About | [Screenshot](about-desktop.png) | [Screenshot](about-phone.png) |
| Financing preview | [Screenshot](financing-desktop.png) | [Screenshot](financing-phone.png) |
| Thank-you | [Screenshot](thank-you-desktop.png) | [Screenshot](thank-you-phone.png) |

## Checks

- `node build.mjs` passed, including template asset integrity.
- `node tests/showpiece-media.mjs` checked 132 service briefs: 112 distinct existing hero assets and 20 explicit missing-hero requests; all 264 requested section photos are inventoried.
- Service content, all-trade routes, core routes, website pages, premium service, service playbook, trade financing, financing comparison and constitution regressions passed.
- Vite was restarted with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. The Robles homepage, Roof repair, Roof replacement and About returned HTTP 200. Published `/financing` returned 404 because this fixture has no confirmed lender; its private preview was captured.

## Remaining work

- [MEDIA-NEEDED.md](../../product/MEDIA-NEEDED.md) lists 20 unique hero stills and 264 service-section photos still needed. The diagrams are service illustrations, not replacements for commissioned photography.
- The [Virtual Estimator](../../product/VIRTUAL-ESTIMATOR.md) remains planned under #029V. “Get my price” currently opens a service-preselected discussion form, not an instant calculated quote. The thank-you “Save your quote” prompt does not yet create a secure saved quote.
- Legacy authored Roofing pages retain their separate renderer. This pass centers the shared renderer used by auto-generated service pages. Full photo coverage and the complete AR motion vocabulary remain open.
- The existing staging media audit was not run because it writes into the unrelated untracked `docs/media-audit` tree and checks a remote environment. The local build integrity check and focused service-media audit passed.

Fixture screenshots show design only, not customer project proof. No push or deployment was performed.
