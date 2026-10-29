import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {approximation,e1Complex,exactCount,mobius,buildCurves,zeroPair,primePowers,MOBIUS_TERMS,zeroStripModel,hypotheticalQuartet,quartetHarmonic} from '../public/explicit-math.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=JSON.parse(read('public/zeta-zeros-200.json')),zeros=data.ordinates;
assert.equal(zeros.length,200);assert.equal(zeros[0],14.134725142);assert.equal(zeros[199],396.381854223);assert(zeros.every((v,i)=>v>0&&(!i||v>zeros[i-1])));
assert.equal(data.url,'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros1');assert.match(data.sourceSHA256,/^[0-9a-f]{64}$/);
const ref=JSON.parse(read('src/sources/explicit-reference-values.json'));let worst=0;
for(const p of ref.values)for(const mode of ['f','pi']){const actual=approximation(p.x,p.pairs,zeros,mode),error=Math.abs(actual-Number(p[mode]));worst=Math.max(worst,error);assert(error<3e-10,JSON.stringify({point:p,mode,actual,error}));}
for(const p of ref.e1){const actual=e1Complex(p.re,p.im);assert(Math.hypot(actual[0]-Number(p.valueRe),actual[1]-Number(p.valueIm))<2e-11);}
assert.deepEqual(Array.from({length:6},(_,i)=>mobius(i+1)),[1,-1,-1,0,-1,1]);assert.equal(MOBIUS_TERMS,6);
assert.equal(exactCount(5),2.5);assert.equal(exactCount(5,'pi',false),3);assert.equal(exactCount(4),2);
assert.equal(exactCount(4,'f'),2.25);assert.equal(exactCount(100),25);
assert(primePowers.some(p=>p.x===64&&p.weight===1/6));
for(const x of [2,2.01,3,4,5,8,10,16,31,64,97,100]){
 let inverted=0;for(let m=1;m<=6;m++)inverted+=mobius(m)/m*exactCount(Math.pow(x,1/m),'f');
 // Floating roots at integral prime powers need a small equality tolerance.
 const snap=y=>Math.abs(y-Math.round(y))<1e-10?Math.round(y):y;
 inverted=0;for(let m=1;m<=6;m++)inverted+=mobius(m)/m*exactCount(snap(Math.pow(x,1/m)),'f');
 assert(Math.abs(inverted-exactCount(x))<1e-12);
}
const curves=await buildCurves(zeros,{samples:101});
for(const i of [0,1,25,50,100])for(const n of [0,1,10,50,200])for(const mode of ['f','pi'])assert(Math.abs(curves[mode][n*101+i]-approximation(curves.xs[i],n,zeros,mode))<3e-11);
assert(Math.abs(approximation(10,200,zeros)-4)<.02);assert(Math.abs(approximation(20.5,200,zeros)-8)<.05);
assert(Math.abs(approximation(10,200,zeros)-4)<Math.abs(approximation(10,0,zeros)-4));
assert(Math.abs(approximation(30,1,zeros)-10)>Math.abs(approximation(30,0,zeros)-10)); // Local errors are not monotone.
// The camera and included locations must track the same finite zero pairs as the sum.
let previousHeight=0;
for(let n=0;n<=zeros.length;n++){
 const view=zeroStripModel(n,zeros),included=view.points.filter(p=>p.included),latest=view.points.filter(p=>p.latest);
 assert(view.ymax>=previousHeight);previousHeight=view.ymax;assert.equal(view.ymin,-view.ymax);
 assert.equal(view.included,2*n);assert.equal(included.length,2*n);assert.equal(latest.length,n?2:0);
 assert(view.points.every(p=>p.re===.5&&Math.abs(p.im)<=view.ymax));
 for(let j=0;j<n;j++)assert(included.some(p=>p.index===j+1&&p.im===zeros[j])&&included.some(p=>p.index===j+1&&p.im===-zeros[j]));
 assert(view.ticks.includes(0));assert(view.ticks.length>=3&&view.ticks.length<=7);
 if(n)assert(latest.every(p=>Math.abs(p.im)===zeros[n-1]&&p.included));
}
assert.equal(zeroStripModel(0,zeros).ymax,20);assert(zeroStripModel(200,zeros).ymax>396);
assert.throws(()=>zeroStripModel(201,zeros),RangeError);
const html=read('dist/riemann-1859/index.html'),catalog=JSON.parse(read('dist/catalog.json'));
assert.equal(catalog.visualContributions.filter(v=>v.id==='explicit-formula-1859').length,1);
for(const id of ['explicit-pairs','explicit-mode','explicit-range','explicit-play','explicit-plot','explicit-strip-plot'])assert(html.includes('id="'+id+'"'));
for(const text of ['Odlyzko','midpoint','cutoff fixed','no certified bound','Möbius'])assert(html.includes(text),text);
assert.equal(read('dist/riemann-1859/explicit-reference-values.json'),read('src/sources/explicit-reference-values.json'));
assert.equal(read('dist/zeta-zeros-200.json'),read('public/zeta-zeros-200.json'));
for(const file of ['explicit-math.mjs','explicit-reader.mjs','explicit-strip.mjs','explicit-experiment.mjs','explicit-worker.mjs','zeta-reader.mjs']){
 const r=spawnSync(process.execPath,['--check',new URL('public/'+file,root).pathname],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
}
console.log('Validated 200 sourced zero pairs, '+ref.values.length+' independent 60-digit finite-formula checks in both counting modes (maximum absolute error '+worst.toExponential(3)+'), complex Ei branches, fixed-cutoff Möbius inversion, half-values at prime powers, worker prefix curves, nonmonotone truncation errors, and all 201 synchronized critical-strip camera and zero-inclusion states.');


// Direct high-precision Ei values check the counterfactual, separately from zeta data.
const quartetReferences=JSON.parse(read('src/sources/hypothetical-reference-values.json'));let quartetWorst=0;
for(const p of quartetReferences.values){
 const x=Number(p.x),b=Number(p.beta),g=Number(p.gamma);
 for(const [actual,expected] of [[hypotheticalQuartet(x,b,g),Number(p.count)],[quartetHarmonic(x,b,g),Number(p.harmonic)]]){
  const error=Math.abs(actual-expected)/Math.max(1,Math.abs(expected));quartetWorst=Math.max(quartetWorst,error);assert(error<2e-11,JSON.stringify({p,actual,error}));
 }
 if(b===.5)assert(Math.abs(hypotheticalQuartet(x,b,g)+2*zeroPair(Math.log(x),g))<1e-10);
 if(x>2&&x<1e6){const dx=x*1e-5,derivative=(hypotheticalQuartet(x+dx,b,g)-hypotheticalQuartet(x-dx,b,g))/(2*dx);assert(Math.abs(derivative-4*quartetHarmonic(x,b,g)/(Math.sqrt(x)*Math.log(x)))<2e-5);}
}
for(const b of [.5,.75,.95]){
 const v=zeroStripModel(0,zeros,{beta:b,gamma:100});assert.equal(v.included,0);assert.equal(v.hypotheticalPoints.length,4);assert(v.ymax>100);
 assert(v.hypotheticalPoints.every(p=>v.hypotheticalPoints.some(q=>q.re===p.re&&q.im===-p.im)));
 for(const p of v.hypotheticalPoints)assert(v.hypotheticalPoints.some(q=>Math.abs(q.re-(1-p.re))<1e-12&&q.im===p.im));
}
assert.throws(()=>hypotheticalQuartet(1,.75,20.5),RangeError);
assert.throws(()=>quartetHarmonic(100,.99,20.5),RangeError);
assert(html.includes('The Riemann hypothesis</h3>'));assert(html.includes('data-zero-experiment'));assert(html.includes('two coincident conjugate pairs'));
assert.equal(read('dist/riemann-1859/hypothetical-reference-values.json'),read('src/sources/hypothetical-reference-values.json'));
console.log(`Validated ${quartetReferences.values.length} independent 60-digit hypothetical-quartet references (maximum normalized error ${quartetWorst.toExponential(3)}), count-to-density derivatives, centered multiplicity, and both zero symmetries.`);
