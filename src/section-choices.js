// Optional draft/published JSON fields. Missing choices retain the accepted renderer.
export const SECTION_KEYS=['hero','services','process','financing','reviews','finalCta'];
export const SECTION_VARIANTS=['a','b','c'];
export function cleanSectionChoices(input,previous={}){
 const out={};
 const choices=input.sectionVariants===undefined?previous.sectionVariants:input.sectionVariants;
 if(choices!==undefined){
  if(!choices||typeof choices!=='object'||Array.isArray(choices))throw Error('Choose section layouts a, b or c.');
  out.sectionVariants={};
  for(const [section,value] of Object.entries(choices)){
   if(!SECTION_KEYS.includes(section)||!SECTION_VARIANTS.includes(value))throw Error('Choose section layouts a, b or c.');
   out.sectionVariants[section]=value;
  }
 }
 const minimum=input.minReviewRating===undefined?previous.minReviewRating:input.minReviewRating;
 if(minimum!==undefined){
  if(!['all',3,4,5].includes(minimum))throw Error('Choose all reviews or a minimum rating of 3, 4 or 5.');
  out.minReviewRating=minimum;
 }
 return out;
}
export const sectionChoice=(settings,section)=>SECTION_VARIANTS.includes(settings.sectionVariants?.[section])?settings.sectionVariants[section]:'a';
