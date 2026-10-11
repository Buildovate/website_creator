import {serviceSlug,primaryCity} from './service-registry.js';
import {text,e,must,uid} from './core.js';
export const fieldTypes=['text','textarea','email','tel','number','date','select','radio','checkbox','checkboxes'];
export function cleanFields(input){must(Array.isArray(input)&&input.length<=20,'Use up to 20 custom fields.');const keys=new Set(),labels=new Set();return input.map((f,index)=>{const key=/^field[a-zA-Z0-9_-]{0,60}$/.test(f.key||'')?f.key:'field'+index,label=text(f.label,100),type=fieldTypes.includes(f.type)?f.type:'textarea';must(label,'Every field needs a label.');must(!keys.has(key)&&!labels.has(label.toLowerCase()),'Field keys and labels must be unique.');keys.add(key);labels.add(label.toLowerCase());const options=[...new Set((Array.isArray(f.options)?f.options:[]).map(v=>text(v,150)).filter(Boolean))].slice(0,20);if(['select','radio','checkboxes'].includes(type))must(options.length>=2,'Choice fields need at least two options.');const min=f.min===''||f.min==null?null:Number(f.min),max=f.max===''||f.max==null?null:Number(f.max);must((min===null||Number.isFinite(min))&&(max===null||Number.isFinite(max))&&(min===null||max===null||min<=max),'Choose valid numeric limits.');return {key,label,type,options,required:f.required===true,placeholder:text(f.placeholder,200),help:text(f.help,300),min,max}})}
export function fieldMarkup(f){const type=f.type||'textarea',required=f.required?'required':'',id='input-'+f.key,help=f.help?`<small id="help-${e(f.key)}">${e(f.help)}</small>`:'',attrs=`id="${e(id)}" name="${e(f.key)}" ${required} ${f.help?'aria-describedby="help-'+e(f.key)+'"':''}`,label=e(f.label)+(f.required?' *':'');let control;if(['radio','checkboxes'].includes(type))return `<fieldset class="custom-choice" ${f.help?'aria-describedby="help-'+e(f.key)+'"':''}><legend>${label}</legend>${f.options.map((v,i)=>`<label class="check"><input name="${e(f.key)}" type="${type==='radio'?'radio':'checkbox'}" value="${e(v)}" ${type==='radio'?required:''} ${type==='checkboxes'&&f.required?'data-group-required="true"':''}>${e(v)}</label>`).join('')}${help}</fieldset>`;if(type==='checkbox')return `<label class="check"><input ${attrs} type="checkbox" value="yes">${label}</label>${help}`;if(type==='select')control=`<select ${attrs}><option value="">Choose an option</option>${f.options.map(v=>`<option>${e(v)}</option>`).join('')}</select>`;else if(type==='textarea')control=`<textarea ${attrs} rows="3" maxlength="3000" placeholder="${e(f.placeholder||'')}"></textarea>`;else control=`<input ${attrs} type="${type}" ${type==='number'?`step="any" ${f.min!=null?'min="'+f.min+'"':''} ${f.max!=null?'max="'+f.max+'"':''}`:'maxlength="3000"'} placeholder="${e(f.placeholder||'')}">`;return `<label for="${e(id)}">${label}${control}${help}</label>`}
export function fieldAnswers(fields,values){const answers=Object.create(null);for(const f of fields){const type=f.type||'textarea',raw=values[f.key];let value;if(type==='checkboxes'){must(raw==null||Array.isArray(raw),'Choose valid options for '+f.label);value=[...new Set(raw||[])];must(value.every(x=>f.options.includes(x)),'Invalid selection for '+f.label);must(!f.required||value.length,f.label+' is required.')}else if(type==='checkbox'){must(raw==null||raw===''||raw==='yes'||typeof raw==='boolean','Invalid checkbox value.');value=raw==='yes'||raw===true;must(!f.required||value,f.label+' is required.')}else{must(raw==null||typeof raw==='string'||(type==='number'&&typeof raw==='number'),'Invalid value for '+f.label);value=text(raw==null?'':String(raw),3000);must(!f.required||value,f.label+' is required.');if(value){if(type==='email')must(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),'Enter a valid '+f.label);if(type==='tel')must(value.replace(/\D/g,'').length>=7,'Enter a valid '+f.label);if(type==='number'){const n=Number(value);must(Number.isFinite(n)&&(f.min==null||n>=f.min)&&(f.max==null||n<=f.max),'Enter a valid number for '+f.label)}if(type==='date')must(/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value,'Enter a valid date for '+f.label);if(['select','radio'].includes(type))must(f.options.includes(value),'Invalid selection for '+f.label)}}answers[f.label]=value}return answers}

