# #024 follow-up — published poster chapter

Part A is complete locally. The finished Roofing Financing chapter now publishes with its optimized poster while its dedicated film is Pending. Only the private media status panel and Sample badge disappear. An approved film uses the same chapter/player. The preview status explanation was corrected to describe this behavior; all other preview markup, manifest choices, players, assets, offsets and motion behavior are unchanged. This supersedes the earlier #024 README's statement that the whole pending chapter hides on publish.

The fix removes one publication guard. Existing tests now assert the heading, notes, action and decoded responsive poster are present publicly, with no Pending / Not connected / Sample language and no pending video download.

Build, typecheck, 66 regression scripts, 18 browser suites, 210 platform states and template asset integrity passed. Updated #024 suite: 347 server/HTML assertions and 99 browser assertions. All 305 outside-scope HTTP-200 HTML responses across 17 kits remain byte-identical. 8 URLs returned 200 after the required Vite restart. 2559 prior evidence files restored; 262 unrelated files unchanged. Higgsfield credits used: **0**. No vendor calls, push, deployment or staging access.

## Published viewport captures

- [published-planning-chapter-desktop.png](published-planning-chapter-desktop.png)
- [published-planning-chapter-phone.png](published-planning-chapter-phone.png)
- [published-planning-notes-desktop.png](published-planning-notes-desktop.png)
- [published-planning-notes-phone.png](published-planning-notes-phone.png)
- [published-planning-poster-desktop.png](published-planning-poster-desktop.png)
- [published-planning-poster-phone.png](published-planning-poster-phone.png)

Desktop: 1440×900. Phone: 390×844. The chapter and poster/notes are separate actual viewport captures. Existing #024 reduced-motion, no-JS, lazy loading, error and pause checks all reran; the original evidence files were restored afterward.

Part B #025 is separately authorized and will have its own commit and evidence.
