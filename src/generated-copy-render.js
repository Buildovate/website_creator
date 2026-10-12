import {e} from './core.js';
import {element} from './section-variants.js';

// Opt-in composition layer: accepted variant-a renderer functions remain untouched.
// Nothing is selected here. Render only the copy saved in the server-owned manifest.
const classes=(tag,pattern)=>new RegExp('class="[^"]*(?:'+pattern+')').test(tag);
const swap=(html,part,body)=>part?html.slice(0,part.start)+part.open+body+part.html.slice(part.html.lastIndexOf('</'))+html.slice(part.end):html;
const text=(html,predicate,tags,value)=>{const part=element(html,predicate,tags);return swap(html,part,e(value));};
const selectors={hero:t=>t.includes('id="home"')||classes(t,'cx-film-hero'),services:t=>t.includes('id="services"'),process:t=>classes(t,'roof-next-story|kit-cta-band|cx-process|sv-process-[bc]'),reviews:t=>t.includes('id="customer-reviews"'),finalCta:t=>t.includes('id="contact"'),financing:t=>t.includes('id="calculator"')};
export function renderGeneratedCopy(html,s,slots=['hero','services','process','reviews','finalCta']){
 const record=s.uniqueness;if(record?.version!==1)return html;
 for(const key of slots){const copy=record.copy[key],part=element(html,selectors[key]);if(!part||!copy)continue;
  // Preview-only review teaching cards retain their explicit Sample explanation.
  if(key==='reviews'&&!part.html.includes('data-review-slug='))continue;
  let body=part.body;
  const headingTag=key==='hero'?'h1':element(body,()=>true,'h2')?'h2':'h3';
  body=text(body,()=>true,headingTag,copy.heading);
  if(key==='hero'){
   const intro=element(body,t=>classes(t,'story-description|kit-intro|cx-intro|sv-hero-description'),'p');
   if(intro)body=swap(body,intro,e(copy.body));
   else {const title=element(body,()=>true,'h1'),cls=classes(part.open,'scroll-story')?'story-description':classes(part.open,'cx-')?'cx-intro':'kit-intro';if(title)body=body.slice(0,title.end)+'<p class="'+cls+'">'+e(copy.body)+'</p>'+body.slice(title.end);}
   body=text(body,t=>classes(t,'story-primary|kit-button|cx-button|sv-primary'),'a',copy.action);
   if(body.includes('data-story-scene="0"')){const accessible=element(body,t=>classes(t,'story-accessible'),'details');if(accessible)body=swap(body,accessible,text(accessible.body,()=>true,'p',copy.heading+' '+copy.body));}
  }else if(key==='reviews')body=text(body,t=>classes(t,'review-subtitle'),'p',copy.body);
  else if(key==='services'){
   const h=element(body,()=>true,headingTag);if(h)body=body.slice(0,h.end)+'<p data-generation-copy="services">'+e(copy.body)+'</p>'+body.slice(h.end);
  }else{
   // Scope edits to the introductory copy, before artwork, steps or the form.
   const boundary=body.search(/<(?:form|ol)\b|<div class="(?:sv-process-art|roof-next-map)/);
   const before=boundary<0?body:body.slice(0,boundary),after=boundary<0?'':body.slice(boundary);
   const paragraph=element(before,t=>!classes(t,'eyebrow|kicker'),'p');
   if(paragraph)body=swap(before,paragraph,e(copy.body))+after;
   else {const h=element(before,()=>true,headingTag);body=h?before.slice(0,h.end)+'<p>'+e(copy.body)+'</p>'+before.slice(h.end)+after:body;}
   if(key==='finalCta')body=text(body,t=>!t.includes('disabled')&&classes(t,'kit-button|cx-button|sv-primary'),'button',copy.action);
  }
  html=swap(html,part,body);
 }
 if(slots.includes('hero'))html=html.replace(/(<meta name="description" content=")[^"]*(">)/,(_match,start,end)=>start+e(record.copy.hero.body)+end);
 const rgb=/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#172421',channels=rgb.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),luminance=channels.reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0),ink=luminance>.179?'#000000':'#ffffff';
 return html.replace('<body','<body data-generated-site="v1"').replace('</head>','<link rel="stylesheet" href="/generated-site.css"><style>body[data-generated-site]{--generated-cta:'+rgb+';--generated-cta-text:'+ink+'}</style></head>');
}
