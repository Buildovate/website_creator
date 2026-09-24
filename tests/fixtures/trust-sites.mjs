// Fictional selections for local QA. These links are never fetched.
const checkedAt=new Date().toISOString().slice(0,10);
export const trustSitesFixture={version:1,enabled:true,showRatings:true,layout:'auto',placements:['below-hero'],networks:[
 {id:'google',enabled:true,approved:true,profileUrl:'https://www.google.com/maps?cid=1234'},
 {id:'yelp',enabled:true,approved:true,profileUrl:'https://www.yelp.com/biz/ridgeline-qa'},
 {id:'houzz',enabled:true,approved:true,profileUrl:'https://www.houzz.com/pro/ridgeline-qa'},
 {id:'angi',enabled:true,approved:true,profileUrl:'https://www.angi.com/companylist/ridgeline-qa'},
 {id:'thumbtack',enabled:true,approved:true,profileUrl:'https://www.thumbtack.com/qa'},
 {id:'bbb',enabled:true,approved:true,profileUrl:'https://www.bbb.org/qa',credential:'Accredited business',evidence:{url:'https://www.bbb.org/qa',note:'Fictional local evidence; not a real membership.',confirmed:true,checkedAt},expiresAt:'2099-12-31'}
]};
