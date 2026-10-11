# #028F round 8u — Suite-102 after freeing RAM

State: Stopped — roofing-acceptance Expertise alignment assertion. No product/harness/runner/guard changes; round8t harness retained. No commit, staging, push, deploy, credits or provider calls.

## Pre-flight

Free physical memory: 35.754 GB (14 GB required). [Inventory](round8u-preflight-system.json). No leftover test node/browser processes; Joe Chrome, Vite, preview proxy and Codex runtimes untouched. All 479 recorded source hashes match round8t. [Pre-run hashes](round8u-pre-run.json).

## Suite-102

95 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 6 incomplete. Stopped. Runner exit: 1. Unchanged runner/concurrency, 8 GB memory guard and existing hang guard. No retry. [Suite log](round8u-suite102.log), [stderr](round8u-suite102-error.log).

Runner error: {"exit":1,"message":"See suite stderr","log":"C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8u-suite102-error.log"}. Failures: [{"label":"roofing-acceptance","kind":"browser","command":"node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs","status":1,"outcome":"FAILED","signal":null,"ms":266226,"log":"C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8u-roofing-acceptance.log","firstErrorLines":["AssertionError [ERR_ASSERTION]: Expertise alignment ambient-baseline-roofing null","    at check (file:///C:/Users/joe/website_creator/tests/roofing-acceptance.mjs:12:36)","    at file:///C:/Users/joe/website_creator/tests/roofing-acceptance.mjs:111:682 {","  generatedMessage: false,","  code: 'ERR_ASSERTION',","  actual: null,","  expected: true,","  operator: '==',","  diff: 'simple'","}",""]}].

## Memory and catalog

[Memory before/during/after](round8u-memory-samples.json). Catalog: {"before":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","atRunnerExit":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","after":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","matches":true,"runnerRestored":true,"supervisorRestored":[]}. Exact temporary write/restore permitted; backup: round8u-before/public/planning-films.json.

## Samples and preservation

{"state":"Not run","historical":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false}. Historical totals are not a fresh QA result. All 70 original Borderlines remain open with no acceptance, waiver or reclassification; qaGateClear=false. Fresh QA runs only if the suite completes green, with evidence destinations isolated from the original Sample packets.

Source changes: []. Lock changes: []. [Machine results](round8u-results.json).

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8u-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.

## Final stop summary

Launch free RAM: 35.941 GB; minimum during the run: 29.786 GB; after stopping: 34.399 GB. The memory guard did not trip.

Suite: 95 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 6 incomplete. First failure: `node tests/roofing-acceptance.mjs`, `AssertionError: Expertise alignment ambient-baseline-roofing null` at line 111. That assertion requires `.site-expertise > summary`; no matching summary was returned. [Preserved failure log](round8u-roofing-acceptance.log).

The supervisor stopped the suite process tree on that failure. No retry, baseline update, product/harness/runner edit, fresh Samples QA run, staging or commit. All 479 source hashes and 12 hard locks unchanged. Planning-films pre/post SHA-256 matches exactly. Original Sample preservation: 29,039 files byte-identical. All 70 original Borderlines remain open; qaGateClear=false. [Process cleanup](round8u-processes-after.json).
