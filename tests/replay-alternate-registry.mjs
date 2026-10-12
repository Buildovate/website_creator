import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {exactExpectedReport,exactExpectedSummary} from './helpers/replay-alternate-assertions.mjs';
const require = createRequire(import.meta.url);
const {PNG} = require('pngjs');
const {PAGE,BLUE_PAGE,PAPER_PAGE,loadRegistry,matchCapture,pixelProof} = require('./helpers/replay-alternate-registry.cjs');
const root = releaseRepoRoot+"/docs/build-evidence/028F";
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const registry = loadRegistry(root);
assert.equal(registry.length, 4);
const match = (entry, actualSha256, overrides = {}) => matchCapture({
  capture: entry.capture, page: entry.page, width: entry.width,
  savedSha256: entry.saved, actualSha256,
  readiness: {before: entry.required}, registry, ...overrides});
for (const entry of registry) {
  assert.equal(match(entry,entry.saved).variant,'saved');
  assert.equal(match(entry,entry.alternate).variant,'alternate');
  assert.equal(match(entry,entry.saved,{savedSha256:entry.alternate}).direction,'alternate-to-saved',
    'The registered pair must also pass in reverse');
  assert.throws(() => match(entry,'0'.repeat(64)),/Unregistered screenshot SHA/,
    'A third SHA must fail for the same capture');
  assert.throws(() => match(entry,entry.alternate,{page:PAGE+'/other'}),
    /Unregistered screenshot SHA/,'The alternate cannot move to another page');
  assert.throws(() => match(entry,entry.alternate,{width:390}),
    /Unregistered screenshot SHA/,'The alternate cannot move to another width');
  assert.throws(() => match(entry,entry.alternate,{registry:[]}),
    /Unregistered screenshot SHA/,'Removing the registry restores strict equality');
  assert.equal(match(entry,entry.saved,{registry:[]}).variant,'saved');
}
const entry = registry.find(row => row.width === 1440);
const savedBytes = fs.readFileSync(entry.proofFolder+'/saved.png');
const rectangles = entry.required.images.map(img => img.rendered);
const imageChanged = PNG.sync.read(savedBytes);
const imageX = Math.floor(rectangles[0].x+rectangles[0].width/2);
const imageY = Math.floor(rectangles[0].y+rectangles[0].height/2);
imageChanged.data[(imageY*imageChanged.width+imageX)*4] ^= 1;
const imageOnlyBytes = PNG.sync.write(imageChanged);
assert.equal(pixelProof(savedBytes,imageOnlyBytes,rectangles).outside,0);
assert.equal(match(entry,sha(imageOnlyBytes),{expectedBytes:savedBytes,actualBytes:imageOnlyBytes}).method,
  'image-only-fallback','An in-image unregistered SHA passes only for a listed page');
assert.throws(() => match(entry,sha(imageOnlyBytes),{page:'/s/unlisted/services',expectedBytes:savedBytes,actualBytes:imageOnlyBytes}),
  /Unregistered screenshot SHA/,'A non-listed page with any diff fails');
const narrow = registry.find(row=>row.width===768);
const narrowBytes = fs.readFileSync(narrow.proofFolder+'/saved.png');
const narrowChanged=PNG.sync.read(narrowBytes);
const narrowRect=narrow.required.images[0].rendered;
const narrowX=Math.floor(narrowRect.x+narrowRect.width/2),narrowY=Math.floor(narrowRect.y+narrowRect.height/2);
narrowChanged.data[(narrowY*narrowChanged.width+narrowX)*4] ^= 1;
const narrowImageBytes=PNG.sync.write(narrowChanged);
assert.throws(()=>match(narrow,sha(narrowImageBytes),{expectedBytes:narrowBytes,actualBytes:narrowImageBytes}),
  /Unregistered screenshot SHA/,'The 768px capture has no image-only fallback');
for (const [label,x,y] of [['text glyph',0,0],['non-image background',1439,3158]]) {
  const changed = PNG.sync.read(savedBytes);
  const offset = (y * changed.width + x) * 4;
  changed.data[offset] ^= 255;
  const bytes = PNG.sync.write(changed);
  const diff = pixelProof(savedBytes,bytes,rectangles);
  assert.equal(diff.changed,1,label);assert.equal(diff.outside,1,label);
  assert.throws(() => match(entry,sha(bytes),{expectedBytes:savedBytes,actualBytes:bytes}),
    /changed outside service images/,label+' must fail even on a listed page');
}
const historical = root+'/packets/sample-fictional-copper-kite-ventura/97700d3528e864ee8cca74e09403d80d852acc6430ffe0a8dd7b382e1cb4234f';
const alt768 = registry.find(row => row.width === 768);
const alternateRow = [{path:alt768.capture,savedSha256:alt768.saved,
  actualSha256:alt768.alternate,actualBytes:alt768.alternateBytes}];
assert.ok(exactExpectedReport(fs.readFileSync(historical+'/qa-report.json'),alternateRow)
  .equals(fs.readFileSync(root+'/replay-attempt-2/qa-report.json')),
  'Known 768 alternate must produce the exact historical QA report bytes');
assert.ok(exactExpectedSummary(fs.readFileSync(historical+'/qa-summary.md'),alternateRow)
  .equals(fs.readFileSync(root+'/replay-attempt-2/qa-summary.md')),
  'Known 768 alternate must produce the exact historical QA summary bytes');
const blue = registry.find(row => row.page === BLUE_PAGE);
assert.ok(blue);
const blueSaved = fs.readFileSync(blue.proofFolder+'/saved.png');
const blueRectangles = blue.required.images.map(img => img.rendered);
const changed = PNG.sync.read(blueSaved);
changed.data[0] ^= 255;
const blueOutside = PNG.sync.write(changed);
assert.deepEqual(pixelProof(blueSaved,blueOutside,blueRectangles).outside,1);
assert.throws(() => match(blue,sha(blueOutside)),/Unregistered screenshot SHA/);
const paper = registry.find(row => row.page === PAPER_PAGE);
assert.ok(paper);
const paperSaved = fs.readFileSync(paper.proofFolder+'/saved.png');
const paperChanged = PNG.sync.read(paperSaved);
paperChanged.data[0] ^= 255;
const paperOutside = PNG.sync.write(paperChanged);
assert.equal(pixelProof(paperSaved,paperOutside,paper.required.images.map(img=>img.rendered)).outside,1);
assert.throws(() => match(paper,sha(paperOutside)),/Unregistered screenshot SHA/);
console.log('PASS symmetric registry and bounded image fallback: reverse pair and in-image change pass; outside, unlisted, 768px and removed-registry cases fail');
