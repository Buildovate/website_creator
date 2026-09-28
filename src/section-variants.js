import {e} from './core.js';
import {sectionChoice} from './section-choices.js';

// Locate complete renderer-owned elements without reserializing untouched HTML.
// Matching nested tags is necessary for the existing process/media sections.
export function element(html,predicate,tagPattern='section|aside'){
 const tags=new RegExp('<(/?)('+tagPattern+')\\b[^>]*>','gi');let found;
 while((found=tags.exec(html))){
  if(found[1]||!predicate(found[0]))continue;
  const tag=found[2],start=found.index,bodyStart=tags.lastIndex,rest=new RegExp('<(/?)'+tag+'\\b[^>]*>','gi');rest.lastIndex=bodyStart;let depth=1,next;
  while((next=rest.exec(html))){depth+=next[1]?-1:1;if(!depth)return {start,end:rest.lastIndex,open:found[0],body:html.slice(bodyStart,next.index),html:html.slice(start,rest.lastIndex)};}
  throw Error('Unclosed renderer section: '+tag);
 }
 return null;
}
const hasClass=(tag,name)=>new RegExp('class="[^"]*\\b'+name+'\\b').test(tag);
const id=(tag,name)=>tag.includes('id="'+name+'"');
const inner=(html,tag)=>element(html,()=>true,tag)?.body||'';
const plain=html=>html.replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]*>/g,'').trim();
const heading=html=>inner(html,'h2');
const replace=(html,part,value)=>part?html.slice(0,part.start)+value+html.slice(part.end):html;
const image=(src,alt='',hero=false)=>src?'<img class="sv-image" src="'+e(src)+'" alt="'+e(alt)+'" width="1280" height="800" '+(hero?'fetchpriority="high"':'loading="lazy"')+'>':'';
const start=(name,choice,pattern,extra='')=>'<section class="sv-section sv-'+name+' sv-'+name+'-'+choice+'" data-section-variant="'+name+':'+choice+'" data-section-pattern="'+pattern+'" '+extra+'>';
export function sectionVariantAssets(html){if(!html.includes('data-section-variant="'))return html;html=html.replaceAll('<link rel="stylesheet" href="/section-variants.css">','');return html.replace('</head>','<link rel="stylesheet" href="/section-variants.css"></head>');}
function heroVariant(part,s,choice){
 const h1=plain(element(part.body,t=>hasClass(t,'mk-readable'),'span')?.body||inner(part.body,'h1')),intro=element(part.body,t=>/class="[^"]*(?:story-description|kit-intro|cx-intro)/.test(t),'p')?.body||e(s.intro);
 const action=element(part.body,t=>/class="[^"]*(?:story-primary|kit-button|cx-button)/.test(t),'a');
 if(!action)throw Error('Hero variant needs the existing primary action');
 const href=action.open.match(/href="([^"]*)"/)?.[1]||'#contact';
 const img=part.body.match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1]||'';
 const copy='<div class="sv-hero-copy"><p class="sv-kicker">'+e(s.area||s.trade)+'</p><h1>'+h1+'</h1><p>'+intro+'</p><div class="sv-actions"><a class="sv-primary" href="'+href+'">'+plain(action.body)+'</a><a href="#services">Explore our services</a></div></div>';
 const media='<figure class="sv-hero-media">'+image(img,s.trade+' design inspiration',true)+'</figure>';
 return start('hero',choice,choice==='b'?'media-split':'headline-panorama','id="home"')+(choice==='b'?media+copy:copy+media)+'</section>';
}
function serviceVariant(part,choice){
 const cards=[...part.body.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(m=>m[1]);
 const items=cards.map((card,i)=>{
  const title=inner(card,'h3'),description=inner(card,'p'),photo=card.match(/<img\b[^>]*>/)?.[0]||'',link=element(card,()=>true,'a')?.html||'';
  const body='<div class="sv-service-copy"><h3>'+title+'</h3><p>'+description+'</p>'+link+'</div>';
  return choice==='b'?'<article class="sv-service-row">'+photo+body+'</article>':'<details class="sv-service-disclosure"'+(i===0?' open':'')+'><summary>'+title+'</summary><div>'+photo+'<div><p>'+description+'</p>'+link+'</div></div></details>';
 }).join('');
 return start('services',choice,choice==='b'?'alternating-rows':'disclosure-list','id="services"')+'<header><p class="sv-kicker">CHOOSE YOUR STARTING POINT</p><h2>'+heading(part.body)+'</h2></header><div class="sv-services-list">'+items+'</div></section>';
}
function processVariant(part,choice){
 const steps=[...part.body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map(m=>({title:inner(m[1],'h3')||inner(m[1],'strong'),body:inner(m[1],'p')}));
 const title=heading(part.body)||inner(part.body,'h3');
 const items=steps.map((step,i)=>'<li><span class="sv-step-index" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+step.title+'</h3>'+(step.body?'<p>'+step.body+'</p>':'')+'</div></li>').join('');
 return start('process',choice,choice==='b'?'vertical-timeline':'horizontal-step-cards')+'<header><p class="sv-kicker">WHAT HAPPENS NEXT</p><h2>'+title+'</h2></header><ol>'+items+'</ol></section>';
}
function finalVariant(part,choice){
 // Preserve the form, field names, validation, consent, transport and factual copy.
 const form=element(part.body,()=>true,'form');if(!form)throw Error('Final CTA needs the existing inquiry form');
 let copy=part.body.slice(0,form.start)+part.body.slice(form.end);
 // The original wrappers differ by renderer; extract only their content elements.
 const title=heading(copy),paragraphs=[...copy.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/g)].map(m=>m[0]).join(''),links=[...copy.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(m=>m[0]).join('');
 const primaryForm=form.html.replace(/class="(?:kit-button|cx-button)"/g,'class="sv-primary"');
 return start('finalCta',choice,choice==='b'?'inquiry-wide':'inquiry-aside','id="contact"')+'<div class="sv-final-copy"'+(part.body.includes('id="craft-inquiry"')?' id="craft-inquiry"':'')+'><h2>'+title+'</h2>'+paragraphs+'<div class="sv-contact-links">'+links+'</div></div><div class="sv-inquiry">'+primaryForm+'</div></section>';
}
export function applySectionVariants(html,s){
 if(!['hero','services','process','finalCta'].some(key=>sectionChoice(s,key)!=='a'))return sectionVariantAssets(html);
 const slots={hero:t=>id(t,'home')||hasClass(t,'cx-film-hero'),services:t=>id(t,'services'),process:t=>hasClass(t,'roof-next-story')||hasClass(t,'kit-cta-band')||hasClass(t,'cx-process'),finalCta:t=>id(t,'contact')};
 const render={hero:heroVariant,services:(p,s,c)=>serviceVariant(p,c),process:(p,s,c)=>processVariant(p,c),finalCta:(p,s,c)=>finalVariant(p,c)};

 for(const key of Object.keys(slots)){const choice=sectionChoice(s,key);if(choice==='a')continue;const part=element(html,slots[key]);if(!part)continue;html=replace(html,part,render[key](part,s,choice));}
 return sectionVariantAssets(html);
}
export function applyFinancingVariant(html,s){
 const choice=sectionChoice(s,'financing');if(choice==='a')return html;
 const part=element(html,t=>id(t,'calculator'));if(!part||!part.html.includes('data-financing-calculator'))return html;
 const form=element(part.body,()=>true,'form'),copy=part.body.slice(0,form.start);
 // The same approved calculator and lender handoff stay intact. Only their placement changes.
 const body=start('financing',choice,choice==='b'?'calculator-workbench':'calculator-sidebar','id="calculator"')+'<div class="sv-finance-copy">'+copy+'</div><div class="sv-finance-form">'+form.html.replaceAll('class="foundation-button"','class="sv-secondary"')+'</div></section>';
 return sectionVariantAssets(replace(html,part,body));
}

export function applyReviewVariant(html,s){
 const choice=sectionChoice(s,'reviews');if(choice==='a'||!html)return html;
 const part=element(html,t=>id(t,'customer-reviews'));if(!part)return html;
 const target=part.body.indexOf('<div data-review-results');
 if(target<0)return html; // Preview's honest sample format stays unchanged.
 const open=part.open.replace('class="reviews-section"','class="reviews-section sv-section sv-reviews sv-reviews-'+choice+'" data-section-variant="reviews:'+choice+'" data-section-pattern="'+(choice==='b'?'review-editorial-list':'review-feature-grid')+'"');
 return replace(html,part,open+'<div class="sv-review-heading">'+part.body.slice(0,target)+'</div><div class="sv-review-body">'+part.body.slice(target)+'</div></section>')+'<link rel="stylesheet" href="/section-variants.css">';
}
