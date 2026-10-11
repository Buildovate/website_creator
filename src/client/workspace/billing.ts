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
  return status === 'past_due' ? '<div class="bv-payment-banner" role="status">Payment is past due. Your site stays live for seven days. Update payment before day 8 to keep your site and editor available.</div>' : '';
}

export type BillingReceipt={sku:string;amountCents:number;paidAt:string;status:string;invoiceUrl:string|null;receiptUrl:string|null};
export type BillingRental={kind:'monthly'|'annual'|'owned'|'none';currentSku:string|null;periodEnd:string|null;cancel:{allowed:boolean;minimumEndsAt:string|null;periodEnd:string;scheduled:boolean;reason:string|null;noRefund:boolean;siteComesDown:boolean;siteExport:boolean;domainRetained:boolean;dataHoldDays:number}|null;switchTargets:{sku:string;priceCents:number;cadence:string}[]};
export type BillingSummary={tenantId:string;plan:string|null;status:'active'|'past_due'|'canceled'|'none';renewsAt:string|null;renewalAmountCents:number|null;minimumMonths:number;minimumEndsAt:string|null;buyoutAmountCents:number;hosting:{amountCents:number;status:string;startsAt?:string;stopAt?:string}|null;availability?:{state:string;editorLocked:boolean;pastDueDay:number|null};paymentMethod:string;portalState:string;receipts:BillingReceipt[];access:Record<string,{allowed:boolean;plan:string}>;connectionState:string;actionsAvailable:boolean;rental:BillingRental};
const money=(cents:number)=>`$${(cents/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const date=(value:string|null)=>value?new Date(value).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}):'Not scheduled';
function safeStripeLink(value:string|null,label:string){
  if(!value)return '';
  try{const url=new URL(value);if(url.protocol==='https:'&&(url.hostname==='stripe.com'||url.hostname.endsWith('.stripe.com')))return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`}catch{}
  return '';
}
export function renderBillingSummary(data:BillingSummary):string{
  if(typeof document!=='undefined')installBillingActions(document);
  const plan=data.plan==='all_in'?'All-in':data.plan?data.plan[0].toUpperCase()+data.plan.slice(1):'No active plan';
  const renewal=data.renewalAmountCents===null?'Not scheduled':money(data.renewalAmountCents);
  const receipts=data.receipts.length?data.receipts.map(item=>`<li class="bv-billing-receipt"><div><strong>${escapeHtml(item.sku)}</strong><span>${money(item.amountCents)} · ${date(item.paidAt)} · ${escapeHtml(item.status)}</span></div><div>${safeStripeLink(item.invoiceUrl,'Invoice')}${safeStripeLink(item.receiptUrl,'Receipt')||(!item.invoiceUrl?'<span>Hosted receipt pending</span>':'')}</div></li>`).join(''):'<li>No verified payments yet.</li>';
  const owned=data.plan==='Owner';
  const monthly=data.minimumEndsAt!==null&&!owned;
  const minimum=monthly?`<div><dt>Rental minimum</dt><dd>${data.minimumMonths} months, ending ${date(data.minimumEndsAt)}</dd></div>`:'';
  const ownership=owned?'':`<article class="bv-card"><h3>Own your website</h3><p>One-time ownership buyout: <strong>${money(data.buyoutAmountCents)}</strong>. This is a flat price, with no credit for rental months paid.</p><div class="bv-billing-actions bv-owner-actions"><button type="button" data-bv-own ${data.actionsAvailable?'':'disabled'}>Own your site, $1,500</button><p>$50 per month owner hosting starts on your next cycle. No credit for rental months paid.</p><div data-bv-owner-result role="status"></div></div></article>`;
  const locked=Object.entries(data.access).find(([,entry])=>!entry.allowed&&['growth','all_in'].includes(entry.plan));
  const offer=locked?renderLockedUpsellCard({tenantId:'billing',feature:locked[0],plan:locked[1].plan,currentPlan:data.plan}):'';
  return `<section class="bv-billing" data-bv-billing-tenant="${escapeHtml(data.tenantId)}" aria-labelledby="bv-billing-title"><p class="eyebrow">YOUR ACCOUNT</p><h2 id="bv-billing-title">Billing</h2>${renderPaymentStatus(data.status)}${data.availability?.editorLocked?'<p class="bv-payment-banner" role="status">Your public site is '+(data.availability.state==='paused'?'temporarily unavailable':'unavailable')+(data.availability.state==='paused'?'. Update payment to unlock your editor.':'. Hosting has ended. Review your account below; an owned website keeps its static-file download.')+'</p>':''}${data.connectionState==='not_connected'?'<p class="bv-callout bv-callout-warning" role="status">Payments not connected. You can review your plan here; no charge can start.</p>':''}<div class="bv-billing-grid"><article class="bv-card"><h3>Current plan</h3><p class="bv-billing-value">${escapeHtml(plan)}</p><p>${owned?'Owned website':'Rental website'}</p><dl><div><dt>Status</dt><dd>${escapeHtml(data.status.replace('_',' '))}</dd></div><div><dt>Next charge</dt><dd>${date(data.renewsAt)} · ${renewal}</dd></div>${minimum}</dl>${data.hosting?`<p>Owner hosting: ${money(data.hosting.amountCents)} per month · ${escapeHtml(data.hosting.status.replace('_',' '))}${data.hosting.startsAt?' · starts '+date(data.hosting.startsAt):''}</p><div class="bv-billing-actions bv-owner-actions"><button type="button" data-bv-stop-hosting ${data.actionsAvailable?'':'disabled'}>Stop hosting</button><p>Hosting ends at the paid period end. Keep your static-file download; no refunds or credits.</p><div data-bv-owner-result role="status"></div></div>`:''}</article><article class="bv-card"><h3>Payment method</h3><p>${escapeHtml(data.paymentMethod)}</p><p>Card updates and invoices use the secure Stripe Customer Portal when it is connected.</p>${data.portalState!=='ready'?'<button type="button" disabled aria-describedby="bv-portal-state">Update payment</button><p id="bv-portal-state">Payments not connected</p>':'<button type="button" data-bv-portal>Manage payment method</button><p id="bv-portal-state" role="status"></p>'}</article></div>${renderRentalControls(data)}${ownership}<section class="bv-card"><h3>Other plans</h3><div class="bv-plan-price-list"><article><h4>Website</h4><p>$50/month</p><p>$500/year</p></article><article><h4>Growth</h4><p>$150/month</p><p>$1,500/year</p></article><article><h4>All-in</h4><p>$300/month</p><p>$3,000/year</p></article></div><p>Annual prepay covers twelve months for the price of ten. No setup fee.</p></section>${offer}<section class="bv-card"><h3>Receipts</h3><p>Only payments confirmed by the payment provider appear here.</p><ul class="bv-billing-receipts">${receipts}</ul></section></section>`;
}

