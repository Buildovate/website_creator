import assert from 'node:assert/strict';
import {evaluateProgress} from '../../src/blueprint/progress.js';
import {questSections} from '../../src/client/workspace/game/sections.js';
export async function openGameSection(page,id){
 const shell=page.locator('.bv-game-section-shell');
 if(await shell.isVisible())await page.locator('[data-game-back]').click();
 await page.locator('.bv-game').waitFor({state:'visible'});
 const skip=page.getByRole('button',{name:'Skip tour',exact:true});if(await skip.isVisible())await skip.click();
 const quest=Object.entries(questSections).find(([,ids])=>ids.includes(id))?.[0];assert.ok(quest,'Existing Game section: '+id);
 if(page.viewportSize().width<=720){await page.locator('[data-game-phone=settings]').click();await page.locator('[data-game-setting="'+id+'"][data-game-setting-quest="'+quest+'"]').click();}
 else{await page.locator('[data-game-quest="'+quest+'"]').click();await page.locator('#bv-game-quest [data-game-open="'+id+'"]').click();}
 await shell.waitFor({state:'visible'});
 await page.waitForFunction(id=>document.querySelector('nav[aria-label="Website settings"] [data-section="'+id+'"]')?.classList.contains('selected'),id);
 await page.locator('[data-game-section-status]').filter({hasText:'Opening'}).waitFor({state:'hidden'});
}
// Pay's browser tests use an intentionally local HTTP fixture, not the server.
// Supply Game's read-only presentation contract without awarding any progress.
export async function mockGameBoard(page,base,tenant){
 await page.route(base+'/api/game/'+tenant.id,route=>route.fulfill({contentType:'application/json',body:JSON.stringify({tenant:{id:tenant.id,name:tenant.name},role:'owner',view:'game',progress:evaluateProgress({})})}));
 await page.route(base+'/api/game/'+tenant.id+'/experience',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({showTour:false,completedLevels:[],newBadges:[]})}));
}
