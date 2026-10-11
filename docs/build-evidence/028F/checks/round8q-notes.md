# #028F round 8q — full-name header fit

State: Stopped: roofing-polish-part1-browser — header one line 1280; no retry or commit. No commit or staging.

## Cause and fix

Roofing max-width constrained the brand box while its full name painted beyond it; the fit calculation also omitted the original Contact Us link when workspace decoration appended a Pricing & options CTA.

Measure an unclamped brand clone using the current loaded font, logo and gap; include every header link, CTA and margin; remove rightmost links into More before switching to native Menu when minimum desktop controls cannot fit. Refit after font loading and resize; preserve the full name at its existing font size, wrapping in Menu mode.

## Evidence

- [768 before](round8q-nav/before/roofing-768.png) and [768 after](round8q-nav/after/roofing-768.png).
- Longest Sample and exact 40-character name screenshots: [long-name-38.png](round8q-nav/after/long-name-38.png), [long-name-40.png](round8q-nav/after/long-name-40.png).
- [Expanded geometry records](round8q-nav/after/results.json): 17 kits × four Looks × eight widths × three names when the matrix completes.
- [First service-pages attempt](round8q-service-pages-all-trades-first.log) preserved: exposed the omitted Contact Us sibling; corrected under the authorized standalone-until-pass instruction.

## Checks

- service-pages-all-trades: PASS; ℹ tests 3; ℹ pass 3; ℹ fail 0 — [round8q-service-pages-all-trades.log](round8q-service-pages-all-trades.log)
- header-nav-fit: PASS; PASS header nav fit: 16422 checks; 8 evidence widths; 1632 trade/Look/name states; painted-name geometry, keyboard and resize — [round8q-header-nav-fit.log](round8q-header-nav-fit.log)
- header-logo: PASS; PASS header logo: 340 rendered headers, 6 edge cases — [round8q-header-logo.log](round8q-header-logo.log)
- roofing-polish-part2: PASS; PASS 7633 Part 2 regression assertions; 374 response contracts; 2987 installed photo instances — [round8q-roofing-polish-part2.log](round8q-roofing-polish-part2.log)

Suite-102: 93 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 8 incomplete. [Suite log](round8q-suite102.log). Existing runner and hang guard unchanged; first failure stops the process tree, no suite retry.

Baseline scan: {"identical":1596,"a":0,"b":0,"c":0,"a+c":0,"other":0}; no baseline writes unless its entire normalized delta fits the approved standing rule.

Samples: {"state":"Not run","prior":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false,"original70Open":true,"decisionsRecorded":0}. The original 70 review decisions remain untouched and open; no acceptance, waiver or reclassification. Historical totals are not a new snapshot.

[Machine results](round8q-results.json) record temporary-input and protected-input SHA preservation. Backups are in round8q-before. No detector, threshold, sampling, normalization, assertion weakening, provider call, credit, dependency, push or deployment.

## Exact stop

Command: `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs`. [Preserved failure log](round8q-roofing-polish-part1-browser.log).

```text
AssertionError [ERR_ASSERTION]: header one line 1280
    at check (file:///C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs:4:63)
    at file:///C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs:27:255 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.19.0
```

No test rerun or additional product edit after this failure. Fresh Samples snapshot not run because the suite failed; historical 3,425 Pass / 70 Borderline / 0 Fail is not a fresh result. Original Sample evidence preservation: {"trees":[{"path":"packets","checked":19976,"changed":[]},{"path":"capture-readiness","checked":9062,"changed":[]}],"qaPacketsUnchanged":true,"decisionsRecorded":0}.
