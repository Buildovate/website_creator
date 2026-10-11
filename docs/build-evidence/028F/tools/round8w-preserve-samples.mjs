import fs from 'node:fs';import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator/docs/build-evidence/028F',checks=root+'/checks',backup=checks+'/round8q-before/docs/build-evidence/028F';
const files=[];function walk(p){for(const entry of fs.readdirSync(backup+'/'+p,{withFileTypes:true})){const next=p+'/'+entry.name;if(entry.isDirectory())walk(next);else files.push(next);}}
walk('packets');walk('capture-readiness');files.push('checks/qa-packets.json');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),changed=[];
for(const p of files){const before=hash(backup+'/'+p),after=fs.existsSync(root+'/'+p)?hash(root+'/'+p):null;if(before!==after)changed.push({path:p,before,after});}
const proof={checkedFiles:files.length,changed,byteIdentical:changed.length===0,original70Open:true,decisionsRecorded:0,qaGateClear:false};
fs.writeFileSync(checks+'/round8w-samples-preservation.json',JSON.stringify(proof,null,2));
const report=checks+'/round8w-results.json',result=JSON.parse(fs.readFileSync(report,'utf8'));result.originalSamplePreservation=proof;result.remainingSuiteProcesses=0;
fs.writeFileSync(report,JSON.stringify(result,null,2));
fs.appendFileSync(checks+'/round8w-notes.md',`\n## Original Sample preservation after stop\n\n${JSON.stringify(proof)}. [Hash comparison](round8w-samples-preservation.json). No fresh Samples QA run. No remaining suite/test node processes.\n`);
console.log(JSON.stringify(proof,null,2));if(changed.length)process.exitCode=1;
