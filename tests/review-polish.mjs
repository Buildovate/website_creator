import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';import fs from 'node:fs';
import {chooseCopy,sentenceServiceName} from '../src/generation-copy.js';
import {commercial} from '../src/trade-components.js';
import {originalRows,styles,variantSettings} from './fixtures/section-variants.mjs';
const checks=[],ok=(v,label)=>{assert.ok(v,label);checks.push(label)};
ok(sentenceServiceName('Roof installation')==='roof installation','Mid-sentence roof installation');ok(sentenceServiceName('Roof repair')==='roof repair','Second service is sentence case');
for(const s of ['HVAC replacement','AC repair','AC installation','EV charger installation'])ok(sentenceServiceName(s).includes(s.match(/^[A-Z]+/)[0]),s+' acronym retained');
for(const s of ['Acme Premium Care','Joe’s Home Service','Lennox Signature package'])ok(sentenceServiceName(s)===s,s+' proper/custom name retained');
for(const {row}of originalRows)for(const style of styles){
 const s=variantSettings(row,style,'a',false),seen=new Set();
 for(let seed=0;seed<30;seed++){
  const c=chooseCopy(s,seed);seen.add(c.hero.id);
  ok(!!c.hero.heading&&!!c.hero.body,s.trade+' '+style+' hero and intro present seed '+seed);
  for(const name of s.services.map(x=>x.name)){const lower=sentenceServiceName(name);if(lower!==name)ok(!c.hero.body.includes(name),s.trade+' '+style+' '+name+' is sentence case in generated intro seed '+seed)}
 }
 ok(seen.size===3,s.trade+' '+style+' all three hero/intro templates covered');
 for(const preview of [false,true]){const html=commercial(s,s.designKit,{preview});ok(!/<video\b[^>]*\bcontrols\b/.test(html),s.trade+' '+style+' native controls absent '+preview);if(html.includes('<video')){ok(/<video loop playsinline muted/.test(html),s.trade+' silent loop inline '+preview);ok(html.includes('commercial-poster')&&html.includes('data-ambient-toggle hidden'),s.trade+' poster and styled control '+preview);ok(!/<source src=/.test(html),s.trade+' no eager clip request '+preview)}}
}
const out=releaseRepoRoot+"/docs/build-evidence/028E/checks/review-polish.json";fs.writeFileSync(out,JSON.stringify({passed:true,trades:originalRows.length,styles:styles.length,count:checks.length,checks},null,2));console.log('PASS '+checks.length+' Part 1 assertions across '+originalRows.length+' trades and '+styles.length+' styles');
