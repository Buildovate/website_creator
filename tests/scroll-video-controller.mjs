import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';

const script=readFileSync('public/hero-timelapse.js','utf8');
const events=()=>{
 const listeners=new Map();
 return {addEventListener(name,fn){const list=listeners.get(name)||[];list.push(fn);listeners.set(name,list);},emit(name){for(const fn of listeners.get(name)||[])fn();}};
};

// A media seek is asynchronous: currentTime changes before the frame decodes.
// Keep those separate so rapid scroll/metadata ordering regressions are caught.
function mount({hero=true,reduced=false,fps=24,headerHeight=0,initialTop=80}={}){
 const styles=new Map(),classes=new Set(),frames=new Map();let serial=0,top=initialTop,duration=NaN,time=0,ready=0,seeking=false,painted=0,loads=0;
 const source={dataset:{src:'/film.mp4'},hasAttribute(){return !!this.src;},...events()};
 const video={...events(),get currentTime(){return time;},set currentTime(v){time=v;seeking=true;},get duration(){return duration;},get readyState(){return ready;},get seeking(){return seeking;},querySelector(){return source;},load(){loads++;},pause(){}};
 const buttons=['01 Your vision.','02 Taking shape.','03 Brought to life.'].map(textContent=>({...events(),textContent,setAttribute(){}}));
 const pause={...events(),setAttribute(){},hidden:true},caption={},counter={},bar={style:{}};
 const scene={getBoundingClientRect(){return {top:hero?Math.max(top,0):top,height:hero?800-headerHeight:420,bottom:top+(hero?800:420)};}};
 const root={dataset:{},matches(){return hero;},style:{setProperty(k,v){styles.set(k,v);}},classList:{add(k){classes.add(k);},remove(k){classes.delete(k);},toggle(k,on){on?classes.add(k):classes.delete(k);}},getBoundingClientRect(){return {top,height:2000,bottom:top+2000};},querySelectorAll(){return buttons;},querySelector(selector){
  if(selector==='.story-stage'||selector==='[data-detail-scene]')return scene;
  if(selector==='[data-build-video]'||selector==='[data-detail-video]')return video;
  if(selector.includes('phase')||selector.includes('caption'))return caption;
  if(selector.includes('counter'))return counter;
  if(selector.includes('progress'))return bar;
  return pause;
 }};
 const reduce={matches:reduced,...events()},page={...events(),hidden:false,querySelector(){return {getBoundingClientRect(){return {height:headerHeight}}}},querySelectorAll(){return [root];}};
 const windowEvents=events();let intersection;
 const context=vm.createContext({document:page,navigator:{},innerHeight:800,scrollY:0,matchMedia(){return reduce;},addEventListener:windowEvents.addEventListener,requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}}});
 vm.runInContext(script,context);
 const flush=()=>{for(let count=0;frames.size&&count<10;count++){const work=[...frames.values()];frames.clear();work.forEach(fn=>fn());}assert.equal(frames.size,0);};
 const settle=()=>{for(let count=0;seeking&&count<10;count++){painted=Math.floor(time*fps)/fps;seeking=false;ready=4;video.emit('seeked');}assert.equal(seeking,false);};
 flush();
 return {root,video,source,pause,buttons,styles,classes,flush,settle,get painted(){return painted;},get loads(){return loads;},
  metadata(value){duration=value;ready=1;video.emit('loadedmetadata');ready=4;video.emit('loadeddata');},
  scroll(nextTop){top=nextTop;context.scrollY=80-nextTop;windowEvents.emit('scroll');flush();},
  visibility(visible){intersection([{isIntersecting:visible}]);flush();}
 };
}

test('each film reaches its actual last frame and returns to its first frame',()=>{
 for(const [duration,fps,lastFrame] of [[12.041667,24,12],[12.033333,30,12],[8,24,7.958333333333333]]){
  const page=mount({fps});page.metadata(duration);page.settle();
  assert.equal(page.video.currentTime,0);
  page.scroll(-600);page.settle();assert.ok(page.video.currentTime>duration*.5&&page.video.currentTime<duration*.7);
  page.scroll(-980);page.settle();assert.equal(page.root.dataset.phase,'1','do not label the work finished before the ending');
  page.scroll(-1008);page.settle();
  assert.equal(page.root.dataset.phase,'2');
  assert.ok(Math.abs(page.painted-lastFrame)<.00001,'the final decodable frame is displayed');
  assert.ok(duration-page.video.currentTime<.002,'no fixed frame-rate rounding or truncated ending');
  page.scroll(-1100);page.settle();assert.equal(page.styles.get('--scene-progress'),'1.0000','ending holds before unpinning');
  page.scroll(80);page.settle();assert.equal(page.video.currentTime,0);assert.equal(page.painted,0);
 }
});

