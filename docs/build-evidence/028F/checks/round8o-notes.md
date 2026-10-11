# #028F round 8o — stop at protected source

## Completed

- Applied Joe's flat-header choice: main pages plus Services; individual service links stay on Services and in the existing phone menu.
- Runtime font/resize/ResizeObserver measurement moves rightmost links into one accessible More button. No fixed desktop overflow breakpoint, no wrapping or truncation. Native phone Menu and no-JS More remain available.
- Corrected the legacy tablet nav overflow clipping only for the measured shared header.
- Recorded 1440/1280/1024/820/390 screenshots, including More open and phone Menu open. All recorded widths have zero horizontal overflow and zero page errors; Enter opens More, Escape closes and returns focus. These are visual/readiness records, not a passed regression suite.
- Added tests/header-nav-fit.mjs for the requested widths, resize, keyboard, visible/clickable overflow links and 17 trade kits × 4 actual Look styles. It was NOT RUN because Part2 stopped first.
- Scanned all 374 Part2 contracts and 1,222 older-suite response contracts using unchanged normalization and an in-memory counterfactual replacing only the approved renderer files with HEAD versions. Types: c 1,590; a+c 6; a 0; b 0; other 0. Three poster URLs served 200 image/webp.
- Updated the 374 affected raw HTML baselines and checksum entries, plus the 1,222 affected legacy checksum entries through their existing manifests. Every new HTML buffer matched the reviewed scan SHA before writes. Exact pre-update backups are in round8o-before. Per-page diffs and old/new checksums are in round8o-baseline-scan.json and round8o-baseline-diffs/.

## Exact stop

Command: node tests/roofing-polish-part2.mjs

All 374 response comparisons passed. The command then failed: **protected source exact (checkout line endings normalized) src/promotions-scroll.js** at tests/roofing-polish-part2.mjs:28:393.

The historical source lookup is git show cd31c4db0cbb51625ee36458f17e99a052bc4929:src/promotions-scroll.js. Its diff is only the existing video poster attribute; removing that exact addition reproduces the historical source: true. This source was not edited in 8o. The standing permission refreshes response baselines, not this protected source lookup. No lookup, assertion, detector, normalization, threshold, or source was changed to bypass the stop.

- Historical SHA-256: 2c237323b6573e549a1630b479e252f8b888cc9358b9cab21c3ffa2bf020bfc1
- Current SHA-256: 9b460b8d8c348287addf094fc297448e5698b87a8257dd77d2dd5d96dceea43e
- Diff: [round8o-protected-source-diff.txt](round8o-protected-source-diff.txt)
- Log: [round8o-roofing-polish-part2.log](round8o-roofing-polish-part2.log)

## Execution results

| Check | Result |
|---|---|
| Local build | PASS, 810 assets / 17 kits |
| Five-width nav visual record | Completed, 0 overflow / 0 browser errors |
| Response classification | 1,596 checked / 0 other |
| Part2 responses | 374/374 passed |
| Part2 protected source | FAILED: src/promotions-scroll.js |
| Header-logo / nav-fit regression | NOT RUN |
| Full Suite-102 | NOT RUN: 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete |
| Expanded Samples snapshot | NOT RUN |

Prior accepted Samples snapshot is 3,425 Pass / 70 Borderline / 0 Fail; **not a new 8o result**. All 70 remain open, no decisions recorded, qaGateClear=false. New sample-page findings are not assessed.

## Evidence and preservation

- Screenshots: round8o-nav/roofing-{1440,1280,1024,820,390}.png; open More: roofing-1024-more.png and roofing-820-more.png.
- [Results](round8o-results.json), [baseline scan and every update](round8o-baseline-scan.json), [nav measurements](round8o-nav/results.json), [suite not-run log](round8o-suite102.log).
- Tests, normalization, detector, planning source, preservation reference, previous full-checks.json and temporary harness inputs verified byte-identical to 8o backups. In-memory fixtures only, no stash or checkout.
- No commit, staging, push, deployment, provider calls, credits, or new dependencies. No Borderline waiver. Unrelated changes and the approved preview work remain in place.
