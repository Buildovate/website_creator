# Platform look

The [approved guide](../design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md) is the source of truth; [domain v2](../design-reference/platform-2026-09-27/domain-v2/index.html) is the visual reference. Its sample business facts, offers and prototype controls are not product content. Guide contrast corrections take precedence over prototype pixels.

Platform shells alone load `/platform.css` and set `<body class="bv-platform">`. Components live in `src/client/styles/platform/`; every component selector is scoped to that body. Public trade pages, legal pages, workspace documents, error pages and preview iframe contents keep their existing CSS. `platform-look.ts` adds presentation classes to legacy markup while preserving existing handlers and selectors.

Use Barlow body text, Barlow Condensed headings and IBM Plex Mono labels from `/assets/platform/fonts/`. Use `var(--bv-...)` for platform colors, spacing, radii, shadows, motion and type. The token file is the only place for color literals. Phone layout starts at 720px; all actions need a 44px target, primary buttons 52px. Use a native button/link for actions and a native dialog for a modal. Keep labels and truthful status words visible.

| Component | Example (inside the platform shell) |
|---|---|
| Page heading / eyebrow | `<p class="bv-eyebrow">Website setup</p><h1 class="bv-title">Your web address</h1>` |
| Sidebar / top bar | `<aside class="bv-sidebar sidebar">…</aside><header class="bv-topbar topbar">…</header>` |
| Primary action | `<button class="bv-button bv-button-primary">Save</button>` — at most one visible per active state |
| Secondary / danger / link | `<button class="bv-button">Cancel</button>` · `<button class="bv-button bv-button-danger">Delete</button>` · `<a class="bv-link" href="…">Learn more</a>` |
| Card / panel | `<section class="bv-card"><h3>Business details</h3>…</section>` · `bv-panel` for larger sections |
| Status pill | `<span class="bv-pill bv-pill-success">Verified</span>`; variants `bv-pill-warning`, `bv-pill-error`, `bv-pill-team` |
| Step rail | `<nav class="bv-rail" aria-label="Setup"><a href="#business" aria-current="step">Business</a>…</nav>`; `bv-step-done` only for completed steps |
| Field / select | `<label>Business name<input class="bv-field" name="name"></label>`; the same class applies to native selects and textareas |
| Radio / checkbox / switch | `<label class="check"><input type="checkbox">Enabled</label>`; native radio type; add `class="bv-switch" role="switch"` for a switch |
| Callout | `<p class="bv-callout">Connection information</p>`; `bv-callout-success`, `bv-callout-warning`, `bv-callout-error` |
| Modal / drawer | `<dialog class="bv-dialog">…</dialog>`; add `bv-drawer` for an existing drawer flow. Open with `showModal()`; preserve Escape and Tab trapping |
| Table | `<div class="bv-table-wrap"><table><thead>…</thead><tbody>…</tbody></table></div>`; provide `data-mobile-label` on cells (legacy adapter supplies it) |
| Tabs / segmented toggle | `<nav class="bv-tabs"><button aria-selected="true">Details</button>…</nav>` · `<div class="bv-segmented"><button aria-pressed="true">Monthly</button>…</div>` |
| Empty / loading / stalled / error | `<section class="bv-empty">No records yet.</section>` · `bv-loading` with `role="status"` · `bv-stalled` · `bv-callout-error` with `role="alert"` |
| Copy | `<button class="bv-copy" type="button">Copy</button>` — connect the existing clipboard handler and announce its actual result |
| Optional offer | `<aside class="bv-offer">…<button type="button" class="bv-offer-dismiss" data-bv-dismiss>No thanks</button></aside>` |

Offer rules: default to no offer. At most one per screen, always dismissible, never on error, alert, stalled, help or booking screens. Use only actual configured offers and prices; no urgency. This restyle inserts no offers. The adapter handles `data-bv-dismiss`; offer selection and eligibility belong to the owning feature.

All nonessential motion stops with reduced motion. Locked/disabled text uses the guide's `--bv-disabled-ink` on white so meaningful labels reach AA; its originally suggested disabled fill does not reach 4.5:1. Blueprint canvas tokens are defined but unused. Future canvas classes must use `bv-blueprint-*`, never the protected trade template's name.
