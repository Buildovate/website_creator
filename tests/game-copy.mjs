import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import changes from './game-copy-fixture.mjs';
import {renderGame,questCopy} from '../src/client/workspace/game/view.js';
import {evaluateProgress} from '../src/blueprint/progress.js';
import {complete} from './game-fixtures.mjs';
const root=releaseRepoRoot,out=process.env.RELEASE_EVIDENCE?process.env.RELEASE_EVIDENCE+'/game-copy':root+'/docs/build-evidence/028G/round7',checks=[];
fs.mkdirSync(out,{recursive:true});
const check=(name,fn)=>{fn();checks.push(name);console.log('PASS '+name);};
try{
 for(const [file,pairs] of Object.entries(changes))check(file+': every recorded wording replacement retained',()=>{
  const original=execFileSync('git',['show','db0f8ef22d019adadcefc25108b7c1326d342ec4:'+file],{cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n');
  let expected=original;for(const [before,after] of pairs){assert.equal(expected.split(before).length,2);expected=expected.replace(before,after);}
  const current=fs.readFileSync(root+'/'+file,'utf8').replaceAll('\r\n','\n');
  // Copy assertions stay exact; independent G-6 save/publish wiring may evolve.
  for(const [before,after] of pairs){
   assert.ok(expected.includes(after),file+': replacement exists in expected copy');
   assert.equal(current.split(after).length,expected.split(after).length,file+': approved wording retained: '+after);
   assert.equal(current.split(before).length,expected.split(before).length,file+': superseded wording has not returned: '+before);
  }
 });
 check('all nine quests retain their IDs and plain task headings',()=>{assert.equal(Object.keys(questCopy).length,9);assert.equal(new Set(Object.values(questCopy).map(c=>c[1])).size,9);for(const copy of Object.values(questCopy))assert.doesNotMatch(copy.join(' '),/foundation|rough-in|framing|streak|leaderboard/i);});
 for(const [state,sources] of [['fresh',{}],['complete',complete()]])check(state+': copy leaves progress and controls unchanged',()=>{
  const p=evaluateProgress(sources),before=structuredClone(p);
  for(const q of p.quests){const html=renderGame({tenant:{name:'QA fixture'},role:'owner',progress:p,sections:['business','questionnaire']},q.id);assert.ok(html.includes(questCopy[q.id][1]));assert.equal((html.match(/role="tab"/g)||[]).length,9);assert.equal((html.match(/data-game-step=/g)||[]).length,q.steps.length);assert.ok(html.includes('XP measures setup progress.'));assert.doesNotMatch(html,/data-game-tabs|data-game-writing/);}
  assert.deepEqual(p,before);assert.equal(p.totalXp,state==='fresh'?0:100);
 });
 fs.writeFileSync(out+'/copy.json',JSON.stringify({passed:true,count:checks.length,checks},null,2));console.log(checks.length+'/'+checks.length+' passed');
}catch(error){fs.writeFileSync(out+'/copy-failure.json',JSON.stringify({passed:false,completed:checks.length,error:error.stack},null,2));throw error;}
