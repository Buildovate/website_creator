import {spawn} from 'node:child_process';
for(const step of ['restore-template-media','finalize-restored-media','restore-paid-masters','audit-restored-media']){
 const code=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,['scripts/'+step+'.mjs'],{stdio:'inherit',windowsHide:true,env:process.env});p.on('error',reject);p.on('exit',resolve)});
 if(code!==0)process.exit(code||1);
}
console.log('Complete: original-source media restored, native masters/crops finalized, and quality provenance audited. Run the quality gate before uploading.');
