# Higgsfield credit quote — four planned roofing clips

Read-only quote on **September 27, 2026, 7:40 a.m. PT (PDT)**. The selected Higgsfield workspace balance was **2,513.8 credits**, confirmed again after the cost estimates. The source for the balance is the Higgsfield `balance` tool response. No generation was submitted.

The exact prompts in [#024](../024/README.md), [#025](../025/README.md), [#026](../026/README.md) and [#027](../027/README.md) all begin with **“Ultra.”** Neither specified model exposes an `ultra` quality parameter. The quoted credits below are therefore for the **closest supported settings**, not for an unavailable Ultra tier. Each estimate requests one output at the planned duration, 1080p, 16:9 and `generate_audio=false`. The source for every credit figure is the read-only Higgsfield `estimate_video_cost` tool response on September 27, 2026; no job was started.

| Ticket | Page | Purpose | Model | Length | Resolution | Audio | Supported as written? | Credits per generation | Source of number |
|---|---|---|---|---:|---|---|---|---:|---|
| #024 | Financing | Calm roof-scope planning ambient loop | Cinema Studio Video 3.0 (`cinematic_studio_3_0`) | 8s | 1080p, 16:9 | Off | **No — Ultra tier unavailable**; other requested settings supported | **80** (closest supported) | Higgsfield `estimate_video_cost`: model `cinematic_studio_3_0`, duration 8, resolution `1080p`, aspect_ratio `16:9`, generate_audio `false`, count 1; cost 80 |
| #025 | Financing | Scroll story about understanding payment choices | Seedance 2.5 (`seedance_2_5`) | 12s | 1080p, 16:9 | Off | **No — Ultra tier unavailable**; reference mode is supported if references are supplied | **144** (closest supported) | Higgsfield `estimate_video_cost`: model `seedance_2_5`, mode `t2v`, duration 12, resolution `1080p`, aspect_ratio `16:9`, generate_audio `false`, bitrate_mode `high`, count 1; cost 144 |
| #026 | Promotions | Quiet roof-detail ambient scene for planning around daily life | Cinema Studio Video 3.0 (`cinematic_studio_3_0`) | 8s | 1080p, 16:9 | Off | **No — Ultra tier unavailable**; other requested settings supported | **80** (closest supported) | Same read-only Cinema Studio Video 3.0 estimate as #024; cost 80 |
| #027 | Promotions | Scroll story reconciling an entered offer with the written estimate | Seedance 2.5 (`seedance_2_5`) | 12s | 1080p, 16:9 | Off | **No — Ultra tier unavailable**; reference mode is supported if references are supplied | **144** (closest supported) | Same read-only Seedance 2.5 estimate as #025; cost 144 |

## Totals at the closest supported settings

| Budget | Calculation | Credits | Balance after that hypothetical spend |
|---|---:|---:|---:|
| One generation of each clip | 80 + 144 + 80 + 144 | **448** | **2,065.8** |
| Two generations of each clip (one retake each) | 2 × 448 | **896** | **1,617.8** |

These are hypothetical balances. The actual balance remained 2,513.8 credits after the read-only estimates.

## Unsupported setting and closest supported option

- **Cinema Studio Video 3.0 (#024, #026):** The model supports 8 seconds, 1080p, 16:9 and silent output. Its catalog parameters are resolution, genre and audio; there is **no Ultra quality mode**. Closest supported option: the same model and requested output settings with its default `genre=auto`, **80 credits per clip**. “Ultra” may remain descriptive prompt text, but it does not select a billable quality tier.
- **Seedance 2.5 (#025, #027):** The model supports 12 seconds, 1080p, 16:9, silent output and `omni_reference` mode. It has **no Ultra quality mode**. Closest supported option for the current plans, which supply no reference media, is `t2v` with `bitrate_mode=high`, **144 credits per clip**. The read-only estimate for `omni_reference` with the same output settings and high bitrate also returned **144 credits**; actual reference media would have to be supplied for that mode. The standard-bitrate `t2v` estimate was also **144 credits**. Higher bitrate is an output setting, not an Ultra quality tier.

To keep the first budget small, make the **Financing ambient clip (#024)** first: it tests the shared 1080p, silent, center-safe treatment for 80 credits. If its look and loop work, make the distinct Promotions ambient clip (#026) next for another 80 credits. Hold the two 144-credit scroll stories until the simpler films establish the visual direction; their four-beat continuity is more likely to need a retake.

**Higgsfield credits used: 0.**
