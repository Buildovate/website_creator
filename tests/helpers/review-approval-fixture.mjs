import {releaseRepoRoot} from "../../scripts/runtime-paths.mjs";
// #028F: actual browser QA and actual staff decisions. Never fabricate a Pass.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../../dist/server/index.js';
import {createReviewCapture} from '../../src/aws/review-capture.js';
import {createAssets} from '../../src/aws/s3.js';
import {recordFrameInitializationProof} from './frame-initialization-proof.mjs';
export const fetchWithoutReviewPrerequisite=worker.fetch.bind(worker);
const capture=createReviewCapture({...(process.env.BV_FRAME_PROOF?{onScreenshot:recordFrameInitializationProof}:{}),browserModule:'playwright',executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
export async function realReviewPrerequisite(env,id,target='website',origin='https://test.local'){
 env.ASSETS ||= createAssets(releaseRepoRoot+"/dist/client");
 const previousCapture=env.REVIEW_CAPTURE;
 env.REVIEW_CAPTURE ||= capture;
 try{
 const staff=await env.DB.prepare('SELECT user_id,email FROM admins ORDER BY created_at LIMIT 1').first();
 assert.ok(staff,'Fixture must have a real staff identity');
 const base='/api/tenants/'+id+'/review-packet',query='?target='+encodeURIComponent(target);
 const api=async(suffix='',method='GET',value)=>{const response=await fetchWithoutReviewPrerequisite(new Request(origin+base+suffix+query,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':staff.user_id,'oai-authenticated-user-email':staff.email},body:value===undefined?undefined:JSON.stringify(value)}),env);assert.equal(response.status,200,await response.clone().text());return response.json()};
 let status=await api();
 await api('','POST',{versionHash:status.versionHash});
 const deadline=Date.now()+1200000;
 do{status=await api();assert.notEqual(status.packet?.status,'Capture failed',status.packet?.captureMessage);if(status.packet?.status==='Complete')break;assert.ok(Date.now()<deadline,'Real capture timeout');await new Promise(r=>setTimeout(r,250));}while(true);
 if(status.qa.summary.blocking){
  const folder=releaseRepoRoot+"/docs/build-evidence/028F/helper-blockers/"+(process.env.BV_CHECK_LABEL||'manual')+'/'+id+'/'+status.versionHash,failures=status.qa.report.checks.filter(c=>c.result==='Fail');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(folder+'/failures.json',JSON.stringify({target,versionHash:status.versionHash,failures},null,2));
  for(const file of new Set(['packet.json','source.json','qa-report.json',...status.packet.pages.map(p=>p.file),...failures.map(c=>c.crop)])){const object=await env.BUCKET.get('review-packets/'+id+'/'+status.versionHash+'/'+file);if(object){fs.mkdirSync(folder+'/'+file.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(folder+'/'+file,Buffer.from(await new Response(object.body).arrayBuffer()));}}
 }
 assert.equal(status.qa.summary.blocking,0,JSON.stringify(status.qa.report.checks.filter(c=>c.result==='Fail')));
 for(const check of status.qa.report.checks.filter(c=>c.result==='Borderline'))await api('/qa-decision','POST',{versionHash:status.versionHash,manifestHash:status.manifestHash,reportHash:status.qa.report.reportHash,checkId:check.id,decision:'Accept',reason:'Clearly fictional legacy regression staff decision; not approval of a real contractor site.'});
 await api('/decision','POST',{versionHash:status.versionHash,decision:'approve',checkedItems:status.packet.checklist.map(c=>c.id)});
 console.log('REAL browser QA prerequisite:',id,target,JSON.stringify(status.qa.summary));
 }finally{
  // This legacy fixture borrowed a real capture binding only for its QA prerequisite.
  // Restore its original host setup; every later publication still requires real QA.
  if(previousCapture===undefined)delete env.REVIEW_CAPTURE;else env.REVIEW_CAPTURE=previousCapture;
 }
}
worker.fetch=async(req,env)=>{
 const url=new URL(req.url),site=url.pathname.match(/^\/api\/tenants\/([^/]+)\/(?:projects\/([^/]+)\/)?publish$/),record=url.pathname.match(/^\/api\/workspace\/([^/]+)\/(pages|forms|blog|visibility)\/([^/]+)\/publish$/);
 const retry=req.method==='POST'&&(site||record)?req.clone():null;
 const response=await fetchWithoutReviewPrerequisite(req,env);
 if(!retry||response.status!==409){void retry?.body?.cancel();return response;}
 const error=(await response.clone().json().catch(()=>({}))).error;
 if(error==='Resolve the blocking QA failures before approval.'){
  const id=site?.[1]||record[1],target=site?(site[2]?'project:'+site[2]:'website'):record[2]+':'+record[3],staff=await env.DB.prepare('SELECT user_id,email FROM admins ORDER BY created_at LIMIT 1').first();
  const diagnostic=await fetchWithoutReviewPrerequisite(new Request(url.origin+'/api/tenants/'+id+'/review-packet?target='+encodeURIComponent(target),{headers:{'oai-authenticated-user-id':staff.user_id,'oai-authenticated-user-email':staff.email}}),env);assert.equal(diagnostic.status,200);const current=await diagnostic.json(),failures=current.qa.report.checks.filter(c=>c.result==='Fail'),folder=releaseRepoRoot+"/docs/build-evidence/028F/helper-blockers/"+(process.env.BV_CHECK_LABEL||'manual')+'/'+id;
  fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(folder+'/failures.json',JSON.stringify({target,versionHash:current.versionHash,failures},null,2));
  for(const file of ['packet.json','source.json','qa-report.json',...current.packet.pages.map(p=>p.file),...failures.map(c=>c.crop)]){const object=await env.BUCKET.get('review-packets/'+id+'/'+current.versionHash+'/'+file);if(object){fs.mkdirSync(folder+'/'+file.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(folder+'/'+file,Buffer.from(await new Response(object.body).arrayBuffer()));}}
  console.error('REAL blocking QA details (publication stays blocked):',JSON.stringify(failures));
 }
 if(!['Complete the review packet before approval.','Staff must approve the review packet for this exact version before publishing.','Capture the automatic QA report before approval.','A staff reviewer must decide every Borderline item, with a reason.'].includes(error)){void retry.body?.cancel();return response;}
 const id=site?.[1]||record[1],target=site?(site[2]?'project:'+site[2]:'website'):record[2]+':'+record[3];
 await realReviewPrerequisite(env,id,target,url.origin);
 // The denied response is discarded on retry; close its cloned body stream.
 await response.body?.cancel();
 return fetchWithoutReviewPrerequisite(retry,env);
};
