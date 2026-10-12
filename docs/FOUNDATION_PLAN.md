# Website creator foundation plan

Phase 1 only — 23 September 2026. Review baseline: `f9f4ec6` on `feature/local-environment-setup`, branched from `develop`. This document proposes later work; it does not implement authentication or change live configuration.

## Scope and evidence

This is `Buildovate/website_creator`, not `Buildovate/buildovate`. The website product has its own sales/contact modules named `crm*`; those are existing website-product features, not authorization to modify the separate CRM checkout or its infrastructure.

Required reading completed: README, setup, environment and AWS migration docs, OPERATIONS, DESIGN_RESEARCH, knowledge architecture and module documents, then schema, AWS auth/server, Worker, API and workspace implementations. Supporting inspection included core authorization, build/Vite configuration, browser bootstrap, env templates, migrations and tests.

The user and [auth module](modules/auth.md) report `AUTH_MODE=disabled` on preview and production. That is the recorded live state, not an independently verified cloud observation in this phase. Example files specify `alb-oidc`; templates do not establish deployed security. Older README/OPERATIONS/environment prose still describes Sites as production or AWS as not provisioned. Do not treat those historical statements as a current inventory. No EB, DNS, provider or production database was accessed.

Authoritative operational instructions remain in [setup.md](../setup.md), product limits in [OPERATIONS.md](../OPERATIONS.md), and domain facts in [modules](modules/). This plan owns the proposed migration sequence, not a second configuration manual.

## Existing entrypoints and ownership

| Entrypoint | Actual behavior | Retain/change |
| --- | --- | --- |
| `npm run build` → `build.mjs` | Copies `public/` to `dist/client`; injects three enhancement files into the `CRM_ENHANCEMENTS` marker in `public/app.js`; bundles ExcelReader as an IIFE and `src/worker.js` as browser-compatible ESM into `dist/server/index.js`. Copies Sites metadata/migrations to `dist/.openai`. | Keep working while introducing separate typed client entrypoints incrementally. This is esbuild, not a Vite production build. |
| `npm run dev` → `vite.config.mjs` | Imports `tests/preview-fixture.mjs`: in-memory SQLite and bucket, seeded sample tenants/projects, injected owner identity. Proxies selected routes to the built Worker; serves built `app.js`. | Explicit QA fixture only. It does not exercise AWS auth or persistent Compose data. Never use it as product login. |
| `npm run aws:start` → `src/aws/server.js` | Node HTTP → Fetch Request → `applyAuth` → built Worker → Node Response. Loads Postgres/D1 compatibility, S3/MinIO and static assets. Rewrites some Sites HTML login chrome. | Primary product runtime. Preserve Node ESM and port 8080. |
| `docker-compose.yml` + `Dockerfile` | Node 22 production image, with local env overriding NODE_ENV to development; Postgres 16, MinIO and bucket-init job; migrations on boot locally. | Primary development and acceptance path. Preserve volumes and health contract. |
| `docker-compose.dev.yml` + `Dockerfile.dev` | Separate dev image tag, source mounts, build on process start. | Editing loop after first setup; restart is currently required. |
| `src/worker.js` | Shared domain dispatcher. Ordered handlers precede `/api/*`, HTML and object/static routes. | Keep as compatibility facade while extracting modules. Route order is behavior. |
| Sites Worker runtime | Same bundle with D1/R2 and hosting-injected identity, without AWS `applyAuth`. | Compatibility only; do not reconnect Sites as the product identity solution. |

Public files are not a separate SPA. `src/views.js` renders dashboard HTML and chooses public site rendering; `src/cinematic.html`, `src/cinematic.js`, `src/showcase.js`, `src/trade-components.js`, `src/cutaway.js`, `src/blog.js`, `src/pricing.js` and `src/workspace.js` generate public/draft HTML. `public/*.js` progressively enhance those pages. Static kit/recipe JSON is imported by server code as well as fetched by the browser. Uploaded photographs come from `/media/:id` through object storage, not `public/assets`.

Largest browser sources at baseline: `public/app.js` 144,344 bytes, `public/app.css` 52,038, `public/crm-enhancements.js` 38,012, `public/control-ui.js` 18,882 and `public/engagement-ui.js` 14,610. The enhancement scripts depend on the enclosing app IIFE's variables/functions; changing a filename or script tag alone will break them.

