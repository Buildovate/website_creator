# Custom domains: preview enablement

The backend is shipped with `CUSTOM_DOMAINS_LIVE=0`. In that state no AWS/DNS/HTTPS domain adapter is constructed, even if the obsolete `DOMAIN_CHECKS_ENABLED=1` is present. Explicit test adapters remain injectable. This round uses SQLite, local PostgreSQL/PGlite, mocked SDK clients and local browser fixtures only. Live AWS provisioning, IAM access, edge/origin configuration and a real test-domain connection still require Louie's preview validation.

## Configuration

Read these names from the environment; keep actual environment IDs/ARNs in EB configuration rather than source or evidence. The application, database and existing S3 resources remain in `us-west-1`. Domain CloudFront, ACM, STS and Route 53 clients use `us-east-1` and the assumed domain role. This feature does not purchase or transfer domains or call Route 53 Domains.

| Name | Use |
|---|---|
| `CUSTOM_DOMAINS_LIVE` | `0` by default; explicitly set `1` to install live domain adapters. |
| `CF_MT_DISTRIBUTION_ID` | Existing environment's multi-tenant distribution. |
| `CF_CONNECTION_GROUP_ID` | Existing environment's connection group. |
| `CF_ROUTING_ENDPOINT` | Connection group's routing hostname; also used for alias ownership instructions. |
| `CUSTOM_DOMAIN_CNAME_TARGET` | Environment-specific www CNAME target. No hardcoded preview/production fallback. |
| `DOMAINS_ROLE_ARN` | Role assumed through STS using the application's instance role; no static domain credentials. |
| `CF_TENANT_TAG_ENV` | Value of the CloudFront/ACM `env` tag. Resources also carry `tenantId` and a durable `domainOperation` tag. |
| `PLATFORM_HOSTS` | Comma-separated platform/health-check/origin hosts; must include the `APP_ORIGIN` host. Every other Host is restricted to a verified active published tenant. |
| `CLOUDFRONT_ALIAS_ZONE_ID` | Hosted zone ID for the connection group's Route 53 alias instructions. |
| `CUSTOM_DOMAIN_APEX_IPS` | Leave empty with the supplied topology. Empty means the wizard gives no A-record instructions. |
| `DOMAIN_RECHECK_INTERVAL_MS` | Optional cadence, default `180000`; accepted range `1000`–`3600000`. Per-domain due times use the same interval. |

## Provisioning and verification

Saving wizard instructions creates a durable operation ID, requests an Amazon-issued ACM certificate with `ValidationMethod=DNS`, stores its ARN and CNAME validation records, and creates a disabled CloudFront distribution tenant. The certificate covers www and bare; the tenant includes bare for alias/flattening DNS, and only www for registrar forwarding. The tenant stays disabled until the contractor approves the DNS switch, marks records added and ACM issues the certificate. A later check attaches the certificate, enables the tenant and waits for CloudFront `Deployed` with active domain entries. The multi-tenant distribution must use a shared origin without required tenant parameters.

This uses ACM-managed issuance and renewal with DNS validation. CloudFront's `ManagedCertificateRequest` is an HTTP validation workflow, so it is deliberately not used for a CNAME requirement. See [ACM RequestCertificate](https://docs.aws.amazon.com/acm/latest/APIReference/API_RequestCertificate.html), [tenant certificate customizations](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistributionTenant.html), and [CloudFront managed certificates](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managed-cloudfront-certificates.html).

The wizard shows ownership TXT, www CNAME and certificate CNAME records. For bare addresses it retains alias, flattening or permanent registrar forwarding instructions. It never edits contractor DNS automatically. The provisioner's `publishValidationRecords` helper is available only to a future registered-domain caller supplying its verified hosted-zone binding; it writes the saved certificate CNAMEs only, preserving email and other routing records.

`DOMAIN_CHECKS` verifies ownership TXT, www CNAME target, issued ACM certificate, enabled/deployed CloudFront tenant and HTTPS responses identifying the expected tenant. Bare HTTPS must serve that tenant or return a 301/308 to https://www on the same domain. HTTPS probes pin validated public IPv4 answers, verify TLS/SNI and never follow redirects. Private/mixed/special-use addresses and IPv6-only destinations fail closed. A newly verified ownership record can require the next check before HTTPS succeeds, because an unverified host cannot serve content.

## Routing and lifecycle

The actual HTTP `Host` selects the custom site; `X-Forwarded-Host` never selects a tenant. Platform authentication continues to use canonical `APP_ORIGIN`. Custom hosts cannot reach platform auth, APIs, private previews, another tenant's slug or media. Their root and nested pages use the `/s/:slug` published renderer, with tenant links/sitemap rewritten to the custom root. Public form requests retain the custom origin. Lookup results are cached for five seconds, misses for one second, bounded to 1024 entries per database; local domain writes invalidate the cache. Published status and rental availability are read on every request.

Past-due day 8 uses the existing paused page; day 30 and expired cancellations return 404. Disconnect removes the mapping immediately and queues CloudFront disable → deployed ETag → delete → ACM delete. Cancellation keeps resources through the existing `data_hold_until` (90-day hold), then runs the same cleanup. No tenant data or domain registration is deleted. Disabled/in-use/stale ETag failures retry at the configured interval. A database lease and optimistic version checks coordinate operations, while deterministic CloudFront names and ACM operation tags recover lost responses without duplicate resources. Reconnect after completed cleanup uses a new operation ID. There is no automatic certificate replacement on a failed/expired certificate: review DNS, then explicitly disconnect/reconnect if a new issuance is needed.

