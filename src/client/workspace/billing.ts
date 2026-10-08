export type PaymentButtonState = { sku: string; connected: boolean; label?: string };

function escapeHtml(value: string): string {
  const entities: Record<string,string> = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  return value.replace(/[&<>"']/g, character => entities[character]);
}

export function renderBuyButton({ sku, connected, label = 'Buy' }: PaymentButtonState): string {
  const safeSku = escapeHtml(sku);
  const safeLabel = escapeHtml(label);
  if (!connected) return `<div class="bv-payment-action" data-sku="${safeSku}"><button type="button" class="bv-button" disabled aria-describedby="payment-state-${safeSku}">${safeLabel}</button><p id="payment-state-${safeSku}" role="status">Payments not connected</p></div>`;
  return `<div class="bv-payment-action" data-sku="${safeSku}"><button type="button" class="bv-button" data-buy-sku="${safeSku}">${safeLabel}</button></div>`;
}

export function renderPaymentStatus(status: 'active'|'past_due'|'canceled'|'none'): string {
  return status === 'past_due' ? '<div class="bv-payment-banner" role="status">Payment is past due. Your features remain available while we resolve billing.</div>' : '';
}

export type BillingReceipt={sku:string;amountCents:number;paidAt:string;status:string;invoiceUrl:string|null;receiptUrl:string|null};
export type BillingSummary={plan:string|null;status:'active'|'past_due'|'canceled'|'none';renewsAt:string|null;renewalAmountCents:number|null;minimumMonths:number;minimumEndsAt:string|null;buyoutAmountCents:number;hosting:{amountCents:number;status:string}|null;paymentMethod:string;portalState:string;receipts:BillingReceipt[];access:Record<string,{allowed:boolean;plan:string}>;connectionState:string};
const money=(cents:number)=>`$${(cents/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const date=(value:string|null)=>value?new Date(value).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}):'Not scheduled';
function safeStripeLink(value:string|null,label:string){
  if(!value)return '';
  try{const url=new URL(value);if(url.protocol==='https:'&&(url.hostname==='stripe.com'||url.hostname.endsWith('.stripe.com')))return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`}catch{}
  return '';
}
export function renderBillingSummary(data:BillingSummary):string{
  const plan=data.plan==='all_in'?'All-in':data.plan?data.plan[0].toUpperCase()+data.plan.slice(1):'No active plan';
  const renewal=data.renewalAmountCents===null?'Not scheduled':money(data.renewalAmountCents);
  const receipts=data.receipts.length?data.receipts.map(item=>`<li class="bv-billing-receipt"><div><strong>${escapeHtml(item.sku)}</strong><span>${money(item.amountCents)} · ${date(item.paidAt)} · ${escapeHtml(item.status)}</span></div><div>${safeStripeLink(item.invoiceUrl,'Invoice')}${safeStripeLink(item.receiptUrl,'Receipt')||(!item.invoiceUrl?'<span>Hosted receipt pending</span>':'')}</div></li>`).join(''):'<li>No verified payments yet.</li>';
  const owned=data.plan==='Owner';
  const monthly=data.minimumEndsAt!==null&&!owned;
  const minimum=monthly?`<div><dt>Rental minimum</dt><dd>${data.minimumMonths} months, ending ${date(data.minimumEndsAt)}</dd></div>`:'';
  const ownership=owned?'':`<article class="bv-card"><h3>Own your website</h3><p>One-time ownership buyout: <strong>${money(data.buyoutAmountCents)}</strong>. This is a flat price, with no credit for rental months paid.</p><p>Ownership ordering is coming later. No charge starts here.</p></article>`;
  const locked=Object.entries(data.access).find(([,entry])=>!entry.allowed&&['growth','all_in'].includes(entry.plan));
  const offer=locked?renderLockedUpsellCard({tenantId:'billing',feature:locked[0],plan:locked[1].plan,currentPlan:data.plan}):'';
  return `<section class="bv-billing" aria-labelledby="bv-billing-title"><p class="eyebrow">YOUR ACCOUNT</p><h2 id="bv-billing-title">Billing</h2>${renderPaymentStatus(data.status)}${data.connectionState==='not_connected'?'<p class="bv-callout bv-callout-warning" role="status">Payments not connected. You can review your plan here; no charge can start.</p>':''}<div class="bv-billing-grid"><article class="bv-card"><h3>Current plan</h3><p class="bv-billing-value">${escapeHtml(plan)}</p><p>${owned?'Owned website':'Rental website'}</p><dl><div><dt>Status</dt><dd>${escapeHtml(data.status.replace('_',' '))}</dd></div><div><dt>Next charge</dt><dd>${date(data.renewsAt)} · ${renewal}</dd></div>${minimum}</dl>${data.hosting?`<p>Owner hosting: ${money(data.hosting.amountCents)} per month · ${escapeHtml(data.hosting.status.replace('_',' '))}</p>`:''}</article><article class="bv-card"><h3>Payment method</h3><p>${escapeHtml(data.paymentMethod)}</p><p>Card updates and invoices use the secure Stripe Customer Portal when it is connected.</p>${data.portalState==='not_connected'?'<button type="button" disabled aria-describedby="bv-portal-state">Manage payment method</button><p id="bv-portal-state">Payments not connected</p>':'<button type="button" disabled aria-describedby="bv-portal-state">Manage payment method</button><p id="bv-portal-state">Portal setup pending</p>'}</article></div>${ownership}<section class="bv-card"><h3>Other plans</h3><p>Growth: Price coming soon</p><p>All-in: Price coming soon</p></section>${offer}<section class="bv-card"><h3>Receipts</h3><p>Only payments confirmed by the payment provider appear here.</p><ul class="bv-billing-receipts">${receipts}</ul></section></section>`;
}

export function offerStorageKey(tenantId:string,feature:string){return `bv-closed-offer:${tenantId}:${feature}`;}
export function renderLockedUpsellCard({tenantId,feature,plan,currentPlan=null,dismissed=false,alreadyShown=false,screen='normal'}:{tenantId:string;feature:string;plan:string;currentPlan?:string|null;dismissed?:boolean;alreadyShown?:boolean;screen?:string}):string{
  if(dismissed||alreadyShown||['error','alert','stalled','help'].includes(screen)||currentPlan==='all_in'||!['growth','all_in'].includes(plan))return '';
  const title=plan==='growth'?'Included in Growth':'Included in All-in';
  return `<aside class="bv-offer" data-bv-offer="${escapeHtml(feature)}"><h2>${title}</h2><p>This feature is locked on your current plan.</p><p class="bv-meta">Coming soon · No price or purchase is available yet.</p><a href="#bv-billing-title">View Billing</a><button type="button" class="bv-offer-dismiss" data-bv-dismiss-offer="${escapeHtml(offerStorageKey(tenantId,feature))}">Dismiss this offer</button></aside>`;
}
const installed=new WeakSet<EventTarget>();
export function installUpsellDismissal(root:Document=document,storage:Storage=localStorage):void{
  if(installed.has(root))return;installed.add(root);
  root.addEventListener('click',event=>{const button=(event.target as Element)?.closest?.('[data-bv-dismiss-offer]') as HTMLElement|null;if(!button)return;const key=button.dataset.bvDismissOffer;if(key)storage.setItem(key,'1');button.closest('[data-bv-offer]')?.remove();});
}
