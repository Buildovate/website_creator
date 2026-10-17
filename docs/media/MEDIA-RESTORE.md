# MEDIA-RESTORE

Joe's rule: **media quality is never traded for speed. Speed comes from loading strategy, never visibly lower resolution, bitrate or compression.**

This branch reverses the media encodes introduced by `3f46300c`. Inputs are the original evidence archive first, then the pre-squash `2211ea97` tree. Staging files are used only for the before comparison, never as encode inputs. Per-file source hashes, dimensions and encoding attestations are in `public/media-quality.json`; executed probe/crop/Lighthouse evidence is retained locally under ignored `docs/build-evidence/MEDIA-RESTORE/`.

## Quality contract

- Native source resolution; no speed-based dimension cap. Source-limited 720p/1440p media is identified by its original dimensions rather than presented as native 1080p.
- H.264 / VP9 CRF 18, maximum allowed CRF 20. Scrub media has a keyframe interval of at most six frames.
- WebP quality 90, minimum allowed quality 80. A 2880-wide hero derivative is supplied where the original contains that resolution; there is no invented detail through upscaling.
- Native 16:9 and 9:16 drone sources, viewport-selected with `<source media>`. Canvas backing pixels follow devicePixelRatio; existing camera crops and all page text/layout/prices are retained.
- Posters paint first. Below-fold video sources remain deferred; near-view observation warms playback. Motion-off/reduced-motion uses full-quality stills.
- A codec does not reliably expose its original WebP quality or VP9 CRF. The gate therefore checks the original-source encoding attestation AND the exact SHA-256 of the delivered bytes. H.264 CRF and actual keyframe intervals are additionally read from the encoded file. Missing or changed bytes fail; metadata is not a waiver.

## Preview delivery

**Preview provisioned and verified.** The AWS SDK authenticated to account `846588355042`. Dedicated media delivery is live at `https://d3faov654g66qi.cloudfront.net` (distribution `E22LU0VBAFNGDJ`). All 787 logical assets are present as 778 immutable objects. Verified: 206 byte-range response, exact sample content digest, immutable headers, CORS, private-photo prefix denied (403), and all four Block Public Access settings retained. The application was not deployed and no production resource was changed. Executed proof: ignored `docs/build-evidence/MEDIA-RESTORE/preview-delivery-proof.json`.

Raster/video binaries are removed from the branch's tracked tree and excluded from both Docker context and output. Local originals/restored encodes remain on disk; all restored bytes are also in the preview CDN. Fonts, vector art, code and small manifests stay in Git. Earlier commits still contain historical binary blobs: removing those ancestors requires a coordinated repository history migration, including all active worktrees and remote clones. This PR does not rewrite shared history or force-push it. CI uses a shallow, blob-filtered checkout before hydrating verified media from the CDN.

The preview topology uses the **existing** `buildovate-website-creator-preview` bucket, private `assets/template-media/` keys, a dedicated CloudFront distribution with OAC, and no production resource. Object names contain the full SHA-256. Uploads use `Cache-Control: public, max-age=31536000, immutable`, correct content type and SSE-S3. CloudFront supports byte-range GETs; the local adapter streams ranges too. The distribution's bucket grant is limited to public template media, never uploaded contractor photos or backups.

The executed, idempotent setup is `scripts/setup-template-media-preview.mjs --apply`; identifiers are recorded in `aws/template-media-preview-state.json`. The CloudFormation equivalent remains reviewable at `aws/template-media-preview.json`; do not apply it as a second stack over these already-created resources. It deliberately exports a bucket-policy statement instead of replacing the existing bucket policy. A dedicated public-media response policy supplies CORS for native video/canvas without changing the upload bucket's CORS policy.

### Exact access for future preview maintenance

Account: `846588355042`. S3 region: `us-west-1`. Use a short-lived role or AWS SSO session; do not put keys in chat, Git, or example files.

1. Identity: `sts:GetCallerIdentity`; if assuming a dedicated role, `sts:AssumeRole` on that explicitly chosen role ARN.
2. Upload/verify: `s3:PutObject` and `s3:GetObject` on `arn:aws:s3:::buildovate-website-creator-preview/assets/template-media/*`. `HeadObject` is authorized by `s3:GetObject`. No object deletion or bucket-wide public access is needed.
3. Bucket-policy merge: `s3:GetBucketPolicy`, `s3:PutBucketPolicy`, `s3:GetBucketLocation`, `s3:GetPublicAccessBlock` on `arn:aws:s3:::buildovate-website-creator-preview`. Keep Block Public Access enabled and preserve every unrelated statement.
4. Dedicated CloudFront resources: `cloudfront:ListOriginAccessControls`, `cloudfront:ListCachePolicies`, `cloudfront:ListResponseHeadersPolicies`, `cloudfront:ListDistributions`, `cloudfront:CreateOriginAccessControl`, `cloudfront:GetOriginAccessControl`, `cloudfront:CreateCachePolicy`, `cloudfront:GetCachePolicy`, `cloudfront:CreateResponseHeadersPolicy`, `cloudfront:GetResponseHeadersPolicy`, `cloudfront:CreateDistribution`, `cloudfront:GetDistribution`, `cloudfront:GetDistributionConfig`, `cloudfront:TagResource`. List/creation actions need `Resource: *`; restrict the role to this bootstrap session and require `Environment=preview` on supported tagged resource creation. Scope subsequent reads/updates to the returned distribution/policy/OAC ARNs. No update of an existing production distribution is authorized.
5. If applying the proposed template through CloudFormation: `cloudformation:CreateStack`, `cloudformation:CreateChangeSet`, `cloudformation:DescribeChangeSet`, `cloudformation:ExecuteChangeSet`, `cloudformation:DescribeStacks`, `cloudformation:DescribeStackEvents`, `cloudformation:GetTemplate`, `cloudformation:ValidateTemplate` for the chosen preview media stack. If using a CloudFormation execution role, `iam:PassRole` only for that explicit preview role with `iam:PassedToService=cloudformation.amazonaws.com`. No wildcard IAM administration is needed.
6. Repository settings: write the non-secret GitHub Actions variable `TEMPLATE_MEDIA_ORIGIN_PREVIEW` to the resulting HTTPS CloudFront origin. Configure the same `TEMPLATE_MEDIA_ORIGIN` on the preview app only when a later application deployment is explicitly authorized. This ticket authorizes no application deployment.

