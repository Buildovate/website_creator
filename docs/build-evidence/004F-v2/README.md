# #004F-v2 — Approved resolution follow-up blocked

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

The original attempt stopped here. The authorized resolution follow-up below supersedes its pending question.

## Approved resolution follow-up — 2026-09-24

Joe authorized WebM at 1600×900 desktop and 900×1600 mobile, six-frame GOP, H.264 at full input resolution, and unchanged byte budgets. The [reproducible retry](approved-resolution-encoder.cjs) retains the preceding two-pass bitrate/quality settings and uses those exact dimensions. These requested dimensions are larger than the previous attempted 1440×810 / 720×1280 WebMs. No additional tuning was attempted.

| Deliverable | Resolution | Bytes | Budget | Result |
|---|---|---:|---:|---|
| Desktop H.264 | 1920×1080 | 3,045,346 | <4,000,000 | Pass |
| Desktop WebM | 1600×900 | 4,385,462 | <4,000,000 | **Fail** |
| Mobile H.264 / WebM | 1080×1920 / 900×1600 configured | — | <2,000,000 | Not run: stopped at desktop failure |

[Executed test output](approved-resolution-output.txt) · [ffprobe metadata and keyframe positions](approved-resolution-probe.json). Both encoded desktop variants retain all 181 frames and a maximum six-frame keyframe interval. Candidate binaries were discarded after recording the failure. Existing delivery files were not changed.

**Waiting on Joe:** which further encoding constraint may change? Browser QA, refreshed desktop/mobile screenshots, both scroll recordings and end-frame blend acceptance remain pending because the delivery gate failed. Earlier source screenshots above are source evidence only, not updated browser evidence. No push, deploy, generation, or external messages.
