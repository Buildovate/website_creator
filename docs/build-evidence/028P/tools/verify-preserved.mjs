import fs from 'node:fs';import crypto from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028P',state=JSON.parse(fs.readFileSync(out+'/preserve-state.json'));
const hash=p=>fs.existsSync(root+'/'+p)?crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex'):null;
const evidence=state.evidence.filter(x=>hash(x.path)!==x.sha256),unrelated=state.dirty.filter(x=>hash(x.path)!==x.sha256);
const result={priorEvidence:state.evidence.length,unrelatedFiles:state.dirty.length,evidenceDifferences:evidence.map(x=>x.path),unrelatedDifferences:unrelated.map(x=>x.path)};fs.writeFileSync(out+'/checks/preservation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(evidence.length||unrelated.length)process.exitCode=1;
