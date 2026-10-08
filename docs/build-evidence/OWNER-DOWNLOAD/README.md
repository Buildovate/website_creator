# OWNER-DOWNLOAD — Round 1

Status: STOPPED at the first verification failure. No retry, staging, or commit.

## Implementation left uncommitted

The button is in src/client/workspace/legacy-workspace.js, in the tenant website workspace heading. GET /api/tenants/:id/download uses src/static-site-export.js and src/static-zip.js. Authorization uses a server-owned paid site_ownership record; membership role and editable draft flags alone do not grant download access. Billing/checkout integration was not added.

## Verification

Command: node tests/owner-download.mjs

6 PASS / 1 FAIL. Monthly and annual rental denial, anonymous denial, cross-tenant denial, unpublished-owner endpoint denial, and unpublished-owner server state passed. The assertion at tests/owner-download.mjs:48 failed: "one-time owner gets published static ZIP" (expected HTTP 200). The test did not record the actual response status/body, so the endpoint cause remains undiagnosed. See tests.log and results.json.

ZIP content/security checks and browser screenshots were not reached. No ZIP contents or visible/disabled button states have been verified in a browser.

## Preservation

Held files: 228/228 match the MERGE-1 round2 preservation manifest, including BUILD-BACKLOG.md. No staged files. No protected public product, QA, source-lock, or baseline changes from this task. The existing held docs/build-evidence/027A-part2/vite-out.log diff is unchanged and included in the matching manifest. HEAD: b76f98f6081d28b2fb17c57a64a24870a7a65da3.

All 70 original Borderlines remain REJECTED/OPEN; qaGateClear=false. Provider calls: 0. No push or deploy.

## Authorized single-case response diagnosis

The published-owner ZIP case ran once. HTTP 409, content type application/json, body: `{"error":"A public asset could not be exported: /assets/images/layers.png"}`. Existing public/assets/leaflet.css:359 references images/layers.png; that image is absent from public and dist/client. This is not a typo in a file created this round. Stopped without product edits, suite rerun, screenshots, staging or commit. Held work still 228/228 unchanged. See results.json responseDiagnosis and published-owner-response-probe.mjs. Provider calls: 0. All 70 original Borderlines remain REJECTED/OPEN, qaGateClear=false.

## Read-only vendor asset review

Scanned all 14 published export pages and 87 referenced local assets using the existing export reference collector. layers.png is the Leaflet layer-selector toggle icon; no exported page contains that control and no application initialization of that control was found outside the vendor library. Missing assets: /assets/images/layers.png (404), /assets/images/layers-2x.png (404), /assets/images/marker-icon.png (404). Because there are additional missing assets, the authorization condition was not met. Stopped before any product edit, suite rerun, screenshots, staging, or commit. See asset-inventory.json. Held work remains 228/228, zero provider calls, all 70 original Borderlines REJECTED/OPEN, qaGateClear=false.

## Three unused Leaflet images — approved narrow exception

All 14 export pages have zero direct references to layers.png, layers-2x.png or marker-icon.png. No layer selector is initialized; the map pins in src/client/site/portfolio.js:61 use L.divIcon. The exporter now tolerates a 404 for exactly those three paths only when discovered through /assets/leaflet.css, and not if directly referenced by a page or another asset. No images or Leaflet CSS were changed. Every other missing asset still fails.

## Suite rerun — final stop

The authorized single rerun completed 51 PASS and 1 FAIL at tests/owner-download.mjs:69, "protected git diff empty". The sole Git diff is the pre-existing held docs/build-evidence/027A-part2/vite-out.log. All 1,927 protected files kept their pre-run bytes. Separately re-verified held work 228/228 including that log and BUILD-BACKLOG.md. No retry, test change, staging or commit.

The published owner and flat buyout ZIP requests returned 200; monthly and annual renters were denied. ZIP: 99 entries, 22,883,335 bytes, including 14 published HTML pages and local CSS/JS/media/fonts. Tests passed for excluding draft/private sentinels, server/source/package files, environment and credential filenames. All six desktop/phone browser states and the published-owner browser download passed; screenshot paths are in results.json. Log: tests-leaflet-exception.log. Provider calls: zero. All 70 original Borderlines REJECTED/OPEN, qaGateClear=false.

## Owner-approved commit exception — 2026-10-08

Joe approved committing OWNER-DOWNLOAD with the sole failed assertion, "protected git diff empty", recorded as a pre-existing held-log exception. docs/build-evidence/027A-part2/vite-out.log is not edited, staged or reverted. The raw result remains FAIL (51 passed checks, one assertion failure); this record does not rewrite test history or any QA decision. No tests were rerun. All 1,927 protected file bytes were unchanged during the run; held work was re-verified 228/228 before staging. All 70 Borderlines remain REJECTED/OPEN, qaGateClear=false.

Only this ticket's code, tests and small evidence/six screenshots are included. published-fixture.zip is a generated 22,883,335-byte test artifact and is intentionally left untracked in place. No push or deploy.