## Domain invariants to preserve

- `tenants.settings` is draft; `tenants.published` is a separate snapshot, with status and optimistic version checks. Project and workspace publication are also independent. A save is not a publish.
- `src/core.js` owns `person`, `identity`, `access`. `admins` supplies platform admin/operator status; active `members` rows supply tenant owner/editor/viewer status. Identity providers prove identity, not those roles. Membership failures intentionally conceal tenant existence with 404.
- `src/api.js` retains tenant ownership checks, render-without-save, upload/photo ownership, publish backup, invite binding/revocation and version conflicts. `src/workspace.js` retains scope/kind rules and plan gates. Keep these checks inside domain handlers after adding middleware.
- Public `/s/:slug`, projects, blog, pricing, pages/forms and explicitly published media stay public only under their existing publication checks. `/preview/:slug`, `?preview=1`, design previews and private media remain authorization checked.
- Public inquiries/chat/reviews, published proposal links and signed SMS callbacks have distinct authorization models. A blanket login gate on `/api/*` would break legitimate visitor flows.
- The existing owner-email bootstrap is separate from login. Signing in must not silently initialize the platform, add memberships or elevate roles.
- Drizzle currently authors **SQLite** schema/migrations (`db/schema.ts`, `drizzle.config.ts`). AWS translates DDL/queries through `src/aws/ddl.js`, `migrate.js`, `sql.js` and `d1.js` into Postgres. Postgres is the durable AWS source of truth, but the domain is not yet using native Drizzle/Postgres queries. Preserve the translation boundary initially; do not introduce Prisma or another database.
- Keep noindex, truthful illustrative labels, reduced-motion behavior, saved design settings, existing UUIDs and cinematic/public presentation. No provider activation or paid generation is required.

## Current problems, grounded in code

1. **No application browser session.** `src/aws/auth.js` supports four modes but has no cookie/session store or login/logout endpoints. `dev-header` accepts arbitrary local identity headers. `public/app.js` sends none, so normal navigation cannot establish that identity.
2. **Broken AWS sign-in journey.** `rewriteSitesChrome` changes server HTML links to `/`, not a login flow. The anonymous sign-in link is also constructed dynamically in `public/app.js`; rewriting HTML cannot fix that JavaScript-generated `/signin-with-chatgpt` URL. Shell loading/sign-out copy remains tied to Sites.
3. **Partial boundary hardening.** `applyAuth` strips the two Sites identity headers and ALB headers, but retains local dev headers, and strips Authorization only in Cognito mode. The resolved user is converted into trusted Worker headers without an explicit Node request identity context. Ordinary API requests must not be authenticated by arbitrary client dev headers once sessions exist.
4. **Configuration gaps.** The dev guard keys off NODE_ENV, not APP_ENV; preview with an incorrect development NODE_ENV could accept dev identity. Cognito audience is checked only when a client ID is set. ALB verification has no configured expected signer binding; real ALB header/payload claim handling must be checked against its actual token format, not only the synthetic test JWTs. Key rotation/error cases need coverage. `requestUrl` trusts forwarded host/proto without a configured trusted-proxy boundary.
5. **Session response is incomplete.** `/api/session` returns `user` (id, email, admin, staff, platformRole) and `initialized`, and writes last-seen. It does not return tenant memberships, session expiry, application login/logout targets or CSRF data. Preserve existing fields for old callers.
6. **Large shared browser closure and coupled routing.** App state, requests, editor, design composer and navigation coexist in one IIFE plus text-injected extensions. Worker routing is a sequence of mixed public and private handler calls. An incremental adapter/facade is safer than a new framework or second server.
7. **Test and asset baseline is incomplete.** There are no tracked files under `public/assets`. Fixtures require `roofing.jpg` and later `finished-roof.jpg`; presentation checks additionally require genuine image/film assets. Do not replace visual assets with arbitrary placeholders or delete asset assertions to make tests green.
8. **CI does not cover the full product.** Current CI runs build + AWS tests; PR triggers omit base `develop`. There is no aggregate domain-test script or TypeScript checking. Historical passed-test notes are not a passing baseline for this checkout.

