# PostgreSQL probes and local runtime smoke — Round 4

These are additional route probes, not extra Suite-102 suites. Worker execution uses the existing Node AWS adapter, not an actual workerd runtime. No provider traffic.

| Probe | Checks passed | Checks failed | Process exit | Evidence |
|---|---:|---:|---:|---|
| probe-pg-route-probe.mjs | 13 | 0 | 0 | [JSON](pg-route-probe.json) |
| probe-pg-remaining-boundaries-probe.mjs | 2 | 0 | 0 | [JSON](pg-remaining-boundaries-probe.json) |
| probe-pg-engagement-route-probe.mjs | 11 | 0 | 0 | [JSON](pg-engagement-route-probe.json) |
| probe-pg-remaining-local-probe.mjs | 9 | 0 | 0 | [JSON](pg-remaining-local-probe.json) |
| probe-pg-backup-probe.mjs | 1 | 0 | 0 | [JSON](pg-backup-probe.json) |
| probe-pg-cancel-site-probe.mjs | 1 | 0 | 0 | [JSON](pg-cancel-site-probe.json) |
| probe-pg-owner-settlement-probe.mjs | 2 | 0 | 0 | [JSON](pg-owner-settlement-probe.json) |
| probe-pg-settlement-replay-probe.mjs | 1 | 0 | 0 | [JSON](pg-settlement-replay-probe.json) |



| Runtime request | HTTP status |
|---|---:|
| /api/setup | 200 |
| /api/tenants | 200 |
| /healthz | 200 |
| /api/payments/tenants/60eace00-605f-4cac-878e-9013e626d573/billing | 200 |
| /api/payments/tenants/60eace00-605f-4cac-878e-9013e626d573/add-ons | 200 |
| /api/payments/tenants/60eace00-605f-4cac-878e-9013e626d573/add-ons/checkout | 200 |
| /api/payments/webhook | 503 |
| /api/payments/webhook | 400 |
| /s/readiness-roofing-qa/pricing?preview=1 | 200 |
| /api/tenants/60eace00-605f-4cac-878e-9013e626d573 | 200 |
| /api/game/60eace00-605f-4cac-878e-9013e626d573 | 200 |

No-key checkout is an honest Not connected response, not a successful provider checkout. Webhook without a key is unavailable; a configured local synthetic secret with no signature is rejected. Full responses and any errors are retained in runtime-smoke.json.
