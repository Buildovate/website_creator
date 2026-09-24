import {roofingFixture} from './roofing-journey.mjs';
import {legalFixture} from './legal-policy.mjs';
export const hiddenFooterFields=Object.fromEntries(['name','address','phone','email','hours','license','bonded','insured'].map(k=>[k,false]));
export function footerFixture(mode){
 const f=structuredClone(roofingFixture);f.slug='footer-'+mode;
 Object.assign(f.settings,{name:'Ridgeline · Footer QA',address:'100 Example Lane, Ventura',email:'office@example.test',hours:'Mon–Fri, 8am–5pm',license:'QA-LICENSE-001'});
 f.settings.platform.footer={socials:{instagram:{enabled:true,url:'https://instagram.com/example'}},locations:[]};
 const footer=f.settings.platform.footer;
 if(mode==='hidden'||mode==='required'){
  footer.visible=structuredClone(hiddenFooterFields);
  footer.locations=[{id:'hidden',name:'Hidden location heading',phone:'8055550109',address:'Hidden address',visible:structuredClone(hiddenFooterFields)},{id:'empty',name:'Empty location heading'}];
 }
 if(mode==='required'||mode==='multiple')f.settings.platform.legal=structuredClone(legalFixture);
 if(mode==='multiple'){
  footer.locations=[{id:'ventura',name:'Ventura · QA',address:'100 Example Lane',phone:'8055550111',hours:'Mon–Fri, 8am–5pm'},{id:'oxnard',name:'Oxnard · QA',address:'200 Example Lane',phone:'8055550112',email:'oxnard-office@example.test',hours:'By appointment'},{id:'empty',name:'Empty location heading'}];
  f.settings.platform.financing={enabled:true,lenders:[{id:'wisetack',enabled:true,confirmed:true,applicationUrl:'https://example.test/qa-financing'}]};
  footer.financingDisclosure='Fictional QA financing disclosure. No lender connection or actual offer.';
 }
 return f;
}
