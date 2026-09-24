# Staging login setup

2026-09-23. Website only. Production, CRM, DNS, existing EB environment properties and load balancer rules remain unchanged.

## Created with owner approval

- Region: us-west-1
- User pool: buildovate-website-staging
- Pool ID: us-west-1_Z7yWboD4u
- App client: Buildovate Website Staging
- Client ID: 77h5t90ub383ju59273lba25fe
- Provider domain: https://us-west-1z7ywbod4u.auth.us-west-1.amazoncognito.com
- Email sign-in; self-registration disabled (verified after creation).
- OAuth authorization-code grant; scopes email and openid only.
- Callback: https://preview.website.buildovate.com/oauth2/idpresponse
- Logout return: https://preview.website.buildovate.com/login?signedOut=1
- Feature plan: Essentials (console creation default).
- An email invitation was requested for joe@buildovate.com. Cognito confirmed user creation, Enabled / Force change password. Cognito generated the temporary password and handles delivery; no password was displayed or recorded. Mailbox receipt is not yet verified. The user must choose their password themselves in Cognito.
- No app admin role or tenant membership was granted or migrated.

## Application changes prepared locally

- /login offers Buildovate sign-in in ALB mode; the local identity picker remains local-only.
- /auth/start accepts only verified ALB identity and returns to a safe same-origin path. A missing ALB authentication action produces a controlled error, not an authentication bypass or redirect loop.
- Old /signin-with-chatgpt bookmarks redirect to /login, preserving only validated return paths.
- CSRF-protected logout revokes the app session and clears the ALB base cookie and all four possible shards, then returns the configured provider logout URL.
- AUTH_ALB_COOKIE_NAME is configurable and validated. It must match both ALB authentication actions.

Passed: npm run build, npm run typecheck:auth, npm run test:auth, npm run test:aws, npm run test:client, git diff --check. New tests cover legacy URLs, external return rejection, absent provider identity, authenticated return, signed-out page, database revocation and ALB cookie clearing. These are local tests, not proof of live login. Existing asset-dependent visual/domain tests remain blocked by missing source assets.

## Exact staging settings proposed for activation (NOT applied)

```
APP_ENV=preview
APP_ORIGIN=https://preview.website.buildovate.com
AUTH_MODE=alb-oidc
AUTH_ALB_SIGNER=arn:aws:elasticloadbalancing:us-west-1:846588355042:loadbalancer/app/awseb--AWSEB-vK1aU76gu3WJ/8bf3dd19cfb28b6f
AUTH_OIDC_ISSUER=https://cognito-idp.us-west-1.amazonaws.com/us-west-1_Z7yWboD4u
AUTH_OIDC_CLIENT_ID=77h5t90ub383ju59273lba25fe
AUTH_ALB_COOKIE_NAME=bv_staging_auth
AUTH_LOGOUT_URL=https://us-west-1z7ywbod4u.auth.us-west-1.amazoncognito.com/logout?client_id=77h5t90ub383ju59273lba25fe&logout_uri=https%3A%2F%2Fpreview.website.buildovate.com%2Flogin%3FsignedOut%3D1
```

No client secret belongs in this file or the browser application. Native ALB/Cognito integration uses the app client in AWS.

HTTPS listener proposal: authenticate-cognito then forward on /auth/start with unauthenticated action authenticate; default authenticate-cognito then existing forward with unauthenticated action allow. Both actions must use this pool/client/domain, openid email, bv_staging_auth and matching session timeouts. Restrict to the canonical staging host, retain public health checks and public sites, and redirect HTTP to HTTPS. Validate the actual listener settings and instance security-group restrictions before applying.

Staging target: EB application buildovate-website-creator-preview, environment website-creator-preview, e-k3qjzz4zuu. Current version develop-dockerrun-20260923044110 is the application rollback reference. Its source key is website-creator/preview/develop-dockerrun-20260923044110.zip in elasticbeanstalk-us-west-1-846588355042. Another recorded version is develop-20260923042651; its suitability as a rollback is not established. Signed bundle links and credentials are intentionally not recorded.

## Remaining release work

The live button is not fixed yet. A staging release and coordinated ALB/environment changes remain necessary. Earlier no-deploy instructions remain in force; approval to create the Cognito directory did not authorize a code deployment.

Before deployment, isolate/review the auth candidate from the existing uncommitted Phase 1-4 work, establish its asset completeness against the deployed bundle, capture current configuration rollback references, verify instance ingress, and resolve how joe@buildovate.com's verified provider identity receives its existing application memberships. Do not silently grant platform admin, replace existing user IDs, or mutate production.

After release approval, verify real browser login, password change by the user, logout, revoked/expired sessions, existing tenant permissions, editor save and public pages. The current hosted-login callback is not connected to an ALB authentication rule yet, so do not treat the provider login page alone as a working website login.

## Deployed: staging login (2026-09-23)

The owner explicitly authorized finishing and deploying the staging login fix, with production unchanged. This supersedes the earlier pending-deployment notes above.

