# Phase 3 review

Implemented locally on feature/local-environment-setup. Stopped before Phase 4.

## What changed

Extracted the workspace shell, visual editor, shared form/transport helpers, public portfolio/inquiries and public-effect entrypoints into src/client. Split the app stylesheet into ordered modules. scripts/build-client.mjs emits the existing browser filenames; Worker HTML URLs and the Node AWS runtime remain compatible.

The editor and shell use explicit state/callback boundaries. New interfaces/helpers use TypeScript; moved legacy effect/editor bodies retain JavaScript. The older feature orchestration remains in legacy-workspace.js, with the unchanged enhancement scripts still injected at a validated build boundary. This is an incremental extraction, not a complete rewrite of every legacy feature.

See CLIENT_ARCHITECTURE.md for source/output mapping and remaining work.

## Verification

- Passed build, TypeScript check, AWS adapter tests, auth tests and new client-module tests.
- CSS source split verified byte-for-byte with its original rule order.
- Disposable in-memory browser fixture: sign in as website owner, open editor, choose mobile preview width, change headline and save draft.
- Confirmed the saved headline through the server, published only that disposable fixture and checked anonymous public access.
- Browser public portfolio search narrowed to one matching demo project; a test inquiry saved successfully. No browser console errors were reported.
- All 16 pre-existing domain suites still stop at the missing original roofing.jpg fixture. They were run, not removed or marked passing. Complete visual comparison remains unavailable without the asset bundle.
- Primary Docker stack rebuilt; final health checked separately before delivery.

## Scope

No commits, pushes, merges, live deployments, DNS changes, external CRM edits or provider activation. Local Docker business data was not seeded for browser tests; the separate fixture used a disposable in-memory database and bucket. OPENAI_API_KEY remains blank.
