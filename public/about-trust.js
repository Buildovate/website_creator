// Keep final facts in the HTML and accessibility tree; animate visual numerals only.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),nodes=[...document.querySelectorAll('[data-trust-count]')];
 const running=new Map();
 const finish=node=>{const id=running.get(node);if(id)cancelAnimationFrame(id);running.delete(node);node.textContent=node.dataset.trustFinal;};
 if(reduce.matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>entries.forEach(({target:node,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(node);const goal=Number(node.dataset.trustCount),decimals=Number(node.dataset.trustDecimals||0),start=performance.now();const frame=now=>{if(reduce.matches){finish(node);return;}const progress=Math.min((now-start)/900,1);node.textContent=(goal*(1-(1-progress)**3)).toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});if(progress<1)running.set(node,requestAnimationFrame(frame));else finish(node);};running.set(node,requestAnimationFrame(frame));}),{threshold:.5});
 nodes.forEach(node=>observer.observe(node));
 reduce.addEventListener('change',()=>{if(reduce.matches){observer.disconnect();nodes.forEach(finish);}});
})();
