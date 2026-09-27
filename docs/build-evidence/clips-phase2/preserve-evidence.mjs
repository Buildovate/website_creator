import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo='C:/Users/joe/website_creator', out=repo+'/docs/build-evidence/clips-phase2';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const state=out+'/preserve-state.json';
if(process.argv[2]==='backup'){
 if(fs.existsSync(state))throw Error('Existing preservation record; do not replace');
 const backup=fs.mkdtempSync(path.join(os.tmpdir(),'roofing-clips-phase2-'));
 const evidence=files(repo+'/docs/build-evidence').filter(p=>!p.replaceAll('\\','/').startsWith(out+'/')).map(p=>({path:path.relative(repo,p).replaceAll('\\','/'),sha256:hash(p)}));
 for(const e of evidence){const dest=path.join(backup,e.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(repo,e.path),dest);}
 const dirty=execFileSync('git',['ls-files','-m','-o','--exclude-standard','-z'],{cwd:repo,encoding:'utf8'}).split('\0').filter(Boolean).filter(p=>!p.startsWith('docs/build-evidence/clips-phase2/')).map(p=>({path:p,sha256:hash(path.join(repo,p))}));
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
 fs.writeFileSync(state,JSON.stringify({backup,head,evidence,dirty},null,2));
 console.log(JSON.stringify({backedUpEvidence:evidence.length,unrelatedFiles:dirty.length,backup,head}));
}else if(process.argv[2]==='restore'){
 const s=JSON.parse(fs.readFileSync(state));const prior=new Set(s.evidence.map(e=>e.path));const current=files(repo+'/docs/build-evidence').filter(p=>!p.replaceAll('\\','/').startsWith(out+'/'));
 for(const p of current){const rel=path.relative(repo,p).replaceAll('\\','/');if(!prior.has(rel)){const dest=out+'/regenerated-extra/'+rel;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(p,dest);fs.unlinkSync(p);}}
 let restored=0;for(const e of s.evidence){const p=path.join(repo,e.path);if(!fs.existsSync(p)||hash(p)!==e.sha256){const dest=out+'/rerun-evidence/'+e.path;fs.mkdirSync(path.dirname(dest),{recursive:true});if(fs.existsSync(p))fs.copyFileSync(p,dest);fs.copyFileSync(path.join(s.backup,e.path),p);restored++;}if(hash(p)!==e.sha256)throw Error('Restore mismatch '+e.path);}
 const changed=s.dirty.filter(e=>!fs.existsSync(path.join(repo,e.path))||hash(path.join(repo,e.path))!==e.sha256);if(changed.length)throw Error('Unrelated files changed: '+JSON.stringify(changed));
 fs.writeFileSync(out+'/preservation.json',JSON.stringify({priorEvidenceVerified:s.evidence.length,restored,unrelatedVerified:s.dirty.length,changed:[]},null,2));console.log('Preserved '+s.evidence.length+' evidence files and '+s.dirty.length+' unrelated files');
}
