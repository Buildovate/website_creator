/** Visual adaptation only: existing routes, data and event handlers remain authoritative. */
const platformRoot=document.body;
if(platformRoot.classList.contains('bv-platform')){
 const mappings:[string,string][]=[
  ['.panel,.ex-panel,.ex-hero,.ex-export,.auth-card','bv-panel'],['.metrics article,.project-tile,.pipeline-card,.contact-card','bv-card'],
  ['.eyebrow','bv-eyebrow'],['.badge','bv-pill'],['.badge.published','bv-pill-success'],['.badge.draft','bv-pill-warning'],
  ['.table-wrap,.ex-table','bv-table-wrap'],['nav.tabs,.ex-tabs','bv-tabs'],['.empty,.ex-empty','bv-empty'],['.ex-loading','bv-loading'],
  ['.notice','bv-callout-warning'],['.status.error','bv-callout-error'],['dialog','bv-dialog'],['.q-intro nav','bv-rail'],
  ['.sidebar','bv-sidebar'],['.topbar','bv-topbar'],['input,select,textarea','bv-field'],['input[role=switch]','bv-switch'],
  ['button[data-copy],button[data-action=copy]','bv-copy'],['button,a.primary,a.secondary','bv-button']
 ];
 let scheduled=0;
 const visible=(el:Element)=>{const s=getComputedStyle(el);return !!el.getClientRects().length&&s.visibility!=='hidden'&&s.display!=='none'&&!el.closest('[hidden]')};
 function sync(){
  scheduled=0;
  for(const [selector,cls]of mappings)for(const el of document.querySelectorAll(selector))el.classList.add(cls);
  for(const el of document.querySelectorAll('dialog'))el.classList.toggle('bv-drawer',!!el.querySelector('.contact-profile'));
  const dialog=document.querySelector('dialog[open]');
  const root=dialog||document.querySelector('#content')||document.querySelector('main')||platformRoot;
  const dock=(dialog||platformRoot).querySelector('.platform-action-dock:not([hidden])');
  const candidates=[...root.querySelectorAll<HTMLElement>('button.primary,a.primary,button.bv-button-primary,a.bv-button-primary,button[type=submit],.ex-save button')].filter(visible);
  const chosen=(dock&&[...dock.querySelectorAll<HTMLElement>('button')].find(visible))||candidates.find(el=>/^save\b/i.test(el.textContent?.trim()||''))||candidates[0];
  for(const el of document.querySelectorAll('.bv-button-primary'))if(el!==chosen)el.classList.remove('bv-button-primary');
  chosen?.classList.add('bv-button-primary');
  for(const table of document.querySelectorAll('table')){
   const headings=[...table.querySelectorAll('thead th')].map(el=>el.textContent?.trim()||'Details');
   for(const row of table.querySelectorAll('tbody tr'))[...row.children].forEach((cell,i)=>{if(!cell.hasAttribute('data-mobile-label'))cell.setAttribute('data-mobile-label',headings[i]||'Details')});
  }
 }
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(sync)}
 new MutationObserver(schedule).observe(platformRoot,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','disabled','aria-selected']});
 document.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const dialog=document.querySelector('dialog[open]');if(!dialog)return;
  const controls=[...dialog.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,summary,[tabindex]')].filter(el=>el.tabIndex>=0&&!el.matches(':disabled')&&visible(el));
  const first=controls[0],last=controls.at(-1);if(!first)return;
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 document.addEventListener('click',event=>{
  const target=(event.target as Element).closest('[data-bv-dismiss]');const offer=target?.closest<HTMLElement>('.bv-offer');if(offer)offer.hidden=true;
 });
 window.addEventListener('resize',schedule);document.addEventListener('toggle',schedule,true);sync();
}
export {};
