import fs from 'node:fs';import {spawn} from 'node:child_process';import {pathToFileURL} from 'node:url';
const old='C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP',out=old+'/round4',root=out+'/snapshot';
const before=JSON.parse(fs.readFileSync(old+'/suite-results.json'));
const canonical=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028A/final-checks.json')).commands;
const {watchChildForHang,guardedResult}=await import(pathToFileURL(root+'/docs/build-evidence/028F/tools/child-hang-guard.mjs').href);
const env={...process.env};for(const k of Object.keys(env))if(/API_KEY|TOKEN|SECRET|DATABASE_URL|^S3_|^AWS_|^ZOOM_|^TWILIO_|^RESEND_|^STRIPE_|REVIEW_BROWSER/.test(k))delete env[k];
Object.assign(env,{TEMP:out+'/tmp',TMP:out+'/tmp',APP_ENV:'local',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',GIT_OPTIONAL_LOCKS:'0',GIT_WORK_TREE:root,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH});
const host='--import=file:///'+out+'/host.mjs',review='--import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',game='--import=file:///'+root+'/tests/game-guard-loader.mjs';
const rows=[],extra=[];
const persist=()=>fs.writeFileSync(out+'/results.json',JSON.stringify({rows,extra,startedAt,canonicalPlanned:102,standalonePlanned:191,postgresPlanned:42},null,2));
const startedAt=new Date().toISOString();
function argsFor(label){if(['build','full-build'].includes(label))return [root+'/build.mjs'];if(label==='isolated-worker-build')return [game,root+'/tests/game-guard-build.mjs'];if(label==='typecheck')return [root+'/node_modules/typescript/bin/tsc','-p',root+'/tsconfig.auth.json'];if(['template-assets','template-asset-integrity'].includes(label))return [root+'/scripts/check-template-assets.mjs'];if(label==='callback-browser')return [root+'/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs'];return [...(/^game-(desktop|phone|experience-browser|autofill-browser|copy-browser|forms-browser)/.test(label)?[game]:[]),root+'/tests/'+label+'.mjs'];}
function ports(label){return [...new Set(argsFor(label).filter(p=>!p.startsWith('--')&&fs.existsSync(p)).flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/(?:127\.0\.0\.1:|PORT:\s*['"]|port\s*=\s*)(\d{4,5})/g)].map(m=>m[1])))];}
async function run(label,args=argsFor(label),group='standalone',helper=false){
 const file=out+'/logs/'+label+'.log',log=fs.createWriteStream(file),start=Date.now();console.log('START '+label);
 const isBuild=args.some(x=>x.endsWith('/build.mjs')||x.endsWith('/game-guard-build.mjs'));
 const options={...env,NODE_OPTIONS:[host,...(!isBuild?[review]:[])].join(' '),BV_CHECK_LABEL:'ROUND4-'+label};
 return new Promise(resolve=>{
  const child=spawn(process.execPath,args,{cwd:root,env:options,windowsHide:true,stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
  const hang=watchChildForHang(child,{onHung:(kind,detail)=>log.write('\n'+(kind==='pass-with-warning'?'PASS-WITH-WARNING: ':'FAILED/hung: ')+detail+'\n')});
  let limit=false;const timer=setTimeout(()=>{limit=true;log.write('\nPer-suite 90-minute diagnostic limit\n');spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true})},90*60*1000);
  child.on('close',(status,signal)=>{clearTimeout(timer);log.end();const verdict=limit?{status:1,outcome:'TIME LIMIT'}:guardedResult(status,hang());const row={label,group,status:verdict.status,code:verdict.status,outcome:verdict.outcome,reason:verdict.reason,signal,ms:Date.now()-start,log:file};(helper?extra:rows).push(row);persist();console.log('END '+label+' '+row.code);resolve(row)});
 });
}
// Mandatory prerequisites and both Worker builds. Continue even if one fails.
await run('full-build');await run('isolated-worker-build');
const special=new Set(['promotions-ambient','promotions-scroll','promotions-ambient-browser','promotions-scroll-browser']);
const labels=before.rows.map(x=>x.label).filter(x=>!['full-build','isolated-worker-build','build'].includes(x)&&!special.has(x));
labels.push('insertion-order','readiness-batch-a','readiness-batch-b','readiness-paid-publish','readiness-chat-sql','readiness-review-evidence');const pending=[...new Set(labels)],active=new Map();
// Keep independent ports separate. Concurrently run three isolated processes.
while(pending.length||active.size){while(active.size<3){const busy=new Set([...active.values()].flatMap(x=>x.ports)),index=pending.findIndex(label=>ports(label).every(p=>!busy.has(p)));if(index<0)break;const [label]=pending.splice(index,1),item={ports:ports(label),promise:null};item.promise=run(label,argsFor(label),canonical.some(x=>x.label===label)?'Suite-102':'standalone').then(()=>active.delete(label));active.set(label,item);}if(active.size)await Promise.race([...active.values()].map(x=>x.promise));}
const catalogPath=root+'/public/planning-films.json',saved=fs.readFileSync(catalogPath);
try{const catalog=JSON.parse(saved),prior=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/catalog-before.json'));for(const [key,value]of Object.entries(prior.slots))catalog.slots[key]=value;fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,2));await run('pending-fixture-build',[root+'/build.mjs'],'fixture',true);for(const label of special)await run(label,argsFor(label),'Suite-102');}finally{fs.writeFileSync(catalogPath,saved)}
await run('build',argsFor('build'),'Suite-102');

console.log('NATIVE ROUND 2 COMPLETE');
