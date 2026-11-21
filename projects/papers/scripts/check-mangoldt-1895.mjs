import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {mangoldtPassages,mangoldtSections} from '../src/mangoldt-1895.mjs';
import {works} from '../src/catalog.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('dist/mangoldt-1895/index.html'),source=JSON.parse(read('src/mangoldt-1895-source.json'));
const text=mangoldtPassages.map(r=>r.text).join('\n');
assert.equal(source.pages.length,51);
assert.deepEqual(source.pages.map(p=>p.page),Array.from({length:51},(_,i)=>255+i));
for(const p of source.pages)assert(p.sources.some(s=>s.kind==='image'&&/^[0-9a-f]{64}$/.test(s.sha256)));
assert.equal(works.find(w=>w.id==='mangoldt-1895').textCoverage.percent,100);
assert(mangoldtSections.every(s=>s.rows.length));
for(const p of mangoldtPassages){assert(html.includes('id="'+p.id+'"'));assert(p.note&&p.sourceUrl);}
for(let n=1;n<=67;n++)assert(text.includes('\\tag{'+n+'}'),'Missing source equation '+n);
assert(text.includes('\\tag{40a}'));
assert.equal((html.match(/class="math-figure"/g)||[]).length,3);
const k=Math.tan(1),C=0.5772156649015329;
const f12=Math.log(Math.PI**2/6)-(1+Math.sin(12*Math.log(2)))/4-(1+Math.sin(12*Math.log(3)))/9;
assert(f12<-.15125);
assert(12*Math.log(6)+2*Math.atan(6)+Math.PI/2+2*f12<12*(1+Math.log(Math.PI)));
const low=53*Math.log(53/(2*Math.PI))-53+5*Math.PI/2-1.548;
const high=2*(Math.log(53)**2+(C+Math.PI*k/2+1/k)*Math.log(53)+2.256);
assert(low>66.3239&&high<65.1461&&low>high);
// Independent geometric samples: endpoints, interior points, and both strip edges.
let angles=0;
for(const width of [.1,1,2,10,100])for(const fraction of [0,.1,.5,.9,1])for(const height of [-.5,-.25,0,.25,.5]){
 const x=width*fraction,c=1.5+height;
 const angle=Math.atan(x/c)+Math.atan((width-x)/c);
 assert(angle+1e-14>=Math.atan(width/2));angles++;
}
const zeros=JSON.parse(read('public/zeta-zeros-200.json')).ordinates;
let counts=0;
for(let h=12.5;h<Math.min(400,zeros.at(-1));h+=2.25){
 const count=zeros.filter(t=>t<=h).length;
 const main=h/(2*Math.PI)*Math.log(h/(2*Math.PI))-h/(2*Math.PI)+1.25;
 assert(Math.abs(count-main)<.34*Math.log(h)**2+1.35*Math.log(h)+1.33);counts++;
}
const essay=read('src/sources/scheibner-1860.html'),provenance=JSON.parse(read('src/sources/scheibner-1860-provenance.json'));
assert.equal(createHash('sha256').update(essay).digest('hex'),provenance.htmlSHA256);
assert.equal(provenance.pages.length,20);
for(let n=1;n<=14;n++)assert(essay.includes('id="sch60-'+n+'"'));
for(let n=1;n<=54;n++)assert(essay.includes('\\tag{'+n+'}')||(n===7&&essay.includes('\\tag{7a}')&&essay.includes('\\tag{7b}')),'Missing commentary equation '+n);
for(const marker of ['not valid','not endorsements','polynomial roots','-\\log2','S_\\varepsilon'])assert(essay.includes(marker));
const riemann=read('dist/riemann-1859/index.html');
const layout=JSON.parse(riemann.match(/<script id="reader-layout-data" type="application\/json">([^<]*)<\/script>/)[1]);
assert.equal(layout.essays[0].id,'scheibner-1860');
assert(layout.essays[0].textHTML.includes('id="sch60-14"'));
assert(!layout.essays[0].readingLinks,'Whole-work essay must remain unpegged');
console.log('Validated both full source inventories, 51+20 page records, all numbered formulas, three drawings, '+angles+' geometric samples, historical decimal bounds, and '+counts+' sampled zero counts. Numerical checks do not constitute a general proof.');
