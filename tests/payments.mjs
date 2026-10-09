import assert from 'node:assert/strict';
import {test} from 'node:test';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {onSettled} from '../src/payments/checkout.ts';
import {handleWebhook} from '../src/payments/webhook.js';

test('only a correctly signed raw event can settle a payment',async()=>{
  const h=paymentHarness();
  const e=h.event('evt_1','checkout.session.completed',h.session('SITE-BUYOUT',150000));
  assert.equal((await h.send(e,{signature:false})).status,400);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,0);
  assert.equal((await h.send(e)).status,200);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,1);
  h.close();
});

test('duplicate deliveries settle once and call onSettled once',async()=>{
  const h=paymentHarness();let calls=0;
  const unsubscribe=onSettled('SITE-OWN',()=>{calls++;});
  const e=h.event('evt_2','checkout.session.completed',h.session('SITE-OWN',150000,'pi_once'));
  assert.equal((await h.send(e)).status,200);
  assert.deepEqual(await (await h.send(e)).json(),{duplicate:true,processed:0});
  assert.equal(calls,1);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,1);
  unsubscribe();h.close();
});

test('invoice before checkout and subscription update settles after customer linkage',async()=>{
  const h=paymentHarness();
  const invoice=h.invoice('in_early','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2026-11-01T00:00:00.000Z');
  delete invoice.metadata;
  const first=await h.send(h.event('evt_early','invoice.paid',invoice,100));
  assert.equal(first.status,200);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,0);
  const subscription={id:'sub_1',customer:'cus_test_1',metadata:{tenantId:'tenant_123'},status:'active'};
  assert.equal((await h.send(h.event('evt_subscription','customer.subscription.updated',subscription,99))).status,200);
  const checkout={id:'cs_subscription',mode:'subscription',customer:'cus_test_1',subscription:'sub_1',metadata:{tenantId:'tenant_123',skus:'PLAN-WEBSITE-MONTH'}};
  assert.equal((await h.send(h.event('evt_checkout','checkout.session.completed',checkout,98))).status,200);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,1);
  assert.equal(h.sql.prepare('SELECT plan FROM payment_state WHERE tenant_id=?').get('tenant_123').plan,'website');
  h.close();
});

test('wrong amount and wrong tenant are rejected without entitlement grants',async()=>{
  const h=paymentHarness();
  assert.equal((await h.send(h.event('evt_bad_amount','checkout.session.completed',h.session('SITE-BUYOUT',149900,'pi_bad')))).status,400);
  const linked=h.event('evt_link','checkout.session.completed',{id:'cs_link',mode:'subscription',customer:'cus_test_1',subscription:'sub_1',metadata:{tenantId:'tenant_123',skus:'PLAN-WEBSITE-MONTH'}});
  assert.equal((await h.send(linked)).status,200);
  const wrong=h.invoice('in_wrong');wrong.metadata.tenantId='tenant_456';
  assert.equal((await h.send(h.event('evt_wrong_tenant','invoice.paid',wrong))).status,400);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,0);
  h.close();
});

test('no webhook secret cannot process any payment',async()=>{
  const h=paymentHarness();delete h.env.STRIPE_WEBHOOK_SECRET;
  const response=await handleWebhook(new Request('http://localhost:5181/api/payments/webhook',{method:'POST',body:JSON.stringify(h.event('evt_no_key','checkout.session.completed',h.session('SITE-OWN',150000)))}),h.env);
  assert.equal(response.status,503);
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,0);
  h.close();
});
