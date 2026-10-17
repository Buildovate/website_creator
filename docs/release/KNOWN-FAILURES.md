# Known failures observed during PREVIEW-REAL-PAGES

## Legacy publication fixtures — pre-existing media prerequisites

On staging base `feb7baba`, `premium-service.mjs` and `service-pages-all-trades.mjs` cannot complete their automatic publication prerequisite. Both were rerun with the installed Edge browser and reproduced six blocking checks on their legacy Roofing homepages:

- At 1440, 390 and 768, `/assets/roofing.jpg` and `/assets/finished-roof.jpg` return 404. Neither file exists in the staging tree.
- At all three widths, five comparison thumbnails are flagged for missing meaningful alternative text/decorative labeling. The unchanged `homeowner-polish.js` matcher expects the former `.jpg` paths while those thumbnails now use `.webp`.

`git diff origin/staging -- src/cinematic.js src/homeowner-polish.js public/assets` is empty. This ticket does not change media or these live homepage renderers. PR #9 owns media restoration; these checks were not waived and no QA approvals were manufactured.

Initial attempts of `roofing-cities`, `constitution`, `financing-states`, `conversion-references`, and `legal-policy` also stopped because the legacy helper's default Playwright executable was not installed. After configuring Edge and reproducing the shared media blockers in the first two suites, the broader publication run was stopped during `roofing-cities`; the remaining publication suites were not rerun. They are **not claimed green**.

Local raw output is retained under `docs/build-evidence/PREVIEW-REAL-PAGES/related/`. The two actual QA failure reports and crops are under `docs/build-evidence/028F/helper-blockers/manual/`.

The focused preview/renderer/client suites and the core gate are separately recorded in [PREVIEW-REAL-PAGES](PREVIEW-REAL-PAGES.md). The earlier Concrete media-hash issue remains outside this ticket; its media catalog and assets are unchanged. The 70 Borderlines remain REJECTED/OPEN and `qaGateClear=false`.