function renderRentalControls(data:BillingSummary):string{
  const rental=data.rental;
  if(!['monthly','annual'].includes(rental.kind)||!rental.cancel)return '';
  const switchCopy=rental.switchTargets.map(target=>`<p>${escapeHtml(target.sku.includes('ALL-IN')?'All-in':target.sku.includes('GROWTH')?'Growth':'Website')}: ${money(target.priceCents)} ${target.cadence==='year'?'per year':'per month'}.</p><button type="button" data-bv-switch-quote="${escapeHtml(target.sku)}" ${data.actionsAvailable?'':'disabled'}>Review ${target.sku.includes('ALL-IN')?'All-in':target.sku.includes('GROWTH')?'Growth':'Website'} plan</button>`).join('');
  const cancel=rental.cancel;
  const terms=`The site comes down at the paid period end with no export. Your domain stays yours. Site data is held for ${cancel.dataHoldDays} days after the site comes down.`;
  const cancelCopy=cancel.scheduled?`<p role="status">${rental.kind==='annual'?'Annual rental is prepaid. Canceling does not refund the remaining term. ':''}Cancellation is scheduled. The site stays up until ${date(cancel.periodEnd)}.</p>`:cancel.allowed?`<p>${rental.kind==='annual'?'Annual rental is prepaid. Canceling does not refund the remaining term.':''} The site stays up until ${date(cancel.periodEnd)}.</p><button type="button" data-bv-cancel-review ${data.actionsAvailable?'':'disabled'}>Review cancellation</button>`:`<p role="status">Monthly cancellation is unavailable until ${date(cancel.minimumEndsAt)}. The three-month minimum applies.</p><button type="button" disabled>Cancel plan</button>`;
  return `<section class="bv-card bv-billing-actions" data-bv-period-end="${escapeHtml(cancel.periodEnd)}" data-bv-no-refund="${cancel.noRefund}"><h3>Change your rental</h3>${switchCopy}<p>Upgrades charge the prorated difference now. Downgrades start at your next renewal. No refunds or credits.</p><div class="bv-billing-action-result" data-bv-switch-result role="status"></div><h3>Cancel rental</h3>${cancelCopy}<p>${terms}</p><div class="bv-billing-action-result" data-bv-cancel-result role="status"></div>${!data.actionsAvailable?'<p>Payments not connected. Plan changes and cancellation cannot be submitted yet.</p>':''}</section>`;
}

