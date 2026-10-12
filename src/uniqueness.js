import {STYLE_IDS,stableSiteStyleSeed,selectedSiteStyle} from './design-styles.js';
import {SECTION_KEYS,SECTION_VARIANTS} from './section-choices.js';
import {chooseCopy,contractorFacts,COPY_VERSION} from './generation-copy.js';

export const UNIQUENESS_VERSION=1;
export const PICK_KEYS=['style',...SECTION_KEYS];
export const canonical=value=>JSON.stringify(value,(_key,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const clone=v=>JSON.parse(JSON.stringify(v));
export const factsKey=s=>canonical(contractorFacts(s));
export const pickDistance=(a,b)=>PICK_KEYS.reduce((n,key)=>n+Number(a[key]!==b[key]),0);
export const patternCatalog={hero:{a:'film-story',b:'media-split',c:'headline-panorama'},services:{a:'card-grid',b:'alternating-rows',c:'disclosure-list'},process:{a:'illustrated-sequence',b:'vertical-timeline',c:'horizontal-step-cards'},financing:{a:'calculator-stack',b:'calculator-workbench',c:'calculator-sidebar'},reviews:{a:'card-grid',b:'review-editorial-list',c:'review-feature-grid'},finalCta:{a:'inquiry-split',b:'inquiry-wide',c:'inquiry-aside'}};
export function pageRuleFailures(picks,s){
 // Reserve distinct patterns even for an omitted review section, so connecting a
 // real source later cannot reveal a duplicate layout.
 const active=SECTION_KEYS.filter(k=>k!=='financing');
 const seen=new Set(),failures=[];
 for(const key of active){const pattern=patternCatalog[key][picks[key]];if(seen.has(pattern))failures.push('Repeated section structure: '+pattern);seen.add(pattern)}
 // Every approved hero/final CTA has exactly one primary; all other variants have at most one.
 if(s.sections?.some(x=>x.id==='contact'&&x.enabled===false))failures.push('The final CTA is disabled. Enable Contact before regenerating.');
 return failures;
}
function unpack(index){const p={style:STYLE_IDS[index%4]};index=Math.floor(index/4);for(const key of SECTION_KEYS){p[key]=SECTION_VARIANTS[index%3];index=Math.floor(index/3)}return p;}
function validOverrides(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['seed','style','sections'].includes(k)))throw Error('Choose a seed, style or section override.');
 const out={};
 if(value.seed!==undefined){if(!Number.isSafeInteger(value.seed)||value.seed<0||value.seed>4294967295)throw Error('Seed must be an integer from 0 to 4294967295.');out.seed=value.seed;}
 if(value.style!==undefined){if(!STYLE_IDS.includes(value.style))throw Error('Choose a valid style override.');out.style=value.style;}
 if(value.sections!==undefined){if(!value.sections||typeof value.sections!=='object'||Array.isArray(value.sections))throw Error('Choose valid section overrides.');out.sections={};for(const [key,v]of Object.entries(value.sections)){if(!SECTION_KEYS.includes(key)||!SECTION_VARIANTS.includes(v))throw Error('Choose section layouts a, b or c.');out.sections[key]=v}}
 return out;
}
export function existingPicks(s){return {style:selectedSiteStyle(s),...Object.fromEntries(SECTION_KEYS.map(key=>[key,s.sectionVariants?.[key]||'a']))};}
export function selectUnique(s,siteId,{existing=[],overrides,actor=null}={}){
 const prior=s.uniqueness;
 if(overrides!==undefined&&(!actor?.id||actor.role!=='admin'))throw Error('Staff administrator access is required for seed and layout overrides.');
 const supplied=overrides===undefined?null:validOverrides(overrides);
 const remembered=prior?.overrides?.values||{};
 const values=supplied?{...remembered,...supplied,...(supplied.sections?{sections:{...remembered.sections,...supplied.sections}}:{})}:remembered;
 const seed=values.seed??prior?.seed??s.siteStyleSeed??stableSiteStyleSeed(siteId);
 const style=s.siteStyle||values.style;
 const fixed={...(style?{style}:{}),...values.sections};
 const identity={seed,facts:factsKey(s),look:s.siteStyle||null,overrides:values};
 // Saved choices are a reservation. New neighbours cannot silently reroll an existing site.
 if(prior&&!prior.reselectOnRegenerate&&canonical(prior.identity)===canonical(identity))return clone(prior);
 const neighbours=existing.filter(x=>x.id!==siteId&&x.settings.trade===s.trade).sort((a,b)=>a.id.localeCompare(b.id)).map(x=>({id:x.id,picks:existingPicks(x.settings)}));
 const total=4*3**6,start=stableSiteStyleSeed(seed+':layouts')%total;
 const fallbacks=[],reasons=new Map();let best=null,bestDistance=-1,considered=0,valid=0;
 const note=(reason,index)=>{const previous=reasons.get(reason);if(previous)previous.count++;else reasons.set(reason,{reason,count:1,firstCandidate:index});};
 for(let n=0;n<total;n++){
  const index=(start+n*5)%total,picks=unpack(index);
  if(Object.entries(fixed).some(([key,value])=>picks[key]!==value))continue;
  considered++;
  const failures=pageRuleFailures(picks,s);if(failures.length){for(const why of failures)note(why,index);continue}valid++;
  const distance=neighbours.length?Math.min(...neighbours.map(x=>pickDistance(picks,x.picks))):7;
  if(distance>bestDistance){best=picks;bestDistance=distance;}
  if(distance>=3){best=picks;bestDistance=distance;break}
  note('Same-trade distance below 3 of 7 picks',index);
 }
 if(!best)throw Error('These choices cannot satisfy the page rules. '+[...reasons.keys()].join(' '));
 fallbacks.push(...reasons.values());
 if(s.siteStyle&&values.style&&s.siteStyle!==values.style)fallbacks.push({reason:'Contractor Look takes precedence over staff style override',count:1});
 const copy=chooseCopy(s,seed),headings=Object.values(copy).map(x=>x.heading);
 if(new Set(headings).size!==headings.length)throw Error('Copy slots repeat the same point.');
 return {version:UNIQUENESS_VERSION,seed,seedSource:values.seed!==undefined?'staff override':(prior?.seedSource||(s.siteStyleSeed!==undefined?'stored site seed':'site ID')),identity,style:best.style,sections:Object.fromEntries(SECTION_KEYS.map(k=>[k,best[k]])),copyVersion:COPY_VERSION,copy,copyStatus:'AI copy not connected',copyMode:'authored-local',overrides:{values,history:[...(prior?.overrides?.history||[]),...(supplied?[{by:{id:actor.id,role:actor.role},values:supplied}]:[])],look:s.siteStyle?{value:s.siteStyle,source:'contractor chosen Look'}:null},fallbacks,uniqueness:{status:bestDistance>=3?'distinct':'pool exhausted',minimumDistance:bestDistance,requiredDistance:3,comparedSites:new Set(neighbours.map(x=>x.id)).size,comparedSnapshots:neighbours.length,considered,validCandidates:valid,poolSize:total,poolFingerprint:stableSiteStyleSeed(canonical(neighbours)).toString(16),against:neighbours.map(x=>({siteId:x.id,distance:pickDistance(best,x.picks)})).sort((a,b)=>a.distance-b.distance||a.siteId.localeCompare(b.siteId)).slice(0,32),detailsLimitedTo:32},rules:{primary:'hero and final CTA exactly one; other sections at most one',points:{hero:'relevance',services:'scope',process:'next steps',financing:'payment comparison',reviews:'source evidence',finalCta:'project request'},patterns:Object.fromEntries(SECTION_KEYS.map(k=>[k,patternCatalog[k][best[k]]]))}};
}
export function applyUniqueChoices(s,record){return {...s,minReviewRating:s.minReviewRating??'all',siteStyleSeed:record.seed,sectionVariants:clone(record.sections),uniqueness:clone(record)};}
// Copy is refreshed when facts change; layout reservations and staff provenance stay stable.
export function refreshGeneratedCopy(s){if(!s.uniqueness)return s;const u=clone(s.uniqueness);if((u.identity.look||null)!==(s.siteStyle||null)){u.reselectOnRegenerate=true;u.uniqueness={...u.uniqueness,status:'Look changed; comparison pending',minimumDistance:null,against:[]};}u.copy=chooseCopy(s,u.seed);u.identity={...u.identity,facts:factsKey(s),look:s.siteStyle||null};u.overrides.look=s.siteStyle?{...(u.overrides.look||{}),value:s.siteStyle,source:'contractor chosen Look'}:null;if(s.siteStyle)u.style=s.siteStyle;return {...s,uniqueness:u};}
export function replayUniqueChoices(s,manifest){const choices=manifest?.choices,record=choices?.uniqueness;if(!record||record.version!==1||record.identity.facts!==factsKey(s))throw Error('The manifest needs the same contractor facts to replay.');const restored={...s};for(const key of ['design','template','designKit','color','effects','sections','scrollStory','roofingCta','journey'])if(choices[key]!==undefined)restored[key]=clone(choices[key]);if(choices.siteStyle)restored.siteStyle=choices.siteStyle;else delete restored.siteStyle;restored.generationId=choices.treatments.seed;if(choices.thumbnail)Object.assign(restored,clone(choices.thumbnail));if(choices.mediaPicks){restored.mediaPicks=clone(choices.mediaPicks);restored.heroPhotoId=choices.imagery.heroPhotoId;}else delete restored.mediaPicks;return applyUniqueChoices(restored,record);}

