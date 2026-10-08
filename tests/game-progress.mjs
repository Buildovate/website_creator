import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {evaluateProgress} from '../src/blueprint/progress.js';
import {createDependencies} from '../src/blueprint/deps.js';
import {readProgressSources} from '../src/blueprint/sources.js';
import {complete,freeze} from './game-fixtures.mjs';
const quest=(s,id)=>evaluateProgress(s).quests.find(q=>q.id===id);

test('fresh tenant: zero, honest reasons, stable output contract',()=>{
 const p=evaluateProgress({});assert.equal(p.totalXp,0);assert.equal(p.quests.length,9);
 for(const q of p.quests){assert.equal(q.done,false);assert.equal(q.xpEarned,0);assert.ok(q.dataSource);assert.ok(q.steps.every(s=>s.done===false&&s.reason.length>0));}
 assert.equal(quest({},'estimator').status,'Not available yet');
});
test('complete fixture earns exactly 100; readonly and deterministic',()=>{const s=freeze(complete());assert.equal(evaluateProgress(s).totalXp,100);assert.deepEqual(evaluateProgress(s),evaluateProgress(s));});
test('midway awards completed quests only',()=>{const s=complete();s.estimator.consent=false;s.launch.plan.status='none';s.marketing.channels[0].connection='not_connected';assert.equal(evaluateProgress(s).totalXp,65);});
const failures=[
 ['onboarding','name',s=>s.onboarding.fields.name.value=''],
 ['onboarding','phone',s=>s.onboarding.fields.phone.value='123'],
 ['onboarding','trade',s=>s.onboarding.fields.trade.saved=false],
 ['onboarding','area',s=>s.onboarding.fields.area.value=''],
 ['pages','drafts',s=>s.pages.drafts.pop()],
 ['pages','approval',s=>s.pages.approval.approved=false],
 ['reviews','matched',s=>s.reviews.matched=false],
 ['reviews','confirmed',s=>s.reviews.confirmed=false],
 ['reviews','showing',s=>s.reviews.showing=false],
 ['estimator','fields',s=>s.estimator.fieldsSaved=false],
 ['estimator','price-book',s=>s.estimator.priceBook.items.pop()],
 ['estimator','consent',s=>s.estimator.consent=false],
 ['promotions','offer-or-none',s=>s.promotions.offers=[]],
 ['financing','connected-or-none',s=>s.financing.lenders[0].connection='not_connected'],
 ['leads','verified-alerts-or-crm',s=>s.leads.alerts.phoneVerified=false],
 ['launch','paid-plan',s=>s.launch.plan.status='past_due'],
 ['launch','live-domain',s=>s.launch.domain.stage='verified'],
 ['launch','published',s=>s.launch.published=false],
 ['marketing','connected-or-none',s=>s.marketing.channels[0].connection='not_connected']
];
for(const [id,step,breakRule] of failures)test(`${id}/${step}: met, saved-but-not-met, disconnected`,()=>{
 const s=complete();assert.equal(quest(s,id).steps.find(x=>x.id===step).done,true);breakRule(s);
 const q=quest(s,id);assert.equal(q.done,false);assert.equal(q.xpEarned,0);assert.ok(q.steps.find(x=>x.id===step).reason);
 s[id].state='not_connected';const off=quest(s,id);assert.equal(off.xpEarned,0);assert.ok(off.steps.every(x=>!x.done&&x.reason.includes('Not connected')));
});
for(const field of ['name','phone','trade','area'])test(`found unconfirmed ${field} cannot count`,()=>{const s=complete();s.onboarding.fields[field].origin='found';s.onboarding.fields[field].confirmed=false;assert.equal(quest(s,'onboarding').xpEarned,0);s.onboarding.fields[field].confirmed=true;assert.equal(quest(s,'onboarding').xpEarned,10);});
test('estimator parts expose 5/10/5 but partial quest earns zero',()=>{const s=complete();s.estimator.consent=false;const q=quest(s,'estimator');assert.deepEqual(q.steps.map(x=>x.xpMax),[5,10,5]);assert.equal(q.xpEarned,0);});
test('estimator cannot infer minimum, fields or contractor-entered rates',()=>{for(const mutate of [s=>delete s.estimator.priceBook.minimumItems,s=>s.estimator.priceBook.items[0].enteredBy='autofill',s=>s.estimator.priceBook.items[0].amount=null,s=>s.estimator.priceBook.items[1].id='a',s=>s.estimator.requiredFields=[],s=>s.estimator.fields=[]]){const s=complete();mutate(s);assert.equal(quest(s,'estimator').xpEarned,0);}});
test('explicit none is a choice; empty arrays are not',()=>{const s=complete();s.promotions.offers=[];s.promotions.choice='none';s.financing.lenders=[];s.financing.selection='none';s.marketing.channels=[];s.marketing.choice='none';for(const id of ['promotions','financing','marketing'])assert.equal(quest(s,id).done,true);delete s.promotions.choice;delete s.financing.selection;delete s.marketing.choice;for(const id of ['promotions','financing','marketing'])assert.equal(quest(s,id).done,false);});
test('verified email or CRM can satisfy leads; a typed address cannot',()=>{const s=complete();s.leads.alerts={enabled:true,email:'qa@example.test',emailVerified:true};assert.equal(quest(s,'leads').done,true);s.leads.alerts.emailVerified=false;assert.equal(quest(s,'leads').done,false);s.leads.crm={state:'connected'};assert.equal(quest(s,'leads').done,true);});
test('domain conjunction has no shortcut, including disconnected deps',()=>{for(const key of ['plan','domain']){const s=complete();s.launch[key]={state:'not_connected'};const q=quest(s,'launch');assert.equal(q.xpEarned,0);assert.ok(q.steps.some(x=>x.reason.includes('Not connected')));}});
test('all 512 quest combinations remain within 100 with exact sum',()=>{for(let mask=0;mask<512;mask++){const s=complete();Object.keys(s).forEach((id,i)=>{if(!(mask&(1<<i)))s[id]={state:'not_connected'};});const p=evaluateProgress(s);assert.equal(p.totalXp,p.quests.reduce((n,q)=>n+q.xpEarned,0));assert.ok(p.totalXp>=0&&p.totalXp<=100);}});
test('unknown source state and unsupported review provider fail closed',()=>{const s=complete();s.reviews.provider='invented';assert.equal(quest(s,'reviews').done,false);s.onboarding.state='unknown';assert.equal(quest(s,'onboarding').done,false);});

