# #021 — Five Roofing city pages

Completed locally on 2026-09-26. Local fictional QA fixtures only; no push, deployment, staging access, vendor connection or paid generation. **Higgsfield credits used: 0.** Nothing required for this ticket remains blocked. #022 was not started.

## Reuse audit: #004X before building

| Existing implementation | Already met the ticket | Changed or added for #021 |
| --- | --- | --- |
| src/core-site-pages.js /areas and /areas/:city routes | Contractor serviceAreas determines coverage; published snapshot versus private preview, unknown-city 404, canonical, title, description, one H1 and shared business identity | Reused this renderer; added a Roofing-only editorial composition for the five cities below, unique title/description overrides and photographic selection |
| src/city-editorial.js | Reviewed geography and city FAQs; other trades already reuse it | Added five complete Roofing profiles with original headings, body, four FAQs, form labels and CTA copy; other profiles remain intact |
| Existing service registry and area navigation | Selected services resolve to service pages; nearby city links | Reused selected services only and configured nearby cities; no second route, service registry or city schema |
| src/site-polish.js footer | Five configured city names, fewer when fewer exist | Converted Roofing city names into owned-page links, preserving preview mode; removed the repeated neighborhood marketing band only on these five city pages |
| src/form-fields.js and existing public inquiry endpoint | Origin, consent, spam checks, published settings, source-page metadata and inbox persistence | Fixed the mismatch between #004X serviceAreas routes and older websitePages city records; added a city-prefilled form using the existing submit/inbox flow |
| tests/core-site-pages.mjs, tests/website-pages.mjs and tests/showpiece-v4.mjs | Existing route, snapshot, authored-page and four-FAQ contracts | All pass unchanged; new roofing-cities server/browser suites cover the new behavior |

The backlog's proposed new website-pages.js and test file already existed. They were verified and reused rather than duplicated. URLs retain /s/:slug/areas/:city-slug because that is the established #004X pattern. No business gets new service areas automatically: each page requires its city in the contractor's approved published configuration. The five-profile fixture is test data, not approval for any real business.

## Design and homeowner content

Each page has a distinct existing Roofing hero photo, a different supporting photograph, a local introduction, selected services, a designed forest-green CTA band, three planning steps, four native FAQ disclosures, a city-prefilled inquiry and links to the other configured areas. The photographic hero, split editorial body and calm static composition match the established Roofing typography and palette. There is no fake proof block or empty card.

| City | Published local URL | Original story |
| --- | --- | --- |
| Oxnard | http://127.0.0.1:5173/s/roofing-cities-021/areas/oxnard | Coastal flashing, exposed joints and older houses |
| Ventura | http://127.0.0.1:5173/s/roofing-cities-021/areas/ventura | Roofline, hillside access and drainage paths |
| Camarillo | http://127.0.0.1:5173/s/roofing-cities-021/areas/camarillo | Material choice, underlying layers and home records |
| Thousand Oaks | http://127.0.0.1:5173/s/roofing-cities-021/areas/thousand-oaks | Sun, shade, nearby trees and assessment questions |
| Santa Paula | http://127.0.0.1:5173/s/roofing-cities-021/areas/santa-paula | Older buildings, additions and roof junctions |

Every new editorial sentence and every five-word phrase window is checked across all five profiles (1773 distinct windows), including FAQs, captions, form labels and CTA text. Business identity, service names and shared navigation are intentionally reused. Manual copy review also checks shorter distinctive phrases; commonplace connective words are not treated as duplicated marketing copy. Four FAQs per city preserve the previous #004W-v4 acceptance contract; the first full run caught three and was corrected without weakening that test.

General local housing/geography and regional weather were checked against primary planning/weather documents; sources and the exact support limits are in [local-context-sources.json](local-context-sources.json). These are planning questions, not property diagnoses, measurements, permit guidance, guaranteed coverage or claims about the contractor's local work. Photos are representative installed imagery and explicitly captioned as illustration, never named customer projects. No reviews, ratings, project counts or prices are invented. One shared LocalBusiness ID remains; city pages are not branch offices.

## Current rules versus Pack N

