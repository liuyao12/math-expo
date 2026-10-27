import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {passagesCartanWeights,sectionsCartanWeights} from '../src/cartan-1913-weights.mjs';
import {proofsCartan1913} from '../src/statements-cartan-1913.mjs';
import {fundamentalWeightCoordinates as P,fundamentalLabels,exceptionalWeightOrbits} from '../src/cartan-1913-weight-data.mjs';
import {cartanWeightDrawingData} from '../src/figures-cartan-1913.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const html=read('dist/cartan-1913/index.html'),meta=JSON.parse(read('src/cartan-1913-source.json')),ocr=read('src/'+meta.sourceFile),data=JSON.parse(read('dist/catalog.json'));
assert.deepEqual(passagesCartanWeights.map(r=>r.n),Array.from({length:35},(_,i)=>i+1));assert.equal(sectionsCartanWeights.length,13);
assert.deepEqual(sectionsCartanWeights.flatMap(s=>s.rows.map(r=>r.id)),passagesCartanWeights.map(r=>r.id));
assert.deepEqual(meta.translationInventory.numberedParagraphs,passagesCartanWeights.map(r=>r.n));assert.equal(meta.sectionIntervals.length,13);
for(const span of meta.sectionIntervals)assert.equal(hash(ocr.slice(span.start,span.end)),span.sha256);
for(const r of passagesCartanWeights){assert(html.includes(`id="${r.id}"`));assert(html.includes(r.sourceUrl));assert(r.note);}
assert.equal((html.match(/<figure /g)||[]).length,6);assert.equal((html.match(/class="author-footnote"/g)||[]).length,15);assert.equal((html.match(/class="source-weight-table"/g)||[]).length,6);
for(const p of proofsCartan1913){assert(html.includes(`id="${p.id}"`));assert(html.includes(`href="#${p.id}"`));assert(p.proof.length>700);assert(data.statements['cartan-1913'].some(x=>x.id===p.id));}
for(const phrase of ['Sections XIV–XXII','complete reducibility','first derivative','half-versus-third','multiplicities','720','20','74/9','32/9','without proof-assistant verification'])assert(html.includes(phrase),phrase);
// All arithmetic below uses integers after clearing every denominator.
const sum=a=>a.reduce((s,v)=>s+v,0),add=(a,b,k=1)=>a.map((v,i)=>v+k*b[i]),scale=(a,k)=>a.map(v=>v*k),unit=(n,i)=>Array.from({length:n},(_,j)=>i===j?1:0),diff=(a,i,j)=>a[i-1]-a[j-1];
function integerLabels(type,m){
 if(type==='E6')return {d:3,v:[3*diff(m,5,6),2*(m[3]+m[4]+m[5])-m[0]-m[1]-m[2],3*diff(m,1,2),3*diff(m,4,5),3*diff(m,2,3),3*diff(m,3,4)]};
 if(type==='E7')return {d:3,v:[3*diff(m,6,7),3*diff(m,1,2),3*(m[4]+m[5]+m[6])-sum(m),3*diff(m,2,3),3*diff(m,5,6),3*diff(m,3,4),3*diff(m,4,5)]};
 if(type==='E8')return {d:1,v:[diff(m,8,9),diff(m,2,3),diff(m,7,8),-m[1]-m[2]-m[3],diff(m,6,7),diff(m,3,4),diff(m,5,6),diff(m,4,5)]};
 if(type==='F4')return {d:1,v:[m[0]-m[1]-m[2]-m[3],diff(m,2,3),2*m[3],diff(m,3,4)]};
 return {d:1,v:[-3*m[1],diff(m,2,3)]};
}
for(const [type,{denominator:d,rows}]of Object.entries(P)){
 rows.forEach((m,j)=>{const L=integerLabels(type,m);assert.deepEqual(L.v.map(v=>v||0),rows.map((_,i)=>i===j?d*L.d:0));const fl=fundamentalLabels(type,m);fl.forEach((v,i)=>assert(Math.abs(v-L.v[i]/L.d)<1e-12));});
 const n=rows[0].length,basis=Array.from({length:type==='E8'||type==='G2'?n-1:n},(_,i)=>{const v=unit(n,i);if(n!==rows.length)v[n-1]=-1;return v;});
 for(const b of basis){const L=integerLabels(type,b),reconstructed=Array(n).fill(0);rows.forEach((row,i)=>row.forEach((v,j)=>reconstructed[j]+=v*L.v[i]));assert.deepEqual(reconstructed,scale(b,d*L.d));}
}
// Classical formula inversion for arbitrary integer labels; no modern renumbering.
for(let l=2;l<=8;l++)for(let seed=0;seed<15;seed++){
 const p=Array.from({length:l},(_,i)=>(seed*(i+1)+i)%4);
 const a=Array(l+1).fill(0);p.forEach((v,k)=>{const count=k+1;for(let i=l+1-count;i<=l;i++)a[i]-=(l+1)*v;});const common=sum(a)/(l+1);for(let i=0;i<=l;i++)a[i]-=common;
 assert.equal(sum(a),0);for(let i=0;i<l;i++)assert.equal(a[l-1-i]-a[l-i],(l+1)*p[i]);
 const b=Array(l).fill(p[0]);for(let k=1;k<l;k++)for(let j=0;j<k;j++)b[j]+=2*p[k];assert.equal(b[l-1],p[0]);for(let i=1;i<l;i++)assert.equal(b[i-1]-b[i],2*p[i]);
 const c=Array(l).fill(0);p.forEach((v,k)=>{for(let j=0;j<=k;j++)c[j]+=v;});for(let i=0;i<l-1;i++)assert.equal(c[i]-c[i+1],p[i]);assert.equal(c[l-1],p[l-1]);
 if(l>=4){const d=Array(l).fill(p[0]+p[1]);d[l-1]=-p[0]+p[1];for(let k=2;k<l;k++)for(let j=0;j<k-1;j++)d[j]+=2*p[k];assert.equal(d[l-2]-d[l-1],2*p[0]);assert.equal(d[l-2]+d[l-1],2*p[1]);for(let k=2;k<l;k++)assert.equal(d[k-2]-d[k-1],2*p[k]);}
}
// Exceptional reflections in integral coordinates scaled by six. B is 324 times
// the actual inner product, so all root/weight computations remain exact.
const B=(a,b)=>9*a.reduce((s,v,i)=>s+v*b[i],0)-sum(a)*sum(b),key=v=>v.join(','),vector=(n,terms)=>{const v=Array(n).fill(0);for(const [i,c]of terms)v[i-1]+=c;return v;};
const adjacent=(n,i)=>vector(n,[[i,6],[i+1,-6]]);
const simple={E6:[...Array.from({length:5},(_,i)=>adjacent(6,i+1)),vector(6,[[4,6],[5,6],[6,6]])],E7:[...Array.from({length:6},(_,i)=>adjacent(7,i+1)),vector(7,[[5,6],[6,6],[7,6]])],E8:[...Array.from({length:7},(_,i)=>adjacent(9,i+2)),[2,-4,-4,-4,2,2,2,2,2]]};
function reflect(v,a){const num=2*B(v,a),den=B(a,a);assert(num%den===0);return add(v,a,-num/den);}
function orbit(v,gens){const seen=new Map([[key(v),v]]),queue=[v];for(let i=0;i<queue.length;i++)for(const a of gens){const w=reflect(queue[i],a),k=key(w);if(!seen.has(k)){seen.set(k,w);queue.push(w);}}return seen;}
for(const [type,gens]of Object.entries(simple)){
 for(const a of gens){assert.equal(B(a,a),648);for(const b of gens)if(a!==b)assert(B(a,b)<=0);}
 const roots=new Map();for(const a of gens)for(const [k,v]of orbit(a,gens))roots.set(k,v);
 assert.equal(roots.size,{E6:72,E7:126,E8:240}[type]);for(const v of roots.values())assert.equal(B(v,v),648);
}
const E6=P.E6.rows.map(v=>scale(v,2)),sizes=[27,72,27,216,216,720],orbits=E6.map((v,i)=>{const o=orbit(v,simple.E6);assert.equal(o.size,sizes[i]);return o;});
const permutations=(a,k)=>k===0?[[]]:a.flatMap(v=>permutations(a.filter(x=>x!==v),k-1).map(t=>[v,...t]));
const indices=[1,2,3,4,5,6],setFrom=a=>new Set(a.map(key)),equalSets=(a,b)=>assert.deepEqual([...a].sort(),[...b].sort());
const g1=[];for(const i of indices){g1.push(add(Array(6).fill(-2),vector(6,[[i,-6]])));g1.push(add(Array(6).fill(4),vector(6,[[i,-6]])));}for(const [i,j]of permutations(indices,2))g1.push(add(Array(6).fill(-2),vector(6,[[i,6],[j,6]])));equalSets(setFrom(g1),new Set(orbits[0].keys()));
const g4=[];for(const [i,j,k]of permutations(indices,3))for(const [terms,offset]of [[[[i,-12]],2],[[[i,-6],[j,-6]],-4],[[[i,-6],[j,-6]],8],[[[i,-6],[j,6],[k,6]],2],[[[i,-6],[j,6],[k,6]],-4],[[[i,12],[j,6],[k,6]],-4]])g4.push(add(Array(6).fill(offset),vector(6,terms)));equalSets(setFrom(g4),new Set(orbits[3].keys()));
equalSets(new Set([...orbits[0].values()].map(v=>key(scale(v,-1)))),new Set(orbits[2].keys()));
equalSets(new Set([...orbits[3].values()].map(v=>key(scale(v,-1)))),new Set(orbits[4].keys()));
const productOrbit=orbit(add(E6[0],E6[2]),simple.E6);assert.equal(productOrbit.size,270);const productFamilies=[];
for(const [i,j,k,l,m]of permutations(indices,5)){
 for(const terms of [[[i,12],[j,6]],[[i,6],[j,6],[k,-6],[l,-6]],[[i,6],[j,6],[k,6],[l,6],[m,-6]]])for(const sign of [-1,1])productFamilies.push(scale(vector(6,terms),sign));
 for(const sign of [-1,1])productFamilies.push(scale(add(Array(6).fill(6),vector(6,[[i,6],[j,-6]])),sign));
}
equalSets(setFrom(productFamilies),new Set(productOrbit.keys()));
const repaired=[],printed=[];
for(const [i,j,k,l]of permutations(indices,4)){
 const good=[[[i,6],[j,6],[k,-12]],[[i,12],[j,12],[k,6],[l,6]],[[i,12],[j,6],[k,6],[l,-6]]];
 for(const terms of good)for(const sign of [-1,1])repaired.push(scale(vector(6,terms),sign));
 const bad=[[[i,6],[j,6],[k,-12]],[[i,12],[j,12],[k,6],[l,6]],[[i,12],[j,12],[k,6],[l,-6]]];
 for(const terms of bad)for(const sign of [-1,1])printed.push(scale(vector(6,terms),sign));
}
for(const [i,j,k]of permutations(indices,3))for(const sign of [-1,1]){const last=add(Array(6).fill(6),vector(6,[[i,6],[j,6],[k,6]]));repaired.push(scale(last,sign));printed.push(scale(last,sign));}
const repairedSet=setFrom(repaired);assert.equal(repairedSet.size,700);const missing=[...orbits[5]].filter(([k])=>!repairedSet.has(k));assert.equal(missing.length,20);
const extra=[];for(const [i,j,k]of permutations(indices,3))extra.push(add(Array(6).fill(-6),vector(6,[[i,12],[j,12],[k,12]])));
assert.equal(setFrom(extra).size,20);equalSets(setFrom(extra),new Set(missing.map(([k])=>k)));equalSets(setFrom([...repaired,...extra]),new Set(orbits[5].keys()));
const bad=vector(6,[[1,12],[2,12],[3,6],[4,-6]]);assert.equal(B(bad,bad),2664);assert.equal(B(E6[5],E6[5]),1944); // norms 74/9 versus 6.
// Source's E7 half-sum misprint destroys reflection norm preservation.
const original=[6,6,6,6,6,6,0],wrong=[6,6,-6,0,0,0,6],right=[6,6,0,0,0,0,6];assert.equal(B(original,original),648);assert.equal(B(wrong,wrong),1152);assert.equal(B(right,right),648);
// All four corrected E6/E7 pattern maps preserve the source inner product.
function patterns(m){const T=sum(m)/3;assert(Number.isInteger(T));if(m.length===6){const [i,j,k,r,s,t]=m;return[m.map(v=>v-T),[i,j,k,T-s-t,T-t-r,T-r-s],[i-T,j-T,k-T,T-s-t,T-t-r,T-r-s],[i,i-T,T-j-k,T-j-r,T-j-s,T-j-t]];}const [i,j,k,l,r,s,t]=m;return[[i,j,k,l,T-s-t,T-t-r,T-r-s],[i,i+j-T,i+k-T,i+l-T,i+r-T,i+s-T,i+t-T],[i,j,i+j-T,T-k-l,T-k-r,T-k-s,T-k-t],[i,i+j-T,i+k-T,i+l-T,T-s-t,T-t-r,T-r-s]];}
for(const n of [6,7]){const basis=Array.from({length:n},(_,i)=>scale(unit(n,i),6));for(const v of basis)for(const w of basis){const pv=patterns(v),pw=patterns(w);for(let k=0;k<4;k++)assert.equal(B(pv[k],pw[k]),B(v,w));}}
// Concrete misprints fail on the author's own fundamental weights.
assert.equal(P.E6.rows[0].slice(0,3).reduce((s,x)=>s+x,0),6); // The triple sum is 2, not a multiple of 3.
assert.equal(-3*P.G2.rows[1][2],9);assert(-3*P.G2.rows[1][1]===0); // Correct p1=0 on Pi2, after denominator 3.
const printedE7=[2,2,2,2,6,6,6];assert.notDeepEqual(printedE7,P.E7.rows[6]);
for(const v of cartanWeightDrawingData.g2short)assert(Math.abs(v[0]**2+v[1]**2-1)<1e-12);for(const v of cartanWeightDrawingData.g2long)assert(Math.abs(v[0]**2+v[1]**2-3)<1e-12);
assert.equal(exceptionalWeightOrbits.E8.length,8);assert.equal(exceptionalWeightOrbits.E8[7].filter(s=>s!=='0').length,22);
console.log('Validated Cartan I–XIII (§§1–35), fifteen author footnotes, six drawings, five reconstructions, all source intervals, exact classical/exceptional fundamental-coordinate inversions, 72/126/240 exceptional roots, E6 boundary orbits, the erroneous norm and omitted 20-weight layer, corrected E6/E7 coefficient patterns, and the G2/E7 counterexamples to printed formulas.');
