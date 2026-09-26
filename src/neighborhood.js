import {e,one,must,access} from './core.js';
import {servicePhoto} from './service-showpiece.js';
import {normalizePlatform} from './platform/constitution.ts';
export function neighborhoodBanner(s,base,preview){
 const p=normalizePlatform(s.platform);if(!p.neighborhood.enabled||!/^\/s\/[^/?]+$/.test(base))return '';
 const image=servicePhoto(s.trade,s.services?.[0]?.name,'process');
 const slug=base.slice(3),cities=[...new Set((s.serviceAreas||[]).slice(0,5).map(c=>c.city).filter(Boolean))];
 return `<section class="neighborhood-banner" data-neighborhood data-slug="${e(slug)}" data-preview="${preview}" aria-label="Your neighborhood">${image?`<div class="neighborhood-art" data-art-trade="${e(s.trade)}"><img src="${e(image)}" width="1536" height="1024" loading="lazy" alt="Representative ${e(s.services?.[0]?.name||s.trade)} detail">${preview?'<span class="sample-tag">Sample</span>':''}</div>`:''}<div class="neighborhood-copy"><p class="neighborhood-eyebrow">YOUR PLACE. YOUR NEXT CHAPTER.</p><h2 data-city-heading>Good work starts<br>close to home.</h2><p data-city-description>Tell us where you’re planning your project. Let’s explore what’s possible in your neighborhood.</p><a class="neighborhood-cta" data-city-cta href="${e(base+(preview?'?preview=1':''))}#contact">Talk about my project <span aria-hidden="true">↗</span></a><a data-city-reviews hidden target="_blank" rel="noopener noreferrer">Read local reviews ↗</a><details class="neighborhood-picker"><summary>Change city</summary><form data-city-form><label>Your project city<input name="city" list="neighborhood-cities" maxlength="100" required autocomplete="address-level2" placeholder="e.g. North Hollywood"></label><datalist id="neighborhood-cities">${cities.map(c=>`<option value="${e(c)}"></option>`).join('')}</datalist><button type="submit">Use this city</button><button type="button" data-city-clear>Clear city</button></form></details><p class="neighborhood-note" data-city-note role="status">Choose your project city.</p></div></section>`;
}
export async function neighborhoodLocation(req,env,url){
 const m=url.pathname.match(/^\/api\/public\/([^/]+)\/location$/);if(!m)return null;
 must(req.method==='GET','Method not allowed.',405);
 const tenant=await one(env,'SELECT * FROM tenants WHERE slug=?',m[1]);must(tenant,'Website not available.',404);
 const preview=url.searchParams.get('preview')==='1';if(preview)await access(req,env,tenant.id);else must(tenant.status==='published'&&tenant.published,'Website not available.',404);
 const s=JSON.parse(preview?tenant.settings:tenant.published),n=normalizePlatform(s.platform).neighborhood;
 must(n.enabled,'City banner is not enabled.',404);
 const cities=(s.serviceAreas||[]).slice(0,5).map(c=>c.city).filter(Boolean),keys=new Set(cities.map(c=>c.toLowerCase()));
 return {location:env.VISITOR_LOCATION||null,country:n.country,region:n.region,cities,proofs:n.proofs.filter(p=>p.confirmed&&p.url&&keys.has(p.city.toLowerCase())).map(p=>({city:p.city,url:p.url}))};
}
