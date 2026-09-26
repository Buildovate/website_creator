const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/015FA/regressions';fs.mkdirSync(out,{recursive:true});
const env={...process.env,PATH:'C:/Program Files/DJ.Studio/resources/app.asar.unpacked/node_modules/ffprobe-static/bin/win32/x64;'+process.env.PATH};
const tests=fs.readdirSync(root+'/tests').filter(name=>name.endsWith('.mjs')&&name!=='preview-fixture.mjs');
const commands=[['build',['build.mjs']],['typecheck',['node_modules/typescript/bin/tsc','-p','tsconfig.auth.json']],...tests.map(name=>[name,['tests/'+name]])],results=[];
for(const [name,args] of commands){
 const start=Date.now(),result=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',timeout:180000,maxBuffer:5e6});
 fs.writeFileSync(path.join(out,name+'.log'),(result.stdout||'')+(result.stderr||'')+(result.error?'\n'+result.error:''));
 const row={name,code:result.status,passed:result.status===0,ms:Date.now()-start};results.push(row);console.log(JSON.stringify(row));
}
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
if(results.some(row=>!row.passed))process.exitCode=1;
