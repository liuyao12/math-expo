import assert from 'node:assert/strict';
class DSU {constructor(items){this.p=new Map(items.map(x=>[x,x]));}find(x){let p=this.p.get(x);assert(p!==undefined,x);if(p!==x)this.p.set(x,p=this.find(p));return p;}union(a,b){a=this.find(a);b=this.find(b);if(a!==b)this.p.set(a,b);}classes(){let c=new Map;for(let x of this.p.keys()){let y=this.find(x);if(!c.has(y))c.set(y,[]);c.get(y).push(x);}return [...c.values()];}}
const parse=s=>s.trim().split(/\s+/),E=(a,b)=>[a,b].sort().join('~'),G=(a,b)=>a+'>'+b;
const faceCases=[
[['A B D C','Ap Bp Dp Cp'],['A C Cp Ap','B D Dp Bp'],['C D Dp Cp','A B Bp Ap']],
[['A B D C','Bp Dp Cp Ap'],['A B Bp Ap','D Dp Cp C'],['A C Cp Ap','D Dp Bp B']],
[['A B D C','Bp Dp Cp Ap'],['A B Bp Ap','Cp C D Dp'],['A C Cp Ap','D Dp Bp B']],
[['A B D C','Bp Dp Cp Ap'],['A B Bp Ap','C D Dp Cp'],['A C Cp Ap','B D Dp Bp']],
[['A B C','F E D'],['A C E','F D B'],['A E D','F B C'],['A D B','F C E']],
];
function inspectPairing(pairs){
 const faces=pairs.flatMap(p=>p.map(parse)),vertices=[...new Set(faces.flat())];let edges=new Map,germs=new Map,linkEdges=[];
 for(let [fi,face]of faces.entries())for(let i=0;i<face.length;i++){let v=face[i],w=face[(i+1)%face.length],e=E(v,w);if(!edges.has(e))edges.set(e,{ends:[v,w],faces:[]});edges.get(e).faces.push(fi);linkEdges.push(fi+':'+v);germs.set(G(v,w),[v,w]);germs.set(G(w,v),[w,v]);}
 for(let e of edges.values())assert.equal(e.faces.length,2);
 const fanNodes=[...germs.values()].flatMap(([v,w])=>edges.get(E(v,w)).faces.map(fi=>fi+":"+v+":"+w));
 const nd=new DSU(fanNodes);
 const vd=new DSU(vertices),ed=new DSU([...edges.keys()]),gd=new DSU([...germs.keys()]),ld=new DSU(linkEdges);
 for(let j=0;j<pairs.length;j++){let a=faces[2*j],b=faces[2*j+1],map=new Map(a.map((v,i)=>[v,b[i]]));for(let v of a){vd.union(v,map.get(v));ld.union(2*j+':'+v,(2*j+1)+':'+map.get(v));}for(let i=0;i<a.length;i++){let v=a[i],w=a[(i+1)%a.length],x=map.get(v),y=map.get(w);nd.union(2*j+":"+v+":"+w,(2*j+1)+":"+x+":"+y);nd.union(2*j+":"+w+":"+v,(2*j+1)+":"+y+":"+x);ed.union(E(v,w),E(x,y));gd.union(G(v,w),G(x,y));gd.union(G(w,v),G(y,x));}}
 let folds=[...edges.values()].filter(e=>gd.find(G(...e.ends))===gd.find(G(e.ends[1],e.ends[0]))).length;
 const connected=(nodes,links)=>{let seen=new Set([nodes[0]]);for(let change=true;change;){change=false;for(let [a,b]of links)if(seen.has(a)!==seen.has(b)){seen.add(a);seen.add(b);change=true;}}return seen.size===nodes.length;};
 let fans=[];for(let gs of gd.classes()){let links=gs.map(g=>{let [v,w]=germs.get(g);let fs=edges.get(E(v,w)).faces;return fs.map(fi=>nd.find(fi+':'+v+':'+w));});let ns=[...new Set(links.flat())],degree=new Map(ns.map(n=>[n,0]));for(let [a,b]of links){degree.set(a,degree.get(a)+1);degree.set(b,degree.get(b)+1);}fans.push(connected(ns,links)&&[...degree.values()].every(d=>d===2));}
 let linkData=vd.classes().map(vs=>{let vset=new Set(vs);let gs=gd.classes().filter(c=>vset.has(germs.get(c[0])[0]));let es=ld.classes().filter(c=>vset.has(c[0].split(':')[1]));let links=es.map(c=>c.map(x=>x.split(':')[1]));return {faces:vs.length,edges:es.length,vertices:gs.length,euler:vs.length-es.length+gs.length,connected:connected(vs,links)};});
 return {vertices:vd.classes().length,edges:ed.classes().length,faces:pairs.length,linkData,folds,fans:fans.every(Boolean)};
}

