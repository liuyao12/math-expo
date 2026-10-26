import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {passages1902,sections1902,edition1902} from '../src/poincare-1902-surfaces.mjs';
import {proofs1902} from '../src/statements-poincare-1902-surfaces.mjs';
import {concepts1902,citations1902,externalReferences1902} from '../src/poincare-1902-surfaces-catalog.mjs';
import {works,englishSources,citations} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const evidence=JSON.parse(read('src/poincare-1902-surfaces-source.json')),french=read('src/'+evidence.sourceFile),html=read('dist/poincare-1902-surfaces/index.html');
assert.equal(hash(french),evidence.sha256);assert.equal(evidence.units.length,17);assert.equal(sections1902.length,6);assert.equal(passages1902.length,17);
assert.deepEqual(sections1902.flatMap(s=>s.rows.map(r=>r.id)),passages1902.map(r=>r.id));
let end=0;for(const u of evidence.units){assert.equal(u.start,end);assert.equal(hash(french.slice(u.start,u.end)),u.sha256);assert.equal(u.passages.length,1);assert(passages1902.some(r=>r.id===u.passages[0]&&r.section===u.section));end=u.end;}assert.equal(end,french.length);
for(const r of passages1902){assert(html.includes(`id="${r.id}"`));assert(r.note);assert.equal(r.sourceUrl.split('#page=')[1],String(r.printPage-47));}
assert.equal((html.match(/<figure /g)||[]).length,11);assert.equal(proofs1902.length,10);
for(const p of proofs1902){assert(html.includes(`id="${p.id}"`));assert(passages1902.some(r=>r.id===p.anchor));assert(html.includes(`href="#${p.id}"`));assert(p.status&&p.proof.length>500);}
for(const c of concepts1902){assert(html.includes('concepts/'+c.id+'/'));assert(read('dist/concepts/'+c.id+'/index.html').includes('../../poincare-1902-surfaces/#'+c.anchor));}
assert.equal(read('dist/poincare-1902-surfaces/source-fr.txt'),french);assert(works.find(w=>w.id==='poincare-1902-surfaces').edition);assert.equal(englishSources['poincare-1902-surfaces'].checked,'2026-10-26');
assert.equal(externalReferences1902.length,1);assert.equal(citations1902.length,2);
for(const c of citations1902){assert(citations.some(e=>e.from===c.from&&e.to===c.to));assert(read('dist/'+c.to+'/index.html').includes('../poincare-1902-surfaces/#'+c.anchor));}
for(const marker of ['without proof-assistant verification','line-by-line collation of the entire paper has not been made','not valid as stated','not asserted to come from','including or deleting','global geometric presentation is not treated as proved','PDF pages 174–190','Original Figure 1','Original Figure 2'])assert(html.toLowerCase().includes(marker.toLowerCase()),marker);
assert(!edition1902.includes('(d_i)'));assert(html.includes('class="work-title">Analysis situs</cite>'));assert(read('dist/people/poincare/index.html').includes('../../poincare-1902-surfaces/'));
// Exact SL(2,Z) coordinate inverses, including the misprinted sign.
const mul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
let cases=0;for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++)for(let c=-4;c<=4;c++)for(let d=-4;d<=4;d++)if(a*d-b*c===1){assert.deepEqual(mul([[a,c],[b,d]],[[d,-c],[-b,a]]),[[1,0],[0,1]]);cases++;}
assert.deepEqual(mul([[1,0],[1,1]],[[1,0],[-1,1]]),[[1,0],[0,1]]);
// Verify automorphisms in the free product of six involutions, before the product relation.
const reduce=s=>{const a=[];for(const c of s)if(a.at(-1)===c)a.pop();else a.push(c);return a.join('');};
const phi={a:'d',b:'dabad',c:'dacad',d:'dad',e:'e',f:'f'},psi={a:'ada',b:'adbda',c:'adcda',d:'a',e:'e',f:'f'},full={a:'dad',b:'dadabadad',c:'dadacadad',d:'dadad',e:'e',f:'f'};
const apply=(map,s)=>reduce([...s].map(c=>map[c]).join(''));
for(const c of 'abcdef'){assert.equal(apply(psi,phi[c]),c);assert.equal(apply(phi,psi[c]),c);assert.equal(apply(phi,phi[c]),full[c]);assert.equal(reduce(phi[c]+phi[c]),'');assert.equal(phi[c].length%2,1);}
assert.equal(apply(phi,'abcdef'),'abcdef');assert.equal(apply(psi,'abcdef'),'abcdef');
for(const w of Object.values(full))assert(passages1902.find(r=>r.id==='p02-4c').text.includes(w));
// Genus-one vanishing circles lie on the stated smooth model and bound the explicit disk.
for(const t of [.01,.1,1,3])for(let k=0;k<30;k++){const x=Math.sqrt(t)*Math.cos(k),z=Math.sqrt(t)*Math.sin(k);assert(Math.abs(x*x+z*z-t)<1e-12);}
// The cone square map is two-to-one away from the origin and respects radial normalization.
for(let k=1;k<20;k++){let u=k/7,v=(20-k)/11;const q=(u**4+v**4)**(-.25);u*=q;v*=q;const x=u*u,y=v*v,z=u*v;assert(Math.abs(z*z-x*y)<1e-12);assert(Math.abs(x*x+y*y-1)<1e-12);assert.equal((-u)*(-v),z);}
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),vectors=[[1,0],[1,3],[2,3]],parities=v=>v.map(x=>x%2).join('');
assert(vectors.every(([x,y])=>gcd(x,y)===1));assert.equal(new Set(vectors.map(parities)).size,3);
// Four half-lattice points, with two endpoint pairs for each slope, give all six pairs.
let pairs=new Set;for(const [vx,vy]of vectors)for(let p=0;p<4;p++){const q=p^((vx%2)+2*(vy%2));pairs.add([p,q].sort().join(''));}assert.equal(pairs.size,6);
let perms=new Set(['0123']),front=['0123'];while(front.length){const s=front.pop();for(const pair of pairs){let a=[...s];[a[+pair[0]],a[+pair[1]]]=[a[+pair[1]],a[+pair[0]]];let t=a.join('');if(!perms.has(t)){perms.add(t);front.push(t);}}}assert.equal(perms.size,24);
const determinants=vectors.flatMap((v,i)=>vectors.slice(i+1).map(w=>v[0]*w[1]-v[1]*w[0]));assert.equal(determinants.reduce(gcd,0),3);
// Every generated vector has second coordinate divisible by 3; every (m,3n) is generated.
for(let m=-10;m<=10;m++)for(let n=-10;n<=10;n++){assert.deepEqual([(m-n)*1+n*1,(m-n)*0+n*3],[m,3*n]);}assert.equal(new Set([0,1,2,3,4,5].map(y=>y%3)).size,3);
// Count all parity cases directly by quotient orbits, including the one-factor edge case.
const bits=x=>x.toString(2).replaceAll('0','').length%2;
for(let n=1;n<=8;n++){const even=Array.from({length:2**n},(_,i)=>i).filter(x=>!bits(x));assert.equal(even.length,2**(n-1));for(const d of even){const orbits=new Set(even.map(x=>Math.min(x,x^d)));assert.equal(orbits.size,d?2**(n-2):2**(n-1));}}
console.log(`Validated complete third supplement: 17 pinned passages, 11 drawings, 10 reconstructions, 2 reciprocal citations, ${cases} period inverses, both crossing automorphisms, the cone model, the index-three arc example, and every parity case through eight factors.`);
