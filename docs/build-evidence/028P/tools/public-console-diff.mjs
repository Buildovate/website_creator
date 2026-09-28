import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = 'C:/Users/joe/website_creator/docs/build-evidence/028P';
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'before-console/public-baseline-console.json')));
const suites = baseline.commands.map(({suite}) => suite);
const current = suites.flatMap(suite => JSON.parse(fs.readFileSync(path.join(root, 'checks', suite + '-console.json')))
  .map(record => ({
    suite,
    message: record.text,
    status: record.text.match(/status of (\d+)|net::([A-Z_]+)/)?.slice(1).find(Boolean) || null,
    url: record.location?.url || '',
    platform: record.platform,
    allowed: record.allowed === true
  })));
const normalizeUrl = url => url.replace(/(https?:\/\/[^/:?#]+):\d+/g, '$1:<port>');
const key = record => JSON.stringify([record.suite, record.message, record.status, normalizeUrl(record.url)]);
function tally(records) {
  const counts = new Map();
  for (const record of records) counts.set(key(record), (counts.get(key(record)) || 0) + 1);
  return counts;
}
const before = tally(baseline.records), after = tally(current);
function difference(left, right, side) {
  return [...left].flatMap(([value, count]) => {
    const missing = count - (right.get(value) || 0);
    if (missing <= 0) return [];
    const [suite, message, status, url] = JSON.parse(value);
    return [{suite, message, status, url, [side]: count, other: right.get(value) || 0, difference: missing}];
  });
}
const newCurrentDiagnostics = difference(after, before, 'current');
const baselineOnlyDiagnostics = difference(before, after, 'baseline');
const report = {
  commit: baseline.commit,
  comparison: 'Multiset by suite, message, status and source URL; only port numbers normalized',
  baselineSuites: suites.length,
  baselineSuiteFailures: baseline.commands.filter(({exitCode}) => exitCode !== 0),
  baselineRecords: baseline.records.length,
  currentRecords: current.length,
  currentUnapproved: current.filter(record => !record.allowed).length,
  matchingCurrentRecords: current.length - newCurrentDiagnostics.reduce((sum, row) => sum + row.difference, 0),
  newCurrentDiagnostics,
  baselineOnlyDiagnostics,
  passed: newCurrentDiagnostics.length === 0
};
fs.writeFileSync(path.join(root, 'checks/public-console-diff.json'), JSON.stringify(report, null, 2));
assert.equal(current.some(record => record.platform !== false), false, 'These eleven suites must remain public-page captures');
assert.equal(report.baselineSuiteFailures.length, 0);
assert.equal(report.passed, true, 'New current public-page diagnostics; stop without committing');
console.log(JSON.stringify(report));
