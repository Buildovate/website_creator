import assert from 'node:assert/strict';
import fs from 'node:fs';
import {formatTemplateName} from '../src/client/workspace/template-name.js';

const kits=Object.values(JSON.parse(fs.readFileSync(new URL('../public/design-kits.json',import.meta.url),'utf8')));
assert.ok(kits.length>=10);
for(const kit of kits){
 const label=formatTemplateName(kit);
 assert.ok(label.endsWith(` (${kit.trade})`),label);
 assert.ok(!label.startsWith(kit.name),label);
}
assert.equal(formatTemplateName({name:'RIDGELINE',trade:'Roofing'}),'Ridgeline (Roofing)');
console.log(`PASS shared template names: ${kits.length} trade kits.`);
