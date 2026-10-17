import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {qualityViolations} from '../src/media-quality-policy.js';
import {walk,probe,hashFile,pool} from '../scripts/media-tools.mjs';
const manifest=JSON.parse(fs.readFileSync('public/media-quality.json')),errors=[];let checks=0;
assert.equal(manifest.missingOriginals.length,0,'every original must be accounted for');
const declared=new Set(manifest.assets.map(a=>a.path));for(const file of walk('public').filter(p=>/\.(mp4|webm|webp|avif|png|jpe?g|gif)$/i.test(p))){assert.ok(declared.has('/'+file.slice('public/'.length)),'unattested media: '+file);checks++;}
await pool(manifest.assets,4,async a=>{
 errors.push(...qualityViolations(a));checks++;
 const file=path.join('public',a.path);assert.ok(fs.existsSync(file),'Hydrate template media before quality verification: '+a.path);
 assert.equal(hashFile(file),a.sha256,a.path+' encoding provenance digest');checks++;
 if(a.kind==='video'){
  const actual=await probe(file);assert.equal(actual.width,a.width,a.path+' width');assert.equal(actual.height,a.height,a.path+' height');checks+=2;
  assert.ok(actual.crf===null?a.codec==='vp9':actual.crf<=20,a.path+' actual H.264 encoder CRF');checks++;
  if(a.scrub){assert.ok(actual.maxKeyframeGap<=6,a.path+' actual keyframe gap');checks++;}
  assert.ok(Math.abs(actual.duration-a.source.duration)<.1,a.path+' original duration');checks++;assert.equal(actual.fps,a.source.fps,a.path+' frame rate');assert.deepEqual(actual.audio,a.source.audio,a.path+' copied audio');assert.ok(Math.abs(actual.width/actual.height-a.source.width/a.source.height)<.01,a.path+' original aspect ratio');checks+=3;
 }else{const actual=await sharp(file).metadata();assert.equal(actual.width,a.width,a.path+' still width');assert.equal(actual.height,a.height,a.path+' still height');checks+=2;}
});
assert.deepEqual(errors,[],'Media quality floor violations');
// Negative cases prove that each floor can fail independently.
const base={path:'/fixture',kind:'video',role:'hero',width:1920,height:1080,crf:18,scrub:true,maxKeyframeGap:6,sha256:'a'.repeat(64),source:{width:1920,height:1080,sha256:'b'.repeat(64)}};
for(const change of [{width:1280},{crf:39},{maxKeyframeGap:7},{kind:'still',quality:79}]){assert.ok(qualityViolations({...base,...change}).length);checks++;}
for(const version of ['v3','v4']){const raw=JSON.parse(fs.readFileSync('public/assets/trade-motion/'+version+'/manifest.json'));for(const s of Array.isArray(raw)?raw:[raw]){const frames=s.files||s.frames;let bytes=0;for(const f of frames){const file='public/assets/trade-motion/'+version+'/'+(s.mode||'mobile')+'/'+String(f.frame).padStart(3,'0')+'.webp';assert.equal(fs.statSync(file).size,f.bytes,'sequence frame bytes');bytes+=f.bytes;checks++;}assert.equal(bytes,s.bytes,'sequence total bytes');checks++;}}
console.log('PASS release asset quality floor: '+checks+' checks; original resolution, CRF <=20, GOP <=6, still quality >=80 and byte-accurate manifests. No size budget.');
