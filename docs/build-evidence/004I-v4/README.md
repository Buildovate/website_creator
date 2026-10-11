# #004I-v4 — continuous StickyStack handoffs

Completed locally on feature/local-environment-setup. No push or deployment. The existing checkout is C:/Users/joe/website_creator. The #004G-v4 drone renderer, controller, styles, loader and media are unchanged from 856ec47. Next numbered ticket #013 is not started.

## Fixes and preserved behavior

- V3 used two disjoint fade intervals: both cards reached zero at the midpoint. The new panel intervals overlap. The incoming panel begins while the outgoing panel is fully visible; both are 60% opaque at the midpoint, and at least one is always 60% or more throughout the pinned handoff, in either direction. The active indicator changes at that same midpoint.
- Copy and image captions use a narrower, non-overlapping opacity interval. The photos crossfade while outgoing and incoming headings/paragraphs cannot be legible over one another. Images and complete panels keep their dimensions; no slivers or separate image collapse.
- Removed the extra 120px final hold and pre-release panel fade. Decide remains fully opaque as the stage releases. Tabs and the introduction travel with that release and clear before any header collision. Stats enter immediately below the intact departing card, with 64px combined section padding.
- The introduction stays visible above the compact pinned scene. At the tested sizes, the space below the card is about 48px on desktop and 43px above the phone action bar. The stage itself matches the card height. Desktop C uses a heading size that keeps each step name intact on one line.
- A more specific old B-layout image rule overrode the 200px phone image height, producing 388/449/388px cards in v3. The corrected rule fixes all three images at 200px. The enhanced cards share the measured maximum content height: 388px on phone and 540px on desktop, with approximately 20px below the phone accent rule.
- All eight v3 fixes remain: no repeated note; full visible text clear of header/tabs; no empty shells; fixed images/tight phone copy; only years/jobs count once; rating/reviews stay final; photo awaits decode; stable accurate tabs; requested stats subline. Reduced motion, no-JS, touch and keyboard remain supported. The fixtures contain fictional business facts.

## Baseline and automated acceptance

[The same sampler](sampled-qa.cjs) ran first against unchanged **856ec47**, before implementation edits. [Baseline results](baseline-results.json) cover all 12 desktop/phone × style × layout profiles. They reproduce blank-stage and empty-pinned-tabs failures, 150–210px desktop and 229px phone dead space, and unequal B phone card heights. Baseline mode collects failures; normal mode asserts against them.

Final: **9,756 samples across 12/12 profiles**, minimum **60.09 Hz**, largest interval **17.9 ms**, all passing. [Summary](sampled-results.json); full per-profile samples are adjacent JSON files. Sampling runs down/up/down. Continuity checks cover the pinned stage from first pin through release, plus any visibly pinned tab row; text/shell/decode checks continue through the stats exit and reverse entry. The gap check measures both the actual stage interior and the visible space above the phone action bar / desktop viewport edge. Card heights must differ by at most 4px. Separate effective-opacity/rectangle checks prohibit overlapping legible headings and paragraphs. All v3 sampled checks are retained, including actual image.decode fulfillment with an injected 350ms delay and continuous rating/review mutation observation.

[Functional stack/stat browser checks](browser-results.json): **12/12 profiles**, all keyboard/touch and hit-target checks, one-time counters, image dimensions, equal card heights and reduced-motion/no-JS fallbacks. [Existing motion matrix](components/browser-results.json): **12/12 profiles**, plus [touch lens/toggle QA](components/touch-qa.json). No page errors. [Full regression](regressions/results.json): **43/43 commands**, including build, TypeScript and all executable regression files.

## Fresh recordings and real mid-transition captures

[Desktop 1440×900 down/up/down](desktop-down-up-down.webm) · [Phone 390×844 down/up/down](mobile-down-up-down.webm) · [metadata](recordings.json).

Each linked PNG below is one actual browser screenshot with two partly opaque panels. There are **12 separate captures and 12 distinct SHA-256 hashes**, recorded with actual progress and panel opacities in [browser-results.json](browser-results.json). Small differences in capture progress preserve a genuine handoff and make the otherwise shared phone layouts distinguishable. No images were reused, duplicated or assembled.

| Phone profile | First handoff | Second handoff |
|---|---|---|
| bold-industrial / A | [Describe → Discuss](mobile-bold-industrial-A-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-bold-industrial-A-handoff-2-to-3-mid.png) |
| bold-industrial / B | [Describe → Discuss](mobile-bold-industrial-B-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-bold-industrial-B-handoff-2-to-3-mid.png) |
| bold-industrial / C | [Describe → Discuss](mobile-bold-industrial-C-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-bold-industrial-C-handoff-2-to-3-mid.png) |
| clean-modern / A | [Describe → Discuss](mobile-clean-modern-A-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-clean-modern-A-handoff-2-to-3-mid.png) |
| clean-modern / B | [Describe → Discuss](mobile-clean-modern-B-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-clean-modern-B-handoff-2-to-3-mid.png) |
| clean-modern / C | [Describe → Discuss](mobile-clean-modern-C-handoff-1-to-2-mid.png) | [Discuss → Decide](mobile-clean-modern-C-handoff-2-to-3-mid.png) |

The adjacent card1/card2/card3, stats, reduced-motion and no-JS PNGs cover every profile. All screenshots and recordings describe the final implementation.

## Mobile Lighthouse — three runs per style

| Run / full report | Performance | Accessibility | CLS | LCP |
|---|---:|---:|---:|---:|
| [bold-industrial-1](finish-attempt-1-bold-industrial-1.report.html) | 100 | 100 | 0.009518 | 1.205 s |
| [clean-modern-1](finish-attempt-2-clean-modern-1.report.html) | 100 | 100 | 0.009518 | 1.203 s |
| [bold-industrial-2](finish-attempt-3-bold-industrial-2.report.html) | 97 | 100 | 0.009518 | 1.204 s |
| [clean-modern-2](finish-attempt-4-clean-modern-2.report.html) | 100 | 100 | 0.009528 | 1.204 s |
| [bold-industrial-3](finish-attempt-5-bold-industrial-3.report.html) | 99 | 100 | 0.009528 | 1.205 s |
| [clean-modern-3](finish-attempt-6-clean-modern-3.report.html) | 100 | 100 | 0.009518 | 1.205 s |

All six audits pass Performance >=85, Accessibility >=95, CLS <=0.05 and contrast checks. Lighthouse simulated-mobile measurements use the isolated loopback fixture, with no concurrent browser tests or recording during the audits. [Score ledger](finish-lighthouse-summary.json), [contrast audits](contrast-results.json); full JSON accompanies each HTML report.

## Budget and reproduction

Motion/render/style budget: **37,282 bytes gzip (36.41 KiB) / 61,440 bytes**. [File accounting](motion-size.json). [Combined acceptance](acceptance.json) verifies the zero drone diff from 856ec47.

From C:/Users/joe/website_creator: run node build.mjs, then node docs/build-evidence/004I-v4/preview.mjs on loopback port 8123. Run sampled-qa.cjs, browser-qa.cjs, final-browser.cjs, touch-qa.cjs, record.cjs and full-regression.cjs from this evidence folder. To reproduce the baseline, serve a built 856ec47 checkout and run the same sampled harness with --baseline. lighthouse.mjs runs once per style/run and limits its ledger to six audits; verify.cjs checks all final gates. The scripts use the installed Playwright/Chrome runtime and existing Lighthouse installation (or LIGHTHOUSE_MODULE override). No private environment files or external integrations are used.