test('deps: absent actual owner modules return not_connected',async()=>{const d=createDependencies();for(const [name,args]of [['getPlan',['tenant']],['hasEntitlement',['tenant','website']],['getDomainStatus',['tenant']],['getSiteScanFacts',['tenant']]])assert.deepEqual(await d[name](...args),{state:'not_connected'});});
test('deps: owner module contracts are used and arguments retain scope',async()=>{const calls=[];const d=createDependencies({load:async url=>url.pathname.endsWith('entitlements.js')?{getPlan:id=>(calls.push(id),{plan:'website',status:'active'}),hasEntitlement:(id,key)=>(calls.push(id,key),false)}:url.pathname.endsWith('state.js')?{getDomainStatus:id=>(calls.push(id),{stage:'live',hostname:'qa.test',liveProofAt:'2026-01-01'})}:{getSiteScanFacts:id=>(calls.push(id),[{field:'name',value:'Found',sourceUrl:'https://qa.test'}])}});assert.equal((await d.getPlan('a')).status,'active');assert.equal(await d.hasEntitlement('b','ai'),false);assert.equal((await d.getDomainStatus('c')).stage,'live');assert.equal((await d.getSiteScanFacts('d')).length,1);assert.deepEqual(calls,['a','b','ai','c','d']);});
test('deps: missing exports and invalid contracts fail closed; internal errors are not hidden',async()=>{const d=createDependencies({load:async()=>({getPlan:()=>({status:'pretend'}),hasEntitlement:()=>({truthy:true})})});assert.deepEqual(await d.getPlan('t'),{state:'not_connected'});assert.deepEqual(await d.hasEntitlement('t','x'),{state:'not_connected'});assert.deepEqual(await d.getDomainStatus('t'),{state:'not_connected'});const broken=createDependencies({load:async()=>{throw Error('broken owner module')}});await assert.rejects(()=>broken.getPlan('t'),/broken owner/);});

