import {cleanDesign,designOptions} from '../design-variant.js';
import {cleanThumbnailMotion} from './thumbnail-motion.ts';
import {serviceLayoutVariant} from '../service-content.js';
export const GENERATION_VERSION=1;
export const DESIGN_OPTIONS:Record<string,string[]>=Object.fromEntries(['font','cards','rhythm','palette','serviceLayout','ownerLayout','bannerArt','headlineMotion','entrance'].map(k=>[k,(designOptions as Record<string,string[]>)[k]]));
export const stable=(v:any):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const copy=(v:any)=>JSON.parse(JSON.stringify(v));
const fail=(condition:any,message='Generation manifest is invalid. Restore a valid revision before continuing.')=>{if(!condition)throw new Error(message)};
export function fingerprint(value:any){let h=2166136261;for(const c of stable(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
export function choicesFor(s:any,slug:string){return {...(s.mediaPicks?{mediaPicks:s.mediaPicks}:{}),...(s.uniqueness?{uniqueness:s.uniqueness,sectionVariants:s.sectionVariants,minReviewRating:s.minReviewRating}:{}),...(s.siteStyle!==undefined||s.siteStyleSeed!==undefined?{siteStyle:s.siteStyle||null,siteStyleSeed:s.siteStyleSeed??null}:{}),...(s.planningFilms?{planningFilms:s.planningFilms}:{}),design:cleanDesign(s.design),template:s.template,designKit:s.designKit||'',color:s.color, effects:s.effects||{},sections:s.sections||[],treatments:{seed:s.generationId||slug,variant:serviceLayoutVariant(s.generationId||slug)},thumbnail:s.trade==='Roofing'?cleanThumbnailMotion(s):null,scrollStory:s.scrollStory||null,roofingCta:s.roofingCta||null,journey:s.journey||'standard',imagery:{logoId:s.logoId||null,heroPhotoId:s.heroPhotoId||null,ownerPhotoId:s.ownerPhotoId||null,ownerPhoto:s.ownerPhoto||null,pages:{version:s.websitePages?.version||1,items:(s.websitePages?.pages||[]).map((p:any)=>({id:p.id,media:p.media||null,titleLocked:p.titleLocked===true,copy:fingerprint(p)}))}},editorial:{ebook:s.ebook||null,about:s.websitePages?.about||null,creativeBrief:s.creativeBrief||''}}}
export function lockDefaults(s:any){return {...Object.fromEntries(Object.keys(cleanDesign(s.design)).map(k=>['design.'+k,false])),template:false,effects:false,treatments:false,thumbnail:s.thumb_motion_locked===true,imagery:true,scrollStory:true,roofingCta:s.roofingCta?.locked===true,editorial:true};}
export function validateManifest(m:any,s:any,siteId:string,slug:string){
 fail(m&&typeof m==='object'&&!Array.isArray(m));fail(m.version===1&&m.siteId===siteId&&m.slug===slug&&Number.isSafeInteger(m.revision)&&m.revision>=1&&typeof m.id==='string'&&/^gen-[a-zA-Z0-9-]+$/.test(m.id));
 fail(typeof m.createdAt==='string'&&Number.isFinite(Date.parse(m.createdAt))&&['adopt','save','regenerate','locks','restore'].includes(m.reason));
 const keys=Object.keys(lockDefaults(s));fail(m.locks&&Object.keys(m.locks).length===keys.length&&keys.every(k=>typeof m.locks[k]==='boolean'));
 fail(stable(m.choices)===stable(choicesFor(s,slug)),'Saved choices do not match the generation manifest. Reload or restore a valid revision.');
 fail(Array.isArray(m.assets)&&m.assets.length<12000&&m.assets.every((a:any)=>typeof a==='string'&&a.length<600&&/^\/(?:assets|media)\//.test(a)));
 fail(Array.isArray(m.jobs)&&m.jobs.length===7&&m.jobs.every((j:any)=>j.status==='Pending'&&j.connection==='Not connected'&&typeof j.slot==='string'));
 fail(m.digest===fingerprint({...m,digest:undefined}));return m;
}
export function createManifest(s:any,siteId:string,slug:string,assets:string[],old:any=null,reason='adopt',locks:any=null){
 const m:any={version:1,siteId,slug,revision:(old?.revision||0)+1,id:'gen-'+crypto.randomUUID(),createdAt:new Date().toISOString(),reason,choices:choicesFor(s,slug),locks:locks||old?.locks||lockDefaults(s),assets:[...new Set(assets)].sort(),jobs:['Hero / banners','Service graphics','Ebook composition','City banners','Story / FAQ accents','Financing / promotion films','About portrait / shorts'].map(slot=>({slot,status:'Pending',connection:'Not connected',note:'Existing approved assets retained. No new AI work has run.'}))};m.locks={...m.locks,thumbnail:s.trade==='Roofing'?s.thumb_motion_locked===true:m.locks.thumbnail,roofingCta:s.trade==='Roofing'?s.roofingCta?.locked===true:m.locks.roofingCta};m.digest=fingerprint(m);return m;
}
export function nextSettings(s:any,manifest:any){
 const out=copy(s),d:Record<string,any>=cleanDesign(out.design);out.design=d;
 for(const [key,options]of Object.entries(DESIGN_OPTIONS))if(!manifest.locks['design.'+key])d[key]=options[(options.indexOf(d[key])+1)%options.length];
 // Keep IA, business facts, URLs and all protected media/content unchanged.
 if(!manifest.locks.effects)out.effects={...out.effects,spotlight:out.effects?.spotlight===false};
 if(!manifest.locks.template){const values=['cinematic','editorial','blueprint'];out.template=values[(values.indexOf(out.template)+1)%values.length]}
 // Existing generationId remains the treatment seed. A separate manifest ID records every revision.
 if(!manifest.locks.treatments){let seed='';for(let i=1;i<20;i++){seed=manifest.id+'-'+i;if(serviceLayoutVariant(seed)!==manifest.choices.treatments.variant)break}out.generationId=seed}
 if(out.trade==='Roofing'&&!manifest.locks.thumbnail){const prior=cleanThumbnailMotion(s);let next=prior;for(let i=1;i<20;i++){next=cleanThumbnailMotion({...s,thumb_motion_locked:false},prior,manifest.id+'-thumb-'+i);if(next.thumb_motion_effect!==prior.thumb_motion_effect)break}Object.assign(out,next)}
 return out;
}
