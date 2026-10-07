import {spawnSync} from 'node:child_process';

// A final PASS followed by an exit hang is accepted only with an explicit warning.
export function watchChildForHang(child,{onHung=()=>{},silenceMs=600_000,finalLineMs=20_000,tickMs=1000}={}){
  let lastOutput=Date.now(), lastVerdict=null, hung=null;
  const tails=new Map();
  const observe=(stream,chunk)=>{
    lastOutput=Date.now();
    lastVerdict=null;
    const combined=(tails.get(stream)||'')+chunk.toString('utf8');
    const lines=combined.split(/\r?\n/);
    tails.set(stream,lines.pop().slice(-256));
    for(const line of lines){const match=line.match(/^\s*(PASS|FAIL)\b/);lastVerdict=match?{kind:match[1],at:lastOutput}:null;}
  };
  for(const stream of [child.stdout,child.stderr])if(stream)stream.on('data',chunk=>observe(stream,chunk));
  const timer=setInterval(()=>{
    if(hung)return;
    const now=Date.now();
    const afterVerdict=lastVerdict!==null && now-lastVerdict.at>=finalLineMs;
    if(now-lastOutput<silenceMs && !afterVerdict)return;
    hung=afterVerdict && lastVerdict.kind==='PASS'?'pass-with-warning':'hung';
    const detail=hung==='pass-with-warning'?'passed, then hung at exit':afterVerdict?'still running after final FAIL line':'silent for 10 minutes';
    onHung(hung,detail);
    if(process.platform==='win32'){
      const killed=spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true});
      if(killed.status!==0)child.kill('SIGKILL');
    }else child.kill('SIGKILL');
  },tickMs);
  timer.unref();
  child.once('close',()=>clearInterval(timer));
  return ()=>hung;
}

export function guardedResult(exitCode,hang){
  if(hang==='pass-with-warning')return {status:0,outcome:'PASS-WITH-WARNING',reason:'passed, then hung at exit'};
  if(hang)return {status:1,outcome:'FAILED',reason:'hung'};
  return exitCode===0?{status:0,outcome:'PASS'}:{status:exitCode??1,outcome:'FAILED'};
}
