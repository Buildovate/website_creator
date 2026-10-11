import fs from 'node:fs';
const root='C:/Users/joe/website_creator',tools=root+'/docs/build-evidence/028F/tools',checks=root+'/docs/build-evidence/028F/checks';
for(const name of ['baseline-scan.mjs','backup-suite.mjs'])fs.writeFileSync(tools+'/round8r-'+name,fs.readFileSync(tools+'/round8q-'+name,'utf8').replaceAll('round8q','round8r'));
fs.writeFileSync(checks+'/round8r-run-suite.ps1',fs.readFileSync(checks+'/round8q-run-suite.ps1','utf8').replaceAll('round8q','round8r'));
console.log('Prepared isolated round 8r scan, evidence backup and fail-stop supervisor; existing suite runner/guard unchanged.');
