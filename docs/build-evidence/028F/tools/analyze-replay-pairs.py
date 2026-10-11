from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
base=Path(r"C:\Users\joe\website_creator\docs\build-evidence\028F\replay-determinism")
rows=[]
for comparison in sorted(base.glob("diagnostic-*/checks/replay-pairs/comparison.json")):
 report=json.loads(comparison.read_text(encoding="utf-8"))
 run=comparison.parts[-4]
 for pair in report["differences"]:
  folder=Path(pair["folder"])
  a=np.array(Image.open(folder/"before.png").convert("RGBA"))
  b=np.array(Image.open(folder/"after.png").convert("RGBA"))
  record=json.loads((folder/"readiness.json").read_text(encoding="utf-8"))
  row={"run":run,"path":pair["path"],"beforeShape":list(a.shape),"afterShape":list(b.shape),"readinessDifferences":[]}
  for stage in ["before","after"]:
   old=record["before"].get(stage,{})
   new=record["after"].get(stage,{})
   for key in ["devicePixelRatio","viewport","documentSize","scroll","runningAnimations","fontsStatus"]:
    if old.get(key)!=new.get(key):row["readinessDifferences"].append({"stage":stage,"field":key,"before":old.get(key),"after":new.get(key)})
   for index in sorted(set(x['index'] for x in old.get('images',[]))|set(x['index'] for x in new.get('images',[]))):
    first=next((x for x in old.get('images',[]) if x['index']==index),None)
    second=next((x for x in new.get('images',[]) if x['index']==index),None)
    for key in ['currentSrc','srcset','sizes','naturalWidth','naturalHeight','rendered','complete','decodeResult','loading','computed','hover']:
     if (first or {}).get(key)!=(second or {}).get(key):row['readinessDifferences'].append({'stage':stage,'image':index,'field':key,'before':(first or {}).get(key),'after':(second or {}).get(key)})
  if a.shape==b.shape:
   delta=np.abs(a.astype(np.int16)-b.astype(np.int16))
   mask=np.any(delta!=0,axis=2)
   row.update(changedPixels=int(mask.sum()),maxChannelDelta=int(delta.max()),meanAbsoluteChannelDelta=float(delta.mean()))
   if mask.any():
    yy,xx=np.where(mask)
    box=(int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1))
    row['differenceBounds']=list(box)
    before=Image.fromarray(a).crop(box).convert('RGB');after=Image.fromarray(b).crop(box).convert('RGB')
    before.save(folder/'before-crop.png');after.save(folder/'after-crop.png')
    heat=np.zeros_like(a[:,:,:3]);heat[mask]=[255,0,64]
    Image.fromarray(heat).crop(box).save(folder/'pixel-diff-crop.png')
    sheet=Image.new('RGB',(before.width*3,before.height+25),'white');draw=ImageDraw.Draw(sheet)
    for k,(label,img) in enumerate([('Before',before),('After',after),('Exact changed pixels',Image.fromarray(heat).crop(box))]):sheet.paste(img,(k*before.width,25));draw.text((k*before.width+5,5),label,fill='black')
    sheet.save(folder/'pair-crop.png')
    row['perImageChangedPixels']=[]
    for img in record['before'].get('before',{}).get('images',[]):
     r=img['rendered'];scroll=record['before']['before']['scroll'];x1=max(0,int(r['x']+scroll['x']));y1=max(0,int(r['y']+scroll['y']));x2=min(mask.shape[1],int(np.ceil(r['x']+scroll['x']+r['width'])));y2=min(mask.shape[0],int(np.ceil(r['y']+scroll['y']+r['height'])))
     row['perImageChangedPixels'].append({'image':img['index'],'currentSrc':img['currentSrc'],'changedPixels':int(mask[y1:y2,x1:x2].sum())})
  (folder/'pixel-analysis.json').write_text(json.dumps(row,indent=2),encoding='utf-8')
  rows.append(row)
summary={'comparisonsFound':len(list(base.glob('diagnostic-*/checks/replay-pairs/comparison.json'))),'pairs':rows,'normalizationApplied':False,'tolerance':0}
(base/'pixel-analysis.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
