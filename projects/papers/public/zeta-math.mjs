// Numerical visual commentary, not a proof or interval-arithmetic certificate.
// Euler–Maclaurin: DLMF 25.2(iii). Left half-plane: DLMF 25.4.2.
const PI=Math.PI,TAU=2*PI;
const bernoulli=[[1,6],[-1,30],[1,42],[-1,30],[5,66],[-691,2730],[7,6],[-3617,510],[43867,798],[-174611,330],[854513,138],[-236364091,2730]];
let factorial=1;
const coefficients=bernoulli.map(([a,b],k)=>{for(let n=2*k+1;n<=2*k+2;n++)factorial*=n;return a/b/factorial;});
const logs=Array.from({length:257},(_,n)=>Math.log(n||1));
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const div=(a,b)=>{const d=b[0]*b[0]+b[1]*b[1];return[(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];};
const log=z=>[Math.log(Math.hypot(...z)),Math.atan2(z[1],z[0])];
const exp=z=>{const r=Math.exp(z[0]);return[r*Math.cos(z[1]),r*Math.sin(z[1])];};
const lanczos=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
function logGammaRight(re,im){
 const z=[re-1,im];let x=[lanczos[0],0];
 for(let i=1;i<lanczos.length;i++){const q=div([lanczos[i],0],[z[0]+i,z[1]]);x[0]+=q[0];x[1]+=q[1];}
 const t=[z[0]+7.5,z[1]],w=mul([z[0]+.5,z[1]],log(t)),lx=log(x);
 return[.5*Math.log(2*PI)+w[0]-t[0]+lx[0],w[1]-t[1]+lx[1]];
}
function eulerMaclaurin(re,im,N,M){
 let sr=0,si=0,cr=0,ci=0;
 for(let n=1;n<N;n++){
  const l=logs[n]??Math.log(n),amp=Math.exp(-re*l),angle=-im*l;
  const yr=amp*Math.cos(angle)-cr,yi=amp*Math.sin(angle)-ci,tr=sr+yr,ti=si+yi;
  cr=(tr-sr)-yr;ci=(ti-si)-yi;sr=tr;si=ti;
 }
 const ln=logs[N]??Math.log(N),a=Math.exp(-re*ln),phase=-im*ln,z=[a*Math.cos(phase),a*Math.sin(phase)];
 const tail=div([N*z[0],N*z[1]],[re-1,im]);sr+=tail[0]+z[0]/2;si+=tail[1]+z[1]/2;
 let rising=[re,im],power=[z[0]/N,z[1]/N];
 for(let k=0;k<M;k++){
  const term=mul(rising,power),c=coefficients[k];sr+=c*term[0];si+=c*term[1];
  rising=mul(mul(rising,[re+2*k+1,im]),[re+2*k+2,im]);power=[power[0]/(N*N),power[1]/(N*N)];
 }
 return[sr,si];
}
export function zeta(re,im,{terms=32,corrections=12}={}){
 if(!Number.isFinite(re)||!Number.isFinite(im))return {kind:'unavailable',re:NaN,im:NaN};
 if(re===1&&im===0)return {kind:'pole',re:Infinity,im:0};
 if(im===0&&re<0&&Number.isInteger(re/2))return {kind:'value',re:0,im:0};
 if(re===0&&im===0)return {kind:'value',re:-.5,im:0};
 let v;
 if(re<-.5){
  const w=eulerMaclaurin(1-re,-im,terms,corrections),x=PI*re/2,y=PI*im/2;
  const ls=log([Math.sin(x)*Math.cosh(y),Math.cos(x)*Math.sinh(y)]),lg=logGammaRight(1-re,-im);
  const chi=exp([re*Math.log(2)+(re-1)*Math.log(PI)+ls[0]+lg[0],im*Math.log(2*PI)+ls[1]+lg[1]]);v=mul(chi,w);
 }else v=eulerMaclaurin(re,im,terms,corrections);
 return {kind:'value',re:v[0],im:im===0?0:v[1]};
}
function hueRgb(p,q,t){t=(t%1+1)%1;if(t<1/6)return p+(q-p)*6*t;if(t<.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}
export function domainColor(re,im,contours=true){
 const mag=Math.hypot(re,im);if(mag===0)return[0,0,0];if(!Number.isFinite(mag))return[255,255,255];
 const h=(Math.atan2(im,re)/TAU+1)%1,s=.78;
 let l=1/(1+Math.exp(-.48*Math.log(mag)));
 if(contours){const ring=Math.pow(.5+.5*Math.cos(TAU*Math.log2(mag)),14);l=Math.max(0,l-.075*ring);}
 const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
 return[hueRgb(p,q,h+1/3),hueRgb(p,q,h),hueRgb(p,q,h-1/3)].map(v=>Math.round(255*v));
}
export const squareView=Object.freeze({xmin:-4,xmax:4,ymin:-4,ymax:4});
export const firstZerosView=Object.freeze({xmin:-1,xmax:2,ymin:10,ymax:27});
export const computedBounds=Object.freeze({xmin:-4,xmax:4,ymin:-32,ymax:32});
export function clampView(view){
 let width=Math.min(8,Math.max(.125,view.xmax-view.xmin)),height=Math.min(64,Math.max(.125,view.ymax-view.ymin));
 const x=Math.max(-4+width/2,Math.min(4-width/2,(view.xmin+view.xmax)/2)),y=Math.max(-32+height/2,Math.min(32-height/2,(view.ymin+view.ymax)/2));
 return {xmin:x-width/2,xmax:x+width/2,ymin:y-height/2,ymax:y+height/2};
}
export function zoomView(view,factor,center){const c=center??[(view.xmin+view.xmax)/2,(view.ymin+view.ymax)/2];return clampView({xmin:c[0]+(view.xmin-c[0])*factor,xmax:c[0]+(view.xmax-c[0])*factor,ymin:c[1]+(view.ymin-c[1])*factor,ymax:c[1]+(view.ymax-c[1])*factor});}
export function pointAt(px,py,width,height,view){return [view.xmin+px/width*(view.xmax-view.xmin),view.ymax-py/height*(view.ymax-view.ymin)];}
export function allowedByStage(re,stage){return stage!=='series'||re>1;}
export const scenes=[
 {id:'series',anchor:'euler-product',name:'Defining series',caption:'The series and Euler product define the function on the right of the boundary. The rest of the picture waits for continuation.',formula:String.raw`\(\operatorname{Re}s>1\)`,strip:false},
 {id:'continuation',anchor:'continued-zeta',name:'Analytic continuation',caption:'The continued function fills the visible window. The simple pole is white; the negative even zeros are dark centers.',formula:String.raw`\(\zeta(s),\quad s\ne1\)`,strip:false},
 {id:'reflection',anchor:'functional-equation',name:'Functional equation',caption:'The paired inputs are related by gamma and sine factors. Their zeta values need not be equal.',formula:String.raw`\(s\longleftrightarrow1-s\)`,strip:false,reflect:true},
 {id:'zeros',anchor:'zero-count',name:'The critical strip',caption:'The strip and its middle line are marked. The square window is below the first nontrivial zero; use “First zeros” to look higher.',formula:String.raw`\(0<\operatorname{Re}s<1\)`,strip:true},
 {id:'conjecture',anchor:'hypothesis',name:'Riemann’s conjecture',caption:'The conjecture places every nontrivial zero on the middle line. A finite numerical picture does not establish this claim.',formula:String.raw`\(\operatorname{Re}s=\tfrac12\)`,strip:true},
 {id:'primes',anchor:'prime-count',name:'Zeros and prime counting',caption:'The text now uses zeros in the prime-counting argument. This panel continues to show zeta in the complex plane.',formula:String.raw`\(s=\sigma+it\)`,strip:true}
];
export function sceneAt(positions,trigger){let index=0;for(let i=0;i<positions.length;i++)if(positions[i]<=trigger)index=i;return scenes[index];}
export const firstZeros=[14.134725141734693,21.022039638771555,25.01085758014569];
