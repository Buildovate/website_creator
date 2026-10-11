// Selected services are the source of truth. Existing records keep their URL,
// editorial content, and explicit visibility choice; older snapshots are
// reconciled in memory so published sites gain pages immediately.
export function serviceSlug(name) {
  const value = String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/, '');
  return /^[a-z]/.test(value) ? value : `service-${(value || 'work').slice(0,72).replace(/-$/, '')}`;
}

function serviceId(slug) {
  const plain=`service-${slug}`;
  if(plain.length<=80)return plain;
  let hash=2166136261;
  for(const character of slug)hash=Math.imul(hash^character.charCodeAt(0),16777619)>>>0;
  return `service-${slug.slice(0,62).replace(/-$/, '')}-${hash.toString(16).padStart(8,'0')}`;
}

export function reconcileServicePages(collection, services = []) {
  const pages = [...(collection?.pages || [])];
  const offered = new Set(services.map(service=>String(service?.name||'').trim().toLowerCase()).filter(Boolean));
  const missing = new Set([...offered].filter(name=>!pages.some(page=>page.kind==='service'&&page.serviceName?.toLowerCase()===name)));
  // Preserve removed services for a later re-selection until they would block
  // the 24-service / 31-page contract for the currently offered services.
  while(pages.length+missing.size>31||pages.filter(page=>page.kind==='service').length+missing.size>24){
    const stale=pages.findLastIndex(page=>page.kind==='service'&&!offered.has(page.serviceName?.toLowerCase()));
    if(stale<0)break;
    const [removed]=pages.splice(stale,1);
    for(let i=0;i<pages.length;i++)if(pages[i].kind==='city')pages[i]={...pages[i],servicePageIds:(pages[i].servicePageIds||[]).filter(id=>id!==removed.id)};
  }
  const used = new Set(pages.filter(p => p.kind === 'service').map(p => p.slug));
  const usedIds = new Set(pages.map(p => p.id));
  const names = new Set();
  for (const service of services) {
    const name = String(service?.name || '').trim();
    if (!name || names.has(name.toLowerCase())) continue;
    names.add(name.toLowerCase());
    if (pages.some(p => p.kind === 'service' && p.serviceName?.toLowerCase() === name.toLowerCase())) continue;
    const stem = serviceSlug(name);
    let slug = stem, suffix = 2;
    while (used.has(slug)) slug = `${stem.slice(0, 77 - String(suffix).length)}-${suffix++}`;
    used.add(slug);
    const baseId=serviceId(slug);let id=baseId,idSuffix=2;
    while(usedIds.has(id))id=`${baseId.slice(0,76)}-${idSuffix++}`;
    usedIds.add(id);
    pages.push({id, kind: 'service', slug, enabled: true,
      title: name, serviceName: name, intro: service.description || '',
      seoTitle: '', seoDescription: '', headline: '', scope: '', process: [],
      materials: [], questions: [], typicalPriceRange: null,
      media: {hero: null, bannerOne: null, bannerTwo: null, thumbnail: null}});
  }
  return {version: 1, pages};
}

export function visibleServicePages(s) {
  const selected = new Set((s.services || []).map(service => service.name?.toLowerCase()));
  return reconcileServicePages(s.websitePages, s.services).pages.filter(p =>
    p.kind === 'service' && p.enabled && selected.has(p.serviceName?.toLowerCase()));
}

export function primaryCity(s) {
  const city = s.serviceAreas?.find(area => area.city)?.city;
  if (city) return city;
  const address = String(s.address || '').match(/,\s*([^,]+),\s*[A-Z]{2}\s*\d{5}/);
  return address?.[1]?.trim() || String(s.area || '').split(/,|\s+and\s+/i)[0].trim();
}
