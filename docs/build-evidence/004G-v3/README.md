# #004G-v3 — completed locally

The Roofing service hero now scrubs a progressively fetched WebP sequence on canvas. Source: the supplied v3 8-second landscape and 5-second portrait clips. No paid generation, push or deployment.

| Device | Dimensions | Frames | Total sequence bytes (including final still) | Ceiling |
|---|---|---:|---:|---:|
| desktop | 1440×810 | 60 | 4,263,644 | 4,500,000 |
| mobile | 720×1280 | 40 | 1,451,286 | 2,500,000 |

[Per-frame bytes and source times](frame-bytes.json). Desktop samples 56 frames through 4.917s, then 5.5s and 7.958s, a half blend into the supplied still, and the exact still: only four slots after the active approach. Mobile samples 38 frames through 4.958s, a half blend and the exact portrait still. Final stills are byte-identical to the last sequence file and the runtime reuses the still URL. All frames use WebP quality 72, final still quality 82. [Reproduction script](extract-sequence.cjs) requires ffmpeg and sharp (FFMPEG, SHARP_MODULE and REPO_ROOT overrides supported).

Two low-priority fetch workers begin after the initial still can paint. Coarse frames load first; compressed blobs remain cached and at most eight decoded bitmaps remain resident. Scroll chooses the closest available frame without video seeks. Orientation changes abort the old queue. Reduced motion selects the final responsive still and makes zero sequence requests; changing the preference live aborts queued fetches and removes the canvas. Failed frames retain the nearest available frame; total failure leaves the still.

Desktop retains the registered foreground mask and headline behind the house. Mobile contains the whole portrait at the BOTTOM of the hero. The actions sit in the sky above the landed house; headline position is unchanged. These are supplied concept visuals, not contractor project evidence.

## Final visual evidence

| Viewport | Start | Mid | End | Reduced motion | Recording |
|---|---|---|---|---|---|
| 1440×900 | [start](desktop-start.png) | [mid](desktop-mid.png) | [end](desktop-end.png) | [still](desktop-reduced.png) | [scroll](desktop-scroll.webm) |
| 390×844 | [start](mobile-start.png) | [mid](mobile-mid.png) | [end](mobile-end.png) | [still](mobile-reduced.png) | [scroll](mobile-scroll.webm) |

[Browser results](browser-results.json), [browser reproduction](browser-qa.cjs). Checks include frame counts, correct viewport asset, bottom alignment, forward/reverse scrub, pause, live reduced motion, cold reduced-motion zero frame downloads, no video requests, no overflow and no page errors. The canvas endpoint and DOM still differ only by image decoder rounding: maximum 2/255 channel levels, mean 0.150 desktop / 0.090 mobile. No geometric handoff change.

Build, motion-v2 (six profiles/code budget), premium-service and website-pages (17 tests) pass. Full regression suite and mobile performance are the separately authorized #004H-finish. #004I remains queued only.
