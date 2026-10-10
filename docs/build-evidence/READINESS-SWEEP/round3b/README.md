# Readiness sweep — Batch Round 3b

Checkpoint commit **2c6085709e8b35476d0ac9586b640842ab2a1b97** on launch/integration. Original integration 972a218550fdd34457593310a1ac950e62fd25aa; incoming Game 1b56dc70183eaf7610a5217c8c6eacdfea4dfefd. Exact commit gate PASS; batch A eligible for its local commit after preservation verification.

Native gate: Game **122/122**, Pay **44/44**, catalog **11/11**, domain **77/77**, insertion ordering **16/16**. Full/client build, typecheck and both Worker outputs (dist/server and .data/028G) pass. New batch-A regressions **19/19 native**; PostgreSQL outcome is separately recorded below. Nothing outside this exact gate decides the commit.

Round 2 → Round 3b suite outcomes: standalone 178/187 → **181/188** (7 failed, 3 exit warnings included in passes); Suite-102 100/102 → **101/102**; PostgreSQL 34/38 → **39/39**; build/typecheck/asset gates **5/5**. Extra local PG probes **38 pass / 1 fail**. [Every suite's before/after counts](round3b/suite-counts.md), [structured outcomes](round3b/comparison.json), [gate](round3b/commit-gate.json). Suite-102 is a subset; these totals are not additive.

All items were attempted. Fixed B04/B05, B07/B08/B11, B09, B23/B24/B25. B10/B27 adapter and metadata fixes are implemented; prorated credit settlement is deferred because it needs pricing/accounting changes. B06 is deferred: creating empty records cannot supply missing real display/estimator/marketing evidence, and awarding those points would require changing locked rules or inventing activity. [Per-item details and diff links](round3b/PRODUCT-FIXES.md), [batch A display diff](round3b/batch-a.diff), [known failures](KNOWN-FAILURES.md). B12/B13/B14/B29/B30 remain owner decisions, unchanged.

The 8 baseline comparisons were retried with available prerequisites. Exact protected QA findings stay UNVERIFIED where the baseline stops earlier on its old Worker compiler/review prerequisites. media-api and uniqueness-api exit hangs are now confirmed PRE-EXISTING. [Baseline retry results](round3b/baseline-retry-results.json). Native/PG API fixtures reuse the existing manifest migration before read-only comparisons; the first-access core.one side effect observed in Part 1 is still documented, not hidden as a fixed product issue.

All checks run in isolated evidence output with provider egress blocked. Temporary planning-films bytes are restored. No original evidence is regenerated. The old invalid-coordinate PG probe remains a failing diagnostic; real validation still returns 400. [Local runtime responses](round3b/runtime-smoke.json), [probe invocations](round3b/probe-results.json). No account, real key, outbound provider request, money movement or customer deletion. Credits **0**.

## Changed-screen evidence

- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/billing-not-connected-1440.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/billing-not-connected-390.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/billing-portal-ready-1440.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/owner-download-paid-1440.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/billing-portal-ready-390.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/owner-download-paid-390.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/owner-download-refunded-1440.png
- C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b/screenshots/owner-download-refunded-390.png

[Per-item outcomes and NEXT](PRODUCT-FIXES.md) · [all counts](suite-counts.md) · [diff](batch-a.diff) · [known failures](../KNOWN-FAILURES.md) · [preservation](preservation-final.json).

The checkpoint includes the incoming merge, Round 1/2/3b fixture fixes, and the earlier Worker target, bundled pricing/Stripe dependency, Leaflet policy, prior Game test fixes and 44px Preview CSS. It was amended locally to include the previously unstaged earlier fixes; batch A working bytes were preserved. No held file is staged. Both commit SHAs are recorded in checkpoint-commit.json and batch-commit.json after commit.
