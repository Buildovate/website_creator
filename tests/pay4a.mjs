import assert from 'node:assert/strict';
import {test} from 'node:test';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {paidFeatureEnabled} from '../src/payments/gating.js';
import {enabled} from '../src/workspace.js';
import {billingSummary} from '../src/payments/billing.js';
import {renderBillingSummary} from '../src/client/workspace/billing.ts';

test('verified settlement enables a Website feature',async()=>{
  const h=paymentHarness();
  assert.equal(await enabled(h.env,'tenant_123','ai'),false);
  const invoice=h.invoice('in_allowed','PLAN-WEBSITE-MONTH',5000,'2026-10-31T00:00:00.000Z','2026-11-30T00:00:00.000Z');
  assert.equal((await h.send(h.event('evt_allowed','invoice.paid',invoice))).status,200);
  assert.equal(await enabled(h.env,'tenant_123','ai'),true);
  h.close();
});

test('unpaid Growth and All-in features stay locked even with a paid Website plan',async()=>{
  const h=paymentHarness();
  await h.send(h.event('evt_website','invoice.paid',h.invoice('in_website')));
  assert.equal(await enabled(h.env,'tenant_123','forms'),false);
  assert.equal(await enabled(h.env,'tenant_123','pages'),false);
  assert.equal(await paidFeatureEnabled(h.env,'tenant_123','blog'),false);
  h.close();
});

test('missing entitlement uses a locked default; manual Paid does not unlock it',async()=>{
  const h=paymentHarness();
  h.sql.prepare("INSERT INTO sales(tenant_id,data,updated_at) VALUES('tenant_123','{\"stage\":\"Paid\"}','2026-10-08')").run();
  assert.equal(await enabled(h.env,'tenant_123','ai'),false);
  assert.equal(await paidFeatureEnabled(h.env,'tenant_456','forms'),false);
  h.close();
});

test('monthly Billing shows rental minimum, ledger charge, ownership option, and coming-soon plans',async()=>{
  const h=paymentHarness();
  const invoice=h.invoice('in_monthly','PLAN-WEBSITE-MONTH',5000,'2026-10-31T00:00:00.000Z','2026-11-30T00:00:00.000Z');
  assert.equal((await h.send(h.event('evt_monthly','invoice.paid',invoice))).status,200);
  const summary=await billingSummary(h.env,'tenant_123');
  assert.equal(summary.plan,'website');assert.equal(summary.renewalAmountCents,5000);
  assert.equal(summary.minimumMonths,3);assert.equal(summary.minimumEndsAt,'2027-01-31T00:00:00.000Z');
  assert.equal(summary.buyoutAmountCents,150000);
  const html=renderBillingSummary(summary);
  for(const text of ['Rental website','3 months, ending Jan 31, 2027','Next charge','$50.00','$1,500.00','Growth: Price coming soon','All-in: Price coming soon','Payments not connected','Included in All-in'])assert.match(html,new RegExp(text.replace(/[$.]/g,'\\$&')));
  assert.equal((html.match(/data-bv-offer=/g)||[]).length,1);
  h.close();
});

test('annual Billing shows the $500 ledger charge without a monthly minimum',async()=>{
  const h=paymentHarness();
  const invoice=h.invoice('in_annual','PLAN-WEBSITE-YEAR',50000,'2026-10-31T00:00:00.000Z','2027-10-31T00:00:00.000Z');
  assert.equal((await h.send(h.event('evt_annual','invoice.paid',invoice))).status,200);
  const summary=await billingSummary(h.env,'tenant_123');
  assert.equal(summary.renewalAmountCents,50000);
  assert.equal(summary.minimumEndsAt,null);
  const html=renderBillingSummary(summary);
  assert.match(html,/\$500\.00/);assert.doesNotMatch(html,/Rental minimum/);
  h.close();
});

test('owned Billing shows owner hosting and no rental buyout',async()=>{
  const h=paymentHarness();
  assert.equal((await h.send(h.event('evt_own','checkout.session.completed',h.session('SITE-OWN',150000)))).status,200);
  const summary=await billingSummary(h.env,'tenant_123');
  assert.equal(summary.plan,'Owner');assert.equal(summary.hosting.amountCents,5000);
  const html=renderBillingSummary(summary);
  assert.match(html,/Owned website/);assert.match(html,/Owner hosting: \$50\.00 per month/);
  assert.doesNotMatch(html,/One-time ownership buyout/);
  h.close();
});
