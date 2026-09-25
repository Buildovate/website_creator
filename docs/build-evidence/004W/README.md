# #004W — Dedicated service pages, all trades

## Result

Every selected service in the current trade library gets a stable, enabled page record. Startup backfill writes missing records into existing draft and published snapshots; render-time reconciliation also covers snapshots that have not yet been migrated. The contractor questionnaire can hide a page individually. Hidden pages return 404 and are absent from homepage cards, Expertise navigation, and the site sitemap. Robles Roofing's cinematic homepage now shows all 11 selected services as individual linked cards.

New pages use service art from the trade library, service-specific copy and FAQs, optional matching published project cards, related services, and a preselected estimate form. Authored Roofing pages retain their existing premium trust and financing features. Published service pages have a city-aware title/description, one H1, canonical URL, LocalBusiness and Service JSON-LD, and indexable response headers. Draft previews remain noindex. A global sitemap index links to each published site's sitemap.

## Browser evidence

The captures use the published in-memory Robles Roofing fixture and local, fictional HVAC and Patios fixtures. They are not customer approvals. Each case was checked at 1440×900 and 390×844. All homepage card destinations returned 200. The Expertise menu worked by click/touch and Enter, and the current service was highlighted. Neither the homepage nor service page had horizontal overflow or page errors. [Machine-readable results](browser-results.json) and [capture script](capture.mjs).

| Trade | 1440×900 | 390×844 |
| --- | --- | --- |
| Roofing homepage cards | [Cards](roofing-desktop-cards.png) | [Cards](roofing-phone-cards.png) |
| Roofing Expertise open | [Home](roofing-desktop-dropdown.png) · [Current page](roofing-desktop-service-dropdown.png) | [Home](roofing-phone-dropdown.png) · [Current page](roofing-phone-service-dropdown.png) |
| Roofing roof repair page | [Full page](roofing-desktop-service.png) | [Full page](roofing-phone-service.png) |
| HVAC homepage cards | [Cards](hvac-desktop-cards.png) | [Cards](hvac-phone-cards.png) |
| HVAC Expertise open | [Home](hvac-desktop-dropdown.png) · [Current page](hvac-desktop-service-dropdown.png) | [Home](hvac-phone-dropdown.png) · [Current page](hvac-phone-service-dropdown.png) |
| HVAC air conditioning installation page | [Full page](hvac-desktop-service.png) | [Full page](hvac-phone-service.png) |
| Patios homepage cards | [Cards](patios-desktop-cards.png) | [Cards](patios-phone-cards.png) |
| Patios Expertise open | [Home](patios-desktop-dropdown.png) · [Current page](patios-desktop-service-dropdown.png) | [Home](patios-phone-dropdown.png) · [Current page](patios-phone-service-dropdown.png) |
| Patios patio covers page | [Full page](patios-desktop-service.png) | [Full page](patios-phone-service.png) |

## Verification

- [Full regression results](regressions/results.json): **52/52 commands passed**, including build, typecheck, prior premium Roofing features, the new all-trade service test, and the #015A platform mobile browser inventory. [Individual logs](regressions/).
- [#015A platform mobile audit](platform-mobile-audit.json): **101 phone + 101 desktop states**, zero layout failures and zero browser errors. The separate physical iPhone/Safari camera check remains pending under #015A.
- [Trade browser results](browser-results.json): six desktop/phone trade combinations, valid metadata and structured data, all card links live, no horizontal overflow, and zero browser page errors.
- Local Vite preview was restarted from the repo with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. Both `/s/robles-roofing` and `/s/robles-roofing/services/roof-repair` returned HTTP 200; the service response title was “Roof repair in Oxnard | Robles Roofing”.

Local commit only. No push or deployment.
