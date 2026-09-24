import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {build} from 'esbuild';
const result=await build({entryPoints:['src/trade-motion-v2.js'],bundle:true,write:false,format:'esm',platform:'node'});
const {LayerExplode,RevealCompare,KineticText,roofingMotionOptions}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C']){
 const options=roofingMotionOptions({motionStyle:style,motionLayout:variant});
 const anatomy=LayerExplode(options),compare=RevealCompare(options),headline=KineticText({...options,text:'A safe <roof>\nA clear plan.'});
 assert.equal((anatomy.match(/data-roof-layer=/g)||[]).length,7);
 for(const name of ['Deck','Drip edge','Ice and water shield','Underlayment','Starter strip','Architectural shingles','Ridge vent'])assert.ok(anatomy.includes(name));
 assert.ok(anatomy.includes('data-variant="'+variant+'"'));
 assert.ok(compare.includes('AI-generated repair example'));
 assert.ok(compare.includes(variant==='C'?'data-compare-state="2"':'role="slider"'));
 assert.ok(headline.includes('A safe &lt;roof&gt;'));assert.ok(headline.includes('aria-hidden="true"'));
}
assert.ok(!LayerExplode({style:{surface:'red;position:fixed'}}).includes('position:fixed'));
assert.equal(roofingMotionOptions({motionLayout:'Z'}).variant,'A');
const css=readFileSync('public/trade-motion-v2.css','utf8');assert.ok(css.includes('prefers-reduced-motion:reduce'));
const files=['public/trade-motion.js','public/trade-motion-v2.js','public/trade-motion-v2-interactions.js','public/trade-motion-v2.css','src/trade-motion-v2.js'];
const sizes=files.map(file=>({file,gzip:gzipSync(readFileSync(file)).length})),total=sizes.reduce((n,f)=>n+f.gzip,0);
assert.ok(total<=60*1024);console.log(JSON.stringify({result:'PASS',profiles:6,gzipBytes:total,budgetBytes:61440,files:sizes},null,2));
console.log('PASS all variants/styles, seven captions, semantic text, escaping, reduced-motion fallback and conservative motion-code budget.');
