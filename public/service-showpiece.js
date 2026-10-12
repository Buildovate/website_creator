// Progressive enhancement: the complete labeled assembly is the static baseline.
document.querySelectorAll('[data-compare]').forEach(el=>{const input=el.querySelector('[data-compare-range]');if(!input)return;el.classList.add('sd-compare-ready');const update=()=>el.style.setProperty('--split',input.value+'%');input.addEventListener('input',update);update();});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=[...document.querySelectorAll('[data-ar-scene]')];
let queued=false;
function draw(){queued=false;for(const scene of scenes){if(reduced.matches||scene.dataset.paused==='true')continue;const rect=scene.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)continue;const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));scene.style.setProperty('--ar-progress',progress.toFixed(4));scene.classList.add('ar-moving');}}
function schedule(){if(!queued){queued=true;requestAnimationFrame(draw);}}
for(const scene of scenes){const toggle=scene.querySelector('[data-ar-toggle]');toggle.hidden=reduced.matches;toggle.addEventListener('click',()=>{const paused=scene.dataset.paused!=='true';scene.dataset.paused=String(paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume movement':'Pause movement';if(!paused)schedule();});}
reduced.addEventListener('change',()=>{for(const scene of scenes){scene.classList.remove('ar-moving');scene.querySelector('[data-ar-toggle]').hidden=reduced.matches;}schedule();});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);schedule();
