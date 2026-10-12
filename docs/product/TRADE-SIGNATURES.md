# Trade Signatures: Buildovate contractor trade-site templates

Status: concept approved by Joe on Sep 24, 2026. This version adds more creative alternates and cross-trade ideas. The original 16 trades include Garage Doors, Pest Control, Concrete and Pools. Locksmith is queued as trade #17 in #041D/#041DS; its media and runtime seed are not yet built.

**Locksmith planning addendum (#041DS):** An emergency-first pin-tumbler cutaway carries a four-step identify, inspect, approve price, test sequence. A same-angle worn-lock-to-selected-hardware transformation is Sample until a permissioned real job replaces it. Keep Call now primary, draw only confirmed arrival windows and approved prices, and apply the §0 performance/accessibility gates. Add the Locksmith variation seed and dedicated art when #041DS runs.
Audience: the template team and Codex. Roofing gets built first and Patio second. The other trades attach to their own template tickets (see §20).

**Companion docs (read them, don't copy from them):**
- **Motion Effects Playbook** (`PLAYBOOK.md`): effects E1–E12 and the base kit of 8 components (`LayerExplode`, `ScrollSequence`, `RevealCompare`, `StickyStack`, `KineticText`, `StatsMask`, `FlowPath`, `GalleryMotion`) plus `MagneticCTA`.
- **Motion Uniqueness Library v2** (`LIBRARY.md`): 105 patterns (H1–H20, N1–N4, S1–S10, P1–P8, B1–B7, G1–G11, R1–R7, T1–T5, F1–F4, Q1–Q3, C1–C6, Ft1–Ft5, M1–M15), 63 translations (#1–#63), proposed components **#9–#24**, 8 style families and a top 10.

This doc uses those same IDs. A reference like "LIB #24 (M10)" means translation #24, pattern M10. A reference like "#20 `AmbientLayer`" means proposed component 20.

---

## 0. The rules every signature follows

**What a signature is.** A signature is the one interactive centerpiece that makes a site feel like it belongs to its trade. Each site gets **exactly one** signature, placed either as the hero or as the first section after the hero. Roofing keeps its existing drone hero (#004E–#004G), so its signature sits directly below. On top of the signature, a site gets **up to 3 supporting kit patterns** (a transition, a services pattern and a proof pattern from its style family) and **1 micro-moment set**, which is CSS-only.

**Speed budget per site**

| Item | Limit |
|---|---|
| Total added motion JS (shared engine + signature + supporting + micro) | **≤ 60 KB gzip**, measured and reported |
| Signature module alone | target ≤ 12 KB gzip, lazy-loaded |
| Lighthouse mobile (production build) | **Performance ≥ 85, Accessibility ≥ 95, CLS ≤ 0.05** |
| LCP element | never the signature. The hero still or poster is preloaded and the signature never delays it |

Lesson from #004H: code size passed (28.7 KB gzip) but mobile Performance scored 78–83. The rules below are aimed at main-thread time, not just bytes:
1. The signature's **server-rendered markup is its finished, informative state**, as an SVG or `<img>` plus real text. JS only adds the interaction on top.
2. The module loads through the existing #004E motion controller/scheduler **when the section is about 1 viewport away** (IntersectionObserver plus dynamic `import()`), or on idle, whichever comes later. It never loads in the first paint.
3. Animate only `transform`, `opacity`, `clip-path`, `mask-position` and CSS variables. Canvas particles are capped at ≤ 60 and pause when offscreen or when the tab is hidden.
4. Raster frames stay small: WebP, 1440 px desktop and 780 px mobile. Anything that only matters after a tap or swatch choice loads after that first interaction.
5. No new scroll library. Reuse the scheduler that #004E/#004H already use.

**Required fallbacks (all three, for every signature)**
- **Reduced motion** (`prefers-reduced-motion: reduce`): the finished state renders statically. Anything interactive stays usable as **instant state buttons** (segmented control or tabs), so the information is still there and only the motion is removed.
- **No JS:** the same finished state, plus the key facts as ordinary HTML text or lists. No drag hints or empty frames.
- **Touch:** every drag has a large track or handle (≥ 44 px) with `touch-action: pan-y`, so vertical page scroll is never trapped. There's also a "Play" tap for anyone who doesn't drag. Hover effects get tap equivalents, and pinned scroll lengths on mobile are ≤ 1.5 viewports.
- **Keyboard / screen reader:** drags are `role="slider"` with arrow keys and `aria-valuetext` (for example "3 pm, shade over the table"), and each state change updates a polite live region.

**Honesty rules**
- ⚠ = the element shows savings, damage, prices, ratings, specs or stats. It renders **only from the contractor's verified inputs** (individually confirmed Questionnaire facts, the contractor's own price ranges, or the manufacturer spec for the product line they actually install, with the source recorded). If that data is missing, **the element is omitted**. It never falls back to a placeholder number.
- No fake urgency: no countdowns, "only 2 spots left" or "3 people viewing". No "available now" or "tech nearby" pulse dots. This explicitly retires PLAYBOOK's plumbing "Tech available now" idea. Emergency or 24/7 wording appears only when the contractor has confirmed it.
- Imagery can be AI-generated. **Wherever an image depicts a result** (a finished roof, a painted house, a remodeled kitchen, a filled pool), it gets the small "AI example" label, following the #027A convention of one compact label with no extra captions. Real job photos are tagged with the job and used only once approved and published.
- No insurance, claim or permit outcomes, and no longevity or guarantee claims unless they come from a written warranty the contractor supplied.
- No generated people posing as crew or customers (#007 rule).

**Asset legend:** **[AI]** = AI-generated still, labeled where it shows a result · **[SVG]** = illustration authored in code (the default, because it's tiny, recolorable and has no licensing questions) · **[CP]** = provided by the contractor (photos, lists, ranges, warranty text) · **[MFR]** = manufacturer spec sheet or imagery used with permission.

**Build size:** S = under a day on existing kit pieces · M = 1–2 days · L = 3+ days or needs a new shared component or asset set. This matches the LIBRARY scale.

## 0.1 New shared components (continuing LIBRARY numbering)

Most signatures turn out to be the same few mechanics with different art. Building these four once keeps the original 16 trades and planned Locksmith affordable:

| # | Component | What it does | Used by | Est. JS gzip |
|---|---|---|---|---|
| 25 | `ScrubStage` | One progress value (0–1) driven by drag, slider, scroll or "Play". Maps that value onto CSS variables and named states on layered SVG or images, and handles keyboard, live-region text, snap points and the reduced-motion state buttons. Built-in presets: `drag-object` (storm, sun, sledgehammer), `slider` (time of day, thermostat), `fill` (pour, pool), `path-build` (posts, planks, panels). | Roofing, Patio, Solar, Remodel, Painting, Landscaping, Concrete, Fencing, Pools, Flooring, Garage Doors, Pest Control | ~3 KB |
| 26 | `CutawayHouse` | One shared SVG house in section/cutaway form with named rooms, wall cavities, attic, crawlspace, duct/pipe/wire layers and an exterior mode. Trades switch layers on and off. | HVAC, Plumbing, Electrical, Windows, Garage Doors, Pest Control (and the symptom router's illustrations) | ~2 KB + ~25 KB SVG (inlined, below the fold, gzips to about 6 KB) |
| 27 | `ContextSkin` | Chooses a season, daypart or weather skin (palette, sky layer, `AmbientLayer` preset, one-line copy) from the date, local time and, optionally, a real weather observation. Chosen on the server, so the no-JS result is the same as the JS result. | Cross-trade hero (§17 #1–#3), holiday skins | ~1.5 KB |
| 28 | `SymptomRouter` | A visual "what's wrong with my ___" picker. The visitor taps illustrated symptoms and gets routed to the right service page with the inquiry pre-filled. It's an extension of #19 `StepFunnel`. | Every trade (§17 #5) | ~3 KB |

The rest reuse the base kit plus LIBRARY #9 `SwatchConfigurator`, #10 `BlueprintReveal`, #11 `HotspotCallouts`, #15 `PortalZoom`, #16 `ObjectJourney`, #17 `ChapterFilm`, #18 `IsoPlan` and #20 `AmbientLayer`.

---
## 1. Roofing: "Storm Pass"

Families: Bold Industrial · Clean Product · Cinematic Craft · Blueprint Precision · Ticket: **#004J** (Roofing reference, before #005/#013 per Joe's order)

### Primary: Storm Pass (approved)
- **What the homeowner sees and does:** Directly below the drone hero there's a calm house under a blue sky, with a storm cloud parked at the top left and a hint that reads "Drag the storm across." The visitor drags the cloud over the house. Rain and hail fall beneath it, and as the cloud crosses each roof zone, small hail bruises appear on the shingles, one tab lifts and flaps, and a gutter gets a dent. When the cloud leaves on the right, the sky clears, each mark gets a circle drawn around it in order, and a 6-item **inspection checklist** beside the house lights up one row at a time: shingle bruising, lifted or missing tabs, flashing and vents, pipe boots, gutters and downspouts, interior ceiling check. Tapping a checklist row pulses its marker on the house. The CTA underneath reads "Book an inspection" ("free" appears only if the contractor confirmed free inspections).
- **Homeowner problem:** "A storm just came through. I can't see my roof, so is anything wrong, and what would someone actually check?"
- **Assets:** house and roof in [SVG] (same palette and roof geometry as the #004H `LayerExplode` layers) or the existing generated Roofing still from #004F with an SVG damage overlay registered on top. Hail bruises, lifted tab and cloud in [SVG]. Checklist wording in [CP], with a reviewed default list.
- **Kit:** new #25 `ScrubStage` (`drag-object` preset) · #20 `AmbientLayer` (`particles`: rain and hail, ≤ 60) · #11 `HotspotCallouts` for the markers and checklist links · `KineticText` C for the checklist highlight.
- **Size:** M (it's also where `ScrubStage` gets built, so the first build is about 1.5 days).
- **Performance:** server-rendered as the finished inspection state. About 5 KB gzip module plus 3 KB `AmbientLayer`, loaded at 1 viewport away. Particles run only while the cloud is over the house and stop when it exits. No new raster if the #004F still is reused.
- **Reduced motion:** no particles and no cloud travel. A 3-state control ("Before · After the storm · What we check") swaps the states instantly, with the checklist fully visible. **No-JS:** the finished inspection state with all markers circled and the checklist as a plain `<ol>`.
- **Mobile:** the image runs full width. The cloud rides along a drag track under the image (the track is the handle, 56 px tall), and "Play the storm" runs a 3-second auto pass. The checklist turns into 2×3 chips below the image.
- **Verified data:** the damage is illustrative. If it's AI, it gets the "AI example" label. There's no "hail in your area" claim unless it comes from a real observation (#161, K25) with its date, and no insurance or claim outcome (the #162 storm companion rules apply). "Free" appears only with confirmation. No numbers are shown.

### Alternates
1. **Attic Flashlight.** A dark attic fills the frame, and the cursor or a dragged finger works as a flashlight (the H12 lens). It finds daylight through the decking, a water stain on the rafters and matted insulation, and each find turns into a warning-sign card. *Kit:* `RevealCompare` B (lens) + #11 · *Size:* S–M · *Assets:* [SVG] · *RM/no-JS:* every find lit, as a static labeled diagram · *Data:* none.
2. **Granule Macro.** Scrolling zooms from the whole house to one shingle and then to the granule surface (P8, LIB #42), where a worn shingle sits beside a healthy one with the caption "What sun and hail do to the top layer." *Kit:* #15 `PortalZoom` macro · *Size:* S · *Assets:* 3 [AI] stills, labeled · *RM/no-JS:* three stills in a row · *Data:* no lifespan figures unless the manufacturer says so ⚠.
3. **Hail Test Drop.** A small panel with two shingle samples: tapping "Drop hail" bounces an ice ball off each one, and a strip of impact-rating chips appears. *Kit:* #20 `AmbientLayer` + #9 `SwatchConfigurator` · *Size:* S · *Assets:* [SVG] + product images [MFR] · *RM/no-JS:* the final chip row · *Data:* impact class only from the manufacturer's rating for the product line the contractor installs ⚠; no insurance-discount claims.

### Micro-moments
- **Shingle-flip CTA:** on hover or focus, one shingle tab flips down into place over the button with a 150 ms nail "tick" (visual only).
- **Ridge-line reading progress:** a thin roof ridge draws itself across the sticky header as the visitor scrolls. It's static under reduced motion.

---

## 2. HVAC: "Comfort Map"

Families: Clean Product · Blueprint Precision · Night & Glow · Friendly Local · Ticket: **#029S** (attaches to #029 HVAC)

### Primary: Comfort Map (approved)
- **What the homeowner sees and does:** A two-story house in cutaway, with the air handler in the attic, the ducts drawn out, and blue supply dots flowing to every room while grey return dots flow back. A big **thermostat slider** labeled "Outside today" runs from Mild to Heat wave. As the visitor pushes it up, rooms at the end of long, leaky runs (the bonus room, the upstairs bedroom) start to glow orange, and little puffs show at the leaking joints. A toggle labeled "After sealing & balancing" closes the puffs and every room settles to the same cool tone. Tapping a room opens a card, for example: "Bonus room hot? Long duct run, leaky joint, weak return," with a link to that service.
- **Homeowner problem:** "Why is that one room always hot or cold? Is it the system or the ducts, and what fixes it?"
- **Assets:** [SVG] via #26 `CutawayHouse` (duct layer). Room-card copy is reviewed trade copy, and only the contractor's selected services get linked [CP].
- **Kit:** #26 `CutawayHouse` · `FlowPath` A (ducts with traveling dots) · #25 `ScrubStage` (`slider`).
- **Size:** L the first time (it's where `CutawayHouse` gets built). M for every trade that reuses it afterward.
- **Performance:** CSS `stroke-dashoffset` dash flow, which needs no canvas, and the flow pauses offscreen. Room glow is a single CSS variable per room. Module about 4 KB plus the shared house.
- **Reduced motion:** static arrows on the ducts. The slider still works but snaps the room colors instantly, with no flow. **No-JS:** two labeled static diagrams, "Leaky, unbalanced" and "Sealed & balanced," plus the room causes as a list.
- **Mobile:** a portrait crop with the floors stacked. The slider sits under the image with a large thumb, and room cards open as a bottom sheet.
- **Verified data:** no percentage-loss or dollar figures unless the contractor supplies their own verified duct-test results ⚠. The temperatures are the visitor's chosen scenario and are labeled "example."

### Alternates
1. **Condenser X-ray** (LIB #1/#35). The outdoor unit turns a quarter-turn, its side panel lifts away, and the compressor, coil and fan get labeled one at a time with "what fails here." *Kit:* `LayerExplode` + `ScrollSequence` C · *Size:* M · *Assets:* [SVG] generic unit, or [MFR] imagery of the installed brand with permission · *RM/no-JS:* exploded static view with labels · *Data:* efficiency ratings only from [MFR] ⚠.
2. **Same Room, Any Weather** (H9, LIB #3). The same living room with a window view that cycles through heat wave, snowstorm and wildfire-smoke day, while the thermostat on the wall holds steady and the room stays calm. *Kit:* `RevealCompare` C auto-cycle + #20 · *Size:* M · *Assets:* 3 [AI] stills, labeled "AI example" · *RM/no-JS:* three stills in a row · *Data:* none.
3. **Filter Clock.** Scrolling ages an air filter from clean to clogged while the airflow arrows through it thin out, ending with "Want us to remember for you?" and a maintenance-plan CTA shown only if the plan exists [CP]. *Kit:* #25 `ScrubStage` · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* clean and clogged side by side · *Data:* change interval only from contractor or [MFR] guidance ⚠.

### Micro-moments
- **Thermostat CTA:** on hover or focus, the dial in the button rotates to the contractor's brand color with a soft visual click.
- **Fan loader:** while the service-area map loads, a tiny fan spins up, and it coasts to a stop when content is ready. It's static under reduced motion.

---

## 3. Plumbing: "Leak Tracer"

Families: Friendly Local · Blueprint Precision · Clean Product · Bold Industrial · Ticket: **#031S** (attaches to #031 Plumbing)

### Primary: Leak Tracer (approved)
- **What the homeowner sees and does:** A bathroom wall and the ceiling below it, with a brown stain and a drip forming. As the visitor scrolls, the drywall fades to X-ray and shows the supply lines (blue and red) and drains (grey). A pulse then runs **backward** from the drip, up and along the pipe, until it reaches the real source (a weeping fitting behind the shower valve), which pulses red. A wrench icon taps it, the joint turns green, and the stain fades away. Chips appear alongside: "Pressure test · Fittings · Valves · Drain slope." On desktop, a "Look inside the wall" lens also works on hover.
- **Homeowner problem:** "There's a stain or drip. Where is it really coming from, and will you have to tear my house apart to find it?"
- **Assets:** [SVG] via #26 `CutawayHouse` (interior wall section, pipe layer).
- **Kit:** #26 · `FlowPath` A (reverse trace) · `RevealCompare` B (lens, desktop only) · `KineticText` C for the chips.
- **Size:** M (reuses `CutawayHouse`).
- **Performance:** a single SVG path trace with `stroke-dashoffset` and a pinned length of 1.2 viewports. No raster.
- **Reduced motion:** a static X-ray with the numbered path from drip to source and the source circled. **No-JS:** the same image, with the four checks as a list.
- **Mobile:** a portrait wall crop, a short pin, and a "Trace it" button for visitors who don't scroll.
- **Verified data:** no "no tear-out guaranteed," no response times and no "24/7" unless the contractor confirmed them. **No live "tech available" dot.**

### Alternates
1. **Drain Camera Dive** (LIB #31, M5). Scrolling dives down the drain behind a camera light, past buildup to a root intrusion, then cuts to the cleared line. *Kit:* #15 `PortalZoom` (tunnel chain of 4 stills) · *Size:* M · *Assets:* [CP] real camera stills preferred, otherwise [AI] labeled "AI example" · *RM/no-JS:* the four stills as a numbered strip · *Data:* none.
2. **Shower Timer: Tank vs Tankless.** Two showerheads side by side. The visitor sets household size (1–6) and taps "Run showers." The tank meter drains and turns lukewarm while the tankless one holds steady. *Kit:* #25 `ScrubStage` + `StatsMask` gauge · *Size:* S–M · *Assets:* [SVG] · *RM/no-JS:* the end-state comparison · *Data:* capacity and flow only from [MFR] specs for the models the contractor installs ⚠, otherwise qualitative wording with no numbers.
3. **Pipe Timeline** (P4, LIB #41). A copper pipe runs down the left edge of the whole page as the process spine. Water fills it as the visitor scrolls, and each process step is a fitting. *Kit:* `FlowPath` A spine · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* a filled static pipe · *Data:* step durations only from [CP] ⚠.

### Micro-moments
- **Drop CTA:** a droplet falls into the button and ripples outward when clicked.
- **Form success:** two pipe ends connect, and a drop flows through to a checkmark.

---

## 4. Electrical: "Lights On"

Families: Night & Glow · Blueprint Precision · Bold Industrial · Friendly Local · Ticket: **#032S** (attaches to #032 Electrical)

### Primary: Lights On (approved)
- **What the homeowner sees and does:** A house at night, dark except for the porch light. As the visitor scrolls, a line of light runs from the utility pole to the **panel on the side of the house**, the panel door swings open, and breakers flip one by one, each one lighting its room (kitchen, living room, bedrooms, garage with an EV charger, yard lights). A short label fades in beside each room: "Panel upgrade," "EV charger," "Lighting," "Whole-home surge."
- **Homeowner problem:** "Can my old panel handle what I want to add, like an EV, AC or a remodel, and is it safe?"
- **Assets:** house and panel in [SVG] (Night & Glow palette), using #26 `CutawayHouse` exterior mode. Rooms light up **only for the contractor's selected services** [CP].
- **Kit:** `FlowPath` B (wire with a light traveler) · #25 `ScrubStage` (scroll) · #26 exterior · the panel door is a CSS 3D `rotateY`.
- **Size:** M.
- **Performance:** window glows are opacity changes on pre-drawn gradient shapes (no `filter: blur` animation) inside one SVG.
- **Reduced motion:** every room lit, the panel open and all labels visible. **No-JS:** the same, plus the services list.
- **Mobile:** a portrait facade, rooms lighting in 5 steps, and the open panel showing 6 large breakers that each link to a service.
- **Verified data:** license number and "licensed" wording only under the #011 reviewed-policy rules. No code-compliance or permit-outcome claims.

### Alternates
1. **Flashlight House** (LIB #10, H12 + N4). The dark house responds to the cursor or a finger as a spotlight, and a "Lights on" toggle then reveals the finished lighting design. *Kit:* `RevealCompare` B + C · *Size:* S · *Assets:* [SVG] or [AI] day/night pair · *RM/no-JS:* the lit house · *Data:* none.
2. **Tangle to Tidy** (LIB #56, M6). An old fuse box with a rat's nest of wires untangles into a neatly labeled modern panel as the visitor scrolls. *Kit:* `LayerExplode` split-open · *Size:* M · *Assets:* [SVG] · *RM/no-JS:* before and after panels side by side · *Data:* none.
3. **Wish-List Load Meter.** The visitor taps what they want to add (EV charger, heat pump, hot tub, induction range) and a meter climbs toward "time to check your panel," which routes to panel-upgrade inquiries. *Kit:* `StatsMask` gauge + #28 routing · *Size:* S–M · *Assets:* [SVG] icons · *RM/no-JS:* a checklist form · *Data:* **qualitative only**, with no amps or load figures unless the contractor supplies a reviewed rule ⚠.

### Micro-moments
- **Switch CTA:** the button is a wall switch that flips on (glow) on hover or focus. It keeps real button semantics.
- **Bulb loader:** a filament bulb warms from dark to on as the section enters view.

---

## 5. Solar: "Sun Path"

Families: Clean Product · Night & Glow · Nature Immersive · Blueprint Precision · Ticket: **#041S** (attaches to #041 Solar)

### Primary: Sun Path (approved)
- **What the homeowner sees and does:** A three-quarter view of a house (4 roof templates: gable, hip, L-shape, flat), with a sun sitting at the sunrise end of an arc. The visitor **drags the sun across the sky**. Roof faces light up as the sun reaches them, panels fill in row by row on the sunniest faces, and each row glints as the sun passes. Beside the house, a bill card shrinks from "Your bill" to "Estimated with solar," **only when verified inputs exist** (see below). At sunset the scene turns to night, and if the contractor sells batteries, a battery icon keeps the windows lit.
- **Homeowner problem:** "Does my roof get enough sun, and would solar actually lower my bill?"
- **Assets:** [SVG] house, roof templates, sun and panels. An optional real install photo [CP] appears in the end card.
- **Kit:** #25 `ScrubStage` (`drag-object` along an arc) · `FlowPath` B (arc traveler) · `StatsMask` chart mode (T5) for the bill card.
- **Size:** M.
- **Performance:** a single SVG, with the glint as a moving gradient mask. The bill math is a small pure function.
- **Reduced motion:** the sun at noon with all panels shown and the bill card static. The sun slider still jumps between morning, noon and evening. **No-JS:** the static noon scene plus "Enter your bill for an estimate" as a normal form.
- **Mobile:** the arc flattens into a horizontal slider under the image, and the bill card stacks below.
- **Verified data:** ⚠ The bill card, kWh and savings render **only** from contractor-verified configuration (utility rate, production assumption and typical system range, each with a source and "as of" date) combined with the visitor's own bill entry. The result shows as a range labeled "estimate, not a quote." Without that configuration **the card is omitted** and a "Get a roof sun report" CTA replaces it. No tax-credit amounts unless reviewed copy exists.

### Alternates
1. **Day / Night / Outage** (LIB #15, H9). A three-way toggle: by day the panels produce, at night the battery runs the house, and during an outage the neighbors go dark while this house stays lit. The outage state appears only if backup is actually sold [CP]. *Kit:* `RevealCompare` C · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* three frames side by side · *Data:* no runtime hours unless [MFR] + [CP] ⚠.
2. **Payback Bars** (LIB #8, T5). Year-by-year bars compare the visitor's current bill with the estimated solar cost, with a line crossing at break-even. *Kit:* `StatsMask` chart · *Size:* M · *Assets:* none · *RM/no-JS:* the final chart as an HTML table · *Data:* ⚠ **omitted entirely** without verified inputs.
3. **Install in 5 Clicks.** Rails, then panels clicking in row by row, then the inverter light turning green, then a real finished-job photo. *Kit:* `ScrollSequence` SVG mode · *Size:* S · *Assets:* [SVG] + [CP] photo · *RM/no-JS:* the finished roof · *Data:* none.

### Micro-moments
- **Sunrise CTA:** a sun rises behind the button label on hover or focus.
- **Glint divider:** a single light glint sweeps across a panel-texture section divider as it enters view.

---
## 6. Patio covers: "Shade Clock"

Families: Nature Immersive · Warm Craftsman · Cinematic Craft · Clean Product · Ticket: **#004K** (built second, right after Roofing; adopted into #030 Patios)

Joe's own company (4K Patios) sells aluminum patio covers, including louvered. The signature is written so it shows off solid, lattice and louvered aluminum covers honestly.

### Primary: Shade Clock (approved)
- **What the homeowner sees and does:** A three-quarter backyard view: a house wall, an aluminum patio cover, a table, a grill and a lounge chair. A **time-of-day slider** runs from 8 am to 7 pm. As the visitor drags it, the sun moves across the sky and the cover's shadow sweeps and stretches across the patio, so you can see exactly when the table sits in shade. A small chip reads "Table: in shade / in sun." Three style chips (**Solid · Lattice · Louvered**) swap the cover. On Louvered, a round **"Open / Close louvers"** button rotates the blades: open lets striped sunlight through, closed gives solid shade. A "Rain" chip (shown only if the product sheds water) sends raindrops off the closed blades into the built-in gutter and down the post. A compass toggle ("My patio faces: N · E · S · W") changes the direction of the sweep.
- **Homeowner problem:** "Where will the shade actually fall at the times I use my patio, and should I pick solid, lattice or louvered?"
- **Assets:** [SVG] yard and the three cover models drawn from 4K Patios' actual product line [CP]. Shadows are SVG polygons computed from the sun angle. An optional [AI] hero still labeled "AI example," or a real 4K Patios job photo [CP] in the end card.
- **Kit:** #25 `ScrubStage` (`slider`) · #20 `AmbientLayer` (`shadow` mode, M10, LIB #24; `particles` for rain) · #9 `SwatchConfigurator` (cover style).
- **Size:** M (reuses `ScrubStage` from #004J).
- **Performance:** the shadow is one polygon whose points come from a CSS variable, and the louvers are about 12 `rotateX` transforms. Everything lives in one SVG, and the module is about 4 KB.
- **Reduced motion:** Morning, Noon and Evening buttons swap the frames instantly, and the louvers show an open/closed pair. **No-JS:** a three-panel strip (morning, noon, evening) for each cover type, plus the product list.
- **Mobile:** a 4:5 crop, a big slider thumb under the image, and the louver button pinned to the bottom right of the stage.
- **Verified data:** the shade shown is an illustration ("Shade shown is illustrative; your home's orientation and design change it"). An optional precise mode computes the sun angle from the site's own latitude and date, which is real astronomy and therefore honest. **No temperature-drop numbers** unless measured and verified ⚠. Wind, snow-load and rain claims only from [MFR] documents ⚠. Motorized or rain-sensor behavior only if that option is actually sold.

### Alternates
1. **Build in 8 Beats.** Footings, then posts rising, beams dropping, rafters or louvers filling in, the gutter, the lights and the fan, and finally "Done in X days" (X only from [CP] ⚠). *Kit:* `LayerExplode` / `ScrollSequence` SVG · *Size:* S–M · *Assets:* [SVG] · *RM/no-JS:* an exploded static view with labels · *Data:* timeline ⚠.
2. **Evening Mode.** A dusk slider takes the patio from golden hour to night. Integrated LED strips fade on, the fan starts turning and the lounge area glows. Lights and fan appear only if sold [CP]. *Kit:* #25 + `RevealCompare` C · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* day and night pair · *Data:* none.
3. **Your Yard, Covered** (LIB #60 style). The visitor picks a house shape and a patio size (small, medium, large) and a top-down plan draws the cover footprint with its posts, then flips to the three-quarter view. *Kit:* #10 `BlueprintReveal` + #25 · *Size:* M · *Assets:* [SVG] · *RM/no-JS:* static plans for each size · *Data:* sizes shown only as the contractor's standard options [CP].

### Micro-moments
- **Louver CTA:** slats on the button flip open on hover or focus to reveal "Get my quote."
- **Stripe dividers:** a faint louver-shadow stripe slides slowly across section boundaries while scrolling. It's off under reduced motion.

---

## 7. Kitchen / Bath remodel: "Demo Day"

Families: Blueprint Precision · Cinematic Craft · Warm Craftsman · Clean Product · Ticket: **#034S** (attaches to #034 General Contractors, per Joe's decision on 2026-09-24)

### Primary: Demo Day (approved)
- **What the homeowner sees and does:** A dated kitchen, with a sledgehammer icon as the drag handle. Dragging it across tears the old room away with a torn-edge wipe. Halfway through, a strip of bare studs shows ("this is where we check plumbing & wiring"), and after that the new kitchen. Below the image, **cabinet swatches** (4) and **countertop swatches** (3) recolor the new kitchen. On bath sites, the same component shows a vanity and tile.
- **Homeowner problem:** "What could my kitchen look like, and how do I choose finishes?"
- **Assets:** before, studs and after images. Best is a real job's before and after [CP]; otherwise an [AI] set labeled "AI example." Finishes come from pre-rendered masked layers, [AI] or [CP], using the contractor's actual lines.
- **Kit:** `RevealCompare` A in tear mode (B2) · #9 `SwatchConfigurator`.
- **Size:** M.
- **Performance:** 3 base images plus swatch layers that load only after the first swatch tap. The tear edge is an SVG mask, not canvas.
- **Reduced motion:** before and after shown side by side, with swatches swapping instantly. **No-JS:** before, studs and after images stacked with captions, plus a static grid of finish thumbnails.
- **Mobile:** a horizontal drag track under a 4:5 image, and swatches as a horizontal chip row.
- **Verified data:** "AI example" on any AI after-image. Real jobs are tagged and published only with approval. Timelines and costs appear only from contractor ranges ⚠.

### Alternates
1. **Plan to Done** (LIB #4, H16/B7). The floor plan inks itself in line by line, then dissolves into the finished-room photo. *Kit:* #10 `BlueprintReveal` · *Size:* M · *Assets:* [CP] plan or an auto-traced drawing + photo · *RM/no-JS:* plan and photo side by side · *Data:* none.
2. **Floating Samples** (LIB #29, M15). Tile, quartz, oak and hardware samples drift around an empty room, then settle onto the surfaces as the finished kitchen fades in. *Kit:* #16 `ObjectJourney` multi · *Size:* M · *Assets:* [CP]/[AI] sample cut-outs · *RM/no-JS:* the finished room with a legend of materials · *Data:* none.
3. **Knock Out the Wall** (LIB #5, G10). An isometric plan with an "Open it up" button: the wall slides out, the island slides in, and tapping a room opens its finished photo. *Kit:* #18 `IsoPlan` · *Size:* L · *Assets:* [SVG] iso plan · *RM/no-JS:* before and after plans plus a room list · *Data:* no structural claims.

### Micro-moments
- **Tape-measure CTA:** a tape measure extends beneath the button label on hover or focus and snaps back when clicked.
- **Tile loader:** the gallery placeholder fills with tiles in a quick herringbone pattern.

---

## 8. Painting: "Brush Pass"

Families: Warm Craftsman · Friendly Local · Cinematic Craft · Bold Industrial · Ticket: **#036S** (attaches to #036 Painting)

### Primary: Brush Pass (approved)
- **What the homeowner sees and does:** A house in faded, chalky paint with a swatch rail of 8 colors (the contractor's curated palette) beside it. The visitor **picks a color and drags a big brush** across the siding (or taps "Paint it"), and a brush-stroke mask sweeps the new color on. A second rail for **trim** repaints the trim with a thinner stroke. A "Reset" button fades the paint back to the chalky original.
- **Homeowner problem:** "What will my house actually look like in that color?"
- **Assets:** one base house image, [AI] labeled "AI example" or [SVG], with SVG masks for the siding and trim. Color is applied with `mix-blend-mode` on the masked layers. Palette is [CP].
- **Kit:** `RevealCompare` brush mode (H13, LIB #20) · #9 `SwatchConfigurator`.
- **Size:** M.
- **Performance:** one image, two masks and CSS variables for color. The brush stroke is a pre-drawn SVG path revealed by `stroke-dashoffset`, not a canvas paint simulation.
- **Reduced motion:** color changes instantly on each swatch tap. **No-JS:** the house in a default "after" color beside the "before," plus the palette as named chips.
- **Mobile:** tapping a swatch plays a 900 ms stroke. The rails turn into horizontal chip rows.
- **Verified data:** color names only as the contractor supplies them (brand names are the brand's marks). A note reads "Screen colors vary; we bring real samples." "AI example" appears on the base if AI. No durability claims unless [MFR] ⚠.

### Alternates
1. **Prep Peel** (B2, LIB #48). Peeling paint scrapes away, then the patch, primer and two finish coats go on as the visitor scrolls. It shows the prep other painters skip. *Kit:* `RevealCompare` tear + #25 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* four static steps · *Data:* coat counts only as the contractor's standard [CP].
2. **Color at Golden Hour.** The chosen color is shown on the house under morning, noon and golden-hour light, with a slider for time of day, because exterior color shifts all day. *Kit:* #25 + CSS filters on a single image · *Size:* S · *Assets:* one image · *RM/no-JS:* three frames · *Data:* none.
3. **Roller Room** (interior). The visitor rolls a roller down a living-room wall, and sheen chips (flat, eggshell, satin) change how a lamp reflects off the wall. *Kit:* `RevealCompare` brush + #9 · *Size:* M · *Assets:* [AI] room labeled "AI example" · *RM/no-JS:* the finished wall with sheen thumbnails · *Data:* none.

### Micro-moments
- **Wet-paint underline:** CTA underlines are a paint stroke that drips once on hover.
- **Brush cursor:** in the hero only, on fine pointers, a small brush follows the cursor. It's off on touch and under reduced motion.

---

## 9. Landscaping: "Four Seasons Yard"

Families: Nature Immersive · Warm Craftsman · Friendly Local · Cinematic Craft · Ticket: **#033S** (attaches to #033 Landscaping)

### Primary: Four Seasons Yard (approved)
- **What the homeowner sees and does:** One front yard with a season dial (Spring, Summer, Fall, Winter), also driven by scroll. On first view, the plants **grow in** from bare mulch. Spring then brings blooms, summer fills everything out, fall turns the trees amber with a few falling leaves, and winter shows the structure: hardscape, evergreens and path lights glowing. Tapping a plant shows its name, water needs and why it was chosen.
- **Homeowner problem:** "Will my yard look good all year, not just on install day?"
- **Assets:** [SVG] yard with layered plant sprites for each season. The plant list comes from the contractor's regional palette [CP].
- **Kit:** #25 `ScrubStage` (4 snap points) · #20 `AmbientLayer` (leaves or snow, ≤ 40) · #11 `HotspotCallouts`.
- **Size:** M–L (the plant sprite set is the cost; it's reusable across every landscaping site).
- **Performance:** each season is a palette swap through CSS variables on one SVG, with growth as `transform: scale`. Particles run only in fall and winter.
- **Reduced motion:** season tabs swap instantly, with no growth or particles. **No-JS:** a four-panel season strip plus the plant list.
- **Mobile:** season chips over a square image, and plant cards open as a bottom sheet.
- **Verified data:** plant facts from the contractor's regional list. No water-savings or "drought-proof" numbers unless verified ⚠.

### Alternates
1. **Grow-in Years.** A slider moves from Planting day to 1 year to 3 years, with the same beds maturing. It's labeled "Illustrative growth." *Kit:* #25 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* three frames · *Data:* no growth-rate promises.
2. **Night Paths** (Night & Glow). Dusk falls and low-voltage path, uplight and patio lights switch on zone by zone. *Kit:* `RevealCompare` C + `FlowPath` B · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* the lit yard · *Data:* none.
3. **Irrigation X-ray.** A top-down yard where the lawn peels back to show irrigation zones drawing in, spray arcs for turf and drip lines for beds. *Kit:* `FlowPath` A + `RevealCompare` B · *Size:* M · *Assets:* [SVG] · *RM/no-JS:* a static zone map · *Data:* no water-bill claims ⚠.

### Micro-moments
- **Sprout CTA:** a small leaf unfurls from the button's corner on hover or focus (C3-lite).
- **Seed success:** after the form is sent, a seed drops, sprouts and shows "We'll be in touch."

---
## 10. Concrete: "The Pour"

Families: Bold Industrial · Blueprint Precision · Warm Craftsman · Clean Product · Ticket: **#041AS** (attaches to the new #041A Concrete template ticket)

### Primary: The Pour (approved)
- **What the homeowner sees and does:** A top-down driveway with wood forms, compacted base and a rebar grid. Scrolling or dragging the chute handle **pours concrete**: a wave front fills the form, a screed pass flattens it, and control joints get cut. Then a **finish picker** appears with Broom, Stamped (slate, cobble or plank patterns), Exposed aggregate and Smooth trowel, and the surface texture swaps under a raking light sweep.
- **Homeowner problem:** "What finishes can I get, and what makes a pour last (base, rebar, joints)?"
- **Assets:** forms, base and rebar in [SVG]. Finish textures are tileable 512 px WebP, [CP] photos of the contractor's own work preferred, otherwise [AI] labeled "sample texture."
- **Kit:** #25 `ScrubStage` (`fill`) · #9 `SwatchConfigurator` · optional `LayerExplode` B for the base/rebar/slab layers.
- **Size:** M.
- **Performance:** the fill is a `clip-path` wave driven by one variable. Textures swap as CSS `background-image`, and only the first texture loads before interaction.
- **Reduced motion:** a finished slab with the layer labels, and finish tabs that switch instantly. **No-JS:** a static layered diagram plus four finish swatches with names.
- **Mobile:** a portrait driveway, with the pour triggered by scroll or a "Pour it" tap, and finishes as chips.
- **Verified data:** slab thickness, PSI and rebar spacing only as the contractor's confirmed standard spec ⚠. No lifespan claims.

### Alternates
1. **Why It Cracked.** An old cracked slab where a lens reveals the causes (no base, no joints, a root) and then crossfades to a new slab with proper joints. *Kit:* `RevealCompare` B · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* a labeled cause diagram · *Data:* none.
2. **Stamp Press.** The visitor taps the wet slab and a stamp pad presses down, leaving the pattern one tile at a time. It's oddly satisfying, and the pattern selector changes the stamp. *Kit:* #25 + #9 · *Size:* S · *Assets:* [SVG] patterns · *RM/no-JS:* the finished stamped grid · *Data:* none.
3. **Curb Swap.** A street view of a house where the driveway toggles between cracked asphalt, broom finish, stamped and exposed aggregate. *Kit:* #9 · *Size:* S · *Assets:* [AI] set labeled "AI example" · *RM/no-JS:* a thumbnail grid · *Data:* no price-per-square-foot figures unless from [CP] ranges ⚠.

### Micro-moments
- **Trowel CTA:** a trowel sweeps across the button face on hover and leaves it glossy.
- **Mixer loader:** a small drum rotates while images load.

---

## 11. Fencing: "Post by Post"

Families: Warm Craftsman · Bold Industrial · Friendly Local · Nature Immersive · Ticket: **#037S** (attaches to #037 Fencing)

### Primary: Post by Post (approved)
- **What the homeowner sees and does:** A three-quarter lot illustration with a dashed property line. As the visitor scrolls, **posts drop in one after another along the line**, rails connect them, the boards or pickets fill in, and the gate swings shut at the end. Style chips (**Wood privacy · Vinyl · Horizontal slat · Ornamental iron · Chain link**) swap the fence along the whole run.
- **Homeowner problem:** "What will it look like around my yard, and which style fits?"
- **Assets:** [SVG] lot templates (rectangle, corner lot, pie-shaped) and fence-style sprites.
- **Kit:** `FlowPath` path + `ScrollSequence` SVG mode (#25 `path-build` preset) · #9 `SwatchConfigurator`.
- **Size:** M.
- **Performance:** fence sections are `<use>` references of one sprite, so a style swap changes one symbol reference. Pinned length is 1 viewport on mobile.
- **Reduced motion:** the finished fence, with style chips that swap instantly. **No-JS:** the finished fence plus a style gallery.
- **Mobile:** a shorter path, a single pin and horizontally scrolling style chips.
- **Verified data:** the property line is illustrative. It never claims a survey, a permit or HOA approval. Per-foot pricing only from [CP] ranges ⚠.

### Alternates
1. **Privacy Check.** The view from a neighbor's second-story window, with a fence-height slider (4, 6, 8 ft) that shows how much of the yard stays private. Heights are limited to what the contractor says local rules allow [CP]. *Kit:* #25 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* three frames · *Data:* height limits ⚠ [CP].
2. **Pet Test.** A small dog runs along the fence line, and gaps big enough for a small dog flash for each style, leading to a "pet-safe picks" recommendation. *Kit:* `FlowPath` B traveler + #9 · *Size:* S–M · *Assets:* [SVG] · *RM/no-JS:* a static table of styles · *Data:* gap sizes only from [MFR]/[CP] ⚠.
3. **Ten-Year Weather.** A slider ages each material from install to year 10, with wood graying unless it's sealed. It's labeled "Illustrative." *Kit:* #25 + #9 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* before and after pair · *Data:* longevity only from [MFR] warranty text ⚠.

### Micro-moments
- **Gate CTA:** a small gate on the button swings open on hover or focus.
- **Picket progress:** the page progress bar fills with pickets.

---

## 12. Windows / Doors: "Heat Bounce"

Families: Clean Product · Nature Immersive · Cinematic Craft · Night & Glow · Ticket: **#040S** (attaches to #040 Windows/Doors)

### Primary: Heat Bounce (approved)
- **What the homeowner sees and does:** A split room with an old window on the left and a new window on the right. Sun arrows hit both panes: on the old side they **pass straight through** and the floor glows warm, while on the new side they **bounce off**. A "Summer / Winter" toggle flips the arrows, so in winter the room's heat leaks out through the old pane and is held in by the new one. A **noise meter** beside the room (a street icon with bars) drops when the visitor switches to the new window.
- **Homeowner problem:** "Will new windows really make my home more comfortable and quieter?"
- **Assets:** [SVG] window cross-sections and room via #26 `CutawayHouse` (window layer), plus optional [CP] product photos.
- **Kit:** `FlowPath` B (rays) · `RevealCompare` C (season toggle) · `StatsMask` gauge (noise meter) · #26.
- **Size:** M.
- **Performance:** the rays are SVG strokes with a dash traveler, and there's no canvas.
- **Reduced motion:** a static diagram with arrows drawn in each state, and toggles that switch instantly. **No-JS:** two labeled diagrams (summer and winter).
- **Mobile:** old stacked above new, and a single toggle button.
- **Verified data:** ⚠ STC or noise reduction, U-factor and SHGC appear only from the **manufacturer's rating for the product line the contractor installs** (NFRC label or [MFR] sheet, source noted). Without them, the meter shows **"quieter" without numbers** and the diagram carries no values. No energy-savings percentages.

### Alternates
1. **Through the Glass** (LIB #17, M2). Scrolling zooms from the curb through the new window into the bright room behind it. *Kit:* #15 `PortalZoom` · *Size:* M · *Assets:* an exterior/interior pair, [CP] or [AI] labeled · *RM/no-JS:* the two photos · *Data:* none.
2. **Fog Clears** (LIB #18, B3). A fogged, failed-seal pane clears to a crisp view with the headline "Is your seal failing?" and links to window repair and replacement. *Kit:* `RevealCompare` (blur-to-focus) · *Size:* S · *Assets:* one photo + CSS blur state · *RM/no-JS:* before and after pair · *Data:* none.
3. **Pane Explode** (LIB #12, M6). The window separates into frame, panes, low-E coat, gas fill and spacer, then clicks back together. *Kit:* `LayerExplode` · *Size:* M · *Assets:* [SVG] · *RM/no-JS:* the exploded diagram · *Data:* gas type and coatings only from [MFR] ⚠.

### Micro-moments
- **Squeegee CTA:** a squeegee wipes across the button on hover, leaving a streak-free shine.
- **Front-door CTA** (door sites): the button is a front door that opens a crack on hover to show warm light (H10-lite).

---

## 13. Pools: "Fill & Glow"

Families: Cinematic Craft · Nature Immersive · Night & Glow · Friendly Local · Ticket: **#041BS** (attaches to the new #041B Pools template ticket)

### Primary: Fill & Glow (approved)
- **What the homeowner sees and does:** An aerial view of a backyard with an empty, freshly plastered pool shell. Scrolling **fills the water from the deep end**, a soft caustic shimmer starts, the decking and furniture pop in, and the spa spills over. A **Night** toggle darkens the sky, turns on the pool lights (color chips: white, blue, teal, warm) and lights the landscape.
- **Homeowner problem:** "What will the finished pool look like in my yard, day and night?"
- **Assets:** an [AI] aerial labeled "AI example," or a real job aerial [CP]. The shell mask is [SVG]. Caustics are a pre-rendered 256 px tile drifting through CSS `background-position`, not a live SVG turbulence filter.
- **Kit:** #25 `ScrubStage` (`fill`) · `RevealCompare` C (day/night, N4) · #20 `AmbientLayer`.
- **Size:** M.
- **Performance:** the water is a `clip-path` rise plus one drifting tile, which pauses offscreen. Night is an overlay whose opacity changes.
- **Reduced motion:** the filled pool by day, with a Night toggle that switches instantly and no shimmer. **No-JS:** day and night stills.
- **Mobile:** a square aerial, and "Fill it" and "Night" as two large buttons.
- **Verified data:** "AI example" on AI aerials. Build time and price only from [CP] ⚠. No safety or compliance claims beyond reviewed copy.

### Alternates
1. **Dig to Dive** (LIB #33, G9). Four chapters from a real job (Dig, Steel, Plaster, Swim) with giant captions. *Kit:* #17 `ChapterFilm` · *Size:* M · *Assets:* **[CP] clips only**, and the alternate isn't offered without them · *RM/no-JS:* four posters · *Data:* chapter dates only from real job records.
2. **Shape Sketch.** A top-down yard where the visitor picks rectangle, freeform, kidney or plunge, and the shape draws in with an optional spa and sun shelf. *Kit:* #10 `BlueprintReveal` + #9 · *Size:* M · *Assets:* [SVG] · *RM/no-JS:* a static shape grid · *Data:* none.
3. **Depth Dive.** A side section that scrolls from the tanning ledge to the deep end, with depth labels and the safety layers (fence, cover, alarm) snapping into place. *Kit:* #25 + `KineticText` · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* the labeled section · *Data:* safety features only if offered [CP].

### Micro-moments
- **Ripple CTA:** clicking the button sends a water ring out from the click point.
- **Diving-board top button:** "Back to top" dips like a diving board before scrolling.

---

## 14. Flooring: "Plank Run"

Families: Warm Craftsman · Clean Product · Cinematic Craft · Blueprint Precision · Ticket: **#035S** (attaches to #035 Flooring)

### Primary: Plank Run (approved)
- **What the homeowner sees and does:** An empty room in three-quarter view. As the visitor scrolls, **planks lay across the floor row by row** in a staggered pattern, then the sofa, rug and table drop in. Material chips (**Oak hardwood · Luxury vinyl plank · Porcelain tile · Carpet**) swap the floor **under the furniture**, with the furniture staying put while a light sweep crosses the new surface.
- **Homeowner problem:** "Which floor looks right in my room, with my furniture?"
- **Assets:** the room shell and a furniture cut-out as [AI] labeled "AI example" or [SVG]. Floor planes are pre-rendered perspective textures, one per material, [AI] or [MFR].
- **Kit:** `ScrollSequence` SVG mode (#25 `path-build`) · #9 `SwatchConfigurator`.
- **Size:** M.
- **Performance:** the planks are about 30 transformed SVG rects. Material images load after the first chip tap, apart from the default.
- **Reduced motion:** the finished room, with materials swapping instantly. **No-JS:** the finished room plus material thumbnails.
- **Mobile:** a portrait room crop, and chips in a horizontal row.
- **Verified data:** water-, scratch- and pet-resistance claims only from [MFR] specs ⚠.

### Alternates
1. **Spill Test.** A glass tips over on the floor. On waterproof LVP the water beads, and on unsealed hardwood a "wipe it fast" note appears. *Kit:* #25 + #9 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* a comparison table · *Data:* only per [MFR] ⚠.
2. **What's Underneath** (E2). The floor lifts in layers (subfloor, moisture barrier, underlayment, plank) with a one-line "why it matters" for each. *Kit:* `LayerExplode` B · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* the exploded static view · *Data:* none.
3. **Pattern Picker.** Straight, diagonal, herringbone and chevron patterns tessellate across the room in turn. *Kit:* #25 + #9 · *Size:* S · *Assets:* [SVG] pattern tiles · *RM/no-JS:* a thumbnail grid · *Data:* no price premiums unless [CP] ⚠.

### Micro-moments
- **Click-lock CTA:** a plank slides in and click-locks under the button text on hover.
- **Herringbone loader:** image placeholders tile in a quick herringbone.

---
## 15. Garage Doors: "Door Lift"

Families: Clean Product · Bold Industrial · Friendly Local · Night & Glow · Ticket: **#038S** (attaches to #038 Garage Doors)

### Primary: Door Lift
- **What the homeowner sees and does:** The front of a house with a closed, tired garage door and a big handle on the bottom panel with the hint "Lift it." The visitor **drags the door up**. As the panels roll into the track, the wall above the door turns to cutaway and shows the moving parts: torsion spring, cables and drums, rollers in the track, the opener with its rail, and the two photo-eye sensors at floor level. A worn part (a stretched spring, a flat-spotted roller) gets circled with a one-line "what this sounds like" (for example "a loud bang = often a broken spring"). When the door reaches the top, it drops back down fitted with the new door, and **style chips** (Traditional raised panel · Carriage house · Modern flush · Full-view glass) plus **color chips** swap it on the house.
- **Homeowner problem:** "My door is noisy, slow or stuck. Is it the springs, the opener or the whole door, and what would a new one look like on my house?"
- **Assets:** house facade, door, spring, opener and sensors in [SVG] (#26 `CutawayHouse` exterior mode plus a garage-wall layer). Door styles and colors come from the lines the contractor installs, [SVG] redraws or [MFR] imagery with permission. An optional real install photo [CP] goes in the end card.
- **Kit:** #25 `ScrubStage` (`drag-object`, vertical) · #26 exterior + garage layer · #11 `HotspotCallouts` · #9 `SwatchConfigurator`.
- **Size:** M (reuses #25 and #26).
- **Performance:** the panels are 4 `translateY` + `rotateX` transforms, and the cutaway is an opacity change on a pre-drawn layer, all in one SVG. The style images load only after the first chip tap.
- **Reduced motion:** the door shown half-open with every part labeled, plus a "Parts / New door" toggle and style chips that swap instantly. **No-JS:** a labeled parts diagram, the list of symptoms to parts, and a static grid of styles.
- **Mobile:** the drag works vertically on a dedicated side track (56 px wide, `touch-action: pan-x` on the track only, so page scroll still works everywhere else). "Lift it" is also a button, and chips sit in a horizontal row.
- **Verified data:** sound-to-part hints are reviewed education copy ("often," never a diagnosis). The spring note ("springs are under high tension — leave them to a pro") appears only as reviewed copy, with **no safety-certification or code-compliance claims**. ⚠ Insulation R-value, wind-load rating and quiet-opener figures appear only from the [MFR] rating for the installed line. Same-day or emergency wording only if the contractor confirmed it.

### Alternates
1. **Curb Appeal Swap** (LIB #2, S10). A street view of the house where one tap swaps door style, window inserts, color and hardware, and a before/after slider compares it with the tired original. *Kit:* #9 + `RevealCompare` A · *Size:* S · *Assets:* [AI] set labeled "AI example," or [MFR] · *RM/no-JS:* a thumbnail grid plus before and after · *Data:* none.
2. **Sensor Beam Test.** A ball rolls under a closing door: the invisible photo-eye beam draws as a dotted line, the ball breaks it, and the door reverses. The caption explains how auto-reverse works and suggests "test yours monthly," as reviewed copy. *Kit:* #25 + `FlowPath` B · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* three labeled frames · *Data:* it's an explanation of how the feature works, not a claim about the visitor's door, and no safety guarantees.
3. **Chain vs Belt Quiet Test.** Two openers side by side. Tapping "Open" shows sound waves pulsing out of the chain drive and barely rippling from the belt drive, with the sound optional and off by default (§17 #15). *Kit:* `RevealCompare` C + `StatsMask` gauge · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* a static comparison · *Data:* decibel figures only from [MFR] ⚠, otherwise "quieter" with no number. Smart-opener features appear only if sold.

### Micro-moments
- **Roll-up CTA:** the button face rolls up like door panels on hover or focus to reveal "Get my quote."
- **Panel loader:** image placeholders fill with four horizontal door panels that roll up when the image arrives.

---

## 16. Pest Control: "Seal the House"

Families: Friendly Local · Clean Product · Blueprint Precision · Nature Immersive · Ticket: **#039S** (attaches to #039 Pest Control)

**Tone rules for this trade (on top of §0):**
- Clean, bright, friendly illustration only. **No photos or realistic drawings of insects, rodents, droppings, damage or infestations**, and no crawling or swarming motion.
- Pests show up only as **abstract dotted trails and small, simple, rounded line icons** (think map symbols), in the brand's colors.
- **No health or safety claims**, no disease or allergy wording, and no "safe for kids and pets," "non-toxic," "green" or "natural" claims unless the copy is reviewed and matches the product label.
- **No "guaranteed pest-free"** or "eliminate forever" wording. A service guarantee appears only in the contractor's own written terms [CP], quoted accurately.
- No fear framing ("they're in your walls right now"). Everything focuses on prevention and what a visit involves.

### Primary: Seal the House
- **What the homeowner sees and does:** A cheerful illustrated house in its yard (cutaway exterior), with small **dotted trails** drifting in from the lawn, the woodpile and the fence line toward likely entry points: gaps at the eaves, a worn door sweep, utility-line gaps, a torn vent screen, a foundation crack. Each entry point glows softly. As the visitor scrolls (or drags a round "shield" handle around the house), a **protective ring draws around the perimeter** and each entry point gets a small checkmark and a label ("door sweep replaced," "vent screened," "gap sealed"). The trails curve away and fade. Finally, **season chips** (Spring · Summer · Fall · Winter) highlight which simple icons are common in that season, taken from the contractor's regional list, with one line on what a visit does in that season.
- **Homeowner problem:** "How are they getting in, what does a visit actually involve, and what can be done to keep them out?"
- **Assets:** [SVG] only: house, yard, dotted trails, and a small rounded icon set (ant, spider, mouse, wasp, termite as friendly map-symbol glyphs). The seasonal pest list and service steps are [CP] (regional and confirmed).
- **Kit:** #26 `CutawayHouse` exterior · `FlowPath` A/B (dotted trails and perimeter ring) · #25 `ScrubStage` · #11 `HotspotCallouts` for the entry points.
- **Size:** M (reuses #25 and #26; the icon set is small).
- **Performance:** the trails are dashed SVG strokes with `stroke-dashoffset` (≤ 8 trails, no particles), and the ring is one path draw. The module is about 3 KB.
- **Reduced motion:** the finished "sealed" state with the ring, checkmarks, labeled entry points and trails shown as faint static arrows pointing away. Season chips swap instantly. **No-JS:** the same image, plus lists of entry points and seasonal notes.
- **Mobile:** a square crop of the house, scroll-driven with a short pin (≤ 1.2 viewports) or a "Seal it" button, and entry-point labels as a numbered list under the image.
- **Verified data:** the seasonal list comes only from the contractor's regional list. Treatments are described generically ("exterior barrier treatment," "entry-point sealing") with **no chemical names, no safety claims and no efficacy percentages** unless reviewed ⚠. Guarantee wording only as [CP] written terms. No "pest-free" promise.

### Alternates
1. **Inspection Walk.** A flashlight icon (not a person) follows a dotted route around and through the house, stopping at the eaves, attic, crawlspace, kitchen and yard. Each stop opens a card saying what gets checked and why. *Kit:* `FlowPath` B traveler + #11 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* a numbered route map with the card list · *Data:* steps must match the contractor's actual inspection [CP].
2. **Season Wheel.** A 12-month wheel turns with scroll or drag, and each season lights the simple icons that are active in the contractor's region, plus what a quarterly visit covers then. *Kit:* #25 (rotary) + `KineticText` · *Size:* S · *Assets:* [SVG] icons · *RM/no-JS:* a four-season table · *Data:* regional list [CP] only, with no invented "peak season" claims.
3. **Yard Check Lens.** A lens over a tidy illustrated yard reveals the conditions that invite pests (standing water in a planter, a woodpile against the siding, branches touching the roof, gaps under the door), and each find flips to a simple prevention tip. *Kit:* `RevealCompare` B + #11 · *Size:* S · *Assets:* [SVG] · *RM/no-JS:* all conditions labeled with tips · *Data:* general prevention tips from reviewed copy, with no health claims.

### Micro-moments
- **Shield CTA:** a small shield outline in the button fills with the brand color on hover or focus.
- **Door-sweep success:** after the form is sent, a door sweep slides shut along the bottom of the confirmation card with a check. No bug imagery.

---
## 17. More creative: cross-trade ideas beyond scroll animation (22)

Each idea lists: **what the visitor gets**, **honesty flags**, **data it needs**, and **kit / size / related backlog**. None of them counts as the site's signature. They're optional modules, and each site may add **at most 2** of them if its data exists (see §18).

1. **Weather-aware hero** (approved). The hero sky and one line of copy match the real current conditions in the contractor's city: rain streaks with "Leak after last night's rain?", heat shimmer with "Beat the heat," snow with "Ice dams?". Changes are limited to approved banners and copy. **Flags:** only from a fresh real observation with an expiry time. When there's no data or the data is stale, it shows the neutral skin. **No invented storm alerts, no automatic discounts.** **Data:** the contractor's city (not the visitor's IP location), a weather source (K25). **Kit:** #27 `ContextSkin` + #20 · M · **Backlog:** consumes #160/#161; queued as **#028G**.
2. **Season-aware hero.** The same component driven only by the date and the site's hemisphere. Roofing shows spring storm prep and autumn gutters, HVAC shows the pre-summer tune-up, Pools shows the opening season. **Flags:** none (it's a calendar fact). The copy is from an approved set. **Data:** date, latitude. **Kit:** #27 · S · **Backlog:** #028G (season mode ships without any key).
3. **Night version / dark mode.** After local sunset, or when `prefers-color-scheme: dark` is set, the site switches to its Night & Glow sibling palette, and signature scenes swap to their night art where it exists (lit windows, pool lights, path lights). **Flags:** none. **Data:** time zone. **Kit:** #27 + style tokens · S–M.
4. **Cost-range tool** (approved). A three-step slider (what, how big, which material) returns **the contractor's own range**, for example "$9k–$14k typical," with a note on what moves the price. **Flags:** ⚠ ranges only from the contractor's saved ranges (the #004D service price-range fields). Labeled "Typical range, not a quote." Hidden when there's no range. **Data:** per-service ranges [CP]. **Kit:** #19 `StepFunnel` (F2) · M · **Backlog:** reuses the #004D range data.
5. **"What's wrong with my ___?" symptom router.** The visitor taps illustrated symptoms ("water stain on ceiling," "one room hot," "breaker keeps tripping," "fence leaning") and gets a plain answer ("usually flashing or a pipe boot"), then the right service page with the inquiry pre-filled with that symptom. It also has a "Not sure? Send a photo" branch (see #20). **Flags:** it's education, not a diagnosis ("common causes"). No emergency wording unless the contractor has confirmed emergency service. **Data:** a symptom→service map for each trade from reviewed copy, and the contractor's selected services (unselected services never show up). **Kit:** #28 `SymptomRouter` + #26 illustrations · M · **Backlog:** queued as **#028H**. It uses the #014 inquiry-context path.
6. **"Your street" illustrated service map.** A hand-drawn-style SVG map of the service area (main roads, parks, the river), with the contractor's truck driving between the towns they serve and each town linking to its city page. **Flags:** towns only from the contractor's confirmed list. Towns are never shown as branch offices (#021 rule). Map data attribution if it's derived from OpenStreetMap. **Data:** service-area towns [CP]. **Kit:** `FlowPath` C + H20 · M · **Backlog:** links to #021 city pages.
7. **Truthful neighborhood heat map.** Real completed-job ZIP codes shown as softly shaded areas: "Where we've worked, 2022–2026." **Flags:** ⚠ only published, real jobs. ZIPs with fewer than 3 jobs are merged or hidden so no home can be identified, and it carries a date range. **No "live" or "right now" wording.** **Data:** job ZIPs from Project Map records (X). **Kit:** `FlowPath` C · S–M · **Backlog:** Project Map; #158 later.
8. **Project-timeline scrubber.** One real job, with a slider running from day 1 to the final day through the contractor's own photos in date order (demo, framing, finish, keys). **Flags:** ⚠ contractor photos only, ordered by their real dates, never padded with AI frames. **Data:** a published project with dated photos. **Kit:** #25 + #17 · M · **Backlog:** Project Map; #163 job binder.
9. **Before/after pinned on a map.** Map pins for real jobs (neighborhood level, never the exact address), where tapping one opens a mini before/after slider. **Flags:** ⚠ homeowner-approved projects only. Pins are offset to the neighborhood. **Data:** published projects with before/after pairs. **Kit:** `RevealCompare` A + `FlowPath` C · M.
10. **Crew cards that flip.** Real crew photos on the front, and on the back: role, years with the company, favorite job, license or certifications. **Flags:** real people with consent only. **Never AI people** (#007). Certifications only if verified. The section hides when there are no crew photos. **Data:** crew records and photos [CP]. **Kit:** the 3D flip primitive from backlog ticket #019 · S · **Backlog:** #019.
11. **Warranty certificate that stamps in.** A certificate-style card with the contractor's workmanship-warranty years and the manufacturer warranty, and a seal that stamps down (M12). Tapping it opens the actual warranty text. **Flags:** ⚠ only from the confirmed warranty facts (#007A) and a supplied warranty document. Manufacturer marks only where rights exist (K22). **Data:** warranty years and document. **Kit:** M12 + F3 flip · S.
12. **Materials-sample drawer.** A wooden drawer slides open to show real sample chips (shingle colors, quartz, stain, fence boards). Tapping one opens it in the signature's `SwatchConfigurator`. **Flags:** only products the contractor actually carries. **Data:** sample photos or [MFR] images. **Kit:** #9 + a CSS drawer · S.
13. **Printable one-page estimate summary.** After the cost tool or symptom router, "Print or save my summary" produces a clean one-page sheet with the visitor's answers, the contractor's range, what's included and next steps, watermarked "Summary, not a quote." **Flags:** ⚠ same range rules as #4, with no invented line items. **Data:** router or cost-tool answers. **Kit:** print CSS only · S.
14. **QR to site for yard signs and trucks.** Each yard sign or truck gets a stable QR code, and scanning it opens a landing variant: "You scanned our sign on a job in [neighborhood]," linked to that job's published photos when they exist. **Flags:** the neighborhood appears only if that job is published. No fake "your neighbor just…" copy. **Data:** QR source parameter and the job link. **Kit:** none (routing) · S · **Backlog:** #166.
15. **Subtle audio, off by default.** A small speaker toggle, off by default, adds rain on the roof in Storm Pass, the AC hum dropping in Comfort Map, a louver whir in Shade Clock and a street hush in Heat Bounce. **Flags:** never autoplays, is remembered per session, and never carries information that isn't also shown visually. **Data:** 3–5 short licensed or self-recorded clips under 40 KB each, lazy-loaded. **Kit:** a tiny audio helper · S.
16. **Holiday and seasonal skins.** Subtle accents (a fall leaf in the ridge line, winter frost on the CTA edge, a Fourth of July color pop) chosen by date through `ContextSkin`, with an opt-out per contractor. **Flags:** decoration only, **never tied to a fake sale or deadline**. Promotions still come only from real dated offers (A/#015). **Data:** date. **Kit:** #27 · S.
17. **Owner voice note.** A 20-second audio intro from the owner ("Hi, I'm Dana, I still climb every roof we quote") with a waveform and a full transcript. **Flags:** real recording by the real owner only. No AI voice. **Data:** audio [CP]. **Kit:** a tiny audio helper · S.
18. **"What happens at your appointment."** A four-panel animated storyboard (we arrive, we look, we explain with photos, you get a written estimate) built from real truck and crew photos where they exist, otherwise [SVG]. **Flags:** the steps must match the contractor's actual process [CP]. No time promises unless confirmed. **Data:** process steps. **Kit:** `StickyStack` (#004I) · S.
19. **Home-age lens.** The visitor enters the year their home was built, and a house illustration highlights the systems that are commonly due for a look at that age (roof, water heater, panel, windows), each linking to the relevant trade or service. **Flags:** ⚠ general ranges from reviewed copy only, labeled "typical, every home differs." Not a diagnosis. **Data:** a reviewed age table. **Kit:** #26 + #28 · M.
20. **Snap-a-photo triage.** "Send us a photo of what you're seeing" attaches a private photo to the inquiry, and a friendly animation shows it going into the crew's inbox. **Flags:** no AI diagnosis claims, private storage, consent text, and no public display. **Data:** upload and storage (the existing media contracts). **Kit:** form + #28 branch · M.
21. **"Questions to ask any contractor" checklist.** A printable, trust-building checklist (license, insurance, written scope, warranty, cleanup) where the contractor's own confirmed answers tick in beside each question. **Flags:** ⚠ a tick appears only for confirmed facts (#007A/#011). No competitor claims (#168 rules if competitors are ever named). **Data:** confirmed trust facts. **Kit:** `KineticText` + print CSS · S.
22. **Neighborhood-style matcher.** The visitor picks their house style (ranch, Spanish, craftsman, two-story colonial), and the signature art and swatches switch to that silhouette, so the storm, paint or fence scene looks like *their* kind of house. **Flags:** none (it's illustration). **Data:** 4 house silhouettes in the shared SVG. **Kit:** #26 / #25 art variants · M. It also multiplies uniqueness.

---
## 18. Rotation rule: how the pieces combine

A site is **1 signature × 1 style family × A/B/C layouts × 1 set of supporting library patterns × 1 palette**, plus 1 micro-moment set, up to 2 optional modules from §17, and the contractor's own photos, logo, towns and verified numbers.

This extends the LIBRARY §5 fingerprint. **The trade signature takes the LIBRARY "hero signature" slot**, whether it sits in the hero or directly below it. The fingerprint becomes: signature · family · transition · services · proof · CTA (the LIBRARY 6), plus layout and palette.

**Rules (deterministic, seeded from the contractor ID, stored in the #023 generation manifest and applied by the #028C uniqueness generator):**
1. **Signature.** Within one trade and one metro (about 25 miles), the first 4 sites use 4 **different** signatures. The approved primary goes to the first site unless the contractor chooses otherwise. After that, signatures may repeat, but never with the same family.
2. **Family.** Pick from the trade's 4 families (listed in each trade card). Don't repeat a family in the metro until all 4 have been used (LIBRARY rule 2). **The same signature + family pair never appears twice in a metro.**
3. **Layout.** A/B/C per section, seeded.
4. **Supporting patterns.** 1 transition, 1 services and 1 proof pattern plus the CTA, drawn from the family's LIBRARY §5 row. Drop any pattern that repeats the signature's mechanic (for example, no drag-wipe proof section when the signature is Demo Day; use a gallery instead). **Budget gate:** if the measured total goes over 60 KB gzip, re-roll the heaviest supporting pattern. The signature is never the one dropped.
5. **Micro-moments.** Use 1 of the trade's 2, or both, since they're CSS-only.
6. **Optional modules** (§17). Up to 2, and only if their data exists. A module whose data is missing is dropped silently and never faked.
7. **Distinctness.** At least 3 of the 6 LIBRARY fingerprint slots must differ from every other same-trade site within about 25 miles (LIBRARY rule 4). Only the colliding slot gets re-rolled.
8. **Contractor assets are the final differentiator**: their photos inside the signature's end card, their logo in `StatsMask`, their towns on the §17 #6 map, and their name in `DepthTitle`.

**Combination math per trade (numbers from this doc and LIBRARY §5):**

| Factor | Value | Where it comes from |
|---|---|---|
| Signatures (S) | 4 | 1 primary + 3 alternates per trade (§1–§16; 14 approved primaries, plus the new Garage Doors and Pest Control primaries) |
| Style families (F) | 4 | the families listed per trade |
| Layout variants (L) | 3 | kit A/B/C |
| Supporting pattern sets (P) | 15 | LIBRARY §5 averages: 2 transitions × 2 services × 2.5 proof × 1.5 CTA |
| Palettes (C) | 3 | per family (LIBRARY rule 6) |

- **Core fingerprints per trade** = S × F × L × P × C = 4 × 4 × 3 × 15 × 3 = **2,160**
- **With type pairings (2) and micro-moment choice (2)** = 2,160 × 2 × 2 = **8,640 per trade**
- **Original 16 trades:** core 2,160 × 16 = **34,560**; extended 8,640 × 16 = **138,240**. Planned Locksmith makes 17: core **36,720**, extended **146,880**, if the same four-signature kit is supplied. These are design combinations, not built variants.
- **Optional modules** (upper bound, not a headline number): if about 10 of the 22 §17 modules have data for a contractor, choosing 0, 1 or 2 of them = 1 + 10 + 45 = 56 options, so 8,640 × 56 ≈ **483,840 per trade**
- **What actually limits a single metro** is the side-by-side rule, not the raw count: 4 signatures × 4 families = **16 distinct signature + family pairs per trade per metro** before any pair repeats. On top of that, the layout, palette and support re-rolls keep every site at least 3 slots apart.

## 19. Recommended build order

The order follows Joe's sequence, and it's also the order that creates the new shared components earliest:

| Step | Ticket | Builds or reuses | Why here |
|---|---|---|---|
| 0 | #004G-v3 (already Done) → **#004H-finish** → **#004I** | existing kit | current work finishes first. #004H's mobile Performance gate (≥ 85) has to pass, because every signature ticket inherits it |
| 1 | **#004J Roofing: Storm Pass** | **builds #25 `ScrubStage`** + #20 particles + #11 | Roofing is the reference trade. It creates the engine 12 trades reuse |
| 2 | **#004K Patio: Shade Clock** | reuses #25, adds #20 shadow mode + #9 `SwatchConfigurator` | Joe's own product line, and cheap because the engine already exists |
| 3 | continue the existing backlog (#005, #013 … #028F) | none | Roofing acceptance first (#028) |
| 4 | **#028G weather/season-aware hero** | **builds #27 `ContextSkin`** | season mode needs no key. Weather mode lights up only after #160/#161 |
| 5 | **#028H symptom router** | **builds #28 `SymptomRouter`** (on #19) | converts in every trade, and trade symptom maps grow with each rollout |
| 6 | **#029S HVAC: Comfort Map** | **builds #26 `CutawayHouse`** | the first big cutaway, which five later trades reuse (Plumbing, Electrical, Garage Doors, Pest Control, Windows/Doors) |
| 7 | #031S Plumbing · #032S Electrical | reuse #26 | cheap after HVAC |
| 8 | #033S Landscaping · #034S Remodel · #035S Flooring · #036S Painting · #037S Fencing | reuse #25, #9, `RevealCompare` modes | backlog order |
| 8b | #038S Garage Doors · #039S Pest Control | reuse #25, #26, `FlowPath`, #11 | backlog order. Pest Control copy needs a review pass (§16 tone rules) |
| 9 | #040S Windows/Doors · #041S Solar | reuse #26, `FlowPath` B, `StatsMask` gauge/chart | Solar's verified-input configuration is the slowest dependency, so it goes last |
| 10 | #041A Concrete template → #041AS The Pour · #041B Pools template → #041BS Fill & Glow | reuse #25 `fill` + #9 | the new template tickets go after #041, and each signature goes in with its template |

## 20. Backlog mapping and trade decisions

| Trade | Signature ticket | Attaches to template ticket |
|---|---|---|
| Roofing | #004J | Roofing reference #001–#028 |
| Patio covers | #004K | #030 Patios (built early; adopted in #030) |
| HVAC | #029S | #029 |
| Plumbing | #031S | #031 |
| Electrical | #032S | #032 |
| Landscaping | #033S | #033 |
| Kitchen/Bath remodel | #034S | #034 General Contractors |
| Flooring | #035S | #035 |
| Painting | #036S | #036 |
| Fencing | #037S | #037 |
| Garage Doors | #038S | #038 |
| Pest Control | #039S | #039 |
| Windows/Doors | #040S | #040 |
| Solar | #041S | #041 |
| Concrete | #041AS | **#041A** (new Concrete template ticket, after #041) |
| Pools | #041BS | **#041B** (new Pools template ticket, after #041A) |
| Locksmith | #041DS | **#041D** (planned trade #17, after #041C) |
| Cross-trade hero | #028G | after #028F; weather mode depends on #160/#161 |
| Symptom router | #028H | after #028G |

**Joe's decision (2026-09-24):** Kitchen/Bath remodel stays attached to #034 General Contractors. Concrete and Pools are added as new template trades (#041A, #041B). All 16 trades get signatures: Roofing, HVAC, Plumbing, Electrical, Solar, Patio covers, Kitchen/Bath remodel (General Contractors), Painting, Landscaping, Concrete, Fencing, Windows/Doors, Pools, Flooring, Garage Doors and Pest Control.

**Later planning addition:** Locksmith becomes trade #17 (#041D) with a Pin & Tumbler signature (#041DS). Its full alternates, media and seed are to be specified and built in that ticket; the 16-trade counts below describe the previously approved set.

## 21. Counts at a glance
- **16 trades**, each with a fully specced primary signature (14 approved earlier, plus Garage Doors and Pest Control added on 2026-09-24)
- **48 alternates** (3 per trade)
- **32 micro-moments** (2 per trade)
- **22 cross-trade ideas** (§17)
- 4 new shared components (#25–#28), plus reuse of the base kit and LIBRARY #9, #10, #11, #15, #16, #17, #18, #19 and #20
