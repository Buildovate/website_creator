import assert from 'node:assert/strict';
import {build,transformSync} from 'esbuild';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {normalizePlatform,financingEstimate} from '../src/platform/constitution.ts';
import {normalizeWebsitePages} from '../src/platform/website-pages.ts';
import {comparePlans,planPrefill,prefillInquiry} from '../src/platform/financing-plans.ts';
import {serviceFinance,financeSection} from '../src/service-conversion.js';
import {worker,env,admin} from './preview-fixture.mjs';

const program=(id,apr,months,extra={})=>({id,name:'Plan '+id,lenderId:'wisetack',apr,months,enabled:true,confirmed:true,deferredInterest:false,...extra});
const programs=[program('long',9.99,132),program('balanced',7.99,73),program('short',5.99,58),program('zero',0,18)];
assert.ok(Math.abs(financingEstimate(12000,2000,12,12).monthly-888.487886783)<1e-8);
let plans=comparePlans(programs,6000,0);
assert.ok(Math.abs(plans[0].monthly-75.08531927093)<.01);
assert.equal(plans[3].monthly,6000/18);assert.equal(plans[3].interest,0);assert.equal(plans[3].totalCost,6000);
assert.deepEqual(plans[0].badges,['Lowest monthly']);assert.deepEqual(plans[3].badges,['No interest','Least total cost']);
assert.deepEqual(plans[1].badges,[]);assert.equal(comparePlans([program('a',0,12),program('b',0,12)],1000,0).filter(p=>p.badges.length===3).length,2);
const down=comparePlans(programs,6000,20);assert.equal(down[0].downPayment,1200);assert.equal(down[0].principal,4800);assert.equal(down[3].totalCost,6000);assert.ok(Math.abs(down[0].monthly/plans[0].monthly-.8)<1e-12);
assert.equal(comparePlans(programs,100.01,10)[0].downPayment,10);
for(const [amount,pct] of [[0,0],[-1,0],[NaN,0],[Infinity,0],[1000001,0],[6000,15]])assert.throws(()=>comparePlans(programs,amount,pct));
console.log('PASS #004D payment math: amortization, zero APR, cents rounding, down-payment totals, computed badges/ties and invalid input.');

const config={footer:{financingDisclosure:'Approved fixture lender disclosure.'},financing:{enabled:true,lenders:[{id:'wisetack',enabled:true,confirmed:true,applicationUrl:'https://example.test/merchant'}],programs}};
const page={id:'repair',kind:'service',title:'Roof repair',serviceName:'Roof repair',enabled:true,typicalPriceRange:{min:3000,max:9000}};
const p=normalizePlatform(config),fin=serviceFinance(p,false);
assert.equal(fin.programs.length,4);
assert.equal(normalizePlatform({...config,financing:{...config.financing,programs:[]}}).financing.programs.length,0);
for(const change of [x=>x.financing.programs=[],x=>x.financing.enabled=false,x=>x.footer.financingDisclosure='',x=>x.financing.programs.forEach(p=>p.confirmed=false),x=>x.financing.programs.forEach(p=>p.enabled=false),x=>x.financing.lenders.forEach(l=>l.enabled=false)]){const x=structuredClone(p);change(x);assert.equal(serviceFinance(x,false),null);assert.equal(financeSection(serviceFinance(x,false),false,page),'');}
for(const change of [x=>x.apr='',x=>x.apr=null,x=>x.apr=-1,x=>x.months=1.5,x=>x.months=0,x=>x.months=361,x=>x.lenderId='invalid']){const x=structuredClone(config);change(x.financing.programs[0]);assert.throws(()=>normalizePlatform(x));}
assert.throws(()=>normalizePlatform({...config,financing:{...config.financing,programs:[programs[0],programs[0]]}}));
const legacy=normalizePlatform({...config,financing:{...config.financing,programs:undefined,serviceTerms:{lenderId:'wisetack',amount:5000,downPayment:500,apr:0,months:36,confirmed:true}}});
assert.equal(serviceFinance(legacy,false).programs.length,1);
assert.equal(serviceFinance(normalizePlatform({...legacy,financing:{...legacy.financing,programs:[]}}),false),null);
let html=financeSection(fin,false,page);assert.equal((html.match(/data-plan-id=/g)||[]).length,4);assert.match(html,/value="6000"/);assert.match(html,/9.99% APR/);assert.match(html,/132 months/);assert.match(html,/down payment/);assert.ok(!html.includes('example.test/merchant'));
const deferred=serviceFinance(normalizePlatform({...config,financing:{...config.financing,programs:[program('conditional',0,18,{deferredInterest:true})]}}),false);
assert.match(financeSection(deferred,false,page),/Deferred interest/);assert.match(financeSection(deferred,false,page),/conditions are met/);
assert.equal(serviceFinance(p,true).programs.length,4);assert.deepEqual(serviceFinance(p,true).programs.map(p=>[p.apr,p.months]),[[9.99,132],[7.99,73],[5.99,58],[0,18]]);
assert.match(financeSection(serviceFinance(p,true),true,page),/Sample — replaced with your info/);
for(const range of [{min:0,max:100},{min:200,max:100},{min:100,max:100},{min:100,max:1000001}])assert.throws(()=>normalizeWebsitePages({version:1,pages:[{...page,typicalPriceRange:range}]}));
assert.equal(normalizeWebsitePages({version:1,pages:[page]}).pages[0].typicalPriceRange.max,9000);
console.log('PASS #004D configuration: every confirmed program, legacy migration/explicit clear, missing gates hide, invalid terms/ranges, required card details, deferred-interest labels and four isolated samples.');

