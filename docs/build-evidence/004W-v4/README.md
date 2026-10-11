# #004W-v4 — service and core showpiece pass

Local implementation after **437f77c**, on **feature/local-environment-setup**. No push or deployment.

## What changed

- One shared service renderer now handles new and legacy authored Roofing pages. Authored headings, introductions, scopes, steps, FAQs, selected owned media, confirmed trust and configured financing/promotion behavior survive the migration.
- **285 Higgsfield images generated; 284 accepted images installed**: 20 missing heroes, 56 priority Roofing/HVAC/Plumbing section photographs, then 208 section photographs for the other listed trades. All **132 services** now have a distinct hero plus distinct scope/process imagery; no hero is shared across services. Generated WebP assets total **68,853,972 bytes**. They are representative service imagery, never asserted to be customer project proof. The reviewed [image contact sheets](image-contact-sheet-0.png), [provenance](image-provenance.json), and [media inventory](../../product/MEDIA-NEEDED.md) cover the complete set.
- Higgsfield Ultra had **3,149.8 credits** at the initial check. Model: **nano_banana_2**, 2K, 3:2, one image per prompt. Quoted cost: **2 credits/image**, **570 credits total** (including one corrected replacement; final balance **2,579.8**). Provider completion is recorded in [image-jobs.json](image-jobs.json); one privacy-fencing result was rejected for depicting the sport and replaced with a wood-fence installation photograph ([replacement record](image-replacement.json)). No video was regenerated.
- Flat path diagrams are replaced with colored, shaded assemblies and real photographs. Roofing, HVAC and Plumbing use anchored labels, X-ray/system layers, wireframes, measurement guides and a scan revealing the new roof/pipe/duct system. Movement reverses with scroll, can be paused, and is absent under reduced motion or no JavaScript. Adjacent sections stay static. House dimensions are not invented measurements.
- Rewrote FAQ prose across 132 service briefs and replaced the robotic section headings. Service content is keyed to the service; the source builder preserves the reviewed FAQ copy. City pages for Oxnard, Ventura, Camarillo, Thousand Oaks, Santa Paula, Simi Valley and Moorpark have distinct local context and four distinct FAQs each. Unknown cities retain an address-specific intake fallback rather than invented local facts.
- Financing uses the shared DM body/Barlow heading fonts, neutral paper/ink palette and site components; clean-style headings use DM consistently with other clean core pages. Preview shows **Sample: $20.27/month per $1,000 financed, 7.99% APR, 60 months**. This is a unit loan calculation, not a fictional service price or lender offer. Service prices only appear from approved price-book entries; legacy financing defaults no longer imply a project cost. Empty lender sections and unsupplied published financing pages stay hidden. Configured offer terms and legal disclosures are available on /legal.
- Private full previews are noindex, disable submission, label sample visuals, show a sample assembly comparison and planning/review-format cards without fabricated reviews or ratings. Published pages omit absent comparisons and sample panels. “Get my price” opens a service-preselected estimator entry with a three-step progress display and a scope-review next step; the actual Virtual Estimator remains #029V.
- Public site homepage/drone assets and their controller were not changed. Existing platform code was not changed.

## Final screenshots

One full-page PNG per real capture, at the viewport listed. These are the final layout, with fonts and images decoded before capture.

| Page | Desktop | Phone |
| --- | --- | --- |
| roof-repair | [1440×900](roof-repair-desktop.png) | [390×844](roof-repair-phone.png) |
| roof-replacement | [1440×900](roof-replacement-desktop.png) | [390×844](roof-replacement-phone.png) |
| hvac-installation | [1440×900](hvac-installation-desktop.png) | [390×844](hvac-installation-phone.png) |
| plumbing-leak | [1440×900](plumbing-leak-desktop.png) | [390×844](plumbing-leak-phone.png) |
| services | [1440×900](services-desktop.png) | [390×844](services-phone.png) |
| oxnard | [1440×900](oxnard-desktop.png) | [390×844](oxnard-phone.png) |
| about | [1440×900](about-desktop.png) | [390×844](about-phone.png) |
| financing | [1440×900](financing-desktop.png) | [390×844](financing-phone.png) |
| ventura | [1440×900](ventura-desktop.png) | [390×844](ventura-phone.png) |
| legacy-roofing | [1440×900](legacy-roofing-desktop.png) | [390×844](legacy-roofing-phone.png) |

Additional evidence: [full preview](roof-repair-full-preview-phone.png), [Roofing AR](roof-repair-ar-phone.png), [HVAC AR](hvac-installation-ar-phone.png), [Plumbing AR](plumbing-leak-ar-phone.png), [no-JS service](roof-repair-no-js-phone.png), [reduced-motion service](roof-repair-reduced-motion-phone.png), [no-JS financing](financing-no-js-phone.png), [reduced-motion financing](financing-reduced-motion-phone.png). All ten requested pages were also checked at 390px without JavaScript and under reduced motion, even where a separate PNG was not requested.

