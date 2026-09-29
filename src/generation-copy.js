import tradeServices from '../public/trade-library.json' with {type:'json'};
import {kits} from './design-kits.js';
import {stableSiteStyleSeed} from './design-styles.js';

// Versioned, authored copy. No provider, free-text prompt, invented claim or render-time choice.
export const COPY_VERSION=1;
const subjects={Roofing:'roof',HVAC:'heating and cooling',Plumbing:'plumbing',Patios:'patio',Electrical:'electrical',Landscaping:'landscape','General Contractors':'building',Flooring:'flooring',Painting:'painting',Fencing:'fence','Garage Doors':'garage door','Pest Control':'pest control','Windows/Doors':'window and door',Solar:'solar',Concrete:'concrete',Pools:'pool',Remodel:'remodeling'};
// Only authored service vocabulary is case-normalized. Unrecognized custom names
// may contain proper nouns and are retained; acronyms and known names stay intact.
const knownServices=new Set(Object.values(tradeServices).flat().map(x=>x.toLowerCase()));
export function sentenceServiceName(value){
 const name=String(value||'');
 if(!knownServices.has(name.toLowerCase()))return name;
 return name.replace(/[A-Za-z][A-Za-z'-]*/g,word=>/^[A-Z]{2,}$/.test(word)||/[a-z][A-Z]/.test(word)||['French','California','Alumawood','Tesla','Trane','Lennox','Carrier'].includes(word)?word:word.toLowerCase());
}
const join=values=>values.length<2?values[0]||'':values.slice(0,-1).join(', ')+' and '+values.at(-1);
export function contractorFacts(s){return {name:s.name||'',trade:s.trade,city:s.serviceAreas?.[0]?.city||'',area:s.area||'',serviceAreas:s.serviceAreas||[],services:(s.services||[]).map(x=>({name:x.name,description:x.description||''})),experience:s.experience||'',license:s.license||'',phone:s.phone||'',offers:s.platform?.promotions?.offers||[],reviews:s.reviews||{},minReviewRating:s.minReviewRating??'all'};}
function context(s){const facts=contractorFacts(s),subject=subjects[s.trade]||s.trade,place=facts.city||facts.area;return {...facts,subject,place,location:place?' in '+place:'',business:facts.name||'this '+s.trade+' business',serviceList:join(facts.services.map(x=>sentenceServiceName(x.name))),firstService:facts.services[0]?.name||s.trade+' projects'};}
const templates={
 hero:[
  f=>({heading:f.firstService+f.location+'.',body:(f.name?f.name+' offers ':'Explore ')+(f.serviceList||f.trade+' project options')+f.location+'. Start with the work your property needs.',action:'Discuss my project'}),
  f=>({heading:'Your '+f.subject+' project starts here.',body:'Talk with '+f.business+' about '+(f.serviceList||'your priorities')+f.location+'. Bring your questions and choose where to begin.',action:'Explore my project options'}),
  f=>({heading:f.firstService+'. A clear starting point.',body:(f.name?f.name+'. ':'')+(f.place?'Serving '+f.place+'. ':'')+'Explore '+(f.serviceList||f.trade+' project options')+' and tell us what matters to you.',action:'Start my project request'})
 ],
 services:[
  f=>({heading:'Choose the '+f.trade+' work you need.',body:'Explore the services offered by '+f.business+'.'}),
  f=>({heading:'Where would you like to begin?',body:((f.serviceList||f.trade+' project options').replace(/^./,c=>c.toUpperCase()))+'. Choose a service to look more closely.'}),
  f=>({heading:'Find your project’s starting point.',body:'Start with the service that fits your property'+f.location+'.'})
 ],
 process:[
  f=>({heading:'Bring your questions. Plan your next step.',body:'Tell us about your '+f.trade+' project. Discuss the scope before deciding how to proceed.'}),
  f=>({heading:'From your priorities to a conversation.',body:'Describe the '+f.subject+' work you have in mind. Use these steps to prepare your questions.'}),
  f=>({heading:'A clearer conversation about the work.',body:'Share your location and '+f.trade+' priorities with '+f.business+'. Talk through what comes next.'})
 ],
 financing:[
  f=>({heading:'Compare the terms for your project.',body:'Use the terms supplied by '+f.business+' to consider how to pay.'}),
  f=>({heading:'Look beyond the monthly payment.',body:'Review the configured terms alongside your written '+f.subject+' project price.'}),
  f=>({heading:'Put your written project price first.',body:'Compare the available terms before choosing how to pay for your '+f.trade+' project.'})
 ],
 reviews:[
  f=>({heading:'Customer perspectives on the work.',body:'Read attributed feedback about '+f.business+' and follow each review to its source.'}),
  f=>({heading:'The experience, in customers’ words.',body:'Explore feedback from the connected review sources for '+f.business+'.'}),
  f=>({heading:'Hear the customer’s perspective.',body:'Read the original feedback and source details for '+f.business+'.'})
 ],
 finalCta:[
  f=>({heading:'Tell us what matters to your property.',body:'Send '+f.business+' your location, the service you need and your questions.',action:'Send my project request'}),
  f=>({heading:'Turn your questions into a project request.',body:'Share the '+f.subject+' work you are considering so '+f.business+' can discuss it with you.',action:'Send my project details'}),
  f=>({heading:'Let’s talk through your next step.',body:'Describe your priorities and the '+f.trade+' service you have in mind.',action:'Request a project conversation'})
 ]};
export const copyCatalog=Object.fromEntries(Object.values(kits).map(kit=>[kit.trade,Object.fromEntries(Object.entries(templates).map(([slot,options])=>[slot,options.map((render,i)=>({id:kit.id+'.'+slot+'.v1.'+String.fromCharCode(97+i),render}))]))]));
export function chooseCopy(s,seed){const f=context(s),catalog=copyCatalog[s.trade];if(!catalog)throw Error('Choose a supported trade before generating.');return Object.fromEntries(Object.entries(catalog).map(([slot,options])=>{const entry=options[stableSiteStyleSeed(seed+':copy:'+slot)%options.length];return [slot,{id:entry.id,...entry.render(f)}]}));}
