import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {representationWorks,representationEnglish,representationCitations,conceptsLie1874} from '../src/representation-catalog.mjs';
import {passagesLie1874,sectionsLie1874} from '../src/lie-1874.mjs';
import {proofsLie1874} from '../src/statements-lie-1874.mjs';
import {compareWorks,matchesWork,discoveryTerms} from '../src/discovery.mjs';
import {works,people,citations,bibliographicFields} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const meta=JSON.parse(read('src/lie-1874-source.json')),ocr=read('src/'+meta.sourceFile),html=read('dist/lie-1874/index.html'),catalogue=read('dist/index.html');
assert.equal(hash(ocr),meta.sha256);assert.equal(meta.pages.length,8);let end=0;
for(const p of meta.pages){assert.equal(p.start,end);assert.equal(hash(ocr.slice(p.start,p.end)),p.sha256);assert.equal(p.pdfPage,p.collectedPage+18);end=p.end;}assert.equal(end,ocr.length);
assert.equal(passagesLie1874.length,13);assert.equal(sectionsLie1874.length,6);assert.deepEqual(sectionsLie1874.flatMap(s=>s.rows.map(r=>r.id)),passagesLie1874.map(r=>r.id));
for(const r of passagesLie1874){assert(html.includes(`id="${r.id}"`));assert.equal(Number(r.sourceUrl.split('#page=')[1]),meta.sourcePageRanges[r.id][0]+18);assert(r.note);}
assert.equal(proofsLie1874.length,5);assert.equal((html.match(/<figure /g)||[]).length,6);assert.equal((html.match(/class="author-footnote"/g)||[]).length,5);
for(const p of proofsLie1874){assert(html.includes(`id="${p.id}"`));assert(html.includes(`href="#${p.id}"`));assert(passagesLie1874.some(r=>r.id===p.anchor));assert(p.proof.length>500);}
for(const c of conceptsLie1874)assert(html.includes('concepts/'+c.id+'/'));
for(const marker of ['without proof-assistant verification','classification announcements','fixed point','neither identity nor inverses','original journal impression has not been collated separately','five author footnotes'])assert(html.toLowerCase().includes(marker.toLowerCase()),marker);
assert.equal(representationWorks.length,9);assert.equal(representationWorks.filter(w=>w.edition).length,2);
for(const w of representationWorks){assert(works.some(r=>r.id===w.id));assert(bibliographicFields[w.id]);const page=read('dist/'+w.id+'/index.html');if(w.id==='lie-1874')assert(page.includes('Complete founding note'));else if(w.id==='cartan-1913')assert(page.includes('Introduction complete'));else assert(page.includes('Full reading not yet prepared'));}
assert.equal(works.find(w=>w.id==='peter-weyl-1927').year,1927);assert.equal(bibliographicFields['peter-weyl-1927'].pages,'737--755');assert.deepEqual(works.find(w=>w.id==='peter-weyl-1927').authors,['peter','weyl']);
for(const [id,e]of Object.entries(representationEnglish)){assert.equal(e.status,'located');assert.equal(e.availability,'bibliographic-record');assert(catalogue.match(new RegExp('data-work="'+id+'"[^>]*data-english="false"')));assert(read('dist/'+id+'/index.html').includes('full file not inspected'));}
for(const edge of representationCitations){assert(citations.some(c=>c.from===edge.from&&c.to===edge.to));assert(read('dist/'+edge.from+'/index.html').includes('../'+edge.to+'/'));assert(read('dist/'+edge.to+'/index.html').includes('../'+edge.from+'/'));}
// Server-rendered and client sorting use the same comparator, with numbered-part ties.
const authorSort=w=>people.find(p=>p.id===w.authors[0]).name.split(' ').at(-1),sorted=[...works].map(w=>({...w,authorSort:authorSort(w)})).sort(compareWorks);
const ids=[...catalogue.matchAll(/<article class="work-record"[^>]*data-work="([^"]+)"/g)].map(x=>x[1]);assert.deepEqual(ids,sorted.map(w=>w.id));assert(sorted.every((w,i)=>!i||w.year>=sorted[i-1].year));
const parts=representationWorks.filter(w=>w.year===1926).reverse();assert.deepEqual(parts.sort(compareWorks).map(w=>w.id),['weyl-1926-representations-2','weyl-1926-representations-3','weyl-1926-addendum']);assert.equal([...parts].sort((a,b)=>compareWorks(a,b,'newest'))[0].id,'weyl-1926-addendum');
assert(catalogue.includes('value="oldest" selected'));assert(catalogue.includes('Date · oldest first'));assert(catalogue.includes('id="work-sort"'));
const riemann=read('dist/people/riemann/index.html'),rYears=[...riemann.matchAll(/<article class="work-record"[^>]*data-year="(\d+)"/g)].map(x=>Number(x[1]));assert.deepEqual(rYears,[...rYears].sort((a,b)=>a-b));
for(const id of ['lie','elie-cartan','weyl','peter'])assert(read('dist/people/'+id+'/index.html').includes('person-surname'));
const discover=(id)=>{const w=works.find(w=>w.id===id);return {...w,searchText:[w.title,w.summary,...discoveryTerms[id]].join(' '),english:false,edited:Boolean(w.edition)};};assert(matchesWork(discover('cartan-1913'),{q:'highest weights',author:['elie-cartan']}));assert(matchesWork(discover('lie-1874'),{q:'Lie bracket',access:['edited']}));
// Independent polynomial bracket arithmetic for every displayed line model.
const trim=a=>{while(a.length>1&&!a.at(-1))a.pop();return a;},add=(a,b,k=1)=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]??0)+k*(b[i]??0))),mul=(a,b)=>{const r=Array(a.length+b.length-1).fill(0);a.forEach((v,i)=>b.forEach((w,j)=>r[i+j]+=v*w));return trim(r);},der=a=>a.length===1?[0]:a.slice(1).map((v,i)=>v*(i+1)),br=(a,b)=>add(mul(a,der(b)),mul(b,der(a)),-1);
assert.deepEqual(br([1],[0,1]),[1]);assert.deepEqual(br([1],[0,0,1]),[0,2]);assert.deepEqual(br([0,1],[0,0,1]),[0,0,1]);
for(let m=3;m<=10;m++){const f=Array(m+1).fill(0);f[m]=1;const b=br(f,der(f));assert.equal(b.length-1,2*m-2);assert.equal(b.at(-1),-m);}
const mat=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
for(let a=-3;a<=3;a++)if(a)for(let b=-3;b<=3;b++)for(let c=-3;c<=3;c++)if(c)for(let d=-3;d<=3;d++)assert.deepEqual(mat([[a,b],[0,1]],[[c,d],[0,1]]),[[a*c,a*d+b],[0,1]]);
for(let x=-3;x<=3;x++)for(let t=-3;t<=3;t++)if(1-t*x)assert.equal((x/(1-t*x))*(1-t*x),x);
// A transverse translation symmetry of dy/dx=y gives a closed integrating form.
for(const y of [-3,-1,.5,2]){const Q=-y;assert.equal(0+y*(-1)-1*Q,0);assert.equal((-y)/Q,1);}
console.log('Validated chronological defaults and author lists, numbered-part ties, nine representation records, eight sourced citation edges, honest English-access status, the complete Lie note with five author footnotes, six drawings, five reconstructions, source-page hashes and exact line-algebra calculations.');