// Context is visitor-supplied attribution, not authorization or marketing consent.
// Keep it in the existing inquiry message so every inbox/export receives it.
export function inquiryMessage(values,{slug,origin,settings,project=null,referer=''}) {
 const field=(key,max=120)=>{must(values[key]==null||typeof values[key]==='string','Invalid inquiry context.');return text(values[key],max).replace(/[\u0000-\u001f\u007f]+/g,' ').replace(/\s+/g,' ').trim()};
 const base='/s/'+slug;
 function source(value){
  must(typeof value==='string'&&value.length<=2048,'Invalid source page.');
  let page;try{page=new URL(value,origin)}catch{must(false,'Invalid source page.')}
  must(page.origin===origin&&!page.username&&!page.password&&(page.pathname===base||page.pathname.startsWith(base+'/')),'Source page does not belong to this website.',400);
  must(!page.searchParams.has('preview'),'Preview forms cannot accept submissions.',403);
  must(page.pathname.length<=400,'Source page is too long.');return page.pathname.replace(/\/$/,'');
 }
 if(referer)source(referer);
 must(values.sourcePage==null||typeof values.sourcePage==='string','Invalid source page.');
 const path=source(values.sourcePage||referer||base);
 const serviceRoute=path.slice(base.length).match(/^\/services\/([a-z][a-z0-9-]*)$/);
 const cityRoute=path.slice(base.length).match(/^\/areas\/([a-z][a-z0-9-]*)$/);
 const projectRoute=path.slice(base.length).match(/^\/projects\/([^/]+)$/);
 const pages=settings.websitePages?.pages||[];
 let service=field('service'),city=field('projectCity',100)||field('city',100);
 if(serviceRoute){
  const page=pages.find(p=>p.kind==='service'&&p.enabled&&p.slug===serviceRoute[1]&&(settings.services||[]).some(s=>s.name===p.serviceName));
  must(page,'Service unavailable.',404);must(!service||service===page.serviceName,'Service does not match this page.');service=page.serviceName;
 }
 if(cityRoute){const page=pages.find(p=>p.kind==='city'&&p.enabled&&p.slug===cityRoute[1]),configured=(settings.serviceAreas?.length?settings.serviceAreas:[{city:primaryCity(settings)}]).find(a=>a.city&&serviceSlug(a.city)===cityRoute[1]);must(page||configured,'City unavailable.',404);city=city||(configured?.city||page.city);}
 if(projectRoute)must(project&&project.id===projectRoute[1],'Project unavailable.',404);
 if(project){const published=JSON.parse(project.published);service=service||published.service||'';city=city||published.city||'';}
 const lines=[service&&'Service: '+service,city&&'Project city: '+city,'Source page: '+path];
 for(const [key,label,max] of [['roofType','Roof type',120],['size','Project size (sq ft)',40],['zip','ZIP',20],['timeframe','Preferred timing',120],['promotionCode','Unlocked promotion',120]]){const v=field(key,max);if(v)lines.push(label+': '+v)}
 if(values.financingInterest===true||values.financingInterest==='on'){
  lines.push('Interested in financing');
  if(field('financingPlan'))lines.push('Financing preference: '+field('financingPlan')+' ['+field('financingPlanId')+'] / approximately $'+field('financingMonthly',40)+'/mo / project $'+field('financingAmount',40)+' / down $'+field('financingDown',40)+' / '+field('financingTerms',200));
 }
 must(values.message==null||typeof values.message==='string','Invalid project notes.');
 const context=lines.filter(Boolean).join('\n'),notes=text(values.message,3000);
 return context+(notes?'\n\n'+notes.slice(0,Math.max(0,3000-context.length-2)):'');
}
