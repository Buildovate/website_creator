import {reconcileServicePages} from './service-registry.js';

// Idempotent startup backfill for saved drafts and public snapshots. Compare
// the old value in each UPDATE so a concurrent edit or publish is never lost.
export async function backfillServicePageSettings(db) {
  const rows=(await db.prepare('SELECT id,settings,published FROM tenants').all()).results;
  let drafts=0,published=0;
  for(const row of rows){
    const draft=JSON.parse(row.settings);
    draft.websitePages=reconcileServicePages(draft.websitePages,draft.services);
    const nextDraft=JSON.stringify(draft);
    if(nextDraft!==row.settings){
      const result=await db.prepare('UPDATE tenants SET settings=? WHERE id=? AND settings=?').bind(nextDraft,row.id,row.settings).run();
      drafts+=Number(result.meta.changes||0);
    }
    if(!row.published)continue;
    const live=JSON.parse(row.published);
    live.websitePages=reconcileServicePages(live.websitePages,live.services);
    const nextLive=JSON.stringify(live);
    if(nextLive!==row.published){
      const result=await db.prepare('UPDATE tenants SET published=? WHERE id=? AND published=?').bind(nextLive,row.id,row.published).run();
      published+=Number(result.meta.changes||0);
    }
  }
  return {drafts,published};
}
