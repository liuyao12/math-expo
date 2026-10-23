import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {passages1851,sections1851,synopsis1851} from '../src/riemann-1851.mjs';
import {proofs1851} from '../src/statements-riemann-1851.mjs';
import {works,citations,concepts,englishSources} from '../src/catalog.mjs';
const source=JSON.parse(fs.readFileSync(new URL('../src/riemann-1851-source.json',import.meta.url)));
const german=fs.readFileSync(new URL('../src/'+source.sourceFile,import.meta.url),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(hash(german),source.sha256,'Pinned German transcription changed');
const heads=[...german.matchAll(/\\centerline\{(\d+)\.\}/g)];
assert.equal(heads.length,22);assert.equal(source.sections.length,22);
for(let i=0;i<heads.length;i++){
 const raw=german.slice(heads[i].index+heads[i][0].length,heads[i+1]?.index??german.indexOf('\\vfill\\eject'));
 assert.equal(hash(raw),source.sections[i].sha256,`Source section ${i+1} changed`);
 assert(passages1851.some(r=>r.section===i+1),`Missing translation section ${i+1}`);
}
assert.equal(heads.at(-1)[1],'21');assert.equal(source.sections.at(-1).section,22);
assert.equal(synopsis1851.length,22);
assert.equal((german.slice(0,german.indexOf('\\vfill\\eject')).match(/\\footnote\{/g)||[]).length,9);
assert.equal((passages1851.map(r=>r.text).join('').match(/Author’s (?:footnote|reference)/g)||[]).length,9);
assert.deepEqual(sections1851.flatMap(s=>s.rows.map(r=>r.id)),passages1851.map(r=>r.id));
assert.equal(new Set(passages1851.map(r=>r.id)).size,passages1851.length);
const html=fs.readFileSync(new URL('../dist/riemann-1851/index.html',import.meta.url),'utf8');
for(const r of passages1851)assert(html.includes(`id="${r.id}"`));
assert.equal((html.match(/<figure /g)||[]).length,8);
assert.equal(proofs1851.length,9);
for(const p of proofs1851){assert(html.includes(`id="${p.id}"`));assert(html.includes(`href="#${p.id}"`));}
for(const phrase of ['A lower bound does not establish attainment','No effective representation','not been collated every','The root is single-valued','finite-order growth assumption','without proof-assistant verification']){
 if(phrase==='not been collated every')assert(html.includes('not collated every word'));
 else assert(html.includes(phrase),phrase);
}
assert(works.find(w=>w.id==='riemann-1851').edition);
assert.equal(englishSources['riemann-1851'].availability,'published-book');
assert(html.includes('View publisher’s edition'));assert(!html.includes('Translator credit not yet verified'));
assert(citations.some(e=>e.from==='riemann-1851'&&e.to==='gauss-1828'&&e.anchor==='r51-22'));
assert(fs.readFileSync(new URL('../dist/gauss-1828/index.html',import.meta.url),'utf8').includes('href="../riemann-1851/"'));
for(const c of concepts.filter(c=>c.work==='riemann-1851'))assert(html.includes('concepts/'+c.id+'/'));
assert.equal(fs.readFileSync(new URL('../dist/riemann-1851/source-de.tex',import.meta.url),'utf8'),german);
// Independent numerical checks of the explicit examples, not purported tests of the general theorems.
const mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const norm2=([x,y])=>x*x+y*y;
const div=(a,b)=>mul(a,[b[0]/norm2(b),-b[1]/norm2(b)]);
const near=(a,b)=>assert(Math.abs(a-b)<1e-10);
let samples=0;
for(const a of [[0,0],[.3,.2],[-.7,.1]])for(let j=0;j<24;j++){
 const z=[Math.cos(j*Math.PI/12)*.8,Math.sin(j*Math.PI/12)*.8];
 const denominator=sub([1,0],mul([a[0],-a[1]],z));
 const f=div(sub(z,a),denominator);
 near(1-norm2(f),(1-norm2(a))*(1-norm2(z))/norm2(denominator));
 const boundary=[Math.cos(j*Math.PI/12),Math.sin(j*Math.PI/12)];
 near(norm2(div(sub(boundary,a),sub([1,0],mul([a[0],-a[1]],boundary)))),1);
 samples++;
}
for(const eps of [.1,.01,.001]){
 const J=3,length=2,energy=length*eps*(J/eps)**2;
 near(energy,length*J*J/eps);
}
console.log(`Validated all 22 German source sections and translated sections, nine author footnotes, source contents, eight figures, nine reconstructions, reciprocal citation links, and ${samples} disk-map examples.`);
