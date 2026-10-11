# #028F round 8x — bounded first-paint trace

Stopped at first Suite-102 failure; no retry, no commit. No commit/staging/push/deploy/provider calls/credits.

## Diagnosis

2/5 reproduced phone CLS >0.01 (runs 1 and 5, each 0.024368549324929635). Three concurrent workers: planning-scroll plus real website-pages and hero-editor-browser commands, derived from unchanged Suite-102 runner. 600930 ms total, below the 20-minute cap; stopped immediately after the second reproduction. Background commands terminated at the diagnosis bound are incomplete, not counted as passed. Launch memory: 35.10879135131836 GB; minimum sampled free memory 30.776813507080078 GB (8 GB guard retained). [Trace summary](round8x-trace-summary.json). Five individual trace JSONs: round8x-trace-run1.json through round8x-trace-run5.json.

Cause: DM Sans font swap changes the 202px-wide phone brand from three 24.15px lines to two; header contracts 24.140625px and moves main, Menu and brand mark. Nav-mode changes later; posters ready; no story source.

Run 5: first paint 84 ms; DM loading at 85.1 ms with brand 72.421875px/header 108.421875px. DM loaded by 133ms, brand 48.28125px/header 84.28125px; recorded shift 138.5ms; Menu mode only at 145ms. Run 1 shift 88ms, same rect deltas. No source inside planning-scroll. Font readiness, visible poster readiness, nav mode and header-height variable are preserved at each shift. The trace wrapper adds observers only; no capture waits/readiness/settings, detector, thresholds or test assertions changed. Font-face/brand detail was added to the evidence observer before run 5 to distinguish font loading from nav-mode timing.

| Run | Navigation ms | Shift value | Element | Previous rect | Current rect | inStory |
|---|---|---|---|---|---|---|
| 1 | 88 | 0.024368549324929635 | <main id="main"><section class="foundation-hero"><div class="foundation-hero-copy"><p class="foundation-eyebrow"><span class="foundation-dot"></span>Roofing financing · COMPARE THE COST OVER TIME</p><h1>Plan the work.<br><em>Understand the payments.</em></h1><p>Start with a written project price. Then compare the monthly payment, interest and length of a loan before choosing how to pay.</p><div class="foundation-actions"><a class="foundation-button" href="#calculator">Explore my payment plan </a | {"x":0,"y":164.703125,"width":390,"height":679.296875,"top":164.703125,"right":390,"bottom":844,"left":0} | {"x":0,"y":140.5625,"width":390,"height":703.4375,"top":140.5625,"right":390,"bottom":844,"left":0} | false |
| 1 | 88 | 0.024368549324929635 | <details class="site-mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><details class="site-expertise"><summary>Expertise</summary><div class="site-expertise-list"><a href="/s/roofing-scroll-025/services?preview=1">All services</a><a href="/s/roofing-scroll-025/services/roof-repair?preview=1">Roof repair</a></div></details><a href="/s/roofing-scroll-025/areas?preview=1">Areas</a><a href="/s/roofing-scroll-025/pricing?preview=1">Pricing</a>< | {"x":289.859375,"y":88.484375,"width":80.640625,"height":44,"top":88.484375,"right":370.5,"bottom":132.484375,"left":289.859375} | {"x":289.859375,"y":76.421875,"width":80.640625,"height":44,"top":76.421875,"right":370.5,"bottom":120.421875,"left":289.859375} | false |
| 1 | 88 | 0.024368549324929635 | <span class="site-brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M7 23 24 9l17 14M13 21v18h22V21" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 39V28h8v11" stroke="currentColor" stroke-width="3"></path></svg></span> | {"x":19.5,"y":92.484375,"width":36,"height":36,"top":92.484375,"right":55.5,"bottom":128.484375,"left":19.5} | {"x":19.5,"y":80.421875,"width":36,"height":36,"top":80.421875,"right":55.5,"bottom":116.421875,"left":19.5} | false |
| 5 | 138.5 | 0.024368549324929635 | <main id="main"><section class="foundation-hero"><div class="foundation-hero-copy"><p class="foundation-eyebrow"><span class="foundation-dot"></span>Roofing financing · COMPARE THE COST OVER TIME</p><h1>Plan the work.<br><em>Understand the payments.</em></h1><p>Start with a written project price. Then compare the monthly payment, interest and length of a loan before choosing how to pay.</p><div class="foundation-actions"><a class="foundation-button" href="#calculator">Explore my payment plan </a | {"x":0,"y":164.703125,"width":390,"height":679.296875,"top":164.703125,"right":390,"bottom":844,"left":0} | {"x":0,"y":140.5625,"width":390,"height":703.4375,"top":140.5625,"right":390,"bottom":844,"left":0} | false |
| 5 | 138.5 | 0.024368549324929635 | <details class="site-mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><details class="site-expertise"><summary>Expertise</summary><div class="site-expertise-list"><a href="/s/roofing-scroll-025/services?preview=1">All services</a><a href="/s/roofing-scroll-025/services/roof-repair?preview=1">Roof repair</a></div></details><a href="/s/roofing-scroll-025/areas?preview=1">Areas</a><a href="/s/roofing-scroll-025/pricing?preview=1">Pricing</a>< | {"x":289.859375,"y":88.484375,"width":80.640625,"height":44,"top":88.484375,"right":370.5,"bottom":132.484375,"left":289.859375} | {"x":289.859375,"y":76.421875,"width":80.640625,"height":44,"top":76.421875,"right":370.5,"bottom":120.421875,"left":289.859375} | false |
| 5 | 138.5 | 0.024368549324929635 | <span class="site-brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M7 23 24 9l17 14M13 21v18h22V21" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 39V28h8v11" stroke="currentColor" stroke-width="3"></path></svg></span> | {"x":19.5,"y":92.484375,"width":36,"height":36,"top":92.484375,"right":55.5,"bottom":128.484375,"left":19.5} | {"x":19.5,"y":80.421875,"width":36,"height":36,"top":80.421875,"right":55.5,"bottom":116.421875,"left":19.5} | false |

