import {neighborhoodMessage,type LocationData} from '../../platform/neighborhood.js';
document.querySelectorAll<HTMLElement>('[data-neighborhood]').forEach(banner=>{
 const form=banner.querySelector<HTMLFormElement>('[data-city-form]')!,input=form.elements.namedItem('city') as HTMLInputElement,heading=banner.querySelector<HTMLElement>('[data-city-heading]')!,description=banner.querySelector<HTMLElement>('[data-city-description]')!,note=banner.querySelector<HTMLElement>('[data-city-note]')!,reviews=banner.querySelector<HTMLAnchorElement>('[data-city-reviews]')!,cta=banner.querySelector<HTMLAnchorElement>('[data-city-cta]')!;
 let data:LocationData|null=null,chosen=false;
 const render=(city:string,manual=false)=>{
  if(!city.trim())return;const content=neighborhoodMessage(data,city,manual);
  heading.textContent=content.heading;description.textContent=content.description;
  cta.textContent='Talk about my project ↗';reviews.hidden=!content.reviewUrl;if(content.reviewUrl)reviews.href=content.reviewUrl;else reviews.removeAttribute('href');
  input.value=city;note.textContent=manual?'Using the project city you chose. Change it at any time.':'Approximate city from your IP address. Not quite right? Choose your project city.';
 };
 form.addEventListener('submit',event=>{event.preventDefault();const city=input.value.trim().slice(0,100);if(!city)return;chosen=true;render(city,true);banner.querySelector('details')!.open=false;});
 banner.querySelector('[data-city-clear]')!.addEventListener('click',()=>{chosen=true;input.value='';heading.textContent='Good work starts close to home.';description.textContent='Tell us where you’re planning your project. Let’s explore what’s possible in your neighborhood.';note.textContent='City cleared. No city choice is saved after you leave this page.';reviews.hidden=true;reviews.removeAttribute('href');});
 fetch('/api/public/'+encodeURIComponent(banner.dataset.slug!)+'/location'+(banner.dataset.preview==='true'?'?preview=1':''),{credentials:'same-origin',signal:AbortSignal.timeout(5000)}).then(async response=>{if(!response.ok)throw Error();data=await response.json();if(chosen){if(input.value)render(input.value,true);return;}if(data?.location?.city)render(data.location.city);else note.textContent='Your city could not be determined automatically. Choose your project city.';}).catch(()=>{if(!chosen)note.textContent='Choose your project city to personalize this section.';});
});
