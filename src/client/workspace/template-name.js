export function formatDesignName(kit) { return String(kit?.name||'').trim().toLowerCase().replace(/\b[a-z]/g,letter=>letter.toUpperCase()); }
export function formatTemplateName(kit) {
 const name=formatDesignName(kit);
 const trade=String(kit?.trade||'').trim();
 return trade?`${name} (${trade})`:name;
}
