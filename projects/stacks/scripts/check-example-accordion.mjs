// Optional browser regression: use an installed Playwright and Chromium.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.STACKS_BASE;
if(!base)throw Error('Set STACKS_BASE to the local or deployed Stacks base URL, ending in /.');
const url=(slug,tag)=>base+slug+'/#'+tag;
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
const errors=[];
const settle=page=>page.waitForTimeout(100);
const headingsVisible=async(group,page)=>{
 const bounds=await group.locator(':scope > .example-disclosure > summary').evaluateAll(ns=>ns.map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom})));
 const height=page.viewportSize().height,header=page.viewportSize().width<=760?65:78;
 assert(bounds.length>0);
 assert(bounds.every(b=>b.top>=header-1&&b.bottom<=height-8),'Every example heading remains in the viewport: '+JSON.stringify(bounds));
};
const assertExclusive=async(group,key)=>{
 const selected=await group.locator(':scope > details[open]').getAttribute('data-example-card');
 assert.equal(selected,key);
 assert.equal(await group.locator(':scope > details[open]').count(),1);
};
try{
 for(const viewport of [{width:1440,height:900},{width:1100,height:700},{width:800,height:900},{width:390,height:844}]){
  const mobile=viewport.width<=760;
  const page=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  for(const [slug,anchor,tag=anchor] of [['scheme','001B'],['scheme','005A'],['scheme','01MN'],['curves','01XD'],['grr','02UO'],['gluing','local-functions-0','local-functions']]){
   await page.goto(url(slug,anchor),{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const source=page.locator('main [id="'+anchor+'"]');
   await source.evaluate(n=>scrollBy({top:n.getBoundingClientRect().top-innerHeight*.3+25,behavior:'instant'}));
   if(mobile){
    await page.waitForFunction(tag=>document.querySelector('#example-content [data-example-group="'+tag+'"]'),tag);
    const button=await page.locator('.header-companion-toggle').boundingBox();
    await page.touchscreen.tap(button.x+button.width/2,button.y+button.height/2);
   }
   const group=mobile||slug==='gluing'?page.locator('#example-content'):page.locator('.example-band[data-example-anchor="'+tag+'"] .floating-example');
   await settle(page);await headingsVisible(group,page);
   if(!mobile){
    const crowded=await page.locator('.example-band:not([hidden])').evaluateAll(bands=>bands.map(b=>({tag:b.dataset.exampleAnchor,space:b.clientHeight,headings:[...b.querySelectorAll('.example-step,.example-disclosure > summary')].reduce((height,n)=>height+n.getBoundingClientRect().height,0)})).filter(b=>b.headings>b.space));
    assert.deepEqual(crowded,[],'All tagged heading groups fit without colliding');
   }
   const cards=group.locator(':scope > .example-disclosure'),count=await cards.count();assert(count>=1);
   if(tag==='005A'){
    assert.equal(await cards.first().locator('summary').innerText(),'Non-example: usual topology');
    assert.equal(await cards.last().locator('summary').innerText(),'Example: Zariski topology');
    assert((await cards.first().locator('.example-correction').textContent()).includes('Correction: Use the Zariski topology'));
   }
   for(let index=0;index<count;index++){
    const card=cards.nth(index),key=await card.getAttribute('data-example-card');
    if(!await card.evaluate(n=>n.open))await card.locator('summary').click();
    await settle(page);await assertExclusive(group,key);await headingsVisible(group,page);
    const body=card.locator('.example-body');
    const size=await body.evaluate(n=>({height:n.clientHeight,content:n.scrollHeight}));
    assert(size.height>30,'The open example has usable space');
    if(size.content>size.height+10){
     const before=await page.evaluate(()=>scrollY),headings=await cards.locator('summary').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().top));
     await body.focus();await page.keyboard.press('PageDown');await settle(page);
     assert(await body.evaluate(n=>n.scrollTop>0),'Long example scrolls independently');
     assert.equal(await page.evaluate(()=>scrollY),before,'Scrolling the example preserves the reading position');
     assert.deepEqual(await cards.locator('summary').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().top)),headings);
    }
    assert(await body.locator('.example-points > li').count()>0,'Examples use bullets');
   }
   const last=cards.last();await last.locator('summary').focus();await page.keyboard.press('Enter');await settle(page);
   assert.equal(await group.locator(':scope > details[open]').count(),0,'Clicking the open heading closes it');
   console.log(`${viewport.width}×${viewport.height} ${slug} ${tag}: accordion, visible headings, independent scrolling, bullets, keyboard`);
  }
  await page.close();
 }
 // Choices persist between the desktop rail and mobile panel, and anchors survive proof reflow.
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url('scheme','001B'),{waitUntil:'networkidle'});
 const rail=page.locator('.example-band[data-example-anchor="001B"]'),first=rail.locator('[data-example-card="001B"]');
 await first.locator('summary').click();await settle(page);
 await page.setViewportSize({width:390,height:844});
 await page.locator('main [id="001B"]').evaluate(n=>scrollBy({top:n.getBoundingClientRect().top-innerHeight*.3+25,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('#example-stage-label').hash==='#001B');
 const button=await page.locator('.header-companion-toggle').boundingBox();await page.mouse.click(button.x+button.width/2,button.y+button.height/2);await settle(page);
 await assertExclusive(page.locator('#example-content'),'001B');
 await page.locator('#close-example').click();await page.setViewportSize({width:1440,height:900});
 await page.locator('main details.proof').first().evaluate(n=>n.open=true);await settle(page);
 const drift=await page.locator('.example-band:not([hidden])').evaluateAll(bands=>bands.map(b=>{
  const a=document.getElementById(b.dataset.exampleAnchor),p=a.classList.contains('source-section')?a.querySelector('.source-heading-row > :is(h2,h3)')||a:a.querySelector('.statement-heading')||a;
  return Math.abs(b.getBoundingClientRect().top-p.getBoundingClientRect().top);
 }));
 assert(drift.every(delta=>delta<2),'Example anchors follow proof reflow and resizing');
 await page.close();assert.deepEqual(errors,[]);
 console.log('Shared accordion choices, source anchors, and absence of browser errors verified.');
}finally{await browser.close();}
