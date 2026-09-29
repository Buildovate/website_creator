import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const films=JSON.parse(readFileSync('public/trade-films.json'));
assert.equal(Object.keys(films).length,7);
for(const [id,film]of Object.entries(films)){
 assert.ok(existsSync('public'+film.url));assert.ok(existsSync('public'+film.poster));assert.ok(statSync('public'+film.url).size>500000);assert.ok(statSync('public'+film.url).size<10000000);assert.equal(film.chapters.length,3);assert.deepEqual(film.chapters.map(c=>c.time),[0,3,8]);assert.ok(!film.transcript.includes('Illustrative project concept'));
 const response=await worker.fetch(new Request('https://test.local/design-preview/'+id+'/immersive',{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);assert.equal(response.status,200);const h=await response.text();assert.equal((h.match(/<video /g)||[]).length,3);assert.ok(h.includes('loop playsinline muted preload="none" data-src='));assert.ok(!/<video[^>]*\bcontrols\b/.test(h));assert.ok(h.includes('data-ambient-frame'));assert.ok(h.includes('data-ambient-toggle'));assert.ok(h.includes('poster="'+film.poster+'"'));assert.equal((h.match(/data-film-time=/g)||[]).length,0);assert.ok(!h.includes('Read the visual story'));assert.ok(!h.includes('data-film-sound'));assert.equal((h.match(/data-layer=/g)||[]).length,4);assert.equal((h.match(/data-hotspot=/g)||[]).length,8);assert.ok(h.includes('cutaway-overlay'));assert.ok(!h.includes('9-second silent'));
}
const script=readFileSync('src/client/site/trade-components.js','utf8')+readFileSync('src/client/site/ambient-video.js','utf8');assert.ok(script.includes('prefers-reduced-motion'));assert.ok(script.includes('saveData'));assert.ok(script.includes('userPaused'));
console.log('PASS seven complete cinematic asset sets, private preview rendering, chapter metadata, looping muted playback, styled accessible playback controls, 3D cutaway SVG layers and accessible component controls.');
