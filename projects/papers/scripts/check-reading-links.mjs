import assert from 'node:assert/strict';
import fs from 'node:fs';
import {authoredCommentaries} from '../src/authored-commentaries.mjs';
import source from '../src/dedekind-text.json' with {type:'json'};
import {containingLink} from '../public/reading-links.mjs';
const guide=authoredCommentaries.find(c=>c.id==='crosby-2016').readingLinks;
const essay=source.essays.find(e=>e.id===guide.work);
const sections=essay.sections.filter(s=>s.id!=='d72-preface');
assert.equal(guide.kind,'section-guide');assert(guide.notice.includes('not a transcription'));
assert.equal(guide.blocks.length,7);
assert.equal(new Set(guide.blocks.map(b=>b.id)).size,7);
const paragraphs=guide.blocks.flatMap(b=>b.paper);
assert.equal(paragraphs.length,60);assert.equal(new Set(paragraphs).size,60);
for(let i=0;i<sections.length;i++){
 assert.deepEqual(guide.blocks[i].paper,sections[i].rows);
 assert.equal(guide.blocks[i].title,sections[i].title);
 for(const id of sections[i].rows)assert.equal(containingLink(guide.blocks,id),guide.blocks[i]);
}
for(const id of ['d72-preface-1','references','sources',null])assert.equal(containingLink(guide.blocks,id),null);
// Multiple paragraphs can share one commentary block, without interpolating
// a fictitious match across a gap or a different paper.
const sample=[{paper:['a-1','a-2']},{paper:['a-4']}];
assert.equal(containingLink(sample,'a-2'),sample[0]);
assert.equal(containingLink(sample,'a-3'),null);assert.equal(containingLink(sample,'b-1'),null);
for(const route of ['dedekind-1872/index.html','dedekind-1872/compare/index.html']){
 const html=fs.readFileSync(new URL('../dist/'+route,import.meta.url),'utf8');
 for(const id of paragraphs)assert(html.includes(`id="${id}"`),id);
 const data=JSON.parse(html.match(/<script id="reader-layout-data" type="application\/json">([^<]*)<\/script>/)[1]);
 assert.deepEqual(data.essays.find(c=>c.id==='crosby-2016').readingLinks,guide);
}
console.log('Validated seven explicit section links covering sixty Dedekind paragraphs, shared targets, unmapped gaps, and both reader routes.');
