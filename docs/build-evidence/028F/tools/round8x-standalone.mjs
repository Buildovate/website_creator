import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',label=process.argv[2];
if(!['planning-scroll-browser','header-nav-fit','roofing-polish-part1-browser','header-logo','roofing-polish-part2'].includes(label))throw Error('Unexpected standalone command');
const began=Date.now(),logPath=checks+'/round8x-'+label+'.log',log=fs.createWriteStream(logPath);
const imports=['--import=file:///'+out+'/tools/evidence-redirect.mjs','--import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs'];
if(label==='planning-scroll-browser')imports.push('--import=file:///'+out+'/tools/round8x-trace-preload.mjs');
const child=spawn(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,windowsHide:true,env:{...process.env,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,NODE_OPTIONS:imports.join(' '),BV_CHECK_LABEL:label,BV_TRACE_RUN:'after'},stdio:['ignore','pipe','pipe']});
for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{log.write(chunk);process.stdout.write(chunk)});
const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write(kind+': '+detail+'\n')});
child.once('error',error=>log.write(error.stack+'\n'));
child.once('close',(code,signal)=>{
 const result={command:'node tests/'+label+'.mjs',...guardedResult(code,hung()),code,signal,ms:Date.now()-began,log:logPath};log.end();
 if(label==='planning-scroll-browser'){
  const folder=out+'/legacy/'+label+'/025';result.layoutShifts={};
  for(const device of ['desktop','phone']){const file=folder+'/layout-shifts-'+device+'.json';if(fs.existsSync(file)&&fs.statSync(file).mtimeMs>=began){fs.copyFileSync(file,checks+'/round8x-layout-shifts-'+device+'-after.json');result.layoutShifts[device]=JSON.parse(fs.readFileSync(file,'utf8'));}}
  const photo=folder+'/preview-page-phone.png';if(fs.existsSync(photo)&&fs.statSync(photo).mtimeMs>=began)fs.copyFileSync(photo,checks+'/round8x-header-after-phone.png');
 }
 fs.writeFileSync(checks+'/round8x-'+label+'-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=result.status;
});
