import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window:{} };
for (const file of ['hat-turtle.js','chapters.js','app.js']) new vm.Script(fs.readFileSync(path.join(root,'course-site',file),'utf8'), { filename:file });
vm.runInNewContext(fs.readFileSync(path.join(root,'course-site/hat-turtle.js'),'utf8'),context);
const tile=context.window.HAT_TURTLE;
if(tile.vertices.length!==14)throw Error('Expected fourteen fixed tile vertices');
let firstEdges=0;
for(let i=0;i<14;i++){
  const a=tile.cartesian[i],b=tile.cartesian[(i+1)%14];
  const squared=a.reduce((s,x,k)=>s+(x-b[k])**2,0);
  if(Math.abs(squared-1)>1e-12)throw Error('A lifted edge changed length');
  if(tile.edgeFamily(i)==='first')firstEdges++;
}
if(firstEdges!==8)throw Error('Incorrect edge-family counts');
const independent=[1,2,3,6].map(i=>Array.from(tile.vertices[i]));let rank=0;
for(let k=0;k<4;k++){
  const pivot=independent.findIndex((row,i)=>i>=rank&&Math.abs(row[k])>1e-10);
  if(pivot<0)continue;
  [independent[rank],independent[pivot]]=[independent[pivot],independent[rank]];
  const scale=independent[rank][k];independent[rank]=independent[rank].map(x=>x/scale);
  for(let i=rank+1;i<4;i++){const f=independent[i][k];independent[i]=independent[i].map((x,j)=>x-f*independent[rank][j]);}
  rank++;
}
if(rank!==4)throw Error('The example must span four dimensions');
for(const theta of [Math.PI/6,Math.PI/4,Math.PI/3]){
  const image=tile.rawProject(theta);
  for(let i=0;i<14;i++){
    const expected=tile.edgeFamily(i)==='first'?Math.cos(theta):Math.sin(theta);
    const length=Math.hypot(...image[i].map((x,k)=>x-image[(i+1)%14][k]));
    if(Math.abs(length-expected)>1e-12)throw Error('Projection edge length disagrees with its viewing matrix');
  }
}
console.log('Validated the fixed fourteen-vertex lift, rank four, and hat/turtle projection edge lengths.');
vm.runInNewContext(fs.readFileSync(path.join(root,'course-site/chapters.js'),'utf8'),context);
const katexContext = {};
vm.runInNewContext(fs.readFileSync(path.join(root,'course-site/vendor/katex/katex.min.js'),'utf8'),katexContext);
const chapters=context.window.COURSE.chapters;
const ids=new Set();let formulas=0;
for(const chapter of chapters){
  if(ids.has(chapter.id))throw Error(`Duplicate chapter: ${chapter.id}`);ids.add(chapter.id);
  if(chapter.sections.length<2)throw Error(`Missing section in ${chapter.id}`);
  for(const section of chapter.sections){
    for(const text of [section.body,section.note||'']){
      if(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text))throw Error(`Control character in ${chapter.id}`);
      for(const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
        const formula=match[1]??match[2];
        if(match[1] && formula.includes(String.fromCharCode(92,92))) throw Error(`Unexpected line break in inline mathematics: ${chapter.id}`);
        try{katexContext.katex.renderToString(formula,{throwOnError:true});formulas++;}
        catch(error){throw Error(`${chapter.id}: ${formula}: ${error.message}`);}
      }
    }
  }
}
const css=fs.readFileSync(path.join(root,'course-site/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\((fonts\/[^)]+)\)/g)){
  if(!fs.existsSync(path.join(root,'course-site/vendor/katex',match[1])))throw Error(`Missing math font: ${match[1]}`);
}
console.log(`Validated ${chapters.length} chapter sketches and ${formulas} LaTeX expressions; all KaTeX fonts are local.`);
