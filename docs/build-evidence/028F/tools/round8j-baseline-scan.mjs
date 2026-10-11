import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',checks=root+'/docs/build-evidence/028F/checks';
process.chdir(root);
const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
const {normalizePart2HTML}=await import(pathToFileURL(root+'/tests/part2-html-normalize.mjs'));
const {beforePart1}=await import(pathToFileURL(root+'/tests/review-part1-html-normalize.mjs'));
const entries=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
for(const {row} of entries){const keys=Object.keys(row);await env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();}
const records=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/027A-part2/before-responses.json'));
const approved='poster="/assets/planning/027A-part1/financing-poster-1280.webp" ',sha=s=>createHash('sha256').update(s).digest('hex');
const results=[];
for(const record of records.filter(r=>r.url.includes('/s/ambient-baseline-'))){
 const response=await worker.fetch(new Request('https://test.local'+record.url,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env),actual=await response.text();
 const expected=fs.readFileSync(root+'/docs/build-evidence/027A-part2/before/'+record.name,'utf8');
 const a=normalizePart2HTML(expected,record.kit==='roofing'),b=normalizePart2HTML(beforePart1(actual),record.kit==='roofing');
 let at=0;while(at<Math.min(a.length,b.length)&&a[at]===b[at])at++;
 let tail=0;while(tail<Math.min(a.length,b.length)-at&&a[a.length-1-tail]===b[b.length-1-tail])tail++;
 const removed=a.slice(at,a.length-tail),added=b.slice(at,b.length-tail);
 const posterOnly=response.status===200&&removed===''&&added===approved&&a.slice(Math.max(0,at-7),at)==='<video ';
 const row={kit:record.kit,url:record.url,name:record.name,status:response.status,expectedRawSha:sha(expected),actualRawSha:sha(actual),expectedNormalizedSha:sha(a),actualNormalizedSha:sha(b),classification:a===b?'Identical':posterOnly?'Authorized poster only':'STOP: other difference',removed,added};
 results.push(row);
 if(a!==b){
  const dir=checks+'/round8j-baseline-diffs';fs.mkdirSync(dir,{recursive:true});
  const x=dir+'/'+record.name+'-expected.txt',y=dir+'/'+record.name+'-actual.txt';fs.writeFileSync(x,a);fs.writeFileSync(y,b);
  const diff=spawnSync('git',['-c','safe.directory='+root,'diff','--no-index','--no-ext-diff','--',x,y],{encoding:'utf8',maxBuffer:50e6});
  if(diff.status!==0&&diff.status!==1)throw Error(diff.stderr||'Diff failed');
  fs.writeFileSync(dir+'/'+record.name+'.diff.txt',diff.stdout);
 }
}
const summary={checked:results.length,identical:results.filter(r=>r.classification==='Identical').length,posterOnly:results.filter(r=>r.classification==='Authorized poster only').length,other:results.filter(r=>r.classification==='STOP: other difference').length,results};
fs.writeFileSync(checks+'/round8j-baseline-scan.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,results:results.filter(r=>r.classification!=='Identical').map(r=>({...r,removed:r.removed.slice(0,1500),added:r.added.slice(0,1500)}))},null,2));
if(summary.other)process.exitCode=2;
