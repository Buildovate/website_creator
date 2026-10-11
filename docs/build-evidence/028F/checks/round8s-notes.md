# #028F round 8s — Suite-102

State: Stopped: three hung commands; no retry; Samples not run. No product edits, commit, staging, push, deploy, providers or credits. Standalones not rerun separately.

## Suite

5 PASS / 0 PASS-WITH-WARNING / 3 FAILED / 94 incomplete. [Suite output](round8s-suite102.log), [stderr](round8s-suite102-error.log), [rows](round8s-suite102-results.json), [totals](round8s-suite102-totals.json). Existing runner and hang guard unchanged; supervisor stops the tree on first failed row, no suite retry.

Warnings: [].

### service-pages-all-trades

Command: `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs`. [Log](round8s-service-pages-all-trades.log).

```text
FAILED/hung: silent for 10 minutes
```
### financing-comparison

Command: `node C:/Users/joe/website_creator/tests/financing-comparison.mjs`. [Log](round8s-financing-comparison.log).

```text
FAILED/hung: silent for 10 minutes
```
### ebook

Command: `node C:/Users/joe/website_creator/tests/ebook.mjs`. [Log](round8s-ebook.log).

```text
FAILED/hung: silent for 10 minutes
```

## Catalog restoration

Pre-run SHA-256: `b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145`. Temporary fixture write/restore explicitly approved by Joe/Champ. [Audit](round8s-planning-films-hash.json): {"before":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","atRunnerExit":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","after":"b7382554172676d6fcd79b5f7559b36a15c2eb5edc2516808876b8c2509b4145","matches":true,"runnerRestored":true,"supervisorRestored":[]}. Backup: round8s-before/public/planning-films.json.

## Samples

{"state":"Not run","historical":{"pass":3425,"borderline":70,"fail":0},"qaGateClear":false,"original70Open":true,"decisionsRecorded":0}

Historical totals are not a fresh result. All70 original Borderlines stay open, no acceptance/waiver/reclassification. qaGateClear=false. Original packets/capture-readiness are protected; a fresh snapshot, if Suite102 is green, writes into round8s-samples only.

## Preservation

{"checked":479,"changed":[]}

[Machine results](round8s-results.json) include runner/guard, QA detector, normalizers, backlog/status hashes. No baseline or source-lock update in this round. Backups are in round8s-before.

## Original Sample preservation after stop

{"checkedFiles":29039,"changed":[],"byteIdentical":true,"original70Open":true,"decisionsRecorded":0,"qaGateClear":false}. [Hash comparison](round8s-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.
