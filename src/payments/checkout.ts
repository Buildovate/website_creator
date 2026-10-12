import { catalog, type Catalog, type CatalogRow } from '../platform/catalog.ts';

export type CheckoutItem = { sku: string; quantity: number };
export type CheckoutRequest = {
  tenantId: string;
  items: CheckoutItem[];
  returnPath: string;
  metadata?: Record<string, string>;
  idempotencyKey: string;
};
export type StripeEnvironment = Record<string, string | undefined>;

type StripeClient = {
  paymentMethodConfigurations: { retrieve: (id:string) => Promise<Record<string, any>> };
  customers: {
    search: (input: object) => Promise<{data: Array<{id:string}>}>;
    create: (input: object, options: object) => Promise<{id:string}>;
  };
  prices: { list: (input: object) => Promise<{data: Array<Record<string, any>>}> };
  checkout: { sessions: { create: (input: object, options: object) => Promise<{url:string}> } };
};

export function stripeConnectionState(env: StripeEnvironment, client?: StripeClient): 'ready' | 'not_connected' {
  assertTestEnvironment(env);
  return env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY && env.STRIPE_WEBHOOK_SECRET && client ? 'ready' : 'not_connected';
}

export function assertTestEnvironment(env: StripeEnvironment): void {
  for (const name of ['STRIPE_SECRET_KEY','STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET']) {
    const value = env[name];
    if (/^(?:sk|rk|pk)_live_/.test(value ?? '')) throw new Error(`Live Stripe key refused in ${name}.`);
  }
  if (env.STRIPE_SECRET_KEY && !/^(?:sk|rk)_test_/.test(env.STRIPE_SECRET_KEY)) throw new Error('STRIPE_SECRET_KEY must be a TEST key.');
  if (env.STRIPE_PUBLISHABLE_KEY && !/^pk_test_/.test(env.STRIPE_PUBLISHABLE_KEY)) throw new Error('STRIPE_PUBLISHABLE_KEY must be a TEST key.');
  if (env.STRIPE_WEBHOOK_SECRET && !/^whsec_/.test(env.STRIPE_WEBHOOK_SECRET)) throw new Error('STRIPE_WEBHOOK_SECRET must be a webhook signing secret.');
}

function assertRequest(request: CheckoutRequest): void {
  if (!request || typeof request !== 'object') throw new Error('Checkout request is required.');
  const allowed = new Set(['tenantId','items','returnPath','metadata','idempotencyKey']);
  if (Object.keys(request).some(key => !allowed.has(key))) throw new Error('Client amount or unsupported checkout field rejected.');
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(request.tenantId)) throw new Error('Invalid authenticated tenant id.');
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(request.idempotencyKey)) throw new Error('One idempotency key is required per click.');
  if (!/^\/(?!\/)[A-Za-z0-9/_?&=.%+-]*$/.test(request.returnPath) || request.returnPath.includes('..')) throw new Error('Return path must be a local path.');
  if (!Array.isArray(request.items) || request.items.length === 0) throw new Error('Choose at least one catalog item.');
  for (const item of request.items) {
    if (!item || Object.keys(item).some(key => !['sku','quantity'].includes(key))) throw new Error('Client amount or unsupported item field rejected.');
    if (typeof item.sku !== 'string' || !Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new Error('Invalid catalog item or quantity.');
  }
  if (request.metadata !== undefined) {
    if (!request.metadata || typeof request.metadata !== 'object' || Array.isArray(request.metadata)) throw new Error('Invalid checkout metadata.');
    for (const [key,value] of Object.entries(request.metadata)) {
      if (!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(key) || /amount|price|total|currency|tenant/i.test(key) || typeof value !== 'string' || value.length > 300) throw new Error('Client amount or unsupported metadata rejected.');
    }
  }
}

function modeFor(row: CatalogRow): 'payment' | 'subscription' {
  return row.category === 'Website Plans' || row.cadence !== 'one_time' ? 'subscription' : 'payment';
}
function expectedInterval(row: CatalogRow): string | null { return row.cadence === 'one_time' ? null : row.cadence; }

