import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{mediaCatalog,mediaPool}from'../src/media-library.js';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028D';let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++};const approved=Object.values(mediaCatalog.assets).filter(a=>a.approvalStatus==='approved');
for(const a of Object.values(mediaCatalog.assets)){
 for(const key of ['source','license','dateAdded','approvalStatus','approver','isSample','mayBeRecolored'])ok(Object.hasOwn(a,key),a.id+' '+key);
 ok(['approved','pending','rejected'].includes(a.approvalStatus),a.id+' valid status');
 if(a.approvalStatus==='approved'){ok(a.rights.record==='docs/media/RIGHTS-AND-APPROVALS.md',a.id+' approved rights');ok(a.source.jobId&&a.approver==='Joe Engel',a.id+' approval chain');ok(fs.existsSync(root+'/'+a.visualReview.sheet),a.id+' visual evidence');ok(createHash('sha256').update(fs.readFileSync(root+'/public'+a.url.split('?')[0])).digest('hex')===a.sha256,a.id+' digest');}
}
for(const [key,t]of Object.entries(mediaCatalog.trades)){
 ok(t.heroClipSlots.length===10,key+' ten distinct slots');const clipIds=t.heroClipSlots.map(x=>x.assetId).filter(Boolean);ok(new Set(clipIds).size===clipIds.length,key+' no slot duplication');ok(mediaPool(key,'hero').length>0,key+' usable hero');
 for(const slot of ['services','process','financing','finalCta'])ok(mediaPool(key,slot).length>0,key+' approved '+slot);
}
const inventory=JSON.parse(fs.readFileSync(out+'/media-inventory.json'));ok(inventory.files.length===11355,'Original repository inventory remains complete');ok(inventory.files.filter(x=>x.approvalStatus==='rejected').length>=3,'Prior rejected masters stay rejected');
const counts=JSON.parse(fs.readFileSync(out+'/checks/library-counts.json'));ok(counts.starter2===1600&&counts.starter4===4320,'Starter totals');
const requests=JSON.parse(fs.readFileSync(out+'/proposed-assets.json')).requests;ok(requests.every(x=>x.prompt&&x.model&&Number.isFinite(x.creditsEstimate)),'Every gap has a prompt/model/estimate');ok(requests.reduce((n,x)=>n+x.creditsEstimate,0)===12516,'Remaining target estimate');
const samples=JSON.parse(fs.readFileSync(out+'/sample-fixtures.json'));for(const trade of ['Roofing','HVAC']){const group=samples.filter(s=>s.settings.trade===trade);ok(new Set(group.map(s=>s.settings.mediaPicks.slots.hero.assetId)).size===group.length,trade+' proof heroes distinct');ok(group.every(s=>s.isSample&&s.fictional&&s.settings.name.startsWith('Sample Fictional ')),trade+' explicit Sample fixtures');}
fs.writeFileSync(out+'/checks/media-inventory-validation.json',JSON.stringify({passed:true,checks,catalogAssets:Object.keys(mediaCatalog.assets).length,approvedClips:approved.filter(x=>x.kind==='clip').length,approvedStills:approved.filter(x=>x.kind==='still').length,providerCalls:0,creditsUsed:0},null,2));console.log('PASS '+checks+' media inventory checks');
