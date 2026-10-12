import assert from 'node:assert/strict';
import vm from 'node:vm';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {clientEntries} from '../scripts/build-client.mjs';

async function moduleAt(path,globals={}) {
  const built=await build({entryPoints:[path],bundle:true,write:false,format:'iife',globalName:'Module',platform:'browser',target:'es2022'});
  const context=vm.createContext({Blob,Response,Headers,URL,console,...globals});
  vm.runInContext(built.outputFiles[0].text,context);
  return context.Module;
}
const user={id:'alice',email:'alice@example.test',admin:false,staff:false,platformRole:null};
const session={user,initialized:true,csrfToken:'test-csrf'};
function documentStub(){
  const notices=[];
  return {notices,querySelector:()=>null,createElement:()=>({append(){},setAttribute(){}}),createTextNode:text=>text,body:{before:node=>notices.push(node)}};
}
let calls=[],queue=[];
const fetch=async(url,options={})=>{calls.push({url,options});const item=queue.shift();assert.ok(item,'Unexpected request '+url);return Response.json(item.body,{status:item.status||200});};
const doc=documentStub();
const aws=await moduleAt('src/client/shared/workspace-api.ts',{window:{BuildovateAuth:{}},document:doc,fetch});
queue=[{body:session},{body:{ok:true}}];
assert.equal((await aws.api('/tenants/site','PUT',{settings:{hero:'Saved title'},version:4})).ok,true);
assert.deepEqual(calls.map(c=>c.url),['/api/session','/api/tenants/site']);
assert.equal(calls[1].options.credentials,'same-origin');
assert.equal(calls[1].options.headers['x-csrf-token'],'test-csrf');
assert.equal(JSON.parse(calls[1].options.body).version,4);

// An expired or changed identity never sends or automatically replays a mutation.
calls=[];queue=[{body:{...session,user:null}}];
await assert.rejects(()=>aws.api('/tenants/site','PUT',{hero:'Keep this'}),/Sign in again/);
assert.equal(calls.length,1);assert.equal(doc.notices.length,1);
for(let i=0;i<2;i++){
  calls=[];queue=[{body:{...session,user:{...user,id:'bob'}}}];
  await assert.rejects(()=>aws.api('/tenants/site','PUT',{}),/different user/);assert.equal(calls.length,1);
}
calls=[];queue=[{body:session},{status:403,body:{error:'Owner access required.'}}];
await assert.rejects(()=>aws.api('/tenants/site/publish','POST',{}),/Owner access required/);
assert.equal(calls.length,2);

// Original Sites hosting identity remains a separate, cookie-sending transport.
calls=[];queue=[{body:{ok:true}}];
const sites=await moduleAt('src/client/shared/workspace-api.ts',{window:{},document:documentStub(),fetch});
const image=new Blob(['test-only'],{type:'image/jpeg'});
await sites.api('/tenants/site/photos','POST',image);
assert.equal(calls.length,1);assert.equal(calls[0].options.body,image);
assert.equal(calls[0].options.headers['Content-Type'],'image/jpeg');
assert.equal(calls[0].options.credentials,'same-origin');

const forms=await moduleAt('src/client/shared/forms.ts');
assert.match(forms.field('Name','name','"><script>bad</script>'),/&quot;&gt;&lt;script&gt;/);
assert.doesNotMatch(forms.textarea('Text','text','</textarea><script>bad</script>'),/<script>/);
assert.match(forms.select('Trade','trade',['General Contractors'],'General contracting'),/selected/);

// Public inquiries do not acquire a workspace session, and failed forms retain their values.
let reset=0,posts=0,fail=false,redirect='';
const leadStorage=new Map();
const button={disabled:false},status={textContent:''};
const form={dataset:{slug:'fixture',preview:'true'},elements:{namedItem:()=>({checked:true})},querySelector:s=>s==='button'?button:status,reset:()=>reset++};
class FixtureData { *[Symbol.iterator](){yield ['name','Local test'];yield ['service','Repair'];yield ['message','Test request'];} }
const inquiries=await moduleAt('src/client/site/inquiries.ts',{
  document:{querySelectorAll:()=>[form]},FormData:FixtureData,location:{pathname:'/s/fixture',search:'',assign:path=>{redirect=path}},sessionStorage:{setItem:(key,value)=>leadStorage.set(key,value)},URLSearchParams,
  fetch:async(url,options)=>{posts++;assert.equal(url,'/api/public/fixture/inquiries');assert.equal(JSON.parse(options.body).consent,true);return Response.json(fail?{error:'Please retry.'}:{ok:true},{status:fail?503:200});},
});
inquiries.mountInquiries();
await form.onsubmit({preventDefault(){}});assert.equal(posts,0);
form.dataset.preview='false';await form.onsubmit({preventDefault(){}});
assert.equal(posts,1);assert.equal(reset,1);assert.equal(button.disabled,false);assert.equal(redirect,'/s/fixture/thank-you');assert.equal(JSON.parse(leadStorage.get('buildovate-lead-submitted')).site,'fixture');
fail=true;await form.onsubmit({preventDefault(){}});
assert.equal(reset,1);assert.equal(button.disabled,false);assert.equal(status.textContent,'Please retry.');

for(const name of Object.keys(clientEntries)) new vm.Script(readFileSync('dist/client/'+name+'.js','utf8'),{filename:name+'.js'});
console.log('PASS: client session transport, CSRF, identity changes, expired-save preservation, Sites compatibility, escaping, public inquiry success/failure and bundle syntax.');

const disconnected=await moduleAt('src/client/shared/api.ts',{document:documentStub(),fetch:async()=>{throw Error('network internals');}});
await assert.rejects(()=>disconnected.loadSession(),/Check your connection/);
let attempts=0;const failures=[];
const element=()=>({children:[],attributes:{},append(...nodes){this.children.push(...nodes);},setAttribute(key,value){this.attributes[key]=value;},replaceChildren(...nodes){this.children=nodes;}});
const content=element();
const startup=await moduleAt('src/client/workspace/startup.ts',{document:{querySelector:selector=>selector==='#content'?content:null,createElement:element}});
await startup.startWorkspace(async()=>{if(++attempts===1)throw Error('offline');content.replaceChildren('Loaded website workspace');},async work=>{try{await work();}catch(error){failures.push(error.message);}});
assert.equal(content.attributes['aria-busy'],'false');assert.equal(failures.length,1);
assert.equal(content.children[0].children[0].textContent,'Your workspace couldn’t load');
await content.children[0].children[2].onclick();
assert.equal(attempts,2);assert.equal(content.children[0],'Loaded website workspace');assert.equal(content.attributes['aria-busy'],'false');
console.log('PASS: disconnected-session messages and workspace startup retry.');