export function createCheckoutService({ stripe, env = {}, catalogData = catalog, baseUrl, taxConfigured = false }: {stripe?: StripeClient; env?: StripeEnvironment; catalogData?: Catalog; baseUrl: string; taxConfigured?: boolean}) {
  assertTestEnvironment(env);
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:' && !(origin.protocol === 'http:' && ['localhost','127.0.0.1'].includes(origin.hostname))) throw new Error('Checkout return origin must use HTTPS or localhost.');
  const customerIds = new Map<string,string>();
  const customerFlights = new Map<string,Promise<string>>();
  const sessionFlights = new Map<string,{signature:string; result:Promise<{url:string}>}>();
  async function customerFor(tenantId: string): Promise<string> {
    const cached = customerIds.get(tenantId);
    if (cached) return cached;
    let flight = customerFlights.get(tenantId);
    if (!flight) {
      flight = (async () => {
        const existing = await stripe!.customers.search({ query: `metadata['tenantId']:'${tenantId}'`, limit: 1 });
        const customer = existing.data[0] ?? await stripe!.customers.create({ metadata: { tenantId } }, { idempotencyKey: `customer:${tenantId}` });
        customerIds.set(tenantId,customer.id);
        return customer.id;
      })();
      customerFlights.set(tenantId,flight);
      void flight.finally(() => customerFlights.delete(tenantId)).catch(() => {});
    }
    return flight;
  }
  async function createCheckout(request: CheckoutRequest): Promise<{url:string} | {state:'not_connected'; message:string}> {
    assertRequest(request);
    if (stripeConnectionState(env,stripe) === 'not_connected') return {state:'not_connected',message:'Payments not connected'};
    const rows = request.items.map(item => {
      const row = catalogData.products.find(candidate => candidate.sku === item.sku);
      if (!row) throw new Error(`Unknown SKU: ${item.sku}`);
      if (row.priceCents === null) throw new Error(`Price coming soon: ${item.sku}`);
      if (!row.active) throw new Error(`Not available for checkout: ${item.sku}`);
      if (row.taxFlag === 'requires_configuration' && !taxConfigured) throw new Error(`Tax treatment is not configured: ${item.sku}`);
      if (['SITE-OWN','SITE-BUYOUT','OWNER-HOSTING'].includes(row.sku) || row.category === 'Website Plans') if (item.quantity !== 1) throw new Error(`Quantity must be one: ${row.sku}`);
      if (!Number.isSafeInteger(row.priceCents * item.quantity)) throw new Error(`Invalid checkout total: ${row.sku}`);
      return row;
    });
    const modes = new Set(rows.map(modeFor));
    if (modes.size !== 1) throw new Error('Payment and subscription items require separate checkouts.');
    const mode = [...modes][0];
    // Separate Dashboard configurations prevent financing from leaking into recurring/add-on checkouts.
    const ownership = rows.length === 1 && rows[0].sku === 'SITE-BUYOUT' && mode === 'payment';
    const configuration = ownership ? env.STRIPE_OWNERSHIP_PAYMENT_METHOD_CONFIGURATION : env.STRIPE_CARD_PAYMENT_METHOD_CONFIGURATION;
    if (!configuration || !/^pmc_[A-Za-z0-9_]+$/.test(configuration) || !stripe!.paymentMethodConfigurations?.retrieve)
      return {state:'not_connected',message:'Payments not connected: payment methods need setup.'};
    if (ownership && configuration === env.STRIPE_CARD_PAYMENT_METHOD_CONFIGURATION)
      throw new Error('Ownership and card-only payment configurations must be separate.');
    const signature = JSON.stringify({items:request.items,returnPath:request.returnPath,metadata:request.metadata ?? {},mode,configuration});
    const key = `${request.tenantId}:${request.idempotencyKey}`;
    const previous = sessionFlights.get(key);
    if (previous) {
      if (previous.signature !== signature) throw new Error('Idempotency key reused with different checkout details.');
      return previous.result;
    }
    const result = (async () => {
      const config = await stripe!.paymentMethodConfigurations.retrieve(configuration);
      const allowed = ownership ? ['card','klarna','affirm'] : ['card'];
      const enabled = Object.entries(config).filter(([,value]) => value && typeof value === 'object' && value.display_preference?.value === 'on').map(([key]) => key);
      if (config.id !== configuration || config.active !== true || config.livemode !== false || allowed.some(key => !enabled.includes(key) || config[key]?.available !== true) || enabled.some(key => !allowed.includes(key)))
        throw new Error('Payment methods need setup: use card only, or card, Klarna and Affirm for ownership.');
      const lineItems = await Promise.all(rows.map(async (row,index) => {
        const found = await stripe!.prices.list({ lookup_keys: [`${row.sku}@${row.version}`], limit: 1 });
        const price = found.data[0];
        if (!price || !price.active || price.lookup_key !== `${row.sku}@${row.version}` || price.unit_amount !== row.priceCents || price.currency !== 'usd' || (price.recurring?.interval ?? null) !== expectedInterval(row) || price.metadata?.sku !== row.sku || price.metadata?.version !== String(row.version)) throw new Error(`Stripe TEST price is not synced to catalog: ${row.sku}`);
        return { price: price.id, quantity: request.items[index].quantity };
      }));
      const customer = await customerFor(request.tenantId);
      const path = request.returnPath;
      const metadata = { ...request.metadata, tenantId: request.tenantId, catalogVersion: String(catalogData.catalogVersion), skus: rows.map(row => row.sku).join(',') };
      const payload: Record<string,unknown> = {
        mode, customer, line_items: lineItems, metadata, payment_method_configuration: configuration,
        success_url: `${origin.origin}${path}${path.includes('?') ? '&' : '?'}checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin.origin}${path}${path.includes('?') ? '&' : '?'}checkout=cancel`
      };
      if (mode === 'subscription') payload.subscription_data = { metadata };
      else payload.payment_intent_data = { metadata };
      const session = await stripe!.checkout.sessions.create(payload,{ idempotencyKey: `checkout:${key}` });
      if (!session.url) throw new Error('Stripe TEST session returned no URL.');
      return { url: session.url };
    })();
    sessionFlights.set(key,{signature,result});
    void result.catch(() => sessionFlights.delete(key));
    return result;
  }
  return { createCheckout, connectionState: () => stripeConnectionState(env,stripe) };
}

