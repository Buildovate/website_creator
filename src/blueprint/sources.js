import {readReviewResponse} from './review-evidence.js';
import {createDependencies} from './deps.js';
import {evaluateProgress} from './progress.js';
const parse=value=>typeof value==='string'?JSON.parse(value):value||{};
const text=v=>typeof v==='string'&&v.trim().length>0;
const unavailable=(dataSource,reason,state='not_available')=>({state,dataSource,reason});
const available=(dataSource,value)=>({state:'available',dataSource,...value});

/** Internal server service. Caller must have tenant read access; use progressForRequest
 * at any future route boundary. Every query and owner contract is tenant-scoped.
 * No network, credentials, generation, writes, or invented persisted record kinds.
 */
export async function readProgressSources(env,tenantId,{deps=createDependencies({database:env.DB})}={}){
 if(!text(tenantId))throw new TypeError('A tenant ID is required.');
 const first=(sql,...args)=>env.DB.prepare(sql).bind(...args).first();
 const tenant=await first('SELECT id,settings,published,status FROM tenants WHERE id=?',tenantId);
 if(!tenant)throw new Error('Website not found.');
 const s=parse(tenant.settings),platform=s.platform||{};
 const sales=await first('SELECT data FROM sales WHERE tenant_id=?',tenantId);
 const chat=await first("SELECT data FROM workspace_records WHERE id=? AND scope=? AND kind='chat_config'",'chat-'+tenantId,tenantId);
 const inquiries=await first('SELECT COUNT(*) AS n FROM inquiries WHERE tenant_id=?',tenantId);
 const [plan,domain]=await Promise.all([deps.getPlan(tenantId),deps.getDomainStatus(tenantId)]);
 const fields=Object.fromEntries(['name','phone','trade','area'].map(id=>[id,{value:s[id]||'',saved:true,origin:'saved',confirmed:platform.questionnaire?.factsConfirmed===true}]));
 // Normalized questionnaire confirmation is the existing owner confirmation gate.
 // Found facts will need per-field confirmation when G-4 adds their source records.
 const authored=(s.websitePages?.pages||[]).filter(p=>p.enabled!==false),required=['home','about','faq'],drafts=[];
 if(text(s.hero)&&text(s.intro))drafts.push('home');
 for(const kind of ['about','faq'])if(authored.some(p=>p.kind===kind&&text(p.title)&&text(p.intro)))drafts.push(kind);
 for(const service of s.services||[]){const id='service:'+service.name;required.push(id);if(authored.some(p=>p.kind==='service'&&p.serviceName===service.name&&text(p.title)&&text(p.intro)))drafts.push(id);}
 for(const p of authored.filter(p=>p.kind==='city')){const id='city:'+p.id;required.push(id);if(text(p.title)&&text(p.intro))drafts.push(id);}
 if(!(s.services||[]).length)required.push('service:choose-a-service');
 const approval=sales?parse(sales.data):{},alerts=chat?parse(chat.data):{},fin=platform.financing||{};
 const review=s.reviews||{};
 return {
  onboarding:available('tenants.settings + platform.questionnaire.factsConfirmed',{fields}),
  pages:available('tenants.settings.websitePages + sales.data.ownerApproved/approvalNote',{required,drafts,approval:{approved:approval.ownerApproved===true,reference:approval.approvalNote||''}}),
  reviews:await readReviewResponse(env,tenantId,s),
  estimator:unavailable('No estimator field/consent configuration or minimum-item price book in BASE','Not available yet'),
  promotions:available('tenants.settings.platform.promotions.offers',{offers:platform.promotions?.offers||[],choice:null}),
  financing:available('tenants.settings.platform.financing + src/platform/lender-adapter.ts',{selection:fin.selection||null,lenders:(fin.lenders||[]).map(l=>({id:l.id,selected:l.enabled===true,connection:'not_connected'}))}),
  leads:available('workspace_records: chat_config phone verification (src/engagement.js)',{alerts:{enabled:alerts.enabled===true&&alerts.smsEnabled===true,phone:alerts.phone||'',phoneVerified:alerts.phoneVerified===true},crm:{state:'not_connected'}}),
  launch:available('src/entitlements.js + src/domain/state.js + tenants published snapshot',{plan,domain,published:tenant.status==='published'&&!!tenant.published}),
  marketing:unavailable('No connected social-channel, explicit-none or social-publication records in BASE','Not available yet. Saved social links are not connected accounts.'),
  activity:{inquiries:Number(inquiries?.n||0),newReviews:null,reason:'New review events are not recorded; a public rating count is not a new-review count.'}
 };
}
/** Read-only route boundary for G-2/G-6; reuse existing identity/membership checks. */
export async function progressForRequest(req,env,tenantId){
 const {access}=await import('../core.js');
 await access(req,env,tenantId,'read',{readOnly:true});
 return evaluateProgress(await readProgressSources(env,tenantId));
}
