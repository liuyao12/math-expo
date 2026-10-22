import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {introduction,lineElement} from '../src/riemann.mjs';
import {passages1859} from '../src/riemann-1859.mjs';
import {works,people,concepts,citations,bibliographicFields,englishSources} from '../src/catalog.mjs';
import {statements1859} from '../src/statements-1859.mjs';
import {passagesEuler} from '../src/euler-1740.mjs';
import {statementsEuler} from '../src/statements-euler-1740.mjs';
import './check-euler-arithmetic.mjs';
import './check-euler-more.mjs';
import {discoveryTerms,matchesWork} from '../src/discovery.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const katexContext={};
vm.runInNewContext(fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.js'),'utf8'),katexContext);
new vm.Script(fs.readFileSync(path.join(root,'public/reader.js'),'utf8'));
new vm.Script(fs.readFileSync(path.join(dist,'discovery.js'),'utf8'));
const pages=new Map();
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.html'))pages.set(p,fs.readFileSync(p,'utf8'));}}
walk(dist);
let formulas=0,links=0;
const idsByPage=new Map();
for(const [file,html] of pages){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)throw Error(`Duplicate HTML IDs in ${file}`);
  idsByPage.set(file,new Set(ids));
  if(/\[\[(person|concept|work):/.test(html))throw Error(`Unresolved reference in ${file}`);
  for(const match of html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
    try{const latex=match[1]??match[2];if(/<[A-Za-z]/.test(latex))throw Error('Raw less-than sign can become an HTML tag; use \\lt');katexContext.katex.renderToString(latex,{throwOnError:true});formulas++;}
    catch(error){throw Error(`Bad LaTeX in ${file}: ${error.message}`);}
  }
}
for(const [file,html] of pages){
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const href=match[1].replaceAll('&amp;','&');
    if(/^(https?:|data:|mailto:)/.test(href))continue;
    const url=new URL(href,`file://${file}`);
    let target=fileURLToPath(url);
    // Only the deliberate link from the project to the Math Expo hub exits dist.
    if(!target.startsWith(dist+path.sep)&&target!==dist){if(target===path.dirname(dist)+path.sep)continue;throw Error(`Link escapes project: ${href}`);}
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target))throw Error(`Missing local resource: ${path.relative(dist,file)} → ${href}`);
    if(url.hash&&!idsByPage.get(target)?.has(decodeURIComponent(url.hash.slice(1))))throw Error(`Missing anchor: ${path.relative(dist,file)} → ${href}`);
    links++;
  }
}
for(const [work,rows] of [['riemann-1854',[...introduction,...lineElement]],['riemann-1859',passages1859],['euler-1740',passagesEuler]]){
  const ids=idsByPage.get(path.join(dist,work,'index.html'));
  for(const row of rows)if(!ids.has(row.id))throw Error(`Missing ${work} passage ${row.id}`);
}
const workIds=new Set(works.map(w=>w.id)),personIds=new Set(people.map(p=>p.id)),edges=new Set();
for(const w of works){
  if(!bibliographicFields[w.id])throw Error(`Missing citation fields: ${w.id}`);
  for(const author of w.authors)if(!personIds.has(author))throw Error(`Unknown author: ${author}`);
  const html=pages.get(path.join(dist,w.id,'index.html'));
  for(const id of ['references','cited-by','cite'])if(!idsByPage.get(path.join(dist,w.id,'index.html')).has(id))throw Error(`Missing ${id} for ${w.id}`);
  if(!html.includes('not a complete citation count'))throw Error(`Missing citation coverage for ${w.id}`);
  if(!fs.readFileSync(path.join(dist,w.id,'citation.bib'),'utf8').includes(w.originalTitle))throw Error(`Incomplete citation: ${w.id}`);
}
for(const edge of citations){
  if(!workIds.has(edge.from)||!workIds.has(edge.to)||edge.from===edge.to)throw Error('Invalid citation endpoints');
  if(!edge.url?.startsWith('https://')||!edge.locator||!edge.evidence)throw Error('Citation lacks evidence');
  const key=`${edge.from}→${edge.to}`;if(edges.has(key))throw Error(`Duplicate citation: ${key}`);edges.add(key);
  // A single checked edge must appear in both directions in the published pages.
  const from=pages.get(path.join(dist,edge.from,'index.html')),to=pages.get(path.join(dist,edge.to,'index.html'));
  if(!from.includes(`href="../${edge.to}/"`)||!to.includes(`href="../${edge.from}/"`))throw Error(`Citation is not navigable both ways: ${key}`);
}
const paper=pages.get(path.join(dist,'riemann-1859/index.html'));
for(const statement of statements1859)if(!paper.includes(`id="${statement.id}"`))throw Error(`Missing precise statement: ${statement.id}`);
for(const marker of ['zero-count','formula','hypothesis','German p. 9','without proof-assistant verification'])if(!paper.includes(marker))throw Error(`Missing editorial safeguard: ${marker}`);
for(const concept of concepts)if(!idsByPage.get(path.join(dist,concept.work??'riemann-1859','index.html')).has(concept.anchor))throw Error(`Concept has no source passage: ${concept.id}`);
const data=JSON.parse(fs.readFileSync(path.join(dist,'catalog.json'),'utf8'));
const euler=pages.get(path.join(dist,'euler-1740/index.html'));
if(passagesEuler.length!==19)throw Error('Euler reading must retain all 19 numbered sections');
for(const statement of statementsEuler)if(!euler.includes(`id="${statement.id}"`)||!data.statements['euler-1740'].some(s=>s.id===statement.id))throw Error(`Euler proof missing: ${statement.id}`);
for(const marker of ['Latin text','Ian Bruce','not yet been collated','paired','without proof-assistant verification'])if(!euler.includes(marker))throw Error(`Euler edition lacks its source or proof qualification: ${marker}`);
if(data.citations.length!==citations.length)throw Error('Export lost citation data');
const catalogue=pages.get(path.join(dist,'index.html'));
if((catalogue.match(/data-work=/g)||[]).length!==works.length)throw Error('Every work must appear exactly once in the unified catalogue');
for(const id of ['work-search','work-author','work-language','work-decade','work-from','work-to','work-access'])if(!idsByPage.get(path.join(dist,'index.html')).has(id))throw Error(`Missing catalogue filter: ${id}`);
let checkedEnglish=0;
for(const [id,source] of Object.entries(englishSources)){
  if(!workIds.has(id))throw Error(`English source has no work record: ${id}`);
  if(!['inspected','listed'].includes(source.status))throw Error(`Unknown source-check status: ${id}`);
  if(!source.url.startsWith('https://')||!source.evidenceUrl.startsWith('https://')||!source.checked||!source.scope)throw Error(`Missing English-source provenance: ${id}`);
  const record=pages.get(path.join(dist,id,'index.html'));
  if(!record.includes('id="english-text"'))throw Error(`Work record omits its English access information: ${id}`);
  if(source.status==='inspected'){
    checkedEnglish++;
    if(!source.translator)throw Error(`Checked translation lacks a credit: ${id}`);
    if(!catalogue.includes(`data-work="${id}"`))throw Error(`English source missing from unified catalogue: ${id}`);
  }
  if(data.englishSources[id]?.status!==source.status)throw Error(`Export lost source-check status: ${id}`);
}
const searchable=works.map(w=>({...w,searchText:[w.title,w.originalTitle,w.summary,w.year,w.language,...(discoveryTerms[w.id]??[]),englishSources[w.id]?.translator??'',...w.authors.map(id=>people.find(p=>p.id===id).name)].join(' '),english:englishSources[w.id]?.status==='inspected'||w.language==='English',edited:Boolean(w.edition)}));
for(const w of works)if(!discoveryTerms[w.id]?.length||!data.discoveryTerms[w.id]?.length)throw Error(`Missing editorial search terms: ${w.id}`);
const found=f=>searchable.filter(w=>matchesWork(w,f)).map(w=>w.id).sort().join(',');
for(const [filters,expected] of [
 [{q:'Basel problem',author:'euler'},'euler-1740'],
 [{author:'riemann',decade:'1850',language:'German',access:'edited'},'riemann-1854,riemann-1859'],
 [{q:'conservation laws'},'noether-1918'],
 [{q:'konigsberg bridges'},'euler-1741'],
 [{from:'1854',to:'1859',author:'riemann'},'riemann-1854,riemann-1859'],
 [{author:'gohl'},'riesel-gohl-1970'],
 [{from:'1900',to:'1800'},''],
 [{author:'euler',language:'French'},'']
])if(found(filters)!==expected)throw Error(`Unexpected combined catalogue results: ${JSON.stringify(filters)} → ${found(filters)}`);
console.log('Validated combined author, original-language, decade, inclusive date-range, access, and modern-keyword filters.');
const css=fs.readFileSync(path.join(root,'public/style.css'),'utf8')+fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  const font=match[1],target=path.join(root,'public',font.startsWith('fonts/')?'vendor/katex/'+font:font);
  if(!fs.existsSync(target))throw Error(`Missing font ${font}`);
}
console.log(`Validated ${pages.size} pages, ${formulas} LaTeX expressions, ${links} local links, ${citations.length} bidirectional citations, ${checkedEnglish} checked English sources, and ${data.statements ? Object.values(data.statements).flat().length : 0} precise statements.`);

