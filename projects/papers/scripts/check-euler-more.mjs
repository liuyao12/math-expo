import assert from 'node:assert/strict';
import {passagesProduct} from '../src/euler-1744.mjs';
import {passagesCircle,sineDecimals,cosineDecimals} from '../src/euler-1748-circle.mjs';
import {primeGrowthData} from '../src/figures-euler-more.mjs';
assert.deepEqual(passagesProduct.slice(1).map(r=>r.number),Array.from({length:19},(_,i)=>i+1));
assert.deepEqual(passagesCircle.map(r=>r.number),Array.from({length:17},(_,i)=>126+i));
assert.equal((passagesProduct.map(r=>r.text).join('').match(/class="source-corollary"/g)||[]).length,17);
// Generate the numerical table independently from its stated arithmetic conditions.
const powers=new Set();for(let a=2;a*a<=100000;a++)for(let q=a*a;q<=100000;q*=a)powers.add(q);
const expected=[];
for(let a=3;a**3-1<=100000;a+=2){if(powers.has(a))continue;for(let k=3;;k+=2){const q=a**k,sign=a%4===3?1:-1,denominator=q+sign;if(denominator>100000)break;expected.push([sign,denominator]);}}
expected.sort((a,b)=>a[1]-b[1]);
const table=passagesProduct.find(r=>r.number===4).text.split('id="e72-4-c4"')[1].split('id="e72-4-c5"')[0];
const actual=[...table.matchAll(/([+-])\\frac1\{(\d+)\}/g)].map(m=>[m[1]==='+'?1:-1,Number(m[2])]);
assert.deepEqual(actual,expected,'The full denominator table must follow the stated primitive-base rule');
const omega=n=>{let k=0;for(let p=2;p*p<=n;p++)while(n%p===0){k++;n/=p;}return k+(n>1?1:0);};
const signedTerms=s=>[...s.matchAll(/([+-]?)\\frac1(?:\{(\d+)\}|(\d))/g)].map(m=>[Number(m[2]??m[3]),m[1]==='-'?-1:1]);
for(const n of [15,17,18]){
 const first=passagesProduct.find(r=>r.number===n).text.match(/\\\[([\s\S]*?)\\\]/)[1];
 for(const [d,sign] of signedTerms(first)){
  const lambda=omega(d)%2?-1:1,chi=d%4===1?1:-1;
  assert.equal(sign,n===18?lambda:lambda*chi,`Multiplicative sign error in theorem ${n} at ${d}`);
  if(n===17)assert.equal(omega(d)%2,0,'Theorem 17 keeps only an even number of prime factors');
 }
}
const odd=passagesProduct.find(r=>r.number===17).text.split('id="e72-17-c1"')[1];
for(const [d,sign] of signedTerms(odd))assert.equal(sign,d%4===3?1:-1,`Odd-factor corollary sign at ${d}`);
// Independently bound pi using Machin's identity. Its tangent identity is
// checked by exact rational arithmetic; 0 < 4 atan(1/5)-atan(1/239) < 1 fixes
// the quadrant. This does not reuse the chapter's two-arctangent computation.
const gcd=(a,b)=>{a=a<0n?-a:a;while(b){[a,b]=[b,a%b];}return a;};
const r=(a,b=1n)=>{if(b<0n){a=-a;b=-b;}const g=gcd(a,b);return [a/g,b/g];};
const add=(a,b)=>r(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>r(a[0]*b[0],a[1]*b[1]);
const neg=a=>[-a[0],a[1]],sub=(a,b)=>add(a,neg(b));
const div=(a,b)=>mul(a,r(b[1],b[0]));
const pow=(a,k)=>r(a[0]**BigInt(k),a[1]**BigInt(k));
const tangentSum=(a,b)=>div(add(a,b),sub(r(1n),mul(a,b)));
const t=r(1n,5n),t2=tangentSum(t,t),t4=tangentSum(t2,t2);
assert.deepEqual(tangentSum(t4,r(-1n,239n)),r(1n));
function atan(q,M){let value=r(0n);for(let k=0;k<M;k++)value=add(value,r(k%2?-1n:1n,BigInt(2*k+1)*BigInt(q)**BigInt(2*k+1)));return {value,error:r(1n,BigInt(2*M+1)*BigInt(q)**BigInt(2*M+1))};}
const a=atan(5,40),b=atan(239,40),pi= sub(mul(r(16n),a.value),mul(r(4n),b.value));
const piError=add(mul(r(16n),a.error),mul(r(4n),b.error)),lo=sub(pi,piError),hi=add(pi,piError);
const less=(a,b)=>a[0]*b[1]<b[0]*a[1],decimal=s=>r(BigInt(s.replace('.','')),10n**BigInt(s.split('.')[1].length));
const tol=r(1n,10n**24n);
for(const [values,start] of [[sineDecimals,1],[cosineDecimals,0]])for(const [j,value] of values.entries()){
 const k=start+2*j;let fact=1n;for(let n=2;n<=k;n++)fact*=BigInt(n);
 const lower=div(pow(div(lo,r(2n)),k),r(fact)),upper=div(pow(div(hi,r(2n)),k),r(fact)),v=decimal(value);
 assert.ok(!less(v,sub(lower,tol))&&!less(add(upper,tol),v),`Source coefficient at degree ${k} differs by more than 10^-24`);
}
// These quotient signs were defective in the available chapter transcription.
for(const [a,b] of [[.3,.8],[1.1,-.4],[-.9,.2]]){
 const A=(a+b)/2,B=(a-b)/2;
 assert.ok(Math.abs(Math.cos(a)-Math.cos(b)+2*Math.sin(A)*Math.sin(B))<1e-14);
 assert.ok(Math.abs((Math.sin(a)+Math.sin(b))/(Math.cos(b)-Math.cos(a))-1/Math.tan(B))<1e-12);
}
for(const x of [10,100,1000]){
 let sum=0;for(let n=2;n<=x;n++){let prime=true;for(let d=2;d*d<=n;d++)if(n%d===0){prime=false;break;}if(prime)sum+=1/n;}
 assert.ok(Math.abs(primeGrowthData.find(d=>d.x===x).sum-sum)<1e-13);
}
console.log(`Checked ${actual.length} perfect-power table terms, multiplicative signs, 31 decimal coefficients against rational pi bounds, corrected trigonometric signs, and independently counted prime-sum samples.`);
