import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {introduction,lineElement} from '../src/riemann.mjs';
import {passages1859} from '../src/riemann-1859.mjs';
import {works,people,concepts,citations,bibliographicFields} from '../src/catalog.mjs';
import {statements1859} from '../src/statements-1859.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const katexContext={};
vm.runInNewContext(fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.js'),'utf8'),katexContext);
new vm.Script(fs.readFileSync(path.join(root,'public/reader.js'),'utf8'));
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
    try{katexContext.katex.renderToString(match[1]??match[2],{throwOnError:true});formulas++;}
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
for(const [work,rows] of [['riemann-1854',[...introduction,...lineElement]],['riemann-1859',passages1859]]){
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
for(const concept of concepts)if(!idsByPage.get(path.join(dist,'riemann-1859/index.html')).has(concept.anchor))throw Error(`Concept has no source passage: ${concept.id}`);
const data=JSON.parse(fs.readFileSync(path.join(dist,'catalog.json'),'utf8'));
if(data.citations.length!==citations.length)throw Error('Export lost citation data');
const css=fs.readFileSync(path.join(root,'public/style.css'),'utf8')+fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  const font=match[1],target=path.join(root,'public',font.startsWith('fonts/')?'vendor/katex/'+font:font);
  if(!fs.existsSync(target))throw Error(`Missing font ${font}`);
}
console.log(`Validated ${pages.size} pages, ${formulas} LaTeX expressions, ${links} local links, ${citations.length} bidirectional citations, and ${statements1859.length} precise statements.`);
