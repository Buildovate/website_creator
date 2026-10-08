# #028G round 1b notes

Only the owner-provided guide, blueprint-v6 reference bundle, and this ticket's three evidence documents change. Main checkout and Dropbox are read-only. The guide is byte-identical to the supplied SHA-256. All 11 PNGs are byte-identical to the owner originals. See the reference manifest for hashes and screen descriptions.

The initial worktree inspection found only the new owner guide and our prior STATUS.md, NOTES.md and results.json; no foreign modifications. Tracked diff against BASE was empty before this round. Round 1's missing-input stop is resolved.

Current user instructions expressly say no app code and only file/hash checks. Accordingly the original G-1 progress engine, adapters and step-rule/source implementation are not claimed complete. No UI or production logic was built; the next named sub-ticket is G-2 Desktop Game view.

## Protected-diff proof (before commit)

From C:\Users\joe\wc-game:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src public tests dist docs/modules/design.md docs/build-evidence/028F BUILD-BACKLOG.md BUILD-STATUS.md
```

Exit 0. Output: empty.

A broader check excludes only the three allowed documentation areas, so it also covers every other tracked baseline, checksum, detector, shared contract and owned area:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**'
```

Exit 0. Output: empty. The change allowlist also checks untracked paths. Explicit staging is limited to the guide, reference files and evidence documents; never git add -A.

## Checks

Guide expected SHA-256; exact 11-file source inventory; branch and BASE; initial no-foreign-change inventory; single curl GET HTTP 200; 11 source/copy hash comparisons; 12 reference-asset hashes against manifest; guide unchanged after work; protected diff empty. No test suites executed. Known platform BASE failures were documented only. 0 provider calls and 0 credits.
