# Launch decisions — Batch Round 5

Branch: launch/integration. Starting commit: 6e799f50f67ba1aae48770c46ce493040fcaf64a. Joe approved these decisions on 2026-10-10. Local changes only; no provider calls, sent emails, deploy, push or credits. Commit gate PASS. Full sweep finished; see the honest open findings below.

## Decisions and implementation

| Decision | Result | Implementation / diff |
|---|---|---|
| Prices | Website $50/month and $500/year; Growth $150/month and $1,500/year; All-in $300/month and $3,000/year. All six are active approved prices. Catalog validation/freezing are unchanged. Admin catalog seeds and snapshots match; existing admin-edited products and recorded revenue/cost history are untouched. | [pricing diff](diffs/prices.diff), config/pricing.v1.json; src/expense-plans.js |
| Past due | Day 0 and day 7: live. Days 8–29: readable public HTTP 503, noindex, editor writes denied on the server with Update payment; Billing remains reachable. Day 30: public HTTP 404, rental cancelled, domain retained, data held until day 120. Repeated maintenance cannot extend the hold. Before day 30, payment restores access immediately with no fee. Owned-site hosting follows the same access deadline without removing ownership/export rights. | [timeline diff](diffs/past-due.diff), src/payments/lifecycle.js; src/core.js; src/worker.js |
| Reminders/retries | Reminder emails with actual saved recipient, text and timestamp are queued locally at days 0, 7, 8 and 29; there is no sender. Day-30 cancellation also queues locally if the payment adapter is unavailable; a connected TEST adapter cancels with no proration/final invoice. Repeated passes reuse the same key. Stripe Smart Retries remains an account setting to verify before go-live; no vendor setting was changed. | [timeline diff](diffs/past-due.diff) |
| Proration | Same-cadence tier upgrades quote the real provider's prorated difference and request immediate payment; the plan changes only on verified settlement. Downgrades start next renewal with zero charge now. Cancellation remains at paid-period end, with the existing three-month monthly minimum. No refunds or customer credits. Quotes persist tenant, subscription, old/new SKU, expected line net, recorded tax and total. Exact replay and concurrent click keys cannot double-charge a quote. The normal full-price guard stays; later renewals cannot reuse old proration metadata. A failed prorated upgrade invoice leaves an already-paid current plan live; a later verified payment uses the same quote guard. | [proration diff](diffs/proration.diff) |
| Own / Stop hosting | Own your site, $1,500 is available during the monthly minimum, with no credit for rent already paid. Verified purchase ends rental without proration and starts $50/month owner hosting at the next confirmed future paid cycle. If that cycle is missing or already expired, rental still ends, ownership/export are retained, and hosting shows Pending schedule; no immediate hosting charge is guessed. Stop hosting ends at paid-period end; the existing ownership/refund-protected ZIP export remains available. Owner/admin mutation permissions and tenant isolation are enforced by the existing Billing API. | [ownership diff](diffs/ownership.diff) |
| Estimator / Marketing | Estimator: one saved, offered service with a valid price range. Marketing: saved GBP/review link or a tenant-scoped connected social account. Both derive from real product records without completion rows. All nine quests can reach 100 XP. A link never fabricates the First post badge. The 100-XP screenshots are explicitly local QA fixtures, not a customer claim. | [quest diff](diffs/quests.diff) |
| Live keys | Unchanged: TEST-only. No credentials read or stored. No Stripe account or other provider was connected. | src/payments/checkout.ts:28–34; src/aws/env.js:22 |
| Borderlines | Read-only trace below. Original 70 stay REJECTED/OPEN, qaGateClear=false. | [preservation proof](preservation.json) |

## Deferred boundaries

