export function mountPaymentLock(host,onBilling,availability={state:'paused'}){
 const panel=document.createElement('section');panel.className='bv-game-payment-lock';panel.setAttribute('aria-labelledby','bv-game-payment-title');
 const paused=availability.state==='paused';
 panel.innerHTML=paused?'<h2 id="bv-game-payment-title">Update payment to unlock your editor</h2><p>Your saved work is still here. Open Billing to update your payment method.</p><button type="button" data-game-update-payment>Update payment</button>':'<h2 id="bv-game-payment-title">Hosting has ended</h2><p>Open Billing to review your account. Owned websites keep their static-file download.</p><button type="button" data-game-update-payment>Open Billing</button>';
 host.replaceChildren(panel);panel.querySelector('button').onclick=onBilling;return panel;
}
