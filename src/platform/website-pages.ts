// First-class homeowner page records. Rendering/editors are separate tickets.
export type PageKind = 'service' | 'faq' | 'about' | 'city';
export interface PageMedia { photoId: string; alt: string; caption: string }
export interface PageQuestion { id: string; category: string; question: string; answer: string; requires: 'none' | 'financing' | 'promotions' }
interface PageBase {
  id: string; kind: PageKind; slug: string; enabled: boolean;
  title: string; intro: string; seoTitle: string; seoDescription: string;
  media: { hero: PageMedia | null; bannerOne: PageMedia | null; bannerTwo: PageMedia | null; thumbnail: PageMedia | null };
}
export interface ServicePage extends PageBase {
  kind: 'service'; typicalPriceRange: {min:number;max:number} | null; headline: string; serviceName: string; scope: string; process: string[]; materials: string[]; questions: PageQuestion[];
}
export interface FAQPage extends PageBase { kind: 'faq'; questions: PageQuestion[] }
export interface AboutPage extends PageBase {
  kind: 'about'; story: string; whyUs: string[]; titleLocked: boolean;
  portraitMode: 'ai_logo_shirt' | 'uploaded_photo' | 'hidden'; portrait: PageMedia | null;
}
export interface CityPage extends PageBase { kind: 'city'; city: string; content: string; servicePageIds: string[] }
export type WebsitePage = ServicePage | FAQPage | AboutPage | CityPage;
export interface WebsitePages { version: 1; pages: WebsitePage[] }
export const PAGE_LIMITS = {
  pages: 31, service: 24, city: 5, faq: 1, about: 1, id: 80, slug: 80,
  title: 120, intro: 1200, seoTitle: 70, seoDescription: 180,
  alt: 250, caption: 500, question: 200, answer: 2000, questions: 20,
  story: 10000, content: 6000, totalBytes: 64000,
} as const;

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function object(value: unknown, label: string): Record<string, unknown> {
  check(value !== null && typeof value === 'object' && !Array.isArray(value), `${label} must be an object.`);
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, max: number, required = false): string {
  if (value === undefined && !required) return '';
  check(typeof value === 'string', `${label} must be text.`);
  const result = value.trim();
  check(result.length <= max, `${label} must be at most ${max} characters.`);
  check(!required || result.length > 0, `${label} is required.`);
  return result;
}
function bool(value: unknown, label: string, fallback = false): boolean {
  check(value === undefined || typeof value === 'boolean', `${label} must be true or false.`);
  return value === undefined ? fallback : value as boolean;
}
function choice<T extends string>(value: unknown, allowed: readonly T[], label: string, fallback?: T): T {
  if (value === undefined && fallback !== undefined) return fallback;
  check(typeof value === 'string' && allowed.includes(value as T), `Choose a valid ${label}.`);
  return value as T;
}
function list(value: unknown, label: string, max: number): unknown[] {
  if (value === undefined) return [];
  check(Array.isArray(value) && value.length <= max, `${label} must be a list of at most ${max} items.`);
  return value;
}
function id(value: unknown, label: string): string {
  const result = text(value, label, PAGE_LIMITS.id, true);
  check(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(result), `${label} must be an ID, not a URL or path.`);
  return result;
}
function strings(value: unknown, label: string, count: number, length: number): string[] {
  return list(value, label, count).map(v => text(v, label, length, true));
}
function unique(values: string[], label: string) {
  check(new Set(values).size === values.length, `${label} must be unique.`);
}
function media(value: unknown): PageMedia | null {
  if (value === undefined || value === null) return null;
  const v = object(value, 'Page media');
  check(Object.keys(v).every(key => ['photoId', 'alt', 'caption'].includes(key)), 'Page media accepts photoId, alt and caption only; upload media to this website first.');
  return {photoId: id(v.photoId, 'Photo ID'), alt: text(v.alt, 'Image alt text', PAGE_LIMITS.alt, true), caption: text(v.caption, 'Image caption', PAGE_LIMITS.caption)};
}
function priceRange(value:unknown): {min:number;max:number}|null {
  if(value===undefined||value===null)return null;
  const v=object(value,'Typical service price range'),min=Number(v.min),max=Number(v.max);
  check(Number.isFinite(min)&&Number.isFinite(max)&&min>0&&max>min&&max<=1000000,'Enter a typical service range above $0, with a higher maximum up to $1,000,000.');
  return {min,max};
}
function questions(value: unknown, max = PAGE_LIMITS.questions): PageQuestion[] {
  const result = list(value, 'Questions', max).map(raw => {
    const v = object(raw, 'Question');
    return {
      id: v.id === undefined ? crypto.randomUUID() : id(v.id, 'Question ID'),
      category: text(v.category, 'Question category', 80),
      question: text(v.question, 'Question', PAGE_LIMITS.question, true),
      answer: text(v.answer, 'Answer', PAGE_LIMITS.answer, true),
      requires: choice(v.requires, ['none', 'financing', 'promotions'] as const, 'question dependency', 'none'),
    };
  });
  unique(result.map(q => q.id), 'Question IDs');
  return result;
}
function slug(value: unknown, title: string): string {
  const derived = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, PAGE_LIMITS.slug).replace(/-$/, '');
  const result = value === undefined ? (/^[a-z]/.test(derived) ? derived : `page-${derived}`) : text(value, 'Page slug', PAGE_LIMITS.slug, true);
  check(result.length <= PAGE_LIMITS.slug && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(result), 'Use a page slug with lowercase letters, numbers and single hyphens.');
  return result;
}

