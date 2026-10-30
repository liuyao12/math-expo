import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {authoredCommentaries,commentariesFor} from '../src/authored-commentaries.mjs';
import {works,citations} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
assert.equal(authoredCommentaries.length,9);
assert.equal(new Set(authoredCommentaries.map(c=>c.id)).size,9);
for(const c of authoredCommentaries){
 assert(c.author&&c.title&&c.publication&&c.scope&&c.verification&&c.checked);
 assert(c.url.startsWith('https://')&&c.evidence.startsWith('https://'));
 if(c.html)assert(c.permission&&c.reuse.includes('express reuse permission'));
 else assert(c.reuse.includes('no full-text republication license'));
 for(const id of c.works)assert(works.some(w=>w.id===id));
}
assert.equal(authoredCommentaries.find(c=>c.id==='stillwell-2010').works.length,7);
assert.equal(citations.length,29);
const article=read('src/sources/tao-2013.html'),provenance=JSON.parse(read('src/sources/tao-2013-provenance.json'));
assert.equal(createHash('sha256').update(article).digest('hex'),provenance.htmlSHA256);
assert.equal(provenance.sourceProseWords,9663);assert.equal(provenance.mathCount,866);
assert.equal([...article.matchAll(/\\\(|\\\[/g)].length,866);
assert(!article.includes('<img'));assert(!article.includes('sharedaddy'));assert(!article.includes('comment-'));
let count=0;
for(const w of works.filter(w=>commentariesFor(w.id).length)){
 count++;
 const html=read(`dist/${w.id}/compare/index.html`),ordinary=read(`dist/${w.id}/index.html`);
 assert(ordinary.includes('href="compare/"'));
 assert(html.includes('id="primary-scroll"')&&html.includes('id="commentary-scroll"'));
 assert(!/<iframe|<object|<embed|pdf-reader|docs.google.com/.test(html));
 const data=JSON.parse(html.match(/<script id="parallel-data" type="application\/json">([^<]*)<\/script>/)[1]);
 assert.equal(data.essays.length,commentariesFor(w.id).length);
 if(commentariesFor(w.id).some(c=>c.html))assert(html.includes(article.trim()));
 assert.deepEqual(JSON.parse(read(`dist/${w.id}/companion-sources.json`)),commentariesFor(w.id));
}
assert.equal(count,16);
assert.equal(works.find(w=>w.id==='noether-1918').textCoverage.percent,0);
const directory=read('dist/commentaries/index.html');
for(const c of authoredCommentaries)for(const id of c.works)assert(directory.includes(`../${id}/compare/?commentary=${c.id}`));
console.log('Validated sixteen HTML-only parallel readers, the complete permitted Tao article and all 866 recovered formulas, source records, attribution, and unchanged primary-text coverage and citation edges.');
