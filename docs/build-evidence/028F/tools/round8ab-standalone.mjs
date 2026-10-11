import fs from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {watchChildForHang,guardedResult} from './child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',checks=out+'/checks',catalogPath=root+'/public/planning-films.json',saved=fs.readFileSync(catalogPath),hash=b=>createHash('sha256').update(b).digest('hex'),bin=root+'/docs/build-evidence/028P/tools/bin',label='promotions-scroll';
function build(name){const r=spawnSync(process.execPath,[root+'/build.mjs'],{cwd:root,windowsHide:true,encoding:'utf8'});fs.writeFileSync(checks+'/round8ab-'+name+'.log',(r.stdout||'')+'\n'+(r.stderr||''));assert.equal(r.status,0,name);}
let result;
try{
 const catalog=JSON.parse(saved),old=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/catalog-before.json'));for(const k of Object.keys(old.slots))catalog.slots[k]=old.slots[k];fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,2));build('standalone-pending-fixture-build');
 const logPath=checks+'/round8ab-promotions-scroll.log',log=fs.createWriteStream(logPath),start=Date.now(),child=spawn(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,windowsHide:true,env:{...process.env,PATH:bin+';'+process.env.PATH,NODE_OPTIONS:'--import=file:///'+out+'/tools/evidence-redirect.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',BV_CHECK_LABEL:label},stdio:['ignore','pipe','pipe']});
 for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{log.write(chunk);process.stdout.write(chunk)});
 const hung=watchChildForHang(child,{onHung:(kind,detail)=>log.write(kind+': '+detail+'\n')});
 result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>{log.end();resolve({command:'node tests/promotions-scroll.mjs',...guardedResult(code,hung()),code,signal,ms:Date.now()-start,log:logPath});});});
 const regression=out+'/legacy/promotions-scroll/027/regression-results.json';if(result.status===0&&fs.existsSync(regression)){const data=JSON.parse(fs.readFileSync(regression));result.checks=data.count;fs.copyFileSync(regression,checks+'/round8ab-standalone-regression-results.json');}
}finally{fs.writeFileSync(catalogPath,saved);assert.equal(hash(fs.readFileSync(catalogPath)),hash(saved));fs.writeFileSync(checks+'/round8ab-standalone-planning-films-hash.json',JSON.stringify({before:hash(saved),after:hash(fs.readFileSync(catalogPath)),matches:true},null,2));build('standalone-restored-build');}
fs.writeFileSync(checks+'/round8ab-standalone-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=result.status;
