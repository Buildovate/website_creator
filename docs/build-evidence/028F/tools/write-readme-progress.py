import json
from pathlib import Path
p=Path(r'C:\Users\joe\website_creator\docs\build-evidence\028F')
def read(path): return json.loads((p/path).read_text(encoding='utf-8-sig'))
a=read('tools/readme-content.json'); rows=read('full-checks.json'); packets=read('checks/qa-packets.json')['packets']
text='''# #028F — Automatic QA gate

**In progress; required final reruns are still running. No commit.** Base `fdcd459`, branch `feature/local-environment-setup`. Joe's approved poster, secondary-action and screen-reader-status fixes are implemented. The five Sample packets have **0 Fail and 70 open Borderline items**; their `qaGateClear` remains false. No Sample decision has been made for Joe.

**0 Higgsfield credits, 0 real provider calls, no new dependencies, no push/deploy.** Custom per-contractor video stays off.

## Latest approved follow-up

- Added the existing installed poster attributes to the Financing ambient and both Promotions clips. The exact byte proof restores the saved response by removing only those attributes: **0 protected HTML changes, exactly 2 approved archived preview changes**. Prior manifests were not overwritten; this ticket's archive manifest records the two approved hashes.
- Form submit remains primary. Financing's existing Get Financing Options summary and the contact section's existing telephone action now use secondary presentation. The preview comparison update is also secondary. Controls, wording, consent and behavior are retained. CSS also covers no-JS presentation.
- Confirmed the existing 1px, clipped, absolute spans are exposed `role=status` messages, with explicit or implicit polite semantics and no hidden ancestor. Exact page/selector/text/geometry recognition applies only to `Still image shown.`. All **104 boundary cases (16 positive, 88 negative)** and **16 secondary-action/AA states** pass; other clipped text still fails.
- The configured Constitution financing/promotions capture formerly had 21 failures; it now has **718 Pass / 16 Borderline / 0 Fail**. A later independent fixture, `promotions-display-015`, used the same fictional 555 data without its Sample designation. Only that test-local clone was marked `Sample Fictional QA Roofing Promotions`, under Joe's standing approval. Its failed run is retained and a full rerun is underway. No placeholder rule or publication assertion was weakened.

[Poster-only byte proof](checks/poster-approval-byte-proof.json) · [Approved archive manifest](approved-archived-responses.json) · [Original SR-status verification](checks/screen-reader-status-before.json) · [Status and secondary-action boundaries](checks/status-recognition.json) · [Fictional fixture record](checks/promotions-fixture-designation.json).

| Archived preview URL | Prior normalized SHA-256 | Approved new normalized SHA-256 |
|---|---|---|
| `/s/ambient-baseline-roofing/financing?preview=1` | `efe7d26a5403cb51b15562fa163d4058724d9e544e72ae8997af369d839022e3` | `58ab10dc27a708d528c9aae3c53bc2a07a039446e7ec3718e19ad1cf3b422e17` |
| `/s/ambient-baseline-roofing/promotions?preview=1` | `eb338f60d545eb039d0ee0c78975ed518f32ddbfa17682fa4406bf65a9f96dec` | `56d6d5a3ecc82fc1415506c1c31275833c037132e74e762a1dbd67f6eecc1dc4` |

### Latest before / after captures

These are actual 1440×900 and 390×844 viewport captures at 60ms after scrolling. Before uses the exact saved pre-fix HTML and pre-fix secondary presentation; after uses current output. [Capture record](checks/approved-followup-captures.json).

| Spot | 1440 before / after | 390 before / after |
|---|---|---|
'''
for kind,spot in [('financing','calculator'),('financing','contact'),('promotions','contact'),('financing','ambient-poster'),('promotions','ambient-poster'),('promotions','scroll-poster')]:
 text+=f'| {kind} {spot} | [Before](before/approved-{kind}-{spot}-1440.png) / [After](after/approved-{kind}-{spot}-1440.png) | [Before](before/approved-{kind}-{spot}-390.png) / [After](after/approved-{kind}-{spot}-390.png) |\n'
