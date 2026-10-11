# #004F-v2 — Refreshed delivery accepted locally

Completed 2026-09-24 after Joe approved two-pass WebM at 1440×810 desktop / 720×1280 mobile and revised WebM byte limits. Full-resolution H.264 retains its existing limits. The six-frame GOP is unchanged. All four files replaced the public delivery, retaining every source frame and no audio.

| File | Resolution | Bytes | Budget | Duration / frames | Result |
|---|---|---:|---:|---|---|
| roofing-drone-dive-16x9.mp4 | 1920×1080 | 3,043,291 | <4,000,000 | 7.542000s / 181 | Pass |
| roofing-drone-dive-16x9.webm | 1440×810 | 4,225,862 | <4,500,000 | 7.542000s / 181 | Pass |
| roofing-drone-dive-9x16.mp4 | 1080×1920 | 1,358,304 | <2,000,000 | 5.042000s / 121 | Pass |
| roofing-drone-dive-9x16.webm | 720×1280 | 1,072,050 | <2,500,000 | 5.042000s / 121 | Pass |

[Encoder output](revised-budget-output.txt) · [Input/output probes](media-probe.json) · [Delivery validation](delivery-validation.json) · [Validation output](delivery-validation.txt). The gate in [encode-media.cjs](../004F/encode-media.cjs) now distinguishes WebM and H.264 budgets. Run it from the repo root with EVIDENCE_DIR pointing here and FFMPEG/FFPROBE paths configured. [validate-delivery.cjs](validate-delivery.cjs) checks the committed delivery’s dimensions, frame counts, GOP, no audio and budgets.

## Desktop and mobile browser evidence

| View | Start | Middle | End | Scroll recording |
|---|---|---|---|---|
| Desktop 1440×1000 | [Screenshot](desktop-start.png) | [Screenshot](desktop-middle.png) | [Screenshot](desktop-end.png) | [Recording](desktop-scroll.webm) |
| Mobile 390×844 | [Screenshot](mobile-start.png) | [Screenshot](mobile-middle.png) | [Screenshot](mobile-end.png) | [Recording](mobile-scroll.webm) |

| Blend | Start at 92% scroll | Middle at 96% | Finished |
|---|---|---|---|
| Desktop | [Screenshot](desktop-blend-start.png) | [Screenshot](desktop-blend-middle.png) | [Screenshot](desktop-blend-end.png) |
| Mobile | [Screenshot](mobile-blend-start.png) | [Screenshot](mobile-blend-middle.png) | [Screenshot](mobile-blend-end.png) |

Visual inspection confirms the decoded end pose blends into the supplied house still with the roofline aligned on both layouts. The last 8% crossfade retains the registered still/cutout; annotations wait for the landed still. The finite video budgets visibly soften the video compared with the sharp still. No new imagery or mask was generated. [Desktop X-ray](desktop-xray.png) · [Mobile X-ray](mobile-xray.png).

## Executed checks

- [browser-qa.cjs](browser-qa.cjs): **pass**. [Output](browser-output.txt), [results](browser-results.json). Both source formats decode/seek; start/middle/end, forward/reverse seeking, pause, exact blend opacity/mask registration, initial/live reduced motion, poster fallback, X-ray, no overflow or page errors. Recordings contain 758 desktop and 760 mobile viewport frames.
- [Build output](build.txt): pass, 276 referenced assets / 14 trade kits.
- [Regression output](tests.txt): **3 passed, 0 failed** (premium-service, media-ranges, scroll-media; all 24 existing scroll films decode with fast-start metadata). The initial scroll-media invocation lacked ffprobe on PATH; the corrected invocation uses the installed ffprobe and passes.

Previous failures are superseded: the earlier two-pass desktop WebM was 4,225,862 bytes against the former <4,000,000 limit. The subsequent 1600×900 attempt was 4,385,462 bytes and stopped. [Earlier approved-resolution output](approved-resolution-output.txt), [probe](approved-resolution-probe.json), [previous encoder](attempted-encoder.cjs). No further decision is pending for this ticket. Source originals remain in the incoming, untracked asset directory. No push, deployment, paid generation or external messages.
