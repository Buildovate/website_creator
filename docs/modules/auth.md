# Module: auth

Custom hosts are classified by the actual HTTP Host before platform authentication and use only public tenant routes. Forwarded-host headers do not select tenants, and platform authentication retains canonical `APP_ORIGIN`. See [CUSTOM-DOMAINS.md](../release/CUSTOM-DOMAINS.md) for the Host/origin TLS requirements.

## Runtime and trust boundary

The AWS/Node runtime uses `src/auth/*.ts` (built to `dist/auth`) for HTTP sessions and `src/aws/auth.js` for verified provider identities. The Worker still uses `person()`, `identity()` and `access()`. Incoming identity, ALB and bearer headers are stripped before the adapter writes trusted Worker headers. The original Sites runtime keeps its hosting identity behavior.

Private workspace HTML redirects to `/login`; private APIs return 401. Published sites, published media, public inquiry/review/chat routes and signed SMS callbacks retain their existing authorization rules. Draft previews and private media still require site access.

## Local sign-in

With `APP_ENV=local` and `AUTH_MODE=dev-header`, open `/login` and enter an email and stable user ID. This is explicitly an unverified development identity, not a production login. Client identity headers no longer authenticate HTTP requests. The local-session endpoint is unavailable in shared modes.

`POST /auth/local-session` requires JSON, an exact matching Origin and a loopback URL. It has bounded input and per-address rate limits. It rotates an opaque random session token. Only its SHA-256 hash is stored in the new `auth_sessions` table (append-only migration 0005). Cookies are HttpOnly, SameSite=Lax, Path=/ and Secure on HTTPS. Sessions expire after `AUTH_SESSION_TTL_SECONDS` (default 3600, range 60–86400) and survive process restarts when the database persists.

Direct local Node runs bind 127.0.0.1. Compose binds the process to 0.0.0.0 inside the container and publishes all service ports on host loopback. Do not expose development sign-in through a tunnel or reverse proxy.

## Session API and browser

`GET /api/session` returns user, initialized, active memberships, authMode, loginUrl, logoutUrl, providerLogoutUrl, expiresAt and csrfToken. Roles remain in existing admin/member tables and are checked on each operation, not cached in the cookie. Private mutations require the cookie, exact Origin and X-CSRF-Token. `POST /auth/logout` requires the same checks and revokes the session.

The TypeScript browser bridge supplies CSRF and preserves forms when a session expires. Reauthentication opens another tab; failed changes are never automatically replayed. A change of user requires reopening the workspace. Invitation fragments stay in the browser, with a same-origin return path saved in sessionStorage. External return URLs are rejected.

## Shared provider verification

Set a canonical HTTPS `APP_ORIGIN` for the intended environment. Forwarded Host/Proto headers are ignored; there is no configurable proxy trust chain. This deliberately replaces the proposed forwarded-header mechanism with a single configured origin.

- ALB: ES256 signature plus exact signed-header signer ARN, issuer, client and expiry checks. `AUTH_ALB_SIGNER`, `AUTH_OIDC_ISSUER` and `AUTH_OIDC_CLIENT_ID` are mandatory. The provider must supply sub, email and email_verified. Instances must accept traffic only from the intended load balancer.
- Cognito: RS256 ID token, exact pool issuer, client audience, token_use=id, expiry and verified email. Pool and client IDs are mandatory. Key lookup is bounded, cached and refreshed for rotation. No hosted-login callback flow is invented.
- Both modes require fresh verified provider identity on every request. The local application cookie only binds CSRF and cannot replace the provider token.
- Disabled: no authenticated user, including when a local session cookie is supplied.

For ALB login, GET /auth/start must have an ALB authenticate-cognito rule with OnUnauthenticatedRequest=authenticate. The application accepts this route only after verified provider identity, then redirects to a validated same-origin return path. /login shows the provider sign-in link, and old /signin-with-chatgpt bookmarks redirect there safely. Other routes need identity forwarding with OnUnauthenticatedRequest=allow so public pages stay public and private APIs retain JSON 401 behavior.

Shared sign-out revokes the application session, expires the configured AUTH_ALB_COOKIE_NAME (default AWSELBAuthSessionCookie) and all four possible shards, then follows AUTH_LOGOUT_URL. The signed-out /login page must remain accessible without requiring authentication. The provider logout endpoint must be configured; browser logout through the actual ALB still requires staging verification.

Preview/staging is https://preview.website.buildovate.com; production is https://website.buildovate.com. AWS inspection confirmed AUTH_MODE=disabled and no ALB authentication actions. A new invitation-only staging Cognito pool was subsequently created with owner approval; it is not yet connected to the live application. See docs/STAGING_LOGIN_SETUP.md. Environment examples are prospective configuration, not proof that SSO exists. Local auth is forbidden on shared environments even with AUTH_ALLOW_DEV_HEADERS.

## Roles and initialization

Platform admins/operators and website owners/editors/viewers keep existing permissions. The first administrator still requires explicit `POST /api/setup` using the existing bootstrap owner email, while no other administrator exists. Login does not bootstrap or grant permissions. Invitations must match the signed-in email.

## Verification

Run `npm run build`, `npm run typecheck:auth`, `npm run test:aws` and `npm run test:auth`. Auth tests use disposable databases and exercise migrations, sessions, expiry, logout, CSRF, spoofing, roles, tenant isolation, public/private routes and provider signatures/rotation.

The existing domain/render suites additionally require the original public/assets bundle, including roofing.jpg. Those files are absent from Git and unavailable on this machine. No substitute assets or removed assertions conceal that limitation.

## HTTP response protections

The AWS handler supplies nosniff and strict-origin-when-cross-origin Referrer-Policy on responses. Workspace/login/private-preview HTML receives no-store, noindex, SAMEORIGIN and a limited CSP: base-uri self, object-src none, frame-ancestors self. Same-origin editor frames, existing inline scripts, styles and media remain compatible. This is a baseline policy, not a complete script-source CSP.

HSTS (max-age=31536000, without includeSubDomains or preload) is emitted only for a configured HTTPS origin in a shared environment, never locally. Public pages do not receive workspace framing/CSP restrictions. Protected API responses remain JSON; workspace HTML errors have an app recovery page.

Initial-load failures offer Try again and clear the busy state. Failed save requests retain the existing form. Sign-out uses an accessible in-page confirmation with cancel, then the CSRF-protected POST logout route. Public visitor forms and signed webhooks keep their separate existing checks; workspace CSRF is not used to bypass them.


## #022 visitor ebook requests

POST /api/public/:slug/ebook is registered with the existing public-route policy. The handler enforces exact same-origin requests, bounded bodies, honeypot, unticked explicit consent, browser-scoped receipts and persisted quotas. Private preview capture/download still calls tenant access; public download requires its consent receipt and the same HttpOnly browser cookie. No platform mutation becomes anonymous. Native no-JavaScript form POST uses the existing strict-origin-when-cross-origin response policy.
