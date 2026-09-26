// Approved internal catalog prices, #015GA. These are not receipts or charges.
export const expensePlans = [
  {id:'website', name:'Website', price:50, annualPrice:500, setupFee:0, billingPeriod:'monthly', socialPosts:0},
  {id:'growth', name:'Growth', price:279, annualPrice:2790, setupFee:0, billingPeriod:'monthly', socialPosts:12},
  {id:'all-in', name:'All-in', price:449, annualPrice:4490, setupFee:0, billingPeriod:'monthly', socialPosts:20}
];
export const socialCostLines = [12,20].map(posts=>({id:'social-'+posts,name:posts+'-post monthly social pack',unit:'monthly pack',rate:null,effective:'2020-01-01'}));
