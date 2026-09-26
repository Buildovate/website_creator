import {e} from './core.js';
import {kits} from './design-kits.js';
import {visibleServicePages, primaryCity} from './service-registry.js';
import {serviceBrief, serviceLayoutVariant, personalizeServiceFaq} from './service-content.js';
import {websiteHeader, websiteBrand} from './site-polish.js';
import art from '../public/service-art.json' with {type: 'json'};

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
  const base = `/s/${slug}`, suffix = preview ? '?preview=1' : '';
  const canonical = `${origin}${base}/services/${page.slug}`;
  const city = primaryCity(s) || 'your area', region = regionFor(s, city);
  const brief = serviceBrief(s.trade, page.serviceName);
  const title = page.seoTitle || `${page.serviceName} in ${city} | ${s.name}`;
  const description = page.seoDescription || `${page.serviceName} in ${city} from ${s.name}. ${brief?.card || 'Explore the work and request an estimate.'}`;
  const selected = (s.services || []).find(item => lower(item.name) === lower(page.serviceName));
  const card = brief?.card || page.intro || selected?.description || `Talk with ${s.name} about ${lower(page.serviceName)} for your property.`;
  const headline = brief?.headline || page.headline || `${page.serviceName}: made for your home`;
  const includes = brief?.includes || (page.materials?.length ? page.materials.slice(0, 3) : [`A look at your ${lower(page.serviceName)} needs`, 'A clear scope of work', 'A plan for the next step']);
  const signs = brief?.signs || [`You are considering ${lower(page.serviceName)}`, `Your current ${lower(page.serviceName)} needs attention`, 'You want to understand the options'];
  const process = brief?.process || page.process?.slice(0, 4) || ['Discuss the property and your priorities', 'Review the area that needs work', 'Agree on the scope and materials', 'Complete and review the work'];
  const faq = brief
    ? personalizeServiceFaq(brief, {city, region, business: s.name})
    : (page.questions?.filter(item => !item.requires || item.requires === 'none' || s.platform?.[item.requires]?.enabled) || []);
  const known = new Set(photos.map(photo => photo.id));
  const owned = [page.media?.hero, page.media?.bannerOne, page.media?.bannerTwo]
    .find(item => item?.photoId && known.has(item.photoId));
  const image = owned
    ? {src: `/media/${owned.photoId}`, alt: owned.alt || `${page.serviceName} work by ${s.name}`, uploaded: true}
    : {src: art[s.trade]?.[lower(page.serviceName)] || roofingArt[lower(page.serviceName)] || Object.values(kits).find(kit => kit.trade === s.trade)?.image || '/assets/finished-roof.jpg', alt: `${page.serviceName} design image`, uploaded: false};
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
  const imageFigure = (className, caption, decorative = false) => `<figure class="${className}"><img src="${e(image.src)}" alt="${decorative ? '' : e(image.alt)}" width="900" height="1125" ${className === 'sd-hero-art' ? 'fetchpriority="high"' : 'loading="lazy"'}><figcaption>${e(caption)}</figcaption></figure>`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${preview ? 'noindex,nofollow' : 'index,follow'}"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${e(canonical)}"><script type="application/ld+json">${safeJson(schema)}</script><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/service-detail.css"><script defer src="/site.js"></script></head>
  <body class="service-detail sd-${e(s.template || 'craft')} sd-font-${e(s.design?.font || 'display')} sd-cards-${e(s.design?.cards || 'classic')}" data-layout-variant="${variant}" style="--accent:${e(s.color || '#c78353')}" data-trade="${e(s.trade)}">
  <a class="sd-skip" href="#request">Skip to estimate request</a>${websiteHeader(s, {base, preview, project: true, portfolio: s.showProjects !== false, currentService: page.slug})}
  ${preview ? `<p class="sd-preview">${salesPreview ? 'Sales preview' : 'Private draft preview'} · Requests are disabled</p>` : ''}
  <main>
    <section class="sd-hero">
      <div class="sd-hero-copy"><p class="sd-kicker">${e(s.trade)} / ${e(city)}</p><nav class="sd-breadcrumb" aria-label="Breadcrumb"><a href="${e(base + suffix)}">Home</a><span aria-hidden="true">/</span><a href="${e(base + suffix)}#services">Services</a><span aria-hidden="true">/</span><span>${e(page.serviceName)}</span></nav><h1>${e(headline)}</h1><p class="sd-hero-line">${e(card)} ${e(s.name)} serves ${e(region)}.</p><a class="sd-button" href="#request">Plan ${e(lower(page.serviceName))} ↗</a></div>
      ${imageFigure('sd-hero-art', image.uploaded ? `${s.name} photograph` : `${page.serviceName} / ${s.trade}`)}
    </section>
    <section class="sd-story-layout sd-includes" id="includes">
      ${imageFigure('sd-detail-art', `01 / ${page.serviceName}`, true)}
      <div class="sd-editorial-copy"><p class="sd-kicker">01 / WHAT IS INCLUDED</p><h2>The details behind the work.</h2><p class="sd-intro">A closer look at ${e(lower(page.serviceName))} for your property.</p><div class="sd-list">${includes.map((item, index) => `<article><span>0${index + 1}</span><h3>${e(item)}</h3></article>`).join('')}</div></div>
    </section>
    <section class="sd-signs" id="signs"><div class="sd-signs-intro"><p class="sd-kicker">02 / WHEN TO REACH OUT</p><h2>The signs worth noticing.</h2><p>Start with what you can see, hear, or feel at home.</p></div><div class="sd-sign-list">${signs.map((item, index) => `<article><b>0${index + 1}</b><h3>${e(item)}</h3></article>`).join('')}</div></section>
    <section class="sd-story-layout sd-process" id="process"><div class="sd-editorial-copy"><p class="sd-kicker">03 / HOW THE WORK MOVES</p><h2>From first look to finish.</h2><ol class="sd-steps">${process.map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><p>${e(sentence(step))}</p></li>`).join('')}</ol></div>${imageFigure('sd-process-art', `03 / ${page.serviceName}`, true)}</section>
    ${work.length ? `<section class="sd-section sd-work-section" id="work"><p class="sd-kicker">REAL PROJECTS / ${e(page.serviceName)}</p><h2>See the work up close.</h2><div class="sd-work">${work.map(({id, data}) => `<a href="${e(base)}/projects/${e(id)}${suffix}"><img src="/media/${e(data.coverId || data.afterId)}" alt="${e(data.title)}" loading="lazy" width="600" height="450"><div><h3>${e(data.title)}</h3><p>${e(data.city)} · ${e(data.service)}</p><span>View project ↗</span></div></a>`).join('')}</div></section>` : ''}
    ${faq.length ? `<section class="sd-section sd-questions" id="questions"><div><p class="sd-kicker">04 / GOOD QUESTIONS</p><h2>Know before you decide.</h2></div><div class="sd-faq">${faq.map(item => `<details><summary>${e(item.question)}</summary><p>${e(item.answer)}</p></details>`).join('')}</div></section>` : ''}
    ${related.length ? `<section class="sd-section sd-related-section" id="related"><p class="sd-kicker">MORE OF WHAT WE DO</p><h2>Explore the next possibility.</h2><div class="sd-related">${related.map(item => `<a href="${e(base)}/services/${e(item.slug)}${suffix}">${e(item.serviceName)} <span aria-hidden="true">↗</span></a>`).join('')}</div></section>` : ''}
    <section class="sd-section sd-request" id="request"><div><p class="sd-kicker">YOUR NEXT STEP</p><h2>Let's plan the work together.</h2><p>Tell ${e(s.name)} about your ${e(lower(page.serviceName))} project.</p>${phone ? `<a href="tel:+${phone.length === 10 ? '1' : ''}${phone}">Call ${e(s.phone)} ↗</a>` : ''}</div><form id="lead-form" data-slug="${e(slug)}" data-project="" data-preview="${preview || salesPreview}"><label>Requested service<input name="service" value="${e(page.serviceName)}" readonly></label><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>Project city<input name="projectCity" autocomplete="address-level2" maxlength="100"></label><label>Project details<textarea name="message" rows="4" maxlength="1800"></textarea></label><label class="sd-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><label class="sd-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><button class="sd-button" ${preview || salesPreview ? 'disabled' : ''}>${preview || salesPreview ? 'Preview — submission disabled' : 'Request an estimate ↗'}</button><p id="lead-status" role="status"></p></form></section>
  </main><footer class="sd-footer"><a href="${e(base + suffix)}">${websiteBrand(s)}</a><nav aria-label="Footer"><a href="${e(base + suffix)}#services">Services</a><a href="${e(base)}/legal/privacy${suffix}">Legal</a><a href="${e(base + suffix)}#contact">Contact</a></nav></footer></body></html>`;
}
