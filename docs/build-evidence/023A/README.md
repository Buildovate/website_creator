# #023A — Scroll-story hero editor restored

Completed locally. No push, deployment, staging access, vendor calls or paid generation. **Higgsfield credits used: 0.**

## What disappeared, and when

The original Sites v11 application included an “Edit scroll-story hero” button and public/scroll-story-ui.js. Its recovered commit is a7de87500283677ba07a2432828fd29fa9a77ca2. The current repository’s first commit, **218229b (September 24, 2026, 01:37 Pacific)**, already omitted that editor and button. Its scripts/build-client.mjs included only three legacy workspace modules, whereas the recovered build included thirteen. Git has no later deletion of this editor: the gap predates this repository’s recorded implementation history.

docs/TEMPLATE_RESTORATION.md explains the partial restoration: the trade/template visual library and website rendering were imported, while the full original workspace workflow was not. docs/product/PLATFORM-GAP-AUDIT.md §2 identifies the missing scroll-story editor explicitly. The earlier #023 evidence records the story settings and lock but does not supply an editor. In plain language: the website kept its cinematic hero, but the control panel used to edit it was left out during the partial import. The exact earlier removal date cannot be established from this repository. The recovered directory is unchanged.

## What was restored and reused

- **Hero** is now a contractor workspace screen, beside the existing editor. Owners/admins unlock Scroll Story deliberately, edit a private draft, view the actual server-rendered hero beside the controls on desktop or below them on phone, save, and explicitly publish.
- Plain controls cover the opening headline/introduction, both action labels, destination, story visibility, three stage captions, installed/uploaded stills and five-chapter copy/media. Standard stories retain their build/chapter style, ambient clip, intensity and transition controls. Journey pages keep their approved sequence and expose the relevant copy/caption controls. The Roofing flight and paired final still are not replaced.
- Existing cleanScrollStory normalization, tenant PUT/render endpoints, optimistic versions, owner publication, before-publish backups, photo upload/ownership, and #023 manifest/history are reused. There is no alternate storage table or generation path. Add photographs through the existing Business upload flow; the editor selects only this tenant’s media.
- The existing **settings.generationId treatment seed** and all asset choices remain stable on hero saves. A changed story is recorded as a new manifest revision through #023’s existing saveGeneration; that revision has its existing separate audit ID. An unchanged save, render, restart or republish preserves the manifest ID and revision too. #023 generation logic itself is byte-unchanged. Locks survive regeneration.
- The server rejects edits by editors/viewers, edits while Scroll Story is locked, stale versions, cross-tenant media in every hero slot, and invalid approved before/after pairs. Publication revalidates ownership. Only published hero references grant public photo access; draft uploads remain private.
- A sandboxed, script-free live preview uses the real renderer, not an imitation. The full preview opens the existing private website to exercise scroll motion. There is one sticky Save button and the existing Publish action; the mobile helper does not clone this screen’s Save. The platform audit applies its same sticky-bar geometry checks to this bar.

## Rules and deliberate exclusions

The recovery file is a behavior reference, not code copied wholesale. Its sample-review/name/rating controls were not restored because the current no-invented-reviews rule takes precedence. Its below-hero detail controls were not restored on this hero screen because #020 and the other protected sections must remain unchanged. No AI research or generation buttons are inserted into this editor. Existing installed imagery retains its illustrative provenance.

The only public-renderer integration is an explicit editor-version marker inside the existing scrollStory settings: newer journey copy accepts saved hero edits only after this editor is intentionally saved. Without that marker, existing output follows the original branch. All 17 unedited kit homepages compare **byte for byte**, not just visually; before/after HTML and hashes are supplied. Hero/drone asset bytes and public motion controllers are unchanged. Pricing, financing, quiz, ebook, city pages, Expenses and #023 manifest implementation are untouched.

## Verification

| Check | Result |
| --- | --- |
| Build and client typecheck | Passed |
| Existing + new regression scripts | 65 passed |
| New hero server assertions | 50 passed |
| All browser suites | 17 passed |
| New hero browser assertions | 45 passed |
| Platform mobile/desktop states | 210 passed |
| Template asset integrity | 605 references / 17 kits passed |
| Unedited published HTML | 17 / 17 byte-identical |
| Save layout shift | Desktop 0; phone 0 |
| Vite HTTP checks | 6 × 200 |

Server coverage includes edit/render/save/publish, draft privacy, manifest recording and stable seeds, unchanged saves/republish, actual separate-process restart against persisted PGLite, role/tenant gates, all media slots, public media boundary, optimistic conflict and pre-publish backup reuse. Browser coverage includes keyboard focus, phone touch, one Save, actual live preview, failure retention, offline/loading/success/read-only states, publication, reduced motion and JavaScript-disabled published content. No browser exceptions or outbound provider requests were observed. Local QA fixtures supply screenshots and fault injection; they are never customer proof.

Two older regression fixtures now explicitly unlock Scroll Story before intentionally editing it. Their existing assertions are retained. The platform suite discovers the new Hero screen automatically. Reports: checks.json, existing-browser-checks.json, platform-mobile-audit.json, regression-results.json, browser-results.json, restart-proof.json, unedited-proof.json and route-check.json.

## Viewport screenshots

Every PNG below is a real viewport capture at 1440×900 or 390×844. “Empty” means no uploaded photographs; installed imagery is still available. Error/loading states use clearly identified local test responses. The phone live-preview capture shows the stacked preview separately.

- [editing-desktop.png](editing-desktop.png)
- [editing-phone.png](editing-phone.png)
- [empty-locked-desktop.png](empty-locked-desktop.png)
- [empty-locked-phone.png](empty-locked-phone.png)
- [error-desktop.png](error-desktop.png)
- [error-phone.png](error-phone.png)
- [live-preview-phone.png](live-preview-phone.png)
- [loading-desktop.png](loading-desktop.png)
- [loading-phone.png](loading-phone.png)
- [offline-desktop.png](offline-desktop.png)
- [offline-phone.png](offline-phone.png)
- [published-after-desktop.png](published-after-desktop.png)
- [published-after-phone.png](published-after-phone.png)
- [published-before-desktop.png](published-before-desktop.png)
- [published-before-phone.png](published-before-phone.png)
- [published-no-js-desktop.png](published-no-js-desktop.png)
- [published-no-js-phone.png](published-no-js-phone.png)
- [read-only-desktop.png](read-only-desktop.png)
- [read-only-phone.png](read-only-phone.png)
- [reduced-desktop.png](reduced-desktop.png)
- [reduced-phone.png](reduced-phone.png)
- [success-desktop.png](success-desktop.png)
- [success-phone.png](success-phone.png)

## Preservation and limits

Backed up and restored **2206** pre-existing evidence files byte-for-byte. All **262** unrelated dirty/untracked files have their original hashes. New captures created by older suites are relocated into this ticket’s regenerated-extra folder. preservation.json records the checks. No real phone hardware or vendor integration is claimed; phone evidence uses Chromium touch emulation. No requested feature remains blocked. #024 was not started.
