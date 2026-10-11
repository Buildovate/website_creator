import {displayPhone} from './display-format.js';
import {e} from './core.js';
import {renderTrustStrip,trustAssets} from './trust.js';
import {normalizePlatform} from './platform/constitution.ts';
import {publicLegalSettings} from './platform/legal-policy.ts';
import {serviceFinance,serviceOffers,financeSection,promoSection} from './service-conversion.js';
import {reviewSection} from './reviews.js';
import {kits} from './design-kits.js';
import {visibleServicePages, primaryCity} from './service-registry.js';
import {serviceBrief, serviceLayoutVariant, personalizeServiceFaq} from './service-content.js';
import {websiteHeader, websiteBrand} from './site-polish.js';
import media from '../public/service-media.json' with {type:'json'};
import art from '../public/service-art.json' with {type: 'json'};
import {serviceDiagram,visualLabels,signature,optionsCards,beforeAfter} from './service-showpiece.js';

const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');
const roofingArt = {
  'asphalt shingle install / repair': '/assets/service-shingles.webp',
  'roof sealing': '/assets/service-maintenance.webp',
  'storm damage': '/assets/service-repair.webp',
  inspections: '/assets/service-inspection.webp',
};
const lower = value => String(value || '').toLowerCase();
const regionFor = (s, city) => {
  const area = String(s.area || '').trim();
  if (!area || lower(area) === lower(city)) return city;
  return lower(area).includes(lower(city)) ? area : `${city} and ${area}`;
};
const sentence = value => String(value || '').replace(/[.!?]+$/, '');

