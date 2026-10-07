import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root='C:/Users/joe/website_creator',checks=root+'/docs/build-evidence/028F/checks',base=root+'/docs/build-evidence/027A-part2';process.chdir(root);
const sha=x=>createHash('sha256').update(x).digest('hex'),read=p=>fs.readFileSync(p,'utf8'),report=JSON.parse(read(checks+'/round8q-baseline-scan.json'));
assert.equal(report.checked,1596);assert.equal(report.counts.other,0);assert.ok(report.posterAssets.every(r=>r.pass));
const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
const {beforePart1}=await import(pathToFileURL(root+'/tests/review-part1-html-normalize.mjs'));
for(const {row} of JSON.parse(read(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'))){const keys=Object.keys(row);await env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();}
const manifestPath=base+'/before-responses.json',legacyPath=base+'/legacy-response-contracts.json',manifest=read(manifestPath),legacy=read(legacyPath),pending=[];
for(const row of report.results.filter(r=>r.group==='Part2'&&r.type!=='identical')){
 assert.ok(['a','b','c','a+c'].includes(row.type));const target=base+'/before/'+row.name;assert.equal(sha(read(target)),row.oldSha256,'Reviewed baseline remains exact '+row.name);
 const response=await worker.fetch(new Request('https://test.local'+row.url,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);assert.equal(response.status,row.status);
 const candidate=beforePart1(await response.text());assert.equal(sha(candidate),row.newSha256,'Rendered bytes still match reviewed scan '+row.name);pending.push({row,target,candidate});
}
function updatedChecksums(text,group){return text.replace(/  \{[\s\S]*?\n  \}/g,block=>{const record=JSON.parse(block),row=report.results.find(r=>group==='Part2'?r.group===group&&r.name===record.name:r.group==='legacy-'+record.ticket&&r.url===record.url);assert.ok(row,'Every checksum scanned');assert.equal(record.sha256,row.oldSha256);return row.type==='identical'?block:block.replace(row.oldSha256,row.newSha256);});}
const nextManifest=updatedChecksums(manifest,'Part2'),nextLegacy=updatedChecksums(legacy,'legacy');
// Review and render verification finish before any baseline is written.
const backup=p=>{const target=path.join(checks+'/round8q-before',path.relative(root,p));if(!fs.existsSync(target)){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(p,target);}};
backup(manifestPath);backup(legacyPath);for(const p of pending)backup(p.target);
for(const p of pending)fs.writeFileSync(p.target,p.candidate);fs.writeFileSync(manifestPath,nextManifest);fs.writeFileSync(legacyPath,nextLegacy);
report.updates=report.results.filter(r=>r.type!=='identical').map(row=>({...row,path:row.group==='Part2'?'docs/build-evidence/027A-part2/before/'+row.name:'docs/build-evidence/027A-part2/legacy-response-contracts.json'}));
report.applyVerification={allRenderedBuffersMatchScan:true,checksumsOnlyManifestDiff:true,rawResponseFiles:pending.length,legacyChecksumEntries:report.updates.length-pending.length,backup:'checks/round8q-before'};fs.writeFileSync(checks+'/round8q-baseline-scan.json',JSON.stringify(report,null,2));
console.log('PASS reviewed baseline update: '+pending.length+' Part2 HTML files and '+(report.updates.length-pending.length)+' legacy checksum entries; only classified approved deltas.');
