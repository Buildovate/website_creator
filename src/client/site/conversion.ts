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

if(document.body.classList.contains('cx-roof-repair'))document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.hash.slice(1));if(!target)return;document.querySelector('.cx-mobile-menu')?.removeAttribute('open');requestAnimationFrame(()=>{const header=document.querySelector('.cx-header');if(header)document.body.style.setProperty('--cx-header-height',header.getBoundingClientRect().height+'px');target.scrollIntoView({block:'start',behavior:'instant'});});}));


// #020 only: one-shot decorative settle; all semantic content is already visible.
document.querySelectorAll<HTMLElement>('[data-roof-planning-story]').forEach(story=>{
 const photo=story.querySelector<HTMLImageElement>('.rs-image-frame>img');
 const failed=()=>{if(!photo)return;photo.hidden=true;photo.style.display='none';story.querySelector('.rs-image-frame')?.classList.add('rs-image-failed');const fallback=story.querySelector<HTMLElement>('.rs-image-fallback');if(fallback)fallback.hidden=false};
 photo?.addEventListener('error',failed,{once:true});if(photo?.complete&&!photo.naturalWidth)failed();
 if(!('IntersectionObserver' in window)||reduce.matches||!matchMedia('(hover:hover) and (min-width:761px)').matches||document.body.dataset.cxMotion!=='true')return;
 story.classList.add('rs-awaiting');
 const settle=()=>{story.classList.add('rs-settled');story.classList.remove('rs-awaiting')};
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){settle();observer.disconnect()}},{rootMargin:'0px 0px -40% 0px',threshold:0});observer.observe(story);
 reduce.addEventListener('change',()=>{if(reduce.matches){settle();observer.disconnect()}});
});