export function renderUniversalServicePage(s, page, {slug, preview = false, salesPreview = false, photos = [], projects = [], origin = ''}) {
  s=publicLegalSettings(s);
  const platform=normalizePlatform(s.platform),profile=s.serviceProfile||{};
  const finance=serviceFinance(platform,false),offers=serviceOffers(platform,page,false);
  const base = `/s/${slug}`, suffix = preview ? '?preview=1' : '';
  const canonical = `${origin}${base}/services/${page.slug}`;
  const city = primaryCity(s) || 'your area', region = regionFor(s, city);
  const brief = serviceBrief(s.trade, page.serviceName);
  const title = page.seoTitle || `${page.serviceName} in ${city} | ${s.name}`;
  const description = page.seoDescription || `${page.serviceName} in ${city} from ${s.name}. ${brief?.card || 'Explore the work and request an estimate.'}`;
  const selected = (s.services || []).find(item => lower(item.name) === lower(page.serviceName));
  const authored = !String(page.id||'service-').startsWith('service-');
  const card = (authored && page.intro) || brief?.card || page.intro || selected?.description || `Talk with ${s.name} about ${lower(page.serviceName)} for your property.`;
  const headline = (authored && (page.headline || (page.title!==page.serviceName?page.title:null))) || brief?.headline || page.headline || `${page.serviceName}: made for your home`;
  const includes = (authored && page.materials?.length ? page.materials : null) || brief?.includes || (page.materials?.length ? page.materials.slice(0, 3) : [`A look at your ${lower(page.serviceName)} needs`, 'A clear scope of work', 'A plan for the next step']);
  const signs = brief?.signs || [`You are considering ${lower(page.serviceName)}`, `Your current ${lower(page.serviceName)} needs attention`, 'You want to understand the options'];
  const process = (authored && page.process?.length ? page.process : null) || brief?.process || page.process?.slice(0, 4) || ['Discuss the property and your priorities', 'Review the area that needs work', 'Agree on the scope and materials', 'Complete and review the work'];
  const authoredFaq=(page.questions||[]).filter(item=>!item.requires||item.requires==='none'||(item.requires==='financing'?!!finance:offers.length>0));
  const faq=authored&&page.questions?.length?authoredFaq:brief?personalizeServiceFaq(brief,{city,region,business:s.name}):authoredFaq;
  const known = new Set(photos.map(photo => photo.id));
  const owned = [page.media?.hero, ...(page.media?.bannerOne&&page.media?.bannerTwo?[page.media.bannerOne,page.media.bannerTwo]:[])]
    .find(item => item?.photoId && known.has(item.photoId));
  const image = owned
    ? {src: `/media/${owned.photoId}`, alt: owned.alt || `${page.serviceName} work by ${s.name}`, uploaded: true}
    : {src: art[s.trade]?.[lower(page.serviceName)] || '', alt: `${page.serviceName} design image`, uploaded: false};
  const related = visibleServicePages(s).filter(item => item.slug !== page.slug).slice(0, 3);
  const work = projects
    .map(row => {
      try { return {id: row.id, data: JSON.parse(row.published)}; } catch { return null; }
    })
    .filter(row => row && !row.data.demo && !row.data.isSample
      && !/\b(?:qa example|test-only|sample|demo|concept project|illustrative)\b/i.test(
        [row.data.title, row.data.problem, row.data.work, row.data.outcome].join(' '))
      && lower(row.data.service) === lower(page.serviceName)
      && known.has(row.data.coverId || row.data.afterId))
    .slice(0, 3);
  const phone = String(s.phone || '').replace(/\D/g, '');
  const variant = serviceLayoutVariant(s.generationId || slug);
  const schema = [
    {'@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${origin}${base}#business`, name: s.name, telephone: s.phone || undefined, address: s.address || undefined, areaServed: city, url: `${origin}${base}`},
    {'@context': 'https://schema.org', '@type': 'Service', name: page.serviceName, serviceType: page.serviceName, description, areaServed: city, provider: {'@id': `${origin}${base}#business`}, url: canonical},
  ];
  const labels=visualLabels(s.trade,includes);
  const sectionMedia=media[s.trade]?.[lower(page.serviceName)]||{};
  const imageFigure=(className,caption)=>{const hero=className==='sd-hero-art',src=hero?image.src:sectionMedia[className==='sd-detail-art'?'scope':'process'];return `<figure class="${className}">${src?`<img src="${e(src)}" alt="${e(hero?image.alt:page.serviceName+' '+(className==='sd-detail-art'?'materials and details':'work in progress'))}" width="1536" height="1024" ${hero?'fetchpriority="high"':'loading="lazy"'}>`:serviceDiagram(s.trade,page.serviceName,className,labels)}${preview?'<span class="sd-sample-tag">Sample</span>':''}</figure>`};
  const call=phone?`tel:+${phone.length===10?'1':''}${phone}`:'';

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${preview ? 'noindex,nofollow' : 'index,follow'}"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${e(canonical)}"><script type="application/ld+json">${safeJson(preview?[]:schema)}</script><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/service-detail.css">${trustAssets}<script defer src="/finance-comparison.js"></script><script defer src="/trade-page.js"></script><script defer src="/site.js"></script><script defer src="/service-showpiece.js"></script></head>
  <body class="service-detail sd-${e(s.template || 'craft')} sd-font-${e(s.design?.font || 'display')} sd-cards-${e(s.design?.cards || 'classic')}" data-layout-variant="${variant}" style="--accent:${e(s.color || '#c78353')}" data-trade="${e(s.trade)}">
  <a class="sd-skip" href="#request">Skip to estimate request</a>${websiteHeader(s, {base, preview, project: true, portfolio: s.showProjects !== false, currentService: page.slug})}
  ${preview ? `<p class="sd-preview">${salesPreview ? 'SALES PREVIEW' : 'Private draft preview'} · Requests are disabled</p>` : ''}
  <main>
    <section class="sd-hero">
      <div class="sd-hero-copy"><p class="sd-kicker">${e(s.trade)} / ${e(city)}</p><nav class="sd-breadcrumb" aria-label="Breadcrumb"><a href="${e(base + suffix)}">Home</a><span aria-hidden="true">/</span><a href="${e(base + suffix)}#services">Services</a><span aria-hidden="true">/</span><span>${e(page.serviceName)}</span></nav><h1>${e(headline)}</h1><p class="sd-hero-line">${e(card)} ${e(s.name)} handles ${e(lower(page.serviceName))} in ${e(region)}.</p><div class="sd-hero-actions"><a class="sd-button" href="#request" data-estimator-service="${e(page.serviceName)}">Get my price</a>${call?`<a class="sd-call-button" href="${call}">Call now</a>`:''}</div></div>
      ${imageFigure('sd-hero-art', image.uploaded ? `${s.name} photograph` : `${page.serviceName} / ${s.trade}`)}
    </section>
    ${renderTrustStrip(s,{placement:'service-hero'})}
    ${profile.confirmed?`<aside class="sd-confirmed-facts" aria-label="Contractor-confirmed credentials">${profile.years?`<span>${e(profile.years)} years in business</span>`:''}${profile.rating&&profile.ratingSource?`<a href="${e(profile.ratingSource)}">${e(profile.rating)} / 5 · View rating source</a>`:''}${s.license&&platform.footer.visible.license?`<span>Licensed${platform.footer.insured&&platform.footer.visible.insured?' &amp; insured':''} · License ${e(s.license)}</span>`:platform.footer.insured&&platform.footer.visible.insured?'<span>Insured</span>':''}${profile.warranty?`<span>${e(profile.warranty)}</span>`:''}</aside>`:''}
    <section class="sd-story-layout sd-includes" id="includes">
      ${imageFigure('sd-detail-art', `01 / ${page.serviceName}`)}
      <div class="sd-editorial-copy"><p class="sd-kicker">01 / WHAT IS INCLUDED</p><h2>${e(page.serviceName)}: what we look at.</h2><p class="sd-intro">${e(page.scope||includes[0]+' is one part of a sound '+lower(page.serviceName)+' plan.')}</p><div class="sd-list">${includes.map((item, index) => `<article><span>0${index + 1}</span><h3>${e(item)}</h3></article>`).join('')}</div></div>
    </section>
    <section class="sd-signs" id="signs"><div class="sd-signs-intro"><p class="sd-kicker">02 / WHEN TO REACH OUT</p><h2>When ${e(lower(page.serviceName))} makes sense.</h2><p>${e(signs[0])}? Let’s look at the cause.</p></div><div class="sd-sign-list">${serviceDiagram(s.trade,page.serviceName,'diagnosis',labels)}${signs.map((item, index) => `<article><b>0${index + 1}</b><h3>${e(item)}</h3></article>`).join('')}</div></section>
    ${signature(s,page,signs,includes)}
    <aside class="sd-estimator-band"><div><p class="sd-kicker">PLAN THE NEXT STEP</p><h2>What will your ${e(lower(page.serviceName))} involve?</h2><p>Tell us about your ${e(lower(page.serviceName))} project and we’ll discuss the scope and price.</p></div><a class="sd-button" href="#request" data-estimator-service="${e(page.serviceName)}">Get my price</a></aside>
    <section class="sd-story-layout sd-process" id="process"><div class="sd-editorial-copy"><p class="sd-kicker">03 / HOW THE WORK MOVES</p><h2>How we approach ${e(lower(page.serviceName))}.</h2><ol class="sd-steps">${process.map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><p>${e(sentence(step))}</p></li>`).join('')}</ol></div>${imageFigure('sd-process-art', `03 / ${page.serviceName}`, true)}</section>
    ${finance?financeSection({...finance,amount:(s.priceBook?.items||[]).find(x=>x.approved&&x.enabled!==false&&lower(x.service)===lower(page.serviceName))?.priceCents/100||null,downPayment:0},false,{...page,typicalPriceRange:null}).replaceAll('href="#contact"','href="#request"').replace(/<div class="tp-plan-disclosure">[\s\S]*?<\/div>/,'').replaceAll('↗',''):''}
    ${offers.length?promoSection(offers,{slug,serviceName:page.serviceName,preview,salesPreview:false}).replaceAll('href="#contact"','href="#request"').replace(/<details><summary>Eligibility & terms<\/summary>[\s\S]*?<\/details>/g,`<a href="${base}/legal${suffix}">Offer details</a>`).replaceAll('↗',''):''}
    ${s.reviews?.confirmed&&(s.reviews.googleUrl||s.reviews.yelpUrl)?`<section class="sd-section" data-service-reviews hidden>${reviewSection(s,slug,preview).replace('data-review-slug=','data-hide-empty-reviews="true" data-review-slug=')}</section>`:''}
    ${beforeAfter(s,page,preview,known)}
    ${work.length ? `<section class="sd-section sd-work-section" id="work"><p class="sd-kicker">REAL PROJECTS / ${e(page.serviceName)}</p><h2>Recent ${e(lower(page.serviceName))} work.</h2><div class="sd-work">${work.map(({id, data}) => `<a href="${e(base)}/projects/${e(id)}${suffix}"><img src="/media/${e(data.coverId || data.afterId)}" alt="${e(data.title)}" loading="lazy" width="600" height="450"><div><h3>${e(data.title)}</h3><p>${e(data.city)} · ${e(data.service)}</p><span>View project</span></div></a>`).join('')}</div></section>` : ''}
    ${preview?`<section class="sd-section sd-preview-support"><p class="sd-kicker"><span class="sd-sample-tag">Sample</span> / PROJECT PLANNING</p><h2>Plan your ${e(lower(page.serviceName))} conversation.</h2><div class="sd-options-grid"><article>${serviceDiagram(s.trade,page.serviceName,'preview-project',labels)}<h3>Sample project scope</h3><p>${e(includes.join('; '))}.</p></article><article>${serviceDiagram(s.trade,page.serviceName,'package-1',labels)}<h3>Payment planning</h3><p>Compare APR, term and total interest for the ${e(lower(page.serviceName))} amount you enter.</p><a href="${base}/financing?preview=1">Explore the sample payment</a></article><article><div class="sd-feedback-art" aria-hidden="true"><span>Scope</span><span>Communication</span><span>Cleanup</span></div><h3>Customer feedback format</h3><p>A ${e(lower(page.serviceName))} review can describe these parts of the experience. This sample contains no customer quote or rating.</p><a href="${base}/reviews?preview=1">See review layout</a></article></div></section>`:''}
    ${optionsCards(s,page,includes)}
    ${faq.length ? `<section class="sd-section sd-questions" id="questions"><div><p class="sd-kicker">04 / GOOD QUESTIONS</p><h2>Your ${e(lower(page.serviceName))} questions.</h2>${serviceDiagram(s.trade,page.serviceName,'detail',labels)}</div><div class="sd-faq">${faq.map(item => `<details><summary>${e(item.question)}</summary><p>${e(item.answer)}</p></details>`).join('')}</div></section>` : ''}
    ${related.length ? `<section class="sd-section sd-related-section" id="related"><p class="sd-kicker">MORE OF WHAT WE DO</p><h2>Other ${e(s.trade.toLowerCase())} work for your home.</h2><div class="sd-related">${related.map(item => `<a href="${e(base)}/services/${e(item.slug)}${suffix}">${art[s.trade]?.[lower(item.serviceName)]?`<img src="${e(art[s.trade][lower(item.serviceName)])}" alt="${e(item.serviceName)}" width="600" height="400" loading="lazy">`:serviceDiagram(s.trade,item.serviceName,'related',labels)}<span>${e(item.serviceName)}</span></a>`).join('')}</div></section>` : ''}
    <section class="sd-section sd-request" id="request"><div><p class="sd-kicker">YOUR NEXT STEP</p><h2>Let’s start your ${e(lower(page.serviceName))} estimate.</h2><p>Tell ${e(s.name)} about your ${e(lower(page.serviceName))} project.</p>${call ? `<a href="${call}">Call ${e(displayPhone(s.phone))}</a>` : ''}</div><form id="lead-form" data-slug="${e(slug)}" data-project="" data-preview="${preview || salesPreview}"><div class="sd-estimator-progress"><span>01 / PROJECT DETAILS</span><strong>${e(page.serviceName)} selected</strong><progress value="1" max="3" aria-label="Estimate request, step 1 of 3"></progress><ol><li aria-current="step">Your project</li><li>Scope review</li><li>Written price</li></ol><p>Next: the team reviews your ${e(lower(page.serviceName))} needs with you.</p></div><label>Requested service<input name="service" value="${e(page.serviceName)}" readonly></label><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>Project city<input name="projectCity" autocomplete="address-level2" maxlength="100"></label>${finance?'<label class="sd-consent"><input name="financingInterest" type="checkbox">I’m interested in financing</label><p data-plan-summary hidden></p><input type="hidden" data-plan-field name="financingPlan"><input type="hidden" data-plan-field name="financingPlanId"><input type="hidden" data-plan-field name="financingMonthly"><input type="hidden" data-plan-field name="financingAmount"><input type="hidden" data-plan-field name="financingDown"><input type="hidden" data-plan-field name="financingTerms">':''}${offers.length?'<label>Unlocked offer<input name="promotionCode" readonly></label>':''}<label>Project details<textarea name="message" rows="4" maxlength="1800"></textarea></label><label class="sd-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><label class="sd-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><button class="sd-button" ${preview || salesPreview ? 'disabled' : ''}>${preview || salesPreview ? 'Preview — submission disabled' : 'Next: request a scope review'}</button><p id="lead-status" role="status"></p></form></section>
  </main><div class="sd-phone-bar">${call?`<a href="${call}">Call now</a>`:''}<a href="#request" data-estimator-service="${e(page.serviceName)}">Get my price</a></div><footer class="sd-footer"><a href="${e(base + suffix)}">${websiteBrand(s)}</a><nav aria-label="Footer"><a href="${e(base + suffix)}#services">Services</a><a href="${e(base)}/legal${suffix}">Legal</a><a href="${e(base + suffix)}#contact">Contact</a></nav></footer></body></html>`.replaceAll('↗','');
}
