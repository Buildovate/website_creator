# #004L · Roofing owner section photo

## Result

The Roofing owner band now has a full-size image beside the slightly tilted Mario Robles Jr. quote card on desktop. At 390×844, the image stacks above the card. Both images use the same layout. The sample has a dark brand gradient, “YOUR PHOTO HERE”, and “Upload your photo”; an uploaded owner image has no sample treatment. The image alt is `Owner of Robles Roofing` for this site and uses the saved business name for others.

The sample is explicitly marked `ownerPhoto.isSample: true` in saved Roofing site settings. A selected owner upload sets it to `false`; the existing Owner photo upload form selects the uploaded image. Readiness includes an optional Real owner photo check, and the sales approval checklist identifies the sample as media needed. The owner upload panel previews the sample until replacement.

## Screenshots

| State | Evidence |
|---|---|
| Desktop 1440×900, sample overlay | [desktop-sample.png](desktop-sample.png) |
| Desktop 1440×900, uploaded-image state with no overlay | [desktop-uploaded.png](desktop-uploaded.png) |
| Phone 390×844, sample top viewport | [phone-sample-top-390x844.png](phone-sample-top-390x844.png) |
| Phone 390×844, sample quote fully readable after scrolling | [phone-sample-bottom-390x844.png](phone-sample-bottom-390x844.png) |
| Phone 390×844, uploaded-image state, top and bottom | [top](phone-uploaded-top-390x844.png) · [bottom](phone-uploaded-bottom-390x844.png) |
| Full section crops at phone viewport width | [sample](phone-sample.png) · [uploaded](phone-uploaded.png) |

The uploaded-image screenshots use a local test media ID and fixture image to show the real-upload render state. They are **not** a customer portrait or a claim that the pictured person is Mario Robles Jr. The automated test also uploads a JPEG through the existing brand-image API, selects it as `ownerPhotoId`, and verifies that the private draft has no sample overlay. A customer portrait is still needed before owner-photo approval.

## Checks

- `node docs/build-evidence/004L/full-regression.cjs`: **49/49 passed** (build, typecheck, all 47 regression files). [Results](regressions/results.json) and [logs](regressions/).
- `tests/owner-photo.mjs`: sample data and markup, business-name alt, responsive lazy sources, optional media-needed check, selected-upload state, and upload API to private draft.
- Browser geometry from [capture.mjs](capture.mjs): no horizontal overflow at 1440 or 390; desktop photo begins to the right of the card; phone card begins below the image. No browser page errors. The phone screenshots show the full quote above the fixed call bar after scrolling. Reduced-motion mode was used for captures.
- Image assets: 480×600 WebP, 39,474 bytes; 960×1200 WebP, 103,588 bytes. Both are lazy-loaded with a responsive `srcset` and fixed dimensions. Source and license notes: [MEDIA-CREDITS.md](../../product/MEDIA-CREDITS.md).

No push or deployment.
