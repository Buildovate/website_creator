const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base='http://127.0.0.1:8104',out='docs/build-evidence/010A';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),report={fixture:'Fictional QA reviews via mocked Google/Yelp responses; no live account validation',viewports:[],checks:[]};
 async function align(page){await page.evaluate(()=>{const section=document.querySelector('#customer-reviews'),header=document.querySelector('.cx-header');scrollTo(0,section.getBoundingClientRect().top+scrollY-(header?.getBoundingClientRect().height||0));});await page.waitForTimeout(150);}
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  await page.goto(base+'/s/proof-full');await page.locator('#customer-reviews').scrollIntoViewIfNeeded();await page.waitForSelector('.source-review-card');await page.evaluate(()=>document.fonts.ready);await align(page);
  assert.equal(await page.locator('#customer-reviews .customer-graphic').count(),0);
  assert.equal(await page.locator('.source-review-card').count(),2);
  assert.equal(await page.locator('.provider-reviews').count(),2);
  assert.match(await page.locator('.aggregate-rating').first().textContent(),/3\.8 \/ 5 · 40 reviews/);
  assert.match(await page.locator('.source-review-grid').textContent(),/Alex · fictional reviewer/);
  assert.ok(!(await page.locator('#customer-reviews').textContent()).includes('FILTERED_QA_REVIEW'));
  assert.equal(await page.locator('.source-review-card .review-original').count(),2);
  assert.equal(await page.locator('.source-review-card .review-stars').first().getAttribute('aria-label'),'5 out of 5 stars');
  assert.equal(await page.locator('.review-source-links a').count(),2);
  assert.equal(await page.locator('.source-review-grid .review-loop-copy').count(),0);
  const dimensions=await page.evaluate(()=>{
   const section=document.querySelector('#customer-reviews'),heading=section.querySelector('h2'),subtitle=section.querySelector('.review-subtitle'),header=document.querySelector('.cx-header').getBoundingClientRect(),sticky=document.querySelector('.cx-mobile-action'),stickyTop=sticky&&getComputedStyle(sticky).display!=='none'?sticky.getBoundingClientRect().top:innerHeight;
   return {headingFont:getComputedStyle(heading).fontFamily,subtitleGap:subtitle.getBoundingClientRect().top-heading.getBoundingClientRect().bottom,headerBottom:header.bottom,usableBottom:Math.min(innerHeight,stickyTop),cards:[...document.querySelectorAll('.source-review-card')].map(card=>({top:card.getBoundingClientRect().top,bottom:card.getBoundingClientRect().bottom,stars:!!card.querySelector('.review-stars'),quote:card.querySelector('blockquote').textContent,author:card.querySelector('.review-author').textContent,source:card.querySelector('.review-original').href})),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.match(dimensions.headingFont,/TradeDisplay/);assert.ok(dimensions.subtitleGap>=16,'Subtitle needs visible breathing room');assert.equal(dimensions.overflow,false);
  assert.ok(dimensions.cards[0].top>=dimensions.headerBottom,'Card clears sticky header');
  assert.ok(dimensions.cards[0].bottom<=dimensions.usableBottom,'Entire first card including source must fit in first section screen');
  if(name==='desktop')assert.ok(dimensions.cards.every(c=>c.bottom<=dimensions.usableBottom));
  await page.screenshot({path:`${out}/${name}-reviews.png`});await page.locator('#customer-reviews').screenshot({path:`${out}/${name}-reviews-section.png`});
  // Source and provider policy links remain real, unchanged anchors; do not navigate externally.
  assert.match(await page.locator('.review-original').first().getAttribute('href'),/^https:\/\/www\.google\.com\/maps\?cid=1234$/);
  assert.equal(await page.locator('.review-provider-notes a[href="https://example.test/privacy"]').count(),1);
  await page.locator('[data-load-reviews]').click();await page.waitForFunction(()=>!document.querySelector('[data-load-reviews]').disabled);assert.equal(await page.locator('.source-review-card').count(),2);
  await page.emulateMedia({reducedMotion:'reduce'});await align(page);assert.equal(await page.locator('.source-review-grid .review-loop-copy').count(),0);
  await page.goto(base+'/s/proof-fallback');await page.locator('#customer-reviews').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-review-status]').textContent.includes('directly'));await align(page);assert.equal(await page.locator('.source-review-card,.aggregate-rating,.review-stars').count(),0);assert.equal(await page.locator('.review-source-links a').count(),2);await page.screenshot({path:`${out}/${name}-reviews-unconnected.png`});
  await page.goto(base+'/s/proof-empty');assert.equal(await page.locator('#customer-reviews').count(),0);
  await page.goto(base+'/s/proof-full/services/roof-repair');await page.waitForSelector('.source-review-card');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,document.querySelector('[data-service-reviews]').getBoundingClientRect().top+scrollY-document.querySelector('.tp-header').getBoundingClientRect().height));
  const service=await page.locator('.source-review-card').first().evaluate(e=>({color:getComputedStyle(e).color,display:getComputedStyle(e).display,background:getComputedStyle(e).backgroundColor,visible:e.getBoundingClientRect().width>0,bottom:e.getBoundingClientRect().bottom}));assert.equal(service.visible,true);assert.equal(service.display,'flex','Shared review styles must be loaded on the service route');assert.notEqual(service.color,'rgb(23, 43, 43)','Service cards need light text on the dark surface');assert.ok(service.bottom<=height,'First service review must fit in the section screen');assert.equal(await page.locator('.source-review-card').count(),2);assert.equal(await page.locator('.tm-review-copy,.tm-review-toggle').count(),0);await page.screenshot({path:`${out}/${name}-service-reviews.png`});
  await page.goto(base+'/s/proof-fallback/services/roof-repair');await page.waitForFunction(()=>!document.querySelector('[data-load-reviews]').disabled);assert.equal(await page.locator('[data-service-reviews]').isVisible(),false);
  assert.deepEqual(errors,[]);report.viewports.push({name,width,height,...dimensions});console.log(`PASS ${name}: full first card visible (bottom ${dimensions.cards[0].bottom.toFixed(0)} < ${dimensions.usableBottom.toFixed(0)}), stars/quote/name/source, display font, subtitle spacing, source aggregate and policies, refresh, reduced motion, no-key links, no invented reviews, no overflow/errors`);await page.close();
 }
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(base+'/s/proof-full');assert.equal(await nojs.locator('.review-source-links a').count(),2);assert.equal(await nojs.locator('.source-review-card').count(),0);await nojs.close();
 const failed=await browser.newPage({viewport:{width:390,height:844}});await failed.route('**/api/public/*/reviews',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'QA outage'})}));await failed.goto(base+'/s/proof-full');await failed.locator('#customer-reviews').scrollIntoViewIfNeeded();await failed.waitForFunction(()=>document.querySelector('[data-review-status]').textContent.includes('temporarily unavailable'));assert.equal(await failed.locator('.source-review-card,.aggregate-rating').count(),0);assert.equal(await failed.locator('.review-source-links a').count(),2);await failed.close();
 const long=await browser.newPage({viewport:{width:360,height:780}});
 await long.route('**/api/public/*/reviews',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({minimum:4,providers:[{provider:'Google Maps',url:'https://www.google.com/maps?cid=1234',rating:3.8,count:40,reviews:[{rating:5,author:'Alex · fictional reviewer',text:'QA sample: '+Array(50).fill('communication').join(' '),url:'https://www.google.com/maps?cid=1234'}]}]})}));
 await long.goto(base+'/s/proof-full');await long.locator('#customer-reviews').scrollIntoViewIfNeeded();await long.waitForSelector('.source-review-card');await long.evaluate(()=>document.fonts.ready);await align(long);
 assert.ok((await long.locator('blockquote').textContent()).endsWith('…'));
 assert.ok(await long.locator('.source-review-card').evaluate(card=>card.getBoundingClientRect().bottom<=document.querySelector('.cx-mobile-action').getBoundingClientRect().top),'A long quote must still leave author/source in the first small-mobile screen');await long.screenshot({path:out+'/small-mobile-long-quote.png'});await long.close();
 report.checks=['normal and reduced motion','first-screen complete source card at both viewports','360px mobile long-quote first-screen check','shared service-page contrast and empty hiding','no API keys: links only','API failure: links only','no JavaScript: source links preserved','provider aggregates unchanged by filtering','privacy/terms/source attribution retained'];
 fs.writeFileSync(out+'/browser-results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS API outage and no-JavaScript source-link fallbacks');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
