import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028B';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read(root+'/docs/build-evidence/028P/baseline-sites.json'),after=read(out+'/after-sites.json');
const comparisons=[];
for(const group of ['html','stylesheets','protectedCss'])for(const item of before[group]){
 const key=item.url||item.path,found=after[group].find(x=>(x.url||x.path)===key);
 comparisons.push({group,key,identical:!!found&&item.sha256===found.sha256&&(item.status===undefined||item.status===found.status)});
}
const old=root+'/.data/028B-prior-evidence-review-filter';
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const prior=walk(old).filter(p=>{const relative=p.slice(old.length+1);return relative.startsWith('before/')||relative.startsWith('baseline-')||relative.startsWith('checks/baseline')||relative.startsWith('checks/default-a-preflight');}).map(p=>{const relative=p.slice(old.length+1);return{file:relative,identical:fs.existsSync(out+'/'+relative)&&sha(p)===sha(out+'/'+relative)}});
const diff=execFileSync('git',['-c','safe.directory=C:/Users/joe/website_creator','-C',root,'diff','--name-only','17e35f0','--','src/client','src/auth','src/views.js','public/auth.css','build.mjs','package.json','package-lock.json'],{encoding:'utf8'}).trim();
const report={acceptedHashes:comparisons.length,matched:comparisons.filter(x=>x.identical).length,comparisons,priorEvidence:prior,platformBuildDependencyDiff:diff,passed:comparisons.length===279&&comparisons.every(x=>x.identical)&&prior.every(x=>x.identical)&&!diff};
fs.writeFileSync(out+'/checks/accepted-protected-final.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,acceptedHashes:comparisons.length,matched:report.matched,priorEvidence:prior.length,priorDifferences:prior.filter(x=>!x.identical),platformBuildDependencyDiff:diff}));if(!report.passed)process.exitCode=1;

