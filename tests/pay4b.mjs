import assert from 'node:assert/strict';
import {test} from 'node:test';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {makeFakeBillingAdapter} from './stripe-fake.mjs';
import {rentalDetails,quotePlanSwitch,confirmPlanSwitch,requestRentalCancellation} from '../src/payments/plan-management.js';
import {billingSummary} from '../src/payments/billing.js';
import {renderBillingSummary} from '../src/client/workspace/billing.ts';

const clock=Date.parse('2026-10-08T12:00:00.000Z');
async function subscription(h,sku){
  const object={id:'cs_subscription',mode:'subscription',customer:'cus_test_1',subscription:'sub_fake_1',metadata:{tenantId:'tenant_123',skus:sku}};
  assert.equal((await h.send(h.event('evt_sub','checkout.session.completed',object))).status,200);
}

test('monthly renter upgrades through quote and exact signed proration; cadence change is deferred',async()=>{
 const h=paymentHarness();try{await subscription(h,'PLAN-WEBSITE-MONTH');await h.send(h.event('evt_month','invoice.paid',h.invoice('in_month','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2026-11-01T00:00:00.000Z')));
 const fake=makeFakeBillingAdapter({quotedAmountCents:5000});h.env.PAYMENT_BILLING_ADAPTER=fake;const quote=await quotePlanSwitch(h.env,'tenant_123','PLAN-GROWTH-MONTH',clock);assert.equal(quote.state,'quoted');assert.equal(quote.targetPriceCents,15000);assert.equal(quote.amountDueCents,5000);const result=await confirmPlanSwitch(h.env,'tenant_123',{targetSku:quote.targetSku,quoteId:quote.quoteId,idempotencyKey:'switch_click_123'},clock);assert.equal(result.state,'awaiting_settlement');assert.equal(fake.switches.length,1);assert.equal((await rentalDetails(h.env,'tenant_123',clock)).currentSku,'PLAN-WEBSITE-MONTH');
 const invoice=h.invoice('prorated','PLAN-GROWTH-MONTH',5000,'2026-10-08T00:00:00.000Z','2026-11-01T00:00:00.000Z');invoice.metadata.paymentChangeId=quote.quoteId;invoice.subscription='sub_fake_1';assert.equal((await h.send(h.event('evt_prorated','invoice.paid',invoice))).status,200);const summary=await billingSummary(h.env,'tenant_123');assert.equal(summary.rental.currentSku,'PLAN-GROWTH-MONTH');assert.equal(summary.renewalAmountCents,15000);await assert.rejects(()=>quotePlanSwitch(h.env,'tenant_123','PLAN-GROWTH-YEAR',clock),/billing cadence/);
 }finally{h.close();}
});

test('monthly cancellation before three-month end is refused and shows the date',async()=>{
  const h=paymentHarness();await subscription(h,'PLAN-WEBSITE-MONTH');
  await h.send(h.event('evt_early','invoice.paid',h.invoice('in_early','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2026-11-01T00:00:00.000Z')));
  const fake=makeFakeBillingAdapter();h.env.PAYMENT_BILLING_ADAPTER=fake;
  const details=await rentalDetails(h.env,'tenant_123',clock);
  assert.equal(details.cancel.allowed,false);assert.equal(details.cancel.minimumEndsAt,'2027-01-01T00:00:00.000Z');
  await assert.rejects(requestRentalCancellation(h.env,'tenant_123','cancel_early_123',clock),/2027-01-01/);
  assert.equal(fake.cancellations.length,0);
  assert.match(renderBillingSummary(await billingSummary(h.env,'tenant_123')),/Monthly cancellation is unavailable until/);
  h.close();
});

test('monthly cancellation after minimum schedules period-end stop, with no export',async()=>{
  const h=paymentHarness();await subscription(h,'PLAN-WEBSITE-MONTH');
  await h.send(h.event('evt_first','invoice.paid',h.invoice('in_first','PLAN-WEBSITE-MONTH',5000,'2026-01-01T00:00:00.000Z','2026-02-01T00:00:00.000Z')));
  await h.send(h.event('evt_current','invoice.paid',h.invoice('in_current','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2026-11-01T00:00:00.000Z')));
  const fake=makeFakeBillingAdapter();h.env.PAYMENT_BILLING_ADAPTER=fake;
  const details=await rentalDetails(h.env,'tenant_123',clock);
  assert.equal(details.cancel.allowed,true);assert.equal(details.cancel.periodEnd,'2026-11-01T00:00:00.000Z');
  assert.equal(details.cancel.siteExport,false);assert.equal(details.cancel.domainRetained,true);assert.equal(details.cancel.dataHoldDays,90);
  const result=await requestRentalCancellation(h.env,'tenant_123','cancel_later_123',clock);
  assert.equal(result.state,'scheduled');assert.equal(result.periodEnd,'2026-11-01T00:00:00.000Z');
  assert.equal(fake.cancellations.length,1);assert.equal(fake.cancellations[0].atPeriodEnd,true);
  assert.equal((await rentalDetails(h.env,'tenant_123',clock)).cancel.scheduled,true);
  assert.equal(h.sql.prepare('SELECT site_available FROM payment_state WHERE tenant_id=?').get('tenant_123').site_available,1);
  await assert.rejects(requestRentalCancellation(h.env,'tenant_123','cancel_again_123',clock),/already scheduled/);
  h.close();
});

test('annual cancellation keeps prepaid site until term end with no refund',async()=>{
  const h=paymentHarness();await subscription(h,'PLAN-WEBSITE-YEAR');
  await h.send(h.event('evt_annual','invoice.paid',h.invoice('in_annual','PLAN-WEBSITE-YEAR',50000,'2026-01-01T00:00:00.000Z','2027-01-01T00:00:00.000Z')));
  const fake=makeFakeBillingAdapter();h.env.PAYMENT_BILLING_ADAPTER=fake;
  const details=await rentalDetails(h.env,'tenant_123',clock);
  assert.equal(details.cancel.allowed,true);assert.equal(details.cancel.noRefund,true);
  const result=await requestRentalCancellation(h.env,'tenant_123','cancel_annual_123',clock);
  assert.equal(result.state,'scheduled');assert.equal(result.noRefund,true);assert.equal(result.periodEnd,'2027-01-01T00:00:00.000Z');
  assert.match(renderBillingSummary(await billingSummary(h.env,'tenant_123')),/Canceling does not refund the remaining term/);
  h.close();
});

test('owned site has no rental cancellation action',async()=>{
  const h=paymentHarness();
  await h.send(h.event('evt_own','checkout.session.completed',h.session('SITE-OWN',150000)));
  h.env.PAYMENT_BILLING_ADAPTER=makeFakeBillingAdapter();
  assert.equal((await rentalDetails(h.env,'tenant_123',clock)).kind,'owned');
  const html=renderBillingSummary(await billingSummary(h.env,'tenant_123'));
  assert.doesNotMatch(html,/Review cancellation|Cancel plan|data-bv-cancel-review/);
  await assert.rejects(requestRentalCancellation(h.env,'tenant_123','cancel_owned_123',clock),/Owned sites do not have/);
  h.close();
});
