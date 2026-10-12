export const $ = (s: string) => document.querySelector(s);
export const esc = (v: unknown) =>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));