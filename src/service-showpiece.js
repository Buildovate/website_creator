import {e} from './core.js';

const hash=value=>[...String(value)].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619)>>>0,2166136261);
const terms={Roofing:['Roof plane','Water path','Edge detail'],Plumbing:['Supply line','Fixture','Drain route'],HVAC:['Airflow','Equipment','Comfort zone'],Electrical:['Circuit','Panel','Device'],Painting:['Preparation','Surface','Finish'],Flooring:['Subfloor','Layout','Finish'],Fencing:['Boundary','Posts','Gate'],Solar:['Roof plane','Shade','Array'],Patios:['Footprint','Cover','Shade'],Landscaping:['Grade','Planting','Water'],Concrete:['Grade','Form','Finish'],Pools:['Shell','Plumbing','Deck'],Locksmith:['Cylinder','Latch','Strike']};
export function visualLabels(trade,includes){return (terms[trade]||includes||['Site','Scope','Finish']).slice(0,3)}
export function serviceDiagram(trade,service,stage,labels){
 const seed=hash(`${trade}:${service}:${stage}`), rise=25+seed%25, bend=34+(seed>>>5)%45;
 const lines=stage==='layers'?[`M 30 235 L 430 235`,`M 45 193 L 420 193`,`M 65 150 L 400 150`,`M 88 108 L 375 108`]:[`M 36 236 C ${bend} 210 155 ${rise} 255 104 S 385 150 425 40`,`M 44 259 C 120 228 178 160 264 150 S 360 124 410 83`];
 const safe=labels.map(x=>e(x));
 return `<svg class="sd-diagram" role="img" aria-label="${e(service)} ${stage} illustration" viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid-${seed}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 H 0 V 24" fill="none" stroke="currentColor" opacity=".12"/></pattern></defs><rect width="460" height="300" fill="url(#grid-${seed})"/><path d="M22 267H438M22 267V18" fill="none" stroke="currentColor" opacity=".35"/>${lines.map((line,i)=>`<path d="${line}" fill="none" stroke="currentColor" stroke-width="${i?2:5}" stroke-linecap="round" stroke-dasharray="${i?'5 8':''}"/>`).join('')}<circle cx="255" cy="104" r="8" fill="currentColor"/><circle cx="410" cy="83" r="5" fill="currentColor"/><text x="30" y="40">${safe[0]||''}</text><text x="255" y="92">${safe[1]||''}</text><text x="270" y="280">${safe[2]||''}</text></svg>`;
}
export function signature(s,page,signs,includes){
 const labels=visualLabels(s.trade,includes),name=page.serviceName,seed=hash(`${s.generationId||s.name}:${name}`),kind=/repair|leak|storm/i.test(name)?'Trace the issue':/replacement|install|new|construction/i.test(name)?'See the new layers':'Explore the system';
 return `<section class="sd-signature sd-section" id="signature" data-motion="${seed%2?'trace':'scan'}"><div class="sd-signature-copy"><p class="sd-kicker">A CLOSER LOOK / ${e(name)}</p><h2>${kind}.</h2><p>${e(signs[0]||`Understand the ${name.toLowerCase()} scope`)}. Follow the points that matter before choosing a plan.</p><div class="sd-hotspot-list">${labels.map((label,i)=>`<details><summary><span>0${i+1}</span>${e(label)}</summary><p>${e(includes[i]||includes[0]||name)}</p></details>`).join('')}</div></div><div class="sd-signature-visual"><span class="sd-scan-line" aria-hidden="true"></span>${serviceDiagram(s.trade,name,'layers',labels)}<p>${e(name)} · scope visualization</p></div></section>`;
}
export function optionsCards(s,page,includes){
 const rows=['Good','Better','Best'];
 const book=Array.isArray(s.priceBook?.items)?s.priceBook.items:[];
 const priced=rows.map(tier=>book.find(item=>item.approved===true&&item.enabled!==false&&String(item.service||'').toLowerCase()===page.serviceName.toLowerCase()&&String(item.tier||'').toLowerCase()===tier.toLowerCase()&&Number.isFinite(Number(item.priceCents))));
 return `<section class="sd-section sd-options"><p class="sd-kicker">CHOOSE A SCOPE</p><h2>Three ways to plan.</h2><p>Compare the work, then confirm the right scope with the team.</p><div class="sd-options-grid">${rows.map((tier,i)=>`<article><span>0${i+1} / ${tier}</span><h3>${tier}</h3><p>${e(includes[Math.min(i,includes.length-1)]||page.serviceName)}</p>${priced[i]?`<strong>$${(Number(priced[i].priceCents)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>`:''}<a href="#request">Discuss ${tier.toLowerCase()} scope</a></article>`).join('')}</div></section>`;
}
export function beforeAfter(s,page,preview,known){
 const before=page.media?.bannerOne,after=page.media?.bannerTwo,real=before?.photoId&&after?.photoId&&before.photoId!==after.photoId&&known.has(before.photoId)&&known.has(after.photoId);
 if(!real&&!preview)return '';
 const roofing=s.trade==='Roofing',sources=real?[`/media/${before.photoId}`,`/media/${after.photoId}`]:roofing?['/assets/premium-roofing/before.png','/assets/premium-roofing/after.png']:[];
 if(!sources.length)return '';
 return `<section class="sd-section sd-comparison"><p class="sd-kicker">BEFORE / AFTER ${real?'':'· SAMPLE'}</p><h2>See the difference.</h2><div class="sd-before-after" data-compare>${sources.map((src,i)=>`<figure class="${i?'sd-after':'sd-before'}"><img src="${e(src)}" alt="${real?e((i?after:before).alt||`${page.serviceName} ${i?'after':'before'}`):`Sample ${page.serviceName} ${i?'after':'before'} view`}" loading="lazy" width="800" height="600"><figcaption>${real?'':`Sample · `}${i?'After':'Before'}</figcaption></figure>`).join('')}<label class="sd-compare-control">Compare before and after<input type="range" min="0" max="100" value="50" data-compare-range aria-label="Reveal after image"></label></div></section>`;
}
