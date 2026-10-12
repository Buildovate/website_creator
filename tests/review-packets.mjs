import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import {screenshotDiagnosticStore,snapshotScreenshotEvidence,preserveScreenshotEqualityFailure} from './helpers/replay-diagnostics.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRuntime} from '../src/aws/server.js';
import {createReviewCapture} from '../src/aws/review-capture.js';
import worker from '../dist/server/index.js';
import {mediaSamples} from './fixtures/media-library.mjs';
const root=releaseRepoRoot,out=process.env.BV_REVIEW_EVIDENCE||root+'/docs/build-evidence/028E',origin='http://127.0.0.1:8212';
const replayDiagnostics=screenshotDiagnosticStore(out+'/checks/replay-diagnostics');
const capture=createReviewCapture({onScreenshot:replayDiagnostics.onScreenshot,browserModule:'playwright',executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const runtime=await createRuntime({worker,reviewCapture:capture,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'review@example.test',APP_ORIGIN:origin,OPENAI_API_KEY:'',GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''}});
const req=(path,method='GET',value,user={id:'review-admin',email:'review@example.test'})=>worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);
const api=async(path,method='GET',value,user)=>{const response=await req('/api'+path,method,value,user);assert.equal(response.status,200,await response.clone().text());return response.json()};
const packets=[];const results=[],check=(value,label)=>{assert.ok(value,label);results.push(label)};
const all=mediaSamples(),fixtures=process.argv.includes('--smoke')?all.slice(0,1):all;
try{
 await api('/setup','POST',{});
 for(const f of fixtures){
  const row={...f.row,status:'draft',published:null},keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();
  const t=(await api('/tenants/'+f.id)).tenant;
  const denied=await req('/api/tenants/'+f.id+'/publish','POST',{version:t.version,approved:true});check(denied.status===409,'Publishing without packet denied: '+f.id);
  let status=await api('/tenants/'+f.id+'/review-packet');await api('/tenants/'+f.id+'/review-packet','POST',{versionHash:status.versionHash});
  const deadline=Date.now()+15*60*1000;
  do{await new Promise(resolve=>setTimeout(resolve,1000));status=await api('/tenants/'+f.id+'/review-packet');if(status.packet?.status==='Capture failed')throw Error(status.packet.captureMessage);if(Date.now()>deadline)throw Error('Packet capture timed out');}while(status.packet?.status!=='Complete');
  const p=status.packet;check(p.pages.length>=12,'Every enabled page captured: '+f.id);check(p.pages.every(p=>p.screenshots[1440]&&p.screenshots[390]),'Both widths: '+f.id);check(p.clips.every(c=>Object.keys(c.frames).length===5),'Five frames per clip: '+f.id);check(p.claims.some(c=>c.category==='consent'),'Consent text captured: '+f.id);check(p.claims.some(c=>c.category==='financing'),'Financing text captured: '+f.id);
  if(f===fixtures[0]){
   const evidencePrefix='review-packets/'+f.id+'/'+p.versionHash+'/';const firstEvidence=await snapshotScreenshotEvidence(runtime.env.BUCKET,evidencePrefix,p,replayDiagnostics);
   await api('/tenants/'+f.id+'/review-packet','POST',{versionHash:p.versionHash});let replay;do{await new Promise(r=>setTimeout(r,1000));replay=(await api('/tenants/'+f.id+'/review-packet')).packet;if(replay.status==='Capture failed')throw Error(replay.captureMessage);}while(replay.status!=='Complete');
   const replayEvidence=await snapshotScreenshotEvidence(runtime.env.BUCKET,evidencePrefix,replay,replayDiagnostics);preserveScreenshotEqualityFailure(firstEvidence,replayEvidence,out+'/checks/replay-pairs');
   assert.deepEqual(replay.files,p.files,'Same-version HTML/screenshots/frames are byte-identical');assert.deepEqual(replay.reviewSnapshot,p.reviewSnapshot,'Replay retains dated live-review snapshot');check(true,'Same version packet replay is byte-identical');
  }
  const folder=out+'/packets/'+f.id+'/'+p.versionHash;fs.mkdirSync(folder,{recursive:true});for(const file of ['packet.json','source.json',...p.files.map(x=>x.path)]){const response=await req('/api/tenants/'+f.id+'/review-packet/file?version='+p.versionHash+'&path='+encodeURIComponent(file));assert.equal(response.status,200);fs.mkdirSync(folder+'/'+file.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(folder+'/'+file,Buffer.from(await response.arrayBuffer()))}
  // Exercise the real #028F staff-decision prerequisite; never rewrite a Fail.
  status=await api('/tenants/'+f.id+'/review-packet');
  check(status.qa.summary.blocking===0,'Real QA has no blocking failures: '+f.id);
  for(const item of status.qa.report.checks.filter(item=>item.result==='Borderline'))await api('/tenants/'+f.id+'/review-packet/qa-decision','POST',{versionHash:p.versionHash,manifestHash:status.manifestHash,reportHash:status.qa.report.reportHash,checkId:item.id,decision:'Accept',reason:'Fictional staff workflow test only; not a real-site approval.'});
  check((await api('/tenants/'+f.id+'/review-packet')).qa.summary.clear,'Real QA decisions clear the fixture: '+f.id);
  await api('/tenants/'+f.id+'/review-packet/decision','POST',{versionHash:p.versionHash,decision:'approve',checkedItems:p.checklist.map(x=>x.id)});const approval=await req('/api/tenants/'+f.id+'/review-packet/file?version='+p.versionHash+'&path=approval.json');assert.equal(approval.status,200);fs.writeFileSync(folder+'/approval.json',await approval.text());check((await req('/api/tenants/'+f.id+'/publish','POST',{version:t.version,approved:true})).status===200,'Approved exact version publishes: '+f.id);
  packets.push({id:f.id,versionHash:p.versionHash,pages:p.pages.length,clips:p.clips.length,claims:p.claims.length});
  const captureBinding=runtime.env.REVIEW_CAPTURE,queueBinding=runtime.env.REVIEW_QUEUE;runtime.env.REVIEW_CAPTURE=undefined;runtime.env.REVIEW_QUEUE=undefined;
  const current=(await api('/tenants/'+f.id)).tenant;const changed=(await api('/tenants/'+f.id,'PUT',{version:current.version,settings:{...current.settings,phone:'8055550199'}})).tenant;
  const stale=await req('/api/tenants/'+f.id+'/publish','POST',{version:changed.version,approved:true});check(stale.status===409,'Content change loses approval: '+f.id);
  const rejected=await req('/api/tenants/'+f.id+'/review-packet/decision','POST',{versionHash:p.versionHash,decision:'approve',checkedItems:p.checklist.map(x=>x.id)});check(rejected.status===409,'Old packet cannot approve changed version: '+f.id);
  runtime.env.REVIEW_CAPTURE=captureBinding;runtime.env.REVIEW_QUEUE=queueBinding;
  console.log('PASS '+f.id+': '+p.pages.length+' pages, '+p.clips.length+' clips, '+p.claims.length+' claims');
 }
 fs.writeFileSync(out+'/checks/review-packets.json',JSON.stringify({passed:true,count:results.length,packets,results},null,2));
}finally{await runtime.close()}
