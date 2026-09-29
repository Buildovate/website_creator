// Explicit approved-version prerequisite for the pre-#028E regression suites.
// These suites test existing publication/data/permission behavior, not capture.
// The #028E contract and real-browser tests deliberately do NOT import this file.
import worker from '../../dist/server/index.js';
import {reviewState,REVIEW_CHECKLIST} from '../../src/review-packets.js';
import {hash} from '../../src/review-packet-utils.js';
import {stable} from '../../src/platform/generation.ts';
const fetch=worker.fetch.bind(worker);
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7ioAAAAASUVORK5CYII=','base64'));
worker.fetch=async(req,env)=>{
 const copy=req.clone(),url=new URL(req.url),site=url.pathname.match(/^\/api\/tenants\/([^/]+)\/(?:projects\/([^/]+)\/)?publish$/),record=url.pathname.match(/^\/api\/workspace\/([^/]+)\/(pages|forms|blog|visibility)\/([^/]+)\/publish$/);
 const response=await fetch(req,env);
 if(req.method!=='POST'||(!site&&!record)||response.status!==409)return response;
 const error=(await response.clone().json().catch(()=>({}))).error;
 if(!['Complete the review packet before approval.','Staff must approve the review packet for this exact version before publishing.'].includes(error))return response;
 const id=site?.[1]||record[1],target=site?(site[2]?'project:'+site[2]:'website'):record[2]+':'+record[3];
 const state=await reviewState(env,id,target),version=state.versionHash,key='review-packets/'+encodeURIComponent(id)+'/'+version+'/';
 const packet={schema:1,siteId:id,target,versionHash:version,status:'Complete',expectedClips:[],clips:[],claims:[],pages:[{path:'/unit-test-prerequisite',screenshots:{1440:'screenshots/fixture.png',390:'screenshots/fixture.png'}}],checklist:REVIEW_CHECKLIST,files:[{path:'screenshots/fixture.png',sha256:await hash(png),bytes:png.length,type:'image/png'}],testFixture:'Capture double for pre-028E behavior suite; never review-packet proof'};
 await env.BUCKET.put(key+'screenshots/fixture.png',png);await env.BUCKET.put(key+'packet.json',stable(packet));
 const decision={versionHash:version,decision:'approve',approver:{id:'legacy-review-fixture'},timestamp:'2026-09-28T00:00:00Z',testFixture:true};
 await env.DB.prepare("INSERT INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,'review_approval',?,1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data").bind('review-'+version,id,stable(decision),decision.timestamp,decision.timestamp).run();
 console.log('Review approval test prerequisite:',id,target);
 return fetch(copy,env);
};
