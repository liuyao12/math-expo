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
const topology=graph=>graph.evaluate(g=>({
 nodes:[...g.querySelectorAll('.dependency-node')].map(n=>n.dataset.tag),
 edges:[...g.querySelectorAll('.graph-edges line')].map(n=>[n.dataset.from,n.dataset.to])
}));
const checkLabels=async graph=>{
 const labels=await graph.locator('.dependency-node').evaluateAll(ns=>ns.map(n=>({
  tag:n.dataset.tag,text:n.querySelector('.graph-node-number')?.textContent,enclosure:!!n.dataset.graphCluster,
  box:n.querySelector('.graph-node-body').tagName,
  caption:n.querySelector('.graph-node-caption')?.textContent,
  width:Number(n.dataset.width),height:Number(n.dataset.height),
  lines:[...n.querySelectorAll('text')].map(t=>{const b=t.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};})
 })));
 assert(new Set(labels.map(label=>label.width)).size>1,'Boxes vary in width with their labels');
 for(const label of labels){
  const ref=refs[label.tag];
  const number=ref.kind==='section'?`§${ref.number}`:ref.kind[0].toUpperCase()+' '+ref.number;
  assert.equal(label.text,label.enclosure?undefined:number);
  assert.equal(label.box,'rect','Nodes are boxes');
  if(ref.kind==='section')assert.equal(label.caption,undefined,'Section boxes omit titles');
  if(label.enclosure)continue;
  if(ref.kind==='definition')assert(label.caption,'Definitions show the defined term: '+label.tag);
  if(!label.caption)assert(label.width-label.lines[0].width<26,'Number-only boxes hug their labels');
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
 const noScript=await browser.newPage({javaScriptEnabled:false});
 const initial=base+'scheme/#001M';
 await noScript.goto(initial,{waitUntil:'domcontentloaded'});
 const unloaded=noScript.locator('main [data-dependency-tag="001M"]');
 assert(await unloaded.isDisabled(),'The highlight is inert before the inset script runs');
 await unloaded.evaluate(node=>node.click());
 assert.equal(noScript.url(),initial,'An uninitialized highlight cannot open the source site');
 assert.equal(await noScript.locator('main [id="001L"] > header .section-source-links > .source-link').first().getAttribute('href'),'https://stacks.math.columbia.edu/tag/001L');
 await noScript.close();
 const early=await browser.newPage();
 let releaseReader;
 const readerGate=new Promise(resolve=>{releaseReader=resolve;});
 await early.route('**/reader.js?*',async route=>{await readerGate;await route.continue();});
 try{
  await early.goto(base+'curves/#0BYD',{waitUntil:'commit'});
  await early.waitForFunction(()=>document.getElementById('dependency-dialog'));
  const top=await early.locator('main [id="0BYD"]').evaluate(node=>node.getBoundingClientRect().top);
  assert(top>=0&&top<early.viewportSize().height/2,'A deep link lands while the reader script is still held back');
  assert.equal(await early.locator('.example-flow').count(),0);
 }finally{
  releaseReader();
 }
 await early.close();
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<=760,hasTouch:viewport.width<=760,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const [slug,tag] of [['scheme','004P'],['curves','0BYD'],['grr','02UO']]){
   await page.goto(base+slug+'/?jump=1#'+tag,{waitUntil:'networkidle'});
   const trigger=page.locator('main [id="'+tag+'"] [data-dependency-tag="'+tag+'"]');
   assert(await trigger.isEnabled(),'Dependency control is ready');
   await trigger.focus();await page.keyboard.press('Enter');
   const popup=page.getByRole('dialog',{name:'Dependency graph'});await popup.waitFor();
   const graph=popup.locator('.dependency-graph'),board=graph.locator('.graph-viewport'),svg=graph.locator('svg');
   await checkLabels(graph);
   const groups=await graph.evaluate(g=>[...g.querySelectorAll('[data-graph-cluster]')].map(frame=>{
    const tag=frame.dataset.graphCluster,bounds=frame.querySelector('.graph-node-body').getBoundingClientRect();
    const members=[...g.querySelectorAll(`[data-graph-group="${tag}"]`)];
    const contains=members.every(n=>{
     const box=n.querySelector('.graph-node-body').getBoundingClientRect();
     return box.left>=bounds.left&&box.right<=bounds.right&&box.top>=bounds.top&&box.bottom<=bounds.bottom;
    });
    return {tag,contains,members:members.map(n=>n.dataset.tag)};
   }));
   assert(groups.length>0,'Sections with multiple passages have frames');
   for(const {tag,contains,members} of groups){
    assert(contains,'The frame encloses every member of '+tag);
    const expected=Object.entries(audits[slug].passages).filter(([t,p])=>t!==tag&&p.section===tag).map(([t])=>t);
    assert.deepEqual(members.sort(),expected.sort(),'A frame groups only its own audited passages');
   }
   assert.equal(await popup.evaluate(n=>n.matches(':modal')),false,'Inset leaves the reading usable');
   assert.equal(await trigger.getAttribute('aria-expanded'),'true');
   const box=await popup.boundingBox();
   assert(box.width<=501&&box.x>=11&&box.y>=11&&box.x+box.width<=viewport.width-10&&box.y+box.height<=viewport.height-10,'Compact inset fits the screen');
   const current=graph.locator('.is-current .graph-node-body'),node=await current.boundingBox(),pane=await board.boundingBox();
   assert(Math.hypot(node.x+node.width/2-pane.x-pane.width/2,node.y+node.height/2-pane.y-pane.height/2)<7,'Clicked node is centered');
   const scale=await svg.evaluate(n=>n.getBoundingClientRect().width/n.viewBox.baseVal.width);
   assert(scale>=.85&&scale<=1.4,'Readable local scale, independent of graph size');
   const count=await visibleCount(graph),total=await graph.locator('.dependency-node').count();
   assert(count>=1&&count<total,'Initial view is zoomed to the selected passage');
   const shared=await topology(graph);
   const attached=graph.locator('.graph-edges line[data-from="'+tag+'"],.graph-edges line[data-to="'+tag+'"]');
   const beforeDrag=await attached.evaluateAll(lines=>lines.map(n=>n.outerHTML));
   await page.mouse.move(node.x+node.width/2,node.y+node.height/2);
   await page.mouse.down();await page.mouse.move(node.x+node.width/2+24,node.y+node.height/2+15,{steps:5});await page.mouse.up();
   assert(await popup.isVisible(),'Dragging a node does not navigate away');
   assert.notDeepEqual(await attached.evaluateAll(lines=>lines.map(n=>n.outerHTML)),beforeDrag,'Arrows follow dragged boxes');
   assert(await graph.evaluate(g=>{
    const nodes=new Map([...g.querySelectorAll('.dependency-node')].map(n=>[n.dataset.tag,n]));
    return [...g.querySelectorAll('.graph-edges line')].every(line=>Number(line.getAttribute('y1'))<Number(line.getAttribute('y2'))&&['from','to'].every((end,i)=>{
     const n=nodes.get(line.dataset[end]),p=n.transform.baseVal.getItem(0).matrix;
     const x=Number(line.getAttribute('x'+(i+1)))-p.e,y=Number(line.getAttribute('y'+(i+1)))-p.f;
     const rect=n.querySelector('.graph-node-body');
     return rect.isPointInFill(new DOMPoint(x*.995,y*.995))&&!rect.isPointInFill(new DOMPoint(x*1.005,y*1.005));
    }));
   }),'Every arrow runs down and meets both box borders');
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
   const href=await destination.getAttribute('href'),origin=await page.evaluate(()=>performance.timeOrigin);
   const destinationURL=new URL(href,page.url()).href;
   await destination.click();await page.waitForURL(destinationURL);
   if(slug==='scheme'){
    assert.equal(href,'#0014');
    assert.equal(await page.evaluate(()=>performance.timeOrigin),origin,'A same-reading jump stays on the current document');
   }
   assert.equal(await page.locator('main [id="'+destinationTag+'"]').count(),1,'Node links retain cross-reading navigation');
   const [additionalTag,prerequisite]=additional[slug];
   await page.goto(base+slug+'/#'+additionalTag,{waitUntil:'networkidle'});
   const extra=page.locator('main [data-dependency-tag="'+additionalTag+'"]');
   assert.equal(await extra.innerText(),'Definition '+refs[additionalTag].number);
   const readingUrl=page.url();
   await extra.click();await popup.waitFor();
   assert.equal(page.url(),readingUrl,'A highlighted label opens its inset without navigating');
   assert.deepEqual(await topology(graph),shared,'Both highlights open the same full graph');
   assert.equal(await popup.locator('.is-current').getAttribute('data-tag'),additionalTag);
   assert.equal(await popup.locator('.dependency-target').getAttribute('data-tag'),audits[slug].target);
   for(const ancestor of audits[slug].paths[additionalTag]){
    assert.equal(await popup.locator('.dependency-node[data-tag="'+ancestor+'"]').count(),1,'The shared graph contains the route to the target');
   }
   await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
   await trigger.click();await popup.waitFor();
   assert.deepEqual(await topology(graph),shared,'Switching highlights leaves the graph intact');
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
  await page.goto(base+'scheme/#009H',{waitUntil:'networkidle'});
  await page.locator('main [data-dependency-tag="009H"]').click();
  const sectionPopup=page.getByRole('dialog',{name:'Dependency graph'});
  const frame=sectionPopup.locator('[data-tag="009H"] .graph-node-body');
  const viewportBox=await sectionPopup.locator('.graph-viewport').boundingBox();
  let frameBox=await frame.boundingBox();
  while(frameBox.x<viewportBox.x+2){
   await sectionPopup.getByRole('button',{name:'Zoom out',exact:true}).click();
   frameBox=await frame.boundingBox();
  }
  const groupPositions=()=>sectionPopup.locator('[data-graph-cluster="009H"],[data-graph-group="009H"]').evaluateAll(nodes=>nodes.map(n=>{
   const m=n.transform.baseVal.getItem(0).matrix;
   return [m.e,m.f];
  }));
  const before=await groupPositions();
  const x=frameBox.x+2,y=viewportBox.y+viewportBox.height/2;
  await page.mouse.move(x,y);
  await page.mouse.down();await page.mouse.move(x+24,y+15,{steps:5});await page.mouse.up();
  const deltas=(await groupPositions()).map(([x,y],i)=>[x-before[i][0],y-before[i][1]]);
  assert(deltas.length>2&&Math.abs(deltas[0][0])>5,'Dragging the border moves the section box');
  assert(deltas.every(([,y])=>Math.abs(y)<.01),'Dragging preserves dependency levels');
  assert(deltas.every(([x,y])=>Math.hypot(x-deltas[0][0],y-deltas[0][1])<.01),'The frame and all its passages move together');
  assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
