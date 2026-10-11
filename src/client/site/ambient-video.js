// Shared ambient playback entry point. Existing trade theaters retain their behavior.
export function mountAmbientVideo(video,{lazy=false}={}){
 if(!lazy){const reduced=matchMedia('(prefers-reduced-motion:reduce)'),theater=video.closest('.film-theater');let visible=false,userPaused=false,automaticPause=false;const allow=()=>!reduced.matches&&!navigator.connection?.saveData;const pause=()=>{if(!video.paused){automaticPause=true;video.pause()}};const play=()=>{if(visible&&allow()&&!userPaused&&!document.hidden)video.play().catch(()=>{})};video.loop=true;video.muted=true;video.autoplay=allow();video.addEventListener('pause',()=>{if(!automaticPause&&visible&&!document.hidden)userPaused=true;automaticPause=false});video.addEventListener('play',()=>userPaused=false);video.addEventListener('timeupdate',()=>{if(theater.hasAttribute('data-pov-phase'))theater.dataset.povPhase=video.currentTime<3?'vision':video.currentTime<video.duration*.73?'work':'reveal';theater.classList.toggle('is-scan',video.currentTime>=3&&video.currentTime<8);theater.classList.toggle('is-playing',!video.paused)});new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?play():pause()},{threshold:.2}).observe(video);document.addEventListener('visibilitychange',()=>document.hidden?pause():play());reduced.addEventListener('change',()=>reduced.matches?pause():play());if(!allow())pause()
return;}
 const frame=video.closest('[data-ambient-frame]'),button=frame.querySelector('[data-ambient-toggle]'),status=frame.querySelector('[data-ambient-status]'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let near=false,visible=false,userPaused=false,failed=false,request=0;
 const allowed=()=>!reduced.matches&&!navigator.connection?.saveData;
 const state=(value,message)=>{frame.dataset.ambientState=value;if(status)status.textContent=message;};
 const stop=()=>{request++;video.pause();};
 const label=()=>{button.textContent=userPaused?'Play ambient clip':'Pause ambient clip';button.setAttribute('aria-pressed',String(userPaused));};
 const play=()=>{if(!visible||!allowed()||userPaused||failed||document.hidden||!video.getAttribute('src'))return;const n=++request;video.play().then(()=>{if(!visible||!allowed()||userPaused||document.hidden){video.pause();return;}state('playing','Ambient clip playing.');}).catch(()=>{if(n===request&&!failed){userPaused=true;label();state('paused','Still image shown. Play the clip when you choose.');}});};
 const load=()=>{if(!near||!allowed()||failed||!video.dataset.src||video.getAttribute('src'))return;state('loading','Loading clip. Still image remains visible.');const mobile=matchMedia('(max-width:760px)').matches,mp4=(mobile?video.dataset.srcMobile:undefined)||video.dataset.src,webm=(mobile?video.dataset.srcMobileWebm:undefined)||video.dataset.srcWebm;video.src=(video.canPlayType('video/mp4; codecs="avc1.42E01E"')?mp4:webm)||mp4;video.preload='auto';video.load();};
 video.muted=true;video.loop=true;video.playsInline=true;button.hidden=!allowed();label();
 video.addEventListener('playing',()=>{if(visible&&allowed()&&!userPaused&&!document.hidden)state('playing','Ambient clip playing.');else stop();});
 video.addEventListener('loadeddata',play);
 video.addEventListener('error',()=>{failed=true;stop();button.hidden=true;state('error','Clip unavailable. Still image shown.');});
 button.addEventListener('click',()=>{userPaused=!userPaused;label();if(userPaused){stop();state('paused','Ambient clip paused.');}else{load();play();}});
 const reset=()=>{if(!allowed()){stop();video.removeAttribute('src');video.load();button.hidden=true;state('poster','Still image shown.');}else{button.hidden=failed;load();play();}};
 new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near)load();},{rootMargin:'240px 0px'}).observe(frame);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();play();}else stop();},{threshold:.15}).observe(frame);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():play());reduced.addEventListener('change',reset);navigator.connection?.addEventListener?.('change',reset);reset();
}
