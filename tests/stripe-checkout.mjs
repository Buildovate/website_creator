import assert from 'node:assert/strict';
import { test } from 'node:test';
import { catalog } from '../src/platform/catalog.ts';
import { syncCatalog } from '../scripts/stripe-sync.mjs';
import { createCheckoutService } from '../src/payments/checkout.ts';
import { makeFakeStripe, fakeTestEnv } from './stripe-fake.mjs';

function approvedCatalog() {
  const data=structuredClone(catalog);
  for(const sku of ['PLAN-WEBSITE-MONTH','PLAN-WEBSITE-YEAR','SITE-OWN','SITE-BUYOUT','OWNER-HOSTING','AI-UGC-PACK','MEDIA-PUBLISH']) {
    const row=data.products.find(item=>item.sku===sku);
    row.active=true;
    if(row.priceCents===null)row.priceCents=row.proposedPriceCents;
  }
  return data;
}
async function setup() {
  const stripe=makeFakeStripe(), catalogData=approvedCatalog();
  await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData});
  const service=createCheckoutService({stripe,env:fakeTestEnv,catalogData,baseUrl:'http://localhost:5181',taxConfigured:true});
  return {stripe,service,catalogData};
}
const request=(sku,key='click_one_123')=>({tenantId:'tenant_123',items:[{sku,quantity:1}],returnPath:'/app/billing',idempotencyKey:key});

test('monthly and annual plans use subscription mode and only synced server prices',async()=>{
  const {stripe,service}=await setup();
  await service.createCheckout(request('PLAN-WEBSITE-MONTH','click_month_123'));
  await service.createCheckout(request('PLAN-WEBSITE-YEAR','click_year_123'));
  assert.equal(stripe.sessionsStore.length,2);
  for(const session of stripe.sessionsStore) {
    assert.equal(session.payload.mode,'subscription');
    assert.equal(session.payload.metadata.tenantId,'tenant_123');
    assert.equal(session.payload.subscription_data.metadata.tenantId,'tenant_123');
    assert.equal(session.payload.customer,'cus_fake_1');
    assert.match(session.payload.success_url,/^http:\/\/localhost:5181\/app\/billing\?checkout=success/);
  }
  const priceIds=stripe.sessionsStore.map(item=>item.payload.line_items[0].price);
  assert.equal(stripe.pricesStore.find(item=>item.id===priceIds[0]).unit_amount,5000);
  assert.equal(stripe.pricesStore.find(item=>item.id===priceIds[1]).unit_amount,50000);
});

test('one-time ownership and add-ons use payment mode; recurring items use subscription mode',async()=>{
  const {stripe,service}=await setup();
  for(const sku of ['SITE-OWN','SITE-BUYOUT','AI-UGC-PACK']) await service.createCheckout(request(sku,`click_${sku.replace(/[^A-Za-z0-9]/g,'_')}_123`));
  for(const sku of ['OWNER-HOSTING','MEDIA-PUBLISH']) await service.createCheckout(request(sku,`click_${sku.replace(/[^A-Za-z0-9]/g,'_')}_123`));
  assert.deepEqual(stripe.sessionsStore.map(item=>item.payload.mode),['payment','payment','payment','subscription','subscription']);
  assert.equal(stripe.sessionsStore[0].payload.payment_intent_data.metadata.tenantId,'tenant_123');
  assert.equal(stripe.sessionsStore[3].payload.subscription_data.metadata.tenantId,'tenant_123');
});

test('browser amount fields are rejected before any Stripe operation',async()=>{
  const {stripe,service}=await setup();
  const before=stripe.calls.read+stripe.calls.write;
  await assert.rejects(service.createCheckout({...request('SITE-BUYOUT'),amount:1}),/Client amount/);
  await assert.rejects(service.createCheckout({...request('SITE-BUYOUT'),items:[{sku:'SITE-BUYOUT',quantity:1,unit_amount:1}]}),/Client amount/);
  await assert.rejects(service.createCheckout({...request('SITE-BUYOUT'),metadata:{priceCents:'1'}}),/Client amount/);
  assert.equal(stripe.calls.read+stripe.calls.write,before);
});

test('double-click with the same idempotency key yields one session and one customer',async()=>{
  const {stripe,service}=await setup();
  const [first,second]=await Promise.all([service.createCheckout(request('SITE-BUYOUT')),service.createCheckout(request('SITE-BUYOUT'))]);
  assert.deepEqual(first,second);
  assert.equal(stripe.calls.sessionCreates,1);
  assert.equal(stripe.calls.customerCreates,1);
  await assert.rejects(service.createCheckout({...request('SITE-BUYOUT'),returnPath:'/different'}),/Idempotency key reused/);
});

test('same tenant reuses one customer across separate checkout clicks',async()=>{
  const {stripe,service}=await setup();
  await service.createCheckout(request('SITE-BUYOUT','first_click_123'));
  await service.createCheckout(request('MEDIA-PUBLISH','second_click_123'));
  assert.equal(stripe.calls.customerCreates,1);
  assert.equal(stripe.calls.sessionCreates,2);
  assert.equal(stripe.sessionsStore[0].payload.customer,stripe.sessionsStore[1].payload.customer);
});

test('coming-soon and inactive SKUs cannot start checkout',async()=>{
  const {stripe,service}=await setup();
  const before=stripe.calls.read+stripe.calls.write;
  await assert.rejects(service.createCheckout(request('PLAN-GROWTH-MONTH','growth_click_123')),/Price coming soon/);
  await assert.rejects(service.createCheckout(request('ADS-LAUNCH','ads_click_123')),/Not available/);
  assert.equal(stripe.calls.read+stripe.calls.write,before);
});

test('SITE-BUYOUT remains a flat $1,500 for any months-paid metadata',async()=>{
  const {stripe,service}=await setup();
  for(const monthsPaid of [0,2,12]) await service.createCheckout({...request('SITE-BUYOUT',`buyout_${monthsPaid}_123`),metadata:{monthsPaid:String(monthsPaid)}});
  assert.equal(stripe.sessionsStore.length,3);
  for(const session of stripe.sessionsStore) {
    const price=stripe.pricesStore.find(item=>item.id===session.payload.line_items[0].price);
    assert.equal(price.unit_amount,150000);
    assert.equal(session.payload.line_items[0].quantity,1);
  }
  await assert.rejects(service.createCheckout({...request('SITE-BUYOUT','bad_quantity_123'),items:[{sku:'SITE-BUYOUT',quantity:2}]}),/Quantity must be one/);
});

test('checkout refuses unsynced or mismatched Stripe prices',async()=>{
  const {stripe,service}=await setup();
  stripe.pricesStore.find(item=>item.lookup_key==='SITE-BUYOUT@1').unit_amount=149900;
  await assert.rejects(service.createCheckout(request('SITE-BUYOUT')),/not synced/);
  assert.equal(stripe.calls.sessionCreates,0);
});

test('live key prefixes and unconfigured tax block checkout before charging',async()=>{
  const stripe=makeFakeStripe(), data=approvedCatalog();
  assert.throws(()=>createCheckoutService({stripe,env:{...fakeTestEnv,STRIPE_SECRET_KEY:'sk_live_NOT_REAL'},catalogData:data,baseUrl:'http://localhost:5181',taxConfigured:true}),/Live Stripe key/);
  const service=createCheckoutService({stripe,env:fakeTestEnv,catalogData:data,baseUrl:'http://localhost:5181'});
  await assert.rejects(service.createCheckout(request('SITE-BUYOUT')),/Tax treatment is not configured/);
  assert.equal(stripe.calls.read+stripe.calls.write,0);
});
