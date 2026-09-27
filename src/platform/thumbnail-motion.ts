export const THUMB_EFFECTS={none:'Static photography',flip_3d:'Photo flip',zoom_overlay:'Gentle photo zoom',border_draw:'Corner frame'} as const;
export type ThumbEffect=keyof typeof THUMB_EFFECTS;
export function cleanThumbnailMotion(input:any={},previous:any={},generation=''){
 const locked=input.thumb_motion_locked===undefined?previous.thumb_motion_locked===true:input.thumb_motion_locked===true;
 const seed=locked&&previous.thumb_motion_seed?previous.thumb_motion_seed:String(generation||input.thumb_motion_seed||previous.thumb_motion_seed||input.generationId||input.name||'roofing');
 let hash=2166136261;for(const char of seed){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}
 const choices:ThumbEffect[]=['flip_3d','zoom_overlay','border_draw'];
 const regenerated=!!previous.thumb_motion_seed&&seed!==previous.thumb_motion_seed&&(!previous.generationId||generation!==previous.generationId);
 const effect:ThumbEffect=regenerated&&!locked?choices[(hash>>>0)%choices.length]:Object.hasOwn(THUMB_EFFECTS,input.thumb_motion_effect)?input.thumb_motion_effect:Object.hasOwn(THUMB_EFFECTS,previous.thumb_motion_effect)?previous.thumb_motion_effect:choices[(hash>>>0)%choices.length];
 return {thumb_motion_effect:effect,thumb_motion_locked:locked,thumb_motion_seed:seed};
}
const esc=(v:string)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function thumbnailVisual(name:string,src:string,rear:string,effect:ThumbEffect){
 return '<span class="sm-visual" data-image-state="loading"><span class="sm-fallback" aria-hidden="true">'+esc(name)+'</span><span class="sm-rotor"><img class="sm-front" src="'+esc(src)+'" alt="Illustrative '+esc(name.toLowerCase())+' photograph" width="900" height="600" loading="lazy">'+(effect==='flip_3d'&&rear?'<img class="sm-rear" src="'+esc(rear)+'" alt="" aria-hidden="true" width="900" height="600" loading="lazy">':'')+'</span><span class="sm-frame" aria-hidden="true"></span></span>';
}
