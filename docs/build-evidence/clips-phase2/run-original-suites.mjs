import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const repo='C:/Users/joe/website_creator',out=repo+'/docs/build-evidence/clips-phase2',catalog=repo+'/public/planning-films.json';
const checks=JSON.parse(fs.readFileSync(repo+'/docs/build-evidence/027/checks.json')).filter(x=>x.kind!=='retry'),legacy=new Set(['planning-ambient','planning-scroll','promotions-ambient','promotions-scroll']),results=[];
fs.mkdirSync(out+'/checks',{recursive:true});
function run(label,kind,args,fixture='Phase 2 catalog'){const start=Date.now();const r=spawnSync(process.execPath,args,{cwd:repo,encoding:'utf8',maxBuffer:30*1024*1024});fs.writeFileSync(out+'/checks/'+label+'.log',(r.stdout||'')+'\n'+(r.stderr||''));const item={label,kind,status:r.status,signal:r.signal,ms:Date.now()-start,fixture};results.push(item);fs.writeFileSync(out+'/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(item));return r.status===0}
function args(c){if(c.label==='build')return [repo+'/build.mjs'];if(c.label==='typecheck')return [repo+'/node_modules/typescript/bin/tsc','-p',repo+'/tsconfig.auth.json'];if(c.label==='template-assets')return [repo+'/scripts/check-template-assets.mjs'];if(c.label==='callback-browser')return [out+'/callback-calendar-clock.mjs'];return [repo+'/tests/'+c.label+'.mjs']}
for(const c of checks.filter(c=>!legacy.has(c.label.replace(/-browser$/,''))))run(c.label,c.kind,args(c));
const installed=fs.readFileSync(catalog);
try{fs.copyFileSync(out+'/catalog-before.json',catalog);if(!run('legacy-fixture-build','build',[repo+'/build.mjs'],'Phase 1 Pending catalog fixture'))throw Error('Fixture build failed');for(const c of checks.filter(c=>legacy.has(c.label.replace(/-browser$/,''))))run(c.label,c.kind,args(c),'Phase 1 Pending catalog fixture; current player and renderer source');}
finally{fs.writeFileSync(catalog,installed);run('restore-phase2-build','build',[repo+'/build.mjs']);}
console.log(JSON.stringify({passed:results.filter(x=>x.status===0).length,failed:results.filter(x=>x.status!==0).map(x=>x.label)}));
