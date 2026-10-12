import {hash,now} from '../core.js';
const DAY=86400000;
const configuration=s=>JSON.stringify([s.reviews?.googlePlaceId||'',s.reviews?.yelpBusinessId||'',s.reviews?.googleUrl||'',s.reviews?.yelpUrl||'',s.reviews?.confirmed===true,s.reviews?.minimum??null,s.minReviewRating??null,s.showReviews!==false,s.reviews?.privacyUrl||'',s.reviews?.termsUrl||'']);
/** Provider-response metadata only: no excerpts, names, ratings, counts, XP or completion flags. */
export async function recordReviewResponse(env,tenant,s,result,preview){
 if(env.REVIEW_ISOLATED)return; // Captured QA/sample snapshots never become live evidence.
 const providers=(s.showReviews===false?[]:result.providers||[]).filter(p=>!p.status&&Array.isArray(p.reviews)&&p.reviews.some(r=>typeof r.text==='string'&&r.text.trim())).map(p=>p.provider==='Google Maps'?{provider:'google',profileId:s.reviews?.googlePlaceId}:p.provider==='Yelp'?{provider:'yelp',profileId:s.reviews?.yelpBusinessId}:null).filter(p=>p?.profileId);
 const time=now(),mode=preview?'draft':'published',data={version:1,configurationHash:await hash(configuration(s)),receivedAt:time,mode,providers};
 await env.DB.prepare("INSERT INTO workspace_records(id,scope,kind,data,created_at,updated_at) VALUES(?,?,'review_response',?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,version=workspace_records.version+1,updated_at=excluded.updated_at WHERE workspace_records.scope=excluded.scope AND workspace_records.kind=excluded.kind").bind('review-response:'+mode+':'+tenant.id,tenant.id,JSON.stringify(data),time,time).run();
}
export async function readReviewResponse(env,tenantId,s){
 const expected=await hash(configuration(s));
 for(const mode of ['draft','published']){
  const row=await env.DB.prepare("SELECT data FROM workspace_records WHERE id=? AND scope=? AND kind='review_response'").bind('review-response:'+mode+':'+tenantId,tenantId).first();
  if(!row)continue;const data=JSON.parse(row.data),age=Date.now()-Date.parse(data.receivedAt);
  if(data.version!==1||data.configurationHash!==expected||!Number.isFinite(age)||age<0||age>DAY||!s.reviews?.confirmed||s.showReviews===false||!Array.isArray(data.providers))continue;
  const p=data.providers.find(p=>p.provider==='google'&&p.profileId===s.reviews.googlePlaceId&&s.reviews.privacyUrl&&s.reviews.termsUrl&&env.GOOGLE_PLACES_API_KEY||p.provider==='yelp'&&p.profileId===s.reviews.yelpBusinessId&&env.YELP_API_KEY);
  if(p)return {state:'available',dataSource:'workspace_records.review_response from filtered real provider API response',provider:p.provider,profileId:p.profileId,matched:true,confirmed:true,showing:true};
 }
 return {state:'not_connected',dataSource:'confirmed review profile + provider response receipt',reason:'Not connected. Load real reviews for this confirmed profile; saved links or a captured Sample do not count.'};
}
