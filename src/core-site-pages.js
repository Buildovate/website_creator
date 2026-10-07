import {qaPageAction} from './qa-page-action.js';
import faqContent from '../public/faq-content.json' with {type:'json'};
import {displayPhone} from './display-format.js';
import {cleanThumbnailMotion,thumbnailVisual} from './platform/thumbnail-motion.ts';
import {e,one,all,must,access} from './core.js';
import {visibleServicePages,primaryCity,serviceSlug} from './service-registry.js';
import {serviceBrief,serviceCardBlurb,serviceLayoutVariant} from './service-content.js';
import {websiteHeader,websiteFooter} from './site-polish.js';
import {publicLegalSettings,assessLegalPolicy} from './platform/legal-policy.ts';
import {demoProjects} from './crm.js';
import {normalizePlatform,FINANCING_DISCLOSURE} from './platform/constitution.ts';
import {kits} from './design-kits.js';
import {cityEditorial,newTradeCityContent,roofingCityEditorial} from './city-editorial.js';
import media from '../public/service-media.json' with {type:'json'};
import art from '../public/service-art.json' with {type:'json'};
import {serviceDiagram,visualLabels} from './service-showpiece.js';

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
  Locksmith:[['Home access',/residential|rekey|lock installation|smart/],['Vehicle access',/automotive/],['Business & specialist',/commercial|safe|key duplication/]],
  Pools:[['New pools',/design|construction/],['Renovation',/remodel|resurfac|tile|deck/],['Equipment & care',/equipment|maintenance/]]
 };
 return (groups[trade]||[]).find(([,rx])=>rx.test(n))?.[0]||'More services';
};
function serviceCards(s,slug,preview){
 const pages=offered(s),base='/s/'+slug,groups=new Map();
 for(const page of pages){const key=category(s.trade,page.serviceName);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(page)}
 const showGroups=groups.size>1;
 return [...groups].map(([group,items])=>`<section class="core-group">${showGroups?`<h2>${e(group)}</h2>`:''}<div class="core-grid">${items.map(page=>{
  const name=page.serviceName,src=art[s.trade]?.[name.toLowerCase()]||'',blurb=serviceCardBlurb(s.trade,name,s.services.find(x=>x.name===name)?.description||'');
  if(s.trade==='Roofing'&&src){const effect=cleanThumbnailMotion(s).thumb_motion_effect,rear=media[s.trade]?.[name.toLowerCase()]?.scope||src;return '<article class="core-card sm-shell"><a class="sm-card" data-service-motion="'+effect+'" href="'+base+'/services/'+e(page.slug)+suffix(preview)+'">'+thumbnailVisual(name,src,rear,effect)+'<div class="sm-copy"><span class="core-kicker">'+e(s.trade)+'</span><h3>'+e(name)+'</h3><p>'+e(blurb)+'</p><span class="sm-link">Explore '+e(name)+' <span aria-hidden="true">→</span></span></div></a></article>'}
  return `<article class="core-card">${src?`<img src="${e(src)}" alt="${e(name)} design inspiration" width="384" height="512" loading="eager">`:`<div class="core-card-art">${serviceDiagram(s.trade,name,'route',visualLabels(s.trade,[name,'Scope','Finish']))}</div>`}<div><span class="core-kicker">${e(s.trade)}</span><h3>${e(name)}</h3><p>${e(blurb)}</p><a href="${base}/services/${e(page.slug)}${suffix(preview)}">Explore ${e(name)}</a></div></article>`}).join('')}</div></section>`).join('');
}
const sentence=(value)=>String(value).replace(/\s+/g,' ').trim();
export function cityContent(s,city,index=0){
 const local=cityEditorial[city],record=(s.serviceAreas||[]).find(x=>x.city===city);
 const fallback={intro:`Talk with ${s.name} about ${s.trade.toLowerCase()} work at your ${city} address.`,detail:record?.description||`Send photos and the location of your ${city} property so the team can discuss the building and access before a visit.`,faq:[['What should I send about my '+city+' property?','Include the '+city+' address and a description of the affected area.'],['How do I discuss access in '+city+'?','Mention gates, stairs and shared spaces at your '+city+' home.'],['Can I ask about previous work in '+city+'?','Share any records for earlier repairs at the '+city+' property.']]};
 const copy=(s.trade==='Roofing'&&roofingCityEditorial[city])||newTradeCityContent(s,city)||local||fallback;return {...copy,question:copy.faq[0][0],answer:copy.faq[0][1]};
}
export function assertUniqueCitySentences(s){
 const found=new Map();for(const city of cityList(s)){const c=cityContent(s,city);for(const value of [c.intro,c.detail,...c.faq.flat()])for(const part of value.match(/[^.!?]+[.!?]?/g)||[]){const normalized=part.trim().toLowerCase();if(!normalized)continue;if(found.has(normalized)&&found.get(normalized)!==city)throw Error('Two city pages share a sentence: '+normalized);found.set(normalized,city)}}return true;
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
 const service=offered(s)[0]?.serviceName||s.trade,src=media[s.trade]?.[service.toLowerCase()]?.process;
 return `<article class="core-card core-sample-card">${src?`<img src="${e(src)}" alt="Sample ${e(service)} detail" width="900" height="600" loading="lazy">`:serviceDiagram(s.trade,service,'sample',visualLabels(s.trade,[]))}${badge}<h2>${kind==='reviews'?'A project, in the homeowner’s words':'A closer look at '+e(service.toLowerCase())}</h2><p>${kind==='reviews'?'Review layout: source, date and the homeowner’s own account. No customer quote is being represented in this sample.':e(serviceBrief(s.trade,service)?.includes[0]||service)+' — a sample view of the work, with space for an actual project’s photos and scope.'}</p></article>`;
}
function inquiryForm(s,slug,preview,city='',copy=null){
 if(city&&copy){const f=copy.fields;return '<form id="lead-form" method="post" action="/api/public/'+e(slug)+'/inquiries" data-slug="'+e(slug)+'" data-city="'+e(city)+'" data-preview="'+preview+'"><input type="hidden" name="projectCity" value="'+e(city)+'"><label>'+e(f[0])+'<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>'+e(f[1])+'<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>'+e(f[2])+'<select name="service"><option value="">—</option>'+offered(s).map(page=>'<option>'+e(page.serviceName)+'</option>').join('')+'</select></label><label>'+e(f[3])+'<textarea name="message" maxlength="2500" rows="4"></textarea></label><label class="core-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="core-consent"><input name="consent" type="checkbox" required>'+e(f[4])+'</label><button class="core-button" '+(preview?'disabled':'')+'>'+e(f[5])+'</button><p id="lead-status" role="status">'+(preview?'Sample preview — no request will be sent.':'')+'</p><noscript><p><a href="'+e(phoneHref(s))+'">'+e(displayPhone(s.phone))+'</a></p></noscript></form>'}

 return `<form id="lead-form" data-slug="${e(slug)}" data-preview="${preview}"><div class="core-estimator-progress"><span class="core-kicker">01 / YOUR PROJECT</span><progress value="1" max="3" aria-label="Estimate request, step 1 of 3"></progress><p>Choose your service. Next, the team reviews the scope with you before discussing a price.</p></div><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>How can we help?<select name="service"><option value="">Choose a service</option>${offered(s).map(page=>`<option>${e(page.serviceName)}</option>`).join('')}</select></label><label>Your project city<input name="projectCity" autocomplete="address-level2" maxlength="100"></label><label>Project notes<textarea name="message" maxlength="2500" rows="4"></textarea></label><label class="core-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="core-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><button class="core-button" ${preview?'disabled':''}>${preview?'Preview — submission disabled':'Send my request'}</button><p id="lead-status" role="status">${preview?'Sample preview — no request will be sent.':''}</p></form>`;
}
function content(s,kind,city,slug,preview,projects){
 const base='/s/'+slug,link=path=>base+path+suffix(preview),cities=cityList(s),phone=phoneHref(s),p=normalizePlatform(s.platform),pages=offered(s),photo=s.ownerPhotoId?'/media/'+s.ownerPhotoId:preview&&s.ownerPhoto?.isSample?s.ownerPhoto.src:null;
 if(kind==='services')return {h1:`Find the ${s.trade.toLowerCase()} help you need.`,eyebrow:'OUR SERVICES',lead:`Explore the ${s.trade.toLowerCase()} services ${s.name} offers.`,body:serviceCards(s,slug,preview),scripts:s.trade==='Roofing'?'<link rel="stylesheet" href="/service-motion.css"><script defer src="/service-motion.js"></script>':''};
 if(kind==='areas'&&!city)return {h1:'Find your neighborhood.',eyebrow:'SERVICE AREAS',lead:`See where ${s.name} discusses ${s.trade.toLowerCase()} projects.`,body:`<div class="core-grid">${cities.map((name,i)=>`<article class="core-card"><span class="core-kicker">0${i+1} / SERVICE AREA</span><h2>${e(name)}</h2><p>Explore the services available for your ${e(name)} property.</p><a href="${link('/areas/'+serviceSlug(name))}">Explore ${e(name)}</a></article>`).join('')}</div>`};
 if(kind==='areas'){
  const i=cities.indexOf(city),c=cityContent(s,city,i),nearby=cities.filter(x=>x!==city).slice(0,4);
  if(s.trade==='Roofing'&&roofingCityEditorial[city]){
   const image=(src,alt,caption)=>'<figure class="rc-detail-photo"><img src="'+e(src)+'" alt="'+e(alt)+'" width="1536" height="1030" loading="lazy"></figure>';
   const jump='<a class="core-button" href="#city-inquiry">'+e(c.cta)+' <span aria-hidden="true">→</span></a>';
   return {h1:c.h1,eyebrow:c.eyebrow,lead:c.intro,seoTitle:c.seoTitle+' | '+s.name,description:c.description,image:c.hero,imageAlt:c.heroAlt,imageCaption:c.heroCaption,cityDesigned:true,heroAction:jump,
    body:'<section class="rc-local" aria-labelledby="city-context"><div><p class="rc-label">'+e(city)+'</p><h2 id="city-context">'+e(c.localTitle)+'</h2><p>'+e(c.detail)+'</p></div><aside><h3>'+e(c.focusTitle)+'</h3><p>'+e(c.focus)+'</p></aside></section>'+
    (pages.length?'<section class="rc-services"><div><h2>'+e(c.servicesTitle)+'</h2><p>'+e(c.servicesLead)+'</p><nav aria-label="'+e(city)+' roofing services">'+pages.map(page=>'<a href="'+link('/services/'+page.slug)+'">'+e(page.serviceName)+' <span aria-hidden="true">→</span></a>').join('')+'</nav></div>'+image(c.detailImage,c.detailCaption,c.detailCaption)+'</section>':'')+
    '<section class="rc-band"><div><h2>'+e(c.bandTitle)+'</h2><p>'+e(c.bandText)+'</p></div>'+jump+'</section>'+
    '<section class="rc-process"><h2>'+e(c.processTitle)+'</h2><ol>'+c.steps.map(([title,body],index)=>'<li><span aria-hidden="true">0'+(index+1)+'</span><h3>'+e(title)+'</h3><p>'+e(body)+'</p></li>').join('')+'</ol></section>'+
    '<section class="rc-questions"><h2>'+e(c.faqTitle)+'</h2><div>'+c.faq.map(([q,a])=>'<details><summary>'+e(q)+'</summary><p>'+e(a)+'</p></details>').join('')+'</div></section>'+
    '<section class="rc-inquiry" id="city-inquiry"><div><p class="rc-label">'+e(city)+'</p><h2>'+e(c.formTitle)+'</h2><p>'+e(c.formLead)+'</p>'+(phone?'<a class="rc-call" href="'+e(phone)+'">'+e(displayPhone(s.phone))+'</a>':'')+'</div>'+inquiryForm(s,slug,preview,city,c)+'</section>'+
    (nearby.length?'<nav class="rc-nearby" aria-label="Other service areas"><h2>'+e(c.nearbyTitle)+'</h2><div class="core-chips">'+nearby.map(x=>'<a href="'+link('/areas/'+serviceSlug(x))+'">'+e(x)+'</a>').join('')+'</div></nav>':''),faq:c.faq.map(([q,a])=>({q,a}))};
  }

  return {h1:`${s.trade} work in ${city}.`,eyebrow:'YOUR NEIGHBORHOOD',lead:c.intro,body:`<section class="core-split"><div><h2>Homes and conditions in ${e(city)}.</h2><p>${e(c.detail)}</p><div class="core-city-faq"><h3>Planning work in ${e(city)}.</h3>${c.faq.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></div><div class="core-panel">${serviceDiagram(s.trade,pages[0]?.serviceName,'local',visualLabels(s.trade,[]))}<span class="core-kicker">SERVICES IN ${e(city)}</span>${pages.slice(0,5).map(page=>`<a href="${link('/services/'+page.slug)}">${e(page.serviceName)}</a>`).join('')}</div></section>${nearby.length?`<section class="core-section"><h2>Nearby service areas.</h2><div class="core-chips">${nearby.map(x=>`<a href="${link('/areas/'+serviceSlug(x))}">${e(x)}</a>`).join('')}</div></section>`:''}`};
 }
 if(kind==='about'){
  const story=p.questionnaire.story||'',hasOwner=!!s.owner,years=s.serviceProfile?.confirmed?s.serviceProfile.years:'',license=s.license||'',facts=[years?years+' years in business':'',license?'License '+license:'',p.footer.insured?'Insured':''].filter(Boolean);
  const detailPhoto=media[s.trade]?.[pages[0]?.serviceName.toLowerCase()]?.process;
  const portrait=photo?`<img src="${e(photo)}" alt="Owner of ${e(s.name)}" loading="lazy">${preview&&!s.ownerPhotoId?badge:''}`:detailPhoto?`<img src="${e(detailPhoto)}" alt="${e(pages[0]?.serviceName||s.trade)} work detail" width="1536" height="1024" loading="lazy">${preview?badge:''}`:preview?`<img src="${e((Object.values(kits).find(k=>k.trade===s.trade)||{}).image||'')}" alt="Sample ${e(s.trade.toLowerCase())} site imagery" loading="lazy">${badge}`:'';
  return {h1:hasOwner?`Meet ${s.owner}.`:`Meet ${s.name}.`,eyebrow:'ABOUT THE BUSINESS',lead:`Meet the people you’ll talk to about your ${s.trade.toLowerCase()} project.`,body:`<section class="core-split"><div class="core-photo">${portrait}</div><div><h2>The people responsible for your project.</h2><p>${e(story||s.intro||`From ${pages[0]?.serviceName.toLowerCase()||s.trade.toLowerCase()} to the final review, talk directly with ${s.name} about the work your home needs.`)}</p>${facts.length?`<ul class="core-facts">${facts.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}<a class="core-button" href="${link('/contact')}">Talk with the team</a></div></section><section class="core-section"><h2>The area we serve.</h2><div class="core-area-map" role="img" aria-label="Service area overview for ${e(cities.join(', ')||s.area)}"><span>${e(cities.join(' · ')||s.area)}</span></div><div class="core-chips">${cities.map(x=>`<a href="${link('/areas/'+serviceSlug(x))}">${e(x)}</a>`).join('')}</div></section>`};
 }
 if(kind==='reviews')return {h1:'Hear it from our customers.',eyebrow:'CUSTOMER REVIEWS',lead:`Read feedback connected to ${s.name} and its original source.`,body:preview?samplePanel(s,'reviews'):`<section class="core-section" data-review-slug="${e(slug)}" data-review-preview="false"><h2>From verified sources.</h2><div data-review-results></div><p data-review-status role="status"></p><div class="core-chips">${s.reviews.googleUrl?`<a href="${e(s.reviews.googleUrl)}" target="_blank" rel="noopener">Google Maps</a>`:''}${s.reviews.yelpUrl?`<a href="${e(s.reviews.yelpUrl)}" target="_blank" rel="noopener">Yelp</a>`:''}</div></section>`,scripts:preview?'':'<script defer src="/reviews.js"></script>'};
 if(kind==='faq'&&s.trade==='Roofing'){
  const config=faqContent.Roofing,questions=config.questions.filter(q=>q.requires==='none'||normalizePlatform(s.platform)[q.requires]?.enabled),groups=[...new Set(questions.map(q=>q.category))];
  return {h1:config.title,eyebrow:'COMMON QUESTIONS',lead:config.intro,body:'<div id="answers">'+groups.map((category,i)=>'<section class="core-section tp-faq-group" aria-labelledby="faq-group-'+i+'"><p class="core-kicker">'+e(config.eyebrows[category])+'</p><h2 id="faq-group-'+i+'">'+e(category)+'</h2><div class="core-faq">'+questions.filter(q=>q.category===category).map(q=>'<details><summary>'+e(q.question)+'</summary><p>'+e(q.answer)+'</p></details>').join('')+'</div></section>').join('')+'</div>',faq:questions.map(q=>({q:q.question,a:q.answer}))};
 }
 if(kind==='faq'){
  const questions=pages.slice(0,6).map(page=>({q:`What does ${page.serviceName.toLowerCase()} involve?`,a:`The ${page.serviceName.toLowerCase()} page explains what ${s.name} can discuss and how to start.`,href:link('/services/'+page.slug)}));
  return {h1:'Good questions deserve clear answers.',eyebrow:'COMMON QUESTIONS',lead:`Find a starting point for your ${s.trade.toLowerCase()} project.`,body:`<section class="core-section"><h2>Planning your project.</h2><div class="core-faq"><details><summary>Where does ${e(s.name)} work?</summary><p>Explore the <a href="${link('/areas')}">service areas</a> and share your project location when you contact the team.</p></details><details><summary>How do I get started?</summary><p>Send a project request or call ${e(s.name)} to discuss the property and the work you have in mind.</p></details>${questions.map(x=>`<details><summary>${e(x.q)}</summary><p>${e(x.a)} <a href="${x.href}">See this service</a></p></details>`).join('')}</div></section>`,faq:questions};
 }
 if(kind==='contact')return {h1:'Tell us what you have in mind.',eyebrow:'CONTACT THE TEAM',lead:`Start a ${s.trade.toLowerCase()} conversation with ${s.name}.`,body:`<section class="core-split"><div class="core-panel"><h2>Reach the team directly.</h2>${phone?`<a href="${e(phone)}">${e(displayPhone(s.phone))}</a>`:''}${s.email?`<a href="mailto:${e(s.email)}">${e(s.email)}</a>`:''}${s.hours?`<p><strong>Hours</strong><br>${e(s.hours)}</p>`:''}<p><strong>Service area</strong><br>${e(cities.join(', ')||s.area)}</p></div>${inquiryForm(s,slug,preview)}</section>`};
 if(kind==='thank-you')return {h1:'You’ve taken the first step.',eyebrow:'YOUR REQUEST',lead:`Thanks for sharing what your home needs. Your request is saved with ${s.name}.`,body:`<section class="core-panel inquiry-success"><span class="inquiry-success-mark" aria-hidden="true">✓</span><h2>Let’s keep your project moving.</h2><p>Your project details and contact information are ready for the team to review. Keep any photos or questions handy for your conversation.</p>${s.conversionBrief?.confirmed&&s.conversionBrief?.nextStep?`<p>${e(s.conversionBrief.nextStep)}</p>`:''}${phone?`<a class="core-button" href="${e(phone)}">Call ${e(displayPhone(s.phone))}</a>`:''}<a href="${link('')}">Back to the website</a></section>`,scripts:'<script defer src="/thank-you.js"></script>'};
 if(kind==='legal'){
  const pending='PENDING ATTORNEY REVIEW (K23)',offers=p.promotions.offers.filter(x=>x.enabled),policy=assessLegalPolicy(s);
  const sections=[['Images','Some images show representative styles, materials, and designs offered and may not depict a specific completed project.'],['License',`${licenseText(s)} Results vary by home and conditions.`],['Promotions and Financing',`${offers.length?offers.map(x=>x.title).join(', ')+'. ':''}Terms and eligibility apply; financing is subject to credit approval. ${FINANCING_DISCLOSURE} ${policy.footerDisclosure||''} ${p.footer.financingDisclosure||''}`],['Reviews','Displayed reviews should identify their source and date.'],['Privacy','Information sent through site forms is used to respond to project inquiries.'],['Text and Call Consent','Submitting a project request permits the business to contact you about that request.']];
  return {heroAction:qaPageAction('/s/'+slug,preview),h1:'The details behind this website.',eyebrow:'LEGAL',lead:`Information for visitors to ${s.name}.`,body:`<section class="core-legal">${offers.map(o=>`<section id="offer-${e(o.id)}"><h2>${e(o.title)}</h2><p>${e(String(o.terms||'').replace(/<\s*No guarantee\s*>/gi,'Results are not guaranteed.').replace(/<[^<>]{1,80}>|\{\{[^{}]{1,80}\}\}/g,''))}</p></section>`).join('')}${sections.map(([h,copy])=>`<section><span class="core-kicker">${pending}</span><h2>${e(h)}</h2><p>${e(copy)}</p></section>`).join('')}</section>`};
 }
}
function licenseText(s){const state=normalizePlatform(s.platform).legal.licenseState;return s.license?`${state?state+' ':''}License ${s.license}.`:'Contractor license details will be supplied by the business.'}
function layout(s,slug,kind,city,preview,origin,projects){
 const data=content(s,kind,city,slug,preview,projects),base='/s/'+slug,path=base+'/'+kind+(city?'/'+serviceSlug(city):''),canonical=origin+path,place=primaryCity(s),title=data.seoTitle||`${kind==='areas'&&city?city+' '+s.trade:kind[0].toUpperCase()+kind.slice(1)}${place&&!city?' in '+place:''} | ${s.name}`,description=data.description||`${data.lead} Learn more from ${s.name}.`,crumbs=[{name:'Home',item:origin+base},{name:kind[0].toUpperCase()+kind.slice(1),item:origin+base+'/'+kind}];
 if(city)crumbs.push({name:city,item:canonical});
 const schema=preview?[]:[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:x.item}))},{'@context':'https://schema.org','@type':'LocalBusiness','@id':origin+base+'#business',name:s.name,url:origin+base,telephone:s.phone||undefined,address:s.address||undefined,areaServed:city||place||undefined}];
 if(!preview&&data.faq?.length)schema.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:data.faq.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))});
 const breadcrumbs=`<nav class="core-breadcrumbs" aria-label="Breadcrumb">${crumbs.map((x,i)=>i===crumbs.length-1?`<span aria-current="page">${e(x.name)}</span>`:`<a href="${e(x.item.replace(origin,'')+suffix(preview))}">${e(x.name)}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;
 const first=offered(s)[city?Math.max(0,cityList(s).indexOf(city))%Math.max(1,offered(s).length):0],image=data.image||(kind==='about'&&media[s.trade]?.[first?.serviceName.toLowerCase()]?.scope?media[s.trade][first.serviceName.toLowerCase()].scope:art[s.trade]?.[first?.serviceName.toLowerCase()]||Object.values(art[s.trade]||{})[0]||Object.values(kits).find(x=>x.trade===s.trade)?.image||'');
 const visual=image?`<figure class="core-hero-visual">${preview&&!(kind==='about'&&s.ownerPhotoId)?badge:''}<img src="${e(image)}" alt="${data.imageAlt?e(data.imageAlt):kind==='about'&&s.ownerPhotoId?e(s.name)+' owner portrait':`${e(s.trade.toLowerCase())} work`}" width="900" height="900" fetchpriority="high"></figure>`:'';
 const estimator=data.cityDesigned||kind==='legal'||kind==='contact'?'':`<aside class="core-estimator"><div><span class="core-kicker">${kind==='thank-you'?'KEEP YOUR PLAN':'YOUR NEXT STEP'}</span><h2>${kind==='thank-you'?'Keep your project details handy.':city?`Plan the work for your ${e(city)} home.`:'Tell us what your home needs.'}</h2><p>${kind==='thank-you'?'Keep your project details together for your next conversation.':'Share the service and property details that will shape your price discussion.'}</p></div><a class="core-button" href="${e(base+(kind==='thank-you'?'/services':'/contact')+suffix(preview))}">${kind==='thank-you'?'Review our services':'Get my price'}</a></aside>`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${preview?'noindex,nofollow':'index,follow'}"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${e(canonical)}"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/core-site-pages.css"><link rel="stylesheet" href="/trade-backgrounds.css">${data.cityDesigned?'<link rel="preload" as="font" href="/assets/dm-sans.ttf" type="font/ttf" crossorigin><link rel="preload" as="font" href="/assets/barlow-bold.ttf" type="font/ttf" crossorigin><link rel="stylesheet" href="/roofing-city.css"><script defer src="/roofing-city.js"></script>':''}<script defer src="/site.js"></script>${data.scripts||''}${schema.map(x=>`<script type="application/ld+json">${asJson(x)}</script>`).join('')}</head><body class="core-page theme-${e(s.template)}${data.cityDesigned?' rc-page':''}" style="--accent:${e(s.color)}" data-core-page="${e(kind)}" data-trade="${e(s.trade)}" data-layout-variant="${serviceLayoutVariant(s.generationId||slug)}">${preview?'<div class="core-preview-banner">Private preview · Sample content is marked and never published</div>':''}${data.cityDesigned?'<a class="rc-skip" href="#main">Skip to '+e(city)+' roofing content</a>':''}${websiteHeader(s,{base,preview,currentPage:kind,portfolio:!!projects.length})}<main id="main"${data.cityDesigned?' tabindex="-1"':''}>${breadcrumbs}<header class="core-hero"><div><p class="core-kicker">${e(data.eyebrow)}</p><h1>${e(data.h1)}</h1><p>${e(data.lead)}</p>${data.heroAction||''}</div>${visual}</header>${data.body}${preview&&!data.cityDesigned&&['about','areas','services'].includes(kind)?`<section class="core-section"><h2>How real projects appear.</h2>${samplePanel(s,'work')}</section>`:''}${estimator}</main>${websiteFooter({...s,showProjects:preview||projects.length>0},base,preview,{cityEditorial:data.cityDesigned===true})}</body></html>`;
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
