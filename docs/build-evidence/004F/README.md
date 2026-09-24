# #004F — Supplied Roofing media

Completed locally, 2026-09-24. Scope: #004F only. #027A untouched; no push or deployment.

## Media verification

Both files were decoded and counted with ffprobe, not just inspected by filename. [Input/output probes](media-probe.json).

| Input | Duration | Resolution | Rate / frames | Last frame |
|---|---|---|---|---|
| Desktop | 8.042 s | 1920×1080 | 24 fps / 193 | [House front](source-16x9-end.png), matching the supplied still with a slightly different framing |
| Mobile | 5.042 s | 1080×1920 | 24 fps / 121 | [Tighter house-front crop](source-9x16-end.png) |

All encodes preserve the full frame count and duration, have no audio and use a six-frame GOP. MP4 has fast-start metadata. Desktop H.264 is 1920×1080 / 3,131,422 bytes; VP9 WebM is 1440×810 / 3,130,579 bytes. Mobile variants are 720×1280: H.264 1,251,310 bytes, VP9 1,423,329 bytes. Each format satisfies its requested decimal 4 MB / 2 MB limit. H.264 is preferred for browser hardware decoding; WebM is the tested alternate.

Reproduce encodes with [encode-media.cjs](encode-media.cjs): from the repository root with ffmpeg and ffprobe available, run node docs/build-evidence/004F/encode-media.cjs. FFMPEG, FFPROBE and REPO_ROOT may override paths. Output goes beside the script. Input originals stay in the incoming asset directory; only optimized delivery assets are committed.

## Visual evidence

| View | Start | Middle | End |
|---|---|---|---|
| Desktop 1440×1000 | [0 s](desktop-start.png) | [4.002 s](desktop-middle.png) | [8 s](desktop-end.png) |
| Mobile 390×844 | [0 s](mobile-start.png) | [2.498 s](mobile-middle.png) | [5 s](mobile-end.png) |

[Desktop scroll recording](desktop-scroll.webm) · [Mobile scroll recording](mobile-scroll.webm) · [Mobile enlarged X-ray](mobile-xray.png) · [Desktop X-ray](desktop-xray.png).

Recordings are actual browser viewport frames, including forward/reverse travel and landing. The last 8% of the scroll distance blends the decoded end pose into the supplied still, avoiding a misaligned mask over a moving camera. Both orientations use scroll seeking as requested. The original still is also the loading/error and reduced-motion poster.

The new [alpha cutout](../../../public/assets/trade-motion/roofing-house-cutout.webp) is 1920×1080 WebP with transparency, extracted using built-in imagegen. [Exact prompt and provenance](cutout-prompt.txt). Its alpha is used as a mask over the original still rather than substituting generated RGB pixels; roofline, chimney and tree edges replace the former angular polygon. The headline sits between the landing still and masked foreground. Hero paragraph has a dark gradient backing throughout. Mobile anatomy uses a tighter viewBox, filling about 90% of its diagram width, with the X-ray button immediately below.

## Executed checks

[Build and regression logs](checks.log): build, TypeScript, premium service, service playbook, financing comparison, website pages, conversion references, scroll story and media byte ranges — nine commands passed.

[Browser assertions and measured timestamps](browser-results.json): actual desktop/mobile media selection, start/middle/end, forward/reverse seeks, registered alpha landing, no SVG polygon, pause without layout collapse, dynamic reduced-motion unload, initial reduced motion with zero film requests, mobile diagram width/button gap, no horizontal overflow, actual WebM failover/seek, all-source failure retaining the poster, no observed page errors.

Reproduce browser checks with the disposable scripts/preview-roofing-service.mjs fixture on localhost:8097, then node docs/build-evidence/004F/browser-qa.cjs. Set PLAYWRIGHT_MODULE and CHROME_PATH for local tooling as needed. PREVIEW_URL/EVIDENCE_DIR are optional. Captures use a fictional business and do not send inquiries or call providers.

Flight-wide tracking and synchronized mask sequences were not supplied and are not fabricated; labels appear only at the final registered still. Other trades and #027A remain unchanged. Physical-device performance and deployment were not part of this local check. Next ticket: #005; not started.
