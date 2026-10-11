// Exact-byte replay exceptions for proven service-image rasters.
// This module never changes screenshots, capture settings, or packet output.
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {PNG} = require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const PAGE = '/s/sample-fictional-copper-kite-ventura/services';
const BLUE_PAGE = '/s/sample-fictional-blue-orchard-pasadena/services';
const PAPER_PAGE = '/s/sample-fictional-paper-lantern-temecula/services';
const ENTRIES = Object.freeze([
  Object.freeze({page: PAGE, width: 768, capture: 'screenshots/page-013-768.png',
    saved: '01928202109a809e3eff7323ab590065d99022dffe8c7f7569bf602c84979d22',
    alternate: '09117e05a89f9024d7b2a4869a0735a8d3852e186732811801b03e658545cc32'}),
  Object.freeze({page: PAGE, width: 1440, capture: 'screenshots/page-013-1440.png',
    saved: 'b238097182794ac701711a66c4ea4634e6e0478b454b1eecdafa4e3a89608dad',
    alternate: '2da42f6cf9987b7658b111ec693d912b12f2d5e8c71ea57247ce994be1a2a4b1'}),
  Object.freeze({page: BLUE_PAGE, width: 1440, capture: 'screenshots/page-013-1440.png',
    saved: '24ebe575cfb483fa874cc48c86989a46b150e3449ad26a7f05c012f08c03279e',
    alternate: 'e165f1ee4e6e5a2c206eac143c0f65a75b9e2bfb4b1a39d9027902dbdd4d97bb'}),
  Object.freeze({page: PAPER_PAGE, width: 1440, capture: 'screenshots/page-012-1440.png',
    saved: 'a74cdac48d22d2063b262d5340c76092ca0ca42ded1c721268208c3a2952ac37',
    alternate: '079614957a3924bd5dd2789797a7098f3159c995868f51b19372b9e3cdb36800'})
]);

function requiredReadiness(record) {
  return {devicePixelRatio: record.devicePixelRatio, viewport: record.viewport,
    documentSize: record.documentSize, images: (record.images || []).map(img => ({
      currentSrc: img.currentSrc, naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight, rendered: img.rendered,
      complete: img.complete, decodeResult: img.decodeResult}))};
}

function pixelProof(savedBytes, alternateBytes, rectangles) {
  const saved = PNG.sync.read(savedBytes), alternate = PNG.sync.read(alternateBytes);
  if (saved.width !== alternate.width || saved.height !== alternate.height)
    throw Error('Registered raster dimensions differ');
  let changed = 0, outside = 0;
  for (let y = 0; y < saved.height; y++) for (let x = 0; x < saved.width; x++) {
    const offset = (y * saved.width + x) * 4;
    if (saved.data[offset] === alternate.data[offset] &&
        saved.data[offset + 1] === alternate.data[offset + 1] &&
        saved.data[offset + 2] === alternate.data[offset + 2] &&
        saved.data[offset + 3] === alternate.data[offset + 3]) continue;
    changed++;
    // A pixel belongs to its actual raster center; no padding or tolerance.
    if (!rectangles.some(rect => x + .5 >= rect.x && x + .5 < rect.x + rect.width &&
        y + .5 >= rect.y && y + .5 < rect.y + rect.height)) outside++;
  }
  return {width: saved.width, height: saved.height, changed, outside};
}

