import type {Lender,FinancingProgram} from './constitution.js';
// Link setup is not a provider connection. No credentials or external calls here.
export const LENDER_NAMES={sfc:'Service Finance Company',wisetack:'Wisetack',sunbit:'Sunbit',hearth:'Hearth',enhancify:'Enhancify',other:'Other'} as const;
export function lenderName(l:Lender){return l.id==='other'?l.displayName||'Other lender':LENDER_NAMES[l.id];}
export function lenderAdapter(l:Lender){return {id:l.id,name:lenderName(l),connection:'not_connected' as const,label:'Not connected',linkReady:!!(l.enabled&&l.confirmed&&l.applicationUrl&&(l.id!=='other'||l.displayName)),message:'No lending API is connected. A confirmed application link opens the lender’s own site.'};}
export function suppliedPrograms(fin:{lenders:Lender[];programs:FinancingProgram[]}){return fin.programs.filter(p=>p.enabled&&p.confirmed&&fin.lenders.some(l=>l.id===p.lenderId&&lenderAdapter(l).linkReady));}
