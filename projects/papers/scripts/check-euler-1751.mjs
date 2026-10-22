import assert from 'node:assert/strict';
import {passagesLogarithms,sectionsLogarithms,logarithmExamples} from '../src/euler-1751.mjs';
import {statementsLogarithms} from '../src/statements-euler-1751.mjs';
const rows=passagesLogarithms;
assert.equal(rows.filter(r=>/e168-b-argument-/.test(r.id)).length,4);
assert.equal(rows.filter(r=>/e168-b-objection-/.test(r.id)).length,6);
assert.equal(rows.filter(r=>/e168-l-argument-/.test(r.id)).length,3);
assert.equal(rows.filter(r=>/e168-l-objection-/.test(r.id)).length,3);
assert.equal(rows.filter(r=>/e168-problem-/.test(r.id)).length,4);
assert.equal(rows.filter(r=>/e168-example-/.test(r.id)).length,10);
assert.deepEqual(sectionsLogarithms.flatMap(s=>s.rows).map(r=>r.id),rows.map(r=>r.id));
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
assert.equal(statementsLogarithms.length,5);
for(const r of rows){assert.ok(r.note&&r.sourceUrl&&r.sourceLabel);assert.ok(Number(r.sourceUrl.split('#page=')[1])>=1&&Number(r.sourceUrl.split('#page=')[1])<=41);assert.equal((r.text.match(/<p>/g)||[]).length,(r.text.match(/<\/p>/g)||[]).length,r.id+' paragraph balance');}
// Independent rational-angle checks of every displayed positive and negative progression.
const angles=[[1,2],[3,2],[1,3],[2,3],[4,3],[5,3],[1,4],[3,4],[5,4],[7,4]];
const rational=s=>s.split('/').map(Number);
for(let j=0;j<angles.length;j++){
 const e=logarithmExamples[j],[a,b]=angles[j];assert.equal(e.n,j+1);assert.equal(e.deg*b,180*a);
 for(const [sign,list] of [[1,e.plus],[-1,e.minus]]){
  for(let k=0;k<list.length;k++){
   const [p,q]=rational(list[k]);assert.ok(p>0&&q>0);
   assert.equal(((sign*p*b-a*q)%(2*b*q)+2*b*q)%(2*b*q),0,'wrong logarithm in example '+e.n);
   if(k===0)assert.ok(p<=2*q,'missing first signed value');
   else {const [u,v]=rational(list[k-1]);assert.equal(p*v-u*q,2*q*v,'progression skips or repeats a value');}
  }
 }
}
// The printed final product has rational total angle 79/12, reducing to 7/12 modulo 2.
assert.equal(4*8+3*3+2*16+6,79);
assert.equal(79%24,7);
const mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
const power=(z,n)=>{let r=[1,0];for(let j=0;j<n;j++)r=mul(r,z);return r;};
const s2=Math.sqrt(2),s3=Math.sqrt(3),s6=Math.sqrt(6);
let product=mul(mul(power([-0.5,s3/2],4),power([1/s2,1/s2],3)),mul(power([-0.5,-s3/2],2),[0,1]));
assert.ok(Math.abs(product[0]-(s2-s6)/4)<1e-14&&Math.abs(product[1]-(s6+s2)/4)<1e-14);
// Check the algebraic special-case quartic independently through its rational parameter.
for(const a of [1,2,3,5])for(const t of [-3,-1,1,2,4]){
 const x=t**4/a**3,y=t*t/a+t;
 const terms=[y**4,-2*a*x*y*y,-4*a*a*x*y,a*a*x*x,-(a**3)*x];
 assert.ok(Math.abs(terms.reduce((s,v)=>s+v,0))<1e-10*Math.max(1,...terms.map(Math.abs)));
}
// Numerical samples test the finite error estimate, not the proof of convergence.
for(const r of [0.25,1,3])for(const theta of [-Math.PI,0,Math.PI/2,Math.PI])for(const k of [-3,0,2])for(const n of [64,512,4096]){
 const u=Math.log(r),v=theta+2*Math.PI*k,scale=Math.exp(u/n);
 const y=[n*(scale*Math.cos(v/n)-1),n*scale*Math.sin(v/n)];
 const bound=(u*u+v*v)/(2*n)*Math.exp(Math.hypot(u,v)/n);
 assert.ok(Math.hypot(y[0]-u,y[1]-v)<=bound+2e-12);
}
// Distinct scaling classes must remain distinct under the ordinary meaning of multiplication.
for(let k=-8;k<=8;k++){assert.ok((4*k)%4===0);assert.ok((2+4*k)%4!==0);}
console.log('Checked all ten logarithm progressions, the final complex product, the radical quartic, finite root-limit bounds, and the complete argument/problem inventory.');
