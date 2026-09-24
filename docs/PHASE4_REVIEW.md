# Phase 4 review

Implemented locally on feature/local-environment-setup. No commit, push, merge or deployment.

## Changes

- README Architecture links the foundation plan, client layout and auth/module documentation; Docker is the primary runtime path.
- Initial workspace failures show a retry action, clear busy state and discard stale error messages on retry. Network failures use actionable messages while preserving unsaved forms.
- Workspace/private-preview errors have app recovery pages. API failures remain JSON with their correct status, without exposing internal error details.
- Sign-out uses an accessible in-page confirmation with a safe cancel action, followed by the existing CSRF-protected session revocation.
- AWS responses add nosniff and referrer policy. Workspace pages receive same-origin framing, limited CSP, noindex and no-store. Same-origin editor previews still work. HSTS is limited to shared HTTPS origins and is absent locally.
- Existing Origin plus session-CSRF checks remain mandatory for private mutations. Public visitor APIs and signed webhooks retain their separate rules.

## Verification

Passed npm run build, npm run typecheck:client, npm run test:client, npm run test:auth and npm run test:aws. Added checks cover startup retry, unavailable-database HTML/JSON, header scope and public-page compatibility.

Browser verification used a separate disposable in-memory website fixture: one intentional asset-request failure produced the retry screen; retry recovered the workspace. The editor loaded under the headers, a changed headline saved, canceling sign-out preserved the editor and confirming sign-out reached the signed-out page. Server checks confirmed the saved value, published only the disposable fixture and verified anonymous public access.

The primary Docker stack was rebuilt and GET /healthz returned HTTP 200 with ok=true, environment=local, database.ok=true and authMode=dev-header. Login protections and the anonymous workspace redirect also passed. OPENAI_API_KEY remains blank. The disposable fixture was stopped; its records were never written to the primary Docker database.

## Remaining limits

All 16 older domain suites remain blocked by the original missing asset bundle, including roofing.jpg (confirmed in Phase 3). Full visual comparison is therefore not claimed. Existing test coverage remains intact.

Shared preview/production authentication remains reported as disabled and has not been changed. Hosted login, provider/ALB SSO logout and shared deployment need real configuration and separate authorization. The CSP is intentionally a compatibility baseline, not a full script-source policy. Remaining legacy feature orchestration is described in CLIENT_ARCHITECTURE.md.

CRM implementation files and live environments were not changed. Stop here for review.

## Final local review follow-up

Fixed CSRF comparison of malformed non-ASCII header values: equal character counts but unequal UTF-8 byte lengths now return a normal 403 instead of triggering a comparison exception. Added an HTTP regression test. Build, type checks and auth tests pass; Docker rebuilt and the required health contract passed again. Missing original assets and shared-provider configuration remain the readiness blockers.
