import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',logPath=checks+'/round8ab-samples.log',log=fs.createWriteStream(logPath),start=Date.now();
const child=spawn(process.execPath,['--import=file:///'+out+'/tools/round8ab-samples-evidence.mjs',root+'/tests/automatic-qa-packets.mjs'],{cwd:root,windowsHide:true,env:{...process.env,NODE_OPTIONS:''},stdio:['ignore','pipe','pipe']});
for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{log.write(chunk);process.stdout.write(chunk)});
const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write(kind+': '+detail+'\n')});
child.once('error',error=>log.write(error.stack+'\n'));
child.once('close',(code,signal)=>{const result={command:'node tests/automatic-qa-packets.mjs (all five; fresh evidence destination only)',...guardedResult(code,hung()),code,signal,ms:Date.now()-start,log:logPath};log.end();fs.writeFileSync(checks+'/round8ab-samples-run-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=result.status;});
