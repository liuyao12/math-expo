import {edgeEndpoints,sectionBoxPadding} from './graph-geometry.js?section-levels';

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
 const byTag=new Map(nodes.map(node=>[node.dataset.tag,node]));
 const groups=new Map([...svg.querySelectorAll('[data-graph-cluster]')].map(frame=>[frame.dataset.graphCluster,{frame,members:[]}]));
 for(const node of nodes)groups.get(node.dataset.graphGroup)?.members.push(node);
 const geometry=node=>{
  const position=node.transform.baseVal.getItem(0).matrix;
  return {x:position.e,y:position.f,width:Number(node.dataset.width),height:Number(node.dataset.height),
   portY:node.dataset.portY===undefined?undefined:Number(node.dataset.portY)};
 };
 const translate=(node,x,y)=>node.setAttribute('transform',`translate(${x} ${y})`);
 const point=event=>new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());
 const dragNode=event=>{
  const node=event.target.closest('.dependency-node');
  if(!node?.dataset.graphCluster)return node;
  const {x,y,width,height}=geometry(node),p=point(event);
  const distance=Math.min(width/2-Math.abs(p.x-x),height/2-Math.abs(p.y-y));
  return distance<=8?node:null;
 };
 let activeTrigger=null;

 const describe=node=>{
  if(node.dataset.labelHtml)passage.innerHTML=node.dataset.labelHtml;
  else passage.textContent=node.getAttribute('aria-label');
  passage.href=node.getAttribute('href');
  section.hidden=!node.dataset.section;
  if(node.dataset.section)section.href=node.dataset.section;
 };
 const readHash=()=>{
  const node=document.getElementById(location.hash.slice(1));
  describe(nodes.includes(node)?node:root);
 };
 for(const event of ['pointerover','focusin']){
  svg.addEventListener(event,e=>{const node=e.target.closest('.dependency-node');if(node)describe(node);});
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
   if(!trigger||trigger.disabled||event.defaultPrevented)return;
   const node=byTag.get(trigger.dataset.dependencyTag);
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
  for(const trigger of document.querySelectorAll('button[data-dependency-tag]'))trigger.disabled=false;
 }

 let pan=null;
 viewport.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||dragNode(event))return;
  pan={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
 });
 viewport.addEventListener('pointermove',event=>{
  if(pan?.id!==event.pointerId)return;
  if(!viewport.hasPointerCapture(event.pointerId)){
   if(Math.hypot(event.clientX-pan.x,event.clientY-pan.y)<5)return;
   viewport.setPointerCapture(event.pointerId);
   viewport.classList.add('is-panning');
  }
  viewport.scrollLeft=pan.left+pan.x-event.clientX;
  viewport.scrollTop=pan.top+pan.y-event.clientY;
 });
 const endPan=event=>{
  if(pan?.id!==event.pointerId)return;
  pan=null;
  viewport.classList.remove('is-panning');
 };
 viewport.addEventListener('lostpointercapture',endPan);
 window.addEventListener('pointerup',endPan);
 window.addEventListener('pointercancel',endPan);

 let drag=null, suppressClick=false;
 svg.addEventListener('pointerdown',event=>{
  suppressClick=false;
  const node=dragNode(event);
  if(!node||event.button!==0||!event.isPrimary)return;
  const start=point(event),position=node.transform.baseVal.getItem(0).matrix;
  drag={node,id:event.pointerId,x:event.clientX,dx:position.e-start.x};
 });
 svg.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const {node,x,dx}=drag;
  if(!suppressClick){
   if(Math.abs(event.clientX-x)<5)return;
   node.setPointerCapture(event.pointerId);
   suppressClick=true;
  }
  const p=point(event);
  const current=geometry(node),group=groups.get(node.dataset.graphGroup);
  const moved=new Set([node.dataset.tag]);
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  if(node.dataset.graphCluster){
   const halfWidth=current.width/2;
   const nextX=clamp(p.x+dx,halfWidth+10,bounds.width-halfWidth-10);
   translate(node,nextX,current.y);
   for(const member of groups.get(node.dataset.graphCluster).members){
    const {x,y}=geometry(member);
    translate(member,x+nextX-current.x,y);
    moved.add(member.dataset.tag);
   }
  }else{
   let left=10,right=bounds.width-10;
   if(group){
    const {x,width}=geometry(group.frame);
    left=x-width/2+sectionBoxPadding;right=x+width/2-sectionBoxPadding;
   }
   translate(node,clamp(p.x+dx,left+current.width/2,right-current.width/2),current.y);
  }
  for(const line of edges){
   if(moved.has(line.dataset.from)||moved.has(line.dataset.to)){
    const coordinates=edgeEndpoints(geometry(byTag.get(line.dataset.from)),geometry(byTag.get(line.dataset.to)));
    for(const [key,value] of Object.entries(coordinates))line.setAttribute(key,value);
   }
  }
 });
 const end=event=>{if(drag?.id===event.pointerId)drag=null;};
 window.addEventListener('pointerup',end);
 window.addEventListener('pointercancel',end);
 svg.addEventListener('click',event=>{
  if(suppressClick&&event.detail>0){event.preventDefault();suppressClick=false;}
 });
})();
