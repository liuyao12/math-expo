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
  for(const [slug,anchor,tag=anchor] of [['scheme','001B'],['scheme','005A'],['curves','01MN'],['curves','01XD'],['grr','02UO'],['gluing','local-functions-0','local-functions']]){
   await page.goto(url(slug,anchor),{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const source=page.locator('main [id="'+anchor+'"]');
   await source.evaluate(n=>scrollBy({top:n.getBoundingClientRect().top-innerHeight*.3+25,behavior:'instant'}));
   if(mobile){
    await page.waitForFunction(tag=>document.querySelector('#example-content [data-example-group="'+tag+'"]'),tag);
    const button=await page.locator('.header-companion-toggle').boundingBox();
    await page.touchscreen.tap(button.x+button.width/2,button.y+button.height/2);
   }
   const group=mobile||slug==='gluing'?page.locator('#example-content'):page.locator('.example-band[data-example-anchor="'+tag+'"] .floating-example');
   await settle(page);
   const compactGroup=await group.evaluate(n=>n.classList.contains('is-compact'));
   if(!compactGroup)await headingsVisible(group,page);
   if(!mobile){
    const overflowing=await page.locator('.example-band:not([hidden])').evaluateAll(bands=>bands.filter((band,index)=>{
     const anchor=document.getElementById(band.dataset.exampleAnchor);
     const section=anchor.closest('.source-section');
     const next=bands[index+1];
     const nextAnchor=document.getElementById(next?.dataset.exampleAnchor);
     const end=nextAnchor?.closest('.source-section')===section?next.getBoundingClientRect().top:section.getBoundingClientRect().bottom;
     return Math.abs(band.getBoundingClientRect().bottom-end)>1||band.firstElementChild.getBoundingClientRect().bottom>end+1;
    }).map(band=>band.dataset.exampleAnchor));
    assert.deepEqual(overflowing,[],'Each example ends at the next example in its section or the end of the section');
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
    await settle(page);await assertExclusive(group,key);
    if(!compactGroup)await headingsVisible(group,page);
    const body=card.locator('.example-body');
    const size=await body.evaluate(n=>({height:n.clientHeight,content:n.scrollHeight}));
    assert(size.height>30,'The open example has usable space');
    if(!compactGroup&&size.content>size.height+10){
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
 const floating=await page.locator('.example-band:not([hidden])').evaluateAll(bands=>bands.find(band=>band.clientHeight-band.firstElementChild.clientHeight>180)?.dataset.exampleAnchor);
 assert(floating,'A longer passage leaves room for its example to float');
 const motion=page.locator('.example-band[data-example-anchor="'+floating+'"]');
 for(const offset of [30,80]){
  await motion.evaluate((band,offset)=>{
   const stickyTop=parseFloat(getComputedStyle(band.firstElementChild).top);
   scrollBy(0,band.getBoundingClientRect().top-stickyTop+offset);
  },offset);
  await settle(page);
  assert(await motion.evaluate(band=>{
   const card=band.firstElementChild;
   return Math.abs(card.getBoundingClientRect().top-parseFloat(getComputedStyle(card).top))<2;
  }),'An example floats while its passage is in view');
 }
 await motion.evaluate(band=>{
  const card=band.firstElementChild;
  scrollBy(0,band.getBoundingClientRect().bottom-card.clientHeight-parseFloat(getComputedStyle(card).top)+20);
 });
 await settle(page);
 assert(await motion.evaluate(band=>Math.abs(band.getBoundingClientRect().bottom-band.firstElementChild.getBoundingClientRect().bottom)<2),'A floating example moves off with the end of its band');
 const localization=page.locator('.example-band[data-example-anchor="localization-at-a-prime"]');
 await page.locator('#localization-at-a-prime').scrollIntoViewIfNeeded();await settle(page);
 assert(await localization.evaluate(band=>Math.abs(band.getBoundingClientRect().top-document.getElementById('localization-at-a-prime').getBoundingClientRect().top)<2),'The localization card starts at its paragraph');
 const overlap=page.locator('.example-band[data-example-anchor="01M4"]');
 await overlap.evaluate(band=>{
  const statement=document.getElementById('01M4').querySelector('.source-body');
  const stickyTop=parseFloat(getComputedStyle(band.firstElementChild).top);
  scrollBy(0,statement.getBoundingClientRect().bottom-stickyTop+80);
 });
 await settle(page);
 assert(await overlap.evaluate(band=>{
  const statement=document.getElementById('01M4');
  const card=band.firstElementChild;
  const top=card.getBoundingClientRect().top;
  return statement.querySelector('.source-body').getBoundingClientRect().bottom<top
   &&Math.abs(top-parseFloat(getComputedStyle(card).top))<2
   &&Math.abs(band.getBoundingClientRect().bottom-statement.closest('.source-section').getBoundingClientRect().bottom)<2;
 }),'The projective chart example stays pinned after its lemma and can reach the end of the section');
 await page.setViewportSize({width:1440,height:220});
 const compact=overlap.locator('.is-compact');
 await compact.scrollIntoViewIfNeeded();await settle(page);
 await compact.evaluate(note=>note.scrollTop=note.scrollHeight);
 assert(await compact.evaluate(note=>note.scrollTop>0),'A short viewport scrolls the card as a whole');
 await page.close();assert.deepEqual(errors,[]);
 console.log('Shared accordion choices, source anchors, and absence of browser errors verified.');
}finally{await browser.close();}