const runtimeServices = new WeakMap<StripeEnvironment, ReturnType<typeof createCheckoutService>>();
export async function createCheckout(request: CheckoutRequest, env: StripeEnvironment = process.env): Promise<{url:string} | {state:'not_connected'; message:string}> {
  assertTestEnvironment(env);
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PUBLISHABLE_KEY || !env.STRIPE_WEBHOOK_SECRET) return {state:'not_connected',message:'Payments not connected'};
  let service=runtimeServices.get(env);
  if (!service) {
    const { default: Stripe } = await import('stripe');
    service = createCheckoutService({stripe:new Stripe(env.STRIPE_SECRET_KEY) as unknown as StripeClient,env,baseUrl:env.APP_ORIGIN || 'http://localhost:5181',taxConfigured:env.STRIPE_TAX_CONFIGURED==='1'});
    runtimeServices.set(env,service);
  }
  return service.createCheckout(request);
}

export type SettledPayment = {tenantId:string; sku:string; ledgerId:string; amountCents:number; periodStart:string; periodEnd:string};
const settlementHandlers = new Map<string, Set<(payment:SettledPayment)=>void|Promise<void>>>();
export function onSettled(sku:string, handler:(payment:SettledPayment)=>void|Promise<void>):()=>void {
  if (!sku || typeof handler !== 'function') throw new Error('SKU and settlement handler are required.');
  const handlers=settlementHandlers.get(sku) ?? new Set();
  handlers.add(handler); settlementHandlers.set(sku,handlers);
  return ()=>{handlers.delete(handler);if(!handlers.size)settlementHandlers.delete(sku);};
}
export async function dispatchSettled(payment:SettledPayment):Promise<void> {
  for (const handler of settlementHandlers.get(payment.sku) ?? []) await handler(payment);
}
