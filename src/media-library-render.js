import {element} from './section-variants.js';
import {resolveMedia,mediaCatalog} from './media-library.js';
import {libraryDescription} from './media-description.js';
import {e} from './core.js';
const cls=(t,c)=>new RegExp('class="[^"]*\\b'+c+'\\b').test(t);
const replace=(html,p,value)=>p?html.slice(0,p.start)+value+html.slice(p.end):html;
function picture(m,slot,description,decorative=false){if(!m)return '';const tint=m.treatment?.type==='css-tint'&&/^#[0-9a-f]{6}$/i.test(m.treatment.color)?' style="--ml-tint:'+m.treatment.color+';--ml-tint-opacity:.12"':'';const video=m.kind==='clip';return '<div class="ml-media" data-media-slot="'+slot+'" data-media-kind="'+m.kind+'"'+tint+'><img class="ml-poster" src="'+e(video?m.poster:m.url)+'" alt="'+e(decorative?'':description)+'"'+(decorative?' data-media-decorative="true" role="presentation"':'')+' width="1280" height="800" '+(slot==='hero'?'fetchpriority="high"':'loading="lazy"')+'>'+(video?'<video class="ml-video" muted playsinline loop preload="none" poster="'+e(m.poster)+'" aria-hidden="true" tabindex="-1"><source data-src="'+e(m.url)+'" type="video/mp4"></video>':'')+'<span class="ml-tint" aria-hidden="true"></span>'+(video?'<button class="ml-motion" type="button" hidden aria-pressed="false">Pause motion</button>':'')+'</div>';}
export function renderLibraryMedia(html,s,{photos=[],kind='home'}={}){
 if(s.mediaPicks?.version!==1||s.mediaPicks.kit!==s.designKit||s.mediaPicks.trade!==s.trade)return html;
 const selected=Object.fromEntries(Object.entries(s.mediaPicks.slots).map(([key,pick])=>[key,resolveMedia(pick,photos)]));
 // An explicitly selected, validated owned hero remains authoritative after a save,
 // even before another generation reserves a library pick.
 const describe=(slot,m)=>m?.owned?String(photos.find(p=>'/media/'+p.id===m.url)?.caption||'Contractor-provided photograph'):libraryDescription(mediaCatalog.assets[s.mediaPicks.slots[slot]?.assetId],mediaCatalog);
 const own=s.heroPhotoId||s.scrollStory?.posterId;if(own&&photos.some(p=>p.id===own))selected.hero={kind:'still',url:'/media/'+own,owned:true,treatment:{type:'none'}};
 if(kind==='home'){
  const hero=element(html,t=>t.includes('id="home"')||cls(t,'cx-film-hero'));
  if(hero){let body=hero.body;const target=element(body,t=>['sv-hero-media','story-visuals','kit-hero-image','cx-hero-media','cx-film-media'].some(c=>cls(t,c)),'div|figure');
   if(target)body=replace(body,target,target.open+picture(selected.hero,'hero',describe('hero',selected.hero),!!target&&/aria-hidden="true"/.test(target.open))+'</'+target.open.match(/^<(\w+)/)[1]+'>');
   else {body=body.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g,'');let found=false;body=body.replace(/<img\b[^>]*>/g,tag=>{if(found)return tag;found=true;return picture(selected.hero,'hero',describe('hero',selected.hero),!!target&&/aria-hidden="true"/.test(target.open))});if(!found)body=picture(selected.hero,'hero',describe('hero',selected.hero),!!target&&/aria-hidden="true"/.test(target.open))+body;}
   // The original full-bleed visual plane is aria-hidden and behind a shade.
   // Keep its new motion control in the accessible topline instead.
   if(target&&cls(target.open,'story-visuals')&&selected.hero?.kind==='clip'){
    const control=body.match(/<button class="ml-motion"[\s\S]*?<\/button>/)?.[0];
    if(control){body=body.replace(control,'');body=body.replace(/<button class="story-motion"[\s\S]*?<\/button>/,control.replace('class="ml-motion"','class="ml-motion ml-motion-inline story-motion" data-media-control="hero"'));}
   }
   if(target&&cls(target.open,'kit-hero-image')&&selected.hero?.kind==='clip'){
    const control=body.match(/<button class="ml-motion"[\s\S]*?<\/button>/)?.[0];
    if(control)body=body.replace(control,'')+control.replace('class="ml-motion"','class="ml-motion ml-motion-float" data-media-control="hero"');
   }
   html=replace(html,hero,hero.open.replace('>',' data-library-hero>')+body+'</section>');
  }
  if(selected.hero)html=html.replace(/--trade-art:url\('[^']*'\)/g,"--trade-art:url('"+e(selected.hero.poster||selected.hero.url)+"')");
 }
 const predicates={services:t=>t.includes('id="services"'),process:t=>['sv-process','roof-next-story','kit-cta-band','cx-process'].some(c=>cls(t,c)),finalCta:t=>t.includes('id="contact"'),financing:t=>t.includes('id="calculator"')};
 for(const slot of kind==='financing'?['financing']:['services','process','finalCta']){
  const part=element(html,predicates[slot]);if(!part||!selected[slot])continue;
  // Preserve existing factual graphics and owned photos. The new still is a
  // descriptive section image; it has no project attribution or invented caption.
  const figure='<figure class="ml-section-still">'+picture(selected[slot],slot,describe(slot,selected[slot]))+'</figure>';
  let body=part.body;const copy=element(body,t=>['sv-process-intro','sv-final-copy','sv-finance-copy'].some(c=>cls(t,c)),'div');
  if(copy)body=replace(body,copy,copy.open+figure+copy.body+'</div>');else body=figure+body;
  html=replace(html,part,part.open+body+'</'+part.open.match(/^<(\w+)/)[1]+'>');
 }
 return html.replace('<body','<body data-library-media').replace('</head>','<link rel="stylesheet" href="/media-library.css"><script defer src="/media-library.js"></script></head>');
}
