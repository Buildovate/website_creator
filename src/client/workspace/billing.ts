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
