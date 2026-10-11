import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {assertTemplateAssets} from '../scripts/check-template-assets.mjs';
import {mayOmitLeafletImage} from '../src/leaflet-asset-policy.js';
const names=['layers.png','layers-2x.png','marker-icon.png'];
function fixture(fn){const prior=process.cwd(),root=fs.mkdtempSync(path.join(os.tmpdir(),'leaflet-policy-'));try{fs.mkdirSync(root+'/src',{recursive:true});fs.mkdirSync(root+'/public/assets/images',{recursive:true});for(const name of ['design-kits','trade-library','service-art'])fs.writeFileSync(root+'/public/'+name+'.json','{}');fs.writeFileSync(root+'/public/assets/leaflet.css',names.map(n=>'a{background:url(images/'+n+')}').join('\n'));process.chdir(root);fn(root);}finally{process.chdir(prior);fs.rmSync(root,{recursive:true,force:true});}}
test('same exact three CSS-only missing images are allowed by exporter and build',()=>fixture(()=>{for(const name of names){assert.equal(mayOmitLeafletImage('/assets/images/'+name,'/assets/leaflet.css'),true);assert.equal(mayOmitLeafletImage('/assets/images/'+name,'/other.css'),false);}assertTemplateAssets();}));
test('any direct page reference to an optional sprite still fails',()=>{for(const name of names)fixture(root=>{fs.writeFileSync(root+'/public/page.html','<img src="/assets/images/'+name+'">');assert.throws(assertTemplateAssets,/Template asset integrity failed/);});});
test('another source cannot use the optional sprites without actual files',()=>fixture(root=>{fs.writeFileSync(root+'/src/uses.js',names.map(n=>'const asset="/assets/images/'+n+'";').join('\n'));assert.throws(assertTemplateAssets,/Template asset integrity failed/);}));
test('no fourth Leaflet image receives an exception',()=>fixture(root=>{fs.appendFileSync(root+'/public/assets/leaflet.css','a{background:url(images/another-icon.png)}');assert.equal(mayOmitLeafletImage('/assets/images/another-icon.png','/assets/leaflet.css'),false);assert.throws(assertTemplateAssets,/another-icon\.png/);}));
test('empty existing sprites are invalid rather than silently omitted',()=>fixture(root=>{fs.writeFileSync(root+'/public/assets/images/layers.png','');assert.throws(assertTemplateAssets,/layers\.png/);}));
test('ordinary missing assets still fail',()=>fixture(root=>{fs.writeFileSync(root+'/src/uses.js','const image="/assets/ordinary.png";');assert.throws(assertTemplateAssets,/ordinary\.png/);}));
