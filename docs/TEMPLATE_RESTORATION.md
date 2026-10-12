# Template and trade restoration

Restored locally and deployed to AWS staging on 2026-09-23 (2026-09-24 UTC), with user authorization. Production remains unchanged.

## Recovery

Recovered the exact original Sites v11 Git commit a7de87500283677ba07a2432828fd29fa9a77ca2 in .data/sites-v11-recovery using a short-lived repository credential. The token was used only in the child process environment, never stored in Git configuration or files, and no pushes or publications occurred. The recovered Git commit is verified; the newly generated Git TAR is not asserted to be byte-identical to the Sites service archive.

Restored 266 original asset paths and the website rendering dependencies. 265 files are byte-identical to the source. One original file, assets/build-films/hvac-finished.webp, was zero bytes; replaced it with a final-frame image extracted from its own recovered HVAC film. 216 images verify successfully; all 45 MP4 files decode successfully. All 24 hero/detail films also passed the original frame-count and fast-start checks.

## Missing trades restored

Flooring, Painting, Fencing, Garage Doors and Pest Control are restored alongside the original seven trades. All 12 appear in the library and are sourced dynamically for website selection forms. Hero and detail films, specialty artwork, 24 craft/customer graphics, service maps, pricing/blog layouts, shared navigation, review styling and cinematic controllers were recovered. Auth, the staging owner setting, database migrations, CRM services and billing integrations were not replaced.

The original v11 random-design/customer-assignment/payment workflow is a separate source difference and was not imported. This restoration restores the trade/template visual library and existing website composer; it does not claim that the entire AWS application matches v11.

## Validation

- 936 trade/layout/recipe server renders: all HTTP 200, zero missing referenced media.
- 108 homepage/pricing/blog preview combinations: passed.
- 266 assets served successfully with nonempty bodies by the isolated local AWS runtime.
- Build, client typecheck and 15 suites passed: trade revisions, timeline controllers, scroll stories, legacy scroll video, design kits, cinematic films, presentation, trade upgrades, project experience, builder, saved designs, auth sessions, client modules, AWS adapter and workspace owner.
- Tests retain current authorization/isolation checks. Older presentation expectations were updated to the recovered design. Module checks use the current bundled-source paths. The recovered scroll-story suite's partial sales-capture block was excluded because that unrelated workflow is not imported; existing inquiry tests remain passing.
- Desktop Flooring preview: imagery visible and chapter 3 seeks to 12.040667 of 12.041667 seconds. Mobile Pest Control preview at 390px: no horizontal overflow or loaded-image/video errors observed. This is representative browser QA, not 936 manual visual reviews.
- Added a build-time asset integrity gate: missing/empty static media or absent trade/specialty mappings stop the build. The workspace client URL has a release query suffix to avoid displaying cached seven-trade selectors.

## Deployed staging release

Candidate: .data\staging-media-v11-candidate.zip

SHA-256: e57d9301a9ebc9c16cf5b6d0f7b57b19f22a97eae5aa7e7ad3cf7f870c3353f0

Size: 151706803 bytes; 422 source entries. Explicit source allowlist excludes .env files, .data, Git, local databases and credentials. Docker entries use readable 0644 permissions and the already pinned Node image. No new database migration or runtime environment setting is required. Deployed target: website-creator-preview only. Rollback: staging-owner-20260924-000100.

Local preview runs on http://127.0.0.1:8092 using an isolated in-memory database and test identity. It contains no customer records. Existing localhost:8080 and CRM services are untouched.

Deployment completed: staging-media-v11-20260924-003017. Elastic Beanstalk reports Ready / Green / Ok.

Live verification confirms all 266 asset paths return nonempty matching content prefixes, all six checked manifests match the tested build (12 trades; 24 trade-art entries), and the deployed workspace client matches the local build. Health reports ok=true, environment=preview, database.ok=true, authMode=alb-oidc. Private routes still require authentication. Evidence: media-audit/restored/staging-verification.json.

Authentication settings and WORKSPACE_OWNER_EMAIL were preserved. No database migrations, environment settings, ALB rules or permissions changed in this release. A fresh authenticated browser login was not repeated after deployment; representative visual browser checks were completed locally.

S3 artifact: s3://elasticbeanstalk-us-west-1-846588355042/website-creator/preview/staging-media-v11-20260924-003017.zip

Production version develop-dockerrun-20260923044110 and its DateUpdated were confirmed unchanged against the pre-release snapshot. No commit or push was performed. Refresh staging with Ctrl+F5 if the browser still shows cached library content.
