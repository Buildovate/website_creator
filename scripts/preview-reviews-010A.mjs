// Local-only QA: real persistence/publication paths, fictional content, mocked providers.
import {readFileSync,writeFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
import {trustSitesFixture} from '../tests/fixtures/trust-sites.mjs';
const port=8104,base='http://127.0.0.1:'+port;
globalThis.fetch=async input=>{const url=String(input);if(url.startsWith('https://places.googleapis.com/'))return Response.json({displayName:{text:'Ridgeline · QA sample'},rating:3.8,userRatingCount:40,googleMapsUri:'https://www.google.com/maps?cid=1234',reviews:[{rating:5,text:{text:'QA sample: the repair scope was explained before work began.'},authorAttribution:{displayName:'Alex · fictional reviewer'},googleMapsUri:'https://www.google.com/maps?cid=1234',relativePublishTimeDescription:'QA fixture'},{rating:2,text:{text:'FILTERED_QA_REVIEW'}}]});if(url.startsWith('https://api.yelp.com/')&&url.endsWith('/reviews'))return Response.json({reviews:[{rating:4,text:'QA sample: clear steps from the first conversation.',user:{name:'Sam · fictional reviewer'},url:'https://www.yelp.com/biz/ridgeline-qa'}]});if(url.startsWith('https://api.yelp.com/'))return Response.json({name:'Ridgeline · QA sample',rating:4,review_count:12,url:'https://www.yelp.com/biz/ridgeline-qa'});throw Error('Unexpected outbound request in offline QA: '+url);};
const localWorker={fetch(req,env){const mock=new URL(req.url).pathname.includes('/proof-full/reviews');return worker.fetch(req,{...env,GOOGLE_PLACES_API_KEY:mock?'test-only-placeholder':'',YELP_API_KEY:mock?'test-only-placeholder':''});}};
const runtime=await createRuntime({worker:localWorker,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'proof-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base,GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''}});
async function api(path,method='GET',data){const bytes=data instanceof Uint8Array;const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':bytes?'image/jpeg':'application/json','oai-authenticated-user-id':'proof-qa','oai-authenticated-user-email':'proof-qa@example.test'},body:bytes?data:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});const report={projects:[],privatePhotoIds:[],draftLogos:[],slugs:[]};
for(const mode of ['full','fallback','empty']){
 const fixture=structuredClone(roofingFixture);fixture.slug='proof-'+mode;fixture.settings.name='Ridgeline Roofing · QA';fixture.settings.showOwner=false;fixture.settings.websitePages={version:1,pages:[{id:'repair',kind:'service',slug:'roof-repair',title:'Roof repair',serviceName:'Roof repair',enabled:true}]};fixture.settings.trust={...structuredClone(trustSitesFixture),networks:trustSitesFixture.networks.slice(0,2)};
 fixture.settings.reviews=mode==='empty'?{}:{confirmed:true,minimum:4,googleUrl:'https://www.google.com/maps?cid=1234',googlePlaceId:'QA_place',privacyUrl:base+'/s/proof-'+mode+'/legal/privacy',termsUrl:base+'/s/proof-'+mode+'/legal/terms',yelpUrl:'https://www.yelp.com/biz/ridgeline-qa',yelpBusinessId:'ridgeline-qa'};
 // Existing review contract requires HTTPS policy links, fixture-only and never visited.
 if(mode!=='empty'){fixture.settings.reviews.privacyUrl='https://example.test/privacy';fixture.settings.reviews.termsUrl='https://example.test/terms';}
 if(mode==='empty')fixture.settings.trust={};
 let {tenant}=await api('/tenants','POST',fixture);const path='/tenants/'+tenant.id;
 if(mode!=='empty'){const logo=await api(path+'/photos','POST',new Uint8Array(readFileSync('tests/fixtures/roofing-demo-logo.jpg')));tenant=(await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,logoId:logo.id}})).tenant;}
 await api(path+'/publish','POST',{version:tenant.version,approved:true});
 if(mode==='full')for(const [i,city] of ['Ventura','Oxnard'].entries()){
  const data={title:['Chimney flashing repair · QA','Shingle roof replacement · QA'][i],city,service:i?'Roof replacement':'Roof repair',material:'Asphalt shingles',concern:'Leak',property:'Residential',completedAt:'2026-09-01',lat:i?34.1975:34.2746,lng:i?-119.1771:-119.229,problem:'Fictional concern for local project QA.',work:'Fictional documented roofing work for QA.',outcome:'Fictional outcome for approved-record QA.',approved:true};
  const {id}=await api(path+'/projects','POST',data),photos=[];
  for(const [stage,asset] of [['before','roofing.jpg'],['after',i?'finished-roof.jpg':'flashing.jpg']])photos.push((await api(path+'/photos?projectId='+id+'&stage='+stage+'&caption=QA%20fixture%20photograph','POST',new Uint8Array(readFileSync('public/assets/'+asset)))).id);
  await api(path+'/projects/'+id,'PUT',{version:1,data:{...data,beforeId:photos[0],afterId:photos[1]}});await api(path+'/projects/'+id+'/publish','POST',{version:2});
  report.projects.push({id,...data,beforeId:photos[0],afterId:photos[1]});
  const late=await api(path+'/photos?projectId='+id+'&stage=during&caption=PRIVATE_LATE_PHOTO','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));report.privatePhotoIds.push(late.id);
  await api(path+'/projects/'+id,'PUT',{version:3,data:{...data,title:'PRIVATE_PROJECT_EDIT',beforeId:photos[0],afterId:photos[1]}});
 }
 if(mode==='full'){
  const {id}=await api(path+'/projects','POST',{title:'PRIVATE_UNPUBLISHED_PROJECT',city:'Private City',service:'Roof repair',completedAt:'2026-09-01',lat:34,lng:-119});
  report.privatePhotoIds.push((await api(path+'/photos?projectId='+id+'&stage=before','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')))).id);
  tenant=(await api(path)).tenant;const draftLogo=await api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));report.draftLogos.push(draftLogo.id);await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,logoId:draftLogo.id,reviews:{...tenant.settings.reviews,googleUrl:'https://www.google.com/maps?cid=999999',confirmed:false}}});
 }
 report.slugs.push(fixture.slug);console.log(base+'/s/'+fixture.slug);
}
writeFileSync('docs/build-evidence/010A/local-fixture.json',JSON.stringify(report,null,2));
const server=await listen(runtime,port);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
