// Fictional, offline evidence contracts. Never used by production sources.
export function complete() {
  return {
    onboarding:{state:'available',dataSource:'fixture:tenant',fields:Object.fromEntries(['name','phone','trade','area'].map(id=>[id,{value:id==='phone'?'+18055550198':id,saved:true,origin:'contractor',confirmed:true}]))},
    pages:{state:'available',dataSource:'fixture:pages',required:['home','service','about','faq'],drafts:['home','service','about','faq'],approval:{approved:true,reference:'owner approval fixture'}},
    reviews:{state:'available',dataSource:'fixture:review-display',provider:'google',profileId:'fixture-place',matched:true,confirmed:true,showing:true},
    estimator:{state:'available',dataSource:'fixture:estimator',serviceRanges:[{service:'Roof repair',min:10,max:20}],fields:['name','mobile'],fieldsSaved:true,requiredFields:['name','mobile'],priceBook:{minimumItems:2,items:[{id:'a',enteredBy:'contractor',confirmed:true,amount:10},{id:'b',enteredBy:'contractor',confirmed:true,amount:20}]},consent:true},
    promotions:{state:'available',dataSource:'fixture:offers',offers:[{id:'offer',title:'Owner offer',reward:'Owner-defined reward'}],choice:null},
    financing:{state:'available',dataSource:'fixture:lender',selection:'lenders',lenders:[{id:'hearth',selected:true,connection:'connected'}]},
    leads:{state:'available',dataSource:'fixture:alerts',alerts:{enabled:true,phone:'+18055550198',phoneVerified:true},crm:{state:'not_connected'}},
    launch:{state:'available',dataSource:'fixture:plan/domain/site',plan:{status:'active'},domain:{stage:'live'},published:true},
    marketing:{state:'available',dataSource:'fixture:social',ready:true,choice:'channels',channels:[{id:'facebook',connection:'connected'}],posts:[{id:'post',channel:'facebook',providerId:'real-published-fixture',status:'published',publishedAt:'2026-01-01T00:00:00Z',isSample:false}]}
  };
}
export function freeze(value) { if(value&&typeof value==='object'){Object.freeze(value);for(const child of Object.values(value))freeze(child);}return value; }
