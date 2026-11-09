import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {escapeHTML,createRenderer} from '../src/latex.mjs';
import {notesFor,noteTags} from '../src/scheme-notes.mjs';
import {loadReadingCatalog,loadReadings,loadReferenceReadings,assembleReading} from '../src/readings.mjs';
import assert from 'node:assert/strict';
import {examples} from '../src/matches.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const sourceIndexTests=spawnSync('python3',[path.join(root,'scripts/test-source-index.py')],{stdio:'inherit'});
if(sourceIndexTests.status!==0)process.exit(sourceIndexTests.status??1);
const dependencyAudit=spawnSync('python3',[path.join(root,'scripts/audit-dependencies.py')],{stdio:'inherit'});
if(dependencyAudit.status!==0)process.exit(dependencyAudit.status??1);
if(fs.existsSync(path.join(dist,'read')))throw Error('Retired /read/ routes must not be generated, including redirects');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(dist,'gluing/index.html'),'utf8');
let proofCount=0,statementCount=0;
const renderer=createRenderer(root);
for(const [key,item] of Object.entries(examples)){
  if(!item.bindings.length||(!item.check&&!item.result))throw Error('Incomplete specialization: '+key);
  const symbols=item.bindings.map(b=>b.symbol.replace(/[\s{}]/g,''));
  if(new Set(symbols).size!==symbols.length)throw Error('Duplicate object assignment: '+key);
  for(const b of [...item.bindings,...(item.proofBindings||[])]){
    renderer.math(b.symbol);renderer.math(b.value);
  }
}
if(!/class="[^"]*\bobject-matches\b/.test(html))throw Error('Missing margin object matching');
if(!html.includes('<details id="example-visual" class="optional-visual">'))throw Error('The visual must be optional and initially closed');
for(const section of manifest.sections){
  const tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
  const proofs=[...tex.matchAll(/\\begin\{proof\}/g)].length;
  const statements=[...tex.matchAll(/\\begin\{(?:lemma|definition|example)\}/g)].length;
  const parsed=renderer.section(section);
  if(parsed.flatMap(b=>b.proofs||[]).length!==proofs)throw Error('Lost a source proof: '+section.slug);
  if(parsed.filter(b=>b.kind!=='prose').length!==statements)throw Error('Lost a source statement: '+section.slug);
  for(const match of tex.matchAll(/\\label\{([^}]+)\}/g)){
    const refs=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
    const tag=refs[section.chapter+'-'+match[1]]?.tag;
    if(!tag||!html.includes(`id="${tag}"`))throw Error('Missing original tag: '+match[1]);
  }
  proofCount+=proofs;statementCount+=statements;
}
if([...html.matchAll(/<details class="proof">/g)].length!==proofCount)throw Error('Proofs must all exist and start collapsed.');
if(html.includes('katex-error'))throw Error('Math rendering failed.');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate reading anchors');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const anchorsByFile=new Map();
const anchorsFor=file=>{
  if(!anchorsByFile.has(file))anchorsByFile.set(file,new Set([...fs.readFileSync(file,'utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])));
  return anchorsByFile.get(file);
};
for(const file of files(dist).filter(f=>f.endsWith('.html'))){
  const source=fs.readFileSync(file,'utf8');
  for(const m of source.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
    if(/^(https?:|mailto:|data:)/.test(m[1]))continue;
    if(/(?:^|\/)read\//.test(m[1]))throw Error('Retired reader URL in '+file+': '+m[1]);
    let target=path.resolve(path.dirname(file),m[1].split('?')[0]);
    if(m[1].endsWith('/'))target=path.join(target,'index.html');
    if(!target.startsWith(dist))continue;
    if(!fs.existsSync(target))throw Error('Missing local link: '+m[1]+' in '+file);
    const hash=m[0].match(/#([^"]+)/)?.[1];
    if(hash&&target.endsWith('.html')&&!anchorsFor(target).has(hash))throw Error('Missing target anchor '+m[0]+' in '+file);
  }
  for(const m of source.matchAll(/href="#([^"]+)"/g))if(!anchorsFor(file).has(m[1]))throw Error('Broken fragment '+m[1]);
}

const foundation=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
const catalog=loadReadingCatalog(root);
const selectedReadings=loadReadings(root,catalog);
const coreReading=selectedReadings.find(reading=>reading.role==='foundation');
const originalUnits=[...foundation.units,...selectedReadings,...loadReferenceReadings(root,catalog)];
for(const tag of noteTags)if(!catalog.sectionForTag.has(tag))throw Error('Unresolved commentary tag '+tag);
assert.deepEqual(notesFor('ZZZZ','ZZZY').examples,[],'Commentary must be optional');
assert.throws(()=>assembleReading({...coreReading,sections:['ZZZZ']},catalog),/Unknown section tag/);
assert.throws(()=>assembleReading({...coreReading,target:'ZZZZ',sections:coreReading.sections.map(s=>s.tag)},catalog),/outside/);
const coreTags=coreReading.sections.map(section=>section.tag);
assert.equal(coreReading.target,'04L1','The first reading reaches the definition of projective varieties');
for(const tag of ['01II','00JL','00JM','01BD','01M3','01ND','020C','04L0']){
 assert(coreTags.includes(tag),'First reading includes schemes, Proj, projective space, and varieties: '+tag);
}
const selectedTags=new Set();
const reports=JSON.parse(fs.readFileSync(path.join(root,'upstream/dependency-audit.json'),'utf8')).readings;
const referencesByTag=new Map(Object.values(catalog.references).map(ref=>[ref.tag,ref]));
for(const reading of selectedReadings){
 for(const section of reading.sections){
  assert(!selectedTags.has(section.tag),'Selected readings must link back rather than repeat a section: '+section.tag);
  selectedTags.add(section.tag);
 }
 const page=fs.readFileSync(path.join(dist,reading.slug,'index.html'),'utf8');
 if(reading!==coreReading)assert(page.includes('href="../scheme/#01MB"'),'Later dependency graphs link to the relocated Proj proof');
 const report=reports[reading.slug],local=new Set(reading.sections.map(s=>s.tag));
 const expected=report.required_tags.filter(tag=>local.has(report.passages[tag].section)&&!['item','equation'].includes(referencesByTag.get(tag).kind));
 const marks=[...page.matchAll(/<a class="dependency-number" data-dependency-tag="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
 assert.deepEqual(marks.map(m=>m[1]).sort(),expected.sort(),'Highlight exactly the audited headings in '+reading.slug);
 assert.deepEqual(new Set(expected.map(tag=>report.passages[tag].section)),local,'Every selected section has an audited highlight');
 for(const [,tag,label] of marks){
  const {kind,number}=referencesByTag.get(tag);
  assert.equal(label,kind==='section'?number:kind[0].toUpperCase()+kind.slice(1)+' '+number);
 }
 const graphData=JSON.parse(page.match(/<script type="application\/json" id="dependency-audit-data">([\s\S]*?)<\/script>/)[1]);
 assert.equal(graphData.target,reading.target);
 for(const tag of report.required_tags){
  const entry=graphData.passages[tag];
  assert.equal(entry.parent,report.paths[tag].at(-1));
  assert.deepEqual(entry.uses,report.passages[tag].dependencies.map(dep=>dep.tag));
  assert(anchorsFor(path.join(dist,entry.slug,'index.html')).has(tag),'Audited node links to its source anchor: '+tag);
 }
 console.log(`${reading.slug}: ${marks.length} audited highlights across all ${local.size} sections`);
}
assert.throws(()=>assembleReading({...coreReading,sections:[...coreTags,coreTags[0]]},catalog),/Repeated section tag/);
assert.deepEqual(assembleReading({...coreReading,sections:[...coreTags].reverse()},catalog).sections.map(s=>s.tag),coreTags,'Selections must retain original Stacks order');
const grrIndex=selectedReadings.findIndex(unit=>unit.target==='02UO');
const grr=selectedReadings[grrIndex];
if(grr?.sections.at(-1)?.tag!=='02UO')throw Error('The GRR reading must end at Stacks tag 02UO');
const earlierTags=new Set(selectedReadings.slice(0,grrIndex)
  .flatMap(unit=>unit.sections.map(section=>section.tag)));
for(const section of grr.sections){
  if(earlierTags.has(section.tag))throw Error('GRR repeats an earlier section: '+section.tag);
}
const refs=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
let pathProofs=0,pathStatements=0;
for(const unit of originalUnits){
  const file=path.join(dist,unit.slug,'index.html'),html=fs.readFileSync(file,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)throw Error('Duplicate source anchors in '+unit.slug);
  let proofs=0,statements=0;
  for(const section of unit.sections){
    const source=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
    proofs+=[...source.matchAll(/\\begin\{proof\}/g)].length;
    statements+=[...source.matchAll(/\\begin\{(?:lemma|definition|example|exercise|theorem|proposition|remarks?|corollary|situation|discussion|notation)\}/g)].length;
    for(const match of source.matchAll(/\\label\{([^}]+)\}/g)){
      const tag=refs[section.chapter+'-'+match[1]]?.tag;
      if(!tag||!ids.includes(tag))throw Error('Missing source anchor '+section.slug+' '+match[1]);
    }
    const passages=renderer.section(section);
    for(const passage of passages)for(const note of notesFor(section.tag,passage.tag).examples){
      const symbols=new Set();
      for(const b of note.bindings||[]){
        if(symbols.has(b.symbol))throw Error('Duplicate object binding '+section.slug);symbols.add(b.symbol);
        renderer.math(b.symbol);renderer.math(b.value);
      }
    }
  }
  if([...html.matchAll(/<details class="proof">/g)].length!==proofs)throw Error('Lost or initially expanded proof in '+unit.slug);
  if([...html.matchAll(/class="statement-heading"/g)].length!==statements)throw Error('Lost source statement in '+unit.slug);
  if(html.includes('katex-error')||html.includes('@@TOKEN'))throw Error('Unrendered source in '+unit.slug);
  if(!unit.readingTitle){pathProofs+=proofs;pathStatements+=statements;}
}
const finalDefinition=refs['schemes-definition-scheme'].tag;
if(!fs.readFileSync(path.join(dist,'schemes/index.html'),'utf8').includes(`id="${finalDefinition}"`))throw Error('Missing scheme definition');

const css=fs.readFileSync(path.join(dist,'vendor/katex/katex.min.css'),'utf8');
for(const m of css.matchAll(/url\(([^)]+)\)/g))if(!fs.existsSync(path.join(dist,'vendor/katex',m[1])))throw Error('Missing KaTeX font '+m[1]);
const sourceFiles=['COPYING','manifest.json','introduction.tex','sections.json','readings.json'];
for(const file of sourceFiles)if(!fs.existsSync(path.join(dist,'source',file)))throw Error('Missing source or license '+file);
console.log(`Validated Stacks Reader: ${Object.keys(examples).length} object specializations, linked symbols, optional visual, all ${statementCount} source statements, ${proofCount} collapsed proofs, tags, local links, math, fonts, and source license.`);

console.log(`Validated foundation path: ${foundation.units.flatMap(u=>u.sections).length} complete sections, ${pathStatements} statements, ${pathProofs} collapsed proofs, source anchors, typed examples, and cross-reading links.`);

const originalChapters=JSON.parse(fs.readFileSync(path.join(root,'src/chapters.json'),'utf8'));
for(const unit of originalUnits){
  const chapter=originalChapters.find(c=>c.slug===unit.sections[0].chapter);
  if(!chapter||chapter.title!==unit.title||chapter.number!==unit.number)throw Error('Changed original chapter title '+unit.slug);
  const html=fs.readFileSync(path.join(dist,unit.slug,'index.html'),'utf8');
  const title=unit.chapterHeadings?unit.readingTitle:chapter.title;
  if(!html.includes('<h1>'+escapeHTML(title)+'</h1>'))throw Error('Missing reading heading '+unit.slug);
  const records=JSON.parse(html.match(/<script type="application\/json" id="source-data">([\s\S]*?)<\/script>/)[1]);
  const sectionHeading=unit.chapterHeadings?'h3':'h2';
  const headings=html.replace(/<a class="dependency-number"[^>]*>([\d.]+)<\/a>/g,'$1');
  for(const section of unit.sections){
    const source=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
    if(createHash('sha256').update(source).digest('hex')!==section.sha256)throw Error('Altered section source '+section.slug);
    if(!headings.includes('<'+sectionHeading+'>'+section.number+'. '+escapeHTML(section.title)+'</'+sectionHeading+'>'))throw Error('Changed original section title '+section.slug);
    if(!records[section.tag].html.includes('<pre><code>'+escapeHTML(source)+'</code></pre>'))throw Error('Missing margin source '+section.slug);
    if(!fs.existsSync(path.resolve(path.dirname(path.join(dist,unit.slug,'index.html')),records[section.tag].download)))throw Error('Broken margin source download '+section.slug);
  }
  if(unit.chapterHeadings){
    const numbers=unit.sections.map(s=>s.number);
    const sorted=[...numbers].sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
    if(numbers.join()!==sorted.join())throw Error('Sections are out of original order in '+unit.slug);
    const headings=[...new Set(unit.sections.map(s=>s.chapter))].map(slug=>{
      const original=originalChapters.find(c=>c.slug===slug);
      return escapeHTML(original.number+'. '+original.title);
    });
    const rendered=[...html.matchAll(/<h2 class="source-chapter-title">([^<]+)<\/h2>/g)].map(m=>m[1]);
    if(rendered.join()!==headings.join())throw Error('Missing or reordered original chapter headings in '+unit.slug);
  }
}
const selection=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-selection.json'),'utf8'));
for(const section of foundation.source_reference_audit)for(const ref of section.references){
  if(!ref.included&&(!ref.reason||selection.reference_exceptions[ref.label]!==ref.reason))throw Error('Uncovered prerequisite '+ref.label);
}
const diagrams=JSON.parse(fs.readFileSync(path.join(root,'src/diagrams.json'),'utf8'));
for(const [key,diagram] of Object.entries(diagrams)){
  if(createHash('sha256').update(diagram.tex).digest('hex').slice(0,24)!==key)throw Error('Altered diagram formula '+key);
  const svg=fs.readFileSync(path.join(dist,'diagrams',diagram.file));
  if(createHash('sha256').update(svg).digest('hex')!==diagram.svg_sha256)throw Error('Altered original-source diagram '+key);
  const xml=svg.toString(),ids=new Set([...xml.matchAll(/\bid=['"]([^'"]+)/g)].map(m=>m[1]));
  for(const match of xml.matchAll(/xlink:href=['"]#([^'"]+)/g))if(!ids.has(match[1]))throw Error('Missing diagram glyph '+key+' '+match[1]);
}
const proseCheck=spawnSync('python3',[path.join(root,'scripts/check-verbatim.py')],{stdio:'inherit'});
if(proseCheck.status!==0)process.exit(proseCheck.status??1);
console.log(`Validated original titles, prerequisite audit, verbatim source views, and ${Object.keys(diagrams).length} original LaTeX diagrams.`);

for(const route of [...originalUnits.map(u=>u.slug),'gluing']){
  const html=fs.readFileSync(path.join(dist,route,'index.html'),'utf8');
  const main=html.match(/<main id="main" class="reader-main verbatim-main">([\s\S]*?)<\/main>/)?.[1];
  if(!main)throw Error('Missing verbatim text column '+route);
  for(const cls of ['example-jump','object-ref','source-tex','source-note','source-links','edition-note','reading-deck','reading-controls','reading-contents','path-navigation','tag']){
    if(new RegExp('class="[^"\n]*\\b'+cls+'\\b').test(main))throw Error('Non-source interface in main column: '+route+' '+cls);
  }
  if(/<button|role="button"|<details(?! class="proof")/.test(main))throw Error('Only proof-collapse controls may be added to original text: '+route);
}
console.log('Validated verbatim source columns: proof-collapse controls only; commentary, source tools, and editorial material remain in margins.');
