import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
// Sequential fixtures only. Stop on the first assertion; no retries.
import assert from 'node:assert/strict';
import {adoptGeneration} from '../src/generation.js';
import {DatabaseSync} from 'node:sqlite';
import {isPostgresGameFixture,gameDatabaseFixture,seedGameTenant,seedGameMember,seedGameAdmin} from './helpers/game-database-fixture.mjs';
import {build} from 'esbuild';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {evaluateProgress} from '../src/blueprint/progress.js';
import {complete} from './game-fixtures.mjs';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028G/round4';fs.mkdirSync(out,{recursive:true});
await build({stdin:{contents:"export {gameApi} from './src/blueprint/api.js'; export {advanceExperience,emptyExperience,publishedPreview} from './src/blueprint/experience.js';",resolveDir:root},outfile:root+'/.data/028G/game-experience-api.js',bundle:true,format:'esm',platform:'node',loader:{'.html':'text','.pdf':'binary'},logLevel:'silent'});
const {gameApi,advanceExperience,emptyExperience,publishedPreview}=await import(pathToFileURL(root+'/.data/028G/game-experience-api.js').href);
const db=gameDatabaseFixture();


const initialSettings=JSON.stringify(adoptGeneration({},'a','game-fixture-a'));
for(const id of ['a','b'])seedGameTenant(db,id,'Game QA fixture',{settings:id==='a'?initialSettings:JSON.stringify(adoptGeneration({},id,'game-fixture-'+id))});
for(const [tenant,user,role] of [['a','owner','owner'],['a','viewer','viewer'],['b','other','owner']])seedGameMember(db,tenant,user,role);
seedGameAdmin(db,'admin');

const env={DB:{
 prepare(sql){
  let args=[];
  return {
   bind(...values){args=values;return this;},
   async first(){return db.prepare(sql).get(...args)||null;},
   async all(){return {results:db.prepare(sql).all(...args)};},
   async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}
  };
 }
}};
const base='http://127.0.0.1:5183',checks=[];
function call(user='owner',method='GET',value,tenant='a',origin=base){const headers={'content-type':'application/json',origin};if(user)headers['oai-authenticated-user-id']=user;const req=new Request(base+'/api/game/'+tenant+'/experience',{method,headers,body:value===undefined?undefined:JSON.stringify(value)});return gameApi(req,env,new URL(req.url));}
const denied=(fn,status)=>assert.rejects(fn,e=>e.status===status);
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
try{
 await check('fresh GET is read-only and unpublished is honest',async()=>{const x=await call();assert.equal(x.state.tour,'unseen');assert.equal(x.preview.state,'unpublished');assert.equal(x.preview.url,undefined);assert.match(x.preview.reason,/isn’t published/);assert.equal(db.prepare('SELECT COUNT(*) n FROM workspace_records').get().n,0)});
 await check('tour is claimed once and recorded per account',async()=>{const x=await call('owner','POST',{action:'observe'});assert.equal(x.showTour,true);assert.equal(x.state.tour,'started');assert.deepEqual(x.completedLevels,[]);assert.equal((await call('owner','POST',{action:'observe'})).showTour,false)});
 await check('skip persists without reopening tour',async()=>{await call('owner','POST',{action:'skip_tour'});assert.equal((await call()).state.tour,'skipped');assert.equal((await call('owner','POST',{action:'observe'})).showTour,false)});
 await check('repeat skip is idempotent',async()=>{const before=db.prepare('SELECT total_changes() n').get().n;await call('owner','POST',{action:'skip_tour'});assert.equal(db.prepare('SELECT total_changes() n').get().n,before)});
 await check('viewer gets a separate personal tour, not business write permission',async()=>{assert.equal((await call('viewer','POST',{action:'observe'})).showTour,true);await call('viewer','POST',{action:'finish_tour'});assert.equal((await call('viewer')).state.tour,'finished');assert.equal((await call()).state.tour,'skipped');assert.equal(db.prepare("SELECT settings FROM tenants WHERE id='a'").get().settings,initialSettings)});
 await check('finished tour survives later reads and observations',async()=>{assert.equal((await call('viewer','POST',{action:'observe'})).showTour,false);assert.equal((await call('viewer')).state.tour,'finished')});
 await check('anonymous denied',()=>denied(()=>call(null),401));
 await check('cross-tenant read denied',()=>denied(()=>call('other'),404));
 await check('cross-tenant personal write denied',()=>denied(()=>call('owner','POST',{action:'observe'},'b'),404));
 await check('foreign origin write denied',()=>denied(()=>call('owner','POST',{action:'observe'},'a','https://invalid.test'),403));
 await check('clients cannot submit completion or XP',()=>denied(()=>call('owner','POST',{action:'observe',completedLevels:[1],totalXp:100}),400));
 await check('unknown actions rejected',()=>denied(()=>call('owner','POST',{action:'award'}),400));
 await check('published preview requires status AND snapshot AND safe slug',()=>{for(const t of [{slug:'qa',status:'draft',published:'{}'},{slug:'qa',status:'published',published:null},{slug:'../draft',status:'published',published:'{}'}])assert.equal(publishedPreview(t).state,'unpublished');assert.deepEqual(publishedPreview({slug:'qa-site',status:'published',published:'{}'}),{state:'published',url:'/s/qa-site'})});
 await check('fresh observations never celebrate',()=>assert.deepEqual(advanceExperience(emptyExperience(),'observe',evaluateProgress({})).completedLevels,[]));
 await check('a completed level celebrates exactly once without changing progress',()=>{const sources=complete();for(const id of ['estimator','promotions','financing','leads','launch','marketing'])delete sources[id];const progress=evaluateProgress(sources),before=structuredClone(progress),first=advanceExperience(emptyExperience(),'observe',progress);assert.deepEqual(first.completedLevels,[1]);assert.deepEqual(advanceExperience(first.state,'observe',progress).completedLevels,[]);assert.deepEqual(progress,before)});
 await check('later levels and regress/recomplete do not repeat old celebrations',()=>{const first=advanceExperience(emptyExperience(),'observe',evaluateProgress(complete()));assert.deepEqual(first.completedLevels,[1,2,3]);const less=advanceExperience(first.state,'observe',evaluateProgress({}));assert.deepEqual(advanceExperience(less.state,'observe',evaluateProgress(complete())).completedLevels,[])});
 await check('state transition is pure',()=>{const old=emptyExperience(),before=structuredClone(old);advanceExperience(old,'observe',evaluateProgress(complete()));assert.deepEqual(old,before)});
 await check('corrupt stored receipts fail honestly',async()=>{db.prepare("UPDATE workspace_records SET data='bad' WHERE kind='game_experience'").run();await denied(()=>call(),409)});
 fs.writeFileSync(out+'/game-experience-api.json',JSON.stringify({passed:true,count:checks.length,checks},null,2));console.log(checks.length+'/'+checks.length+' passed');
}finally{db.close();}
