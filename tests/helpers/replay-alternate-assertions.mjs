import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {snapshotScreenshotEvidence,preserveScreenshotEqualityFailure} from './replay-diagnostics.mjs';

const {loadRegistry,matchCapture,ENTRIES} = createRequire(import.meta.url)('./replay-alternate-registry.cjs');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function exactExpectedReport(savedBytes, alternates) {
  const report = JSON.parse(savedBytes);
  assert.equal(JSON.stringify(report), savedBytes.toString(), 'Saved QA report must use exact compact JSON');
  for (const row of alternates) {
    const file = report.files.find(file => file.path === row.path);
    assert.ok(file, 'QA report must list registered screenshot');
    assert.equal(file.sha256, row.savedSha256);
    file.sha256 = row.actualSha256;
    file.bytes = row.actualBytes;
  }
  return Buffer.from(JSON.stringify(report));
}

export function exactExpectedSummary(savedBytes, alternates) {
  let summary = savedBytes.toString();
  for (const row of alternates) {
    assert.equal(summary.split(row.savedSha256).length - 1, 1,
      'QA summary must contain the saved screenshot SHA exactly once');
    summary = summary.replace(row.savedSha256, row.actualSha256);
  }
  return Buffer.from(summary);
}

export async function compareExactReplay({before,after,folder,prefix,bucket,baselineEvidence,
  diagnostics,diagnosticFolder,out}) {
  const registry = loadRegistry(out);
  assert.equal(registry.length, 4, 'Exactly four proven raster entries');
  assert.equal(before.files.length, 143, 'Saved replay must contain 143 files');
  const afterFiles = new Map(after.files.map(file => [file.path,file]));
  const images = before.files.filter(file => file.path.endsWith('.png'));
  const pageByCapture = new Map(before.pages.flatMap(page =>
    Object.entries(page.screenshots || {}).map(([width,capture]) =>
      [capture,{page:page.path,width:Number(width)}])));
  const matched = [];
  const failures = [];
  const readCurrent = async file => {
    const object = await bucket.get(prefix + file.path);
    assert.ok(object, 'Recaptured file missing: ' + file.path);
    const bytes = Buffer.from(await new Response(object.body).arrayBuffer());
    assert.equal(sha(bytes), file.sha256, 'Packet file digest disagrees with bytes: ' + file.path);
    assert.equal(bytes.length, file.bytes, 'Packet file size disagrees with bytes: ' + file.path);
    return bytes;
  };
  for (const saved of images) {
    const actual = afterFiles.get(saved.path);
    if (!actual) {failures.push({path:saved.path,reason:'Screenshot missing'});break}
    const bytes = await readCurrent(actual);
    const page = pageByCapture.get(saved.path);
    const readiness = diagnostics.records().get(saved.path);
    try {
      const result = matchCapture({capture:saved.path,page:page?.page,width:page?.width,
        savedSha256:saved.sha256,actualSha256:sha(bytes),readiness,registry,
        expectedBytes:fs.readFileSync(path.join(folder,saved.path)),actualBytes:bytes,
        acceptanceLogPath:out+'/checks/replay-alternate-acceptances.json'});
      if (result.entry) matched.push({page:result.entry.page,width:result.entry.width,
        path:saved.path,variant:result.variant,method:result.method||'exact',direction:result.direction,
        changedPixels:result.changedPixels||0,savedSha256:saved.sha256,
        actualSha256:sha(bytes),actualBytes:bytes.length,
        proof:result.entry.proofFolder});
    } catch (error) {failures.push({path:saved.path,reason:error.message,
      savedSha256:saved.sha256,actualSha256:sha(bytes)});break}
  }
  const alternates = matched.filter(row => row.variant === 'alternate');
  if (!failures.length) for (const saved of before.files.filter(file => !file.path.endsWith('.png'))) {
    const actual = afterFiles.get(saved.path);
    if (!actual) {failures.push({path:saved.path,reason:'File missing'});break}
    const bytes = await readCurrent(actual);
    let expected = fs.readFileSync(path.join(folder,saved.path));
    if (alternates.length && saved.path === 'qa-report.json')
      expected = exactExpectedReport(expected,alternates);
    if (alternates.length && saved.path === 'qa-summary.md')
      expected = exactExpectedSummary(expected,alternates);
    if (!bytes.equals(expected)) {failures.push({path:saved.path,
      reason:'Exact bytes differ from saved file or the registered screenshot digest metadata',
      savedSha256:saved.sha256,actualSha256:sha(bytes)});break}
  }
  for (const actual of after.files) if (!before.files.some(file => file.path === actual.path))
    failures.push({path:actual.path,reason:'Unexpected file'});
  const snapshotUnchanged = JSON.stringify(before.reviewSnapshot) === JSON.stringify(after.reviewSnapshot);
  if (!snapshotUnchanged) failures.push({path:'reviewSnapshot',reason:'Review snapshot changed'});
  for (const entry of ENTRIES.filter(row => before.pages.some(page => page.path === row.page)))
    if (!matched.some(row => row.path === entry.capture && row.page === entry.page))
    failures.push({path:entry.capture,reason:'Registered capture missing from packet'});
  if (failures.length) {
    const replayEvidence = await snapshotScreenshotEvidence(bucket,prefix,after,diagnostics);
    preserveScreenshotEqualityFailure(baselineEvidence,replayEvidence,diagnosticFolder+'/pairs');
  }
  const report = {passed:failures.length === 0,versionHash:before.versionHash,
    files:before.files.length,matchedFiles:failures.length ? null : before.files.length,
    differences:failures,registeredCaptureVariants:matched,
    acceptedAlternates:alternates.length,reviewSnapshotUnchanged:snapshotUnchanged,
    timestampsExcluded:['generatedAt','completedAt'],providerCalls:0};
  fs.writeFileSync(out+'/checks/qa-replay.json',JSON.stringify(report,null,2));
  if (failures.length) throw Error('Exact replay failed: '+JSON.stringify(failures[0]));
  return report;
}
