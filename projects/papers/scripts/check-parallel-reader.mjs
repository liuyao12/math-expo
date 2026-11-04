import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {authoredCommentaries,commentariesFor,furtherReading,furtherReadingFor} from '../src/authored-commentaries.mjs';
import {works,citations} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
assert.equal(authoredCommentaries.length,12);
assert.equal(new Set(authoredCommentaries.map(c=>c.id)).size,12);
for(const c of authoredCommentaries){
 assert(c.author&&c.title&&c.publication&&c.scope&&c.verification&&c.checked);
 assert(c.url.startsWith('https://')&&c.evidence.startsWith('https://'));
 if(c.html)assert(c.permission&&c.reuse.includes('express reuse permission'));
 else assert(c.reuse.includes('no full-text republication license'));
 for(const id of c.works)assert(works.some(w=>w.id===id));
}
assert.equal(authoredCommentaries.find(c=>c.id==='stillwell-2010').works.length,7);
assert.equal(citations.length,29);
assert(!authoredCommentaries.some(c=>c.id==='tao-2013'));
assert(furtherReading.some(c=>c.id==='tao-2013'));
assert.deepEqual(commentariesFor('riemann-1859').map(c=>c.id),['dittrich-2016']);
assert(commentariesFor('euler-1740').some(c=>c.id==='monks-2019'));
assert(commentariesFor('dedekind-1872').some(c=>c.id==='crosby-2016'));
assert(commentariesFor('dedekind-1888').some(c=>c.id==='sieg-schlimm-2005'));
const article=read('src/sources/tao-2013.html'),provenance=JSON.parse(read('src/sources/tao-2013-provenance.json'));
assert.equal(createHash('sha256').update(article).digest('hex'),provenance.htmlSHA256);
assert.equal(provenance.sourceProseWords,9663);assert.equal(provenance.mathCount,866);
assert.equal([...article.matchAll(/\\\(|\\\[/g)].length,866);
assert(!article.includes('<img'));assert(!article.includes('sharedaddy'));assert(!article.includes('comment-'));
let count=0;
for(const w of works.filter(w=>commentariesFor(w.id).length||furtherReadingFor(w.id).length)){
 count++;
 const html=read(`dist/${w.id}/compare/index.html`),ordinary=read(`dist/${w.id}/index.html`);
 assert(ordinary.includes('href="compare/"'));
 assert(html.includes('id="primary-scroll"')&&html.includes('id="commentary-scroll"'));
 assert(!/<iframe|<object|<embed|pdf-reader|docs.google.com/.test(html));
 const data=JSON.parse(html.match(/<script id="parallel-data" type="application\/json">([^<]*)<\/script>/)[1]);
 assert.equal(data.essays.length,commentariesFor(w.id).length);
 assert(!data.essays.some(c=>c.id==='tao-2013'));
 assert(!html.includes(article.trim()));
 assert(html.includes('id="authored-pane"'));
 assert(html.includes('Collapse authored commentary')||html.includes('Show authored commentary'));
 if(w.id==='riemann-1859'){assert(html.includes('zeta-reader.mjs'));assert(html.includes('id="zeta-plot"'));assert(html.includes('id="explicit-pairs"'));assert(data.essays.some(c=>c.id==='dittrich-2016'));}
 assert.deepEqual(JSON.parse(read(`dist/${w.id}/companion-sources.json`)),commentariesFor(w.id));
}
assert.equal(count,17);
assert.equal(works.find(w=>w.id==='noether-1918').textCoverage.percent,0);
const directory=read('dist/commentaries/index.html');
for(const c of authoredCommentaries)for(const id of c.works)assert(directory.includes(`../${id}/compare/?commentary=${c.id}`));
assert(read('dist/further-reading/tao-2013/index.html').includes(article.trim()));
const controller=read('public/parallel-reader.mjs');assert(controller.includes('pane.hidden=collapsed'));assert(controller.includes("new Event('resize')"));assert(!controller.includes('primary.innerHTML'));
console.log('Validated twelve sourced commentaries, seventeen HTML readers, retained zeta and explicit-formula exhibits, and Tao’s separate further-reading classification.');
