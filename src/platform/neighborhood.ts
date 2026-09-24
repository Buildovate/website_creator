export interface LocationData {location:{city:string;region:string;country:string;source:string}|null;region:string;country:string;cities:string[];proofs:{city:string;url:string}[]}
export function neighborhoodMessage(data:LocationData|null,city:string,manual=false){
 const match=(a:string,b:string)=>a.trim().toLocaleLowerCase()===b.trim().toLocaleLowerCase();
 const regional=manual||!!data?.country&&!!data?.region&&match(data.country,data.location?.country||'')&&match(data.region,data.location?.region||'');
 const proof=regional?data?.proofs.find(p=>match(p.city,city)):null;
 return {heading:proof?`Neighbors in ${city} Love Us!`:`Hello, ${city}. Let’s make a plan.`,description:proof?'See what local customers have shared, then tell us about your next project.':`Thinking about a project in ${city}? Talk with the team about your ideas and service availability.`,reviewUrl:proof?.url||''};
}
