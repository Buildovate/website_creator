# #028F Round 8m — stopped at immersive diagnosis

## Cause and why 8k passed

The worker rebuilt after 8k includes separate uncommitted preview-route work. The current worker changes the Roofing preview business name from `Your Roofing Company` to `Ridgeline Roofing`, imports a new design-preview page module and expands preview routes. Compared with the exact 8k backup, site-polish.js adds sample preview service navigation and page links. The test fixture imports dist/server/index.js, so 8l consumed that rebuilt output. The one-file source-lock lookup is reached only after response comparisons and cannot cause these HTML changes.

The 8k header backup predates the current header and worker edits; current worker and build timestamps are recorded in round8m-results.json. 8k did not back up worker.js or the bundle, so this evidence does not identify the actor or claim a byte-exact full-source reconstruction of 8k. Planning ambient and both normalizers remain unchanged.

A diagnostic virtual bundle reversed only the Roofing name literal and substituted the exact 8k header snapshot. It did not match the saved response: eight service-card links and labels still differ. It modified no source or built artifact. This supports the observed name/navigation cause while explicitly retaining the additional service-card differences.

## Exact mismatch

Target: `/design-preview/roofing/immersive`, baseline `roofing-19.html`, HTTP 200.

- Business-name/title/public text: `Your Roofing Company` → `Ridgeline Roofing`.
- Desktop and phone navigation: anchor navigation becomes expanded page links and a service dropdown.
- Eight service-card actions: `Ask about ...` with `#contact` and data-service-link becomes `Explore ...` with `/services/<slug>`.

Exact normalized response diff: round8m-immersive-diff.txt. Source evidence: round8m-site-polish-since8k.diff.txt (8k backup comparison) and round8m-worker-working-tree.diff.txt (HEAD comparison).

These are content/navigation/link changes, not permitted poster attributes or the 8h uploaded-logo alt/hidden-name change. The standing rule requires stopping here.

## Results and preservation

No baseline or checksum updated. No remaining 373-response scan, Part2 standalone, header-logo or Suite-102 run. Suite-102: 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete (not started).

Only diagnosis helpers, diagnosis outputs, source comparison evidence and these notes/results were written in this round. The round8m-before file hash list in round8m-results.json verifies the copied app sources, built worker, tests, normalizers, locks/manifests and prior full-checks evidence are unchanged. Separate pre-existing preview work is left untouched.

Samples remain the prior accepted snapshot: 3,425 Pass / 70 Borderline / 0 Fail, qaGateClear=false. All 70 Borderlines remain open; no decisions recorded. No commit, staging, push, deploy, credits or real provider calls.
