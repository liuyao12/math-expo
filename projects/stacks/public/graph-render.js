import {edgeEndpoints,nodeCornerRadius} from './graph-geometry.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const ringPadding=6,labelPadding=9,captionLimit=144;

// Arial/Helvetica advance widths in thousandths of an em. The padding
// allows for small differences in weight and fallback fonts.
const glyphWidths=new Map([
 [222,"ijl’'"],[278,' !,./:;I[]ft'],[333,'()-r'],[355,'"'],[389,'*'],
 [500,'Jcksvxyz'],[556,'#$0123456789?Labdeghnopqu–'],[584,'+=<>'],
 [611,'FTZ'],[667,'&ABEKPSVXY'],[722,'CDHNRUw'],[778,'GOQ'],
 [833,'Mm'],[889,'%'],[944,'W'],[1000,'—']
].flatMap(([width,glyphs])=>[...glyphs].map(glyph=>[glyph,width])));
const labelWidth=(text,size)=>[...text.normalize('NFD').replace(/\p{Mark}/gu,'')]
 .reduce((width,glyph)=>width+(glyphWidths.get(glyph)??900),0)*size/1000;

function wrapLabel(label){
 const lines=[];let line='';
 for(const word of label.split(/\s+/).flatMap(word=>labelWidth(word,12)>captionLimit?word.split(/(?<=[–-])/):[word])){
  const next=line+(line&&!/[-–]$/.test(line)?' ':'')+word;
  if(line&&labelWidth(next,12)>captionLimit){lines.push(line);line=word;}
  else line=next;
 }
 if(line)lines.push(line);
 return lines;
}

