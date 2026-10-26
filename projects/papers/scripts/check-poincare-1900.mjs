import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {passages1900,sections1900} from '../src/poincare-1900.mjs';
import {proofs1900} from '../src/statements-poincare-1900.mjs';
import {concepts1900} from '../src/poincare-1900-catalog.mjs';
import {italicizeTitles,titleHTML} from '../src/work-titles.mjs';
import {works,englishSources} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const evidence=JSON.parse(read('src/poincare-1900-source.json')),french=read('src/'+evidence.sourceFile),html=read('dist/poincare-1900/index.html');
assert.equal(hash(french),evidence.sha256);assert.equal(evidence.units.length,7);assert.equal(sections1900.length,7);
assert.deepEqual(sections1900.flatMap(s=>s.rows.map(r=>r.id)),passages1900.map(r=>r.id));assert.equal(passages1900.length,27);
for(const u of evidence.units){assert.equal(hash(french.slice(u.start,u.end)),u.sha256);assert.deepEqual(u.passages,passages1900.filter(r=>r.section===u.section).map(r=>r.id));}
for(const r of passages1900){assert(html.includes(`id="${r.id}"`));assert(r.note&&r.sourceUrl);}
assert.equal((html.match(/<figure /g)||[]).length,15);assert.equal(proofs1900.length,12);
for(const p of proofs1900){assert(html.includes(`id="${p.id}"`));assert(passages1900.some(r=>r.id===p.anchor));assert(html.includes(`href="#${p.id}"`));}
for(const c of concepts1900)assert(html.includes('concepts/'+c.id+'/'));
assert.equal(read('dist/poincare-1900/source-fr.txt'),french);assert(works.find(w=>w.id==='poincare-1900').edition);assert.equal(englishSources['poincare-1900'].checked,'2026-10-25');
for(const marker of ['without proof-assistant verification','not been collated line by line','Historical claim and explicit correction','The final theorem is stated without proof','omits its positive endpoint','degree-shift','PDF pages 145–173'])assert(html.toLowerCase().includes(marker.toLowerCase()),marker);
for(const id of ['poincare-1895','poincare-1899'])assert(read('dist/'+id+'/index.html').includes('../poincare-1900/#p00-0a'));
// Typography is semantic and leaves source code, math, attributes and exports alone.
const sample=String.raw`<p>Analysis situs and <i>Analysis situs</i>, \(\text{Analysis situs}\).</p><a title="Analysis situs">link</a><textarea>Analysis situs</textarea><script>"Analysis situs"</script><code>Analysis situs</code><title>Analysis situs</title>`;
const styled=italicizeTitles(sample);assert.equal((styled.match(/<cite /g)||[]).length,1);assert(styled.includes(String.raw`\(\text{Analysis situs}\)`));assert(styled.includes('<textarea>Analysis situs</textarea>'));assert(styled.includes('title="Analysis situs"'));assert.equal(italicizeTitles(styled),styled);
assert.equal(titleHTML('A < B'),'<'+'cite class="work-title">A &lt; B</cite>');assert(!read('dist/poincare-1900/citation.bib').includes('<cite'));assert(html.includes('class="work-title">Analysis situs</cite>'));
assert(passages1900.find(r=>r.id==='p00-4g').figureHtml.includes(String.raw`\(\theta\)`));
const sum=a=>a.reduce((x,y)=>x+y,0),gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),comb=(a,k)=>k===0?[[]]:a.flatMap((v,i)=>comb(a.slice(i+1),k-1).map(t=>[v,...t]));
const det=A=>A.length===0?1:A.length===1?A[0][0]:sum(A[0].map((v,j)=>(-1)**j*v*det(A.slice(1).map(r=>r.filter((_,k)=>k!==j)))));
const divisors=A=>{let d=[1];for(let k=1;k<=Math.min(A.length,A[0].length);k++)d.push(comb(A.map((_,i)=>i),k).flatMap(rs=>comb(A[0].map((_,j)=>j),k).map(cs=>Math.abs(det(rs.map(i=>cs.map(j=>A[i][j])))))).reduce(gcd,0));return d;};
const factors=A=>{const d=divisors(A);return d.slice(1).map((v,i)=>v?v/d[i]:0);};
const product=(A,B)=>A.map(r=>B[0].map((_,j)=>sum(r.map((v,k)=>v*B[k][j]))));
const examples=[
{faces:['ABDC',"ACC'A'","CDD'C'"],edges:[['AB','CD',"A'B'","C'D'"],['AC','BD',"A'C'","B'D'"],["AA'","BB'","CC'","DD'"]],T2:[[0,0,0],[0,0,0],[0,0,0]],T1:[[0],[0],[0]],factors:[0,0,0],rank:3},
{faces:['ABDC',"ABB'A'","ACC'A'"],edges:[['AB',"B'D'","C'C"],['AC',"DD'","B'A'"],["AA'","C'D'",'DB'],['CD',"BB'","A'C'"]],T2:[[1,-1,-1,-1],[1,1,-1,1],[-1,1,-1,-1]],T1:[[1,-1],[1,-1],[1,-1],[-1,1]],factors:[1,2,2],rank:0},
{faces:['ABDC',"ABB'A'","ACC'A'"],edges:[["AA'","CC'","BB'","DD'"],['AB','CD',"B'D'","A'C'"],['AC','BD',"D'C'","B'A'"]],T2:[[0,0,0],[0,1,1],[0,1,-1]],T1:[[0],[0],[0]],factors:[1,2,0],rank:1},
{faces:['ABC','ACE','AED','ADB'],edges:[['AB','FE'],['AC','FD'],['AE','FB'],['AD','FC'],['BC','ED'],['CE','DB']],T2:[[1,-1,0,0,1,0],[0,1,-1,0,0,1],[0,0,1,-1,1,0],[-1,0,0,1,0,1]],T1:[[1,-1,0],[1,0,-1],[1,-1,0],[1,0,-1],[0,1,-1],[0,-1,1]],factors:[1,1,1,2],rank:0},
{faces:["ABB'A'","ACC'A'",'ABD','ACD'],edges:[["AA'","BB'","CC'","DD'"],['AB','CD',"D'A'"],['AC','BD',"C'D'","A'B'"],['AD',"C'A'","D'B'"]],T2:[[0,1,-1,0],[0,0,1,1],[0,1,1,-1],[0,1,1,-1]],T1:[[0],[0],[0],[0]],factors:[1,1,3,0],rank:1},
{T2:[[0,0,2],[0,1,1]],T1:[[1,-1],[0,0],[0,0]],factors:[1,2],rank:0}
];
for(const e of examples){assert(product(e.T2,e.T1).flat().every(x=>x===0));assert.deepEqual(factors(e.T2),e.factors);const r2=e.factors.filter(Boolean).length,r1=factors(e.T1).filter(Boolean).length;assert.equal(e.T1.length-r1-r2,e.rank);if(e.faces){const map=new Map;for(let i=0;i<e.edges.length;i++)for(let edge of e.edges[i]){let [a,b]=edge.match(/[A-Z]'?/g);map.set(a+'>'+b,[i,1]);map.set(b+'>'+a,[i,-1]);}for(let i=0;i<e.faces.length;i++){let v=e.faces[i].match(/[A-Z]'?/g),r=Array(e.edges.length).fill(0);for(let j=0;j<v.length;j++){let x=map.get(v[j]+'>'+v[(j+1)%v.length]);assert(x);r[x[0]]+=x[1];}assert(r.every((v,j)=>v===e.T2[i][j])||r.every((v,j)=>-v===e.T2[i][j]));}}}
// Nonzero minor gcds survive many independently chosen integer basis changes.
const gcdBig=(a,b)=>b?gcdBig(b,a%b):a<0n?-a:a;
let matrix=[[2n,0n,0n],[0n,6n,0n]];for(let i=0;i<60;i++){let a=i%2,b=1-a;matrix[a]=matrix[a].map((x,j)=>x+BigInt((i%7)-3)*matrix[b][j]);matrix=matrix.map(r=>[r[1],-r[0],r[2]+BigInt((i%3)-1)*r[0]]);let d1=matrix.flat().reduce(gcdBig,0n),d2=comb([0,1,2],2).map(([a,b])=>matrix[0][a]*matrix[1][b]-matrix[0][b]*matrix[1][a]).reduce(gcdBig,0n);assert.equal(d1,2n);assert.equal(d2,12n);}
// Check invariant-factor predictions against actual finite quotient element orders.
for(const A of [[-1,1,-1,0],[-1,0,0,-1],[3,2,4,3],[2,1,1,1],[0,-1,1,0]]){
 const [a,b,c,d]=A;assert.equal(a*d-b*c,1);let B=[[a-1,b],[c,d-1]],D=Math.abs(det(B)),mu=B.flat().reduce(gcd,0);assert.equal(D%mu,0);let image=new Set;const mod=x=>(x%D+D)%D;for(let x=0;x<D;x++)for(let y=0;y<D;y++)image.add(mod(B[0][0]*x+B[0][1]*y)+','+mod(B[1][0]*x+B[1][1]*y));assert.equal(D*D/image.size,D);let actual=new Map,expected=new Map;for(let x=0;x<D;x++)for(let y=0;y<D;y++){let k=1;while(!image.has(mod(k*x)+','+mod(k*y)))k++;actual.set(k,(actual.get(k)??0)+1/image.size);}for(let x=0;x<mu;x++)for(let y=0;y<D/mu;y++){let k=1;while(k*x%mu||k*y%(D/mu))k++;expected.set(k,(expected.get(k)??0)+1);}for(let [k,v]of expected)assert(Math.abs(actual.get(k)-v)<1e-9);}
