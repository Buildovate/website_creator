const reduce=matchMedia('(prefers-reduced-motion:reduce)');
document.querySelectorAll('[data-roof-next]').forEach(section=>{
 const frames=[...section.querySelectorAll('[data-next-frame]')],steps=[...section.querySelectorAll('[data-next-step]')];let raf=0;
 const update=()=>{raf=0;section.toggleAttribute('data-next-enhanced',!reduce.matches);if(reduce.matches)return;const r=section.getBoundingClientRect(),index=Math.max(0,Math.min(3,Math.floor((innerHeight*.8-r.top)/Math.max(1,r.height)*4)));section.style.setProperty('--route-reveal',r.top<innerHeight*.8?'0':'100');frames.forEach((frame,i)=>frame.toggleAttribute('data-current',i===index));steps.forEach((step,i)=>step.toggleAttribute('data-current',i===index));};
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});addEventListener('resize',update);reduce.addEventListener('change',update);update();
});
