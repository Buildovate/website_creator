// Sequential assertions: first unexpected failure stops the process, with no retries.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {isPostgresGameFixture,gameDatabaseFixture,seedGameTenant,seedGameMember,seedGameAdmin} from './helpers/game-database-fixture.mjs';
import {build} from 'esbuild';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root='C:/Users/joe/wc-game',out=root+'/docs/build-evidence/028G/round3h';fs.mkdirSync(out,{recursive:true});
await build({entryPoints:[root+'/src/blueprint/api.js'],outfile:root+'/.data/028G/game-api.js',bundle:true,format:'esm',platform:'node',loader:{'.html':'text','.pdf':'binary'},logLevel:'silent'});
const {gameApi}=await import(pathToFileURL(root+'/.data/028G/game-api.js').href);
const db=isPostgresGameFixture()?gameDatabaseFixture():new DatabaseSync(':memory:');
if(isPostgresGameFixture()){

for(const id of ['a','b'])seedGameTenant(db,id,'Harbor Roofing — QA fixture');
for(const [tenant,user,role] of [['a','owner','owner'],['a','viewer','viewer'],['b','other','owner']])seedGameMember(db,tenant,user,role);
seedGameAdmin(db,'admin');
}else{

db.exec(`CREATE TABLE admins(user_id TEXT,role TEXT); CREATE TABLE tenants(id TEXT,name TEXT,settings TEXT,published TEXT,status TEXT); CREATE TABLE members(tenant_id TEXT,user_id TEXT,role TEXT,active INT); CREATE TABLE sales(tenant_id TEXT,data TEXT); CREATE TABLE inquiries(tenant_id TEXT); CREATE TABLE workspace_records(id TEXT PRIMARY KEY,scope TEXT,kind TEXT,data TEXT,version INT,created_at TEXT,updated_at TEXT);`);
for(const id of ['a','b'])db.prepare('INSERT INTO tenants VALUES(?,?,?,?,?)').run(id,'Harbor Roofing — QA fixture','{}',null,'draft');
for(const [tenant,user,role] of [['a','owner','owner'],['a','viewer','viewer'],['b','other','owner']])db.prepare('INSERT INTO members VALUES(?,?,?,1)').run(tenant,user,role);
db.prepare('INSERT INTO admins VALUES(?,?)').run('admin','admin');
}
const env={DB:{prepare(sql){let args=[];return {bind(...values){args=values;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}}}}};
const base='http://127.0.0.1:5183';
function call(user='owner',method='GET',value,tenant='a',origin=base){const headers={'content-type':'application/json',origin};if(user)headers['oai-authenticated-user-id']=user;const req=new Request(base+'/api/game/'+tenant,{method,headers,body:value===undefined?undefined:JSON.stringify(value)});return gameApi(req,env,new URL(req.url));}
const results=[];async function check(name,fn){await fn();results.push(name);console.log('PASS '+name);}
const denied=(work,status)=>assert.rejects(work,e=>e.status===status);
try{
 await check('fresh owner: Game is the only view, zero XP, real name',async()=>{const x=await call();assert.equal(x.view,'game');assert.equal(x.preference,undefined);assert.equal(x.progress.totalXp,0);assert.equal(x.tenant.name,'Harbor Roofing — QA fixture')});
 await check('anonymous denied',()=>denied(()=>call(null),401));
 await check('unrelated tenant hidden',()=>denied(()=>call('other'),404));
 await check('owner cannot cross tenant boundary',()=>denied(()=>call('owner','GET',undefined,'b'),404));
 await check('admin reads actual progress',async()=>assert.equal((await call('admin')).progress.totalXp,0));
 await check('viewer reads the same single view',async()=>{const x=await call('viewer');assert.equal(x.role,'viewer');assert.equal(x.view,'game')});
 await check('old Tabs preference cannot be written',()=>denied(()=>call('owner','PUT',{view:'tabs',version:0}),405));
 await check('fabricated progress cannot be written',()=>denied(()=>call('owner','PUT',{totalXp:100}),405));
 await check('POST rejected',()=>denied(()=>call('owner','POST',{}),405));
 await check('DELETE rejected',()=>denied(()=>call('owner','DELETE'),405));
 await check('viewer cannot write preferences',()=>denied(()=>call('viewer','PUT',{view:'game'}),405));
 await check('admin cannot award progress',()=>denied(()=>call('admin','PUT',{totalXp:100}),405));
 await check('old Tabs preference ignored and preserved',async()=>{db.prepare('INSERT INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').run('old','a','game_preferences','{"view":"tabs"}',1,'old','old');assert.equal((await call()).view,'game');assert.equal(db.prepare('SELECT data FROM workspace_records WHERE id=?').get('old').data,'{"view":"tabs"}')});
 await check('GET never changes saved records',async()=>{const before=db.prepare('SELECT total_changes() n').get().n;await call();await call();assert.equal(db.prepare('SELECT total_changes() n').get().n,before)});
 await check('invalid obsolete preference cannot block board',async()=>{db.prepare('UPDATE workspace_records SET data=?').run('invalid obsolete preference');assert.equal((await call()).view,'game')});
 await check('all original sections mapped, without inventing permissions',async()=>{const {questSections,sectionLabels,sectionsForQuest}=await import('../src/client/workspace/game/sections.js');assert.equal(Object.keys(sectionLabels).length,28);const originalSections=["launchpad","questionnaire","hero","editor","pages","business","ownerphoto","templates","services","projects","blog","contacts","calendar","forms","inquiries","chat","pricing","reviews","visibility","plan","readiness","followups","access","domains","backups","sales"];assert.deepEqual(Object.keys(sectionLabels).filter(id=>!originalSections.includes(id)).sort(),['add-ons','billing']);assert.ok(originalSections.every(id=>Object.hasOwn(sectionLabels,id)));assert.equal(sectionLabels.billing,'Billing');assert.equal(sectionLabels['add-ons'],'Add-ons');assert.deepEqual([...new Set(Object.values(questSections).flat())].sort(),Object.keys(sectionLabels).sort());assert.deepEqual(sectionsForQuest('onboarding',['business']),['business']);assert.equal(db.prepare('SELECT settings FROM tenants WHERE id=?').get('a').settings,'{}')});
 fs.writeFileSync(out+'/game-desktop-api.json',JSON.stringify({passed:true,count:results.length,checks:results},null,2));console.log(results.length+'/'+results.length+' passed');
}finally{db.close()}
