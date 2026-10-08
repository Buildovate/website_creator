import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { catalog, validateCatalog, getProduct, getPlanEntitlements, purchaseEligibility, priceSnapshot, monthlyMinimumEnd, buyoutPriceCents, rentalCancellationTerms } from '../src/platform/catalog.ts';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const rows = text => [...text.matchAll(/^\| `([^`]+)` \|/gm)].map(match => match[1]);

const pack3 = rows(read('../docs/product/PACK3_PRICE_BOOK.md'));
const pack4 = rows(read('../docs/product/PACK4_CATALOG_DELTA.md'));
const clone = () => structuredClone(catalog);

test('catalog validates and includes every Pack 3 and Pack 4 SKU exactly once', () => {
  validateCatalog(clone());
  assert.equal(catalog.catalogVersion, 1);
  assert.equal(catalog.currency, 'USD');
  assert.equal(pack3.length, 49);
  assert.equal(pack4.length, 27);
  assert.equal(new Set([...pack3,...pack4]).size, 53);
  assert.equal(catalog.products.length, 75);
  for (const sku of new Set([...pack3,...pack4])) assert.ok(getProduct(sku), sku);
  assert.equal(new Set(catalog.products.map(row => row.sku)).size, catalog.products.length);
});

test('all amounts are integer cents, proposed plan prices remain unavailable, and annual equals ten months', () => {
  for (const row of catalog.products) {
    assert.equal(row.currency, 'USD');
    assert.ok(row.priceCents === null || Number.isSafeInteger(row.priceCents));
    assert.ok(row.proposedPriceCents === null || Number.isSafeInteger(row.proposedPriceCents));
  }
  for (const [sku,cents] of [['PLAN-WEBSITE-MONTH',5000],['PLAN-WEBSITE-YEAR',50000],['SITE-OWN',150000],['SITE-BUYOUT',150000],['OWNER-HOSTING',5000]]) {
    const row=getProduct(sku);
    assert.equal(row.priceCents,cents,sku);
    assert.equal(row.active,true,sku);
    assert.equal(purchaseEligibility(sku,true).allowed,true,sku);
  }
  assert.equal(getProduct('PLAN-WEBSITE-YEAR').priceCents,getProduct('PLAN-WEBSITE-MONTH').priceCents*10);
  for (const [plan,monthly] of [['GROWTH',27900],['ALL-IN',44900]]) {
    const month = getProduct(`PLAN-${plan}-MONTH`), year = getProduct(`PLAN-${plan}-YEAR`);
    assert.equal(month.priceCents, null);
    assert.equal(year.priceCents, null);
    assert.equal(month.proposedPriceCents, monthly);
    assert.equal(year.proposedPriceCents, monthly * 10);
    assert.equal(month.displayPrice, 'Price coming soon');
    assert.equal(year.displayPrice, 'Price coming soon');
    assert.equal(month.active,false);
    assert.equal(purchaseEligibility(month.sku).allowed, false);
  }
  const invalid = clone();
  invalid.products.find(row => row.sku === 'AI-UGC-PACK').priceCents = 197.5;
  assert.throws(() => validateCatalog(invalid), /integer cents/);
});

test('locked ownership prices and rental rules override older proposals', () => {
  assert.equal(getProduct('SITE-OWN').priceCents, 150000);
  assert.equal(getProduct('SITE-BUYOUT').priceCents, 150000);
  assert.equal(getProduct('OWNER-HOSTING').priceCents, 5000);
  assert.deepEqual(getProduct('SITE-OWN').entitlementKeys, [{key:'site_owned',quantity:1}]);
  assert.deepEqual(getProduct('SITE-BUYOUT').entitlementKeys, [{key:'site_owned',quantity:1}]);
  assert.equal(getProduct('WEB+UGC-BUNDLE').priceCents, null);
  assert.equal(getProduct('WEB+UGC-BUNDLE').proposedPriceCents, 84900);
  assert.equal(catalog.rentalPolicy.monthlyMinimumMonths, 3);
  assert.equal(catalog.rentalPolicy.annualMinimumMonths, 0);
  assert.equal(catalog.rentalPolicy.ownerExport.implementationState, 'not_built');
});

test('monthly minimum uses calendar month boundaries, including short February', () => {
  assert.equal(monthlyMinimumEnd('2026-01-31T10:00:00.000Z'), '2026-04-30T10:00:00.000Z');
  assert.equal(monthlyMinimumEnd('2024-11-30T10:00:00.000Z'), '2025-02-28T10:00:00.000Z');
  assert.equal(monthlyMinimumEnd('2023-11-30T10:00:00.000Z'), '2024-02-29T10:00:00.000Z');
  assert.throws(() => monthlyMinimumEnd('not a date'), /Invalid date/);
});

test('buyout remains exactly $1,500 at any month paid', () => {
  for (const monthsPaid of [0,1,2,3,6,12,60]) assert.equal(buyoutPriceCents(monthsPaid), 150000);
});

test('rental cancellation removes site, keeps domain, has no export, and holds data 90 days', () => {
  const early = rentalCancellationTerms('2026-01-31T00:00:00.000Z','2026-02-15T00:00:00.000Z');
  assert.equal(early.minimumEndsAt, '2026-04-30T00:00:00.000Z');
  assert.equal(early.withinMinimum, true);
  assert.equal(early.siteComesDown, true);
  assert.equal(early.siteExport, false);
  assert.equal(early.contractorKeepsDomain, true);
  assert.equal(early.dataHoldDays, 90);
  assert.equal(rentalCancellationTerms('2026-01-31T00:00:00.000Z','2026-04-30T00:00:00.000Z').withinMinimum, false);
  assert.equal(rentalCancellationTerms('2026-01-31T00:00:00.000Z','2026-05-01T00:00:00.000Z').withinMinimum, false);
  assert.throws(() => rentalCancellationTerms('2026-01-31T00:00:00.000Z','2026-01-30T00:00:00.000Z'), /precedes/);
});

test('Pack 4 scope and all add-on activation gates are retained', () => {
  assert.match(getProduct('SEASONAL-DROP').scope, /3 ideas/);
  assert.match(getProduct('JOB-BINDER').scope, /Unlimited eligible/);
  assert.equal(getProduct('EMAIL-STARTER').priceCents, 4900);
  assert.equal(getProduct('EMAIL-GROWTH').priceCents, 9900);
  assert.equal(getProduct('EMAIL-PRO').priceCents, 14900);
  assert.equal(getProduct('EMAIL-DOMAIN-SETUP').priceCents, 7900);
  assert.equal(getProduct('ADS-MANAGE').priceCents, 29700);
  assert.equal(getProduct('ADS-MANAGE-PRO').priceCents, 49700);
  assert.equal(getProduct('AI-UGC-PACK').priceCents, 19700);
  assert.equal(getProduct('AI-UGC-PACK-PLUS').priceCents, 29700);
  assert.equal(getProduct('AI-UGC-EXTRA').priceCents, 7900);
  assert.equal(getProduct('DOMAIN-PREMIUM').markupCents, 1500);
  assert.equal(getProduct('SOCIAL-FULL-PACK').proposedPriceCents, 9700);
  for (const row of catalog.products.filter(row => row.category === 'Website Add-ons')) {
    assert.equal(row.active, false, row.sku);
    assert.equal(purchaseEligibility(row.sku).allowed, false, row.sku);
  }
});

test('plan inclusions are resolved once, with Growth 12 posts and All-in 20', () => {
  const website = getPlanEntitlements('website');
  const growth = getPlanEntitlements('growth');
  const allIn = getPlanEntitlements('all_in');
  assert.ok(website.some(item => item.key === 'site.base'));
  assert.ok(growth.some(item => item.key === 'site.base'));
  assert.equal(growth.find(item => item.key === 'social.posts.month').quantity, 12);
  assert.equal(allIn.find(item => item.key === 'social.posts.month').quantity, 20);
  assert.equal(allIn.find(item => item.key === 'domain.standard.included').quantity, 1);
  assert.throws(() => getPlanEntitlements('missing'), /Unknown plan/);
});

test('catalog rows and published-price snapshots cannot be mutated', () => {
  const snapshot = priceSnapshot('AI-UGC-PACK');
  assert.equal(snapshot.priceCents, 19700);
  assert.equal(snapshot.version, 1);
  assert.equal(snapshot.catalogVersion, 1);
  assert.throws(() => { snapshot.priceCents = 999; }, TypeError);
  assert.throws(() => { getProduct('AI-UGC-PACK').entitlementKeys[0].quantity = 999; }, TypeError);
  assert.equal(getProduct('AI-UGC-PACK').priceCents, 19700);
});

test('every Pack source dollar amount is preserved, with ownership bundle and CRM proposal gated', () => {
  const priceRows = text => [...text.matchAll(/^\| `([^`]+)` \|[^\n]*?\$([\d,]+)/gm)].map(match => [match[1],Number(match[2].replace(/,/g,''))*100]);
  const expected = new Map([...priceRows(read('../docs/product/PACK3_PRICE_BOOK.md')),...priceRows(read('../docs/product/PACK4_CATALOG_DELTA.md'))]);
  assert.equal(expected.size, 53);
  for (const [sku,cents] of expected) {
    const row = getProduct(sku);
    assert.equal(row.sourcePriceCents,cents,sku);
    assert.equal(row.priceCents ?? row.proposedPriceCents,cents,sku);
    assert.equal(row.active,false,sku);
  }
  for (const sku of ['SITE-OWN','SITE-BUYOUT']) assert.equal(getProduct(sku).requiredCompanionSku,'OWNER-HOSTING');
  assert.deepEqual(getProduct('EMAIL-GROWTH').entitlementKeys.at(-1),{key:'email.domain.setup.included',quantity:1});
  assert.deepEqual(getProduct('EMAIL-PRO').entitlementKeys.at(-1),{key:'email.domain.setup.included',quantity:1});
});

test('unpriced active rows and mismatched annual rows fail catalog validation', () => {
  const unpriced = clone();
  unpriced.products.find(row => row.sku === 'DOMAIN-PROTECT').active = true;
  assert.throws(() => validateCatalog(unpriced), /lacks a price/);
  const mismatched = clone();
  mismatched.products.find(row => row.sku === 'PLAN-WEBSITE-YEAR').proposedPriceCents = 40000;
  assert.throws(() => validateCatalog(mismatched), /annual price/);
  const halfPriced = clone();
  halfPriced.products.find(row => row.sku === 'PLAN-WEBSITE-YEAR').priceCents = null;
  assert.throws(() => validateCatalog(halfPriced), /Active SKU lacks a price/);
  const inactiveMismatch = clone();
  inactiveMismatch.products.find(row => row.sku === 'PLAN-WEBSITE-YEAR').active = false;
  inactiveMismatch.products.find(row => row.sku === 'PLAN-WEBSITE-YEAR').priceCents = null;
  assert.throws(() => validateCatalog(inactiveMismatch), /Annual price/);
});
