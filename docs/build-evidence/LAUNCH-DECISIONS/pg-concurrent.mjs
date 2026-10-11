import fs from 'node:fs';import {spawn} from 'node:child_process';import {pathToFileURL} from 'node:url';
const old='C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP',out='C:/Users/joe/website_creator/docs/build-evidence/LAUNCH-DECISIONS',root=out+'/snapshot';
const before=JSON.parse(fs.readFileSync(old+'/suite-results.json')),native={rows:[]};
const canonical=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028A/final-checks.json')).commands;
const {watchChildForHang,guardedResult}=await import(pathToFileURL(root+'/docs/build-evidence/028F/tools/child-hang-guard.mjs').href);
const env={...process.env};for(const k of Object.keys(env))if(/API_KEY|TOKEN|SECRET|DATABASE_URL|^S3_|^AWS_|^ZOOM_|^TWILIO_|^RESEND_|^STRIPE_|REVIEW_BROWSER/.test(k))delete env[k];
Object.assign(env,{TEMP:out+'/tmp',TMP:out+'/tmp',APP_ENV:'local',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',GIT_OPTIONAL_LOCKS:'0',GIT_WORK_TREE:root,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,BV_PG_PARALLEL:'1',NODE_OPTIONS:'--import=file:///'+out+'/host.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs'});
const persist=()=>fs.writeFileSync(out+'/postgres-results.json',JSON.stringify(native,null,2));
const pending=before.pg.map(item=>({label:item.label,name:item.label.replace(/^pg-(?:corrected-|workflow-|final-|budget-recovery-)?/,'')}));pending.push(...['readiness-batch-a','readiness-batch-b','readiness-paid-publish','readiness-chat-sql','readiness-review-evidence','launch-decisions'].map(name=>({label:'pg-'+name,name})));const active=new Map();
function ports(item){const file=root+'/tests/'+item.name+'.mjs';return [...new Set([...fs.readFileSync(file,'utf8').matchAll(/(?:127\.0\.0\.1:|PORT:\s*['"]|port\s*=\s*)(\d{4,5})/g)].map(m=>m[1]))];}
async function run(item){
 const label=item.label,args=['--import=file:///'+out+'/pg-fixture-loader.mjs',root+'/tests/'+item.name+'.mjs'],file=out+'/logs/'+label+'.log',log=fs.createWriteStream(file),start=Date.now();console.log('START '+label);
 return new Promise(resolve=>{
  const child=spawn(process.execPath,args,{cwd:root,env:{...env,BV_CHECK_LABEL:'ROUND5-'+label},windowsHide:true,stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
  const hang=watchChildForHang(child,{onHung:(kind,detail)=>log.write('\n'+(kind==='pass-with-warning'?'PASS-WITH-WARNING: ':'FAILED/hung: ')+detail+'\n')});
  let limit=false;const timer=setTimeout(()=>{limit=true;log.write('\nPer-suite 90-minute diagnostic limit\n');spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true})},90*60*1000);
  child.on('close',(status,signal)=>{clearTimeout(timer);log.end();const verdict=limit?{status:1,outcome:'TIME LIMIT'}:guardedResult(status,hang());const row={label,group:'PostgreSQL replay',status:verdict.status,code:verdict.status,outcome:verdict.outcome,reason:verdict.reason,signal,ms:Date.now()-start,log:file,scheduler:'three independent original invocations'};native.rows.push(row);persist();console.log('END '+label+' '+row.code);resolve(row)});
 });
}
while(pending.length||active.size){
 while(active.size<3){const busy=new Set([...active.values()].flatMap(x=>x.ports)),index=pending.findIndex(item=>ports(item).every(p=>!busy.has(p)));if(index<0)break;const [item]=pending.splice(index,1),entry={ports:ports(item),promise:null};entry.promise=run(item).then(()=>active.delete(item.label));active.set(item.label,entry);}
 if(active.size)await Promise.race([...active.values()].map(x=>x.promise));
}
fs.writeFileSync(out+'/postgres-complete.json',JSON.stringify({finishedAt:new Date().toISOString(),rows:native.rows.length,sourceFrozen:true,note:'All fixture ports are request origins only; no fixed-port listener. Separate result writer; no builds during this stage.'},null,2));console.log('POSTGRES ROUND 5 COMPLETE');
