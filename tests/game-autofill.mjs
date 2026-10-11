import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {isPostgresGameFixture,gameDatabaseFixture,seedGameTenant,seedGameMember,seedGameAdmin} from './helpers/game-database-fixture.mjs';
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
import {savedSuggestions,planAutofill,undoAutofill} from '../src/blueprint/autofill/rules.js';
const root='C:/Users/joe/wc-game',out=root+'/docs/build-evidence/028G/round6';
fs.mkdirSync(out,{recursive:true});
await build({entryPoints:[root+'/src/blueprint/api.js'],outfile:root+'/.data/028G/game-autofill-api.js',bundle:true,format:'esm',platform:'node',loader:{'.html':'text','.pdf':'binary'},logLevel:'silent'});
const {gameApi}=await import(pathToFileURL(root+'/.data/028G/game-autofill-api.js').href);
const saved={name:'Harbor Roofing · QA fixture',owner:'QA owner',phone:'(805) 555-0123',email:'qa@example.test',address:'',hours:'By appointment',hero:'Talk through your roof repair',intro:'We explain the repair scope before work begins.',license:'DO NOT COPY',area:'Owner choice',price:99,experience:'DO NOT COPY',platform:{questionnaire:{factsConfirmed:true}}};
const db=gameDatabaseFixture();
{

seedGameTenant(db,'a',saved.name,{settings:JSON.stringify(saved),version:4});
seedGameTenant(db,'b','Other tenant',{settings:JSON.stringify({...saved,name:'Other tenant'}),version:2});
for(const [tenant,user,role] of [['a','owner','owner'],['a','viewer','viewer'],['a','editor','editor'],['b','other','owner']])seedGameMember(db,tenant,user,role);
seedGameAdmin(db,'admin');
}

const env={DB:{prepare(sql){
 let args=[];
 return {
  bind(...values){args=values;return this;},
  async first(){return db.prepare(sql).get(...args)||null;},
  async all(){return {results:db.prepare(sql).all(...args)};},
  async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}
 };
}}};
globalThis.fetch=()=>{throw Error('External calls forbidden in local autofill');};
const checks=[];async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
const url='http://127.0.0.1:5183/api/game/';
function call(user='owner',method='GET',tenant='a',form='questionnaire'){const req=new Request(url+tenant+'/autofill?form='+form,{method,headers:user?{'oai-authenticated-user-id':user}:{}});return gameApi(req,env,new URL(req.url));}
const deny=(work,status)=>assert.rejects(work,e=>e.status===status);
try{
 await check('confirmed contractor values are copied verbatim with source labels',()=>{const r=savedSuggestions(saved,'business');assert.equal(r.items.find(x=>x.field==='name').value,saved.name);assert.equal(r.items.find(x=>x.field==='intro').value,saved.intro);assert.ok(r.items.every(x=>x.source.startsWith('Confirmed saved business details')));});
 await check('unconfirmed saved or generated defaults never become suggestions',()=>assert.ok(savedSuggestions({...saved,platform:{}},'business').items.every(x=>x.state==='not_found'&&x.value==='')));
 await check('only real Business and Questionnaire fields are mapped',()=>{assert.deepEqual(savedSuggestions(saved,'business').items.map(x=>x.field),['name','owner','phone','email','address','hours','hero','intro']);assert.throws(()=>savedSuggestions(saved,'made-up'));});
 await check('prices, licenses, experience, financing, area and owner photos are excluded',()=>{const fields=savedSuggestions(saved,'questionnaire').items.map(x=>x.field);for(const x of ['price','license','experience','area','ownerPhotoId','program-apr','factsConfirmed'])assert.ok(!fields.includes(x));});
 await check('questionnaire headline and introduction reuse the saved wording without generation',()=>{const r=savedSuggestions(saved,'questionnaire');assert.equal(r.items.find(x=>x.field==='conversion-headline').value,saved.hero);assert.equal(r.items.find(x=>x.field==='conversion-intro').value,saved.intro);});
 await check('missing and invalid source values stay blank',()=>{const r=savedSuggestions({...saved,email:null,hours:42},'business');assert.equal(r.items.find(x=>x.field==='email').value,'');assert.equal(r.items.find(x=>x.field==='hours').state,'not_found');});
 const items=savedSuggestions(saved,'questionnaire').items;
 await check('nonexistent form controls are never created',()=>assert.equal(planAutofill(items,{}).length,0));
 await check('empty unedited fields are proposals only',()=>{const values={'conversion-headline':''},snapshot=structuredClone(values);assert.equal(planAutofill(items,values)[0].status,'found');assert.deepEqual(values,snapshot);});
 await check('typed values and intentionally cleared fields are always kept',()=>{assert.equal(planAutofill(items,{phone:'New answer'})[0].status,'kept');assert.equal(planAutofill(items,{phone:''},['phone'])[0].status,'kept');});
 await check('numeric-looking typed answers are not treated as empty',()=>assert.equal(planAutofill(items,{phone:'0'})[0].status,'kept'));
 await check('Undo restores the exact prior value without changing its input',()=>{const values={hero:'Filled',phone:'untouched'},before=structuredClone(values);const r=undoAutofill(values,[{field:'hero',before:'',after:'Filled'}]);assert.deepEqual(r.values,{hero:'',phone:'untouched'});assert.deepEqual(values,before);});
 await check('Undo keeps edits made after autofill',()=>{const r=undoAutofill({hero:'Edited later'},[{field:'hero',before:'',after:'Filled'}]);assert.deepEqual(r.kept,['hero']);assert.equal(r.values.hero,'Edited later');});
 await check('all outside adapters honestly remain Not connected',()=>{const r=savedSuggestions(saved,'business');assert.equal(r.connections.length,4);assert.ok(r.connections.every(x=>x.state==='not_connected'));});
 await check('owner gets only their real saved source and optimistic version',async()=>{const r=await call();assert.equal(r.tenantId,'a');assert.equal(r.version,4);assert.equal(r.items[0].value,saved.name);});
 await check('admin and existing editor roles reuse existing write access',async()=>{assert.equal((await call('admin')).tenantId,'a');assert.equal((await call('editor')).tenantId,'a');});
 await check('viewer cannot invoke autofill',()=>deny(()=>call('viewer'),403));
 await check('anonymous access is denied',()=>deny(()=>call(null),401));
 await check('tenant isolation rejects both foreign directions',async()=>{await deny(()=>call('other'),404);await deny(()=>call('owner','GET','b'),404);});
 await check('autofill has no write method or second save path',()=>deny(()=>call('owner','POST'),405));
 await check('unknown form type is rejected',()=>deny(()=>call('owner','GET','a','pricing'),400));
 await check('repeated proposals never write or confirm stored business facts',async()=>{const count=db.prepare('SELECT total_changes() n').get().n,before=db.prepare('SELECT settings FROM tenants WHERE id=?').get('a').settings;await call();await call();assert.equal(db.prepare('SELECT total_changes() n').get().n,count);assert.equal(db.prepare('SELECT settings FROM tenants WHERE id=?').get('a').settings,before);});
 fs.writeFileSync(out+'/autofill-api.json',JSON.stringify({passed:true,count:checks.length,checks,providerCalls:0},null,2));console.log(checks.length+'/'+checks.length+' passed');
}catch(error){fs.writeFileSync(out+'/autofill-api-failure.json',JSON.stringify({passed:false,completed:checks.length,checks,error:error.stack},null,2));throw error;}
finally{db.close();}
