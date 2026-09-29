import {hash} from './review-packet-utils.js';
import {coreSitemapPaths} from './core-site-pages.js';
import {demoProjects} from './crm.js';
import {normalizePlatform} from './platform/constitution.ts';
import {ebookAvailable} from './ebook/settings.js';
import {stable} from './platform/generation.ts';
import library from '../public/trade-media-library.json' with {type:'json'};
import {must,body,identity,access,now,log} from './core.js';

export const REVIEW_PACKET_VERSION=1;
export const REVIEW_SNAPSHOT_LABEL='Reviews shown at time of review — live reviews may differ.';
export const REVIEW_CHECKLIST=[
 'One clear primary conversion goal','Hero has a headline, qualifying introduction and action','Headline states the offered work and a useful benefit','Introduction explains who and how in plain words','Primary action is visually clear','Actions use a meaningful verb and value','Optional click-trigger copy is factual or omitted','Trust signals are supplied facts','Problems and signs precede detailed features where relevant','Benefits lead the service explanation','Reviews are attributed or honestly omitted','Images add relevant context without false project claims','Section rhythm encourages continued reading','Final action has a different supporting point','Headings and paragraphs are scannable','Visual emphasis supports the important content','Motion is subtle, with a static fallback','Phone actions and contact details are usable','No invented ratings, years, licenses or guarantees','No prohibited product names or price claims','Media ownership and Sample status are accurately represented','Headlines are positive and specific','Actions support the page conversion goal','Overall contrast, spacing and hierarchy are coherent'
].map((text,i)=>({id:'playbook-'+String(i+1).padStart(2,'0'),text,source:'docs/product/CONVERSION-PLAYBOOK.md#6-pass--fail-checklist-screenshot-review'}));
let renderSite;
export const configureReviewRenderer=fn=>{renderSite=fn};
const parse=v=>typeof v==='string'?JSON.parse(v):v;
const read=async(env,sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results;
const prefix=(id,version)=>'review-packets/'+encodeURIComponent(id)+'/'+version+'/';
export async function reviewState(env,id,target='website'){
 must(target==='website'||/^(project|pages|forms|blog|visibility):[a-z0-9-]+$/i.test(target),'Invalid publication target.');
 const tenant=await env.DB.prepare('SELECT * FROM tenants WHERE id=?').bind(id).first();must(tenant,'Website not found.',404);
 const settings=parse(tenant.settings);
 const projects=await read(env,'SELECT id,data,published,version FROM projects WHERE tenant_id=? ORDER BY id',id);
 const photos=await read(env,'SELECT id,project_id,object_key,caption,stage,bytes FROM photos WHERE tenant_id=? ORDER BY id',id);
 const workspace=await read(env,"SELECT id,kind,data,published,version FROM workspace_records WHERE scope=? AND kind IN ('pages','forms','blog','chat_config','visibility','plan') ORDER BY id",id);
 // Full content, not only the legacy manifest's design digest. Separate content
 // records invalidate approvals even if a tenant row version did not advance.
 const source={schema:REVIEW_PACKET_VERSION,renderContract:'028E.1',siteId:id,slug:tenant.slug,target,settings,publishedSettings:target==='website'?null:parse(tenant.published||'null'),projects,photos,workspace};
 if(target!=='website'){const [kind,recordId]=target.split(':');must((kind==='project'?projects:workspace).some(r=>r.id===recordId&&(kind==='project'||r.kind===kind)),'Publication target not found.',404)}
 return {tenant,source,versionHash:await hash(stable(source)),manifestHash:await hash(stable(settings.generationManifest||null))};
}
function effectiveSource(source){
 const view=structuredClone(source);
 if(source.target!=='website'){
  view.settings=source.publishedSettings||source.settings;const [kind,id]=source.target.split(':');
  const record=(kind==='project'?view.projects:view.workspace).find(r=>r.id===id);
  const data=parse(record.data);
  if(kind==='project')data.photoIds=source.photos.filter(p=>p.project_id===id).map(p=>p.id);
  record.published=JSON.stringify(data);
 }
 return view;
}
function publishedView(env,state){
 const view=effectiveSource(state.source),tenant={...state.tenant,status:'published',published:JSON.stringify(view.settings)};
 const [kind,recordId]=state.source.target.split(':');
 const replacement=kind==='website'?null:(kind==='project'?view.projects:view.workspace).find(r=>r.id===recordId);
 const revise=(sql,row)=>row&&replacement&&row.id===recordId&&new RegExp('FROM '+(kind==='project'?'projects':'workspace_records')+'\\b','i').test(sql)?{...row,published:replacement.published}:row;
 const DB={prepare(sql){
  // Include a newly published project in queries that normally filter it out.
  const query=kind==='project'&&/FROM projects/i.test(sql)?sql.replace(/published IS NOT NULL/gi,"(published IS NOT NULL OR id='"+recordId+"')"):sql;
  const statement=env.DB.prepare(query);
  return {bind(...args){const bound=statement.bind(...args);return {
   async first(...rest){if(/FROM tenants WHERE (?:slug|id)=\?/i.test(sql)&&args[0]===(/WHERE slug=/i.test(sql)?tenant.slug:tenant.id))return {...tenant};const row=await bound.first(...rest);if(row&&replacement&&args.includes(recordId)&&new RegExp('FROM '+(kind==='project'?'projects':'workspace_records')+'\\b','i').test(sql))return {...row,published:replacement.published};return row},
   async all(...args){const result=await bound.all(...args);return {...result,results:result.results.map(row=>revise(sql,row))}},
   run(){throw Error('Review rendering cannot write data')}
  }}}
 }};
 return {...env,DB,REVIEW_ISOLATED:true,OPENAI_API_KEY:'',TWILIO_ACCOUNT_SID:'',TWILIO_AUTH_TOKEN:''};
}
export function reviewPaths(source){
 const view=effectiveSource(source),s=view.settings,base='/s/'+source.slug,paths=new Set(coreSitemapPaths(s).map(x=>base+x));
 const plan=view.workspace.find(r=>r.kind==='plan'),features=plan?parse(plan.data).features||{}:{};
 if(features.pages===false)paths.delete(base+'/blog');
 const platform=normalizePlatform(s.platform);
 if(platform.financing.enabled)paths.add(base+'/financing');
 if(platform.promotions.enabled&&(s.trade==='Roofing'||platform.promotions.offers.some(x=>x.enabled)))paths.add(base+'/promotions');
 if(s.pricing?.enabled===false)paths.delete(base+'/pricing');
 for(const kind of ['about','faq'])if(s.trade!=='Roofing'&&s.websitePages?.pages?.some(p=>p.kind===kind))paths.delete(base+'/'+kind);
 if(ebookAvailable(s))paths.add(base+'/resources/before-you-decide-on-your-roof');
 for(const p of demoProjects({published:JSON.stringify(s)},view.projects,false))paths.add(base+'/projects/'+p.id);
 for(const row of view.workspace){if(!row.published)continue;const d=parse(row.published);if(row.kind==='pages'&&d.slug&&features.pages!==false)paths.add(base+'/pages/'+d.slug);if(row.kind==='blog'&&d.slug&&features.pages!==false)paths.add(base+'/blog/'+d.slug);if(row.kind==='forms'&&d.active&&features.forms!==false)paths.add(base+'/forms/'+row.id)}
 return [...paths].sort();
}
function publicationTargets(source){return [{id:'website',label:'Website settings and generated pages'},...source.projects.map(r=>({id:'project:'+r.id,label:'Project: '+(parse(r.data).title||r.id)})),...source.workspace.filter(r=>['pages','forms','blog','visibility'].includes(r.kind)).map(r=>({id:r.kind+':'+r.id,label:r.kind+': '+(parse(r.data).title||parse(r.data).name||r.id)}))]}
export const usedReviewClips=pages=>[...new Set(pages.flatMap(p=>[...p.html.matchAll(/<video\b[\s\S]*?<\/video>/g)].map(m=>m[0].match(/(?:data-src|src)="([^"]+\.(?:mp4|webm)(?:\?[^"]*)?)"/)?.[1]).filter(Boolean)))].sort();
const refs=html=>[...html.matchAll(/\/(?:assets|media)\/[A-Za-z0-9_./%-]+/g)].map(x=>x[0]);
export function packetMedia(pages,settings){
 const used=new Set(pages.flatMap(p=>refs(p.html))),entries=Object.values(library.assets||{});
 return [...used].sort().map(url=>{const a=entries.find(x=>[x.url,x.poster?.url,x.path].some(ref=>ref?.split('?')[0]===url));return {url,kind:/\.(mp4|webm)$/i.test(url)?'clip':'still',origin:url.startsWith('/media/')?'contractor-provided':'library',isSample:url.startsWith('/media/')?false:a?.isSample??true,assetId:a?.id||null,approvalStatus:a?.approvalStatus||'Unrecorded in approved library',rights:a?.rights||null,source:a?.source||null,approver:a?.approver||null}});
}
const assetType=file=>file.endsWith('.png')?'image/png':file.endsWith('.html')?'text/html; charset=utf-8':'application/json';
async function put(env,key,value,type='application/json'){await env.BUCKET.put(key,value,{httpMetadata:{contentType:type}})}
async function packetAt(env,id,version){const object=await env.BUCKET.get(prefix(id,version)+'packet.json');return object?JSON.parse(await object.text()):null;}
async function decisionAt(env,id,version){const row=await env.DB.prepare("SELECT data FROM workspace_records WHERE id=? AND scope=? AND kind='review_approval'").bind('review-'+version,id).first();return row?parse(row.data):null;}
export async function reviewStatus(env,id,target='website'){const state=await reviewState(env,id,target);return {target,targets:publicationTargets(state.source),versionHash:state.versionHash,manifestHash:state.manifestHash,packet:await packetAt(env,id,state.versionHash),decision:await decisionAt(env,id,state.versionHash),captureConnected:typeof env.REVIEW_CAPTURE==='function'};}
export async function prepareReviewPacket(env,id,{force=false,target='website'}={}){
 const state=await reviewState(env,id,target),old=await packetAt(env,id,state.versionHash);
 if(old&&!force)return old;
 must(renderSite,'Review renderer is unavailable.',503);
 const isolated=publishedView(env,state),origin='http://review.local',pages=[];
 let reviewSnapshot=old?.reviewSnapshot||null,reviewRead;
 const evidenceReviews=async path=>{if(!reviewSnapshot){if(!reviewRead)reviewRead=(async()=>{const response=await renderSite(new Request(origin+path),isolated);const payload=await response.json();reviewSnapshot={label:REVIEW_SNAPSHOT_LABEL,capturedAt:now(),status:response.status,payload};})();await reviewRead;}return Response.json(reviewSnapshot.payload,{status:reviewSnapshot.status})};
 for(const path of reviewPaths(state.source)){const response=await renderSite(new Request(origin+path),isolated);must(response.ok,'Cannot capture '+path+': HTTP '+response.status,409);must(response.headers.get('content-type')?.includes('text/html'),'Expected an HTML review page: '+path,409);pages.push({path,html:await response.text()})}
 const files=[];let n=0;for(const p of pages){p.id='page-'+String(++n).padStart(3,'0');p.file='pages/'+p.id+'.html';const bytes=new TextEncoder().encode(p.html);files.push({path:p.file,sha256:await hash(bytes),bytes:bytes.length,type:assetType(p.file)});await put(env,prefix(id,state.versionHash)+p.file,bytes,assetType(p.file))}
 const s=effectiveSource(state.source).settings;
 const packet={schema:REVIEW_PACKET_VERSION,target,siteId:id,slug:state.tenant.slug,name:s.name,versionHash:state.versionHash,manifestHash:state.manifestHash,generatedAt:now(),status:'Pending capture',captureMessage:typeof env.REVIEW_CAPTURE==='function'?'Capturing local screenshots and clip frames.':'Local screenshot capture is not connected. Publishing is blocked.',pages:pages.map(({html,...p})=>p),expectedClips:usedReviewClips(pages),clips:[],claims:[],checklist:REVIEW_CHECKLIST.map(x=>({...x,result:'Needs staff review'})),choices:{style:s.uniqueness?.style||s.siteStyle||'current',sections:s.uniqueness?.sections||s.sectionVariants||{},copy:s.uniqueness?.copy||{},media:s.mediaPicks||null},media:packetMedia(pages,s),content:{sampleFixture:/^Sample Fictional\b/.test(s.name),businessFacts:/^Sample Fictional\b/.test(s.name)?'Sample fictional fixture':'contractor-provided',authoredCopy:s.uniqueness?'authored templates filled from contractor facts':'existing saved copy',sampleMedia:packetMedia(pages,s).filter(x=>x.isSample).map(x=>x.url)},files};
 await put(env,prefix(id,state.versionHash)+'source.json',stable(state.source));await put(env,prefix(id,state.versionHash)+'packet.json',stable(packet));
 if(typeof env.REVIEW_CAPTURE!=='function')return packet;
 const capture=async()=>{try{
  const result=await env.REVIEW_CAPTURE({packet,pages,fetch:async path=>{if(path.split('?')[0]==='/api/public/'+state.tenant.slug+'/reviews')return evidenceReviews(path);must(/^\/(assets|media)\//.test(path)||path.startsWith('/api/public/'+state.tenant.slug+'/')||/^\/[a-z0-9_.-]+(?:\?.*)?$/i.test(path),'Capture resource is outside this website.',403);return renderSite(new Request(origin+path),isolated)}});
  must((await reviewState(env,id,target)).versionHash===state.versionHash,'Content changed during capture. Capture the latest version.',409);
  must(result.pages?.length===pages.length&&result.files?.length,'Capture returned incomplete evidence.',409);
  const captured=[];for(const file of result.files){must(/^(screenshots|frames)\/[a-z0-9_.-]+\.png$/i.test(file.path),'Invalid captured filename.',409);const data=new Uint8Array(file.data);must(data.length>24&&data[0]===137&&data[1]===80&&data[2]===78&&data[3]===71,'Capture must provide PNG evidence.',409);await put(env,prefix(id,state.versionHash)+file.path,data,'image/png');captured.push({path:file.path,sha256:await hash(data),bytes:data.length,type:'image/png'})}
  packet.reviewSnapshot=reviewSnapshot||{label:REVIEW_SNAPSHOT_LABEL,capturedAt:now(),status:200,payload:{providers:[],note:'No reviews section is displayed in this version.'}};packet.pages=result.pages;packet.clips=result.clips;packet.claims=result.claims;packet.checklist=result.checklist;packet.files.push(...captured);packet.status='Complete';packet.captureMessage='Screenshots, clip frames and checklist are ready for staff review.';packet.completedAt=now();
  validatePacket(packet);
 }catch(error){packet.status='Capture failed';packet.captureMessage=String(error.message||error)}
 await put(env,prefix(id,state.versionHash)+'packet.json',stable(packet));return packet;};
 if(env.REVIEW_QUEUE){env.REVIEW_QUEUE(id+':'+state.versionHash,capture);return packet}
 return capture();
}
export function validatePacket(packet){
 must(packet.status==='Complete'&&packet.pages.length>0,'Complete the review packet before approval.',409);
 const files=new Set(packet.files.map(f=>f.path));
 for(const p of packet.pages)for(const width of [1440,390])must(files.has(p.screenshots?.[width]),'A page screenshot is missing.',409);
 must(Array.isArray(packet.expectedClips)&&packet.expectedClips.every(url=>packet.clips.some(c=>c.url===url)),'A used clip is missing from the packet.',409);
 for(const c of packet.clips)for(const pct of [0,25,50,75,100])must(files.has(c.frames?.[pct]),'A clip frame is missing.',409);
 must(packet.checklist.length===REVIEW_CHECKLIST.length&&REVIEW_CHECKLIST.every(c=>packet.checklist.some(x=>x.id===c.id)),'Checklist is incomplete.',409);
 return true;
}
async function verifyPacketFiles(env,id,version,packet){for(const file of packet.files){const object=await env.BUCKET.get(prefix(id,version)+file.path);must(object&&await hash(await new Response(object.body).arrayBuffer())===file.sha256,'Review evidence is missing or changed. Rebuild the packet.',409)}}
// Compare the approved content in the same statement that publishes it. This
// also catches a page/project/photo edit while the backup was being written.
function publicationGuard(state){
 const id=state.source.siteId,clauses=["EXISTS (SELECT 1 FROM tenants WHERE id=? AND settings=? AND COALESCE(published,'')=COALESCE(?,''))"],args=[id,state.tenant.settings,state.tenant.published];
 for(const [table,scope,rows,columns,extra]of [
  ['projects','tenant_id',state.source.projects,['id','data','published','version'],''],
  ['photos','tenant_id',state.source.photos,['id','project_id','object_key','caption','stage','bytes'],''],
  ['workspace_records','scope',state.source.workspace,['id','kind','data','published','version']," AND kind IN ('pages','forms','blog','chat_config','visibility','plan')"]
 ]){
  clauses.push('(SELECT COUNT(*) FROM '+table+' WHERE '+scope+'=?'+extra+')=?');args.push(id,rows.length);
  for(const row of rows){clauses.push('EXISTS (SELECT 1 FROM '+table+' WHERE '+scope+'=? AND '+columns.map(key=>row[key]===null?key+' IS NULL':key+'=?').join(' AND ')+')');args.push(id,...columns.filter(key=>row[key]!==null).map(key=>row[key]));}
 }
 return {sql:clauses.join(' AND '),args};
}
export async function requireReviewApproval(env,id,target='website'){
 const status=await reviewStatus(env,id,target);validatePacket(status.packet||{});
 must(status.decision?.decision==='approve'&&status.decision.versionHash===status.versionHash,'Staff must approve the review packet for this exact version before publishing.',409);
 await verifyPacketFiles(env,id,status.versionHash,status.packet);
 const state=await reviewState(env,id,target);must(state.versionHash===status.versionHash,'Content changed while checking approval. Reload and review the latest version.',409);return {...publicationGuard(state),versionHash:state.versionHash};
}
export async function reviewPacketApi(req,env,url){
 const route=url.pathname.match(/^\/api\/tenants\/([^/]+)\/review-packet(?:\/(decision|file))?$/);if(!route)return null;
 const id=route[1],target=url.searchParams.get('target')||'website',user=await identity(req,env);await access(req,env,id);must(user.staff,'Staff access is required to review websites.',403);
 if(route[2]==='file'){
  must(req.method==='GET','Method not supported.',405);const version=url.searchParams.get('version'),file=url.searchParams.get('path');must(/^[a-f0-9]{64}$/.test(version||'')&&/^(?:packet\.json|source\.json|approval\.json|(?:pages|screenshots|frames)\/[a-z0-9_.-]+\.(?:html|png))$/.test(file||''),'Invalid evidence reference.');
  const object=await env.BUCKET.get(prefix(id,version)+file);must(object,'Evidence not found.',404);return new Response(object.body,{headers:{'content-type':assetType(file),'cache-control':'private, no-store','x-content-type-options':'nosniff','content-security-policy':"sandbox; default-src 'none'",'content-disposition':file.endsWith('.html')?'attachment; filename="'+file.split('/').at(-1)+'"':'inline'}});
 }
 if(req.method==='GET')return reviewStatus(env,id,target);
 must(req.method==='POST'&&req.headers.get('origin')===url.origin,'Invalid request origin.',403);const v=await body(req),state=await reviewState(env,id,target);must(v.versionHash===state.versionHash,'This version changed. Review the latest packet.',409);
 if(route[2]==='decision'){
  must(['approve','reject'].includes(v.decision),'Choose approve or reject.');const reason=String(v.reason||'').trim().slice(0,2000);must(v.decision!=='reject'||reason,'Add a reason for rejection.');
  const packet=await packetAt(env,id,state.versionHash);validatePacket(packet||{});
  if(v.decision==='approve'){await verifyPacketFiles(env,id,state.versionHash,packet);must(Array.isArray(v.checkedItems)&&REVIEW_CHECKLIST.every(x=>v.checkedItems.includes(x.id)),'Review every checklist item before approval.');must(!packet.checklist.some(x=>x.result==='Fail'),'Resolve failed checklist items before approval.',409)}
  must((await reviewState(env,id,target)).versionHash===state.versionHash,'Content changed during review. Reload the latest version.',409);
  const decision={target,approver:{id:user.id,email:user.email},timestamp:now(),versionHash:state.versionHash,manifestHash:state.manifestHash,decision:v.decision,reason,checkedItems:v.decision==='approve'?REVIEW_CHECKLIST.map(x=>x.id):[]};
  const stamp=now();await env.DB.prepare("INSERT INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,'review_approval',?,1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,version=workspace_records.version+1,updated_at=excluded.updated_at").bind('review-'+state.versionHash,id,stable(decision),stamp,stamp).run();await put(env,prefix(id,state.versionHash)+'approval.json',stable(decision));await log(env,user,id,'review.'+v.decision,stable(decision));return {decision};
 }
 return {packet:await prepareReviewPacket(env,id,{force:true,target})};
}