// Lay out a directed graph using springs and repulsion. A pull toward
// depth bands makes arrow direction readable, and the initial layout is stable.
function layout(nodes,edges,padding=18){
 const rows=new Map();
 for(const node of nodes){
  if(!rows.has(node.depth))rows.set(node.depth,[]);
  rows.get(node.depth).push(node);
 }
 const bands=new Map();
 let bandTop=0;
 for(const depth of [...rows.keys()].sort((a,b)=>a-b)){
  const row=rows.get(depth),height=Math.max(...row.map(node=>node.height));
  const center=bandTop+height/2;
  bands.set(depth,center);
  bandTop+=height+32;
  row.forEach((node,i)=>Object.assign(node,{
   x:(i-(row.length-1)/2)*200+8*Math.sin(depth*7+i*3),
   y:center+5*Math.cos(i*3),vx:0,vy:0
  }));
 }
 // Limit the pairwise work for full reading graphs.
 const ticks=Math.min(260,Math.max(16,Math.floor(20_000_000/nodes.length**2)));
 for(let tick=0;tick<ticks;tick++){
  for(const node of nodes){
   node.vx-=node.x*.002;
   node.vy+=(bands.get(node.depth)-node.y)*.055;
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
   const band=bands.get(node.depth);
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
 const left=Math.min(...nodes.map(node=>node.x-node.width/2))-padding;
 const bottom=Math.max(...nodes.map(node=>node.y+node.height/2))+padding;
 for(const node of nodes){
  node.x=Math.round(node.x-left);node.y=Math.round(bottom-node.y);
 }
 return [Math.max(...nodes.map(node=>node.x+node.width/2))+padding,Math.max(...nodes.map(node=>node.y+node.height/2))+padding];
}

function layoutSections(entries,edges){
 const groups=new Map(entries.filter(node=>node.kind==='section').map(header=>[header.tag,{header,members:[],edges:[]}]));
 const groupFor=new Map();
 for(const node of entries){
  const group=groups.get(node.sectionTag);
  if(group&&group.header!==node)group.members.push(node);
 }
 for(const [tag,group] of groups){
  if(!group.members.length){groups.delete(tag);continue;}
  for(const node of [group.header,...group.members])groupFor.set(node,group);
 }
 const outerEdges=[];
 for(const [from,to] of edges){
  const start=groupFor.get(from),end=groupFor.get(to);
  if(start&&start===end){
   if(from!==start.header&&to!==start.header)start.edges.push([from,to]);
  }else outerEdges.push([start??from,end??to]);
 }
 for(const group of groups.values()){
  const {header,members}=group;
  const depths=[header,...members].map(node=>node.depth).sort((a,b)=>a-b);
  // Pack unrelated passages on the same row. Only links within this section
  // determine how far apart its passages must be vertically.
  const prerequisites=new Map(members.map(node=>[node,[]]));
  for(const [from,to] of group.edges)prerequisites.get(to).push(from);
  const rowWidths=[],rowByNode=new Map();
  const localNodes=[...members].sort((a,b)=>b.depth-a.depth).map(node=>{
   let row=Math.max(0,...prerequisites.get(node).map(from=>rowByNode.get(from)+1));
   const width=node.width+26;
   while(rowWidths[row]&&rowWidths[row]+width>400)row++;
   rowWidths[row]=(rowWidths[row]??0)+width;
   rowByNode.set(node,row);
   return {...node,depth:-row};
  });
  const localByTag=new Map(localNodes.map(node=>[node.tag,node]));
  const [width,height]=layout(localNodes,group.edges.map(([from,to])=>[localByTag.get(from.tag),localByTag.get(to.tag)]),14);
  Object.assign(group,{depth:depths[Math.floor(depths.length/2)],width:Math.max(width,header.width+28),height:height+header.height+14});
  for(const node of members){
   const local=localByTag.get(node.tag);
   node.x=local.x-width/2;node.y=local.y+header.height+14;
  }
  header.x=0;header.y=14+header.height/2;
 }
 const outerNodes=[...entries.filter(node=>!groupFor.has(node)),...groups.values()];
 const [width,height]=layout(outerNodes,outerEdges);
 for(const group of groups.values()){
  for(const node of [group.header,...group.members]){
   node.x+=group.x;node.y+=group.y-group.height/2;
  }
 }
 return {width,height,groups,groupFor};
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
   :ref.sourceTitle||tree.labels.namedResults[tag]||(ref.kind==='section'?location?.section.title||node.title:tag===tree.rootTag?node.title:'');
  const lines=wrapLabel(caption);
  const shortLabel=`${ref.kind[0].toUpperCase()} ${ref.number}`;
  const width=Math.ceil(Math.max(labelWidth(shortLabel,13),...lines.map(line=>labelWidth(line,12))))+2*labelPadding;
  return [tag,{tag,depth,shortLabel,kind:ref.kind,root:tag===tree.rootTag,outsideReading,
   lines,width,height:28+lines.length*14,sectionTag:location?.section.tag,
   label:`${ref.kind[0].toUpperCase()+ref.kind.slice(1)} ${ref.number}${node.title?' · '+node.title:''}${origin}`,
   href:route?`${route}#${tag}`:`https://stacks.math.columbia.edu/tag/${tag}`,
   section:route&&location.section.tag!==tag?`${route}#${location.section.tag}`:null
  }];
 }));
 const entries=[...nodes.values()];
 const edges=entries.flatMap(node=>(tree.nodes[node.tag].uses||[]).map(used=>[nodes.get(used),node]));
 const {width,height,groups,groupFor}=layoutSections(entries,edges);
 const frames=[...groups].map(([tag,group])=>`<rect class="graph-section-frame${group.header.outsideReading?' outside-reading':''}" data-graph-cluster="${esc(tag)}" x="${-group.width/2}" y="${-group.height/2}" width="${group.width}" height="${group.height}" rx="8" transform="translate(${group.x} ${group.y})"/>`).join('');
 const lines=edges.map(([from,to])=>{
  const coordinates=edgeEndpoints(from,to);
  return `<line data-from="${esc(from.tag)}" data-to="${esc(to.tag)}" ${Object.entries(coordinates).map(([key,value])=>`${key}="${value.toFixed(2)}"`).join(' ')} marker-end="url(#${idPrefix}dependency-arrow)"/>`;
 }).join('');
 const links=entries.map(node=>{
  const baseline=-node.height/2+18;
  const caption=node.lines.map((line,i)=>`<tspan x="0" y="${baseline+(i+1)*14}">${esc(line+(i<node.lines.length-1&&!/[-–]$/.test(line)?' ':''))}</tspan>`).join('');
  return `<a id="${idPrefix}${esc(node.tag)}" data-tag="${esc(node.tag)}" data-kind="${esc(node.kind)}" data-width="${node.width}" data-height="${node.height}" class="dependency-node${node.root?' dependency-target':''}${node.outsideReading?' outside-reading':''}" href="${esc(node.href)}" aria-label="${esc(node.label)}"${node.section?` data-section="${esc(node.section)}"`:''}${groupFor.has(node)?` data-graph-group="${esc(node.sectionTag)}"`:''} transform="translate(${node.x} ${node.y})"><title>${esc(node.label)}</title><rect class="graph-node-ring" x="${-node.width/2-ringPadding}" y="${-node.height/2-ringPadding}" width="${node.width+ringPadding*2}" height="${node.height+ringPadding*2}" rx="8"/><rect class="graph-node-body" x="${-node.width/2}" y="${-node.height/2}" width="${node.width}" height="${node.height}" rx="${nodeCornerRadius}"/><text class="graph-node-number" text-anchor="middle" y="${baseline}">${esc(node.shortLabel)}</text>${caption?`<text class="graph-node-caption" text-anchor="middle">${caption}</text>`:''}</a>`;
 }).join('');
 const root=nodes.get(tree.rootTag);
 const legend=[['definition','Definition'],['proposition','Proposition'],['lemma','Lemma'],['section','Section'],['example','Example'],['situation','Situation'],['theorem','Theorem'],['corollary','Corollary'],['remark','Remark'],['item','Item'],['equation','Equation']]
  .filter(([kind])=>entries.some(node=>node.kind===kind))
  .map(([kind,label])=>`<li data-kind="${kind}">${kind[0].toUpperCase()} · ${label}</li>`).join('');
 return `<div class="dependency-graph">
  <div class="graph-controls" aria-label="Graph zoom" hidden><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit">Fit graph</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>
  ${idPrefix?'<details class="graph-key"><summary>Node types</summary>':''}<ul class="graph-legend" aria-label="Node colors">${legend}${entries.some(node=>node.outsideReading)?'<li class="graph-legend-outside">Outside this reading</li>':''}</ul>${idPrefix?'</details>':''}
  <div class="graph-viewport">
   <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-label="Dependency graph">
    <defs><marker class="graph-arrow" id="${idPrefix}dependency-arrow" markerUnits="userSpaceOnUse" refX="8" refY="4" markerWidth="8" markerHeight="8" viewBox="0 0 8 8" orient="auto" overflow="visible"><path d="M0 0L8 4L0 8Z"/></marker></defs>
    <g class="graph-sections" aria-hidden="true">${frames}</g><g class="graph-edges" aria-hidden="true">${lines}</g><g>${links}</g>
   </svg>
  </div>
  <p class="graph-detail"><a data-graph-passage href="${esc(root.href)}">${esc(root.label)}</a> <a data-graph-section${root.section?` href="${esc(root.section)}"`:' hidden'}>Read section ↗</a></p>
 </div>`;
}
