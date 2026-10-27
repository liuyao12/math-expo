// Finite Riemann explicit formula; branch-preserving complex Ei contributions.
// E1 continued fraction: DLMF 8.9; Ei/E1 relations: DLMF 6.2.
export const MAX_X=100;
export const MOBIUS_TERMS=6; // 2^6 <= 100 < 2^7; keep this fixed across the plot.
const GAMMA=0.5772156649015328606,LOG2=Math.log(2);
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const inv=a=>{const d=a[0]*a[0]+a[1]*a[1];return[a[0]/d,-a[1]/d];};
export function e1Complex(re,im=0){
 if(im===0&&re<=0)throw new RangeError('Use E1 off its negative-real cut.');
 let b=[re+1,im],c=[1e30,0],d=inv(b),h=[...d];
 for(let k=1;k<=1500;k++){
  const a=-k*k;b=[b[0]+2,b[1]];
  d=inv([a*d[0]+b[0],a*d[1]+b[1]]);
  const ic=inv(c);c=[b[0]+a*ic[0],b[1]+a*ic[1]];
  const delta=mul(c,d);h=mul(h,delta);
  if(Math.hypot(delta[0]-1,delta[1])<2e-15){const amp=Math.exp(-re);return mul(h,[amp*Math.cos(im),-amp*Math.sin(im)]);}
 }
 throw new Error('E1 continued fraction did not converge in the supported window.');
}
export function eiReal(u){
 if(!(u>0))throw new RangeError('This reading uses positive logarithms.');
 let term=1,sum=0;
 for(let k=1;k<160;k++){term*=u/k;const add=term/k;sum+=add;if(Math.abs(add)<1e-16*Math.max(1,Math.abs(sum)))break;}
 return GAMMA+Math.log(u)+sum;
}
export function e1Real(u){
 if(!(u>0))throw new RangeError('E1 needs a positive real input here.');
 if(u>1)return e1Complex(u,0)[0];
 let term=1,sum=0;
 for(let k=1;k<160;k++){term*=-u/k;const add=term/k;sum+=add;if(Math.abs(add)<1e-16*Math.max(1,Math.abs(sum)))break;}
 return -GAMMA-Math.log(u)-sum;
}
export function trivialCorrection(logx){
 // Integral from x to infinity of 1/[t(t^2-1)log(t)], by positive E1 terms.
 if(!(logx>0))throw new RangeError('The explicit formula needs x > 1.');
 let sum=0;
 for(let k=1;k<2000;k++){
  sum+=e1Real(2*k*logx);
  const next=2*(k+1)*logx;
  if(Math.exp(-next)/(next*(-Math.expm1(-2*logx)))<2e-14)return sum;
 }
 throw new Error('Trivial-zero correction did not converge.');
}
export function zeroPair(logx,gamma){
 // Re Ei((1/2+i gamma)log x) = -Re E1(-(1/2+i gamma)log x).
 // The paired imaginary branch constants cancel. Never take log(x^rho).
 return -2*e1Complex(-logx/2,-gamma*logx)[0];
}
export function mobius(n){
 let factors=0;
 for(let p=2;p*p<=n;p++)if(n%p===0){n/=p;factors++;if(n%p===0)return 0;}
 if(n>1)factors++;
 return factors%2?-1:1;
}
export function weightedBase(logx){return eiReal(logx)-LOG2+trivialCorrection(logx);}
export function approximation(x,count,zeros,mode='pi'){
 if(!(x>=2&&x<=MAX_X)||!Number.isInteger(count)||count<0||count>zeros.length)throw new RangeError('Outside the supported finite exhibit.');
 const terms=mode==='f'?1:MOBIUS_TERMS;let value=0;
 for(let m=1;m<=terms;m++){
  const weight=mobius(m)/m;if(!weight)continue;
  const u=Math.log(x)/m;let f=weightedBase(u),compensation=0;
  for(let j=0;j<count;j++){const term=-zeroPair(u,zeros[j])-compensation,next=f+term;compensation=(next-f)-term;f=next;}
  value+=weight*f;
 }
 return value;
}
export const primes=Object.freeze(Array.from({length:99},(_,i)=>i+2).filter(n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}));
export const primePowers=Object.freeze(primes.flatMap(p=>{const a=[];for(let k=1,n=p;n<=MAX_X;k++,n*=p)a.push({x:n,weight:1/k});return a;}).sort((a,b)=>a.x-b.x));
export function jumps(mode='pi'){return mode==='f'?primePowers:primes.map(x=>({x,weight:1}));}
export function exactCount(x,mode='pi',midpoint=true){
 let value=0;for(const jump of jumps(mode)){if(jump.x<x)value+=jump.weight;else if(jump.x===x)value+=jump.weight*(midpoint?.5:1);}
 return value;
}
export function countLabel(n){return n+' conjugate '+(n===1?'pair':'pairs')+' · '+(2*n)+' zeros';}

export async function buildCurves(zeros,{samples=2401,onProgress=()=>{}}={}){
 const xs=Float64Array.from({length:samples},(_,i)=>Math.exp(Math.log(2)+i/(samples-1)*Math.log(50)));
 xs[0]=2;xs[samples-1]=100;
 const f=new Float64Array((zeros.length+1)*samples),pi=new Float64Array(f.length);
 for(let i=0;i<samples;i++){
  const u=Math.log(xs[i]);f[i]=weightedBase(u);let p=f[i];
  for(const m of [2,3,5,6])p+=mobius(m)/m*weightedBase(u/m);
  pi[i]=p;
  if(i%160===0)await new Promise(r=>setTimeout(r,0));
 }
 onProgress(0);
 for(let n=1;n<=zeros.length;n++){
  const at=n*samples,previous=at-samples,gamma=zeros[n-1];
  for(let i=0;i<samples;i++){
   const u=Math.log(xs[i]),c=zeroPair(u,gamma);let delta=c;
   for(const m of [2,3,5,6])delta+=mobius(m)/m*zeroPair(u/m,gamma);
   f[at+i]=f[previous+i]-c;pi[at+i]=pi[previous+i]-delta;
  }
  if(n%5===0){onProgress(n);await new Promise(r=>setTimeout(r,0));}
 }
 return{xs,f,pi,samples,pairs:zeros.length};
}


