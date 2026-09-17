import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const films=JSON.parse(readFileSync('public/trade-films.json'));
assert.equal(Object.keys(films).length,7);
for(const [id,film]of Object.entries(films)){
 assert.ok(existsSync('public'+film.url));assert.ok(existsSync('public'+film.poster));assert.ok(statSync('public'+film.url).size>500000);assert.ok(statSync('public'+film.url).size<10000000);assert.equal(film.chapters.length,3);assert.deepEqual(film.chapters.map(c=>c.time),[0,3,8]);assert.ok(film.transcript.includes('AI-generated concept'));
 const response=await worker.fetch(new Request('https://test.local/design-preview/'+id+'/immersive',{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);assert.equal(response.status,200);const h=await response.text();assert.equal((h.match(/<video /g)||[]).length,1);assert.ok(h.includes('muted preload="none"'));assert.ok(!h.includes('autoplay'));assert.ok(h.includes('poster="'+film.poster+'"'));assert.equal((h.match(/data-film-time=/g)||[]).length,3);assert.ok(h.includes('AI DESIGN CONCEPT'));assert.ok(h.includes('data-film-sound'));assert.ok(h.includes('data-cutaway-tour'));assert.equal((h.match(/data-layer=/g)||[]).length,4);assert.equal((h.match(/data-hotspot=/g)||[]).length,8);assert.ok(h.includes('cutaway-overlay'));assert.ok(!h.includes('9-second silent'));
}
console.log('PASS seven complete cinematic asset sets, private preview rendering, chapter metadata, concept disclosures, user-initiated playback, sound control, 3D cutaway SVG layers and accessible component controls.');
