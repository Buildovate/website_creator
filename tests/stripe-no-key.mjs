import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCheckoutService, stripeConnectionState } from '../src/payments/checkout.ts';
import { renderBuyButton } from '../src/client/workspace/billing.ts';
import { makeFakeStripe } from './stripe-fake.mjs';

test('no-key checkout returns Payments not connected without contacting fake Stripe',async()=>{
  const stripe=makeFakeStripe();
  const service=createCheckoutService({stripe,env:{},baseUrl:'http://localhost:5181'});
  assert.equal(stripeConnectionState({},stripe),'not_connected');
  const result=await service.createCheckout({tenantId:'tenant_123',items:[{sku:'SITE-BUYOUT',quantity:1}],returnPath:'/app/billing',idempotencyKey:'offline_click_123'});
  assert.deepEqual(result,{state:'not_connected',message:'Payments not connected'});
  assert.equal(stripe.calls.read+stripe.calls.write,0);
});

test('no-key Buy button remains visible, explains state, and cannot fire checkout',()=>{
  const html=renderBuyButton({sku:'SITE-BUYOUT',connected:false});
  assert.match(html,/<button[^>]*disabled[^>]*>Buy<\/button>/);
  assert.match(html,/>Payments not connected<\/p>/);
  assert.doesNotMatch(html,/data-buy-sku=/);
  const ready=renderBuyButton({sku:'SITE-BUYOUT',connected:true});
  assert.match(ready,/data-buy-sku="SITE-BUYOUT"/);
  assert.doesNotMatch(ready,/disabled/);
});
