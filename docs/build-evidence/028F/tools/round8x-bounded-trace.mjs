import fs from 'node:fs';
import os from 'node:os';
import {spawn,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',read=p=>JSON.parse(fs.readFileSync(checks+'/'+p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex');
const runner=fs.readFileSync(out+'/tools/parallel-suite.mjs','utf8'),capacityMatch=runner.match(/active\.size<\(fs\.existsSync\(out\+'\/checks\/final-captures-active\.json'\)\?(\d+):(\d+)\)/);
if(!capacityMatch)throw Error('Cannot derive unchanged suite worker capacity; stop');
const capacity=Number(capacityMatch[fs.existsSync(checks+'/final-captures-active.json')?1:2]),before=hash('public/planning-films.json'),active=new Set(),backgrounds=[],runs=[],memory=[],started=Date.now(),deadline=started+20*60*1000;
let stopReason=null,reproduced=0,stopping=false,stopResolve;
const stopped=new Promise(resolve=>stopResolve=resolve);
const stop=reason=>{if(stopReason)return;stopReason=reason;stopResolve(reason)};
const kill=entry=>{if(entry.child.exitCode!==null)return;entry.killed=true;spawnSync('taskkill',['/PID',String(entry.child.pid),'/T','/F'],{windowsHide:true});};
const save=()=>fs.writeFileSync(checks+'/round8x-trace-summary.json',JSON.stringify({startedAt:new Date(started).toISOString(),hardCapMs:20*60*1000,workerCapacity:capacity,runnerSha256:hash('docs/build-evidence/028F/tools/parallel-suite.mjs'),elapsedMs:Date.now()-started,stopReason,reproduced,runs,backgrounds,memory,planningFilms:{before,after:hash('public/planning-films.json'),matches:before===hash('public/planning-films.json')},credits:0,providerCalls:0},null,2));
function start(label,name,run){
 const free=os.freemem()/1073741824;if(free<8)throw Error('Memory blocker: '+free.toFixed(2)+' GB free; stop without workaround');
 const logPath=checks+'/round8x-'+name+'.log',log=fs.createWriteStream(logPath),began=Date.now();
 const imports=['--import=file:///'+out+'/tools/evidence-redirect.mjs','--import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs'];if(run)imports.push('--import=file:///'+out+'/tools/round8x-trace-preload.mjs');
 const child=spawn(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,windowsHide:true,env:{...process.env,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,NODE_OPTIONS:imports.join(' '),BV_CHECK_LABEL:label,...(run?{BV_TRACE_RUN:String(run)}:{})},stdio:['ignore','pipe','pipe']});
 child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});const entry={child,killed:false,logPath};active.add(entry);
 const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write(kind+': '+detail+'\n')});
 entry.promise=new Promise(resolve=>{child.on('error',e=>log.write(e.stack+'\n'));child.once('close',(code,signal)=>{active.delete(entry);log.end();resolve({label,...guardedResult(code,hung()),code,signal,killed:entry.killed,ms:Date.now()-began,log:logPath})})});
 console.log('START '+name+' PID '+child.pid);return entry;
}
async function background(label){let n=0;while(!stopping&&!stopReason){const entry=start(label,label+'-load'+(++n)),row=await entry.promise;backgrounds.push(row);console.log('LOAD '+label+' '+row.outcome);save();if(!entry.killed&&row.status!==0)stop('Background command failed: '+label+'; '+row.log);}}
const launchFree=os.freemem()/1073741824;
if(launchFree<14)throw Error('Pre-flight memory below 14 GB: '+launchFree.toFixed(2));
fs.writeFileSync(checks+'/round8x-launch-memory.json',JSON.stringify({freeGB:launchFree,recordedAt:new Date().toISOString(),requiredGB:14},null,2));
if(capacity<2||capacity>3)throw Error('Unexpected suite worker capacity');
const timer=setTimeout(()=>stop('20-minute hard cap reached'),Math.max(1,deadline-Date.now()));
const monitor=setInterval(()=>{const freeGB=os.freemem()/1073741824;memory.push({at:new Date().toISOString(),freeGB,activeWorkers:active.size});if(freeGB<8)stop('Memory blocker: '+freeGB.toFixed(2)+' GB free; stop without workaround');save()},5000);
let jobs=[];
try{
 jobs=['website-pages','hero-editor-browser'].slice(0,capacity-1).map(background);
 for(let run=1;run<=10&&!stopReason;run++){
  const entry=start('planning-scroll-browser','planning-scroll-run'+run,run),outcome=await Promise.race([entry.promise,stopped]);
  if(typeof outcome==='string'){kill(entry);const partial=await entry.promise,liveFile=checks+'/round8x-trace-run'+run+'-live.json',live=fs.existsSync(liveFile)?JSON.parse(fs.readFileSync(liveFile,'utf8')):{captures:[]},phone=live.captures.find(c=>c.width===390);fs.writeFileSync(checks+'/round8x-trace-run'+run+'.json',JSON.stringify({run,...partial,incomplete:true,stopReason,captures:live.captures,phoneCLS:phone?.cls??null},null,2));runs.push({run,outcome:'INCOMPLETE',phoneCLS:phone?.cls??null,reproduced:phone?.cls>.01,trace:'checks/round8x-trace-run'+run+'.json',log:partial.log});break;}
  const liveFile=checks+'/round8x-trace-run'+run+'-live.json',live=fs.existsSync(liveFile)?JSON.parse(fs.readFileSync(liveFile,'utf8')):{captures:[]},phone=live.captures.find(c=>c.width===390),folder=out+'/legacy/planning-scroll-browser/025';
  const trace={run,...outcome,captures:live.captures,phoneCLS:phone?.cls??null,reproduced:phone?.cls>.01,storySource:live.captures.some(c=>c.detectorDetails?.some(e=>e.sources.some(s=>s.inStory))),startedUnderWorkers:capacity,memoryFreeGBAfter:os.freemem()/1073741824};
  fs.writeFileSync(checks+'/round8x-trace-run'+run+'.json',JSON.stringify(trace,null,2));
  for(const device of ['desktop','phone']){const p=folder+'/layout-shifts-'+device+'.json';if(fs.existsSync(p))fs.copyFileSync(p,checks+'/round8x-run'+run+'-layout-shifts-'+device+'.json');}
  const photo=folder+'/preview-page-phone.png';if(fs.existsSync(photo))fs.copyFileSync(photo,checks+'/round8x-run'+run+'-phone.png');
  runs.push({run,outcome:outcome.outcome,phoneCLS:trace.phoneCLS,reproduced:trace.reproduced,storySource:trace.storySource,trace:'checks/round8x-trace-run'+run+'.json',log:outcome.log});
  if(trace.reproduced)reproduced++;
  console.log('TRACE '+run+' phone CLS '+trace.phoneCLS+'; reproduced '+reproduced+'/'+runs.length);save();
  if(trace.storySource){stop('Story layout-shift source detected; stop without story changes');break;}
  if(!phone){stop('Missing phone trace; '+outcome.log);break;}
  const text=fs.readFileSync(outcome.log,'utf8');if(outcome.status!==0&&!text.includes('page CLS within 0.01 phone')){stop('Unexpected diagnostic failure: '+outcome.log);break;}
  if(reproduced>=2){stop('Two phone CLS reproductions captured');break;}
 }
 if(!stopReason)stop(reproduced===0?'0 of 10 reproduced; stop without product fix':'10-run bound reached with one reproduction; assess evidence');
}catch(e){stop(e.stack||e.message)}finally{
 stopping=true;clearTimeout(timer);clearInterval(monitor);for(const entry of active)kill(entry);await Promise.all([...active].map(e=>e.promise));await Promise.allSettled(jobs);save();
}
console.log(JSON.stringify({stopReason,reproduced,completedRuns:runs.length,elapsedMs:Date.now()-started,capacity,planningFilmsMatch:before===hash('public/planning-films.json')},null,2));
if(before!==hash('public/planning-films.json'))process.exitCode=1;
