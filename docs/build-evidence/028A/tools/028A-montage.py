from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
root=Path(r'C:\Users\joe\website_creator\docs\build-evidence\028A')
font=ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf',26)
styles=['current','bold','fresh','classic']
canvas=Image.new('RGB',(1440,970),'#e4e8ed')
for i,style in enumerate(styles):
    im=Image.open(root/'screenshots'/f'roofing-complete-{style}-home-desktop-normal-hero.jpg').convert('RGB').resize((720,450))
    x,y=(i%2)*720,(i//2)*485
    canvas.paste(im,(x,y+35));ImageDraw.Draw(canvas).text((x+18,y+3),style.title(),font=font,fill='#17232a')
canvas.save(root/'roofing-style-comparison.jpg',quality=91)
for route in ['financing','contact','services-roof-repair']:
    canvas=Image.new('RGB',(1560,1600),'#e4e8ed')
    for i,style in enumerate(styles):
        im=Image.open(root/'screenshots'/f'roofing-complete-{style}-{route}-phone-normal.jpg').convert('RGB')
        im.thumbnail((390,1560));canvas.paste(im,(i*390,40));ImageDraw.Draw(canvas).text((i*390+14,5),style.title(),font=font,fill='#17232a')
    canvas.save(root/f'review-{route}.jpg',quality=85)
