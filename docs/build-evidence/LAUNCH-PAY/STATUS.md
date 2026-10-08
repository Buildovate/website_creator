# LAUNCH-PAY status — PAY-1 catalog complete (2026-10-07)

- Worktree: `C:\Users\joe\wc-launch-pay`; branch: `launch/pay`; base: `b2446730d551656067f2aaa15a9c27497dceb8f7`; reserved test port: `5181` (unused by catalog tests).
- Input SHA256 checks passed: Pack 3 `CBDB30F34C8C4E672E95D2A878E0ED497A9812FCE9D6EC89A7FA8FB7AF97064D`; Pack 4 `8912285B4A210DEAF67603C29CF1ADAB622F9ADA03A4323066D13F28ADF845FE`. The owner-provided files are committed unchanged.
- PAY-1 has one versioned config, a read-only catalog reader/validator, and pure rental/ownership term helpers. Catalog: 75 rows = six plan cadence rows, three ownership/hosting rows, 13 launch add-on/fair-use rows, and all 53 distinct Pack 3/4 SKUs. Every add-on is `active:false`; no checkout or fulfillment is connected.
- Proposed plan amounts are stored but effective `priceCents:null` and `Price coming soon`: Website $50/$500, Growth $279/$2,790, All-in $449/$4,490 (month/year). Annual proposals are ten monthly payments. Joe has not approved Q1.
- Locked prices: `SITE-OWN` $1,500 once, `SITE-BUYOUT` $1,500 flat at any rental month, `OWNER-HOSTING` $50/month. Both ownership paths grant `site_owned` and require `OWNER-HOSTING`. Monthly rental minimum is three calendar months; annual prepay has no minimum. Rental cancel flags: site comes down, no export, contractor keeps domain, 90-day data hold. Static owner export is marked `not_built`.
- Pack 4 superseding scopes and prices are retained for overlapping rows, including three Seasonal Drop ideas, unlimited eligible Job Binders subject to disclosed limits, four email SKUs, and included email-domain setup on Email Growth/Pro. Timer eligibility is recorded only as conditional catalog metadata; Q9 remains open and no timer is implemented.

## Pack 3/4 values overridden by the locked LAUNCH-PAY ownership rule

1. Pack 3's `$700` base-website bundle comparison assumption is not a site price in this catalog. The locked ownership price is `$1,500`, and rentals follow the three-month minimum. Reason: Joe's 2026-10-07 rental/ownership rule overrides the older website comparison assumption.
2. Pack 3's `WEB+UGC-BUNDLE` `$849 once` remains recorded as `sourcePriceCents:84900` and `proposedPriceCents:84900`, but its effective `priceCents` is `null` and it is inactive. Its old `$700 + $197 - $48` arithmetic and the corresponding `$849` rep pitch cannot be offered as a base-site ownership bundle under the locked `$1,500` ownership price. Reason: do not sell a base-site ownership path below the locked buyout or one-time ownership amount. A future bundle needs Joe's revised price and scope.

No other Pack 3/4 source dollar amount was changed. Pack 4's explicit revisions to Pack 3 placeholders were applied as the later source, not as overrides of LAUNCH-PAY. The unapproved Pack 3 CRM connection `$149` is retained as a proposal with effective price `null`, per Pack 3's own owner-set wording.

## Verification and remaining gates

- `node --test tests/catalog.mjs`: 11 tests passed, 0 failed. Covers source coverage and prices, validation, integer cents, annual math, inactive/unpriced gating, immutable snapshots, plan inclusions, three-month calendar boundaries, flat buyout, and rental-cancel flags.
- Protected-file diff against BASE is empty; see `NOTES.md`. Full Suite-102 was not run. Known BASE `platform.mjs`/`platform-mobile.mjs` review-packet failure was neither run nor changed.
- Remaining PAY-1 commercial decisions: Q1 plan price approval; Q5 add-on activation; Q6 brand kit markup/partner costs; Q7 domain protection price; Q8 full social pack price; Q9 timer decision. Q2 website build quote remains separate. Tax treatment and provider connection remain unconfigured. No Stripe/provider call, key, credit, push, deployment or merge.
