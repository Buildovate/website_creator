import fs from 'node:fs';import {createHash}from'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
export function screenshotDiagnosticStore(folder){
 const records=new Map();let latest=0;
 const onScreenshot=async({path,readiness})=>{latest=readiness.environment.captureNumber;if(!records.has(latest))records.set(latest,new Map());records.get(latest).set(path,readiness);const file=folder+'/capture-'+latest+'/'+path+'.json';fs.mkdirSync(file.slice(0,file.lastIndexOf('/')),{recursive:true});fs.writeFileSync(file,JSON.stringify(readiness,null,2));};
 return {onScreenshot,latest:()=>latest,records:()=>records.get(latest)||new Map()};
}
export async function snapshotScreenshotEvidence(bucket,prefix,packet,diagnostics){
 const images=new Map();for(const file of packet.files.filter(x=>x.path.endsWith('.png'))){const object=await bucket.get(prefix+file.path);if(object)images.set(file.path,Buffer.from(await new Response(object.body).arrayBuffer()));}
 return {files:structuredClone(packet.files),images,readiness:new Map(diagnostics.records()),captureNumber:diagnostics.latest()};
}
export function preserveScreenshotEqualityFailure(before,after,folder){
 const differences=[];for(const path of new Set([...before.images.keys(),...after.images.keys()])){const a=before.images.get(path),b=after.images.get(path);if(a&&b&&a.equals(b))continue;const stem=folder+'/'+path.replace(/\.png$/,'');fs.mkdirSync(stem,{recursive:true});if(a)fs.writeFileSync(stem+'/before.png',a);if(b)fs.writeFileSync(stem+'/after.png',b);const readiness={before:before.readiness.get(path)||{unavailable:true},after:after.readiness.get(path)||{unavailable:true}};fs.writeFileSync(stem+'/readiness.json',JSON.stringify(readiness,null,2));differences.push({path,before:a?{bytes:a.length,sha256:hash(a)}:null,after:b?{bytes:b.length,sha256:hash(b)}:null,folder:stem,readiness:'readiness.json'});}
 fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(folder+'/comparison.json',JSON.stringify({exactEquality:differences.length===0,beforeCapture:before.captureNumber,afterCapture:after.captureNumber,differences},null,2));return differences;
}
