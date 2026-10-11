# #028F round 9d — local commit scope

[Explicit file list](round9d-file-list.txt) and [scope/size record](round9d-scope.json). No code edits or test runs in this round. The verified Suite-102 result remains 102 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 0 incomplete; Samples 3,492 Pass / 3 Borderline / 0 Fail.

The two specifically approved runtime capture sets contain 702 files / 308,764,373 bytes and 306 files / 299,846,220 bytes. Neither contains a file over 50 MB. Additional small runtime inputs are listed with their reading test; they include the first current Copper Kite packet used by the contract/staff/replay tests, the alternate registry proof pairs, and detector fixture inputs. These are not bulk screenshot evidence. Historical before CSS in round6-approved-baseline is excluded as requested; the existing fixture routes guard its absence and return their existing 404 fallback.

BUILD-BACKLOG.md is entirely unstaged: its full diff mixes other tickets and Domain edits. The 203 known planning documents remain untracked and unchanged. All bulk screenshots, packet versions other than direct runtime inputs, round8*-before backups, round4-baseline, round6-approved-baseline, downloads, build output and unrelated evidence are left in place. No .gitignore changes.

[The #028F-B ticket](../BORDERLINE-TICKET.md) retains all 70 original IDs OPEN: Joe REJECTED — fix in product, never Accept. No QA decisions recorded; qaGateClear=false. No push, deploy, provider calls or credits.

Evidence-local .gitattributes follows fdcd459 byte preservation and extends it to all files in this evidence folder because runtime source locks and tools also have exact SHA locks. This changes Git checkout handling only; no source, test, QA normalization, threshold, detector, runner or guard is edited.
