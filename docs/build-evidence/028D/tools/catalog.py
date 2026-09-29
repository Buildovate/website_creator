from pathlib import Path
import json,hashlib,collections
root=Path(r'C:\Users\joe\website_creator');out=root/'docs/build-evidence/028D';v=out/'visual-review';r=json.loads((v/'eligible.json').read_text());draft=json.loads((out/'candidate-library.json').read_text())
# Human visual decisions after inspection of all contact sheets, with larger second-pass sheets.
approved={4,10,27,46,47,48,49,50,59,65,70,80,91,112,121,122,151,156,178,182,189,213,214,219,234,237,259,264,266,270,276,277,281,285,290}
clip_ok={2,3,5,6,8,12,13,14,16,19,20,21,22,23}
clip_reasons={1:'Printed text on roofing membrane at 25%.',4:'Worker facial detail cannot be confidently cleared in the blurred construction frames.',7:'Worker face in the 50% frame.',9:'Worker face/profile in the 25% frame.',10:'Printed lettering on worker shirt in the opening frame.',11:'Worker facial detail cannot be confidently cleared in the moving construction frames.',15:'Printed markings on blue pipe; not cleared for the no-text library.',17:'Printed logo on glove at 50%.',18:'Printed text/logo on glove at 25%.',24:'Printed text on adhesive tube in the opening frame.'}
face_ids=set([2,6,8,11,13,14,16,17,20,21,22,24,26,28,29,31,34,35,36,40,41,44,45,51,52,55,56,60,61,62,63,67,71,72,73,74,76,77,78,81,82,84,85,87,88,89,90,93,94,97,98,100,102,104,105,106,109,113,116,120,124,125,127,129,131,132,133,136,137,138,139,141,142,143,144,145,146,147,148,150,152,153,158,159,160,161,162,163,164,165,167,168,169,171,175,177,179,184,185,186,187,191,193,194,196,199,200,201,202,203,204,205,206,207,208,209,210,211,212,215,218,227,228,232,233,235,236,238,239,240,242,244,247,248,249,250,251,252,253,254,255,256,258,262,267,275,280,283,286,287,288,289,292,293,294,295,296,298,299,300,301,302,303,304,305,306,308,309,310,311,312,313,314,315])
assets={};reviews=[]
rights={'basis':'Joe Engel account output rights; commercial use and client sublicense attested by Joe','record':'docs/media/RIGHTS-AND-APPROVALS.md','recordedBy':'Joe Engel','date':'2026-09-28'}
def digest(url):return hashlib.sha256((root/('public'+url.split('?')[0])).read_bytes()).hexdigest()
def common(status,source,review,reason):return dict(source=source,rights=rights if status=='approved' else {'record':None,'status':'not approved for library publication'},license={'basis':'Higgsfield output rights attested by Joe Engel','record':rights['record']} if status=='approved' else {'status':'pending'},dateAdded='2026-09-28',approvalStatus=status,approver='Joe Engel' if status=='approved' else None,approvedAt='2026-09-28' if status=='approved' else None,isSample=True,mayBeRecolored=status=='approved',visualReview=review,reason=reason)
for i,x in enumerate(r['stills'],1):
 status='approved' if i in approved else 'pending';reason='Visual checks passed: no watermark, text, logo, face or invented proof visible.' if i in approved else 'Visible face or partial face; not eligible under Joe’s no-face rule.' if i in face_ids else 'Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule.'
 review={'id':x['reviewId'],'sheet':f'docs/build-evidence/028D/visual-review/stills-{(i-1)//12+1:02}.jpg','reviewedAt':'2026-09-28','result':status,'reason':reason}
 id='still-'+x['sha256'][:16];assets[id]=dict(id=id,kind='still',url='/'+x['path'].removeprefix('public/'),sha256=x['sha256'],originalTrade=x['source']['trade'],**common(status,x['source'],review,reason));reviews.append(dict(assetId=id,path=x['path'],**review))
for x in json.loads((out/'existing-clip-candidates.json').read_text()):
 n=next((i for i,c in enumerate(r['clips'],1) if c['url']==x['url']),None);status='approved' if n in clip_ok else 'pending';reason='Five frames and poster pass the no-watermark/text/logo/face/proof check.' if status=='approved' else clip_reasons.get(n,'Catalog link has no recorded Higgsfield job ID; provenance remains Pending.')
 source={'provider':'Higgsfield','record':x['catalog'],'jobId':x.get('jobId')};id=x['tradeKey']+'-'+Path(x['catalog']).stem;review={'id':f'V{n:02}' if n else None,'sheet':f'docs/build-evidence/028D/visual-review/V{n:02}.jpg' if n else None,'fractions':[0,.25,.5,.75,.98] if n else [],'result':status,'reason':reason}
 assets[id]=dict(id=id,kind='clip',url=x['url'],sha256=digest(x['url']),posterId=None,seconds=x['duration'],**common(status,source,review,reason));reviews.append(dict(assetId=id,path='public'+x['url'].split('?')[0],**review))
 if n:
  pid=id+'-poster';ps='approved' if n not in [15,24] else 'pending';pr={**review,'id':f'V{n:02}-poster','fractions':[],'result':ps,'reason':'Clean installed poster independently reviewed.' if ps=='approved' else 'Printed material detail not confidently cleared.'}
  assets[pid]=dict(id=pid,kind='still',url=x['poster'],sha256=digest(x['poster']),originalTrade=draft['trades'][x['tradeKey']]['trade'],**common(ps,{**source,'derivation':'Installed poster saved beside the account-linked catalog clip'},pr,pr['reason']));assets[id]['posterId']=pid;reviews.append(dict(assetId=pid,path='public'+x['poster'].split('?')[0],**pr))
