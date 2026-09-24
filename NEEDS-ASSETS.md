# Motion kit asset handoff — updated by #004F

Roofing footage is supplied and wired. The supplied 3840×2160 still remains the poster/reduced-motion fallback through its 1920×1080 derivative. A real alpha house/chimney/tree cutout now replaces the temporary SVG polygon. Anatomy remains an educational SVG; other trades remain handoff specifications and are not rolled out.

Inputs: `docs/build-evidence/assets/<trade>/`. Reviewed web files: `public/assets/trade-motion/`. Both Roofing clips scrub with scroll, including mobile (supersedes #004E’s short-loop placeholder). The original full frame counts are retained. No audio. Keyframes every six frames support seeking. A final 8% scroll segment blends from the decoded end frame into the original still and its registered alpha mask. Moving-camera tracking is not supplied: callouts appear only at the landed poster, never at guessed points over moving footage.

For other trades, the existing table records requested targets: desktop 8 s/192 frames, mobile 3 s/72 frames. Roofing actual supplied media overrides those targets below. Continuous foreground mask sequences are optional for a future depth effect throughout the entire flight; the current requested depth effect is at landing.

| Trade | Filename | Length | Resolution | Frames | State |
|---|---|---|---|---|---|
| Roofing | roofing-house-still.png | — | 3840×2160 | 1 | Supplied; poster wired |
| Roofing | roofing-drone-dive-16x9.mp4 | 8.042 s | 1920×1080 | 193 | Supplied; web encodes wired |
| Roofing | roofing-drone-dive-9x16.mp4 | 5.042 s | 1080×1920 | 121 | Supplied; web encodes wired |
| Roofing | roofing-house-cutout.webp | — | 1920×1080 RGBA | 1 | Created from supplied still; landing mask wired |
| Roofing | roofing-foreground-{0001..0193}.webp | 8.042 s | 1920×1080 RGBA | 193 | Optional future full-flight masks |
| Roofing | roofing-frame-{0001..0193}.webp | 8.042 s | 1920×1080 | 193 | Alternative only; video is supplied |
| Roofing | roofing-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Roofing | roofing-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Patios | patios-house-still.png | — | 1920×1080 | 1 | Pending |
| Patios | patios-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Patios | patios-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Patios | patios-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Patios | patios-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Patios | patios-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Patios | patios-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Plumbing | plumbing-house-still.png | — | 1920×1080 | 1 | Pending |
| Plumbing | plumbing-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Plumbing | plumbing-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Plumbing | plumbing-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Plumbing | plumbing-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Plumbing | plumbing-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Plumbing | plumbing-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| HVAC | hvac-house-still.png | — | 1920×1080 | 1 | Pending |
| HVAC | hvac-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| HVAC | hvac-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| HVAC | hvac-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| HVAC | hvac-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| HVAC | hvac-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| HVAC | hvac-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Electrical | electrical-house-still.png | — | 1920×1080 | 1 | Pending |
| Electrical | electrical-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Electrical | electrical-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Electrical | electrical-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Electrical | electrical-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Electrical | electrical-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Electrical | electrical-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Landscaping | landscaping-house-still.png | — | 1920×1080 | 1 | Pending |
| Landscaping | landscaping-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Landscaping | landscaping-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Landscaping | landscaping-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Landscaping | landscaping-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Landscaping | landscaping-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Landscaping | landscaping-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| General Contractors | general-contractors-house-still.png | — | 1920×1080 | 1 | Pending |
| General Contractors | general-contractors-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| General Contractors | general-contractors-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| General Contractors | general-contractors-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| General Contractors | general-contractors-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| General Contractors | general-contractors-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| General Contractors | general-contractors-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Flooring | flooring-house-still.png | — | 1920×1080 | 1 | Pending |
| Flooring | flooring-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Flooring | flooring-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Flooring | flooring-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Flooring | flooring-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Flooring | flooring-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Flooring | flooring-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Painting | painting-house-still.png | — | 1920×1080 | 1 | Pending |
| Painting | painting-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Painting | painting-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Painting | painting-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Painting | painting-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Painting | painting-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Painting | painting-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Fencing | fencing-house-still.png | — | 1920×1080 | 1 | Pending |
| Fencing | fencing-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Fencing | fencing-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Fencing | fencing-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Fencing | fencing-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Fencing | fencing-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Fencing | fencing-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Garage Doors | garage-doors-house-still.png | — | 1920×1080 | 1 | Pending |
| Garage Doors | garage-doors-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Garage Doors | garage-doors-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Garage Doors | garage-doors-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Garage Doors | garage-doors-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Garage Doors | garage-doors-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Garage Doors | garage-doors-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Pest Control | pest-control-house-still.png | — | 1920×1080 | 1 | Pending |
| Pest Control | pest-control-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Pest Control | pest-control-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Pest Control | pest-control-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Pest Control | pest-control-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Pest Control | pest-control-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Pest Control | pest-control-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Windows/Doors | windows-doors-house-still.png | — | 1920×1080 | 1 | Pending |
| Windows/Doors | windows-doors-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Windows/Doors | windows-doors-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Windows/Doors | windows-doors-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Windows/Doors | windows-doors-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Windows/Doors | windows-doors-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Windows/Doors | windows-doors-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |
| Solar | solar-house-still.png | — | 1920×1080 | 1 | Pending |
| Solar | solar-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Solar | solar-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Solar | solar-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Solar | solar-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
| Solar | solar-wireframe.svg | — | 1100×760 viewBox | 1 | Pending |
| Solar | solar-flow-path.svg | — | 1100×760 viewBox | 1 | Pending |

The WebP frame sequence is an alternative to the desktop MP4, not a second required download. Foreground frames are separate transparent cutouts for depth masking; supply a synchronized frame for every desktop frame. `trade-tracking.json` must contain normalized (0–1) x/y coordinates at each of the 192 timestamps for every label, plus visibility/occlusion ranges. Roofing: Flashing, Underlayment, Valley, Ridge vent. Roofing currently uses registered still-image anchors after landing. Full-flight anchors require supplied tracking before they can be shown over moving footage.

Roofing anatomy requires shingles/underlayment/decking/flashing/gutter outlines, trusses and a water path. HVAC uses ductwork and airflow; plumbing uses supply/drain/vent pipe runs. Remaining trades need reviewed trade-specific layers, flow/failure path and anchor labels with their rollout. SVG exports must preserve separate named layer groups and contain no scripts or external references.

No speed, warranty or service duration is inferred from these clip lengths. Process chips describe phases, not promised appointment times. The repair/replace meter is an educational conversation aid, not a diagnosis or quote.

## Roofing web delivery — #004F

| File | Codec | Resolution | Bytes | Duration / frames |
|---|---|---|---|---|
| roofing-drone-dive-16x9.mp4 | H.264 | 1920×1080 | 3,131,422 | 8.042 s / 193 |
| roofing-drone-dive-16x9.webm | VP9 | 1440×810 | 3,130,579 | 8.042 s / 193 |
| roofing-drone-dive-9x16.mp4 | H.264 | 720×1280 | 1,251,310 | 5.042 s / 121 |
| roofing-drone-dive-9x16.webm | VP9 | 720×1280 | 1,423,329 | 5.042 s / 121 |

Each desktop format is below 4,000,000 bytes; each mobile format below 2,000,000 bytes. MP4 uses fast-start metadata; WebM is the tested alternate source. Source metadata, decoded final frames, encoding recipe, cutout prompt and browser evidence: [004F](docs/build-evidence/004F/README.md).

## #004F-v2 regenerated media — pending delivery

Regenerated approved inputs are 7.542s/181 desktop frames and 5.042s/121 mobile frames. H.264 fits, but WebM delivery budgets failed after two fixes; no delivery replaced. See [blocked evidence](docs/build-evidence/004F-v2/README.md) and Waiting on Joe. Original #004F table above describes the still-active delivery.


## #009 trust network marks

Permitted network logo/seal files and usage permission (K22) have not been supplied. The Roofing strip ships accessible text names as the approved fallback. No remote logo download, synthetic logo, or membership inference. Custom badge upload/editor remains #047.

