// Reviewed creative configuration. Future trade pages opt in explicitly.
export const tradeMotion = {
 roofing: {
  label:'Roof', poster:'/assets/trade-motion/roofing-house-still.webp', photo:true,
  media:{desktop:'/assets/trade-motion/roofing-drone-dive-16x9.mp4',desktopWebm:'/assets/trade-motion/roofing-drone-dive-16x9.webm',mobile:'/assets/trade-motion/roofing-drone-dive-9x16.mp4',mobileWebm:'/assets/trade-motion/roofing-drone-dive-9x16.webm',sequence:[],foreground:'/assets/trade-motion/roofing-house-cutout.webp',maskSequence:[],blendSeconds:.3},
  // Normalized scroll time and shared camera transform. Anchors live in scene space.
  camera:[{t:0,x:0,y:380,scale:.62},{t:.22,x:-25,y:240,scale:.8},{t:.5,x:-60,y:80,scale:1},{t:.76,x:-110,y:-55,scale:1.28},{t:1,x:0,y:0,scale:1}],
  mobileChapters:['Above the neighborhood','Toward the roof','At the roofline','Your home in view','A closer look at home'],
  chapters:['Open sky','Through the clouds','Your neighborhood','At the roofline','A closer look at home'],
  points:[
   {id:'flashing',anatomy:{x:718,y:360},label:'Flashing',x:730,y:398,failure:'Gaps at roof joints can let water in.',repair:'Seal the joint with compatible flashing.'},
   {id:'underlayment',anatomy:{x:575,y:421},label:'Underlayment',x:397,y:339,failure:'A torn barrier can let moisture reach the deck.',repair:'Restore the protective layer below the shingles.'},
   {id:'valley',anatomy:{x:475,y:388},label:'Valley',x:491,y:349,failure:'Debris or worn seams can divert runoff.',repair:'Restore a clear, watertight drainage channel.'},
   {id:'ridge',anatomy:{x:580,y:293},label:'Ridge vent',x:748,y:334,failure:'Loose caps can expose the highest roof seam.',repair:'Secure the caps and check the ventilation path.'}
  ],
  layers:['Shingles','Underlayment','Decking','Flashing','Gutters'],
  wireframe:{kind:'roof',path:'M718 360 L665 395 L595 432 L555 480 L555 558'},
  meter:{ageLabel:'Roof age',ageMax:40,damageLabel:'Visible damage',damageLabels:['One area','Several areas','Widespread'],ageWeight:.45,damageWeight:.55},
  processChips:['First contact','Inspection discussion','Before approval','Agreed schedule']
 },
 // Configuration examples only; later trade tickets supply art and enable pages.
 hvac:{label:'Airflow',wireframe:{kind:'ductwork',path:'M250 480 H500 V330 H760'},layers:['Supply','Return','Filter'],points:[],meter:{ageLabel:'System age',ageMax:25,damageLabel:'Affected rooms',damageLabels:['One','Several','All'],ageWeight:.4,damageWeight:.6}},
 plumbing:{label:'Pipe runs',wireframe:{kind:'pipes',path:'M260 300 V520 H650 V360 H780'},layers:['Supply','Drain','Vent'],points:[],meter:{ageLabel:'Pipe age',ageMax:60,damageLabel:'Affected fixtures',damageLabels:['One','Several','All'],ageWeight:.3,damageWeight:.7}}
};

// #004H: reusable component token sets. Colors are checked when rendered.
export const roofingMotionStyles={
 'bold-industrial':{name:'bold-industrial',surface:'#142f31',ink:'#f5f5e9',muted:'#c9d4c8',accent:'#daed91',line:'#58706c',radius:2},
 'clean-modern':{name:'clean-modern',surface:'#f4f6f2',ink:'#183d3b',muted:'#4b6460',accent:'#285c4d',line:'#b5c6bd',radius:22}
};
