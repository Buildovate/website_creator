import assert from 'node:assert/strict';
import {test} from 'node:test';
import {catalog,getProduct} from '../src/platform/catalog.ts';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {makeFakeStripe,fakeTestEnv} from './stripe-fake.mjs';
import {syncCatalog} from '../scripts/stripe-sync.mjs';
import {createCheckoutService,onSettled} from '../src/payments/checkout.ts';
import {DOMAIN_CONNECT_FOR_ME_SKU,addOnSummary,requestAddOnCheckout,markAddOnDelivery,addOnApi} from '../src/payments/add-ons.js';
import {renderAddOns} from '../src/client/workspace/add-ons.ts';

const tenantId='tenant_123';
const click={sku:DOMAIN_CONNECT_FOR_ME_SKU,idempotencyKey:'domain_click_123'};

test('only the approved $15 domain service is available; no-key Buy explains why it cannot charge',async()=>{
  const h=paymentHarness();
  const store=await addOnSummary(h.env,tenantId);
  assert.deepEqual(store.available.map(row=>row.sku),[DOMAIN_CONNECT_FOR_ME_SKU]);
  assert.equal(store.available[0].priceCents,1500);
  assert.equal(store.checkoutState,'not_connected');
  assert.equal(store.owned.length,0);
  assert.equal(catalog.products.filter(row=>row.category==='Website Add-ons'&&row.active).length,1);
  const html=renderAddOns(store);
  assert.match(html,/\$15\.00 one time/);
  assert.match(html,/Payments not connected/);
  assert.match(html,/data-bv-addon-buy="DOMAIN-CONNECT-FOR-ME"[^>]*disabled/);
  assert.doesNotMatch(html,/AI-UGC-PACK|DOMAIN-PREMIUM/);
  h.close();
});

test('fake Stripe checkout is server priced, payment mode, one session per click, and tenant bound',async()=>{
  const h=paymentHarness(),stripe=makeFakeStripe();
  await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:catalog});
  h.env.PAYMENT_CHECKOUT_SERVICE=createCheckoutService({stripe,env:fakeTestEnv,baseUrl:'http://localhost:5181',taxConfigured:true});
  const [first,second]=await Promise.all([requestAddOnCheckout(h.env,tenantId,click),requestAddOnCheckout(h.env,tenantId,click)]);
  assert.deepEqual(first,second);
  assert.equal(stripe.calls.sessionCreates,1);
  assert.equal(stripe.calls.customerCreates,1);
  const session=stripe.sessionsStore[0],price=stripe.pricesStore.find(row=>row.id===session.payload.line_items[0].price);
  assert.equal(session.payload.mode,'payment');
  assert.equal(session.payload.metadata.tenantId,tenantId);
  assert.equal(session.payload.line_items[0].quantity,1);
  assert.equal(price.unit_amount,1500);
  assert.equal(price.lookup_key,'DOMAIN-CONNECT-FOR-ME@1');
  await assert.rejects(requestAddOnCheckout(h.env,tenantId,{...click,amountCents:1}),/Client amount/);
  await assert.rejects(requestAddOnCheckout(h.env,tenantId,{sku:'ADS-LAUNCH',idempotencyKey:'ads_click_123'}),/not available/);
  assert.equal(stripe.calls.sessionCreates,1);
  h.close();
});

test('only signed settlement puts add-on in Owned; delivery advances Pending to In progress to Delivered',async()=>{
  const h=paymentHarness();let settled=0;
  const unsubscribe=onSettled(DOMAIN_CONNECT_FOR_ME_SKU,()=>{settled++;});
  const event=h.event('evt_domain','checkout.session.completed',h.session(DOMAIN_CONNECT_FOR_ME_SKU,1500,'pi_domain'));
  assert.equal((await h.send(event,{signature:false})).status,400);
  assert.equal((await addOnSummary(h.env,tenantId)).owned.length,0);
  assert.equal((await h.send(event)).status,200);
  assert.equal((await h.send(event)).status,200);
  assert.equal(settled,1);
  let store=await addOnSummary(h.env,tenantId);
  assert.equal(store.available.length,0);
  assert.equal(store.owned.length,1);
  assert.equal(store.owned[0].deliveryStatus,'Pending');
  const ledgerId=store.owned[0].ledgerId;
  await assert.rejects(markAddOnDelivery(h.env,ledgerId,'Delivered'),/Start delivery/);
  assert.deepEqual(await markAddOnDelivery(h.env,ledgerId,'In progress'),{status:'In progress'});
  assert.deepEqual(await markAddOnDelivery(h.env,ledgerId,'Delivered'),{status:'Delivered'});
  store=await addOnSummary(h.env,tenantId);
  assert.equal(store.owned[0].deliveryStatus,'Delivered');
  assert.match(renderAddOns(store),/Delivered/);
  await assert.rejects(requestAddOnCheckout(h.env,tenantId,{...click,idempotencyKey:'another_click_123'}),/already owned/);
  assert.equal(h.sql.prepare("SELECT count(*) AS n FROM payment_audit WHERE action LIKE 'addon.delivery.%'").get().n,2);
  unsubscribe();h.close();
});

test('refund removes Owned and returns the domain service to Available',async()=>{
  const h=paymentHarness();
  await h.send(h.event('evt_paid','checkout.session.completed',h.session(DOMAIN_CONNECT_FOR_ME_SKU,1500,'pi_refund_domain')));
  await h.send(h.event('evt_refund','charge.refunded',{id:'ch_refund_domain',payment_intent:'pi_refund_domain'}));
  const store=await addOnSummary(h.env,tenantId);
  assert.equal(store.owned.length,0);
  assert.deepEqual(store.available.map(row=>row.sku),[DOMAIN_CONNECT_FOR_ME_SKU]);
  h.close();
});

test('tenant owner can request checkout; viewer sees read-only store and cannot buy',async()=>{
  const h=paymentHarness();
  h.sql.prepare("INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES('member_view','tenant_123','viewer_1','viewer@example.test','viewer',1,'2026-01-01')").run();
  h.sql.prepare("INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES('member_owner','tenant_123','owner_1','owner@example.test','owner',1,'2026-01-01')").run();
  const url='http://localhost:5181/api/payments/tenants/tenant_123/add-ons';
  const viewerHeaders={'oai-authenticated-user-id':'viewer_1','oai-authenticated-user-email':'viewer@example.test'};
  const read=await addOnApi(new Request(url,{headers:viewerHeaders}),h.env,new URL(url));
  assert.equal(read.checkoutState,'read_only');
  assert.match(renderAddOns(read),/Only the website owner can buy add-ons/);
  h.env.PAYMENT_CHECKOUT_SERVICE={createCheckout:async()=>({state:'not_connected',message:'Payments not connected'})};
  await assert.rejects(addOnApi(new Request(url+'/checkout',{method:'POST',headers:viewerHeaders,body:JSON.stringify(click)}),h.env,new URL(url+'/checkout')),/Website not found/);
  const ownerHeaders={'oai-authenticated-user-id':'owner_1','oai-authenticated-user-email':'owner@example.test'};
  const result=await addOnApi(new Request(url+'/checkout',{method:'POST',headers:ownerHeaders,body:JSON.stringify(click)}),h.env,new URL(url+'/checkout'));
  assert.deepEqual(result,{state:'not_connected',message:'Payments not connected'});
  h.close();
});