// Heegaard phase representatives and the quadratic map, independent of the tables.
const complex=(r,t)=>[r*Math.cos(t),r*Math.sin(t)],near=(a,b)=>assert(Math.hypot(...a.map((v,i)=>v-b[i]))<1e-12);
for(const r of [.2,.5,.8]){let s=Math.sqrt(1-r*r),base=[r,0,s,0,Math.sqrt(r*s),0];for(const [eta,theta]of [[0,0],[2*Math.PI,0],[0,4*Math.PI],[2*Math.PI,4*Math.PI]])near([...complex(r,theta-eta),...complex(s,eta),...complex(Math.sqrt(r*s),theta/2)],base);near(complex(Math.sqrt(r*s),Math.PI),[-base[4],0]);}
// Exhaustively check the signed-cycle criterion for every 3 by 3 table.
const permutations=a=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(r=>[x,...r])):[[]];
const cycles=[];for(let k of [2,3])for(let rs of comb([0,1,2],k))for(let cs of comb([0,1,2],k))for(let rr of permutations(rs.slice(1)))for(let cc of permutations(cs)){let rows=[rs[0],...rr];cycles.push({ids:rows.map((r,i)=>r*3+cc[i]).concat(rows.map((_,i)=>rows[(i+1)%k]*3+cc[i])),sign:(-1)**k});}
const bilateral=a=>cycles.every(c=>{let p=c.ids.reduce((p,i)=>p*a[i],1);return !p||p===c.sign;});
let bilateralCount=0;for(let n=0;n<3**9;n++){let v=n,a=[];for(let i=0;i<9;i++){a.push(v%3-1);v=Math.floor(v/3);}if(!bilateral(a))continue;bilateralCount++;let M=[a.slice(0,3),a.slice(3,6),a.slice(6)];assert(Math.abs(det(M))<=1);for(let rs of comb([0,1,2],2))for(let cs of comb([0,1,2],2))assert(Math.abs(det(rs.map(i=>cs.map(j=>M[i][j]))))<=1);}
assert.equal(bilateralCount,9259);assert.equal(det([[1,1,0],[0,-1,1],[1,0,-1]]),2);assert.equal(det([[-1,1,0],[0,-1,1],[1,0,-1]]),0);
for(let q=1;q<=16;q++)assert.equal((-1)**(q*(q+1)/2),(-1)**q*(-1)**((q-1)*q/2));
console.log('Validated the complete second supplement, 27 passages, fifteen drawings, twelve reconstructions, source hashes, title italics, all six cell complexes and their face boundaries, sixty integer basis reductions, five finite quotient order distributions, phase corners, and all 19,683 signed three-by-three tables.');
