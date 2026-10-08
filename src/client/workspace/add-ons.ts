export type AddOnRow={sku:string;name:string;description:string;priceCents:number;cadence:'one_time'|'month'|'year'};
export type OwnedAddOn={ledgerId:string;sku:string;name:string;amountCents:number;paidAt:string;deliveryStatus:'Pending'|'In progress'|'Delivered'};
export type AddOnStore={tenantId:string;available:AddOnRow[];owned:OwnedAddOn[];checkoutState:'ready'|'not_connected'|'read_only'};
const money=(cents:number)=>`$${(cents/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const escapeHtml=(value:string)=>{const entities:Record<string,string>={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};return value.replace(/[&<>"']/g,character=>entities[character]);};
const date=(value:string)=>new Date(value).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'});

export function renderAddOns(data:AddOnStore):string{
  if(typeof document!=='undefined')installAddOnActions(document);
  const connected=data.checkoutState==='ready';
  const available=data.available.length?data.available.map(row=>`<article class="bv-card bv-addon-card"><div><h3>${escapeHtml(row.name)}</h3><p>${escapeHtml(row.description)}</p><p class="bv-addon-price">${money(row.priceCents)} ${row.cadence==='one_time'?'one time':row.cadence==='month'?'per month':'per year'}</p></div><div><button type="button" class="bv-button bv-button-primary bv-addon-buy" data-bv-addon-buy="${escapeHtml(row.sku)}" ${connected?'':'disabled'} aria-describedby="bv-addon-state-${escapeHtml(row.sku)}"><span class="bv-addon-button-label">Buy</span><span class="bv-addon-spinner" aria-hidden="true" hidden></span></button><p id="bv-addon-state-${escapeHtml(row.sku)}" role="status">${connected?'One tap opens secure checkout. No charge starts until you confirm there.':data.checkoutState==='read_only'?'Only the website owner can buy add-ons.':'Payments not connected. This add-on cannot be charged yet.'}</p></div></article>`).join(''):'<p class="bv-empty">No add-ons are available for this website right now.</p>';
  const owned=data.owned.length?data.owned.map(item=>`<li class="bv-addon-owned"><div><strong>${escapeHtml(item.name)}</strong><span>${money(item.amountCents)} · Paid ${date(item.paidAt)}</span></div><span class="bv-pill ${item.deliveryStatus==='Delivered'?'bv-pill-success':'bv-pill-warning'}">${escapeHtml(item.deliveryStatus)}</span></li>`).join(''):'<li>No verified add-on purchases yet.</li>';
  return `<section class="bv-addons" data-bv-addon-tenant="${escapeHtml(data.tenantId)}" aria-labelledby="bv-addons-title"><p class="eyebrow">YOUR WEBSITE</p><h2 id="bv-addons-title">Add-ons</h2><p>Choose a service for this website. Prices are shown before checkout. Work begins after verified payment.</p>${connected?'':data.checkoutState==='read_only'?'<p class="bv-callout bv-callout-warning" role="status">Only the website owner can buy add-ons.</p>':'<p class="bv-callout bv-callout-warning" role="status">Payments not connected. You can review add-ons here, but no charge can start.</p>'}<section aria-labelledby="bv-addons-available"><h3 id="bv-addons-available">Available</h3><div class="bv-addon-list">${available}</div></section><section aria-labelledby="bv-addons-owned"><h3 id="bv-addons-owned">Owned</h3><ul class="bv-addon-owned-list">${owned}</ul></section></section>`;
}

const installed=new WeakSet<EventTarget>();
export function installAddOnActions(root:Document=document):void{
  if(installed.has(root))return;installed.add(root);
  root.addEventListener('click',async event=>{
    const button=(event.target as Element)?.closest?.('[data-bv-addon-buy]') as HTMLButtonElement|null;
    if(!button||button.disabled||button.dataset.busy)return;
    const section=button.closest<HTMLElement>('[data-bv-addon-tenant]'),tenantId=section?.dataset.bvAddonTenant,sku=button.dataset.bvAddonBuy;
    if(!tenantId||!sku)return;
    const state=section.querySelector<HTMLElement>('#bv-addon-state-'+CSS.escape(sku));if(!state)return;
    const key=button.dataset.idempotencyKey||crypto.randomUUID().replaceAll('-','');
    button.dataset.idempotencyKey=key;button.dataset.busy='true';button.disabled=true;button.setAttribute('aria-busy','true');
    button.querySelector<HTMLElement>('.bv-addon-button-label')!.hidden=true;button.querySelector<HTMLElement>('.bv-addon-spinner')!.hidden=false;
    state.textContent='Opening secure checkout…';
    try{
      const {api}=await import('../shared/workspace-api.js');
      const result=await api('/payments/tenants/'+encodeURIComponent(tenantId)+'/add-ons/checkout','POST',{sku,idempotencyKey:key});
      if(result.url){state.textContent='Opening secure checkout…';window.location.assign(result.url);return;}
      state.textContent=result.message||'Payments not connected. No charge started.';
      if(result.state==='not_connected')delete button.dataset.idempotencyKey;
    }catch(error){state.textContent=error instanceof Error?error.message:'Checkout could not start. No charge was confirmed.';}
    finally{button.disabled=false;delete button.dataset.busy;button.removeAttribute('aria-busy');button.querySelector<HTMLElement>('.bv-addon-button-label')!.hidden=false;button.querySelector<HTMLElement>('.bv-addon-spinner')!.hidden=true;}
  });
}
