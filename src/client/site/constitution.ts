import {financingEstimate,FINANCING_DISCLOSURE} from '../../platform/constitution.js';
const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
document.querySelectorAll<HTMLFormElement>('[data-financing-calculator]').forEach(form=>{
 const result=form.querySelector<HTMLElement>('[data-finance-result]')!;
 const rows=[...form.querySelectorAll<HTMLElement>('[data-finance-scenario]')];
 const status=form.querySelector<HTMLElement>('[data-comparison-status]')!;
 const value=(name:string)=>{const input=form.elements.namedItem(name) as HTMLInputElement;if(!input.value.trim())throw Error('Enter all four calculator values.');return Number(input.value);};
 const clearRows=()=>rows.forEach(row=>{row.querySelector('[data-scenario-payment]')!.textContent='—';row.querySelector('[data-scenario-total]')!.textContent='Calculate to update';(row.querySelector('[data-use-scenario]') as HTMLButtonElement).disabled=true;});
 const compare=()=>{
  let valid=0;
  for(const row of rows){const apr=row.querySelector<HTMLInputElement>('[data-scenario-apr]')!,term=row.querySelector<HTMLInputElement>('[data-scenario-months]')!,payment=row.querySelector('[data-scenario-payment]')!,detail=row.querySelector('[data-scenario-total]')!,use=row.querySelector<HTMLButtonElement>('[data-use-scenario]')!;
   use.disabled=true;payment.textContent='—';
   if(!apr.value.trim()||!term.value.trim()){detail.textContent='Enter an APR and term';continue;}
   try{const estimate=financingEstimate(value('amount'),value('downPayment'),Number(apr.value),Number(term.value));payment.textContent=money(estimate.monthly);detail.textContent=`${money(estimate.interest)} interest · ${money(estimate.total)} loan payments`;use.disabled=false;valid++;}
   catch(error){detail.textContent=error instanceof Error?error.message:'Check this example.';}
  }
  status.textContent=valid?`${valid} illustrations calculated for the same amount financed. Loan payments exclude the down payment and fees.`:'Add a valid project cost, down payment, and example terms to compare.';
 };
 const render=()=>{try{const estimate=financingEstimate(value('amount'),value('downPayment'),value('apr'),value('months'));result.replaceChildren();const label=document.createElement('span');label.textContent='Estimated monthly payment';const amount=document.createElement('strong');amount.textContent=money(estimate.monthly);const breakdown=document.createElement('div');breakdown.className='foundation-cost-breakdown';breakdown.setAttribute('aria-hidden','true');const principal=document.createElement('i');principal.style.width=(estimate.principal/estimate.total*100)+'%';breakdown.append(principal);const details=document.createElement('dl');for(const [name,number] of [['Amount financed',estimate.principal],['Estimated interest',estimate.interest],['Total loan payments',estimate.total],['Total including down payment',estimate.total+value('downPayment')]] as const){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=money(number);row.append(dt,dd);details.append(row);}const note=document.createElement('p');note.textContent='Illustration only. Blue: principal · Orange: interest. Fees are not included.';const legal=document.createElement('p');legal.textContent=value('apr')+'% APR · '+value('months')+' months';result.append(label,amount,legal,breakdown,details,note);}catch(error){result.textContent=error instanceof Error?error.message:'Check the calculator values.';}compare();};
 form.addEventListener('input',()=>{result.textContent='Assumptions changed. Calculate again to update your estimate.';clearRows();status.textContent='Assumptions changed. Recalculate before comparing.';});
 form.onsubmit=event=>{event.preventDefault();render();};
 form.querySelector('[data-finance-examples]')?.addEventListener('click',()=>{
  [[9.99,132],[7.99,73],[5.99,58],[0,18]].forEach(([apr,months],i)=>{rows[i].querySelector<HTMLInputElement>('[data-scenario-apr]')!.value=String(apr);rows[i].querySelector<HTMLInputElement>('[data-scenario-months]')!.value=String(months);});
  clearRows();compare();
 });
 form.querySelector('[data-finance-compare]')?.addEventListener('click',compare);
 rows.forEach(row=>row.querySelector('[data-use-scenario]')!.addEventListener('click',()=>{
  (form.elements.namedItem('apr') as HTMLInputElement).value=row.querySelector<HTMLInputElement>('[data-scenario-apr]')!.value;
  (form.elements.namedItem('months') as HTMLInputElement).value=row.querySelector<HTMLInputElement>('[data-scenario-months]')!.value;render();
 }));
});

