import assert from 'node:assert/strict';
import fs from 'node:fs';
import {worksPoincare,englishPoincare,poincareSeries,citationsPoincare,conceptsPoincare} from '../src/poincare-catalog.mjs';
import {passagesPoincare,proofsPoincare} from '../src/poincare-1892.mjs';

const dist=new URL('../dist/',import.meta.url);
assert.equal(worksPoincare.length,7);
assert.equal(new Set(worksPoincare.map(w=>w.id)).size,7);
assert.deepEqual(worksPoincare.map(w=>w.year),[1892,1895,1899,1900,1902,1902,1904]);
assert.equal(worksPoincare.filter(w=>w.edition).length,1);
for(const work of worksPoincare){
 const html=fs.readFileSync(new URL(work.id+'/index.html',dist),'utf8');
 assert(html.includes('id="work-series"'));
 for(const sibling of poincareSeries)if(sibling.id!==work.id)assert(html.includes(`href="../${sibling.id}/"`));
 const english=englishPoincare[work.id];
 assert.equal(english.translator,'John Stillwell');
 assert.equal(english.year,2009);
 assert(english.note.includes('2010'));
 assert(english.url.endsWith('#page='+({1892:19,1895:22,1899:104,1900:145,1904:224}[work.year]??(work.id.endsWith('surfaces')?174:191))));
}
assert.equal(citationsPoincare.length,8);
const html=fs.readFileSync(new URL('poincare-1892/index.html',dist),'utf8');
assert.equal(passagesPoincare.length,12);
for(const row of passagesPoincare)assert(html.includes(`id="${row.id}"`));
for(const proof of proofsPoincare){assert(html.includes(`id="${proof.id}"`));assert(html.includes(`href="#${proof.id}"`));}
assert.equal((html.match(/<figure /g)||[]).length,2);
for(const concept of conceptsPoincare)assert(html.includes(`concepts/${concept.id}/`));
for(const safeguard of ['The converse is too broad','Invariant functions do not automatically embed','always quadruple','not a silent replacement','not been collated line by line','without proof-assistant verification'])assert(html.includes(safeguard));
const profile=fs.readFileSync(new URL('people/picard/index.html',dist),'utf8');
assert(profile.includes('../../poincare-1892/#p92-betti'));

const det=([a,b,c,d])=>a*d-b*c;
const mul=([a,b,c,d],[e,f,g,h])=>[a*e+b*g,a*f+b*h,c*e+d*g,c*f+d*h];
const act=([a,b,c,d],[x,y])=>[a*x+b*y,c*x+d*y];
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const power=(A,k)=>{if(k<0){A=[A[3],-A[1],-A[2],A[0]];k=-k;}let p=[1,0,0,1];for(let j=0;j<k;j++)p=mul(p,A);return p;};
let checked=0;
for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++)for(let c=-4;c<=4;c++)for(let d=-4;d<=4;d++){
 const A=[a,b,c,d];if(det(A)!==1)continue;
 const D=[a-1,b,c,d-1];
 assert.equal(det(D),2-a-d);
 // Independent elimination/rank test versus the announced three cases.
 const rank=det(D)!==0?2:D.some(Boolean)?1:0;
 const kernel=a+d!==2?0:A.join(',')==='1,0,0,1'?2:1;
 assert.equal(2-rank,kernel);
 for(const k of [-2,-1,0,1,2]){
  const l=1-k,m=[2,-3],n=[-1,4],q=[3,5];
  const nested=add(act(power(A,k),add(act(power(A,l),q),n)),m);
  const composed=add(act(power(A,k+l),q),add(m,act(power(A,k),n)));
  assert.deepEqual(nested,composed);
 }
 checked++;
}
assert.equal(det([2,1,1,1]),1);assert.equal(det([3,1,2,1]),1);
assert.equal(det([1,1,1,0]),-1);assert.equal(Math.abs(det([2,1,2,0])),2);
// The two column relations in the second example leave exactly a parity class.
for(let u=-8;u<=8;u++)for(let v=-8;v<=8;v++){
 const belongs=v%2===0;
 const second=v/2,first=u-2*second;
 assert.equal(Number.isInteger(second)&&Number.isInteger(first),belongs);
}
console.log(`Validated the seven-work Poincaré sequence, complete 1892 note, source-page links, eight citations, two scoped references, and ${checked} exact matrix cases with affine composition and torsion checks.`);
