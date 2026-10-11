import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028A';
assert.ok(fs.readFileSync(out+'/README.md','utf8').includes('**State: Complete.**'));
const read=n=>fs.readFileSync(root+'/'+n,'utf8'),write=(n,s)=>fs.writeFileSync(root+'/'+n,s);
const from='State: **In progress — approved color fixes and final rerun pending** · [Evidence](docs/build-evidence/028A/README.md)';
let backlog=read('BUILD-BACKLOG.md');assert.ok(backlog.includes(from));write('BUILD-BACKLOG.md',backlog.replace(from,'State: **Done** · [Evidence](docs/build-evidence/028A/README.md)'));
const p=JSON.parse(fs.readFileSync(out+'/preservation.json'));
let status=read('BUILD-STATUS.md'),start=status.indexOf('### #028A — Design styles in progress (2026-09-27)');assert.ok(start>=0);
const end=status.indexOf('\n### ',start+4),old=status.slice(start,end<0?undefined:end);
const next=`### #028A — Done (2026-09-27)

- Current, Bold, Fresh and Classic are configured for all 17 kits. The contractor picker, private full-site Preview and existing draft/Publish flow are implemented. Shared desktop header centers align exactly; design-lock and status wording is plain language.
- [Evidence](docs/build-evidence/028A/README.md): fresh 102/102 commands passed; 1,032 page/device/mode checks and 9,920 assertions across all four styles passed with zero AA, overflow, header or browser failures. Roofing acceptance: 911 assertions, 132 page states, 88 assets. Platform mobile: 210 states. Asset integrity: 635 references across 17 kits. Archived HTML: 374/374 byte-identical. QA URLs after Vite restart: 39/39 HTTP 200.
- Joe approved four remaining Current color-only fixes: Patios service text #6e735f → #6d725e; five trade hero buttons #bb704c → #a65e3a; Roofing Blog label #737c70 → #626d60; policy footer caption #64748b → #617187. The README links 18 before/after capture pairs with identical measured layout, fonts and spacing. Earlier approved copper/photo-caption fixes remain; all 96 photo-pixel samples pass.
- ${p.priorEvidenceVerified.toLocaleString('en-US')} prior evidence files and ${p.unrelatedVerified.toLocaleString('en-US')} unrelated files were byte-verified. Higgsfield credits used: 0. Local commit only; no push, deployment or staging. #028B is next and has not started.
`;
write('BUILD-STATUS.md',status.replace(old,next));
let design=read('docs/modules/design.md');design=design.replace('Joe-approved failing caption color correction','Joe-approved minimal AA color corrections').replace('verification status and any remaining contrast decisions','the four approved final color values, before/after captures and passing checks');write('docs/modules/design.md',design);
console.log('Updated only the #028A ledger entries and owning design note.');
