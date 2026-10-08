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

## PAY-2: Stripe TEST-mode sync and checkout, offline build

- Added `scripts/stripe-sync.mjs`: TEST-key guard, versioned `sku@version` lookup keys, Product/Price create and metadata update, immutable-amount mismatch rejection, idempotent rerun, and a no-call `--dry-run`. With the current unapproved catalog it has no saleable row to sync.
- Added `src/payments/checkout.ts`: server catalog price check against a synced TEST Price, payment/subscription mode selection, tenant-scoped Customer lookup/reuse, one idempotency key per click, amount-field rejection, and clear unavailable/coming-soon errors. Checkout requires TEST secret, publishable and webhook key names and configured tax treatment. The default no-key result is `Payments not connected`.
- Added `src/client/workspace/billing.ts` as an unmounted Buy-button renderer for PAY-4/PAY-5. Without keys the Buy button stays visible but disabled beside `Payments not connected`; it has no charging handler. No billing route or page is mounted in PAY-2.
- Added only blank `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` names to `.env.example`; changed only K09 in `NEEDS-KEYS.md` to record Stripe selection and missing TEST access.
- The Stripe SDK is not installed or cached. The offline service and sync use an injected client; a later approved live TEST run would first install the SDK. No key was supplied, stored, logged or committed. All tests used an in-memory fake and clearly fake placeholder strings.

### PAY-2 verification

- `node --test tests/stripe-sync.mjs`: 6 passed, 0 failed.
- `node --test tests/stripe-checkout.mjs`: 9 passed, 0 failed.
- `node --test tests/stripe-no-key.mjs`: 2 passed, 0 failed (rerun after the button renderer correction: 2 passed, 0 failed).
- `node --test tests/catalog.mjs`: 11 passed, 0 failed.
- Fake-backed `stripe-sync --dry-run` output: `DRY RUN — no Stripe calls: products created 0, products updated 0, prices created 0, prices updated 0, skipped 75 (inactive 56, price coming soon 19).` The fake's read and write counters both remained zero. A synthetic approved fixture planned four Products and four Prices, with 71 rows skipped; the second fake sync made zero changes.
- No full Suite-102, provider/Stripe network request, real key, credit, push, deploy or merge.

### Owner inputs and commands for a later live TEST-mode run — not executed

1. Choose the existing or new Buildovate **Stripe TEST account**, answer Q3 Stripe Tax and tax treatment, and approve a saleable catalog price/activation. Current catalog rows are all unavailable, so an unmodified live sync would create nothing. Complete PAY-3's verified webhook path before allowing a real checkout; the PAY-2 button is not mounted.
2. Supply `STRIPE_SECRET_KEY` (`sk_test_` or authorized `rk_test_`), `STRIPE_PUBLISHABLE_KEY` (`pk_test_`), and `STRIPE_WEBHOOK_SECRET` (`whsec_` from the TEST listener) through server secrets only. The webhook secret's prefix does not identify its environment; the owner must verify it belongs to TEST. Never paste values into chat or `.env.example`.
3. After approving network/package work, run `npm install stripe --save` inside `C:\Users\joe\wc-launch-pay`, review its lockfile change, then `node scripts/stripe-sync.mjs --dry-run` and `node scripts/stripe-sync.mjs` with TEST secrets supplied through the server environment. The first command makes no provider call; the second would call the TEST account and is forbidden in this round.
4. There is no live checkout command yet: PAY-3 must add webhook settlement, and later PAY-4/PAY-6 must mount the authenticated checkout UI/route. Do not infer payment or grant entitlements from a fake session or a manual Paid label.

PAY-3 is next and was not started.
