const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const [mode,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
 const p=await b.newPage({viewport,hasTouch:mode==='mobile'});await p.goto('http://127.0.0.1:8104/s/motion-bold-industrial-a');console.log(mode,'headline',await p.locator('h1').innerText());
 await p.locator('[data-layer-explode]').evaluate(el=>scrollTo(0,el.offsetTop+300));await p.waitForTimeout(300);console.log(mode,'layer',await p.locator('.mk-layer-stage').evaluate(e=>({height:e.offsetHeight,scrollHeight:e.scrollHeight,top:e.getBoundingClientRect().top,label:getComputedStyle(e.querySelector('h3')).fontSize,overflow:document.documentElement.scrollWidth>innerWidth})));
 await p.screenshot({path:__dirname+'/'+mode+'-inspect.png'});await p.close();
}
await b.close()})().catch(e=>{console.error(e);process.exit(1)});
