import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',backup=checks+'/round8p-before';process.chdir(root);
const sha=b=>createHash('sha256').update(b).digest('hex'),norm=s=>s.replaceAll('\r\n','\n');
const head=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/027A-part2/preserve-state.json')).head;
const files=['src/expenses-history.json','src/expenses.js','src/expenses-math.js','src/client/site/ambient-video.js','src/planning-video-sources.js','src/planning-ambient.js','src/planning-scroll.js','src/promotions-scroll.js','src/promotions-ambient.js','src/hero-timelapse.js','src/scroll-config.js','public/planning-films.json','public/service-media.json','public/service-art.json'];
const records=[];
for(const file of files){
 const before=execFileSync('git',['-c','safe.directory='+root,'show',head+':'+file],{cwd:root,maxBuffer:50e6}),after=fs.readFileSync(root+'/'+file);
 const a=norm(before.toString()),b=norm(after.toString()),attributes=[...b.matchAll(/<video\b[^>]*>/g)].flatMap(m=>[...m[0].matchAll(/\sposter="[^"]*"/g)].map(p=>({offset:m.index+p.index,text:p[0]})));
 let stripped=b;for(const attr of [...attributes].reverse())stripped=stripped.slice(0,attr.offset)+stripped.slice(attr.offset+attr.text.length);
 const existing=file==='src/planning-ambient.js';
 const row={path:file,beforeSha256:sha(before),currentSha256:sha(after),unchanged:a===b,posterOnly:a!==b&&stripped===a,posterAdditions:attributes.map(r=>r.text),existingApprovedLookup:existing};
 if(existing){const stored=fs.readFileSync(out+'/source-locks/planning-ambient.js');row.existingSnapshotExact=stored.equals(after);row.existingPinExact=sha(stored)==='4eca1d6f91e1bcb2ac85864acfb715ead221cc58edfa2c30105eca59376ded4b';}
 records.push(row);
 if(a!==b){const name=path.basename(file),diff=execFileSync('git',['-c','safe.directory='+root,'diff',head,'--',file],{cwd:root,encoding:'utf8',maxBuffer:50e6});fs.writeFileSync(checks+'/round8p-source-lock-'+name+'.txt',diff);row.diff='checks/round8p-source-lock-'+name+'.txt';}
}
const bad=records.filter(r=>!r.unchanged&&!r.posterOnly||r.existingApprovedLookup&&(!r.existingSnapshotExact||!r.existingPinExact));
const report={head,records,nonPosterDiffs:bad,added:[],passed:bad.length===0};fs.writeFileSync(checks+'/round8p-source-lock-proof.json',JSON.stringify(report,null,2));
if(bad.length){console.error('STOP non-poster protected source difference',JSON.stringify(bad));process.exitCode=1;}
else{
 const save=file=>{const from=root+'/'+file,to=backup+'/'+file;if(fs.existsSync(from)&&!fs.existsSync(to)){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}};
 for(const file of [...files,'tests/roofing-polish-part2.mjs','tests/roofing-polish-part1.mjs','tests/part2-html-normalize.mjs','tests/review-part1-html-normalize.mjs','src/aws/qa-browser.js','docs/build-evidence/028F/full-checks.json','docs/build-evidence/027A-part2/changed-pages.json','docs/build-evidence/027A-part2/image-integrity.json','docs/build-evidence/027A-part2/regression-results.json','docs/build-evidence/028F/checks/round8h-header-logo-regression.json','docs/build-evidence/028F/checks/round8o-nav/results.json'])save(file);
 for(const row of records.filter(r=>!r.unchanged&&!r.existingApprovedLookup)){const snapshot='docs/build-evidence/028F/source-locks/'+path.basename(row.path);save(snapshot);fs.copyFileSync(root+'/'+row.path,root+'/'+snapshot);row.snapshot=snapshot;row.snapshotByteExact=fs.readFileSync(root+'/'+snapshot).equals(fs.readFileSync(root+'/'+row.path));row.pin=row.currentSha256;report.added.push(row);}
 fs.writeFileSync(checks+'/round8p-source-lock-proof.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:true,protectedFiles:records.length,unchanged:records.filter(r=>r.unchanged).length,existingLookup:1,added:report.added},null,2));
}
