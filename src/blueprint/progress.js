/** Pure progress rules over evidence from sources.js. No I/O, clock, or persistence.
 * Only the server-side source reader should provide these facts to production UI.
 * An available source means its record contract exists, not that a quest is done.
 */
const text=v=>typeof v==='string'&&v.trim().length>0;
const list=v=>Array.isArray(v)?v:[];
const phone=v=>typeof v==='string'&&v.replace(/\D/g,'').length>=10&&v.replace(/\D/g,'').length<=15;
const field=f=>!!(f?.saved===true&&text(f.value)&&f.confirmed===true&&['contractor','saved','found'].includes(f.origin));
const sourceLabel={onboarding:'tenants.settings',pages:'tenants.settings.websitePages + sales owner approval',reviews:'saved profiles; live display evidence unavailable',estimator:'estimator configuration and price book unavailable',promotions:'tenants.settings.platform.promotions',financing:'tenants.settings.platform.financing + lender adapter',leads:'workspace_records.chat_config',launch:'entitlements + domain/state + tenants.published',marketing:'social connection and publication records unavailable'};
const step=(id,done,reason,extra={})=>({id,done:done===true,reason:done===true?'':reason,...extra});
function availability(s,id){
 if(s?.state==='available')return '';
 if(s?.state==='not_available'||(!s&&id==='estimator'))return s?.reason||'Not available yet';
 return s?.reason||'Not connected. Saved evidence is not available yet.';
}
const definitions=[
 {id:'onboarding',level:1,xpMax:10,rules:s=>['name','phone','trade','area'].map(id=>step(id,field(s.fields?.[id])&&(id!=='phone'||phone(s.fields[id].value)),`Save and confirm your ${ {name:'business name',phone:'valid phone number',trade:'trade',area:'service area'}[id] }.`))},
 {id:'pages',level:1,xpMax:15,rules:s=>[
  step('drafts',list(s.required).length>0&&s.required.every(id=>text(id)&&list(s.drafts).includes(id)),'Save a draft for every required website page.'),
  step('approval',s.approval?.approved===true&&text(s.approval?.reference),'Record the contractor’s approval of the website preview.')
 ]},
 {id:'reviews',level:1,xpMax:15,rules:s=>[
  step('matched',['google','yelp'].includes(s.provider)&&text(s.profileId)&&s.matched===true,'Match this business to its Google Places or Yelp profile.'),
  step('confirmed',s.confirmed===true,'Confirm that the review profile belongs to this business.'),
  step('showing',s.showing===true,'Not connected. Real reviews must be showing before this is complete.')
 ]},
 {id:'estimator',level:2,xpMax:20,rules:s=>{
  const book=s.priceBook||{},items=list(book.items),minimum=book.minimumItems;
  const priceBookReady=Number.isInteger(minimum)&&minimum>0&&items.length>=minimum&&new Set(items.map(x=>x.id)).size===items.length&&items.every(x=>text(x.id)&&x.enteredBy==='contractor'&&x.confirmed===true&&typeof x.amount==='number'&&Number.isFinite(x.amount)&&x.amount>=0);
  return [step('fields',s.fieldsSaved===true&&list(s.requiredFields).length>0&&s.requiredFields.every(f=>list(s.fields).includes(f)),'Choose and save the required homeowner fields.',{xpMax:5}),step('price-book',priceBookReady,'Enter and confirm the required price-book items yourself.',{xpMax:10}),step('consent',s.consent===true,'Turn on the homeowner consent checkbox.',{xpMax:5})];
 }},
 {id:'promotions',level:2,xpMax:5,rules:s=>[step('offer-or-none',s.choice==='none'||list(s.offers).some(o=>text(o.id)&&text(o.title)&&text(o.reward)),'Save an offer or choose “No offer right now.”')]},
 {id:'financing',level:2,xpMax:10,rules:s=>[step('connected-or-none',s.selection==='none'||(s.selection==='lenders'&&list(s.lenders).some(l=>l.selected===true&&text(l.id)&&l.connection==='connected')),'Not connected. Connect a selected lender or explicitly choose None; a saved application link is not a connection.')]},
 {id:'leads',level:2,xpMax:10,rules:s=>{
  const a=s.alerts||{},verified=a.enabled===true&&((phone(a.phone)&&a.phoneVerified===true)||(text(a.email)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)&&a.emailVerified===true));
  return [step('verified-alerts-or-crm',verified||s.crm?.state==='connected','Not connected. Enable alerts to a verified phone or email, or connect your CRM.')];
 }},
 {id:'launch',level:3,xpMax:10,rules:s=>[
  step('paid-plan',s.plan?.status==='active',s.plan?.state==='not_connected'?'Not connected. Paid-plan verification is not available yet.':'An active paid plan is required.'),
  step('live-domain',s.domain?.stage==='live',s.domain?.state==='not_connected'?'Not connected. Domain and SSL verification are not available yet.':'Finish connecting the domain; ownership verification alone does not mean the site is live.'),
  step('published',s.published===true,'Publish the website when it is ready.')
 ]},
 {id:'marketing',level:3,xpMax:5,rules:s=>[step('connected-or-none',s.choice==='none'||(s.choice==='channels'&&list(s.channels).length>0&&s.channels.every(c=>text(c.id)&&c.connection==='connected')),'Not connected. Connect every chosen marketing channel or explicitly choose none.')]}
];
const levelDefinitions=[{id:1,name:'Get Set Up',questIds:['onboarding','pages','reviews'],xpMax:40},{id:2,name:'Win More Jobs',questIds:['estimator','promotions','financing','leads'],xpMax:45},{id:3,name:'Launch & Grow',questIds:['launch','marketing'],xpMax:15}];
export function evaluateProgress(sources={}){
 const quests=definitions.map(d=>{
  const s=sources[d.id]||{},missing=availability(sources[d.id],d.id);
  const steps=d.rules(s).map(rule=>missing?{...rule,done:false,reason:missing}:rule);
  const done=steps.every(x=>x.done);
  return {id:d.id,level:d.level,xpEarned:done?d.xpMax:0,xpMax:d.xpMax,done,steps,dataSource:text(s.dataSource)?s.dataSource:sourceLabel[d.id],status:done?'Done':missing?(s.state==='not_available'||(!sources[d.id]&&d.id==='estimator')?'Not available yet':'Not connected'):'Needs you'};
 });
 const done=id=>quests.find(q=>q.id===id).done,totalXp=quests.reduce((sum,q)=>sum+q.xpEarned,0);
 const levels=levelDefinitions.map(l=>({...l,questIds:[...l.questIds],done:l.questIds.every(done),xpEarned:quests.filter(q=>q.level===l.id).reduce((n,q)=>n+q.xpEarned,0)}));
 const setup=levels[0].done,selling=done('estimator')&&done('leads'),live=done('launch'),growing=live&&done('marketing');
 const earned=(label,value)=>({label,earned:value});
 const firstPost=sources.marketing?.state==='available'&&list(sources.marketing.posts).some(p=>text(p.id)&&text(p.channel)&&text(p.providerId)&&p.status==='published'&&text(p.publishedAt)&&Number.isFinite(Date.parse(p.publishedAt))&&p.isSample===false);
 const currentLevel=levels.find(l=>!l.done)?.id||3;
 return {quests,levels,totalXp,siteStrength:totalXp,xpMax:100,currentLevel,nextLevelAt:currentLevel===1?40:currentLevel===2?85:null,
  stamps:[earned('SET UP',setup),earned('SELLING',selling),earned('LIVE',live),earned('GROWING',growing)],
  badges:[earned('Set up',setup),earned('Reviews live',done('reviews')),earned('Leads ready',done('leads')),earned('Selling',selling),earned('Go live',live),earned('First post',!!firstPost),earned('Financing',done('financing')),earned('100 XP',totalXp===100)]};
}
/** Only the illustrative house is finished. Real XP/quests/awards remain real. */
export function finishedPreview(real){return {isPreview:true,label:'Preview',housePercent:100,real:structuredClone(real)};}
