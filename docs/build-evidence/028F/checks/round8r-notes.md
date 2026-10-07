# #028F round 8r-retry2 — detachable fit More

State: Awaiting catalog-fixture clarification before Suite-102; all four standalones PASS. No commit/staging/push/deploy/provider calls/credits.

## Cause and changes

Unused fit More was a hidden direct flex child, producing a zero top in the unchanged all-children one-line check. Part1 still targeted legacy More details.

Detach unused fit More; reinsert before CTA for each fit measurement and retain it only for overflow. Preserve full-brand/font/resize measurement. Expose no-JS fallback as a plain link list. Retarget only part1 More checks, testing behavior at a measured overflow width without changing one-line math.

Existing body .shared-site-header>nav[data-nav-fit] flex-wrap:nowrap!important already overrides service-detail.css flex-wrap:wrap; no service-detail.css edit.

Shared CSS regenerated through normal build; generated critical source byte-identical: true.

## Screenshots and geometry

- Saved [1280 before](round8r-header/before/financing-1280-js.png), [1440 before](round8r-header/before/financing-1440-js.png), [1024 More before](round8r-header/before/financing-1024-js-more.png) retained, not recaptured.
- [1280 after](round8r-header/after/financing-1280-js.png), [1440 after](round8r-header/after/financing-1440-js.png), [1024 More after](round8r-header/after/financing-1024-js-more.png).
- [After geometry](round8r-header/after/results.json): zero direct-child top spread; More absent at1280/1440 and present at1024/900/820; zero browser errors.
- Before/after helper no-JS phase explicitly skipped by Joe; actual part1 no-JS assertion remains required.
- Earlier helper failures retained in round8r-header-before.log and round8r-header-before-retry.log; no rerun of full before helper in this attempt.

## Checks

- roofing-polish-part1-browser: PASS PASS 201 Part 1 browser checks [log](round8r-roofing-polish-part1-browser.log)
- header-nav-fit: PASS PASS header nav fit: 16422 checks; 8 evidence widths; 1632 trade/Look/name states; painted-name geometry, keyboard and resize [log](round8r-header-nav-fit.log)
- header-logo: PASS PASS header logo: 340 rendered headers, 6 edge cases [log](round8r-header-logo.log)
- roofing-polish-part2: PASS PASS 7633 Part 2 regression assertions; 374 response contracts; 2987 installed photo instances [log](round8r-roofing-polish-part2.log)

Suite-102: 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete. [Suite log](round8r-suite102.log).

Baseline scan: {"checked":1596,"counts":{"identical":1596,"a":0,"b":0,"c":0,"a+c":0,"other":0},"updated":[]}.

Samples: {"state":"Not run","historical":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false,"original70Open":true,"decisionsRecorded":0}. Historical figures are not a fresh snapshot. All70 original Borderlines remain open; no acceptance, waiver, reclassification or decision. qaGateClear stays false.

## Preservation

[Results](round8r-results.json) record protected source, detector, normalization, catalog, guard/runner and backlog/status hashes. Original Sample evidence remains protected. First failed check stops; no check or suite retry.

## Pending clarification before Suite-102

The existing runner saves the catalog, temporarily writes four promotions fixture slots, runs those commands, then restores exact bytes in finally. No run or catalog write started while this clarification is pending.

The latest user hard lock conflicts with the existing runner at parallel-suite.mjs:12-13; the runner remains unchanged and the catalog hash matches its pre-round value. The question is pending in chat. No suite or fresh Samples run has started.
