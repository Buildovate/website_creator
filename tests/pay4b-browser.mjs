import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {clientEntries} from '../scripts/build-client.mjs';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {billingSummary} from '../src/payments/billing.js';
import {quotePlanSwitch,confirmPlanSwitch,requestRentalCancellation} from '../src/payments/plan-management.js';
import {makeFakeBillingAdapter,fakeTestEnv} from './stripe-fake.mjs';

const root=process.cwd(),port=5181,base=`http://127.0.0.1:${port}`;
const pageBuild=await build({stdin:{contents:"export {dashboard} from './src/views.js'",resolveDir:root},bundle:true,write:false,format:'esm',platform:'node',loader:{'.html':'text','.pdf':'binary'}});
const {dashboard}=await import('data:text/javascript;base64,'+Buffer.from(pageBuild.outputFiles[0].contents).toString('base64'));
const shots=resolve(root,'docs/build-evidence/LAUNCH-PAY/screenshots');
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const enhancements=(await Promise.all(['crm-enhancements','control-ui','engagement-ui'].map(name=>readFile(`public/${name}.js`,'utf8')))).join('\n');
const client=await build({entryPoints:clientEntries,outdir:'pay4b-browser/client',bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',plugins:[{name:'legacy-workspace-features',setup(builder){builder.onLoad({filter:/legacy-workspace\.js$/},async args=>{const source=await readFile(args.path,'utf8');return {contents:source.replace('/* CRM_ENHANCEMENTS */',()=>enhancements),loader:'js'};});}}]});
const styles=await build({entryPoints:['src/client/styles/platform/index.css','src/client/styles/app.css'],outdir:'pay4b-browser/client',bundle:true,write:false,external:['/assets/*'],target:'es2022'});
const assets=new Map([...client.outputFiles,...styles.outputFiles].map(file=>['/'+file.path.replaceAll('\\','/').split('/').at(-1),file.contents]));
async function seedRental(longStanding){
  const h=paymentHarness(),session={id:'cs_browser',mode:'subscription',customer:'cus_test_1',subscription:'sub_browser',metadata:{tenantId:'tenant_123',skus:'PLAN-WEBSITE-MONTH'}};
  assert.equal((await h.send(h.event('evt_sub','checkout.session.completed',session))).status,200);
  if(longStanding)assert.equal((await h.send(h.event('evt_first','invoice.paid',h.invoice('in_first','PLAN-WEBSITE-MONTH',5000,'2026-01-01T00:00:00.000Z','2026-02-01T00:00:00.000Z')))).status,200);
  assert.equal((await h.send(h.event('evt_current','invoice.paid',h.invoice('in_current','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2026-11-01T00:00:00.000Z')))).status,200);
  Object.assign(h.env,fakeTestEnv,{PAYMENT_BILLING_ADAPTER:makeFakeBillingAdapter({quotedAmountCents:47500})});
  return h;
}
const harnesses={switch:await seedRental(false),early:await seedRental(false),allowed:await seedRental(true)};
const onlyView=process.argv[2]||null;
const settings={name:'Harbor Roofing',trade:'Roofing',owner:'A. Rivera',phone:'8055550101',email:'office@example.test',license:'',address:'',area:'Oxnard',hours:'',experience:'',hero:'Trusted roofing',intro:'',template:'craft',color:'#10304d',services:[],showOwner:false,showOwnerPhoto:false,showProjects:false};
const tenant={id:'tenant_123',name:'Harbor Roofing',slug:'harbor-roofing',status:'draft',version:1,updated_at:'2026-10-08T12:00:00.000Z',settings,published:null};
const json=(res,value,status=200)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
const mime=path=>({'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'}[extname(path)]||'application/octet-stream');
const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url,base),scenario=new URL(req.headers.referer||base).searchParams.get('case')||'monthly';
  if(url.pathname==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(dashboard(false));return;}
  if(url.pathname.startsWith('/api/')){
    if(url.pathname==='/api/session')return json(res,{user:{id:'browser-owner',email:'owner@example.test',admin:false,staff:false,owner:true},initialized:true});
    if(url.pathname==='/api/tenants')return json(res,{tenants:[tenant]});
    if(url.pathname==='/api/tenants/tenant_123')return json(res,{tenant,role:'owner',photos:[],projects:[],inquiries:[]});
    if(url.pathname==='/api/tenants/tenant_123/readiness')return json(res,{checks:[]});
    if(url.pathname==='/api/tenants/tenant_123/domains')return json(res,{domains:[]});
    const h=harnesses[scenario];
    if(url.pathname==='/api/payments/tenants/tenant_123/billing')return json(res,await billingSummary(h.env,'tenant_123'));
    if(url.pathname==='/api/payments/tenants/tenant_123/billing/switch-quote')return json(res,await quotePlanSwitch(h.env,'tenant_123',(JSON.parse(await new Promise(resolve=>{let text='';req.on('data',chunk=>text+=chunk);req.on('end',()=>resolve(text))}))).targetSku));
    if(url.pathname==='/api/payments/tenants/tenant_123/billing/switch')return json(res,await confirmPlanSwitch(h.env,'tenant_123',JSON.parse(await new Promise(resolve=>{let text='';req.on('data',chunk=>text+=chunk);req.on('end',()=>resolve(text))}))));
    if(url.pathname==='/api/payments/tenants/tenant_123/billing/cancel')return json(res,await requestRentalCancellation(h.env,'tenant_123',(JSON.parse(await new Promise(resolve=>{let text='';req.on('data',chunk=>text+=chunk);req.on('end',()=>resolve(text))}))).idempotencyKey));
    if(/^\/api\/workspace\/tenant_123\/(pages|forms|visibility|plan)$/.test(url.pathname))return json(res,{records:[]});
    return json(res,{error:`Unmocked API path: ${url.pathname}`},404);
  }
  if(assets.has(url.pathname)){res.writeHead(200,{'content-type':mime(url.pathname)});res.end(assets.get(url.pathname));return;}
  const file=resolve(root,'public','.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(resolve(root,'public')+sep)){res.writeHead(403);res.end();return;}
  try{const content=await readFile(file);res.writeHead(200,{'content-type':mime(file)});res.end(content);}catch{res.writeHead(404);res.end();}
}catch(error){res.writeHead(500);res.end(String(error));}});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
let browser;
try{
  await mkdir(shots,{recursive:true});
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  for(const {scenario,width,height} of ['switch','early','allowed'].flatMap(scenario=>[{scenario,width:1440,height:900},{scenario,width:390,height:844}]).filter(view=>!onlyView||onlyView===view.scenario+'-'+view.width)){
    if(scenario==='allowed'&&width===390){harnesses.allowed.close();harnesses.allowed=await seedRental(true);}
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[],external=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==base){external.push(route.request().url());return route.abort();}return route.continue();});
    await mockGameBoard(page,base,tenant);await page.goto(`${base}/?case=${scenario}`);
    if(width===390){await openGameSection(page,'billing');}
    else{await openGameSection(page,'billing');}
    await page.locator('#bv-billing-title').waitFor();
    assert.equal(await page.locator('nav.tabs [data-section="billing"]').count(),1);
    if(scenario==='switch'){
      await page.locator('[data-bv-switch-quote]').click();
      await page.locator('[data-bv-switch-confirm]').waitFor();
      assert.match(await page.locator('[data-bv-switch-result]').innerText(),/Amount due now: \$475\.00/);
      await page.locator('[data-bv-switch-confirm]').click();
      await page.getByText('Plan change requested. Your plan changes after confirmed payment.').waitFor();
    }else if(scenario==='early'){
      assert.match(await page.locator('.bv-billing-actions').innerText(),/Monthly cancellation is unavailable until Jan 1, 2027/);
      assert.equal(await page.locator('.bv-billing-actions button:has-text("Cancel plan")').isDisabled(),true);
    }else{
      await page.locator('[data-bv-cancel-review]').click();
      await page.locator('[data-bv-cancel-confirm]').waitFor();
      await page.locator('[data-bv-cancel-confirm]').click();
      await page.getByText('Cancellation scheduled for the paid period end. The site stays up until then.').waitFor();
    }
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    await page.locator('.bv-billing-actions').scrollIntoViewIfNeeded();
    await page.screenshot({path:resolve(shots,`pay4b-${scenario}-${width===390?'mobile':'desktop'}.png`)});
    await page.close();console.log(`PASS browser ${scenario}: ${width}x${height}, Billing action and no external requests`);
  }
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));for(const h of Object.values(harnesses))h.close();}
