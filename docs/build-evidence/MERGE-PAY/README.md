# Pay integration verification

Merged source: 52a0b096733670a733868656f8d0f239281e4a9f into launch/integration at cca241ade09269bc3cf0f39e2da4dc2829941713. Game was not merged. No push, deployment, provider call or credit use.

## Conflict resolution

- src/client/styles/platform/index.css retains Domain, Billing and Add-ons imports once each.
- src/client/workspace/legacy-workspace.js retains Pay Billing/Add-ons section entries, labels and renderers, and the existing owner-download button. The button expression is identical to integration HEAD. The changes occupy independent expressions within one long source line; no competing behavior was selected or rewritten.

## Checks (one run each)

| Check | Passed | Failed |
|---|---:|---:|
| tests/catalog.mjs | 11 | 0 |
| tests/stripe-sync.mjs | 6 | 0 |
| tests/stripe-checkout.mjs | 9 | 0 |
| tests/stripe-no-key.mjs | 2 | 0 |
| tests/payments.mjs | 5 | 0 |
| tests/entitlements.mjs | 6 | 0 |
| tests/pay4a.mjs | 6 | 0 |
| tests/pay4b.mjs | 5 | 0 |
| tests/pay5.mjs | 5 | 0 |
| Pay browser scenarios | 15 | 0 |
| Header logo / edge cases | 340 + 6 | 0 |
| Header navigation | 16422 | 0 |

Isolated client build passed: 13 client outputs, 3 style outputs. Pay browsers used local fictional fixtures and reported zero external requests. All migrations execute successfully in the in-memory Pay harness. Header navigation covers 1,632 trade/Look/name states and eight evidence widths.

The existing Pay Worker-build exception remains open (node:crypto, node:fs, missing stripe package). This merge verification uses the same accepted isolated-client build. No full Worker build, platform-mobile or Suite-102 run; no fresh platform-mobile pass is claimed.

## Preservation

229 held files, including BUILD-BACKLOG.md, match their pre-merge SHA-256 hashes. None is staged. All 16 original Pay screenshots were backed up before browser tests and restored afterward. Historical header-logo evidence was backed up and restored; navigation outputs used this new directory. Protected QA source, detector, baseline, threshold and checksum staged diff is empty. All 70 Borderlines stay REJECTED/OPEN; qaGateClear=false.

## Fresh captures

- [ pay4a-billing-desktop.png ](screenshots/pay4a-billing-desktop.png)
- [ pay4a-billing-mobile.png ](screenshots/pay4a-billing-mobile.png)
- [ pay4a-locked-feature.png ](screenshots/pay4a-locked-feature.png)
- [ pay4a-owned-site.png ](screenshots/pay4a-owned-site.png)
- [ pay4b-allowed-desktop.png ](screenshots/pay4b-allowed-desktop.png)
- [ pay4b-allowed-mobile.png ](screenshots/pay4b-allowed-mobile.png)
- [ pay4b-early-desktop.png ](screenshots/pay4b-early-desktop.png)
- [ pay4b-early-mobile.png ](screenshots/pay4b-early-mobile.png)
- [ pay4b-switch-desktop.png ](screenshots/pay4b-switch-desktop.png)
- [ pay4b-switch-mobile.png ](screenshots/pay4b-switch-mobile.png)
- [ pay5-disconnected-desktop.png ](screenshots/pay5-disconnected-desktop.png)
- [ pay5-disconnected-mobile.png ](screenshots/pay5-disconnected-mobile.png)
- [ pay5-owned-desktop.png ](screenshots/pay5-owned-desktop.png)
- [ pay5-owned-mobile.png ](screenshots/pay5-owned-mobile.png)
- [ pay5-ready-desktop.png ](screenshots/pay5-ready-desktop.png)
- [ pay5-ready-mobile.png ](screenshots/pay5-ready-mobile.png)

Header guard captures and detailed geometry are in header-nav/after/. Fresh screenshots and bulk guard output remain local untracked evidence; this merge records this README and results.json only.
