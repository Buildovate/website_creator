# Buildovate Platform Design Guide

*Version 1 · 2026-09-27 · Source of truth: the approved web address prototype v2 (`domain-v2/index.html`)*

## For Joe (the short version)

The look you approved for the web address setup becomes the look for **every Buildovate platform screen**: the dashboard and Tabs view, the onboarding questionnaire, Blueprint and town, the price book, promotions and settings, the staff and admin screens, and the preview and publish controls.

In one breath: **warm paper background, crisp white cards, deep navy headings in a tall condensed font, one sand-orange accent for "you are here", and green only when something is actually done.** Buttons are big and easy to tap. Offers are calm, one per screen at most, and always come with "No thanks". Staff-only screens carry a purple **Buildovate team only** tag.

**What does not change:** the contractor websites (all 17 trade kits and their design styles) keep their current look. This guide covers only the screens contractors and staff use to run Buildovate.

The rest of this document is the exact spec for developers.

---

## 0. Scope and rules for implementers

| In scope (restyle) | Out of scope (do not touch) |
|---|---|
| Platform shell (sidebar, top bar, notice band), Overview/Websites (Tabs view), website sections (`renderSite` tabs), questionnaire, Blueprint/town (#028G), price book, promotions/settings/plan pages, Sales CRM screens (contacts, pipeline, calendar, follow-up), staff/admin (team, monitoring, audit, expenses, launch checklist), preview and publish chrome, sign-in pages, dialogs | Contractor trade sites and every trade kit or design style (`public/*.css` used by `/s/:slug`, `design-studio.css`, `trade-*.css`, `site-*.css`, etc.), homeowner-facing pages, contractor-site legal pages, the prototype's **tester panel** ("Prototype controls") |

Rules:
1. Scope all new component CSS under a platform root class (recommended: `body.bv-platform`, set on `dashboard()` and the auth views). `/app.css` is also loaded by contractor-site legal pages (`src/site-polish.js` `renderLegalPage`) and public workspace documents (`src/workspace.js`). Unscoped global rules would change those pages.
2. Tokens use the `--bv-` prefix, so they cannot collide with trade-kit variables.
3. Sample data, "Example price", and "Prototype" labels in the reference are **not** shippable content. Real prices come from the catalog/settings; the absence of a real integration shows as an honest *Not connected* state.
4. Screenshot references below are in `domain-v2/screenshots/` unless another folder is named. Desktop captures are 1280×800. Phone captures are 390×844 at 2× (files are 780 px wide).

---

## 1. Design tokens

### 1.1 Color

| Token | Hex | Use |
|---|---|---|
| `--bv-bg` | `#f5f3ee` | Page background (warm paper) |
| `--bv-card` | `#ffffff` | Cards, top bar, band, modals, drawers, fields |
| `--bv-surface-2` | `#f7f5f1` | Table headers, message headers, "taken" rows |
| `--bv-surface-3` | `#f3f1ec` | Locked/disabled fills |
| `--bv-ink` | `#15212b` | Primary text |
| `--bv-ink-2` | `#4b5967` | Secondary text, lead paragraphs |
| `--bv-ink-3` | `#66717d` | Tertiary text: hints, eyebrows, meta (**see §6: darken to `#5d6873`**) |
| `--bv-line` | `#e4dfd5` | Card borders, dividers |
| `--bv-line-2` | `#d6d0c4` | Secondary-button borders, idle radios and field borders (**see §6**) |
| `--bv-navy` | `#10304d` | Headings, primary button, selected state |
| `--bv-navy-2` | `#1b4468` | Primary hover, completed steps, hover border |
| `--bv-sand` | `#eab97f` | Current step, "recommended", waiting accent |
| `--bv-sand-soft` | `#fbf0e1` | Recommended/upsell icon tile, current-step halo |
| `--bv-sand-ink` | `#8a4f12` | Text on sand-soft (Recommended chip) |
| `--bv-blue` | `#1f6feb` | Focus ring and focused field border only |
| `--bv-blue-soft` | `#e8f0fe` | Focus halo, info/explain boxes, selected table row |
| `--bv-info-ink` | `#1a3f7a` | Text in explain / "Did you mean" boxes |
| `--bv-link` (`--crm`) | `#1e5bb8` | Links, text buttons, blue action button, CRM elements |
| `--bv-link-hover` | `#174c9c` | Blue button hover |
| `--bv-link-soft` | `#e7effc` | CRM/info chip and unlock card fill |
| `--bv-link-line` | `#bcd0f1` | CRM/info chip and card border |
| `--bv-ok` | `#1d7a4c` | Done, live, verified, success button, switch-on |
| `--bv-ok-hover` | `#176640` | Success button hover |
| `--bv-ok-soft` | `#e5f4ec` | Success fills |
| `--bv-ok-line` | `#b8dcc7` | Success borders |
| `--bv-ok-ink` | `#155c39` | Body text on ok-soft |
| `--bv-warn` | `#8a5300` | Waiting/attention text, "Example price" label |
| `--bv-warn-soft` | `#fff3dc` | Warning fills |
| `--bv-warn-line` | `#f1d9a8` | Warning borders |
| `--bv-warn-ink` | `#6d4200` | Body text on warn-soft |
| `--bv-bad` | `#b3261e` | Error/alert text, danger button |
| `--bv-bad-hover` | `#8f1f18` | Danger hover *(new; not in prototype)* |
| `--bv-bad-soft` | `#fdecea` | Error fills |
| `--bv-bad-line` | `#f0b4ae` | Error/alert borders |
| `--bv-bad-ink` | `#7d1a14` | Alert headline on bad-soft |
| `--bv-team` | `#5b4b8a` | "Buildovate team only" tag, Needs-help status |
| `--bv-team-soft` | `#efebfa` | Staff/mock notice fill |
| `--bv-team-line` | `#d6cdf0` | Staff/mock notice border |
| `--bv-team-ink` | `#3e3168` | Text on team-soft notice |
| `--bv-overlay` | `rgba(21,33,43,.5)` | Modal backdrop (drawer: `.35`) |

**Dark "Blueprint" sub-theme.** Used only on the Blueprint plan and town canvas, and on the town card. It comes from `blueprint-v5` and `pricebook-v1` in the handoff zip. Surrounding chrome (top bar, panels, forms opened from a room) stays in the light theme.

| Token | Hex | Use |
|---|---|---|
| `--bv-bp` | `#0f2c4d` | Blueprint canvas |
| `--bv-bp-deep` | `#0b2240` | Deeper areas, title block |
| `--bv-bp-lift` | `#133a63` | Raised panels on canvas |
| `--bv-bp-ink` | `#e8f6ff` | Text on canvas |
| `--bv-bp-line` | `#bfe6ff` | Linework (soft `rgba(191,230,255,.55)`, faint `.22`) |
| `--bv-bp-done` | `#4ade80` | Done |
| `--bv-bp-need` | `#fbbf24` | Needs you / waiting |
| `--bv-bp-off` | `#94a3b8` | Not connected |
| `--bv-bp-stamp` | `#ff7a59` | APPROVED stamp |
| `--bv-bp-lit` | `#fde68a` | Lit windows / lamps |
| `--bv-town` | `#0f2536` | Town card background (domain v2) |

### 1.2 Typography

Fonts: **Barlow** (400/500/600/700) for UI text, **Barlow Condensed** (500/600/700) for display, **IBM Plex Mono** (400/500/600) for eyebrows, labels, and codes. The prototype loads them from Google Fonts. For production, self-host them as `woff2` in `public/assets/`; the repo already self-hosts DM Sans and a Barlow Bold `.ttf`.

| Role | Spec | Example |
|---|---|---|
| Display XL (success hero) | 700 40px/1.1 Barlow Condensed, `--bv-ok` (34px phone) | "Connected" `desktop-12-success.png` |
| H1 page title | 700 32px/1.1 Barlow Condensed, letter-spacing .01em, navy (28px phone) | `desktop-01-choice.png` |
| Big value (domain) | 700 34px/1.1 Condensed, navy (28px phone); manage header 30px (24px phone) | `desktop-09-new-what-you-get.png`, `desktop-20-manage-alert.png` |
| Stat number | 700 26px/1 Condensed, navy | `desktop-32-staff.png` |
| Band title / step name | 700 20px/1.1 Condensed, .02em (18px phone) | top band in every onboarding shot |
| H2 (modal) | 600-700 21px/1.25 Barlow | `desktop-11-upsell-how-it-works.png` |
| Choice title | 700 20px Barlow (18px phone) | `desktop-01-choice.png` |
| Card title / H3 | 700 18px Barlow | `desktop-29-manual-steps.png` |
| Lead paragraph | 400 17px/1.45 Barlow, ink-2 (16px phone) | under every H1 |
| Body | 400 16px/1.45 Barlow | — |
| Field text | 18px (16.5px `.sm`) | `desktop-08-new-search-typo-taken.png` |
| Small / meta | 14–15.5px, ink-2 or ink-3 | — |
| Rail label | 600 13px/1.2 (11px phone) | top band |
| Eyebrow / table header / mini-head | 600 11–11.5px/1 IBM Plex Mono, uppercase, letter-spacing .08–.1em, ink-3 | `desktop-32-staff.png` table header |
| Tag (team only, Example badge) | 600 10.5–11px Mono uppercase | `desktop-32-staff.png` |
| Inline code / DNS values | 500 14px/1.3 Mono on `#f4f2ed` with 1px line border, radius 5px | `desktop-29-manual-steps.png` |

Base: `body{font:16px/1.45 var(--bv-sans); -webkit-font-smoothing:antialiased}`.

### 1.3 Spacing

A 2px-based scale. The prototype uses these values over and over; map any odd value to the nearest step.

| Token | px | Typical use |
|---|---|---|
| `--bv-space-1` | 4 | Icon gaps, chip inner |
| `--bv-space-2` | 8 | Button groups, chip gaps |
| `--bv-space-3` | 10 | List gaps, stacks of results |
| `--bv-space-4` | 12 | `.stack` gap, card-to-card gap, `.actions` gap |
| `--bv-space-5` | 14 | Grid gutters, card inner (phone 16) |
| `--bv-space-6` | 16 | Card padding (phone), drawer padding |
| `--bv-space-7` | 20 | Card padding (desktop), actions top margin |
| `--bv-space-8` | 24 | Page side padding (desktop), primary button x-padding |
| `--bv-space-9` | 26 | Main top padding |
| `--bv-space-10` | 32 | Section breaks |

Layout widths: narrow task pages `max-width:760px`; wide pages (staff, manage, notifications) `1140px`; header band inner `1080px`. The main element's bottom padding is 120px (110px phone), which leaves room for sticky footers.

### 1.4 Radii

| Token | px | Use |
|---|---|---|
| `--bv-r-xs` | 5 | Code chips, small badges |
| `--bv-r-sm` | 8 | Copy button, drawer close, small controls |
| `--bv-r-md` | 10 | Buttons, fields, notes, callouts, table wraps (`.rec-table`) |
| `--bv-r-lg` | 12 | Cards, modals, result rows, stat tiles, staff table |
| `--bv-r-xl` | 14 | Big choice cards |
| `--bv-r-pill` | 99px | Chips, pills, filter chips, switch, progress |

### 1.5 Shadows and focus

| Token | Value | Use |
|---|---|---|
| `--bv-shadow-hover` | `0 6px 18px rgba(16,48,77,.08)` | Choice card hover |
| `--bv-shadow-callout` | `0 10px 24px rgba(16,48,77,.28)` | Navy callout |
| `--bv-shadow-toast` | `0 10px 26px rgba(0,0,0,.2)` | Toast, tooltip (`0 6px 18px rgba(0,0,0,.18)`) |
| `--bv-shadow-modal` | `0 24px 60px rgba(0,0,0,.35)` | Modal |
| `--bv-shadow-drawer` | `-18px 0 44px rgba(0,0,0,.18)` | Drawer |
| `--bv-shadow-sticky` | `0 -10px 16px -8px rgba(21,33,43,.10)` | Sticky bottom action bar |
| `--bv-ring-select` | `0 0 0 3px rgba(16,48,77,.12)` | Selected result/option/slot (with navy border) |
| `--bv-ring-rec` | `0 0 0 3px var(--bv-sand-soft)` | Recommended choice (with sand border) |
| `--bv-ring-focus` | `0 0 0 3px var(--bv-blue-soft)` | Focused field (with blue border) |
| `--bv-ring-error` | `0 0 0 3px var(--bv-bad-soft)` | Field in error (with red border) |
| Focus outline (keyboard) | `outline:3px solid var(--bv-blue); outline-offset:2px` | Every interactive element via `:focus-visible` |

### 1.6 Motion

`--bv-t:120ms` for hover, border, and color changes. Enter animations: `fade`/`rise` at 220ms ease with a 6–12px translateY; drawer `slidein` 200ms; success `pop` 300–450ms; progress fill `.6s ease`. Wrap every non-essential animation (pulse, glow, pop, and the Blueprint build and stamp) in `@media (prefers-reduced-motion: reduce)` and show the end state instead. The prototype does not do this yet; it is required for the platform and for #028G.

### 1.7 Breakpoints

The prototype uses one breakpoint: **`max-width:720px`** (phone). Wide pages have two-column grids that collapse at that breakpoint too. Recommended platform set:

| Token | Query | Behaviour |
|---|---|---|
| phone | `max-width:720px` | One column, full-width buttons, tables become stacked cards, drawer 100vw |
| tablet | `max-width:1100px` | Sidebar can collapse; four-column stats become two columns *(derived; not in prototype)* |

> Conflict: `src/client/workspace/mobile.ts` switches phone behaviour with `matchMedia('(max-width:700px)')`, and existing platform CSS uses 650/700/760/1200. Pick one phone value and use it in both CSS and JS (see open questions).

---

## 2. Drop-in CSS custom properties

```css
/* Buildovate platform tokens: scope component rules under body.bv-platform */
:root{
  /* surfaces & text */
  --bv-bg:#f5f3ee; --bv-card:#ffffff; --bv-surface-2:#f7f5f1; --bv-surface-3:#f3f1ec;
  --bv-ink:#15212b; --bv-ink-2:#4b5967; --bv-ink-3:#5d6873; /* prototype #66717d; darkened for AA on --bv-bg */
  --bv-line:#e4dfd5; --bv-line-2:#d6d0c4; --bv-line-strong:#8a8375; /* input/radio/switch boundaries, 3:1 */
  /* brand */
  --bv-navy:#10304d; --bv-navy-2:#1b4468;
  --bv-sand:#eab97f; --bv-sand-soft:#fbf0e1; --bv-sand-ink:#8a4f12;
  /* focus / info / link */
  --bv-blue:#1f6feb; --bv-blue-soft:#e8f0fe; --bv-info-ink:#1a3f7a;
  --bv-link:#1e5bb8; --bv-link-hover:#174c9c; --bv-link-soft:#e7effc; --bv-link-line:#bcd0f1;
  /* status */
  --bv-ok:#1d7a4c; --bv-ok-hover:#176640; --bv-ok-soft:#e5f4ec; --bv-ok-line:#b8dcc7; --bv-ok-ink:#155c39;
  --bv-warn:#8a5300; --bv-warn-soft:#fff3dc; --bv-warn-line:#f1d9a8; --bv-warn-ink:#6d4200;
  --bv-bad:#b3261e; --bv-bad-hover:#8f1f18; --bv-bad-soft:#fdecea; --bv-bad-line:#f0b4ae; --bv-bad-ink:#7d1a14;
  --bv-team:#5b4b8a; --bv-team-soft:#efebfa; --bv-team-line:#d6cdf0; --bv-team-ink:#3e3168;
  --bv-overlay:rgba(21,33,43,.5); --bv-overlay-drawer:rgba(21,33,43,.35);
  /* blueprint sub-theme */
  --bv-bp:#0f2c4d; --bv-bp-deep:#0b2240; --bv-bp-lift:#133a63; --bv-bp-ink:#e8f6ff;
  --bv-bp-line:#bfe6ff; --bv-bp-line-soft:rgba(191,230,255,.55); --bv-bp-line-faint:rgba(191,230,255,.22);
  --bv-bp-done:#4ade80; --bv-bp-need:#fbbf24; --bv-bp-off:#94a3b8; --bv-bp-stamp:#ff7a59; --bv-bp-lit:#fde68a;
  --bv-town:#0f2536;
  /* type */
  --bv-sans:"Barlow",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --bv-cond:"Barlow Condensed","Arial Narrow",system-ui,sans-serif;
  --bv-mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;
  --bv-fs-display:40px; --bv-fs-h1:32px; --bv-fs-h1-phone:28px; --bv-fs-bigvalue:34px; --bv-fs-stat:26px;
  --bv-fs-band:20px; --bv-fs-h2:21px; --bv-fs-choice:20px; --bv-fs-h3:18px; --bv-fs-lead:17px;
  --bv-fs-body:16px; --bv-fs-small:14.5px; --bv-fs-label:13px; --bv-fs-eyebrow:11.5px; --bv-fs-tag:10.5px;
  --bv-lh-body:1.45; --bv-lh-tight:1.1;
  /* space */
  --bv-space-1:4px; --bv-space-2:8px; --bv-space-3:10px; --bv-space-4:12px; --bv-space-5:14px;
  --bv-space-6:16px; --bv-space-7:20px; --bv-space-8:24px; --bv-space-9:26px; --bv-space-10:32px;
  --bv-w-narrow:760px; --bv-w-wide:1140px; --bv-w-band:1080px;
  /* radius */
  --bv-r-xs:5px; --bv-r-sm:8px; --bv-r-md:10px; --bv-r-lg:12px; --bv-r-xl:14px; --bv-r-pill:99px;
  /* elevation & rings */
  --bv-shadow-hover:0 6px 18px rgba(16,48,77,.08);
  --bv-shadow-callout:0 10px 24px rgba(16,48,77,.28);
  --bv-shadow-tip:0 6px 18px rgba(0,0,0,.18);
  --bv-shadow-toast:0 10px 26px rgba(0,0,0,.2);
  --bv-shadow-modal:0 24px 60px rgba(0,0,0,.35);
  --bv-shadow-drawer:-18px 0 44px rgba(0,0,0,.18);
  --bv-shadow-sticky:0 -10px 16px -8px rgba(21,33,43,.10);
  --bv-ring-select:0 0 0 3px rgba(16,48,77,.12);
  --bv-ring-rec:0 0 0 3px var(--bv-sand-soft);
  --bv-ring-focus:0 0 0 3px var(--bv-blue-soft);
  --bv-ring-error:0 0 0 3px var(--bv-bad-soft);
  /* motion */
  --bv-t:120ms; --bv-t-enter:220ms;
  /* control sizes */
  --bv-h-btn:52px; --bv-h-btn-sm:44px; --bv-h-btn-xs:40px; --bv-h-field:54px; --bv-h-field-sm:48px;
  --bv-h-topbar:56px; --bv-h-topbar-phone:54px;
}
```

---

## 3. Components

Each entry lists the class names from the prototype, the spec, and the screenshot that shows it.

### 3.1 App chrome

**Top bar** (`.top`) · every screenshot, e.g. `desktop-01-choice.png`, `mobile-01-choice.png`
- Sticky, 56px tall (54px phone), white, 1px `--bv-line` bottom border, padding 0 20px (0 14px phone), gap 14px.
- Logo: 28px navy square (radius 7px) plus the "BUILDOVATE" wordmark in 700 17px Condensed, uppercase, letter-spacing .12em, navy. A 1px×22px separator comes next, then the business name (600 15.5px). The right side holds meta in 13.5px ink-2 (plan, "Saved" with a 7px green dot, and a text link).
- Phone: hide the wordmark, separator, and right side; ellipsize the business name.
- *Platform mapping (derived):* this replaces the current 78px `.topbar`. The existing dark sidebar (`#111d31`) should move to `--bv-navy` with Barlow nav labels, a sand 3px inset bar on the active item (in place of the blue `#6592ff`), and Mono uppercase group labels. The prototype has no sidebar, so treat this mapping as derived.

**Context band** (`.band`) · `desktop-01-choice.png`
- White, bottom border, inner width 1080px, padding 16px 24px 18px (14px 16px 16px phone). Holds the eyebrow ("STEP 4 OF 6"), the band title, the step rail, and optionally the free-address strip (`.freebox`: bg-colored, 1px line, radius 12px, padding 11px 14px).

**Step rail** (`.rail`) · `desktop-01-choice.png`, `desktop-02-louie-rule.png`, `mobile-01-choice.png`
- A grid of N equal columns. Each step is a 32px circle (28px phone) over a 13px label (11px phone), joined by a 3px connector line.
- States:
  - **done:** navy-2 fill, white check, navy-2 connector.
  - **current:** sand fill, navy number, 4px sand-soft halo, navy label.
  - **todo:** white fill, 2px line-2 border, ink-3 number.
  - **locked:** surface-3 fill, dashed border, lock icon, `#8a939c` glyph.
- Hover shows a `0 0 0 4px rgba(27,68,104,.12)` halo. A done step that is tapped shows a toast ("Already done").
- Use it for the questionnaire, onboarding, and any linear flow.

**Locked action + rule callout** (`.btn-crm`, `.callout`) · `desktop-02-louie-rule.png`, `mobile-02-louie-fixed.png`, `desktop-13-crm-unlock.png`
- Locked button: surface-3 fill, line-2 border, muted text, lock icon, radius 10px, padding 10px 16px. It carries a note underneath ("Unlocks after this step"). When unlocked it turns `--bv-link` blue.
- Callout: navy fill, white 14px text, radius 10px, padding 10px 14px, a sand Mono label on the left, and a 12px rotated-square pointer. It sits **in normal flow** (never absolutely positioned over content), and the highlighted target gets a 3px sand outline.

### 3.2 Buttons

| Variant | Class | Spec | Seen in |
|---|---|---|---|
| Primary | `.btn` | Navy fill, white 600 17px, radius 10px, padding 15px 24px, min-height 52px, gap 9px; hover navy-2; disabled opacity .55 | `desktop-09-new-what-you-get.png` ("Get it") |
| Success | `.btn.green` | ok fill, hover `#176640`. Use only for confirming a completed, positive action ("Approve", "Go live") | `desktop-28-registrar-popup.png` |
| Blue / CRM | `.btn.blue` | link fill, hover `#174c9c`. Reserved for CRM and connection actions | `desktop-13-crm-unlock.png`, `desktop-15-crm-connect.png` |
| Secondary | `.btn2` | White, 1px line-2 border, ink 600 16px, padding 13px 20px, min-height 52px; hover border navy-2. Compact sizes 44/42/40px with 15px text | "Get help", "No thanks" in `desktop-30-setup-stalled.png` |
| Danger | `.btn.danger` *(formalized)* | bad fill `#b3261e`, hover `#8f1f18`, white text. The prototype uses it inline once, for "Fix it for me" on the alert. Use it for destructive or repairing actions on alert screens only | `desktop-20-manage-alert.png`, `mobile-06-manage-alert.png` |
| Text link | `.tlink` | link 600 15.5px, underline offset 3px, padding 8px 0 | helper links under choices, `desktop-01-choice.png` |
| Quiet link | `.linkbtn` | ink-2 13.5px underlined | top bar "Start over" |
| Back | `.back` | ink-2 600 15px with chevron; hover navy | `desktop-32-staff.png` |
| Block | `.block` | width 100% | phone screens |

Rules: one primary per view. Phone: every button inside `.actions` goes full width. Button groups use `.actions` (flex, gap 12px, margin-top 20px, wraps). The sticky bottom bar `.sticky-go` (bg color, sticky shadow) holds the main action on long lists (`desktop-08-new-search-typo-taken.png`).

### 3.3 Cards and choice lists

| Pattern | Class | Spec | Seen in |
|---|---|---|---|
| Card | `.card` | White, 1px line, radius 12px, padding 20px (16px phone) | everywhere |
| Big choice | `.choice` | White, 1.5px line border, radius 14px, padding 20px, a 52px icon tile (radius 12px, bg fill), 20px/700 title, 15.5px ink-2 subtitle, right chevron (hidden on phone). Hover: navy-2 border and hover shadow. **Recommended**: sand border, rec ring, sand-soft icon tile, and a "Recommended" chip | `desktop-01-choice.png`, `mobile-01-choice.png` |
| Selectable row | `.res` / `.opt` / `.slot` | White, 1.5px line, radius 12px, 22px radio. Selected: navy border, select ring, navy radio dot. Taken/unavailable: surface-2 fill, strikethrough ink-3 text, dashed radio | `desktop-08-new-search-typo-taken.png`, `desktop-27-existing-oldsite.png`, Path C slots |
| Key/value rows | `.rows`, `.wyg`, `.mrow` | Rows divided by 1px lines, 26–36px icon column, bold key, 14px ink-3 sub-line, optional switch on the right | `desktop-09-new-what-you-get.png`, `desktop-20-manage-alert.png` |
| Stat tile | `.stat` | White card, radius 12px, padding 12px 14px, 26px Condensed number, 13.5px ink-3 label. Four columns, two on phone | `desktop-32-staff.png`, `mobile-09-staff.png` |
| Locked card | `.lockedcard` | surface-3, 1.5px dashed line-2, radius 12px | `desktop-13-crm-unlock.png` |
| Checklist | `.checks` + `.progress` | 10px pill progress bar (ok fill; sand when stalled) over rows with 30px status circles. States: active (bold ink), done (ok fill + pop), stalled (warn text, warn-soft circle) | `desktop-10-setup-wait-upsell.png`, `desktop-30-setup-stalled.png` |
| Tracker | `.tracker` | Three-step horizontal status with 34px circles and ok connectors; waiting step in sand | `desktop-06-webperson-status.png` |
| Timeline | `.tl` | 12px dots on a 2px line; navy-2 by default, bad = red, wait = sand | `desktop-34-staff-drawer.png` |
| Numbered steps | `.mstep` | 34px navy numbered circle, 18px heading, ink-2 body | `desktop-29-manual-steps.png` |
| Accordion | `details.why` | White, 1px line, radius 10px; summary 600 link-blue with +/– | `desktop-10-setup-wait-upsell.png` |
| Message preview | `.msg`, `.email`, `.bubble` | Surface-2 header strip, 15px body; SMS bubble `#e9e9eb`, radius 18/18/18/5 | `desktop-05-webperson-preview.png`, `desktop-21-notifications.png` |
| Town card | `.town` | `--bv-town` fill, radius 12px, SVG scene, sand Mono eyebrow, white title, `#b9c7d3` text | `desktop-12-success.png` |

### 3.4 Status badges and pills

Chips (`.chip`): 600 12px Barlow, padding 5px 9px, pill radius, 1px border, optional 7px `currentColor` dot.

| Meaning | Class | Fill / text / border | Seen in |
|---|---|---|---|
| Live / Done / Verified | `.chip.ok`, `.st-live` | ok-soft / ok / ok-line | `desktop-01-choice.png` ("Live now, free"), `desktop-32-staff.png` |
| Waiting / attention | `.chip.warn`, `.st-wait` | warn-soft / warn / warn-line | `desktop-32-staff.png` ("Waiting on DNS") |
| Error / alert | `.chip.bad`, `.st-alert` | bad-soft / bad / bad-line | `desktop-20-manage-alert.png` |
| Info / CRM / in progress with someone else | `.chip.blue`, `.st-web` | link-soft / link / link-line | `desktop-32-staff.png` ("Web person invited") |
| Needs a person (staff) | `.st-help` | team-soft / team / team-line | `desktop-32-staff.png` |
| Recommended | `.chip.rec` | sand-soft / `#8a4f12` / `#f0d3ac` | `desktop-01-choice.png` |
| Neutral / sample | `.chip.gray` | `#f0eee9` / ink-3 / line | `desktop-32-staff.png` ("Sample contractors") |
| Verified badge (solid) | `.vbadge` | navy pill, white 600 13.5px, 18px ok circle with check | `desktop-12-success.png` |
| Team-only tag | `.teamonly` | `#5b4b8a` fill, white 600 11px Mono uppercase, radius 6px | `desktop-32-staff.png` |
| Filter chip | `.fchip` | White, 1.5px line-2, pill, 600 14px, Mono count; selected = navy fill, white text | `desktop-32-staff.png`, `desktop-33-staff-upsell-filter.png` |
| Suggestion chip | `.tchip` | White, 1.5px line-2, pill, 600 14.5px | `desktop-08-new-search-typo-taken.png` |

Status color is **never the only signal**: every chip carries a word. Honest-status vocabulary for Blueprint (#028G): Needs you = warn; Set up but waiting to connect = warn with a dashed border; Not connected = gray; Done = ok.

### 3.5 Callouts, notes and banners

| Pattern | Class | Spec | Seen in |
|---|---|---|---|
| Neutral note | `.note` | bg fill, 1px line, radius 10px, padding 12px 14px, 15px ink-2, leading icon | `desktop-23-existing-found.png` |
| Success note | `.note.ok` | ok-soft / ok-line / `#155c39` | `desktop-24-edge-locked.png` |
| Warning note | `.note.warn` | warn-soft / warn-line / `#6d4200` | `desktop-26-edge-expired.png` |
| Explain box | `.explain` | blue-soft, `#1a3f7a`, radius 10px. Explains jargon in place | `desktop-29-manual-steps.png` |
| Did-you-mean | `.didyou` | blue-soft, 1px `#c8d8f6`, radius 10px, inline compact `.btn2`s | `desktop-08a-new-search-did-you-mean.png`, `desktop-22-existing-typo.png` |
| Alert box | `.alertbox` | 2px bad-line border, bad-soft fill, radius 12px, padding 18px, `#7d1a14` 18px headline, then Fix (danger) + Get help | `desktop-20-manage-alert.png` |
| Mock / staff notice | `.mockbar` | team-soft, team-line, team-ink, radius 10px | `desktop-15-crm-connect.png` |
| "You can leave" strip | `.leave` | bg fill, 1px line, radius 12px, 15.5px ink-2 | `desktop-10-setup-wait-upsell.png` |
| Secure link | `.securelink` | ok-soft, ok-line, Mono 13.5px `#155c39` | `desktop-05-webperson-preview.png` |
| Toast | `.toast` | Fixed at top:70px centered, ink fill, white 15px/500, radius 10px, toast shadow, 200ms fade/slide | transient; triggered from the rail |
| Tooltip | `[data-tip]` | ink fill, white 13px, radius 7px, tip shadow | hover on locked CRM button |

### 3.6 Modals

`.overlay` + `.popup` · `desktop-11-upsell-how-it-works.png`, `desktop-18-compare-plans.png`, `desktop-28-registrar-popup.png`
- Backdrop: `--bv-overlay`, content centered, 16px viewport padding, z-index 60.
- Panel: white, radius 12px, `max-width:520px` (440px for the third-party approval pop-up), modal shadow, `rise` 220ms. Body padding 22px, H2 21px/1.25, paragraph ink-2. Buttons sit in `.popbtns` (flex, equal width, gap 10px).
- Phone: `max-height:calc(100vh - 32px)` with internal scroll.
- A third-party approval pop-up gets a faux browser bar (`.popbar`, `#ecebe8`) so it reads as the other company's window, not Buildovate's.
- *Platform mapping:* restyle the existing native `<dialog id="dialog">` to this spec (radius 12px, 22px padding, modal shadow, `--bv-overlay` backdrop without blur) instead of building a second modal system. Close button: 36px square, radius 8px, bg fill, 1px line (same as the drawer close).

### 3.7 Drawers and side panels

`.drawer-bg` + `.drawer` · `desktop-34-staff-drawer.png`, `mobile-10-staff-drawer.png`
- Fixed right panel, 420px wide (100vw on phone), white, drawer shadow, 200ms `slidein`, backdrop `rgba(21,33,43,.35)`.
- Header: padding 18px 18px 14px, 19px bold title, 14px ink-3 sub-line, 36px close button. The body scrolls, padding 16px 18px.
- Content: a `.kv` definition grid (110px key column, ink-3 keys, 600 values), timeline `.tl`, and actions.
- Blueprint room panel (#028G): the same component at about 460px. On phone it is a full-height bottom sheet with the same header.

### 3.8 Tables

`.stable` (data) · `desktop-32-staff.png`, `mobile-09-staff.png`; `.rec-table` (instructions) · `desktop-29-manual-steps.png`
- White, 1px line, radius 12px (10px for `.rec-table`), overflow hidden, `border-collapse:separate`.
- `th`: Mono 600 11px uppercase, letter-spacing .08em, ink-3, surface-2 fill, padding 11px 12px.
- `td`: padding 12px, 1px line bottom, vertical-align middle, 14.5px.
- Rows: clickable rows show a pointer; hover `#faf9f6`; selected blue-soft. The primary cell is 600 with a 13.5px ink-3 sub-line.
- Phone: `thead` is hidden and each row becomes a stacked block (padding 10px 12px). Columns marked `.hide-m` drop out. In `.rec-table`, each cell is labeled with a Mono `data-l` label.

### 3.9 Form fields

· `desktop-08-new-search-typo-taken.png`, `desktop-19-add-address.png`, `desktop-22-existing-typo.png`, `desktop-05-webperson-preview.png`
- Label `label.fl`: 600, block, 7px bottom margin. Group `.fgroup`: 14px bottom margin.
- Input `.field`: height 54px (48px `.sm`), 1.5px line-2 border (**use `--bv-line-strong`, §6**), radius 10px, padding 0 16px, 18px text (16.5px small), white.
  - Focus: blue border plus focus ring (no outline).
  - Error `.field.err`: bad border plus error ring. It pairs with `.errmsg` (bad-soft fill, bad text, radius 9px, padding 10px 12px, icon, 15px) under the field.
- Hint `.hint`: 14.5px ink-3, 8px top margin.
- Search row `.searchrow`: field + button in a row; they stack on phone.
- Select and textarea: same border, radius, and focus treatment as the field.
- Error copy is friendly and specific ("That looks like an email address"). Auto-clean input where it is safe and say so.

### 3.10 Toggles

`.switch` · `desktop-09-new-what-you-get.png` (auto-renew), `desktop-20-manage-alert.png`
- 40×23px track, pill radius, off = line-2 (**use `--bv-line-strong`, §6**), on = ok. White 17px knob, translateX(17px), 120ms.
- It is a real `<input type=checkbox>` that is visually hidden but covers the track. Focus-visible gives the track a 3px blue outline, offset 2px.
- Turning off something protective (auto-renew) shows an inline `.note.warn` right away.

### 3.11 Copy buttons

`.copy` · `desktop-29-manual-steps.png`, `desktop-05-webperson-preview.png`
- White, 1px line-2, radius 8px, padding 7px 11px, 600 14px, min-width 84px, copy icon.
- After copying: `.copy.done` switches to ok-soft, ok-line, and ok text reading "Copied ✓" for about 2s. It announces through an `aria-live` region.
- Phone: full width inside stacked table rows.

### 3.12 Offer / upsell cards and their rules

| Pattern | Class | Spec | Seen in |
|---|---|---|---|
| Upsell card | `.card.upsell` | Border `#ecd9bf`, gradient `#fffdf9→#fff`, padding 16px 44px 14px 16px. A 40px sand-soft icon tile, 17px title, 15px ink-2 line, a Mono 12px warn "Example price" or "Included in Growth" line, then actions (compact `.btn2` + "Not now" `.tlink`). Close `.upx` 30px, top-right | `desktop-10-setup-wait-upsell.png`, `desktop-12-success.png` |
| Add-on toggle card | `.addon` | 1.5px **dashed** line-2, radius 12px, padding 16px. Chosen: solid ok-line border, ok-soft fill. "Add it" / "No thanks" | `desktop-09-new-what-you-get.png` |
| Unlock card | `.card.unlock` | 1.5px link-line border, link-soft fill, 18px navy title | `desktop-13-crm-unlock.png`, `mobile-07-crm-unlock.png` |
| Before / after | `.bagrid .ba` | Two columns (one on phone). Before = `#f4f2ed`/ink-2, after = ok-soft/`#155c39`, each with a Mono label | `desktop-11-upsell-how-it-works.png` |
| Plan compare | `.plancmp`, `.plangrid` | Bordered tiles, radius 10px. The next plan up has a sand border and sand-soft fill; the current plan has a navy border and a navy Mono "Your plan" tag | `desktop-17-manage-upsell.png`, `desktop-18-compare-plans.png` |
| Staff offer column | chips + filter | "Add-ons they don't have" gray chips, "Upsell opportunities" filter | `desktop-32-staff.png`, `desktop-33-staff-upsell-filter.png` |
| Email P.S. | `.ps` | Dashed top rule, 13.5px ink-3 | `desktop-21-notifications.png` |

**Rules (mandatory on every platform screen):**
1. **At most one offer per screen.**
2. Offer only what the contractor does not already have. Top-plan contractors see none (`desktop-31-allin-no-upsells.png`).
3. Every offer can be dismissed, and a dismissal is remembered for that placement.
4. **Never** show offers on error, alert, stalled, or expired screens, in flows done on someone else's behalf (the web-person invite), or while booking a help call. Staff never see a suggested offer for a contractor with an open problem.
5. No urgency, countdowns, fake scarcity, or discounts. Prices come only from the catalog/settings, and until real pricing exists they are labeled as examples.
6. Skipping an offer never blocks progress. For example, "Skip for now" on the CRM unlock still reaches the next step.

### 3.13 Empty, error, stalled and alert states

| State | Pattern | Seen in |
|---|---|---|
| Empty / nothing found | Card with an 18px title stating the fact, a one-line reason, a numbered tip list (`.tips`, 24px bg-circle numbers), and one primary next action | `desktop-04-helper-none.png` |
| Found (positive lookup) | Card with a provider tile (`.reglogo`, 52px letter tile, radius 12px) and an ok chip | `desktop-03-helper-found.png`, `desktop-23-existing-found.png` |
| Field error | `.field.err` + `.errmsg` | `desktop-22-existing-typo.png`, v1 `desktop-07b-enter-bad-input.png` |
| Stalled / slow | Checklist row turns warn, progress bar turns sand, plain "up to an hour, we'll text you" copy, then Try again (primary) + Get help (secondary). No offers | `desktop-30-setup-stalled.png` |
| Blocked by a prerequisite | `.note.warn` with numbered steps and an "I did it, check again" button | `desktop-26-edge-expired.png` |
| Alert (something broke) | `.alertbox` + danger "Fix it for me" + "Get help". The history list marks the event with a red dot | `desktop-20-manage-alert.png`, `mobile-06-manage-alert.png` |
| Cancelled third-party step | A gentle neutral note saying nothing changed | v1 `desktop-10b-popup-cancelled.png` |
| Success | 84px ok circle with a 10px ok-soft ring and `pop`, then the green Condensed 40px headline and the verified badge | `desktop-12-success.png`, `mobile-06-success.png` (v1) |
| Loading | 18px spinner (`.spin`, `.spin.dark` on light) inline in the button | `desktop-10-setup-wait-upsell.png` |

*Platform mapping:* the existing `.empty` (dashed card, blue symbol tile) and `.status`/`.status.error` banners should adopt these patterns: empty = card + tips + one action; `.status` = `.note.ok`; `.status.error` = `.errmsg`/`.alertbox` depending on severity.

### 3.14 Tabs and navigation *(derived; not in the prototype)*

The platform's **Tabs** view (`renderSite` → `nav.tabs`) keeps its behaviour. Restyle it to 600 15px ink-2 labels with a 3px navy underline on the selected tab and 12px 16px padding on a 1px line baseline. On phone it stays the existing `select[data-platform-screen]` picker, styled as `.field.sm`. The Tabs | Blueprint toggle (#028G) is a two-option segmented control: pill container with a bg fill and 1px line, selected segment white with navy text and the select ring.

### 3.15 Tester panel (**excluded**)

`.tp` "Prototype controls" (`desktop-35-tester-panel.png`) is prototype-only. Do not build it; it is listed here so nobody mistakes it for a platform component.

---

## 4. Mobile layout (≤720px)

Reference: `mobile-01-choice.png` through `mobile-10-staff-drawer.png`.
- Side padding is 16px. Main padding is 18px 16px 110px.
- H1 drops to 28px, lead to 16px, band title to 18px.
- The rail keeps all steps on one row (28px dots, 11px labels).
- Every two-column grid (`.split`, `.gridm`, `.ngrid`, `.staffgrid`, `.grid2`, `.slots`, `.bagrid`, `.plangrid`) collapses to one column. Stats go to two columns.
- Buttons in `.actions` go full width. Search rows stack.
- Tables become stacked cards. The drawer goes full width and the modal scrolls internally.
- Callouts stay in flow at full width, and nothing overlaps content.
- The bottom sticky action bar spans edge to edge.
- Touch targets are at least 44px (primary controls are 52px).

---

## 5. Voice and content rules that shape the UI

- Plain words first. Technical terms (DNS, A, CNAME, TXT, MX) appear only where they are unavoidable, and each gets an explain box.
- Every waiting state tells the user they can leave and how they will be notified.
- Show honest states only: Not connected, Pending, or Waiting are shown as such, never faked as done. Sample or example content carries a visible label.
- One primary action per screen, stated as a verb ("Get it", "Connect", "Fix it for me").

---

## 6. WCAG AA contrast check

Ratios were computed with the WCAG 2.x relative-luminance formula. Text needs 4.5:1 (3:1 for 24px, or 18.66px bold). Non-text UI boundaries need 3:1 (SC 1.4.11).

**Passing text pairs (selection):** ink on bg 14.75; ink-2 on card 7.18 and on bg 6.48; ink-3 on card 4.97; navy on bg 12.20; white on navy 13.53; white on ok 5.33; white on link-blue 6.47; white on `#1f6feb` 4.63; ok on ok-soft 4.69; warn on warn-soft 5.76; link on link-soft 5.60; bad on bad-soft 5.72; `#8a4f12` on sand-soft 5.81; navy on sand 7.57; sand on navy 7.57; `#1a3f7a` on blue-soft 9.00; team-ink on team-soft 9.73; `#5b4b8a` on team-soft 6.36; white on team 7.45; `#b9c7d3` on town 9.10; white on danger `#b3261e` 6.54 and hover `#8f1f18` 8.83. Blueprint: bp-ink 12.81, done 8.10, need 8.46, off 5.51 (4.52 on bp-lift, borderline), stamp 5.50.

**Failures and fixes:**

| Pair | Ratio | Where | Fix |
|---|---|---|---|
| ink-3 `#66717d` on bg `#f5f3ee` | 4.48 | hints/meta sitting directly on page background | Use `--bv-ink-3:#5d6873` (4.90 on bg, 5.13 on white, 4.61 on `#ebe7de`) |
| ink-3 on chip.gray `#f0eee9` | 4.29 | gray chips (12px) | Same fix → 4.90 |
| Disabled/locked text `#8a939c` on `#f3f1ec` | 2.76 | locked CRM button, locked rail dot | Disabled controls are exempt, but the locked state carries meaning. Use `#6b737c` (4.26) and keep the "Unlocks after…" note |
| Field border line-2 `#d6d0c4` on white | 1.54 | inputs, radios, idle rail dots | Use `--bv-line-strong:#8a8375` (3.76) for input, select, radio, checkbox, and switch boundaries. Keep line/line-2 for decorative dividers only |
| Switch off-track `#d6d0c4` | 1.54 | toggles | Off track `--bv-line-strong` |
| Card border `#e4dfd5` on white | 1.33 | cards | Decorative, so acceptable. Clickable cards (`.choice`, `.res`) are identified by their text and chevron, and selection adds a navy border plus ring (passes) |
| Sand border `#eab97f` on white | 1.79 | recommended choice | Acceptable: the "Recommended" chip carries the meaning. Do not rely on the sand border alone |
| Focus halo `#e8f0fe` | 1.15 | field focus ring | The blue border `#1f6feb` (4.63) is the real indicator. Keep it, and keep the 3px blue outline for `:focus-visible` on all other controls |

---

## 7. Screenshot index (domain-v2)

| File | Shows |
|---|---|
| desktop-01-choice | Top bar, band, step rail, free-address strip, choice cards, Recommended chip, text links |
| desktop-02-louie-rule / mobile-02-louie-fixed | Locked action + in-flow callout |
| desktop-03-helper-found / 04-helper-none / mobile-03-helper | Lookup found / empty state with tips |
| desktop-05-webperson-preview / mobile-04 | Split form + message preview, secure link, copy |
| desktop-06-webperson-status / 07-webperson-done | Tracker, log list, remind |
| desktop-08-new-search-typo-taken / 08a-did-you-mean | Search field, result rows, taken state, suggestion chips, did-you-mean, sticky action |
| desktop-09-new-what-you-get | Key/value rows, switch, add-on card |
| desktop-10-setup-wait-upsell | Progress + checklist, leave strip, accordion, upsell card |
| desktop-11-upsell-how-it-works | Modal with before/after |
| desktop-12-success | Success hero, verified badge, browser mock, SMS bubble, unlock card, town card |
| desktop-13-crm-unlock / mobile-07 | Unlock-with-CRM card, locked card, skip |
| desktop-14-golive | Placeholder step |
| desktop-15-crm-connect / 16-crm-connected / mobile-08 | Mock notice, flow rows, connected checklist |
| desktop-17-manage-upsell / 18-compare-plans | Plan compare side card, plan grid modal |
| desktop-19-add-address | Form fields |
| desktop-20-manage-alert / mobile-06 | Alert box, danger button, history |
| desktop-21-notifications | Phone + email previews, P.S. line |
| desktop-22-existing-typo | Field error + did-you-mean |
| desktop-23-existing-found / 24-edge-locked / 25-edge-proxy / 26-edge-expired | Provider tile, ok/neutral/warn notes |
| desktop-27-existing-oldsite / mobile-05 | Old-site preview, option cards |
| desktop-28-registrar-popup | Third-party approval modal |
| desktop-29-manual-steps | Numbered steps, instruction table, code chips, copy buttons, explain boxes |
| desktop-30-setup-stalled | Stalled state |
| desktop-31-allin-no-upsells | No offers for top plan |
| desktop-32-staff / 33-staff-upsell-filter / mobile-09 | Team-only tag, stats, filter chips, data table, call queue |
| desktop-34-staff-drawer / mobile-10 | Drawer, kv grid, timeline |
| desktop-35-tester-panel | **Excluded** (prototype controls) |

Related references in the same bundle: `domain-v1/` (earlier version, same tokens), `prototypes-2026-09-27/questionnaire-v1/` (same light palette plus `--bts:#5b4b8a` for behind-the-scenes notes), `blueprint-v5/` and `pricebook-v1/` (dark blueprint sub-theme, same fonts).

## Blueprint layer (Joe, 2026-09-29)

- Dark blueprint styling is only for the map canvas: the plan and town drawings, room cards on the map, map labels and the title block.
- Everything the contractor fills in or reads as UI uses the light platform design, exactly like the domain flow: header, side panels, bottom sheets, focus overlays, tour cards, How this works, buttons and form controls. The header is the light platform top bar (logo tile, company name, "Prototype — Sample data" tag, white background, bottom border); only the canvas below it is dark.
- One shared status color set: Done (ok green), Needs you (warn), Waiting to connect (warn, dashed), Not connected (gray), plus the sand accent #eab97f for the current step and Recommended. On the dark canvas use lighter tints of the same hues that pass WCAG AA (at least 4.5:1 on #0f2c4d and every canvas surface): Done #86d7a9, Needs you and Waiting #f2c27d, accent #eab97f, Not connected #b4c0cc. No separate bright-yellow accent.
- Buttons on the canvas use the platform button styles; the main button of the Next thing to do card is the navy primary button.
- Monospace (IBM Plex Mono) only for map labels, room numbers ("RM 104") and the title block. Never in forms, buttons, panels, tour cards or the header. Headings and body use Barlow Condensed and Barlow.
- Room badges on the map reuse the stepper circle styles: filled with a check = done, accent-filled number = current / needs you, dashed with a lock = waiting or locked, outline number = not started.
- Domain & publish (and the Highway in the town) opens the same domain flow component used in Tabs ("Your web address"), in a focus overlay over the dimmed plan with "Back to plan".
