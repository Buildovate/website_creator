const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{const x=clamp(n);return x*x*(3-2*x)};
export function mountMotionV2(clock) {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
 let paused=false;
 const layers=[...document.querySelectorAll('[data-layer-explode]')].map(root=>({root,stage:root.querySelector('.mk-layer-stage'),parts:[...root.querySelectorAll('[data-roof-layer]')],phase:root.querySelector('[data-layer-phase]')}));
 const words=[...document.querySelectorAll('[data-kinetic-text=words]')].map(root=>({root,parts:[...root.querySelectorAll('[data-kinetic-part]')]}));
 const stacks=[...document.querySelectorAll('[data-sticky-stack]')].map(root=>({root,cards:[...root.querySelectorAll('[data-stack-card]')],links:[...root.querySelectorAll('.mk-stack-index a')]}));
 const stats=[...document.querySelectorAll('[data-stats-mask]')].map(root=>({root,grid:root.querySelector('.mk-stats-grid'),photo:root.querySelector('.mk-stats-photo'),numbers:[...root.querySelectorAll('[data-stats-number]')]}));
 stacks.forEach(({cards,links})=>links.forEach((link,i)=>link.addEventListener('click',event=>{
  if(reduce.matches)return;
  event.preventDefault();
  const list=cards[0].parentElement,top=list.getBoundingClientRect().top+scrollY;
  const gap=parseFloat(getComputedStyle(cards[0]).marginBottom)||0;
  const header=document.querySelector('.cx-header,.tp-header')?.getBoundingClientRect().height||0;
  scrollTo({top:top+i*(cards[0].offsetHeight+gap)-header-16,behavior:'auto'});
  history.replaceState(null,'',link.hash);clock.request();
 })));


 function draw(){const still=reduce.matches||paused,header=document.querySelector('.cx-header,.tp-header')?.getBoundingClientRect().height||0;
  layers.forEach(({root,stage,parts,phase})=>{const r=root.getBoundingClientRect();if(!still&&(r.top>innerHeight+300||r.bottom< -300))return;
   const p=still?1:clamp((header-r.top)/Math.max(1,root.offsetHeight-stage.offsetHeight));
   const spread=still?0:p<.45?ease(p/.45):1-ease((p-.65)/.27);
   parts.forEach((part,i)=>{part.style.transform=`translate(${root.dataset.variant==='C'?i*spread*4:0}px,${-(i*44-95)*spread}px)`;});
   phase.textContent=p===0?'Ready to explore':p<.45?'Layers separating':p<.65?'Every layer matters':p<.92?'Coming together':'Finished roof';
   root.dataset.motionProgress=p.toFixed(3);
  });
  stacks.forEach(({root,cards,links})=>{
   root.classList.toggle('mk-stack-ready',!still);
   const threshold=header+innerHeight*.28;
   let active=0;cards.forEach((card,i)=>{if(card.getBoundingClientRect().top<=threshold)active=i;});
   root.dataset.stackActive=String(active);
   links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
  });
  stats.forEach(({root,grid,photo,numbers})=>{
   const r=root.getBoundingClientRect();if(!still&&(r.top>innerHeight+300||r.bottom< -300))return;
   const p=still?1:ease((innerHeight*.88-grid.getBoundingClientRect().top)/Math.max(1,innerHeight*.48));
   const photoP=still?1:ease((innerHeight*1.2-photo.getBoundingClientRect().top)/Math.max(1,innerHeight*.55));
   root.classList.toggle('mk-stats-ready',!still);
   root.style.setProperty('--mk-reveal',`${((1-p)*100).toFixed(2)}%`);
   root.style.setProperty('--mk-photo-reveal',`${((1-photoP)*100).toFixed(2)}%`);
   root.dataset.motionProgress=p.toFixed(3);root.dataset.photoProgress=photoP.toFixed(3);
   numbers.forEach(number=>{const value=Number(number.dataset.statsNumber),decimals=Number(number.dataset.statsDecimals)||0;
    number.textContent=(decimals?Math.round(value*p*10)/10:Math.round(value*p)).toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
   });
  });
  words.forEach(({root,parts})=>{const r=root.getBoundingClientRect(),p=still?1:clamp((innerHeight*.86-r.top)/Math.max(1,innerHeight*.55));
   parts.forEach((part,i)=>{const q=clamp(p*parts.length-i);part.style.opacity=String(.36+.64*q);part.style.transform=`translateY(${(1-q)*3}px)`;});root.dataset.motionProgress=p.toFixed(3);
  });
 }
 clock.subscribe(draw);reduce.addEventListener('change',clock.request);mobile.addEventListener('change',clock.request);
 document.querySelector('.story-motion,[data-motion-toggle]')?.addEventListener('click',event=>{paused=event.currentTarget.getAttribute('aria-pressed')==='true';document.body.classList.toggle('mk-v2-paused',paused);clock.request()});
 document.querySelectorAll('[data-reveal-compare]').forEach(root=>{
  const canvas=root.querySelector('[data-compare-canvas]'),damage=root.querySelector('.mk-damage'),handle=root.querySelector('.mk-compare-handle'),range=root.querySelector('[data-compare-range]'),status=root.querySelector('[data-compare-status]'),badge=root.querySelector('[data-before-badge]'),variant=root.dataset.variant;
  let x=.5,y=.5,dragging=false,state=2;
  const drawCompare=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;
   if(variant==='C'){damage.style.clipPath=state===1?'inset(0)':'inset(0 100% 0 0)';badge.textContent=['Before storm','After storm','After repair'][state];}
   else if(variant==='B'){damage.style.clipPath=`circle(${Math.min(100,w*.24)}px at ${x*100}% ${y*100}%)`;}
   else{damage.style.clipPath=`inset(0 ${x*100}% 0 0)`;handle.style.transform=`translateX(${(1-x)*w}px)`;}
   if(range){range.value=String(Math.round(x*100));range.setAttribute('aria-valuetext',variant==='B'?`Inspection lens: ${Math.round(x*100)} percent across, ${Math.round(y*100)} percent down`:`After repair: ${Math.round(x*100)} percent`);}
  };
  function finished(){x=1;y=.5;state=2;root.classList.remove('mk-enhanced');damage.style.clipPath='inset(0 100% 0 0)';if(range){range.value='100';range.setAttribute('aria-valuetext','After repair: 100 percent');}status.textContent='After repair';root.querySelectorAll('[data-compare-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.compareState==='2')));}
  const update=()=>{root.classList.add('mk-enhanced');drawCompare();status.textContent=variant==='C'?['Before storm','After storm','After repair'][state]:variant==='B'?'Inspecting storm damage':`After repair: ${Math.round(x*100)}%`;};
  range?.addEventListener('input',()=>{x=+range.value/100;update()});
  function pointer(event){const b=canvas.getBoundingClientRect();x=clamp((event.clientX-b.left)/b.width);y=clamp((event.clientY-b.top)/b.height);if(variant==='A')x=1-x;update()}
  canvas.addEventListener('pointerdown',event=>{if(variant==='C')return;dragging=true;canvas.setPointerCapture(event.pointerId);pointer(event)});
  canvas.addEventListener('pointermove',event=>{if(dragging||(variant==='B'&&event.pointerType==='mouse'))pointer(event)});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{dragging=false});
  range?.addEventListener('keydown',event=>{if(variant==='B'&&(event.key==='ArrowUp'||event.key==='ArrowDown')){event.preventDefault();y=clamp(y+(event.key==='ArrowUp'?-.05:.05));update()}});
  root.querySelectorAll('[data-compare-state]').forEach(button=>button.addEventListener('click',()=>{state=+button.dataset.compareState;root.querySelectorAll('[data-compare-state]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update()}));
  new ResizeObserver(()=>{if(root.classList.contains('mk-enhanced'))drawCompare()}).observe(canvas);
  function accessibility(){if(reduce.matches)finished();else{x=.5;y=.5;update()}}
  reduce.addEventListener('change',accessibility);accessibility();
 });
 clock.request();
}
