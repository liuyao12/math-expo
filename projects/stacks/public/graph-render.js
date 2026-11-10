import {edgeEndpoints,nodeCornerRadius,sectionBoxPadding} from './graph-geometry.js';
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

const inlineMath=/\\\(([\s\S]*?)\\\)/g;
const hasMath=label=>label.includes('\\(');
const plainLabel=label=>label.replace(inlineMath,(_,tex)=>tex
 .replace(/\\(?:mathbb|mathbf|mathrm|mathit|mathcal|mathfrak|mathscr|text|operatorname|left|right)\b/g,'')
 .replace(/\\([a-zA-Z]+)/g,'$1').replace(/[{}]/g,''));
const captionWidth=label=>labelWidth(plainLabel(label),12);
const typesetLabel=(label,math)=>label.split(inlineMath).map((part,index)=>index%2?math(part):esc(part)).join('');

function wrapLabel(label){
 const lines=[];let line='';
 const words=label.match(/(?:\\\([\s\S]*?\\\)|[^\s\\]|\\(?!\())+/g)||[];
 for(const word of words.flatMap(word=>!hasMath(word)&&captionWidth(word)>captionLimit?word.split(/(?<=[–-])/):[word])){
  const next=line+(line&&!/[-–]$/.test(line)?' ':'')+word;
  if(line&&captionWidth(next)>captionLimit){lines.push(line);line=word;}
  else line=next;
 }
 if(line)lines.push(line);
 return lines;
}

// Lay out a directed graph using springs and repulsion. A pull toward
// depth bands makes arrow direction readable, and the initial layout is stable.
function layout(nodes,edges){
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
 const padding=18;
 const left=Math.min(...nodes.map(node=>node.x-node.width/2))-padding;
 const bottom=Math.max(...nodes.map(node=>node.y+node.height/2))+padding;
 for(const node of nodes){
  node.x=Math.round(node.x-left);node.y=Math.round(bottom-node.y);
 }
 return [Math.max(...nodes.map(node=>node.x+node.width/2))+padding,Math.max(...nodes.map(node=>node.y+node.height/2))+padding];
}

function layoutSections(entries,edges){
 const [width,height]=layout(entries.filter(node=>!node.frameOnly),edges);
 const groups=new Map(entries.filter(node=>node.kind==='section').map(section=>[section.tag,{section,members:[]}]));
 for(const node of entries){
  const group=groups.get(node.sectionTag);
  if(group&&group.section!==node)group.members.push(node);
 }
 for(const [tag,group] of groups){
  if(!group.members.length)groups.delete(tag);
 }
 if(!groups.size)return [width,height];

 const units=[];
 for(const {section,members} of groups.values()){
  const rows=new Map();
  for(const node of members){
   if(!rows.has(node.depth))rows.set(node.depth,[]);
   rows.get(node.depth).push(node);
   node.groupTag=section.tag;
  }
  const preferredX=section.frameOnly?members.reduce((sum,node)=>sum+node.x,0)/members.length:section.x;
  let contentWidth=0;
  for(const row of rows.values()){
   row.sort((a,b)=>a.x-b.x);
   let cursor=0;
   for(const node of row){node.x=cursor+node.width/2;cursor+=node.width+26;}
   const rowWidth=cursor-26;
   for(const node of row)node.x-=rowWidth/2;
   contentWidth=Math.max(contentWidth,rowWidth);
  }
  const top=Math.min(section.y??Infinity,...members.map(node=>node.y-node.height/2))-sectionBoxPadding;
  const bottom=Math.max(section.y??-Infinity,...members.map(node=>node.y+node.height/2))+sectionBoxPadding;
  Object.assign(section,{enclosure:true,portY:section.y,y:(top+bottom)/2,width:contentWidth+2*sectionBoxPadding,height:bottom-top});
  units.push({node:section,members,preferredX,top,bottom});
 }
 // Reserve space for long section boxes first, then fit standalone passages
 // between them. Move boxes only horizontally so their dependency levels hold.
 units.sort((a,b)=>b.node.height-a.node.height);
 for(const node of entries){
  if(node.enclosure||node.groupTag)continue;
  units.push({node,members:[],preferredX:node.x,top:node.y-node.height/2,bottom:node.y+node.height/2});
 }
 const placed=[];
 for(const {node,members,preferredX,top,bottom} of units){
  const halfWidth=node.width/2;
  const neighbors=placed.filter(box=>box.top<bottom+12&&box.bottom>top-12).sort((a,b)=>a.left-b.left);
  let left=-Infinity,best=Infinity;
  for(const box of neighbors){
   const right=box.left-halfWidth-26;
   if(left<=right){
    const candidate=Math.max(left,Math.min(right,preferredX));
    if(Math.abs(candidate-preferredX)<Math.abs(best-preferredX))best=candidate;
   }
   left=Math.max(left,box.right+halfWidth+26);
  }
  const candidate=Math.max(left,preferredX);
  node.x=Math.abs(candidate-preferredX)<Math.abs(best-preferredX)?candidate:best;
  for(const member of members)member.x+=node.x;
  placed.push({left:node.x-halfWidth,right:node.x+halfWidth,top,bottom});
 }
 const left=Math.min(...placed.map(box=>box.left))-18,top=Math.min(...placed.map(box=>box.top))-18;
 for(const node of entries){
  node.x-=left;node.y-=top;
  if(node.portY!==undefined)node.portY-=top;
 }
 return [Math.max(...placed.map(box=>box.right))-left+18,Math.max(...placed.map(box=>box.bottom))-top+18];
}

export function renderDependencyGraph(tree,references,base,idPrefix='',currentSlug,math){
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
 for(const [tag,node] of Object.entries(tree.nodes))if(node.frameOnly)depths.set(tag,null);
 if(depths.size!==Object.keys(tree.nodes).length)throw Error('Disconnected reading dependency in '+tree.url);

 const readingSlug=tree.locations.get(tree.rootTag)?.slug;
 const nodes=new Map([...depths].map(([tag,depth])=>{
  const node=tree.nodes[tag],ref=references.get(tag)||node;
  if(!ref?.number)throw Error('Missing dependency metadata for '+tag);
  const location=tree.locations.get(tag);
  const outsideReading=!location||location.slug!==readingSlug;
  const origin=outsideReading?` · ${location?.readingTitle||"The Stacks Project"}`:"";
  const route=location?(location.slug===currentSlug?'':`${base}${location.slug}/`):null;
  const terms=ref.terms?.join('; ');
  const caption=ref.kind==='section'?'':ref.kind==='definition'
   ?tree.labels.definitionTerms?.[tag]||((ref.terms?.length>1||hasMath(terms||''))?terms:tree.labels.definitions[tag]||terms||node.title)
   :ref.kind==='item'?tree.labels.itemTerms?.[tag]||terms||''
   :ref.sourceTitle||tree.labels.namedResults[tag]||(tag===tree.rootTag?node.title:'');
  const description=caption||node.title;
  const mathCaption=hasMath(caption);
  const lineHeight=mathCaption?19:14;
  const lines=wrapLabel(caption);
  const shortLabel=ref.kind==='section'?`§${ref.number}`:`${ref.kind[0].toUpperCase()} ${ref.number}`;
  const referenceLabel=ref.kind==='section'?shortLabel:`${ref.kind[0].toUpperCase()+ref.kind.slice(1)} ${ref.number}`;
  const width=Math.ceil(Math.max(labelWidth(shortLabel,13),...lines.map(captionWidth)))+2*labelPadding;
  const label=`${referenceLabel}${description?' · '+description:''}${origin}`;
  return [tag,{tag,depth,shortLabel,kind:ref.kind,root:tag===tree.rootTag,outsideReading,
   lines,width,mathCaption,lineHeight,height:28+lines.length*lineHeight,sectionTag:location?.section.tag,frameOnly:node.frameOnly,
   label:plainLabel(label),labelHTML:hasMath(label)?typesetLabel(label,math):'',
   href:location?`${route}#${tag}`:`https://stacks.math.columbia.edu/tag/${tag}`,
   section:location&&location.section.tag!==tag?`${route}#${location.section.tag}`:null
  }];
 }));
 const entries=[...nodes.values()];
 const edges=entries.flatMap(node=>(tree.nodes[node.tag].uses||[]).map(used=>[nodes.get(used),node]));
 const [width,height]=layoutSections(entries,edges);
 const lines=edges.map(([from,to])=>{
  const coordinates=edgeEndpoints(from,to);
  return `<line data-from="${esc(from.tag)}" data-to="${esc(to.tag)}" ${Object.entries(coordinates).map(([key,value])=>`${key}="${value.toFixed(2)}"`).join(' ')} marker-end="url(#${idPrefix}dependency-arrow)"/>`;
 }).join('');
 const link=node=>{
  const baseline=-node.height/2+18;
  const textCaption=node.lines.map((line,i)=>`<tspan x="0" y="${baseline+(i+1)*14}">${esc(line+(i<node.lines.length-1&&!/[-–]$/.test(line)?' ':''))}</tspan>`).join('');
  const caption=node.mathCaption
   ?`<foreignObject aria-hidden="true" x="${-node.width/2}" y="${baseline+2}" width="${node.width}" height="${node.lines.length*node.lineHeight+2}"><div xmlns="http://www.w3.org/1999/xhtml" class="graph-math-caption">${node.lines.map(line=>`<div>${typesetLabel(line,math)}</div>`).join('')}</div></foreignObject>`
   :textCaption?`<text class="graph-node-caption" text-anchor="middle">${textCaption}</text>`:'';
  const number=node.enclosure?'':`<text class="graph-node-number" text-anchor="middle" y="${baseline}">${esc(node.shortLabel)}</text>`;
  const ring=node.enclosure?'':`<rect class="graph-node-ring" x="${-node.width/2-ringPadding}" y="${-node.height/2-ringPadding}" width="${node.width+ringPadding*2}" height="${node.height+ringPadding*2}" rx="8"/>`;
  return `<a id="${idPrefix}${esc(node.tag)}" data-tag="${esc(node.tag)}" data-kind="${esc(node.kind)}" data-width="${node.width}" data-height="${node.height}" class="dependency-node${node.root?' dependency-target':''}${node.outsideReading?' outside-reading':''}" href="${esc(node.href)}" aria-label="${esc(node.label)}"${node.labelHTML?` data-label-html="${esc(node.labelHTML)}"`:''}${node.section?` data-section="${esc(node.section)}"`:''}${node.groupTag?` data-graph-group="${esc(node.groupTag)}"`:''}${node.enclosure?` data-graph-cluster="${esc(node.tag)}"`:''}${node.portY!==undefined?` data-port-y="${node.portY}"`:''} transform="translate(${node.x} ${node.y})"><title>${esc(node.label)}</title>${ring}<rect class="graph-node-body" x="${-node.width/2}" y="${-node.height/2}" width="${node.width}" height="${node.height}" rx="${nodeCornerRadius}"/>${number}${caption}</a>`;
 };
 const sectionBoxes=entries.filter(node=>node.enclosure).map(link).join('');
 const links=entries.filter(node=>!node.enclosure).map(link).join('');
 const root=nodes.get(tree.rootTag);
 const legend=[['definition','Definition'],['proposition','Proposition'],['lemma','Lemma'],['section','Section'],['example','Example'],['situation','Situation'],['theorem','Theorem'],['corollary','Corollary'],['remark','Remark'],['item','Item'],['equation','Equation']]
  .filter(([kind])=>entries.some(node=>node.kind===kind))
  .map(([kind,label])=>`<li data-kind="${kind}">${kind==='section'?'§':kind[0].toUpperCase()} · ${label}</li>`).join('');
 return `<div class="dependency-graph">
  <div class="graph-controls" aria-label="Graph zoom" hidden><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit">Fit graph</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>
  ${idPrefix?'<details class="graph-key"><summary>Node types</summary>':''}<ul class="graph-legend" aria-label="Node colors">${legend}${entries.some(node=>node.outsideReading)?'<li class="graph-legend-outside">Outside this reading</li>':''}</ul>${idPrefix?'</details>':''}
  <div class="graph-viewport">
   <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-label="Dependency graph">
    <defs><marker class="graph-arrow" id="${idPrefix}dependency-arrow" markerUnits="userSpaceOnUse" refX="8" refY="4" markerWidth="8" markerHeight="8" viewBox="0 0 8 8" orient="auto" overflow="visible"><path d="M0 0L8 4L0 8Z"/></marker></defs>
    <g class="graph-sections">${sectionBoxes}</g><g class="graph-edges" aria-hidden="true">${lines}</g><g>${links}</g>
   </svg>
  </div>
  <p class="graph-detail"><a data-graph-passage href="${esc(root.href)}">${root.labelHTML||esc(root.label)}</a> <a data-graph-section${root.section?` href="${esc(root.section)}"`:' hidden'}>Read section ↗</a></p>
 </div>`;
}
