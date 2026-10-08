import { readFileSync } from 'node:fs';

export type Cadence = 'one_time' | 'month' | 'year';
export type Entitlement = { key: string; quantity: number | null };
export type CatalogRow = {
  sku: string;
  version: number;
  name: string;
  description: string;
  category: string;
  priceCents: number | null;
  proposedPriceCents: number | null;
  currency: 'USD';
  cadence: Cadence;
  entitlementKeys: Entitlement[];
  active: boolean;
  taxFlag: 'requires_configuration' | 'taxable' | 'not_taxable';
  planId?: 'website' | 'growth' | 'all_in';
  [key: string]: unknown;
};
export type Catalog = {
  catalogVersion: number;
  currency: 'USD';
  taxFlag: string;
  priceDisplayWhenUnapproved: string;
  rentalPolicy: {
    monthlyMinimumMonths: number;
    annualMinimumMonths: number;
    cancel: { siteComesDown: boolean; siteExport: boolean; contractorKeepsDomain: boolean; dataHoldDays: number };
    ownerHostingAfterBuyoutSku: string;
    ownerExport: { staticFiles: boolean; platformPiecesIncluded: boolean; implementationState: string };
  };
  plans: Record<string, { name: string; inherits: string | null; inclusions: Entitlement[] }>;
  products: CatalogRow[];
};

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

export function validateCatalog(config: Catalog): void {
  if (!Number.isInteger(config.catalogVersion) || config.catalogVersion < 1 || config.currency !== 'USD') throw new Error('Invalid catalog version or currency');
  if (config.priceDisplayWhenUnapproved !== 'Price coming soon') throw new Error('Unapproved price display must be explicit');
  if (config.rentalPolicy.monthlyMinimumMonths !== 3 || config.rentalPolicy.annualMinimumMonths !== 0) throw new Error('Rental minimum terms do not match the locked policy');
  if (config.rentalPolicy.cancel.siteComesDown !== true || config.rentalPolicy.cancel.siteExport !== false || config.rentalPolicy.cancel.contractorKeepsDomain !== true || config.rentalPolicy.cancel.dataHoldDays !== 90) throw new Error('Rental cancellation policy does not match the locked policy');
  const seen = new Set<string>();
  for (const row of config.products) {
    if (!row.sku || !Number.isInteger(row.version) || row.version < 1 || seen.has(row.sku)) throw new Error(`Invalid or duplicate SKU: ${row.sku}`);
    seen.add(row.sku);
    if (row.currency !== 'USD' || !['one_time','month','year'].includes(row.cadence)) throw new Error(`Invalid currency or cadence: ${row.sku}`);
    for (const amount of [row.priceCents,row.proposedPriceCents]) if (amount !== null && (!Number.isSafeInteger(amount) || amount < 0)) throw new Error(`Invalid integer cents: ${row.sku}`);
    if (typeof row.active !== 'boolean' || !['requires_configuration','taxable','not_taxable'].includes(row.taxFlag)) throw new Error(`Invalid activation or tax flag: ${row.sku}`);
    if (!Array.isArray(row.entitlementKeys) || row.entitlementKeys.some(item => !item.key || (item.quantity !== null && (!Number.isSafeInteger(item.quantity) || item.quantity < 0)))) throw new Error(`Invalid entitlement: ${row.sku}`);
    if (row.active && row.priceCents === null) throw new Error(`Active SKU lacks a price: ${row.sku}`);
  }
  for (const plan of ['website','growth','all_in']) {
    const monthly = config.products.find(row => row.sku === `PLAN-${plan.toUpperCase().replace(/_/g,'-')}-MONTH`);
    const annual = config.products.find(row => row.sku === `PLAN-${plan.toUpperCase().replace(/_/g,'-')}-YEAR`);
    if (!monthly || !annual || monthly.planId !== plan || annual.planId !== plan) throw new Error(`Missing ${plan} plan rows`);
    if ((monthly.priceCents === null) !== (annual.priceCents === null) || (monthly.priceCents !== null && annual.priceCents !== monthly.priceCents * 10)) throw new Error(`Annual price must equal ten monthly payments: ${plan}`);
    if ((monthly.proposedPriceCents === null) !== (annual.proposedPriceCents === null) || (monthly.proposedPriceCents !== null && annual.proposedPriceCents !== monthly.proposedPriceCents * 10)) throw new Error(`Proposed annual price must equal ten monthly payments: ${plan}`);
  }
  for (const [sku,price] of [['SITE-OWN',150000],['SITE-BUYOUT',150000],['OWNER-HOSTING',5000]] as const) {
    if (config.products.find(row => row.sku === sku)?.priceCents !== price) throw new Error(`Locked price mismatch: ${sku}`);
  }
  for (const sku of ['SITE-OWN','SITE-BUYOUT']) if (!config.products.find(row => row.sku === sku)?.entitlementKeys.some(item => item.key === 'site_owned' && item.quantity === 1)) throw new Error(`Ownership entitlement missing: ${sku}`);
  for (const row of config.products.filter(row => row.category === 'Website Add-ons')) if (row.active) throw new Error(`Add-on activated without approval: ${row.sku}`);
}

