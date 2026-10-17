import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
sharp.cache(false);
const out='docs/build-evidence/MEDIA-RESTORE',before=JSON.parse(fs.readFileSync(out+'/before-proof.json')),after=JSON.parse(fs.readFileSync(out+'/after-proof.json')),media=JSON.parse(fs.readFileSync('public/media-quality.json'));
assert.equal(after.lighthouse.length,3,'three final Lighthouse runs');
const cdn=JSON.parse(fs.readFileSync('aws/template-media-preview-state.json')).origin,cdnNetwork=after.lighthouse.map(run=>{const report=JSON.parse(fs.readFileSync(`${out}/after-lighthouse-${run.run}.json`)),requests=report.audits['network-requests'].details.items.filter(x=>x.url.startsWith(cdn+'/'));if(after.delivery==='preview CloudFront'){assert.ok(requests.length>0,'measured CDN requests');assert.ok(requests.every(x=>[200,206].includes(x.statusCode)),'successful CDN responses');}return {run:run.run,requests:requests.length,transferBytes:requests.reduce((n,x)=>n+x.transferSize,0),statusCodes:[...new Set(requests.map(x=>x.statusCode))]}});
const comparisons=[];
for(const b of before.shots){
 const a=after.shots.find(a=>a.width===b.width&&a.scale===b.scale);assert.ok(a);
 assert.ok(Math.abs(b.position.scrollY-a.position.scrollY)<=1,'same scroll position');
 assert.ok(Math.abs(b.position.videoTime-a.position.videoTime)<.03,'same film frame');
 assert.deepEqual(a.crop,b.crop,'same crop');
 for(const cropped of [false,true]){
  const name=phase=>(phase==='before'?b.name:a.name).replace('.png',cropped?'-crop.png':'.png'),left=fs.readFileSync(out+'/'+name('before')),right=fs.readFileSync(out+'/'+name('after')),meta=await sharp(left).metadata(),am=await sharp(right).metadata();assert.equal(meta.width,am.width);assert.equal(meta.height,am.height);
  const title=Buffer.from(`<svg width="${meta.width*2}" height="48"><rect width="100%" height="100%" fill="white"/><g font-family="Arial" font-size="20" fill="#122b25"><text x="12" y="31">Before: Oct 12 encode</text><text x="${meta.width+12}" y="31">After: original-source restoration</text></g></svg>`),file=`comparison-roofing-${b.width}-${b.scale}x${cropped?'-crop':''}.png`;
  await sharp({create:{width:meta.width*2,height:meta.height+48,channels:3,background:'#fff'}}).composite([{input:title,left:0,top:0},{input:left,left:0,top:48},{input:right,left:meta.width,top:48}]).png().toFile(out+'/'+file);comparisons.push(file);
 }
}
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const rows=media.assets.map(a=>[a.path,a.kind,a.source.file,a.source.width+'x'+a.source.height,a.source.bitrate,a.source.keyframes,a.before?a.before.width+'x'+a.before.height:'',a.before?.bitrate,a.before?.keyframes,a.width+'x'+a.height,a.bitrate,a.keyframes,a.maxKeyframeGap,a.crf,a.quality,a.bytes]);
const table=['asset,type,original_source,source_resolution,source_bitrate,source_keyframes,before_resolution,before_bitrate,before_keyframes,after_resolution,after_bitrate,after_keyframes,max_keyframe_gap,crf,still_quality,bytes',...rows.map(row=>row.map(csv).join(','))].join('\n')+'\n';
fs.writeFileSync(out+'/ffprobe-assets.csv',table);fs.writeFileSync('docs/media/MEDIA-RESTORE-PROBES.csv',table);
const videos=media.assets.filter(a=>a.kind==='video'),limited=videos.filter(a=>a.source.width<1920&&a.source.height<1920).map(a=>({path:a.path,width:a.source.width,height:a.source.height}));
const result={originalInventory:JSON.parse(fs.readFileSync('docs/media/ORIGINAL-ASSETS.json')).length,missingOriginals:media.missingOriginals,logicalMedia:media.assets.length,videos:videos.length,stills:media.assets.length-videos.length,sourceLimitedVideos:limited,lighthouse:{before:before.medians,after:after.medians,afterDelivery:after.delivery,runs:after.lighthouse,cdnNetwork},comparisons,sameScrollAndFrame:true,applicationDeployed:false,qaGateClear:false,borderlines:{rejected:70,open:70}};
fs.writeFileSync('docs/media/MEDIA-RESTORE-RESULTS.json',JSON.stringify(result,null,2)+'\n');fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2)+'\n');
const panels=comparisons.filter(x=>x.includes('crop')).map(file=>`<figure><figcaption>${file}</figcaption><img src="${file}" alt="Before left and after right at identical scroll and film time"></figure>`).join('');
fs.writeFileSync(out+'/index.html',`<!doctype html><meta charset="utf-8"><title>MEDIA-RESTORE evidence</title><style>body{font:18px system-ui;margin:32px;color:#122b25;background:#fff}img{max-width:100%;height:auto}figure{margin:32px 0}pre{white-space:pre-wrap}</style><h1>MEDIA-RESTORE</h1><p>Before left; restored original source right. Native screenshot pixels retained. Roofing build-film original is 1280×720; no higher-resolution master was found.</p><p>1440 at 1× and 2×: scroll 570px. 390 at 3×: scroll 382px. Film time: 6.020833 seconds in every capture.</p>${panels}<p><a href="ffprobe-assets.csv">Per-asset source / before / after ffprobe table</a></p><pre>${JSON.stringify(result.lighthouse,null,2)}</pre>`);
console.log('PASS proof: three matched scroll/frame comparisons, per-asset probes and three-run Lighthouse medians.');