The current reuse/zero-credit instruction overrides Pack N's new image generation and per-regeneration artwork. Installed photos supply distinct city visuals; no generation is needed. The current no-urgency rule overrides Pack N's countdown suggestion. No invented proof, promotion or payment is added to fill a layout. Existing conditional financing/promotion navigation remains owned by its existing modules; this ticket does not change #017 financing logic. The hero action, in-article CTA band and final inquiry provide the requested progression without duplicating filler banners. Existing serviceAreas records remain the source of truth; the first five approved names supply footer links. No parallel service_area_cities schema or editor was created.

Preview uses the existing authenticated noindex mode and a visible Sample label; its form cannot send inquiries. Published output removes Sample-only content. Absent services or nearby areas leave no empty section; removing a city remains private until publication, then removes its page and footer link. Other trades, homepage hero/drone assets, Expenses, #016–#020 components and existing regression files are unchanged.

## Accessibility and states

The complete article is server-rendered. No reveal animation delays text or actions; reduced motion is fully static. Native details work without JavaScript, links remain usable, and a phone alternative is available when the existing JavaScript inquiry sender cannot run. City-specific skip links, focus rings and 44px-or-larger primary controls support keyboard and touch. The core-page header already occupies normal flow; the inquiry anchor has scroll margin and cannot land beneath a sticky overlay.

Image dimensions reserve the layout while loading. Failed hero/detail images get a readable fallback without hiding the heading or next step. Partial data omits absent service/area groups. The existing form supplies validation, busy/error handling and successful navigation to the shared thank-you page; browser checks confirm city/source reach the local inbox. No new network-only reading interaction is introduced, so an already-loaded article and native disclosures remain usable offline.

## Verification

- Build and typecheck passed.
- **62 regression scripts** passed, including **402 #021 checks**, 19 resolving internal links, unique metadata/H1, approved-city publication boundaries and inquiry attribution.
- **14 browser suites** passed, including **189 #021 assertions**, five cities on both viewports, keyboard/touch, static reduced motion, no JavaScript, image-error fallback, no horizontal scroll and **0 measured CLS on all ten published page captures**.
- Platform mobile suite: **208 states**, no overflow, undersized target/input or browser-error findings. The separate earlier real-iPhone camera check remains pending for Joe; this ticket does not claim to complete it.
- Template asset integrity: **605 references / 17 kits**, passed. Existing video metadata checks use installed ffprobe; no media changed.
- Vite restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173. **11 URLs returned 200**, including all five published city pages, preview, areas, homepage, a service and the new CSS/JS. See [route-check.json](route-check.json).
- Restored **1745** older evidence files and verified **262** unrelated file hashes unchanged. Protected modules/assets checked against starting HEAD. See [preservation.json](preservation.json).
- Machine results: summary.json, checks.json, final-checks.json, existing-browser-checks.json, regression-results.json, browser-results.json, platform-mobile-audit.json and adjacent logs.

## Screenshots

All screenshots are real full-page captures with normal browser content/chrome positioning, desktop **1440×900** and phone **390×844**. The ten published files show the final four-FAQ pages. Preview files show the Sample label; additional reduced/no-JS captures demonstrate static fallbacks. Fictional business name and phone are clearly QA data.

- [camarillo-published-desktop.png](camarillo-published-desktop.png)
- [camarillo-published-phone.png](camarillo-published-phone.png)
- [oxnard-no-js-desktop.png](oxnard-no-js-desktop.png)
- [oxnard-no-js-phone.png](oxnard-no-js-phone.png)
- [oxnard-preview-desktop.png](oxnard-preview-desktop.png)
- [oxnard-preview-phone.png](oxnard-preview-phone.png)
- [oxnard-published-desktop.png](oxnard-published-desktop.png)
- [oxnard-published-phone.png](oxnard-published-phone.png)
- [oxnard-reduced-desktop.png](oxnard-reduced-desktop.png)
- [oxnard-reduced-phone.png](oxnard-reduced-phone.png)
- [santa-paula-published-desktop.png](santa-paula-published-desktop.png)
- [santa-paula-published-phone.png](santa-paula-published-phone.png)
- [thousand-oaks-published-desktop.png](thousand-oaks-published-desktop.png)
- [thousand-oaks-published-phone.png](thousand-oaks-published-phone.png)
- [ventura-published-desktop.png](ventura-published-desktop.png)
- [ventura-published-phone.png](ventura-published-phone.png)