### Reproduce or maintain preview delivery

1. Authenticate to the account above. Reuse the recorded preview resources; the setup script discovers its dedicated resources by name. It does not update any production distribution.
2. Merge its exported read-only statement into the existing bucket policy. Preserve private upload/backup access and Block Public Access.
3. Obtain the restored media handoff on Joe's machine. Run `node scripts/publish-template-media.mjs --preview`; the uploader verifies account, bucket, immutable key, local digest and existing object digest. Re-running is safe and never overwrites an immutable object.
4. The CDN origin in the tracked preview state is the default for CI hydration; the non-secret repository variable is an optional override. Verify HEAD, `Range: bytes=0-1023` (206 plus Content-Range), CORS and immutable headers through CloudFront. Set the repository variable above.
5. A fresh checkout runs `TEMPLATE_MEDIA_ORIGIN=<origin> node scripts/hydrate-template-media.mjs`, then the quality gate and core gate. CI fails closed if neither the preview state nor an explicit origin is available; it never downloads the staging re-compressions as a fallback.
6. Review the PR. Do not merge or deploy as part of this ticket.

AWS references: [OAC and restricted bucket policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html), [range GETs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RangeGETs.html).

## Original-source reproduction

Set `MEDIA_ARCHIVE_ROOT` to the original archive and `FFMPEG_PATH` / `FFPROBE_PATH` where necessary, then run `node scripts/restore-media.mjs`. The fixed 820-file inventory is in `docs/media/ORIGINAL-ASSETS.json`. The command restores original-source encodes, finalizes native frames/crops, selects the paid native masters and audits audio/timing before the quality gate. It never encodes from staging media. All originals were found; `missing-originals.txt` says **None**.

The 820-file original inventory includes 784 raster/video assets and 36 font/vector/code/manifest files. Three source-backed variants bring the restored raster/video set to 787: two native-aspect drone masters and one 2880-wide hero still. There are 67 video entries and 720 still entries. Forty-five videos have source dimensions below 1920 in both axes; their source limits are enumerated in `MEDIA-RESTORE-RESULTS.json`. The roofing build-film source is 1280×720; it has not been upscaled or described as native 1080p. The paid planning/drone masters are restored at their available native resolution.

## Proof and remaining operational limits

The text probe table is committed at [MEDIA-RESTORE-PROBES.csv](MEDIA-RESTORE-PROBES.csv): each logical asset has original-source, before and after dimensions, video bitrate/keyframe counts, output GOP/CRF or still quality, and byte size. [MEDIA-RESTORE-RESULTS.json](MEDIA-RESTORE-RESULTS.json) records source limits and the measured three-run mobile Lighthouse medians. The local evidence index is `docs/build-evidence/MEDIA-RESTORE/index.html`; before/after crops preserve native screenshot pixels at 1440/1×, 1440/2× and 390/3×. The proof script asserts matching scroll position, film time and crop before composing comparisons.

Docker's external-media build was executed and its output contains zero raster/video files; the runtime public directory is copied only from that filtered output. A Docker engine is not installed on this machine, so an actual image build was not run. The regular application build and core gate were run separately with hydrated media.

Lighthouse 13.5.0, mobile simulated throttling, three fresh browser runs per phase on the same Roofing fixture:

| Metric (median) | Before: Oct 12 media | After: restored media via preview CloudFront |
|---|---:|---:|
| Performance | 72 | 73 |
| LCP | 6181 ms | 5954 ms |
| FCP | 3031 ms | 3028 ms |
| Total blocking time | 0 ms | 0 ms |
| CLS | 0.01614 | 0.01614 |

Final after scores: 71, 73, 73. Baseline scores: 72, 72, 72. These are local fixture measurements, not a production performance claim. Earlier local-delivery/debug runs remain in the ignored evidence folder; the final after series uses the actual preview CDN with no other local test suites running. Install the pinned evidence-only CLI with `npm install --prefix docs/build-evidence/MEDIA-RESTORE/tools --no-save lighthouse@13.5.0`; set `REVIEW_BROWSER_EXECUTABLE` to an installed Chromium-family browser and run `node scripts/media-restore-evidence.mjs after` with the recorded `TEMPLATE_MEDIA_ORIGIN`. Capture the before series from the unmodified pre-restoration checkout before replacing its media; the script rejects restored bytes labeled as before. Run `node scripts/summarize-media-proof.mjs` to regenerate the matched comparisons and text reports.

Historical Git blob removal is a separate coordinated maintenance operation: preserve the originals and all active work first, inventory all affected refs/tags, rewrite raster/video paths in a disposable mirror, verify that source and CDN manifests still hydrate, then coordinate replacement refs and fresh clones with every branch owner. This cannot be accomplished by an ordinary PR into staging, and no shared refs are rewritten by this ticket. New media bytes go only to immutable S3 keys.
