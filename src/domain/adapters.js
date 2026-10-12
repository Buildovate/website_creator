// AWS clients belong to the Node runtime. The portable Worker never constructs them.
export const customDomainsLive = env => env.CUSTOM_DOMAINS_LIVE === '1';
export const domainAdapters = env => ({checks: env.DOMAIN_CHECKS || null, provisioner: env.DOMAIN_PROVISIONER || null});
export function recheckInterval(env) {
  const value = Number(env.DOMAIN_RECHECK_INTERVAL_MS || 180000);
  return Number.isInteger(value) && value >= 1000 && value <= 3600000 ? value : 180000;
}
