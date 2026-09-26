# Standing UX rules

Apply these rules to public sites, contractor dashboards and administrator screens. Design the Loading, Empty, Error, Success, Offline and Partial states before building each screen. At 390px, keep the primary task visible and usable; honor reduced motion and keyboard access.

## Feedback and actions

- Success says what happened and gives exactly one useful next step. Reserve celebration for rare wins.
- Buttons remain live and explain what is needed. On click, reveal and highlight missing fields and move focus to the first one. A busy request is not a disabled-looking dead end: show progress and retain a way to understand the state.
- Payments mean one tap, one charge. Keep button width fixed and show a spinner in place, send a backend idempotency key, and re-enable only when the real request resolves. A retry reuses the same key until its outcome is known.
- Restore scroll position on Back. Give anchors `scroll-margin-top` so they land below sticky headers. Do not use infinite scroll where it buries important footer content.

## Access and motion

- Provide visible `:focus-visible` rings, a skip link, dialog focus traps and focus return, visual order matching DOM order, and at least 4.5:1 text contrast.
- Keep transitions below 150ms, with no bounce. Reduced motion presents the same information statically.

## Dashboards, tables and settings

- Use one accent color, no decorative gradients, one hero number, shadows only on floating elements, tabular digits and sparklines. Prefer dense rows and thin borders.
- In tables, align numbers right and text left. Use one hairline between rows rather than zebra stripes, a pinned header and first column, a dash for empty cells, and truncation with a tooltip. Reveal row actions on hover **and** focus. Shift-click range selection persists across paging. Bulk actions offer an Undo toast; permanent deletes require typing to confirm.
- Badges cap at `99+` and clear when viewed. Red means action needed; green means status.
- Avatars fall back from photo to initials (stable name and color) to an icon; never show a broken image.
- Group settings by task and make them searchable. Mark changed values visibly. Toggles apply instantly; identity fields use explicit Save. Put the danger zone at the bottom.
- Keep context menus inside the viewport and grouped by intent. On phones, use a bottom sheet.
- Provide documented dashboard keyboard shortcuts without overriding text entry or browser shortcuts.
