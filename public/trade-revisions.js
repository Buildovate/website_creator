(()=>{'use strict';
 const header=document.querySelector('.shared-site-header');
 if(header){const measure=()=>document.documentElement.style.setProperty('--site-nav-height',header.getBoundingClientRect().height+'px');measure();if(typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(header);addEventListener('resize',measure,{passive:true});}
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.journey-animation').forEach(el=>{if(reduce.matches||!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){el.classList.add('is-visible');observer.disconnect();}},{threshold:.3});observer.observe(el);});
 // Decorative ribbons stop on pointer hover and keyboard focus.
 document.querySelectorAll('.kit-marquee').forEach(el=>{if(!el.hasAttribute('tabindex'))el.tabIndex=0;});
})();
