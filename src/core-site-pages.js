import {e,one,all,must,access} from './core.js';
import {visibleServicePages,primaryCity,serviceSlug} from './service-registry.js';
import {serviceBrief,serviceCardBlurb} from './service-content.js';
import {websiteHeader,websiteFooter} from './site-polish.js';
import {publicLegalSettings,assessLegalPolicy} from './platform/legal-policy.ts';
import {demoProjects} from './crm.js';
import {normalizePlatform,FINANCING_DISCLOSURE} from './platform/constitution.ts';
import {kits} from './design-kits.js';
import art from '../public/service-art.json' with {type:'json'};

const routePattern=/^\/s\/([^/]+)\/(services|areas|about|reviews|faq|contact|thank-you|legal)(?:\/([^/]+))?\/?$/;
const badge='<span class="core-sample">Sample</span>';
const suffix=preview=>preview?'?preview=1':'';
const asJson=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const phoneHref=s=>{const digits=String(s.phone||'').replace(/\D/g,'');return digits.length>=10?'tel:+'+(digits.length===10?'1':'')+digits:''};
const offered=s=>visibleServicePages(s);
const cityList=s=>{
 const list=(s.serviceAreas||[]).map(x=>x.city).filter(Boolean);
 if(!list.length){const first=primaryCity(s);if(first)list.push(first);}
 return [...new Set(list.map(x=>x.trim()))];
};
const category=(trade,name)=>{
 const n=name.toLowerCase(),groups={
  Roofing:[['Repair & care',/repair|maintenance|sealing|storm|inspection/],['Roof systems',/shingle|metal|flat|installation|replacement/],['Drainage',/gutter/]],
  HVAC:[['Cooling',/air conditioning|cooling/],['Heating',/heat|furnace/],['Airflow & care',/duct|air quality|maintenance/]],
  Patios:[['Covers & shade',/cover|pergola|roof|shade/],['Outdoor spaces',/living|enclosure|repair/]],
  Plumbing:[['Water supply',/heater|repiping|filtration|fixture/],['Drainage',/drain|sewer/],['Repair & inspection',/leak|repair/]],
  Electrical:[['Power & panels',/panel|charger|rewiring|generator/],['Lighting & devices',/lighting|outlet|switch/],['Repair & inspection',/repair|inspection/]],
  Landscaping:[['Planting & lawn',/design|installation|lawn|turf/],['Outdoor systems',/irrigation|hardscap|lighting/],['Care',/maintenance/]],
  'General Contractors':[['Remodeling',/remodel|renovation|kitchen|bathroom/],['New spaces',/addition|adu|construction/],['Commercial',/commercial/]],
  Flooring:[['Floor materials',/hardwood|vinyl|laminate|tile/],['Repair & preparation',/repair|refinish|subfloor/],['Commercial',/commercial/]],
  Painting:[['Interior',/interior|cabinet|drywall|decorative/],['Exterior',/exterior|deck|fence/],['Preparation & commercial',/preparation|commercial/]],
  Fencing:[['Fence styles',/wood|vinyl|metal|privacy|pool/],['Access & repair',/gate|repair/],['Commercial',/commercial/]],
  'Garage Doors':[['Doors & panels',/door installation|panel|weather/],['Openers & springs',/opener|spring/],['Repair & care',/repair|maintenance/]],
  'Pest Control':[['Inspection & prevention',/inspection|maintenance/],['Insect control',/ant|termite|cockroach|spider|mosquito/],['Rodent control',/rodent/]],
  'Windows/Doors':[['Windows',/window/],['Doors',/door/],['Repair',/repair/]],
  Solar:[['Solar panels',/panel|system design|monitoring/],['Storage & equipment',/battery|inverter/],['Care',/maintenance|cleaning|removal/]],
  Concrete:[['Flatwork',/driveway|patio|walkway|slab/],['Structure & repair',/foundation|repair/],['Finishes',/stamped|decorative/]],
  Pools:[['New pools',/design|construction/],['Renovation',/remodel|resurfac|tile|deck/],['Equipment & care',/equipment|maintenance/]]
 };
 return (groups[trade]||[]).find(([,rx])=>rx.test(n))?.[0]||'More services';
};
function serviceCards(s,slug,preview){
 const pages=offered(s),base='/s/'+slug,groups=new Map();
 for(const page of pages){const key=category(s.trade,page.serviceName);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(page)}
 const showGroups=groups.size>1;
 return [...groups].map(([group,items])=>`<section class="core-group">${showGroups?`<h2>${e(group)}</h2>`:''}<div class="core-grid">${items.map(page=>{
  const name=page.serviceName,src=art[s.trade]?.[name.toLowerCase()]||Object.values(art[s.trade]||{})[0]||'',blurb=serviceCardBlurb(s.trade,name,s.services.find(x=>x.name===name)?.description||'');
  return `<article class="core-card">${src?`<img src="${e(src)}" alt="${e(name)} design inspiration" width="384" height="512" loading="lazy">`:''}<div><span class="core-kicker">${e(s.trade)}</span><h3>${e(name)}</h3><p>${e(blurb)}</p><a href="${base}/services/${e(page.slug)}${suffix(preview)}">Explore ${e(name)} ↗</a></div></article>`}).join('')}</div></section>`).join('');
}
const sentence=(value)=>String(value).replace(/\s+/g,' ').trim();
export function cityContent(s,city,index=0){
 const pages=offered(s),focus=pages[index%Math.max(1,pages.length)],brief=focus?serviceBrief(s.trade,focus.serviceName):null;
 const signal=sentence(brief?.signs?.[index%Math.max(1,brief.signs.length)]||'the condition of your property');
 const process=sentence(brief?.process?.[index%Math.max(1,brief.process.length)]||'review the project scope');
 const variants=[
  [`For a ${s.trade.toLowerCase()} project in ${city}, start with the part of the property you want to change and what you have noticed.`,`In ${city}, “${signal}” is a useful detail to share when discussing ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()} with ${s.name}.`],
  [`A ${city} project begins with your priorities, the property, and the timing that matters to you.`,`A ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()} conversation in ${city} can begin with the observation “${signal}” before the team reviews options.`],
  [`Homes and businesses in ${city} need a scope that fits the work actually planned.`,`Tell the team in ${city} if you have noticed “${signal}”; that helps define the first ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()} conversation.`],
  [`Tell ${s.name} what you are considering for your ${city} property.`,`For ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()} in ${city}, mention “${signal}” along with the property details before choosing a direction.`],
  [`Whether the work is urgent or still an idea, your ${city} address is the starting point.`,`Ask about ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()} in ${city}; the team can ${process.toLowerCase()} after learning what the property needs.`],
  [`Your ${city} project deserves a clear description of the work before any recommendation.`,`For ${focus?.serviceName.toLowerCase()||s.trade.toLowerCase()}, share the observation “${signal}” and let ${s.name} explain how they would ${process.toLowerCase()} in ${city}.`]
 ];
 const [intro,detail]=variants[index%variants.length];
 return {intro,detail,question:`Which ${s.trade.toLowerCase()} services can I ask about in ${city}?`,answer:`The ${s.name} team can discuss ${pages.map(p=>p.serviceName.toLowerCase()).slice(0,3).join(', ')} in ${city}; send the location and the work you have in mind.`};
}
export function assertUniqueCitySentences(s){
 const found=new Set();
 cityList(s).forEach((city,index)=>{
  for(const value of Object.values(cityContent(s,city,index))){
   for(const part of value.match(/[^.!?]+[.!?]?/g)||[]){const normalized=part.trim().toLowerCase();if(!normalized)continue;if(found.has(normalized))throw new Error('Two city pages share a sentence: '+normalized);found.add(normalized)}
  }
 });
 return true;
}
export function coreSitemapPaths(s){
 const base=['','/services','/areas','/about','/faq','/contact','/thank-you','/legal','/legal/privacy','/legal/terms','/pricing','/blog'];
 for(const kind of ['about','faq'])if((s.websitePages?.pages||[]).some(page=>page.kind===kind&&!page.enabled))base.splice(base.indexOf('/'+kind),1);
 const cities=cityList(s).map(city=>'/areas/'+serviceSlug(city));
 const p=normalizePlatform(s.platform);
 if(p.financing.enabled&&p.financing.lenders.some(x=>x.enabled&&x.confirmed))base.push('/financing');
 if(p.promotions.enabled&&p.promotions.offers.some(x=>x.enabled))base.push('/promotions');
 if(s.reviews?.confirmed&&(s.reviews.googleUrl||s.reviews.yelpUrl))base.push('/reviews');
 return [...base,...cities,...offered(s).map(page=>'/services/'+page.slug)];
}
function samplePanel(s,kind){
 const examples={
  reviews:`<article class="core-card core-sample-card">${badge}<h2>Customer feedback will live here.</h2><p>For a ${e(s.trade.toLowerCase())} project, source labels and dates will accompany genuine customer reviews after the contractor connects a review source.</p></article>`,
  work:`<article class="core-card core-sample-card">${badge}<h2>See how the work is shown.</h2><p>A finished ${e(s.trade.toLowerCase())} project can include photos, the work involved, and an approximate neighborhood location once the contractor publishes a real job.</p></article>`,
  finance:`<article class="core-card core-sample-card">${badge}<h2>Plan a payment conversation.</h2><p>Approved ${e(s.trade.toLowerCase())} financing programs and their confirmed terms will appear here when this contractor adds them.</p></article>`,
  promotions:`<article class="core-card core-sample-card">${badge}<h2>See an offer in place.</h2><p>A real ${e(s.trade.toLowerCase())} promotion will show its dates, eligibility and terms after the contractor supplies it.</p></article>`
 };
 return examples[kind]||'';
}
function inquiryForm(s,slug,preview){
 return `<form id="lead-form" data-slug="${e(slug)}" data-preview="${preview}"><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>How can we help?<select name="service"><option value="">Choose a service</option>${offered(s).map(page=>`<option>${e(page.serviceName)}</option>`).join('')}</select></label><label>Your project city<input name="projectCity" autocomplete="address-level2" maxlength="100"></label><label>Project notes<textarea name="message" maxlength="2500" rows="4"></textarea></label><label class="core-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="core-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><button class="core-button" ${preview?'disabled':''}>${preview?'Preview — submission disabled':'Send my request ↗'}</button><p id="lead-status" role="status">${preview?'Sample preview — no request will be sent.':''}</p></form>`;
}
function content(s,kind,city,slug,preview,projects){
 const base='/s/'+slug,link=path=>base+path+suffix(preview),cities=cityList(s),phone=phoneHref(s),p=normalizePlatform(s.platform),pages=offered(s),photo=s.ownerPhotoId?'/media/'+s.ownerPhotoId:preview&&s.ownerPhoto?.isSample?s.ownerPhoto.src:null;
 if(kind==='services')return {h1:'Work shaped around your home.',eyebrow:'OUR SERVICES',lead:`Explore the ${s.trade.toLowerCase()} services ${s.name} offers.`,body:serviceCards(s,slug,preview)};
 if(kind==='areas'&&!city)return {h1:'Good work starts close to home.',eyebrow:'SERVICE AREAS',lead:`See where ${s.name} discusses ${s.trade.toLowerCase()} projects.`,body:`<div class="core-grid">${cities.map((name,i)=>`<article class="core-card"><span class="core-kicker">0${i+1} / SERVICE AREA</span><h2>${e(name)}</h2><p>Explore the services available for your ${e(name)} property.</p><a href="${link('/areas/'+serviceSlug(name))}">Explore ${e(name)} ↗</a></article>`).join('')}</div>`};
 if(kind==='areas'){
  const i=cities.indexOf(city),c=cityContent(s,city,i),nearby=cities.filter(x=>x!==city).slice(0,4);
  return {h1:`${s.trade} work in ${city}.`,eyebrow:'YOUR NEIGHBORHOOD',lead:c.intro,body:`<section class="core-split"><div><h2>Start with what you see.</h2><p>${e(c.detail)}</p></div><div class="core-panel"><span class="core-kicker">WHAT WE CAN DISCUSS</span>${pages.slice(0,5).map(page=>`<a href="${link('/services/'+page.slug)}">${e(page.serviceName)} ↗</a>`).join('')}</div></section><section class="core-section"><h2>A question from ${e(city)}.</h2><details><summary>${e(c.question)}</summary><p>${e(c.answer)}</p></details></section>${nearby.length?`<section class="core-section"><h2>Nearby service areas.</h2><div class="core-chips">${nearby.map(x=>`<a href="${link('/areas/'+serviceSlug(x))}">${e(x)}</a>`).join('')}</div></section>`:''}`};
 }
 if(kind==='about'){
  const story=p.questionnaire.story||'',hasOwner=!!s.owner,years=s.serviceProfile?.confirmed?s.serviceProfile.years:'',license=s.license||'',facts=[years?years+' years in business':'',license?'License '+license:'',p.footer.insured?'Insured':''].filter(Boolean);
  const portrait=photo?`<img src="${e(photo)}" alt="Owner of ${e(s.name)}" loading="lazy">${preview&&!s.ownerPhotoId?badge:''}`:preview?`<img src="${e((Object.values(kits).find(k=>k.trade===s.trade)||{}).image||'')}" alt="Sample ${e(s.trade.toLowerCase())} site imagery" loading="lazy">${badge}`:'';
  return {h1:hasOwner?`Meet ${s.owner}.`:`Meet ${s.name}.`,eyebrow:'ABOUT THE BUSINESS',lead:story||`Get to know the team behind ${s.name} and the work they offer.`,body:`<section class="core-split"><div class="core-photo">${portrait}</div><div><h2>The work begins with a conversation.</h2><p>${e(story||s.intro||'Tell the team what you are planning and what matters most for the property.')}</p>${facts.length?`<ul class="core-facts">${facts.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}<a class="core-button" href="${link('/contact')}">Talk with the team ↗</a></div></section><section class="core-section"><h2>The area we serve.</h2><div class="core-area-map" role="img" aria-label="Service area overview for ${e(cities.join(', ')||s.area)}"><span>${e(cities.join(' · ')||s.area)}</span></div><div class="core-chips">${cities.map(x=>`<a href="${link('/areas/'+serviceSlug(x))}">${e(x)}</a>`).join('')}</div></section>`};
 }
 if(kind==='reviews')return {h1:'Hear it from our customers.',eyebrow:'CUSTOMER REVIEWS',lead:`Read feedback connected to ${s.name} and its original source.`,body:preview?samplePanel(s,'reviews'):`<section class="core-section" data-review-slug="${e(slug)}" data-review-preview="false"><h2>From verified sources.</h2><div data-review-results></div><p data-review-status role="status"></p><div class="core-chips">${s.reviews.googleUrl?`<a href="${e(s.reviews.googleUrl)}" target="_blank" rel="noopener">Google Maps ↗</a>`:''}${s.reviews.yelpUrl?`<a href="${e(s.reviews.yelpUrl)}" target="_blank" rel="noopener">Yelp ↗</a>`:''}</div></section>`,scripts:preview?'':'<script defer src="/reviews.js"></script>'};
 if(kind==='faq'){
  const questions=pages.slice(0,6).map(page=>({q:`What does ${page.serviceName.toLowerCase()} involve?`,a:`The ${page.serviceName.toLowerCase()} page explains what ${s.name} can discuss and how to start.`,href:link('/services/'+page.slug)}));
  return {h1:'Good questions deserve clear answers.',eyebrow:'COMMON QUESTIONS',lead:`Find a starting point for your ${s.trade.toLowerCase()} project.`,body:`<section class="core-section"><h2>Planning your project.</h2><div class="core-faq"><details><summary>Where does ${e(s.name)} work?</summary><p>Explore the <a href="${link('/areas')}">service areas</a> and share your project location when you contact the team.</p></details><details><summary>How do I get started?</summary><p>Send a project request or call ${e(s.name)} to discuss the property and the work you have in mind.</p></details>${questions.map(x=>`<details><summary>${e(x.q)}</summary><p>${e(x.a)} <a href="${x.href}">See this service ↗</a></p></details>`).join('')}</div></section>`,faq:questions};
 }
 if(kind==='contact')return {h1:'Tell us what you have in mind.',eyebrow:'CONTACT THE TEAM',lead:`Start a ${s.trade.toLowerCase()} conversation with ${s.name}.`,body:`<section class="core-split"><div class="core-panel"><h2>Reach the team directly.</h2>${phone?`<a href="${e(phone)}">${e(s.phone)} ↗</a>`:''}${s.email?`<a href="mailto:${e(s.email)}">${e(s.email)}</a>`:''}${s.hours?`<p><strong>Hours</strong><br>${e(s.hours)}</p>`:''}<p><strong>Service area</strong><br>${e(cities.join(', ')||s.area)}</p></div>${inquiryForm(s,slug,preview)}</section>`};
 if(kind==='thank-you')return {h1:'Thanks for reaching out.',eyebrow:'YOUR REQUEST',lead:`Your request is with ${s.name}. The team can follow up using the contact details you gave.`,body:`<section class="core-panel"><h2>What happens next?</h2><p>The team reviews your project details and contacts you to discuss scope, timing, and the next step.</p>${phone?`<a class="core-button" href="${e(phone)}">Call ${e(s.phone)} ↗</a>`:''}<a href="${link('')}">Back to the website</a></section>`,scripts:'<script defer src="/thank-you.js"></script>'};
 if(kind==='legal'){
  const pending='PENDING ATTORNEY REVIEW (K23)',offers=p.promotions.offers.filter(x=>x.enabled),policy=assessLegalPolicy(s);
  const sections=[['Images','Some images show representative styles, materials, and designs offered and may not depict a specific completed project.'],['License',`${licenseText(s)} Results vary by home and conditions.`],['Promotions and Financing',`${offers.length?offers.map(x=>x.title).join(', ')+'. ':''}Terms and eligibility apply; financing is subject to credit approval. ${FINANCING_DISCLOSURE} ${policy.footerDisclosure||''} ${p.footer.financingDisclosure||''}`],['Reviews','Displayed reviews should identify their source and date.'],['Privacy','Information sent through site forms is used to respond to project inquiries.'],['Text and Call Consent','Submitting a project request permits the business to contact you about that request.']];
  return {h1:'The details behind this website.',eyebrow:'LEGAL',lead:`Information for visitors to ${s.name}.`,body:`<section class="core-legal">${sections.map(([h,copy])=>`<section><span class="core-kicker">${pending}</span><h2>${e(h)}</h2><p>${e(copy)}</p></section>`).join('')}</section>`};
 }
}
function licenseText(s){const state=normalizePlatform(s.platform).legal.licenseState;return s.license?`${state?state+' ':''}License ${s.license}.`:'Contractor license details will be supplied by the business.'}
function layout(s,slug,kind,city,preview,origin,projects){
 const data=content(s,kind,city,slug,preview,projects),base='/s/'+slug,path=base+'/'+kind+(city?'/'+serviceSlug(city):''),canonical=origin+path,place=primaryCity(s),title=`${kind==='areas'&&city?city+' '+s.trade:kind[0].toUpperCase()+kind.slice(1)}${place?' in '+place:''} | ${s.name}`,description=`${data.lead} Learn more from ${s.name}.`,crumbs=[{name:'Home',item:origin+base},{name:kind[0].toUpperCase()+kind.slice(1),item:origin+base+'/'+kind}];
 if(city)crumbs.push({name:city,item:canonical});
 const schema=preview?[]:[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:x.item}))},{'@context':'https://schema.org','@type':'LocalBusiness','@id':origin+base+'#business',name:s.name,url:origin+base,telephone:s.phone||undefined,address:s.address||undefined,areaServed:city||place||undefined}];
 if(!preview&&data.faq?.length)schema.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:data.faq.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))});
 const breadcrumbs=`<nav class="core-breadcrumbs" aria-label="Breadcrumb">${crumbs.map((x,i)=>i===crumbs.length-1?`<span aria-current="page">${e(x.name)}</span>`:`<a href="${e(x.item.replace(origin,'')+suffix(preview))}">${e(x.name)}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${preview?'noindex,nofollow':'index,follow'}"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${e(canonical)}"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/core-site-pages.css"><script defer src="/site.js"></script>${data.scripts||''}${schema.map(x=>`<script type="application/ld+json">${asJson(x)}</script>`).join('')}</head><body class="core-page theme-${e(s.template)}" style="--accent:${e(s.color)}" data-core-page="${e(kind)}">${preview?'<div class="core-preview-banner">Private preview · Sample content is marked and never published</div>':''}${websiteHeader(s,{base,preview,currentPage:kind,portfolio:!!projects.length})}<main id="main">${breadcrumbs}<header class="core-hero"><p class="core-kicker">${e(data.eyebrow)}</p><h1>${e(data.h1)}</h1><p>${e(data.lead)}</p></header>${data.body}${preview&&['about','areas','services'].includes(kind)?`<section class="core-section"><h2>How real projects appear.</h2>${samplePanel(s,'work')}</section>`:''}</main>${websiteFooter({...s,showProjects:preview||projects.length>0},base,preview)}</body></html>`;
}
export async function coreSitePage(req,env,url){
 const match=url.pathname.match(routePattern);if(!match)return null;
 if(match[3]&&match[2]!=='areas')return null;
 must(req.method==='GET','Method not allowed.',405);
 const [,slug,kind,citySlug]=match,tenant=await one(env,'SELECT * FROM tenants WHERE slug=?',slug);
 must(tenant,'Website not found.',404);
 const preview=url.searchParams.get('preview')==='1';
 if(preview)await access(req,env,tenant.id);else must(tenant.status==='published'&&tenant.published,'Website not published.',404);
 const s=publicLegalSettings(JSON.parse(preview?tenant.settings:tenant.published)),cities=cityList(s),city=citySlug&&kind==='areas'?cities.find(x=>serviceSlug(x)===citySlug):null;
 if(kind==='faq'||kind==='about'){const authored=(s.websitePages?.pages||[]).find(page=>page.kind===kind);if(authored){must(authored.enabled,'Page not available.',404);return null}}
 must(!citySlug||city,'Page not found.',404);
 if(kind==='reviews'&&!preview)must(s.reviews?.confirmed&&(s.reviews.googleUrl||s.reviews.yelpUrl),'Reviews not available.',404);
 const projects=demoProjects(tenant,await all(env,'SELECT id,published FROM projects WHERE tenant_id=? AND published IS NOT NULL',tenant.id),preview);
 return layout(s,slug,kind,city,preview,url.origin,projects);
}
