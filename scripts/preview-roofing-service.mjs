// Disposable local screenshot fixture. No private env, live providers or external sends.
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
const port=8097,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'roofing-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'roofing-qa','oai-authenticated-user-email':'roofing-qa@example.test'},body:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json()}
await api('/setup','POST',{});
const fixture=structuredClone(roofingFixture);fixture.slug='roofing-service-demo';
fixture.settings.websitePages={version:1,pages:[{
 id:'roof-repair',kind:'service',slug:'roof-repair',serviceName:'Roof repair',enabled:true,
 title:'A roof leak needs a clear next step.',
 intro:'Water stains, damaged shingles or a leak after a storm? Tell us what you’ve noticed. Start with a conversation about the concern and the repair options.',
 scope:'Discuss the affected area, visible damage and when the problem started. The proposed repair scope should explain what will be addressed, the materials involved and any further inspection needed before work is agreed.',
 process:['Share the concern and your project location.','Discuss the roof condition and the next inspection step.','Review the proposed repair scope, materials and price before deciding.'],
 materials:['Shingle and flashing repair options, where suitable for the existing roof.','Material compatibility and any limitations discussed with the proposed scope.'],
 questions:[
  {id:'first',question:'What should I share about the leak?',answer:'Tell us when you first noticed it, which room or roof area is affected, and whether it appears during rain. Photos taken safely from the ground can help explain the concern.'},
  {id:'repair',question:'Can my roof be repaired instead of replaced?',answer:'That depends on its condition and the extent of the damage. Discuss the repair options and any limitations after the roof has been assessed.'},
  {id:'timing',question:'Does submitting a request book an appointment?',answer:'No. The business reviews your request and confirms availability, timing and any appointment separately.'}
 ]
}]};
const {tenant}=await api('/tenants','POST',fixture);
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
const server=await listen(runtime,port);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
console.log('Local screenshot fixture: '+base+'/s/'+fixture.slug+'/services/roof-repair');
