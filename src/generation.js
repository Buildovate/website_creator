import {selectMedia,refreshMediaTreatment} from './media-library.js';
import {selectUnique,applyUniqueChoices,refreshGeneratedCopy} from './uniqueness.js';
import {cleanThumbnailMotion} from './platform/thumbnail-motion.ts';
import {cleanRoofingCta} from './platform/roofing-cta.ts';
import {createManifest,validateManifest,stable,choicesFor,nextSettings,lockDefaults} from './platform/generation.ts';
import {kits} from './design-kits.js';
import art from '../public/service-art.json' with {type:'json'};
import media from '../public/service-media.json' with {type:'json'};
import films from '../public/trade-films.json' with {type:'json'};
import cutaways from '../public/cutaways.json' with {type:'json'};
import pricingFilms from '../public/pricing-films.json' with {type:'json'};
import {tradeMotion} from './trade-motion-config.js';
import {roofingCityEditorial} from './city-editorial.js';
import guide from './ebook/guide.json' with {type:'json'};
let renderInventory=()=>[];
export function configureGenerationInventory(fn){renderInventory=fn}
// Read-only inventory from the same installed catalogs and renderers, never a second selector.
export function assetReferences(s,slug){const found=new Set();const walk=v=>{if(typeof v==='string'){for(const m of v.matchAll(/\/(?:assets|media)\/[a-zA-Z0-9_./%-]+/g))found.add(m[0])}else if(v&&typeof v==='object')Object.entries(v).forEach(([key,value])=>{if(/^(?:photoId|logoId|heroPhotoId|ownerPhotoId|posterId|beforeId|afterId|mediaId)$/.test(key)&&typeof value==='string'&&/^[a-zA-Z0-9_-]+$/.test(value))found.add('/media/'+value);walk(value)})};walk(s);const kit=kits[s.designKit];walk(kit);walk(films[s.designKit]);walk(pricingFilms[s.designKit]);walk(cutaways[s.designKit]);for(const x of s.services||[]){const key=x.name.toLowerCase();walk(art[s.trade]?.[key]);walk(media[s.trade]?.[key])}if(s.trade==='Roofing'){walk(tradeMotion);walk(roofingCityEditorial);walk(guide)}
 walk(renderInventory(s,slug));return [...found].sort();}
export function assertGeneration(s,id,slug){if(Object.hasOwn(s,'generationManifest'))validateManifest(s.generationManifest,s,id,slug);return s}
export function adoptGeneration(s,id,slug){assertGeneration(s,id,slug);if(s.generationManifest)return s;const adopted=s.trade==='Roofing'?{...s,...cleanThumbnailMotion(s),roofingCta:s.roofingCta||cleanRoofingCta({}, {},s.generationId||s.name)}:s;return {...adopted,generationManifest:createManifest(adopted,id,slug,assetReferences(adopted,slug))}}
export function saveGeneration(s,old,id,slug,reason='save',locks=null,actor=null){assertGeneration(old,id,slug);const prior=old.generationManifest;const m=prior||adoptGeneration(old,id,slug).generationManifest;
 s=refreshMediaTreatment(refreshGeneratedCopy(s));if(s.uniqueness&&s.siteStyle&&s.siteStyle!==old.siteStyle)s.uniqueness.overrides.look={value:s.siteStyle,source:'contractor chosen Look',by:actor||null};const choices=choicesFor(s,slug);if(stable(choices)===stable(m.choices)&&!locks&&reason==='save')return {...s,generationManifest:m};
 return {...s,generationManifest:createManifest(s,id,slug,assetReferences(s,slug),m,reason,locks)};}
export function regenerate(s,id,slug,options={}){const m=adoptGeneration(s,id,slug).generationManifest;
 const record=selectUnique(s,id,options);
 // Legacy unlocked compositions advance once at adoption using the stable seed,
 // never the revision UUID. Later regeneration replays its saved reservation.
 const base=s.uniqueness?s:nextSettings(s,{...m,id:'gen-seed-'+record.seed});
 const chosen=applyUniqueChoices(base,record);
 if(chosen.designKit)chosen.mediaPicks=selectMedia(chosen,id,options);
 return saveGeneration(chosen,{...s,generationManifest:m},id,slug,'regenerate');}
