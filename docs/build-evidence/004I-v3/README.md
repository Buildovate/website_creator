# #004I-v3 — intact card handoffs and trust-safe stats

Completed locally on feature/local-environment-setup. No push or deployment. #004G-v4 drone renderer, controller, CSS, performance loader and media are unchanged. Next numbered ticket: #013, not started here.

## What changed

- Removed the repeated step note from the renderer at every breakpoint. The card keeps the useful scope/price/timing copy.
- The three complete cards share a pinned stage. Scroll fades and slightly scales the entire outgoing panel to zero before the next appears; the final card also fades completely before its stage can leave beneath the header or tabs. This is symmetric on down/up/down scroll. Text and image never leave a surviving border behind. Only the visible card receives pointer events.
- Phone cards use a fixed 200px image and content-sized copy, with approximately 20px below the accent rule. The image never shrinks independently during the fade. Desktop image and panel edges remain aligned.
- The active tab follows the visible card's scroll position in every style/layout. All tabs reserve identical padding/borders; the active indicator has a contrasting background and underline, without shifting the row.
- Only years in business and jobs completed carry count-up attributes. They run once and retain final values on reverse scroll/re-entry. Google rating, review count, warranty and license render their confirmed final values immediately. Confirmation/visibility rules are unchanged; fixtures are fictional.
- The photo is preloaded near its section after the hero has painted, decoded, and only then revealed as a complete masked photo. The container has no flat background fill; undecoded or failed images do not expose a colored silhouette. Reduced motion retains the decoded static photo; no-JS uses the normal static image.
- Subline: “Only facts this business has confirmed appear here.”

## New automated checks and failing baseline

[sampled-qa.cjs](sampled-qa.cjs) ran first against unchanged **effa190**, then against the final source. [Baseline results](baseline-results.json) contain four representative desktop/phone profiles, including clean C. They fail all requested categories: text/header or tab intersection, step-note overlap, empty panel, intermediate rating/review text, unverified image decode, missing/mismatched indicator and horizontal tab movement. Baseline mode collects expected failures rather than stopping at the first assertion; normal mode throws on those same violations.

The final down/up/down runs cover **12/12 profiles and 4,896 frame samples**, at least **30.08 Hz**, with a largest sampling interval of **34.0 ms**. All pass. The sampler measures actual card/heading/paragraph/header/tab rectangles and effective ancestor opacity, including opacity >0.1 during handoffs. Panel visibility is checked against visible text/image content. Active state is compared with the visible card, not only a controller flag, and every tab's x-position is tracked. A mutation observer checks rating/review text continuously. An independent wrapper around the real image.decode() promise adds a 350ms delay and verifies no visible shape before fulfillment. [Final sampled results](sampled-results.json); per-profile raw samples are adjacent JSON files.

[Functional browser results](browser-results.json): **12/12** stack/stat profiles, including active-card hit tests, keyboard Enter, phone taps, fixed image height/tight bottom padding, one-time counter mutation checks and static final rating/review values. All 12 also verify reduced-motion and no-JS static layouts. [Existing motion browser matrix](components/browser-results.json): **12/12**, preserving LayerExplode, RevealCompare and KineticText, plus [touch lens/toggle checks](components/touch-qa.json). No page errors.

## Final recordings and phone handoffs

[Desktop 1440×900 down/up/down](desktop-down-up-down.webm) · [Phone 390×844 down/up/down](mobile-down-up-down.webm) · [recording metadata](recordings.json).

