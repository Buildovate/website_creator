# #004I — StickyStack and StatsMask (Roofing)

Completed locally on `feature/local-environment-setup`. No push or deployment. The next numbered backlog ticket is #013.

## Implementation

StickyStack replaces Roofing's three plain process rows with visual-first pinned cards: Describe, Discuss and Decide. Each has reviewed short copy, a large labeled illustrative roof image and an optional sticky index. A/B/C layouts share bold-industrial or clean-modern tokens. Touch scrolling and keyboard-operated index links work in both directions. Before enhancement, without JavaScript, and under reduced motion, all cards remain static and readable in document order.

StatsMask uses `cleanBusinessTrust` and checks each questionnaire confirmation flag individually. Its numeric text counts up as the grid enters view; the photo fills through a configurable gable, drop, sun, flame or validated logo mask. A static semantic copy preserves the final fact for assistive technology, and license identifiers never count up or mask. The image is lazy-loaded. With no confirmed facts, the entire section is omitted. A Google rating requires a rating, review count, source URL and the Google confirmation.

The local **fictional QA fixture** reuses `tests/fixtures/business-trust.mjs`; it is not a real contractor claim. Its confirmed fields show **18 years in business, 1,250 jobs completed, 4.9 Google rating, 212 Google reviews and CA license #123456**. The 10-year warranty is present in that fixture but **hidden** because its confirmation flag is false. An empty-facts assertion confirms StatsMask is omitted. Real sites render only their own confirmed values.

The Roofing drone hero renderer, controller, crop manifest and media have no implementation change from #004G-v4. [Comparison assertions](acceptance.json) verify the unchanged hero function and files.

## Mobile Lighthouse — final cache-busted build

Three simulated-mobile loopback runs per style, Lighthouse 13.5.0. Gates: Performance ≥85, Accessibility ≥95, CLS ≤0.05. All six pass color contrast.

| Run | Performance | Accessibility | CLS | LCP |
|---|---:|---:|---:|---:|
| bold-industrial-1 | 100 | 100 | 0.0095 | 1.204 s |
| clean-modern-1 | 100 | 100 | 0.0095 | 1.204 s |
| bold-industrial-2 | 100 | 100 | 0.0095 | 1.204 s |
| clean-modern-2 | 98 | 100 | 0.0095 | 1.204 s |
| bold-industrial-3 | 99 | 100 | 0.0095 | 1.204 s |
| clean-modern-3 | 99 | 100 | 0.0095 | 1.205 s |

[Score ledger](finish-lighthouse-summary.json) · [contrast results](contrast-results.json) · six adjacent full HTML/JSON report pairs. The six reports in this folder are the final run.

## Screenshots

All screenshots are 1440×900 desktop or 390×844 mobile viewport captures from the final build. Rest, mid, finished and reduced-motion states are provided for both components in all **12 style/layout/viewport profiles**.

