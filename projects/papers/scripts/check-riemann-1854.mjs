import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {sections1854,passages1854,source1854,synopsis1854} from '../src/riemann-complete.mjs';
import {circleFactor1854} from '../src/figures-riemann-1854.mjs';
const check=spawnSync(process.execPath,[new URL('./import-riemann-1854.mjs',import.meta.url).pathname,'--check'],{encoding:'utf8'});
assert.equal(check.status,0,check.stderr);
assert.equal(passages1854.length,45);
assert.equal(sections1854.length,13);
assert.deepEqual(sections1854.flatMap(s=>s.rows.map(r=>r.id)),passages1854.map(r=>r.id));
let end=0;
for(const r of passages1854){assert.equal(r.sourceStart,end);assert(r.historicalText&&r.text&&r.note);end=r.sourceEnd;}
assert.equal(end,source1854.bodyChars);
assert.equal((synopsis1854.match(/<li>/g)||[]).length,11);
assert(source1854.synopsisHistorical.includes('For the determination of its measure-relations'));
const html=fs.readFileSync(new URL('../dist/riemann-1854/index.html',import.meta.url),'utf8');
assert.equal((html.match(/<summary>Clifford’s 1873 wording<\/summary>/g)||[]).length,45);
for(const r of passages1854){
 assert(html.includes(`id="${r.id}"`));
 assert(html.includes(`<p>${r.historicalText}</p>`),'Truncated source comparison '+r.id);
}
for(const s of sections1854)assert(html.includes(`id="${s.id}"`));
for(const marker of ['Complete lecture','all eleven numbered subsections','Clifford’s synopsis wording','Counting is not a reconstruction theorem','half the excess','Local versus global','without proof-assistant verification','riemann-geometry-source.json'])assert(html.includes(marker),'Missing scope or coverage marker '+marker);
assert(!html.includes('This is not a complete translation')&&!html.includes('Between the passages'));
const evidence=JSON.parse(fs.readFileSync(new URL('../dist/riemann-geometry-source.json',import.meta.url),'utf8'));
assert.equal(evidence.english.sha256,source1854.english.sha256);
const german=fs.readFileSync(new URL('../src/sources/riemann-Geom-1998.tex',import.meta.url),'utf8');
assert(german.includes('halben Ueberschusse'));
// Independent check: integrate the radial stereographic metric analytically,
// then compare its circumference to the intrinsic-radius curves drawn in Fig. 9.
let samples=0;
for(const k of [-4,-1,-.1,0,.1,1,4])for(const fraction of [.01,.05,.1,.25,.5,.75]){
 const rho=k<0?2*fraction/Math.sqrt(-k):fraction;
 const r=k>0?2*Math.atan(Math.sqrt(k)*rho/2)/Math.sqrt(k):k<0?2*Math.atanh(Math.sqrt(-k)*rho/2)/Math.sqrt(-k):rho;
 const actual=rho/(1+k*rho*rho/4);
 assert(Math.abs(circleFactor1854(k,r)-actual)<1e-11);samples++;
}
// On a unit sphere the small-circle normal-coordinate correction recovers
// the stated minus-four-thirds ratio after division by triangle area squared.
for(const k of [-1,1]){
 const t=.001,s=circleFactor1854(k,t);
 const ratio=(t*t*((s/t)**2-1))/(t**4/4);
 assert(Math.abs(ratio+4*k/3)<1e-6);
}
// The pointwise counterexample: basis plane values vanish; a tilted one does not.
const q=v=>2*v[0]*v[1];
for(const v of [[1,0,0],[0,1,0],[0,0,1]])assert.equal(q(v),0);
assert(Math.abs(q([Math.SQRT1_2,Math.SQRT1_2,0])-1)<1e-14);
console.log(`Validated the complete Riemann lecture: 45 consecutive source intervals, all eleven subsections, closing synopsis, historical comparisons, ${samples} metric/circle checks, and curvature normalizations.`);
