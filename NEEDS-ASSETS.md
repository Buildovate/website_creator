# Motion kit asset handoff — #004E

Production renders pending. No generation commissioned. The supplied Roofing 3840×2160 PNG still is used through an optimized 1920×1080 WebP. Its camera sequence and CSS/SVG roofline cutout are placeholders; the anatomy/wireframe is hand-authored SVG, not a rendered drone flight or customer project. Existing generated comparison images remain labeled. Other trades are handoff specifications only; their pages are not rolled out.

Expected input folder: `docs/build-evidence/assets/<trade>/`; reviewed public copies belong in `public/assets/trade-motion/`. Set paths in `src/trade-motion-config.js`. Supplied Roofing files at implementation: roofing-house-still.png (3840×2160, one frame); both MP4s missing. The polygon foreground mask is a temporary approximate roofline, not an alpha-matted production cutout.

For every trade, desktop camera beats are sky → clouds → neighborhood → trade detail → house front. 24 fps, 8 seconds, 192 frames; keyframe every frame for precise MP4 seeking, H.264, no audio. Mobile: 3-second seamless low-motion loop, 24 fps, 72 frames, H.264, no audio, target <2 MB. Desktop target <8 MB. Posters must match the final camera. Transparency must be premultiplied consistently; foreground masks and tracking coordinates must match the exact crop/camera at every frame.

| Trade | Filename | Length | Resolution | Frames | State |
|---|---|---|---|---|---|
| Roofing | roofing-house-still.png | — | 1920×1080 | 1 | Supplied |
| Roofing | roofing-drone-dive-16x9.mp4 | 8 s | 1920×1080 | 192 | Pending |
| Roofing | roofing-drone-dive-9x16.mp4 | 3 s | 720×1280 | 72 | Pending |
| Roofing | roofing-foreground-{0001..0192}.webp | 8 s | 1920×1080 RGBA | 192 | Pending |
| Roofing | roofing-frame-{0001..0192}.webp | 8 s | 1920×1080 | 192 | Pending |
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

The WebP frame sequence is an alternative to the desktop MP4, not a second required download. Foreground frames are separate transparent cutouts for depth masking; supply a synchronized frame for every desktop frame. `trade-tracking.json` must contain normalized (0–1) x/y coordinates at each of the 192 timestamps for every label, plus visibility/occlusion ranges. Roofing: Flashing, Underlayment, Valley, Ridge vent. The current placeholder shares one transform for art and anchors, so tracking is exact within its illustrated scene. Real footage must supply tracking before callouts are shown.

Roofing anatomy requires shingles/underlayment/decking/flashing/gutter outlines, trusses and a water path. HVAC uses ductwork and airflow; plumbing uses supply/drain/vent pipe runs. Remaining trades need reviewed trade-specific layers, flow/failure path and anchor labels with their rollout. SVG exports must preserve separate named layer groups and contain no scripts or external references.

No speed, warranty or service duration is inferred from these clip lengths. Process chips describe phases, not promised appointment times. The repair/replace meter is an educational conversation aid, not a diagnosis or quote.
