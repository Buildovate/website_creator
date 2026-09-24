// Native scrolling is the fallback. No timers, autoplay, provider calls or clones.
(()=>{for(const root of document.querySelectorAll('[data-trust-strip][data-trust-mode="carousel"]')){
 const list=root.querySelector('.trust-list'),cards=[...list.children],dots=[...root.querySelectorAll('[data-trust-index]')],prev=root.querySelector('[data-trust-prev]'),next=root.querySelector('[data-trust-next]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let active=0,frame=0;
 function position(i){return cards[i].offsetLeft-cards[0].offsetLeft;}
 function update(){frame=0;const max=list.scrollWidth-list.clientWidth;if(max<=1){active=0}else{active=list.scrollLeft>=max-2?cards.length-1:cards.reduce((best,c,i)=>Math.abs(position(i)-list.scrollLeft)<Math.abs(position(best)-list.scrollLeft)?i:best,0);}
  dots.forEach((d,i)=>{if(i===active)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});prev.disabled=list.scrollLeft<=2;next.disabled=list.scrollLeft>=max-2;
 }
 function go(i){list.scrollTo({left:position(Math.max(0,Math.min(cards.length-1,i))),behavior:reduced.matches?'instant':'smooth'});}
 function step(direction){list.scrollBy({left:direction*cards[0].offsetWidth,behavior:reduced.matches?'instant':'smooth'});}
 prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
 list.addEventListener('keydown',e=>{if(e.target!==list||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home'||e.key==='End')go(e.key==='Home'?0:cards.length-1);else step(e.key==='ArrowRight'?1:-1);});
 list.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});new ResizeObserver(update).observe(list);root.querySelectorAll('[data-trust-controls]').forEach(e=>e.hidden=false);update();
}})();