| Phone style / layout | Describe → Discuss | Discuss → Decide | Finished |
|---|---|---|---|
| bold-industrial / A | [out](mobile-bold-industrial-A-handoff-1-to-2-out.png) · [in](mobile-bold-industrial-A-handoff-1-to-2-in.png) | [out](mobile-bold-industrial-A-handoff-2-to-3-out.png) · [in](mobile-bold-industrial-A-handoff-2-to-3-in.png) | [card 3](mobile-bold-industrial-A-card3.png) |
| bold-industrial / B | [out](mobile-bold-industrial-B-handoff-1-to-2-out.png) · [in](mobile-bold-industrial-B-handoff-1-to-2-in.png) | [out](mobile-bold-industrial-B-handoff-2-to-3-out.png) · [in](mobile-bold-industrial-B-handoff-2-to-3-in.png) | [card 3](mobile-bold-industrial-B-card3.png) |
| bold-industrial / C | [out](mobile-bold-industrial-C-handoff-1-to-2-out.png) · [in](mobile-bold-industrial-C-handoff-1-to-2-in.png) | [out](mobile-bold-industrial-C-handoff-2-to-3-out.png) · [in](mobile-bold-industrial-C-handoff-2-to-3-in.png) | [card 3](mobile-bold-industrial-C-card3.png) |
| clean-modern / A | [out](mobile-clean-modern-A-handoff-1-to-2-out.png) · [in](mobile-clean-modern-A-handoff-1-to-2-in.png) | [out](mobile-clean-modern-A-handoff-2-to-3-out.png) · [in](mobile-clean-modern-A-handoff-2-to-3-in.png) | [card 3](mobile-clean-modern-A-card3.png) |
| clean-modern / B | [out](mobile-clean-modern-B-handoff-1-to-2-out.png) · [in](mobile-clean-modern-B-handoff-1-to-2-in.png) | [out](mobile-clean-modern-B-handoff-2-to-3-out.png) · [in](mobile-clean-modern-B-handoff-2-to-3-in.png) | [card 3](mobile-clean-modern-B-card3.png) |
| clean-modern / C | [out](mobile-clean-modern-C-handoff-1-to-2-out.png) · [in](mobile-clean-modern-C-handoff-1-to-2-in.png) | [out](mobile-clean-modern-C-handoff-2-to-3-out.png) · [in](mobile-clean-modern-C-handoff-2-to-3-in.png) | [card 3](mobile-clean-modern-C-card3.png) |

Adjacent files also include every profile's three pinned cards, decoded stats photo, reduced-motion screenshot and no-JS screenshot. The components subdirectory contains the unchanged-component screenshot matrix. Recordings and handoff screenshots are from the final implementation.

## Mobile Lighthouse — three runs per style

| Run / report | Performance | Accessibility | CLS | LCP |
|---|---:|---:|---:|---:|
| [bold-industrial-1](finish-attempt-1-bold-industrial-1.report.html) | 99 | 100 | 0.009518 | 1.212 s |
| [clean-modern-1](finish-attempt-2-clean-modern-1.report.html) | 98 | 100 | 0.001382 | 1.236 s |
| [bold-industrial-2](finish-attempt-3-bold-industrial-2.report.html) | 98 | 100 | 0.009518 | 1.205 s |
| [clean-modern-2](finish-attempt-4-clean-modern-2.report.html) | 100 | 100 | 0.009518 | 1.205 s |
| [bold-industrial-3](finish-attempt-5-bold-industrial-3.report.html) | 98 | 100 | 0.009528 | 1.205 s |
| [clean-modern-3](finish-attempt-6-clean-modern-3.report.html) | 100 | 100 | 0.009518 | 1.204 s |

All six audits use Lighthouse simulated mobile on loopback after the final build, with no concurrent recording or regression work. Gates: Performance >=85, Accessibility >=95 and CLS <=0.05. All contrast audits pass. These are local laboratory measurements, not physical-device or deployed-site scores. [Ledger](finish-lighthouse-summary.json), [contrast results](contrast-results.json); full JSON reports accompany each linked HTML report.

## Regression and size gates

- **43/43** regression commands pass, including build, TypeScript and all executable test files. The renderer tests require exactly two count-up fields and no repeated note. [Results](regressions/results.json), with individual logs alongside.
- Motion/render/style budget: **36,584 bytes gzip (35.73 KiB) / 61,440 bytes**. Includes complete controllers, renderers, motion CSS, performance loader and critical CSS. [File accounting](motion-size.json).
- The drone source/controller/CSS/media and shared performance loader have zero diff from effa190. [Combined acceptance](acceptance.json).

## Reproduction

From C:/Users/joe/website_creator, run node build.mjs, then node docs/build-evidence/004I-v3/preview.mjs (isolated loopback port 8123). Run sampled-qa.cjs, browser-qa.cjs, final-browser.cjs, touch-qa.cjs, record.cjs and full-regression.cjs in this folder. For the failing comparison, run the same sampled harness with --baseline against an effa190 fixture. The harnesses use the installed Playwright/Chrome runtime; Lighthouse uses the existing tool installation or LIGHTHOUSE_MODULE override. lighthouse.mjs permits six total runs, invoked once for each style/run. verify.cjs checks all report gates and drone preservation. No private environment files or live integrations are used.
