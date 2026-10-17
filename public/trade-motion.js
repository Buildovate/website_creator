// Progressive frame scrubbing. Only the selected viewport sequence is fetched.
(()=>{
 // One event-driven scheduler extends #004E for service films and homepage components.
 const subscribers=new Set();let scheduled=0;
 const request=()=>{if(!scheduled)scheduled=requestAnimationFrame(now=>{scheduled=0;subscribers.forEach(draw=>draw(now))})};
 const clock=window.TradeMotionScroll={request,subscribe(draw){subscribers.add(draw);request();return ()=>subscribers.delete(draw)}};
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)request()});
 const root=document.querySelector('[data-motion-kit]');if(!root)return;
 const c=JSON.parse(root.querySelector('[data-motion-config]').textContent),stage=root.querySelector('.tm-stage'),media=root.querySelector('.tm-media');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)');
 const clamp=n=>Math.max(0,Math.min(1,n)),toggle=root.querySelector('[data-motion-toggle]');
 let paused=false,frame=0,inView=false,progress=0,loaded=false,generation=0;
 let canvas=null,ctx=null,config=null,abort=null,blobs=[],bitmaps=new Map(),decoding=false,shownIndex=-1,lastDraw=0,landingOpacity=0,readyThrough=-1,targetIndex=0;
 const native=root.querySelector('[data-native-decoder]');let nativeHealthy=false,nativeStarted=false,resizeDirty=false;
 const frameURL=i=>i===config.count-1?(mobile.matches?c.mobilePoster:c.poster):config.base+String(i).padStart(3,'0')+'.webp';
 function clearMedia(){generation++;if(native){native.onloadeddata=null;native.onerror=null;native.querySelectorAll('source').forEach(s=>s.removeAttribute('src'));native.load()}nativeStarted=false;nativeHealthy=false;abort?.abort();bitmaps.forEach(b=>b.close());bitmaps.clear();blobs=[];media.replaceChildren();canvas=null;loaded=false;decoding=false;shownIndex=-1;readyThrough=-1;targetIndex=0;lastDraw=0;ctx=null;root._warmNative=null;root.classList.remove('tm-has-media');}
 async function paint(index){
  if(decoding||(!blobs[index]&&!nativeHealthy)||!ctx)return;
  const token=generation;decoding=true;
  try{if(nativeHealthy&&index<config.count-2){if(native.readyState<2)return;const time=c.media.nativeTimes[mobile.matches?'mobile':'desktop'][index];if(Math.abs(native.currentTime-time)>.002)await new Promise((resolve,reject)=>{const done=()=>{cleanup();resolve()},fail=()=>{cleanup();reject(Error('Native decode unavailable'))},cleanup=()=>{native.removeEventListener('seeked',done);native.removeEventListener('error',fail);abort.signal.removeEventListener('abort',fail)};native.addEventListener('seeked',done,{once:true});native.addEventListener('error',fail,{once:true});abort.signal.addEventListener('abort',fail,{once:true});native.currentTime=time});if(token!==generation)return;const crop=mobile.matches?c.media.nativeCrops[index]:null,ratio=native.videoWidth/720;const source=crop?{x:crop.left*ratio,y:crop.top*ratio,w:crop.width*ratio,h:crop.height*ratio}:{x:0,y:0,w:native.videoWidth,h:native.videoHeight};const scale=Math.max(canvas.width/source.w,canvas.height/source.h),w=source.w*scale,h=source.h*scale;ctx.drawImage(native,source.x,source.y,source.w,source.h,(canvas.width-w)/2,(canvas.height-h)/2,w,h);lastDraw=performance.now();shownIndex=index;loaded=true;resizeDirty=false;root.dataset.frame=String(index);root.classList.add('tm-has-media');return;}let bitmap=bitmaps.get(index);if(!bitmap){bitmap=await createImageBitmap(blobs[index]);if(token!==generation){bitmap.close();return;}bitmaps.set(index,bitmap);}
   // A decode completing after direction reversal must not take one stale step.
   if(shownIndex>=0&&index!==shownIndex&&Math.sign(index-shownIndex)!==Math.sign(targetIndex-shownIndex))return;
   const scale=Math.max(canvas.width/bitmap.width,canvas.height/bitmap.height),w=bitmap.width*scale,h=bitmap.height*scale;ctx.drawImage(bitmap,(canvas.width-w)/2,(canvas.height-h)/2,w,h);resizeDirty=false;lastDraw=performance.now();shownIndex=index;loaded=true;root.dataset.frame=String(index);root.classList.add('tm-has-media');
   // Keep compressed frames; cap decoded memory to eight frames on either device.
   while(bitmaps.size>8){const key=[...bitmaps.keys()].find(k=>k!==index);bitmaps.get(key).close();bitmaps.delete(key);}
  }catch{blobs[index]=null;}finally{if(token===generation){decoding=false;schedule();}}
 }
 function setup(){clearMedia();root.classList.toggle('tm-reduced',reduce.matches);root.classList.toggle('tm-mobile',mobile.matches);toggle.hidden=reduce.matches;
  const diagram=document.querySelector('.tm-diagram svg');if(diagram)diagram.setAttribute('viewBox',mobile.matches?'230 210 675 510':'0 0 1100 760');
  if(reduce.matches){schedule();return;}
  config=c.media.sequences?.[mobile.matches?'mobile':'desktop'];if(!config){schedule();return;}
  canvas=document.createElement('canvas');const box=stage.getBoundingClientRect(),dpr=devicePixelRatio||1;canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d',{alpha:false});media.append(canvas);
  abort=new AbortController();const signal=abort.signal,token=generation;
  nativeHealthy=!!native&&!!c.media.nativeVideo;root.dataset.mediaDelivery=nativeHealthy?'native-video':'frames';
  const order=Array.from({length:config.count},(_,i)=>i).filter(i=>!nativeHealthy||i>=config.count-2);
  function startNative(){if(!nativeHealthy||nativeStarted||!inView)return;nativeStarted=true;native.onloadeddata=()=>{if(token!==generation)return;readyThrough=config.count-1;schedule()};native.onerror=()=>{if(token!==generation)return;nativeHealthy=false;root.dataset.mediaDelivery='frames';readyThrough=-1;while(blobs[readyThrough+1])readyThrough++;order.push(...Array.from({length:config.count-2},(_,i)=>i));worker();worker()};native.querySelectorAll('source[data-src]').forEach(s=>s.src=s.dataset.src);native.load()}
  root._warmNative=startNative;
  async function worker(){while(order.length&&token===generation){
   if(document.hidden||!inView){await new Promise(r=>setTimeout(r,250));continue;}
   const index=order.shift();try{const r=await fetch(frameURL(index),{signal,priority:'low'});if(!r.ok)throw Error('Frame unavailable');const blob=await r.blob();if(token!==generation)return;blobs[index]=blob;while(blobs[readyThrough+1])readyThrough++;root.dataset.readyThrough=String(readyThrough);root.dataset.framesLoaded=String(blobs.filter(Boolean).length);schedule();}catch(e){if(e.name==='AbortError')return;root.dataset.frameError='true';}
   await new Promise(r=>setTimeout(r,35));
  }}
  // Let the server-rendered still paint before starting progressive requests.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(token===generation){startNative();worker();worker();}}));schedule();
 }
 function updateLanding(amount){
  root.style.setProperty('--landing-opacity',amount);root.classList.toggle('tm-landed',amount>.999);
  c.points.forEach(point=>{const a=root.querySelector('[data-roof-point="'+point.id+'"]');if(!a)return;
   a.hidden=amount<.999||mobile.matches||reduce.matches;
   const w=stage.clientWidth,h=stage.clientHeight,scale=Math.max(w/1920,h/1080),ox=(w-1920*scale)/2,oy=(h-1080*scale)/2;
   a.style.left=(ox+point.x/1100*1920*scale)+'px';a.style.top=(oy+(point.y-70.625)/618.75*1080*scale)+'px';
  });
 }
 function draw(now){frame=0;
  const rect=root.getBoundingClientRect(),h=stage.clientHeight,header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tp-header-height'))||0;
  if(reduce.matches)progress=1;else if(!paused)progress=clamp((header-rect.top)/Math.max(1,root.offsetHeight-h));
  root._warmNative?.();if(resizeDirty&&shownIndex>=0)paint(shownIndex);
  const active=!paused&&inView&&!document.hidden&&!reduce.matches;
  if(config&&active){
   targetIndex=Math.min(Math.round(progress*(config.count-1)),readyThrough);
   // Traverse adjacent available frames, equally in either direction. Never leap
   // over a hole in the downloaded prefix or skip poses on a fast scroll.
   const next=shownIndex<0?0:shownIndex+Math.sign(targetIndex-shownIndex);
   if(targetIndex>=0&&next!==shownIndex){
    if(now-lastDraw>=1000/30)paint(next);
    schedule();
   }
  }
  const shown=loaded?shownIndex/(config.count-1):progress;
  root.style.setProperty('--camera-progress',shown);root.querySelector('[data-camera-chapter]').textContent=(mobile.matches&&c.mobileChapters?c.mobileChapters:c.chapters)[Math.min(4,Math.floor(shown*5))];
  // The last canvas bitmap and the landing image use exactly the same still bytes.
  landingOpacity=reduce.matches?1:loaded?clamp(shownIndex-(config.count-2)):0;
  updateLanding(landingOpacity);
  const anatomy=document.querySelector('[data-anatomy]');if(anatomy){const r=anatomy.getBoundingClientRect(),q=reduce.matches||paused?0:clamp((innerHeight-r.top)/(innerHeight+r.height));anatomy.style.setProperty('--anatomy-progress',q);}
  const timeline=document.querySelector('.tp-timeline');if(timeline){const r=timeline.getBoundingClientRect(),q=reduce.matches||paused?1:clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35));timeline.style.setProperty('--timeline-progress',q);[...timeline.children].forEach((step,i)=>step.classList.toggle('tm-step-active',q>i/4));}
 }
 function schedule(){if(!frame){frame=1;clock.request()}}
 clock.subscribe(draw);
 toggle.addEventListener('click',()=>{paused=!paused;root.classList.toggle('tm-paused',paused);document.body.classList.toggle('tm-motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';schedule()});
 reduce.addEventListener('change',setup);mobile.addEventListener('change',setup);
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
 new ResizeObserver(()=>{if(!canvas||!ctx)return;const box=stage.getBoundingClientRect(),dpr=devicePixelRatio||1,w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;resizeDirty=true;schedule()}}).observe(stage);
 setup();
})();
