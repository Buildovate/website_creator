# Release preview validation notes

Suite-102 is intentionally excluded from this batch. Core and related gates run local fixtures/mocked clients with provider egress blocked. MEDIA-RESTORE separately provisioned and verified preview-only S3/CloudFront media delivery under the ticket's explicit authorization; no application was deployed. No live Stripe calls were made.

Live CloudFront/ACM provisioning, real-domain HTTPS, role IAM permissions, edge/origin Host forwarding and origin TLS remain for Louie's preview checklist in docs/release/CUSTOM-DOMAINS.md. CUSTOM_DOMAINS_LIVE remains default-off.

Historical evidence-dependent diagnostics use the external evidence archive; docs/build-evidence is deliberately absent from the committed release tree. MEDIA-RESTORE ran the related media, motion, range, adapter and Roofing story diagnostics. Other historical suites are not claimed as passing. Protected QA assertions, thresholds and baselines were not rewritten.

The Oct 12 low-quality raster/video encodes are superseded by original-source restoration: native dimensions, CRF 18, scrub GOP <=6 and WebP quality 90. All 820 originals were found. Available paid native masters were restored; 45 video entries have genuinely smaller originals, including the 1280×720 roofing build film. Source limits and per-asset probes are recorded in docs/media/MEDIA-RESTORE-RESULTS.json and MEDIA-RESTORE-PROBES.csv. The Concrete/catalog integrity issue is resolved by the restored bytes and updated encoding hashes: media-library passes 3287 checks. Approval statuses and rights were not changed.

Raster/video files are excluded from the tracked tree and Docker build output. Historical Git blobs remain until a coordinated history rewrite; this ordinary PR does not replace shared refs. No Docker engine is available locally, so image construction was not executed; the external-media application build was checked and contains zero raster/video files. See docs/media/MEDIA-RESTORE.md for the delivery proof, original-source limits and remaining maintenance operation.

The protected 70 Borderlines remain REJECTED/OPEN and qaGateClear=false.

MEDIA-RESTORE final core gate: PASS; 28/28 commands, 5584 reported tests/checks, including 4465 quality-floor checks and 737 asset/browser checks. Additional delivery tests pass 36 checks, native/DPR/reduced-motion/browser checks pass 24, and Roofing story passes 30. Historical evidence-output directories create themselves; the image browser test scrolls through lazy sections before retaining its complete-image assertions. No assertions were removed.

Inherited whitespace warnings in the conversion playbook, font license files and frozen QA browser source are retained from integration. The protected detector bytes and license text were not reformatted.
