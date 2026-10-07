import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
const prior=json(checks+'/round8u-pre-run.json'),system=json(checks+'/round8v-preflight-system.json');
const sourceHashes=prior.sourceHashes.map(r=>({path:r.path,sha256:hash(r.path)})),foreign=sourceHashes.filter((r,i)=>r.sha256!==prior.sourceHashes[i].sha256);
const leftoverNodes=system.nodeChromeInventory.filter(p=>p.name==='node.exe'&&/website_creator[\\/](?:tests[\\/]|docs[\\/].*(?:parallel-suite|saved-replay-final-validation|round8[u-v]-.*(?:run|monitor)))/i.test(p.command||''));
const leftoverBrowsers=system.nodeChromeInventory.filter(p=>p.name==='chrome.exe'&&/--headless|playwright_chromiumdev_profile/.test(p.command||''));
const result={round:'8v',recordedAt:new Date().toISOString(),freeGB:system.freeGB,memoryPass:system.memoryPass,sourceHashes,foreignSourceChanges:foreign,planningFilmsSha256:hash('public/planning-films.json'),locks:prior.locks.map(r=>({path:r.path,sha256:hash(r.path)})),processCheck:{leftoverNodes,leftoverBrowsers,passed:!leftoverNodes.length&&!leftoverBrowsers.length},credits:0,providerCalls:0};
fs.writeFileSync(checks+'/round8v-pre-run.json',JSON.stringify(result,null,2));
if(!result.memoryPass||foreign.length||!result.processCheck.passed)throw Error('Pre-flight failed; stop. See round8v-pre-run.json');
for(const p of ['tests/roofing-acceptance.mjs',...result.locks.map(r=>r.path)]){const dest=checks+'/round8v-before/'+p;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.copyFileSync(root+'/'+p,dest);}
for(const p of ['tools/round8u-backup-suite.mjs','checks/round8u-run-suite.ps1','tools/round8u-report.mjs','tools/round8u-memory-monitor.mjs','tools/round8u-samples-evidence.mjs','tools/round8u-samples-report.mjs','tools/round8u-preserve-samples.mjs']){const target=out+'/'+p.replaceAll('round8u','round8v');if(fs.existsSync(target))throw Error('Helper already exists: '+target);fs.writeFileSync(target,fs.readFileSync(out+'/'+p,'utf8').replaceAll('round8u','round8v').replaceAll("round:'8u'","round:'8v'").replaceAll('round 8u','round 8v'));}
console.log(JSON.stringify({freeGB:result.freeGB,sourceFiles:sourceHashes.length,foreignChanges:foreign.length,processCheck:result.processCheck,planningFilmsSha256:result.planningFilmsSha256},null,2));
