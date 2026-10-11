import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {mediaCatalog,mediaPool,approvedAsset,selectMedia,resolveMedia,MEDIA_SLOTS} from '../src/media-library.js';
import {regenerate,saveGeneration} from '../src/generation.js';import {replayUniqueChoices} from '../src/uniqueness.js';import {showcasePage} from '../src/showcase.js';
import {renderLibraryMedia} from '../src/media-library-render.js';import {originalRows,variantSettings,styles} from './fixtures/section-variants.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028D';let checks=0;
const ok=(value,label)=>{checks++;assert.ok(value,label)},eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label)},throws=(f,re,label)=>{checks++;assert.throws(f,re,label)};
const cases=[];
for(const {row} of originalRows)for(const style of styles){
 const input=variantSettings(row,style,'a',false),id='media-'+input.designKit+'-'+style,s=regenerate(input,id,id),m=s.mediaPicks;
 ok(m&&m.version===1,'Media manifest exists');eq(s.generationManifest.choices.mediaPicks,m,'Manifest stores every media choice');
 const twice=regenerate(input,id,id);eq(m,twice.mediaPicks,'Same inputs and seed select the same media');eq(showcasePage(s),showcasePage(twice),'Identical generated HTML');
 const replay=replayUniqueChoices(input,s.generationManifest);eq(showcasePage(s),showcasePage(replay),'Manifest replays media and HTML exactly');
 const legacy=structuredClone(input);delete legacy.mediaPicks;eq(renderLibraryMedia('<html>unchanged</html>',legacy),'<html>unchanged</html>','No picks is byte-identical');
 const pool=mediaPool(s.designKit,'hero'),count=mediaCatalog.trades[s.designKit].heroClipSlots.filter(x=>approvedAsset(x.assetId)).length;
 eq(m.slots.hero.assetKind,count>=2?'clip':'still','Thin pools use stills');
 for(const slot of MEDIA_SLOTS){const pick=m.slots[slot];ok(approvedAsset(pick.assetId),'Only approved source selected');ok(mediaPool(s.designKit,slot).includes(pick.assetId),'Selected asset belongs to slot');ok(resolveMedia(pick),'Approved asset resolves');eq(pick.treatment.opacity,.12,'Non-destructive bounded tint');ok(!/our project|completed job|before.and.after/i.test(JSON.stringify(pick)),'No library project attribution');}
 const second=regenerate(input,id+'-second',id+'-second',{existing:[{id,settings:s}]});if(pool.length>1)ok(second.mediaPicks.slots.hero.assetId!==m.slots.hero.assetId,'Same-trade hero reuse avoided');
 const exhausted=pool.map((assetId,i)=>({id:'used-'+i,settings:{...s,mediaPicks:{slots:{hero:{assetId}}}}}));const full=selectMedia({...s,mediaPicks:undefined},id+'full',{existing:exhausted});ok(full.decisions.some(x=>x.slot==='hero'&&x.status.includes('exhausted')),'Exhaustion recorded honestly');
 const chosen=pool.at(-1),staff=regenerate(input,id,id,{mediaOverrides:{hero:chosen},actor:{id:'joe-fixture',role:'admin'}});eq(staff.mediaPicks.slots.hero.assetId,chosen,'Staff override wins');eq(staff.mediaPicks.overrides.history[0].by.id,'joe-fixture','Override actor recorded');
 throws(()=>regenerate(input,id,id,{mediaOverrides:{hero:chosen},actor:{id:'owner-fixture',role:'owner'}}),/Staff administrator/,'Owner cannot override');
 throws(()=>regenerate(input,id,id,{mediaOverrides:{hero:'unapproved'}}),/Staff administrator/,'Anonymous override denied');
 throws(()=>regenerate(input,id,id,{mediaOverrides:{hero:'unapproved'},actor:{id:'joe-fixture',role:'admin'}}),/approved/,'Invalid asset denied');
 const owned=regenerate({...input,heroPhotoId:'owned-photo'},id,id),resolved=resolveMedia(owned.mediaPicks.slots.hero,[{id:'owned-photo'}]);eq(resolved.url,'/media/owned-photo','Contractor photo takes priority');eq(resolved.treatment.type,'none','Owned photo is not recolored');ok(!resolveMedia(owned.mediaPicks.slots.hero,[])?.url.startsWith('/media/'),'Foreign or missing photo is never exposed');
 const changed=saveGeneration({...s,color:'#164a59'},s,id,id);eq(changed.mediaPicks.slots.hero.treatment.color,'#164a59','New palette saved in manifest');
 const html=showcasePage(s);ok(html.includes('data-library-media'),'Actual renderer applies media');ok(html.includes(m.slots.hero.poster.url),'Picked hero poster appears');ok(!html.includes('Illustrative imagery'),'No concept caption added');
 cases.push({trade:s.trade,style,hero:m.slots.hero.assetId,kind:m.slots.hero.assetKind});
}
for(const a of Object.values(mediaCatalog.assets).filter(a=>a.approvalStatus==='approved')){
 ok(a.rights.record==='docs/media/RIGHTS-AND-APPROVALS.md'&&a.source.jobId&&a.approver==='Joe Engel','Approved rights chain');
 eq(createHash('sha256').update(fs.readFileSync(root+'/public'+a.url.split('?')[0])).digest('hex'),a.sha256,'Approved file integrity: '+a.id);
}
const row=originalRows.find(x=>JSON.parse(x.row.settings).designKit==='patios').row,s=regenerate(variantSettings(row,'current','b',false),'poster-case','poster-case'),pick=s.mediaPicks.slots.hero;
eq(pick.assetKind,'clip','Poster fixture has video');const c=structuredClone(mediaCatalog);c.assets[pick.assetId].approvalStatus='pending';eq(resolveMedia(pick,[],c).url,pick.poster.url,'Pending clip falls back to approved saved poster');eq(resolveMedia(pick,[],c).kind,'still','Pending clip cannot play');c.assets[pick.poster.assetId].approvalStatus='pending';eq(resolveMedia(pick,[],c),null,'Pending poster fails closed');
for(const status of ['pending','rejected']){const c=structuredClone(mediaCatalog);for(const a of Object.values(c.assets))a.approvalStatus=status;eq(mediaPool('patios','hero',c),[],'No '+status+' asset selected');}
const moved=saveGeneration({...s,trade:'HVAC',designKit:'hvac'},s,'poster-case','poster-case');ok(!moved.mediaPicks,'Changing trades clears incompatible media until regeneration');
eq(renderLibraryMedia('<html>other trade</html>',{...s,trade:'HVAC',designKit:'hvac'}),'<html>other trade</html>','A foreign trade record cannot render library picks');
const ownedHtml=showcasePage({...s,heroPhotoId:'owned-photo'},{photos:[{id:'owned-photo'}]});ok(ownedHtml.includes('data-media-slot="hero" data-media-kind="still"><img class="ml-poster" src="/media/owned-photo"'),'Renderer honors a newly selected owned photo without regeneration');
fs.writeFileSync(out+'/checks/media-library.json',JSON.stringify({passed:true,checks,cases,providerCalls:0,creditsUsed:0},null,2));console.log('PASS '+checks+' media checks across '+cases.length+' trade/style cases');
