# #170A — Trade-correct visuals and homepage cleanup

Completed locally on 2026-09-26. Base: ac3507115da0218da227cd277bcc73ae1643b880; branch: feature/local-environment-setup. #170A was free; no alternate suffix was needed.

## Fixes and causes

1. **Service artwork:** the old `serviceDiagram` always started with a roof/house mesh, then added a trade accessory. The package cards always used the same skewed material stack. Both mechanisms are replaced with photography selected by exact trade AND service. Diagnostic, scope, package, comparison and FAQ slots now show the appropriate work. Unlisted services omit the image instead of borrowing another trade’s asset. Existing trade-correct Windows/Doors and Solar SVG heroes remain, but photo slots accept only raster photography. The two-view Sample comparison is labeled as scope/work detail, not fabricated project proof.
2. **Homepage duplication:** `showcasePage` rendered the review section, then `decorateWorkspace` appended it again. The public-response decorator now detects the existing region. The repeated CTA band and second craft inquiry were also removed; the craft grid fills the released column. No dashboard or platform workflow changed—the guard in `src/workspace.js` affects only public HTML composition.
3. **Truthful previews:** the former sample review cards and optional chapter-mode filmstrip contained fictional names, quotes and ratings. They now present clearly marked Sample feedback topics with no invented endorsement. Published empty feedback stays hidden.
4. **Project Map:** previously the server emitted an empty green container and relied on lazy JavaScript plus external tiles. The new baseline includes readable, keyboard-linked pins before either dependency loads. Sample pins use the contractor’s configured service cities. Filters update the visible pins. Published pages omit the entire map unless real non-sample projects have numeric locations. Real project maps retain their static baseline if tiles fail.
5. **City pages:** reduced hero/section spacing, moved local FAQs beside the service photo and made the Sample project panel span the available width. The neighborhood banner now uses an offered-service photograph instead of the generic map drawing. Oxnard evidence is the Locksmith city page; the shared changes apply to all trades and city routes.

## Coverage

| Trade | Services audited |
|---|---:|
| Roofing | 12 |
| Patios | 8 |
| Plumbing | 8 |
| HVAC | 8 |
| Electrical | 8 |
| Landscaping | 8 |
| General Contractors | 8 |
| Flooring | 8 |
| Painting | 8 |
| Fencing | 8 |
| Garage Doors | 8 |
| Pest Control | 8 |
| Windows/Doors | 8 |
| Solar | 8 |
| Concrete | 8 |
| Pools | 8 |
| Locksmith | 8 |

All 280 service renders (preview + published) passed artwork ownership checks. All 68 homepage variants passed duplicate-region/heading checks: three layouts per trade plus the optional chapter mode. The test deliberately injects a wrong trade tag and another trade’s image to prove both are rejected. Unknown-service artwork and invalid/missing/sample project coordinates are covered.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Pass / pass |
| Regression scripts | 53 passed, including 6 new visual-correctness tests |
| New browser checks | 173 passed; 17 captures; 0 browser errors |
| Platform mobile suite | 202 screen states; no overflow, target or input failures |
| Existing browser suites | Contacts, callback, contact linkage, platform cleanup and #170 passed; #170 258 checks |
| Local template media audit | 1326 renders, 0 errors, 609 assets, 0 missing |
| Restarted Vite | 51/51 private preview home/service/city URLs returned 200 and noindex |

Logs and machine-readable summaries are in this folder: checks.json, visual-audit.json, browser-results.json, platform-mobile-audit.json, media-audit/summary.json and vite-checks.json. Legacy expectations for a generic AR house, duplicate craft form and empty published map were updated to assert the requested replacements, while their existing privacy, pricing, owned-media and route checks remain.

## Higgsfield

**0 credits used.** Balance checked before: **2513.8**; checked after: **2513.8**. **0 new images; 0 videos.** Existing Higgsfield photographs from #004W-v4 and #170 cover every required replacement. No generation request was submitted; no missing stills remain for this pass. See credits.json.

## Final screenshots

Full-page PNGs: desktop **1440×900**, phone **390×844**. Main captures use reduced motion; three extra captures disable JavaScript entirely. Browser checks cover decoded images, no horizontal overflow, package and FAQ photographs, exact trade tags, keyboard scope disclosures, map-pin navigation and city filtering.

- [locksmith-service-desktop.png](locksmith-service-desktop.png)
- [pools-service-desktop.png](pools-service-desktop.png)
- [concrete-service-desktop.png](concrete-service-desktop.png)
- [hvac-service-desktop.png](hvac-service-desktop.png)
- [locksmith-home-desktop.png](locksmith-home-desktop.png)
- [pools-home-desktop.png](pools-home-desktop.png)
- [locksmith-oxnard-desktop.png](locksmith-oxnard-desktop.png)
- [locksmith-service-phone.png](locksmith-service-phone.png)
- [pools-service-phone.png](pools-service-phone.png)
- [concrete-service-phone.png](concrete-service-phone.png)
- [hvac-service-phone.png](hvac-service-phone.png)
- [locksmith-home-phone.png](locksmith-home-phone.png)
- [pools-home-phone.png](pools-home-phone.png)
- [locksmith-oxnard-phone.png](locksmith-oxnard-phone.png)
- [locksmith-home-no-js-phone.png](locksmith-home-no-js-phone.png)
- [pools-home-no-js-phone.png](pools-home-no-js-phone.png)
- [locksmith-service-no-js-phone.png](locksmith-service-no-js-phone.png)

## Preservation and limits

- 771 existing evidence files were backed up and restored, including all #170 captures regenerated by its browser suite. SHA-256 matches all 262 pre-existing changed/untracked files. See preservation.json.
- Drone assets and drone controllers are unchanged. No contractor/admin screen, authentication flow or platform data endpoint was changed. No push, deploy, staging access or public publishing occurred. Vite fixtures are private local samples.
- Sample map centers reuse the existing Oxnard/Ventura/Camarillo demo coordinates. Other configured cities remain visible in a clearly labeled **schematic service-area guide**; geographic coordinates are not invented and no new geocoding service is claimed. Real project maps use the project’s supplied coordinates.
- Screenshots are Chromium emulation, not a physical-phone certification. New photography was unnecessary. No implementation blocker remains for this fix pass. #015G remains queued and was not started.
