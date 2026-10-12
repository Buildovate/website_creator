import {originalRows,variantSettings} from './section-variants.mjs';
import {regenerate} from '../../src/generation.js';
export function sampleRoofers(){
 const row=originalRows.find(x=>JSON.parse(x.row.settings).designKit==='roofing').row,existing=[];
 const facts=[['copper-kite','Sample Fictional Copper Kite Roofing','Ventura',[0,1]],['blue-orchard','Sample Fictional Blue Orchard Roofing','Pasadena',[1,2]],['paper-lantern','Sample Fictional Paper Lantern Roofing','Temecula',[2,3]]];
 return facts.map(([key,name,city,indexes],i)=>{const s=variantSettings(row,'current','a',i!==2);delete s.siteStyle;delete s.siteStyleSeed;s.name=name;s.phone=['8055550101','6265550102','9515550103'][i];s.email='';s.area=city;s.serviceAreas=[{city,radiusMiles:null}];s.services=indexes.map(n=>s.services[n]);s.experience='';s.license='';s.hours='';s.showOwner=false;s.showProjects=false;s.effects.projectMap=false;s.platform.promotions={enabled:false,offers:[]};s.platform.financing={requested:false,selection:'none',lenders:[],programs:[]};
 const id='sample-fictional-'+key+'-'+city.toLowerCase(),settings=regenerate(s,id,id,{existing});existing.push({id,settings});return {id,slug:id,isSample:true,fictional:true,city,settings,row:{...row,id,slug:id,name,settings:JSON.stringify(settings),published:JSON.stringify(settings),status:'published'}};
 });
}
