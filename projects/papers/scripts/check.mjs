import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { introduction, lineElement } from '../src/riemann.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const katexContext={};vm.runInNewContext(fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.js'),'utf8'),katexContext);
new vm.Script(fs.readFileSync(path.join(root,'public/reader.js'),'utf8'));
let formulas=0;
const ids=new Set();for(const row of [...introduction,...lineElement]){if(ids.has(row.id))throw Error(`Duplicate passage: ${row.id}`);ids.add(row.id);}
for(const relative of ['index.html','riemann-1854/index.html']){
  const file=path.join(root,'dist',relative),html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
    katexContext.katex.renderToString(match[1]??match[2],{throwOnError:true});formulas++;
  }
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(/^(https?:|#)/.test(match[1]))continue;
    if(match[1]===(relative==='index.html'?'../':'../../'))continue;
    const target=path.resolve(path.dirname(file),match[1]);if(!fs.existsSync(target))throw Error(`Missing local resource: ${relative} → ${match[1]}`);
  }
  for(const match of html.matchAll(/href="#([^"]+)"/g)){if(!html.includes(`id="${match[1]}"`))throw Error(`Missing anchor: ${match[1]}`);}
}
const reader=fs.readFileSync(path.join(root,'dist/riemann-1854/index.html'),'utf8');
for(const row of [...introduction,...lineElement])if(!reader.includes(`id="${row.id}"`))throw Error(`Missing passage ${row.id}`);
for(const source of ['DE-611-HS-3206822','e-rara-49481','WKCGeom.html'])if(!reader.includes(source))throw Error(`Missing source ${source}`);
const css=fs.readFileSync(path.join(root,'public/style.css'),'utf8')+fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  const font=match[1];const target=path.join(root,'public',font.startsWith('fonts/')?'vendor/katex/'+font:font);
  if(!fs.existsSync(target))throw Error(`Missing font ${font}`);
}
console.log(`Validated ${ids.size} passage groups, ${formulas} LaTeX expressions, source links, local assets, and reader JavaScript.`);
