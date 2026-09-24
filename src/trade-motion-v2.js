import {e} from './core.js';
import {roofingMotionStyles} from './trade-motion-config.js';

// Rendered content is complete before enhancement; no customer facts are invented.
function options(variant, style) {
 const v=['A','B','C'].includes(variant)?variant:'A';
 const tokens=typeof style==='string'?roofingMotionStyles[style]:style;
 const base=roofingMotionStyles['bold-industrial'];
 const colors=['surface','ink','muted','accent','line'].map(k=>`--mk-${k}:${/^#[\da-f]{6}$/i.test(tokens?.[k])?tokens[k]:base[k]}`);
 return `data-variant="${v}" data-style="${e(tokens?.name||'custom')}" style="${colors.join(';')};--mk-radius:${Math.max(0,Math.min(32,Number(tokens?.radius)||0))}px"`;
}
export const roofLayers=[
 ['Deck','A solid base supports the roof above.','#b58e64'],
 ['Drip edge','Directs runoff away from roof edges.','#cbd5d5'],
 ['Ice and water shield','Seals vulnerable edges against water.','#627774'],
 ['Underlayment','Adds a second barrier beneath shingles.','#acbd9b'],
 ['Starter strip','Helps seal the first shingle course.','#727f72'],
 ['Architectural shingles','Shed rain and protect the roof surface.','#405b59'],
 ['Ridge vent','Lets warm, moist attic air escape.','#d4e5a5'],
];
export function LayerExplode({variant='A',style='bold-industrial',id='roof-anatomy'}={}) {
 const flat=variant==='B';
 const face=flat?'M100 304H560V364H100Z':'M84 335 295 243 584 331 369 425Z';
 return `<section id="${e(id)}" class="mk mk-layer" data-layer-explode ${options(variant,style)} aria-labelledby="${e(id)}-title"><div class="mk-layer-stage"><div class="mk-section-top"><div><p class="mk-eyebrow">01 / BUILT IN LAYERS</p><h2 id="${e(id)}-title">One roof.<br>Seven lines of defense.</h2></div><p class="mk-intro">See what sits beneath the shingles.<br>Each layer has a job to do.</p></div><div class="mk-layer-grid"><div class="mk-roof-drawing"><svg viewBox="0 0 680 520" role="img" aria-labelledby="${e(id)}-svg-title"><title id="${e(id)}-svg-title">Seven layers assemble into a finished roof; the numbered descriptions explain each layer.</title><ellipse cx="340" cy="457" rx="225" ry="16" fill="currentColor" opacity=".08"/>${roofLayers.map(([name,,color],i)=>`<g data-roof-layer="${i}" style="--layer:${i};color:${color}"><path d="${i===6?(flat?'M100 296H560V310H100Z':'M286 240 299 233 590 325 577 334Z'):i===1?(flat?'M96 360H566V371H96Z':'M78 335 368 428 589 332 589 344 369 440 78 347Z'):i===4?(flat?'M100 350H560V366H100Z':'M84 335 369 425 396 413 112 323Z'):face}" fill="currentColor" stroke="#213c3c" stroke-width="2"/>${i===0?`<path d="${flat?'M100 366H560V375H100Z':'M84 335V348L369 439 584 345V331L369 425Z'}" fill="#8b6949"/>`:''}${i===5?Array.from({length:4},(_,j)=>`<path d="${flat?`M100 ${315+j*12}H560`:`M${127+j*44} ${317-j*19}L${411+j*44} ${407-j*19}`}" fill="none" stroke="#a7bdb0" stroke-width="2"/>`).join(''):''}<circle cx="${flat?84:72}" cy="${flat?334:333}" r="14" fill="#173b3a"/><text x="${flat?84:72}" y="${flat?339:338}" fill="#ffffff" text-anchor="middle" font-size="13" font-family="Arial">${i+1}</text></g>`).join('')}</svg><p class="mk-diagram-caption"><span data-layer-phase>Finished roof</span><span>Concept anatomy · not an installation specification</span></p></div><ol class="mk-layer-labels">${roofLayers.map(([name,why],i)=>`<li><span class="mk-layer-number">0${i+1}</span><div><h3>${e(name)}</h3><p>${e(why)}</p></div></li>`).join('')}</ol></div><div class="mk-layer-footer"><span>Scroll to separate, then reassemble</span><a href="#storm-compare">Explore storm damage ↓</a></div></div></section>`;
}
const after='/assets/premium-roofing/after.png',before='/assets/premium-roofing/before.png';
export function RevealCompare({variant='A',style='bold-industrial',id='storm-compare'}={}) {
 const v=['A','B','C'].includes(variant)?variant:'A';
 const image=(src,alt,cls)=>`<img class="${cls}" src="${src}" alt="${alt}" width="1536" height="1024" loading="lazy" decoding="async">`;
 return `<section id="${e(id)}" class="mk mk-compare" data-reveal-compare ${options(v,style)} aria-labelledby="${e(id)}-title"><div class="mk-section-top"><div><p class="mk-eyebrow">02 / AFTER THE WEATHER</p><h2 id="${e(id)}-title">A closer look.<br>A clearer next step.</h2></div><p class="mk-intro">Storm damage can be easy to miss.<br>Explore the difference a repair can make.</p></div><figure class="mk-compare-figure"><div class="mk-compare-canvas" data-compare-canvas>${image(after,'AI-generated intact shingles, illustrating the repaired state','mk-repair')}${image(before,'AI-generated damaged shingles, illustrating storm damage','mk-damage')}<div class="mk-compare-badges" aria-hidden="true"><span data-before-badge>After storm</span><span>After repair</span></div><div class="mk-compare-handle" aria-hidden="true"><span>↔</span></div></div><figcaption>AI-generated repair example · not a completed customer project.${v==='C'?' The intact image also illustrates the before-storm baseline.':''}</figcaption></figure><div class="mk-compare-controls">${v==='C'?`<div class="mk-compare-tabs" role="group" aria-label="Roof condition">${['Before storm','After storm','After repair'].map((label,i)=>`<button type="button" data-compare-state="${i}" aria-pressed="${i===2}">${label}</button>`).join('')}</div><p data-compare-status role="status">After repair</p>`:`<label for="${e(id)}-range">${v==='B'?'Move the inspection lens':'Drag to compare'}<span>${v==='B'?'Move your cursor or drag on touch.':'Use the slider or arrow keys.'}</span></label><input id="${e(id)}-range" data-compare-range type="range" role="slider" min="0" max="100" value="100" aria-label="${v==='B'?'Inspection lens horizontal position':'After repair revealed'}" aria-valuetext="After repair: 100 percent"><p data-compare-status role="status">After repair</p>`}</div><noscript><p>The repaired roof is shown. <a href="${before}">View the damaged roof example</a>.</p></noscript></section>`;
}
export function KineticText({variant='A',style='bold-industrial',text='',mode='lines',tag=mode==='lines'?'h1':'p',id=''}={}) {
 const element=['h1','h2','p'].includes(tag)?tag:'p';
 // A single semantic text copy, never display:none; decorative words are hidden from AT.
 const parts=mode==='lines'?String(text).split('\n'):String(text).trim().split(/\s+/);
 return `<${element} ${id?`id="${e(id)}"`:''} class="mk-kinetic mk-kinetic-${mode==='lines'?'lines':'words'}" data-kinetic-text="${mode==='lines'?'lines':'words'}" ${options(variant,style)}><span class="mk-readable">${e(text)}</span><span class="mk-kinetic-visual" aria-hidden="true">${parts.map((part,i)=>mode==='lines'?`<span class="mk-line"><span data-kinetic-part style="--part:${i}">${e(part)}</span></span>`:`<span data-kinetic-part>${e(part)}</span>${i<parts.length-1?' ':''}`).join('')}</span></${element}>`;
}
export function roofingMotionOptions(design={}) {
 return {variant:['A','B','C'].includes(design.motionLayout)?design.motionLayout:'A',style:roofingMotionStyles[design.motionStyle]||roofingMotionStyles['bold-industrial']};
}
export const motionV2Assets='<link rel="stylesheet" href="/trade-motion-v2.css?v=004H"><script defer src="/trade-motion.js?v=004H"></script><script defer src="/trade-motion-v2.js?v=004H"></script>';
