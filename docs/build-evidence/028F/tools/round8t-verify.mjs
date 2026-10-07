import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',checks=root+'/docs/build-evidence/028F/checks',label=process.argv[2];
if(!['service-pages-all-trades','financing-comparison','ebook'].includes(label))throw Error('Unexpected verification command');
const started=Date.now(),logPath=checks+'/round8t-verify-'+label+'.log',log=fs.createWriteStream(logPath);
const child=spawn(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,env:{...process.env,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,NODE_OPTIONS:'--import=file:///'+root+'/docs/build-evidence/028F/tools/evidence-redirect.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',BV_CHECK_LABEL:'round8t-verify-'+label},windowsHide:true,stdio:['ignore','pipe','pipe']});
let lastLine=null;const lines=[];
for(const [type,stream]of [['stdout',child.stdout],['stderr',child.stderr]]){let tail='';stream.on('data',chunk=>{tail+=chunk;const complete=tail.split(/\r?\n/);tail=complete.pop();for(const line of complete){lastLine={timestamp:new Date().toISOString(),type,line};lines.push(lastLine);log.write('['+lastLine.timestamp+'] ['+type+'] '+line+'\n');if(/^PASS|^not ok|^Error|^REAL browser QA/.test(line))console.log(line);}});}
const guard=watchChildForHang(child,{onHung:(kind,detail)=>{const line='Guard '+kind+': '+detail;log.write('['+new Date().toISOString()+'] '+line+'\n');console.log(line);}});
console.log('Verification started '+label+' PID '+child.pid);
const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',resolve)}),outcome=guardedResult(code,guard());
const result={label,command:'node tests/'+label+'.mjs',startedAt:new Date(started).toISOString(),finishedAt:new Date().toISOString(),elapsedMs:Date.now()-started,...outcome,lastLine,passLines:lines.filter(r=>/^PASS|^# tests|^# pass|^# fail|^# duration/.test(r.line)),log:logPath};
fs.writeFileSync(checks+'/round8t-verify-'+label+'.json',JSON.stringify(result,null,2));await new Promise(resolve=>log.end(resolve));
console.log(JSON.stringify(result,null,2));process.exitCode=outcome.status;
