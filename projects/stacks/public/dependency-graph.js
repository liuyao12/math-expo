(() => {
 'use strict';
 const graph=document.querySelector('.dependency-graph');
 if(!graph)return;
 const dialog=graph.closest('dialog');
 const svg=graph.querySelector('svg'),viewport=graph.querySelector('.graph-viewport');
 const controls=graph.querySelector('.graph-controls');
 const passage=graph.querySelector('[data-graph-passage]'),section=graph.querySelector('[data-graph-section]');
 const root=svg.querySelector('.dependency-target');
 const nodes=[...svg.querySelectorAll('.dependency-node')];
 const edges=[...svg.querySelectorAll('.graph-edges line')];
 const bounds=svg.viewBox.baseVal;
 const edgePadding=Number(svg.dataset.nodeRadius||26)+2;
 let activeTrigger=null;

 const describe=node=>{
  passage.textContent=node.getAttribute('aria-label');
  passage.href=node.getAttribute('href');
  section.hidden=!node.dataset.section;
  if(node.dataset.section)section.href=node.dataset.section;
 };
 const readHash=()=>{
  const node=document.getElementById(location.hash.slice(1));
  describe(nodes.includes(node)?node:root);
 };
 for(const node of nodes){
  node.addEventListener('pointerenter',()=>describe(node));
  node.addEventListener('focus',()=>describe(node));
 }
 if(!dialog){
  window.addEventListener('hashchange',readHash);
  readHash();
 }

 let zoom=1;
 const fitWidth=()=>Math.min(viewport.clientWidth,(dialog?viewport.clientHeight:innerHeight*.75)*bounds.width/bounds.height);
 const maxZoom=()=>dialog?Math.max(4,bounds.width*3/fitWidth()):4;
 const fit=()=>{
  if(dialog&&!dialog.open)return;
  svg.style.width=`${Math.round(fitWidth()*zoom)}px`;
  svg.style.margin=dialog&&zoom>1?`${viewport.clientHeight/2}px ${viewport.clientWidth/2}px`:'';
  controls.querySelector('[data-zoom="out"]').disabled=zoom<=1;
  controls.querySelector('[data-zoom="in"]').disabled=zoom>=maxZoom();
 };
 const viewportCenter=()=>{
  const board=viewport.getBoundingClientRect(),image=svg.getBoundingClientRect();
  return {
   x:(board.left+viewport.clientWidth/2-image.left)/image.width,
   y:(board.top+viewport.clientHeight/2-image.top)/image.height
  };
 };
 const centerAt=({x,y})=>{
  const board=viewport.getBoundingClientRect(),image=svg.getBoundingClientRect();
  viewport.scrollLeft+=image.left+image.width*x-board.left-viewport.clientWidth/2;
  viewport.scrollTop+=image.top+image.height*y-board.top-viewport.clientHeight/2;
 };
 controls.hidden=false;
 controls.addEventListener('click',event=>{
  const action=event.target.dataset.zoom;
  if(!action)return;
  const center=viewportCenter();
  zoom=action==='fit'?1:Math.max(1,Math.min(maxZoom(),zoom*(action==='in'?1.45:1/1.45)));
  fit();
  centerAt(center);
 });
 const placeDialog=()=>{
  if(!dialog?.open||!activeTrigger)return;
  const anchor=activeTrigger.getBoundingClientRect(),box=dialog.getBoundingClientRect();
  const left=Math.max(12,Math.min(innerWidth-box.width-12,anchor.left));
  const below=anchor.bottom+10,above=anchor.top-box.height-10;
  const top=below+box.height<=innerHeight-12?below:above>=12?above:Math.max(12,Math.min(innerHeight-box.height-12,below));
  dialog.style.left=left+'px';dialog.style.top=top+'px';
 };
 window.addEventListener('resize',()=>{
  if(dialog?.open){const center=viewportCenter();placeDialog();fit();centerAt(center);}else fit();
 });
 fit();

 if(dialog&&typeof dialog.show==='function'){
  document.addEventListener('click',event=>{
   const trigger=event.target.closest('[data-dependency-tag]');
   if(!trigger||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const node=nodes.find(node=>node.dataset.tag===trigger.dataset.dependencyTag);
   if(!node)return;
   event.preventDefault();
   graph.querySelector('.is-current')?.classList.remove('is-current');
   node.classList.add('is-current');
   describe(node);
   activeTrigger?.setAttribute('aria-expanded','false');activeTrigger=trigger;
   activeTrigger.setAttribute('aria-expanded','true');
   if(!dialog.open)dialog.show();
   placeDialog();
   // Keep nodes at a readable local scale, independent of the full graph size.
   const localScale=Math.min(1.3,viewport.clientHeight/240);
   zoom=Math.max(1,bounds.width*localScale/fitWidth());
   fit();
   const position=node.transform.baseVal.getItem(0).matrix;
   centerAt({x:position.e/bounds.width,y:position.f/bounds.height});
   dialog.querySelector('header button').focus({preventScroll:true});
  });
  document.addEventListener('pointerdown',event=>{
   if(dialog.open&&!dialog.contains(event.target)&&!event.target.closest('[data-dependency-tag]'))dialog.close();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open){event.preventDefault();dialog.close();}});
  dialog.addEventListener('close',()=>{
   const trigger=activeTrigger;activeTrigger=null;trigger?.setAttribute('aria-expanded','false');trigger?.focus({preventScroll:true});
  });
  dialog.addEventListener('toggle',event=>{if(event.target.matches('details.graph-key'))placeDialog();},true);
  window.addEventListener('scroll',()=>{
   if(!dialog.open||!activeTrigger)return;
   const anchor=activeTrigger.getBoundingClientRect();
   if(anchor.bottom<0||anchor.top>innerHeight)dialog.close();else placeDialog();
  },{passive:true});
  graph.addEventListener('click',event=>{
   if(!event.defaultPrevented&&event.target.closest('a[href]'))dialog.close();
  });
 }

 let pan=null;
 viewport.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('.dependency-node'))return;
  pan={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add('is-panning');
 });
 viewport.addEventListener('pointermove',event=>{
  if(pan?.id!==event.pointerId)return;
  viewport.scrollLeft=pan.left+pan.x-event.clientX;
  viewport.scrollTop=pan.top+pan.y-event.clientY;
 });
 viewport.addEventListener('lostpointercapture',()=>{
  pan=null;
  viewport.classList.remove('is-panning');
 });

 const point=event=>new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());
 let drag=null, suppressClick=false;
 svg.addEventListener('pointerdown',event=>{
  suppressClick=false;
  const node=event.target.closest('.dependency-node');
  if(!node||event.button!==0||!event.isPrimary)return;
  const start=point(event),position=node.transform.baseVal.getItem(0).matrix;
  drag={node,id:event.pointerId,x:event.clientX,y:event.clientY,dx:position.e-start.x,dy:position.f-start.y};
 });
 svg.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const {node,x,y,dx,dy}=drag;
  if(!suppressClick){
   if(Math.hypot(event.clientX-x,event.clientY-y)<5)return;
   node.setPointerCapture(event.pointerId);
   suppressClick=true;
  }
  const p=point(event);
  const nx=Math.max(edgePadding,Math.min(bounds.width-edgePadding,p.x+dx));
  const ny=Math.max(edgePadding,Math.min(bounds.height-edgePadding,p.y+dy));
  node.setAttribute('transform',`translate(${nx} ${ny})`);
  for(const line of edges){
   if(line.dataset.from===node.dataset.tag){line.setAttribute('x1',nx);line.setAttribute('y1',ny);}
   if(line.dataset.to===node.dataset.tag){line.setAttribute('x2',nx);line.setAttribute('y2',ny);}
  }
 });
 const end=event=>{if(drag?.id===event.pointerId)drag=null;};
 window.addEventListener('pointerup',end);
 window.addEventListener('pointercancel',end);
 svg.addEventListener('click',event=>{
  if(suppressClick&&event.detail>0){event.preventDefault();suppressClick=false;}
 });
})();
