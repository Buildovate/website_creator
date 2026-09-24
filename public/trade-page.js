// Progressive enhancement shared by premium trade pages.
(()=> {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const header=document.querySelector('.tp-header');
 if(header&&'ResizeObserver' in window)new ResizeObserver(()=>document.documentElement.style.setProperty('--tp-header-height',header.getBoundingClientRect().height+'px')).observe(header);
 const items=[...document.querySelectorAll('[data-reveal]')];
 if(!reduce.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('tp-pending');observer.unobserve(entry.target)}}),{threshold:.12});
  items.forEach(item=>{item.classList.add('tp-pending');observer.observe(item)});
  reduce.addEventListener('change',()=>{if(reduce.matches){items.forEach(item=>item.classList.remove('tp-pending'));observer.disconnect()}});
 }
 document.querySelectorAll('[data-comparison]').forEach(box=>{
  const range=box.querySelector('input[type=range]');if(!range)return;
  const update=()=>{box.style.setProperty('--split',range.value+'%');range.setAttribute('aria-valuetext',range.value+' percent before image')};
  range.addEventListener('input',update);update();
 });
 document.querySelectorAll('.tp-menu a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.tp-menu').removeAttribute('open')));
})();