# #028F round 8v — Suite-102 after freeing RAM

State: Stopped — planning-scroll-browser phone CLS assertion. No product/harness/runner/guard changes; round8t harness retained. No commit, staging, push, deploy, credits or provider calls.

## Pre-flight

Free physical memory: 35.748 GB (14 GB required). [Inventory](round8v-preflight-system.json). No leftover test node/browser processes; Joe Chrome, Vite, preview proxy and Codex runtimes untouched. All 479 recorded source hashes match round8t. [Pre-run hashes](round8v-pre-run.json).

## Suite-102

78 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 23 incomplete. Stopped. Runner exit: 1. Unchanged runner/concurrency, 8 GB memory guard and existing hang guard. No retry. [Suite log](round8v-suite102.log), [stderr](round8v-suite102-error.log).

Runner error: {"exit":1,"message":"See suite stderr","log":"C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8v-suite102-error.log"}. Failures: [{"label":"planning-scroll-browser","kind":"browser","command":"node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs","status":1,"outcome":"FAILED","signal":null,"ms":121178,"log":"C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8v-planning-scroll-browser.log","firstErrorLines":["AssertionError [ERR_ASSERTION]: page CLS within 0.01 phone 0.024368549324929635","    at check (file:///C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs:2:301)","    at file:///C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs:21:71 {","  generatedMessage: false,","  code: 'ERR_ASSERTION',","  actual: false,","  expected: true,","  operator: '==',","  diff: 'simple'","}",""]}].

## Memory and catalog

[Memory before/during/after](round8v-memory-samples.json). Catalog: {"before":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","atRunnerExit":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","after":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","matches":true,"runnerRestored":true,"supervisorRestored":[]}. Exact temporary write/restore permitted; backup: round8v-before/public/planning-films.json.

## Samples and preservation

{"state":"Not run","historical":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false}. Historical totals are not a fresh QA result. All 70 original Borderlines remain open with no acceptance, waiver or reclassification; qaGateClear=false. Fresh QA runs only if the suite completes green, with evidence destinations isolated from the original Sample packets.

Source changes: [{"path":"tests/roofing-acceptance.mjs","sha256":"3f106115b5106bd774e565fda50b83d274b435afbea8612d78c47bdc48297389"}]. Lock changes: []. [Machine results](round8v-results.json).

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8v-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.

## Round 8v test-only change and final stop

Changed test: `tests/roofing-acceptance.mjs` only. The shared alignment helper waits for fonts, the fit-nav ready class and two animation frames, then compares two visible top-level page links (Services/Areas or Pricing preferred). Same font size, same weight and vertical center delta <=3px remain mandatory. Optional visible Expertise summaries also compare against a peer. The phone-menu screenshot path is unchanged. [Exact round diff](round8v-test-diff.txt).

Standalone acceptance: PASS, exit 0, 922 checks, 132 page states, 17 baseline headers, 0 failures. Every baseline header returned 11px/600 for both links and 0px center delta. [Standalone log](round8v-acceptance.log), [result](round8v-acceptance-result.json).

Suite-102 stopped on its first failure: 78 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 23 incomplete. Failure: `node tests/planning-scroll-browser.mjs`, phone CLS 0.024368549324929635 > the unchanged 0.01 limit, at line 21. [Preserved failure log](round8v-planning-scroll-browser.log). The supervisor stopped its process tree; no retry or additional fix. The suite's acceptance command was not reached; its standalone result above is separate from suite totals.

Planning-films pre/post hashes match; all 12 hard locks unchanged. Only the approved acceptance test differs among the 479 recorded test/source files. Original Samples: 29,039 files byte-identical. No baseline updates. No fresh Samples QA run because Suite-102 was not fully green. All original 70 Borderlines remain open; no Accept, waiver or reclassification; qaGateClear=false. No commit/staging/push/deploy/provider calls/credits. [Process cleanup](round8v-processes-after.json).
Launch RAM: 35.528 GB; minimum during suite: 29.857 GB; after stop: 31.091 GB. Memory guard did not trip.
