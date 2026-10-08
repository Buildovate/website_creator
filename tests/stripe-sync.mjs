import assert from 'node:assert/strict';
import { test } from 'node:test';
import { catalog } from '../src/platform/catalog.ts';
import { syncCatalog, runSyncCli, formatSummary } from '../scripts/stripe-sync.mjs';
import { makeFakeStripe, fakeTestEnv } from './stripe-fake.mjs';

function approvedSample() {
  const sample=structuredClone(catalog);
  for(const sku of ['PLAN-WEBSITE-MONTH','PLAN-WEBSITE-YEAR','SITE-BUYOUT','MEDIA-PUBLISH']) {
    const row=sample.products.find(item=>item.sku===sku);
    row.active=true;
    if(row.priceCents===null)row.priceCents=row.proposedPriceCents;
  }
  return sample;
}

test('sync creates versioned Products and Prices with exact lookup keys',async()=>{
  const stripe=makeFakeStripe();
  const result=await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:approvedSample()});
  assert.equal(result.createdProducts,4);
  assert.equal(result.createdPrices,4);
  assert.equal(result.updatedProducts,0);
  assert.equal(result.updatedPrices,0);
  assert.equal(result.skipped,71);
  assert.deepEqual(stripe.pricesStore.map(price=>price.lookup_key),['PLAN-WEBSITE-MONTH@1','PLAN-WEBSITE-YEAR@1','SITE-BUYOUT@1','MEDIA-PUBLISH@1']);
  assert.equal(stripe.pricesStore[0].unit_amount,5000);
  assert.equal(stripe.pricesStore[1].unit_amount,50000);
  assert.equal(stripe.pricesStore[2].unit_amount,150000);
  assert.deepEqual(stripe.pricesStore[3].recurring,{interval:'month'});
});

test('second sync is idempotent; metadata updates do not mutate immutable price amounts',async()=>{
  const stripe=makeFakeStripe(), sample=approvedSample();
  await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:sample});
  const writes=stripe.calls.write;
  const second=await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:sample});
  assert.deepEqual([second.createdProducts,second.updatedProducts,second.createdPrices,second.updatedPrices],[0,0,0,0]);
  assert.equal(stripe.calls.write,writes);
  sample.products.find(row=>row.sku==='MEDIA-PUBLISH').description='Reviewed updated wording';
  const revised=await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:sample});
  assert.equal(revised.updatedProducts,1);
  assert.equal(revised.updatedPrices,0);
  sample.products.find(row=>row.sku==='SITE-BUYOUT').priceCents=149900;
  await assert.rejects(syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:sample}),/Immutable Stripe price mismatch/);
});

test('dry-run prints planned changes against a fake snapshot without invoking the client',async()=>{
  const stripe=makeFakeStripe(), output=[];
  const result=await runSyncCli({args:['--dry-run'],env:fakeTestEnv,stripe,catalogData:approvedSample(),snapshot:stripe.snapshot(),write:value=>output.push(value)});
  assert.equal(stripe.calls.read,0);
  assert.equal(stripe.calls.write,0);
  assert.equal(result.createdProducts,4);
  assert.equal(result.createdPrices,4);
  assert.equal(result.skipped,71);
  assert.match(output[0],/^DRY RUN — no Stripe calls: products created 4/);
  assert.equal(output[0],formatSummary(result,true));
});

test('current unapproved catalog skips every row, including coming-soon plans',async()=>{
  const stripe=makeFakeStripe();
  const result=await syncCatalog({stripe,secretKey:fakeTestEnv.STRIPE_SECRET_KEY,catalogData:catalog,dryRun:true});
  assert.equal(result.skipped,75);
  assert.equal(result.createdProducts,0);
  assert.equal(result.createdPrices,0);
  assert.equal(stripe.calls.read+stripe.calls.write,0);
  assert.ok(result.skippedByReason.price_coming_soon>=4);
  assert.ok(result.skippedByReason.inactive>0);
});

test('sync refuses missing, live, and malformed keys before any client call',async()=>{
  const stripe=makeFakeStripe();
  for(const key of [undefined,'sk_live_NOT_REAL','rk_live_NOT_REAL','bad']) {
    await assert.rejects(syncCatalog({stripe,secretKey:key,catalogData:approvedSample()}),/Payments not connected|Live Stripe keys|TEST secret key/);
  }
  assert.equal(stripe.calls.read+stripe.calls.write,0);
});


test('sync CLI also refuses live publishable keys without calling the fake',async()=>{
  const stripe=makeFakeStripe();
  await assert.rejects(runSyncCli({args:['--dry-run'],env:{...fakeTestEnv,STRIPE_PUBLISHABLE_KEY:'pk_live_NOT_REAL'},stripe,catalogData:approvedSample()}),/Live Stripe key/);
  assert.equal(stripe.calls.read+stripe.calls.write,0);
});
