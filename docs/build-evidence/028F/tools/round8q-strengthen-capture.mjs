import fs from 'node:fs';
const p='C:/Users/joe/website_creator/docs/build-evidence/028F/tools/round8q-nav-capture.mjs';let s=fs.readFileSync(p,'utf8');
s=s.replace("brand.querySelector('img,.kit-mark')", "brand.querySelector('img,.site-brand-mark')");
s=s.replace("fontsLoaded:document.fonts.status==='loaded'", "fontsLoaded:document.fonts.status==='loaded',nameUnclipped:(()=>{const n=brand.querySelector('.site-brand-name');return !n||!visible(n)||(n.scrollWidth<=n.clientWidth+1&&getComputedStyle(n).textOverflow!=='ellipsis');})(),menuDestinations:[...h.querySelectorAll('.site-mobile-menu a')].map(a=>a.getAttribute('href'))");
s=s.replace("if(record.moreVisible){await page.locator", "if(record.phoneMenu){await page.locator('.site-mobile-menu>summary').focus();await page.keyboard.press('Enter');record.menuOpened=await page.locator('.site-mobile-menu').getAttribute('open')!==null;await page.keyboard.press('Escape');record.menuClosed=await page.locator('.site-mobile-menu').getAttribute('open')===null;}if(record.moreVisible){await page.locator");
fs.writeFileSync(p,s);
