# #004G — Roofing hero polish

**Partial — implemented fixes pass; portrait source decision remains Waiting on Joe.** The supplied 9:16 clip already excludes the outer wings/roof edges and starts close to the house. It cannot show a full-house sky approach without different footage. No replacement or paid generation was performed.

## Changes and limits

1. The complete available 9:16 frame now fits the phone with contain/top anchoring. The former video poster no longer conceals its opening frame. Full-house/sky-opening content remains missing in the source: [portrait contact sheet](portrait-source-contact-sheet.png), [desktop contact sheet](desktop-source-contact-sheet.png). Both sheets sample the actual delivery clips; they are not generated imagery.
2. Mobile headline stays within a stronger dark gradient and above the foreground layer throughout scrolling.
3. Underlayment, Valley, Ridge vent and Flashing appear in a tappable two-column list immediately below the mobile hero. Each opens its detail and transfers keyboard focus. [Mobile roof list](mobile-roof-labels.png).
4. Both orientations fade into the existing still during the final 0.3 decoded seconds, with a smooth curve and real-time fade guard. Header offset inheritance removes a 9px position shift. The still and video assets themselves are unchanged.
5. Scroll sets the desired time; the playhead eases toward it using intermediate seeks capped at 0.18 seconds with one pending decode. Delivery GOP remains six frames (0.25 seconds at 24fps). No media re-encode or budget change.

## Before / after

| View | Before start / middle / end | After start / middle / end | Final scroll recording |
|---|---|---|---|
| Desktop 1440×1000 | [Start](before/desktop-start.png) · [Middle](before/desktop-middle.png) · [End](before/desktop-end.png) | [Start](desktop-start.png) · [Middle](desktop-middle.png) · [End](desktop-end.png) | [Desktop scroll](desktop-scroll.webm) |
| Mobile 390×844 | [Start](before/mobile-start.png) · [Middle](before/mobile-middle.png) · [End](before/mobile-end.png) | [Start](mobile-start.png) · [Middle](mobile-middle.png) · [End](mobile-end.png) | [Mobile scroll](mobile-scroll.webm) |

Fresh baseline recordings: [desktop](before/desktop-scroll.webm), [mobile](before/mobile-scroll.webm). Baseline uses the previous #004F-v2 QA script; its progress mapping reached the final video frame at 92% scroll. New progress maps through the full clip, blending the last 0.3 seconds.

| Handover remaining | Desktop | Mobile |
|---|---|---|
| 300ms, video | [Screenshot](desktop-handover-300ms.png) | [Screenshot](mobile-handover-300ms.png) |
| 150ms, half blend | [Screenshot](desktop-handover-150ms.png) | [Screenshot](mobile-handover-150ms.png) |
| 0ms, still | [Screenshot](desktop-handover-0ms.png) | [Screenshot](mobile-handover-0ms.png) |

Visual review checks the decoded roof pose, gradual color/brightness handover, headline backing and list placement. Mobile screenshots honestly retain the source's missing side wings; this criterion is not marked passed. [Desktop reduced motion](desktop-reduced.png) / [mobile reduced motion](mobile-reduced.png).

## Executed verification

- Build: PASS, 276 referenced assets / 14 kits ([output](build.txt)).
- `node --test tests/premium-service.mjs tests/media-ranges.mjs`: **2 passed, 0 failed** ([output](tests.txt)).
- `validate-delivery.cjs`: all four original delivery files pass dimensions, full frame counts, six-frame GOP, no audio and existing format-specific budgets ([output](delivery-validation.txt), [probe results](delivery-validation.json)).
- `browser-qa.cjs`: both viewports pass natural-source framing, headline backing, mobile link keyboard focus, forward/reverse intermediate seeks, handover opacity samples and stable stage position, pause, initial/live reduced motion, no horizontal overflow/page errors, WebM decoding and total-failure still fallback ([output](browser-output.txt), [metrics/seek trace](browser-results.json)).
- One mobile anchor-focus failure was corrected by preventing default navigation before scrolling/focusing its opened detail. One visual header-offset mismatch was corrected; final handover positions differ by less than 1px. Neither remains failing.

Reproduce: `node build.mjs`; `node scripts/preview-roofing-service.mjs` (8097); configure local Playwright/Chrome paths, then `node docs/build-evidence/004G/browser-qa.cjs`. The fixture is an isolated local database/bucket; no production publication or provider call occurs. `FFPROBE` supplies the local probe binary for delivery validation.

## Waiting on Joe / queued only

Supply an approved 9:16 clip that includes the full house/roof and sky approach, or approve fitting the complete 16:9 film on mobile. The current 9:16 source remains wired as requested. K23's unrelated reviewed legal-policy content remains open.

#027A now queues per-location footer phone display as `(805) 555-0111` with the existing dialable link retained. No phone-format rendering was built. No push, deploy, paid generation or messages. Commit locator: `fix: polish Roofing hero framing and scroll handover (#004G)`.
