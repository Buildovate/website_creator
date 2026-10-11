# #028F round 8p — poster source locks

## Approved changes

- src/promotions-scroll.js: snapshot docs/build-evidence/028F/source-locks/promotions-scroll.js; exact SHA-256 9b460b8d8c348287addf094fc297448e5698b87a8257dd77d2dd5d96dceea43e; poster-only proof [round8p-source-lock-promotions-scroll.js.txt](round8p-source-lock-promotions-scroll.js.txt).
- src/promotions-ambient.js: snapshot docs/build-evidence/028F/source-locks/promotions-ambient.js; exact SHA-256 43c2fe8d4d1a4e3febe3f4ebdf4b6bf9ba977560cd7cc79ac9aff4cde5e099f4; poster-only proof [round8p-source-lock-promotions-ambient.js.txt](round8p-source-lock-promotions-ambient.js.txt).

Snapshots equal the current source byte-for-byte. No application source changed. Eleven protected sources remain unchanged, and the existing planning-ambient snapshot is unchanged. Removing only the two new lookup branches reproduces the pre-round test: true. The comparison assertion, all other git-show lookups, normalization, detector, thresholds and sampling remain unchanged.

## Standalone results

- **PASS**: PASS 7633 Part 2 regression assertions; 374 response contracts; 2987 installed photo instances — [roofing-polish-part2](round8p-roofing-polish-part2.log).
- **PASS**: PASS header logo: 340 rendered headers, 6 edge cases — [header-logo](round8p-header-logo.log).
- **PASS**: PASS header nav fit: 1137 checks; 5 evidence widths; 136 trade/Look states; keyboard and resize — [header-nav-fit](round8p-header-nav-fit.log).

## Full Suite-102

State: Stopped. PASS 4; PASS-WITH-WARNING 0; FAILED 1; incomplete 97. Existing runner and hang guard are unchanged. The stop supervisor ends its process tree on the first FAILED row, with no retry. [Suite log](round8p-suite102.log), [totals](round8p-suite102-totals.json), [results](round8p-results.json).

### Stop: service-pages-all-trades

Command: node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs

[Failure log](service-pages-all-trades.log)

```
test at tests\service-pages-all-trades.mjs:50:1
  AssertionError [ERR_ASSERTION]: [{"category":"layout","crop":"qa-crops/page-001-768-2.png","id":"page-001-768-overlapping-text","key":"overlapping-text","measured":{"failures":[{"first":"body>header:nth-child(3)>a:nth-child(1)>span:nth-child(2)","intersectionPx":[30.09,10],"second":"body>header:nth-child(3)>nav:nth-child(2)>a:nth-child(1)"}],"violations":1},"page":"/s/all-service-roofing","result":"Fail","selector":"body>header:nth-child(3)>a:nth-child(1)>span:nth-child(2)","threshold":{"geometry":"Painted glyph extents from DOM Range and Canvas font metrics","maximumPx":2,"minimumLineFraction":0.3},"title":"Overlapping text","width":768}]
      at realReviewPrerequisite (file:///C:/Users/joe/website_creator/tests/helpers/review-approval-fixture.mjs:27:9)
      at async worker.fetch (file:///C:/Users/joe/website_creator/tests/helpers/review-approval-fixture.mjs:51:2)
      at async json (file:///C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs:12:60)
      at async TestContext.<anonymous> (file:///C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs:55:3)
      at async Test.run (node:internal/test_runner/test:1389:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:960:7) {
    actual: 1,
    expected: 0,
```

## Samples

{
  "state": "Not run",
  "prior": {
    "pass": 3425,
    "borderline": 70,
    "fail": 0
  },
  "qaGateClear": false,
  "all70Open": true,
  "decisionsRecorded": 0
}

All original 70 Borderlines remain open, with no Accept/waiver/reclassification recorded and qaGateClear=false. Any prior totals are historical, not a new snapshot result.

## Preservation

Suite-regenerated files were backed up to round8p-before before running. The original temporary catalog and Part1 FFmpeg-path input are restored byte-identically: true. Detector, normalization, suite runner, hang guard, backlog and status hashes are recorded in round8p-results.json. No commit, staging, push, deployment, provider calls, credits or new dependencies.
