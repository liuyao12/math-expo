import {escapeHTML as esc} from './latex.mjs';
import {edgeEndpoints} from '../public/graph-geometry.js';
const nodeWidth=168,nodePadding=6;

function wrapLabel(label){
 const lines=[];let line='';
 for(const word of label.split(/\s+/).flatMap(word=>word.length>23?word.split(/(?<=[–-])/):[word])){
  if(line&&(line+(/[-–]$/.test(line)?'':' ')+word).length>23){lines.push(line);line=word;}
  else line+=(line&&!/[-–]$/.test(line)?' ':'')+word;
 }
 if(line)lines.push(line);
 return lines;
}

// Lay out a small, directed graph using springs and repulsion. A pull toward
// depth bands makes arrow direction readable, and the initial layout is stable.
function layout(nodes,edges){
 const layerGap=Math.max(...nodes.map(node=>node.height))+32;
 const rows=new Map();
 for(const node of nodes){
  if(!rows.has(node.depth))rows.set(node.depth,[]);
  rows.get(node.depth).push(node);
 }
 for(const [depth,row] of rows){
  row.forEach((node,i)=>Object.assign(node,{
   x:(i-(row.length-1)/2)*200+8*Math.sin(depth*7+i*3),
   y:depth*layerGap+5*Math.cos(i*3),vx:0,vy:0
  }));
 }
 for(let tick=0;tick<260;tick++){
  for(const node of nodes){
   node.vx-=node.x*.002;
   node.vy+=(node.depth*layerGap-node.y)*.055;
  }
  for(let i=0;i<nodes.length;i++){
   const a=nodes[i];
   for(let j=i+1;j<nodes.length;j++){
    const b=nodes[j], dx=b.x-a.x,dy=b.y-a.y;
    const distance=Math.max(Math.hypot(dx,dy),1);
    const force=18000/(distance*distance*distance);
    a.vx-=dx*force;a.vy-=dy*force;
    b.vx+=dx*force;b.vy+=dy*force;
   }
  }
  for(const [a,b] of edges){
   const dx=b.x-a.x,dy=b.y-a.y,distance=Math.max(Math.hypot(dx,dy),1);
   const force=(distance-150)*.012/distance;
   a.vx+=dx*force;a.vy+=dy*force;
   b.vx-=dx*force;b.vy-=dy*force;
  }
  for(const node of nodes){
   node.vx*=.61;node.vy*=.61;
   node.x+=node.vx;
   const band=node.depth*layerGap;
   node.y=Math.max(band-6,Math.min(band+6,node.y+node.vy));
  }
 }
 // Pack each depth band in the order chosen by the springs.
 for(const row of rows.values()){
  row.sort((a,b)=>a.x-b.x);
  let cursor=0;
  for(const node of row){node.x=cursor+node.width/2;cursor+=node.width+26;}
  const center=(cursor-26)/2;
  for(const node of row)node.x-=center;
 }
 const padding=18;
 const left=Math.min(...nodes.map(node=>node.x-node.width/2))-padding;
 const bottom=Math.max(...nodes.map(node=>node.y+node.height/2))+padding;
 for(const node of nodes){
  node.x=Math.round(node.x-left);node.y=Math.round(bottom-node.y);
 }
 return [Math.max(...nodes.map(node=>node.x+node.width/2))+padding,Math.max(...nodes.map(node=>node.y+node.height/2))+padding];
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
  const caption=ref.kind==='definition'?(tree.labels.definitions[tag]||node.title)
   :ref.sourceTitle||tree.labels.namedResults[tag]||(tag===tree.rootTag?node.title:'');
  const lines=wrapLabel(caption);
  return [tag,{tag,depth,number:String(ref.number),shortLabel:`${ref.kind[0].toUpperCase()} ${ref.number}`,kind:ref.kind,root:tag===tree.rootTag,outsideReading,
   caption,lines,width:nodeWidth,height:lines.length?32+lines.length*16:36,
   label:`${ref.kind[0].toUpperCase()+ref.kind.slice(1)} ${ref.number} · ${node.title}${origin}`,
   href:route?`${route}#${tag}`:`https://stacks.math.columbia.edu/tag/${tag}`,
   section:route&&location.section.tag!==tag?`${route}#${location.section.tag}`:null
  }];
 }));
 const entries=[...nodes.values()];
 const edges=entries.flatMap(node=>(tree.nodes[node.tag].uses||[]).map(used=>[nodes.get(used),node]));
 const [width,height]=layout(entries,edges);
 const lines=edges.map(([from,to])=>{
  const coordinates=edgeEndpoints(from,to);
  return `<line data-from="${esc(from.tag)}" data-to="${esc(to.tag)}" ${Object.entries(coordinates).map(([key,value])=>`${key}="${value.toFixed(2)}"`).join(' ')} marker-end="url(#${idPrefix}dependency-arrow)"/>`;
 }).join('');
 const links=entries.map(node=>{
  const caption=node.lines.map((line,i)=>`<tspan x="0" y="${-node.height/2+38+i*16}">${esc(line+(i<node.lines.length-1&&!/[-–]$/.test(line)?' ':''))}</tspan>`).join('');
  return `<a id="${idPrefix}${esc(node.tag)}" data-tag="${esc(node.tag)}" data-kind="${esc(node.kind)}" data-width="${node.width}" data-height="${node.height}" class="dependency-node${node.root?' dependency-target':''}${node.outsideReading?' outside-reading':''}" href="${esc(node.href)}" aria-label="${esc(node.label)}"${node.section?` data-section="${esc(node.section)}"`:''} transform="translate(${node.x} ${node.y})"><title>${esc(node.label)}</title><rect class="graph-node-ring" x="${-node.width/2-nodePadding}" y="${-node.height/2-nodePadding}" width="${node.width+nodePadding*2}" height="${node.height+nodePadding*2}" rx="8"/><rect class="graph-node-body" x="${-node.width/2}" y="${-node.height/2}" width="${node.width}" height="${node.height}" rx="4"/><text class="graph-node-number" text-anchor="middle" y="${node.lines.length?-node.height/2+18:4}">${esc(node.shortLabel)}</text>${caption?`<text class="graph-node-caption" text-anchor="middle">${caption}</text>`:''}</a>`;
 }).join('');
 const root=nodes.get(tree.rootTag);
 const legend=[['definition','Definition'],['proposition','Proposition'],['lemma','Lemma'],['section','Section'],['example','Example'],['situation','Situation']]
  .filter(([kind])=>entries.some(node=>node.kind===kind))
  .map(([kind,label])=>`<li data-kind="${kind}">${kind[0].toUpperCase()} · ${label}</li>`).join('');
 return `<div class="dependency-graph">
  <div class="graph-controls" aria-label="Graph zoom" hidden><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit">Fit graph</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>
  ${idPrefix?'<details class="graph-key"><summary>Node types</summary>':''}<ul class="graph-legend" aria-label="Node colors">${legend}${entries.some(node=>node.outsideReading)?'<li class="graph-legend-outside">Outside this reading</li>':''}</ul>${idPrefix?'</details>':''}
  <div class="graph-viewport">
   <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-label="Dependency graph">
    <defs><marker class="graph-arrow" id="${idPrefix}dependency-arrow" markerUnits="userSpaceOnUse" refX="8" refY="4" markerWidth="8" markerHeight="8" viewBox="0 0 8 8" orient="auto" overflow="visible"><path d="M0 0L8 4L0 8Z"/></marker></defs>
    <g class="graph-edges" aria-hidden="true">${lines}</g><g>${links}</g>
   </svg>
  </div>
  <p class="graph-detail"><a data-graph-passage href="${esc(root.href)}">${esc(root.label)}</a> <a data-graph-section${root.section?` href="${esc(root.section)}"`:' hidden'}>Read section ↗</a></p>
 </div>`;
}