// A Look save retains the section layouts promised by the existing picker. Record
// the actual distance for that explicit override, then reconsider at regeneration
// only if the fixed saved layouts cannot maintain the target distance.
export function reassessLook(s,existing,siteId){
 if(!s.uniqueness?.reselectOnRegenerate)return s;
 const record=clone(s.uniqueness),picks=existingPicks(s),neighbours=existing.filter(x=>x.id!==siteId&&x.settings.trade===s.trade).sort((a,b)=>a.id.localeCompare(b.id)),distances=neighbours.map(x=>({siteId:x.id,distance:pickDistance(picks,existingPicks(x.settings))})),minimum=distances.length?Math.min(...distances.map(x=>x.distance)):7;
 record.uniqueness={status:minimum>=3?'distinct':'pool exhausted',minimumDistance:minimum,requiredDistance:3,comparedSites:new Set(neighbours.map(x=>x.id)).size,comparedSnapshots:neighbours.length,poolSize:1,considered:1,validCandidates:1,constraint:'Contractor Look override with saved section layouts retained',against:distances.sort((a,b)=>a.distance-b.distance||a.siteId.localeCompare(b.siteId)).slice(0,32),detailsLimitedTo:32,poolFingerprint:stableSiteStyleSeed(canonical(neighbours.map(x=>({id:x.id,picks:existingPicks(x.settings)})))).toString(16)};
 record.reselectOnRegenerate=minimum<3;
 return {...s,uniqueness:record};
}
