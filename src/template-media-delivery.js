import quality from '../public/media-quality.json' with {type:'json'};
export const templateMedia=quality.assets;
export const mediaByPath=new Map(templateMedia.map(a=>[a.path,a]));
export const hashedMediaPath=a=>'/assets/template-media/'+a.sha256+a.path.slice(a.path.lastIndexOf('.'));
export const mediaByHash=new Map(templateMedia.map(a=>[hashedMediaPath(a),a]));
export function mediaOrigin(value){if(!value)return '';const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error('TEMPLATE_MEDIA_ORIGIN must be an HTTPS origin.');return u.origin;}
// Keep the Worker/static binding fallback working as well as the AWS adapter.
export async function templateAssetResponse(request,env){
 const url=new URL(request.url),entry=mediaByPath.get(url.pathname)||mediaByHash.get(url.pathname),hashed=mediaByHash.has(url.pathname);
 if(!entry)return env.ASSETS.fetch(request);
 const cdn=mediaOrigin(env.TEMPLATE_MEDIA_ORIGIN);
 if(cdn&&url.hostname!=='review.local')return new Response(null,{status:308,headers:{location:cdn+hashedMediaPath(entry),'cache-control':hashed?'public, max-age=31536000, immutable':'public, max-age=300'}});
 if(cdn)return env.ASSETS.fetch(request);
 if(hashed){url.pathname=entry.path;url.search='';request=new Request(url,request);}
 const response=await env.ASSETS.fetch(request);if(!hashed||!response.ok)return response;
 const headers=new Headers(response.headers);headers.set('cache-control','public, max-age=31536000, immutable');return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
// This changes delivery URLs only; content, layout and saved generation choices stay intact.
export function qualityMediaHTML(html){
 let deferred=false;
 html=html.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g,(tag,offset)=>{
  const open=tag.slice(0,tag.indexOf('>')+1),context=html.slice(Math.max(0,offset-250),offset);
  if(!/\bposter="/.test(open)||/data-build-video|data-hero-video|class="[^"]*hero/.test(open)||/data-media-slot="hero"/.test(context))return tag;
  deferred=true;const lazy=tag.replace(/\bposter="([^"]+)"/,'data-media-poster="$1"').replace('<video','<video data-media-deferred="true"');return '<noscript>'+tag+'</noscript>'+lazy;
 });
 html=html.replace(/<img\b[^>]*\bloading="lazy"[^>]*>/g,tag=>{
  if(!/\bsrc="/.test(tag))return tag;deferred=true;
  const source=tag.match(/\ssrc="([^"]+)"/)?.[1],asset=mediaByPath.get(source?.split('?')[0]),w=asset?.width||Number(tag.match(/\bwidth="(\d+)"/)?.[1])||1,h=asset?.height||Number(tag.match(/\bheight="(\d+)"/)?.[1])||1,placeholder='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\''+w+'\' height=\''+h+'\'/%3E';
  const lazy=tag.replace(/\bsrc="([^"]+)"/,'data-media-src="$1" src="'+placeholder+'"').replace(/\bsrcset="([^"]+)"/,'data-media-srcset="$1"').replace('<img','<img data-media-deferred="true"');return '<noscript>'+tag+'</noscript>'+lazy;
 });
 if(deferred)html=html.replace('</head>','<noscript><style>[data-media-deferred]{display:none!important}</style></noscript><script defer src="/media-loading.js"></script></head>');
 html=html.replace(/<img\b[^>]*>/g,tag=>{const url=tag.match(/\ssrc="([^"?]+)(?:\?[^"]*)?"/)?.[1],a=mediaByPath.get(url);if(!a?.hero2880)return tag;if(/\bsrcset="/.test(tag))return tag.replace(/\bsrcset="([^"]+)"/,`srcset="$1, ${a.hero2880} 2880w"`);return tag.replace(/>$/,` srcset="${a.hero2880} 2880w, ${a.path} ${a.width}w" sizes="100vw">`)});
 return html.replace(/\/assets\/[a-zA-Z0-9_./-]+\.(?:webp|avif|png|jpe?g|mp4|webm)\b/g,url=>{const a=mediaByPath.get(url);return a?hashedMediaPath(a):url});
}
