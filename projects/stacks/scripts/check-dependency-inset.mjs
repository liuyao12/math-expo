// Optional browser regression; see README for the Playwright/browser variables.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.STACKS_BASE;
if(!base)throw Error('Set STACKS_BASE to the local or deployed Stacks base URL.');
const refs=Object.fromEntries(Object.values(JSON.parse(fs.readFileSync(new URL('../upstream/references.json',import.meta.url),'utf8'))).map(ref=>[ref.tag,ref]));
const audits=JSON.parse(fs.readFileSync(new URL('../upstream/dependency-audit.json',import.meta.url),'utf8')).readings;
const additional={scheme:['001M'],curves:['05PU','0G2U'],grr:['052Q','00JM']};
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
const visibleCount=graph=>graph.evaluate(g=>{
 const box=g.querySelector('.graph-viewport').getBoundingClientRect();
 return [...g.querySelectorAll('.dependency-node')].filter(n=>{const r=n.querySelector('.graph-node-body').getBoundingClientRect();return r.x+r.width/2>box.left&&r.x+r.width/2<box.right&&r.y+r.height/2>box.top&&r.y+r.height/2<box.bottom;}).length;
});
const checkLabels=async graph=>{
 const labels=await graph.locator('.dependency-node').evaluateAll(ns=>ns.map(n=>({
  tag:n.dataset.tag,text:n.querySelector('.graph-node-number').textContent,
  box:n.querySelector('.graph-node-body').tagName,
  caption:n.querySelector('.graph-node-caption')?.textContent,
  width:Number(n.dataset.width),height:Number(n.dataset.height),
  lines:[...n.querySelectorAll('text')].map(t=>{const b=t.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};})
 })));
 for(const label of labels){
  const ref=refs[label.tag];assert.equal(label.text,ref.kind[0].toUpperCase()+' '+ref.number);
  assert.equal(label.box,'rect','Nodes are boxes');
  if(ref.kind==='definition')assert(label.caption,'Definitions show the defined term: '+label.tag);
  for(const line of label.lines){
   assert(line.x>=-label.width/2+5&&line.x+line.width<=label.width/2-5,'Text fits the box width: '+label.tag);
   assert(line.y>=-label.height/2+3&&line.y+line.height<=label.height/2-3,'Text fits the box height: '+label.tag);
  }
 }
 for(const [tag,name] of [['015N','Grothendieck spectral sequence'],['01F2','Leray spectral sequence']]){
  const label=labels.find(label=>label.tag===tag);
  if(label)assert.equal(label.caption.replace(/\s+/g,' '),name,'Named theorems retain their source names');
 }
};
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<=760,hasTouch:viewport.width<=760,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const [slug,tag] of [['scheme','004P'],['curves','0BYD'],['grr','02UO']]){
   await page.goto(base+slug+'/#'+tag,{waitUntil:'networkidle'});
   const trigger=page.locator('main [id="'+tag+'"] [data-dependency-tag="'+tag+'"]');
   await trigger.focus();await page.keyboard.press('Enter');
   const popup=page.getByRole('dialog',{name:'Dependency graph'});await popup.waitFor();
   const graph=popup.locator('.dependency-graph'),board=graph.locator('.graph-viewport'),svg=graph.locator('svg');
   await checkLabels(graph);
   assert.equal(await popup.evaluate(n=>n.matches(':modal')),false,'Inset leaves the reading usable');
   assert.equal(await trigger.getAttribute('aria-expanded'),'true');
   const box=await popup.boundingBox();
   assert(box.width<=501&&box.x>=11&&box.y>=11&&box.x+box.width<=viewport.width-10&&box.y+box.height<=viewport.height-10,'Compact inset fits the screen');
   const current=graph.locator('.is-current .graph-node-body'),node=await current.boundingBox(),pane=await board.boundingBox();
   assert(Math.hypot(node.x+node.width/2-pane.x-pane.width/2,node.y+node.height/2-pane.y-pane.height/2)<7,'Clicked node is centered');
   const scale=await svg.evaluate(n=>n.getBoundingClientRect().width/n.viewBox.baseVal.width);
   assert(scale>=.85&&scale<=1.4,'Readable local scale, independent of graph size');
   const count=await visibleCount(graph),total=await graph.locator('.dependency-node').count();
   assert(count>1&&count<total,'Initial view shows a neighborhood rather than the entire graph');
   const attached=graph.locator('.graph-edges line[data-from="'+tag+'"],.graph-edges line[data-to="'+tag+'"]');
   const beforeDrag=await attached.evaluateAll(lines=>lines.map(n=>n.outerHTML));
   await page.mouse.move(node.x+node.width/2,node.y+node.height/2);
   await page.mouse.down();await page.mouse.move(node.x+node.width/2+24,node.y+node.height/2+15,{steps:5});await page.mouse.up();
   assert(await popup.isVisible(),'Dragging a node does not navigate away');
   assert.notDeepEqual(await attached.evaluateAll(lines=>lines.map(n=>n.outerHTML)),beforeDrag,'Arrows follow dragged boxes');
   assert(await graph.evaluate(g=>{
    const nodes=new Map([...g.querySelectorAll('.dependency-node')].map(n=>[n.dataset.tag,n]));
    return [...g.querySelectorAll('.graph-edges line')].every(line=>['from','to'].every((end,i)=>{
     const n=nodes.get(line.dataset[end]),p=n.transform.baseVal.getItem(0).matrix;
     const dx=Math.abs(Number(line.getAttribute('x'+(i+1)))-p.e),dy=Math.abs(Number(line.getAttribute('y'+(i+1)))-p.f);
     const ratio=Math.max(dx/(Number(n.dataset.width)/2),dy/(Number(n.dataset.height)/2));
     return ratio>=.999&&ratio<1.5;
    }));
   }),'Edges terminate outside the rectangular bodies');
   const oldWidth=await svg.evaluate(n=>n.getBoundingClientRect().width);
   await graph.getByRole('button',{name:'Zoom out',exact:true}).click();
   assert(await svg.evaluate(n=>n.getBoundingClientRect().width)<oldWidth);
   await graph.getByRole('button',{name:'Fit graph',exact:true}).click();
   assert.equal(await visibleCount(graph),total,'All nodes remain available');
   await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
   assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert(await trigger.evaluate(n=>document.activeElement===n));
   await trigger.click();await popup.waitFor();
   await page.mouse.click(viewport.width-3,viewport.height-3);await popup.waitFor({state:'hidden'});
   await trigger.click();await popup.waitFor();
   await graph.getByRole('button',{name:'Fit graph',exact:true}).click();
   const destinationTag=slug==='scheme'?'0014':'01IJ';
   const destination=graph.locator('.dependency-node[data-tag="'+destinationTag+'"]');
   const href=await destination.getAttribute('href');await destination.click();
   await page.waitForURL(new URL(href,base+slug+'/').href);
   assert.equal(await page.locator('main [id="'+destinationTag+'"]').count(),1,'Node links retain cross-reading navigation');
   const [additionalTag,prerequisite]=additional[slug];
   await page.goto(base+slug+'/#'+additionalTag,{waitUntil:'networkidle'});
   const extra=page.locator('main [data-dependency-tag="'+additionalTag+'"]');
   assert.equal(await extra.innerText(),'Definition '+refs[additionalTag].number);
   await extra.click();await popup.waitFor();
   assert(await popup.locator('[data-graph-overview]').isVisible(),'Audit inset links to the reading overview');
   assert.equal(await popup.locator('.is-current').getAttribute('data-tag'),additionalTag);
   assert.equal(await popup.locator('.dependency-target').getAttribute('data-tag'),audits[slug].target);
   for(const ancestor of audits[slug].paths[additionalTag]){
    assert.equal(await popup.locator('.dependency-node[data-tag="'+ancestor+'"]').count(),1,'Audit inset shows the route to the target');
   }
   await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
   await trigger.click();await popup.waitFor();
   assert.equal(await popup.locator('.dependency-node').count(),total,'An overview label restores the overview');
   assert(!(await popup.locator('[data-graph-overview]').isVisible()));
   await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
   if(prerequisite){
    await extra.click();await popup.waitFor();
    await popup.getByRole('button',{name:'Fit graph',exact:true}).click();
    const reused=popup.locator('.outside-reading[data-tag="'+prerequisite+'"]');
    assert.equal(await reused.getAttribute('href'),'../scheme/#'+prerequisite);
    await reused.click();await page.waitForURL(base+'scheme/#'+prerequisite);
    assert.equal(await page.locator('main [id="'+prerequisite+'"]').count(),1);
   }
   console.log(`${viewport.width} ${slug}: compact neighborhood, typed numbers, whole-graph zoom, dismissal, navigation`);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
