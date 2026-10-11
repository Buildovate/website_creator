import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync('public/scroll-story.js','utf8');
const events=()=>{const map=new Map();return {addEventListener(k,fn){map.set(k,fn);},emit(k){map.get(k)?.();}};};
function mount(reduced=false){
 let top=0,time=0,seeking=false,loaded=0;
 const classList={add(){},remove(){},toggle(){}},source={dataset:{src:'/example.mp4'},hasAttribute(){return !!this.src;}};
 const video={...events(),classList,duration:12.041667,readyState:4,pause(){},load(){loaded++;},get seeking(){return seeking;},get currentTime(){return time;},set currentTime(v){time=v;seeking=true;},querySelector(){return source;}};
 const scenes=Array.from({length:5},()=>({classList})),buttons=Array.from({length:5},()=>({...events(),setAttribute(){}})),pause={setAttribute(){}};
 const root={dataset:{},offsetHeight:2000,getBoundingClientRect(){return {top};},querySelectorAll(s){return s==='[data-story-select]'?buttons:scenes;},querySelector(s){return s==='.story-stage'?{offsetHeight:800}:s==='.story-motion'?pause:s==='[data-hero-video]'?video:null;}};
 const listeners=events(),reduce={...events(),matches:reduced};let observe;
 const frames=[],context=vm.createContext({document:{...events(),querySelector(){return root;}},navigator:{},scrollY:0,matchMedia(){return reduce;},addEventListener:listeners.addEventListener,requestAnimationFrame(fn){frames.push(fn);return frames.length;},IntersectionObserver:class{constructor(fn){observe=fn;}observe(){}}});
 vm.runInContext(code,context);
 const settle=()=>{for(let i=0;seeking&&i<10;i++){seeking=false;video.emit('seeked');}assert.equal(seeking,false);};
 return {video,buttons,get loaded(){return loaded;},scroll(value){top=value;context.scrollY=-value;listeners.emit('scroll');while(frames.length)frames.shift()();},settle,observe(v){observe([{isIntersecting:v}]);}};
}
const p=mount();p.observe(true);p.settle();assert.equal(p.video.currentTime,0);
p.scroll(-500);p.settle();assert.ok(p.video.currentTime>0&&p.video.currentTime<12);
p.scroll(-1010);p.settle();assert.ok(p.video.duration-p.video.currentTime<.002);
p.scroll(-600);p.scroll(-5000);p.observe(false);p.settle();assert.ok(p.video.duration-p.video.currentTime<.002);
p.observe(true);p.scroll(0);p.settle();assert.equal(p.video.currentTime,0);
p.buttons[4].emit('click');p.settle();assert.ok(p.video.duration-p.video.currentTime<.002);
const reduced=mount(true);reduced.observe(true);reduced.scroll(-5000);assert.equal(reduced.loaded,0);
console.log('PASS: optional cinematic hero video reaches both endpoints, handles a pending seek and honors reduced motion.');
