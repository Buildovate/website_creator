// Deterministic five-frame signal; this detects change, not semantic truth.
// The subject region is the central 80% of each frame, downscaled to 96 x 64.
export function frameMetrics(a,b,width=96,height=64){
 if(a.length!==width*height*4||b.length!==a.length)throw Error('Expected same-sized RGBA frames');
 const gray=p=>.2126*p[0]+.7152*p[1]+.0722*p[2],ha=new Float64Array(64),hb=new Float64Array(64);let sum=0,windows=0;
 for(let y=0;y<height;y+=8)for(let x=0;x<width;x+=8){
  const ga=[],gb=[];for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){const i=((y+dy)*width+x+dx)*4,p=a.slice(i,i+3),q=b.slice(i,i+3);ga.push(gray(p));gb.push(gray(q));ha[(p[0]>>6)*16+(p[1]>>6)*4+(p[2]>>6)]++;hb[(q[0]>>6)*16+(q[1]>>6)*4+(q[2]>>6)]++}
  const ma=ga.reduce((s,v)=>s+v,0)/64,mb=gb.reduce((s,v)=>s+v,0)/64;let va=0,vb=0,cov=0;
  for(let i=0;i<64;i++){va+=(ga[i]-ma)**2;vb+=(gb[i]-mb)**2;cov+=(ga[i]-ma)*(gb[i]-mb)}va/=63;vb/=63;cov/=63;
  sum+=((2*ma*mb+6.5025)*(2*cov+58.5225))/((ma*ma+mb*mb+6.5025)*(va+vb+58.5225));windows++;
 }
 const ssim=sum/windows,histogramDistance=ha.reduce((s,v,i)=>s+Math.abs(v-hb[i]),0)/(2*width*height);
 return {ssim:+ssim.toFixed(6),histogramDistance:+histogramDistance.toFixed(6)};
}
// A cross-dissolve between different structures can have moderate pairwise SSIM.
// Measure whether all three intermediate frames are explained by the same
// pixelwise interpolation of the endpoints. Camera motion does not normally
// satisfy this temporal constraint. This is a change signal, not an AI judgment.
export function morphMetrics(frames){
 const first=frames[0],last=frames[4];let error=0,change=0;
 for(let f=1;f<=3;f++){const t=f/4;for(let i=0;i<first.length;i++){if(i%4===3)continue;const delta=last[i]-first[i],predicted=first[i]+delta*t;error+=(frames[f][i]-predicted)**2;change+=delta**2;}}
 return {interpolationResidual:change?+Math.sqrt(error/change).toFixed(6):1,endpointChange:frameMetrics(first,last)};
}