import fs from 'node:fs';import {createHash} from 'node:crypto';
import {passages1895,sections1895} from '../src/poincare-1895.mjs';
import {proofs1895} from '../src/statements-poincare-1895.mjs';
import {concepts1895,externalReferences1895} from '../src/poincare-1895-catalog.mjs';
import {works,englishSources} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),source=JSON.parse(fs.readFileSync(new URL('src/poincare-1895-source.json',root),'utf8'));
const french=fs.readFileSync(new URL('src/'+source.sourceFile,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(hash(french),source.sha256);assert.equal(source.units.length,19);
assert.deepEqual(source.units.map(u=>u.section),Array.from({length:19},(_,i)=>i));
for(const unit of source.units){assert.equal(hash(french.slice(unit.start,unit.end)),unit.sha256);assert.deepEqual(unit.passages,passages1895.filter(r=>r.section===unit.section).map(r=>r.id));assert(unit.sourceCharacters>1000);}
assert(!french.includes('Nous avons corrigé'));assert(!french.includes('popupGloss'));
assert.equal(passages1895.length,59);assert.equal(passages1895.filter(r=>r.figureHtml).length,43);assert.equal(proofs1895.length,18);
assert.deepEqual(sections1895.flatMap(s=>s.rows.map(r=>r.id)),passages1895.map(r=>r.id));
assert.equal(new Set(passages1895.map(r=>r.id)).size,passages1895.length);
const html=fs.readFileSync(new URL('dist/poincare-1895/index.html',root),'utf8');
for(const r of passages1895){assert(html.includes(`id="${r.id}"`));assert(r.note&&r.sourceUrl);}
for(const p of proofs1895){assert(html.includes(`id="${p.id}"`));assert(passages1895.some(r=>r.id===p.anchor));assert(html.includes(`href="#${p.id}"`));}
for(const c of concepts1895)assert(html.includes('concepts/'+c.id+'/'));
assert.equal(fs.readFileSync(new URL('dist/poincare-1895/source-fr.txt',root),'utf8'),french);
assert.equal((html.match(/<figure /g)||[]).length,43);
for(const marker of ['not been collated line by line','without proof-assistant verification','surface boundary need not be contractible','primitive integral basis','diagonal singularities','c_3=\\pm1','finite torsion','surface-boundary counterexample'])assert(html.includes(marker),marker);
assert(works.find(w=>w.id==='poincare-1895').edition);assert.equal(englishSources['poincare-1895'].checked,'2026-10-24');
assert.equal(externalReferences1895.length,5);assert(html.includes('4 recorded'));
assert(fs.readFileSync(new URL('dist/people/poincare/index.html',root),'utf8').includes('../../poincare-1895/'));
assert(fs.readFileSync(new URL('dist/people/betti/index.html',root),'utf8').includes('../../poincare-1895/#p95-6a'));
// Reconstruct each vertex link and its local fans from the original face maps.
const results=faceCases.map(inspectPairing);
assert.deepEqual(results.map(r=>[r.vertices,r.edges,r.faces]),[[1,3,3],[2,2,3],[2,4,3],[1,3,3],[3,6,4]]);
const linkCounts=[[8,12,6],[4,6,2],[4,6,4],[8,12,6],[2,4,4]];
for(let i=0;i<5;i++){
 assert.equal(results[i].folds,0);assert(results[i].fans);
 for(let link of results[i].linkData){assert(link.connected);assert.deepEqual([link.faces,link.edges,link.vertices],linkCounts[i]);assert.equal(link.euler,i===1?0:2);}
}
// Face orientations are compared in the actual centered cube/octahedron.
const cube={A:[-1,-1,-1],B:[-1,1,-1],C:[1,-1,-1],D:[1,1,-1],Ap:[-1,-1,1],Bp:[-1,1,1],Cp:[1,-1,1],Dp:[1,1,1]};
const oct={A:[0,0,1],F:[0,0,-1],B:[1,0,0],C:[0,1,0],E:[-1,0,0],D:[0,-1,0]};
const minus=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const faceSign=(s,coords)=>{const [a,b,c]=parse(s).map(v=>coords[v]);return Math.sign(dot(cross(minus(b,a),minus(c,a)),a));};
for(let [i,pairs]of faceCases.entries())for(let [a,b]of pairs)assert.equal(faceSign(a,i===4?oct:cube)*faceSign(b,i===4?oct:cube),-1);
// Verify the printed signed-permutation representation, including every relator.
const I=[1,2,3,4],mul=(a,b)=>a.map(x=>Math.sign(x)*b[Math.abs(x)-1]),inv=a=>{let b=[];a.forEach((x,i)=>b[Math.abs(x)-1]=Math.sign(x)*(i+1));return b;};
const gens=[[-2,1,-4,3],[-4,-3,2,1],[3,-4,-1,2]];
const relators=[[1,3,2],[1,-3,-2],[2,-1,-3],[3,-2,-1]],evalWord=w=>w.reduce((a,x)=>mul(a,x>0?gens[x-1]:inv(gens[-x-1])),I);
for(const word of relators)assert.deepEqual(evalWord(word),I);
let group=new Map([[I.join(),I]]);for(let changed=true;changed;){changed=false;for(let a of [...group.values()])for(let b of gens){let c=mul(a,b);if(!group.has(c.join())){group.set(c.join(),c);changed=true;}}}
assert.equal(group.size,8);assert.notDeepEqual(mul(gens[0],gens[1]),mul(gens[1],gens[0]));
for(const g of gens){assert.deepEqual(mul(g,g),[-1,-2,-3,-4]);assert.deepEqual(mul(mul(g,g),mul(g,g)),I);}
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// Abelianized relators: determinantal divisors detect retained finite torsion.
const matrix=relators.map(w=>[1,2,3].map(j=>w.reduce((s,x)=>s+(Math.abs(x)===j?Math.sign(x):0),0)));
let d1=0,d2=0,d3=0;for(let r of matrix)for(let x of r)d1=gcd(d1,x);
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)d2=gcd(d2,matrix[i][a]*matrix[j][b]-matrix[i][b]*matrix[j][a]);
const det3=([a,b,c])=>a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]);
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(let k=j+1;k<4;k++)d3=gcd(d3,det3([matrix[i],matrix[j],matrix[k]]));
assert.deepEqual([d1,d2/d1,d3/d2],[1,2,2]);
// Exact affine composition and conjugacy up to reversing the cyclic generator.
const mm=([a,b,c,d],[e,f,g,h])=>[a*e+b*g,a*f+b*h,c*e+d*g,c*f+d*h].map(x=>x||0),mi=([a,b,c,d])=>[d,-b,-c,a],det=([a,b,c,d])=>a*d-b*c;
const power=(a,k)=>{if(k<0){a=mi(a);k=-k;}let r=[1,0,0,1];while(k--)r=mm(r,a);return r;};
let matrixCases=0;
for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(let c=-3;c<=3;c++)for(let d=-3;d<=3;d++){
 const A=[a,b,c,d];if(det(A)!==1)continue;matrixCases++;
 assert.equal((a-1)*(d-1)-b*c,2-a-d);
 for(let P of [[0,1,1,0],[1,1,0,1]]){const dp=det(P),Pi=mi(P).map(x=>x/dp),B=mm(mm(P,A),Pi);assert.deepEqual(mm(P,A),mm(B,P));for(let k of [-2,-1,0,1,2])assert.deepEqual(mm(P,power(A,k)),mm(power(B,k),P));}
}
// Independently derive all sphere face counts and chain-rank cancellations.
const choose=(n,k)=>{let r=1;for(let j=1;j<=k;j++)r=r*(n-j+1)/j;return Math.round(r);};
for(let p=1;p<=12;p++){
 let simplex=0,cubeSum=0;for(let q=0;q<=p;q++){simplex+=(-1)**(p-q)*choose(p+2,q+1);cubeSum+=(-1)**(p-q)*2**(p+1-q)*choose(p+1,q);}assert.equal(simplex,p%2?0:2);assert.equal(cubeSum,simplex);
 const ranks=Array.from({length:p+2},(_,i)=>i===0||i===p+1?0:i%4),betti=Array.from({length:p+1},(_,i)=>(i*7+p)%5),cells=betti.map((b,i)=>b+ranks[i]+ranks[i+1]);assert.equal(cells.reduce((s,a,i)=>s+(-1)**i*a,0),betti.reduce((s,b,i)=>s+(-1)**i*b,0));
}
console.log(`Validated all eighteen sections and introduction, 59 passages, 43 drawings, eighteen reconstructions, pinned French evidence, five explicit external references, all five face-pairing link surfaces, quaternion relators and integral torsion, ${matrixCases} matrix cases, and twelve-dimensional Euler counts.`);
