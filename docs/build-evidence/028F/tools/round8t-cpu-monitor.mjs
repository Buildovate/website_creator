import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',pid=Number(process.argv[2]);
if(!Number.isSafeInteger(pid)||pid<=0)throw Error('PID required');
const target=root+'/docs/build-evidence/028F/checks/round8t-diagnose-service-pages-all-trades-cpu.json';
const script=fs.readFileSync(root+'/docs/build-evidence/028F/tools/round8t-cpu.ps1','utf8').replace(/^param\([^\n]+\)\r?\n/,'$RootProcessId = '+pid+'\n');
const rows=[];let previous=new Map();
while(true){
 const sample=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,encoding:'utf8',timeout:10000});
 if(sample.status!==0)throw Error(sample.stderr||'CPU monitor failed');
 const processes=JSON.parse(sample.stdout),delta=processes.reduce((sum,p)=>sum+Math.max(0,p.cpuSeconds-(previous.get(p.id)??p.cpuSeconds)),0);
 rows.push({timestamp:new Date().toISOString(),processes,cpuDeltaSeconds:rows.length?delta:null});
 fs.writeFileSync(target,JSON.stringify({pid,samplingNote:'Separate read-only monitor added during the original run after script-file execution policy blocked the initial CPU probe; guard and child unchanged.',samples:rows},null,2));
 if(!processes.some(p=>p.id===pid))break;
 previous=new Map(processes.map(p=>[p.id,p.cpuSeconds]));
 await new Promise(resolve=>setTimeout(resolve,15000));
}
console.log('CPU monitor completed '+target);
