import {access,must} from '../core.js';
import {readProgressSources} from './sources.js';
import {evaluateProgress} from './progress.js';

// Game is the only presentation. Old personal view records are left untouched.
// This route is read-only; existing section routes still own every business write.
export async function gameApi(req,env,url){
 const match=url.pathname.match(/^\/api\/game\/([^/]+)$/);
 must(match,'Game workspace not found.',404);
 must(req.method==='GET','Game is the only view. This endpoint is read-only.',405);
 const {tenant,role}=await access(req,env,decodeURIComponent(match[1]),'read');
 return {tenant:{id:tenant.id,name:tenant.name},role,view:'game',progress:evaluateProgress(await readProgressSources(env,tenant.id))};
}
