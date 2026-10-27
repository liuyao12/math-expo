import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {approximation,e1Complex,exactCount,mobius,buildCurves,zeroPair,primePowers,MOBIUS_TERMS} from '../public/explicit-math.mjs';
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
const html=read('dist/riemann-1859/index.html'),catalog=JSON.parse(read('dist/catalog.json'));
assert.equal(catalog.visualContributions.filter(v=>v.id==='explicit-formula-1859').length,1);
for(const id of ['explicit-pairs','explicit-mode','explicit-range','explicit-play','explicit-plot'])assert(html.includes('id="'+id+'"'));
for(const text of ['Odlyzko','midpoint','cutoff fixed','no certified bound','Möbius'])assert(html.includes(text),text);
assert.equal(read('dist/riemann-1859/explicit-reference-values.json'),read('src/sources/explicit-reference-values.json'));
assert.equal(read('dist/zeta-zeros-200.json'),read('public/zeta-zeros-200.json'));
for(const file of ['explicit-math.mjs','explicit-reader.mjs','explicit-worker.mjs','zeta-reader.mjs']){
 const r=spawnSync(process.execPath,['--check',new URL('public/'+file,root).pathname],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
}
console.log('Validated 200 sourced zero pairs, '+ref.values.length+' independent 60-digit finite-formula checks in both counting modes (maximum absolute error '+worst.toExponential(3)+'), complex Ei branches, fixed-cutoff Möbius inversion, half-values at prime powers, worker prefix curves, and nonmonotone truncation errors.');

