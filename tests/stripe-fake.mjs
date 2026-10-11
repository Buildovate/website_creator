export function makeFakeStripe() {
  const productsStore = [];
  const pricesStore = [];
  const customersStore = [];
  const sessionsStore = [];
  const calls = { read:0, write:0, sessionCreates:0, customerCreates:0 };
  const idempotentSessions = new Map();
  const stripe = {
    calls, productsStore, pricesStore, customersStore, sessionsStore,
    snapshot: () => ({ products:structuredClone(productsStore), prices:structuredClone(pricesStore) }),
    products: {
      async list({ starting_after } = {}) { calls.read++; const start = starting_after ? productsStore.findIndex(item => item.id === starting_after)+1 : 0; return {data:structuredClone(productsStore.slice(start)),has_more:false}; },
      async create(payload) { calls.write++; const product={id:`prod_fake_${productsStore.length+1}`,...structuredClone(payload)}; productsStore.push(product); return structuredClone(product); },
      async update(id,payload) { calls.write++; const index=productsStore.findIndex(item=>item.id===id); if(index<0)throw Error('Unknown fake product'); Object.assign(productsStore[index],structuredClone(payload)); return structuredClone(productsStore[index]); }
    },
    prices: {
      async list({lookup_keys} = {}) { calls.read++; const found=lookup_keys ? pricesStore.filter(item=>lookup_keys.includes(item.lookup_key)) : pricesStore; return {data:structuredClone(found),has_more:false}; },
      async create(payload) { calls.write++; const price={id:`price_fake_${pricesStore.length+1}`,...structuredClone(payload)}; pricesStore.push(price); return structuredClone(price); },
      async update(id,payload) { calls.write++; const index=pricesStore.findIndex(item=>item.id===id); if(index<0)throw Error('Unknown fake price'); Object.assign(pricesStore[index],structuredClone(payload)); return structuredClone(pricesStore[index]); }
    },
    customers: {
      async search({query}) { calls.read++; const tenantId=query.match(/metadata\['tenantId'\]:'([^']+)'/)?.[1]; return {data:structuredClone(customersStore.filter(item=>item.metadata.tenantId===tenantId))}; },
      async create(payload) { calls.write++; calls.customerCreates++; const customer={id:`cus_fake_${customersStore.length+1}`,...structuredClone(payload)}; customersStore.push(customer); return structuredClone(customer); }
    },
    checkout: { sessions: {
      async create(payload,{idempotencyKey}) { if(idempotentSessions.has(idempotencyKey))return structuredClone(idempotentSessions.get(idempotencyKey)); calls.write++; calls.sessionCreates++; const session={id:`cs_test_fake_${sessionsStore.length+1}`,url:`https://checkout.stripe.test/fake/${sessionsStore.length+1}`,payload:structuredClone(payload),idempotencyKey}; sessionsStore.push(session); idempotentSessions.set(idempotencyKey,session); return structuredClone(session); }
    }}
  };
  return stripe;
}

export const fakeTestEnv = Object.freeze({
  STRIPE_SECRET_KEY:'sk_test_FAKE_FOR_OFFLINE_TESTS',
  STRIPE_PUBLISHABLE_KEY:'pk_test_FAKE_FOR_OFFLINE_TESTS',
  STRIPE_WEBHOOK_SECRET:'whsec_FAKE_FOR_OFFLINE_TESTS'
});

export function makeFakeBillingAdapter({quotedAmountCents=50000,quotedNetCents=quotedAmountCents}={}){
  const quotes=new Map(),switches=[],cancellations=[],downgrades=[],ownerships=[],hostingStops=[],delinquencyCancels=[];
  return {
    quotes,switches,cancellations,downgrades,ownerships,hostingStops,delinquencyCancels,
    async scheduleDowngrade(input){if(!downgrades.some(x=>x.idempotencyKey===input.idempotencyKey))downgrades.push(structuredClone(input));return {accepted:true};},
    async startOwnerHosting(input){if(!ownerships.some(x=>x.idempotencyKey===input.idempotencyKey))ownerships.push(structuredClone(input));return {accepted:true,subscriptionId:"sub_owner_qa"};},
    async cancelDelinquentSubscription(input){if(!delinquencyCancels.some(x=>x.idempotencyKey===input.idempotencyKey))delinquencyCancels.push(structuredClone(input));return {accepted:true};},
    async stopHosting(input){if(!hostingStops.some(x=>x.idempotencyKey===input.idempotencyKey))hostingStops.push(structuredClone(input));return {accepted:true};},
    async previewSwitch(input){
      const id=`quote_fake_${quotes.size+1}`;
      quotes.set(id,structuredClone(input));
      return {id,amountDueCents:quotedAmountCents,lineNetCents:quotedNetCents,taxCents:quotedAmountCents-quotedNetCents,effectiveAt:'2026-10-08T00:00:00.000Z'};
    },
    async confirmSwitch(input){
      const quote=quotes.get(input.quoteId);
      if(!quote||quote.tenantId!==input.tenantId||quote.targetSku!==input.targetSku||quote.subscriptionId!==input.subscriptionId)return {accepted:false};
      if(!switches.some(item=>item.idempotencyKey===input.idempotencyKey))switches.push(structuredClone(input));
      return {accepted:true};
    },
    async scheduleCancellation(input){
      if(!cancellations.some(item=>item.idempotencyKey===input.idempotencyKey))cancellations.push(structuredClone(input));
      return {accepted:true};
    }
  };
}
