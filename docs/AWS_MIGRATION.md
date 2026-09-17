# AWS deployment plan

Buildovate's Laravel/Nuxt application should remain the transactional system of record. Cloudflare can continue serving public contractor sites and media at the edge while AWS runs the API, database, queues, scheduled follow-ups, and financial workflows.

## Proposed AWS layers

- Laravel API and workers: ECS/Fargate or the existing AWS container runtime
- Nuxt front end: the existing AWS deployment or a versioned static/SSR service
- MySQL: existing managed database, upgraded with backups, replicas, and migration gates
- Object storage: R2 or S3, selected per asset and egress requirements
- Background work: SQS plus workers for imports, reminders, AI jobs, and media processing
- Secrets: AWS Secrets Manager
- Monitoring: CloudWatch plus application error tracking

## Environment variables

Staging and production must use separate values for database, signing keys, payment providers, email/SMS providers, and domain configuration. Secrets must be stored in GitHub environment secrets or AWS Secrets Manager, never committed to this repository.

## Domain cutover

Before DNS changes:

- Deploy and smoke-test staging.
- Verify tenant routing and SSL.
- Confirm forms, chat, payments, calendar, and follow-up jobs.
- Lower DNS TTL.
- Cut over production.
- Keep the previous deployment available for rollback.

This document is a plan, not a claim that AWS deployment is already live.
