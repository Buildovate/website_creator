import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const repo='C:/Users/joe/website_creator',out=repo+'/docs/build-evidence/028P',backup=out+'/.preserve';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const git=args=>execFileSync('git',['-c','safe.directory=C:/Users/joe/website_creator',...args],{cwd:repo,encoding:'utf8',maxBuffer:30e6});
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
if(fs.existsSync(out+'/preserve-state.json'))throw Error('Do not replace preservation record');
const evidence=walk(repo+'/docs/build-evidence').filter(p=>!p.replaceAll('\\','/').startsWith(out+'/')).map(p=>({path:path.relative(repo,p).replaceAll('\\','/'),sha256:hash(p)}));
for(const e of evidence){const dest=backup+'/'+e.path;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(repo+'/'+e.path,dest)}
const dirty=git(['ls-files','-m','-o','--exclude-standard','-z']).split('\0').filter(p=>p&&!p.startsWith('docs/build-evidence/028P/')).map(p=>({path:p,sha256:hash(repo+'/'+p)}));
fs.writeFileSync(out+'/preserve-state.json',JSON.stringify({base:git(['rev-parse','HEAD']).trim(),backup,evidence,dirty},null,2));
console.log(JSON.stringify({priorEvidence:evidence.length,unrelatedFiles:dirty.length,backup}));
