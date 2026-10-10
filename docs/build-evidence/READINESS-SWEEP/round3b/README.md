# Round 3b checkpoint

The exact native/build commit gate passes: Game 122, Pay 44, catalog 11, domain 77, insertion ordering 16; build, typecheck and both Workers pass. PostgreSQL is reported separately, as Joe directed.

Four Game fixtures now reuse paymentHarness migrations and explicitly seed production tenant/member/admin/record columns for PostgreSQL. Native setup and every assertion are preserved. The replay facade counts actual affected PostgreSQL rows for total_changes(); it does not bypass the read-only assertions.

PostgreSQL progress 40/40 and autofill 21/21 pass. Desktop API 15/16 and experience API 4/18 expose the existing core.one manifest adoption side effect on a tenant with a real slug: settings change from {} during reads. These are recorded INTRODUCED/product; no product fix or assertion weakening in Part 1.

Eight unchanged-baseline comparisons were retried after client prerequisites were compiled. The baseline QA helper still requests platform browser and cannot resolve node:crypto/node:fs; style review stops at the approval prerequisite. Remaining comparisons continue in isolated evidence; uncertain classifications stay UNVERIFIED.

## Gate

| Check | Result |
|---|---|
| full-build | PASS |
| isolated-worker-build | PASS |
| pay4a-isolated-build | PASS |
| typecheck | PASS |
| game-progress | PASS |
| game-milestones | PASS |
| game-desktop-api | PASS |
| game-experience-api | PASS |
| game-autofill | PASS |
| game-copy | PASS |
| game-forms | PASS |
| catalog | PASS |
| payments | PASS |
| stripe-sync | PASS |
| stripe-checkout | PASS |
| stripe-no-key | PASS |
| entitlements | PASS |
| pay4a | PASS |
| pay4b | PASS |
| pay5 | PASS |
| domain-wizard | PASS |
| insertion-order | PASS |

All 229 held hashes and protected tracked source match the initial snapshot. All 70 Borderlines remain REJECTED/OPEN; qaGateClear=false. Zero provider calls or credits. No push/deploy/config change.
