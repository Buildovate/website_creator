import {e} from './core.js';
import {cleanTrust,publicTrustSelections,TRUST_NETWORKS} from './platform/trust.ts';
export const trustAssets='<link rel="stylesheet" href="/trust.css?v=009"><script defer src="/trust.js?v=009"></script>';
export function renderTrustStrip(s,{placement='below-hero',at=new Date()}={}){
 if(s.trade!=='Roofing')return '';
 let settings;try{settings=cleanTrust(s.trust)}catch{return '';}
 if(!settings.placements.includes(placement))return '';
 const entries=publicTrustSelections(settings,s.businessTrust,at);if(!entries.length)return '';
 const carousel=settings.layout==='carousel'||(settings.layout==='auto'&&entries.length>5),id='trust-'+placement;
 const cards=entries.map((n,i)=>{
  const definition=TRUST_NETWORKS.find(d=>d.id===n.id),name=['custom','manufacturer'].includes(n.id)?n.label||definition.name:definition.name;
  const rating=settings.showRatings&&n.display==='rating'&&n.rating!==null;
  // No network marks are bundled until rights are supplied. Names remain accessible.
  return `<li class="trust-card" data-trust-network="${n.id}"><a href="${e(n.profileUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${e(name)}: open source profile"><span class="trust-name" translate="no">${e(name)}</span><span class="trust-link-icon" aria-hidden="true">↗</span></a>${rating?`<p class="trust-rating"><span aria-hidden="true">★</span> ${n.rating.toFixed(1)} <small>/ 5 · ${n.reviewCount.toLocaleString('en-US')} reviews</small></p><p class="trust-source">Owner-confirmed · ${e(n.evidence.checkedAt)}</p>`:n.credential?`<p class="trust-credential">${e(n.credential)}</p><p class="trust-source">Owner-confirmed</p>`:'<p class="trust-source">View profile</p>'}</li>`;
 }).join('');
 return `<section class="trust-strip" data-trust-strip data-trust-mode="${carousel?'carousel':'row'}" aria-labelledby="${id}-heading"><div class="trust-shell"><div class="trust-heading"><div><p class="trust-eyebrow">PROFILES &amp; CREDENTIALS</p><h2 id="${id}-heading">Check the source.</h2></div><p>Explore the profiles. Bring your questions.</p>${carousel?`<div class="trust-arrows" data-trust-controls hidden><button type="button" data-trust-prev aria-label="Previous trust profile" aria-controls="${id}-list">←</button><button type="button" data-trust-next aria-label="Next trust profile" aria-controls="${id}-list">→</button></div>`:''}</div><ul class="trust-list" id="${id}-list" ${carousel?'tabindex="0" aria-label="Trust profiles; scroll horizontally for more"':''}>${cards}</ul>${carousel?`<div class="trust-dots" data-trust-controls hidden aria-label="Choose a trust profile">${entries.map((n,i)=>`<button type="button" data-trust-index="${i}" aria-label="Show ${e(['custom','manufacturer'].includes(n.id)?n.label||TRUST_NETWORKS.find(d=>d.id===n.id).name:TRUST_NETWORKS.find(d=>d.id===n.id).name)}" aria-controls="${id}-list" ${i===0?'aria-current="true"':''}><span aria-hidden="true"></span></button>`).join('')}</div>`:''}</div></section>`;
}
