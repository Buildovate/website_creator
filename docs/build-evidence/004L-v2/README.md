# #004L-v2 — Roofing owner section polish

## Result

The Roofing owner section uses the full content width at desktop and mid widths. A straight, fixed 4:5 photo occupies 64% of the content area; the tilted quote card overlaps its left edge. The photo's own aspect ratio drives the section height. At phone width, the 4:5 photo comes first and the card overlaps its lower edge, with space below the quote for the fixed call bar. The sample has a small upper-right “Sample photo · Upload yours” pill outside the face. An uploaded photo has the same composition and no pill. The default Roofing statement is “I listen before I quote.”; `ownerStatement` still overrides it.

The old three-column portrait rule from the later design-studio stylesheet caused the mid-width squeeze. The previous image rule also filled a stretched grid cell. Roofing-specific selectors now override that rule and size the photo by its own 4:5 box.

## Screenshots

| State | Width | Evidence |
| --- | --- | --- |
| Sample | 1440×900 | [sample-1440x900.png](sample-1440x900.png) |
| Sample | 1280×900 | [sample-1280x900.png](sample-1280x900.png) |
| Sample | 1024×900 | [sample-1024x900.png](sample-1024x900.png) |
| Sample | 768×900 | [sample-768x900.png](sample-768x900.png) |
| Sample | 390×844 | [sample-390x844.png](sample-390x844.png) |
| Uploaded state | 1440×900 | [uploaded-1440x900.png](uploaded-1440x900.png) |
| Uploaded state | 390×844 | [uploaded-390x844.png](uploaded-390x844.png) |
| Phone quote with fixed call bar | 390×844 | [sample](sample-quote-390x844.png) · [uploaded](uploaded-quote-390x844.png) |

The section-only crops temporarily hide fixed site navigation and the call bar so neither covers the photo or badge in the crop. The separate phone quote views retain the actual fixed call bar. The uploaded-state captures use a local test media ID and the same fixture image for a direct layout comparison; they do not claim a customer portrait has been supplied. A real owner photo remains needed for approval.

## Verification

- [Full regression results](regressions/results.json): **51/51 passed**, including build, typecheck, `tests/owner-photo.mjs`, and the #015A platform mobile browser inventory. [Individual logs](regressions/).
- [Platform mobile audit](platform-mobile-audit.json): **101 phone + 101 desktop states**, zero layout issues and zero browser errors. The separate physical iPhone/Safari camera check from #015A remains pending.
- [Five-width browser geometry](browser-results.json) from [capture.mjs](capture.mjs): no horizontal overflow; 4:5 photo with `object-fit: cover`; full-width section and right-side photo coverage; clean card/photo overlap; photo taller than card on desktop; sample badge only in sample state; phone quote clear of the fixed call bar. All captures used reduced-motion mode.
- `tests/owner-photo.mjs` confirms sample flag/readiness, lazy responsive sources, business-name alt, short default quote, editable override, and upload state without the sample badge.

Local only; no push or deployment.
