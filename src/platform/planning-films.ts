import catalog from '../../public/planning-films.json' with {type:'json'};
import {serviceLayoutVariant} from '../service-content.js';
export const financingAmbient=catalog.slots['roofing-financing-ambient'];
export const financingScroll=catalog.slots['roofing-financing-scroll'];
export const promotionsAmbient=catalog.slots['roofing-promotions-ambient'];
// A fixed installed catalog selection, never a render-time or vendor selection.
// Existing revisions keep their saved descriptor when the catalog gains assets later.
export function cleanPlanningFilms(input:any,previous:any,seed:string){
 const prior=previous||{version:1,financingAmbient:{...financingAmbient,treatment:serviceLayoutVariant(seed)}};
 const expected={...prior,financingScroll:prior.financingScroll||{...financingScroll,treatment:serviceLayoutVariant(seed)},promotionsAmbient:prior.promotionsAmbient||{...promotionsAmbient,treatment:serviceLayoutVariant(seed)}};
 const canonical=(v:any):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 if(input!==undefined&&canonical(input)!==canonical(expected)&&(!previous||canonical(input)!==canonical(previous)))throw Error('Planning media is an installed catalog choice. Keep the saved selection.');
 return JSON.parse(JSON.stringify(expected));
}
