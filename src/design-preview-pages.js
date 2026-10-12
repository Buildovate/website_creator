import {e} from './core.js';
import {websiteHeader,websiteFooter} from './site-polish.js';
import {visibleServicePages,serviceSlug} from './service-registry.js';
import {serviceCardBlurb} from './service-content.js';
import art from '../public/service-art.json' with {type:'json'};
import media from '../public/service-media.json' with {type:'json'};

const badge='<span class="core-sample">Sample</span>';
const cities=['North Ridge','Oak Valley','Westbrook'];
const questions=trade=>[
 ['How do I start a '+trade.toLowerCase()+' project?','Share the property location, what you want to change, photos if available, and the timing you have in mind. A contractor can then discuss the scope with you.'],
 ['What should I compare in an estimate?','Ask what work, materials, preparation, cleanup, timing and warranty terms are included. Confirm the written scope before work begins.'],
 ['Can I ask about payment options?','Yes. Compare a written project price with any available financing terms, including APR, fees, total payments and eligibility.']
];

export function designPreviewPage(s,{base,path}){
 const root=base.split('?')[0],query=base.includes('?')?'?'+base.split('?')[1]:'',link=part=>root+part+query;
 const pages=visibleServicePages(s),first=pages[0],image=name=>art[s.trade]?.[name.toLowerCase()]||'',service=pages.find(p=>p.slug===path.split('/')[2]);
 let title='',eyebrow='',lead='',body='';
 const card=(heading,copy,href='',src='')=>`<article class="core-card">${src?`<img src="${e(src)}" alt="Illustrative ${e(heading.toLowerCase())} imagery" loading="lazy">`:''}${badge}<h3>${e(heading)}</h3><p>${e(copy)}</p>${href?`<a href="${e(href)}">Explore ${e(heading)} →</a>`:''}</article>`;
 const grid=items=>`<div class="core-grid">${items.join('')}</div>`;
 if(path==='/services'){
  title='Explore our services.';eyebrow='EXPERTISE';lead=`A complete sample service catalog for a ${s.trade.toLowerCase()} website.`;
  body=grid(pages.map(p=>card(p.serviceName,serviceCardBlurb(s.trade,p.serviceName,''),link('/services/'+p.slug),image(p.serviceName))));
 }else if(service&&path==='/services/'+service.slug){
  title=service.serviceName+'.';eyebrow='SERVICE DETAIL';lead=`A sample detail page showing how ${service.serviceName.toLowerCase()} can be presented.`;
  body=`<section class="core-split"><div class="core-photo">${image(service.serviceName)?`<img src="${e(image(service.serviceName))}" alt="Illustrative ${e(service.serviceName.toLowerCase())} work">`:''}${badge}</div><div><h2>Plan the scope together.</h2><p>${e(serviceCardBlurb(s.trade,service.serviceName,''))}</p><p>Real service details, materials, process and project photos can be added when the business confirms them.</p><a class="core-button" href="${e(link('/contact'))}">Discuss this service →</a></div></section><section class="core-section"><h2>Questions to cover.</h2><div class="core-faq">${questions(s.trade).map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></section>`;
 }else if(path==='/areas'){
  title='Where we work.';eyebrow='SERVICE AREAS';lead='Illustrative area layout. Replace these sample places with confirmed service cities before publishing.';
  body=grid(cities.map(city=>card(city,`A sample city page for ${s.trade.toLowerCase()} services and local project planning.`,link('/areas/'+serviceSlug(city)))));
 }else if(path.startsWith('/areas/')&&cities.some(city=>serviceSlug(city)===path.slice(7))){
  const city=cities.find(item=>serviceSlug(item)===path.slice(7));title=`${s.trade} in ${city}.`;eyebrow='SAMPLE CITY PAGE';lead=`An illustrative local page for ${city}. This is not a confirmed service area.`;
  body=`<section class="core-split"><div><h2>Plan for your property.</h2><p>Tell the team about the building, access, existing condition and project goals. Confirm availability in your actual city before arranging work.</p><a class="core-button" href="${e(link('/contact'))}">Ask about your location →</a></div><div class="core-panel">${badge}<h3>Explore the work.</h3>${pages.slice(0,5).map(p=>`<a href="${e(link('/services/'+p.slug))}">${e(p.serviceName)} →</a>`).join('')}</div></section>`;
 }else if(path==='/about'){
  title='Meet the business.';eyebrow='ABOUT';lead='A place for the real team, their story and confirmed credentials.';
  body=`<section class="core-split"><div class="core-photo">${s.trade==='Roofing'?'<img src="/assets/owner-roofing/owner-sample-960.webp" alt="Sample portrait showing owner photo placement">':first&&image(first.serviceName)?`<img src="${e(image(first.serviceName))}" alt="Illustrative ${e(s.trade.toLowerCase())} imagery">`:''}${badge}</div><div><h2>People behind the work.</h2><p>This sample shows where the owner portrait, team story, licenses and verified experience will appear after the business supplies them. No person or credential is claimed here.</p><a class="core-button" href="${e(link('/contact'))}">Start a conversation →</a></div></section>`;
 }else if(path==='/reviews'){
  title='Hear from homeowners.';eyebrow='REVIEWS';lead='A sample review layout awaiting a connected, confirmed source.';
  body=grid([card('Customer feedback','The real review source, date, rating and homeowner words will appear here when connected. No customer quote or score is being represented.'),card('Source and context','Reviews can link to their original Google or Yelp source. Only connected, eligible reviews appear on a published site.')]);
 }else if(path==='/faq'){
  title='Questions, answered.';eyebrow='FAQ';lead=`Common planning questions for a ${s.trade.toLowerCase()} project.`;
  body=`<section class="core-section"><div class="core-faq">${questions(s.trade).map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></section>`;
 }else if(path==='/contact'){
  title='Tell us about your project.';eyebrow='CONTACT';lead='This sample form demonstrates the contact page. It cannot send a request.';
  body=`<section class="core-split"><div><h2>Start with the basics.</h2><p>Describe the work, your location and what matters most. Confirmed business contact details will appear here when supplied.</p></div><form data-preview="true"><label>Your name<input name="name" autocomplete="name"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel"></label><label>Service<select name="service"><option>Choose a service</option>${pages.map(p=>`<option>${e(p.serviceName)}</option>`).join('')}</select></label><label>Project details<textarea name="message" rows="4"></textarea></label><button class="core-button" type="button" disabled>Preview — submission disabled</button></form></section>`;
 }else if(path==='/financing'){
  title='Plan the payment.';eyebrow='FINANCING';lead='See where confirmed payment programs and lender details would appear.';
  body=grid([card('Compare the full cost','Sample layout for a written project price, APR, term, fees, monthly payment and total repayment. No lender offer is available in this sample.'),card('Choose after reviewing terms','A live lender application link appears only when a business connects and confirms a program.')]);
 }else if(path==='/promotions'){
  title='Offers with clear terms.';eyebrow='PROMOTIONS';lead='A sample layout for dated, eligible offers.';
  body=grid([card('Seasonal offer placement','This is a layout example only. There is no active discount, code, eligibility promise or redemption action.'),card('Read the details','A real published offer would show its service, dates, limitations and redemption terms.')]);
 }else if(path==='/projects'){
  title='Our work, up close.';eyebrow='PROJECTS';lead='Illustrative project cards show how real work will be presented.';
  body=grid(pages.slice(0,3).map((p,i)=>card(`${p.serviceName} story ${i+1}`,'Sample project layout. Add the actual scope, location, photos and outcome before publication.',link('/before-after'),image(p.serviceName))));
 }else if(path==='/before-after'){
  title='See the transformation.';eyebrow='BEFORE & AFTER';lead='A sample comparison layout awaiting photographs from completed work.';
  body=`<section class="core-split">${['Before','After'].map((label,i)=>`<div class="core-panel">${media[s.trade]?.[first?.serviceName.toLowerCase()]?.[i?'process':'scope']?`<img src="${e(media[s.trade][first.serviceName.toLowerCase()][i?'process':'scope'])}" alt="Illustrative ${e(s.trade.toLowerCase())} work detail" loading="lazy" style="width:100%;height:280px;object-fit:cover">`:''}${badge}<h2>${label}</h2><p>Sample image placement only. These images do not document one completed job or a real transformation.</p></div>`).join('')}</section><a class="core-button" href="${e(link('/projects'))}">Explore project layouts →</a>`;
 }else if(path==='/legal'){
  title='Website information.';eyebrow='LEGAL';lead='Sample legal page links for review before publication.';
  body=grid([card('Privacy policy','Review how inquiry data and connected services are handled.',link('/legal/privacy')),card('Website terms','Review the terms governing project information and estimates.',link('/legal/terms'))]);
 }else return null;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(title)} | ${e(s.name)}</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/core-site-pages.css"><link rel="stylesheet" href="/design-preview-pages.css"></head><body class="core-page" data-design-preview data-trade="${e(s.trade)}" style="--accent:${e(s.color)}"><div class="core-preview-banner">Design kit preview · ${e(s.name)} · Sample content · Forms disabled</div>${websiteHeader(s,{base,preview:true,sample:true,project:true,currentPage:path.slice(1)})}<main><nav class="core-breadcrumbs" aria-label="Breadcrumb"><a href="${e(base)}">Home</a><span>${e(eyebrow)}</span></nav><header class="core-hero"><p class="core-kicker">${e(eyebrow)}</p><h1>${e(title)}</h1><p>${e(lead)}</p></header>${body}</main>${websiteFooter({...s,showProjects:true},base,true)}</body></html>`;
}
