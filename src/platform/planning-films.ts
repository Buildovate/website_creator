import catalog from '../../public/planning-films.json' with {type:'json'};
import {serviceLayoutVariant} from '../service-content.js';
export const financingChapter=catalog.slots['roofing-financing-chapter'];
export const financingAmbient=catalog.slots['roofing-financing-ambient'];
export const financingScroll=catalog.slots['roofing-financing-scroll'];
export const promotionsAmbient=catalog.slots['roofing-promotions-ambient'];
export const promotionsScroll=catalog.slots['roofing-promotions-scroll'];
// A fixed installed catalog selection, never a render-time or vendor selection.
// Upgrade reviewed Pending slots on draft save; published snapshots remain unchanged until publish.
export function cleanPlanningFilms(input:any,previous:any,seed:string){
 const prior=previous||{version:1,financingAmbient:{...financingAmbient,treatment:serviceLayoutVariant(seed)}};
 const upgrades:any={financingAmbient,financingScroll,promotionsAmbient,promotionsScroll};
 const selected={...prior};for(const [key,current] of Object.entries(upgrades) as [string,any][]){const saved=prior[key];if(saved?.status==='Pending'&&saved.id===current.id.replace(/-v\d+$/,'-v1')&&current.status==='Ready')selected[key]={...current,treatment:saved.treatment};}
 const expected={...selected,financingScroll:selected.financingScroll||{...financingScroll,treatment:serviceLayoutVariant(seed)},promotionsAmbient:selected.promotionsAmbient||{...promotionsAmbient,treatment:serviceLayoutVariant(seed)},promotionsScroll:selected.promotionsScroll||{...promotionsScroll,treatment:prior.promotionsAmbient?.treatment??serviceLayoutVariant(seed)}};
 const canonical=(v:any):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 if(input!==undefined&&canonical(input)!==canonical(expected)&&(!previous||canonical(input)!==canonical(previous)))throw Error('Planning media is an installed catalog choice. Keep the saved selection.');
 return JSON.parse(JSON.stringify(expected));
}