function dbFixture(){
 const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE tenants(id TEXT,settings TEXT,published TEXT,status TEXT); CREATE TABLE sales(tenant_id TEXT,data TEXT); CREATE TABLE workspace_records(id TEXT,scope TEXT,kind TEXT,data TEXT); CREATE TABLE inquiries(id TEXT,tenant_id TEXT);');
 const sql={prepare(query){let args=[];return{bind(...a){args=a;return this;},async first(){return db.prepare(query).get(...args)||null;},async all(){return {results:db.prepare(query).all(...args)};}};}};
 const s={name:'Fictional Roofing',phone:'+18055550198',trade:'Roofing',area:'Ventura',hero:'Roof help',intro:'Roofing work',services:[{name:'Repair'}],platform:{questionnaire:{factsConfirmed:true},financing:{selection:'none'},promotions:{offers:[{id:'offer',title:'Owner offer',reward:'Owner supplied'}]}},websitePages:{pages:[{id:'repair',kind:'service',serviceName:'Repair',enabled:true,title:'Repair',intro:'Repair guidance'},{id:'about',kind:'about',enabled:true,title:'About',intro:'Business background'},{id:'faq',kind:'faq',enabled:true,title:'Questions',intro:'Roof questions'}]}};
 db.prepare('INSERT INTO tenants VALUES(?,?,?,?)').run('a',JSON.stringify(s),JSON.stringify(s),'published');db.prepare('INSERT INTO tenants VALUES(?,?,?,?)').run('b','{}',null,'draft');db.prepare('INSERT INTO sales VALUES(?,?)').run('a',JSON.stringify({ownerApproved:true,approvalNote:'Saved owner preview approval'}));db.prepare('INSERT INTO workspace_records VALUES(?,?,?,?)').run('chat-a','a','chat_config',JSON.stringify({enabled:true,smsEnabled:true,phone:'+18055550198',phoneVerified:true}));db.prepare('INSERT INTO inquiries VALUES(?,?)').run('lead-a','a');return {db,env:{DB:sql},s};
}
const offline=createDependencies({load:async()=>({})});
test('sources read tenant, sales approval, saved pages, offers, None and verified alerts; missing integrations stay honest',async()=>{const {db,env}=dbFixture();try{const s=await readProgressSources(env,'a',{deps:offline});const p=evaluateProgress(s);assert.equal(p.totalXp,50);assert.equal(quest(s,'pages').done,true);assert.equal(s.estimator.state,'not_available');assert.equal(s.reviews.state,'not_connected');assert.equal(s.marketing.state,'not_available');assert.equal(s.activity.inquiries,1);assert.equal(s.activity.newReviews,null);assert.equal(s.launch.published,true);}finally{db.close();}});
test('sources isolate tenants, do not write, and observe the same saved values as Tabs',async()=>{const {db,env,s}=dbFixture();try{const before=db.prepare('SELECT total_changes() AS n').get().n;const a=await readProgressSources(env,'a',{deps:offline});const b=await readProgressSources(env,'b',{deps:offline});assert.equal(evaluateProgress(b).totalXp,0);assert.equal(b.activity.inquiries,0);assert.equal(db.prepare('SELECT total_changes() AS n').get().n,before);s.phone='';db.prepare('UPDATE tenants SET settings=? WHERE id=?').run(JSON.stringify(s),'a');assert.equal(quest(await readProgressSources(env,'a',{deps:offline}),'onboarding').xpEarned,0);assert.equal(quest(a,'onboarding').xpEarned,10);await assert.rejects(()=>readProgressSources(env,'missing',{deps:offline}),/Website not found/);}finally{db.close();}});
test('sources reject fake completion flags, draft lender links and social URLs',async()=>{const {db,env,s}=dbFixture();try{s.platform.questionnaire.factsConfirmed=false;s.platform.financing={selection:'lenders',lenders:[{enabled:true,confirmed:true,applicationUrl:'https://qa.test',connection:'connected'}]};s.platform.footer={socials:{facebook:{enabled:true,url:'https://qa.test'}}};s.reviews={confirmed:true,googlePlaceId:'place',googleUrl:'https://google.com',showing:true};s.estimator={done:true};db.prepare('UPDATE tenants SET settings=? WHERE id=?').run(JSON.stringify(s),'a');const p=await readProgressSources(env,'a',{deps:offline});for(const id of ['onboarding','financing','reviews','estimator','marketing'])assert.equal(quest(p,id).xpEarned,0);}finally{db.close();}});
test('sources fail loudly on corrupt saved JSON rather than award progress',async()=>{const {db,env}=dbFixture();try{db.prepare('UPDATE tenants SET settings=? WHERE id=?').run('{broken','a');await assert.rejects(()=>readProgressSources(env,'a',{deps:offline}),SyntaxError);}finally{db.close();}});
