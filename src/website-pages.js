import faqContent from '../public/faq-content.json' with {type:'json'};
import {serviceHead,afterHeroBoot} from './roofing-performance.js';
import {publicLegalSettings} from './platform/legal-policy.ts';
import {renderTrustStrip,trustAssets} from './trust.js';
import {renderTrustAbout} from './about-page.js';
import {motionHero,anatomySection,warningArt} from './trade-motion.js';
import {tradeMotion} from './trade-motion-config.js';
import {sampleBadge,serviceIcon,serviceFinance,financeSection,serviceOffers,promoBanner,promoSection,sampleTrust,sampleServiceReviews} from './service-conversion.js';
import {e, one, all, must, access} from './core.js';
import {normalizePlatform} from './platform/constitution.ts';
import {websiteBrand, websiteFooter, faqLink, aboutLink} from './site-polish.js';
import {reviewSection} from './reviews.js';
import {visibleServicePages,primaryCity} from './service-registry.js';
import {renderUniversalServicePage} from './service-detail.js';

export {visibleServicePages} from './service-registry.js';

// Use the same snapshot and visibility rules as the destination route. Library
// samples have no tenant service routes, so retain their contextual inquiry.
export function serviceGridLink(s, name, {base = '', preview = false, sample = false} = {}, arrow = '') {
 const page = (sample || /^\/s\/[^/?]+$/.test(base))
  && visibleServicePages(s).find(p => p.serviceName === name);
 const [root,query='']=base.split('?'),suffix=sample?(query?'?'+query:''):(preview?'?preview=1':'');
 return page
  ? `<a href="${e(root)}/services/${e(page.slug)}${e(suffix)}">Explore ${e(name.toLowerCase())} ${arrow}</a>`
  : `<a href="#contact" data-service-link="${e(name)}">Ask about ${e(name.toLowerCase())} ${arrow}</a>`;
}
// Only rendered service slots grant public media access; thumbnail/other page
// kinds remain private until their own renderers are implemented.
export function publicServicePhoto(s, photo) {
  return visibleServicePages(s).some(p => (p.media?.hero?.photoId === photo.id) ||
    (p.media?.bannerOne && p.media?.bannerTwo && ['bannerOne', 'bannerTwo'].some(slot => p.media[slot]?.photoId === photo.id)));
}
// Only the explicitly selected uploaded About portrait is published by this grant.
export function publicAboutPhoto(s,photo) {
 return s.trade==='Roofing' && (s.websitePages?.pages||[]).some(p=>p.kind==='about'&&p.enabled&&p.portraitMode==='uploaded_photo'&&p.portrait?.photoId===photo.id);
}
export async function websitePage(req, env, url) {
  const salesPreview=url.pathname.startsWith('/sales-preview/');
  const match = url.pathname.replace(/^\/sales-preview\//,'/s/').match(/^\/s\/([^/]+)\/services\/([a-z][a-z0-9-]*)\/?$/);
  const faqMatch = !salesPreview && url.pathname.match(/^\/s\/([^/]+)\/faq\/?$/);
  const aboutMatch = !salesPreview && url.pathname.match(/^\/s\/([^/]+)\/about\/?$/);
  const route = match || faqMatch || aboutMatch;
  if (!route) return null;
  must(req.method === 'GET', 'Method not allowed.', 405);
  const tenant = await one(env, 'SELECT * FROM tenants WHERE slug=?', route[1]);
  must(tenant, 'Website not found.', 404);
  const preview = salesPreview || url.searchParams.get('preview') === '1';
  if(salesPreview)must(tenant.status!=='published'&&!tenant.published,'Sales samples are unavailable for published sites.',404);
  if (preview) await access(req, env, tenant.id);
  else must(tenant.status === 'published' && tenant.published, 'Website not published.', 404);
  const s = JSON.parse(preview ? tenant.settings : tenant.published);
  if (aboutMatch) {
    const page=(s.websitePages?.pages||[]).find(p=>p.kind==='about'&&p.enabled);
    must(s.trade==='Roofing'&&page,'About page not available.',404);
    const photos=await all(env,'SELECT id,project_id FROM photos WHERE tenant_id=?',tenant.id);
    const projects=await all(env,'SELECT * FROM projects WHERE tenant_id=? AND published IS NOT NULL ORDER BY created_at DESC',tenant.id);
    return renderAboutPage(s,page,{slug:tenant.slug,preview,photos,projects});
  }
  if (faqMatch) {
    const faq = (s.websitePages?.pages || []).find(p => p.kind === 'faq' && p.enabled);
    must(s.trade === 'Roofing' && faq, 'FAQ not available.', 404);
    const photos = await all(env, 'SELECT id FROM photos WHERE tenant_id=?', tenant.id);
    return renderFAQPage(s, faq, {slug:tenant.slug, preview, photos});
  }
  const page = visibleServicePages(s).find(p => p.slug === match[2]);
  must(page, 'Service not available.', 404);
  const photos = await all(env, 'SELECT id FROM photos WHERE tenant_id=?', tenant.id);
  const projects = await all(env, 'SELECT id,published FROM projects WHERE tenant_id=? AND published IS NOT NULL ORDER BY created_at DESC', tenant.id);
  return renderUniversalServicePage(s, page, {slug: tenant.slug, preview, salesPreview, photos, projects, origin: url.origin});
}
function premiumServiceSeo(html,s,page,{slug,preview,origin,projects,photos}){
 const base=`${origin}/s/${slug}`,canonical=`${base}/services/${page.slug}`,city=primaryCity(s);
 const title=page.seoTitle||`${page.serviceName}${city?` in ${city}`:''} | ${s.name}`;
 const description=page.seoDescription||`${page.serviceName}${city?` in ${city}`:''} from ${s.name}. Explore the scope, process, and how to request an estimate.`;
 const schema=[{'@context':'https://schema.org','@type':'LocalBusiness','@id':base+'#business',name:s.name,telephone:s.phone||undefined,address:s.address||undefined,areaServed:city||undefined,url:base},{'@context':'https://schema.org','@type':'Service',name:page.serviceName,serviceType:page.serviceName,description,provider:{'@id':base+'#business'},areaServed:city||undefined,url:canonical}];
 html=html.replace(/<meta name="robots" content="[^"]*">/,`<meta name="robots" content="${preview?'noindex,nofollow':'index,follow'}">`).replace(/<title>[\s\S]*?<\/title>/,`<title>${e(title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${e(description)}">`).replace('</head>',`<link rel="canonical" href="${e(canonical)}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
 const related=visibleServicePages(s).filter(item=>item.slug!==page.slug).slice(0,3);
 const known=new Set(photos.map(photo=>photo.id));
 const work=projects.map(row=>({id:row.id,data:JSON.parse(row.published)})).filter(row=>!row.data.demo&&!row.data.isSample&&!/\b(?:qa example|test-only|sample|demo|concept project|illustrative)\b/i.test([row.data.title,row.data.problem,row.data.work,row.data.outcome].join(' '))&&row.data.service?.toLowerCase()===page.serviceName.toLowerCase()&&known.has(row.data.coverId||row.data.afterId)).slice(0,3);
 const links=related.length?`<section class="tp-section"><div class="tp-shell"><p class="tp-eyebrow">MORE SERVICES</p><h2>Explore the next possibility.</h2><div class="tp-inclusions">${related.map(item=>`<article><h3><a href="/s/${e(slug)}/services/${e(item.slug)}${preview?'?preview=1':''}">${e(item.serviceName)} ↗</a></h3></article>`).join('')}</div></div></section>`:'';
 const proof=work.length?`<section class="tp-section"><div class="tp-shell"><p class="tp-eyebrow">OUR WORK</p><h2>See the work up close.</h2><div class="tp-inclusions">${work.map(({id,data})=>`<article>${data.coverId||data.afterId?`<img src="/media/${e(data.coverId||data.afterId)}" alt="${e(data.title)}" loading="lazy" width="420" height="300">`:''}<h3><a href="/s/${e(slug)}/projects/${e(id)}${preview?'?preview=1':''}">${e(data.title)}</a></h3></article>`).join('')}</div></div></section>`:'';
 return html.replace('<section class="tp-section tp-contact"',proof+links+'<section class="tp-section tp-contact"');
}
export function accentTokens(color) {
 const hex=/^#[a-f0-9]{6}$/i.test(color||'')?color:'#b8dc65';
 const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const luminance=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
 return {accent:hex,ink:luminance>.179?'#000000':'#ffffff'};
}
export function renderServicePage(s,page,options){return renderUniversalServicePage(s,page,options);}

// Both visible answers and structured data use this same feature-filtered list.
export function renderFAQPage(s,page,{slug,preview=false,photos=[]}) {
 const base='/s/'+slug,suffix=preview?'?preview=1':'',home=base+suffix;
 const platform=normalizePlatform(s.platform),colors=accentTokens(s.color);
 const questions=(page.questions||[]).filter(q=>!q.requires||q.requires==='none'||platform[q.requires]?.enabled);
 const groups=new Map();
 for(const q of questions){const category=q.category||'Roofing questions';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(q);}
 const services=visibleServicePages(s),known=new Set(photos.map(p=>p.id));
 const nav=aboutLink(s,base,preview)+'<a href="'+e(home)+'#services">Services</a><a href="'+e(base)+'/faq'+suffix+'" aria-current="page">Roofing FAQ</a><a href="'+e(home)+'#contact">Contact ↗</a>';
 const action='<a class="tp-button" data-primary href="'+e(home)+'#contact">Get my roofing plan ↗</a>';
 const schema=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:questions.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))}).replace(/</g,'\\u003c');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(page.seoTitle||page.title)} | ${e(s.name)}</title><meta name="description" content="${e(page.seoDescription||page.intro)}"><link rel="stylesheet" href="/site-polish.css"><link rel="stylesheet" href="/trade-page.css?v=006"><script defer src="/trade-page.js?v=004D2"></script><script type="application/ld+json">${schema}</script><style>.tp-faq-page>.tp-header{position:relative;top:auto}.tp-faq-page>.neighborhood-banner .neighborhood-art{overflow:hidden}.tp-faq-page>.neighborhood-banner .neighborhood-art img{display:block;max-width:100%;height:auto}</style></head><body class="trade-page tp-faq-page" style="--tp-accent:${colors.accent};--tp-accent-ink:${colors.ink}"><a class="tp-skip" href="#answers">Skip to roofing answers</a>
 <header class="tp-header"><div class="tp-shell tp-header-inner"><a class="tp-brand" href="${e(home)}">${websiteBrand({...s,logoId:known.has(s.logoId)?s.logoId:null},{decorativeLogo:true})}</a><nav aria-label="Main navigation">${nav}</nav><details class="tp-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${nav}</nav></details></div></header>
 ${preview?'<div class="tp-preview">Private draft preview · Requests are disabled</div>':''}
 <main><section class="tp-hero"><img src="/assets/trade-motion/roofing-house-still.webp" alt="Aerial view of a shingle roof and its surroundings" width="1920" height="1080"><div class="tp-shell tp-hero-copy"><p class="tp-eyebrow">ROOFING / BEFORE YOU DECIDE</p><h1>${e(page.title)}</h1><p class="tp-intro">${e(page.intro||'Understand your roof, compare your next steps and bring your questions to the conversation.')}</p><div class="tp-actions">${action}<a class="tp-button tp-button--outline" href="#answers">Explore the answers ↓</a></div></div></section>
 <div id="answers">${groups.size?[...groups].map(([category,items],i)=>'<section class="tp-section tp-faq-group" aria-labelledby="faq-group-'+i+'"><div class="tp-shell tp-faq"><div><p class="tp-eyebrow">'+e(faqContent.Roofing.eyebrows[category]||category)+'</p><h2 id="faq-group-'+i+'">'+e(category)+'</h2><p><a href="'+e(home)+'#contact">Talk through your roof concern ↗</a></p></div><div>'+items.map(q=>'<details id="question-'+e(q.id)+'"><summary>'+e(q.question)+'</summary><p>'+e(q.answer)+'</p></details>').join('')+'</div></div></section>').join(''):'<section class="tp-section"><div class="tp-shell"><h2>What would you like to know?</h2><p>Bring your roofing question to the conversation.</p>'+action+'</div></section>'}</div>
 ${services.length||platform.financing.enabled||platform.promotions.enabled?'<section class="tp-section tp-faq-next"><div class="tp-shell"><p class="tp-eyebrow">TAKE A CLOSER LOOK</p><h2>Explore your next step.</h2><nav class="tp-actions" aria-label="Related roofing pages">'+services.map(p=>'<a href="'+e(base)+'/services/'+e(p.slug)+suffix+'">'+e(p.title)+' ↗</a>').join('')+(platform.financing.enabled?'<a href="'+e(base)+'/financing'+suffix+'">Financing ↗</a>':'')+(platform.promotions.enabled?'<a href="'+e(base)+'/promotions'+suffix+'">Promotions ↗</a>':'')+'</nav></div></section>':''}
 <section class="tp-final"><div class="tp-shell"><p class="tp-eyebrow">LET’S TALK ABOUT YOUR ROOF</p><h2>Turn your questions<br>into a clearer plan.</h2><p>Share what you’ve noticed and discuss the scope, price and timing for your home.</p><div class="tp-actions">${action}</div></div></section></main>${websiteFooter(s,base,preview)}</body></html>`;
}


export function renderAboutPage(s,page,options){return renderTrustAbout(publicLegalSettings(s),page,options,accentTokens(s.color));}
