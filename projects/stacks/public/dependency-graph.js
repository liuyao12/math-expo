(() => {
 'use strict';
 const graph=document.querySelector('.dependency-graph');
 if(!graph)return;
 const svg=graph.querySelector('svg'),viewport=graph.querySelector('.graph-viewport');
 const controls=graph.querySelector('.graph-controls');
 const passage=graph.querySelector('[data-graph-passage]'),section=graph.querySelector('[data-graph-section]');
 const root=svg.querySelector('.dependency-target');
 const nodes=[...svg.querySelectorAll('.dependency-node')];
 const edges=[...svg.querySelectorAll('.graph-edges line')];
 const bounds=svg.viewBox.baseVal;

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
 window.addEventListener('hashchange',readHash);
 readHash();

 let zoom=1;
 const fit=()=>{
  const fitWidth=Math.min(viewport.clientWidth,innerHeight*.75*bounds.width/bounds.height);
  svg.style.width=`${Math.round(fitWidth*zoom)}px`;
  controls.querySelector('[data-zoom="out"]').disabled=zoom===1;
  controls.querySelector('[data-zoom="in"]').disabled=zoom===4;
 };
 controls.hidden=false;
 controls.addEventListener('click',event=>{
  const action=event.target.dataset.zoom;
  if(!action)return;
  const x=(viewport.scrollLeft+viewport.clientWidth/2)/viewport.scrollWidth;
  const y=(viewport.scrollTop+viewport.clientHeight/2)/viewport.scrollHeight;
  zoom=action==='fit'?1:Math.max(1,Math.min(4,zoom*(action==='in'?1.45:1/1.45)));
  fit();
  viewport.scrollLeft=viewport.scrollWidth*x-viewport.clientWidth/2;
  viewport.scrollTop=viewport.scrollHeight*y-viewport.clientHeight/2;
 });
 window.addEventListener('resize',fit);
 fit();

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
  const nx=Math.max(24,Math.min(bounds.width-24,p.x+dx));
  const ny=Math.max(24,Math.min(bounds.height-24,p.y+dy));
  node.setAttribute('transform',`translate(${nx} ${ny})`);
  for(const line of edges){
   if(line.dataset.from===node.id){line.setAttribute('x1',nx);line.setAttribute('y1',ny);}
   if(line.dataset.to===node.id){line.setAttribute('x2',nx);line.setAttribute('y2',ny);}
  }
 });
 const end=event=>{if(drag?.id===event.pointerId)drag=null;};
 window.addEventListener('pointerup',end);
 window.addEventListener('pointercancel',end);
 svg.addEventListener('click',event=>{
  if(suppressClick&&event.detail>0){event.preventDefault();suppressClick=false;}
 });
})();
