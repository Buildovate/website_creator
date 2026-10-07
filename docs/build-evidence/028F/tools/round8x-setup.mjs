import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
const prior=json(checks+'/round8w-pre-run.json'),last=json(checks+'/round8w-results.json'),system=json(checks+'/round8x-preflight-system.json');
const expected=new Map(prior.sourceHashes.map(r=>[r.path,r.sha256]));for(const r of last.sourceChanges)expected.set(r.path,r.after);
const sourceHashes=[...expected].map(([path])=>({path,sha256:hash(path)})),foreign=sourceHashes.filter(r=>r.sha256!==expected.get(r.path));
const leftoverNodes=system.nodeChromeInventory.filter(p=>p.name==='node.exe'&&/website_creator[\\/](?:tests[\\/]|docs[\\/].*(?:parallel-suite|saved-replay-final-validation|round8[w-x]-.*(?:run|monitor|standalone)))/i.test(p.command||''));
const leftoverBrowsers=system.nodeChromeInventory.filter(p=>p.name==='chrome.exe'&&/--headless|playwright_chromiumdev_profile/.test(p.command||''));
const result={round:'8x',recordedAt:new Date().toISOString(),freeGB:system.freeGB,memoryPass:system.memoryPass,sourceHashes,foreignSourceChanges:foreign,planningFilmsSha256:hash('public/planning-films.json'),locks:prior.locks.map(r=>({path:r.path,sha256:hash(r.path)})),processCheck:{leftoverNodes,leftoverBrowsers,passed:!leftoverNodes.length&&!leftoverBrowsers.length},credits:0,providerCalls:0};
fs.writeFileSync(checks+'/round8x-pre-run.json',JSON.stringify(result,null,2));
if(!result.memoryPass||foreign.length||!result.processCheck.passed)throw Error('Pre-flight failed; stop. See round8x-pre-run.json');
for(const p of ['tests/planning-scroll-browser.mjs','public/site-polish.css','public/site-navigation.js','src/roofing-critical-css.js',...result.locks.map(r=>r.path)]){const dest=checks+'/round8x-before/'+p;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.copyFileSync(root+'/'+p,dest);}
for(const p of ['tools/round8w-backup-suite.mjs','checks/round8w-run-suite.ps1','tools/round8w-report.mjs','tools/round8w-memory-monitor.mjs','tools/round8w-samples-evidence.mjs','tools/round8w-samples-report.mjs','tools/round8w-preserve-samples.mjs']){const target=out+'/'+p.replaceAll('round8w','round8x');if(fs.existsSync(target))throw Error('Helper already exists: '+target);fs.writeFileSync(target,fs.readFileSync(out+'/'+p,'utf8').replaceAll('round8w','round8x').replaceAll("round:'8w'","round:'8x'").replaceAll('round 8w','round 8x'));}
console.log(JSON.stringify({freeGB:result.freeGB,sourceFiles:sourceHashes.length,foreignChanges:foreign.length,processCheck:result.processCheck,planningFilmsSha256:result.planningFilmsSha256},null,2));
