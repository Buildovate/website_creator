# #028F round 8w — planning-scroll CLS

Diagnosis only: evidence write moved before the unchanged 0.01 assertion. No product edit yet.

Phone CLS: 0. Story source present: false.

| Entry | Value | Element outerHTML | Previous rect | Current rect | inStory |
|---|---|---|---|---|---|


## Stop and scope

The single authorized diagnostic run passed 155 checks and 60 screenshots (exit 0). Desktop CLS=0 and phone CLS=0; both fresh detail arrays are empty. There are no entries to list and no inStory sources. The prior 0.024368549324929635 phone shift was not reproduced.

The suspected header fallback is not proven: websiteHeader emits a parser-blocking site-navigation-init.js before the header; that script adds site-nav-js. No product edit, generated critical CSS rebuild, baseline update, verification standalone or Suite-102 run was made. Further diagnosis needs a bounded follow-up beyond the one specified diagnostic run.

Only test-order change: the existing cls/details JSON write now precedes the unchanged 0.01 assertion. The no-story-shift assertion is unchanged. The 8t capture harness and 8v acceptance retarget are preserved. Before image: [phone header](round8w-header-before-phone.png); no after image because no product fix was applied.

Catalog pre/post diagnosis hash matches: true. Source changes: [{"path":"tests/planning-scroll-browser.mjs","sha256":"c33bda3fc1523c9be2b2bf6829c123720570283f1a8751540acf7205ac03cab1","after":"1e1a6cf0074e824f4cb09a4c101984c03a3bf3e8784378ee88b41aade14110cf"}]. Hard locks changed: []. No commit/staging/push/deploy, provider calls or credits. All 70 Borderlines remain open; qaGateClear=false.

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8w-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.
