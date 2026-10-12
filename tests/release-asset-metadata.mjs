import assert from 'node:assert/strict';import fs from 'node:fs';
const m=JSON.parse(fs.readFileSync('docs/release/ASSET-ENCODING.json'));let checks=0;assert.ok(m.after<50_000_000);checks++;
for(const row of m.videoMetadata){assert.ok(Math.abs(row.before.duration-row.after.duration)<0.1,row.path+' duration');checks++;assert.deepEqual(row.after.audio,row.before.audio,row.path+' copied audio');checks++;assert.ok(Math.abs(row.before.width/row.before.height-row.after.width/row.after.height)<0.01,row.path+' aspect');checks++;assert.equal(row.after.fps,row.before.fps,row.path+' frame rate');checks++;}
console.log('PASS release asset metadata: '+checks+' checks; budget, video timing, audio, aspect and frame rate');
