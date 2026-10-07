# Round 8z — rebuild and publish timing

Build command: `node C:/Users/joe/website_creator/build.mjs`, with repo working directory. This is package.json scripts.build and parallel-suite.mjs args(build); no source/config edit. All 70 Borderlines stay open; qaGateClear=false. No commit/staging/push/deploy, 0 provider calls/credits.

## Build

PASS (exit 0); dist/server/index.js restored. All recorded source hashes unchanged after build. [Build log](round8z-build.log).

## Unchanged standalone — STOP

Exit 1 after 68 checks / 29 screenshots / 0 recorded browser errors; elapsed 439792ms.

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

[Standalone log](round8z-diagnose-roofing-polish-part2-browser.log). No retry, publish-wait edit, suite or fresh Samples run.

The saved-draft screenshot shows success and “Roof concerns? Let’s make a clear plan.” The live h1 failed the contains check after the existing 350ms wait; its complete text and the publish response are not recorded by this unchanged test. A read-only attempt to query the local fixture during teardown failed because the server was closed. No second publish or test run was made. [Observations](round8z-publish-observations.json), [saved draft](round8z-hero-editor-saved-draft-desktop.png), [before-publish page](round8z-published-before-desktop.png). Standalone failure alone does not distinguish slow asynchronous review completion from broken publication; this round stops as instructed.

## Preservation

One-line test diff: none. Source changes: 0; locked files unchanged: 12/12. Planning-films pre/post SHA-256 `b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145` / `b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145`; match true. Original Sample evidence: 29039 files, 0 changed. No baseline updates. All original 70 Borderlines remain open; no Accept, waiver or reclassification. qaGateClear=false. Suite-102 not run (0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete); fresh Samples not run. No commit, staging, push, deploy, provider calls or credits. [Results](round8z-results.json).
