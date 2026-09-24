import {motionHero,anatomySection,warningArt} from './trade-motion.js';
import {tradeMotion} from './trade-motion-config.js';
import {sampleBadge,serviceIcon,serviceFinance,financeSection,serviceOffers,promoBanner,promoSection,sampleTrust,sampleServiceReviews} from './service-conversion.js';
import {e, one, all, must, access} from './core.js';
import {normalizePlatform} from './platform/constitution.ts';
import {websiteBrand, websiteFooter, faqLink} from './site-polish.js';
import {reviewSection} from './reviews.js';

export function visibleServicePages(s) {
  return (s.websitePages?.pages || []).filter(p => p.kind === 'service' && p.enabled && (s.services || []).some(service => service.name === p.serviceName));
}

// Use the same snapshot and visibility rules as the destination route. Library
// samples have no tenant service routes, so retain their contextual inquiry.
export function serviceGridLink(s, name, {base = '', preview = false, sample = false} = {}, arrow = '↗') {
 const page = s.trade === 'Roofing' && !sample && /^\/s\/[^/?]+$/.test(base)
  && visibleServicePages(s).find(p => p.serviceName === name);
 return page
  ? `<a href="${e(base)}/services/${e(page.slug)}${preview ? '?preview=1' : ''}">Explore ${e(name.toLowerCase())} ${arrow}</a>`
  : `<a href="#contact" data-service-link="${e(name)}">Ask about ${e(name.toLowerCase())} ${arrow}</a>`;
}
// Only rendered service slots grant public media access; thumbnail/other page
// kinds remain private until their own renderers are implemented.
export function publicServicePhoto(s, photo) {
  return s.trade === 'Roofing' && visibleServicePages(s).some(p => p.media?.bannerOne && p.media?.bannerTwo &&
    ['bannerOne', 'bannerTwo'].some(slot => p.media?.[slot]?.photoId === photo.id));
}
export async function websitePage(req, env, url) {
  const salesPreview=url.pathname.startsWith('/sales-preview/');
  const match = url.pathname.replace(/^\/sales-preview\//,'/s/').match(/^\/s\/([^/]+)\/services\/([a-z][a-z0-9-]*)\/?$/);
  const faqMatch = !salesPreview && url.pathname.match(/^\/s\/([^/]+)\/faq\/?$/);
  const route = match || faqMatch;
  if (!route) return null;
  must(req.method === 'GET', 'Method not allowed.', 405);
  const tenant = await one(env, 'SELECT * FROM tenants WHERE slug=?', route[1]);
  must(tenant, 'Website not found.', 404);
  const preview = salesPreview || url.searchParams.get('preview') === '1';
  if(salesPreview)must(tenant.status!=='published'&&!tenant.published,'Sales samples are unavailable for published sites.',404);
  if (preview) await access(req, env, tenant.id);
  else must(tenant.status === 'published' && tenant.published, 'Website not published.', 404);
  const s = JSON.parse(preview ? tenant.settings : tenant.published);
  if (faqMatch) {
    const faq = (s.websitePages?.pages || []).find(p => p.kind === 'faq' && p.enabled);
    must(s.trade === 'Roofing' && faq, 'FAQ not available.', 404);
    const photos = await all(env, 'SELECT id FROM photos WHERE tenant_id=?', tenant.id);
    return renderFAQPage(s, faq, {slug:tenant.slug, preview, photos});
  }
  const page = visibleServicePages(s).find(p => p.slug === match[2]);
  must(s.trade === 'Roofing' && page, 'Service not available.', 404);
  const photos = await all(env, 'SELECT id FROM photos WHERE tenant_id=?', tenant.id);
  return renderServicePage(s, page, {slug: tenant.slug, preview, salesPreview, photos});
}
export function accentTokens(color) {
 const hex=/^#[a-f0-9]{6}$/i.test(color||'')?color:'#b8dc65';
 const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const luminance=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
 return {accent:hex,ink:luminance>.179?'#000000':'#ffffff'};
}
export function renderServicePage(s, page, {slug, preview = false, salesPreview = false, photos = []}) {
 salesPreview=preview&&salesPreview;
 const base='/s/'+slug,suffix=preview?'?preview=1':'',home=base+suffix;
 const known=new Set(photos.map(p=>p.id)),platform=normalizePlatform(s.platform),profile=s.serviceProfile||{};
 const finance=serviceFinance(platform,salesPreview),offers=serviceOffers(platform,page,salesPreview);
 const colors=accentTokens(s.color),digits=String(s.phone||'').replace(/\D/g,'');
 const call=digits?'tel:+'+(digits.length===10?'1':'')+digits:'';
 const button='<a class="tp-button" href="#contact">Get my roof repair plan <span aria-hidden="true">↗</span></a>';
 const callButton=call?'<a class="tp-button tp-button--outline" href="'+call+'">Call '+e(s.phone)+'</a>':'';
 const headline=page.headline || (page.serviceName.toLowerCase()==='roof repair'&&page.title.toLowerCase()==='roof repair'?"Roof repair. A clear plan for a dry home.":page.title);
 const questions=(page.questions||[]).filter(q=>!q.requires||q.requires==='none'||(q.requires==='financing'?!!serviceFinance(platform,salesPreview):serviceOffers(platform,page,salesPreview).length>0));
 const nav=faqLink(s,base,preview)+'<a href="#how-it-works">Our process</a><a href="#questions">FAQs</a><a href="#contact">Contact ↗</a>';
 const trust=[];
 if(profile.confirmed){
  if(profile.rating&&profile.ratingSource)trust.push('<a href="'+e(profile.ratingSource)+'" target="_blank" rel="noopener"><strong>★ '+e(profile.rating)+' / 5</strong><small>View rating source</small></a>');
  if(profile.years)trust.push('<div><strong><span data-count="'+e(profile.years)+'" data-count-suffix=" years">'+e(profile.years)+' years</span></strong><small>In business</small></div>');
  if(s.license&&platform.footer.visible.license)trust.push('<div><strong>Licensed'+(platform.footer.insured&&platform.footer.visible.insured?' & insured':'')+'</strong><small>License '+e(s.license)+'</small></div>');
  else if(platform.footer.insured&&platform.footer.visible.insured)trust.push('<div><strong>Insured</strong></div>');
  if(profile.warranty)trust.push('<div><strong>Warranty</strong><small>'+e(profile.warranty)+'</small></div>');
 }
 const signs=[['shingles','Shingles out of shape','Cracked, curled or missing shingles.'],['stain','A stain that keeps growing','Water marks on ceilings or walls.'],['flashing','Gaps around the edges','Loose flashing near vents or chimneys.'],['gutter','Grit in your gutters','Granules collecting after the rain.']];
 const defaults=['Tell us what you’ve noticed and where the work is needed.','Discuss the roof condition and the inspection needed.','Review the proposed scope, materials and price.','Agree the work and timing, then review the completed repair.'];
 const labels=['Start with the problem','Understand the cause','Make a clear plan','Repair. Review.'];
 const steps=Array.from({length:4},(_,i)=>page.process?.[i]||defaults[i]);
 const before=page.media?.bannerOne,after=page.media?.bannerTwo;
 const uploaded=before&&after&&known.has(before.photoId)&&known.has(after.photoId);
 const beforeSrc=uploaded?'/media/'+before.photoId:'/assets/premium-roofing/before.png',afterSrc=uploaded?'/media/'+after.photoId:'/assets/premium-roofing/after.png';
 const reviews=s.reviews?.confirmed&&(s.reviews.googleUrl||s.reviews.yelpUrl)?reviewSection(s,slug,preview).replace('data-review-slug=', 'data-hide-empty-reviews="true" data-review-slug='):'';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(page.seoTitle||headline)} | ${e(s.name)}</title><meta name="description" content="${e(page.seoDescription||page.intro)}"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/trade-page.css?v=004D2"><link rel="stylesheet" href="/trade-motion.css?v=004F"><script defer src="/trade-motion.js?v=004F"></script><script defer src="/site.js"></script><script defer src="/trade-page.js?v=004D2"></script><script defer src="/finance-comparison.js?v=004D2"></script></head><body class="trade-page" style="--tp-accent:${colors.accent};--tp-accent-ink:${colors.ink}"><a class="tp-skip" href="#contact">Skip to service request</a>
 <header class="tp-header"><div class="tp-shell tp-header-inner"><a class="tp-brand" href="${e(home)}">${websiteBrand({...s,logoId:known.has(s.logoId)?s.logoId:null})}</a><nav aria-label="Main navigation">${nav}</nav><details class="tp-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${nav}</nav></details></div></header>
 ${salesPreview?'<div class="tp-sales-notice">SALES PREVIEW · Sample — replaced with your info · No requests are sent</div>':preview?'<div class="tp-preview">Private draft preview · Requests are disabled</div>':''}
 <main>${motionHero({headline,intro:page.intro||'Tell us what you’ve noticed. Discuss the cause, repair options and scope before deciding what happens next.',eyebrow:s.area+' · '+page.serviceName,breadcrumb:'<nav class="tp-breadcrumbs" aria-label="Breadcrumb"><a href="'+e(home)+'">Home</a> / <a href="'+e(home)+'#services">Services</a> / '+e(page.serviceName)+'</nav>',actions:button+callButton})}
 ${promoBanner(offers,salesPreview)}
 ${salesPreview?sampleTrust():trust.length?'<aside class="tp-trust" aria-label="Contractor-confirmed credentials"><div class="tp-shell">'+trust.join('')+'</div></aside>':''}
 <section class="tp-section" id="signs"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">01 / READ THE SIGNS</p><h2>Small signs.<br>Worth a closer look.</h2></div><p>You don’t need to climb onto your roof. Start with what you can see safely.</p></div><div class="tp-signs">${signs.map(([image,title,copy],i)=>'<article class="tp-sign" data-reveal><figure>'+warningArt(image)+'<span>0'+(i+1)+'</span></figure><h3>'+title+'</h3><p>'+copy+'</p></article>').join('')}</div></div></section>
 ${anatomySection()}
 <section class="tp-section tp-included"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">WHAT’S INCLUDED</p><h2>Know the concern.<br>Understand the repair.</h2></div><p>A clear scope helps you decide with confidence.</p></div><div class="tp-inclusions">${[['search','Find the starting point',page.scope||'Describe where the leak appears and when it started.'],['roof','Choose the right repair',(page.materials||[]).join(' ')||'Discuss repair options that fit the roof and its condition.'],['plan','Know what you’re agreeing to','Confirm the scope, materials, price and timing before work begins.']].map(([ico,title,copy])=>'<article>'+serviceIcon(ico)+'<h3>'+e(title)+'</h3><ul>'+String(copy).split(/(?<=[.!?])\s+/).filter(Boolean).map(line=>'<li>'+e(line)+'</li>').join('')+'</ul></article>').join('')}</div></div></section>
 <section class="tp-section tp-process" id="how-it-works"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">02 / HOW IT WORKS</p><h2>Less guesswork.<br>A clearer way forward.</h2></div><p>From your first question to the agreed repair, know what comes next.</p></div><ol class="tp-timeline">${steps.map((step,i)=>'<li data-reveal><div class="tp-step-top">'+serviceIcon(['chat','search','plan','shield'][i])+'<b>0'+(i+1)+'</b></div><h3>'+labels[i]+'</h3><p>'+e(step)+'</p><span class="tm-time-chip">'+tradeMotion.roofing.processChips[i]+'</span></li>').join('')}</ol></div></section>
 ${financeSection(finance,salesPreview,page)}
 <section class="tp-section" style="padding-top:0"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">04 / A CLOSER LOOK</p><h2>The difference is<br>in the details.</h2></div><p>${uploaded?'Compare the contractor-supplied before and after photographs.':'Explore a generated example of damaged and repaired shingles.'}</p></div><div class="tp-compare" data-comparison><img src="${e(afterSrc)}" alt="${e(uploaded?after.alt:'AI-generated repaired roof example')}" width="1600" height="900" loading="lazy"><img class="tp-before" src="${e(beforeSrc)}" alt="${e(uploaded?before.alt:'AI-generated damaged roof example')}" width="1600" height="900" loading="lazy"><span class="tp-image-label tp-image-label--before">Before</span><span class="tp-image-label tp-image-label--after">After</span><span class="tp-compare-line"></span><input type="range" min="0" max="100" value="50" aria-label="Compare before and after roof images"></div><div class="tp-caption"><p>${uploaded?'Contractor-supplied comparison photographs.':'AI-generated repair example · not a completed customer project.'}</p><p>Drag to compare · arrow keys also work</p></div></div></section>
 ${salesPreview?sampleServiceReviews():reviews?'<section class="tp-section tp-reviews" data-service-reviews hidden><div class="tp-shell"><p class="tp-eyebrow">CUSTOMER PERSPECTIVES</p><h2>Good work.<br>In their words.</h2>'+reviews+'</div></section>':''}
 ${promoSection(offers,{slug,serviceName:page.serviceName,preview,salesPreview})}
 <section class="tp-section" id="questions"><div class="tp-shell tp-faq"><div><p class="tp-eyebrow">06 / BEFORE YOU DECIDE</p><h2>A few good<br>questions.</h2><p>Get comfortable with the next step.</p></div><div>${questions.length?questions.map(q=>'<details><summary>'+e(q.question)+'</summary><p>'+e(q.answer)+'</p></details>').join(''):'<p>Have a question about your roof? Include it in your request below.</p>'}</div></div></section>
 <section class="tp-section tp-contact" id="contact"><div class="tp-shell tp-contact-grid"><div class="tp-contact-intro"><p class="tp-eyebrow">LET’S TALK ABOUT YOUR ROOF</p><h2>One small step.<br>A clearer plan.</h2><p>Tell us about your ${e(page.serviceName.toLowerCase())} project. The business reviews your request and confirms scope, pricing and availability separately.</p>${finance?'<p class="tp-finance-note">Payment planning available — ask about financing with this same request.</p>':''}${call?'<a href="'+call+'">Call '+e(s.phone)+' ↗</a>':''}</div>
 <form class="tp-form" id="lead-form" data-slug="${e(slug)}" data-project="" data-preview="${preview}">${salesPreview?sampleBadge:''}<label class="tp-wide">Requested service<input name="service" value="${e(page.serviceName)}" readonly></label><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>Project city<input name="projectCity" autocomplete="address-level2" required maxlength="100"></label><label>Preferred timing<select name="timeframe"><option value="">Let’s discuss</option><option>As soon as possible</option><option>Within a month</option><option>Planning ahead</option></select></label>${finance?'<label class="tp-consent"><input name="financingInterest" type="checkbox">I’m interested in financing</label><p class="tp-wide tp-plan-summary" data-plan-summary hidden></p><input type="hidden" data-plan-field name="financingPlan"><input type="hidden" data-plan-field name="financingPlanId"><input type="hidden" data-plan-field name="financingMonthly"><input type="hidden" data-plan-field name="financingAmount"><input type="hidden" data-plan-field name="financingDown"><input type="hidden" data-plan-field name="financingTerms">':''}${offers.length?'<label class="tp-wide">Unlocked offer<input name="promotionCode" readonly placeholder="Unlock an offer above"></label>':''}<label class="tp-wide">Project notes<textarea name="message" rows="4" maxlength="1800"></textarea></label><label class="tp-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="tp-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><a href="${e(base)}/legal/privacy${suffix}">Privacy policy</a><button class="tp-button" type="submit" ${preview ? 'disabled' : ''}>${preview ? 'Preview — submission disabled' : 'Get my roof repair plan ↗'}</button><p id="lead-status" role="status">${preview ? 'Preview only — no request will be sent.' : ''}</p></form>
 </div></section><section class="tp-final"><div class="tp-shell"><p class="tp-eyebrow">YOUR HOME DESERVES A CLEAR NEXT STEP</p><h2>Your next rainstorm.<br>A better-prepared home.</h2><div class="tp-actions">${button.replace('Get my roof repair plan','Start my dry-home plan')}${callButton}</div><p>Start with a conversation about the repair your roof needs.</p></div></section></main>${websiteFooter(s,base,preview)}</body></html>`;
}

// Both visible answers and structured data use this same feature-filtered list.
export function renderFAQPage(s,page,{slug,preview=false,photos=[]}) {
 const base='/s/'+slug,suffix=preview?'?preview=1':'',home=base+suffix;
 const platform=normalizePlatform(s.platform),colors=accentTokens(s.color);
 const questions=(page.questions||[]).filter(q=>!q.requires||q.requires==='none'||platform[q.requires]?.enabled);
 const groups=new Map();
 for(const q of questions){const category=q.category||'Roofing questions';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(q);}
 const services=visibleServicePages(s),known=new Set(photos.map(p=>p.id));
 const nav='<a href="'+e(home)+'#services">Services</a><a href="'+e(base)+'/faq'+suffix+'" aria-current="page">Roofing FAQ</a><a href="'+e(home)+'#contact">Contact ↗</a>';
 const action='<a class="tp-button" href="'+e(home)+'#contact">Get my roofing plan ↗</a>';
 const schema=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:questions.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))}).replace(/</g,'\\u003c');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(page.seoTitle||page.title)} | ${e(s.name)}</title><meta name="description" content="${e(page.seoDescription||page.intro)}"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/trade-page.css?v=006"><script defer src="/trade-page.js?v=004D2"></script><script type="application/ld+json">${schema}</script></head><body class="trade-page tp-faq-page" style="--tp-accent:${colors.accent};--tp-accent-ink:${colors.ink}"><a class="tp-skip" href="#answers">Skip to roofing answers</a>
 <header class="tp-header"><div class="tp-shell tp-header-inner"><a class="tp-brand" href="${e(home)}">${websiteBrand({...s,logoId:known.has(s.logoId)?s.logoId:null})}</a><nav aria-label="Main navigation">${nav}</nav><details class="tp-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${nav}</nav></details></div></header>
 ${preview?'<div class="tp-preview">Private draft preview · Requests are disabled</div>':''}
 <main><section class="tp-hero"><img src="/assets/trade-motion/roofing-house-still.webp" alt="" width="1920" height="1080"><div class="tp-shell tp-hero-copy"><p class="tp-eyebrow">ROOFING / BEFORE YOU DECIDE</p><h1>${e(page.title)}</h1><p class="tp-intro">${e(page.intro||'Understand your roof, compare your next steps and bring your questions to the conversation.')}</p><div class="tp-actions">${action}<a class="tp-button tp-button--outline" href="#answers">Explore the answers ↓</a></div></div></section>
 <div id="answers">${groups.size?[...groups].map(([category,items],i)=>'<section class="tp-section tp-faq-group" aria-labelledby="faq-group-'+i+'"><div class="tp-shell tp-faq"><div><p class="tp-eyebrow">YOUR QUESTIONS, EXPLAINED</p><h2 id="faq-group-'+i+'">'+e(category)+'</h2><p><a href="'+e(home)+'#contact">Talk through your roof concern ↗</a></p></div><div>'+items.map(q=>'<details id="question-'+e(q.id)+'"><summary>'+e(q.question)+'</summary><p>'+e(q.answer)+'</p></details>').join('')+'</div></div></section>').join(''):'<section class="tp-section"><div class="tp-shell"><h2>What would you like to know?</h2><p>Bring your roofing question to the conversation.</p>'+action+'</div></section>'}</div>
 ${services.length||platform.financing.enabled||platform.promotions.enabled?'<section class="tp-section tp-faq-next"><div class="tp-shell"><p class="tp-eyebrow">TAKE A CLOSER LOOK</p><h2>Explore your next step.</h2><nav class="tp-actions" aria-label="Related roofing pages">'+services.map(p=>'<a href="'+e(base)+'/services/'+e(p.slug)+suffix+'">'+e(p.title)+' ↗</a>').join('')+(platform.financing.enabled?'<a href="'+e(base)+'/financing'+suffix+'">Financing ↗</a>':'')+(platform.promotions.enabled?'<a href="'+e(base)+'/promotions'+suffix+'">Promotions ↗</a>':'')+'</nav></div></section>':''}
 <section class="tp-final"><div class="tp-shell"><p class="tp-eyebrow">LET’S TALK ABOUT YOUR ROOF</p><h2>Turn your questions<br>into a clearer plan.</h2><p>Share what you’ve noticed and discuss the scope, price and timing for your home.</p><div class="tp-actions">${action}</div></div></section></main>${websiteFooter(s,base,preview)}</body></html>`;
}
