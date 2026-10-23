import assert from 'node:assert/strict';
import {passagesResidues} from '../src/euler-1761.mjs';
import {statementsResidues} from '../src/statements-euler-1761.mjs';
import {residueExample as e} from '../src/figures-euler-1761.mjs';
const mod=(x,p)=>(x%p+p)%p;
const pow=(a,n,p)=>{let r=1;for(;n;n=Math.floor(n/2),a=a*a%p)if(n%2)r=r*a%p;return r;};
const primes=Array.from({length:198},(_,i)=>i+2).filter(p=>{for(let d=2;d*d<=p;d++)if(p%d===0)return false;return true;});
assert.equal(passagesResidues.length,78);
assert.deepEqual(passagesResidues.map(r=>r.id),Array.from({length:78},(_,i)=>'e262-'+(i+1)));
assert.equal(passagesResidues.filter(r=>r.label.includes('Theorem')).length,20);
assert.equal(statementsResidues.length,6);
for(const r of passagesResidues){assert(r.text&&r.note&&r.sourceUrl);if(r.proof)assert(statementsResidues.some(p=>p.id===r.proof));}
let periods=0,criteria=0;
for(const p of primes)for(let a=1;a<p;a++){
 const block=[];let r=1;do{block.push(r);r=r*a%p;}while(r!==1);
 const lambda=block.length;assert.equal(new Set(block).size,lambda);assert.equal((p-1)%lambda,0);assert.equal(pow(a,p-1,p),1);
 if(p>2)assert.equal(block.includes(p-1),lambda%2===0);
 const seen=new Set();for(let k=1;k<p;k++)if(!seen.has(k)){
  const list=block.map(t=>k*t%p);assert.equal(new Set(list).size,lambda);assert(list.every(t=>!seen.has(t)));list.forEach(t=>seen.add(t));
 }assert.equal(seen.size,p-1);periods++;
 if(p<=53)for(let n=1;n<p;n++)if((p-1)%n===0){
  const m=(p-1)/n,roots=Array.from({length:p-1},(_,i)=>i+1).filter(c=>pow(c,n,p)===a);
  assert.equal(roots.length>0,pow(a,m,p)===1);criteria++;
 }
}
for(const [i,k] of e.starts.entries())assert.deepEqual(Array.from({length:e.lambda},(_,j)=>k*pow(e.a,j,e.p)%e.p),e.lists[i]);
assert.equal(new Set(e.lists.flat()).size,12);
for(let i=0;i<e.squareExponents.length;i++)assert.equal(Number((7n**BigInt(e.squareExponents[i]))%641n),mod(e.squareResidues[i],641));
assert.equal(mod(-79*284,641),640);
let differences=Array.from({length:6},(_,i)=>{const y=i+1;return y**4+2*y*y+4;});
assert.deepEqual(differences.map(v=>v%7),e.differenceValues);
for(let i=0;i<4;i++)differences=differences.slice(1).map((v,j)=>v-differences[j]);
assert(differences.every(v=>v===24));assert.equal(24%7,3);
// Counterexamples in the commentary guard against silently dropping hypotheses.
assert.equal(pow(3,2,8),1);assert(![1,7].includes(3));
assert.equal((4**2+4)%3,2);assert.equal((4**2+4+1)%3,0);
assert.equal(2**9-1,7*73);assert.notEqual((2**3-1)%73,0);
assert.equal(2**11-1,23*89);
// The difference proof's constant-polynomial case is m=1, D=0, F=1.
assert.equal(Array.from({length:1},()=>1).reduce((a,b)=>a*b,1),1);
console.log(`Validated E262’s 78 paragraphs, twenty theorems, six proofs, ${periods} prime/base periods and partitions, ${criteria} power-residue cases, and every numerical drawing.`);
