// Scroll position is a target, not a seek command. Decode one eased seek at a time.
(()=>{
 const root=document.querySelector('[data-motion-kit]');if(!root)return;
 const c=JSON.parse(root.querySelector('[data-motion-config]').textContent),stage=root.querySelector('.tm-stage'),media=root.querySelector('.tm-media');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)');
 const clamp=n=>Math.max(0,Math.min(1,n)),toggle=root.querySelector('[data-motion-toggle]');
 let paused=false,frame=0,video=null,sequence=null,lastIndex=-1,inView=true,progress=0,loaded=false,generation=0;
 let decodedTime=0,landingOpacity=0,lastDraw=0,lastSeek=0;
 function clearMedia(){generation++;if(video){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();video=null;sequence=null;loaded=false;decodedTime=0;landingOpacity=0;lastSeek=0;root.classList.remove('tm-has-media');}
 function setup(){clearMedia();root.classList.toggle('tm-reduced',reduce.matches);root.classList.toggle('tm-mobile',mobile.matches);toggle.hidden=reduce.matches;const diagram=document.querySelector('.tm-diagram svg');if(diagram)diagram.setAttribute('viewBox',mobile.matches?'230 210 675 510':'0 0 1100 760');
  if(reduce.matches){schedule();return;}
  const mode=mobile.matches?'mobile':'desktop',mp4=c.media[mode],webm=c.media[mode+'Webm'];
  if(mp4||webm){
   const v=document.createElement('video'),token=generation;video=v;v.muted=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-hidden','true');
   const sources=v.canPlayType('video/mp4')?[mp4,webm]:[webm,mp4];let sourceIndex=0;const candidates=sources.filter(Boolean);
   function nextSource(){if(token!==generation)return;root.classList.remove('tm-has-media');loaded=false;decodedTime=0;if(sourceIndex<candidates.length){v.src=candidates[sourceIndex++];v.load();}else{media.replaceChildren();video=null;root.classList.add('tm-media-failed');schedule();}}
   v.addEventListener('loadeddata',()=>{if(token!==generation)return;loaded=true;decodedTime=v.currentTime;landingOpacity=0;root.classList.remove('tm-media-failed');root.classList.add('tm-has-media');schedule()});
   v.addEventListener('seeked',()=>{if(token===generation){decodedTime=v.currentTime;schedule()}});v.addEventListener('error',nextSource);media.append(v);nextSource();
  }else if(!mobile.matches&&c.media.sequence?.length){sequence=new Image();sequence.alt='';media.append(sequence);sequence.onerror=()=>{loaded=false;root.classList.remove('tm-has-media');schedule()};sequence.onload=()=>{loaded=true;root.classList.add('tm-has-media');schedule()};lastIndex=-1;}
  schedule();
 }
 function updateLanding(amount){
  root.style.setProperty('--landing-opacity',amount);root.classList.toggle('tm-landed',amount>.999);
  c.points.forEach(point=>{const a=root.querySelector('[data-roof-point="'+point.id+'"]');if(!a)return;
   a.hidden=amount<.999||mobile.matches||reduce.matches;
   const w=stage.clientWidth,h=stage.clientHeight,scale=Math.max(w/1920,h/1080),ox=(w-1920*scale)/2,oy=(h-1080*scale)/2;
   a.style.left=(ox+point.x/1100*1920*scale)+'px';a.style.top=(oy+(point.y-70.625)/618.75*1080*scale)+'px';
  });
 }
 function draw(now){frame=0;const dt=Math.min(50,Math.max(1,now-(lastDraw||now-16)));lastDraw=now;
  const rect=root.getBoundingClientRect(),h=stage.clientHeight,header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tp-header-height'))||0;
  if(reduce.matches)progress=1;else if(!paused)progress=clamp((header-rect.top)/Math.max(1,root.offsetHeight-h));
  const active=!paused&&inView&&!document.hidden&&!reduce.matches,end=video&&Number.isFinite(video.duration)?Math.max(0,video.duration-1/24):0;
  let moving=false;
  if(video&&loaded&&active&&end&&!video.seeking){
   const target=progress*end,error=target-video.currentTime;
   if(Math.abs(error)>.004){
    const elapsed=Math.min(64,Math.max(8,now-(lastSeek||now-16))),step=error*(1-Math.exp(-elapsed/120));
    // Bound even a scrollbar jump to <=4.32 source frames; the delivery GOP is six.
    video.currentTime=Math.abs(error)<.012?target:video.currentTime+Math.max(-.18,Math.min(.18,step));lastSeek=now;moving=true;
   }
  }
  if(sequence&&active){const index=Math.round(progress*(c.media.sequence.length-1));if(index!==lastIndex){lastIndex=index;sequence.src=c.media.sequence[index];}}
  const shown=end?clamp(decodedTime/end):progress;
  root.style.setProperty('--camera-progress',shown);root.querySelector('[data-camera-chapter]').textContent=(mobile.matches&&c.mobileChapters?c.mobileChapters:c.chapters)[Math.min(4,Math.floor(shown*5))];
  // Blend during the final 0.3 decoded seconds. A minimum real-time fade also
  // prevents a fast scroll or slow decoder from skipping the handover entirely.
  const blendSeconds=c.media.blendSeconds||.3,q=end?clamp((decodedTime-(end-blendSeconds))/blendSeconds):0;
  const desired=reduce.matches||!loaded?1:q*q*(3-2*q);
  if(!loaded||reduce.matches)landingOpacity=desired;
  else if(active){const delta=desired-landingOpacity;landingOpacity+=Math.max(-dt/300,Math.min(dt/300,delta));if(Math.abs(desired-landingOpacity)<.001)landingOpacity=desired;moving=moving||Math.abs(desired-landingOpacity)>.001;}
  updateLanding(landingOpacity);
  if(active&&(moving||video?.seeking))schedule();
  const anatomy=document.querySelector('[data-anatomy]');if(anatomy){const r=anatomy.getBoundingClientRect(),q=reduce.matches||paused?0:clamp((innerHeight-r.top)/(innerHeight+r.height));anatomy.style.setProperty('--anatomy-progress',q);}
  const timeline=document.querySelector('.tp-timeline');if(timeline){const r=timeline.getBoundingClientRect(),q=reduce.matches||paused?1:clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35));timeline.style.setProperty('--timeline-progress',q);[...timeline.children].forEach((step,i)=>step.classList.toggle('tm-step-active',q>i/4));}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
 toggle.addEventListener('click',()=>{paused=!paused;root.classList.toggle('tm-paused',paused);document.body.classList.toggle('tm-motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';schedule()});
 reduce.addEventListener('change',setup);mobile.addEventListener('change',setup);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;root.classList.toggle('tm-offscreen',!inView);if(inView)schedule()},{rootMargin:'100px'}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
 document.querySelectorAll('[data-roof-point],[data-anatomy-point],[data-roof-link]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();const target=document.querySelector(a.getAttribute('href'));target.open=true;target.scrollIntoView({block:'start',behavior:reduce.matches?'instant':'smooth'});target.querySelector('summary').focus({preventScroll:true});}));

 const anatomy=document.querySelector('[data-anatomy]'),xray=document.querySelector('[data-xray]');xray?.addEventListener('click',()=>{const active=xray.getAttribute('aria-pressed')!=='true';xray.setAttribute('aria-pressed',String(active));xray.textContent=active?'Show roof layers':'Show X-ray';anatomy.classList.toggle('tm-xray',active)});
 const decision=document.querySelector('[data-decision]');if(decision){const age=decision.querySelector('[data-age]'),damage=decision.querySelector('[data-damage]');const update=()=>{decision.querySelector('[data-age-output]').textContent=age.value+' years';decision.querySelector('[data-damage-output]').textContent=c.meter.damageLabels[+damage.value];const score=clamp(+age.value/c.meter.ageMax*c.meter.ageWeight + +damage.value/2*c.meter.damageWeight);decision.style.setProperty('--decision',score);decision.querySelector('[data-meter-result]').textContent=score<.4?'Start by discussing a focused repair.':score<.7?'Compare the repair scope with longer-term options.':'Ask whether broader replacement is worth considering.';};age.addEventListener('input',update);damage.addEventListener('input',update);update();}
 const once=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{if(!isIntersecting)return;target.classList.add('tm-entered');if(target.dataset.count&& !reduce.matches&&!paused){const end=+target.dataset.count,start=performance.now();const tick=now=>{const p=reduce.matches||paused?1:clamp((now-start)/850);target.textContent=String(Math.round(end*p))+(target.dataset.countSuffix||'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}once.unobserve(target)}),{threshold:.2});
 document.querySelectorAll('.tp-sign,[data-count],.tp-final,.tp-reviews').forEach(el=>once.observe(el));
 // Only existing source-backed reviews or explicitly labeled sales samples are moved.
 function reviewMotion(){document.querySelectorAll('.tp-reviews .tp-sample-reviews,.tp-reviews .review-grid:not(.source-review-grid)').forEach(track=>{if(track.dataset.motionReady||track.children.length<2)return;track.dataset.motionReady='true';const wrap=document.createElement('div');wrap.className='tm-review-window';track.before(wrap);wrap.append(track);track.classList.add('tm-review-track');const originals=[...track.children];originals.forEach(card=>{const copy=card.cloneNode(true);copy.classList.add('tm-review-copy');copy.setAttribute('aria-hidden','true');copy.inert=true;copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));wrap.firstChild.append(copy)});const button=document.createElement('button');button.type='button';button.className='tm-review-toggle';button.textContent='Pause reviews';button.setAttribute('aria-pressed','false');wrap.before(button);button.addEventListener('click',()=>{const stopped=wrap.classList.toggle('tm-review-paused');button.textContent=stopped?'Resume reviews':'Pause reviews';button.setAttribute('aria-pressed',String(stopped))});new IntersectionObserver(([entry])=>{track.style.animationPlayState=entry.isIntersecting?'':'paused'}).observe(wrap);});}
 reviewMotion();const reviewTarget=document.querySelector('[data-review-results]');if(reviewTarget)new MutationObserver(reviewMotion).observe(reviewTarget,{childList:true});
 setup();
})();