const billingActionsInstalled=new WeakSet<EventTarget>();
export function installBillingActions(root:Document=document):void{
  if(billingActionsInstalled.has(root))return;billingActionsInstalled.add(root);
  root.addEventListener('click',async event=>{
    const button=(event.target as Element)?.closest?.('[data-bv-portal],[data-bv-switch-quote],[data-bv-switch-confirm],[data-bv-cancel-review],[data-bv-cancel-confirm],[data-bv-own],[data-bv-stop-hosting]') as HTMLButtonElement|null;
    if(!button||button.disabled)return;
    const section=button.closest<HTMLElement>('[data-bv-billing-tenant]'),tenantId=section?.dataset.bvBillingTenant;
    if(!section||!tenantId)return;
    if(button.hasAttribute('data-bv-portal')){
      const status=section.querySelector<HTMLElement>('#bv-portal-state');button.disabled=true;if(status)status.textContent='Opening payment settings…';
      try{const {api}=await import('../shared/workspace-api.js');const value=await api('/payments/tenants/'+encodeURIComponent(tenantId)+'/billing/portal','POST',{});if(value.state==='ready'){const target=new URL(value.url);if(target.protocol!=='https:'||!(target.hostname==='stripe.com'||target.hostname.endsWith('.stripe.com')))throw Error('Payment portal unavailable.');location.assign(target.href)}else if(status)status.textContent=value.message;}catch(error){if(status)status.textContent=error instanceof Error?error.message:'Unable to open payment settings.';}finally{button.disabled=false;}return;
    }
    if(button.hasAttribute('data-bv-own')||button.hasAttribute('data-bv-stop-hosting')){
      const result=button.closest('.bv-owner-actions')?.querySelector<HTMLElement>('[data-bv-owner-result]');if(!result)return;button.disabled=true;result.textContent='Working…';button.dataset.paymentKey ||= crypto.randomUUID().replaceAll('-','');
      try{const {api}=await import('../shared/workspace-api.js');const r=await api('/payments/tenants/'+encodeURIComponent(tenantId)+'/billing/'+(button.hasAttribute('data-bv-own')?'own':'stop-hosting'),'POST',{idempotencyKey:button.dataset.paymentKey});if(r.url){const target=new URL(r.url);if(target.protocol!=='https:'||!(target.hostname==='stripe.com'||target.hostname.endsWith('.stripe.com')))throw Error('Payment checkout unavailable.');location.assign(target.href);}else result.textContent=r.message||'Hosting change saved.';}catch(error){result.textContent=error instanceof Error?error.message:'Payment action could not complete.';button.disabled=false;}return;
    }
    const controls=button.closest<HTMLElement>('.bv-billing-actions');if(!controls)return;
    const isSwitch=button.hasAttribute('data-bv-switch-quote')||button.hasAttribute('data-bv-switch-confirm');
    const result=controls.querySelector<HTMLElement>(isSwitch?'[data-bv-switch-result]':'[data-bv-cancel-result]');if(!result)return;
    button.disabled=true;result.textContent='Working…';
    try{
      const {api}=await import('../shared/workspace-api.js');
      const path='/payments/tenants/'+encodeURIComponent(tenantId)+'/billing/';
      if(button.hasAttribute('data-bv-switch-quote')){
        const quote=await api(path+'switch-quote','POST',{targetSku:button.dataset.bvSwitchQuote});
        if(quote.state!=='quoted'){result.textContent=quote.message;return;}
        result.innerHTML=`<p>Switch to ${escapeHtml(quote.targetName||quote.targetSku)} ${quote.targetSku.endsWith('YEAR')?'annual':'monthly'} at ${money(quote.targetPriceCents)} per ${quote.targetSku.endsWith('YEAR')?'year':'month'}. Amount due now: <strong>${money(quote.amountDueCents)}</strong>. ${quote.kind==='downgrade'?'Starts at your next renewal. No refund or credit.':'Starts after payment is confirmed.'} Effective ${date(quote.effectiveAt)}.</p><button type="button" data-bv-switch-confirm="${escapeHtml(quote.targetSku)}" data-bv-quote-id="${escapeHtml(quote.quoteId)}">Confirm switch</button>`;
      }else if(button.hasAttribute('data-bv-switch-confirm')){
        const changed=await api(path+'switch','POST',{targetSku:button.dataset.bvSwitchConfirm,quoteId:button.dataset.bvQuoteId,idempotencyKey:button.dataset.paymentKey ||= crypto.randomUUID().replaceAll('-','')});
        result.textContent=changed.message;
      }else if(button.hasAttribute('data-bv-cancel-review')){
        result.innerHTML=`<p>${controls.dataset.bvNoRefund==='true'?'Annual prepayment is not refunded. ':''}The site stays up until ${date(controls.dataset.bvPeriodEnd||null)}. Then it comes down with no export. Your domain stays yours. Site data is held 90 days.</p><button type="button" data-bv-cancel-confirm>Confirm cancellation</button>`;
      }else{
        const canceled=await api(path+'cancel','POST',{idempotencyKey:crypto.randomUUID().replaceAll('-','')});
        result.textContent=canceled.message;
      }
    }catch(error){result.textContent=error instanceof Error?error.message:'Unable to update billing.';button.disabled=false;}
  });
}

