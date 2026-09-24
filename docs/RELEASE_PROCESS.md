# Website release process and read-only deployment audit

Inspection date: 2026-09-23. Scope: website_creator only. No deployment, Git mutation, AWS/DNS change, access-policy change or credential creation was performed. This document is the only local change made for this investigation.

## What is verified

There are two separate release systems. Publishing from the earlier ChatGPT conversation created a ChatGPT Sites version. The custom domains currently resolve to AWS Elastic Beanstalk. A successful Sites publication therefore does not establish that the AWS custom-domain deployment was updated.

| Evidence | Staging | Production |
| --- | --- | --- |
| Custom domain | preview.website.buildovate.com | website.buildovate.com |
| Current DNS CNAME | buildovate-wc-preview.us-west-1.elasticbeanstalk.com | buildovate-wc-production.us-west-1.elasticbeanstalk.com |
| HTTPS /healthz | HTTP 200, environment=preview, database.ok=true | HTTP 200, environment=production, database.ok=true |
| Live authMode | disabled | disabled |
| Sites project | appgprj_6aad6c939310819191ee9000a4be08a8 | appgprj_6aa9c1b7907481919fb2e5427605a602 |
| Latest Sites version | 11 | 19 |
| Sites recorded source commit | a7de87500283677ba07a2432828fd29fa9a77ca2 | dbc968b8641e890f5f8238f2f84d08d4bebd382c |
| Sites deployment result | publish / succeeded, 2026-09-23 03:42:49 UTC | publish / succeeded, 2026-09-17 23:27:10 UTC |
| Actual Sites deployment URL | https://buildovate-sites-staging.buildovate-2371.chatgpt.site | https://buildovate-sites.buildovate-2371.chatgpt.site |

Both Sites hosts returned HTTP 401 to an unauthenticated read. No login bypass or access change was attempted.

Sites still lists the custom domains as active and expects CNAME custom-domains.chatgpt.site. Live DNS, cross-checked through resolver 1.1.1.1, instead points to the EB CNAMEs above. Sites' stored current_live_url is therefore not sufficient evidence of where current DNS traffic goes.

Both custom domains serve a 215,828-byte /app.js. After normalizing line endings, both have SHA-256:
5006c5456e3754b08d78b398f99647f42dee7432f2ce6ac34ea886969e3e00fd

That matches the pre-local-change Git HEAD browser bundle, including its original enhancement injection. Neither includes the literal “Generate Random Design” label. This is a main-browser-bundle comparison, not proof that every file or database matches.

## How your chat releases worked

