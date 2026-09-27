import {financingEstimate, type FinancingProgram} from './constitution.ts';

export const money = (value:number) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
export function comparePlans(programs:FinancingProgram[], amount:number, downPercent:number) {
  if (![0,10,20].includes(downPercent)) throw new Error('Choose no down payment, 10% or 20%.');
  const downPayment = Math.round(amount * downPercent) / 100;
  const plans = programs.map(program => {
    const estimate = financingEstimate(amount,downPayment,program.apr,program.months);
    return {...program,...estimate,amount,downPayment,downPercent,totalCost:estimate.total + downPayment};
  });
  const lowestMonthly = Math.min(...plans.map(p => Math.round(p.monthly * 100)));
  const leastTotal = Math.min(...plans.map(p => Math.round(p.totalCost * 100)));
  return plans.map(p => ({...p,badges:[
    ...(Math.round(p.monthly * 100) === lowestMonthly ? ['Lowest monthly'] : []),
    ...(p.apr === 0 ? ['No interest'] : []),
    ...(Math.round(p.totalCost * 100) === leastTotal ? ['Least total cost'] : []),
  ]}));
}
export type ComparedPlan = ReturnType<typeof comparePlans>[number];
export function planPrefill(plan:ComparedPlan) {
  return {financingPlan:plan.name,financingPlanId:plan.id,financingMonthly:plan.monthly.toFixed(2),
    financingAmount:plan.amount.toFixed(2),financingDown:plan.downPayment.toFixed(2),
    financingTerms:`${plan.apr}% APR / ${plan.months} months${plan.deferredInterest ? ' / Deferred interest' : ''}`};
}
export function prefillInquiry(form:HTMLFormElement, plan:ComparedPlan) {
  for (const [name,value] of Object.entries(planPrefill(plan))) {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    if (input) input.value = value;
  }
  const interest = form.elements.namedItem('financingInterest') as HTMLInputElement | null;
  if (interest) interest.checked = true;
  const summary = form.querySelector<HTMLElement>('[data-plan-summary]');
  if (summary) { summary.hidden = false; summary.textContent = `${plan.name} · approximately ${money(plan.monthly)}/mo · ${money(plan.amount)} project · ${money(plan.downPayment)} down · ${plan.apr}% APR / ${plan.months} months${plan.deferredInterest?' · Deferred interest':''}. Estimate only; subject to approval.`; }
}
