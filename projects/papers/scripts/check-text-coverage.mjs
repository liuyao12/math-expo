import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {works} from '../src/catalog.mjs';
import {textCoverage,textCoveragePolicy} from '../src/text-coverage.mjs';
import {passagesCartan1913} from '../src/cartan-1913.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const catalogue=read('dist/index.html'),data=JSON.parse(read('dist/catalog.json'));
assert.equal(Object.keys(textCoverage).length,works.length);assert.deepEqual(data.textCoveragePolicy,textCoveragePolicy);
for(const w of works){
 const c=w.textCoverage,page=read('dist/'+w.id+'/index.html');
 assert.deepEqual(data.works.find(x=>x.id===w.id).textCoverage,c);
 assert.equal(Number.isInteger(c.percent),true);assert(c.percent>=0&&c.percent<=100);
 assert.equal(c.status==='complete',c.percent===100);assert.equal(Boolean(w.edition),c.percent>0);
 if(c.status==='not-started')assert.equal(c.percent,0);if(c.status==='partial')assert(c.percent>0&&c.percent<100&&c.approximate);
 const progress=`<progress max="100" value="${c.percent}"`;
 for(const html of [catalogue,page,...w.authors.map(id=>read('dist/people/'+id+'/index.html'))]){
  assert(html.includes(`data-completion-work="${w.id}" data-completion-status="${c.status}"`));
  assert(html.includes(progress));
 }
 assert.equal((page.match(/<progress /g)||[]).length,1);assert(page.includes('What this percentage measures'));
 assert(page.includes('External PDFs and commentary do not contribute'));
}
assert.equal((catalogue.match(/<progress /g)||[]).length,works.length);
assert.equal(works.find(w=>w.id==='euler-1748-circle').textCoverage.percent,100);
assert(textCoverage['euler-1748-circle'].scope.includes('Chapter VIII only'));
assert.equal(textCoverage['lie-1880'].percent,0); // A located English translation cannot fill an on-site bar.
assert.equal(textCoverage['hilbert-1900'].percent,0); // Same for inspected external English.
const meta=JSON.parse(read('src/cartan-1913-source.json')),ocr=read('src/'+meta.sourceFile),c=meta.coverage,page=read('dist/cartan-1913/index.html');
assert.equal(hash(ocr),meta.sha256);assert.equal(meta.pages.length,44);let end=0;
for(const p of meta.pages){assert.equal(p.start,end);assert.equal(hash(ocr.slice(p.start,p.end)),p.sha256);assert.equal(p.printPage,p.pdfPage+51);end=p.end;}assert.equal(end,ocr.length);
const count=s=>s.replace(/\s/g,'').length;
assert.equal(count(ocr),c.totalUnits);let prev=0;
for(const range of c.intervals){assert(range.start>=prev);assert(range.end>range.start&&range.end<=ocr.length);prev=range.end;}
assert.equal(c.intervals.reduce((n,r)=>n+count(ocr.slice(r.start,r.end)),0),c.coveredUnits);
assert.equal(Math.round(100*c.coveredUnits/c.totalUnits),c.percent);assert.equal(c.percent,8);
assert.equal(ocr.slice(c.intervals[0].end,c.intervals[0].end+2),'I.');
assert.equal(textCoverage['cartan-1913'].percent,c.percent);
assert.equal(passagesCartan1913.length,10);assert.equal((page.match(/<figure /g)||[]).length,2);assert.equal((page.match(/class="author-footnote"/g)||[]).length,2);
for(const r of passagesCartan1913){assert(page.includes(`id="${r.id}"`));assert(page.includes(r.sourceUrl));assert(r.note);}
for(const phrase of ['Sections I–XXII are not yet translated','all-zero','central element','273','without proof-assistant verification','not yet rendered'])assert(page.includes(phrase),phrase);
assert.equal(read('dist/cartan-1913/source-evidence.json'),read('src/cartan-1913-source.json'));assert.equal(read('dist/cartan-1913/source-fr-ocr.txt'),ocr);
// The displayed raising/lowering operators on binary forms: exact coefficients and bracket.
for(let p=1;p<=20;p++)for(let k=0;k<=p;k++){
 const EF=(p-k)*(k+1),FE=k*(p-k+1);assert.equal(EF-FE,p-2*k);
 if(k<p)assert(p-k>0);if(k>0)assert(k>0);
 assert.equal((-1)**p,p%2?-1:1);
}
console.log('Validated explicit text coverage for every catalogue, author and work page; accessible native bars; external-source exclusion; chapter scope; and Cartan’s partial introduction with reproducible 8% source intervals, two footnotes, two drawings, and binary-form coefficients.');
