export function mountInquiries(){
 document.querySelectorAll<HTMLFormElement>('#lead-form,[data-lead-form]').forEach(form=>form.onsubmit=async event=>{
  event.preventDefault();
  const base='/s/'+form.dataset.slug;
  if(form.dataset.preview==='true'||new URLSearchParams(location.search).has('preview')||!(location.pathname===base||location.pathname.startsWith(base+'/')))return;
  const button=form.querySelector<HTMLButtonElement>('button')!,status=form.querySelector<HTMLElement>('#lead-status,[data-lead-status]')!;
  button.disabled=true;status.textContent='Saving your request…';
  try{
   const data:Record<string,unknown>=Object.fromEntries(new FormData(form));
   data.consent=(form.elements.namedItem('consent') as HTMLInputElement).checked;data.projectId=form.dataset.project;
   // Send plain notes and separate context; the server validates and formats it.
   data.sourcePage=location.pathname;
   data.projectCity=data.projectCity||data.city||form.dataset.city||'';
   data.service=data.service||form.dataset.service||'';
   const response=await fetch('/api/public/'+form.dataset.slug+'/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),result=await response.json();
   if(!response.ok)throw Error(result.error);form.reset();status.textContent='Your request has been saved for the business to review. For immediate contact, please call.';
  }catch(error){status.textContent=error instanceof Error?error.message:'Request could not be saved. Please call.';}finally{button.disabled=false;}
 });
}
