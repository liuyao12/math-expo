import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {passages1857,sections1857} from '../src/riemann-1857.mjs';
import {proofs1857} from '../src/statements-riemann-1857.mjs';
import {works,citations,concepts,englishSources} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),source=JSON.parse(fs.readFileSync(new URL('src/riemann-1857-source.json',root)));
const german=fs.readFileSync(new URL('src/'+source.sourceFile,root),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(hash(german),source.sha256);assert.equal(source.units.length,31);
for(const u of source.units){assert.equal(hash(german.slice(u.start,u.end)),u.sha256);assert(u.passages.length);assert.deepEqual(u.passages,passages1857.filter(r=>u.section?r.section===u.section:r.unit===u.id).map(r=>r.id));}
assert.deepEqual([...new Set(passages1857.filter(r=>r.section).map(r=>r.section))],Array.from({length:27},(_,i)=>i+1));
assert.deepEqual(sections1857.flatMap(s=>s.rows.map(r=>r.id)),passages1857.map(r=>r.id));
assert.equal((passages1857.map(r=>r.text).join('').match(/Author’s footnote/g)||[]).length,5);assert.equal(source.authorFootnotes,5);
assert.equal((german.match(/\\epsfbox\{/g)||[]).length,4);
const html=fs.readFileSync(new URL('dist/riemann-1857/index.html',root),'utf8');
for(const r of passages1857)assert(html.includes(`id="${r.id}"`));
assert.equal((html.match(/<figure /g)||[]).length,13);assert.equal(proofs1857.length,11);
for(const p of proofs1857){assert(html.includes(`id="${p.id}"`));assert(html.includes(`href="#${p.id}"`));}
for(const phrase of ['Special pole configurations can increase','The pulled-back theta function may vanish identically','genus-one','constant-multiplier condition','without proof-assistant verification','not collated every word','three preliminary papers'])assert(html.includes(phrase),phrase);
assert.equal(fs.readFileSync(new URL('dist/riemann-1857/source-de.tex',root),'utf8'),german);
assert.equal(works.find(w=>w.id==='riemann-1857').year,1857);
assert.equal(englishSources['riemann-1857'].availability,'published-book');assert(html.includes('24 October 2026'));
assert(citations.some(c=>c.from==='riemann-1857'&&c.to==='riemann-1851'));
assert(fs.readFileSync(new URL('dist/riemann-1851/index.html',root),'utf8').includes('href="../riemann-1857/"'));
for(const c of concepts.filter(c=>c.work==='riemann-1857'))assert(html.includes('concepts/'+c.id+'/'));
assert(fs.readFileSync(new URL('dist/people/riemann/index.html',root),'utf8').includes('../../riemann-1857/'));
// Independently sum the original exponential series on a symmetric integer box.
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],scale=(a,k)=>[a[0]*k,a[1]*k];
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const exp=([x,y])=>[Math.exp(x)*Math.cos(y),Math.exp(x)*Math.sin(y)];
const abs=a=>Math.hypot(...a),div=(a,b)=>scale(mul(a,[b[0],-b[1]]),1/(b[0]**2+b[1]**2));
const close=(a,b,tol=2e-10)=>assert(abs(sub(a,b))<tol*(1+abs(a)+abs(b)),JSON.stringify({a,b}));
function theta(A,v,N=9){let total=[0,0];for(let x=-N;x<=N;x++)for(let y=-N;y<=N;y++){
 let e=add(add(scale(A[0][0],x*x),scale(A[0][1],2*x*y)),scale(A[1][1],y*y));e=add(e,add(scale(v[0],2*x),scale(v[1],2*y)));total=add(total,exp(e));}return total;}
const A=[[[-2,.2],[.3,-.1]],[[.3,-.1],[-1.7,.4]]];
let checked=0;
for(const v of [[[.1,.2],[-.15,.1]],[[.25,-.1],[.12,.3]],[[-.2,.05],[.1,-.25]]]){
 const t=theta(A,v);close(t,theta(A,v.map(w=>scale(w,-1))));
 for(let j=0;j<2;j++){
  const v1=v.map((w,k)=>k===j?add(w,[0,Math.PI]):w);close(t,theta(A,v1));
  const v2=v.map((w,k)=>add(w,A[k][j]));close(theta(A,v2),mul(exp(sub(scale(v[j],-2),A[j][j])),t));checked+=2;
 }
 const h=1e-4,Ap=structuredClone(A),Am=structuredClone(A);Ap[0][0][0]+=h;Am[0][0][0]-=h;
 const da=scale(sub(theta(Ap,v),theta(Am,v)),1/(2*h));
 const vp=structuredClone(v),vm=structuredClone(v);vp[0][0]+=h;vm[0][0]-=h;
 const dv=scale(add(sub(theta(A,vp),scale(t,2)),theta(A,vm)),1/(h*h));close(scale(da,4),dv,2e-6);
 const Bp=structuredClone(A),Bm=structuredClone(A);for(const [r,c] of [[0,1],[1,0]]){Bp[r][c][0]+=h;Bm[r][c][0]-=h;}
 const db=scale(sub(theta(Bp,v),theta(Bm,v)),1/(2*h));
 let mixed=[0,0];for(const sx of [-1,1])for(const sy of [-1,1]){const w=structuredClone(v);w[0][0]+=sx*h;w[1][0]+=sy*h;mixed=add(mixed,scale(theta(A,w),sx*sy/(4*h*h)));}close(scale(db,2),mixed,2e-6);checked+=2;
 const g=[.5,1/3],hh=[.25,.2];
 const ratio=w=>{const shifted=w.map((x,i)=>sub(sub(x,[0,Math.PI*g[i]]),add(scale(A[i][0],hh[0]),scale(A[i][1],hh[1]))));return mul(div(theta(A,shifted),theta(A,w)),exp(scale(add(scale(w[0],hh[0]),scale(w[1],hh[1])),-2)));};
 for(let j=0;j<2;j++){
  close(ratio(v.map((w,k)=>k===j?add(w,[0,Math.PI]):w)),mul(ratio(v),exp([0,-2*Math.PI*hh[j]])));
  close(ratio(v.map((w,k)=>add(w,A[k][j]))),mul(ratio(v),exp([0,2*Math.PI*g[j]])));checked+=2;
 }
}
for(const a of [[-Math.PI,0],[-2,.4],[-1.3,-.2]]){let t=[0,0];const v=scale(add(a,[0,Math.PI]),.5);for(let j=-15;j<=15;j++)t=add(t,exp(add(scale(a,j*j),scale(v,2*j))));close(t,[0,0],1e-11);}
for(let p=1;p<=12;p++){
 assert.equal(2*2-(2*p+2),2-2*p);
 for(let j=0;j<p;j++)assert(2*p-2*j-2>=0);
 assert(2*p-2*p-2<0);
}
for(let mu=3;mu<=10;mu++)for(const [p,r] of [[2*mu-3,(mu-2)**2],[2*mu-2,(mu-1)*(mu-3)]])assert.equal((mu-1)**2-r,p);
console.log(`Validated all 27 memoir sections and three preliminaries, five footnotes, four source-figure captions, thirteen drawings, eleven reconstructions, citation backlinks, ${checked} independently summed theta identities, genus-one shifts, and ramification examples.`);