## Small fix

Explicit Arial, sans-serif at unchanged 21px size and line-height avoids swapping brand metrics; natural wrap and nav-fit behavior unchanged. Scope: foundation-page shared phone header brand at <=720px. Critical CSS regenerated using the existing build script, output byte-identical. Main copy/story/media untouched. Only product source change: public/site-polish.css. [Build log](round8x-build.log). [Before phone header](round8x-header-before-phone.png), [after](round8x-header-after-phone.png). After trace: round8x-trace-runafter-live.json.

## Standalones

- planning-scroll-browser: PASS; C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-planning-scroll-browser.log
- header-nav-fit: PASS; C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-header-nav-fit.log
- roofing-polish-part1-browser: PASS; C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-roofing-polish-part1-browser.log
- header-logo: PASS; C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-header-logo.log
- roofing-polish-part2: PASS; C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-roofing-polish-part2.log

Planning-scroll after fix: {"desktop":{"cls":0,"details":[]},"phone":{"cls":0,"details":[]}}. All thresholds unchanged.

## Suite-102

96 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 5 incomplete; Stopped. No retry. Failures: [{"label":"roofing-polish-part2-browser","kind":"browser","command":"node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs","status":1,"outcome":"FAILED","signal":null,"ms":478561,"log":"C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-roofing-polish-part2-browser.log","firstErrorLines":["AssertionError [ERR_ASSERTION]: headline live after publish desktop","    at check (file:///C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs:4:84)","    at file:///C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs:42:1080 {","  generatedMessage: false,","  code: 'ERR_ASSERTION',","  actual: false,","  expected: true,","  operator: '==',","  diff: 'simple'","}","","Node.js v24.19.0",""]}]. Suite log: round8x-suite102.log (only present if run).

## Catalog, Samples and hard locks

Catalog: {"before":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","atRunnerExit":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","after":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","matches":true,"runnerRestored":true,"supervisorRestored":[]}. Samples: {"state":"Not run","qaGateClear":false}. No fresh totals claimed if not run. Original 70 remain open/rejected; no acceptance, waiver or reclassification; qaGateClear=false. Original packet/capture-readiness preservation recorded separately. Baseline updates: 0. Unchanged lock proof: []. Source changes: [{"path":"public/site-polish.css","sha256":"d0887cfa4685166f1e3980c1d5d5c0552a3370f996af8dded9405da7623138be","after":"b8a00d12fd2473e793e4dc8203f5f85fae230f2aa2d8b281a6d365a82f07e2fc"}].

[Machine results](round8x-results.json).

## Final run details

Suite launch memory: 35.134 GB; minimum during suite: 30.711 GB. Suite planning-scroll CLS: {"desktop":{"cls":0,"details":[]},"phone":{"cls":0,"details":[]}}. [Phone suite shifts](round8x-layout-shifts-phone-suite.json), [desktop](round8x-layout-shifts-desktop-suite.json).

Stopped without retry: node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs. [Failure log](round8x-roofing-polish-part2-browser.log).

```text
AssertionError [ERR_ASSERTION]: headline live after publish desktop
    at check (file:///C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs:4:84)
    at file:///C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs:42:1080 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.19.0

```

No fresh Samples QA because the suite stopped. Original historical snapshot was 3,425 Pass / 70 Borderline / 0 Fail; not presented as a fresh result. The diagnostic and after screenshots are separate generated-fixture runs with different themes; the causal proof is the recorded font states/geometry, and the exact [product diff](round8x-product-diff.txt).

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8x-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.
