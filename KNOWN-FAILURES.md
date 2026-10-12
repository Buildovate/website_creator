# Release preview validation notes

Suite-102 is intentionally excluded from this batch. The requested release gate runs local fakes/mocked clients with provider egress blocked. No AWS or Stripe live calls are part of validation.

Live CloudFront/ACM provisioning, real-domain HTTPS, role IAM permissions, edge/origin Host forwarding and origin TLS remain for Louie's preview checklist in docs/release/CUSTOM-DOMAINS.md. CUSTOM_DOMAINS_LIVE remains default-off.

Historical evidence-dependent diagnostics use the external evidence archive; docs/build-evidence is deliberately absent from the committed release tree. Those historical diagnostics were not run or declared passing in this batch. Their QA assertions, thresholds and baselines were not rewritten.

Raster and video assets have new lossy encodes. Image geometry/aspect ratio and video timing/audio are retained; Louie should review photographic sharpness and film gradients before merging. Original assets and all local evidence are retained in the archive.

The protected 70 Borderlines remain REJECTED/OPEN and qaGateClear=false.

Final gate: PASS; 28/28 commands, 1380 reported tests/checks. The Game form and copy tests now create their own evidence directories and were rerun; no assertions were removed.

Inherited whitespace warnings in the conversion playbook, font license files and frozen QA browser source are retained from integration. The protected detector bytes and license text were not reformatted.
