import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/platform/catalog.ts';

export function assertTestSecret(secretKey) {
  if (!secretKey) throw new Error('Payments not connected: STRIPE_SECRET_KEY is missing.');
  if (/^(?:sk|rk)_live_/.test(secretKey)) throw new Error('Live Stripe keys are refused; use TEST mode only.');
  if (!/^(?:sk|rk)_test_/.test(secretKey)) throw new Error('A Stripe TEST secret key is required.');
}

function lookupKey(row) { return `${row.sku}@${row.version}`; }
function expectedRecurring(row) { return row.cadence === 'one_time' ? null : { interval: row.cadence }; }
function samePrice(price, row, productId) {
  return price.product === productId && price.unit_amount === row.priceCents && price.currency === 'usd' &&
    (price.recurring?.interval ?? null) === (expectedRecurring(row)?.interval ?? null);
}
function productChanged(product, row) {
  return product.name !== row.name || product.description !== row.description || product.active !== true ||
    product.metadata?.sku !== row.sku || product.metadata?.version !== String(row.version);
}
function priceChanged(price, row) {
  return price.active !== true || price.metadata?.sku !== row.sku || price.metadata?.version !== String(row.version);
}
async function listAll(list, params = {}) {
  const items = [];
  let startingAfter;
  do {
    const page = await list({ limit: 100, ...params, ...(startingAfter ? { starting_after: startingAfter } : {}) });
    items.push(...page.data);
    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
    if (page.has_more && !startingAfter) throw new Error('Stripe pagination ended without an item id.');
  } while (startingAfter);
  return items;
}

export async function syncCatalog({ stripe, secretKey, catalogData = catalog, dryRun = false, snapshot } = {}) {
  assertTestSecret(secretKey);
  if (!dryRun && !stripe) throw new Error('Stripe client is required for sync.');
  const products = snapshot?.products ?? (dryRun ? [] : await listAll(params => stripe.products.list(params)));
  const prices = snapshot?.prices ?? (dryRun ? [] : await listAll(params => stripe.prices.list(params)));
  const summary = { createdProducts: 0, updatedProducts: 0, createdPrices: 0, updatedPrices: 0, skipped: 0, skippedByReason: {}, actions: [] };
  for (const row of catalogData.products) {
    const skipReason = row.priceCents === null ? 'price_coming_soon' : !row.active ? 'inactive' : null;
    if (skipReason) {
      summary.skipped++;
      summary.skippedByReason[skipReason] = (summary.skippedByReason[skipReason] ?? 0) + 1;
      summary.actions.push({ sku: row.sku, action: 'skipped', reason: skipReason });
      continue;
    }
    if (!Number.isSafeInteger(row.priceCents) || row.priceCents < 0 || row.currency !== 'USD') throw new Error(`Invalid server catalog price: ${row.sku}`);
    const key = lookupKey(row);
    const metadata = { sku: row.sku, version: String(row.version), catalogVersion: String(catalogData.catalogVersion) };
    let product = products.find(item => item.metadata?.sku === row.sku && item.metadata?.version === String(row.version));
    if (!product) {
      summary.createdProducts++;
      summary.actions.push({ sku: row.sku, action: 'create_product', lookupKey: key });
      if (!dryRun) {
        product = await stripe.products.create({ name: row.name, description: row.description, active: true, metadata }, { idempotencyKey: `catalog:product:${key}` });
        products.push(product);
      }
    } else if (productChanged(product, row)) {
      summary.updatedProducts++;
      summary.actions.push({ sku: row.sku, action: 'update_product', lookupKey: key });
      if (!dryRun) {
        product = await stripe.products.update(product.id, { name: row.name, description: row.description, active: true, metadata });
        const index = products.findIndex(item => item.id === product.id);
        products[index] = product;
      }
    }
    const existingPrice = prices.find(item => item.lookup_key === key);
    if (!existingPrice) {
      summary.createdPrices++;
      summary.actions.push({ sku: row.sku, action: 'create_price', lookupKey: key });
      if (!dryRun) {
        const payload = { product: product.id, unit_amount: row.priceCents, currency: 'usd', lookup_key: key, active: true, metadata };
        if (row.cadence !== 'one_time') payload.recurring = { interval: row.cadence };
        prices.push(await stripe.prices.create(payload, { idempotencyKey: `catalog:price:${key}` }));
      }
    } else {
      if (product && !samePrice(existingPrice, row, product.id)) throw new Error(`Immutable Stripe price mismatch for ${key}; publish a new SKU version.`);
      if (priceChanged(existingPrice, row)) {
        summary.updatedPrices++;
        summary.actions.push({ sku: row.sku, action: 'update_price_metadata', lookupKey: key });
        if (!dryRun) {
          const updated = await stripe.prices.update(existingPrice.id, { active: true, metadata });
          prices[prices.findIndex(item => item.id === existingPrice.id)] = updated;
        }
      }
    }
  }
  return summary;
}

export function formatSummary(summary, dryRun = false) {
  const prefix = dryRun ? 'DRY RUN — no Stripe calls' : 'Stripe TEST sync';
  return `${prefix}: products created ${summary.createdProducts}, products updated ${summary.updatedProducts}, prices created ${summary.createdPrices}, prices updated ${summary.updatedPrices}, skipped ${summary.skipped} (inactive ${summary.skippedByReason.inactive ?? 0}, price coming soon ${summary.skippedByReason.price_coming_soon ?? 0}).`;
}

export async function runSyncCli({ args = [], env = process.env, stripe, catalogData = catalog, snapshot, write = console.log } = {}) {
  const dryRun = args.includes('--dry-run');
  if (args.some(arg => arg !== '--dry-run')) throw new Error('Usage: node scripts/stripe-sync.mjs [--dry-run]');
  assertTestSecret(env.STRIPE_SECRET_KEY);
  for (const name of ['STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET']) {
    if (/^(?:sk|rk|pk)_live_/.test(env[name] ?? '')) throw new Error(`Live Stripe key refused in ${name}.`);
  }
  if (env.STRIPE_PUBLISHABLE_KEY && !/^pk_test_/.test(env.STRIPE_PUBLISHABLE_KEY)) throw new Error('STRIPE_PUBLISHABLE_KEY must be a TEST key.');
  if (env.STRIPE_WEBHOOK_SECRET && !/^whsec_/.test(env.STRIPE_WEBHOOK_SECRET)) throw new Error('STRIPE_WEBHOOK_SECRET must be a webhook signing secret.');
  if (!dryRun && !stripe) {
    let Stripe;
    try { ({ default: Stripe } = await import('stripe')); }
    catch { throw new Error('Stripe SDK is not installed. Install the approved SDK before a live TEST-mode run.'); }
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }
  const result = await syncCatalog({ stripe, secretKey: env.STRIPE_SECRET_KEY, catalogData, dryRun, snapshot });
  write(formatSummary(result, dryRun));
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runSyncCli({ args: process.argv.slice(2) }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
