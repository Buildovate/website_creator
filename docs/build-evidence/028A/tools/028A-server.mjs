import fs from 'node:fs';
import {createRuntime,listen} from 'file:///C:/Users/joe/website_creator/src/aws/server.js';
import worker from 'file:///C:/Users/joe/website_creator/dist/server/index.js';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028A',base='http://127.0.0.1:8184';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'styles@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8184',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'styles-admin','oai-authenticated-user-email':'styles@example.test'};
async function api(path,method='GET',data){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)}),runtime.env);if(!response.ok)throw Error(await response.text());return response.json()}
await api('/setup','POST',{});
const fixture=[];
const old=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
for(const {row} of old)for(const style of ['current','bold','fresh','classic']){const r={...row,id:row.id+'-028a-'+style,slug:row.slug.replace('ambient-baseline','styles-028a')+'-'+style};for(const key of ['settings','published']){const settings={...JSON.parse(row[key]),siteStyle:style};delete settings.generationManifest;r[key]=JSON.stringify(settings)}const keys=Object.keys(r);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();fixture.push({kit:JSON.parse(r.settings).designKit,style,id:r.id,slug:r.slug})}
const source=fs.readFileSync(root+'/tests/roofing-acceptance.mjs','utf8'),fixtureString=source.slice(source.indexOf('const settings=')+15,source.indexOf('\nconst {tenant}='));
const settings=Function('return ('+fixtureString.trim().replace(/;$/,'')+')')();
for(const style of ['current','bold','fresh','classic']){const {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'roofing-styles-028a-'+style,settings:{...settings,name:'QA Roofing Styles',siteStyle:style}});await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});fixture.push({kit:'roofing-complete',style,id:tenant.id,slug:tenant.slug})}
fs.writeFileSync(out+'/fixtures.json',JSON.stringify(fixture,null,2));
await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('styles-owner',fixture.find(f=>f.kit==='roofing-complete'&&f.style==='current').id,'styles-owner','styles-owner@example.test','owner',new Date().toISOString()).run();
await listen(runtime,8184);console.log('028A isolated QA server ready on '+base);
