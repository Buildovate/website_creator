# Round 4 — final product batch

Started from 071107cc66b4cc7ff7bba105411384607c278987 on launch/integration. Provider calls and credits: 0. Tests run only in the isolated snapshot; original held/evidence files are never regenerated.

| Item | Attempt / implementation | Verification |
|---|---|---|
| First-access manifest | Added validation-only readOne; Game authorization uses readOnly access, including tenant GET used by existing forms. Personal tour writes do not initialize site metadata. Explicit site writes retain existing ensure/migration flow. | readiness-batch-b native and PostgreSQL; snapshot tenant/public settings and history before/after reads. |
| B06 | Existing contracts documented individually in EVIDENCE-CONTRACTS.md; seven available quests checked against real saved records, including the existing reviews API response. Estimator and marketing alone deferred. | The original six-state fixture derives 60 XP; the actual filtered review-response fixture adds 15. No saved links/forms fabricate the missing 25 XP. Six focused receipt regressions cover expiry, configuration changes, empty/failing replies, isolation and read purity. |
| B15 | Built Worker, real paymentHarness settlement, owner PUT, real staff browser packet/approval, publication, anonymous live response, cancellation/404 and ownership/refund/download denial. | readiness-paid-publish native and PostgreSQL; no pre-written QA approval or public snapshot in this E2E. |
| B16 | The prior coverage report had one unobserved SQL text: SELECT human,status FROM chat_threads WHERE id=? (src/engagement.js:23). Added its grounded assistant completion/lock-release branch using an intercepted local response, plus existing permission/failure/backup/session/settlement probes. Corrected coordinate test retains rejection and exercises valid backup/restore. | PG replays, route probes and SQL-text coverage report. Text matches are not exhaustive branch coverage. |
| Teardown | Brand helper's early PASS is now followed by a RUN marker; suite final PASS comes after explicit context/browser close. Media/uniqueness final PASS comes after queued review jobs and DB pool close. All assertions unchanged. | Full standalone executions; exit warnings are reported separately. No forced process.exit or timer/threshold weakening. |
| Coordinate diagnostic | Reject out-of-range coordinates with 400; add valid city coordinates/date to the separate project/photo backup fixture. | pg-route-probe; no product validation changed. |

The proration/full-amount guard, pending decisions B12/B13/B14/B29/B30, protected QA findings and 70 original REJECTED/OPEN Borderlines remain unchanged. No UI styling/content changes or new UI screens were made; no screenshot represents fabricated 100-XP completion.

## Verification provenance

Reviews evidence was completed after the initial build/core portion of the sweep. The complete final-source commit gate was rerun, preserving initial results in results.json and recording the reruns in final-gate-results.json. Its 23 commands passed. The late Reviews suite is recorded separately (6/6 native) and is included in the PostgreSQL sweep.

Game screenshots show **75 XP from actual local saved records**, not a supplied progress object. The company, payment event, domain proof and intercepted provider reply are clearly fictional QA fixtures; no provider is contacted. The initial capture omitted the existing Google policy-link prerequisite, correctly derived 60 XP, and was not used. The corrected capture also verifies that removing those links invalidates its response receipt. A temporary Playwright cleanup containment error was corrected by putting TEMP/TMP under round4/tmp; only the capture-created temp directory was removed. No test assertion or product visibility rule was changed.

The existing review API regression checks were rerun against the final receipt implementation: review-rating-filter, review-lookup, engagement-providers and trade-upgrade passed. automatic-qa-contract stopped before its live-review checks: the sweep had regenerated its shared packet-list input, whose first packet was now clear, while the test requires a packet with pending Borderlines. This is an unresolved fixture-input dependency, not demonstrated damage from the receipt. No QA input, detector, gate or assertion was edited. The protected review source includes only specific workspace kinds, excluding review_response from its version hash.

B15's first native run correctly stopped on 48 placeholder findings: the new test overrode the media fixture's Sample Fictional business-name marker while retaining a fictional 555 phone. Restoring that existing explicit fictional marker in the test alone made both E2E cases pass (2/2). All save, actual capture, staff-decision, publication, anonymous 200, cancellation/404, ZIP and refund/403 assertions remain. No approval/report was fabricated, no phone was replaced with a supposedly real contact, and no QA rule was changed. Initial and corrected outcomes are both preserved.

Sweep-command corrections: the PostgreSQL coordinator was initially invoked with the child containment loader, which remapped its read-only suite-results input into a nonexistent snapshot path; no PostgreSQL suite executed in that attempt. The corrected coordinator omits NODE_OPTIONS only for its orchestration process. Every test child still uses host.mjs and the PostgreSQL fixture loader. The initial log and pg-coordinator-correction.json are retained. Runtime smoke was first invoked from the scratch directory, so its local migration path did not exist; correcting cwd to the snapshot made all routes execute, with zero errors. No product, migration, test assertion or remote connection was changed for either invocation correction.

## Final recorded verification

| New regression | Native | PostgreSQL |
|---|---|---|
| readiness-batch-b | 10/10 (PASS) | 10/10 (PASS) |
| readiness-paid-publish | 2/2 (undefined) | 2/2 (PASS) |
| readiness-chat-sql | 1/1 (PASS) | 1/1 (PASS) |
| readiness-review-evidence | 6/6 (PASS) | 6/6 (PASS) |

All four focused files total 19 cases on each database. [Per-item diff links](change-index.md), [coverage scope and unmatched texts](postgres-coverage.json), [every suite and initial/rerun provenance](comparison.json). Existing teardown checks are 420 brand, 481 media and 418 uniqueness; all finish cleanly.
