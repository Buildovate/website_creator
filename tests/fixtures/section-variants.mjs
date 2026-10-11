import fs from 'node:fs';
export const sectionKeys=['hero','services','process','financing','reviews','finalCta'];
export const styles=['current','bold','fresh','classic'];
export const variants=['a','b','c'];
export const originalRows=JSON.parse(fs.readFileSync(new URL('../../docs/build-evidence/clips-phase2/outside-scope-baseline.json',import.meta.url)));
export function variantSettings(row,style='current',variant='a',populated=true){
 const s=structuredClone(JSON.parse(row.settings));
 delete s.generationManifest;
 s.siteStyle=style;s.sectionVariants=Object.fromEntries(sectionKeys.map(key=>[key,variant]));
 s.platform.neighborhood={enabled:false};
 s.showProjects=false;s.showOwner=false;
 s.reviews=populated?{confirmed:true,minimum:0,googleUrl:'https://www.google.com/maps?cid=028028',googlePlaceId:'qa_variants',privacyUrl:'https://example.test/privacy',termsUrl:'https://example.test/terms',yelpUrl:'',yelpBusinessId:''}:{...s.reviews,confirmed:false,googleUrl:'',yelpUrl:''};
 s.platform.financing=populated?{requested:true,selection:'lenders',lenders:[{id:'hearth',enabled:true,confirmed:true,applicationUrl:'https://example.test/qa-lender'}],programs:[{id:'qa-fixed',name:'QA configured plan',lenderId:'hearth',apr:8,months:60,enabled:true,confirmed:true,deferredInterest:false}]}:{requested:false,selection:'none',lenders:[],programs:[]};
 s.platform.promotions={enabled:false,offers:[]};
 return s;
}
export const mixedReviews=[2,3,4,5].map(rating=>({rating,text:'TEST FIXTURE: '+rating+' star source excerpt. Used only for local layout verification.',author:'QA reviewer '+rating,url:'https://example.test/review/'+rating,date:'Test fixture'}));
export const fullProvider={provider:'Google Maps',rating:3.5,count:4,url:'https://www.google.com/maps?cid=028028',reviews:mixedReviews};
