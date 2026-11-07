// Optional browser regression; see README for the Playwright/browser variables.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.STACKS_BASE;
if(!base)throw Error('Set STACKS_BASE to the local or deployed Stacks base URL.');
const refs=Object.fromEntries(Object.values(JSON.parse(fs.readFileSync(new URL('../upstream/references.json',import.meta.url),'utf8'))).map(ref=>[ref.tag,ref]));
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
const visibleCount=graph=>graph.evaluate(g=>{
 const box=g.querySelector('.graph-viewport').getBoundingClientRect();
 return [...g.querySelectorAll('.dependency-node')].filter(n=>{const r=n.querySelector('.graph-node-body').getBoundingClientRect();return r.x+r.width/2>box.left&&r.x+r.width/2<box.right&&r.y+r.height/2>box.top&&r.y+r.height/2<box.bottom;}).length;
});
const checkLabels=async graph=>{
 const labels=await graph.locator('.dependency-node').evaluateAll(ns=>ns.map(n=>({tag:n.dataset.tag,text:n.querySelector('text').textContent,width:n.querySelector('text').getBBox().width})));
 for(const label of labels){const ref=refs[label.tag];assert.equal(label.text,ref.kind[0].toUpperCase()+' '+ref.number);assert(label.width<=50,'Label fits its node: '+label.text);}
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
   console.log(`${viewport.width} ${slug}: compact neighborhood, typed numbers, whole-graph zoom, dismissal, navigation`);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
