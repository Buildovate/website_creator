// Scroll-seek both orientations. One pending seek; the newest scroll position wins.
(()=>{
 const root=document.querySelector('[data-motion-kit]');if(!root)return;
 const c=JSON.parse(root.querySelector('[data-motion-config]').textContent),stage=root.querySelector('.tm-stage'),media=root.querySelector('.tm-media');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)');
 const clamp=n=>Math.max(0,Math.min(1,n)),toggle=root.querySelector('[data-motion-toggle]');
 const landing=root.querySelector('.tm-landing'),mask=root.querySelector('.tm-production-mask');
 let paused=false,frame=0,video=null,sequence=null,lastIndex=-1,inView=true,progress=0,loaded=false,generation=0;
 function clearMedia(){generation++;if(video){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();video=null;sequence=null;loaded=false;root.classList.remove('tm-has-media');}
 function setup(){clearMedia();root.classList.toggle('tm-reduced',reduce.matches);root.classList.toggle('tm-mobile',mobile.matches);toggle.hidden=reduce.matches;const diagram=document.querySelector('.tm-diagram svg');if(diagram)diagram.setAttribute('viewBox',mobile.matches?'230 210 675 510':'0 0 1100 760');
  if(reduce.matches){schedule();return;}
  const mode=mobile.matches?'mobile':'desktop',mp4=c.media[mode],webm=c.media[mode+'Webm'];
  if(mp4||webm){
   const v=document.createElement('video'),token=generation;video=v;v.muted=true;v.playsInline=true;v.preload='auto';v.poster=c.poster;v.setAttribute('aria-hidden','true');
   const sources=v.canPlayType('video/mp4')?[mp4,webm]:[webm,mp4];let sourceIndex=0;const candidates=sources.filter(Boolean);
   function nextSource(){if(token!==generation)return;root.classList.remove('tm-has-media');loaded=false;if(sourceIndex<candidates.length){v.src=candidates[sourceIndex++];v.load();}else{media.replaceChildren();video=null;root.classList.add('tm-media-failed');schedule();}}
   v.addEventListener('loadeddata',()=>{if(token!==generation)return;loaded=true;root.classList.remove('tm-media-failed');root.classList.add('tm-has-media');schedule()});
   v.addEventListener('seeked',()=>{if(token===generation)schedule()});v.addEventListener('error',nextSource);media.append(v);nextSource();
  }else if(!mobile.matches&&c.media.sequence?.length){sequence=new Image();sequence.alt='';media.append(sequence);sequence.onerror=()=>{loaded=false;root.classList.remove('tm-has-media');schedule()};sequence.onload=()=>{loaded=true;root.classList.add('tm-has-media');schedule()};lastIndex=-1;}
  schedule();
 }
 function updateLanding(p){
  // The last 8% blends the decoded end frame to the original, registered poster.
  const amount=reduce.matches||!loaded?1:clamp((p-(c.media.landingStart||.92))/(1-(c.media.landingStart||.92)));
  root.style.setProperty('--landing-opacity',amount);root.classList.toggle('tm-landed',amount>.98);
  c.points.forEach(point=>{const a=root.querySelector('[data-roof-point="'+point.id+'"]');if(!a)return;
   // The supplied clips have no synchronized tracking. Show registered poster anchors only at landing.
   a.hidden=amount<.99||mobile.matches||reduce.matches;
   const w=stage.clientWidth,h=stage.clientHeight,scale=Math.max(w/1920,h/1080),ox=(w-1920*scale)/2,oy=(h-1080*scale)/2;
   a.style.left=(ox+point.x/1100*1920*scale)+'px';a.style.top=(oy+(point.y-70.625)/618.75*1080*scale)+'px';
  });
 }
 function draw(){frame=0;const rect=root.getBoundingClientRect(),h=stage.clientHeight,header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tp-header-height'))||0;
  if(reduce.matches)progress=1;else if(!paused)progress=clamp((header-rect.top)/Math.max(1,root.offsetHeight-h));
  root.style.setProperty('--camera-progress',progress);root.querySelector('[data-camera-chapter]').textContent=c.chapters[Math.min(4,Math.floor(progress*5))];
  const filmProgress=clamp(progress/(c.media.landingStart||.92));
  if(video&&loaded&&!paused&&inView&&!document.hidden&&Number.isFinite(video.duration)&&!video.seeking){const target=filmProgress*Math.max(0,video.duration-1/24);if(Math.abs(video.currentTime-target)>.018)video.currentTime=target;}
  if(sequence&&!paused){const index=Math.round(filmProgress*(c.media.sequence.length-1));if(index!==lastIndex){lastIndex=index;sequence.src=c.media.sequence[index];}}
  // Never reveal a final static mask over a video that has not reached its landing frame.
  const decoded=video&&loaded?video.currentTime/Math.max(.01,video.duration-1/24):1;
  updateLanding(decoded>.99||!video?progress:Math.min(progress,.92));
  const anatomy=document.querySelector('[data-anatomy]');if(anatomy){const r=anatomy.getBoundingClientRect(),q=reduce.matches||paused?0:clamp((innerHeight-r.top)/(innerHeight+r.height));anatomy.style.setProperty('--anatomy-progress',q);}
  const timeline=document.querySelector('.tp-timeline');if(timeline){const r=timeline.getBoundingClientRect(),q=reduce.matches||paused?1:clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35));timeline.style.setProperty('--timeline-progress',q);[...timeline.children].forEach((step,i)=>step.classList.toggle('tm-step-active',q>i/4));}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
 toggle.addEventListener('click',()=>{paused=!paused;root.classList.toggle('tm-paused',paused);document.body.classList.toggle('tm-motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';schedule()});
 reduce.addEventListener('change',setup);mobile.addEventListener('change',setup);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;root.classList.toggle('tm-offscreen',!inView);if(inView)schedule()},{rootMargin:'100px'}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
 document.querySelectorAll('[data-roof-point],[data-anatomy-point]').forEach(a=>a.addEventListener('click',()=>{const target=document.querySelector(a.getAttribute('href'));target.open=true;target.querySelector('summary').focus({preventScroll:true});}));
 const anatomy=document.querySelector('[data-anatomy]'),xray=document.querySelector('[data-xray]');xray?.addEventListener('click',()=>{const active=xray.getAttribute('aria-pressed')!=='true';xray.setAttribute('aria-pressed',String(active));xray.textContent=active?'Show roof layers':'Show X-ray';anatomy.classList.toggle('tm-xray',active)});
 const decision=document.querySelector('[data-decision]');if(decision){const age=decision.querySelector('[data-age]'),damage=decision.querySelector('[data-damage]');const update=()=>{decision.querySelector('[data-age-output]').textContent=age.value+' years';decision.querySelector('[data-damage-output]').textContent=c.meter.damageLabels[+damage.value];const score=clamp(+age.value/c.meter.ageMax*c.meter.ageWeight + +damage.value/2*c.meter.damageWeight);decision.style.setProperty('--decision',score);decision.querySelector('[data-meter-result]').textContent=score<.4?'Start by discussing a focused repair.':score<.7?'Compare the repair scope with longer-term options.':'Ask whether broader replacement is worth considering.';};age.addEventListener('input',update);damage.addEventListener('input',update);update();}
 const once=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{if(!isIntersecting)return;target.classList.add('tm-entered');if(target.dataset.count&& !reduce.matches&&!paused){const end=+target.dataset.count,start=performance.now();const tick=now=>{const p=reduce.matches||paused?1:clamp((now-start)/850);target.textContent=String(Math.round(end*p))+(target.dataset.countSuffix||'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}once.unobserve(target)}),{threshold:.2});
 document.querySelectorAll('.tp-sign,[data-count],.tp-final,.tp-reviews').forEach(el=>once.observe(el));
 // Only existing source-backed reviews or explicitly labeled sales samples are moved.
 function reviewMotion(){document.querySelectorAll('.tp-reviews .tp-sample-reviews,.tp-reviews .review-grid:not(.source-review-grid)').forEach(track=>{if(track.dataset.motionReady||track.children.length<2)return;track.dataset.motionReady='true';const wrap=document.createElement('div');wrap.className='tm-review-window';track.before(wrap);wrap.append(track);track.classList.add('tm-review-track');const originals=[...track.children];originals.forEach(card=>{const copy=card.cloneNode(true);copy.classList.add('tm-review-copy');copy.setAttribute('aria-hidden','true');copy.inert=true;copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));wrap.firstChild.append(copy)});const button=document.createElement('button');button.type='button';button.className='tm-review-toggle';button.textContent='Pause reviews';button.setAttribute('aria-pressed','false');wrap.before(button);button.addEventListener('click',()=>{const stopped=wrap.classList.toggle('tm-review-paused');button.textContent=stopped?'Resume reviews':'Pause reviews';button.setAttribute('aria-pressed',String(stopped))});new IntersectionObserver(([entry])=>{track.style.animationPlayState=entry.isIntersecting?'':'paused'}).observe(wrap);});}
 reviewMotion();const reviewTarget=document.querySelector('[data-review-results]');if(reviewTarget)new MutationObserver(reviewMotion).observe(reviewTarget,{childList:true});
 setup();
})();
