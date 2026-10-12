import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createAssets} from '../src/aws/s3.js';
const dir=await mkdtemp(path.join(tmpdir(),'website-media-range-'));
try{
 await writeFile(path.join(dir,'film.mp4'),Buffer.from('0123456789'));const assets=createAssets(dir);
 const get=(range,method='GET')=>assets.fetch(new Request('http://local/film.mp4',{method,headers:range?{range}:{}}));
 for(const [range,expected,content] of [['bytes=2-5','2345','bytes 2-5/10'],['bytes=7-','789','bytes 7-9/10'],['bytes=-3','789','bytes 7-9/10'],['bytes=0-999','0123456789','bytes 0-9/10']]){const r=await get(range);assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),content);assert.equal(await r.text(),expected);}
 for(const range of ['bytes=11-','bytes=8-2','bytes=-0','bytes=-','bytes=hello']){const r=await get(range);assert.equal(r.status,416);assert.equal(r.headers.get('content-range'),'bytes */10');}
 const head=await get(null,'HEAD');assert.equal(head.headers.get('content-length'),'10');assert.equal(head.headers.get('accept-ranges'),'bytes');assert.equal(await head.text(),'');
 const full=await get();assert.equal(full.status,200);assert.equal(await full.text(),'0123456789');
 console.log('PASS media byte-range seeking, suffix/open ranges, invalid ranges, full responses and HEAD');
}finally{await rm(dir,{recursive:true,force:true});}
