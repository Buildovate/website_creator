from PIL import Image,ImageDraw,ImageFont,ImageOps
from pathlib import Path
import json
root=Path(r"C:\Users\joe\website_creator\docs\build-evidence\028B\followup")
out=root/"contact-sheets"
out.mkdir(exist_ok=True)
font=ImageFont.load_default(size=20)
small=ImageFont.load_default(size=16)
for section in ["hero","services","process","financing","reviews","finalCta"]:
    canvas=Image.new("RGB",(1860,2460),"#eeeeea")
    draw=ImageDraw.Draw(canvas)
    draw.text((25,15),f"#028B follow-up | {section} | a / b / c | Roofing, Patios, HVAC",fill="#172421",font=font)
    for row,kit in enumerate(["roofing","patios","hvac"]):
        for col,variant in enumerate(["a","b","c"]):
            x=20+col*615
            y=65+row*790
            draw.text((x,y),f"{kit.title()} / {variant}  |  1440 + 390",fill="#172421",font=small)
            for width,dx,maxsize in [(1440,0,(390,745)),(390,400,(190,745))]:
                im=Image.open(root/"after"/f"{kit}-{section}-{variant}-{width}.png").convert("RGB")
                im.thumbnail(maxsize,Image.Resampling.LANCZOS)
                canvas.paste(im,(x+dx,y+30))
    canvas.save(out/f"{section}.jpg",quality=90,optimize=True)
print("Created six contact sheets from 108 original section captures.")

