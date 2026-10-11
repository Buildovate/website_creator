# Round 8aa — publish probe

One temporary desktop copy through line 42; original test/product unchanged during diagnosis. Button, dialog, network, snapshots, editor state and live h1 recorded at 350ms, after a further 5s, and after the publish response. No other publish requests are replayed. All 70 original Borderlines remain open; qaGateClear=false. No commit/staging/push/deploy; 0 credits/providers.

## Probe finding and test-only fix

One visible/enabled Publish changes button; confirm accepted; no editor errors. At 461ms and 5572ms: UI creating backup/publishing, tenant version 4 with saved draft headline but old published headline, live h1 “A roof concern. A clear next step.” (duplicated by the existing hero markup). The single UI POST returned 200 after 137774ms, body {ok:true,url:/s/roofing-part2}. After response: version 5, published and draft headline “Roof concerns? Let’s make a clear plan.”; live h1 matches. 52 tenant request/response observations. Real review capture delays publication even standalone.

Only line 42 changed: register a 2xx publish-response wait before the click, await it, reload live page, poll h1 up to 15s. Existing publish and CTA assertions unchanged. Response timeout matches the existing hero-editor-browser UI publish and fixture capture deadline (1200000ms); no guard changed. No product code changed. [Exact line diff](round8aa-test-line.diff.txt).

## Resume after turn interruption

The prior standalone tool call was aborted; no exit result or final verdict was written, and no test node/headless Chrome process remains. Preserved partial log as round8aa-interrupted-roofing-polish-part2-browser.log; outcome INCOMPLETE, never PASS. User requested continue; resumed standalone below. Source hashes match the saved state plus the authorized one-line test edit; dist exists. Suite has not run.

## Resumed standalone PASS

237 checks / 76 screenshots / 0 browser errors, exit 0; elapsed 1055532ms. Both desktop and phone publication and CTA assertions passed. [Log](round8aa-resumed-roofing-polish-part2-browser.log). Complete result saved separately so suite writes cannot overwrite this count.

## Final verification state

Stopped at first Suite-102 failure; no retry

| Check | Result |
|---|---|
| Standalone | PASS |
| Suite PASS | 99 |
| Suite PASS-WITH-WARNING | 0 |
| Suite FAILED | 1 |
| Suite incomplete | 2 |
| Planning-films hash match | true |
| Original Sample evidence | 29039 checked, 0 changed |
| Original open Borderlines | 70 |
| qaGateClear | false |

Source changes: tests/roofing-polish-part2-browser.mjs. Product code unchanged. No baseline updates. No commit/staging/push/deploy; 0 provider calls/credits.

Failure: node C:/Users/joe/website_creator/tests/promotions-scroll.mjs; [log](round8aa-failure-promotions-scroll.log).

AssertionError [ERR_ASSERTION]: #026 renderer source unchanged
    at check (file:///C:/Users/joe/website_creator/tests/promotions-scroll.mjs:3:68)
    at file:///C:/Users/joe/website_creator/tests/promotions-scroll.mjs:27:107 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.19.0


Fresh Samples: Not run. Original 70 remain open; no Accept, waiver or reclassification.
