# #028F round 8t — review-capture hangs

State: Stopped — runner memory blocker. No commit, staging, push, deploy, provider calls or credits.

## Diagnosis

Diagnosis runs use the unchanged hang guard and capture settings, with only permitted width/frame heartbeats added before the runs. All output is timestamped. CPU samples are taken every 15 seconds. The first CPU script-file probe was blocked by Windows execution policy; a separate inline read-only probe collected CPU during that same run without restarting the test. No execution policy was changed.

### service-pages-all-trades

No hang reproduced standalone with heartbeat-only instrumentation; capture progress and command completion recorded. Verdict: Not reproduced; A/B of earlier parallel run remains unproven. Outcome: PASS. Duration: 541159 ms. Last stdout: {"timestamp":"2026-10-07T01:26:59.401Z","elapsedMs":541083,"type":"stdout","line":"ℹ duration_ms 539232.9346"}. At kill: null. [Timestamped log](round8t-diagnose-service-pages-all-trades.log).

### financing-comparison

No hang reproduced standalone with heartbeat-only instrumentation; capture progress and command completion recorded. Verdict: Not reproduced; A/B of earlier parallel run remains unproven. Outcome: PASS. Duration: 174209 ms. Last stdout: {"timestamp":"2026-10-07T01:30:14.504Z","elapsedMs":174146,"type":"stdout","line":"PASS #004D browser/API: live slider/input/down changes, reduced motion, invalid-input clearing, selected-plan prefill, updated estimates, same inquiry persistence, reset and preview-send suppression."}. At kill: null. [Timestamped log](round8t-diagnose-financing-comparison.log).

### ebook

No hang reproduced standalone with heartbeat-only instrumentation; capture progress and command completion recorded. Verdict: Not reproduced; A/B of earlier parallel run remains unproven. Outcome: PASS. Duration: 327059 ms. Last stdout: {"timestamp":"2026-10-07T01:35:53.468Z","elapsedMs":326988,"type":"stdout","line":"PASS #022 62 checks"}. At kill: null. [Timestamped log](round8t-diagnose-ebook.log).


## Harness fix

{
  "path": "src/aws/review-capture.js",
  "before": "9fbb82f4e974781a3d324a50c191ddcdddc129bfeb8955b0e84bd56fa786ce48",
  "after": "4772dfc632918671bdcb078b5abdb4825323f416b70cf44db60ec075511e6f38",
  "changes": [
    "Width heartbeat after each screenshot and page QA (including the legal-policy width check).",
    "Frame heartbeat before each existing seek/readiness/screenshot.",
    "All four goto call sites explicitly time out after 120000 ms; waitUntil unchanged.",
    "Existing video-ready failures and outer capture/seek errors log their stack before existing handling/propagation."
  ],
  "navigationWaits": "networkidle retained; existing frame-document domcontentloaded retained",
  "videoReadyTimeoutMs": 30000,
  "seekTimeoutMs": 15000,
  "readinessUnchanged": true,
  "detectorUnchanged": true,
  "guardUnchanged": true,
  "diagnosisConclusion": "All three complete standalone; earlier parallel silence hangs do not reproduce. A versus B remains unproven; no networkidle fallback is justified.",
  "diagnoses": [
    {
      "label": "service-pages-all-trades",
      "outcome": "PASS",
      "elapsedMs": 541159,
      "killed": false,
      "AorB": "Not reproduced; A/B of earlier parallel run remains unproven"
    },
    {
      "label": "financing-comparison",
      "outcome": "PASS",
      "elapsedMs": 174209,
      "killed": false,
      "AorB": "Not reproduced; A/B of earlier parallel run remains unproven"
    },
    {
      "label": "ebook",
      "outcome": "PASS",
      "elapsedMs": 327059,
      "killed": false,
      "AorB": "Not reproduced; A/B of earlier parallel run remains unproven"
    }
  ],
  "locks": [
    {
      "path": "public/planning-films.json",
      "sha256": "b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145",
      "after": "b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145",
      "unchanged": true
    },
    {
      "path": "tests/roofing-polish-part1.mjs",
      "sha256": "9907b06e67eb93dd3d4ba4928b4abf165cb2f5cbbdb2314c26010d60d7cb119f",
      "after": "9907b06e67eb93dd3d4ba4928b4abf165cb2f5cbbdb2314c26010d60d7cb119f",
      "unchanged": true
    },
    {
      "path": "docs/build-evidence/028F/tools/parallel-suite.mjs",
      "sha256": "13c0e65e3345fc966389cc690c58e4c6c08555b1dbb2c2ffb13ce46df54f300a",
      "after": "13c0e65e3345fc966389cc690c58e4c6c08555b1dbb2c2ffb13ce46df54f300a",
      "unchanged": true
    },
    {
      "path": "docs/build-evidence/028F/tools/child-hang-guard.mjs",
      "sha256": "3e4b876bdeddb002c5b79fbf1178a9e50194f9b8f3a7e3e8f63fc5d160b95cc0",
      "after": "3e4b876bdeddb002c5b79fbf1178a9e50194f9b8f3a7e3e8f63fc5d160b95cc0",
      "unchanged": true
    },
    {
      "path": "src/aws/review-capture-readiness.js",
      "sha256": "66ab75100a164e7b3e00f730233a2e1a42a3fbb87cc831e173a11c12ef5c7812",
      "after": "66ab75100a164e7b3e00f730233a2e1a42a3fbb87cc831e173a11c12ef5c7812",
      "unchanged": true
    },
    {
      "path": "src/aws/qa-browser.js",
      "sha256": "cc1029c2c26d6622c66ac3e10aad9bae435631c2b108b399f279a637d886ff24",
      "after": "cc1029c2c26d6622c66ac3e10aad9bae435631c2b108b399f279a637d886ff24",
      "unchanged": true
    },
    {
      "path": "src/aws/qa-capture.js",
      "sha256": "ef819d7a48fa13ae7d701794b1968ede289adf91b39dd60a30956a69f8715e13",
      "after": "ef819d7a48fa13ae7d701794b1968ede289adf91b39dd60a30956a69f8715e13",
      "unchanged": true
    },
    {
      "path": "tests/part2-html-normalize.mjs",
      "sha256": "f8508e77b7ffdb46ec6629f864c411f3827c980a3eafa03b161d0b983e7c1766",
      "after": "f8508e77b7ffdb46ec6629f864c411f3827c980a3eafa03b161d0b983e7c1766",
      "unchanged": true
    },
    {
      "path": "tests/review-part1-html-normalize.mjs",
      "sha256": "afe709f748541e109eba81226f8f025d81bc5623e921fdeb764f1a82d6f6b2a7",
      "after": "afe709f748541e109eba81226f8f025d81bc5623e921fdeb764f1a82d6f6b2a7",
      "unchanged": true
    },
    {
      "path": "BUILD-BACKLOG.md",
      "sha256": "fa9aa8b6fcac705214c17c6d875b30af7324544bcc68699779cd2160b8679876",
      "after": "fa9aa8b6fcac705214c17c6d875b30af7324544bcc68699779cd2160b8679876",
      "unchanged": true
    },
    {
      "path": "BUILD-STATUS.md",
      "sha256": "6f1b9bcc2d8f53bb1e18dfb1c8575d56cd8b098010ff9384bccc2244c6591cc8",
      "after": "6f1b9bcc2d8f53bb1e18dfb1c8575d56cd8b098010ff9384bccc2244c6591cc8",
      "unchanged": true
    }
  ],
  "diff": "round8t-harness-diff.txt"
}


