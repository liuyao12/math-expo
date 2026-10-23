import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sevenBridges,fifteenBridges,printedRoute,incidenceCounts} from '../src/bridges-data.mjs';
import {passagesBridges,sectionsBridges} from '../src/euler-1741.mjs';
import {statementsBridges} from '../src/statements-euler-1741.mjs';
assert.equal(passagesBridges.length,21);
assert.deepEqual(passagesBridges.map(r=>r.id),Array.from({length:21},(_,i)=>'e53-'+(i+1)));
assert.deepEqual(sectionsBridges.flatMap(s=>s.rows).map(r=>r.id),passagesBridges.map(r=>r.id));
assert.equal(statementsBridges.length,4);
for(const r of passagesBridges){assert.ok(r.note&&r.sourceUrl);assert.equal((r.text.match(/<p>/g)||[]).length,(r.text.match(/<\/p>/g)||[]).length,r.id);const page=Number(r.sourceUrl.split('#page=')[1]);assert.ok(page===1||page>=3&&page<=14,'Plate must not displace Latin page links');}
assert.deepEqual(incidenceCounts(sevenBridges),{A:5,B:3,C:3,D:3});
assert.deepEqual(incidenceCounts(fifteenBridges),{E:5,F:6,B:4,A:8,C:4,D:3});
const visit=Object.fromEntries('ABCDEF'.split('').map(r=>[r,0]));
for(const r of printedRoute.regions)visit[r]++;
assert.deepEqual(visit,{A:4,B:2,C:2,D:2,E:3,F:3});
assert.equal(printedRoute.bridges.length,15);assert.equal(printedRoute.regions.length,16);
assert.deepEqual([...printedRoute.bridges].sort(),fifteenBridges.map(b=>b.id).sort());
for(let j=0;j<15;j++){
 const b=fifteenBridges.find(b=>b.id===printedRoute.bridges[j]);
 assert.deepEqual([...b.ends].sort(),[printedRoute.regions[j],printedRoute.regions[j+1]].sort(),'Printed route crosses wrong bridge');
}
const evidence=JSON.parse(fs.readFileSync(new URL('../src/euler-1741-source.json',import.meta.url),'utf8'));
const routeText=printedRoute.regions.map((r,i)=>r+(printedRoute.bridges[i]??'')).join('');
assert.equal(routeText,evidence.plateData.printedRoute);
for(const [bridges,key] of [[sevenBridges,'sevenBridgeEndpoints'],[fifteenBridges,'fifteenBridgeEndpoints']])for(const b of bridges)assert.equal(b.ends.join(''),evidence.plateData[key][b.id]);
// Exhaustive independent small cases check the connected finite criterion, including parallel bridges.
const pairs=[['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']];
let cases=0;
for(let encoded=1;encoded<3**6;encoded++){
 let digits=encoded,bridges=[];for(const ends of pairs){const count=digits%3;digits=Math.floor(digits/3);for(let j=0;j<count;j++)bridges.push({ends});}
 const counts=incidenceCounts(bridges),regions=Object.keys(counts),reached=new Set([regions[0]]);
 let changed=true;while(changed){changed=false;for(const b of bridges)if(b.ends.some(r=>reached.has(r)))for(const r of b.ends)if(!reached.has(r)){reached.add(r);changed=true;}}
 if(reached.size!==regions.length)continue;
 const odd=regions.filter(r=>counts[r]%2),starts=odd.length?odd:[regions[0]];
 const cache=new Map();
 function canFinish(at,used){if(used===(1<<bridges.length)-1)return true;const key=at+':'+used;if(cache.has(key))return cache.get(key);for(let j=0;j<bridges.length;j++)if(!(used&(1<<j))&&bridges[j].ends.includes(at)){const next=bridges[j].ends.find(r=>r!==at);if(canFinish(next,used|(1<<j))){cache.set(key,true);return true;}}cache.set(key,false);return false;}
 assert.equal(starts.some(r=>canFinish(r,0)),odd.length===0||odd.length===2,'Connected finite criterion');cases++;
}
// The endpoint identity holds at every region in the printed once-only journey.
const counts=incidenceCounts(fifteenBridges);
for(const r of Object.keys(counts))assert.equal(2*visit[r],counts[r]+Number(r===printedRoute.regions[0])+Number(r===printedRoute.regions.at(-1)));
console.log(`Checked all 21 bridge sections, both source tables, every step of Euler’s printed journey, plate labels, endpoint counts, and ${cases} independent finite crossing cases.`);
