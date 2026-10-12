import art from '../public/service-art.json' with {type:'json'};
import catalog from './installed-page-images.json' with {type:'json'};
import {e} from './core.js';
const byUrl=new Map(Object.entries(catalog).flatMap(([trade,items])=>items.map(item=>[item.url,{...item,trade}])));
// A composite hero/craft layer is one visual, not a second content photograph.
const protectedLayer=tag=>/class="[^"]*(?:story-|detail-|hero-|mk-compare)/.test(tag)||/data-(?:hero|planning|ambient)/.test(tag);
export function uniquePageImages(html){
 const tags=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
 const src=tag=>tag.match(/\bsrc="([^"]+)"/)?.[1];
 const key=url=>byUrl.get(url)?.sha256||url;
 const reserved=new Set(tags.map(tag=>key(src(tag)))),used=new Set();
 return html.replace(/<img\b[^>]*>/g,tag=>{
  const url=src(tag),entry=byUrl.get(url);if(!entry)return tag;if(protectedLayer(tag)){used.add(key(url));return tag;}
  const id=key(url);if(!used.has(id)){used.add(id);return tag;}
  const candidates=catalog[entry.trade],next=candidates.find(x=>x.service===entry.service&&!reserved.has(x.sha256)&&!used.has(x.sha256))||candidates.find(x=>!reserved.has(x.sha256)&&!used.has(x.sha256));
  if(!next)return tag;used.add(next.sha256);reserved.add(next.sha256);
  return tag.replace('src="'+url+'"','src="'+next.url+'"').replace(/ srcset="[^"]*"/,'').replace(/alt="[^"]*"/,'alt="'+e(next.service+' — '+(next.slot==='process'?'work detail':next.slot==='scope'?'materials and details':'property detail'))+'"');
 });
}

export function homeTileImage(trade,name){return trade==='Roofing'&&name.toLowerCase()==='roof installation'?'/assets/service-showpiece/roofing-roof-installation-process.webp':art[trade]?.[name.toLowerCase()]||'';}
