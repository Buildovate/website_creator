// Only existing form fields, copied verbatim from confirmed saved tenant settings.
const basics=[['name','Business name'],['owner','Owner name'],['phone','Phone'],['email','Email'],['address','Business address'],['hours','Business hours'],['hero','Homepage headline'],['intro','Business introduction']];
export function savedSuggestions(settings,form){
 if(!['business','questionnaire'].includes(form))throw new TypeError('Choose an existing Business or Questionnaire form.');
 const confirmed=settings.platform?.questionnaire?.factsConfirmed===true;
 const mappings=basics.map(([field,label])=>({field,label,path:field}));
 if(form==='questionnaire')mappings.push({field:'conversion-headline',label:'Reference experience headline',path:'hero'},{field:'conversion-intro',label:'Reference experience introduction',path:'intro'});
 return {form,confirmed,items:mappings.map(m=>({...m,value:confirmed&&typeof settings[m.path]==='string'?settings[m.path]:'',source:'Confirmed saved business details · '+m.path,state:confirmed&&typeof settings[m.path]==='string'&&settings[m.path].trim()?'found':'not_found'})),connections:['Google Places','Yelp','Old website lookup','AI writing'].map(name=>({name,state:'not_connected',reason:'Not connected to Game autofill. This round uses your saved details only.'}))};
}
export function planAutofill(items,values,dirty=[]){
 const touched=new Set(dirty);
 return items.filter(item=>Object.hasOwn(values,item.field)).map(item=>({...item,status:touched.has(item.field)||String(values[item.field]??'').trim()?'kept':item.state==='found'?'found':'not_found'}));
}
export function undoAutofill(values,patches){
 const result={...values},restored=[],kept=[];
 for(const p of patches){if(result[p.field]===p.after){result[p.field]=p.before;restored.push(p.field);}else kept.push(p.field);}
 return {values:result,restored,kept};
}
