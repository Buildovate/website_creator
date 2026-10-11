// Existing section IDs only. Permissions come from the legacy renderer's actual nav.
export const questSections={
 onboarding:['business','questionnaire','ownerphoto','access'],
 pages:['pages','hero','editor','templates','services','projects','backups'],
 reviews:['reviews'],
 estimator:['pages','pricing','forms'],
 promotions:['questionnaire'],
 financing:['questionnaire'],
 leads:['inquiries','contacts','calendar','chat','followups'],
 launch:['launchpad','domains','readiness','plan','billing','add-ons','sales'],
 marketing:['reviews','questionnaire','blog','visibility']
};
export const sectionLabels={launchpad:'Setup checklist',questionnaire:'Business questionnaire',hero:'Hero editor',editor:'Website editor',pages:'Website pages',business:'Business details',ownerphoto:'Owner photo',templates:'Design and generation settings',services:'Services',projects:'Project stories',blog:'Blog',contacts:'Contacts',calendar:'Calendar',forms:'Forms and submissions',inquiries:'Inquiry inbox',chat:'Live chat and alerts',pricing:'Pricing and estimate requests',reviews:'Review profiles',visibility:'Search visibility',plan:'Plan and features',billing:'Billing','add-ons':'Add-ons',readiness:'Publish readiness',followups:'Follow-up',access:'Team access',domains:'Domain settings',backups:'Backups',sales:'Sales and approval'};
export function sectionsForQuest(quest,available){return (questSections[quest]||[]).filter(id=>available.includes(id))}
export function stepTarget(quest,step,available){
 const desired={onboarding:'business',pages:step==='approval'?'editor':'pages',reviews:'reviews',estimator:step==='service-price-range'?'pages':'forms',promotions:'questionnaire',financing:'questionnaire',leads:'chat',launch:step==='paid-plan'?'plan':step==='live-domain'?'domains':'business',marketing:'reviews'}[quest];
 return {section:available.includes(desired)?desired:sectionsForQuest(quest,available)[0],anchor:quest==='promotions'?'q-promotions':quest==='financing'?'q-financing':null};
}
