// Disposable #006 fixture: published FAQ records; no live providers or sends.
import {readFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {faqFixture} from '../tests/fixtures/roofing-faq.mjs';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
const port=8099,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'grid-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'grid-qa','oai-authenticated-user-email':'grid-qa@example.test'},body:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});
const names=JSON.parse(readFileSync('public/trade-library.json','utf8')).Roofing;
for(const journey of ['standard','roof-repair']) {
 const fixture=structuredClone(roofingFixture);
 fixture.slug='grid-'+journey;
 fixture.settings.journey=journey;
 fixture.settings.services=names.map(name=>({name}));
 fixture.settings.websitePages={version:1,pages:names.map((name,i)=>({id:`grid-${i}`,kind:'service',slug:`offering-${i}`,serviceName:name,title:name,enabled:true,scope:'Discuss the condition of your roof, the proposed scope and the next step.'}))};
 fixture.settings.websitePages.pages.push(structuredClone(faqFixture));
 fixture.settings.platform.financing={enabled:true,lenders:[{id:'sfc',enabled:true,confirmed:true,applicationUrl:'https://merchant.example.test/sfc'}]};
 fixture.settings.platform.promotions={enabled:true};
 const {tenant}=await api('/tenants','POST',fixture);
 await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
 console.log(base+'/s/'+fixture.slug+'/faq');
}
const server=await listen(runtime,port);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
