# #004I-v2 — StickyStack handoff and one-time StatsMask counters

Completed locally on `feature/local-environment-setup`. No push or deployment. The next numbered backlog ticket is #013.

## Fix

The #004I list items themselves were sticky, with later cards assigned higher z-indices. That let the incoming card paint across the pinned paragraph. Each card now pins **inside its own bounded scroll slot**. The outgoing card releases before the next pins; during the transition the next card enters below its full copy. The mobile card occupies the space between the step tabs and bottom action bar at 390×844, with a 43% image. The no-JS and reduced-motion layouts remain static.

Numeric StatsMask values now animate for 850 ms on the grid's first entry, finish even if the user scrolls away, and never write or replay after completion. The static semantic values, individual confirmation gates, license behavior, mask shapes, and image are unchanged. The headline is “The numbers behind the work.”

## Mobile Lighthouse

Three simulated-mobile loopback audits per style, Lighthouse 13.5.0. Gates: Performance ≥85, Accessibility ≥95, CLS ≤0.05. All six color-contrast audits pass.

| Style and run | Performance | Accessibility | CLS |
|---|---:|---:|---:|
| Bold industrial 1 | 97 | 100 | 0.009518 |
| Bold industrial 2 | 100 | 100 | 0.009528 |
| Bold industrial 3 | 100 | 100 | 0.009528 |
| Clean modern 1 | 98 | 100 | 0.009518 |
| Clean modern 2 | 100 | 100 | 0.009528 |
| Clean modern 3 | 100 | 100 | 0.009528 |

[Six-run ledger](finish-lighthouse-summary.json) · [contrast results](contrast-results.json) · six full HTML/JSON report pairs in this folder.

## Transition screenshots — mobile 390×844

The first two frames for each style/layout show the next card entering below the outgoing card's complete heading and paragraph. The third shows the final card fully fitted above the action bar.

| Profile | Card 1 → 2 | Card 2 → 3 | Card 3 fitted |
|---|---|---|---|
| Bold A | [transition](mobile-bold-industrial-A-card1-next-enters.png) | [transition](mobile-bold-industrial-A-card2-next-enters.png) | [finished](mobile-bold-industrial-A-card3-finished.png) |
| Bold B | [transition](mobile-bold-industrial-B-card1-next-enters.png) | [transition](mobile-bold-industrial-B-card2-next-enters.png) | [finished](mobile-bold-industrial-B-card3-finished.png) |
| Bold C | [transition](mobile-bold-industrial-C-card1-next-enters.png) | [transition](mobile-bold-industrial-C-card2-next-enters.png) | [finished](mobile-bold-industrial-C-card3-finished.png) |
| Clean A | [transition](mobile-clean-modern-A-card1-next-enters.png) | [transition](mobile-clean-modern-A-card2-next-enters.png) | [finished](mobile-clean-modern-A-card3-finished.png) |
| Clean B | [transition](mobile-clean-modern-B-card1-next-enters.png) | [transition](mobile-clean-modern-B-card2-next-enters.png) | [finished](mobile-clean-modern-B-card3-finished.png) |
| Clean C | [transition](mobile-clean-modern-C-card1-next-enters.png) | [transition](mobile-clean-modern-C-card2-next-enters.png) | [finished](mobile-clean-modern-C-card3-finished.png) |

## Recordings and tests

- [Desktop 1440×900 down → up → down](desktop-down-up-down.webm)
- [Mobile 390×844 down → up → down](mobile-down-up-down.webm)
- [Recording dimensions and frame counts](recordings.json)
- [Browser results](browser-results.json): 12/12 profiles. The automated check samples pinned heading/paragraph hit targets while scrolling down, up, and down. It fails if another card covers either text box, or if a mobile card reaches the tab/action bars. A MutationObserver verifies the count-up has intermediate values on first entry and **zero numeric DOM changes** after completion through two away/re-entry cycles. Touch, keyboard, reduced-motion, no-JS, overflow, and page-error checks pass.
- [Regression results](regressions/results.json): 43/43, including build and typecheck.
- [Motion/render/style size](motion-size.json): **35,676 gzip bytes** against the 61,440-byte ceiling.
- [Acceptance ledger](acceptance.json): six Lighthouse gates, color contrast, profile counts, and unchanged #004G-v4 hero implementation.

The loopback fixture is fictional. Its confirmed facts show 18 years, 1,250 jobs, 4.9 Google rating, 212 reviews and CA license #123456; its unconfirmed warranty is hidden. Real sites still show only their own confirmed questionnaire facts.

Reproduce locally: run `node build.mjs`, then `node docs/build-evidence/004I-v2/preview.mjs` on port 8120. Run `browser-qa.cjs`, `record.cjs`, `lighthouse.mjs` (six cases), `full-regression.cjs`, and `verify.cjs` from this folder. These scripts use the installed local browser/runtime and no external credentials.
