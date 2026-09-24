import {e} from './core.js';
import {kits} from './design-kits.js';

export const tradeArtId = trade => ({'Windows/Doors':'windows-doors','General Contractors':'general-contractors','Garage Doors':'garage-doors','Pest Control':'pest-control'}[trade] || String(trade).toLowerCase());
const copy = {
 'Windows/Doors':['Light changes a room. Details make it home.','A clearer plan for your next opening.','Frame your next chapter.'],
 Solar:['Your roof. A different possibility.','A solar plan starts with your home.','A clearer view of solar.'],
 Roofing:['Protection, down to the detail.','A roof worth planning for.','Good decisions start at the roof.'],
 Patios:['More room for the outdoors.','Make space for your kind of shade.','Ideas for life outside.'],
 Plumbing:['Better living. Better flow.','A clear plan for every connection.','A closer look behind the walls.'],
 HVAC:['Comfort in every corner.','Your home. Your comfort plan.','Understand the air around you.'],
 Electrical:['Every connection counts.','Plan for a brighter everyday.','Bright ideas, explained.'],
 Landscaping:['Room to grow into.','Your outdoors, thoughtfully planned.','Fresh thinking for your garden.'],
 'General Contractors':['Your vision, taking shape.','The details behind your next chapter.','A better way to plan your space.'],
 Flooring:['Every grain. Every step.','A beautiful foundation starts here.','Find your footing.'],
 Painting:['A fresh perspective in color.','A considered plan. A beautiful finish.','Color your next chapter.'],
 Fencing:['Good lines. Lasting impressions.','Define the space you call home.','Explore life within your boundaries.'],
 'Garage Doors':['A better welcome, every day.','Make an entrance worth coming home to.','Good design starts at the entrance.'],
 'Pest Control':['Care in the smallest details.','A thoughtful plan for your home.','Understand. Prepare. Protect.']
};
export function tradeBanner(s,placement='story'){
 const id=tradeArtId(s.trade),lines=copy[s.trade]||copy['General Contractors'],index={story:0,pricing:1,blog:2}[placement]||0;
 return `<figure class="trade-graphic trade-graphic-${placement}" data-trade-art="${e(id)}"><img src="${e(kits[id]?.art?.banner||'/assets/trade-art/'+id+'-craft-banner.webp')}" width="1536" height="1024" loading="lazy" alt="${e(s.trade)} materials and design inspiration"><figcaption><span>${e(s.trade.toUpperCase())} / ${placement==='pricing'?'THE PLAN':placement==='blog'?'THE JOURNAL':'THE POSSIBILITIES'}</span><strong>${e(lines[index])}</strong></figcaption></figure>`;
}
export function customerGraphic(s){return `<figure class="customer-detail-art"><img src="${e(kits[tradeArtId(s.trade)]?.art?.detail||'/assets/trade-art/'+tradeArtId(s.trade)+'-customer-detail.webp')}" width="1536" height="1024" loading="lazy" alt="${e(s.trade)} inspiration for the place you call home"></figure>`;}
export function serviceAreaRibbon(s){
 const areas=Array.isArray(s.serviceAreas)&&s.serviceAreas.length?s.serviceAreas:s.area?[{city:s.area,radiusMiles:null}]:[];
 if(!areas.length)return '';
 const list=areas.map(a=>`<b>${e(a.city)}${a.radiusMiles?` <small>+ ${e(a.radiusMiles)} miles</small>`:''}</b><i aria-hidden="true">✦</i>`).join('');
 return `<div class="kit-marquee service-area-ribbon" tabindex="0" aria-label="Service areas: ${e(areas.map(a=>a.city+(a.radiusMiles?' and '+a.radiusMiles+' miles around it':'')).join('; '))}"><div><span>${list}</span><span aria-hidden="true">${list}</span><span aria-hidden="true">${list}</span></div></div>`;
}
