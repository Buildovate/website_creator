import {releaseRepoRoot} from "../../scripts/runtime-paths.mjs";
// Diagnostic observer only: does not alter capture, decode, seek or equality.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root=releaseRepoRoot+"/docs/build-evidence/028F/frame-initialization";
export async function recordFrameInitializationProof({path,data,readiness}){
 const phase=process.env.BV_FRAME_PROOF;
 if(!['before','after'].includes(phase))throw Error('Expected before/after frame proof');
 const e=readiness.environment,key=e.packetSlug+'/'+e.captureNumber+'/'+path;
 const folder=root+'/'+phase+'/hero-editor',file=folder+'/'+key;
 fs.mkdirSync(file.slice(0,file.lastIndexOf('/')),{recursive:true});
 fs.writeFileSync(file,data);fs.writeFileSync(file+'.readiness.json',JSON.stringify(readiness,null,2));
 fs.appendFileSync(folder+'/hashes.jsonl',JSON.stringify({key,path,slug:e.packetSlug,captureNumber:e.captureNumber,sha256:createHash('sha256').update(data).digest('hex')})+'\n');
}
