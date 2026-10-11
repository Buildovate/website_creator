import {one,run,must,hash,uid,Fault} from './core.js';

// Anonymous-browser evidence, not identity verification or proof of redemption.
export const QUIZ_WINDOW_MS=15*60*1000;
export const QUIZ_BROWSER_LIMIT=8;
export const QUIZ_TENANT_LIMIT=100;
const reply=(data,status,cookie)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'private, no-store','x-content-type-options':'nosniff',...(cookie?{'set-cookie':cookie}:{})}});
async function quota(env,key,limit,time){
 const bucket=Math.floor(time/QUIZ_WINDOW_MS),id=await hash(key+'|'+bucket),expires=new Date((bucket+1)*QUIZ_WINDOW_MS).toISOString();
 const row=await env.DB.prepare('INSERT INTO promotion_unlock_limits(id,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=promotion_unlock_limits.attempts+1 WHERE promotion_unlock_limits.attempts<? RETURNING attempts').bind(id,expires,limit).first();
 must(row,'Too many quiz attempts. Wait up to 15 minutes before trying again.',429);
}
export async function completePromotionQuiz(req,env,url,tenant,offer,value){
 const cookieName='bvquiz_'+tenant.id.replace(/[^a-zA-Z0-9_-]/g,''),raw=req.headers.get('cookie')||'';
 const supplied=raw.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 const token=/^[a-f0-9]{64}$/.test(supplied||'')?supplied:uid().replaceAll('-','')+uid().replaceAll('-','');
 const cookie=cookieName+'='+token+'; Path=/api/public/'+encodeURIComponent(tenant.slug)+'/promotion-unlock; HttpOnly; SameSite=Strict; Max-Age=31536000'+(url.protocol==='https:'?'; Secure':'');
 try{
  const time=Date.now(),stamp=new Date(time).toISOString(),visitor=await hash(tenant.id+'|'+token);
  must(Date.parse(offer.startsAt)<=time&&Date.parse(offer.endsAt)>time,'This offer has ended or is not yet available.',410);
  await run(env,'DELETE FROM promotion_unlock_limits WHERE expires_at<=?',stamp);
  // The tenant budget bounds cookie resets too. Forwarding/IP headers are never trusted.
  await quota(env,'tenant|'+tenant.id,QUIZ_TENANT_LIMIT,time);
  await quota(env,'browser|'+tenant.id+'|'+offer.id+'|'+visitor,QUIZ_BROWSER_LIMIT,time);
  // Establish the HttpOnly browser identity before a client submits a successful answer.
  if(value.action==='start')return reply({ok:true,ready:true},200,cookie);
  must(Number.isInteger(value.answer)&&value.answer===offer.answer,'That answer is not quite right. Choose another answer and try again.',400);
  const revision=await hash(JSON.stringify({id:offer.id,question:offer.question,choices:offer.choices,answer:offer.answer,code:offer.code,reward:offer.reward,terms:offer.terms,startsAt:offer.startsAt,endsAt:offer.endsAt,serviceNames:offer.serviceNames}));
  const id=uid(),evidence=JSON.stringify({method:'trivia_quiz',question:offer.question,choices:offer.choices,selectedAnswer:value.answer,score:1,questionCount:1,serviceName:value.serviceName||null});
  // A unique scope plus an atomic batch make retries/concurrent submissions one completion.
  await env.DB.batch([
   env.DB.prepare('INSERT INTO promotion_completions(id,tenant_id,offer_id,offer_revision,visitor_hash,evidence,completed_at,expires_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(tenant_id,offer_id,offer_revision,visitor_hash) DO NOTHING').bind(id,tenant.id,offer.id,revision,visitor,evidence,stamp,offer.endsAt),
   env.DB.prepare("INSERT INTO audit(id,tenant_id,actor,action,detail,created_at) SELECT ?,tenant_id,'anonymous quiz','promotion.completed',id,completed_at FROM promotion_completions WHERE id=?").bind(uid(),id)
  ]);
  const receipt=await one(env,'SELECT id,completed_at,expires_at FROM promotion_completions WHERE tenant_id=? AND offer_id=? AND offer_revision=? AND visitor_hash=?',tenant.id,offer.id,revision,visitor);
  must(receipt,'Completion could not be saved. Please retry.',503);
  must(Date.parse(receipt.expires_at)>Date.now(),'This completion has expired. Contact the business about current offers.',410);
  // Recheck the published configuration after persistence; a concurrent withdrawal reveals no code.
  const current=await one(env,"SELECT published FROM tenants WHERE id=? AND status='published'",tenant.id);
  must(current?.published===tenant.published&&Date.parse(offer.endsAt)>Date.now(),'This offer changed or ended. Reload to see current offers.',409);
  const replayed=receipt.id!==id;
  return reply({ok:true,code:offer.code,reward:offer.reward,expiresAt:receipt.expires_at,receipt:{id:receipt.id,offerId:offer.id,completedAt:receipt.completed_at,expiresAt:receipt.expires_at,method:'trivia_quiz',replayed},message:replayed?'Your earlier completion is saved. Ask the business about using this offer.':'Your quiz completion is saved. Ask the business about using this offer.'},200,cookie);
 }catch(error){if(!(error instanceof Fault))throw error;const response=reply({error:error.message},error.status,cookie);if(error.status===429)response.headers.set('retry-after',String(Math.ceil((QUIZ_WINDOW_MS-Date.now()%QUIZ_WINDOW_MS)/1000)));return response;}
}