function loadRegistry(evidenceFolder) {
  return ENTRIES.map(entry => {
    const blue = entry.page === BLUE_PAGE;
    const paper = entry.page === PAPER_PAGE;
    const diagnosticPair = blue || paper;
    const folder = path.join(evidenceFolder, 'alternate-registry', blue ? 'blue-orchard-1440' : paper ? 'paper-lantern-1440' : String(entry.width));
    const proof = JSON.parse(fs.readFileSync(path.join(folder, 'proof.json')));
    const savedBytes = fs.readFileSync(path.join(folder, 'saved.png'));
    const alternateBytes = fs.readFileSync(path.join(folder, 'alternate.png'));
    const readiness = JSON.parse(fs.readFileSync(path.join(folder, 'readiness.json')));
    const savedRecord = diagnosticPair || entry.width === 768 ? readiness.before.before : readiness.baseline.before;
    const alternateRecord = diagnosticPair || entry.width === 768 ? readiness.after.before : readiness.first;
    const pairRecord = diagnosticPair || entry.width === 768 ? readiness.before.before : readiness.second;
    if (proof.page !== entry.page || proof.capture !== entry.capture || proof.width !== entry.width ||
        proof.savedSha256 !== entry.saved || proof.alternateSha256 !== entry.alternate ||
        hash(savedBytes) !== entry.saved || hash(alternateBytes) !== entry.alternate ||
        proof.savedBytes !== savedBytes.length || proof.alternateBytes !== alternateBytes.length)
      throw Error('Registered raster identity proof failed: ' + entry.capture);
    const rectangles = alternateRecord.images.map(img => img.rendered);
    const geometry = pixelProof(savedBytes, alternateBytes, rectangles);
    if (geometry.width !== entry.width || geometry.changed !== proof.changedPixels ||
        geometry.outside !== 0 || proof.outsideImagePixels !== 0 ||
        JSON.stringify(requiredReadiness(savedRecord)) !== JSON.stringify(requiredReadiness(alternateRecord)) ||
        ((diagnosticPair || entry.width === 768) && JSON.stringify(pairRecord) !== JSON.stringify(alternateRecord)) ||
        (!diagnosticPair && entry.width === 1440 && JSON.stringify(alternateRecord) !== JSON.stringify(pairRecord)) ||
        (diagnosticPair && JSON.stringify(rectangles) !== JSON.stringify(proof.serviceImageRectangles)) ||
        !proof.readiness.requiredFieldsEqualToSaved || !proof.readiness.fullStoredPairEqual)
      throw Error('Registered raster pixel/readiness proof failed: ' + entry.capture);
    if (paper) {
      const sweep = JSON.parse(fs.readFileSync(path.join(evidenceFolder, 'checks', 'replay-variance-sweep.json')));
      const row = sweep.varyingCaptures.find(item => item.page === entry.page && item.file === entry.capture);
      const alternate = row?.distinctCapturedShaCounts.find(item => item.sha256 === entry.alternate);
      if (row?.savedSha256 !== entry.saved || alternate?.count !== 2 ||
          alternate.proof?.differingPixels !== geometry.changed ||
          alternate.proof?.outsideImagePixels !== 0 ||
          JSON.stringify(alternate.proof?.rectangles) !== JSON.stringify(rectangles))
        throw Error('Paper Lantern sweep proof disagrees with registry');
    }
    if (!diagnosticPair && entry.width === 1440 && hash(fs.readFileSync(path.join(folder, 'matching-rerun.png'))) !== entry.alternate)
      throw Error('Registered 1440 rerun SHA proof failed');
    return {...entry, proofFolder: folder, savedBytes: savedBytes.length,
      alternateBytes: alternateBytes.length, required: requiredReadiness(savedRecord),
      changedPixels: geometry.changed, rectangles};
  });
}

function recordAcceptance(file, details) {
  if (!file) return;
  const prior = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  if (!Array.isArray(prior)) throw Error('Replay alternate acceptance log is invalid');
  prior.push({...details, timestamp: new Date().toISOString()});
  fs.writeFileSync(file, JSON.stringify(prior, null, 2));
}

function matchCapture({capture, page, width, savedSha256, actualSha256, readiness, registry,
  expectedBytes, actualBytes, acceptanceLogPath}) {
  const entry = registry.find(row => row.capture === capture && row.page === page && row.width === width);
  if (actualSha256 === savedSha256) return {variant: 'saved', direction: 'identical', entry};
  if (!entry) throw Error('Unregistered screenshot SHA: ' + capture + ' ' + actualSha256);
  if (!readiness || JSON.stringify(requiredReadiness(readiness.before)) !== JSON.stringify(entry.required))
    throw Error('Registered alternate readiness changed: ' + capture);
  const pair = (savedSha256 === entry.saved && actualSha256 === entry.alternate) ||
    (savedSha256 === entry.alternate && actualSha256 === entry.saved);
  let method, direction, changedPixels = entry.changedPixels;
  if (pair) {
    method = 'registered-pair';
    direction = savedSha256 === entry.saved ? 'saved-to-alternate' : 'alternate-to-saved';
  } else {
    const fallbackPage = width === 1440 && (page === PAGE || page === BLUE_PAGE || page === PAPER_PAGE);
    if (!fallbackPage || !expectedBytes || !actualBytes ||
        hash(expectedBytes) !== savedSha256 || hash(actualBytes) !== actualSha256)
      throw Error('Unregistered screenshot SHA: ' + capture + ' ' + actualSha256);
    let proof;
    try { proof = pixelProof(expectedBytes, actualBytes, entry.rectangles); }
    catch (error) { throw Error('Unregistered image raster dimensions differ: ' + capture + ' ' + error.message); }
    if (!proof.changed || proof.outside)
      throw Error('Unregistered screenshot changed outside service images: ' + capture + ' ' + proof.outside);
    method = 'image-only-fallback';
    direction = 'expected-to-unregistered';
    changedPixels = proof.changed;
  }
  recordAcceptance(acceptanceLogPath, {page,capture,width,expectedSha256:savedSha256,
    renderedSha256:actualSha256,method,direction,changedPixels,
    outsideImagePixels:0,rectangles:entry.rectangles});
  return {variant: 'alternate', method, direction, changedPixels, entry};
}

module.exports = {ENTRIES, PAGE, BLUE_PAGE, PAPER_PAGE, loadRegistry, matchCapture, requiredReadiness, pixelProof};
