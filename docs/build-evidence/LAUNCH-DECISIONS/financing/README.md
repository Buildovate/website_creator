# Ownership pay-over-time financing — local test mode

Starting commit: ab45f069bc7e61c6697954d6625df13bede119e0, branch launch/integration. Local follow-up commit: see commit.json (written after commit). No push, deployment, account connection, payment/vendor API calls or credits.

## What changed

- The single $1,500 SITE-BUYOUT checkout uses a separate Stripe payment-method configuration with only card, Klarna and Affirm. Monthly/annual rentals, legacy SITE-OWN, owner-hosting checkouts, add-ons and mixed carts use card only. Owner-hosting subscriptions explicitly accept card only and retain the rental’s card, rather than the financed purchase method. Prices, rental minimum, next-cycle hosting and existing amount guards are unchanged.
- Both configurations are validated as active, test-mode, available and containing exactly the allowed methods. Missing configuration is an honest Not connected state; unexpected methods and live configurations are rejected. No configuration is created or modified by this feature.
- Billing adds approval-qualified text under the $1,500 price and locally served official marks. No monthly financing amount, APR, approval or payment guarantee is claimed. The existing ownership action/save flow is reused.
- Signed checkout.session.completed and checkout.session.async_payment_succeeded events grant ownership only when payment_status is paid. Pending completion and declined async payment leave ownership, rental access and hosting unchanged. Session creation time makes completed/async success settlement stable; exact and distinct-event replays do not duplicate the ledger or restart hosting. Receipt lookup includes async success.
- Tests use the existing paymentHarness and Stripe/billing fakes. Related SQL is exercised by the actual local PostgreSQL adapter (PGlite), not a fake SQL response.

## Before go-live — Joe

1. In Stripe Dashboard **Settings > Payment methods**, enable **Klarna** and **Affirm** and complete any Stripe eligibility requirements. Checkout decides availability for the buyer; approval is not promised.
2. Create/choose two separate [payment-method configurations](https://docs.stripe.com/payments/payment-method-configurations): card only, and card + Klarna + Affirm only. Put their real Dashboard IDs in **STRIPE_CARD_PAYMENT_METHOD_CONFIGURATION** and **STRIPE_OWNERSHIP_PAYMENT_METHOD_CONFIGURATION**, respectively. These pmc_ IDs are configuration, not credentials. The local fake IDs are test fixtures, never production defaults.
3. Keep the signed webhook subscribed to checkout.session.completed, checkout.session.async_payment_succeeded and checkout.session.async_payment_failed. Existing settlement/refund events remain required. Use the existing runtime secrets STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY and STRIPE_WEBHOOK_SECRET; Joe enters keys in the secret store himself. This release still refuses live keys/configurations. A separately authorized live-mode release and real card/financing eligibility checks are required before live use.
4. Verify card/Klarna/Affirm for the ownership-only checkout in Stripe’s sandbox, and confirm recurring charges/add-ons show card only. No external checkout, financing approval, money movement or live account was exercised here.

Stripe recommends separate configurations for different flows. See [Affirm Checkout](https://docs.stripe.com/payments/affirm/accept-a-payment?payment-ui=checkout), [Klarna Checkout](https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=checkout) and [paid webhook fulfillment](https://docs.stripe.com/checkout/fulfillment). The explicit card-only subscription payment_settings preserves Joe’s narrower owner-hosting requirement.

## Official marks

Unmodified SVGs extracted from the corresponding PaymentMethodCard logos on [Stripe’s official payment-method page](https://stripe.com/payments/payment-methods), read-only. No checkout/account API was called. Source elements, date and SHA-256 are in public/payment-marks/SOURCES.json. Artwork is not redrawn, recolored or mixed with third-party icons.

## Verification

| Suite | Pass |
|---|---:|
| Game | 122/122 |
| Pay | 44/44 |
| catalog | 11/11 |
| domain | 77/77 |
| ordering | 16/16 |
| financingNative | 28/28 |
| financingPostgreSQL | 28/28 |
| launchDecisionsNative | 52/52 |
| launchDecisionsPostgreSQL | 52/52 |
| browser | 16/16 |

Total: 446 checks, no failures. Build (client + Cloudflare Worker + AWS server Worker), isolated Workers runtime/client prerequisite build and typecheck pass. Template asset integrity: 813 referenced files, 17 kits. See results.json, commit-gate.json and logs/.

Phone/desktop checks cover decoded marks, exact qualified copy, no invented financing terms, 44px ownership action, keyboard reachability, no horizontal overflow, no page errors/provider traffic and full-opacity accessible text with sampled rendered backgrounds. Minimum normal-text contrast in these captures: 7.18:1 (4.5:1 gate). Screenshot resolution: desktop 1440×900, phone 390×844.

- screenshots/own-website-desktop.png — Billing, ownership offer, local QA fixture.
- screenshots/own-website-phone.png — Billing at 390px, ownership offer, local QA fixture.

Per Joe’s speed rule, Suite-102 and full standalone/PostgreSQL sweeps were skipped. Only related suites and the defined core gate ran. Tests wrote exclusively to the isolated evidence snapshot, protecting all earlier evidence. 229 held files are byte-identical, protected QA diff is empty, and the original 70 Borderlines remain REJECTED/OPEN with qaGateClear=false. See preservation.json.

## Scope and deferred work

No pricing, credit/proration, QA acceptance, public templates, homepage/drone or unrelated modules changed. Nothing within this local feature is deferred. Dashboard enablement, buyer/provider eligibility, live-mode release and a real go-live payment remain manual/live work; no financed checkout was sent or claimed successful outside local fakes.

Diff: diffs/financing.diff. Changed source/tests/assets: changed-files.json.

Runner note: the older PostgreSQL launch-decision suite was interrupted by the initial 120-second evidence-runner limit while its assertions were passing (fresh databases/migrations took roughly 3.8 seconds per fixture). The unchanged suite was rerun alone with a 300-second limit and passed 52/52 in 134 seconds. The initial log and result are retained; no assertion or product code was changed for this. 

