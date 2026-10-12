(()=>{const body=document.body,main=body.querySelector('main');if(!main)return;
 const mode=body.dataset.sectionOrder,about=main.querySelector(':scope > #about'),portfolio=main.querySelector(':scope > .kit-portfolio'),ribbon=main.querySelector(':scope > .service-area-ribbon'),services=main.querySelector(':scope > #services');
 if(mode==='people'&&about&&services)services.after(about);
 if(mode==='projects'&&portfolio&&services){services.after(portfolio);if(ribbon)portfolio.before(ribbon);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!reduced){const observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('invitation-seen');observer.unobserve(x.target)}}),{threshold:.6});document.querySelectorAll('.inquiry-invitation').forEach(el=>observer.observe(el));}
})();