## Proposed structure and incremental moves

No moves happen in Phase 1. Keep existing entrypoint filenames as facades until their replacement has equivalent tests.

```text
src/aws/                    Node entrypoint, env, database/storage adapters
src/auth/                   new typed session store, HTTP routes, CSRF, request policy
src/client/
  shared/                   API client and session types
  auth/                     sign-in, expiry and sign-out UI
  app/                      shell, navigation, tenant selection, explicit app state
  editor/                   preview, dirty state, draft save, publish controls
  workspace/                existing website-product workspace features
  site/                     public interactions, cinematic controls, maps, forms
src/routes/                 eventual public/private domain route modules
src/render/                 eventual dashboard and public HTML renderers
public/                     authored static JSON, images, films and transitional assets
```

| Existing source | Destination/sequence | Compatibility check |
| --- | --- | --- |
| `public/app.js` request helper and session bootstrap | Phase 2 thin bridge to `src/client/shared/api.ts`, `session.ts`; new login entry. Leave editor logic in place. | JSON and JPEG requests, 401 handling, roles and pending edits. |
| `src/aws/auth.js`, `server.js` | Phase 2 integrate typed `src/auth/` helpers; keep Node ESM entrypoints and Worker bridge. | Health, transport, cookies and all modes. |
| Dashboard `src/views.js` and Worker auth errors | Phase 2 minimal runtime-aware auth links; Phase 3 renderer extraction. | Sites compatibility without claiming it is AWS login. |
| Rest of `public/app.js`, injected enhancement scripts | Phase 3 extract explicit state/actions into app/editor/workspace modules, one feature at a time; retire text injection last. | Invite acceptance, role-specific navigation, optimistic conflicts, editor/publish flows. |
| `public/app.css` | Phase 3 split tokens/base, shell, forms/dialogs, editor and feature styles, preserving ordering and selectors. | Desktop/tablet/mobile comparison; no redesign. |
| `public/site.js`, cinematic/showcase/cutaway/trade scripts and CSS | Phase 3 independent site entrypoints; keep existing URLs as emitted compatibility bundles initially. | Keyboard, reduced motion, film controls, map/gallery fallback and one real inquiry form. |
| `src/worker.js`, `src/api.js`, `src/workspace.js` | Later Phase 3 small route extractions with identical precedence and authorization. | Public allowlist, per-tenant scope, snapshots, private media, failures. |
| Schema and database adapters | Keep now. Consider native Drizzle/Postgres repositories only after API/session boundaries are stable. | SQLite domain tests + Postgres adapter/transaction parity. |

Use TypeScript for new modules and actual type checking (esbuild transpilation alone is insufficient). Proposed Phase 2 build: bundle the new server auth entry `src/auth/index.ts` to `dist/auth/index.js` for Node, with packages external; keep `src/aws/server.js` as entrypoint and import that output. Bundle the small browser auth bridge separately. Existing Dockerfile already copies all `dist`, and the dev override already mounts `src` and runs the build; no new production loader or runtime TS dependency is needed. Do not change the Worker bundle to Node platform. A full Vite production migration is deferred; Vite can remain a QA tool until the fixture problem is fixed.

## Phase 2: proposed auth contract and UX

### Local sign-in and sessions

- `GET /login`: visibly labeled **Local development sign-in** when APP_ENV=local and mode=dev-header. Require email and stable user id; do not prefill the bootstrap owner or claim that locally entered email has been verified by an IdP.
- `POST /auth/local-session`: bounded, validated same-origin request; available only in that local configuration. Use the existing identity normalization/resolution code through a deliberate login adapter, not browser identity headers on ordinary requests. Reject this endpoint for shared environments.
- Create a cryptographically random opaque session token; store only its hash, identity, mode, creation and absolute expiry in a dedicated session table. Proposed default TTL: one hour, no sliding refresh in the first version. Rotate on sign-in; invalidate replaced and logged-out sessions. This generates runtime tokens, not fabricated provider credentials or a pasted signing secret.
- Cookie: host-only, HttpOnly, SameSite=Lax, Path=/, bounded Max-Age. Secure on HTTPS; plain HTTP exception only for local loopback. No tokens in localStorage, HTML, URLs or logs. Use a distinct name from the visitor-chat cookie.
- Database lookup resolves session → identity. Read current platform/tenant roles from the existing tables; never persist authorization roles in the cookie. Revocations therefore take effect without waiting for cookie expiry. Expired sessions fail closed; bounded cleanup removes expired rows.
- `POST /auth/logout`: same-origin/CSRF checked, revoke the database session and expire the cookie with matching attributes. Then offer configured provider logout, if any. Do not use a state-changing GET logout.
- Retain `/api/session` as an anonymous-safe GET with `user: null`; authenticated responses add membership roles, expiry, login/logout targets and CSRF token. Keep `initialized` and existing user booleans. Return no-store. Middleware may decorate the Worker response with runtime session metadata; the Worker still queries domain roles.
- Bind local Compose published ports to loopback in Phase 2: a local identity picker must not become a LAN-accessible login service. Preserve port numbers and volume names.

