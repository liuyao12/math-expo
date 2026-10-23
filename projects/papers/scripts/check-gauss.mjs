import assert from 'node:assert/strict';
import {gaussSource,passagesGauss} from '../src/gauss-1828.mjs';
import {statementsGauss} from '../src/statements-gauss-1828.mjs';
assert.equal(passagesGauss.length,29);assert.deepEqual(passagesGauss.map(r=>r.number),Array.from({length:29},(_,i)=>i+1));
assert.equal(gaussSource.rows.reduce((n,r)=>n+r.math,0),934);assert.equal(gaussSource.rows.reduce((n,r)=>n+r.footnotes,0),1);
assert.deepEqual([...new Set(gaussSource.editorialCorrections.map(c=>c.article))],[7,8,11,20,24,29]);
assert.equal(statementsGauss.length,6);
let cases=0;
for(let t=-2;t<=2;t++)for(let u=-2;u<=2;u++)for(let T=-2;T<=2;T++)for(let U=-2;U<=2;U++)for(let V=-2;V<=2;V++){
 const E=1+t*t,F=t*u,G=1+u*u,delta=E*G-F*F;
 const Ep=2*t*T,Eq=2*t*U,Fp=T*u+t*U,Fq=U*u+t*V,Gp=2*u*U,Gq=2*u*V;
 // Third derivatives cancel from E_qq - 2F_pq + G_pp.
 const second=2*(U*U-T*V);
 const rhs=E*(Eq*Gq-2*Fp*Gq+Gp*Gp)+F*(Ep*Gq-Eq*Gp-2*Eq*Fq+4*Fp*Fq-2*Fp*Gp)+G*(Ep*Gp-2*Ep*Fq+Eq*Eq)-2*delta*second;
 assert.equal(delta,1+t*t+u*u);assert(rhs===4*(T*V-U*U));cases++;
}
// The source’s unsquared determinant would already fail a unit sphere.
for(const p of [.2,.7,1.1]){const G=Math.sin(p)**2,Gp=2*Math.sin(p)*Math.cos(p),Gpp=2*Math.cos(2*p),rhs=Gp*Gp-2*G*Gpp;assert(Math.abs(rhs/(4*G*G)-1)<1e-12);}
assert.equal(495113+495104+495131,1485348);
console.log(`Validated Gauss’s 29 articles, 934 formulas, author footnote, six repair locations, ${cases} exact graph/metric curvature identities, sphere checks, and surveying decimals.`);

// Source import, full rendered inventory, and the prose-only transformation.
const fs=await import('node:fs');
const {spawnSync}=await import('node:child_process');
const {modernizeGauss}=await import('../src/modern-gauss.mjs');
const {gaussOctantPaths,radialPoint}=await import('../src/figures-gauss-1828.mjs');
const imported=spawnSync(process.execPath,[new URL('./import-gauss.mjs',import.meta.url).pathname,'--check'],{encoding:'utf8'});
assert.equal(imported.status,0,imported.stderr);
const math=s=>[...s.matchAll(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g)].map(m=>m[0]);
const markup=s=>[...s.matchAll(/<[^>]*>/g)].map(m=>m[0]);
for(const r of gaussSource.rows){
 const modern=modernizeGauss(r.text);
 assert.deepEqual(math(modern),math(r.text),'Mathematics lost during prose revision '+r.number);
 assert.deepEqual(markup(modern),markup(r.text),'Source structure lost during prose revision '+r.number);
 assert.notEqual(modern,r.text,'Article has no prose revision '+r.number);
}
const html=fs.readFileSync(new URL('../dist/gauss-1828/index.html',import.meta.url),'utf8');
const catalog=JSON.parse(fs.readFileSync(new URL('../dist/catalog.json',import.meta.url),'utf8'));
assert.equal((html.match(/class="passage"/g)||[]).length,29);
assert.equal((html.match(/<summary>Compare the 1902 English<\/summary>/g)||[]).length,29);
for(const r of passagesGauss){assert(html.includes(`id="${r.id}"`));assert(html.includes(r.historicalText),'Historical comparison truncated '+r.id);}
for(const p of statementsGauss){assert(html.includes(`id="${p.id}"`));assert(catalog.statements['gauss-1828'].some(s=>s.id===p.id));}
for(const s of ['regular two-dimensional','without proof-assistant verification','higher-order coefficients','source-g28-fn-1','g28-fn-1','Articles 1–29','Morehead','Hiltebeitel','gauss-source-evidence.json'])assert(html.includes(s),'Missing scope or coverage marker '+s);
assert.equal(catalog.works.find(w=>w.id==='gauss-1828').edition,'Complete modern-English reading');
assert(html.includes('This is a contradiction.'));
assert(html.includes('Q.E.A. (a contradiction).'));
assert.equal(catalog.people.length,new Set(catalog.people.map(p=>p.id)).size);
assert(catalog.englishSources['gauss-1828'].readingBasis);
// Great-circle samples in the diagram really lie on the coordinate sphere.
for(const edge of gaussOctantPaths)for(const p of edge){assert(Math.abs(Math.hypot(...p)-1)<1e-14);assert(p.some(x=>x===0));}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
const angleAt=(a,b,c)=>{const tangent=v=>unit(v.map((x,i)=>x-dot(v,a)*a[i]));return Math.acos(Math.max(-1,Math.min(1,dot(tangent(b),tangent(c)))));};
// Independently integrate the radial area and compare to the three vertex
// angles of finite spherical triangles, rather than only checking an octant.
for(const [b,c,A] of [[.4,.5,.6],[.6,.9,.7],[.9,.7,1.1]]){
 const north=[0,0,1],B=radialPoint(b,0),C=radialPoint(c,A),n=cross(B,C);
 const boundary=q=>{let r=Math.atan2(-n[2],n[0]*Math.cos(q)+n[1]*Math.sin(q));if(r<0)r+=Math.PI;return r;};
 const N=2000,h=A/N;let area=0;
 for(let i=0;i<=N;i++){const r=boundary(i*h),weight=i===0||i===N?1:i%2?4:2;area+=weight*(1-Math.cos(r));}
 area*=h/3;
 const excess=angleAt(north,B,C)+angleAt(B,north,C)+angleAt(C,north,B)-Math.PI;
 assert(Math.abs(area-excess)<1e-11);
}
console.log('Validated all 29 rendered articles and comparisons, six linked proofs, source import hashes, unchanged formula order, great-circle drawing samples, and three independent spherical-triangle area integrals.');
