import assert from 'node:assert/strict';
import vm from 'node:vm';
import {build} from 'esbuild';
const compiled=await build({entryPoints:['src/client/site/constitution.ts'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022'});
const events=()=>{const handlers={};return {addEventListener(name,fn){(handlers[name]||=[]).push(fn);},emit(name){for(const fn of handlers[name]||[])fn();}};};
function mount(reduced=false){
 let top=0,duration=NaN,time=0,seeking=false,loads=0,serial=0,intersection;const frames=new Map(),styles=new Map(),media={matches:reduced,...events()};
 const video={...events(),dataset:{src:'/film.mp4'},getAttribute(name){return this[name]||null;},get duration(){return duration;},get currentTime(){return time;},set currentTime(v){time=v;seeking=true;},get seeking(){return seeking;},load(){loads++;},pause(){}};
 const button={...events(),setAttribute(){},disabled:false},chapters=[0,1,2].map(()=>({toggleAttribute(){}}));
 const section={style:{setProperty(k,v){styles.set(k,v);}},getBoundingClientRect(){return {top,height:1800};},querySelector(selector){return selector==='[data-story-film]'?video:button;},querySelectorAll(){return chapters;}};
 const win={innerHeight:800,matchMedia(){return media;},...events()};
 const context={window:win,document:{body:{classList:{add(){}}},querySelector(selector){return selector==='[data-planning-page]'?null:{getBoundingClientRect(){return {height:100};}};},querySelectorAll(selector){return selector==='[data-project-story]'?[section]:[];}},requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},IntersectionObserver:class{constructor(fn){this.fn=fn;}observe(el){if(el===section)intersection=this.fn;}}};context.window.IntersectionObserver=context.IntersectionObserver;
 vm.runInNewContext(compiled.outputFiles[0].text,context);
 const flush=()=>{const todo=[...frames.values()];frames.clear();todo.forEach(fn=>fn());};
 const settle=()=>{for(let n=0;seeking&&n<5;n++){seeking=false;video.emit('seeked');}assert.equal(seeking,false);};
 return {video,button,styles,get loads(){return loads;},show(value){intersection([{isIntersecting:value}]);flush();},metadata(value){duration=value;video.emit('loadedmetadata');flush();settle();},scroll(value){top=value;win.emit('scroll');flush();},settle,toggle(){button.emit('click');flush();settle();},reduce(value){media.matches=value;media.emit('change');flush();settle();}};
}
for(const duration of [12.041667,12.033333,8]){
 const page=mount();assert.equal(page.loads,0);page.show(true);assert.equal(page.loads,1);page.scroll(100);page.metadata(duration);assert.equal(page.video.currentTime,0);
 page.scroll(-370);page.settle();assert.ok(page.video.currentTime>duration*.4&&page.video.currentTime<duration*.6);
 const middle=page.video.currentTime;page.toggle();page.scroll(-1100);page.settle();assert.equal(page.video.currentTime,middle,'pause freezes the displayed frame');page.toggle();assert.ok(duration-page.video.currentTime<.002,'ending is not truncated by a guessed frame rate');assert.equal(page.styles.get('--story-progress'),'1');
 page.scroll(100);page.settle();assert.equal(page.video.currentTime,0,'reverse scrolling returns to first frame');
 page.scroll(-200);page.show(false);page.scroll(-5000);page.settle();assert.ok(duration-page.video.currentTime<.002,'rapid exit finishes the latest seek');
 page.reduce(true);const before=page.video.currentTime;page.scroll(100);page.settle();assert.equal(page.video.currentTime,before);assert.equal(page.button.disabled,true);
}
const late=mount();late.show(true);late.scroll(-5000);late.show(false);late.metadata(12);assert.ok(late.video.currentTime>11.99,'late metadata resolves to the current scroll target');
const reduced=mount(true);reduced.show(true);reduced.scroll(-800);assert.equal(reduced.loads,0,'reduced motion does not download the film');
console.log('PASS full-duration scrubbing, reverse scroll, async seeks, pause/resume, late metadata and reduced motion');
