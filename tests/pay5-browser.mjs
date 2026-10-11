import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {clientEntries} from '../scripts/build-client.mjs';
import {paymentHarness} from './helpers/payments-fixture.mjs';
import {addOnSummary,requestAddOnCheckout} from '../src/payments/add-ons.js';

const root=process.cwd(),port=5181,base=`http://127.0.0.1:${port}`;
const viewBuild=await build({stdin:{contents:"export {dashboard} from './src/views.js'",resolveDir:root},bundle:true,write:false,format:'esm',platform:'node',loader:{'.html':'text','.pdf':'binary'}});
const {dashboard}=await import('data:text/javascript;base64,'+Buffer.from(viewBuild.outputFiles[0].contents).toString('base64'));
const shots=resolve(root,'docs/build-evidence/LAUNCH-PAY/screenshots');
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const enhancements=(await Promise.all(['crm-enhancements','control-ui','engagement-ui'].map(name=>readFile(`public/${name}.js`,'utf8')))).join('\n');
const client=await build({entryPoints:clientEntries,outdir:'pay5-browser/client',bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',plugins:[{name:'legacy-workspace-features',setup(builder){builder.onLoad({filter:/legacy-workspace\.js$/},async args=>{const source=await readFile(args.path,'utf8');return {contents:source.replace('/* CRM_ENHANCEMENTS */',()=>enhancements),loader:'js'};});}}]});
const styles=await build({entryPoints:['src/client/styles/platform/index.css','src/client/styles/app.css'],outdir:'pay5-browser/client',bundle:true,write:false,external:['/assets/*'],target:'es2022'});
const assets=new Map([...client.outputFiles,...styles.outputFiles].map(file=>{const name=file.path.replaceAll('\\','/').split('/').at(-1);return [name==='index.css'?'/platform.css':'/'+name,file.contents]}));
const harnesses={disconnected:paymentHarness(),ready:paymentHarness(),owned:paymentHarness()};
let checkoutRequests=0;
const viewSelection=process.argv[2]||'all';
harnesses.ready.env.PAYMENT_CHECKOUT_SERVICE={async createCheckout(request){checkoutRequests++;assert.deepEqual(request.items,[{sku:'DOMAIN-CONNECT-FOR-ME',quantity:1}]);assert.equal(request.tenantId,'tenant_123');assert.equal('amountCents' in request,false);return {url:base+'/fake-checkout'};}};
assert.equal((await harnesses.owned.send(harnesses.owned.event('evt_browser_domain','checkout.session.completed',harnesses.owned.session('DOMAIN-CONNECT-FOR-ME',1500,'pi_browser_domain')))).status,200);
const settings={name:'Harbor Roofing',trade:'Roofing',owner:'A. Rivera',phone:'8055550101',email:'office@example.test',license:'',address:'',area:'Oxnard',hours:'',experience:'',hero:'Trusted roofing',intro:'',template:'craft',color:'#10304d',services:[],showOwner:false,showOwnerPhoto:false,showProjects:false};
const tenant={id:'tenant_123',name:'Harbor Roofing',slug:'harbor-roofing',status:'draft',version:1,updated_at:'2026-10-08T12:00:00.000Z',settings,published:null};
const json=(res,value,status=200)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
const mime=path=>({'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'}[extname(path)]||'application/octet-stream');
async function requestBody(req){return JSON.parse(await new Promise(resolve=>{let text='';req.on('data',chunk=>text+=chunk);req.on('end',()=>resolve(text))}));}
const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url,base),scenario=new URL(req.headers.referer||base).searchParams.get('case')||'disconnected';
  if(url.pathname==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(dashboard(false));return;}
  if(url.pathname==='/fake-checkout'){res.writeHead(200,{'content-type':'text/html'});res.end('<title>Local fake checkout</title><h1>Local fake checkout</h1>');return;}
  if(url.pathname.startsWith('/api/')){
    if(url.pathname==='/api/session')return json(res,{user:{id:'browser-owner',email:'owner@example.test',admin:false,staff:false,owner:true},initialized:true});
    if(url.pathname==='/api/tenants')return json(res,{tenants:[tenant]});
    if(url.pathname==='/api/tenants/tenant_123')return json(res,{tenant,role:'owner',photos:[],projects:[],inquiries:[]});
    if(url.pathname==='/api/tenants/tenant_123/readiness')return json(res,{checks:[]});
    if(url.pathname==='/api/tenants/tenant_123/domains')return json(res,{domains:[]});
    const h=harnesses[scenario];
    if(url.pathname==='/api/payments/tenants/tenant_123/add-ons')return json(res,await addOnSummary(h.env,'tenant_123'));
    if(url.pathname==='/api/payments/tenants/tenant_123/add-ons/checkout')return json(res,await requestAddOnCheckout(h.env,'tenant_123',await requestBody(req)));
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
  for(const {scenario,width,height} of ['disconnected','ready','owned'].flatMap(scenario=>[{scenario,width:1440,height:900},{scenario,width:390,height:844}]).filter(view=>viewSelection==='all'||viewSelection==='remaining'&&!(view.scenario==='ready'&&view.width===1440)||viewSelection===view.scenario+'-'+view.width)){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[],external=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==base){external.push(route.request().url());return route.abort();}return route.continue();});
    await mockGameBoard(page,base,tenant);await page.goto(`${base}/?case=${scenario}`);
    if(width===390){await openGameSection(page,'add-ons');}
    else{await openGameSection(page,'add-ons');}
    await page.locator('#bv-addons-title').waitFor();
    assert.equal(await page.locator('nav.tabs [data-section="add-ons"]').count(),1);
    if(scenario==='owned'){
      assert.equal(await page.locator('[data-bv-addon-buy]').count(),0);
      assert.match(await page.locator('.bv-addon-owned-list').innerText(),/Pending/);
    }else{
      assert.match(await page.locator('.bv-addon-price').innerText(),/\$15\.00 one time/);
      const buy=page.locator('[data-bv-addon-buy]');
      assert.equal(await buy.isDisabled(),scenario==='disconnected');
      if(scenario==='disconnected')assert.match(await page.locator('.bv-addons').innerText(),/Payments not connected/);
      else assert.ok((await buy.boundingBox()).width>=160);
    }
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    await page.locator('.bv-addons').scrollIntoViewIfNeeded();
    await page.screenshot({path:resolve(shots,`pay5-${scenario}-${width===390?'mobile':'desktop'}.png`)});
    if(scenario==='ready'){
      const before=checkoutRequests;
      await page.locator('[data-bv-addon-buy]').click();
      await page.waitForURL(base+'/fake-checkout');
      assert.equal(checkoutRequests,before+1);
    }
    await page.close();console.log(`PASS add-on store ${scenario}: ${width}x${height}, no external requests`);
  }
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));for(const h of Object.values(harnesses))h.close();}
