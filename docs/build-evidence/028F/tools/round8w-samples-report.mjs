import fs from 'node:fs';import {createHash} from 'node:crypto';
const out='C:/Users/joe/website_creator/docs/build-evidence/028F',checks=out+'/checks',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const old=read(checks+'/round8q-samples-before-findings.json'),fresh=checks+'/round8w-samples',current=read(fresh+'/qa-packets.json'),findings=[];
for(const p of current.packets){const qa=read(fresh+'/packets/'+p.id+'/'+p.versionHash+'/qa-report.json');for(const c of qa.checks.filter(c=>c.result!=='Pass'))findings.push({sample:p.id,...c});}
const key=c=>[c.sample,c.page,c.width,c.key,c.selector,c.result].join('|'),before=new Set(old.findings.map(key)),after=new Set(findings.map(key));
const result={state:'Completed',pass:current.packets.reduce((n,p)=>n+p.qa.passed,0),borderline:current.packets.reduce((n,p)=>n+p.qa.pending,0),fail:current.packets.reduce((n,p)=>n+p.qa.blocking,0),qaGateClear:current.qaGateClear,packets:current.packets,newFindings:findings.filter(c=>!before.has(key(c))),noLongerDetected:old.findings.filter(c=>!after.has(key(c))),original70ReviewDecisions:'Untouched; still open. No Accept, waiver or reclassification recorded.',decisionsRecorded:0};
const backup=checks+'/round8q-before/docs/build-evidence/028F',inventory=[];
function walk(p){for(const item of fs.readdirSync(backup+'/'+p,{withFileTypes:true})){const next=p+'/'+item.name;if(item.isDirectory())walk(next);else inventory.push(next);}}
walk('packets');walk('capture-readiness');inventory.push('checks/qa-packets.json');
const hash=b=>createHash('sha256').update(b).digest('hex'),changed=[];for(const p of inventory){const a=fs.readFileSync(backup+'/'+p),b=fs.readFileSync(out+'/'+p);if(!a.equals(b))changed.push({path:p,before:hash(a),after:hash(b)});}
result.originalSamplesPreservation={checkedFiles:inventory.length,changed,byteIdentical:changed.length===0,freshEvidence:'checks/round8w-samples/'};
fs.writeFileSync(checks+'/round8w-samples-snapshot.json',JSON.stringify(result,null,2));console.log(JSON.stringify({pass:result.pass,borderline:result.borderline,fail:result.fail,qaGateClear:result.qaGateClear,newFindings:result.newFindings.map(c=>({sample:c.sample,page:c.page,width:c.width,type:c.key,result:c.result})),noLongerDetected:result.noLongerDetected.length,originalSamplesPreservation:result.originalSamplesPreservation},null,2));
if(changed.length)throw Error('Original Sample evidence changed: '+changed.map(r=>r.path).join(', '));
