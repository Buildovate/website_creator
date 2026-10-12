import assert from 'node:assert/strict';
import {test} from 'node:test';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {getPlan,hasEntitlement,listEntitlements} from '../src/entitlements.js';
import {renderPaymentStatus} from '../src/client/workspace/billing.ts';

const future='2027-12-31T00:00:00.000Z';

test('paid monthly period grants once and starts a three-calendar-month minimum',async()=>{
  const h=paymentHarness();
  const invoice=h.invoice('in_month','PLAN-WEBSITE-MONTH',5000,'2026-10-31T00:00:00.000Z',future);
  assert.equal((await h.send(h.event('evt_paid_1','invoice.paid',invoice))).status,200);
  assert.equal((await h.send(h.event('evt_paid_2','invoice.paid',invoice))).status,200);
  const plan=await getPlan('tenant_123');
  assert.equal(plan.plan,'website');assert.equal(plan.status,'active');
  assert.equal(plan.minimumEndsAt,'2027-01-31T00:00:00.000Z');
  assert.equal(h.sql.prepare('SELECT count(*) AS n FROM payment_ledger').get().n,1);
  assert.ok((await listEntitlements('tenant_123')).length>0);
  h.close();
});

test('refund revokes unused grants and records an audit row',async()=>{
  const h=paymentHarness();
  const invoice=h.invoice('in_refund','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z',future);
  await h.send(h.event('evt_paid','invoice.paid',invoice));
  const key=(await listEntitlements('tenant_123'))[0].key;
  assert.equal(await hasEntitlement('tenant_123',key),true);
  assert.equal((await h.send(h.event('evt_refund','charge.refunded',{id:'ch_1',payment_intent:'pi_in_refund'}))).status,200);
  assert.equal(await hasEntitlement('tenant_123',key),false);
  assert.equal(h.sql.prepare("SELECT count(*) AS n FROM payment_audit WHERE action='charge.refunded'").get().n,1);
  h.close();
});

test('past due shows a banner and keeps paid-period features on',async()=>{
  const h=paymentHarness();h.env.PAYMENT_CLOCK=()=>101000;
  await h.send(h.event('evt_paid','invoice.paid',h.invoice('in_past','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z',future),100));
  const key=(await listEntitlements('tenant_123'))[0].key;
  await h.send(h.event('evt_failed','invoice.payment_failed',{customer:'cus_test_1',metadata:{tenantId:'tenant_123'}},101));
  assert.equal((await getPlan('tenant_123')).status,'past_due');
  assert.equal(await hasEntitlement('tenant_123',key),true);
  assert.match(renderPaymentStatus('past_due'),/Payment is past due/);
  assert.equal(renderPaymentStatus('active'),'');
  h.close();
});

test('cancellation retains service until period end, then revokes rental grants',async()=>{
  const h=paymentHarness();
  await h.send(h.event('evt_paid','invoice.paid',h.invoice('in_cancel','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z',future),100));
  const key=(await listEntitlements('tenant_123'))[0].key;
  const subscription={id:'sub_1',customer:'cus_test_1',metadata:{tenantId:'tenant_123'},current_period_end:Math.floor(Date.parse(future)/1000)};
  await h.send(h.event('evt_cancel_scheduled','customer.subscription.deleted',subscription,101));
  assert.equal((await getPlan('tenant_123')).status,'canceled');
  assert.equal(await hasEntitlement('tenant_123',key),true);
  subscription.current_period_end=Math.floor(Date.parse('2026-10-01T00:00:00.000Z')/1000);
  await h.send(h.event('evt_cancel_finished','customer.subscription.deleted',subscription,102));
  assert.equal(await hasEntitlement('tenant_123',key),false);
  const state=h.sql.prepare('SELECT site_available,domain_retained,data_hold_until FROM payment_state WHERE tenant_id=?').get('tenant_123');
  assert.equal(state.site_available,0);assert.equal(state.domain_retained,1);assert.ok(state.data_hold_until);
  h.close();
});

test('SITE-OWN and flat $1,500 BUYOUT grant site_owned and require $50 owner hosting',async()=>{
  for(const sku of ['SITE-OWN','SITE-BUYOUT']){
    const h=paymentHarness();
    const response=await h.send(h.event(`evt_${sku}`,'checkout.session.completed',h.session(sku,150000,`pi_${sku}`)));
    assert.equal(response.status,200);
    assert.equal(await hasEntitlement('tenant_123','site_owned'),true);
    const state=h.sql.prepare('SELECT plan,site_owned,hosting_sku,hosting_amount_cents,hosting_status FROM payment_state WHERE tenant_id=?').get('tenant_123');
    assert.equal(state.plan,null);assert.equal(state.site_owned,1);
    assert.equal(state.hosting_sku,'OWNER-HOSTING');assert.equal(state.hosting_amount_cents,5000);
    assert.equal(state.hosting_status,'pending_checkout');
    assert.equal(h.sql.prepare('SELECT amount_cents FROM payment_ledger').get().amount_cents,150000);
    h.close();
  }
});

test('manual Paid label creates no entitlement',async()=>{
  const h=paymentHarness();
  h.sql.prepare("INSERT INTO sales(tenant_id,data,updated_at) VALUES('tenant_123','{\"stage\":\"Paid\"}','2026-10-08')").run();
  assert.deepEqual(await listEntitlements('tenant_123'),[]);
  assert.equal(await hasEntitlement('tenant_123','site_owned'),false);
  assert.deepEqual(await getPlan('tenant_123'),{plan:null,status:'none',renewsAt:null,minimumEndsAt:null});
  h.close();
});
