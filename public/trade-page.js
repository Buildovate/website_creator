// Progressive enhancement shared by premium trade pages.
(()=> {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const header=document.querySelector('.tp-header');
 if(header&&'ResizeObserver' in window)new ResizeObserver(()=>document.documentElement.style.setProperty('--tp-header-height',header.getBoundingClientRect().height+'px')).observe(header);
 const items=[...document.querySelectorAll('[data-reveal]')];
 if(!reduce.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('tp-pending');observer.unobserve(entry.target)}}),{threshold:.12});
  items.forEach(item=>{item.classList.add('tp-pending');observer.observe(item)});
  reduce.addEventListener('change',()=>{if(reduce.matches){items.forEach(item=>item.classList.remove('tp-pending'));observer.disconnect()}});
 }
 document.querySelectorAll('[data-comparison]').forEach(box=>{
  const range=box.querySelector('input[type=range]');if(!range)return;
  const update=()=>{box.style.setProperty('--split',range.value+'%');range.setAttribute('aria-valuetext',range.value+' percent before image')};
  range.addEventListener('input',update);update();
 });
 document.querySelectorAll('.tp-menu a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.tp-menu').removeAttribute('open')));
})();// Service-page conversion controls share the existing inquiry and unlock transport.
(()=>{
 const inquiry=document.querySelector('#lead-form');
 const focusInquiry=()=>{const name=inquiry?.querySelector('[name=name]');name?.focus({preventScroll:true});};
 document.querySelectorAll('[data-finance-interest]').forEach(a=>a.addEventListener('click',()=>{const interest=inquiry?.querySelector('[name=financingInterest]');if(interest)interest.checked=true;focusInquiry();}));
 document.querySelectorAll('[data-service-finance]').forEach(form=>{
  form.addEventListener('input',()=>{form.querySelector('[data-monthly]').textContent='Update to recalculate';form.querySelector('[data-finance-total]').textContent='';});
  form.addEventListener('submit',event=>{event.preventDefault();const amount=Number(form.elements.amount.value),down=Number(form.elements.downPayment.value),apr=Number(form.dataset.apr),months=Number(form.dataset.months),error=form.querySelector('[data-finance-error]');
   if(!Number.isFinite(amount)||amount<=0||amount>1000000||!Number.isFinite(down)||down<0||down>=amount){error.textContent='Enter a project cost above zero and a smaller down payment.';form.querySelector('[data-monthly]').textContent='Check your inputs';return;}
   error.textContent='';const principal=amount-down,rate=apr/1200,payment=rate===0?principal/months:principal*rate/(-Math.expm1(-months*Math.log1p(rate))),total=payment*months;
   form.querySelector('[data-monthly]').textContent='$'+payment.toFixed(2)+'/mo';form.querySelector('[data-finance-total]').textContent=months+' payments · Total loan payments $'+total.toFixed(2)+' · Interest $'+(total-principal).toFixed(2)+' · Down payment $'+down.toFixed(2);
  });
 });
 document.querySelectorAll('[data-service-promo]').forEach(form=>{
  const button=form.querySelector('button'),status=form.querySelector('[data-promo-status]'),link=form.querySelector('[data-promo-inquiry]');
  form.addEventListener('submit',async event=>{event.preventDefault();if(form.dataset.preview==='true'&&form.dataset.salesPreview!=='true')return;button.disabled=true;status.textContent='Checking your answer…';link.hidden=true;
   try{const answer=form.querySelector('[name=answer]:checked');if(!answer)throw Error('Choose an answer.');const prefix=form.dataset.salesPreview==='true'?'/api/sales-preview/':'/api/public/';const headers={'content-type':'application/json'};if(form.dataset.salesPreview==='true'){const session=await fetch('/api/session').then(r=>r.json());if(session.csrfToken)headers['x-csrf-token']=session.csrfToken;}const response=await fetch(prefix+encodeURIComponent(form.dataset.slug)+'/promotion-unlock',{method:'POST',headers,body:JSON.stringify({offerId:form.dataset.offer,answer:Number(answer.value),serviceName:form.dataset.service})});const result=await response.json();if(!response.ok)throw Error(result.error||'This offer could not be unlocked.');const code=inquiry?.querySelector('[name=promotionCode]');if(code)code.value=result.code;status.textContent=(form.dataset.salesPreview==='true'?'SAMPLE · ':'')+'Your unlocked code: '+result.code+'. '+result.message;link.hidden=false;
   }catch(error){status.textContent=error.message;}finally{button.disabled=false;}
  });
  link.addEventListener('click',focusInquiry);
 });
})();
