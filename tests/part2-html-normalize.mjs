import catalog from '../src/installed-page-images.json' with {type:'json'};
const installed=new Set(Object.values(catalog).flatMap(items=>items.map(x=>x.url)));
export function normalizePart2HTML(html,roofing=false){
 // Item 11 changes only an installed photograph's URL/description; geometry stays exact.
 let result=html.replace(/<img\b[^>]*>/g,tag=>{const url=tag.match(/\bsrc="([^"]+)"/)?.[1];return installed.has(url)?tag.replace(/\bsrc="[^"]*"/,'src="INSTALLED-KIT-PHOTO"').replace(/ srcset="[^"]*"/,'').replace(/\balt="[^"]*"/,'alt="PHOTO-DESCRIPTION"'):tag;})
 .replace('<button type="button" data-load-reviews>Refresh reviews</button>','')
 .replace('You’ve taken the first step.','Thanks for reaching out.')
 .replace(/Thanks for sharing what your home needs\. Your request is saved with ([\s\S]*?)\.<\/p>/,'Your request is with $1. The team can follow up using the contact details you gave.</p>')
 .replace('<section class="core-panel inquiry-success"><span class="inquiry-success-mark" aria-hidden="true">✓</span><h2>Let’s keep your project moving.</h2><p>Your project details and contact information are ready for the team to review. Keep any photos or questions handy for your conversation.</p>','<section class="core-panel"><h2>What happens next?</h2><p>The team reviews your project details and contacts you to discuss scope, timing, and the next step.</p>');
 if(roofing)result=result
 .replace(/<aside class="kit-cta-band"[^>]*>[\s\S]*?<\/aside>/g,'<section data-part2-next-steps></section>')
 .replace(/<section class="roof-next-story[^>]*>[\s\S]*?<\/section>/g,'<section data-part2-next-steps></section>')
 .replace(/<section class="finance-plan-chart"[^>]*>[\s\S]*?<\/section>/g,'')
 .replace('A drip can leave you wondering how much work your roof really needs. You do not need to figure that out alone. Start with what you’ve noticed, then talk through the details around it.','Does this spot need a repair, or does the roof need a wider look? Start with what is happening around the leak—not a guess about replacing everything.')
 .replace('Follow where the water travels.','Trace the entry point.').replace('Look at the roof around it.','Check what surrounds it.').replace('Know what your repair includes.','Put the boundaries in writing.')
 .replace(/<svg class="rs-water-path"[\s\S]*?<\/svg>/,'<img class="rs-water-path" src="/assets/stories/roofing.svg" width="600" height="420" alt="" aria-hidden="true">');
 return result;
}
