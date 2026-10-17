import catalog from '../public/trade-media-library.json' with {type:'json'};
import {stableSiteStyleSeed} from './design-styles.js';
export const mediaCatalog=catalog;
export const MEDIA_SLOTS=['hero','services','process','financing','finalCta'];
const clone=v=>JSON.parse(JSON.stringify(v));
export const approvedAsset=(id,c=catalog)=>{const a=c.assets[id];return a?.approvalStatus==='approved'&&a.source?.jobId&&a.rights?.record&&a.approver?a:null;};
export function mediaPool(kit,slot,c=catalog){const t=c.trades[kit];if(!t)return [];const stills=(slot==='hero'?t.heroStills:t.sectionStills[slot])||[];const clips=t.heroClipSlots.map(x=>x.assetId).filter(id=>approvedAsset(id,c)&&approvedAsset(c.assets[id].posterId,c));return (slot==='hero'&&clips.length>=2?clips:stills).filter(id=>approvedAsset(id,c));}
export function paletteTreatment(color,asset){return asset?.mayBeRecolored&&/^#[0-9a-f]{6}$/i.test(color||'')?{type:'css-tint',color:color.toLowerCase(),opacity:.12,scope:'media pixels only; text unchanged'}:{type:'none'};}
export function mediaSnapshot(id,color,c=catalog){const a=approvedAsset(id,c);if(!a)throw Error('Media must have approved provenance and visual review.');const poster=a.kind==='clip'?approvedAsset(a.posterId,c):a;if(!poster)throw Error('Clip needs an independently approved poster.');return {kind:'library',assetId:id,assetKind:a.kind,url:a.url,sha256:a.sha256,poster:{assetId:poster.id,url:poster.url,sha256:poster.sha256},treatment:paletteTreatment(color,a)};}
export function selectMedia(s,siteId,{existing=[],mediaOverrides,actor=null,catalog:c=catalog}={}){
 const t=c.trades[s.designKit];if(!t||t.trade!==s.trade)throw Error('Choose a trade library before regenerating.');
 if(mediaOverrides!==undefined&&(!actor?.id||actor.role!=='admin'))throw Error('Staff administrator access is required for media overrides.');
 if(mediaOverrides!==undefined&&(!mediaOverrides||typeof mediaOverrides!=='object'||Array.isArray(mediaOverrides)||Object.keys(mediaOverrides).some(k=>!MEDIA_SLOTS.includes(k))))throw Error('Choose valid media slots.');
 const prior=s.mediaPicks,seed=s.uniqueness?.seed??s.siteStyleSeed??stableSiteStyleSeed(siteId),overrides={...prior?.overrides?.values,...mediaOverrides};
 const ownedHero=s.heroPhotoId||s.scrollStory?.posterId||null;
 const identity=JSON.stringify({seed,kit:s.designKit,color:s.color,ownedHero,overrides});
 if(prior?.identity===identity&&MEDIA_SLOTS.every(k=>prior.slots[k]?.kind==='owned'||(approvedAsset(prior.slots[k]?.assetId,c)&&approvedAsset(prior.slots[k]?.poster?.assetId,c))))return clone(prior);
 const neighbours=existing.filter(x=>x.id!==siteId&&x.settings.trade===s.trade),slots={},decisions=[];
 for(const slot of MEDIA_SLOTS){
  const pool=mediaPool(s.designKit,slot,c),override=overrides[slot];
  if(!pool.length)throw Error('No approved '+slot+' media for '+s.trade+'.');
  if(override!==undefined&&!pool.includes(override))throw Error('Choose an approved asset in this slot’s eligible trade pool. Thin hero pools require a still.');
  const usage=id=>new Set(neighbours.filter(x=>{const other=x.settings.mediaPicks?.slots?.[slot];if(slot!=='hero')return other?.assetId===id;const a=c.assets[id],b=c.assets[other?.assetId];if(b)return a.source.jobId===b.source.jobId;if(x.settings.heroPhotoId||x.settings.scrollStory?.posterId)return false;return a.source.record==='public/trade-build-films.json'&&x.settings.designKit===s.designKit&&x.settings.scrollStory?.mode==='build';}).map(x=>x.id)).size;
  const ordered=[...pool].sort((a,b)=>stableSiteStyleSeed(seed+':media:'+slot+':'+a)-stableSiteStyleSeed(seed+':media:'+slot+':'+b)||a.localeCompare(b));
  const least=Math.min(...ordered.map(usage));const chosen=override||ordered.find(id=>usage(id)===least&&!Object.values(slots).some(x=>x.assetId===id))||ordered.find(id=>usage(id)===least);
  slots[slot]=mediaSnapshot(chosen,s.color,c);if(slot==='hero'&&ownedHero){slots[slot].ownedPhotoId=ownedHero;decisions.push({slot,reason:'Selected contractor-owned photo takes priority; approved library reservation remains as fallback.'});}
  decisions.push({slot,poolSize:pool.length,usedBySameTradeSites:usage(chosen),status:usage(chosen)?'pool exhausted or staff override':'distinct',source:override?'staff override':'seed',reason:slot==='hero'&&slots[slot].assetKind==='still'?'Fewer than two approved hero clips; seeded approved still fallback.':'Approved media only.'});
 }
 return {version:1,seed,identity,trade:s.trade,kit:s.designKit,catalogVersion:c.version,customPerContractorVideoEnabled:false,slots,overrides:{values:overrides,history:[...(prior?.overrides?.history||[]),...(mediaOverrides!==undefined?[{by:{id:actor.id,role:actor.role},values:clone(mediaOverrides)}]:[])]},decisions};
}
// Revalidation fails closed. A pending/revoked clip can only show its still-approved
// saved poster. No catalog update silently substitutes another asset on replay.
const sameEncoding=(asset,pick)=>!!asset&&!!pick&&(asset.sha256===pick.sha256&&asset.url===pick.url||(asset.encodingRevisions||[]).some(x=>x.sha256===pick.sha256&&x.url===pick.url));
export function resolveMedia(pick,photos=[],c=catalog){
 if(pick?.ownedPhotoId&&photos.some(x=>x.id===pick.ownedPhotoId))return {url:'/media/'+pick.ownedPhotoId,kind:'still',owned:true,treatment:{type:'none'}};
 if(pick?.kind==='owned')return photos.some(x=>x.id===pick.photoId)?{url:'/media/'+pick.photoId,kind:'still',owned:true,treatment:{type:'none'}}:null;
 if(pick?.kind!=='library')return null;
 const a=approvedAsset(pick.assetId,c),p=approvedAsset(pick.poster?.assetId,c);
 const poster=p?.kind==='still'&&sameEncoding(p,pick.poster)?p.url:null;
 if(a&&sameEncoding(a,pick)&&(a.kind!=='clip'||poster))return {url:a.url,kind:a.kind,poster:poster||a.url,treatment:a.mayBeRecolored?pick.treatment:{type:'none'}};
 return poster?{url:poster,poster,kind:'still',treatment:{type:'none'},fallback:'clip pending or unavailable'}:null;
}

export function refreshMediaTreatment(s){if(!s.mediaPicks)return s;if(s.mediaPicks.kit!==s.designKit||s.mediaPicks.trade!==s.trade){const next={...s};delete next.mediaPicks;return next;}const m=clone(s.mediaPicks);for(const pick of Object.values(m.slots)){if(pick.kind==='library')pick.treatment=paletteTreatment(s.color,approvedAsset(pick.assetId));}const owned=s.heroPhotoId||s.scrollStory?.posterId||null;if(m.slots.hero){if(owned)m.slots.hero.ownedPhotoId=owned;else delete m.slots.hero.ownedPhotoId;}const identity=JSON.parse(m.identity);identity.color=s.color;identity.ownedHero=owned;m.identity=JSON.stringify(identity);return {...s,mediaPicks:m};}