| Profile | StickyStack | StatsMask |
|---|---|---|
| desktop-bold-industrial-A | [rest](desktop-bold-industrial-A-stack-rest.png) · [mid](desktop-bold-industrial-A-stack-mid.png) · [finished](desktop-bold-industrial-A-stack-finished.png) · [reduced](desktop-bold-industrial-A-stack-reduced.png) | [rest](desktop-bold-industrial-A-stats-rest.png) · [mid](desktop-bold-industrial-A-stats-mid.png) · [finished](desktop-bold-industrial-A-stats-finished.png) · [reduced](desktop-bold-industrial-A-stats-reduced.png) |
| desktop-bold-industrial-B | [rest](desktop-bold-industrial-B-stack-rest.png) · [mid](desktop-bold-industrial-B-stack-mid.png) · [finished](desktop-bold-industrial-B-stack-finished.png) · [reduced](desktop-bold-industrial-B-stack-reduced.png) | [rest](desktop-bold-industrial-B-stats-rest.png) · [mid](desktop-bold-industrial-B-stats-mid.png) · [finished](desktop-bold-industrial-B-stats-finished.png) · [reduced](desktop-bold-industrial-B-stats-reduced.png) |
| desktop-bold-industrial-C | [rest](desktop-bold-industrial-C-stack-rest.png) · [mid](desktop-bold-industrial-C-stack-mid.png) · [finished](desktop-bold-industrial-C-stack-finished.png) · [reduced](desktop-bold-industrial-C-stack-reduced.png) | [rest](desktop-bold-industrial-C-stats-rest.png) · [mid](desktop-bold-industrial-C-stats-mid.png) · [finished](desktop-bold-industrial-C-stats-finished.png) · [reduced](desktop-bold-industrial-C-stats-reduced.png) |
| desktop-clean-modern-A | [rest](desktop-clean-modern-A-stack-rest.png) · [mid](desktop-clean-modern-A-stack-mid.png) · [finished](desktop-clean-modern-A-stack-finished.png) · [reduced](desktop-clean-modern-A-stack-reduced.png) | [rest](desktop-clean-modern-A-stats-rest.png) · [mid](desktop-clean-modern-A-stats-mid.png) · [finished](desktop-clean-modern-A-stats-finished.png) · [reduced](desktop-clean-modern-A-stats-reduced.png) |
| desktop-clean-modern-B | [rest](desktop-clean-modern-B-stack-rest.png) · [mid](desktop-clean-modern-B-stack-mid.png) · [finished](desktop-clean-modern-B-stack-finished.png) · [reduced](desktop-clean-modern-B-stack-reduced.png) | [rest](desktop-clean-modern-B-stats-rest.png) · [mid](desktop-clean-modern-B-stats-mid.png) · [finished](desktop-clean-modern-B-stats-finished.png) · [reduced](desktop-clean-modern-B-stats-reduced.png) |
| desktop-clean-modern-C | [rest](desktop-clean-modern-C-stack-rest.png) · [mid](desktop-clean-modern-C-stack-mid.png) · [finished](desktop-clean-modern-C-stack-finished.png) · [reduced](desktop-clean-modern-C-stack-reduced.png) | [rest](desktop-clean-modern-C-stats-rest.png) · [mid](desktop-clean-modern-C-stats-mid.png) · [finished](desktop-clean-modern-C-stats-finished.png) · [reduced](desktop-clean-modern-C-stats-reduced.png) |
| mobile-bold-industrial-A | [rest](mobile-bold-industrial-A-stack-rest.png) · [mid](mobile-bold-industrial-A-stack-mid.png) · [finished](mobile-bold-industrial-A-stack-finished.png) · [reduced](mobile-bold-industrial-A-stack-reduced.png) | [rest](mobile-bold-industrial-A-stats-rest.png) · [mid](mobile-bold-industrial-A-stats-mid.png) · [finished](mobile-bold-industrial-A-stats-finished.png) · [reduced](mobile-bold-industrial-A-stats-reduced.png) |
| mobile-bold-industrial-B | [rest](mobile-bold-industrial-B-stack-rest.png) · [mid](mobile-bold-industrial-B-stack-mid.png) · [finished](mobile-bold-industrial-B-stack-finished.png) · [reduced](mobile-bold-industrial-B-stack-reduced.png) | [rest](mobile-bold-industrial-B-stats-rest.png) · [mid](mobile-bold-industrial-B-stats-mid.png) · [finished](mobile-bold-industrial-B-stats-finished.png) · [reduced](mobile-bold-industrial-B-stats-reduced.png) |
| mobile-bold-industrial-C | [rest](mobile-bold-industrial-C-stack-rest.png) · [mid](mobile-bold-industrial-C-stack-mid.png) · [finished](mobile-bold-industrial-C-stack-finished.png) · [reduced](mobile-bold-industrial-C-stack-reduced.png) | [rest](mobile-bold-industrial-C-stats-rest.png) · [mid](mobile-bold-industrial-C-stats-mid.png) · [finished](mobile-bold-industrial-C-stats-finished.png) · [reduced](mobile-bold-industrial-C-stats-reduced.png) |
| mobile-clean-modern-A | [rest](mobile-clean-modern-A-stack-rest.png) · [mid](mobile-clean-modern-A-stack-mid.png) · [finished](mobile-clean-modern-A-stack-finished.png) · [reduced](mobile-clean-modern-A-stack-reduced.png) | [rest](mobile-clean-modern-A-stats-rest.png) · [mid](mobile-clean-modern-A-stats-mid.png) · [finished](mobile-clean-modern-A-stats-finished.png) · [reduced](mobile-clean-modern-A-stats-reduced.png) |
| mobile-clean-modern-B | [rest](mobile-clean-modern-B-stack-rest.png) · [mid](mobile-clean-modern-B-stack-mid.png) · [finished](mobile-clean-modern-B-stack-finished.png) · [reduced](mobile-clean-modern-B-stack-reduced.png) | [rest](mobile-clean-modern-B-stats-rest.png) · [mid](mobile-clean-modern-B-stats-mid.png) · [finished](mobile-clean-modern-B-stats-finished.png) · [reduced](mobile-clean-modern-B-stats-reduced.png) |
| mobile-clean-modern-C | [rest](mobile-clean-modern-C-stack-rest.png) · [mid](mobile-clean-modern-C-stack-mid.png) · [finished](mobile-clean-modern-C-stack-finished.png) · [reduced](mobile-clean-modern-C-stack-reduced.png) | [rest](mobile-clean-modern-C-stats-rest.png) · [mid](mobile-clean-modern-C-stats-mid.png) · [finished](mobile-clean-modern-C-stats-finished.png) · [reduced](mobile-clean-modern-C-stats-reduced.png) |

[Desktop no-JS stack](desktop-no-js-stack.png) · [desktop no-JS stats](desktop-no-js-stats.png) · [mobile no-JS stack](mobile-no-js-stack.png) · [mobile no-JS stats](mobile-no-js-stats.png). [Browser results](browser-results.json) include touch, keyboard, no-JS, reduced-motion, overflow and page-error assertions.

## Recordings and acceptance

- [Desktop 1440×900 down → up → down](desktop-down-up-down.webm)
- [Mobile 390×844 down → up → down](mobile-down-up-down.webm)
- [Recording dimensions and frame counts](recordings.json)
- [43/43 regression commands](regressions/results.json), including build, TypeScript and expanded motion-v2 assertions; individual logs are in `regressions/`.
- [Motion/render/style size table](motion-size.json): **35,471 bytes gzip** of conservatively counted source against the **61,440-byte** ceiling.
- [Acceptance ledger](acceptance.json): 12/12 profiles, six Lighthouse gates, unchanged drone hero and precise fixture fact visibility.

Reproduction: run `node build.mjs`, then `node docs/build-evidence/004I/preview.mjs` for the loopback fixture at port 8120. Run `browser-qa.cjs`, `record.cjs`, `lighthouse.mjs` (six final cases), `full-regression.cjs` and `verify.cjs` from this directory. The scripts require the installed local browser/runtime and do not use credentials or external services.