// Exercise the actual browser controller against a small DOM boundary, then send
// its prefill through the existing inquiry handler and the real local API.
const node=()=>({dataset:{},style:{},attributes:{},hidden:false,textContent:'',value:'',checked:false,listeners:{},children:[],classList:{toggle(){}},addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(k,v){this.attributes[k]=v;},replaceChildren(...nodes){this.children=nodes;},focus(){this.focused=true;}});
const fields=Object.fromEntries([...Object.keys(planPrefill(plans[0])),'financingInterest','name'].map(k=>[k,node()]));
const summary=node(),submit=node(),status=node();
const inquiry={dataset:{slug:'finance-comparison',preview:'false',project:''},elements:{namedItem:name=>fields[name]||{checked:true}},listeners:{},querySelector:s=>s==='[data-plan-summary]'?summary:s==='[name=name]'?fields.name:s==='button'?submit:status,querySelectorAll:()=>Object.entries(fields).filter(([k])=>k.startsWith('financing')&&k!=='financingInterest').map(([,v])=>v),addEventListener(k,fn){this.listeners[k]=fn},reset(){this.listeners.reset?.()}};
prefillInquiry(inquiry,down[3]);assert.equal(fields.financingMonthly.value,'266.67');assert.equal(fields.financingAmount.value,'6000.00');assert.equal(fields.financingDown.value,'1200.00');assert.equal(fields.financingPlan.value,'Plan zero');assert.equal(fields.financingInterest.checked,true);
const cost=node(),slider=node(),radios=[0,10,20].map(v=>({...node(),value:String(v),checked:v===0}));cost.value='6000';slider.min='3000';slider.max='9000';
const slots=Object.fromEntries(['data-down-amount','data-finance-error','data-finance-status','data-breakdown-name','data-principal-bar','data-principal-chart','data-principal','data-interest'].map(k=>['['+k+']',node()]));
const cards=programs.map(p=>{const elements=Object.fromEntries(['data-selected-label','data-plan-monthly','data-plan-down','data-plan-total','data-plan-badges','data-choose-plan'].map(k=>['['+k+']',node()]));return {...node(),dataset:{planId:p.id},querySelector:s=>elements[s]};});
const root={dataset:{financeConfig:JSON.stringify({programs,amount:6000,downPercent:0})},querySelector:s=>s==='[data-project-cost]'?cost:s==='[data-cost-slider]'?slider:s==='[name=planDownPercent]:checked'?radios.find(r=>r.checked):slots[s],querySelectorAll:s=>s==='[data-plan-id]'?cards:radios};
const built=await build({entryPoints:['src/client/site/finance-comparison.ts'],bundle:true,write:false,format:'iife',globalName:'Finance',platform:'browser'});
const ctx={document:{querySelector:()=>inquiry,querySelectorAll:()=>[],createElement:node},matchMedia:()=>({matches:true,addEventListener(){}}),setTimeout:()=>0,clearTimeout(){},cancelAnimationFrame(){},requestAnimationFrame(){throw Error('Reduced motion must not animate');},Intl,console};
runInNewContext(built.outputFiles[0].text,ctx);ctx.Finance.mountFinanceComparison(root);
cards[3].querySelector('[data-choose-plan]').listeners.click({preventDefault(){}});assert.equal(fields.financingPlanId.value,'zero');assert.equal(fields.financingMonthly.value,'333.33');assert.equal(fields.name.focused,true);
cost.value='9000';cost.listeners.input();assert.equal(fields.financingMonthly.value,'500.00');assert.equal(fields.financingAmount.value,'9000.00');
radios[0].checked=false;radios[2].checked=true;radios[2].listeners.change();assert.equal(fields.financingDown.value,'1800.00');assert.equal(fields.financingMonthly.value,'400.00');assert.match(summary.textContent,/\$1,800.00 down/);
cost.value='';cost.listeners.input();assert.equal(summary.hidden,true);assert.equal(fields.financingPlanId.value,'');assert.equal(cards[0].querySelector('[data-choose-plan]').attributes['aria-disabled'],'true');
slider.value='6000';slider.listeners.input();assert.equal(fields.financingMonthly.value,'266.67');
const origin='https://test.local';
async function api(path,method='GET',data){const r=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:data===undefined?undefined:JSON.stringify(data)}),env);assert.equal(r.status,200,await r.clone().text());return r.json();}
let t=(await api('/tenants','POST',{preset:'robles',slug:'finance-comparison'})).tenant;
t=(await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,platform:config,websitePages:{version:1,pages:[page]}}})).tenant;
assert.equal(t.settings.platform.financing.programs.length,4);await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});
const published=await (await worker.fetch(new Request(origin+'/s/'+t.slug+'/services/roof-repair'),env)).text();assert.equal((published.match(/data-plan-id=/g)||[]).length,4);assert.ok(!published.includes('SAMPLE TERMS'));
let posted;
const code=transformSync(readFileSync('src/client/site/inquiries.ts','utf8'),{loader:'ts',format:'cjs'}).code,module={exports:{}};
runInNewContext(code,{module,document:{querySelectorAll:()=>[inquiry]},FormData:class{*[Symbol.iterator](){yield* Object.entries({service:'Roof repair',name:'Local finance test',phone:'8055550123',projectCity:'Oxnard',message:'Fixture only',...Object.fromEntries(Object.entries(fields).filter(([k])=>k.startsWith('financing')).map(([k,v])=>[k,k==='financingInterest'?'on':v.value]))});}},fetch:async(url,options)=>{posted=JSON.parse(options.body);return worker.fetch(new Request(origin+url,{...options,headers:{...options.headers,origin}}),env);}});
module.exports.mountInquiries();await inquiry.onsubmit({preventDefault(){}});
assert.match(posted.message,/Plan zero \[zero\] \/ approximately \$266.67\/mo \/ project \$6000.00 \/ down \$1200.00 \/ 0% APR \/ 18 months/);
const saved=await env.DB.prepare('SELECT message FROM inquiries WHERE tenant_id=? AND phone=?').bind(t.id,'8055550123').first();assert.equal(saved.message,posted.message);
assert.equal(fields.financingPlanId.value,'');assert.equal(summary.hidden,true);
inquiry.dataset.preview='true';posted=null;await inquiry.onsubmit({preventDefault(){}});assert.equal(posted,null);
console.log('PASS #004D browser/API: live slider/input/down changes, reduced motion, invalid-input clearing, selected-plan prefill, updated estimates, same inquiry persistence, reset and preview-send suppression.');