// Omission by an older settings editor preserves the existing collection. An
// explicit {version:1,pages:[]} clears the draft, never the published snapshot.
export function normalizeWebsitePages(value: unknown, previous?: unknown): WebsitePages {
  const prior = previous === undefined ? undefined : normalizeWebsitePages(previous);
  if (value === undefined) return prior ?? {version: 1, pages: []};
  const collection = object(value, 'Website pages');
  check(collection.version === 1, 'Unsupported website pages version.');
  check(Array.isArray(collection.pages), 'Website pages requires a pages list.');
  const pages = list(collection.pages, 'Website pages', PAGE_LIMITS.pages).map((raw): WebsitePage => {
    const v = object(raw, 'Page');
    const kind = choice(v.kind, ['service', 'faq', 'about', 'city'] as const, 'page kind');
    const pageId = v.id === undefined ? crypto.randomUUID() : id(v.id, 'Page ID');
    const old = prior?.pages.find(p => p.id === pageId);
    check(!old || old.kind === kind, 'An existing page cannot change its kind.');
    const title = text(v.title, 'Page title', PAGE_LIMITS.title, true);
    const pageSlug = slug(v.slug === undefined ? old?.slug ?? (kind === 'about' || kind === 'faq' ? kind : undefined) : v.slug, title);
    check(!old || old.slug === pageSlug, 'An existing page slug is stable; URL migration needs a separate action.');
    check((kind !== 'about' && kind !== 'faq') || pageSlug === kind, `The ${kind} page uses its fixed slug.`);
    const assets = v.media === undefined ? {} : object(v.media, 'Page media slots');
    check(Object.keys(assets).every(key => ['hero', 'bannerOne', 'bannerTwo', 'thumbnail'].includes(key)), 'Unknown page media slot.');
    const base: PageBase = {
      id: pageId, kind, slug: pageSlug, enabled: bool(v.enabled, 'Page enabled'), title,
      intro: text(v.intro, 'Page introduction', PAGE_LIMITS.intro),
      seoTitle: text(v.seoTitle, 'SEO title', PAGE_LIMITS.seoTitle), seoDescription: text(v.seoDescription, 'SEO description', PAGE_LIMITS.seoDescription),
      media: {hero: media(assets.hero), bannerOne: media(assets.bannerOne), bannerTwo: media(assets.bannerTwo), thumbnail: media(assets.thumbnail)},
    };
    if (kind === 'service') return {...base, kind, typicalPriceRange: priceRange(v.typicalPriceRange), headline: text(v.headline, 'Service headline', 120), serviceName: text(v.serviceName, 'Service name', 100, true), scope: text(v.scope, 'Service scope', PAGE_LIMITS.content), process: strings(v.process, 'Process steps', 8, 600), materials: strings(v.materials, 'Materials', 12, 300), questions: questions(v.questions)};
    if (kind === 'faq') return {...base, kind, questions: questions(v.questions)};
    if (kind === 'about') {
      const portraitMode = choice(v.portraitMode, ['ai_logo_shirt', 'uploaded_photo', 'hidden'] as const, 'portrait mode', 'hidden');
      const portrait = media(v.portrait);
      check(portraitMode !== 'hidden' || portrait === null, 'A hidden portrait must not contain a photo reference.');
      return {...base, kind, story: text(v.story, 'About story', PAGE_LIMITS.story), whyUs: strings(v.whyUs, 'Why us points', 8, 600), titleLocked: bool(v.titleLocked, 'Title lock'), portraitMode, portrait};
    }
    const servicePageIds = list(v.servicePageIds, 'City services', PAGE_LIMITS.service).map(x => id(x, 'Service page ID'));
    unique(servicePageIds, 'City service references');
    return {...base, kind, city: text(v.city, 'City name', 100, true), content: text(v.content, 'City content', PAGE_LIMITS.content), servicePageIds};
  });
  unique(pages.map(p => p.id), 'Page IDs');
  unique(pages.map(p => `${p.kind}/${p.slug}`), 'Page URLs');
  for (const kind of ['service', 'faq', 'about', 'city'] as const) check(pages.filter(p => p.kind === kind).length <= PAGE_LIMITS[kind], `At most ${PAGE_LIMITS[kind]} ${kind} pages are allowed.`);
  unique(pages.filter(p => p.kind === 'city').map(p => p.city.toLowerCase()), 'City names');
  const services = new Set(pages.filter(p => p.kind === 'service').map(p => p.id));
  for (const page of pages) if (page.kind === 'city') check(page.servicePageIds.every(ref => services.has(ref)), 'City services must reference service pages on this website.');
  const result: WebsitePages = {version: 1, pages};
  check(new TextEncoder().encode(JSON.stringify(result)).length <= PAGE_LIMITS.totalBytes, `Website page content must fit within ${PAGE_LIMITS.totalBytes} bytes.`);
  return result;
}

// These are photo-record IDs, not public URLs. Saving a reference does not grant
// public media access; each future page renderer must use published records.
export function websitePagePhotoIds(value: WebsitePages): string[] {
  return [...new Set(value.pages.flatMap(page => {
    const refs = Object.values(page.media).filter((m): m is PageMedia => m !== null);
    if (page.kind === 'about' && page.portrait) refs.push(page.portrait);
    return refs.map(m => m.photoId);
  }))];
}