### Request boundary, public routes and shared modes

Node middleware attaches a resolved identity/context to the request, then forwards only the sanitized internal identity headers to the existing Worker. Delete all client Sites/dev identity headers before the normal dispatch path; consume and remove provider credential headers after verification. Preserve `identity/access` checks within handlers. Keep existing header-verifier unit tests, but change HTTP integration tests to obtain a real local session first.

Classify routes explicitly: health, login/bootstrap assets, public published routes and visitor APIs keep their own policies; private workspace/editor/admin APIs return 401 JSON; private HTML redirects to login. Public-media access is determined by the existing publication check, not by blanket `/media` admission. Invalid credentials never elevate access. Auth failures must not erase unsaved forms or disguise 403/404 as 401.

Retain the NODE_ENV production guard, and independently disallow the local login/session issuance path when APP_ENV is not local. Do not set AUTH_ALLOW_DEV_HEADERS. For shared modes, require complete Cognito issuer/pool/client configuration and validated tokens, or verified ALB identity with a pinned expected signer and issuer/client checks appropriate to the actual ALB token format. Treat missing/unavailable verification as anonymous/unauthorized, not a dev fallback. Bound key retrieval and handle key rotation; never log credential headers.

ALB browser login remains an IdP/ALB integration requirement; Cognito currently accepts verified bearer ID tokens but has no hosted browser callback. Local cookie login must not be advertised as completing Cognito hosted login. No pool/client/listener is created in Phase 2. Document the external browser-flow requirements (authorization code + PKCE/state/nonce and safe callback/return URLs if a Cognito browser flow is later selected), leaving IDs and URLs unfilled. Shared auth stays reported as disabled until deployment is separately authorized and actually verified.

Use only same-origin relative return paths; reject external, protocol-relative and login-loop destinations. Invite tokens currently live in URL fragments, which the server cannot see. The small client auth gate must preserve `/join#token` and `/team-join#token` through login in sessionStorage, then consume/clear them; do not put invitation tokens into login query strings or logs. This must be tested before protecting those shells with redirects.

Cookie protection starts in Phase 2, not after an unsafe interim release: exact Origin checks on login and mutating routes, SameSite cookies, and a session-bound CSRF token for authenticated mutations. Keep separate visitor-form/webhook semantics. Derive origin/Secure decisions from local settings or a deliberately configured trusted proxy/canonical origin, never arbitrary forwarded headers. Phase 4 broadens headers and audits coverage rather than introducing the first CSRF defense.

### Auth UX wireframe

```text
Buildovate Websites                 Local development
Sign in to your workspace
Email      [                                  ]
User ID    [                                  ]
[ Continue ]
Local-only identity selection. No provider credentials needed.
[Inline validation / request error, preserving entered values]

After sign-in:
  Uninitialized owner → existing explicit initialize action
  Invited user        → existing email-bound acceptance screen
  One assigned site   → existing Launch Pad
  Staff/admin         → existing authorized workspace navigation
  No assignments      → signed-in identity + access-needed message

Workspace header: user email · role · Sign out
Session expired: save is blocked; retain form; Sign in again
Return after login: original authorized screen, no automatic publish
```

Shared mode login pages must show only the configured verified provider journey or an honest unavailable message; never expose the local identity form.

