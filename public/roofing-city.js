// Preserve the photograph's reserved geometry even when its request fails.
document.querySelectorAll('.rc-page .core-hero-visual,.rc-page .rc-detail-photo').forEach(figure=>{
 const img=figure.querySelector('img');if(!img)return;
 const failed=()=>{if(figure.classList.contains('rc-photo-failed'))return;figure.classList.add('rc-photo-failed');img.style.visibility='hidden';const message=document.createElement('span');message.className='rc-photo-error';message.setAttribute('role','status');message.textContent='Image unavailable: '+img.alt;figure.append(message)};
 img.addEventListener('error',failed,{once:true});if(img.complete&&!img.naturalWidth)failed();
});
