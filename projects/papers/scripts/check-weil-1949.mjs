import assert from 'node:assert/strict';
import fs from 'node:fs';
import {weilCompanions,weilGuide} from '../src/weil-1949.mjs';
import {works,citations} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const page=read('dist/weil-1949/index.html');
// Original documents and authored essays must not inflate primary-text coverage.
for(const id of ['weil-1949','goresky-2018']){
 const work=works.find(w=>w.id===id);assert.equal(work.textCoverage.percent,0);assert.equal(work.language,'English');
}
assert(page.includes('not a transcription'));
const companions=JSON.parse(read('dist/weil-1949/commentaries.json'));
assert.deepEqual(companions,weilCompanions);assert.equal(companions[0].author,'Mark Goresky');
assert.equal(citations.filter(c=>c.from==='goresky-2018'&&c.to==='weil-1949').length,1);
for(const r of weilGuide)assert(page.includes(`id="${r.id}"`));
// A direct finite-field enumeration checks the guide's example independently
// of the zeta function formula. Encode a+bu as a+7b, with u^2=-1.
const mod=x=>(x%7+7)%7;
const mul=(x,y)=>{const a=x%7,b=Math.floor(x/7),c=y%7,d=Math.floor(y/7);return mod(a*c-b*d)+7*mod(a*d+b*c);};
const add=(x,y)=>mod(x%7+y%7)+7*mod(Math.floor(x/7)+Math.floor(y/7));
const cube=x=>mul(mul(x,x),x);
for(let x=1;x<49;x++)assert(Array.from({length:48},(_,i)=>i+1).some(y=>mul(x,y)===1),'Extension must be a field');
const count=n=>{let affine=0,infinity=0;for(let x=0;x<n;x++){if(cube(x)===6)infinity++;for(let y=0;y<n;y++)if(add(cube(x),cube(y))===1)affine++;}return {affine,infinity,total:affine+infinity};};
assert.deepEqual(count(7),{affine:6,infinity:3,total:9});
assert.deepEqual(count(49),{affine:60,infinity:3,total:63});
// Check that logarithmic differentiation of the displayed rational function
// has the coefficients given by those two independently enumerated counts.
const q=7,a=-1,powers=[2,a,a*a-2*q];
assert.equal(1+q-powers[1],count(7).total);
assert.equal(1+q*q-powers[2],count(49).total);
console.log('Validated external-text coverage, authored-commentary provenance, citation direction, and independent affine/projective enumeration over the fields with 7 and 49 elements.');
