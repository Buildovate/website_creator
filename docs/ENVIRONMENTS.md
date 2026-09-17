# Buildovate deployment environments

## Branch flow

- `develop`: development work and conversational changes
- `staging`: release-candidate code at `preview.website.buildovate.com`
- `main`: approved production code at `website.buildovate.com`

Changes should move through a pull request from `develop` to `staging`, then from `staging` to `main`. The existing Cloudflare Site remains the private fallback until AWS staging is connected and verified.

## Required gates

Every promotion should include:

1. Successful CI build.
2. Responsive preview check at desktop, tablet, and mobile widths.
3. Database migration review.
4. Tenant-isolation and authorization checks.
5. Payment and messaging changes tested in sandbox mode.
6. A rollback reference for the previous production release.

## Current status

GitHub source control and branch structure are initialized. AWS deployment is not yet connected. The next infrastructure step is selecting the AWS runtime for the Laravel/Nuxt application, then adding repository environment secrets for staging and production.
