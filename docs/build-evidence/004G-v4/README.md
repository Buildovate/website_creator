# #004G-v4 — Roofing drone hero fixes

Completed locally on feature/local-environment-setup. No push or deployment. #004I remains queued, not built.

## Root causes and changes

The curved walkway/lawn is encoded into the lower part of the original portrait opening frames; it is visible in [v3 frame 000](../../../public/assets/trade-motion/v3/mobile/000.webp), below the target house, rather than being a second unrelated image. The v3 portrait was fitted in full, preserving that foreground and the enormous sky band in the supplied final still. Separately, the final-pose poster was shown before the opening canvas decoded. The new parser-discoverable opening still uses the exact cropped first frame; the landing plane remains transparent until the final pose, the poster hides after the first canvas draw, and all three planes use identical full-stage cover/bottom geometry. [First paint with the motion script deliberately held](mobile-first-paint.png) and [assertions](edge-results.json).

The mobile crop tracks the house with a 288×512 window through the original 720×1280 frames, resized to 720×1280 WebP. It removes the unrelated curved foreground walkway and most of the final sky. At 390×844 the roof-to-base house span is approximately **39.8% of viewport height**, using the documented source landmarks in the edge report. This deliberately crops the side wings to give the central house enough height. The action block now sits below the unchanged headline and above the house. The headline has no additional translation. [Crop manifest](../../../public/assets/trade-motion/v4/manifest.json), [reproduction](crop-mobile.cjs).

The former queue fetched frame 0, the endpoint and every sixth frame first. Nearest-to-scroll selection could therefore leap across missing poses; reversals could also choose a distant frame. The queue now loads consecutively with two workers, tracks the contiguous available prefix, and moves only one adjacent frame at a time at up to 30 fps in either direction. A decode that finishes after direction reversal is discarded. Later available frames cannot bridge a missing earlier frame. Fast scroll catches up through the intermediate poses instead of snapping. [Desktop frame trace](desktop-frame-trace.json), [mobile frame trace](mobile-frame-trace.json). The delayed-frame test holds desktop frame 5 while more than 20 frames arrive: playback stays at frame 4 until the gap is released.

The final mobile frame and landing still remain byte-identical. Desktop media is unchanged. Browser canvas/still comparison reports maximum 2/255 channel variation from decoder rounding, with identical fitting geometry and no added handoff fade. The clean-style contrast finding came from dark eyebrow text in a transparent sticky layer panel overlapping the preceding dark section. The sticky panel now owns its configured opaque surface. All six final Lighthouse reports pass color contrast.

## Frame budget

| Device | Frames | Sequence bytes, including final still once |
|---|---:|---:|
| Desktop | 60 | 4,263,644 |
| Mobile | 40 | 1,266,688 |

## Mobile Lighthouse — three runs per style, final build

| Run | Performance | Accessibility | CLS | LCP | TBT |
|---|---:|---:|---:|---:|---:|
| bold-industrial-1 | 100 | 100 | 0.0095 | 1.207 s | 46.0 ms |
| clean-modern-1 | 97 | 100 | 0.0095 | 1.206 s | 184.0 ms |
| bold-industrial-2 | 99 | 100 | 0.0095 | 1.207 s | 97.5 ms |
| clean-modern-2 | 100 | 100 | 0.0095 | 1.205 s | 28.0 ms |
| bold-industrial-3 | 99 | 100 | 0.0095 | 1.205 s | 129.0 ms |
| clean-modern-3 | 100 | 100 | 0.0095 | 1.205 s | 33.0 ms |

All six runs use Lighthouse simulated mobile on loopback, sequentially after browser recording/testing work. They include the final CSS order, opaque clean panel, final action position and final hero controller. These are local laboratory results, not physical-phone or deployed measurements. [Score ledger](finish-lighthouse-summary.json); the six adjacent HTML/JSON report pairs preserve full request chains and findings. [Contrast results](contrast-results.json).

The homepage LCP remains the preloaded optimized 720w still. Service first paint now intentionally uses the correct opening still (frame 000); all remaining frame requests and motion enhancements follow its LCP. Reduced motion selects only final stills and makes zero sequence requests. [Request-chain and CLS checks](components/request-chain.json).

## Final evidence

- Mobile real elapsed five-second flight: [0.0s](mobile-0.0s.png), [0.5s](mobile-0.5s.png), [1.0s](mobile-1.0s.png), [1.5s](mobile-1.5s.png), [end](mobile-end.png). Actual capture timestamps and selected frames are recorded in [edge results](edge-results.json); these replace the earlier normalized-state captures.
- Down → all the way up → down recordings: [desktop 1440×900](desktop-scroll.webm), [mobile 390×844](mobile-scroll.webm). Both retain adjacent-frame traversal on all legs. [Hero browser results](browser-results.json).
- Fallbacks: [desktop reduced motion](desktop-reduced.png), [mobile reduced motion](mobile-reduced.png), [desktop no JS](desktop-no-js.png), [mobile no JS](mobile-no-js.png).
- All 12 viewport/style/layout component profiles pass, including final-state/reduced-motion captures, touch lens/toggles, keyboard controls and no browser errors: [component browser results](components/browser-results.json), [touch QA](components/touch-qa.json). The components directory contains the final screenshot matrix.
- Full regression: **43/43 commands pass**, including build, TypeScript and the attributed-H1 conversion regression: [results](regressions/results.json) and individual logs in that directory.
- Conservative motion/render/style budget: **31,136 bytes gzip (30.41 KiB) / 61,440 bytes**. This includes full v1 CSS and renderer as well as the earlier v2/controller/performance/critical-CSS accounting: [measured files](motion-size.json). Image frames are separately listed above.

## Reproduction

Build from C:/Users/joe/website_creator with node build.mjs. Run preview-service.mjs (8117) and preview-home.mjs (8118), then browser-qa.cjs, edge-qa.cjs, final-browser.cjs, touch-qa.cjs and request-chain.cjs. Run full-regression.cjs for the full suite. Browser tools use the installed Playwright/Chrome runtime; crop-mobile.cjs uses installed Sharp. lighthouse.mjs writes one new audit per invocation and refuses a seventh run. No external credentials or live integrations are used.
