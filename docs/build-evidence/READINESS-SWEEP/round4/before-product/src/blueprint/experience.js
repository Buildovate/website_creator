import {access,body,must,one,run,now} from '../core.js';
import {readProgressSources} from './sources.js';
import {evaluateProgress} from './progress.js';

export const emptyExperience=()=>({tour:'unseen',seenLevels:[]});
export function advanceExperience(previous,action,progress){
 const next=structuredClone(previous),completed=progress.levels.filter(l=>l.done).map(l=>l.id);
 const events={showTour:false,completedLevels:[]};
 if(action==='observe'){
  if(next.tour==='unseen'){next.tour='started';events.showTour=true;}
  events.completedLevels=completed.filter(id=>!next.seenLevels.includes(id));
  next.seenLevels=[...new Set([...next.seenLevels,...completed])].sort();
 }else if(action==='skip_tour'||action==='finish_tour'){
  if(next.tour==='started')next.tour=action==='skip_tour'?'skipped':'finished';
 }
 return {state:next,...events};
}
export function publishedPreview(tenant){
 return tenant.status==='published'&&!!tenant.published&&typeof tenant.slug==='string'&&/^[a-z0-9-]+$/.test(tenant.slug)
  ?{state:'published',url:'/s/'+tenant.slug}
  :{state:'unpublished',reason:'Your site isn’t published yet. Publish it when you’re ready, then view it here.'};
}
export async function experienceApi(req,env,url,tenantId){
 const {user,tenant}=await access(req,env,tenantId,'read');
 must(req.method==='GET'||req.method==='POST','Method not supported.',405);
 const id='game-experience:'+encodeURIComponent(tenantId)+':'+encodeURIComponent(user.id);
 const row=await one(env,"SELECT * FROM workspace_records WHERE id=? AND scope=? AND kind='game_experience'",id,tenantId);
 let state=emptyExperience();
 if(row){try{state=JSON.parse(row.data);}catch{must(false,'Your saved tour state could not be read.',409);}
 must(['unseen','started','skipped','finished'].includes(state.tour)&&Array.isArray(state.seenLevels)&&state.seenLevels.every(n=>[1,2,3].includes(n)),'Your saved tour state could not be read.',409);}
 if(req.method==='GET')return {state,preview:publishedPreview(tenant)};
 must(req.headers.get('origin')===url.origin,'Request must originate from this website.',403);
 const input=await body(req);
 must(input&&Object.keys(input).length===1&&['observe','skip_tour','finish_tour'].includes(input.action),'Choose a valid Game action.');
 const progress=evaluateProgress(await readProgressSources(env,tenantId));
 const result=advanceExperience(state,input.action,progress),time=now();
 if(JSON.stringify(state)!==JSON.stringify(result.state)){
  const saved=row
   ?await run(env,'UPDATE workspace_records SET data=?,version=version+1,updated_at=? WHERE id=? AND scope=? AND version=?',JSON.stringify(result.state),time,id,tenantId,row.version)
   :await run(env,"INSERT INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,'game_experience',?,1,?,?) ON CONFLICT(id) DO NOTHING",id,tenantId,JSON.stringify(result.state),time,time);
  must(saved.meta.changes===1,'Your Game state changed in another window. Refresh the board.',409);
 }
 return {...result,preview:publishedPreview(tenant)};
}
