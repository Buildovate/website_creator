// Shared contractor-website journey settings. No business facts are generated here.
export const JOURNEYS = {
  'roof-repair': {trade:'Roofing', kit:'roofing', name:'Roof repair', intent:'Get help with a roof concern', layout:'studio'},
  'hvac-replacement': {trade:'HVAC', kit:'hvac', name:'HVAC replacement', intent:'Compare a considered replacement', layout:'immersive'},
  'patio-design': {trade:'Patios', kit:'patios', name:'Patio design', intent:'Plan an outdoor transformation', layout:'editorial'},
} as const;
export type Journey = 'standard' | keyof typeof JOURNEYS;
export function cleanJourney(value:unknown, trade:string):Journey {
  if(value == null || value === '' || value === 'standard') return 'standard';
  if(typeof value !== 'string' || !(value in JOURNEYS) || JOURNEYS[value as keyof typeof JOURNEYS].trade !== trade) throw new Error('Choose a customer journey that matches this trade.');
  return value as Journey;
}
export function cleanConversionBrief(value:unknown = {}) {
  const v=value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string,unknown> : {};
  const text=(key:string,max:number)=>typeof v[key]==='string'?(v[key] as string).trim().slice(0,max):'';
  return {audience:text('audience',250),problem:text('problem',500),traffic:['mixed','search','advertising','referral'].includes(String(v.traffic))?String(v.traffic):'mixed',headline:text('headline',180),intro:text('intro',700),difference:text('difference',400),nextStep:text('nextStep',400),confirmed:v.confirmed===true};
}

export function journeyServiceMatches(journey:Journey,services:{name:string}[]) {
 if(journey==='standard')return true;
 const pattern=journey==='roof-repair'?/repair|leak/i:journey==='hvac-replacement'?/install|replacement|heat pump/i:/patio|pergola|outdoor|louver/i;
 return services.some(service=>pattern.test(service.name));
}

// Match the Roofing message to actual selected offerings, never the trade label alone.
export function roofingJourneyCopy(services:{name:string}[]) {
 const repairs=services.some(x=>/repair|leak/i.test(x.name));
 const replacement=services.some(x=>/roof.*replac|replac.*roof/i.test(x.name));
 if(!repairs||!replacement)return {};
 return {
  eyebrow:'ROOF REPAIR & REPLACEMENT',
  intro:'A leak to fix. An aging roof to plan for. Tell us what you’re seeing and discuss repair or replacement before deciding on the work.',
  cta:'Discuss my roofing options',shortCTA:'Discuss my roof',formTitle:'What does your roof need?',
  benefitTitle:'Repair or replace?\nStart with what your roof needs.',
  benefits:[['Pinpoint the concern','Share where you noticed the issue and when it appeared. Those details help frame the first conversation.'],['Compare the options','Ask whether a targeted repair or replacement fits the roof’s condition, and what supports the recommendation.'],['Know the next step','Discuss access, timing, and the estimate before agreeing to work.']],
  processTitle:'From roof concern to a clear plan.',
  storyIntro:'Explore the layers of a roof, then ask which details matter for your project.'
 };
}
