import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {evaluateFrameSourceLocks, readApprovedSourceChanges} from './helpers/frame-source-lock.mjs';

const root = 'C:/Users/joe/website_creator';
const out = root + '/docs/build-evidence/028F';
const baseline = JSON.parse(fs.readFileSync(out + '/frame-initialization/before/baseline.json', 'utf8'));
const entries = readApprovedSourceChanges(out + '/frame-initialization/approved-later-source-changes.json');
const report = JSON.parse(fs.readFileSync(out + '/checks/recognition-lock.json', 'utf8'));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'bv-frame-lock-'));
try {
  for (const name of ['src/aws/qa-browser.js', 'tests/helpers/platform-console.mjs']) {
    const destination = path.join(temp, name);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(root + '/' + name, destination);
  }
  const evaluate = (changes = entries, proof = report) => evaluateFrameSourceLocks({baselineFiles: baseline.files, sourceRoot: temp, approvedEntries: changes, recognitionReport: proof});
  const accepted = evaluate();
  assert.equal(accepted.length, 2);
  assert.ok(accepted.every(lock => lock.pass));
  assert.equal(accepted.find(lock => lock.path === 'src/aws/qa-browser.js').approvedChangeStatus, 'approved later recognition entries');
  assert.equal(accepted.find(lock => lock.path === 'tests/helpers/platform-console.mjs').approvedChangeStatus, 'baseline exact');

  fs.appendFileSync(path.join(temp, 'src/aws/qa-browser.js'), 'x');
  assert.equal(evaluate()[1].pass, false, 'a third source SHA must fail');
  fs.copyFileSync(root + '/src/aws/qa-browser.js', path.join(temp, 'src/aws/qa-browser.js'));
  assert.equal(evaluate([{...entries[0], path: 'tests/helpers/platform-console.mjs'}])[1].pass, false, 'another path must fail');
  assert.equal(evaluate([entries[0], entries[0]])[1].pass, false, 'two entries must fail');
  assert.equal(evaluate([{...entries[0], from: '0'.repeat(64)}])[1].pass, false, 'wrong from SHA must fail');
  assert.equal(evaluate(entries, {...report, passed: false})[1].pass, false, 'failed recognition check must fail');
  assert.equal(evaluate(entries, {...report, currentSha256: '0'.repeat(64)})[1].pass, false, 'mismatched recognition SHA must fail');
  assert.throws(() => readApprovedSourceChanges(path.join(temp, 'missing.json')), 'missing approval file must fail');
  fs.appendFileSync(path.join(temp, 'tests/helpers/platform-console.mjs'), 'x');
  assert.equal(evaluate()[0].pass, false, 'another locked file stays strict');
  console.log('PASS frame source lock: exact later recognition proof; third SHA, wrong path, duplicate, wrong from, failed/mismatched proof, missing approval and other locked file all fail');
} finally {
  const resolved = fs.realpathSync(temp);
  assert.ok(resolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep));
  fs.rmSync(resolved, {recursive: true, force: true});
}
