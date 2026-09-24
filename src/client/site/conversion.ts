// Match sticky scene and anchor offsets to the real header, including wrapped brands.
const header=document.querySelector<HTMLElement>('.cx-header');
if(header){
 const sizeHeader=()=>document.body.style.setProperty('--cx-header-height',`${header.getBoundingClientRect().height}px`);
 sizeHeader();if('ResizeObserver' in window)new ResizeObserver(sizeHeader).observe(header);else addEventListener('resize',sizeHeader);
}
// Motion enhances already-visible content; forms continue to use the shared inquiry handler.
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const targets=[...document.querySelectorAll<HTMLElement>('[data-cx-reveal]')];
if('IntersectionObserver' in window && !reduce.matches && document.body.dataset.cxMotion==='true'){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('cx-revealed');observer.unobserve(entry.target)}}),{threshold:.08});
  targets.forEach(el=>{el.classList.add('cx-reveal-pending');observer.observe(el)});
  reduce.addEventListener('change',()=>{if(reduce.matches){observer.disconnect();targets.forEach(el=>el.classList.add('cx-revealed'))}});
}
document.querySelectorAll<HTMLAnchorElement>('[data-service-link]').forEach(link=>link.addEventListener('click',()=>{
  const field=document.querySelector<HTMLSelectElement>('#lead-form [name=service]');if(field)field.value=link.dataset.serviceLink||'';
}));
document.querySelectorAll('.cx-mobile-menu a').forEach(link=>link.addEventListener('click',()=>document.querySelector<HTMLDetailsElement>('.cx-mobile-menu')?.removeAttribute('open')));
const contact=document.querySelector('#contact'),dock=document.querySelector<HTMLElement>('.cx-mobile-action');
if(contact&&dock&&'IntersectionObserver' in window)new IntersectionObserver(entries=>{dock.hidden=entries[0].isIntersecting},{threshold:0}).observe(contact);
