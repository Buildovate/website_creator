from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import json
r=Path(r'C:\Users\joe\website_creator');o=r/'docs/build-evidence/028D';samples=json.loads((o/'sample-fixtures.json').read_text());font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
for width in [1440,390]:
 paths=[o/'after'/f"{s['id']}-{width}.png" for s in samples]
 if not all(p.exists() for p in paths):continue
 thumbs=[];heros=[]
 for s,p in zip(samples,paths):
  im=Image.open(p).convert('RGB');w=360 if width==1440 else 280;h=round(im.height*w/im.width);thumbs.append(im.resize((w,h)))
  crop=im.crop((0,0,im.width,min(im.height,1250 if width==1440 else 1750)));heros.append(crop.resize((w,round(crop.height*w/crop.width))))
 for name,pictures in [('full',thumbs),('hero',heros)]:
  w=pictures[0].width;canvas=Image.new('RGB',((w+18)*len(pictures)+18,max(p.height for p in pictures)+110),'#edf0f3');d=ImageDraw.Draw(canvas)
  for i,(s,im) in enumerate(zip(samples,pictures)):
   x=18+i*(w+18);label=s['settings']['name'].replace('Sample Fictional ','');color=s['settings']['mediaPicks']['slots']['hero']['treatment']['color']
   d.text((x,10),'SAMPLE / FICTIONAL',font=font,fill='#172421');d.text((x,33),label,font=font,fill='#172421');d.text((x,57),s['city']+' | tint '+color,font=font,fill='#172421');canvas.paste(im,(x,90))
  canvas.save(o/f'side-by-side-{name}-{width}.jpg',quality=91)
print('Contact sheets saved from actual browser captures')