- Successful EB version: staging-login-20260923-234439-r2
- Artifact SHA-256: bf9f039ebdcc1447b7a2dc09648f6aa4063f9167f232a985cc1472226945ca21
- Source: s3://elasticbeanstalk-us-west-1-846588355042/website-creator/preview/staging-login-20260923-234439-r2.zip
- EB confirmed Ready / Green / Ok and successful deployment to its instance.
- The artifact was prepared from the previous deployed source bundle, overlaid with the tested local auth/runtime/client changes. Existing deployed public files were retained. The old deployed archive also contained no public/assets entries; missing asset-dependent tests remain a pre-existing limitation.
- Node image is pinned to node:22-bookworm-slim@sha256:43ac6c60b8f89723f746e8a92ce91abd5017e627ce1ddfe4238355d3a30b772c.
- The first attempt failed because the Linux archive's restrictive file permissions prevented the non-root Node user from reading the runtime. The corrected archive uses regular readable file modes, and Docker COPY explicitly assigns node ownership. The corrected image passed a non-root runtime import check before the successful retry.
- Applied the exact staging environment settings listed above, plus MIGRATE_ON_BOOT=1 for the append-only session migration. Migration application is idempotent. No business-data or identity-role migration was performed.
- HTTPS default rule uses Cognito with unauthenticated action allow, then the existing target group. Priority 10 requires login only for the canonical staging host and /auth/start. Both use bv_staging_auth, openid email, and a 3600-second session timeout.
- HTTP listener redirects to the canonical staging HTTPS host.
- Removed direct public TCP/80 ingress from staging-only website-creator-preview-eb-sg (sg-0b5f1e02557da1538). Its only network attachment was the staging EB instance. The separate EB-managed security group continues permitting TCP/80 from the staging ALB. Neither security group attachment nor database access rules were removed.

### Verified after deployment

- /healthz: HTTP 200, ok=true, environment=preview, database.ok=true, authMode=alb-oidc.
- /login and /login?signedOut=1: HTTP 200, no-store.
- /: 303 to sign-in; old /signin-with-chatgpt URL: 303 to the new flow.
- /auth/start: 302 to this staging pool's Cognito authorization endpoint; browser reached the Cognito email sign-in screen.
- /api/tenants: HTTP 401, including requests with forged legacy and local identity headers.
- /auth/local-session: HTTP 404; GET /auth/logout: HTTP 405.
- /favicon.svg and /app.js: HTTP 200.
- Production health: HTTP 200, ok=true, database.ok=true, environment=production, authMode=disabled (unchanged).
- Production EB version remains develop-dockerrun-20260923044110 and DateUpdated remains 2026-09-23 03:39:15.981000+00:00.

### User verification still pending

The user must enter the invitation password and choose their new password in Cognito. No credentials were entered by the agent. Authenticated return, actual account memberships, editor access and full provider logout cannot be claimed verified until that handoff is complete. No administrator rights were added to joe@buildovate.com.

### Rollback material

The previous staging version remains develop-dockerrun-20260923044110. A private CloudShell directory, ~/website-staging-login, holds the prior source archive, environment configuration, listener/rule configurations, security-group configuration, database recovery metadata and final release metadata. Do not print or commit environment-before.json; it may contain credentials. The staging RDS instance website-creator-preview-postgres had seven days of automated backups and a recent restorable time recorded before deployment.

A rollback must restore the application version and compatible auth settings/listener behavior together. The new auth_sessions table is append-only and should not be dropped during an application rollback. Preserve the restriction against direct public instance access. Production was not changed.

### Follow-up: Cognito callback HTTP 500

After the user completed first sign-in, the ALB callback returned HTTP 500. The staging ALB security group sg-05533194d78f656c3 permitted only outbound TCP/80, preventing its HTTPS token/user-info exchange with Cognito. CloudWatch recorded ELBAuthError=1 with no authentication successes or claims-size errors during the diagnostic window.

With explicit user approval, added outbound TCP/443 to 0.0.0.0/0 on that staging ALB security group. Verified its environment tags and both attached interfaces belong exclusively to the staging ALB. Existing ingress and TCP/80 egress were preserved. The previous security-group configuration is saved privately as ~/website-staging-login/alb-sg-before-login-egress.json. No application deployment was needed. Production version and DateUpdated remained unchanged.

The network rule is verified; a fresh user sign-in is required to verify the complete callback and workspace access. Start at /login rather than reusing the failed callback URL/code.

### Staging workspace owner

The user explicitly approved joe@buildovate.com as the staging workspace owner. Owner checks now use WORKSPACE_OWNER_EMAIL, with the original owner as the default when unset. The session exposes an owner flag for the setup screen and owner-only team controls; administrator privileges still require an admins record. Only staging receives WORKSPACE_OWNER_EMAIL=joe@buildovate.com. No CRM service or production environment is changed.

Release prepared: staging-owner-20260924-000100; SHA-256 a2b845948c98343ef9bd700ab72adb1a2e5e028e1067b2a30ed0d5ab1da2eb93. All seven changed source files in the release match normalized hashes of the tested local files. Build, typecheck, auth-session, client-module and new workspace-owner tests passed. The new test covers configured-owner initialization, owner team access, and rejection of the former owner and unrelated accounts.

The signed-in owner must use Initialize workspace to create the administrator record through the normal authenticated, CSRF-protected setup endpoint. This does not import websites from ChatGPT Sites or production.
Deployment verified: staging-owner-20260924-000100 is Ready / Green / Ok. Public health returned ok=true, environment=preview, authMode=alb-oidc and database.ok=true. The live staging owner setting is joe@buildovate.com. Production version and DateUpdated remain unchanged. Authenticated Initialize workspace action remains pending in the user browser.
