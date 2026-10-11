# #004W-v2 — Service content and page composition

## Result

The service content library has **132 complete briefs across 16 trades**: 116 for the 14 live trade families, plus eight each for queued Concrete and Pools. Roofing has 12 entries so every Robles Roofing service, including its four custom names, has curated copy. Each brief supplies a unique card blurb, four-to-six-word hero, three scope details, three homeowner symptoms, four service-specific steps, and three FAQs. The library rejects repeated copy when regenerated. [Runtime data](../../../public/service-content.json), [curated source](../../../scripts/service-content-source.mjs), [matching product document](../../product/SERVICE-CONTENT.md).

Homepage cards use those blurbs. Service pages incorporate the contractor's city and area in the hero and one FAQ. The new layout alternates a service image, editorial copy, symptoms, and process; its stable site seed selects one of three compositions. Expertise now uses the same desktop letter case as adjacent navigation items. The public Our Work block appears only for matching, published, photo-backed projects; QA examples and other sample/demo projects are excluded.

## Before and after

The first page and homepage baselines were copied from [#004W evidence](../004W/README.md). The second baseline pages were captured with the exact renderer and CSS from commit `555f75f` using [capture-before.mjs](capture-before.mjs). Final screenshots and browser assertions come from [capture.mjs](capture.mjs). All captures are 1440×900 desktop or 390×844 phone.

| Trade / viewport | Homepage cards | First full page | Second full page | Open Expertise menu |
| --- | --- | --- | --- | --- |
| Roofing / desktop | [Before](before-roofing-desktop-cards.png) · [After](after-roofing-desktop-cards.png) | Roof repair [before](before-roofing-desktop-roof-repair.png) · [after](after-roofing-desktop-roof-repair.png) | Storm damage [before](before-roofing-desktop-storm-damage.png) · [after](after-roofing-desktop-storm-damage.png) | [After](after-roofing-desktop-dropdown.png) |
| Roofing / phone | [Before](before-roofing-phone-cards.png) · [After](after-roofing-phone-cards.png) | Roof repair [before](before-roofing-phone-roof-repair.png) · [after](after-roofing-phone-roof-repair.png) | Storm damage [before](before-roofing-phone-storm-damage.png) · [after](after-roofing-phone-storm-damage.png) | [After](after-roofing-phone-dropdown.png) |
| HVAC / desktop | [Before](before-hvac-desktop-cards.png) · [After](after-hvac-desktop-cards.png) | AC installation [before](before-hvac-desktop-air-conditioning-installation.png) · [after](after-hvac-desktop-air-conditioning-installation.png) | Ductwork [before](before-hvac-desktop-ductwork.png) · [after](after-hvac-desktop-ductwork.png) | [After](after-hvac-desktop-dropdown.png) |
| HVAC / phone | [Before](before-hvac-phone-cards.png) · [After](after-hvac-phone-cards.png) | AC installation [before](before-hvac-phone-air-conditioning-installation.png) · [after](after-hvac-phone-air-conditioning-installation.png) | Ductwork [before](before-hvac-phone-ductwork.png) · [after](after-hvac-phone-ductwork.png) | [After](after-hvac-phone-dropdown.png) |
| Patios / desktop | [Before](before-patios-desktop-cards.png) · [After](after-patios-desktop-cards.png) | Patio covers [before](before-patios-desktop-patio-covers.png) · [after](after-patios-desktop-patio-covers.png) | Motorized pergolas [before](before-patios-desktop-motorized-pergolas.png) · [after](after-patios-desktop-motorized-pergolas.png) | [After](after-patios-desktop-dropdown.png) |
| Patios / phone | [Before](before-patios-phone-cards.png) · [After](after-patios-phone-cards.png) | Patio covers [before](before-patios-phone-patio-covers.png) · [after](after-patios-phone-patio-covers.png) | Motorized pergolas [before](before-patios-phone-motorized-pergolas.png) · [after](after-patios-phone-motorized-pergolas.png) | [After](after-patios-phone-dropdown.png) |

## Verification

- [Full regression results](regressions/results.json): **53/53 commands passed**, including build, typecheck, the new exact-copy uniqueness test, and the #015A platform browser checks. [Individual logs](regressions/).
- [Platform mobile audit](platform-mobile-audit.json): **101 phone + 101 desktop states**, zero layout failures and zero browser errors.
- [Trade browser results](browser-results.json): all service-card destinations returned 200; two full service pages per trade at each viewport had unique signs, steps, and FAQ questions; one H1, Service and LocalBusiness data, three service-art placements, no blank project cards, no horizontal overflow, and zero page errors.
- The separate physical iPhone/Safari camera check remains pending under #015A.

Preview was restarted from `C:\Users\joe\website_creator` with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. Both `/s/robles-roofing` and `/s/robles-roofing/services/roof-repair` returned HTTP 200.

Local commit only; no push or deployment.