## IAM

The EB instance role needs `sts:AssumeRole` on `DOMAINS_ROLE_ARN`, and the domain role trust policy must allow that instance role. The assumed domain role needs:

- `cloudfront:CreateDistributionTenant`, `cloudfront:GetDistributionTenant`, `cloudfront:UpdateDistributionTenant`, `cloudfront:DeleteDistributionTenant`, `cloudfront:TagResource` (tagged creation). Include `cloudfront:GetVpcOrigin` if the configured distribution uses a VPC origin; these creation dependencies are listed in the [CloudFront authorization reference](https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudfront.html).
- `acm:RequestCertificate`, `acm:DescribeCertificate`, `acm:DeleteCertificate`, `acm:ListCertificates`, `acm:ListTagsForCertificate`. The last two recover requests whose response was lost after creation.
- `route53:ListResourceRecordSets`, `route53:ChangeResourceRecordSets` on explicitly authorized hosted zones, only when the registered-domain helper is enabled by its caller.

Scope CloudFront mutations to the environment's distribution/connection group and owned distribution tenants, ACM operations to us-east-1 environment/tenant-tagged certificates, and Route 53 changes to authorized certificate CNAME names/types. List/request/create actions that cannot be resource-scoped need request-tag/region conditions where AWS supports them. Check the current AWS service authorization tables when installing the policy; no IAM policy was applied in this round. No ACM private key export, registrar credentials or live keys are needed.

## Louie's preview steps

1. Bring this branch through the normal reviewed preview release process; this round does not open a PR, merge or deploy it. Install the updated lockfile dependencies. Start with the flag off.
2. Confirm all configuration names above point to preview resources, the distribution uses a shared app origin, and no required per-tenant origin parameters exist. Include platform, EB/ALB health-check and origin hosts in `PLATFORM_HOSTS`. Leave apex IPs empty.
3. Install the instance-role assume-role grant, trust policy and domain-role permissions. Confirm ACM permissions apply in us-east-1 and that environment/tenant tagging conditions allow resource creation and recovery reads.
4. Configure and verify delivery of the viewer's actual Host to the app. `X-Forwarded-Host` alone is intentionally ignored. Check origin TLS/SNI before enabling: forwarding the viewer Host to an HTTPS origin requires a certificate/origin configuration that CloudFront can validate for that Host. A shared-origin certificate alone does not cover arbitrary contractor domains. Resolve that infrastructure constraint in the preview distribution/origin configuration before proceeding.
5. Disable shared caching for dynamic/public-form/auth responses, or use an explicit tenant-safe Host cache key. Preserve the viewer Host, paths, methods, query strings and Origin needed by public forms. Restrict origin access to the intended edge/ALB path. Keep platform cookies off custom-host responses.
6. Set `CUSTOM_DOMAINS_LIVE=1` on preview only, restart the preview process through normal operations, and run the manual test-domain checklist below. Background checks run at startup and at the configured interval. Review saved provisioning status rather than interpreting an accepted request as Connected.
7. To roll back live operations, set the flag to `0` and restart. This stops new external calls; it does not automatically delete already provisioned resources or hide valid saved host mappings. Explicitly disconnect first when teardown is intended, or block the edge route for an emergency takedown. Pending cleanup resumes after re-enablement.

## Manual test-domain checklist (Louie, live preview only)

- With the flag off and no injected test adapter, save instructions/check a domain: hosting stays Not connected and no AWS domain resources are created.
- Use a domain Joe controls and a fictional preview contractor with an approved published snapshot and current paid plan. Confirm its existing `/s/:slug` site first.
- Save the domain; verify one environment-tagged CloudFront tenant and one tagged us-east-1 ACM certificate, with validation CNAMEs saved and shown. Repeat/check to verify no duplicate resources.
- Add certificate CNAMEs and ownership TXT while retaining email records. Approve the switch, apply the www CNAME to the configured target, and add the applicable bare alias/flattening/HTTPS registrar forward. For Route 53 alias setup, apply any shown `_cf-challenge` TXT records.
- Observe Checking, pending validation/deployment, then Connected only after expected tenant HTTPS, bare behavior, certificate and CloudFront status pass. Verify `/`, `/about`, a project/media, sitemap, own inquiry form and another tenant's denied URL. Confirm Host separation through the edge and at the origin.
- Remove/alter ownership or www DNS, or break certificate/site reachability: a check must clear Connected. An unknown/unverified host and anonymous preview must return 404; platform auth must remain isolated.
- Exercise rental grace/day-8 pause/day-30 or expired cancellation on a preview-only test fixture. Check that the published snapshot remains and teardown waits for the configured hold expiry.
- Disconnect: traffic stops, CloudFront disables, deletion waits for deployment, then ACM deletion completes. Retry an interrupted operation; verify no duplicate or orphan resources. Reconnect only after cleanup completes.
- Remove test-domain DNS and fixture resources after testing. Never change production resources as part of this checklist.

## Evidence and release scope

Local evidence lives at `docs/build-evidence/CUSTOM-DOMAIN/`, which is ignored and excluded from the feature commit. The requested gate includes related domain/AWS/auth tests plus build, typecheck, both Worker targets, native Game/Pay/catalog/domain/insertion ordering, readiness A/B, launch decisions and financing. Suite-102 is excluded. Existing QA rules, held files and Borderline decisions are unchanged; `qaGateClear=false` and all 70 remain REJECTED/OPEN.