libraries={}
for key,t in draft['trades'].items():
 stills=[a['id'] for a in assets.values() if a['kind']=='still' and a.get('originalTrade')==t['trade']]
 clips=[a['id'] for a in assets.values() if a['kind']=='clip' and a['id'].startswith(key+'-')]
 libraries[key]={'trade':t['trade'],'heroClipSlots':[{'slot':i+1,'assetId':clips[i] if i<len(clips) else None,'status':assets[clips[i]]['approvalStatus'] if i<len(clips) else 'pending'} for i in range(10)],'heroStills':stills,'sectionStills':{k:stills.copy() for k in ['services','process','financing','finalCta']},'target':t['target']}
# These existing approved images depict windows, doors and interior trim. Their original
# provenance is preserved; no new image or claim about completed contractor work is made.
shared=[next(a['id'] for a in assets.values() if a['visualReview']['id']=='S151'),'general-contractors-trade-build-films-poster','painting-trade-build-films-poster','general-contractors-trade-craft-films-poster']
w=libraries['windows-doors'];w['heroStills']+=shared
for ids in w['sectionStills'].values():ids.extend(shared)
w['sharedAssetRationale']='Entry-door hardware, window interiors and door trim are also appropriate Windows/Doors material imagery. Original Locksmith, Painting and General Contractors provenance is retained; files are not duplicated.'
# Existing accepted Phase 2 clips retain their section roles; they are not hero inventory.
phase2=json.loads((root/'docs/build-evidence/clips-phase2/generation-log.json').read_text())['generations']
libraries['roofing']['sectionClips']=[]
for n,g in enumerate(phase2,1):
 if g['quality']['result']!='Ready':continue
 ticket=g['ticket'];id='roofing-phase2-'+ticket;pid=id+'-poster';url='/assets/planning/clips-phase2/'+ticket+'-1920.mp4';poster='/assets/planning/clips-phase2/'+ticket+'-poster-1280.webp'
 source={'provider':'Higgsfield','record':'docs/build-evidence/clips-phase2/generation-log.json','jobId':g['job']['id'],'master':g['localMaster']}
 review={'id':'P'+ticket,'sheet':f'docs/build-evidence/028D/visual-review/phase2-{n}.jpg','fractions':[0,.25,.5,.75,1],'result':'approved','reason':'Prior Ready acceptance and five-frame review: no text, watermark, logo, face or invented proof.'}
 assets[id]=dict(id=id,kind='clip',url=url,sha256=digest(url),posterId=pid,seconds=g['params']['duration'],**common('approved',source,review,review['reason']))
 assets[pid]=dict(id=pid,kind='still',url=poster,sha256=digest(poster),originalTrade='Roofing',**common('approved',{**source,'derivation':'Existing accepted delivery poster'},review,review['reason']))
 libraries['roofing']['sectionClips'].append(id)
 for slot in ['financing','finalCta']:libraries['roofing']['sectionStills'][slot].append(pid)
 reviews.extend([dict(assetId=id,path='public'+url,**review),dict(assetId=pid,path='public'+poster,**review)])
# Inventory every other installed raster/video as Pending, never in eligible pools.
# Evidence screenshots and reference mockups are retained in the inventory, not published assets.
known={a['url'].split('?')[0] for a in assets.values()}
for item in json.loads((out/'media-inventory.json').read_text())['files']:
 if item['role']!='installed':continue
 url='/'+item['path'].removeprefix('public/')
 if url in known:continue
 id='pending-'+hashlib.sha256(item['path'].encode()).hexdigest()[:16]
 status='rejected' if item['approvalStatus']=='rejected' else 'pending'
 source={**item.get('source',{}),'record':item.get('source',{}).get('record')}
 reason=item.get('reason') or 'No approved provenance and visual clearance for library publication.'
 assets[id]=dict(id=id,kind='clip' if item['kind']=='clip' else 'still',url=url,sha256=item.get('sha256'),**common(status,source,{'result':status,'reason':reason},reason))
 keys=[key for key in libraries if '/'+key+'/' in url or '/'+key+'-' in url or item.get('source',{}).get('trade')==libraries[key]['trade']]
 assets[id]['assignedTradeKeys']=keys
 for key in keys:libraries[key].setdefault('pendingInventory',[]).append(id)
catalog={'version':1,'rightsRecord':rights['record'],'customPerContractorVideoEnabled':False,'assets':assets,'trades':libraries}
(root/'public/trade-media-library.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8');(v/'review-ledger.json').write_text(json.dumps(reviews,indent=2)+'\n',encoding='utf-8')
counts={k:{'approvedClips':sum(assets[x['assetId']]['approvalStatus']=='approved' for x in t['heroClipSlots'] if x['assetId']),'approvedStills':sum(assets[x]['approvalStatus']=='approved' for x in t['heroStills'])} for k,t in libraries.items()}
(out/'checks/approved-counts.json').write_text(json.dumps(counts,indent=2)+'\n');print(json.dumps(counts,indent=2))
