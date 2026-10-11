import {readFileSync,writeFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
import {aboutFixture} from '../tests/fixtures/roofing-about.mjs';
import {faqFixture} from '../tests/fixtures/roofing-faq.mjs';
import {trustFixture} from '../tests/fixtures/business-trust.mjs';
const port=8101,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'trust-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
const headers={origin:base,'oai-authenticated-user-id':'trust-qa','oai-authenticated-user-email':'trust-qa@example.test'};
async function api(path,method='GET',data){const bytes=data instanceof Uint8Array;const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{...headers,'content-type':bytes?'image/jpeg':'application/json'},body:bytes?data:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});
let editTenant;
for(const mode of ['full','empty','uploaded']) {
 const fixture=structuredClone(roofingFixture);fixture.slug='trust-'+mode;fixture.settings.name='Ridgeline Roofing Demo';
 fixture.settings.websitePages={version:1,pages:[{...structuredClone(aboutFixture),title:'Real people. Clear facts. A roof you can trust.',intro:'Get to know the team before you choose your roofer. Check the credentials, see the work and bring us your questions.',story:'We start by listening to what you’ve noticed and what matters to you. From a focused repair to a planned replacement, we explain the scope and materials in plain language. You can ask questions, compare the options and agree on the next step before work begins.'},structuredClone(faqFixture)]};
 fixture.settings.businessTrust=mode==='empty'?{}:structuredClone(trustFixture);
 fixture.settings.platform.questionnaire={factsConfirmed:true};
 let {tenant}=await api('/tenants','POST',fixture);const path='/tenants/'+tenant.id;
 const logo=await api(path+'/photos','POST',new Uint8Array(readFileSync('tests/fixtures/roofing-demo-logo.jpg')));const settings=structuredClone(tenant.settings);settings.logoId=logo.id;
 if(mode==='uploaded'){const photo=await api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));settings.ownerPhotoId=photo.id;}
 tenant=(await api(path,'PUT',{version:tenant.version,settings})).tenant;
 await api(path+'/publish','POST',{version:tenant.version,approved:true});
 if(mode==='full') {
  for(const [i,city] of ['Ventura','Oxnard','Camarillo'].entries()){
   const data={title:['Repair around the chimney','A fresh shingle roof','Roofline and gutter work'][i]+' · QA sample',city,service:'Roof repair',completedAt:'2026-09-0'+(i+1),lat:34.2746,lng:-119.229,problem:'Fictional project problem for local QA.',work:'Fictional project work for local QA.',outcome:'Fictional project outcome for local QA.',approved:true};
   const {id}=await api(path+'/projects','POST',data);
   const before=await api(path+'/photos?projectId='+id+'&stage=before','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
   const after=await api(path+'/photos?projectId='+id+'&stage=after','POST',new Uint8Array(readFileSync(['public/assets/flashing.jpg','public/assets/finished-roof.jpg','public/assets/roof-repair.jpg'][i])));
   await api(path+'/projects/'+id,'PUT',{version:1,data:{...data,beforeId:before.id,afterId:after.id}});await api(path+'/projects/'+id+'/publish','POST',{version:2});
  }
  editTenant=(await api(path)).tenant;
 }
 console.log(base+'/s/'+fixture.slug+'/about');
}
writeFileSync('docs/build-evidence/007A/local-fixture.json',JSON.stringify({tenant:editTenant},null,2));
const server=await listen(runtime,port);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
