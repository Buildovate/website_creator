// The saved service list is the public selection; retain existing copy and ordering.
export interface ServiceChoice {name:string;description?:string}
export function serviceOptions(current:ServiceChoice[],library:string[]) {
 const names=new Map<string,string>();
 for(const name of [...current.map(s=>s.name),...library])if(name.trim()&&!names.has(name.trim().toLowerCase()))names.set(name.trim().toLowerCase(),name.trim());
 return [...names.values()];
}
export function selectServices(current:ServiceChoice[],names:string[]) {
 const selected=serviceOptions([],names);
 if(!selected.length)throw Error('Select at least one service your business offers.');
 if(selected.length>24)throw Error('Choose up to 24 services.');
 return selected.map(name=>current.find(s=>s.name.trim().toLowerCase()===name.toLowerCase())||{name,description:''});
}
