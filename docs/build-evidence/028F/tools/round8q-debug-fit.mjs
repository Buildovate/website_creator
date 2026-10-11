import fs from 'node:fs';
const p='C:/Users/joe/website_creator/docs/build-evidence/028F/tools/round8q-nav-capture.mjs';
let s=fs.readFileSync(p,'utf8');s=s.replace("navMode:h.dataset.navMode||null", "debug:{fullWidth:h.style.getPropertyValue('--site-brand-full-width'),header:getComputedStyle(h).columnGap,brandFlex:getComputedStyle(brand).flex,navWidth:nav.clientWidth,navPadding:getComputedStyle(nav).padding,navBoxSizing:getComputedStyle(nav).boxSizing,navGap:getComputedStyle(nav).columnGap,visibleLinks:nav.dataset.visibleLinks},navMode:h.dataset.navMode||null");fs.writeFileSync(p,s);