text+='\n## Current required-gate results\n\n| Gate | Result | Evidence |\n|---|---|---|\n'
for name,result,link in [
 ('Full existing suite',f'{sum(r["status"]==0 for r in rows)}/102 completed successfully; running commands are not passes','full-checks.json'),
 ('Five Samples','3,425 Pass / 70 open Borderline / 0 Fail; 30 capture assertions','checks/qa-packets.json'),
 ('Exact replay','143/143 file hashes identical','checks/qa-replay.json'),
 ('Staff QA screen','15 states; 0 AA, keyboard, overflow or console failures','checks/qa-staff-browser.json'),
 ('Platform matrix','162 states pass; 0 text/border contrast, keyboard, overflow or non-allowlisted console failures','platform-matrix/after-platform.json'),
 ('JS-on clearance','32 states, 480 samples, 0 intersections','checks/qa-polish-browser.json'),
 ('No-JS clearance','16 states, 240 samples, 0 intersections','checks/qa-polish-no-js.json'),
 ('Focused commands','12/12 pass on current revision','focused-checks.json'),
 ('Protected outputs','279 plus platform.css match; 56 existing CSS files unchanged','checks/accepted-protected-final.json'),
 ('Archived responses','374/374 match, including the two explicitly approved poster-only hashes','checks/sites-unchanged.log'),
 ('Remaining broad audit / legacy / #028E contract','Running; not certified yet','checks/quality-summary.json')]:
 text+=f'| {name} | {result} | [Evidence]({link}) |\n'
text+='\n'+a['reuse']+'\n\n## Five Sample packet results\n\n| Sample | Pass | Borderline | Fail |\n|---|---:|---:|---:|\n'
for r in packets:text+=f'| {r["id"]} | {r["qa"]["passed"]} | {r["qa"]["pending"]} | {r["qa"]["blocking"]} |\n'
text+='\nAccessible company-name ellipsis accounts for 67 Borderlines; three Roofing transformation clips cross the histogram uncertainty band. These require human review, remain open and block approval.\n\n'+a['calibration']
text+='''

## Negative and workflow proof

[QA enforcement](checks/qa-contract.json): 76 assertions using actual browser reports; all 12 negative fixtures block approval/publication, stay HTTP 404 publicly and cannot be accepted as Borderline. Changes invalidate QA; live-review updates do not. Contractor/staff-owner decisions and report tampering are denied. [Browser negatives](checks/negative-browser.json): 37 positive/negative measurements, including real letterboxing. The synthetic morph is covered by calibration. All provider responses used in tests are local mocks.

'''
text+=a['recognition']+'\n\n'+a['status']+'\n\n'+a['phone']+'\n\n'+a['legacy']+'\n\n'+a['rail']+'\n\n'+a['filter']+'\n\n'+a['round4']+'\n\n'+a['guide']+'\n\n'+a['images']
text+='''

## Legacy helper migration and preservation

The shared helper obtains an actual browser packet, requires 0 Fail, records fictional test Borderline decisions through the real staff API, and then obtains real staff approval. No synthetic passing QA is created. Module bootstrap uses the approved missing-QA assertion followed by test-data seeding only, with no QA/approval record. [Every affected test and reason](checks/legacy-fallback-tests.json). Successful publication behavior still goes through real QA. Robles remains non-Sample and is audited under the real published-copy rule.

Evidence writes from old suites are redirected into this ticket. Builds are deferred while capture jobs need the current assets; every deferred build still must run and succeed before the 102-command suite can pass. An initial platform audit reached all 162 states but failed writing a missing report directory; that run was not counted. The harness now creates its output directory, and the complete rerun passed unchanged assertions.

[Every approved protected/archive delta](checks/protected-output-deltas.md) · [Exact normalizer boundaries](checks/normalizer-boundaries.json). The only protected expected hash update is the approved workspace phone href recorded above; the only archived expected hash updates are the two poster responses. Generic normalization, CSS/timing tolerances and frozen detector rules were not loosened.

The Domain flow block and #033I/#033V/#033T/#028G remain untouched. `.preserve/`, `round4-baseline/`, other baseline backups, downloaded executables, old packet versions and unrelated dirty evidence remain outside the commit. No OneDrive or unrelated app operation was performed.

## Command results

The live full-suite record is [full-checks.json](full-checks.json), additional variant/media commands are [additional-checks.json](additional-checks.json), and the focused gates are [focused-checks.json](focused-checks.json). Final command-by-command results will replace this pending state after every required command finishes. No failed or incomplete attempt is counted as passed.
'''
(p/'README.md').write_text(text,encoding='utf-8')