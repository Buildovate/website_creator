import {e} from './core.js';

import art from '../public/service-art.json' with {type:'json'};
import media from '../public/service-media.json' with {type:'json'};
// Resolve only the exact trade and service. Never substitute another trade's illustration.
export function servicePhoto(trade,service,slot='scope'){
 const key=String(service||'').toLowerCase(),photos=media[trade]?.[key];
 const hero=art[trade]?.[key],photoHero=hero&&/\.(?:webp|avif|png|jpe?g)$/i.test(hero)?hero:'';
 return (slot==='hero'?photoHero:photos?.[slot])||photos?.scope||photoHero||'';
}
export function visualLabels(trade,includes){return (includes||[]).slice(0,3)}
// Existing Higgsfield service photography replaces the generic roof assembly.
// No simulated X-ray or dimension line is drawn over a photograph.
export function serviceDiagram(trade,service,stage,labels=[]){
 const slot=['detail','diagnosis','proposed','preview-project'].includes(stage)?'process':stage==='package-0'?'hero':stage==='package-2'?'process':'scope',src=servicePhoto(trade,service,slot);
 if(!src)return '';
 return `<div class="sd-diagram sd-scene sd-service-photo" data-art-trade="${e(trade)}" data-art-service="${e(service)}" data-art-kind="photograph"><img src="${e(src)}" alt="Representative ${e(service.toLowerCase())} ${slot==='process'?'work detail':slot==='hero'?'setting':'materials and equipment'}" width="1536" height="1024" loading="lazy"><span class="sd-photo-caption">${e(service)} / ${slot==='process'?'work detail':slot==='hero'?'project setting':'scope detail'}</span></div>`;
}
export function signature(s,page,signs,includes){
 const labels=visualLabels(s.trade,includes),name=page.serviceName,kind='A closer look at the work';
 return `<section class="sd-signature sd-section" id="signature" data-motion="photo-reveal"><div class="sd-signature-copy"><p class="sd-kicker">${e(s.trade.toUpperCase())} / SCOPE DETAILS</p><h2>${e(name)}: ${kind.toLowerCase()}.</h2><p>${e(includes[0])}. Open a label to see what belongs in the ${e(name.toLowerCase())} scope.</p><div class="sd-hotspot-list">${labels.map((label,i)=>`<details><summary><span>0${i+1}</span>${e(label)}</summary><p>${e(includes[i]||includes[0])}</p></details>`).join('')}</div></div><div class="sd-signature-visual">${serviceDiagram(s.trade,name,'xray',labels)}</div></section>`;
}
export function optionsCards(s,page,includes){
 const rows=['Good','Better','Best'];
 const book=Array.isArray(s.priceBook?.items)?s.priceBook.items:[];
 const priced=rows.map(tier=>book.find(item=>item.approved===true&&item.enabled!==false&&String(item.service||'').toLowerCase()===page.serviceName.toLowerCase()&&String(item.tier||'').toLowerCase()===tier.toLowerCase()&&Number.isFinite(Number(item.priceCents))));
 return `<section class="sd-section sd-options"><p class="sd-kicker">CHOOSE A SCOPE</p><h2>${e(page.serviceName)}: choose what matters.</h2><p>Review the ${e(page.serviceName.toLowerCase())} details before agreeing on materials and price.</p><div class="sd-options-grid">${rows.map((tier,i)=>`<article><span>0${i+1} / ${tier}</span>${serviceDiagram(s.trade,page.serviceName,'package-'+i,includes)}<h3>${tier}</h3><p>${e(includes[Math.min(i,includes.length-1)]||page.serviceName)}</p>${priced[i]?`<strong>$${(Number(priced[i].priceCents)/100).toLocaleString('en-US',{minimumFractionDigits:Number.isInteger(Number(priced[i].priceCents)/100)?0:2,maximumFractionDigits:2})}</strong>`:''}<a href="#request">Discuss ${tier.toLowerCase()} scope</a></article>`).join('')}</div></section>`;
}
export function beforeAfter(s,page,preview,known){
 const before=page.media?.bannerOne,after=page.media?.bannerTwo,real=before?.photoId&&after?.photoId&&before.photoId!==after.photoId&&known.has(before.photoId)&&known.has(after.photoId);
 if(!real){if(!preview)return '';return `<section class="sd-section sd-comparison"><p class="sd-kicker"><span class="sd-sample-tag">Sample</span> / SERVICE DETAILS</p><h2>Two views of ${e(page.serviceName.toLowerCase())}.</h2><div class="sd-before-after" data-compare><figure class="sd-before sd-sample-existing">${serviceDiagram(s.trade,page.serviceName,'existing',visualLabels(s.trade,[]))}<figcaption>Sample · Scope detail</figcaption></figure><figure class="sd-after sd-sample-proposed">${serviceDiagram(s.trade,page.serviceName,'proposed',visualLabels(s.trade,[]))}<figcaption>Sample · Work detail</figcaption></figure><label class="sd-compare-control">Compare service details<input type="range" min="0" max="100" value="50" data-compare-range aria-label="Reveal work detail"></label></div></section>`;}
 const roofing=s.trade==='Roofing',sources=real?[`/media/${before.photoId}`,`/media/${after.photoId}`]:roofing?['/assets/premium-roofing/before.webp','/assets/premium-roofing/after.webp']:[];
 if(!sources.length)return '';
 return `<section class="sd-section sd-comparison"><p class="sd-kicker">BEFORE / AFTER ${real?'':'· SAMPLE'}</p><h2>${e(page.serviceName)}: before and after.</h2><div class="sd-before-after" data-compare>${sources.map((src,i)=>`<figure class="${i?'sd-after':'sd-before'}"><img src="${e(src)}" alt="${real?e((i?after:before).alt||`${page.serviceName} ${i?'after':'before'}`):`Sample ${page.serviceName} ${i?'after':'before'} view`}" loading="lazy" width="800" height="600"><figcaption>${real?'':`Sample · `}${i?'After':'Before'}</figcaption></figure>`).join('')}<label class="sd-compare-control">Compare before and after<input type="range" min="0" max="100" value="50" data-compare-range aria-label="Reveal after image"></label></div></section>`;
}
