import {e, one, all, must, access} from './core.js';
import {normalizePlatform} from './platform/constitution.ts';
import {websiteBrand, websiteFooter} from './site-polish.js';
import {reviewSection} from './reviews.js';

export function visibleServicePages(s) {
  return (s.websitePages?.pages || []).filter(p => p.kind === 'service' && p.enabled && (s.services || []).some(service => service.name === p.serviceName));
}
// Only rendered service slots grant public media access; thumbnail/other page
// kinds remain private until their own renderers are implemented.
export function publicServicePhoto(s, photo) {
  return s.trade === 'Roofing' && visibleServicePages(s).some(p => p.media?.bannerOne && p.media?.bannerTwo &&
    ['bannerOne', 'bannerTwo'].some(slot => p.media?.[slot]?.photoId === photo.id));
}
export async function websitePage(req, env, url) {
  const match = url.pathname.match(/^\/s\/([^/]+)\/services\/([a-z][a-z0-9-]*)\/?$/);
  if (!match) return null;
  must(req.method === 'GET', 'Method not allowed.', 405);
  const tenant = await one(env, 'SELECT * FROM tenants WHERE slug=?', match[1]);
  must(tenant, 'Website not found.', 404);
  const preview = url.searchParams.get('preview') === '1';
  if (preview) await access(req, env, tenant.id);
  else must(tenant.status === 'published' && tenant.published, 'Website not published.', 404);
  const s = JSON.parse(preview ? tenant.settings : tenant.published);
  const page = visibleServicePages(s).find(p => p.slug === match[2]);
  must(s.trade === 'Roofing' && page, 'Service not available.', 404);
  const photos = await all(env, 'SELECT id FROM photos WHERE tenant_id=?', tenant.id);
  return renderServicePage(s, page, {slug: tenant.slug, preview, photos});
}
export function accentTokens(color) {
 const hex=/^#[a-f0-9]{6}$/i.test(color||'')?color:'#b8dc65';
 const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const luminance=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
 return {accent:hex,ink:luminance>.179?'#000000':'#ffffff'};
}
export function renderServicePage(s, page, {slug, preview = false, photos = []}) {
 const base='/s/'+slug,suffix=preview?'?preview=1':'',home=base+suffix;
 const known=new Set(photos.map(p=>p.id)),platform=normalizePlatform(s.platform),profile=s.serviceProfile||{};
 const colors=accentTokens(s.color),digits=String(s.phone||'').replace(/\D/g,'');
 const call=digits?'tel:+'+(digits.length===10?'1':'')+digits:'';
 const button='<a class="tp-button" href="#contact">Request this service <span aria-hidden="true">↗</span></a>';
 const callButton=call?'<a class="tp-button tp-button--outline" href="'+call+'">Call '+e(s.phone)+'</a>':'';
 const headline=page.headline || (page.serviceName.toLowerCase()==='roof repair'&&page.title.toLowerCase()==='roof repair'?"Roof leak? Let's get it fixed.":page.title);
 const questions=(page.questions||[]).filter(q=>!q.requires||q.requires==='none'||platform[q.requires]?.enabled);
 const nav='<a href="'+e(home)+'#services">Services</a><a href="#how-it-works">Our process</a><a href="#questions">FAQs</a><a href="#contact">Contact ↗</a>';
 const trust=[];
 if(profile.confirmed){
  if(profile.rating&&profile.ratingSource)trust.push('<a href="'+e(profile.ratingSource)+'" target="_blank" rel="noopener"><strong>★ '+e(profile.rating)+' / 5</strong><small>View rating source</small></a>');
  if(profile.years)trust.push('<div><strong>'+e(profile.years)+' years</strong><small>In business</small></div>');
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
 const reviews=s.reviews?.confirmed&&(s.reviews.googleUrl||s.reviews.yelpUrl)?reviewSection(s,slug,preview):'<p>Customer feedback belongs here. Reviews will appear when a verified review source is connected.</p>';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(page.seoTitle||headline)} | ${e(s.name)}</title><meta name="description" content="${e(page.seoDescription||page.intro)}"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/trade-page.css"><script defer src="/site.js"></script><script defer src="/trade-page.js"></script></head><body class="trade-page" style="--tp-accent:${colors.accent};--tp-accent-ink:${colors.ink}"><a class="tp-skip" href="#contact">Skip to service request</a>
 <header class="tp-header"><div class="tp-shell tp-header-inner"><a class="tp-brand" href="${e(home)}">${websiteBrand({...s,logoId:known.has(s.logoId)?s.logoId:null})}</a><nav aria-label="Main navigation">${nav}</nav><details class="tp-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${nav}</nav></details></div></header>
 ${preview?'<div class="tp-preview">Private draft preview · Requests are disabled</div>':''}
 <main><section class="tp-hero"><img src="/assets/premium-roofing/hero.png" alt="" width="1920" height="1080" fetchpriority="high"><div class="tp-shell tp-hero-copy"><nav class="tp-breadcrumbs" aria-label="Breadcrumb"><a href="${e(home)}">Home</a> / <a href="${e(home)}#services">Services</a> / ${e(page.serviceName)}</nav><p class="tp-eyebrow">${e(s.area)} · ${e(page.serviceName)}</p><h1>${e(headline)}</h1><p class="tp-intro">${e(page.intro||'A clear plan starts with understanding the problem. Tell us what you’ve noticed, and discuss your next step.')}</p><div class="tp-actions">${button}${callButton}</div><div class="tp-hero-foot"><span>Your home. A considered approach.</span><a href="#signs">Know what to look for ↓</a></div></div></section>
 ${trust.length?'<aside class="tp-trust" aria-label="Contractor-confirmed credentials"><div class="tp-shell">'+trust.join('')+'</div></aside>':''}
 <section class="tp-section" id="signs"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">01 / READ THE SIGNS</p><h2>Small signs.<br>Worth a closer look.</h2></div><p>You don’t need to climb onto your roof. Start with what you can see safely.</p></div><div class="tp-signs">${signs.map(([image,title,copy],i)=>'<article class="tp-sign" data-reveal><figure><img src="/assets/premium-roofing/'+image+'.png" alt="'+e(title)+' — generated educational image" width="640" height="480" loading="lazy"><span>0'+(i+1)+'</span></figure><h3>'+title+'</h3><p>'+copy+'</p></article>').join('')}</div></div></section>
 <section class="tp-section tp-process" id="how-it-works"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">02 / HOW IT WORKS</p><h2>Less guesswork.<br>A clearer way forward.</h2></div><p>From your first question to the agreed repair, know what comes next.</p></div><ol class="tp-timeline">${steps.map((step,i)=>'<li data-reveal><b>0'+(i+1)+'</b><h3>'+labels[i]+'</h3><p>'+e(step)+'</p></li>').join('')}</ol></div></section>
 <section class="tp-section"><div class="tp-shell tp-scope"><div><p class="tp-eyebrow">03 / THE RIGHT SCOPE</p><h2>Fix the concern.<br>Understand the work.</h2></div><div><h3>What’s included</h3><p>${e(page.scope)}</p>${page.materials?.length?'<h3>Materials & options</h3><ul>'+page.materials.map(m=>'<li>'+e(m)+'</li>').join('')+'</ul>':''}</div></div></section>
 <section class="tp-section" style="padding-top:0"><div class="tp-shell"><div class="tp-section-heading"><div><p class="tp-eyebrow">04 / A CLOSER LOOK</p><h2>The difference is<br>in the details.</h2></div><p>${uploaded?'Compare the contractor-supplied before and after photographs.':'Explore a generated example of damaged and repaired shingles.'}</p></div><div class="tp-compare" data-comparison><img src="${e(afterSrc)}" alt="${e(uploaded?after.alt:'AI-generated repaired roof example')}" width="1600" height="900" loading="lazy"><img class="tp-before" src="${e(beforeSrc)}" alt="${e(uploaded?before.alt:'AI-generated damaged roof example')}" width="1600" height="900" loading="lazy"><span class="tp-image-label tp-image-label--before">Before</span><span class="tp-image-label tp-image-label--after">After</span><span class="tp-compare-line"></span><input type="range" min="0" max="100" value="50" aria-label="Compare before and after roof images"></div><div class="tp-caption"><p>${uploaded?'Contractor-supplied comparison photographs.':'AI-generated repair example · not a completed customer project.'}</p><p>Drag to compare · arrow keys also work</p></div></div></section>
 <section class="tp-section tp-reviews"><div class="tp-shell"><p class="tp-eyebrow">05 / CUSTOMER PERSPECTIVES</p><h2>Good work.<br>In their words.</h2>${reviews}</div></section>
 <section class="tp-section" id="questions"><div class="tp-shell tp-faq"><div><p class="tp-eyebrow">06 / BEFORE YOU DECIDE</p><h2>A few good<br>questions.</h2><p>Get comfortable with the next step.</p></div><div>${questions.length?questions.map(q=>'<details><summary>'+e(q.question)+'</summary><p>'+e(q.answer)+'</p></details>').join(''):'<p>Have a question about your roof? Include it in your request below.</p>'}</div></div></section>
 <section class="tp-section tp-contact" id="contact"><div class="tp-shell tp-contact-grid"><div class="tp-contact-intro"><p class="tp-eyebrow">LET’S TALK ABOUT YOUR ROOF</p><h2>One small step.<br>A clearer plan.</h2><p>Tell us about your ${e(page.serviceName.toLowerCase())} project. The business reviews your request and confirms scope, pricing and availability separately.</p>${call?'<a href="'+call+'">Call '+e(s.phone)+' ↗</a>':''}</div>
 <form class="tp-form" id="lead-form" data-slug="${e(slug)}" data-project="" data-preview="${preview}"><label class="tp-wide">Requested service<input name="service" value="${e(page.serviceName)}" readonly></label><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>Project city<input name="projectCity" autocomplete="address-level2" required maxlength="100"></label><label>Preferred timing<select name="timeframe"><option value="">Let’s discuss</option><option>As soon as possible</option><option>Within a month</option><option>Planning ahead</option></select></label><label class="tp-wide">Project notes<textarea name="message" rows="4" maxlength="1800"></textarea></label><label class="tp-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="tp-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><a href="${e(base)}/legal/privacy${suffix}">Privacy policy</a><button class="tp-button" type="submit" ${preview ? 'disabled' : ''}>${preview ? 'Preview — submission disabled' : 'Request this service ↗'}</button><p id="lead-status" role="status">${preview ? 'Preview only — no request will be sent.' : ''}</p></form>
 </div></section><section class="tp-final"><div class="tp-shell"><p class="tp-eyebrow">YOUR HOME DESERVES A CLEAR NEXT STEP</p><h2>Let’s get your roof<br>back on track.</h2><div class="tp-actions">${button}${callButton}</div></div></section></main>${websiteFooter(s,base,preview)}</body></html>`;
}
