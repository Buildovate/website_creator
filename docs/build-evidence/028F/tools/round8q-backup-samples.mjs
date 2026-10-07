import fs from 'node:fs';import path from 'node:path';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',backup=out+'/checks/round8q-before';
for(const p of ['packets','capture-readiness','checks/qa-packets.json']){const to=backup+'/docs/build-evidence/028F/'+p;if(fs.existsSync(out+'/'+p)&&!fs.existsSync(to)){fs.mkdirSync(path.dirname(to),{recursive:true});fs.cpSync(out+'/'+p,to,{recursive:true,preserveTimestamps:true});}}
const old=JSON.parse(fs.readFileSync(out+'/checks/qa-packets.json','utf8')),findings=[];
for(const p of old.packets){const report=JSON.parse(fs.readFileSync(out+'/packets/'+p.id+'/'+p.versionHash+'/qa-report.json','utf8'));for(const c of report.checks.filter(c=>c.result!=='Pass'))findings.push({sample:p.id,...c});}
fs.writeFileSync(out+'/checks/round8q-samples-before-findings.json',JSON.stringify({snapshot:old,findings},null,2));console.log('Backed up all existing Sample packets/readiness records and original open findings.');