export function offerStorageKey(tenantId:string,feature:string){return `bv-closed-offer:${tenantId}:${feature}`;}
export function renderLockedUpsellCard({tenantId,feature,plan,currentPlan=null,dismissed=false,alreadyShown=false,screen='normal'}:{tenantId:string;feature:string;plan:string;currentPlan?:string|null;dismissed?:boolean;alreadyShown?:boolean;screen?:string}):string{
  if(dismissed||alreadyShown||['error','alert','stalled','help'].includes(screen)||currentPlan==='all_in'||!['growth','all_in'].includes(plan))return '';
  const title=plan==='growth'?'Included in Growth':'Included in All-in';
  return `<aside class="bv-offer" data-bv-offer="${escapeHtml(feature)}"><h2>${title}</h2><p>This feature is locked on your current plan.</p><p class="bv-meta">${plan==='growth'?'$150/month or $1,500/year':'$300/month or $3,000/year'} · Review your plan in Billing.</p><a href="#bv-billing-title">View Billing</a><button type="button" class="bv-offer-dismiss" data-bv-dismiss-offer="${escapeHtml(offerStorageKey(tenantId,feature))}">Dismiss this offer</button></aside>`;
}
const installed=new WeakSet<EventTarget>();
export function installUpsellDismissal(root:Document=document,storage:Storage=localStorage):void{
  if(installed.has(root))return;installed.add(root);
  root.addEventListener('click',event=>{const button=(event.target as Element)?.closest?.('[data-bv-dismiss-offer]') as HTMLElement|null;if(!button)return;const key=button.dataset.bvDismissOffer;if(key)storage.setItem(key,'1');button.closest('[data-bv-offer]')?.remove();});
}
