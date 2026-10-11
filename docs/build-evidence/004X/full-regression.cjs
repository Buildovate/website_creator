const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/004X/regressions';fs.mkdirSync(out,{recursive:true});
const env={...process.env,PATH:'C:/Program Files/DJ.Studio/resources/app.asar.unpacked/node_modules/ffprobe-static/bin/win32/x64;'+process.env.PATH};
const tests=fs.readdirSync(root+'/tests').filter(n=>n.endsWith('.mjs')&&n!=='preview-fixture.mjs');
const commands=[['build',['build.mjs']],['typecheck',['node_modules/typescript/bin/tsc','-p','tsconfig.auth.json']],...tests.map(n=>[n,['tests/'+n]])],results=[];
for(const [name,args] of commands){const start=Date.now(),r=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',timeout:180000,maxBuffer:5e6});fs.writeFileSync(path.join(out,name+'.log'),(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error:''));const row={name,code:r.status,passed:r.status===0,ms:Date.now()-start};results.push(row);console.log(JSON.stringify(row));}
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));if(results.some(r=>!r.passed))process.exitCode=1;
