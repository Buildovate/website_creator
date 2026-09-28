import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo='C:/Users/joe/website_creator', out=repo+'/docs/build-evidence/028A';
const owned=new Set(["BUILD-BACKLOG.md","BUILD-STATUS.md","docs/modules/design.md","docs/modules/sites.md","docs/modules/workspace.md","public/conversion.css","public/design-studio.css","public/service-detail.css","public/site-polish.css","public/trade-revisions.css","src/api.js","src/client/workspace/generation.js","src/client/workspace/legacy-workspace.js","src/core.js","src/platform/generation.ts","src/roofing-critical-css.js","src/worker.js","tests/expenses-browser.mjs","tests/planning-ambient-browser.mjs","tests/roofing-acceptance.mjs","tests/roofing-cta-browser.mjs","tests/roofing-polish-part2-browser.mjs","public/flow.css","public/site-styles.css","src/design-styles.js","src/site-style-render.js","src/client/workspace/site-look.js","tests/design-styles.mjs","tests/design-styles-browser.mjs","tests/helpers/style-inspection.mjs"]);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function evidencePath(p){const full=path.resolve(p),base=path.resolve(repo+'/docs/build-evidence')+path.sep,own=path.resolve(out)+path.sep;if(!full.startsWith(base)||full.startsWith(own))throw Error('Unsafe prior-evidence path '+full);return full;}
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
fs.mkdirSync(out,{recursive:true}); const state=out+'/preserve-state.json';
if(process.argv[2]==='backup'){
 if(fs.existsSync(state))throw Error('Existing preservation record; do not replace');
 const backup=fs.mkdtempSync(path.join(os.tmpdir(),'styles-028A-'));
 const evidence=files(repo+'/docs/build-evidence').filter(p=>!p.replaceAll('\\','/').startsWith(out+'/')).map(p=>({path:path.relative(repo,p).replaceAll('\\','/'),sha256:hash(p)}));
 for(const e of evidence){const dest=path.join(backup,e.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(repo,e.path),dest);}
 const dirty=execFileSync('git',['-c','safe.directory=C:/Users/joe/website_creator','ls-files','-m','-o','--exclude-standard','-z'],{cwd:repo,encoding:'utf8'}).split('\0').filter(Boolean).filter(p=>!p.startsWith('docs/build-evidence/028A/')&&!owned.has(p)).map(p=>({path:p,sha256:hash(path.join(repo,p))}));
 const head=execFileSync('git',['-c','safe.directory=C:/Users/joe/website_creator','rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
 fs.writeFileSync(state,JSON.stringify({backup,head,evidence,dirty},null,2));
 console.log(JSON.stringify({backedUpEvidence:evidence.length,unrelatedFiles:dirty.length,backup,head}));
}else if(process.argv[2]==='restore'){
 const s=JSON.parse(fs.readFileSync(state));const prior=new Set(s.evidence.map(e=>e.path));const current=files(repo+'/docs/build-evidence').filter(p=>!p.replaceAll('\\','/').startsWith(out+'/'));
 for(const p of current){const rel=path.relative(repo,p).replaceAll('\\','/');if(!prior.has(rel)){const verified=evidencePath(p),dest=out+'/regenerated-extra/'+rel;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(verified,dest);fs.unlinkSync(verified);}}
 let restored=0;for(const e of s.evidence){const p=path.join(repo,e.path);if(!fs.existsSync(p)||hash(p)!==e.sha256){const dest=out+'/rerun-evidence/'+e.path;fs.mkdirSync(path.dirname(dest),{recursive:true});if(fs.existsSync(p))fs.copyFileSync(p,dest);fs.copyFileSync(path.join(s.backup,e.path),p);restored++;}if(hash(p)!==e.sha256)throw Error('Restore mismatch '+e.path);}
 const changed=s.dirty.filter(e=>!fs.existsSync(path.join(repo,e.path))||hash(path.join(repo,e.path))!==e.sha256);if(changed.length)throw Error('Unrelated files changed: '+JSON.stringify(changed));
 fs.writeFileSync(out+'/preservation.json',JSON.stringify({priorEvidenceVerified:s.evidence.length,restored,unrelatedVerified:s.dirty.length,changed:[]},null,2));console.log('Preserved '+s.evidence.length+' evidence files and '+s.dirty.length+' unrelated files');
}
