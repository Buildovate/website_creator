# Clean release preview validation — 2026-10-12

One squashed commit on origin/develop (f9f4ec6f7dd8c9945ce19396718e83587550c337), containing the committed launch/integration tree (2211ea97cf97a8455a2d1db9566d2121348311d2) plus custom-domain backend (92f05d9e32989dcead2b0c952c6cbed1e270db09). Local held changes are excluded. Evidence is ignored and absent from the release tree. This branch supersedes PR #6 without merging, closing that PR or deleting launch/integration.

Hard-coded user paths in tests/scripts: 189 before, 0 after. CI uses repository paths and installed package/browser dependencies. Signed Stripe events must have a boolean livemode matching the configured secret/restricted key mode before any payment writes.

public/assets: 301831114 bytes before, 49491710 after; 820 files. Rasters use WebP; film encodes retain duration, aspect, frame rate and audio. Original assets remain in the external evidence archive. Exact dimensions/settings: [ASSET-ENCODING.json](ASSET-ENCODING.json).

## Executed gate

28/28 commands passed; 1380 reported tests/checks. Asset integrity, build, typecheck, both Worker builds and portable-path verification passed. All tests use offline fakes, SQLite/PGlite or mocked SDK clients; PostgreSQL coverage uses local PGlite, not an external server. All 719 converted images decoded; roofing, HVAC, solar and general-contractor pages passed at desktop/phone widths. Suite-102 was skipped as requested. The Game form and copy output directories were made self-contained and those two suites rerun.

| Suite | Tests/checks | Result |
|---|---:|---|
| payments | 10 | PASS |
| pay4a | 6 | PASS |
| pay4b | 5 | PASS |
| pay5 | 5 | PASS |
| catalog | 11 | PASS |
| game-progress | 40 | PASS |
| game-milestones | 16 | PASS |
| game-copy | 7 | PASS |
| game-autofill | 21 | PASS |
| game-experience-api | 18 | PASS |
| game-desktop-api | 16 | PASS |
| game-forms | 4 | PASS |
| domain-wizard | 79 | PASS |
| custom-domain-backend | 10 | PASS |
| custom-domain-routing | 7 | PASS |
| custom-domain-postgres | 6 | PASS |
| insertion-order | 16 | PASS |
| readiness-batch-a | 19 | PASS |
| readiness-batch-b | 10 | PASS |
| launch-decisions | 52 | PASS |
| domain-wizard-browser | 24 | PASS |
| release-asset-metadata | 261 | PASS |
| release-assets-browser | 737 | PASS |

## Remaining manual checks

[CUSTOM-DOMAINS.md](CUSTOM-DOMAINS.md) contains IAM, environment enablement, Host/TLS/cache requirements and the preview test-domain checklist. CUSTOM_DOMAINS_LIVE stays default-off. No AWS or Stripe provider calls, deployment or production changes occurred. Review lossy media quality before merge. See [KNOWN-FAILURES.md](../../KNOWN-FAILURES.md) for excluded historical diagnostics.

All 70 protected Borderlines remain REJECTED/OPEN, qaGateClear=false. The 12 protected QA/review production sources are byte-identical to the source tree. Thresholds, baselines and checksums were not rewritten.

Evidence archive: <Drive link pending>
