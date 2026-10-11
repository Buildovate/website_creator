import fs from 'node:fs';
const out='C:/Users/joe/website_creator/docs/build-evidence/028A';
const read=(p)=>JSON.parse(fs.readFileSync(out+'/'+p));
const maybe=p=>fs.existsSync(out+'/'+p)?read(p):null;
const styles=['current','bold','fresh','classic'];
const recent=maybe('style-browser-results-bold-fresh-classic.json'),current=maybe('style-browser-results-current.json');
const cases=[...(recent?.pages||[]),...(current?.pages||[])];
const checks=[...(recent?.checks||[]),...(current?.checks||[])];
const failures=[...(recent?.failures||[]),...(current?.failures||[])];
const kits=[...new Set(cases.filter(p=>p.kit!=='roofing-complete'&&p.kit!=='roofing').map(p=>p.kit))].sort();
const shot=(s,p,d)=>`[${d==='desktop'?'1440':'390'}](screenshots/roofing-complete-${s}-${p||'home'}-${d}-normal.jpg)`;
const roofRows=styles.map(s=>`| ${s[0].toUpperCase()+s.slice(1)} | ${['home','services-roof-repair','financing','contact'].map(p=>shot(s,p,'desktop')+' · '+shot(s,p,'phone')).join(' | ')} |`).join('\n');
const kitRows=kits.map(k=>`| ${k} | ${styles.map(s=>`[${s} desktop](screenshots/${k}-${s}-home-desktop-normal.jpg) · [phone](screenshots/${k}-${s}-home-phone-normal.jpg)`).join(' | ')} |`).join('\n');
const styleAuditRows=styles.map(style=>{const rows=[...read('contrast-results-bold-fresh-classic.json'),...read('contrast-results-current.json')].filter(r=>r.style===style),measurements=rows.flatMap(r=>r.measurements);return `| ${style} | ${cases.filter(r=>r.style===style).length} | ${measurements.length} | ${measurements.filter(r=>!r.pass).length} |`}).join('\n');
const allStyles=cases.length===1032&&failures.length===0;
const suite=read('final-checks.json');
const outside=read('outside-scope-responses.json');
const responsePass=outside.every(r=>r.status===r.expectedStatus&&r.sha256===r.expectedSha256);
const focus=read('focus-results.json');
const palette=read('palette-contrast.json');
const acceptance=read('acceptance-results.json');
const urls=maybe('qa-current-urls.json');
const captions=maybe('photo-caption-contrast.json');
const preservation=maybe('preservation.json');
const colorFixes=maybe('current-color-fixes/approved-colors.json'),colorPairs=maybe('current-color-fixes/comparison.json'),aaRun=maybe('aa-final-run.json');
const colorRows=colorFixes?.colors.map(c=>`| ${c.spot} | ${c.old} | ${c.new} | ${c.oldRatio}:1 | ${c.newRatio}:1 |`).join('\n')||'';
const spotRows=colorPairs?[...new Set(colorPairs.map(r=>r.key))].map(key=>`| ${key} | ${['desktop','phone'].map(device=>{const p=colorPairs.find(r=>r.key===key&&r.device===device);return `[Before](${p.beforeCapture}) · [After](${p.afterCapture})`}).join(' | ')} |`).join('\n'):'';
const currentContrast=current?.failures.filter(f=>f.label.startsWith('WCAG text contrast'))||[];
const mainStatus=allStyles&&responsePass&&focus.every(x=>x.pass)&&palette.every(x=>x.pass)&&suite.summary.passed===102&&suite.summary.run&&preservation?.changed.length===0&&captions?.failures.length===0&&urls?.every(x=>x.status===200)&&aaRun?.length===2&&aaRun.every(x=>x.status===0)&&colorPairs?.length===18&&colorPairs.every(x=>x.layoutIdentical)?'Complete':'In progress';
const md=`# #028A Design styles and #028 carry-over fixes

**State: ${mainStatus}.** Local work on \`feature/local-environment-setup\`, 2026-09-27 PT. **Higgsfield credits used: 0.** No external media was generated; no push, deployment or staging.

## Result

Every installed kit has four named style configurations: **Current** (the legacy renderer), **Bold** (dark, strong Barlow headings), **Fresh** (cool light, spacious DM Sans) and **Classic** (warm light, Georgia headings). The three new skins change only type, color, radius and spacing within the existing sections; content, media, page links and CTA wording come from the existing published site. The uploaded logo sits on a neutral contrast plate in the new skins. All fonts and photos were already installed.

A site honors the contractor's saved choice first. Otherwise it uses its stored deterministic site seed. \`stableSiteStyleSeed(tenantId)\` is the single #004M replacement point. New sites and duplicates get a seed; older sites with no seed or choice continue on Current. The existing draft/Publish flow now exposes **Look of your site** with four live previews of that contractor's own homepage, a full-site private Preview, one Save action, and owner/editor versus viewer permissions. The design-lock and draft/published status words are plain language. The shared header puts every desktop nav item and the CTA on the same vertical center line.

## Verification

| Check | Result |
|---|---|
| Existing build, typecheck, regression and browser commands | ${suite.summary.passed}/${suite.summary.commands} passed. Full fresh rerun after the four approved color fixes; [per-command status and history](final-checks.json). Original Promotions Pending-state browser tests used the original Phase 1 fixture and restored the installed catalog after the run. |
| Roofing acceptance | ${acceptance.checks.length} assertions, ${acceptance.pages.length} page/device/mode checks, ${acceptance.assets.length} local assets, ${acceptance.failures.length} failures. [Result](acceptance-results.json). |
| Every Roofing route and 16 other kit homepages, four styles, desktop and phone, normal/reduced/no-JS | ${cases.length}/1032 checks completed; ${checks.length} assertions; ${failures.length} findings. [New styles](style-browser-results-bold-fresh-classic.json) · [Current](style-browser-results-current.json). The 26 Roofing routes are checked in every state. |
| Current archived HTML | ${outside.length}/374 byte-identical, ${responsePass?'pass':'FAIL'}. [Hashes](outside-scope-responses.json). |
| New-style palette and key control contrast | ${palette.filter(x=>x.pass).length}/${palette.length} passed. [Computed ratios](palette-contrast.json). |
| Actual keyboard focus and menu controls | ${focus.filter(x=>x.pass).length}/${focus.length} passed across four styles and both widths. [Measurements](focus-results.json). |
| Published QA URLs after Vite restart | ${urls?`${urls.filter(x=>x.status===200).length}/${urls.length} HTTP 200`:'Pending final restart'}. [Probe](qa-current-urls.json). |
| Earlier evidence and unrelated files | ${preservation?`${preservation.priorEvidenceVerified} earlier evidence files and ${preservation.unrelatedVerified} unrelated files byte-verified`:'Pending final restore'}. [Preservation](preservation.json). |

| Style | Page states | Text contrast measurements | AA failures |
|---|---:|---:|---:|
${styleAuditRows}

The [per-element audit for new styles](contrast-results-bold-fresh-classic.json) and [Current audit](contrast-results-current.json) record foreground, composited background, font size and WCAG ratio on all tested pages; image backgrounds are called out separately. The [header audit](header-alignment-bold-fresh-classic.json) records each item rectangle and text center. [Before](headers-before/roofing-light.png) and [after](headers-after/roofing-complete-fresh.png) header crops show the light-header correction; the after folder has all 17 kits and four styles.

${captions?`[Actual installed-photo caption pixel ratios](photo-caption-contrast.json): ${captions.captions.length} visible text/photo samples, ${captions.failures.length} failures. This audit samples lossless rendered backgrounds under the text glyphs, including the image and overlay.`:'Actual installed-photo caption pixel audit is pending.'}

${currentContrast.length?`**Current style contrast decision pending:** ${currentContrast.length} page/state measurements still fail AA for pre-existing colors in Patios service text, five trade hero buttons, the Roofing Blog search label and the policy footer caption. Current HTML remains byte-identical; the proposed minimal color-only corrections await Joe's answer. The already approved copper and photo-caption corrections are present. These failures prevent marking #028A complete.\n\n| Existing color case | Current ratio | Proposed single-color value | Calculated ratio |\n|---|---:|---|---:|\n| Patios service text | 4.486:1 | #6d725e | 4.552:1 |\n| Windows/Doors, Solar, Concrete, Pools, Locksmith hero buttons | 3.794:1 | #a65e3a background | 4.902:1 |\n| Roofing Blog search label | 3.913:1 | #626d60 | 4.892:1 |\n| Policy footer caption | 4.437:1 | #617187 | 4.640:1 |\n\nThese candidate values are calculated against the recorded backgrounds. They are proposals only until Joe chooses whether Current's exact colors or AA takes priority. A final browser rerun will verify the rendered result if approved.`:'Current style computed text contrast has no outstanding failure in the tested matrix. The four approved colors are external CSS changes; archived HTML has no differences.'}

${colorFixes?`## Approved Current color corrections\n\nJoe approved these four color-only corrections after the initial AA audit. No layout, fonts, spacing, radius or other Current colors changed in this approval pass. The [measured before/after comparison](current-color-fixes/comparison.json) verifies identical geometry and typography in all 18 desktop/phone spot checks. The policy caption is captured on both policy pages. A [17-kit Blog scope check](current-color-fixes/blog-scope.json) confirms that only Roofing receives the Blog label color; the other 16 kits keep their original value. The [fresh AA run](aa-final-run.json) checks every style after these changes.\n\n| Changed spot | Old hex | New hex | Old ratio | New ratio |\n|---|---|---|---:|---:|\n${colorRows}\n\n| Spot | Desktop before / after | Phone before / after |\n|---|---|---|\n${spotRows}\n\n`:''}

