// #028F round 6: diagnostic capture only. Mirrors the current review capture
// settings and readiness; does not change product markup, pixels, or the gate.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {REVIEW_BROWSER_ARGS} from '../../../../src/aws/review-capture.js';
import {waitForCaptureReadiness} from '../../../../src/aws/review-capture-readiness.js';

const root = 'C:/Users/joe/website_creator';
const evidence = root + '/docs/build-evidence/028F';
const output = evidence + '/round6-services-diagnosis';
assert.equal(fs.existsSync(output), false, 'Do not overwrite a prior diagnosis');
fs.mkdirSync(output, {recursive: true});
const packets = JSON.parse(fs.readFileSync(evidence + '/checks/qa-packets.json'));
const fixture = packets.packets.find(row => row.id === 'sample-fictional-copper-kite-ventura');
const folder = `${evidence}/packets/${fixture.id}/${fixture.versionHash}`;
const packet = JSON.parse(fs.readFileSync(folder + '/packet.json'));
const service = packet.pages.find(row => row.path === '/s/sample-fictional-copper-kite-ventura/services');
assert.ok(service, 'Saved Services page required');
const html = fs.readFileSync(folder + '/' + service.file);
const origin = 'http://review.local';
const widths = [1440, 390, 768]; // The review capture's actual page-reuse order.
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const {chromium} = createRequire(import.meta.url)(
  'C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const records = [];

function asset(url) {
  const pathname = new URL(url).pathname;
  let file = root + '/dist/client' + pathname;
  if (!fs.existsSync(file)) file = root + '/public' + pathname;
  return fs.existsSync(file) ? file : null;
}

for (let run = 1; run <= 20; run++) {
  const browser = await chromium.launch({headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: REVIEW_BROWSER_ARGS});
  try {
    const session = await browser.newBrowserCDPSession();
    const info = await session.send('SystemInfo.getInfo');
    await session.detach();
    const raster = {
      devices: info.gpu.devices.map(device => ({vendorString: device.vendorString,
        deviceString: device.deviceString, driverVendor: device.driverVendor,
        driverVersion: device.driverVersion})),
      rasterization: info.gpu.featureStatus.rasterization,
      multipleRasterThreads: info.gpu.featureStatus.multiple_raster_threads,
      glRenderer: info.gpu.auxAttributes.glRenderer,
      skiaBackendType: info.gpu.auxAttributes.skiaBackendType
    };
    const context = await browser.newContext({deviceScaleFactor: 1,
      reducedMotion: 'reduce', locale: 'en-US', timezoneId: 'America/Los_Angeles',
      colorScheme: 'light'});
    const served = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort('blockedbyclient');
      if (url.pathname === service.path) return route.fulfill({status: 200,
        contentType: 'text/html; charset=utf-8', body: html});
      const file = asset(url.href);
      if (!file) return route.fulfill({status: 404, body: 'Resource unavailable in this review snapshot'});
      const bytes = fs.readFileSync(file);
      const ext = path.extname(file).slice(1).toLowerCase();
      const type = {js: 'text/javascript', css: 'text/css', webp: 'image/webp',
        png: 'image/png', svg: 'image/svg+xml', woff2: 'font/woff2',
        ttf: 'font/ttf', mp4: 'video/mp4'}[ext] || 'application/octet-stream';
      if (['webp', 'png', 'svg'].includes(ext)) served.push({url: url.href, sha256: sha(bytes)});
      return route.fulfill({status: 200, contentType: type,
        headers: {'content-length': String(bytes.length)}, body: bytes});
    });
    const page = await context.newPage();
    for (const width of widths) {
      await page.setViewportSize({width, height: width === 390 ? 844 : 900});
      const response = await page.goto(origin + service.path, {waitUntil: 'networkidle'});
      assert.equal(response.status(), 200);
      const decodes = await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.images) img.loading = 'eager';
        await Promise.all([...document.images].map(img => img.complete ? Promise.resolve() :
          new Promise(resolve => {img.addEventListener('load', resolve, {once: true});
            img.addEventListener('error', resolve, {once: true}); setTimeout(resolve, 4000)})));
        const results = [];
        await Promise.all([...document.images].map(async (img, index) => {
          const start = performance.now();
          let result = 'decoded';
          try {await img.decode()} catch (error) {result = 'decode failed: ' + error.message}
          results[index] = {index, currentSrc: img.currentSrc, result,
            durationMs: performance.now() - start};
        }));
        for (const video of document.querySelectorAll('video')) video.pause();
        return results;
      });
      await page.addStyleTag({content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.will-enter{opacity:1!important;transform:none!important}'});
      await page.waitForTimeout(120);
      await waitForCaptureReadiness(page);
      await page.evaluate(() => {
        window.__captureFrameCount = 0;
        window.__captureFrameCounting = true;
        const tick = () => {if (!window.__captureFrameCounting) return;
          window.__captureFrameCount++; requestAnimationFrame(tick)};
        requestAnimationFrame(tick);
      });
      const state = await page.evaluate(decoded => ({
        devicePixelRatio,
        documentSize: {width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight},
        fontsStatus: document.fonts.status,
        framesBetweenReadinessAndScreenshotStart: window.__captureFrameCount,
        images: [...document.images].map((img, index) => {
          const box = img.getBoundingClientRect(), style = getComputedStyle(img);
          return {index, currentSrc: img.currentSrc, naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight, rendered: box.toJSON(), complete: img.complete,
            loading: img.loading, decoding: img.decoding, objectFit: style.objectFit,
            imageRendering: style.imageRendering, decode: decoded[index]};
        })
      }), decodes);
      const start = performance.now();
      const png = await page.screenshot({fullPage: true, animations: 'disabled'});
      const screenshotMs = performance.now() - start;
      const framesAtScreenshotEnd = await page.evaluate(() => {
        window.__captureFrameCounting = false;
        return window.__captureFrameCount;
      });
      const file = `${width}-${String(run).padStart(2, '0')}.png`;
      fs.writeFileSync(output + '/' + file, png);
      const record = {run, width, path: service.path, file,
        sha256: sha(png), bytes: png.length, browserVersion: browser.version(),
        browserArgs: REVIEW_BROWSER_ARGS, raster, state, screenshotMs,
        framesAtScreenshotEnd,
        servedImages: served.filter(row => state.images.some(img => img.currentSrc === row.url))};
      records.push(record);
      fs.writeFileSync(output + '/records.json', JSON.stringify(records, null, 2));
      console.log(`run ${run}/20 width ${width}: ${record.sha256.slice(0, 12)} frames ${state.framesBetweenReadinessAndScreenshotStart}/${framesAtScreenshotEnd}`);
    }
    await context.close();
  } finally {await browser.close()}
}
const summary = widths.map(width => {
  const rows = records.filter(row => row.width === width);
  const groups = Object.groupBy(rows, row => row.sha256);
  return {width, runs: rows.length, variants: Object.entries(groups).map(([sha256, matches]) =>
    ({sha256, count: matches.length, runs: matches.map(row => row.run)})),
    varianceRate: (rows.length - Math.max(...Object.values(groups).map(group => group.length))) / rows.length};
});
fs.writeFileSync(output + '/summary.json', JSON.stringify({source: service.path,
  versionHash: fixture.versionHash, settings: 'Current review capture settings and readiness',
  widths: summary}, null, 2));
console.log(JSON.stringify(summary));