## Verification

- **53/53 commands passed**: build, TypeScript client/auth check, all 50 existing/new non-browser regression scripts and template asset integrity. [checks.json](checks.json) links by label to each command log. The six new [v4 regressions](../../../tests/showpiece-v4.mjs) cover media completeness, AR layers, legacy copy preservation, comparison/schema privacy, city sentence uniqueness and preview payment math. Obsolete visual-string assertions were updated to the new requirements; snapshot, ownership, permission, real-source, form, finance math and promotion eligibility checks remain.
- **166 browser checks passed** over the requested desktop/phone pages, including image decoding, no repeated service photos, no horizontal overflow, one H1, keyboard details, reversible AR movement, pause, estimator preselection and preview range control. Zero browser exceptions. [Results](capture-results.json), [reproducible capture harness](capture.mjs).
- **10/10 phone accessibility audits: zero WCAG 2 A/AA and 2.1 AA violations**, including color contrast. Fixed the financing step text and benefit-number contrast findings. [Axe results](accessibility-audit.json). Automated scans do not replace assistive-technology testing.
- Existing platform browser suite: **202 states (101 phone + 101 desktop)**, zero layout/browser failures; contacts, callbacks and contact-linkage browser suites also passed. [Summary](platform-browser-summary.json), [contacts](contacts-browser.log), [callbacks](callback-browser.log), [linkage](contact-linkage-browser.log).
- Existing media audit run locally: **1,092 template variants**, zero render errors, zero missing assets. [Summary](media-audit/summary.json). The copy of the audit only changes its output directory; no staging requests were made.
- Vite restarted with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. All ten requested URLs returned **200**; unsupplied published financing correctly returned **404**. [URL results](vite-checks.json). Vite fixtures are an isolated in-memory database, not a deployed site. [Fixture/verification script](verify-vite.mjs).

## Local copy sources

Municipal sources establish neighborhood and housing context. Suggestions about access, exposure, corrosion-resistant materials, runoff and system assessment are design/planning inferences, not claims about a specific property, code compliance or a completed customer job.

- Oxnard: [City historic walking tour](https://www.oxnard.gov/news/visit-downtown-oxnard-with-a-free-self-guided-historic-walking-tour), [municipal maps](https://www.oxnard.gov/community-development/maps), [Local Coastal Program](https://www.oxnard.gov/community-development/long-range-planning-sustainability/local-coastal-program). Silver Strand and Hollywood Beach are not represented as Oxnard city neighborhoods.
- Ventura: [Neighborhood Community Councils](https://www.cityofventura.ca.gov/1129/Neighborhood-Community-Councils), [planning documents](https://www.cityofventura.ca.gov/2039/Planning-Documents), [city-hosted neighborhood descriptions](https://www.cityofventura.ca.gov/DocumentCenter/View/10682/Plan-Submitter-Comments-v1?bidId=).
- Camarillo: [city housing/general-plan progress report](https://www.cityofcamarillo.org/General%20Plan%20Annual%20Progress%20Report%20Full%20Packet.pdf), [Old Town/Mission Oaks context](https://www.cityofcamarillo.org/Meeting%20Agendas-Public%20Hearings/City%20Council/2021/0%20CC%20CSD%20Goals%20Study%20Agenda%20Packet.pdf).
- Thousand Oaks: [municipal building-energy context and Newbury Park](https://toaks.gov/building-energy-ceap). Santa Paula: [general-plan documents](https://spcity.org/213/Long-Range-Planning-Special-Studies), [East Area 1 documents](https://spcity.org/325/Environmental-Impact-Report).
- Simi Valley: [Housing Element neighborhood inventory](https://www.simivalley.org/home/showpublisheddocument/26843/638223445351630000). Moorpark: [Housing Element neighborhood descriptions](https://moorparkca.gov/DocumentCenter/View/13771/Revised-2021-2029-draft-Housing-Element).
- Coastal/valley weather context: [National Weather Service Los Angeles/Oxnard discussion](https://forecast.weather.gov/product.php?format=CI&glossary=1&issuedby=LOX&product=AFD&site=NWS&version=13). Copy uses qualitative regional patterns rather than weather forecasts or unsourced numerical claims.

## Limits and working-tree preservation

No requested still-image assets remain missing. Live lender data, actual homeowner measurements, real review content and the full Virtual Estimator were not fabricated; #029V remains queued. Real iPhone camera upload remains Joe’s unrelated #015A manual check.

The existing test scripts rewrote older evidence. **199 pre-existing tracked dirty files were restored byte-for-byte from the initial backup** (hashes in [initial-worktree.json](initial-worktree.json)). Two pre-existing untracked files, `docs/build-evidence/015A/after/contacts-filters-sheet.png` and `desktop-contacts-filters-sheet.png`, were regenerated by that suite; their original bytes were not backed up. They remain untracked and are excluded from this commit. All unrelated product docs and other untracked material are excluded.

Next queued implementation remains **#015F**; no other ticket was started.
