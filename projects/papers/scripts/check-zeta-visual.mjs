import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {zeta,domainColor,scenes,sceneAt,squareView,firstZerosView,clampView,zoomView,pointAt,allowedByStage,firstZeros} from '../public/zeta-math.mjs';
import {passages1859} from '../src/riemann-1859.mjs';
import {primeDigitComparisons,primeDigitsContribution} from '../src/prime-digits-commentary.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const samples=JSON.parse(read('src/sources/zeta-reference-values.json'));assert.equal(samples.values.length,418);let worst=0;
for(const p of samples.values){const actual=zeta(p.re,p.im),re=Number(p.valueRe),im=Number(p.valueIm);assert.equal(actual.kind,'value');const error=Math.hypot(actual.re-re,actual.im-im)/Math.max(1,Math.hypot(re,im));worst=Math.max(worst,error);assert(error<2e-11,JSON.stringify({point:[p.re,p.im],error}));}
assert.equal(zeta(1,0).kind,'pole');assert.equal(zeta(0,0).re,-.5);assert.equal(zeta(-2,0).re,0);assert.equal(zeta(-4,0).re,0);assert(Math.abs(zeta(-1,0).re+1/12)<1e-14);assert(Math.abs(zeta(2,0).re-Math.PI**2/6)<1e-14);
// Independent phase-winding checks: a zero turns once, the pole oppositely.
function winding(re,im,r){let total=0,last;for(let k=0;k<=512;k++){const t=2*Math.PI*k/512,z=zeta(re+r*Math.cos(t),im+r*Math.sin(t)),a=Math.atan2(z.im,z.re);if(last!==undefined){let d=a-last;while(d>Math.PI)d-=2*Math.PI;while(d< -Math.PI)d+=2*Math.PI;total+=d;}last=a;}return total/(2*Math.PI);}
for(const [re,im,r,expected] of [[-2,0,.15,1],[1,0,.15,-1],[.5,firstZeros[0],.08,1],[2,0,.2,0]])assert(Math.abs(winding(re,im,r)-expected)<1e-10);
assert.deepEqual(domainColor(0,0),[0,0,0]);assert.deepEqual(domainColor(Infinity,0),[255,255,255]);const red=domainColor(1,0,false),cyan=domainColor(-1,0,false);assert(red[0]>red[1]&&red[0]>red[2]);assert(cyan[1]>cyan[0]&&cyan[2]>cyan[0]);
assert.equal(allowedByStage(1,'series'),false);assert.equal(allowedByStage(1.0001,'series'),true);assert.equal(allowedByStage(.5,'continuation'),true);
assert.deepEqual(pointAt(50,50,100,100,squareView),[0,0]);assert.equal(firstZerosView.ymin,10);assert(firstZerosView.ymax>firstZeros[2]);assert.equal(squareView.ymax,4);
for(const v of [squareView,firstZerosView,{xmin:-20,xmax:20,ymin:-80,ymax:90}]){const c=clampView(v);assert(c.xmin>=-4&&c.xmax<=4&&c.ymin>=-32&&c.ymax<=32);const z=zoomView(c,.5);assert(z.xmax-z.xmin<c.xmax-c.xmin);}
for(let i=0;i<scenes.length;i++)assert.equal(sceneAt(scenes.map((_,j)=>j*100-i*100),1).id,scenes[i].id);
const html=read('dist/riemann-1859/index.html'),data=JSON.parse(read('dist/catalog.json'));assert(html.includes('class="zeta-illustrated-reading"'));assert.equal((html.match(/id="zeta-visual"/g)||[]).length,1);assert(html.includes('zeta-reader.mjs?v='));assert(html.includes('zeta-reader.css?v='));assert(html.includes('Follow the paper'));assert(html.includes('class="paper-part zeta-reading-opening"'));assert(html.indexOf('id="opening"')<html.indexOf('id="zeta-visual"'));assert(html.indexOf('id="zeta-visual"')<html.indexOf('id="euler-product"'));assert(html.includes('>Music of the primes</button>'));assert.equal(data.visualContributions[1].title,'Music of the primes');assert(html.includes('no blur or uncertainty effect'));assert(html.includes('not certified intervals'));assert(html.includes(String.raw`\(\operatorname{Re}s\)`));assert(html.includes(String.raw`\(\zeta(s)\)`));assert(html.includes(String.raw`cutoff \(N=32\)`));
for(const s of scenes)assert(passages1859.some(p=>p.id===s.anchor));for(const p of passages1859)assert(html.includes(`id="${p.id}"`));
assert.equal(data.visualContributions.length,3);assert.equal(data.visualContributions[0].work,'riemann-1859');assert.equal(data.works.find(w=>w.id==='riemann-1859').textCoverage.percent,100);
assert.deepEqual(data.visualContributions[2],primeDigitsContribution);
assert.deepEqual(primeDigitComparisons.map(row=>row.exponent),[3,6,9,29]);
for(const row of primeDigitComparisons){
 const liWhole=row.li.split('.')[0];let prefix=0;
 while(prefix<row.count.length&&row.count[prefix]===liWhole[prefix])prefix++;
 assert.equal(prefix,row.prefix);assert(BigInt(liWhole)>BigInt(row.count));
 assert(html.includes(row.count.slice(row.prefix))); // Exact strings survive HTML generation.
}
assert.equal(primeDigitComparisons.at(-1).count,'1520698109714272166094258063');
assert.equal(primeDigitComparisons.at(-1).prefix,15);
for(const marker of ['id="prime-digits-tab"','id="prime-digits-panel"','data-prime-digits','A theorem must keep control without an endpoint.','28 February 2022','https://github.com/kimwalisch/primecount/blob/master/doc/Records.md',String.raw`\frac{\sqrt{x}\log x}{8\pi}`])assert(html.includes(marker),marker);
assert.equal(scenes.find(s=>s.exhibit==='digits').anchor,'smooth-part');
assert.deepEqual(JSON.parse(read('dist/riemann-1859/visual-commentary.json'))[2],primeDigitsContribution);
assert(read('dist/riemann-1859/compare/index.html').includes('id="prime-digits-panel"'));
assert.equal(read('dist/riemann-1859/zeta-reference-values.json'),read('src/sources/zeta-reference-values.json'));
for(const file of ['zeta-math.mjs','zeta-reader.mjs','zeta-worker.mjs']){const result=spawnSync(process.execPath,['--check',new URL('public/'+file,root).pathname],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
for(const id of ['riemann-1854','cartan-1913'])assert(!read('dist/'+id+'/index.html').includes('zeta-reader.mjs'));
console.log(`Validated the scroll-linked zeta contribution, all original passage anchors, strict defining-domain mask, optional higher zero window, pole/zero winding, color key, camera bounds, and ${samples.values.length} independent 80-digit reference samples (maximum normalized error ${worst.toExponential(3)}).`);