// Check the complete imported texts against the pinned source, not only a few
// visible markers. Unknown source commands fail in the importer itself.
const importRun=(await import('node:child_process')).spawnSync(process.execPath,[path.join(root,'scripts/import-dedekind.mjs'),'--check'],{encoding:'utf8'});
if(importRun.status!==0)throw Error(importRun.stderr||'Dedekind source import is stale');
const {editionsDedekind,proofsDedekind,dedekindSource}=await import('../src/dedekind.mjs');
if(dedekindSource.essays.map(e=>e.footnotes).join(',')!=='3,22')throw Error('Source footnotes missing');
for(const edition of editionsDedekind){
 const file=path.join(dist,edition.id,'index.html'),html=pages.get(file),ids=idsByPage.get(file);
 const expected=edition.id==='dedekind-1872'?{sections:8,rows:61,math:618}:{sections:16,rows:186,math:2644};
 if(edition.sections.length!==expected.sections||edition.rows.length!==expected.rows||edition.math!==expected.math)throw Error(`Dedekind source coverage changed: ${edition.id}`);
 for(const section of edition.sections)if(!ids.has(section.id))throw Error(`Missing Dedekind section: ${section.id}`);
 for(const row of edition.rows){
  if(!ids.has(row.id)||!row.sourceChars)throw Error(`Missing source passage: ${row.id}`);
  const expectedText=row.text.replace(/\[\[(?:person|work|concept):[\w-]+\|([\s\S]*?)\]\]/g,'$1').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  const start=html.indexOf(`id="${row.id}"`),next=html.indexOf('<aside',start),end=html.indexOf('</section>',start);
  const actual=html.slice(start,Math.min(next<0?Infinity:next,end)).replace(/<[^>]+>/g,'').replace(/\s+/g,' ');
  if(!actual.includes(expectedText))throw Error(`Truncated source passage: ${row.id}`);
 }
 const footnoteIds=[...ids].filter(id=>new RegExp(`^d${edition.id.slice(-2)}-fn-\\d+$`).test(id));
 if(footnoteIds.length!==edition.footnotes)throw Error(`Missing rendered source footnotes: ${edition.id}`);
 for(const p of proofsDedekind.filter(p=>p.work===edition.id))if(!ids.has(p.id)||!data.statements[edition.id].some(s=>s.id===p.id))throw Error(`Missing proof: ${p.id}`);
 if(!html.includes('Beman’s English, lightly modernized')||html.includes('CATALOGUE OF PUBLICATIONS')||html.includes('\uE000'))throw Error('Bad Dedekind attribution or unexpanded import');
 if(edition.id==='dedekind-1888'){
  const numbered=edition.rows.filter(r=>r.number).map(r=>r.number);
  if(numbered.length!==172||numbered.some((n,i)=>n!==i+1))throw Error('Numbered source paragraphs must cover 1–172 without gaps');
 }
}
if(!catalogue.includes('Every catalogue entry is intended to become a complete on-site reading'))throw Error('Collection intent missing');
console.log('Validated both complete Dedekind essays, every imported passage, all 25 source footnotes, 172 consecutive numbered paragraphs, and five editorial proofs.');

