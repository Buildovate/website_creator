import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
const system=json(checks+'/round8u-preflight-system.json'),previous=json(checks+'/round8t-pre-run.json'),last=json(checks+'/round8t-results.json');
const expected=new Map(previous.sourceHashes.map(r=>[r.path,r.sha256]));expected.set('src/aws/review-capture.js',last.harnessChange.after);
const sourceHashes=[...expected].map(([path])=>({path,sha256:hash(path)})),foreign=sourceHashes.filter(r=>r.sha256!==expected.get(r.path));
const inventory=system.nodeChromeInventory,byPid=new Map(inventory.map(p=>[p.pid,p]));
const testNode=p=>p.name==='node.exe'&&/website_creator[\\/](?:tests[\\/]|docs[\\/].*(?:parallel-suite|saved-replay-final-validation|round8[tus]-.*(?:diagnose|verify|cpu-monitor)))/i.test(p.command||'');
const leftoverNodes=inventory.filter(testNode),leftoverBrowsers=[],unknownHeadless=[];
for(const p of inventory.filter(p=>p.name==='chrome.exe')){let ancestor=p;const seen=new Set();while(byPid.has(ancestor.parent)&&!seen.has(ancestor.parent)){seen.add(ancestor.pid);ancestor=byPid.get(ancestor.parent);}if(testNode(ancestor))leftoverBrowsers.push(p);else if(/--headless|playwright_chromiumdev_profile/.test(ancestor.command||''))unknownHeadless.push(p);}
const result={round:'8u',recordedAt:new Date().toISOString(),freeGB:system.freeGB,minimumFreeGB:14,memoryPass:system.memoryPass,sourceHashes,foreignSourceChanges:foreign,planningFilmsSha256:hash('public/planning-films.json'),locks:previous.hashes.map(r=>({path:r.path,sha256:hash(r.path)})),processCheck:{leftoverNodes,leftoverBrowsers,unknownHeadless,passed:leftoverNodes.length===0&&leftoverBrowsers.length===0&&unknownHeadless.length===0,untouched:'Joe Chrome, Vite, preview proxy and Codex runtimes; no process killed.'},credits:0,providerCalls:0};
fs.writeFileSync(checks+'/round8u-pre-run.json',JSON.stringify(result,null,2));
if(!system.memoryPass||foreign.length||!result.processCheck.passed)throw Error('Pre-flight failed; see round8u-pre-run.json');
for(const path of ['tools/round8t-backup-suite.mjs','checks/round8t-run-suite.ps1','tools/round8t-samples-evidence.mjs','tools/round8t-samples-report.mjs','tools/round8t-preserve-samples.mjs']){const target=out+'/'+path.replaceAll('round8t','round8u');if(fs.existsSync(target))throw Error('Round8u helper already exists: '+target);fs.writeFileSync(target,fs.readFileSync(out+'/'+path,'utf8').replaceAll('round8t','round8u'));}
console.log(JSON.stringify({freeGB:result.freeGB,sourceFiles:sourceHashes.length,foreignChanges:foreign.length,leftoverTests:0,planningFilmsSha256:result.planningFilmsSha256,runnerSha256:hash('docs/build-evidence/028F/tools/parallel-suite.mjs'),guardSha256:hash('docs/build-evidence/028F/tools/child-hang-guard.mjs')},null,2));
