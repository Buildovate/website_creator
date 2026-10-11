// Provider aggregates describe the full source, never the displayed excerpts.
export function filterReviewResult(result,minimum){
 if(minimum===undefined)return result;
 const providers=result.providers.map(provider=>{
  const next={...provider,reviews:(provider.reviews||[]).filter(review=>minimum==='all'||(Number.isFinite(review.rating)&&review.rating>=minimum&&review.rating<=5))};
  if(!(Number.isFinite(next.rating)&&next.rating>=0&&next.rating<=5&&Number.isSafeInteger(next.count)&&next.count>0)){delete next.rating;delete next.count;}
  return next;
 });
 return {...result,minimum:minimum==='all'?0:minimum,minReviewRating:minimum,providers};
}