## Verification

service-pages-all-trades: PASS; [log](round8t-verify-service-pages-all-trades.log).

financing-comparison: PASS; [log](round8t-verify-financing-comparison.log).

ebook: PASS; [log](round8t-verify-ebook.log).

## Suite-102

6 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 96 incomplete. Stopped. [Suite log](round8t-suite102.log), [stderr](round8t-suite102-error.log). Runner and guard unchanged.

## Preservation

Planning-films: {"before":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","atRunnerExit":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","after":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","matches":true,"runnerRestored":true,"supervisorRestored":[]}. All 70 original Borderlines remain open; no decision, waiver or reclassification. qaGateClear=false. Original Sample packets/capture-readiness are not regenerated. Fresh Samples: {"state":"Not run","historical":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false}.

Source changes: [{"path":"src/aws/review-capture.js","sha256":"9fbb82f4e974781a3d324a50c191ddcdddc129bfeb8955b0e84bd56fa786ce48"}]. [Machine results](round8t-results.json).

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8t-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.

## Exact stop

Suite runner exited 1 at tools/parallel-suite.mjs:6 before launching its next command: **Error: Memory blocker: 7.95 GB free; stop without workaround**. [Exact stack](round8t-suite102-error.log). This is a runner blocker, not a passed suite or a failed assertion row. Completed rows: 6 PASS / 0 PASS-WITH-WARNING / 0 FAILED; 96 incomplete. Service-pages and ebook were incomplete when the runner exited; financing-comparison passed in the parallel suite. No suite retry. No runner, former-hang test node process or killable child of runner PID14644 remained at the cleanup checks. [Stop audit](round8t-runner-stop.json).

Capture logs preserved: [round8t-suite-service-pages-all-trades.log](round8t-suite-service-pages-all-trades.log), [round8t-suite-financing-comparison.log](round8t-suite-financing-comparison.log), [round8t-suite-ebook.log](round8t-suite-ebook.log).

All three post-fix standalones passed: service-pages 3/3 tests, financing 3/3 groups, ebook 62/62 checks, all exit 0 and no warning. Diagnosis A/B remains unproven because each standalone diagnosis completed normally. No networkidle fallback was made.

Planning-films pre/post SHA matches: b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145. Fresh Samples QA not run; original historical totals remain 3,425 Pass / 70 Borderline / 0 Fail. All70 remain open; qaGateClear=false. No commit, staging, push, deploy, credits or provider calls. Only source edit this round: src/aws/review-capture.js (harness). No baseline update.
