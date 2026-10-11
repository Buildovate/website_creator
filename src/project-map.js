import {e} from './core.js';
export const hasProjectLocation=p=>typeof p.lat==='number'&&typeof p.lng==='number'&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;
// An empty published portfolio is omitted. A preview gets explicit sample content upstream.
export function emptyProjectMap(){return '';}
// These city centers are the same approximate locations used by the existing demo fixtures.
const cityCenters={oxnard:[34.1975,-119.1771],ventura:[34.2746,-119.229],camarillo:[34.2164,-119.0376]};
export function sampleProjectCities(s){return [...new Set((s.serviceAreas?.length?s.serviceAreas.map(x=>x.city):s.area?[s.area]:['Your service area']).filter(Boolean))].map(city=>({city,lat:cityCenters[city.toLowerCase()]?.[0]??null,lng:cityCenters[city.toLowerCase()]?.[1]??null}));}
// Server-rendered city pins remain usable without JS, tiles or a network connection.
// Unknown city centers use an explicitly schematic guide, never invented coordinates.
export function projectMapSurface(projects,{sample=false}={}){
 if(!projects.length)return '';
 const geographic=projects.every(hasProjectLocation),lats=projects.map(p=>p.lat),lngs=projects.map(p=>p.lng),minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs);
 const positions=projects.map((p,i)=>geographic?{x:20+(p.lng-minLng)/Math.max(.04,maxLng-minLng)*60,y:25+(maxLat-p.lat)/Math.max(.04,maxLat-minLat)*50}:{x:projects.length===1?50:25+(i%2)*50,y:22+Math.floor(i/2)*56/Math.max(1,Math.ceil(projects.length/2)-1)});
 return `<div id="job-map" data-map-sample="${sample}" data-map-geographic="${geographic}" aria-label="${sample?'Sample service-area map':'Approximate project locations'}"><div class="project-map-static"><svg viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true"><rect width="800" height="360" fill="#edf0e7"/><path d="M0 72H800M0 144H800M0 216H800M0 288H800M100 0V360M200 0V360M300 0V360M400 0V360M500 0V360M600 0V360M700 0V360" stroke="#cbd3c4" stroke-width="1"/><path d="M0 360L0 290Q95 277 110 200T190 80L180 0H0Z" fill="#cfdee3" opacity=".45"/></svg><p class="project-map-key">${sample?'<span class="sample-tag">Sample</span> ':''}${geographic?'City-level locations':'Service-area guide · schematic positions'}</p>${projects.map((p,i)=>`<a class="project-map-pin" data-map-pin="${e(p.id)}" data-map-city="${e(p.city)}" href="#project-${e(p.id)}" style="left:${positions[i].x}%;top:${positions[i].y}%"><b aria-hidden="true">${i+1}</b><span>${e(p.city||p.title)}</span></a>`).join('')}<p class="project-map-legend">${sample?'Sample pins show service cities, not completed jobs or customer addresses.':'Select a pin to read the project story. Locations are approximate.'}</p></div></div>`;
}
