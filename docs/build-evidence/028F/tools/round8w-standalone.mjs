import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',mode=process.argv[2],diagnose=mode==='diagnose',label=diagnose?'planning-scroll-browser':mode;
if(!['planning-scroll-browser','header-nav-fit','roofing-polish-part1-browser','header-logo','roofing-polish-part2'].includes(label))throw Error('Unexpected standalone command');
const start=Date.now(),name=diagnose?'planning-scroll-diagnose':label,log=fs.createWriteStream(checks+'/round8w-'+name+'.log');
const child=spawn(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,windowsHide:true,env:{...process.env,PATH:root+'/docs/build-evidence/028P/tools/bin;'+process.env.PATH,NODE_OPTIONS:'--import=file:///'+out+'/tools/evidence-redirect.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',BV_CHECK_LABEL:label},stdio:['ignore','pipe','pipe']});
for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{log.write(chunk);process.stdout.write(chunk)});
const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write('\n'+kind+': '+detail+'\n')});
child.once('error',error=>log.write(error.stack+'\n'));
child.once('close',(code,signal)=>{
 const verdict=guardedResult(code,hung()),result={command:'node tests/'+label+'.mjs',...verdict,code,signal,ms:Date.now()-start,log:checks+'/round8w-'+name+'.log'};log.end();
 if(label==='planning-scroll-browser'){
  const folder=out+'/legacy/'+label+'/025';result.layoutShifts={};
  for(const device of ['desktop','phone']){const file=folder+'/layout-shifts-'+device+'.json';if(fs.existsSync(file)&&fs.statSync(file).mtimeMs>=start){const target=checks+'/round8w-layout-shifts-'+device+(diagnose?'':'-after')+'.json';fs.copyFileSync(file,target);result.layoutShifts[device]=JSON.parse(fs.readFileSync(file,'utf8'));}}
  const photo=folder+'/preview-page-phone.png';if(fs.existsSync(photo)&&fs.statSync(photo).mtimeMs>=start)fs.copyFileSync(photo,checks+'/round8w-header-'+(diagnose?'before':'after')+'-phone.png');
  if(diagnose){
   const details=result.layoutShifts.phone?.details||[];result.storySource=details.some(e=>e.sources.some(s=>s.inStory));
   const rows=details.flatMap((e,i)=>e.sources.map(s=>`| ${i+1} | ${e.value} | ${String(s.html).replaceAll('|','\\|')} | ${JSON.stringify(s.previous)} | ${JSON.stringify(s.current)} | ${s.inStory} |`));
   fs.writeFileSync(checks+'/round8w-notes.md','# #028F round 8w — planning-scroll CLS\n\nDiagnosis only: evidence write moved before the unchanged 0.01 assertion. No product edit yet.\n\nPhone CLS: '+result.layoutShifts.phone?.cls+'. Story source present: '+result.storySource+'.\n\n| Entry | Value | Element outerHTML | Previous rect | Current rect | inStory |\n|---|---|---|---|---|---|\n'+rows.join('\n')+'\n');
   fs.writeFileSync(checks+'/round8w-results.json',JSON.stringify({round:'8w',state:'Diagnosis completed; assess sources before product change',diagnosis:result,commit:null,original70Open:true,qaGateClear:false,credits:0,providerCalls:0},null,2));
  }
 }
 fs.writeFileSync(checks+'/round8w-'+name+'-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=verdict.status;
});
