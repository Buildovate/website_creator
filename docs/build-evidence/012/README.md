# #012 — Footer empty states and required disclosures

Completed locally, 2026-09-24. Empty company and additional-location contact regions collapse completely, including label-only locations. Explore, service areas, configured social profiles and legal links remain. Required license/state and supplied policy text occupy their own row, independent of field toggles, with no duplicate license line.

The existing financing estimate disclaimer appears when financing is enabled. Supplied longer financing text uses a native disclosure, preserving keyboard access and a compact default layout. Existing claim, source and fallback rules remain; #027A review badges/captions/refresh changes are queued only.

## Desktop and mobile screenshots

| State | Desktop | Mobile |
|---|---|---|
| Primary location only | [Screenshot](desktop-single.png) | [Screenshot](mobile-single.png) |
| All contact fields hidden | [Screenshot](desktop-hidden.png) | [Screenshot](mobile-hidden.png) |
| All hidden + required license/disclosure | [Screenshot](desktop-required.png) | [Screenshot](mobile-required.png) |
| Primary + two additional locations | [Screenshot](desktop-multiple.png) | [Screenshot](mobile-multiple.png) |

Actual published local Roofing footers at 1440×1000 and 390×844. Images capture the complete footer; fixed page header, mobile action bar and skip-link chrome are hidden only during the stitched element screenshot. Separate browser assertions confirm the required line is readable with normal sticky chrome present. No footer styles or content are changed for captures. Every location, policy and financing value is a labeled fictional QA fixture.

## Executed checks

- `node build.mjs`: PASS, 276 assets / 14 kits ([output](build.txt)).
- `node --test tests/footer-policy.mjs tests/constitution.mjs tests/legal-policy.mjs tests/premium-service.mjs tests/website-pages.mjs`: **22 passed, 0 failed** ([output](tests.txt)). Includes 84 existing trade/layout legal-preview links/access controls.
- `node scripts/capture-footer.cjs`: PASS on both viewports ([output](browser-output.txt), [layout metrics](browser-metrics.json)). Four states, no document overflow/page errors, full-width mobile primary contact, no empty regions, two additional locations, required line, native keyboard financing toggle and HTTP 200 for both public legal links.
- Actual API checks: hidden-required facts stay private until publication; authenticated preview links retain their query; unauthenticated previews reject access; custom privacy/terms URLs remain; disclosure HTML is escaped; financing off removes its block; allowed optional claims still require policy/attestation.
- Visual review found one mobile CSS specificity collision. Fixed and recaptured; final images above show the resulting layout.

Reproduce after build with `node scripts/preview-footer.mjs` (port 8106), then the capture command. The fixture server uses an isolated in-memory local database/bucket; browser external requests are blocked. See [fixture manifest](local-fixture.json).

K23 real reviewed policy content remains **Needs review**, logged at the top of BUILD-STATUS and in NEEDS-KEYS. No new key or asset is needed for this ticket. No legal certification, lender connection or actual financing offer is claimed. Stopped after #012; no push, deployment, paid generation or external messages.
