# #057A — custom domain connect wizard

Branch: feature/057A-domain-wizard. Base HEAD: b2446730. Round 1g validation complete for local commit; no push or deployment. Earlier stops below are historical.

## Inventory before implementation

- Existing: owner-only GET/POST domains, TXT verification, registrar guide, manual launch records, scoped workspace JSON.
- None of the nine requested CloudFront/domain environment keys were read by existing source. No custom-host routing or SSL provisioning exists. No conflicting domain-routing implementation was found.
- Existing app/storage region remains us-west-1. Domain service region is separately us-east-1; no AWS client or operation was added.
- Expected held state matched: 229 modified and 3,769 untracked status entries. Held file hashes still match except the explicitly edited ticket paths. BUILD-BACKLOG.md stays unchanged and unstaged.

## Implemented

Tenant/version/owner-scoped manual wizard; provider overrides; nameserver detection via an injected adapter; www CNAME; Route 53 alias, flattening, or 301 forwarding steps; environment-gated optional IP records; per-piece status; tenant-matched HTTPS proof; three-minute check cadence; idempotent pending internal help record after 48 hours; printable server-rendered no-JS instructions; platform token styles and reduced motion. Old ownership cards and controls remain.

The production DOMAIN_CHECKS adapter is not connected. It must implement authoritative NS lookup, TXT proof, www DNS, bare alias/redirect, certificate validation and an actual HTTPS load returning verified tenant identity. With no adapter, checks explicitly stay Not connected and never Live. The help record does not send a message or reserve a booking.

## Exact stop

Build PASS (810 assets / 17 kits). Build-regenerated roofing-critical-css.js matches its pre-build backup.

The test-launch command failed opening its log because this evidence directory did not exist. PowerShell stopped before Node started. No test was run or retried; browser screenshots and existing tests were not run. This directory was subsequently created only to record the stop. See results.json and ../057A-build.log.

## Deferred locked-plan scope

