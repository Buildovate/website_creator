// Fictional local-only offers; no business promotion is created by these fixtures.
export const promotionFixture={id:'roof-planning',enabled:true,title:'Fictional roofing planning offer',reward:'QA planning reward',description:'Local demonstration only. This is not a real business offer.',terms:'QA only. No monetary value.\nEligible scope: roof repair. Excludes other work. Confirm eligibility before proceeding. <No guarantee>',startsAt:'2020-01-01T08:15:00+05:30',endsAt:'2099-01-01T23:45:00-08:00',question:'What helps define your project?',choices:['A written scope','A guessed price'],answer:0,code:'QA-015-PRIVATE-CODE'};
export const promotionStates={
 current:[promotionFixture],
 upcoming:[{...promotionFixture,id:'future',startsAt:'2098-12-01T23:15:00-08:00'}],
 expired:[{...promotionFixture,id:'past',endsAt:'2021-11-07T01:30:00-07:00'}],
 none:[],
 disabledOffer:[{...promotionFixture,enabled:false}],
 mixed:[promotionFixture,{...promotionFixture,id:'future',startsAt:'2098-12-01T23:15:00-08:00'},{...promotionFixture,id:'past',endsAt:'2021-11-07T01:30:00-07:00'}]
};
