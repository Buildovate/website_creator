# Module: auth

## Purpose
Proves a user id and email, then lets the Worker decide platform and website roles. The identity provider does not grant those roles.

## Server
- **Routes**: none of its own. `src/aws/server.js` runs `applyAuth` on every request except `GET /healthz`. The Worker then reads `oai-authenticated-user-id` and `oai-authenticated-user-email` via `person()` / `identity()` in `src/core.js`.
- **Tables**: `admins` (platform: `user_id`, `email`, `role` default `admin`) and `members` (per tenant: `role`, `active`). Role checks live with `sites` and `workspace`, not here.
- **Code**: `src/aws/auth.js`, `src/aws/env.js` (`assertRuntimeConfig`), `src/core.js` (`person`, `identity`, `access`).
- **Auth**: this module is the gate.

### Modes (`AUTH_MODE`)

Accepted values: `alb-oidc`, `cognito`, `dev-header`, `disabled` (`src/aws/env.js`). Anything else throws `AUTH_CONFIG` and the AWS handler returns 500.

| Mode | Behavior |
|---|---|
| `disabled` | `resolveUser` returns null. No user is attached. Public pages still render. `identity()` returns 401. |
| `dev-header` | Accepts `x-buildovate-user-id` and `x-buildovate-user-email`. Refused when `NODE_ENV=production` unless `AUTH_ALLOW_DEV_HEADERS=1`. Local only. Do not set that flag on a shared environment. |
| `alb-oidc` | Verifies ALB `x-amzn-oidc-data` (`ES256`, `kid`, `exp` with 60s skew). Public key from `https://public-keys.auth.elb.{region}.amazonaws.com/{kid}`. Optional `AUTH_OIDC_ISSUER` must match `iss`. Maps `sub` and `email`. |
| `cognito` | Verifies a Cognito **ID token** (`Authorization: Bearer`, `token_use` `id`, `RS256`) against the pool JWKS. Requires `COGNITO_USER_POOL_ID`. `COGNITO_CLIENT_ID` checks `aud` when set. Issuer is `https://cognito-idp.{region}.amazonaws.com/{pool id}`. Access tokens are rejected. |

If `AUTH_MODE` is unset, `authMode()` returns `alb-oidc` when `NODE_ENV=production`, otherwise `dev-header`.

On AWS, incoming `oai-authenticated-user-*` headers are deleted and set again only after a mode succeeds. Sending the Sites headers yourself does nothing. `alb-oidc` also drops `x-amzn-oidc-data`, `x-amzn-oidc-identity`, and `x-amzn-oidc-accesstoken`. `cognito` drops `authorization` before the Worker runs.

HTML from the Worker still says "Sign in with ChatGPT". `rewriteSitesChrome` in `src/aws/server.js` rewrites that to "Sign in required" on the AWS response path only, points the sign-in link at `/`, and points sign-out at `AUTH_LOGOUT_URL` when that value is an http(s) URL. Otherwise the page says sign-out is handled by the identity provider. The Worker source is unchanged, so the Site keeps its original links.

### Current preview and production setting

Live preview and production still set `AUTH_MODE=disabled`. Cognito and the ALB OIDC authenticate action are not wired. That is the current state, not a planned mode.

`aws/env/preview.env.example` and `aws/env/production.env.example` still show `AUTH_MODE=alb-oidc` (with `cognito` commented). Those files are templates. They are not the live environment properties. Do not flip a shared environment to `alb-oidc` or `cognito` from the examples unless someone asks. `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID` are blank in the examples. Pool ids are unknown in this repo.

Local templates set `AUTH_MODE=dev-header` (`aws/env/local.env.example`, `aws/env/docker.env.example`). `setup.md` is done when `/healthz` reports `authMode: "dev-header"`.

### Roles (after a user is attached)

- Platform: a row in `admins`. `identity()` sets `admin` when `role==='admin'`, and `staff` when any admin row exists. Staff invite roles in `src/crm.js` are `admin` and `operator`. Operators are staff and are not `admin`.
- First administrator: `POST /api/setup` only for `yoelengel18@gmail.com`, and only while no other admin row exists (`src/api.js`).
- Website: `members.role` is `owner`, `editor`, or `viewer`. `access()` treats a platform `admin` as role `admin` for that tenant without a membership row. `write` allows admin/owner/editor. `owner` allows admin/owner. `admin` requires platform admin.

Sites still injects `oai-authenticated-user-id` and `oai-authenticated-user-email` when the Worker runs on ChatGPT Sites. That path does not use `src/aws/auth.js`.

## Browser
- **Pages**: workspace shell at `/`, `/join`, `/team-join` (`src/views.js`). Sign-in copy depends on Sites vs the AWS rewrite above.
- **Scripts / data**: `public/app.js` loads the session.
- **Calls**: `GET /api/session` (anonymous user is null; also records last-seen when a person is present).

## Business rules
- Email is stored lowercased and must match the invitation email.
- Invitation tokens are hashed. Tenant invites last seven days (`src/api.js`). Platform staff invites also last seven days (`src/crm.js`).
- Private Sites sharing is an outer gate. An application invite does not add someone to the hosting access policy (`README.md`, `OPERATIONS.md`).
- Vite and `tests/preview-fixture.mjs` are local test only. Do not deploy the Vite adapter as production auth (`README.md`).

## Gotchas
- `AUTH_MODE=disabled` is easy to confuse with "unset". Unset + `NODE_ENV=production` falls back to `alb-oidc`, which will not attach a user without a real ALB JWT. The live setting is the explicit value `disabled`.
- A client that can reach an instance directly can forge `x-amzn-oidc-data` if `alb-oidc` is enabled. `docs/AWS_MIGRATION.md` says instances should accept HTTP only from the load balancer. That network rule is not in this repo.
- Unknown: the live Cognito user pool, ALB listener, and logout URL. Not in git.

## Related modules
`sites` (memberships and setup), `workspace` (staff vs contractor access), `infra` (where `AUTH_MODE` is set).

## Sources
`src/aws/auth.js`, `src/aws/env.js`, `src/aws/server.js`, `src/core.js`, `src/api.js`, `src/crm.js`, `aws/env/preview.env.example`, `aws/env/production.env.example`, `aws/env/local.env.example`, `aws/env/docker.env.example`, `docs/AWS_MIGRATION.md`, `docs/ENVIRONMENTS.md`, `setup.md`, `OPERATIONS.md`.
