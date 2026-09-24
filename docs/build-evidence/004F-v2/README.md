# #004F-v2 — Blocked after two encoding fix attempts

Approved incoming source probes confirm desktop 7.542 s / 181 frames at 1920×1080 and mobile 5.042 s / 121 frames at 1080×1920. The encoder now derives screenshot frame positions from decoded input counts and accepts EVIDENCE_DIR. No delivery files were replaced because the complete four-format set did not pass the existing byte-budget gate.

## Executed output

- Initial encoder: H.264 desktop 3,035,227 bytes, mobile 1,362,098 bytes; mobile WebM 2,999,329 bytes (FAIL <2,000,000).
- Fix attempt 1, tighter one-pass VP9 bitrate/quality: desktop WebM 4,894,216 bytes; mobile WebM 2,307,579 bytes (FAIL).
- Fix attempt 2, two-pass VP9 bitrate and full quantizer range: desktop H.264 3,046,759 bytes; desktop WebM 4,225,862 bytes (FAIL <4,000,000). Stopped before replacing production media or making further attempts, per Joe's instruction.
- [Attempted encoder](attempted-encoder.cjs) records the second fix. [Input probes](source-probe.json) are actual ffprobe output. Incoming originals remain untracked; oversized candidate encodes were discarded.
- [Build](build.txt) passed, 276 referenced assets / 14 kits. [Regression output](tests.txt): premium-service and media-ranges passed (2/2). These test the unchanged app, not acceptance of refreshed media.

## Visual evidence and incomplete checks

[Desktop source start](source-16x9-start.png) / [middle](source-16x9-middle.png) / [end](source-16x9-end.png).
[Mobile source start](source-9x16-start.png) / [middle](source-9x16-middle.png) / [end](source-9x16-end.png).

The decoded desktop end frame visually matches the supplied house still; portrait framing is tighter. Final browser blend verification, refreshed desktop/mobile UI screenshots and both scroll recordings are **not completed** because the encoding gate failed after two fixes. The prepared [browser script](browser-qa.cjs) was not executed. Existing accepted delivery and #004F evidence remain intact.

Waiting on Joe: authorize a follow-up using lower-resolution WebM, a longer GOP, or a revised delivery budget. No generation, push, deployment, external messages or live provider requests. Next queue item: #008.
