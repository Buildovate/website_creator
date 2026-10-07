import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',base=root+'/docs/build-evidence/027A-part2',checks=root+'/docs/build-evidence/028F/checks',sha=x=>createHash('sha256').update(x).digest('hex');
process.chdir(root);
const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
const {normalizePart2HTML}=await import(pathToFileURL(root+'/tests/part2-html-normalize.mjs'));
const {beforePart1}=await import(pathToFileURL(root+'/tests/review-part1-html-normalize.mjs'));
const entries=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
for(const {row} of entries){const keys=Object.keys(row);await env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();}
const manifest=fs.readFileSync(base+'/before-responses.json','utf8'),records=JSON.parse(manifest);
const originalHashes=new Map(records.map(r=>[r.name,sha(fs.readFileSync(base+'/before/'+r.name))]));
const targets=new Map([
 ['roofing-16.html',['/assets/planning/027A-part1/financing-poster-1280.webp']],
 ['roofing-17.html',['/assets/planning/roofing-promotions-ambient-1280.webp','/assets/planning/roofing-promotions-scroll-1280.webp']]
]);
const changes=[];
for(const [name,posters] of targets){
 const record=records.find(r=>r.name===name),expected=fs.readFileSync(base+'/before/'+name,'utf8');assert.equal(record.sha256,sha(expected));
 const response=await worker.fetch(new Request('https://test.local'+record.url,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);assert.equal(response.status,200);
 const actual=await response.text(),a=normalizePart2HTML(expected,true),b=normalizePart2HTML(beforePart1(actual),true);
 const oldTags=[...a.matchAll(/<video\b[^>]*>/g)].map(m=>m[0]),newTags=[...b.matchAll(/<video\b[^>]*>/g)].map(m=>m[0]);assert.equal(oldTags.length,newTags.length);
 let normalizedCandidate=a,candidate=expected;const additions=[];
 for(let i=0;i<oldTags.length;i++){
  if(oldTags[i]===newTags[i])continue;
  const match=newTags[i].match(/ poster="([^"]+)"/);assert.ok(match&&posters.includes(match[1]),'Only approved video posters may differ');
  assert.equal(newTags[i].replace(match[0],''),oldTags[i],'No other video attribute may change');
  assert.equal(candidate.split(oldTags[i]).length,2,'Precisely one raw baseline video is targeted');
  normalizedCandidate=normalizedCandidate.replace(oldTags[i],newTags[i]);candidate=candidate.replace(oldTags[i],newTags[i]);additions.push({path:match[1],before:oldTags[i],after:newTags[i]});
 }
 assert.equal(normalizedCandidate,b,'Entire normalized difference must be video poster additions');
 assert.equal(normalizePart2HTML(candidate,true),b);assert.equal(additions.length,posters.length);
 changes.push({path:'docs/build-evidence/027A-part2/before/'+name,name,url:record.url,oldSha256:sha(expected),newSha256:sha(candidate),bytesAdded:Buffer.byteLength(candidate)-Buffer.byteLength(expected),additions,candidate});
}
// The response baseline is stored as named raw HTML plus a checksum manifest.
// Preserve all prior raw bytes except the approved attributes; update only two checksums.
let updatedManifest=manifest;
for(const change of changes){assert.equal(updatedManifest.split(change.oldSha256).length,2);updatedManifest=updatedManifest.replace(change.oldSha256,change.newSha256);}
const backup=checks+'/round8k-before/docs/build-evidence/027A-part2';fs.mkdirSync(backup+'/before',{recursive:true});
fs.writeFileSync(backup+'/before-responses.json',manifest);
for(const change of changes)fs.copyFileSync(base+'/before/'+change.name,backup+'/before/'+change.name);
for(const change of changes)fs.writeFileSync(base+'/before/'+change.name,change.candidate);
fs.writeFileSync(base+'/before-responses.json',updatedManifest);
const diffs=checks+'/round8k-baseline-diffs';fs.mkdirSync(diffs,{recursive:true});
for(const change of changes){const result=spawnSync('git',['-c','safe.directory='+root,'diff','--no-index','--no-ext-diff','--',backup+'/before/'+change.name,base+'/before/'+change.name],{encoding:'utf8',maxBuffer:50e6});assert.equal(result.status,1);fs.writeFileSync(diffs+'/'+change.name+'.diff.txt',result.stdout);}
const untouched=records.filter(r=>!targets.has(r.name));for(const record of untouched)assert.equal(sha(fs.readFileSync(base+'/before/'+record.name)),originalHashes.get(record.name),'Other baseline unchanged: '+record.name);
const changesEvidence=changes.map(({candidate,...record})=>record);fs.writeFileSync(checks+'/round8k-baseline-updates.json',JSON.stringify({changes:changesEvidence,manifest:'docs/build-evidence/027A-part2/before-responses.json',untouchedBaselineFiles:untouched.length},null,2));
console.log('Updated only two raw response baselines and their two checksum entries; '+untouched.length+' other baseline files unchanged');
const rescans=[];
for(const record of records.filter(r=>r.url.includes('/s/ambient-baseline-'))){
 const response=await worker.fetch(new Request('https://test.local'+record.url,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env),actual=await response.text(),expected=fs.readFileSync(base+'/before/'+record.name,'utf8');
 const identical=response.status===200&&normalizePart2HTML(expected,record.kit==='roofing')===normalizePart2HTML(beforePart1(actual),record.kit==='roofing');
 rescans.push({url:record.url,name:record.name,status:response.status,identical});
 if(!identical){fs.writeFileSync(checks+'/round8k-baseline-rescan.json',JSON.stringify({checked:rescans.length,identical:rescans.filter(r=>r.identical).length,failed:record.url,results:rescans},null,2));throw Error('Unapproved difference on re-scan: '+record.url);}
}
fs.writeFileSync(checks+'/round8k-baseline-rescan.json',JSON.stringify({checked:rescans.length,identical:rescans.length,differences:0,results:rescans},null,2));
assert.equal(rescans.length,323);console.log('PASS ambient baseline re-scan: 323/323 identical; no other baseline changes');
