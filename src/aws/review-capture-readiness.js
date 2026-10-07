// #028F: Joe-approved capture readiness only. No CSS, animation state or detector timing is changed.
export async function waitForCaptureReadiness(page){
 await page.evaluate(async()=>{
  const running=()=>document.getAnimations().filter(a=>{
   if(!(a instanceof CSSAnimation||a instanceof CSSTransition)||!['running','pending'].includes(a.playState)&&!a.pending)return false;
   const e=a.effect?.target;if(!(e instanceof Element)||!e.getClientRects().length)return false;
   const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&!e.closest('[hidden]');
  });
  const deadline=performance.now()+15000;
  while(true){
   const animations=running();
   if(animations.length){let timer;try{await Promise.race([Promise.all(animations.map(a=>a.finished.catch(()=>{}))),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Visible CSS animation did not settle before capture')),Math.max(0,deadline-performance.now()))})]);}finally{clearTimeout(timer)}}
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   if(!running().length)return;
   if(performance.now()>deadline)throw Error('Visible CSS animation did not settle before capture');
  }
 });
}