The conversation [Staging Update Summary](https://chatgpt.com/c/6ab2f6a3-a758-83e8-8ee9-d9ab40ef2e42) reports publishing versions 10 and 11 from a managed checkout at /workspace/sites/buildovate-sites-staging. Its version 11 summary describes randomized designs, customer/payment setup, a price book and registrar walkthroughs.

The Sites connector independently confirms version 11, its source commit, its saved archive and successful deployment to the Sites staging host. The prior workflow was therefore:

1. Request changes in the chat attached to the existing Sites staging project.
2. Build/test the managed project and save a numbered Sites version.
3. Publish that version through Sites.
4. Review the deployed Sites host with the existing access policy.

The exact historical tool-command trace was not available in the retrieved chat summary. The deployed version metadata verifies the result, rather than every command that produced it. Do not assume this process updates an independently hosted AWS environment.

## GitHub is currently a separate source track

Verified through the public GitHub API during this audit:

- develop: f9f4ec6f7dd8c9945ce19396718e83587550c337
- staging and main: 21cc32e21814acfaa3f8dab321c01349abe7ec39
- One workflow: .github/workflows/ci.yml. It installs dependencies, builds and runs test:aws. It contains no deployment step.
- GitHub Deployments and Releases lists were empty.
- The latest develop CI run succeeded: https://github.com/Buildovate/website_creator/actions/runs/35914970390
- The staging/main tree at the observed commit does not contain Dockerfile or src/aws/server.js.
- GitHub returned 422 when asked to resolve either recorded Sites release commit in Buildovate/website_creator; neither commit was found through that repository API.

The documented feature → develop → staging → main promotion flow is a proposed/source-control convention, not a verified automatic deployment pipeline.

The local branch feature/local-environment-setup contains the uncommitted Phase 1–4 work on top of develop. It is not synchronized with the latest Sites staging version.

## Source recovery before the next release

Do not overwrite either system with the other checkout until their source differences are reconciled.

Sites version 11 has a stored TAR archive recorded as 153,978,880 bytes and 363 files. Production Sites version 19 has one recorded as 45,096,960 bytes and 181 files. These are promising sources for recovering the newer code and missing assets, but the archive contents were not downloaded or inspected in this audit. Their presence does not prove any particular asset is included.

The next implementation step should be to export/recover the staging version 11 source and assets into a separate comparison directory, preserve the current local work, then reconcile its newer website features with the local auth/runtime/module changes. Do not copy secret files or replace the working tree wholesale. Preserve schema migration history and compare any differing database models before merging code.

## What remains unknown about AWS

No AWS CLI executable or standard ~/.aws/config was found on this machine, and no AWS control-plane connector was available. No software or credentials were installed.

DNS gives the EB endpoint CNAMEs; it does not prove application names, environment names/IDs or application VersionLabels. Those remain unverified. Older repo docs name different prospective environments and incorrectly describe DNS as not yet moved.

Still needed from authenticated read-only AWS metadata:

- ApplicationName, EnvironmentName, EnvironmentId, VersionLabel and CNAME for each website environment.
- The current and previous known-good application-version source bundles and their origin/build process.
- Whether releases are made through EB console/CLI, CodePipeline or another external automation.
- Database migration execution, current schema version and backup/restore procedure.
- Shared identity-provider wiring and how authenticated deployment access is granted.

If an AWS-authenticated operator inspects this later, match environments by the observed CNAMEs, not guessed names. A read-only starting point is describe-environments in us-west-1, restricted to those two CNAMEs and the fields above, followed by describe-application-versions for the returned application/version. Do not dump environment-property values or credentials.

The absence of a GitHub deploy workflow does not exclude an external AWS pipeline.

## Release process to use going forward

### Daily development

Continue requesting website changes in the local task. Review them at http://localhost:8080. Keep the website repository and data separate from the CRM. Local edits do not publish automatically.

### First release after this audit

1. Recover and reconcile the newest Sites source/assets with local work.
2. Identify the exact AWS environment/version and existing deploy mechanism through read-only metadata.
3. Review the source diff and append-only migrations. Restore the original asset-dependent tests; do not mark their current failures as passing.
4. Run build, typecheck:client, test:client, test:auth, test:aws and the domain suites. Ensure CI includes the new checks before relying on it as a release gate.
5. Prepare an immutable candidate tied to a Git commit, including required assets, excluding all local environment files. Record the previous AWS version and database recovery reference.
6. Present the concrete candidate, target environment, migration/auth changes and rollback plan for staging deployment authorization. Current instructions still prohibit commit, push, merge and deploy until explicitly authorized.
7. Using the verified AWS deployment mechanism, release only to the existing website staging environment. Do not change DNS or create replacement infrastructure merely to release code.
8. Verify HTTPS health, intended authMode, login/logout, tenant roles, editor save, draft/public separation, a disposable inquiry, media and responsive layouts. A green health endpoint alone is insufficient.
9. After staging approval, promote the same tested source/artifact to production with separate authorization and its own migration/rollback review.

### Authentication dependency for the current local candidate

The local identity picker must never be exposed on staging/production. The new runtime requires canonical APP_ORIGIN for normal custom-host handling; verified ALB/Cognito modes also need exact provider settings. Current shared auth is disabled. Choose and configure the real shared login flow before treating the current candidate as a usable shared workspace. Never copy docker.env or local dev identity settings into AWS.

### Rollback

For AWS, redeploy the previously verified application version using the confirmed release mechanism. Application rollback does not reverse a database migration; assess schema compatibility and restore from the environment's verified backup only under an approved recovery plan. For Sites, a prior saved version is a different rollback target and does not automatically roll back AWS or DNS.

## Evidence and limits

Sources: live DNS and HTTPS health/app.js reads; GitHub repository branches, workflow runs, deployment/release APIs; Sites project/version/deployment/custom-domain metadata; Staging Update Summary; local repository history and config inventory. No secret values, signed download links or environment files are recorded here.

This establishes the historical Sites release path and the current custom-domain runtime, but does not claim the exact AWS deployment command has been recovered.


## Authenticated AWS inspection: broken sign-in follow-up (2026-09-23)

This section supersedes the earlier statement that AWS environment names and version labels were unverified. Inspection was through the signed-in AWS console. No AWS configuration or deployment was changed.

| Field | Staging | Production |
| --- | --- | --- |
| Application | buildovate-website-creator-preview | buildovate-website-creator-production |
| Environment | website-creator-preview | website-creator-production |
| Environment ID | e-k3qjzz4zuu | e-69vzsm2wpi |
| Running version | develop-dockerrun-20260923044110 | develop-dockerrun-20260923044110 |
| Platform | Docker on Amazon Linux 2023 | Docker on Amazon Linux 2023 |
| ALB | awseb--AWSEB-vK1aU76gu3WJ | awseb--AWSEB-1WWxftVS8dFZ |
| ALB resource suffix | 8bf3dd19cfb28b6f | e687d3c242599c8c |

ALB environment ownership was verified through elasticbeanstalk environment-name and environment-id tags. Each ALB has HTTP:80 and HTTPS:443 listeners, with one default forward rule per listener and no authenticate action. Certificates match the respective website domains. Staging's environment properties explicitly show APP_ENV=preview and AUTH_MODE=disabled. Other property values were not exported. Earlier live health checks show authMode=disabled for both sites.

The Cognito console reports zero user pools in us-west-1. This is a regional finding, not an account-wide search. No other configured identity provider appears in either website's listener rules.

### Cause and repair decision

The deployed client still directs users to /signin-with-chatgpt?return_to=%2F. AWS returns 404 for this path and /login. The earlier ChatGPT Sites authentication route was not carried over as an AWS login implementation. Merely redirecting the old URL cannot authenticate anyone.

Before creating identity resources, the owner must choose an existing company provider or authorize a new website-only Cognito login. Earlier project instructions prohibited creating a Cognito pool; do not infer that this restriction has been lifted by read-only inspection approval.

Proposed Cognito approach, pending that decision:

1. Begin with staging only. Create an invitation-only website user pool and ALB application client with authorization-code flow, openid/email scopes, and exact callback https://preview.website.buildovate.com/oauth2/idpresponse. Use a provider-managed login domain. Do not enable public self-registration, create CRM resources, or print generated credentials.
2. Prepare a targeted application release with neutral Buildovate sign-in text, safe handling for bookmarked legacy sign-in URLs, canonical APP_ORIGIN, verified ALB identity, CSRF/session handling, and complete logout of both app and ALB/provider sessions. The current local candidate does not yet implement the full ALB logout path; do not present it as deployment-ready.
3. Bind AUTH_MODE=alb-oidc to the exact staging ALB signer, actual provider issuer and actual client ID. Keep public website pages, assets, public APIs and health checks accessible while authenticating workspace entry points. Preserve JSON 401 behavior for unauthenticated private API requests. Design and verify these rules together with the application's existing route policy; do not authenticate every public request indiscriminately.
4. Verify instance ingress is restricted appropriately to its load balancer before trusting ALB identity. Configure HTTP to redirect to HTTPS as part of the reviewed change. Preserve current target groups, certificates and DNS.
5. Resolve existing application user identities explicitly. A new Cognito subject must not silently replace an existing ChatGPT user ID or grant administrator access. Review the intended user's existing tenant membership and an explicit account-link/invitation plan before migrating access. New account passwords and MFA enrollment are entered by the user in the provider UI.
6. Preserve current release and configuration rollback references. Reconcile or isolate the authentication patch from the outstanding local module work and newer Sites features before building a release artifact; current asset-dependent test limitations remain unresolved.
7. Obtain approval for the concrete new identity resources, credentials/access configuration and staging deployment before applying them. Verify real login, expired sessions, logout, existing tenant access, denied cross-tenant access, editor saves and anonymous public pages on staging. Do not mark success based only on /healthz.
8. Prepare a separate production rollout after staging acceptance, with a separate provider/client boundary, production callback and environment settings. Do not change production merely because staging succeeds.

Technical reference: [AWS ALB authentication documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html). It documents HTTPS listener authentication, Cognito callback requirements, forwarded identity verification and logout handling.

Outstanding: identity-provider choice/authorization, exact image source/digest and prior version rollback metadata, identity linking, targeted code changes, security-group review, provisioning, staging deployment and end-to-end validation. The live sign-in issue remains unresolved pending these steps.

### Staging Cognito creation approved and completed

The owner approved creating the staging login after reviewing the provider recommendation. Created pool buildovate-website-staging (us-west-1_Z7yWboD4u), with invitation-only email login and a staging-only app client/callback. An invitation was requested for the owner's specified email; no application permissions were granted. See STAGING_LOGIN_SETUP.md for nonsecret resource identifiers, tested local integration changes and outstanding release work. Neither live environment nor ALB routing has been changed, and the live sign-in issue is not yet resolved.

### Staging login deployed after explicit authorization

Successfully deployed staging-login-20260923-234439-r2 to website-creator-preview and connected its Cognito login. Staging health verifies authMode=alb-oidc and database.ok=true. The old sign-in URL redirects into the new flow. Production's version, DateUpdated and live authMode were verified unchanged. See STAGING_LOGIN_SETUP.md for artifact hash, applied settings, verification boundaries, the resolved archive-permission failure and rollback references. The user's first password change and authenticated workspace verification remain a browser handoff.