const parsed = JSON.parse(readFileSync(new URL('../../config/pricing.v1.json', import.meta.url), 'utf8')) as Catalog;
validateCatalog(parsed);
export const catalog: Readonly<Catalog> = deepFreeze(parsed);

export function getProduct(sku: string): Readonly<CatalogRow> | undefined {
  return catalog.products.find(row => row.sku === sku);
}

export function getPlanEntitlements(planId: 'website' | 'growth' | 'all_in'): Readonly<Entitlement[]> {
  const resolved = new Map<string, Entitlement>();
  const visit = (id: string, visited = new Set<string>()): void => {
    if (visited.has(id)) throw new Error(`Plan inheritance cycle: ${id}`);
    const plan = catalog.plans[id];
    if (!plan) throw new Error(`Unknown plan: ${id}`);
    visited.add(id);
    if (plan.inherits) visit(plan.inherits, visited);
    for (const item of plan.inclusions) resolved.set(item.key, item);
  };
  visit(planId);
  return deepFreeze([...resolved.values()]);
}

export function purchaseEligibility(sku: string, taxConfigured = false): { allowed: boolean; reason: string | null } {
  const row = getProduct(sku);
  if (!row) return { allowed:false, reason:'Unknown SKU' };
  if (!row.active) return { allowed:false, reason:'Not available' };
  if (row.priceCents === null) return { allowed:false, reason:'Price coming soon' };
  if (row.taxFlag === 'requires_configuration' && !taxConfigured) return { allowed:false, reason:'Tax configuration required' };
  return { allowed:true, reason:null };
}

export function priceSnapshot(sku: string): Readonly<{sku:string; version:number; catalogVersion:number; priceCents:number | null; currency:'USD'; cadence:Cadence}> {
  const row = getProduct(sku);
  if (!row) throw new Error(`Unknown SKU: ${sku}`);
  return deepFreeze({sku:row.sku,version:row.version,catalogVersion:catalog.catalogVersion,priceCents:row.priceCents,currency:row.currency,cadence:row.cadence});
}

function asDate(input: string | Date): Date {
  const date = input instanceof Date ? new Date(input.getTime()) : new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
  return date;
}
function addCalendarMonths(input: string | Date, count: number): Date {
  const source = asDate(input);
  const target = new Date(Date.UTC(source.getUTCFullYear(),source.getUTCMonth()+count,1,source.getUTCHours(),source.getUTCMinutes(),source.getUTCSeconds(),source.getUTCMilliseconds()));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
  target.setUTCDate(Math.min(source.getUTCDate(),lastDay));
  return target;
}
export function monthlyMinimumEnd(startedAt: string | Date): string {
  return addCalendarMonths(startedAt,catalog.rentalPolicy.monthlyMinimumMonths).toISOString();
}
export function buyoutPriceCents(_monthsPaid: number): number {
  return getProduct('SITE-BUYOUT')!.priceCents!;
}
export function rentalCancellationTerms(startedAt: string | Date, canceledAt: string | Date): Readonly<{minimumEndsAt:string; withinMinimum:boolean; siteComesDown:boolean; siteExport:boolean; contractorKeepsDomain:boolean; dataHoldDays:number}> {
  const start = asDate(startedAt), canceled = asDate(canceledAt);
  if (canceled < start) throw new Error('Cancellation precedes rental start');
  const minimumEndsAt = monthlyMinimumEnd(start);
  return deepFreeze({minimumEndsAt,withinMinimum:canceled < asDate(minimumEndsAt),...catalog.rentalPolicy.cancel});
}
