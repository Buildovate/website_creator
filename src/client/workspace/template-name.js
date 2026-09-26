export function formatTemplateName(kit) {
 const name=String(kit?.name||'').trim().toLowerCase().replace(/\b[a-z]/g,letter=>letter.toUpperCase());
 const trade=String(kit?.trade||'').trim();
 return trade?`${name} (${trade})`:name;
}