### Exact proposed Phase 2 file list

These are planned paths, not changes already made. Existing filenames stay stable. No Phase 2 work begins until Phase 1 review.

| Files | Planned change |
| --- | --- |
| `src/aws/auth.js` | Preserve resolveUser/applyAuth interfaces where practical; tighten header consumption and provider checks; no arbitrary dev-header auth on ordinary server requests. |
| `src/aws/server.js` | Integrate session/auth HTTP routes, request context, route policy, cookie responses and explicit auth-aware chrome. Keep health independent. |
| `src/aws/env.js` | Validate local/shared guards, TTL and proposed trusted-origin/signer settings; require Cognito client ID in Cognito mode. |
| `src/auth/index.ts` (new) | Export built Node auth integration surface. |
| `src/auth/session-store.ts` (new) | Opaque token generation/hash lookup, expiry/revocation/cleanup through existing DB adapter. |
| `src/auth/http.ts` (new) | Login/session/logout endpoints, local-only issuance and cookie lifecycle. |
| `src/auth/request-policy.ts` (new) | Origin/proxy trust, public/private routing rules and session-bound CSRF enforcement. |
| `src/auth/views.ts` (new) | Escaped accessible login HTML, configuration-specific copy. |
| `src/client/shared/session.ts` (new) | Typed session/user/membership contracts and safe return-target handling. |
| `src/client/shared/api.ts` (new) | Cookie/CSRF request bridge; preserve Blob uploads and errors; no token logging. |
| `src/client/auth/login.ts` (new), `src/client/auth/bridge.ts` (new) | Login form, expiry/sign-out UI, invite-fragment return preservation and bridge for legacy app. |
| `public/app.js` | Replace auth-specific bootstrap/helper/link behavior only; preserve editor closure and dirty state. |
| `src/views.js`, `src/worker.js` | Runtime-aware shell/error auth links and private HTML behavior; keep published renderers and route ordering intact. |
| `src/api.js` | Extend session response with current memberships while preserving existing fields and bootstrap checks. |
| `db/schema.ts` | Add dedicated auth sessions table with hashed token key and expiry index; no foreign key to admins (non-admin users also sign in). |
| `drizzle/0005_auth_sessions.sql` (new), `drizzle/meta/0005_snapshot.json` (new), `drizzle/meta/_journal.json` | Generate and review additive migration/metadata from Drizzle; never edit 0000–0004. Next index confirmed at this baseline. |
| `build.mjs`, `package.json`, `package-lock.json`, `tsconfig.auth.json` (new) | Compile new Node/browser TS modules, add scoped typecheck and session test script, preserve existing build/test scripts. |
| `tests/auth-session.mjs` (new), `tests/aws-adapter.mjs` | Session lifecycle, route policy, verification/expiry, spoofing, CSRF, role revocation, public/private behavior and compatibility tests. |
| `docker-compose.yml` | Loopback host bindings only; unchanged container ports, service names and volumes. |
| `docs/modules/auth.md`, `docs/ENVIRONMENTS.md`, `docs/AWS_MIGRATION.md`, `setup.md` | Update auth procedure/status and replace ordinary local API dev-header instructions with cookie-session examples; clarify actual shared state. |
| `aws/env/docker.env.example`, `aws/env/local.env.example`, `aws/env/preview.env.example`, `aws/env/production.env.example` | Document precise implemented settings and placeholders, never populate provider secrets or IDs. |

Proposed new non-secret configuration names (not implemented): `AUTH_SESSION_TTL_SECONDS` (default 3600, bounded), `APP_ORIGIN` (explicit canonical origin), `AUTH_TRUST_PROXY` (off locally; requires network restriction when enabled), `AUTH_ALB_SIGNER` (required expected ALB ARN in ALB mode; blank placeholder in examples). Keep existing AUTH_MODE, AUTH_LOGOUT_URL, Cognito and issuer names. Prefer a fixed cookie name/path to unnecessary configuration. Existing secret values and gitignored `docker.env` need no change for local login.

`src/core.js`, tenant/workspace handlers, public renderers and current tests remain authoritative; no planned role-model rewrite or wholesale moves. The exact asset-recovery files cannot be named until the original licensed/generated asset bundle is available. That is a separate prerequisite, not permission to fabricate replacements or fetch production objects.