Monthly ↔ annual cadence changes need an approved effective-date rule. They remain unavailable instead of inventing an unused-term refund or credit; monthly/yearly tier changes within the same cadence work. Payment after day 30 records the receipt but does not silently reinstate a cancelled agreement. Reopening that agreement needs an explicit restart policy. There is no automatic customer-data deletion in this round: the existing 90-day hold marker is retained. No email delivery provider or live Stripe connection is enabled. The start date for owner hosting without a confirmed future paid cycle is DEFERRED pending a scheduling rule. Short-lived upgrade quotes must be reviewed again after a billing-adapter restart; the amount guard and idempotency rules remain in force. Automatic approval review rejected an optional cold-start quote reconstruction because it could trust caller-supplied billing timestamps without proven persisted validation. That additional change was not applied.

## Verification

Game **122/122** · Pay **44/44** · catalog **11/11** · domain **77/77** · ordering **16/16** · batchA **19/19** · batchB **19/19** · newNative **52/52** · newBrowser **16/16** · batchAPostgres **19/19** · batchBPostgres **19/19** · newPostgres **52/52**

standalone: 188/194 passed; 6 failed; 1 exit warnings.

builds: 6/6 passed; 0 failed; 0 exit warnings.

suite102: 102/102 passed; 0 failed; 0 exit warnings.

postgres: 44/44 passed; 0 failed; 0 exit warnings.

[Every before/after count](suite-counts.md), [all original sweep outcomes](results.json), [final-source rechecks](rechecks.json), [exact commit gate](commit-gate.json), [Known failures](../READINESS-SWEEP/KNOWN-FAILURES.md). No protected finding was fixed or waived.
 All original and corrected invocations will be retained in results.json/rechecks.json. The initial failed build prerequisite is retained locally under failed-prerequisite/ and is not counted as executed test assertions. This folder’s ignore file keeps the isolated snapshot, temporary DBs, backups and SQL traces private/local; the final logs, comparisons, diffs and screenshots are committed. Syntax and stale-fixture corrections preserve assertions or replace them with the newly approved rule. A focused 52-case run initially passed 51: the declined-upgrade fixture quoted $500 but supplied a $50 invoice. Its quote was corrected to $50; all assertions stayed, and the corrected run passed 52/52.

Tests run against an isolated copy under this folder, using Pay's paymentHarness and the real local PostgreSQL adapter. Filesystem hooks keep all regenerated prior evidence in that copy; original evidence needs no restoration because its bytes never change. Provider egress is blocked at fetch, Node HTTP transports and browser DNS. Temporary planning-films.json writes are confined to the copy and restored. Recorded Leaflet / vite-out.log / platform-mobile packet exceptions are retained. The Cloudflare and isolated Worker bundles are compiled, and the AWS/local runner exercises the server routes; this does not claim an actual workerd runtime or live-provider integration check.

## Screenshots

All captures are real PNG viewport captures: desktop 1440×900 and phone 390×844. The Billing and Game views use their actual components and real locally seeded records, with an explicit QA fixture label; all payments/provider data are local fakes. The paused page is the actual public response. Reduced motion is enabled for component captures. No screenshot was composited or reused.

| Screen | Desktop | Phone |
|---|---|---|
| Approved prices | [pricing-desktop.png](screenshots/pricing-desktop.png) | [pricing-phone.png](screenshots/pricing-phone.png) |
| Billing / Own | [billing-own-desktop.png](screenshots/billing-own-desktop.png) | [billing-own-phone.png](screenshots/billing-own-phone.png) |
| Billing / Stop hosting | [billing-stop-hosting-desktop.png](screenshots/billing-stop-hosting-desktop.png) | [billing-stop-hosting-phone.png](screenshots/billing-stop-hosting-phone.png) |
| Public payment pause | [paused-site-desktop.png](screenshots/paused-site-desktop.png) | [paused-site-phone.png](screenshots/paused-site-phone.png) |
| Editor locked | [editor-locked-desktop.png](screenshots/editor-locked-desktop.png) | [editor-locked-phone.png](screenshots/editor-locked-phone.png) |
| Real-record 100 XP fixture | [game-100-desktop.png](screenshots/game-100-desktop.png) | [game-100-phone.png](screenshots/game-100-phone.png) |

[Rendered contrast/pixel evidence](contrast-pixels.json). All body text requires 4.5:1, large text 3:1; text stays at opacity 1. Phone actions require 44px. No horizontal page scrolling. [Browser results](browser-results.json).

