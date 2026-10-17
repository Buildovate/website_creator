// Defer bytes, never detail. The original full-quality URLs remain the only sources.
(()=>{
 const load=el=>{
  if(el.dataset.mediaPoster){el.poster=el.dataset.mediaPoster;delete el.dataset.mediaPoster;}
  if(el.dataset.mediaSrcset){el.srcset=el.dataset.mediaSrcset;delete el.dataset.mediaSrcset;}
  if(el.dataset.mediaSrc){el.src=el.dataset.mediaSrc;delete el.dataset.mediaSrc;}
  el.dataset.mediaReady='true';
 };
 const nodes=document.querySelectorAll('[data-media-deferred]');
 if(!('IntersectionObserver' in window)){nodes.forEach(load);return;}
 const warm=new IntersectionObserver(entries=>{for(const {target,isIntersecting} of entries)if(isIntersecting){load(target);warm.unobserve(target)}},{rootMargin:'300px 0px'});
 nodes.forEach(el=>warm.observe(el));
})();
