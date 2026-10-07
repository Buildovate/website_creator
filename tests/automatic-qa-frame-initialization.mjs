import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {approvedSourceChangesPath, readApprovedSourceChanges, evaluateFrameSourceLocks} from './helpers/frame-source-lock.mjs';
import {createRequire} from 'node:module';
const {BLUE_PAGE,PAPER_PAGE,loadRegistry,matchCapture}=createRequire(import.meta.url)('./helpers/replay-alternate-registry.cjs');
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',proof=out+'/frame-initialization';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>createHash('sha256').update(b).digest('hex');
const before=read(proof+'/before/baseline.json'),rows=[];
const hero=phase=>fs.readFileSync(proof+'/'+phase+'/hero-editor/hashes.jsonl','utf8').trim().split('\n').map(JSON.parse);
// Hero-editor creates new random site IDs: its page versions differ by design.
// Compare all extraction frames, and use the fixed five Samples for page equality.
const old=hero('before').filter(x=>x.path.startsWith('frames/')),now=hero('after').filter(x=>x.path.startsWith('frames/')),byKey=new Map(now.map(x=>[x.key,x]));
assert.equal(old.length,now.length,'Every hero-editor video-frame extraction must be present');
for(const b of old){const a=byKey.get(b.key);rows.push({fixture:b.slug,capture:b.captureNumber,path:b.path,before:b.sha256,after:a?.sha256||null,pass:b.sha256===a?.sha256});}
const packets=read(proof+'/same-version-samples.json');
assert.equal(packets.passed,true,'All five saved versions must finish replay');
const registry=loadRegistry(out);
for(const b of before.samples){const p=packets.packets.find(p=>p.id===b.id);assert.equal(p.versionHash,b.versionHash);const file=proof+'/after/samples/'+p.id+'/'+b.path;const data=fs.readFileSync(file);const servicePage='/s/'+b.id+'/services';const registered=registry.find(entry=>entry.page===servicePage&&entry.capture===b.path);const match=registered?matchCapture({capture:b.path,page:servicePage,width:registered.width,savedSha256:b.sha256,actualSha256:hash(data),readiness:read(file+'.readiness.json'),registry,expectedBytes:fs.readFileSync(out+'/packets/'+p.id+'/'+p.versionHash+'/'+b.path),actualBytes:data,acceptanceLogPath:out+'/checks/replay-alternate-acceptances.json'}):null;rows.push({fixture:b.id,path:b.path,before:b.sha256,after:hash(data),variant:match?.variant||'saved',direction:match?.direction||'identical',method:match?.method||'exact',pass:b.sha256===hash(data)||(registered&&match?.variant==='alternate')});}
const approvedEntries=readApprovedSourceChanges(out+'/'+approvedSourceChangesPath);
const currentQaHash=hash(fs.readFileSync(root+'/src/aws/qa-browser.js'));
let recognitionReport=null;
if(currentQaHash!==before.files['src/aws/qa-browser.js']){
  const check=spawnSync(process.execPath,[root+'/tests/automatic-qa-recognition-lock.mjs'],{cwd:root,env:{...process.env,NODE_OPTIONS:''},encoding:'utf8',timeout:120000});
  assert.equal(check.status,0,'Exact recognition-lock check must pass inside frame proof: '+(check.stderr||check.stdout||check.error||''));
  recognitionReport=read(out+'/checks/recognition-lock.json');
  assert.equal(hash(fs.readFileSync(root+'/src/aws/qa-browser.js')),currentQaHash,'qa-browser.js changed during recognition proof');
}
const locks=evaluateFrameSourceLocks({baselineFiles:before.files,sourceRoot:root,approvedEntries,recognitionReport});
const result={passed:rows.every(x=>x.pass)&&locks.every(x=>x.pass),frames:rows.filter(x=>x.path.startsWith('frames/')).length,pageCaptures:rows.filter(x=>x.path.startsWith('screenshots/')).length,rows,locks,credits:0,providerCalls:0};
fs.writeFileSync(proof+'/hash-comparison.json',JSON.stringify(result,null,2));
fs.writeFileSync(proof+'/HASHES.md','# Frame initialization: exact before/after SHA-256\n\n| Fixture / capture | File | Before | After | Result |\n|---|---|---|---|---|\n'+rows.map(x=>'| '+x.fixture+(x.capture?' / '+x.capture:'')+' | '+x.path+' | '+x.before+' | '+x.after+' | '+(x.pass?'PASS':'FAIL')+' |').join('\n')+'\n');
console.log(JSON.stringify({passed:result.passed,frames:result.frames,pageCaptures:result.pageCaptures,differences:rows.filter(x=>!x.pass),locks},null,2));
assert.equal(result.passed,true,'Stop: a frame/page hash or frozen source changed');
