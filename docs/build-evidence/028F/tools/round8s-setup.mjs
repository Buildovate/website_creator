import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',tools=out+'/tools',backup=checks+'/round8s-before';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=[];for(const group of ['src','public','tests']){const walk=p=>{for(const item of fs.readdirSync(root+'/'+p,{withFileTypes:true})){const q=p+'/'+item.name;if(q==='public/assets')continue;if(item.isDirectory())walk(q);else if(/\.(?:js|mjs|cjs|ts|css|html|json)$/.test(q))source.push({path:q,sha256:hash(root+'/'+q)});}};walk(group);}
fs.writeFileSync(checks+'/round8s-source-hashes.json',JSON.stringify(source,null,2));
for(const p of ['public/planning-films.json','tests/roofing-polish-part1.mjs','docs/build-evidence/028F/full-checks.json']){const target=backup+'/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(root+'/'+p,target);}
const locks=['docs/build-evidence/028F/tools/parallel-suite.mjs','docs/build-evidence/028F/tools/child-hang-guard.mjs','BUILD-BACKLOG.md','BUILD-STATUS.md','src/aws/qa-browser.js','tests/part2-html-normalize.mjs','tests/review-part1-html-normalize.mjs'];
fs.writeFileSync(checks+'/round8s-pre-run.json',JSON.stringify({recordedAt:new Date().toISOString(),planningFilmsSha256:hash(root+'/public/planning-films.json'),locks:locks.map(p=>({path:p,sha256:hash(root+'/'+p)})),standalones:'Round8r PASS; no standalone rerun'},null,2));
fs.writeFileSync(tools+'/round8s-backup-suite.mjs',fs.readFileSync(tools+'/round8r-backup-suite.mjs','utf8').replaceAll('round8r','round8s'));
fs.writeFileSync(tools+'/round8s-samples-evidence.mjs',fs.readFileSync(tools+'/round8q-samples-evidence.mjs','utf8').replaceAll('round8q-samples','round8s-samples'));
let report=fs.readFileSync(tools+'/round8q-samples-report.mjs','utf8').replaceAll('round8q-samples', 'round8s-samples');
// Historical original findings and byte backups stay at their existing paths.
report=report.replace('round8s-samples-before-findings.json','round8q-samples-before-findings.json');
fs.writeFileSync(tools+'/round8s-samples-report.mjs',report);
console.log(JSON.stringify({productSourceFiles:source.length,planningFilmsSha256:hash(root+'/public/planning-films.json'),runnerUnchanged:true},null,2));
