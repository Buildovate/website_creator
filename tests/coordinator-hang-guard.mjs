import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {watchChildForHang,guardedResult} from '../docs/build-evidence/028F/tools/child-hang-guard.mjs';

async function expectOutcome(source,options,expected){
  const child=spawn(process.execPath,['-e',source],{stdio:['ignore','pipe','pipe'],windowsHide:true});
  let result;
  const hung=watchChildForHang(child,{...options,onHung:(reason,detail)=>{result={reason,detail}}});
  const status=await new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));
  assert.equal(hung(),expected);
  assert.equal(result.reason,expected);
  assert.notEqual(status.code,0);
  return {result,record:guardedResult(status.code,hung())};
}
const passed=await expectOutcome('console.log("PASS synthetic");setInterval(()=>{},1000)',{silenceMs:1000,finalLineMs:150,tickMs:20},'pass-with-warning');
assert.equal(passed.record.outcome,'PASS-WITH-WARNING');assert.equal(passed.record.status,0);
const failed=await expectOutcome('console.log("FAIL synthetic");setInterval(()=>{},1000)',{silenceMs:1000,finalLineMs:150,tickMs:20},'hung');
assert.equal(failed.record.outcome,'FAILED');assert.equal(failed.record.status,1);
const silent=await expectOutcome('setInterval(()=>{},1000)',{silenceMs:150,finalLineMs:1000,tickMs:20},'hung');
assert.match(silent.result.detail,/silent/);assert.equal(silent.record.outcome,'FAILED');
console.log('PASS final-PASS child reported PASS-WITH-WARNING; final-FAIL and silent children reported FAILED/hung');
