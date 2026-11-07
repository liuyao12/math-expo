import {escapeHTML as esc} from './latex.mjs';
const nodeRadius=26,ringRadius=30;

// Lay out a small, directed graph using springs and repulsion. A pull toward
// depth bands makes arrow direction readable, and the initial layout is stable.
function layout(nodes,edges){
 const rows=new Map();
 for(const node of nodes){
  if(!rows.has(node.depth))rows.set(node.depth,[]);
  rows.get(node.depth).push(node);
 }
 for(const [depth,row] of rows){
  row.forEach((node,i)=>Object.assign(node,{
   x:(i-(row.length-1)/2)*72+8*Math.sin(depth*7+i*3),
   y:depth*68+5*Math.cos(i*3),vx:0,vy:0
  }));
 }
 for(let tick=0;tick<220;tick++){
  for(const node of nodes){
   node.vx-=node.x*.004;
   node.vy+=(node.depth*68-node.y)*.055;
  }
  for(let i=0;i<nodes.length;i++){
   const a=nodes[i];
   for(let j=i+1;j<nodes.length;j++){
    const b=nodes[j], dx=b.x-a.x,dy=b.y-a.y;
    const distance=Math.max(Math.hypot(dx,dy),1);
    const force=(6700/(distance*distance)+Math.max(0,68-distance)*.22)/distance;
    a.vx-=dx*force;a.vy-=dy*force;
    b.vx+=dx*force;b.vy+=dy*force;
   }
  }
  for(const [a,b] of edges){
   const dx=b.x-a.x,dy=b.y-a.y,distance=Math.max(Math.hypot(dx,dy),1);
   const force=(distance-91)*.025/distance;
   a.vx+=dx*force;a.vy+=dy*force;
   b.vx-=dx*force;b.vy-=dy*force;
  }
  for(const node of nodes){
   node.vx*=.61;node.vy*=.61;
   node.x+=node.vx;
   const band=node.depth*68;
   node.y=Math.max(band-20,Math.min(band+20,node.y+node.vy));
  }
 }
 const padding=40;
 const left=Math.min(...nodes.map(node=>node.x))-padding,bottom=Math.max(...nodes.map(node=>node.y))+padding;
 for(const node of nodes){
  node.x=Math.round(node.x-left);
  node.y=Math.round(bottom-node.y);
 }
 return [Math.max(...nodes.map(node=>node.x))+padding,Math.max(...nodes.map(node=>node.y))+padding];
}

export function renderDependencyGraph(tree,references,base,idPrefix=''){
 const depths=new Map(),ancestors=new Set();
 const visit=(tag,depth)=>{
  if(!tree.nodes[tag])throw Error('Unknown dependency '+tag);
  if(ancestors.has(tag))throw Error('Cyclic reading dependency at '+tag);
  if((depths.get(tag)??-1)>=depth)return;
  depths.set(tag,depth);
  ancestors.add(tag);
  for(const used of tree.nodes[tag].uses||[])visit(used,depth+1);
  ancestors.delete(tag);
 };
 visit(tree.rootTag,0);
 if(depths.size!==Object.keys(tree.nodes).length)throw Error('Disconnected reading dependency in '+tree.url);

 const readingSlug=tree.locations.get(tree.rootTag)?.slug;
 const nodes=new Map([...depths].map(([tag,depth])=>{
  const node=tree.nodes[tag],ref=references.get(tag)||node;
  if(!ref?.number)throw Error('Missing dependency metadata for '+tag);
  const location=tree.locations.get(tag);
  const outsideReading=!location||location.slug!==readingSlug;
  const origin=outsideReading?` · ${location?.readingTitle||"The Stacks Project"}`:"";
  const route=location?`${base}${location.slug}/`:null;
  return [tag,{tag,depth,number:String(ref.number),shortLabel:`${ref.kind[0].toUpperCase()} ${ref.number}`,kind:ref.kind,root:tag===tree.rootTag,outsideReading,
   label:`${ref.kind[0].toUpperCase()+ref.kind.slice(1)} ${ref.number} · ${node.title}${origin}`,
   href:route?`${route}#${tag}`:`https://stacks.math.columbia.edu/tag/${tag}`,
   section:route&&location.section.tag!==tag?`${route}#${location.section.tag}`:null
  }];
 }));
 const entries=[...nodes.values()];
 const edges=entries.flatMap(node=>(tree.nodes[node.tag].uses||[]).map(used=>[nodes.get(used),node]));
 const [width,height]=layout(entries,edges);
 const lines=edges.map(([from,to])=>`<line data-from="${esc(from.tag)}" data-to="${esc(to.tag)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" marker-end="url(#${idPrefix}dependency-arrow)"/>`).join('');
 const links=entries.map(node=>`<a id="${idPrefix}${esc(node.tag)}" data-tag="${esc(node.tag)}" data-kind="${esc(node.kind)}" class="dependency-node${node.root?' dependency-target':''}${node.outsideReading?' outside-reading':''}" href="${esc(node.href)}" aria-label="${esc(node.label)}"${node.section?` data-section="${esc(node.section)}"`:''} transform="translate(${node.x} ${node.y})"><title>${esc(node.label)}</title><circle class="graph-node-ring" r="${ringRadius}"/><circle class="graph-node-body" r="${nodeRadius}"/><text text-anchor="middle" dy=".35em" style="font-size:${Math.min(13,Math.round(96/node.shortLabel.length))}px">${esc(node.shortLabel)}</text></a>`).join('');
 const root=nodes.get(tree.rootTag);
 const legend=[['definition','Definition'],['proposition','Proposition'],['lemma','Lemma'],['section','Section'],['example','Example'],['situation','Situation']]
  .filter(([kind])=>entries.some(node=>node.kind===kind))
  .map(([kind,label])=>`<li data-kind="${kind}">${kind[0].toUpperCase()} · ${label}</li>`).join('');
 return `<div class="dependency-graph">
  <div class="graph-controls" aria-label="Graph zoom" hidden><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit">Fit graph</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>
  ${idPrefix?'<details class="graph-key"><summary>Node types</summary>':''}<ul class="graph-legend" aria-label="Node colors">${legend}${entries.some(node=>node.outsideReading)?'<li class="graph-legend-outside">Outside this reading</li>':''}</ul>${idPrefix?'</details>':''}
  <div class="graph-viewport">
   <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" data-node-radius="${ringRadius}" aria-label="Dependency graph">
    <defs><marker class="graph-arrow" id="${idPrefix}dependency-arrow" markerUnits="userSpaceOnUse" refX="${nodeRadius+8}" refY="4" markerWidth="8" markerHeight="8" viewBox="0 0 8 8" orient="auto" overflow="visible"><path d="M0 0L8 4L0 8Z"/></marker></defs>
    <g class="graph-edges" aria-hidden="true">${lines}</g><g>${links}</g>
   </svg>
  </div>
  <p class="graph-detail"><a data-graph-passage href="${esc(root.href)}">${esc(root.label)}</a> <a data-graph-section${root.section?` href="${esc(root.section)}"`:' hidden'}>Read section ↗</a></p>
 </div>`;
}
