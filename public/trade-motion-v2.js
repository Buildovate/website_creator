/* Enhancement on the #004E scheduler. The heavy interaction module loads near its sections. */
(()=>{
 const clock=window.TradeMotionScroll;if(!clock)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const headlines=[...document.querySelectorAll('[data-kinetic-text=lines]')];
 if(!reduce.matches)headlines.forEach(el=>el.classList.add('mk-text-ready'));
 let started=false;
 const load=()=>{if(started)return;started=true;import('/trade-motion-v2-interactions.js?v=004H').then(m=>m.mountMotionV2(clock)).catch(()=>{document.documentElement.dataset.motionV2Fallback='static';});};
 const targets=document.querySelectorAll('[data-layer-explode],[data-reveal-compare],[data-kinetic-text=words]');
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load()}},{rootMargin:'600px'});targets.forEach(el=>observer.observe(el));}else load();
 reduce.addEventListener('change',()=>{if(reduce.matches)headlines.forEach(el=>el.classList.remove('mk-text-ready'));});
})();
