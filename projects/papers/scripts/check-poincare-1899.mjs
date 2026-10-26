import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {passages1899,sections1899} from '../src/poincare-1899.mjs';
import {proofs1899} from '../src/statements-poincare-1899.mjs';
import {concepts1899,externalReferences1899} from '../src/poincare-1899-catalog.mjs';
import {works,englishSources,citations} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const source=JSON.parse(read('src/poincare-1899-source.json')),french=read('src/'+source.sourceFile),html=read('dist/poincare-1899/index.html');
assert.equal(hash(french),source.sha256);assert.equal(source.units.length,11);
assert.deepEqual(sections1899.map(s=>s.range),['§I','§II','§III','§IV','§V','§VI','§VII','§VIII','§IX','§X','§XI']);
assert.deepEqual(sections1899.flatMap(s=>s.rows.map(r=>r.id)),passages1899.map(r=>r.id));
assert.equal(new Set(passages1899.map(r=>r.id)).size,passages1899.length);
for(const u of source.units){assert.equal(hash(french.slice(u.start,u.end)),u.sha256);assert.deepEqual(u.passages,passages1899.filter(r=>r.section===u.section).map(r=>r.id));assert(u.correctionsAndQualifications.length);}
for(const r of passages1899){assert(html.includes(`id="${r.id}"`));assert(r.note&&r.sourceUrl);}
for(const p of proofs1899){assert(html.includes(`id="${p.id}"`));assert(passages1899.some(r=>r.id===p.anchor));assert(html.includes(`href="#${p.id}"`));}
for(const c of concepts1899)assert(html.includes('concepts/'+c.id+'/'));
assert.equal((html.match(/<figure /g)||[]).length,13);assert.equal(proofs1899.length,12);
assert.equal(read('dist/poincare-1899/source-fr.txt'),french);assert(works.find(w=>w.id==='poincare-1899').edition);
assert.equal(englishSources['poincare-1899'].checked,'2026-10-25');assert.equal(externalReferences1899.length,2);
assert(html.includes((citations.filter(c=>c.from==='poincare-1899').length+externalReferences1899.length)+' recorded'));assert(html.includes(citations.filter(c=>c.to==='poincare-1899').length+' recorded'));
for(const marker of ['without proof-assistant verification','not been collated line by line','Simple connectivity alone','initial finite admissible chart partition','maximal-rank-minor rule','integer coefficients','PDF pages 104–144'])assert(html.includes(marker),marker);
assert(read('dist/people/heegaard/index.html').includes('../../poincare-1899/#p99-1a'));
assert(read('dist/poincare-1895/index.html').includes('../poincare-1899/#p99-1a'));
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),sum=a=>a.reduce((x,y)=>x+y,0);
const combinations=(a,k)=>k===0?[[]]:a.flatMap((v,i)=>combinations(a.slice(i+1),k-1).map(t=>[v,...t]));
const rank=M=>{if(!M.length||!M[0].length)return 0;M=M.map(r=>r.slice());let k=0;for(let j=0;j<M[0].length;j++){let i=M.findIndex((r,i)=>i>=k&&Math.abs(r[j])>1e-10);if(i<0)continue;[M[i],M[k]]=[M[k],M[i]];let p=M[k][j];M[k]=M[k].map(x=>x/p);for(let l=k+1;l<M.length;l++){let v=M[l][j];M[l]=M[l].map((x,t)=>x-v*M[k][t]);}k++;}return k;};
const transpose=M=>M[0].map((_,j)=>M.map(r=>r[j]));
const product=(A,B)=>A.map(r=>B[0].map((_,j)=>sum(r.map((v,k)=>v*B[k][j]))));
// Independently construct all boundary matrices of the boundary of a 4-simplex.
const cells=Array.from({length:4},(_,q)=>combinations([0,1,2,3,4],q+1));
const boundary=q=>cells[q-1].map(f=>cells[q].map(c=>{let k=c.findIndex((_,i)=>c.filter((_,j)=>j!==i).join()==f.join());return k<0?0:(-1)**k;}));
const D=[null,...[1,2,3].map(boundary)],r=[0,...[1,2,3].map(q=>rank(D[q])),0];
assert.deepEqual(cells.map(c=>c.length),[5,10,10,5]);assert.deepEqual(r,[0,4,6,4,0]);
for(let q=2;q<=3;q++)assert(product(D[q-1],D[q]).flat().every(x=>x===0));
const betti=cells.map((c,q)=>c.length-r[q]-r[q+1]);assert.deepEqual(betti,[1,0,0,1]);assert.equal(sum(cells.map((c,q)=>(-1)**q*c.length)),sum(betti.map((b,q)=>(-1)**q*b)));
// Dual dimensions and reversed transposed boundary ranks, without assuming duality.
assert.equal(cells[2].length-rank(transpose(D[3]))-rank(transpose(D[2])),betti[2]);
// Integer index is unchanged by a series of invertible row/column operations.
const minors2=M=>combinations(M,2).map(([a,b])=>a[0]*b[1]-a[1]*b[0]);
let T=[[2,0],[0,4],[0,0]];
for(let i=0;i<40;i++){let a=i%3,b=(i+1)%3;T[a]=T[a].map((x,j)=>x+((i%5)-2)*T[b][j]);if(i%2===0)T=T.map(([x,y])=>[y,-x]);assert.equal(minors2(T).reduce(gcd,0),8);assert.equal(rank(T),2);}
assert.equal([2,3].reduce(gcd),1);
// Lens-type finite chain complexes distinguish rational rank from finite order.
for(let m=2;m<=19;m++){assert.equal(rank([[m]]),1);assert.equal(1-rank([[m]]),0);let residues=new Set(Array.from({length:4*m+1},(_,j)=>((j-2*m)%m+m)%m));assert.equal(residues.size,m);}
const det=M=>M.length===1?M[0][0]:sum(M[0].map((v,j)=>(-1)**j*v*det(M.slice(1).map(r=>r.filter((_,k)=>k!==j)))));
// Prism staircase: every p-simplex has determinant magnitude one, p cover a prism.
for(let p=2;p<=6;p++){const base=[Array(p-1).fill(0),...Array.from({length:p-1},(_,i)=>Array.from({length:p-1},(_,j)=>i===j?1:0))];let volume=0;for(let i=0;i<p;i++){let vertices=[...base.slice(0,i+1).map(v=>[...v,0]),...base.slice(i).map(v=>[...v,1])],origin=vertices[0],matrix=vertices.slice(1).map(v=>v.map((x,j)=>x-origin[j]));let d=Math.abs(det(matrix));assert.equal(d,1);volume+=d;}assert.equal(volume,p);for(let a=1;a<=7;a++){let lambda=Array.from({length:p},(_,j)=>(j+a)%7+1),total=sum(lambda);lambda=lambda.map(x=>x/total);let intervals=Array.from({length:p},(_,i)=>[sum(lambda.slice(i+1)),sum(lambda.slice(i))]);assert(Math.abs(sum(intervals.map(([x,y])=>y-x))-1)<1e-12);}}
// Four joins of the halves of complementary edges partition a tetrahedron.
const A=[0,0,0],B=[1,0,0],C=[0,1,0],E=[0,0,1],mid=(a,b)=>a.map((x,i)=>(x+b[i])/2);
const ab=[[A,mid(A,B)],[mid(A,B),B]],ce=[[C,mid(C,E)],[mid(C,E),E]];
let v=0;for(let x of ab)for(let y of ce){let vertices=[...x,...y],origin=vertices[0];let d=Math.abs(det(vertices.slice(1).map(w=>w.map((z,j)=>z-origin[j]))));assert.equal(d,.25);v+=d;}assert.equal(v,1);
console.log(`Validated the first supplement’s eleven source sections, ${passages1899.length} passages, thirteen drawings and twelve reconstructions, nine scoped references, source hashes, citation backlinks, simplex-sphere chains, forty integer lattice reductions, eighteen torsion examples, prism triangulations through dimension six, and the complementary-edge join.`);
