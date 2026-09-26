for(const comparison of document.querySelectorAll('[data-compare]')){
 const input=comparison.querySelector('[data-compare-range]');
 if(!input)continue;
 const update=()=>comparison.style.setProperty('--split',`${input.value}%`);
 input.addEventListener('input',update);
 update();comparison.classList.add('sd-compare-ready');
}
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.body.classList.add('sd-motion-ready');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('sd-motion-active',entry.isIntersecting)},{threshold:.25});
 for(const section of document.querySelectorAll('.sd-signature'))observer.observe(section);
}
