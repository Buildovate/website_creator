import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',checks=root+'/docs/build-evidence/028F/checks',backup=checks+'/round8t-before';
const hash=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
const before=JSON.parse(fs.readFileSync(checks+'/round8s-source-hashes.json','utf8'));
const foreign=before.filter(r=>!fs.existsSync(root+'/'+r.path)||hash(r.path)!==r.sha256);if(foreign.length)throw Error('Unrecognized source changes: '+JSON.stringify(foreign));
const paths=['src/aws/review-capture.js','public/planning-films.json','tests/roofing-polish-part1.mjs','docs/build-evidence/028F/tools/parallel-suite.mjs','docs/build-evidence/028F/tools/child-hang-guard.mjs','src/aws/review-capture-readiness.js','src/aws/qa-browser.js','src/aws/qa-capture.js','tests/part2-html-normalize.mjs','tests/review-part1-html-normalize.mjs','BUILD-BACKLOG.md','BUILD-STATUS.md'];
for(const p of paths){const target=backup+'/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(root+'/'+p,target);}
fs.writeFileSync(checks+'/round8t-pre-run.json',JSON.stringify({recordedAt:new Date().toISOString(),hashes:paths.map(p=>({path:p,sha256:hash(p)})),sourceHashes:before,credits:0,providerCalls:0},null,2));
console.log('Round8s source unchanged; pre-round source/capture/catalog/guard backups recorded.');