## Validation and risks

### Phase 1 checks actually run

- `npm ci --no-audit --no-fund`: completed with locked dependencies; only ignored node_modules added.
- `npm run build`: passed.
- `npm run test:aws`: passed. Includes expected database-offline/503 assertion and an unauthenticated OpenAI egress check, not AI generation or a configured key.
- All 16 other executable test suites were attempted: builder, cinematic-films, control, crm-next, crm, design-kits, engagement-providers, engagement, platform, presentation, project-experience, sales-ops, saved-designs, trade-upgrade, workspace and zoom. Each exited 1 on missing `public/assets/roofing.webp`. This is a baseline failure, not a passing regression run. `preview-fixture.mjs` is a helper, not an additional suite.
- Running Compose `/healthz`: HTTP success with `ok=true`, `environment=local`, `database.ok=true`, `authMode=dev-header`, `openai.configured=false`. No runtime code or running container was changed in Phase 1.
- No visual QA of cinematic pages is claimed; their asset bundle is missing from this checkout.

### Phase 2 acceptance gates

1. Local browser login → cookie → current roles → logout; no identity headers required. Test missing/malformed/expired/revoked tokens, cookie rotation, secure attributes, no open redirects, and invite-fragment preservation.
2. Unauthenticated protected API 401; protected HTML login flow; spoofed Sites/dev/ALB identity headers cannot grant access. Missing provider config, wrong issuer/audience/signer, token expiry and verification failure deny identity. Prove production/local guard combinations.
3. Anonymous published routes remain accessible; drafts/private media stay denied; admin/operator/owner/editor/viewer and cross-tenant tests remain intact. Membership revocation takes effect immediately. Test roles through the HTTP session boundary as well as direct Worker fixtures.
4. Same-origin mutations succeed with CSRF; cross-origin, missing-token, forged-forwarding and logout/login-CSRF attempts fail. Unsaved editor state survives a 401; no automatic publish/retry of an uncertain mutation.
5. Fresh and existing databases accept the appended session migration on SQLite fixtures, PGlite and real Compose Postgres; migration rerun is safe. Server-side session rows do not enter tenant content backups.
6. Build, scoped typecheck, AWS and new session tests pass. Restore approved original assets, then rerun every existing suite without removing assertions. Do not declare Phase 2 fully green while that blocker remains.
7. Compose rebuild plus exact health contract, local login/editor/draft/publish smoke flow on local fixtures, desktop/tablet/mobile auth pages. No live data/provider actions.

### Risks and follow-on work

- Local identity selection is a development facility, not verified email/password auth. Loopback binding and APP_ENV guards are essential. Shared IdP subject IDs may differ from historic Sites user IDs; existing memberships/admin rows cannot be silently remapped by matching an unverified email. Account linking/migration needs a reviewed, verified-identity procedure.
- Auth middleware must not shadow public forms, chat, reviews, proposals or signed webhooks. ALB listener rules will also need to exempt intended public paths when a shared rollout is separately authorized.
- A database-backed session works across Node processes and restarts; an in-memory map would not. Token hashes, expiry and cleanup should be added without broad schema rewrites. Never log sessions/provider tokens.
- Original assets are a prerequisite for full regression/visual verification. Missing files affect local Vite preview as well as tests and public rendering, despite a green API health check.
- New TS build output must be included in both Docker paths; direct source server start still requires build first. Preserve Worker browser-platform compatibility and existing static URLs.
- Phase 3 must make implicit closure dependencies explicit before replacing text concatenation; move behavior in small reviewable units. New CSS boundaries must preserve cascade order.
- Phase 4 should add architecture links, complete loading/error states, audit CSRF coverage and add measured security headers. Frame policies must allow the editor's same-origin preview; a restrictive CSP must account for existing inline templates rather than breaking cinematic pages.
- CI improvements belong to the quality follow-up: add PR-to-develop coverage and an explicit full test gate once asset provenance is resolved. No automatic dependency upgrades in this documentation phase.

Phase 1 stop point: review this map and the proposed Phase 2 scope. No auth implementation, source moves, commits, pushes, merges, deployments, DNS changes or shared-environment edits have been performed.
