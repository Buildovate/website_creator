// Shared service-page cinematic controller. No continuous desktop animation loop.
(()=>{
 const root=document.querySelector('[data-motion-kit]');if(!root)return;
 const c=JSON.parse(root.querySelector('[data-motion-config]').textContent),stage=root.querySelector('.tm-stage'),camera=root.querySelector('.tm-camera'),media=root.querySelector('.tm-media');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)');
 const clamp=n=>Math.max(0,Math.min(1,n));
 let paused=false,frame=0,video=null,sequence=null,lastIndex=-1,maskIndex=-1,inView=true;
 const mask=new Image();mask.className='tm-production-mask';mask.alt='';mask.hidden=true;stage.append(mask);mask.onerror=()=>{mask.hidden=true};mask.onload=()=>{mask.hidden=!root.classList.contains('tm-has-media')};;
 const toggle=root.querySelector('[data-motion-toggle]');
 function clearMedia(){if(video){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();video=null;sequence=null;mask.hidden=true;mask.removeAttribute('src');maskIndex=-1;root.classList.remove('tm-has-media');}
 function setup(){clearMedia();root.classList.toggle('tm-reduced',reduce.matches);root.classList.toggle('tm-mobile',mobile.matches);toggle.hidden=reduce.matches;
  if(reduce.matches||paused){schedule();return;}
  const src=mobile.matches?c.media.mobile:c.media.desktop;
  if(src){const v=document.createElement('video');video=v;v.muted=true;v.playsInline=true;v.preload='metadata';v.loop=mobile.matches;v.poster=c.poster;v.src=src;v.addEventListener('seeked',schedule);v.addEventListener('loadeddata',()=>{if(v!==video)return;root.classList.add('tm-has-media');if(mobile.matches&&inView)v.play().catch(()=>{root.classList.remove('tm-has-media');});schedule()});v.addEventListener('error',()=>{root.classList.remove('tm-has-media');v.pause()});media.append(v);}
  else if(!mobile.matches&&c.media.sequence?.length){sequence=new Image();sequence.alt='';media.append(sequence);sequence.onerror=()=>root.classList.remove('tm-has-media');sequence.onload=()=>root.classList.add('tm-has-media');lastIndex=-1;}
  schedule();
 }
 function cameraAt(t){const keys=c.camera;const b=keys.findIndex(k=>k.t>=t);if(b<=0)return keys[0];const a=keys[b-1],z=keys[b],p=(t-a.t)/(z.t-a.t),q=p*p*(3-2*p);return{x:a.x+(z.x-a.x)*q,y:a.y+(z.y-a.y)*q,scale:a.scale+(z.scale-a.scale)*q};}
 function draw(){frame=0;const rect=root.getBoundingClientRect(),h=stage.clientHeight,w=stage.clientWidth;const p=reduce.matches||paused?1:mobile.matches?1:clamp(-rect.top/Math.max(1,root.offsetHeight-h));const k=cameraAt(p);root.style.setProperty('--camera-progress',p);root.style.setProperty('--camera-y',k.y+'px');root.style.setProperty('--camera-x',k.x+'px');root.style.setProperty('--camera-scale',k.scale);root.style.setProperty('--cloud-opacity',Math.max(0,1-p*2.4));
  root.querySelector('[data-camera-chapter]').textContent=reduce.matches||paused?'A closer look at home':c.chapters[Math.min(4,Math.floor(p*5))];
  const scale=Math.min(w/1100,h/760),ox=(w-1100*scale)/2,oy=(h-760*scale)/2;
  c.points.forEach(point=>{const a=root.querySelector('[data-roof-point="'+point.id+'"]');let x=w/2+(ox+point.x*scale-w/2)*k.scale+k.x,y=h/2+(oy+point.y*scale-h/2)*k.scale+k.y;
   // Real footage needs supplied tracking keyframes, never guessed placeholder anchors.
   const tracking=point.tracking;if(root.classList.contains('tm-has-media')&&tracking?.length){const next=tracking.findIndex(v=>v.t>=p);const a=tracking[Math.max(0,next-1)],b=tracking[next<0?tracking.length-1:next],f=next<0?1:clamp((p-a.t)/Math.max(.0001,b.t-a.t));x=(a.x+(b.x-a.x)*f)*w;y=(a.y+(b.y-a.y)*f)*h;}
   const visible=p>.58&&!mobile.matches&&(!root.classList.contains('tm-has-media')||tracking?.length);a.hidden=!visible;a.style.left=x+'px';a.style.top=y+'px';
  });
  if(video&&!mobile.matches&&Number.isFinite(video.duration)&&video.readyState>=2&&!video.seeking){const time=p*Math.max(0,video.duration-.04);if(Math.abs(video.currentTime-time)>.05)video.currentTime=time;}
  if(sequence){const index=Math.round(p*(c.media.sequence.length-1));if(index!==lastIndex){lastIndex=index;sequence.src=c.media.sequence[index];}}
  if(root.classList.contains('tm-has-media')&&!mobile.matches){const masks=c.media.maskSequence||[],index=Math.round(p*Math.max(0,masks.length-1));const src=masks[index]||c.media.foreground;if(src&&index!==maskIndex){maskIndex=index;mask.src=src;}}
  if(!root.classList.contains('tm-has-media'))mask.hidden=true;
  const anatomy=document.querySelector('[data-anatomy]');if(anatomy){const r=anatomy.getBoundingClientRect(),q=reduce.matches||paused?0:clamp((innerHeight-r.top)/(innerHeight+r.height));anatomy.style.setProperty('--anatomy-progress',q);}
  const timeline=document.querySelector('.tp-timeline');if(timeline){const r=timeline.getBoundingClientRect(),q=reduce.matches||paused?1:clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35));timeline.style.setProperty('--timeline-progress',q);[...timeline.children].forEach((step,i)=>step.classList.toggle('tm-step-active',q>i/4));}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
 toggle.addEventListener('click',()=>{paused=!paused;root.classList.toggle('tm-paused',paused);document.body.classList.toggle('tm-motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';setup()});
 reduce.addEventListener('change',setup);mobile.addEventListener('change',setup);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);video?.addEventListener('seeked',schedule);
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;root.classList.toggle('tm-offscreen',!inView);if(video&&mobile.matches){if(inView&&!paused&&!reduce.matches)video.play().catch(()=>{});else video.pause();}},{rootMargin:'100px'}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(video){if(document.hidden)video.pause();else if(mobile.matches&&inView&&!paused&&!reduce.matches)video.play().catch(()=>{});}});
 document.querySelectorAll('[data-roof-point],[data-anatomy-point]').forEach(a=>a.addEventListener('click',()=>{const target=document.querySelector(a.getAttribute('href'));target.open=true;target.querySelector('summary').focus({preventScroll:true});}));
 const anatomy=document.querySelector('[data-anatomy]'),xray=document.querySelector('[data-xray]');xray?.addEventListener('click',()=>{const active=xray.getAttribute('aria-pressed')!=='true';xray.setAttribute('aria-pressed',String(active));xray.textContent=active?'Show roof layers':'Show X-ray';anatomy.classList.toggle('tm-xray',active)});
 const decision=document.querySelector('[data-decision]');if(decision){const age=decision.querySelector('[data-age]'),damage=decision.querySelector('[data-damage]');const update=()=>{decision.querySelector('[data-age-output]').textContent=age.value+' years';decision.querySelector('[data-damage-output]').textContent=c.meter.damageLabels[+damage.value];const score=clamp(+age.value/c.meter.ageMax*c.meter.ageWeight + +damage.value/2*c.meter.damageWeight);decision.style.setProperty('--decision',score);decision.querySelector('[data-meter-result]').textContent=score<.4?'Start by discussing a focused repair.':score<.7?'Compare the repair scope with longer-term options.':'Ask whether broader replacement is worth considering.';};age.addEventListener('input',update);damage.addEventListener('input',update);update();}
 const once=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{if(!isIntersecting)return;target.classList.add('tm-entered');if(target.dataset.count&& !reduce.matches&&!paused){const end=+target.dataset.count,start=performance.now();const tick=now=>{const p=reduce.matches||paused?1:clamp((now-start)/850);target.textContent=String(Math.round(end*p))+(target.dataset.countSuffix||'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}once.unobserve(target)}),{threshold:.2});
 document.querySelectorAll('.tp-sign,[data-count],.tp-final,.tp-reviews').forEach(el=>once.observe(el));
 // Only existing source-backed reviews or explicitly labeled sales samples are moved.
 function reviewMotion(){document.querySelectorAll('.tp-reviews .tp-sample-reviews,.tp-reviews .review-grid').forEach(track=>{if(track.dataset.motionReady||track.children.length<2)return;track.dataset.motionReady='true';const wrap=document.createElement('div');wrap.className='tm-review-window';track.before(wrap);wrap.append(track);track.classList.add('tm-review-track');const originals=[...track.children];originals.forEach(card=>{const copy=card.cloneNode(true);copy.classList.add('tm-review-copy');copy.setAttribute('aria-hidden','true');copy.inert=true;copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));wrap.firstChild.append(copy)});const button=document.createElement('button');button.type='button';button.className='tm-review-toggle';button.textContent='Pause reviews';button.setAttribute('aria-pressed','false');wrap.before(button);button.addEventListener('click',()=>{const stopped=wrap.classList.toggle('tm-review-paused');button.textContent=stopped?'Resume reviews':'Pause reviews';button.setAttribute('aria-pressed',String(stopped))});new IntersectionObserver(([entry])=>{track.style.animationPlayState=entry.isIntersecting?'':'paused'}).observe(wrap);});}
 reviewMotion();const reviewTarget=document.querySelector('[data-review-results]');if(reviewTarget)new MutationObserver(reviewMotion).observe(reviewTarget,{childList:true});
 setup();
})();