Buying and the paid $15 option (#057C), old-site scan/keep/merge/redirect/archive (#057D), traffic/Search Console (#057E), live delivery notifications (#057F), renewals (#057G), billing (#057H), Google Workspace (#057I/J), real help booking (#057K), and the setup rail (#057B). No static IPs were supplied.

## Questions for Louie before live backend connection

1. Supply preview/prod targets and alias-zone values through the environment; confirm the tenant API/connection group and scoped role permissions in us-east-1.
2. Which adapter provisions and proves the www hostname/certificate and maps custom Host to the tenant? Current repo only routes /s/:slug.
3. What authoritative evidence identifies the loaded tenant and verifies bare HTTPS 301 forwarding vs alias/flattening?
4. Which internal queue consumes pending domain_help records and notifies support? No delivery integration is claimed.

0 credits, 0 provider calls. All #028F evidence and the original 70 open Borderlines remain untouched.

## Round 1b — first test failure

Evidence and screenshots directories were created before commands. The unchanged build passed (810 assets, 17 trade kits); generated Roofing CSS matches the backup.

`node tests/domain-wizard.mjs` failed once, at line 53: `404 {"error":"Not found."}`, expected 200. The test calls `json()` without the tail argument; its request builder appends `undefined`, yielding `/domain-planundefined`. No wizard/test fix or retry was made. Remaining tests and screenshots were not run. No commit or staging. See domain-tests.log and results.json round1b.

All 14 round-1 file hashes and held-file hashes still match. BUILD-BACKLOG.md unchanged. 0 provider calls / 0 credits.

## Round 1c — browser selector failure

Only the two approved missing-tail calls at tests/domain-wizard.mjs:53 and :57 changed (`await json()` → `await json('')`). Reversing those substitutions reproduces the original test hash. No product code or assertion changed.

- Build PASS (810 assets / 17 kits); generated Roofing source matches its backup.
- Domain state/API test PASS: 77 checks, mocked DNS/HTTPS.
- Domain browser test FAIL at line 20 before any screenshot or check: `[data-section=domains]` resolves to the Domains tab and a Launch Pad Set up button. Playwright strict mode rejected the ambiguous locator.
- Existing tests and APEX screenshots NOT RUN. No retry or additional fix, no staging or commit.

See domain-tests.log and results.json round1c. Held files, BUILD-BACKLOG.md and all other round-1 file hashes are unchanged. 0 provider calls / 0 credits.

## Round 1d — duplicate-selector diagnosis

No foreign file changes; branch feature/057A-domain-wizard on b2446730. No product or test edit yet.

| Matching control | Parent | 1440 | 390 |
| --- | --- | --- | --- |
| `<button data-action="section" data-section="domains">Domains</button>` | `nav.tabs.bv-tabs` | Visible | Hidden |
| `<button class="secondary bv-button" data-action="section" data-section="domains">Set up</button>` | `div.record`, Launch Pad Domain ownership step | Visible | Visible |

Both controls already exist in b2446730. There is one Domains entry in the nav, plus a task shortcut. This is neither two responsive nav variants nor a duplicate added by round 1. Asked Joe to authorize scoping the test to actual navigation without removing the shortcut. Full outerHTML/parent records: domains-controls-diagnosis.json.

## Round 1e — approved selector fix and validation stop

Desktop uses `nav.tabs.bv-tabs [data-section=domains]`; phone opens the Launch Pad and its `div.record [data-section=domains]` shortcut. No app code or assertions changed.

| Command | Result | Count |
| --- | --- | --- |
| node build.mjs | PASS | 810 assets / 17 kits |
| node tests/domain-wizard.mjs | PASS | 77 checks |
| node tests/domain-wizard-browser.mjs | PASS | 23 checks |
| node tests/platform.mjs | FAIL | Project publication at line 34 rejected: Complete the review packet before approval. |
| Remaining existing tests / APEX set captures | NOT RUN | First-failure stop; no retry |

Test commands: 2 PASS / 1 FAIL. No commit or staging. Build-regenerated Roofing source matches its backup. Held work, BUILD-BACKLOG.md and other round-1 file hashes unchanged.

### Saved screenshots (APEX_IPS empty)

- [alias-1440.png](alias-1440.png)
- [alias-390.png](alias-390.png)
- [flatten-1440.png](flatten-1440.png)
- [flatten-390.png](flatten-390.png)
- [forward-1440.png](forward-1440.png)
- [forward-390.png](forward-390.png)
- [no-js-390.png](no-js-390.png)

APEX_IPS set captures remain unrun. Existing tests/aws-adapter.mjs includes a real OpenAI /v1/models egress probe, so it cannot be run unchanged under this ticket's zero-provider-call rule; it was not run.

Full current results: results.json round1e. Full logs: domain-tests.log, ROUND 1E sections. 0 credits / 0 provider calls / no push or deploy.

## Round 1f — platform failure is pre-existing

An isolated temporary git worktree at b2446730 was built once (PASS, 810 assets / 17 kits), then tests/platform.mjs ran once. It failed at line 34 with the same project-publication rejection: **Complete the review packet before approval.** This proves the failure is pre-existing; no fix is proposed or applied in #057A. The existing packet validator rejects incomplete packets (src/review-packets.js:114).

The first command approval was blocked because the reviewer attributed the AWS adapter test's OpenAI probe to platform.mjs. Read-only source proof showed that platform.mjs makes only in-memory Worker dispatches; the same command was approved on re-evaluation and executed once. aws-adapter.mjs was never run.

The temporary worktree and its dependency junction were removed, with original dependencies intact. No app/test edits, staging or commit. All round-1/held/planning file hashes and BUILD-BACKLOG.md are unchanged; 0 provider calls / 0 credits.

Evidence: [baseline build log](round1f-baseline-build.log), [baseline test log](round1f-baseline-platform.log), [diagnosis](round1f-diagnosis.json).

## Known issue #057A-T — legacy platform test

`tests/platform.mjs:34` fails with “Complete the review packet before approval.” The same failure was reproduced once in a clean b2446730 worktree in round 1f. Joe authorized skipping only this test in round 1g. It is unchanged and not fixed in #057A.

## Round 1g — final validation and commit scope

No app or test code changed in this round. The remaining workspace, AWS adapter and platform styling commands passed. The AWS adapter egress request was replaced at runtime by the evidence preload with a local 401 response; no real provider request was made and live egress was not verified.

| Check | Result | Count / evidence |
| --- | --- | --- |
| Build (round 1e) | PASS | 810 assets / 17 kits |
| Domain state/API (round 1e) | PASS | 77 checks |
| Domain browser (round 1e) | PASS | 23 checks |
| Workspace | PASS | exit 0, assertions unchanged |
| AWS adapter, local egress mock | PASS | exit 0; aws-egress-mock.json |
| Platform styling | PASS | 341 selectors / 7 font faces |
| Platform | SKIPPED, pre-existing #057A-T | identical baseline failure proved in round 1f |
| Platform mobile | PRE-EXISTING #057A-T2, excluded | identical 409 at b2446730; round1g-baseline-mobile.log |
| APEX_IPS-set capture | PASS | 6 checks / 2 screenshots |

Totals across completed ticket validation: 5 passing test commands, 0 new failures, 2 proven pre-existing failures excluded; plus successful build and capture proof. Historical failures in domain-tests.log are retained. No assertions were weakened or edited.

### Known issue #057A-T2 — legacy platform mobile publication

The unchanged tests/platform-mobile.mjs fails at line 17 before browser launch: HTTP 409, expected 200, “Complete the review packet before approval.” An isolated b2446730 worktree was built once and the same test failed once with the identical message and line. This is pre-existing and excluded under Joe’s round 1g rule; no fix was applied. The temporary worktree and dependency junction were removed.

### A-record screenshots

CUSTOM_DOMAIN_APEX_IPS was set only in the capture process environment to the documentation-range value 192.0.2.10. DNS/ownership checks are mocked. Both screenshots show the configured A-record alternative alongside Route 53 instructions, and were visually reviewed. No horizontal overflow or browser errors occurred.

- [Phone 390×844](screenshots/apex-set-390.png) — full page.
- [Desktop 1440×900](screenshots/apex-set-1440.png) — full page.
- [Capture result](apex-capture.json).

All 14 ticket source/test hashes match round 1e, held work and all 203 planning-document hashes match, BUILD-BACKLOG.md remains unchanged and excluded, and generated Roofing CSS still matches its pre-build backup. Only the 14 ticket files plus this folder’s small evidence, tools and nine screenshots are included in the local commit. No dist, dependencies, credentials, other-ticket evidence or held work is staged. 0 credits / 0 real provider calls / no push / no deployment.

## #057A-T round 2 — pre-existing test issues resolved

Both legacy tests now complete the normal staff review API flow using clearly fictional sample data and actual local browser evidence. The mobile test also re-reviews the changed questionnaire version immediately before its second UI publication. Application code, approval rules and original assertions are unchanged.

Build and all six requested test commands passed: domain 77 checks, domain browser 23, header logo 340 + 6, nav-fit 16,422 checks / 1,632 states, mobile 210 states / zero layout failures or browser errors, and platform exit 0. The #057A-T / #057A-T2 entries above are historical and fixed in the tests.

[Round 2 notes](057A-T2-notes.md) and [results/hash proof](057A-T2-results.json). Runtime captures, backups and full local logs are intentionally left untracked. Held work and BUILD-BACKLOG.md unchanged. 0 credits / 0 real provider calls / no push or deploy.
