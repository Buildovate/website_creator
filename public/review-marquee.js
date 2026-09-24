(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function init(root=document){root.querySelectorAll('.review-grid:not(.source-review-grid),.sample-review-track').forEach(track=>{
  if(track.dataset.loopReady||track.children.length<2)return;track.dataset.loopReady='true';
  const cards=[...track.children],viewport=document.createElement('div');viewport.className='review-loop';viewport.setAttribute('role','region');viewport.setAttribute('aria-label','Customer reviews');viewport.tabIndex=0;track.before(viewport);viewport.append(track);
  track.classList.add('review-loop-track');cards.forEach(c=>c.classList.add('review-loop-card'));
  const duplicates=cards.map(c=>{const copy=c.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.inert=true;copy.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));copy.classList.add('review-loop-copy');track.append(copy);return copy});
  const control=document.createElement('button');control.type='button';control.className='review-motion-control';viewport.before(control);let paused=false,hover=false,focus=false;
  function state(){const off=paused||hover||focus||reduced.matches||document.hidden;track.style.animationPlayState=off?'paused':'running';control.textContent=paused?'Play reviews':'Pause reviews';control.setAttribute('aria-pressed',String(paused));control.hidden=reduced.matches;viewport.classList.toggle('review-loop-reduced',reduced.matches)}
  const measure=()=>{const width=cards[0].getBoundingClientRect().width,gap=parseFloat(getComputedStyle(track).gap)||20;track.style.setProperty('--loop-distance',-(width+gap)*cards.length+'px');track.style.setProperty('--loop-duration',Math.max(30,(width+gap)*cards.length/28)+'s')};
  control.onclick=()=>{paused=!paused;state()};viewport.onmouseenter=()=>{hover=true;state()};viewport.onmouseleave=()=>{hover=false;state()};viewport.onfocusin=()=>{focus=true;state()};viewport.onfocusout=e=>{focus=viewport.contains(e.relatedTarget);state()};viewport.addEventListener('touchstart',()=>{paused=true;state()},{passive:true});
  reduced.addEventListener('change',state);document.addEventListener('visibilitychange',state);new ResizeObserver(measure).observe(viewport);measure();state();
 })}window.BuildovateReviews={init};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init());else init();
})();
