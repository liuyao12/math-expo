// Independent exact arithmetic checks of the two coefficient tables. These
// verify transcription and rational calculation, not the analytic proofs.
import assert from 'node:assert/strict';
const gcd=(a,b)=>b?gcd(b,a%b):a<0n?-a:a;
const rat=(a,b=1n)=>{a=BigInt(a);b=BigInt(b);if(b<0n){a=-a;b=-b;}const g=gcd(a,b);return [a/g,b/g];};
const add=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]);
const div=(a,b)=>rat(a[0]*b[1],a[1]*b[0]);
const fac=n=>{let a=1n;for(let k=2n;k<=BigInt(n);k++)a*=k;return a;};
// Extract power sums directly by formal division: -s F'(s) / F(s).
// This uses the source power series, independently of the displayed tables.
function powerSums(coeffs,n){
 const q=[rat(0)];
 for(let m=1;m<=n;m++){
  let v=mul(rat(-m),coeffs(m));
  for(let j=1;j<m;j++)v=add(v,mul(rat(-1),mul(coeffs(j),q[m-j])));
  q[m]=v;
 }
 return q.slice(1);
}
const level=powerSums(j=>j%2?rat((-1)**((j+1)/2),fac(j)):rat(0),8);
assert.deepEqual(level,[[1n,1n],[1n,1n],[1n,2n],[1n,3n],[5n,24n],[2n,15n],[61n,720n],[17n,315n]]);
const even=powerSums(j=>rat((-1)**j,fac(2*j+1)),6);
assert.deepEqual(even,[[1n,6n],[1n,90n],[1n,945n],[1n,9450n],[1n,93555n],[691n,638512875n]]);
const odds=level.map((r,i)=>mul(r,rat(1,2n**BigInt(i+2)))); // L_m / pi^m
assert.deepEqual(odds,[[1n,4n],[1n,8n],[1n,32n],[1n,96n],[5n,1536n],[1n,960n],[61n,184320n],[17n,161280n]]);
const ratioFactors=[2,4,3,[16,5],[25,8],[192,61]].map(x=>Array.isArray(x)?rat(...x):rat(x));
assert.deepEqual(mul(rat(4),odds[0]),rat(1));
for(let i=1;i<=6;i++)assert.deepEqual(mul(ratioFactors[i-1],div(odds[i],odds[i-1])),rat(1));
const squareRatioFactors=[15,[21,2],10,[99,10],[6825,691]].map(x=>Array.isArray(x)?rat(...x):rat(x));
for(let i=1;i<=5;i++)assert.deepEqual(mul(squareRatioFactors[i-1],div(even[i],even[i-1])),rat(1));
for(let j=1;j<=4;j++)assert.deepEqual(odds[2*j-1],mul(rat(2n**BigInt(2*j)-1n,2n**BigInt(2*j)),even[j-1]));
assert.equal(6825n*93555n,638512875n);
console.log('Checked both Euler coefficient tables, eight odd-denominator sums, seven circumference identities, and five square-circumference ratios with exact rational arithmetic.');
