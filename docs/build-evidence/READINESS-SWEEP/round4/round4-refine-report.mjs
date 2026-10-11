import fs from 'node:fs';
const base='C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP',out=base+'/round4';
const comparison=JSON.parse(fs.readFileSync(out+'/comparison.json')),actual=new Map(comparison.rows.map(r=>[r.label,r.round4]));
const known=JSON.parse(fs.readFileSync(out+'/known-failures.json'));
const causes={
 'automatic-qa-contract':'Final-source rerun fails before live-review checks: the sweep-regenerated packet-list first entry is now clear, but the fixture requires a pending-Borderline packet. Initial sweep pass and final failure are both retained. No QA input or assertion changed; baseline classification is unverified.',
 'media-library-browser':'Six image-load checks fail in generated-locksmith-fresh-390-home (safe servicing, key duplication, rekeying, service journey, kit banner, lockout process). Installed files exist; decode/visibility timing cause and exact baseline classification remain unverified.',
 'uniqueness-browser':'The #customer-reviews section stays hidden and scrollIntoViewIfNeeded times out at line 91. No visibility assertion, template or fixture was weakened. Exact baseline classification remains unverified.',
 'owner-download':'All printed owner/renter/download/layout assertions pass, then the process hangs at exit. This is an unresolved teardown warning, not a clean suite exit.',
};
for(const r of known){if(causes[r.name])r.cause=causes[r.name];if(/First-access manifest/.test(r.name))r.cause='Resolved by validation-only readOne and readOnly Game/root-tenant authorization. Reads and personal tour records do not adopt or repair site manifests; explicit site writes retain ensure/migration. Ten new checks pass natively and on PostgreSQL.';}
fs.writeFileSync(out+'/known-failures.json',JSON.stringify(known,null,2));
const safe=x=>String(x).replaceAll('|','/').replaceAll('\n',' ');
fs.writeFileSync(base+'/KNOWN-FAILURES.md','# Known failures — Round 4\n\nNo protected QA finding was fixed or accepted. Original 70 Borderlines remain REJECTED/OPEN; qaGateClear=false. Earlier baseline classifications are retained, including UNVERIFIED where prerequisites blocked the baseline. The ten failing standalone outcomes and one exit warning are all retained; protected findings remain blockers.\n\n| Check | Round 4 | Classification | ID / owner | File:line | Cause |\n|---|---|---|---|---|---|\n'+known.map(r=>'| '+[r.name,r.result,r.classification,r.id+' / '+r.owner,r.location,r.cause].map(safe).join(' | ')+' |').join('\n')+'\n');
let text=fs.readFileSync(base+'/README.md','utf8'),lines=text.split('\n');
const start=lines.findIndex(l=>l.startsWith('| Area |')),end=lines.findIndex((l,i)=>i>start+1&&!l.startsWith('|'));
const rows=lines.slice(start+2,end).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
for(const cells of rows){
 const match=cells[0].match(/(?:additional|targeted) · ([\w-]+)/),r=match&&actual.get(match[1]);
 if(r){cells[2]=r.code!==0?'Yes':r.outcome==='PASS-WITH-WARNING'?'Yes — exit warning':'No';cells[10]=(r.code===0?'PASS':'FAIL')+' '+(r.pass===null?'suite':r.pass+'/'+(r.pass+r.fail))+(r.outcome==='PASS-WITH-WARNING'?' — exit teardown remains open':'');if(r.code!==0){cells[3]=r.locations.join('; ')||cells[3];cells[10]+=' — '+(causes[r.label]||r.failures?.at(-1)||'See current Known failures').slice(0,450)}}
 if(cells[0].startsWith('Publish flow · Owner download')){cells[2]='No — local paid/refund E2E';cells[10]='PASS 2/2 paid publication/ownership E2E on each database. Actual settlement → ZIP → refund → download denial. Older UI suite exit warning is listed separately.'}
 if(cells[0].startsWith('Publish flow · Backup and guarded publication')||cells[0].startsWith('Publish flow · Paid workspace feature check')){if(actual.get('review-packet-contract')?.code===0){cells[2]='No — local contract checks';cells[10]='PASS review-packet-contract and offline paid publication E2E; real browser capture/staff approval required. Real custom-host launch remains Louie backend scope.'}}
}
rows.push(['Round 4 · first-access Game read','INTRODUCED manifest mutation found in Round 3b','No','src/core.js:30; src/blueprint/api.js:27; tests/readiness-batch-b.mjs:12','Validation-only reads; initialization only on explicit site writes.','S','Not run','Not run','Not run','Introduced finding','PASS 10/10 native and PostgreSQL; no manifest/history mutation.']);
rows.sort((a,b)=>Number(!a[2].startsWith('Yes'))-Number(!b[2].startsWith('Yes'))||a[0].localeCompare(b[0]));
lines.splice(start+2,end-start-2,...rows.map(c=>'| '+c.map(safe).join(' | ')+' |'));
fs.writeFileSync(base+'/README.md',lines.join('\n'));
fs.appendFileSync(out+'/README.md','\nEvidence formatters were corrected locally without rerunning any test or changing assertions. The finalized SQL report stores execution totals and trace SHA-256 values instead of repeating every matching trace line. Raw traces remain local and are not staged. Current failure causes and publication/owner outcomes supersede historical before-sweep descriptions in the root table.\n');
console.log('Current-status evidence refined; source and assertions unchanged.');
