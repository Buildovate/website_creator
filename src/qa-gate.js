export const QA_REVISION='028F.3';
export const QA_WIDTHS=[390,768,1440];
export const QA_PAGE_KEYS=['overflow','clipped-text','overlapping-text','images','alt','posters','published-copy','consent','financing','policy','sources','honesty','actions','floating','requests'];
export const QA_CATEGORIES=['layout','media','video','disclosures','placeholders','reviews','standing'];
export const QA_THRESHOLDS=Object.freeze({overflowPx:1,overlapPx:2,letterboxFraction:.02,video:{passSsim:-.05,failSsim:-.15,passHistogram:.65,failHistogram:.80,morphFailResidual:.12,morphBorderlineResidual:.20,morphChangedSsim:.5,morphChangedHistogram:.1}});
export function videoResult(measures,morph={}){
 const t=QA_THRESHOLDS.video;
 const changed=morph.endpointChange?.ssim<t.morphChangedSsim&&morph.endpointChange?.histogramDistance>t.morphChangedHistogram;
 if(changed&&morph.interpolationResidual<t.morphFailResidual)return 'Fail';
 if(changed&&morph.interpolationResidual<t.morphBorderlineResidual)return 'Borderline';
 if(measures.some(m=>m.ssim<t.failSsim||m.histogramDistance>t.failHistogram))return 'Fail';
 if(measures.some(m=>m.ssim<t.passSsim||m.histogramDistance>t.passHistogram))return 'Borderline';
 return 'Pass';
}
export function qaSummary(report,decisions=[]){
 if(!report)return {clear:false,blocking:1,pending:0,passed:0,reason:'Capture the automatic QA report before approval.'};
 let blocking=0,pending=0,passed=0;
 for(const check of report.checks){
  if(check.result==='Fail'){blocking++;continue}
  if(check.result==='Borderline'){
   const decision=decisions.findLast(d=>d.checkId===check.id&&d.versionHash===report.versionHash&&d.manifestHash===report.manifestHash&&d.reportHash===report.reportHash);
   if(!decision)pending++;else if(decision.decision==='Reject')blocking++;else passed++;
  }else passed++;
 }
 return {clear:!blocking&&!pending,blocking,pending,passed,reason:blocking?'Resolve the blocking QA failures before approval.':pending?'A staff reviewer must decide every Borderline item, with a reason.':'Automatic QA is clear for this exact version.'};
}
export function qaMarkdown(report){return '# Automatic QA — '+report.versionHash+'\n\nAI review not connected. Borderline results require a recorded staff decision.\n\nManifest: `'+report.manifestHash+'`\n\n| Check | Result | Page | Width | Measured | Threshold | Evidence |\n|---|---|---|---:|---|---|---|\n'+report.checks.map(c=>'| '+c.id+' '+c.title+' | '+c.result+' | '+c.page+' | '+c.width+' | '+JSON.stringify(c.measured).replaceAll('|','\\|')+' | '+JSON.stringify(c.threshold).replaceAll('|','\\|')+' | ['+c.crop+']('+c.crop+') |').join('\n')+'\n\n## Evidence SHA-256\n\n'+report.files.map(f=>'- `'+f.sha256+'` '+f.path).join('\n')+'\n';}