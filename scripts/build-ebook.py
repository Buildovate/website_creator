from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image
from pypdf import PdfReader
ROOT=Path(r'C:\Users\joe\website_creator')
g=json.loads((ROOT/'src/ebook/guide.json').read_text(encoding='utf-8'))
pdfmetrics.registerFont(TTFont('RoofHeading',str(ROOT/'public/assets/barlow-bold.ttf')))
pdfmetrics.registerFont(TTFont('RoofBody',str(ROOT/'public/assets/dm-sans.ttf')))
INK=HexColor('#193c32'); PAPER=HexColor('#f7f3e9'); TAN=HexColor('#9b774a')
body=ParagraphStyle('body',fontName='RoofBody',fontSize=11,leading=17,textColor=INK)
head=ParagraphStyle('head',fontName='RoofHeading',fontSize=33,leading=35,textColor=INK)
small=ParagraphStyle('small',fontName='RoofBody',fontSize=9,leading=13,textColor=INK)
def text(c,value,x,y,width,style):
    p=Paragraph(value.replace('’',"'"),style);w,h=p.wrap(width,700);p.drawOn(c,x,y-h);return y-h
def base(c,page,sample):
    c.setFillColor(PAPER);c.rect(0,0,612,792,fill=1,stroke=0)
    c.setFillColor(INK);c.setFont('RoofBody',9);c.drawString(48,756,'ROOFING / A CLEARER CONVERSATION')
    if sample:c.drawRightString(564,756,'SAMPLE / LOCAL PREVIEW')
    c.setStrokeColor(TAN);c.line(48,48,564,48);c.drawString(48,31,'Before you decide on your roof');c.drawRightString(564,31,str(page))
for sample in [False,True]:
    dest=ROOT/'src/ebook'/('sample-guide.pdf' if sample else 'guide.pdf')
    c=canvas.Canvas(str(dest),pagesize=(612,792));c.setTitle(('Sample - ' if sample else '')+g['title']);c.setAuthor('Roofing homeowner guide')
    # #027A Part 2: publication cover; existing chapter content is untouched.
    c.setFillColor(INK);c.rect(0,0,612,792,fill=1,stroke=0)
    im=Image.open(ROOT/('public'+g['image']))
    c.saveState();clip=c.beginPath();clip.rect(0,0,612,402);c.clipPath(clip,stroke=0)
    c.drawInlineImage(im,0,-12,612,410);c.restoreState()
    c.setFillColor(HexColor('#d2ef9e'));c.rect(40,716,40,3,fill=1,stroke=0)
    c.setFont('RoofBody',10);c.drawString(96,711,'THE HOMEOWNER FIELD GUIDE')
    if sample:c.setFont('RoofBody',8);c.drawRightString(568,762,'SAMPLE / LOCAL PREVIEW')
    cover=ParagraphStyle('cover',parent=head,fontSize=59,leading=58,textColor=PAPER)
    text(c,'Before you decide<br/>on your roof',40,678,530,cover)
    c.setFillColor(HexColor('#d2ef9e'));c.setFont('RoofBody',12)
    c.drawString(42,489,'OBSERVE. ASK. COMPARE.')
    text(c,g['subtitle'],42,465,485,ParagraphStyle('cover-sub',parent=body,fontSize=12,leading=18,textColor=PAPER))
    c.setFillColor(PAPER);c.rect(40,27,330,64,fill=1,stroke=0)
    c.setFillColor(INK);c.setFont('RoofHeading',17);c.drawString(54,65,'A clearer roofing conversation')
    c.setFont('RoofBody',10);c.drawString(54,45,'A place for your observations and next questions')
    c.showPage()
    base(c,2,sample);text(c,'A useful place to begin.',48,692,500,head)
    text(c,'You do not need to arrive with a diagnosis. This guide helps you collect observations, understand the questions behind a scope and prepare for a practical conversation about your home.',48,604,488,body)
    y=499
    for i,ch in enumerate(g['chapters']):
        c.setStrokeColor(TAN);c.line(48,y+13,564,y+13);c.setFont('RoofBody',11);c.setFillColor(INK);c.drawString(48,y-9,ch['title']);c.drawRightString(564,y-9,str(i+3));y-=48
    text(c,'Use the questions as notes for your own property. They do not establish its condition or promise a particular service, result or price.',48,155,480,body);c.showPage()
    for i,ch in enumerate(g['chapters']):
        base(c,i+3,sample);y=text(c,ch['title'],48,701,500,head)-25;y=text(c,ch['lead'],48,y,493,body)-22
        for p in ch['body']:y=text(c,p,48,y,493,body)-17
        c.setStrokeColor(TAN);c.line(48,y,564,y);y-=20
        for p in ch['notes']:y=text(c,'- '+p,55,y,486,body)-10
        y-=10;y=text(c,'A QUESTION TO KEEP',48,y,493,small)-9;y=text(c,ch['prompt'],48,y,493,body)-12
        assert y>66,(ch['title'],y)
        c.showPage()
    c.save();p=PdfReader(dest);assert len(p.pages)==8
    print(dest, len(p.pages),'pages',dest.stat().st_size,'bytes')