export async function generationNeighbours(env,id){const {results}=await env.DB.prepare('SELECT id,settings,published FROM tenants WHERE id<>?').bind(id).all();return results.flatMap(row=>[...new Set([row.settings,row.published].filter(Boolean))].map(value=>({id:row.id,settings:JSON.parse(value)})));}
export function changedLocks(old,next){return old.thumb_motion_locked!==next.thumb_motion_locked||old.roofingCta?.locked!==next.roofingCta?.locked}
export function checkLockedEdits(old,next){const m=old.generationManifest;if(!m)return;const choices=choicesFor(next,m.slug);for(const [key,locked]of Object.entries(m.locks)){if(!locked)continue;if(key.startsWith('design.')){const k=key.slice(7);if(stable(m.choices.design[k])!==stable(choices.design[k]))throw Error('Unlock '+k+' before changing this saved choice.')}else if(['template','effects','treatments'].includes(key)&&stable(m.choices[key])!==stable(choices[key]))throw Error('Unlock '+key+' before changing this saved choice.')}}
export function applyLocks(s,values,id,slug){const m=adoptGeneration(s,id,slug).generationManifest,keys=Object.keys(lockDefaults(s));if(!values||Object.keys(values).some(k=>!keys.includes(k))||Object.values(values).some(v=>typeof v!=='boolean'))throw Error('Choose valid boolean locks.');const locks={...m.locks,...values},next={...s};if(s.trade==='Roofing'){next.thumb_motion_locked=locks.thumbnail;next.roofingCta={...s.roofingCta,locked:locks.roofingCta}}return saveGeneration(next,{...s,generationManifest:m},id,slug,'locks',locks)}
export async function recordGeneration(env,s){if(env.REVIEW_ISOLATED)return;const m=s.generationManifest;if(!m)return;await env.DB.prepare("INSERT OR IGNORE INTO generation_manifests(id,tenant_id,data,created_at) VALUES(?,?,?,?)").bind(m.id,m.siteId,JSON.stringify(m),m.createdAt).run()}

// Older editors may deliberately restore saved settings while holding the current row version.
// Accept only an exact historical server record, then discard its metadata and retain current locks.
export async function reconcileSubmittedManifest(env,input,previous,siteId){
 if(!input?.generationManifest||stable(input.generationManifest)===stable(previous.generationManifest))return;
 const row=await env.DB.prepare('SELECT data FROM generation_manifests WHERE id=? AND tenant_id=?').bind(input.generationManifest.id||'',siteId).first();
 if(!row||stable(JSON.parse(row.data))!==stable(input.generationManifest))throw Error('Generation manifest is server-owned. Reload before saving.');
 input.generationManifest=previous.generationManifest;
}

// Serialize same-trade reservations in the existing JSON record store. The CAS and
// tenant write share a DB batch transaction, including across server processes.
export async function commitUniqueGeneration(env,old,id,slug,version,options,at){
 const poolId='generation-pool-'+encodeURIComponent(old.trade);
 await env.DB.prepare('INSERT OR IGNORE INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,?,?,1,?,?)').bind(poolId,'global','generation_pool','{}',at,at).run();
 for(let attempt=0;attempt<4;attempt++){
  const pool=await env.DB.prepare('SELECT version FROM workspace_records WHERE id=?').bind(poolId).first();
  const s=regenerate(old,id,slug,{...options,existing:await generationNeighbours(env,id)}),token=JSON.stringify({reservation:s.generationManifest.id});
  const results=await env.DB.batch([
   env.DB.prepare('UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND version=?').bind(token,at,poolId,pool.version),
   env.DB.prepare('UPDATE tenants SET settings=?,version=version+1,updated_at=? WHERE id=? AND version=? AND EXISTS (SELECT 1 FROM workspace_records WHERE id=? AND data=?)').bind(JSON.stringify(s),at,id,version,poolId,token)
  ]);
  if(results[0].meta.changes)return {settings:s,result:results[1]};
 }
 throw Error('Another site is reserving its design. Retry generation with the same seed.');
}
