import fs from 'node:fs';import{spawnSync}from'node:child_process';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028P';
for(const label of process.argv.slice(2)){const r=spawnSync(process.execPath,[root+'/tests/'+label+'.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,NODE_OPTIONS:'--import=file:///'+out+'/tools/evidence-redirect.mjs',BV_CHECK_LABEL:label}});fs.writeFileSync(out+'/checks/'+label+'.log',(r.stdout||'')+'\n'+(r.stderr||''));console.log(label+': '+r.status);if(r.status){console.log(r.stderr);process.exitCode=1}}
