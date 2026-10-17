export function qualityViolations(a){
 const errors=[],add=(condition,message)=>{if(condition)errors.push(a.path+': '+message)};
 add(!/^[a-f0-9]{64}$/.test(a.sha256||''),'missing content digest');add(!a.source?.sha256,'missing original-source provenance');
 if(a.kind==='video'){
  add(!Number.isFinite(a.crf)||a.crf>20,'video exceeds CRF 20 or has no encoding attestation');
  add(a.scrub&&(!Number.isFinite(a.maxKeyframeGap)||a.maxKeyframeGap>6),'scrub keyframe gap exceeds six frames');
  add((a.role==='hero'||a.scrub)&&a.source?.width>=1920&&a.width<1920,'available native 1920-wide source was downsized');
  add(a.source?.height>=1920&&a.source?.height>a.source?.width&&a.height<1920,'native portrait hero was downsized');
  add(a.width<a.source?.width||a.height<a.source?.height,'video dimensions are below its source');
 }else if(a.kind==='still'){
  add(!Number.isFinite(a.quality)||a.quality<80,'still quality is below 80 or unknown');
  add(a.role==='hero'&&a.source?.width>=1920&&a.width<1920&&!a.variantOf,'available native hero resolution was discarded');
 }
 return errors;
}
