/* Scroll only controls scene media and captions. Form DOM/state is never touched. */
(()=>{'use strict';
 const clamp=n=>n<=.000001?0:n>=.999999?1:n;
 document.querySelectorAll('[data-story-mode="build"],.craft-story').forEach(root=>{
  const hero=root.matches('[data-story-mode="build"]'),scene=hero?root.querySelector('.story-stage'):root.querySelector('[data-detail-scene]');
  const video=root.querySelector(hero?'[data-build-video]':'[data-detail-video]');if(!video||!scene)return;
  const buttons=[...root.querySelectorAll(hero?'[data-story-select]':'[data-detail-select]')];
  const captions=buttons.map(b=>b.textContent.replace(/^0[123]/,'').trim());
  const caption=root.querySelector(hero?'[data-build-phase]':'[data-detail-caption]'),counter=root.querySelector(hero?'[data-build-counter]':'[data-detail-counter]');
  const bar=root.querySelector(hero?'.build-progress span':'.detail-progress span'),pause=root.querySelector(hero?'.story-motion':'.detail-motion');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),source=video.querySelector('source');
  let target=0,nearby=false,paused=false,manual=false,manualY=0,raf=0,active=-1,failed=false,lastProgress=-1;
  const staticMode=()=>reduce.matches||!!navigator.connection?.saveData||failed;
  function setScene(progress){
   if(progress===lastProgress)return;lastProgress=progress;
   const i=progress===1?2:progress<.18?0:1;
   root.dataset.phase=String(i);root.style.setProperty('--scene-progress',progress.toFixed(4));
   if(!hero)root.style.setProperty('--outline-opacity',String(Math.max(0,.72-progress*3)));
   if(i!==active){active=i;buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));caption.textContent=captions[i];counter.textContent=`0${i+1} / 03`;}
   bar.style.transform=`scaleX(${progress})`;
  }
  function seek(){
   if(video.readyState<1||video.seeking||staticMode()||!Number.isFinite(video.duration)||video.duration<=0)return;
   // Seek inside the last decodable frame, not two frames short of the ending.
   // Read the real duration without assuming a frame rate or rounded runtime.
   const time=target===0?0:target===1?Math.max(0,video.duration-.001):target*video.duration;
   const tolerance=(target===0||target===1)?0.0005:0.003;
   if(Math.abs(video.currentTime-time)>tolerance){
    try{video.currentTime=time;}catch{return;} // Retry when metadata/data is ready.
   }
   if(!video.seeking&&video.readyState>=2)root.classList.add('film-ready');
  }
  function load(){if(hero&&root.dataset.lazyUntilScroll==='true'&&scrollY<1)return;if(staticMode()||source.hasAttribute('src'))return;source.src=source.dataset.src;video.preload='auto';video.load();}
  function fail(){if(!source.hasAttribute('src'))return;failed=true;root.classList.remove('film-ready');root.classList.add('static-story');pause.hidden=true;setScene(1);}
  // Coalesce rapid scroll changes while decoding, then always seek the newest
  // target. Native seeking state cannot get stuck like a separate JS flag can.
  for(const event of ['loadedmetadata','durationchange','loadeddata','canplay','progress','seeked'])video.addEventListener(event,seek);
  video.addEventListener('error',fail);source.addEventListener('error',fail);
  function update(){
   raf=0;if(paused||manual||staticMode())return;
   const rect=(hero?root:scene).getBoundingClientRect();
   const headerHeight=document.querySelector?.('.cx-header,.shared-site-header')?.getBoundingClientRect().height||0;
   if(hero){
    const travel=Math.max(1,rect.height-scene.getBoundingClientRect().height);
    const progress=clamp((headerHeight-rect.top)/travel);
    // The entire film fits inside the pinned interval, with a final-frame hold
    // before the next section enters. Fractional dimensions avoid rounding drift.
    target=clamp((progress-.04)/.8);
   }else{
    // Finish with the scene still in view, below the site header. The form
    // stays in normal flow and is never pinned or used to calculate progress.
    const start=Math.max(headerHeight+100,innerHeight*.7),end=Math.max(headerHeight+24,innerHeight*.18);
    target=clamp((start-rect.top)/Math.max(1,start-end));
   }
   root.dataset.scrollPosition=target===0?'start':target===1?'end':'playing';
   setScene(target);
   // Visibility only controls preloading, never timeline/end-point calculation.
   // A fast scroll, anchor jump or late metadata event must still settle at 0/1.
   if(nearby||(rect.top<innerHeight+600&&rect.bottom>-600))load();
   seek();
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(update);}
  function accessibility(){root.classList.toggle('static-story',staticMode());pause.hidden=staticMode();if(staticMode()){video.pause();setScene(1);}else{active=-1;lastProgress=-1;schedule();}}
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{if(staticMode())return;manual=true;manualY=scrollY;target=[0,.5,1][i];setScene(target);load();seek();}));
  pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume motion':'Pause motion';if(!paused){manual=false;schedule();}});
  addEventListener('scroll',()=>{if(manual&&Math.abs(scrollY-manualY)>24)manual=false;schedule();},{passive:true});
  addEventListener('resize',schedule,{passive:true});
  new IntersectionObserver(entries=>{nearby=entries[0].isIntersecting;schedule();},{rootMargin:'600px 0px'}).observe(hero?root:scene);
  if(typeof ResizeObserver!=='undefined'){const sizes=new ResizeObserver(schedule);sizes.observe(root);sizes.observe(scene);}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  reduce.addEventListener('change',accessibility);
  setScene(0);accessibility();
 });
})();
