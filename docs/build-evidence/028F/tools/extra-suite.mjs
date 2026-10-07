import fs from 'node:fs';import assert from 'node:assert/strict';import{spawn}from'node:child_process';
import{watchChildForHang,guardedResult}from'./child-hang-guard.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F';
const commands=[['media-library'],['media-api'],['media-inventory'],['section-variants'],['review-rating-filter'],['section-variants-fallbacks'],['section-content-parity'],['uniqueness-content-parity'],['uniqueness'],['uniqueness-api'],['section-variants-browser'],['section-variants-browser','--all-process'],['media-library-browser'],['media-library-browser','--media-only']];
const selected=process.env.BV_EXTRA_ONLY?.split(',');const results=selected?JSON.parse(fs.readFileSync(out+'/additional-checks.json')):[];fs.mkdirSync(out+'/variants/checks',{recursive:true});fs.mkdirSync(out+'/variants/after',{recursive:true});
for(const [name,...args]of commands){const label=name+(args.includes('--all-process')?'-all-process':args.includes('--media-only')?'-interactions':''),start=Date.now(),command=[root+'/tests/'+name+'.mjs',...args];
if(selected&&!selected.includes(label))continue;
const env={...process.env,NODE_OPTIONS:'--import=file:///'+out+'/tools/evidence-redirect.mjs --import=file:///'+root+'/tests/helpers/review-approval-fixture.mjs',BV_CHECK_LABEL:label,BV_028B_EVIDENCE:out+'/variants',BV_028B_PARALLEL:'2'};
console.log('START '+label);
const log=fs.createWriteStream(out+'/checks/'+label+'.log');const child=spawn(process.execPath,command,{cwd:root,env,stdio:['ignore','pipe','pipe']});let memoryBlocker=false,scan='';
for(const stream of[child.stdout,child.stderr]){let pending='';stream.on('data',chunk=>{const value=chunk.toString();log.write(value);scan=(scan+value).slice(-4096);if(/out of memory|cannot allocate memory|WebAssembly.Memory\(\): could not allocate/i.test(scan))memoryBlocker=true;pending+=value;const lines=pending.split(/\r?\n/);pending=lines.pop();for(const line of lines)console.log(label+' | '+line);});stream.on('end',()=>{if(pending)console.log(label+' | '+pending);});}
const hung=watchChildForHang(child,{onHung:reason=>console.log(label+' | guard: '+reason)});
const run=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>resolve({...guardedResult(code,hung()),signal}));});await new Promise(resolve=>log.end(resolve));
const prior=results.findIndex(x=>x.label===label);if(prior>=0)results.splice(prior,1);results.push({label,command:'node '+command.join(' '),...run,ms:Date.now()-start});fs.writeFileSync(out+'/additional-checks.json',JSON.stringify(results,null,2));console.log(label+': '+run.outcome+' ('+Math.round((Date.now()-start)/1000)+'s)');if(memoryBlocker)throw Error('Memory blocker: stop this run');assert.equal(run.status,0,label+': '+run.outcome+' '+(run.reason||''));}
assert.ok(results.every(x=>x.status===0));console.log('PASS '+results.length+' additional checks.');
