import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028A',workspace=out+'/tools';
fs.mkdirSync(out+'/checks',{recursive:true});
const old=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028/final-checks.json'));
const special=new Set(['promotions-ambient','promotions-scroll','promotions-ambient-browser','promotions-scroll-browser']);
const checks=[...old.filter(c=>!special.has(c.label)).map(c=>({label:c.label,kind:c.kind})),{label:'design-styles',kind:'regression'}];
const results=[];
for(const c of checks){
 const args=c.label==='build'?[root+'/build.mjs']:c.label==='typecheck'?[root+'/node_modules/typescript/bin/tsc','-p',root+'/tsconfig.auth.json']:c.label==='template-assets'?[root+'/scripts/check-template-assets.mjs']:c.label==='callback-browser'?[root+'/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs']:[root+'/tests/'+c.label+'.mjs'];
 const legacyPath=root+'/tests/roofing-polish-part1.mjs',legacy=c.label==='roofing-polish-part1'?fs.readFileSync(legacyPath):null;
 if(legacy)fs.writeFileSync(legacyPath,legacy.toString().replace(/const bin='[^']+'/ ,"const bin='"+workspace+"/bin/'"));
 let r; const start=Date.now();try{r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:30e6,env:{...process.env,PATH:workspace+'/bin;'+process.env.PATH}});}finally{if(legacy)fs.writeFileSync(legacyPath,legacy)}
 fs.writeFileSync(out+'/checks/'+c.label+'.log',(r.stdout||'')+'\n'+(r.stderr||''));
 results.push({...c,status:r.status,ms:Date.now()-start});
 fs.writeFileSync(out+'/full-checks.json',JSON.stringify(results,null,2));
 console.log(c.label+': '+r.status+' ('+Math.round((Date.now()-start)/1000)+'s)');
}
// The legacy Promotions fixture changes the catalog temporarily; wait until the style audit closes.
while(!fs.existsSync(out+'/aa-final-run.json')||JSON.parse(fs.readFileSync(out+'/aa-final-run.json')).length<2){console.log('Waiting for four-style audit before legacy Pending fixture');Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,10000)}
const fixture=spawnSync(process.execPath,[workspace+'/028A-promotions-fixture.mjs'],{cwd:root,encoding:'utf8',maxBuffer:30e6});
fs.writeFileSync(out+'/checks/promotions-fixture-runner.log',(fixture.stdout||'')+'\n'+(fixture.stderr||''));
if(fs.existsSync(out+'/pending-fixture-checks.json'))results.push(...JSON.parse(fs.readFileSync(out+'/pending-fixture-checks.json')).filter(c=>!['pending-fixture-build','restored-build'].includes(c.label)));
fs.writeFileSync(out+'/full-checks.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({passed:results.filter(c=>c.status===0).length,failed:results.filter(c=>c.status!==0).map(c=>c.label),fixtureStatus:fixture.status}));
if(results.some(c=>c.status!==0)||fixture.status!==0)process.exitCode=1;
