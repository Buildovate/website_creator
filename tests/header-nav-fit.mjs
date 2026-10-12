import assert from 'node:assert/strict';
import {captureNav} from '../docs/build-evidence/028F/tools/round8q-nav-capture.mjs';
const result=await captureNav({matrix:true});let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
for(const row of [...result.records,result.resizedBack,...result.matrixRecords]){
 check(row.horizontalOverflow<=1,'No horizontal overflow '+row.width);
 check(row.fontsLoaded,'Real fonts loaded before fit');
 check(row.nameUnclipped,'Full business name never clipped or ellipsized');
 check(row.geometry.overlaps.length===0,'Zero painted-name/control overlap '+JSON.stringify({kit:row.kit,look:row.look,name:row.name||row.nameText,width:row.width,overlaps:row.geometry.overlaps}));
 if(row.width<=720)check(row.phoneMenu,'Phone retains Menu');
 if(row.phoneMenu){check(row.navMode==='menu','Measured minimum fit uses Menu');check(row.all.every(link=>row.menuDestinations.includes(link.href)),'Every desktop destination reachable from Menu');if(row.menuOpened!==undefined){check(row.menuOpened&&row.menuClosed,'Menu keyboard opens and Escape closes');}continue;}
 check(!row.phoneMenu,'Desktop/tablet uses measured nav '+row.width);
 check(row.visible.length+row.overflow.length===row.all.length,'Every link inline or reachable in More');
 check(row.moreVisible===(row.overflow.length>0),'More appears only for overflow');
 check(new Set(row.visible.map(a=>Math.round(a.box.top))).size===1,'Navigation occupies one row');
 check(row.visible.every(a=>a.box.left>=row.brand.right&&a.box.right<=row.nav.right),'Links never overlap brand or leave nav');
 check(row.cta.left>=row.brand.right&&row.cta.right<=row.nav.right+1,'CTA fits beside logo');
 if(row.panelProof)check(row.panelProof.every(link=>link.centerHit&&link.unclipped&&link.inViewport),'More links are fully rendered, readable and clickable');
 if(row.width===1440&&(!row.name||row.name==='Trade QA')){check(!row.moreVisible&&row.overflow.length===0,'All main pages visible at 1440');}
 if(row.moreExpanded){check(row.moreExpanded==='true','More keyboard opens');check(row.escapeClosed&&row.focusReturned,'Escape closes More and returns focus');check(row.openLinks.length===row.overflow.length,'Every overflow link accessible');}
}
check(result.errors.length===0,'Zero browser errors');check(result.matrixRecords.length===1632,'17 trades x 4 Looks x 8 widths x 3 names');
check(result.records.some(row=>row.width===768&&row.nameText==='Sample Fictional Roofing Local'),'Exact reported 768 Roofing fixture covered');
check(result.matrixRecords.some(row=>row.name.length===40),'40-character name covered');
console.log('PASS header nav fit: '+checks+' checks; 8 evidence widths; 1632 trade/Look/name states; painted-name geometry, keyboard and resize');
