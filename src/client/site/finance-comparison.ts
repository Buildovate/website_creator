import {comparePlans,money,prefillInquiry,type ComparedPlan} from '../../platform/financing-plans.ts';
import type {FinancingProgram} from '../../platform/constitution.ts';

export function mountFinanceComparison(root:HTMLElement) {
 const config=JSON.parse(root.dataset.financeConfig!) as {programs:FinancingProgram[];amount:number|null;downPercent:number};
 const cost=root.querySelector<HTMLInputElement>('[data-project-cost]')!;
 cost.type='text';cost.inputMode='decimal';cost.addEventListener('blur',()=>{const value=Number(cost.value.replace(/,/g,''));if(cost.value.trim()&&Number.isFinite(value))cost.value=value.toLocaleString('en-US',{maximumFractionDigits:2});});
 const slider=root.querySelector<HTMLInputElement>('[data-cost-slider]')!;
 const inquiry=document.querySelector<HTMLFormElement>('#lead-form');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Map<HTMLElement,number>();
 let selectedId='',chosen=false,statusTimer:ReturnType<typeof setTimeout>,plans:ComparedPlan[]=[];
 function showAmount(node:HTMLElement,value:number,animate:boolean) {
  node.dataset.largePayment=String(money(value).length>9);
  const previous=Number(node.dataset.value??value);node.dataset.value=String(value);
  cancelAnimationFrame(animations.get(node)||0);
  if(!animate||reduce.matches||previous===value){node.textContent=money(value);animations.delete(node);return;}
  const start=performance.now();
  const frame=(now:number)=>{const progress=Math.min(1,(now-start)/260);node.textContent=money(previous+(value-previous)*(1-(1-progress)**3));if(progress<1&&!reduce.matches)animations.set(node,requestAnimationFrame(frame));else{node.textContent=money(value);animations.delete(node);}};
  animations.set(node,requestAnimationFrame(frame));
 }
 function clearPrefill(){if(!inquiry)return;inquiry.querySelectorAll<HTMLInputElement>('[data-plan-field]').forEach(input=>input.value='');const summary=inquiry.querySelector<HTMLElement>('[data-plan-summary]');if(summary)summary.hidden=true;}
 function update(animate=true) {
  clearTimeout(statusTimer);
  const amount=cost.value.trim()?Number(cost.value.replace(/,/g,'')):NaN;
  const percent=Number(root.querySelector<HTMLInputElement>('[name=planDownPercent]:checked')!.value);
  try {plans=comparePlans(config.programs,amount,percent);root.querySelector<HTMLElement>('[data-finance-error]')!.textContent='';}
  catch(error){plans=[];clearPrefill();root.querySelector<HTMLElement>('[data-finance-error]')!.textContent=cost.value?(error as Error).message:'Enter a project cost to compare payments.';}
  if(plans.length&&!plans.some(p=>p.id===selectedId))selectedId=plans.find(p=>p.badges.includes('Lowest monthly'))?.id||'';
  const selected=plans.find(p=>p.id===selectedId);
  root.querySelector<HTMLElement>('[data-down-amount]')!.textContent=selected?money(selected.downPayment):'—';
  root.querySelectorAll<HTMLElement>('[data-plan-id]').forEach(card=>{
   const plan=plans.find(p=>p.id===card.dataset.planId),active=plan?.id===selectedId;
   card.classList.toggle('is-selected',!!active);card.querySelector<HTMLElement>('[data-selected-label]')!.hidden=!active;
   const payment=card.querySelector<HTMLElement>('[data-plan-monthly]')!;
   if(plan)showAmount(payment,plan.monthly,animate);else{cancelAnimationFrame(animations.get(payment)||0);animations.delete(payment);payment.textContent='—';delete payment.dataset.value;}
   card.querySelector<HTMLElement>('[data-plan-down]')!.textContent=plan?money(plan.downPayment):'—';
   card.querySelector<HTMLElement>('[data-plan-total]')!.textContent=plan?money(plan.totalCost):'—';
   const badges=card.querySelector<HTMLElement>('[data-plan-badges]')!;badges.replaceChildren(...(plan?.badges||[]).map(label=>{const span=document.createElement('span');span.textContent=label;return span;}));
   card.querySelector('[data-choose-plan]')!.setAttribute('aria-disabled',String(!plan));
  });
  root.querySelector<HTMLElement>('[data-breakdown-name]')!.textContent=selected?.name||'Enter a project cost';
  root.querySelector<HTMLElement>('[data-principal-bar]')!.style.width=(selected?selected.principal/selected.total*100:100)+'%';
  root.querySelector('[data-principal-chart]')!.setAttribute('aria-label',selected?`Principal ${money(selected.principal)}, interest ${money(selected.interest)}`:'Enter a project cost');
  root.querySelector<HTMLElement>('[data-principal]')!.textContent=selected?money(selected.principal):'—';
  root.querySelector<HTMLElement>('[data-interest]')!.textContent=selected?money(selected.interest):'—';
  if(chosen&&selected&&inquiry)prefillInquiry(inquiry,selected);
  statusTimer=setTimeout(()=>{root.querySelector<HTMLElement>('[data-finance-status]')!.textContent=selected?`Updated ${plans.length} plans. ${selected.name}: approximately ${money(selected.monthly)} per month with ${money(selected.downPayment)} down.`:'Enter a valid cost.';},350);
 }
 cost.addEventListener('input',()=>{if(cost.value&&Number.isFinite(Number(cost.value.replace(/,/g,'')))&&Number(cost.value.replace(/,/g,''))>0&&Number(cost.value.replace(/,/g,''))<=1000000){slider.min=String(Math.min(Number(slider.min),Number(cost.value.replace(/,/g,''))));slider.max=String(Math.max(Number(slider.max),Number(cost.value.replace(/,/g,''))));slider.value=cost.value.replace(/,/g,'');}update();});
 slider.addEventListener('input',()=>{cost.value=Number(slider.value).toLocaleString('en-US');update();});
 root.querySelectorAll<HTMLInputElement>('[name=planDownPercent]').forEach(input=>input.addEventListener('change',()=>update()));
 root.querySelectorAll<HTMLElement>('[data-plan-id]').forEach(card=>card.querySelector<HTMLAnchorElement>('[data-choose-plan]')!.addEventListener('click',event=>{
  const plan=plans.find(p=>p.id===card.dataset.planId);if(!plan){event.preventDefault();cost.focus();return;}
  selectedId=plan.id;chosen=true;update(false);if(inquiry){prefillInquiry(inquiry,plan);inquiry.querySelector<HTMLInputElement>('[name=name]')?.focus({preventScroll:true});}
 }));
 inquiry?.addEventListener('reset',()=>{chosen=false;clearPrefill();});
 reduce.addEventListener('change',()=>{if(reduce.matches)update(false);});
 update(false);
}
document.querySelectorAll<HTMLElement>('[data-service-finance]').forEach(mountFinanceComparison);
