import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window:{} };
for (const file of ['hat-turtle.js','chapters.js','app.js','conventions.js','matrix-demo.js','higher-geometry.js']) new vm.Script(fs.readFileSync(path.join(root,'course-site',file),'utf8'), { filename:file });
for (const file of ['conventions.js','matrix-demo.js','higher-geometry.js']) vm.runInNewContext(fs.readFileSync(path.join(root,'course-site',file),'utf8'),context);
const notation=context.window.MATRIX_NOTATION;
const {models,ballVolume}=context.window.HIGHER_GEOMETRY;
for(const [name,vertices,edges] of [['cube',16,32],['cross',8,24],['cell24',24,96]]){
  if(models[name].vertices.length!==vertices||models[name].edges.length!==edges)throw Error('Incorrect regular polytope: '+name);
  for(const vertex of models[name].vertices){
    const degree=models[name].edges.filter(pair=>pair.includes(models[name].vertices.indexOf(vertex))).length;
    if(degree!==2*edges/vertices)throw Error('Unequal vertex degrees in '+name);
  }
}
if(Math.abs(ballVolume(3)-4*Math.PI/3)>1e-12||Math.abs(ballVolume(4)-Math.PI**2/2)>1e-12)throw Error('Incorrect ball volume');
let previous=1;
for(let n=2;n<=30;n++){
  const fraction=ballVolume(n)/2**n;
  if(fraction<=0||fraction>=previous)throw Error('Ball/cube volume fraction must decrease');
  previous=fraction;
}
const transpose=A=>A[0].map((_,j)=>A.map(row=>row[j]));
const near=(A,B,label)=>{
  if(A.length!==B.length||A[0].length!==B[0].length||A.some((row,i)=>row.some((v,j)=>Math.abs(v-B[i][j])>1e-10)))throw Error('Matrix check failed: '+label);
};
const product=(...factors)=>factors.reduce((a,b)=>notation.multiply(a,b,'reading'));
const inverse2=([[a,b],[c,d]])=>[[d/(a*d-b*c),-b/(a*d-b*c)],[-c/(a*d-b*c),a/(a*d-b*c)]];
const sample=context.window.MATRIX_PRODUCT_EXAMPLE;
near(product(sample.A,sample.B),sample.result,'column/row rectangular example');
near(notation.multiply(sample.B,sample.A,'standard'),sample.result,'standard rectangular example');
const v=[[2],[-1]],A=[[1,0],[1,1],[0,1]],AT=transpose(A),G=product(A,AT),GI=inverse2(G);
near(product(v,A),[[2],[1],[-1]],'a column remains a column');
near(G,[[2,1],[1,2]],'Gram matrix');
const P=product(AT,GI,A),x=[[3],[1],[-2]],px=product(x,P);
near(product(P,P),P,'projection idempotence');near(transpose(P),P,'projection symmetry');
near(product(x,AT,GI,A),px,'analysis, correction, synthesis');
near(product(x.map((r,i)=>[r[0]-px[i][0]]),AT),[[0],[0]],'perpendicular residual');
const S=[[1,2],[0,1]],Aprime=product(S,A),Gprime=product(Aprime,transpose(Aprime));
near(product(S,G,transpose(S)),Gprime,'Gram basis change');
near(product(v,G,transpose(v)),[[6]],'metric scalar');
const w=[[1],[3]],M=[[2,1],[0,3]],SInv=inverse2(S),Mprime=product(S,M,SInv);
near(product(w,Mprime,S),product(w,S,M),'operator basis change');
const Q=[[.6,-.8],[.8,.6]],L=[[2,0],[0,5]],spectral=product(transpose(Q),L,Q);
near(product(Q,transpose(Q)),[[1,0],[0,1]],'orthonormal eigenbasis');
near(product([[.6],[.8]],spectral),[[1.2],[1.6]],'spectral reconstruction');
near(product(product(v,A),AT),product(v,product(A,AT)),'associativity');
let rejected=false;try{product(A,A);}catch{rejected=true;}if(!rejected)throw Error('Invalid dimensions were accepted');
console.log('Validated both multiplication conventions, rectangular actions, Gram/basis changes, projections, spectral reconstruction, regular polytope graphs, and ball volumes.');
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
        try{
          for(const mode of ['reading','standard']){
            const converted=notation.convert(formula,mode,true);
            if(converted.includes('\\star'))throw Error('The star symbol must not mark matrix multiplication');
            katexContext.katex.renderToString(converted,{throwOnError:true,trust:notation.trust});
          }
          formulas++;
        }
        catch(error){throw Error(`${chapter.id}: ${formula}: ${error.message}`);}
      }
    }
  }
}
for(const entry of notation.entries){
  for(const mode of ['reading','standard']){
    for(const decorate of [false,true]){
      const tex=notation.convert(entry.standard,mode,decorate);
      katexContext.katex.renderToString(tex,{throwOnError:true,trust:notation.trust});
      if(mode==='reading'&&tex.includes('{pmatrix}'))throw Error('Experimental arrays need square brackets');
    }
  }
}
const css=fs.readFileSync(path.join(root,'course-site/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\((fonts\/[^)]+)\)/g)){
  if(!fs.existsSync(path.join(root,'course-site/vendor/katex',match[1])))throw Error(`Missing math font: ${match[1]}`);
}
console.log(`Validated ${chapters.length} chapter sketches and ${formulas} LaTeX expressions; all KaTeX fonts are local.`);
