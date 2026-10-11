export const EBOOK_REVISION='roofing-guide-022-v1';
export function cleanEbook(value,previous={}){const v=value===undefined?previous:value||{};return {enabled:v.enabled===true,reviewedRevision:v.reviewedRevision===EBOOK_REVISION?EBOOK_REVISION:''}}
export const ebookAvailable=s=>s.trade==='Roofing'&&s.ebook?.enabled===true&&s.ebook.reviewedRevision===EBOOK_REVISION;
