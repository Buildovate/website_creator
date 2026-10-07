import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',start=Date.now(),log=fs.createWriteStream(checks+'/round8v-acceptance.log');
const child=spawn(process.execPath,[root+'/tests/roofing-acceptance.mjs'],{cwd:root,windowsHide:true,env:{...process.env,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,NODE_OPTIONS:'--import=file:///'+out+'/tools/evidence-redirect.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',BV_CHECK_LABEL:'roofing-acceptance'},stdio:['ignore','pipe','pipe']});
for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{log.write(chunk);process.stdout.write(chunk)});
const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write('\n'+kind+': '+detail+'\n')});
child.once('error',error=>{log.write(error.stack+'\n')});
child.once('close',(code,signal)=>{const verdict=guardedResult(code,hung()),file=out+'/legacy/roofing-acceptance/028/acceptance-results.json',data=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;log.end();const result={...verdict,code,signal,ms:Date.now()-start,checks:data?.checks.length,headers:data?.headers,failures:data?.failures,log:checks+'/round8v-acceptance.log'};fs.writeFileSync(checks+'/round8v-acceptance-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=verdict.status;});
