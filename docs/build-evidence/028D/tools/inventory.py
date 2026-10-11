from pathlib import Path
import json,os,hashlib,collections,re
root=Path(r"C:\Users\joe\website_creator");out=root/"docs/build-evidence/028D"
read=lambda p:json.loads((root/p).read_text(encoding="utf-8-sig"))
image_ext={".png",".jpg",".jpeg",".webp",".avif",".gif",".svg",".ico",".bmp",".tif",".tiff"};video_ext={".mp4",".webm",".mov",".m4v",".avi",".mkv"}
excluded={".git","node_modules",".preserve",".data","dist",".next",".cache"}
proof={};records=[]
for ticket in ["004W-v4","170"]:
 source=f"docs/build-evidence/{ticket}/image-provenance.json"
 for x in read(source):
  item={"kind":"generated","provider":"Higgsfield","jobId":x.get("job_id",x.get("jobId")),"record":source,"trade":x["trade"],"section":x["section"],"service":x["service"],"file":x["file"],"dateAdded":"2026-09-26","priorReview":f"docs/build-evidence/{ticket}/README.md","priorResult":"accepted installation recorded; no named approver or license grant recorded"}
  proof[x["sha256"]]=item;records.append(item)
clips=[]
for name in ["trade-films","trade-build-films","trade-craft-films","pricing-films"]:
 for key,v in read("public/"+name+".json").items():
  clips.append({"tradeKey":key,"catalog":"public/"+name+".json","url":v.get("url"),"poster":v.get("poster"),"openingPoster":v.get("openingPoster"),"jobId":v.get("jobId"),"duration":v.get("duration"),"sourceRecorded":bool(v.get("jobId"))})
clip_by_path={"public"+x["url"].split("?")[0]:x for x in clips if x["url"]}
master_proof={}
for x in read("docs/build-evidence/clips-phase2/master-assets.json"):
 ticket=x["ticket"];retake=x["retake"];accepted=ticket in ["024","026"] or (ticket=="027" and retake)
 master_proof[x["sha256"]]={"kind":"generated","provider":"Higgsfield","record":"docs/build-evidence/clips-phase2/master-assets.json","trade":"Roofing","ticket":ticket,"retake":retake,"sourceUrl":x["url"],"dateAdded":"2026-09-27","priorResult":"accepted" if accepted else "rejected","priorReview":"docs/build-evidence/clips-phase2/README.md"}
files=[]
for base,dirs,names in os.walk(root,followlinks=False):
 dirs[:]=[d for d in dirs if d not in excluded and not (Path(base)/d).is_symlink() and (Path(base)/d)!=out]
 for name in names:
  p=Path(base)/name;ext=p.suffix.lower()
  if ext not in image_ext|video_ext or p.is_symlink():continue
  rel=p.relative_to(root).as_posix();size=p.stat().st_size
  role="installed" if rel.startswith("public/") else "evidence" if rel.startswith("docs/build-evidence/") else "reference" if "design-reference/" in rel or "prototypes" in rel else "repository media"
  digest=hashlib.sha256(p.read_bytes()).hexdigest() if role=="installed" or (ext in video_ext and name=="master.mp4") else None
  source=proof.get(digest) or master_proof.get(digest)
  if not source and rel in clip_by_path:
   c=clip_by_path[rel];source={"kind":"catalog reference","record":c["catalog"],"jobId":c["jobId"],"tradeKey":c["tradeKey"],"sourceRecorded":c["sourceRecorded"]}
  status="rejected" if source and source.get("priorResult")=="rejected" else "pending"
  reason="Prior visual review rejected this take" if status=="rejected" else "License/use-rights and current library approver not recorded" if source else "No asset-level provenance record matched"
  files.append({"path":rel,"kind":"clip" if ext in video_ext else "image","bytes":size,"sha256":digest,"role":role,"source":source or {"kind":"unrecorded"},"license":{"status":"not-recorded","record":None},"dateAdded":source.get("dateAdded") if source else None,"approvalStatus":status,"approver":None,"isSample":role=="installed" and not rel.startswith("public/assets/domain-guides/"),"mayBeRecolored":False,"reason":reason})
files.sort(key=lambda x:x["path"])
summary={"files":len(files),"images":sum(x["kind"]=="image" for x in files),"clips":sum(x["kind"]=="clip" for x in files),"installed":sum(x["role"]=="installed" for x in files),"installedKnownGeneratedStills":sum(x["role"]=="installed" and x["source"]["kind"]=="generated" and x["kind"]=="image" for x in files),"roles":dict(collections.Counter(x["role"] for x in files)),"statuses":dict(collections.Counter(x["approvalStatus"] for x in files)),"excludedTrees":sorted(excluded),"exclusionReason":"Dependencies, Git objects, build copies and runtime/backups are not source-media libraries. .preserve is untouched. This ticket's new evidence is excluded from its own input inventory.","hashScope":"Every installed file and local master.mp4; evidence/reference images are path/size inventory only.","providerCalls":0,"creditsUsed":0}
(out/"media-inventory.json").write_text(json.dumps({"summary":summary,"files":files},indent=2)+"\n",encoding="utf-8")
(out/"existing-clip-candidates.json").write_text(json.dumps(clips,indent=2)+"\n",encoding="utf-8")
(out/"checks/inventory-summary.json").write_text(json.dumps(summary,indent=2)+"\n",encoding="utf-8")
print(json.dumps(summary))
