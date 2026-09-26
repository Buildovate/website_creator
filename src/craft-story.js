import {tradeBanner} from './trade-visuals.js';
import {e} from './core.js';
import {heroContact} from './hero-contact.js';
import {cleanScrollStory} from './scroll-config.js';
import films from '../public/trade-craft-films.json' with {type:'json'};

const details={
 roofing:['Decking, protection, finish.','50% 35%'],patios:['Structure, shade, open air.','50% 42%'],
 plumbing:['Connections behind everyday comfort.','50% 55%'],hvac:['The system behind the comfort.','56% 48%'],
 electrical:['Every connection has a purpose.','58% 40%'],landscaping:['Groundwork for a different kind of garden.','50% 68%'],
 'general-contractors':['From structure to the finishing details.','50% 50%'],flooring:['Preparation. Precision. A beautiful finish.','50% 75%'],
 painting:['The finish starts with the preparation.','50% 40%'],fencing:['Solid posts. Thoughtful connections.','50% 50%'],
 'garage-doors':['A precise fit. A better welcome.','50% 48%'],'pest-control':['Small details. A more considered approach.','50% 65%']
};
export function craftStory(s,id,{base='',preview=false}={}){
 const c=cleanScrollStory(s.scrollStory);if(c.detailEnabled===false)return '';
 const film=films[id];if(!film?.url)return `<section class="kit-section" aria-label="Design inspiration">${tradeBanner(s)}<p class="sample-disclosure">Concept imagery · design inspiration, not completed customer work.</p></section>`;
 const [line]=details[id]||details['general-contractors'];
 const captions=c.detailCaptions;
 return `<section class="craft-story" id="craft-story" data-feature="craft.scrollStory" aria-labelledby="craft-story-title" style="--detail-position:50% 50%"><div class="craft-story-heading"><p>THE CRAFT / A CLOSER LOOK</p><h2 id="craft-story-title">THE SPACE BETWEEN<br>AN IDEA AND REALITY</h2><p>${e(c.detailIntro||line)}</p></div><div class="craft-story-grid"><div class="craft-story-media"><div class="craft-detail-scene" data-detail-scene><div class="craft-detail-camera"><img class="detail-finished" src="${e(film.poster)}" alt="Concept visualization of finished ${e(s.trade.toLowerCase())} work" loading="lazy" width="1280" height="720"><img class="detail-opening" src="${e(film.openingPoster)}" alt="" loading="lazy" width="1280" height="720"><video class="detail-film" data-detail-video muted playsinline preload="none" poster="${e(film.openingPoster)}" tabindex="-1" aria-hidden="true"><source data-src="${e(film.scrubUrl||film.url)}" type="video/mp4"></video><img class="detail-outline" src="${e(film.openingPoster)}" alt="" loading="lazy" width="1280" height="720"></div><svg class="detail-filter" width="0" height="0" aria-hidden="true"><defs><filter id="craft-edges" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true"/><feComponentTransfer><feFuncR type="linear" slope="1.5"/><feFuncG type="linear" slope="1.1"/><feFuncB type="linear" slope=".75"/></feComponentTransfer></filter></defs></svg><div class="detail-viewfinder" aria-hidden="true"><span>DETAIL STUDY / ${e(s.trade.toUpperCase())}</span><span>POV</span></div><div class="detail-caption"><span data-detail-counter>01 / 03</span><p data-detail-caption>${e(captions[0])}</p></div><button type="button" class="detail-motion" aria-pressed="false" hidden>Pause motion</button><div class="detail-progress" aria-hidden="true"><span></span></div></div><div class="detail-chapters" role="group" aria-label="Explore the craftsmanship">${captions.map((caption,i)=>`<button type="button" data-detail-select="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${e(caption)}</button>`).join('')}</div>${tradeBanner(s)}</div></div></section>`;
}
