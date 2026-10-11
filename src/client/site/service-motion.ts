// Enhance images only. Navigation and all service content remain native HTML.
export function mountServiceMotion(root:ParentNode=document){
 root.querySelectorAll<HTMLElement>('[data-service-motion]').forEach(card=>{
  if(card.dataset.smMounted)return;card.dataset.smMounted='true';
  const images=[...card.querySelectorAll<HTMLImageElement>('.sm-visual img')],visual=card.querySelector<HTMLElement>('.sm-visual');if(!visual||!images.length)return;
  let failed=false;const unavailable=()=>{failed=true;card.classList.remove('sm-ready');visual.dataset.imageState=images[0].complete&&images[0].naturalWidth?'partial':'unavailable';};
  const ready=(img:HTMLImageElement)=>new Promise<void>((resolve,reject)=>{const loaded=()=>{if(!img.naturalWidth){reject();return}img.decode().then(resolve,reject)};if(img.complete)loaded();else{img.addEventListener('load',loaded,{once:true});img.addEventListener('error',()=>reject(),{once:true})}});
  const loads=images.map(ready);Promise.all(loads).then(()=>{if(failed||!card.isConnected)return;visual.dataset.imageState='ready';card.classList.add('sm-ready')},()=>{void Promise.allSettled(loads).then(unavailable)});
 });
}
mountServiceMotion();
