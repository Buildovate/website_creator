import fs from 'node:fs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F';
for(const path of ['tools/round8s-backup-suite.mjs','checks/round8s-run-suite.ps1','tools/round8s-samples-evidence.mjs','tools/round8s-samples-report.mjs','tools/round8s-preserve-samples.mjs']){
 const target=out+'/'+path.replaceAll('round8s','round8t');
 if(fs.existsSync(target))throw Error('Evidence helper already exists: '+target);
 fs.writeFileSync(target,fs.readFileSync(out+'/'+path,'utf8').replaceAll('round8s','round8t'));
}
console.log('Prepared round-specific evidence/backup/supervisor helpers; unchanged suite runner and guard.');
