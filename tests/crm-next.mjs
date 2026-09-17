import assert from 'node:assert/strict';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function req(path,method='GET',data,user=admin){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:data?JSON.stringify(data):undefined}),env)}
async function api(path,method='GET',data,user=admin){const r=await req(path,method,data,user);assert.equal(r.status,200,await r.clone().text());return r.json()}
const base='/api/workspace/global/contacts';
let a=await api(base,'POST',{data:{company:'Test Roofing',name:'A',email:'a@example.test',phone:'+1 (805) 555-0100',city:'Oxnard',assignees:[admin.email]}});assert.ok(a.id);
assert.equal((await req('/api/workspace/global/leads','POST',{data:{name:'Duplicate phone',phone:'8055550100'}})).status,409);
assert.equal((await req(base,'POST',{data:{name:'Duplicate email',email:'A@example.test'}})).status,409);
assert.equal((await req(base,'POST',{data:{company:'TEST roofing',city:'OXNARD'}})).status,409);
let imported=await api(base+'/import','POST',{rows:[{name:'Skip existing',phone:'805-555-0100'},{name:'New',email:'new@example.test',custom:{Budget:'3000'}},{name:'Skip batch duplicate',email:'NEW@example.test'}]});assert.equal(imported.imported,1);assert.equal(imported.skipped,2);
let r=(await api(base+'/'+a.id)).record;await api(base+'/'+a.id+'/no-answer','POST',{version:r.version});assert.equal((await req(base+'/'+a.id+'/no-answer','POST',{version:r.version})).status,409);r=(await api(base+'/'+a.id)).record;assert.equal(r.data.callAttempts,1);assert.equal(r.data.stage,'Called');assert.equal(r.data.calls[0].by,admin.email);assert.ok(r.data.lastCallAt);
assert.equal((await req(base+'/'+a.id,'PUT',{version:r.version,data:{...r.data,assignees:['stranger@example.test']}})).status,400);
await api(base+'/'+a.id,'PUT',{version:r.version,data:{...r.data,stage:'Paid',program:'Growth',upsell:'Proposed',dealValue:1500}});r=(await api(base+'/'+a.id)).record;assert.ok(r.data.wonAt);assert.equal(r.data.callAttempts,1);assert.equal(r.data.stageHistory[0].to,'Paid');
const config=await api('/api/crm/global/settings');await api('/api/crm/global/settings','PUT',{version:config.version,data:{columns:[{key:'company',label:'Business',visible:true},{key:'custom:Budget',label:'Budget',visible:true}],calendarFields:[{key:'field_purpose',label:'Purpose',type:'radio',options:['Demo','Kickoff'],required:true}]}});
assert.equal((await req('/api/crm/global/settings','PUT',{version:0,data:{}})).status,409);
const appointment={title:'Demo call',contactId:a.id,assignees:[admin.email],start:'2026-11-02T18:00:00Z',end:'2026-11-02T19:00:00Z',timezone:'America/Los_Angeles',status:'Scheduled',answers:{field_purpose:'Demo'},location:'https://zoom.us/j/123456789'};
await api('/api/workspace/global/calendar','POST',{data:appointment});assert.equal((await req('/api/workspace/global/calendar','POST',{data:appointment})).status,409);
assert.equal((await req('/api/workspace/global/calendar','POST',{data:{...appointment,start:'2026-11-03T18:00:00Z',end:'2026-11-03T19:00:00Z',answers:{field_purpose:'Invalid'}}})).status,400);
const paybase='/api/workspace/global/payments';let p=await api(paybase,'POST',{data:{type:'Agreement',title:'Site agreement',customer:'Test Roofing',contactId:a.id,amount:1000,description:'Scope of work documented here.',terms:'Reviewed delivery terms.'}});await api(paybase+'/'+p.id+'/publish','POST',{version:1});let doc=(await api(paybase+'/'+p.id)).record;let page=await req('/proposal/'+doc.data.token);assert.ok((await page.text()).includes('sign electronically'));
assert.equal((await req('/proposal/'+doc.data.token,'POST',{approved:true,name:'Test Customer',version:1})).status,409);
await api('/proposal/'+doc.data.token,'POST',{approved:true,name:'Test Customer',version:doc.version});doc=(await api(paybase+'/'+p.id)).record;assert.equal(doc.data.approval.documentHash.length,64);assert.equal((await req(paybase+'/'+p.id+'/unpublish','POST',{version:doc.version})).status,409);assert.equal((await req(paybase+'/'+p.id,'PUT',{version:doc.version,data:doc.data})).status,400);
const stranger={id:'stranger',email:'stranger@example.test'};assert.equal((await req(base,'GET',null,stranger)).status,403);assert.equal((await req(base+'/'+a.id,'DELETE',{version:r.version},stranger)).status,403);
const t=(await api('/api/tenants')).tenants[0];assert.equal((await req('/api/workspace/'+t.id+'/contacts/'+a.id)).status,404);
await api('/api/session');const team=await api('/api/team');assert.ok(team.members.find(x=>x.email===admin.email).lastSeen);
assert.equal((await api('/api/crm/global/demo','POST',{once:true})).added,7);assert.equal((await api('/api/crm/global/demo','POST',{once:true})).added,0);
await api(base+'/'+a.id,'DELETE',{version:r.version});assert.equal((await req(base+'/'+a.id)).status,404);assert.equal((await api(paybase+'/'+p.id)).record.data.contactId,a.id);
console.log('PASS CRM refresh: cross-kind normalized dedup, batch duplicate skipping, versioned call logs, assignment validation, stage/program history, field configuration, calendar overlap/custom answers, signed document hash and immutable approval, tenant isolation, deletion, idempotent demo seeding and authenticated last-seen.');
