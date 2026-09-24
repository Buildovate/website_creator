import {e, one, all, must, access} from './core.js';
import {normalizePlatform} from './platform/constitution.ts';
import {websiteBrand, websiteFooter} from './site-polish.js';
import serviceArt from '../public/service-art.json' with {type:'json'};

export function visibleServicePages(s) {
  return (s.websitePages?.pages || []).filter(p => p.kind === 'service' && p.enabled && (s.services || []).some(service => service.name === p.serviceName));
}
// Only rendered service slots grant public media access; thumbnail/other page
// kinds remain private until their own renderers are implemented.
export function publicServicePhoto(s, photo) {
  return s.trade === 'Roofing' && visibleServicePages(s).some(p =>
    ['hero', 'bannerOne', 'bannerTwo'].some(slot => p.media?.[slot]?.photoId === photo.id));
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
export function renderServicePage(s, page, {slug, preview = false, photos = []}) {
  const base = '/s/' + slug, suffix = preview ? '?preview=1' : '', home = base + suffix;
  const known = new Set(photos.map(p => p.id)), platform = normalizePlatform(s.platform);
  const phone = String(s.phone || '').replace(/\D/g, '');
  const call = phone ? 'tel:+' + (phone.length === 10 ? '1' : '') + phone : '';
  const button = '<a class="wp-button" href="#contact">Request this service ↗</a>';
  const figure = (slot, fallback = false) => {
    const media = page.media?.[slot], owned = media && known.has(media.photoId);
    const art = owned ? '/media/' + media.photoId : fallback ? serviceArt.Roofing[page.serviceName.toLowerCase()] : '';
    return art ? `<figure><img src="${e(art)}" alt="${e(owned ? media.alt : page.serviceName + ' illustration')}" width="1200" height="800" ${slot === 'hero' ? 'fetchpriority="high"' : 'loading="lazy"'}>${owned ? media.caption ? '<figcaption>' + e(media.caption) + '</figcaption>' : '' : '<figcaption>Service illustration</figcaption>'}</figure>` : '';
  };
  const questions = (page.questions || []).filter(q => !q.requires || q.requires === 'none' || platform[q.requires]?.enabled);
  const nav = `<a href="${e(home)}#services">Services</a><a href="${e(base)}/pricing${suffix}">Pricing</a>${platform.financing.enabled ? '<a href="' + e(base) + '/financing' + suffix + '">Financing</a>' : ''}${platform.promotions.enabled ? '<a href="' + e(base) + '/promotions' + suffix + '">Promotions</a>' : ''}<a href="#contact">Contact</a>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(page.seoTitle || page.title)} | ${e(s.name)}</title><meta name="description" content="${e(page.seoDescription || page.intro)}"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/website-pages.css"><script defer src="/site.js"></script></head><body class="service-page"><a class="wp-skip" href="#contact">Skip to service request</a><header class="wp-header"><a class="wp-brand" href="${e(home)}">${websiteBrand({...s, logoId: known.has(s.logoId) ? s.logoId : null})}</a><nav aria-label="Main navigation">${nav}</nav><details class="wp-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${nav}</nav></details></header>
  ${preview ? '<p class="wp-preview">Private draft preview · Requests are disabled</p>' : ''}
  <main><nav class="wp-breadcrumbs" aria-label="Breadcrumb"><a href="${e(home)}">Home</a> / <a href="${e(home)}#services">Services</a> / <span aria-current="page">${e(page.serviceName)}</span></nav>
  <section class="wp-hero"><div><p class="wp-eyebrow">${e(s.area)} · ROOFING</p><h1>${e(page.title)}</h1><p class="wp-intro">${e(page.intro)}</p><div class="wp-actions">${button}${call ? '<a href="' + call + '">Call ' + e(s.phone) + '</a>' : ''}</div></div>${figure('hero', true)}</section>
  <section class="wp-content"><p class="wp-eyebrow">UNDERSTAND THE WORK</p><h2>What’s included</h2><p class="wp-prose">${e(page.scope)}</p>${figure('bannerOne')}${page.process?.length ? '<h2>What happens next</h2><ol class="wp-steps">' + page.process.map(step => '<li>' + e(step) + '</li>').join('') + '</ol>' : ''}${page.materials?.length ? '<h2>Materials & options</h2><ul>' + page.materials.map(item => '<li>' + e(item) + '</li>').join('') + '</ul>' : ''}${figure('bannerTwo')}</section>
  ${questions.length ? '<section class="wp-content wp-faq"><p class="wp-eyebrow">BEFORE YOU DECIDE</p><h2>Your questions, answered</h2>' + questions.map(q => '<details><summary>' + e(q.question) + '</summary><p class="wp-prose">' + e(q.answer) + '</p></details>').join('') + '</section>' : ''}
  <section class="wp-contact" id="contact"><div><p class="wp-eyebrow">YOUR NEXT STEP</p><h2>Tell us about your ${e(page.serviceName.toLowerCase())} project.</h2><p>Share what you’ve noticed and where the work is needed. The business will review your request; scope, pricing and availability are confirmed separately.</p>${call ? '<a href="' + call + '">Call ' + e(s.phone) + '</a>' : ''}</div>
  <form id="lead-form" data-slug="${e(slug)}" data-project="" data-preview="${preview}"><label>Requested service<input name="service" value="${e(page.serviceName)}" readonly></label><label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label><label>Project city<input name="projectCity" autocomplete="address-level2" required maxlength="100"></label><label>Preferred timing<select name="timeframe"><option value="">Let’s discuss</option><option>As soon as possible</option><option>Within a month</option><option>Planning ahead</option></select></label><label>Project notes<textarea name="message" rows="4" maxlength="1800"></textarea></label><label class="wp-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="wp-consent"><input name="consent" type="checkbox" required>I agree to be contacted about this request.</label><a href="${e(base)}/legal/privacy${suffix}">Privacy policy</a><button class="wp-button" type="submit" ${preview ? 'disabled' : ''}>${preview ? 'Preview — submission disabled' : 'Request this service ↗'}</button><p id="lead-status" role="status">${preview ? 'Preview only — no request will be sent.' : ''}</p></form></section></main>
  ${websiteFooter(s, base, preview)}</body></html>`;
}
