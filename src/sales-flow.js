import {uid,now,text,must,one,all,run,body,identity,access,settings,DEFAULT,tenantView,log} from './core.js';
import {kits,kitDefaults} from './design-kits.js';
import specialties from '../public/trade-library.json' with {type:'json'};

const decode=row=>row?{...row,data:JSON.parse(row.data)}:null;
const interests=['Website Design','Buildovate CRM','Marketing'];

export async function afterBooking(env,scope,id,user,previousContactId=''){
 if(scope!=='global')return;
 const appointment=decode(await one(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind='calendar' AND id=?",id));
 if(!appointment?.data.contactId||appointment.data.eventType==='callback')return;
 if(previousContactId&&previousContactId!==appointment.data.contactId)await run(env,"DELETE FROM workspace_records WHERE id=? AND scope='global' AND kind='design_task' AND json_extract(data,'$.appointmentId')=?",'design-'+previousContactId,id);
 const contact=decode(await one(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind IN ('contacts','leads') AND id=?",appointment.data.contactId));
 if(!contact)return;
 const taskId='design-'+contact.id;
 if(appointment.data.status==='Cancelled'||appointment.data.status==='No-show'||!appointment.data.interests?.includes('Website Design')){
  await run(env,"DELETE FROM workspace_records WHERE id=? AND scope='global' AND kind='design_task' AND json_extract(data,'$.appointmentId')=?",taskId,id);
  return;
 }
 const data={contactId:contact.id,appointmentId:id,title:'Prepare website for '+(contact.data.company||contact.data.name),status:contact.data.tenantId?'Design linked':'Ready to design',dueAt:appointment.data.start,assignees:appointment.data.assignees||[]};
 const stamp=now();
 await run(env,"INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,'global','design_task',?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,version=workspace_records.version+1,updated_at=excluded.updated_at",taskId,JSON.stringify(data),stamp,stamp);
 await log(env,user,null,'design.task.prepared',contact.id);
}

export async function salesFlowApi(req,env,url){
 if(!url.pathname.startsWith('/api/flow/'))return null;
 const path=url.pathname.slice('/api/flow/'.length),user=await identity(req,env);
 must(user.staff,'Buildovate staff access required.',403);
 if(req.method!=='GET')must(req.headers.get('origin')===url.origin,'Invalid request origin.',403);
 if(path==='tasks'&&req.method==='GET')return {records:(await all(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind='design_task' ORDER BY updated_at DESC")).map(decode)};
 if(path==='link-website'&&req.method==='POST'){
  must(user.admin,'Administrator access required.',403);
  const v=await body(req),contact=decode(await one(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind IN ('contacts','leads') AND id=?",text(v.contactId,100))),tenant=await one(env,'SELECT id FROM tenants WHERE id=?',text(v.tenantId,100));
  must(contact&&tenant,'Select an existing contact and website.',404);
  const result=await run(env,"UPDATE workspace_records SET data=json_set(data,'$.tenantId',?),version=version+1,updated_at=? WHERE id=? AND scope='global' AND version=?",tenant.id,now(),contact.id,v.version);
  must(result.meta.changes,'Contact changed. Reopen before linking.',409);
  await log(env,user,tenant.id,'customer.website.linked',contact.id);
  return {tenantId:tenant.id};
 }
 const design=path.match(/^design\/([^/]+)$/);
 if(design&&req.method==='POST'){
  const contact=decode(await one(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind IN ('contacts','leads') AND id=?",design[1]));
  must(contact,'Contact not found.',404);
  if(contact.data.tenantId){await access(req,env,contact.data.tenantId);return {tenant:tenantView(await one(env,'SELECT * FROM tenants WHERE id=?',contact.data.tenantId))}}
  const v=await body(req),kit=kits[v.kit];must(kit&&(!contact.data.trade||kit.trade===contact.data.trade),'Choose a design for this contact’s trade.');
  const tenantId='lead-'+contact.id,existing=await one(env,'SELECT * FROM tenants WHERE id=?',tenantId);
  if(existing)return {tenant:tenantView(existing)};
  const offered=(specialties[kit.trade]||[]).slice(0,8).map(name=>({name,description:''}));
  const draft=settings({...DEFAULT,...kitDefaults(kit.id,{name:contact.data.company||contact.data.name,owner:contact.data.name||'',phone:contact.data.phone||'',email:contact.data.email||'',area:contact.data.city||'',services:offered}),phone:contact.data.phone||'',email:contact.data.email||'',owner:contact.data.name||'',showDemoProjects:true});
  const slug=(contact.data.company||contact.data.name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)+'-'+contact.id.slice(-8),stamp=now();
  const inserted=await run(env,'INSERT OR IGNORE INTO tenants(id,slug,name,settings,created_at,updated_at) VALUES(?,?,?,?,?,?)',tenantId,slug,draft.name,JSON.stringify(draft),stamp,stamp);
  must(inserted.meta.changes,'A website with this address already exists.',409);
  if(!user.admin)await run(env,'INSERT OR IGNORE INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)',uid(),tenantId,user.id,user.email,'editor',stamp);
  await run(env,"UPDATE workspace_records SET data=json_set(data,'$.tenantId',?,'$.designStatus','In preparation'),version=version+1,updated_at=? WHERE id=? AND scope='global'",tenantId,stamp,contact.id);
  await run(env,"UPDATE workspace_records SET data=json_set(data,'$.status','Design linked','$.tenantId',?),version=version+1,updated_at=? WHERE id=? AND kind='design_task'",tenantId,stamp,'design-'+contact.id);
  await log(env,user,tenantId,'website.preparation.started',contact.id);
  return {tenant:tenantView(await one(env,'SELECT * FROM tenants WHERE id=?',tenantId))};
 }
 const stage=path.match(/^stage\/([^/]+)$/);
 if(stage&&req.method==='POST'){
  const v=await body(req),value=text(v.stage,20);must(['Built','Shown'].includes(value),'Choose Built or Shown.');
  const contact=decode(await one(env,"SELECT * FROM workspace_records WHERE scope='global' AND kind IN ('contacts','leads') AND id=?",stage[1]));must(contact,'Contact not found.',404);
  must(contact.version===v.version,'Contact changed. Reopen before updating.',409);
  must(contact.data.tenantId,'Prepare or link the website first.',409);
  await access(req,env,contact.data.tenantId,'write');
  const data={...contact.data,stage:value,stageHistory:[...(contact.data.stageHistory||[]),{from:contact.data.stage,to:value,at:now(),by:user.email}].slice(-100)};
  const result=await run(env,"UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND scope='global' AND version=?",JSON.stringify(data),now(),contact.id,contact.version);
  must(result.meta.changes,'Contact changed. Reopen before updating.',409);
  await log(env,user,contact.data.tenantId,'contact.stage.'+value.toLowerCase(),contact.id);
  return {ok:true};
 }
 must(false,'Not found.',404);
}
