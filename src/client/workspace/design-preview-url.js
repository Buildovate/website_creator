// Keep the current library page when the composer changes its ingredients.
// Other kits/origins start at home; only known project selection is retained.
export function designPreviewUrl({kit,layout,params,currentUrl='',origin}){
 const query=new URLSearchParams(params),root='/design-preview/'+kit+'/';let path='',hash='';
 try{
  const current=new URL(currentUrl,origin);
  if(current.origin===origin&&current.pathname.startsWith(root)){
   const match=current.pathname.slice(root.length).match(/^(?:immersive|editorial|studio)(\/.*)?$/);
   if(match){path=match[1]||'';hash=current.hash;const project=current.searchParams.get('project');if(/^example-[0-2]$/.test(project||''))query.set('project',project)}
  }
 }catch{/* First render or a frame that has not loaded yet. */}
 return root+layout+path+(query.size?'?'+query.toString():'')+hash;
}
