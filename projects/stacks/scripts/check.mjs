import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRenderer} from '../src/latex.mjs';
import {examples} from '../src/matches.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(dist,'read/gluing/index.html'),'utf8');
let proofCount=0,statementCount=0;
const renderer=createRenderer(root);
for(const [key,item] of Object.entries(examples)){
  if(!item.bindings.length||!item.check||!item.result)throw Error('Incomplete specialization: '+key);
  const symbols=item.bindings.map(b=>b.symbol.replace(/[\s{}]/g,''));
  if(new Set(symbols).size!==symbols.length)throw Error('Duplicate object assignment: '+key);
  for(const b of [...item.bindings,...(item.proofBindings||[])]){
    renderer.math(b.symbol);renderer.math(b.value);
    if(!b.kind)throw Error('Missing object type: '+key+' '+b.symbol);
  }
}
if(!html.includes('class="math-inline object-ref"')||!html.includes('class="object-matches"'))throw Error('Missing linked object matching');
if(!html.includes('<details id="example-visual" class="optional-visual">'))throw Error('The visual must be optional and initially closed');
for(const section of manifest.sections){
  const tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
  const proofs=[...tex.matchAll(/\\begin\{proof\}/g)].length;
  const statements=[...tex.matchAll(/\\begin\{(?:lemma|definition|example)\}/g)].length;
  const parsed=renderer.section(section);
  if(parsed.filter(b=>b.proof).length!==proofs)throw Error('Lost a source proof: '+section.slug);
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
for(const file of files(dist).filter(f=>f.endsWith('.html'))){
  const source=fs.readFileSync(file,'utf8');
  for(const m of source.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
    if(/^(https?:|mailto:|data:)/.test(m[1]))continue;
    let target=path.resolve(path.dirname(file),m[1].split('?')[0]);
    if(m[1].endsWith('/'))target=path.join(target,'index.html');
    if(!target.startsWith(dist))continue;
    if(!fs.existsSync(target))throw Error('Missing local link: '+m[1]+' in '+file);
  }
  for(const m of source.matchAll(/href="#([^"]+)"/g))if(!source.includes(`id="${m[1]}"`))throw Error('Broken fragment '+m[1]);
}
const css=fs.readFileSync(path.join(dist,'vendor/katex/katex.min.css'),'utf8');
for(const m of css.matchAll(/url\(([^)]+)\)/g))if(!fs.existsSync(path.join(dist,'vendor/katex',m[1])))throw Error('Missing KaTeX font '+m[1]);
const sourceFiles=['COPYING','manifest.json','introduction.tex'];
for(const file of sourceFiles)if(!fs.existsSync(path.join(dist,'source',file)))throw Error('Missing source or license '+file);
console.log(`Validated Stacks Reader: ${Object.keys(examples).length} typed object specializations, linked symbols, optional visual, all ${statementCount} source statements, ${proofCount} collapsed proofs, tags, local links, math, fonts, and source license.`);