## Roofing visual evidence

[Side-by-side homepage heroes](roofing-style-comparison.jpg). Captures were made at 1440×900 and 390×844 after scrolling through lazy media, waiting for fonts and images, and letting motion settle. All 26 Roofing routes also passed the reduced-motion and no-JS matrix checks.

| Style | Home | Roof repair | Financing | Contact |
|---|---|---|---|---|
${roofRows}

## The other 16 kits

Their published homepages were checked at both widths in every style, including reduced motion and no JavaScript. Normal-state captures:

| Kit | Current | Bold | Fresh | Classic |
|---|---|---|---|---|
${kitRows}

## Contractor flow and reuse

[Desktop picker](picker/desktop.jpg) · [phone picker](picker/phone.jpg) · [Classic full-site Preview](picker/preview-classic-desktop.jpg) · [Classic published result](picker/published-classic-desktop.jpg). The browser run checks that Save changes only the draft, Preview retains the style across internal links, Publish exposes it publicly, offline and failed saves retain the selected choice, and viewers cannot Save.

Reused the existing 17-kit renderers and page sections, installed font/photo/logo assets, the draft/publish API, the #023 generation manifest, and the existing Roofing film and scroll behavior. No new section layout variants were added; those belong to #028B. Reduced-motion first paint was aligned with the existing static story layout to remove a measured shift. A previously missing \`/flow.css\` route now returns HTTP 200 without changing legal-page markup.

The fresh suite uses repo-local FFmpeg dependencies. The historical media test's absolute tool path was temporarily redirected to these local dependencies and its original file bytes restored afterward. Prior evidence is backed up and restored byte-for-byte; only this ticket's evidence is retained here.

No external integration changed. Existing provider, real-iPhone camera and other gates from earlier tickets remain as recorded in their evidence; this ticket did not claim those gates completed.
`;
fs.writeFileSync(out+'/README.md',md);
console.log(JSON.stringify({state:mainStatus,pages:cases.length,checks:checks.length,failures:failures.length,otherKits:kits.length}));