test('fast scrolling out of view during a seek still completes the latest target',()=>{
 const page=mount();page.metadata(12.041667);page.scroll(-500);
 assert.equal(page.video.seeking,true);
 page.visibility(false);page.scroll(-5000);page.settle();
 assert.equal(page.styles.get('--scene-progress'),'1.0000');assert.equal(page.painted,12);
 page.scroll(1000);page.settle();assert.equal(page.video.currentTime,0);
});

test('metadata arriving after the user leaves the scene uses the ending target',()=>{
 const page=mount();assert.equal(page.loads,1);
 page.visibility(false);page.scroll(-5000);page.metadata(12.041667);page.settle();
 assert.equal(page.painted,12);assert.ok(page.classes.has('film-ready'));
});

test('detail scene plays the entire film while the finished scene is still visible',()=>{
 const page=mount({hero:false});page.scroll(560);page.metadata(12.041667);page.settle();
 assert.equal(page.video.currentTime,0);
 page.scroll(352);page.settle();assert.ok(Math.abs(page.video.currentTime-(page.video.duration/2))<.0001);
 page.scroll(144);page.settle();assert.equal(page.painted,12);
 page.scroll(560);page.settle();assert.equal(page.video.currentTime,0);
});

test('pause freezes the scroll target; resume and chapter jumps finish pending seeks',()=>{
 const page=mount();page.metadata(12.041667);page.scroll(-600);page.settle();
 const middle=page.video.currentTime;page.pause.emit('click');page.scroll(-1100);page.settle();assert.equal(page.video.currentTime,middle);
 page.buttons[0].emit('click');page.buttons[2].emit('click');page.settle();assert.equal(page.painted,12);
 page.pause.emit('click');page.flush();page.scroll(80);page.settle();assert.equal(page.video.currentTime,0);
});

test('reduced motion and media errors retain a static finished scene',()=>{
 const reduced=mount({reduced:true});reduced.scroll(-1100);assert.equal(reduced.loads,0);assert.ok(reduced.classes.has('static-story'));assert.equal(reduced.pause.hidden,true);
 const failed=mount();failed.video.emit('error');failed.scroll(-1100);assert.ok(failed.classes.has('static-story'));assert.equal(failed.styles.get('--scene-progress'),'1.0000');assert.equal(failed.pause.hidden,true);
});

test('sticky desktop and mobile headers leave both video endings visible',()=>{
 for(const headerHeight of [96,132,180]){
  const hero=mount({headerHeight});hero.scroll(headerHeight);hero.metadata(12.041667);hero.settle();assert.equal(hero.video.currentTime,0);
  hero.scroll(headerHeight-.84*(2000-(800-headerHeight)));hero.settle();assert.equal(hero.painted,12);hero.scroll(headerHeight);hero.settle();assert.equal(hero.video.currentTime,0);
  const detail=mount({hero:false,headerHeight});const start=Math.max(headerHeight+100,560),end=Math.max(headerHeight+24,144);detail.scroll(start);detail.metadata(12.041667);detail.settle();assert.equal(detail.video.currentTime,0);detail.scroll(end);detail.settle();assert.equal(detail.painted,12);assert.ok(end>=headerHeight&&end+420<=800);
 }
});


test('a deferred source error before loading does not disable a below-fold film',()=>{
 const page=mount({initialTop:3500});assert.equal(page.loads,0);
 page.source.emit('error');assert.ok(!page.classes.has('static-story'));
 page.scroll(400);assert.equal(page.loads,1);page.metadata(12);page.settle();
 page.scroll(-1100);page.settle();assert.ok(page.video.currentTime>11.99);
 page.source.emit('error');assert.ok(page.classes.has('static-story'),'actual loaded-media failures still have a static fallback');
});