document.querySelectorAll<HTMLFormElement>('[data-promotion-quiz]').forEach(form=>{
 let busy=false,sessionReady=false;
 const button=form.querySelector<HTMLButtonElement>('button')!,status=form.querySelector<HTMLElement>('[data-unlock-status]')!,original=button.innerHTML;
 const fail=(message:string)=>{status.replaceChildren();status.textContent=message;status.setAttribute('role','alert');status.focus();};
 form.onsubmit=async event=>{
  event.preventDefault();if(form.dataset.preview==='true'||busy)return;
  const answer=new FormData(form).get('answer');
  if(answer===null){fail('Choose an answer, then check your quiz.');form.querySelector<HTMLInputElement>('[name=answer]')?.focus();return;}
  busy=true;form.setAttribute('aria-busy','true');status.setAttribute('role','status');status.textContent='Checking your answer and saving completion…';button.style.minWidth=button.getBoundingClientRect().width+'px';button.textContent='Checking…';
  try{
   if(!sessionReady){const start=await fetch('/api/public/'+encodeURIComponent(form.dataset.slug!)+'/promotion-unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offerId:form.dataset.offer,action:'start'})});const ready=await start.json();if(!start.ok||!ready.ready)throw Error(ready.error||'The quiz could not start. Please try again.');sessionReady=true;}
   const response=await fetch('/api/public/'+encodeURIComponent(form.dataset.slug!)+'/promotion-unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offerId:form.dataset.offer,answer:Number(answer)})}),data=await response.json();
   if(!response.ok)throw Error(data.error||'The offer could not be unlocked.');
   if(!data.receipt?.id||!data.code)throw Error('Completion could not be confirmed. Please try again.');
   status.replaceChildren();const code=document.createElement('strong');code.textContent='Your code: '+data.code;
   const message=document.createElement('p');message.textContent=data.message;
   const receipt=document.createElement('p');receipt.className='foundation-completion';receipt.textContent='Completion reference: '+data.receipt.id;
   const expiry=document.createElement('p');expiry.textContent='Saved through '+new Date(data.receipt.expiresAt).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})+'.';
   const next=document.createElement('a');next.className='foundation-button';next.href='#contact';next.textContent='Ask about this offer';next.onclick=()=>document.querySelector<HTMLInputElement>('#contact [name=name]')?.focus({preventScroll:true});
   status.append(code,message,receipt,expiry,next);status.focus();
  }catch(error){fail(navigator.onLine?(error instanceof Error?error.message:'Please try again.'):'You’re offline. Reconnect and try again; your answer is still selected.');}
  finally{busy=false;form.removeAttribute('aria-busy');button.innerHTML=original;}
 };
});

// Content stays visible without JavaScript and with reduced motion enabled.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 document.body.classList.add('motion-ready');
 const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:.12});
 document.querySelectorAll('[data-reveal]').forEach(el=>reveals.observe(el));
}
document.querySelectorAll<HTMLElement>('[data-project-story]').forEach(section=>{
 const video=section.querySelector<HTMLVideoElement>('[data-story-film]')!,button=section.querySelector<HTMLButtonElement>('[data-motion-toggle]')!,chapters=[...section.querySelectorAll<HTMLElement>('.foundation-story-chapters span')];
 let paused=false,near=false,started=false,failed=false,raf=0,target=0;
 const draw=()=>{raf=0;if(!started||failed||paused||reduced.matches)return;const headerHeight=document.querySelector('.shared-site-header')?.getBoundingClientRect().height||0;section.style.setProperty('--foundation-header',headerHeight+'px');const rect=section.getBoundingClientRect(),travel=Math.max(1,rect.height-(window.innerHeight-headerHeight)),progress=Math.max(0,Math.min(1,(headerHeight-rect.top)/(travel*.86)));section.style.setProperty('--story-progress',String(progress));chapters.forEach((el,i)=>el.toggleAttribute('data-active',i===Math.min(2,Math.floor(progress*3))));if(Number.isFinite(video.duration)&&video.duration>0){target=progress*Math.max(0,video.duration-.001);if(!video.seeking&&Math.abs(video.currentTime-target)>.035)video.currentTime=target;}};
 const schedule=()=>{if(!raf&&started&&!failed&&!paused&&!reduced.matches)raf=requestAnimationFrame(draw);};
 const sync=()=>{video.pause();button.disabled=reduced.matches||failed;button.setAttribute('aria-pressed',String(paused));button.textContent=failed?'Project image shown':reduced.matches?'Reduced motion is on':paused?'Resume scroll animation':'Pause scroll animation';if(near&&!reduced.matches&&!video.getAttribute('src')){started=true;video.src=video.dataset.src!;video.preload='auto';video.load();}schedule();};
 button.addEventListener('click',()=>{paused=!paused;sync();});reduced.addEventListener('change',sync);
 video.addEventListener('loadedmetadata',schedule);video.addEventListener('seeked',()=>{if(!failed&&!paused&&!reduced.matches&&Math.abs(video.currentTime-target)>.035)video.currentTime=target;});
 video.addEventListener('error',()=>{failed=true;button.disabled=true;button.textContent='Project image shown';});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{near=entries[0].isIntersecting;sync();},{rootMargin:'350px'}).observe(section);else{near=true;sync();}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});sync();
});