const {passagesProduct}=await import('../src/euler-1744.mjs');
const {passagesCircle}=await import('../src/euler-1748-circle.mjs');
const {statementsEulerMore}=await import('../src/statements-euler-more.mjs');
for(const [id,rows] of [['euler-1744',passagesProduct],['euler-1748-circle',passagesCircle]]){
 const file=path.join(dist,id,'index.html'),html=pages.get(file),ids=idsByPage.get(file);
 for(const r of rows)if(!ids.has(r.id)||!r.sourceUrl||!r.note)throw Error(`Incomplete Euler source passage ${r.id}`);
 for(const p of statementsEulerMore.filter(p=>p.work===id))if(!ids.has(p.id)||!data.statements[id].some(s=>s.id===p.id))throw Error(`Missing Euler reconstruction ${p.id}`);
 for(const marker of ['Latin','not reproduced','without proof-assistant verification'])if(!html.includes(marker))throw Error(`Missing Euler source qualification ${id}: ${marker}`);
}
for(const n of [1,2,3,4,5])if(!idsByPage.get(path.join(dist,'euler-1744/index.html')).has(`e72-4-c${n}`))throw Error('Missing source corollary');
if(!pages.get(path.join(dist,'euler-1748-circle/index.html')).includes('not the entire book'))throw Error('Chapter extent is not explicit');
if(found({q:'Euler identity'})!=='euler-1748-circle'||found({q:'reciprocal primes'})!=='euler-1744')throw Error('New Euler works are not discoverable by the requested topics');
console.log('Validated complete E72 with its seventeen corollaries and the complete E101 chapter VIII, scoped source records, and all nine new proof records.');
