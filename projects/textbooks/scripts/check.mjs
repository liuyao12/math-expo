import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window:{} };
for (const file of ['hat-turtle.js','chapters.js','app.js','conventions.js','matrix-demo.js','higher-geometry.js','tile-lattice-demo.js']) new vm.Script(fs.readFileSync(path.join(root,'course-site',file),'utf8'), { filename:file });
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
const product=(...factors)=>factors.reduce((a,b)=>notation.multiply(a,b));
const inverse2=([[a,b],[c,d]])=>[[d/(a*d-b*c),-b/(a*d-b*c)],[-c/(a*d-b*c),a/(a*d-b*c)]];
const sample=context.window.MATRIX_PRODUCT_EXAMPLE;
near(product(sample.B,sample.A),sample.result,'column rectangular example');
near(product(transpose(sample.A),transpose(sample.B)),transpose(sample.result),'row rectangular example');
const A=[[1,0],[1,1],[0,1]],S=[[1,2],[0,1]],M=[[2,1],[0,3]],Q=[[.6,-.8],[.8,.6]],L=[[2,0],[0,5]];
const x=[[3],[1],[-2]],c=[[2],[-1]],d=[[1],[3]],G=product(transpose(A),A),GI=inverse2(G);
for(const mode of ['column','row']){
  const row=mode==='row',basis=notation.represent(A,mode),input=notation.represent(x,mode),coordinate=notation.represent(c,mode),other=notation.represent(d,mode),change=notation.represent(S,mode),map=notation.represent(M,mode);
  const gram=row?product(basis,transpose(basis)):product(transpose(basis),basis);
  near(gram,[[2,1],[1,2]],mode+' Gram matrix');
  const P=row?product(transpose(basis),GI,basis):product(basis,GI,transpose(basis));
  const projected=row?product(input,P):product(P,input);
  near(product(P,P),P,mode+' idempotence');near(transpose(P),P,mode+' symmetry');
  const residual=input.map((r,i)=>r.map((v,j)=>v-projected[i][j]));
  near(row?product(residual,transpose(basis)):product(transpose(basis),residual),row?[[0,0]]:[[0],[0]],mode+' perpendicular residual');
  const analysis=row?product(input,transpose(basis),GI,basis):product(basis,GI,transpose(basis),input);
  near(analysis,projected,mode+' analysis/correction/synthesis');
  const altered=row?product(change,basis):product(basis,change);
  near(row?product(change,gram,transpose(change)):product(transpose(change),gram,change),row?product(altered,transpose(altered)):product(transpose(altered),altered),mode+' Gram basis change');
  near(row?product(coordinate,gram,transpose(coordinate)):product(transpose(coordinate),gram,coordinate),[[6]],mode+' squared length');
  near(row?product(coordinate,gram,transpose(other)):product(transpose(coordinate),gram,other),[[3]],mode+' mixed inner product');
  const transformed=row?product(change,map,inverse2(change)):product(inverse2(change),map,change);
  const coeff=notation.represent([[1],[3]],mode);
  near(row?product(coeff,transformed,change):product(change,transformed,coeff),row?product(coeff,change,map):product(map,change,coeff),mode+' operator basis change');
  const eigenbasis=notation.represent(Q,mode),spectral=row?product(transpose(eigenbasis),L,eigenbasis):product(eigenbasis,L,transpose(eigenbasis));
  near(spectral,product(Q,L,transpose(Q)),mode+' spectral reconstruction');
}
near(product(product(sample.B,sample.A),[[1,2],[0,1]]),product(sample.B,product(sample.A,[[1,2],[0,1]])),'ordinary associativity');
near(transpose(product(S,M)),product(transpose(M),transpose(S)),'transpose of product');
near(inverse2(product(S,M)),product(inverse2(M),inverse2(S)),'inverse of product');
let rejected=false;try{product(A,A);}catch{rejected=true;}if(!rejected)throw Error('Invalid dimensions were accepted');
const slash=String.fromCharCode(92);
const rectangle=slash+'begin{pmatrix}1&2&3'+slash+slash+'4&5&6'+slash+'end{pmatrix}';
if(!notation.convert(rectangle,'row').includes('1&4'+slash+slash+'2&5'+slash+slash+'3&6'))throw Error('Rectangular array did not transpose');
const inline='A='+slash+'begin{pmatrix}1&4'+slash+slash+'2&5'+slash+slash+'3&6'+slash+'end{pmatrix}';
if(notation.convert(inline,'row',false,false)!=='A='+slash+'left['+slash+'left[1,2,3'+slash+'right],'+slash+'left[4,5,6'+slash+'right]'+slash+'right]')throw Error('Inline row-list notation disagrees with matrix transpose');
console.log('Validated ordinary multiplication in row/column representations, Gram metrics, projections, basis changes, spectral reconstruction, product laws, and compact row-list notation.');
// A coordinate list stays a list; wrapping it creates a genuine one-row matrix.
for(const formula of ['x=[1,2,3]','[x]=[[1,2,3]]','[x]^{\\mathsf T}=[[1],[2],[3]]','(v.L).K=v.(LK)']){
  for(const mode of ['row','column']){
    if(notation.convert(formula,mode)!==formula)throw Error('Toggle changed a list, literal wrapper, or abstract evaluation: '+formula);
  }
}
const oneRow=slash+'begin{pmatrix}1'+slash+slash+'2'+slash+slash+'3'+slash+'end{pmatrix}';
if(notation.convert(oneRow,'row',false,false)!==slash+'left['+slash+'left[1,2,3'+slash+'right]'+slash+'right]')throw Error('A one-row matrix lost its outer list');
const list=[2,-1],secondList=[1,3],rowMatrix=[list],otherRow=[secondList];
near(product(rowMatrix,G,transpose(otherRow)),[[3]],'list-to-matrix mixed Gram pairing');
const scalarMatrix=product(rowMatrix,G,transpose(rowMatrix));
if(scalarMatrix.length!==1||scalarMatrix[0].length!==1||scalarMatrix[0][0]!==6)throw Error('Gram pairing must produce a 1 by 1 matrix');
// The coordinate square commutes for rectangular maps in both representations.
const inputList=[[2,-1]],first=transpose(sample.A),second=transpose(sample.B);
const outputList=product(inputList,first,second);
near(product(transpose(second),transpose(first),transpose(inputList)),transpose(outputList),'column composition equals row composition');
for(const mode of ['row','column']){
  const defs=notation.convert('C=[a]^{\\mathsf T},\\qquad D=[b]^{\\mathsf T}.',mode);
  const normal=notation.convert('GC=D.',mode);
  if(mode==='row'&&(defs.includes('mathsf T')||normal!=='CG=D.'))throw Error('Row coefficient matrices disagree with the normal equations');
  if(mode==='column'&&(!defs.includes('mathsf T')||normal!=='GC=D.'))throw Error('Column coefficient matrices disagree with the normal equations');
}
console.log('Validated list/matrix distinction, invariant postfix evaluation, scalar matrix results, and rectangular coordinate composition.');
vm.runInNewContext(fs.readFileSync(path.join(root,'course-site/hat-turtle.js'),'utf8'),context);
const tile=context.window.HAT_TURTLE;
if(tile.vertices.length!==14)throw Error('Expected fourteen fixed tile vertices');
const latticeSample=tile.sampleLattice(2);
if(latticeSample.length!==5**4)throw Error('Incorrect four-dimensional sample size');
for(const theta of [Math.PI/6,Math.PI/4,Math.atan(Math.sqrt(3)/2),Math.PI/3]){
  for(const point of latticeSample){
    const image=tile.view(point.relative,theta),internal=tile.internal(point.relative,theta);
    near(product(tile.matrix(theta),point.relative.map(x=>[x])),image.map(x=>[x]),'column live projection matrix');
    near(product([point.relative],transpose(tile.matrix(theta))),[image],'row live projection matrix');
    const originalSquared=point.relative.reduce((sum,x)=>sum+x*x,0);
    if(Math.abs(image.reduce((sum,x)=>sum+x*x,0)+internal.reduce((sum,x)=>sum+x*x,0)-originalSquared)>1e-10)throw Error('Perpendicular depth is not Euclidean distance');
    const [p,q,r,s]=point.coefficients,raw=tile.view(tile.toCartesian(point.coefficients),theta),t=Math.tan(theta)/Math.sqrt(3);
    const triangular=[(raw[0]-raw[1]/Math.sqrt(3))/Math.cos(theta),2*raw[1]/Math.sqrt(3)/Math.cos(theta)];
    near([triangular],[[p+t*(r-s),q+t*(r+2*s)]],'rational/dense slope formula');
  }
}
for(let degrees=30;degrees<=60;degrees+=.25){
  for(const vertex of tile.centered)if(Math.hypot(...tile.internal(vertex,degrees*Math.PI/180))>1.7)throw Error('Initial depth window excludes a tile vertex');
}
console.log('Validated the live projection matrix, perpendicular distances, lattice-slope formula, sample size, and tile-containing initial window.');
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
        if(match[1] && formula.includes(String.fromCharCode(92,92))&&!formula.includes('\\begin{pmatrix}')) throw Error(`Unexpected line break in inline mathematics: ${chapter.id}`);
        try{
          for(const mode of ['row','column']){
            const converted=notation.convert(formula,mode,true,Boolean(match[2]));
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
  for(const mode of ['row','column']){
    for(const decorate of [false,true]){
      const tex=notation.convert(entry.column,mode,decorate);
      katexContext.katex.renderToString(tex,{throwOnError:true,trust:notation.trust});
      if(mode==='row'&&tex.includes('{pmatrix}'))throw Error('Row arrays need square brackets');
    }
  }
}
const css=fs.readFileSync(path.join(root,'course-site/vendor/katex/katex.min.css'),'utf8');
for(const match of css.matchAll(/url\((fonts\/[^)]+)\)/g)){
  if(!fs.existsSync(path.join(root,'course-site/vendor/katex',match[1])))throw Error(`Missing math font: ${match[1]}`);
}
console.log(`Validated ${chapters.length} chapter sketches and ${formulas} LaTeX expressions; all KaTeX fonts are local.`);
