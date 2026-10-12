import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stepTarget,questSections} from '../src/client/workspace/game/sections.js';
import {evaluateProgress} from '../src/blueprint/progress.js';
const out=releaseRepoRoot+"/docs/build-evidence/028G/round8",checks=[];
fs.mkdirSync(out,{recursive:true});
function check(name,fn){fn();checks.push(name);console.log('PASS '+name);}
try{
 const available=[...new Set(Object.values(questSections).flat())];
 check('Publish step opens an existing form with the real Publish action',()=>assert.equal(stepTarget('launch','published',available).section,'business'));
 check('domain and paid-plan destinations stay with their existing owners',()=>{assert.equal(stepTarget('launch','live-domain',available).section,'domains');assert.equal(stepTarget('launch','paid-plan',available).section,'plan');});
 check('every quest step resolves to an existing permitted form without creating a section',()=>{assert.equal(available.length,28);const originalSections=["launchpad","questionnaire","hero","editor","pages","business","ownerphoto","templates","services","projects","blog","contacts","calendar","forms","inquiries","chat","pricing","reviews","visibility","plan","readiness","followups","access","domains","backups","sales"];assert.deepEqual(available.filter(id=>!originalSections.includes(id)).sort(),['add-ons','billing']);assert.ok(originalSections.every(id=>available.includes(id)));for(const q of evaluateProgress().quests)for(const s of q.steps)assert.ok(available.includes(stepTarget(q.id,s.id,available).section));});
 check('no permitted sections gives no target; existing anchored forms are retained',()=>{for(const q of evaluateProgress().quests)for(const s of q.steps)assert.equal(stepTarget(q.id,s.id,[]).section,undefined);assert.equal(stepTarget('financing','connected-or-none',available).anchor,'q-financing');assert.equal(stepTarget('promotions','offer-or-none',available).anchor,'q-promotions');});
 fs.writeFileSync(out+'/form-wiring.json',JSON.stringify({passed:true,count:checks.length,checks},null,2));console.log(checks.length+'/'+checks.length+' passed');
}catch(error){fs.writeFileSync(out+'/form-wiring-failure.json',JSON.stringify({passed:false,completed:checks.length,error:error.stack},null,2));throw error;}
