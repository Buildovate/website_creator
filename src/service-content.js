import content from '../public/service-content.json' with {type: 'json'};

export const serviceContent = content;

export function serviceBrief(trade, name) {
  return content[trade]?.[String(name || '').trim().toLowerCase()] || null;
}

export function serviceCardBlurb(trade, name, fallback = '') {
  return serviceBrief(trade, name)?.card || fallback;
}

export function serviceLayoutVariant(seed) {
  let hash = 2166136261;
  for (const char of String(seed || 'site')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash % 3);
}

export function personalizeServiceFaq(brief, {city, region, business}) {
  return brief.faq.map(row => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value
      .replaceAll('{{city}}', city)
      .replaceAll('{{region}}', region)
      .replaceAll('{{business}}', business)]),
  ));
}
