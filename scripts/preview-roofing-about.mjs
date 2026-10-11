// Disposable local #007 fixture. All data is fictional; no live providers.
import {readFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
import {aboutFixture} from '../tests/fixtures/roofing-about.mjs';
import {faqFixture} from '../tests/fixtures/roofing-faq.mjs';
const port=8100,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'about-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const bytes=data instanceof Uint8Array;const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':bytes?'image/jpeg':'application/json','oai-authenticated-user-id':'about-qa','oai-authenticated-user-email':'about-qa@example.test'},body:bytes?data:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});
for(const mode of ['fallback','uploaded','standard']) {
 const fixture=structuredClone(roofingFixture);fixture.slug='about-'+mode;
 fixture.settings.journey=mode==='standard'?'standard':'roof-repair';
 fixture.settings.websitePages={version:1,pages:[structuredClone(aboutFixture),structuredClone(faqFixture),{id:'roof-repair',kind:'service',serviceName:'Roof repair',title:'Roof repair',enabled:true}]};
 fixture.settings.platform.questionnaire={factsConfirmed:true};
 let {tenant}=await api('/tenants','POST',fixture);
 const path='/tenants/'+tenant.id;
 const logo=await api(path+'/photos','POST',new Uint8Array(readFileSync('tests/fixtures/roofing-demo-logo.jpg')));
 const settings=structuredClone(tenant.settings);settings.logoId=logo.id;
 if(mode==='uploaded') {
  const photo=await api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
  settings.websitePages.pages[0].portraitMode='uploaded_photo';
  settings.websitePages.pages[0].portrait={photoId:photo.id,alt:'Uploaded roof photograph used to test the About image slot',caption:'Local image-slot fixture · not an employee portrait'};
 }
 tenant=(await api(path,'PUT',{version:tenant.version,settings})).tenant;
 await api(path+'/publish','POST',{version:tenant.version,approved:true});
 console.log(base+'/s/'+fixture.slug+'/about');
}
const server=await listen(runtime,port);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
