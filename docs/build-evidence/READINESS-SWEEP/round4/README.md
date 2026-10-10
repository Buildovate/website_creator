# Readiness sweep — Round 4

HEAD before this batch: 071107cc66b4cc7ff7bba105411384607c278987. Commit gate PASS.

Game 122/122 · Pay 44/44 · catalog 11/11 · domain 77/77 · ordering 16/16 · batch A 19/19 native, 19/19 PostgreSQL.

standalone: 182/192, 10 failures, 1 exit warnings

builds: 6/6, 0 failures, 0 exit warnings

suite102: 101/102, 1 failures, 0 exit warnings

postgres: 43/43, 0 failures, 0 exit warnings

All items attempted. No credits/provider calls. [Per-item changes](PRODUCT-FIXES.md), [quest evidence](EVIDENCE-CONTRACTS.md), [every before/after count](suite-counts.md), [gate](commit-gate.json), [Known failures](../KNOWN-FAILURES.md), [diff](batch-b.diff).

UI styling is unchanged. Game evidence shows the DB-derived 75-XP state with local synthetic provider fixtures; no fictional 100-XP state is shown. [Desktop](screenshots/game-75-desktop.png) · [Phone](screenshots/game-75-phone.png). Final-source gate reruns are recorded separately and preserve every initial sweep outcome. Internal review-capture artifacts are local test evidence in the isolated snapshot, not published or sent elsewhere.

## LAUNCH-READINESS

**Joe decisions:** B12 live credentials/provider approvals; B13 Growth and All-in prices; B14 the original 70 REJECTED/OPEN Borderlines; B29 purchase and owner-hosting controls; B30 past-due policy. Credit/proration settlement also needs agreed ledger/allocation semantics; the existing full-amount guard stays unchanged.

**Louie backend:** custom-domain routing, www SSL/provisioning and enabling/testing DOMAIN_CHECKS live. Local injected DNS/HTTPS proofs and /s/:slug publication are not a real-domain pilot or production deployment. The runtime smoke uses the existing Node AWS adapter with the compiled Worker and ephemeral PostgreSQL; actual workerd/Cloudflare runtime execution remains unverified.

**Code/test work:** two owning completion contracts for Virtual estimator and Marketing (25 XP total); any open checks in KNOWN-FAILURES.md, particularly protected replay/rail/style findings and review fixtures. Review failures continue to block the relevant publication; no QA bypass is introduced. PostgreSQL text coverage is not proof of exhaustive route/branch coverage. See postgres-coverage.json and remaining-failures.json.

[Current Known failures](../KNOWN-FAILURES.md) · [All counts](suite-counts.md) · [Product diff](batch-b.diff) · [Preservation](preservation-final.json). Commit metadata is written after the local commit in commit.json.

Additional PostgreSQL probes: 40 passed / 0 failed checks across 8 executions; 0 process failures. Runtime smoke errors: 0. [All probe results](probes.md).

Evidence formatters were corrected locally without rerunning any test or changing assertions. The finalized SQL report stores execution totals and trace SHA-256 values instead of repeating every matching trace line. Raw traces remain local and are not staged. Current failure causes and publication/owner outcomes supersede historical before-sweep descriptions in the root table.
