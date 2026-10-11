document.querySelectorAll('.cutaway').forEach(section=>{
 const select=index=>{
  section.querySelectorAll('[data-hotspot]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.hotspot)===index)));
  section.querySelectorAll('[data-layer]').forEach(layer=>layer.classList.toggle('active',Number(layer.dataset.layer)===index));
  const label=section.querySelector('.cutaway-notes [data-hotspot="'+index+'"] b');
  const status=section.querySelector('[data-cutaway-status]');if(label&&status)status.textContent=label.textContent+' selected.';
 };
 section.addEventListener('click',event=>{const button=event.target.closest('[data-hotspot]');if(button)select(Number(button.dataset.hotspot));});
});