## Borderlines and publication

The stored flag is not a global off switch for every trade. Approval/publication is checked per tenant, exact saved revision, manifest and report hashes: src/review-packets.js:87 and :177. Any rejected or undecided Borderline on that revision makes its QA summary false; src/qa-gate.js:15–25 computes this without regard to trade. src/review-packets.js:140 rejects publication with HTTP 409, and :158 prevents staff approval. Every website publish calls it at src/api.js:62, project publish at :66, and workspace-record publish at src/workspace.js:43.

Consequently the affected 70-findings revisions cannot be newly approved/published through launch while those findings stay REJECTED/OPEN. It does not stop compiling or starting the server, and public rendering does not take an already published site offline solely because of this evidence flag. Independently approved clean revisions/sites can publish.

Options without changing these 70 decisions: fix affected site content/layout, create a new revision, capture fresh evidence and obtain approval; or launch only sites with their own clear, approved packets. Reusing a rejected/open revision would require a separate explicit QA-policy decision from Joe. No bypass is implemented.

## Runtime config / go-live checklist

Exact names: STRIPE_SECRET_KEY is the future restricted-key secret; STRIPE_PUBLISHABLE_KEY is the client key; STRIPE_WEBHOOK_SECRET is the signing secret. STRIPE_TAX_CONFIGURED='1' is a non-secret flag, only after the actual tax configuration/registrations have been verified. APP_ORIGIN is the canonical HTTPS origin. They are passed through src/aws/env.js. Joe enters secrets himself in the hosting secret store; no value is printed here.

The current guard intentionally refuses sk_live_*, rk_live_* and pk_live_* at src/payments/checkout.ts:30. A live restricted key must **not** be inserted yet: a separately authorized live-mode release is required before the real-purchase test can run.

1. Resolve launch-blocking code findings and approve each exact site revision. Keep the original 70 historical decisions unchanged.
2. Louie verifies custom-domain routing, www SSL and the DOMAIN_CHECKS live adapter; install the required DB migration in the authorized release.
3. Authorize and verify a controlled live-mode path first. Joe then enters the restricted live key, publishable key and webhook signing secret in the secret store, with least required permissions.
4. Verify approved catalog amounts/lookup keys and tax treatment/registrations, signed webhook handling, the Customer Portal, and Stripe Smart Retry settings. Verify failed-upgrade retention, proration line metadata/tax, next-cycle ownership conversion and a fresh quote after restart in the authorized provider pilot. Enable a reminder delivery provider only after separate authorization; this round queues messages but sends none.
5. Verify scheduled lifecycle maintenance runs: seven-day grace, pause on day 8, cancellation on day 30, fixed 90-day hold, and idempotent cancellation retries. No destructive purge is added here.
6. Joe selects the pilot SKU and amount, makes one real purchase using his own card, then refunds it through Stripe. Check the verified ledger and access reversal; if the pilot is an ownership purchase, also verify ownership removal and the blocked owner export. Cancel any pilot subscriptions/schedules afterwards so they cannot create a later charge. This checklist does not execute a purchase, cancellation or refund.
7. Confirm monitoring and a rollback path before enabling customer traffic.

## LAUNCH-READINESS

Joe: approve cadence-switch/restart boundaries and owner-hosting scheduling when no future paid cycle exists if needed; authorize the later live-mode release and enter keys; complete the one-purchase/refund check; resolve any QA-policy question without modifying the held 70 decisions.

Louie backend: custom-domain routing, www SSL, DOMAIN_CHECKS live, secret-store/runtime wiring, signed webhooks, Smart Retry account settings, lifecycle scheduling and an authorized reminder provider.

Code: 6 standalone and 0 PostgreSQL failed suite outcomes remain; see [Known failures](../READINESS-SWEEP/KNOWN-FAILURES.md) and [all counts](suite-counts.md). The existing protected QA findings remain open; build success is not evidence of launch approval. Live mode is deliberately still blocked. No provider calls, email sends, credits, push or deployment occurred.
