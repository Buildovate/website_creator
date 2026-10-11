import fs from 'node:fs';
const checks='C:/Users/joe/website_creator/docs/build-evidence/028F/checks';
for(let run=1;run<=5;run++){
 const path=checks+'/round8x-trace-run'+run+'.json',data=JSON.parse(fs.readFileSync(path,'utf8'));
 for(const capture of data.captures){
  const history=capture.trace.history,final=history.at(-1);
  for(const shift of capture.trace.shifts){
   const atShift=history.filter(s=>s.atMs<=shift.timeSinceNavigationMs).at(-1);
   Object.assign(shift.settledAtShift,{
    headerNavModeSettled:!!atShift?.navFitReady&&!!atShift.headerNavMode&&atShift.headerNavMode===final.headerNavMode,
    headerHeightVariableSettled:!!atShift?.headerHeightVariable&&atShift.headerHeightVariable===final.headerHeightVariable,
    settledStatusBasis:'Last recorded state at/before LayoutShift.startTime compared with final navigation state. Original observed snapshots retained; poster state observed at observer delivery.',
    snapshotAtShift:atShift||null
   });
  }
 }
 fs.writeFileSync(path,JSON.stringify(data,null,2));
}
console.log('Derived nav-mode/header-height settled status added to five trace JSONs; original observations retained.');
