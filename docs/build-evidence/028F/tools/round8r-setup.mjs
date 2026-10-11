import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',checks=root+'/docs/build-evidence/028F/checks',backup=checks+'/round8r-before';
const paths=['public/site-navigation.js','public/site-polish.css','src/roofing-critical-css.js','tests/roofing-polish-part1-browser.mjs','tests/header-nav-fit.mjs','docs/build-evidence/028F/tools/round8q-nav-capture.mjs','docs/build-evidence/027A-part1/screenshots','docs/build-evidence/027A-part1/browser-results.json','docs/build-evidence/027A-part2/changed-pages.json','docs/build-evidence/027A-part2/image-integrity.json','docs/build-evidence/027A-part2/regression-results.json','docs/build-evidence/028F/checks/round8h-header-logo-regression.json','docs/build-evidence/028F/full-checks.json'];
for(const p of paths){if(!fs.existsSync(root+'/'+p))continue;const target=backup+'/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(root+'/'+p,target,{recursive:true});}
const locked=JSON.parse(fs.readFileSync(checks+'/round8q-backup-manifest.json','utf8')).inputHashes.map(r=>r.path);
const protectedSources=['src/expenses-history.json','src/expenses.js','src/expenses-math.js','src/client/site/ambient-video.js','src/planning-video-sources.js','src/planning-ambient.js','src/planning-scroll.js','src/promotions-scroll.js','src/promotions-ambient.js','src/hero-timelapse.js','src/scroll-config.js','public/planning-films.json','public/service-media.json','public/service-art.json','tests/roofing-polish-part2.mjs'];
const sha=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
fs.mkdirSync(backup,{recursive:true});fs.writeFileSync(checks+'/round8r-backup.json',JSON.stringify({recordedAt:new Date().toISOString(),inputHashes:[...new Set([...locked,...protectedSources])].map(p=>({path:p,sha256:sha(p)})),sourceHashes:paths.filter(p=>fs.existsSync(root+'/'+p)&&fs.statSync(root+'/'+p).isFile()).map(p=>({path:p,sha256:sha(p)}))},null,2));
fs.writeFileSync(checks+'/round8r-initial-status.txt',execFileSync('git',['-c','safe.directory='+root,'status','--short','--branch'],{cwd:root}));
console.log('Round 8r source and regenerating-output backups saved; protected input hashes recorded.');
