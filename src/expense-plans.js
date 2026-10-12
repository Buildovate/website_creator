// Joe-approved launch prices, 2026-10-10. Seeds only; admin edits and recorded revenue stay intact.
export const expensePlans = [
  {id:'website', name:'Website', price:50, annualPrice:500, setupFee:0, billingPeriod:'monthly', socialPosts:0},
  {id:'growth', name:'Growth', price:150, annualPrice:1500, setupFee:0, billingPeriod:'monthly', socialPosts:12},
  {id:'all-in', name:'All-in', price:300, annualPrice:3000, setupFee:0, billingPeriod:'monthly', socialPosts:20}
];
export const socialCostLines = [12,20].map(posts=>({id:'social-'+posts,name:posts+'-post monthly social pack',unit:'monthly pack',rate:null,effective:'2020-01-01'}));
