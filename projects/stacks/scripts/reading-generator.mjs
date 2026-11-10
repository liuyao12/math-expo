import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRenderer,escapeHTML as esc} from '../src/latex.mjs';
import {printedSource,renderProofs,sourceHeading} from '../src/source-column.mjs';
import {notesFor,proseNotes} from '../src/scheme-notes.mjs';
import {loadReadingCatalog,loadReadings,loadReferenceReadings,selectedOverview} from '../src/readings.mjs';
import {renderDependencyGraph} from '../public/graph-render.js';
import {renderOutline} from '../src/reading-outline.mjs';
import {createLeanSchemeGraph} from '../src/lean-scheme-graph.mjs';
// Land on deep links once the reading is parsed, before the examples and graph.
const jumpToPassage=`<script>
 (() => {
  if(!location.hash)return;
  let target;
  try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}
  if(!target?.closest('main'))return;
  const proof=target.closest('details.proof');
  if(proof)proof.open=true;
  target.scrollIntoView({block:'start',behavior:'instant'});
 })();
</script>`;

const unescapeLabel=s=>s.replace(/&(?:amp|lt|gt|quot);/g,entity=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"'})[entity]);
function graphLabelSource(html){
 return unescapeLabel(html.replace(/<span class="math-inline math-lazy" data-tex="([^"]*)"><math\b[\s\S]*?<\/math><\/span>/g,
  (_,tex)=>'\\('+tex+'\\)').replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
}

// Stacks usually marks newly defined terms in italics. Keep terms under a
// labelled list item separate from the terms in its surrounding definition.
function indexDefinedTerms(html,references){
 const terms=new Set(),items=[],taggedItems=new Map();
 const tokens=/<li\b[^>]*>|<\/li>|<span class="source-anchor" id="([^"]+)"><\/span>|<em>([\s\S]*?)<\/em>/g;
 for(const [token,tag,emphasis] of html.matchAll(tokens)){
  if(token.startsWith('<li'))items.push(new Set());
  else if(token==='</li>')items.pop();
  else if(tag&&items.length&&references.get(tag)?.kind==='item')taggedItems.set(tag,items.at(-1));
  else if(emphasis){
   const term=graphLabelSource(emphasis).replace(/^(?:of |[-–]\s*)/,'')
    .replace(/(?:\s+(?:of|on|in|at|over|by|with|along|associated to))+$/,'');
   if(!term)continue;
   terms.add(term);
   for(const item of items)item.add(term);
  }
 }
 for(const [tag,item] of taggedItems)if(item.size)references.get(tag).terms=[...item];
 return [...terms];
}

export function buildReadings({root,dist,head,header,footer,renderExampleCard,assetVersion}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
 const catalog=loadReadingCatalog(root);
 const readings=loadReadings(root,catalog);
 const referenceReadings=loadReferenceReadings(root,catalog);
 const coreReading=readings.find(reading=>reading.role==='foundation');
 if(!coreReading)throw Error('Missing foundation reading');
 const audit=JSON.parse(fs.readFileSync(path.join(root,'upstream/dependency-audit.json'),'utf8'));
 const graphLabels=JSON.parse(fs.readFileSync(path.join(root,'src/dependency-labels.json'),'utf8'));
 const graphs=readings.filter(reading=>reading.graph).map(reading=>{
  const lean=reading.dependencySource==='lean';
  const graph=lean?createLeanSchemeGraph(catalog,reading,JSON.parse(fs.readFileSync(path.join(root,'upstream/lean-scheme-graph.json'),'utf8'))):{
   nodes:selectedOverview(JSON.parse(fs.readFileSync(path.join(root,'src',reading.graph+'-dependencies.json'),'utf8')),reading.target,audit.readings[reading.slug].required_tags),
   rootTag:reading.target,locations:new Map(),labels:graphLabels
  };
  return {...graph,lean,url:`dependencies/${reading.slug}/`,reading,audit:audit.readings[reading.slug]};
 });
 const graphsBySlug=new Map(graphs.map(graph=>[graph.reading.slug,graph]));
 const schemeTree=graphsBySlug.get(coreReading.slug);
 const readingSlugs=new Set(readings.map(reading=>reading.slug));
 const locations=new Map(readings.map(reading=>[reading.slug,new Map()]));
 const dependencyLabel=(tag,text,label=text)=>
  `<button type="button" class="dependency-number" data-dependency-tag="${esc(tag)}" aria-haspopup="dialog" aria-controls="dependency-dialog" aria-expanded="false" aria-label="${esc(label)} dependencies" disabled>${esc(text)}</button>`;
 const references=catalog.references;
 const referencesByTag=new Map(Object.values(references).map(ref=>[ref.tag,ref]));
 const allSections=manifest.units.flatMap(u=>u.sections),stats=[],readerPages=[];
 const repository='https://github.com/stacks/stacks-project';
 const coreSections=coreReading.sections;
 // The selected reading can extend beyond the older reference collection.
 const pathUnits=[];
 for(const section of coreSections){
  if(pathUnits.at(-1)?.chapter!==section.chapter){
   const chapter=catalog.chaptersBySlug.get(section.chapter);
   pathUnits.push({...chapter,chapter:section.chapter,sections:[]});
  }
  pathUnits.at(-1).sections.push(section);
 }
 const coreTags=new Set(coreSections.map(section=>section.tag));
 const coreUnits=manifest.units.flatMap(unit=>{
  const sections=unit.sections.filter(section=>coreTags.has(section.tag));
  return sections.length?[{...unit,slug:`core-${unit.slug}`,sections,core:true}]:[];
 });
 const coreHref=`${coreReading.slug}/`;
 const routesFor=reading=>Object.fromEntries(reading.sections.flatMap(section=>{
  const tex=fs.readFileSync(path.join(root,'upstream/sections',`${section.slug}.tex`),'utf8');
  return [...tex.matchAll(/\\label\{([^}]+)\}/g)].map(match=>[`${section.chapter}-${match[1]}`,reading.slug]);
 }));
 const routesByReading=new Map(readings.map(reading=>[reading.slug,routesFor(reading)]));
 const unitList=(base,units,href=u=>`${base}${u.slug}/`)=>units.map(u=>`<a class="reading-entry" href="${href(u)}"><span class="reading-number">${u.number}</span><div><p class="eyebrow">The Stacks Project · Chapter ${u.number}</p><h3>${esc(u.title)}</h3><div class="reading-meta"><span>${u.sections.length} complete sections</span><span>§${u.sections.map(s=>s.number).join(', ')}</span></div></div><span class="entry-arrow" aria-hidden="true">↗</span></a>`).join('');
 for(const unit of [...manifest.units,...coreUnits,...readings,...referenceReadings]){
  const tree=graphsBySlug.get(unit.slug)||(unit.core?schemeTree:null);
  const audited=readingSlugs.has(unit.slug)?tree?.audit.passages:null;
  const marked=tag=>audited?!!audited[tag]||!!tree?.sectionTriggers?.has(tag):!!tree?.nodes[tag];
  const prerequisiteRoutes=Object.assign({},...(unit.core&&!unit.readingTitle
   ?[coreReading.slug]:unit.prerequisiteSlugs||[]).map(slug=>routesByReading.get(slug)));
  const locate=(tag,section)=>{
   if(readingSlugs.has(unit.slug)&&graphs.some(graph=>graph.nodes[tag]))locations.get(unit.slug).set(tag,{slug:unit.slug,readingTitle:unit.readingTitle,section});
  };
  const sectionHeading=unit.chapterHeadings?'h3':'h2';
  const statementHeading=unit.chapterHeadings?'h4':'h3';
  const r=createRenderer(root,{sections:unit.sections,routes:prerequisiteRoutes,proseNotes,lazyMath:!!unit.readingTitle}),data={};let proofs=0,statements=0;
  const rich=s=>s.replace(/\\\[([\s\S]*?)\\\]/g,(_,t)=>r.math(t,true)).replace(/\\\(([\s\S]*?)\\\)/g,(_,t)=>r.math(t));
  const sections=unit.sections.map((s,index)=>{
   const blocks=r.section(s);
   locate(s.tag,s);
   const content=blocks.map((b,bi)=>{
    if(unit.readingTitle&&(b.kind==='prose'||b.kind==='definition')){
     const terms=indexDefinedTerms(b.html,referencesByTag);
     if(b.kind==='definition'&&terms.length)referencesByTag.get(b.tag).terms=terms;
    }
    const notes=notesFor(s.tag,b.tag||b.proseId),key=notes.tag;
    if(!data[key]){
     const html=notes.examples.map((item,index)=>
      renderExampleCard(item,index?key+'-extra-'+index:key,notes.examples.length===1,false,r,key)
     ).join('');
     data[key]={html};
    }
    const label=b.kind==='prose'?`§${s.number} · ${s.title}`:`${b.kind[0].toUpperCase()+b.kind.slice(1)} ${b.number}`;
    const id=b.tag||b.proseId||s.slug+'-'+bi;
    let html=`<div class="source-body">${printedSource(b.html)}</div>`;
    if(b.kind!=='prose'){
     const ref=referencesByTag.get(b.tag);
     if(b.title)ref.sourceTitle=graphLabelSource(r.inline(b.title,s.chapter));
     if(b.kind==='definition'&&!ref.term){
      const term=b.html.match(/<em>([^<>]+)<\/em>/)?.[1];
      if(term)ref.term=term.replaceAll('&amp;','&').replaceAll('&quot;','"');
     }
     locate(b.tag,s);
     const heading=marked(b.tag)?dependencyLabel(b.tag,label):esc(label);
     statements++;html=`<div class="statement-heading"><${statementHeading}>${heading}${b.title?' · '+rich(b.title):''}</${statementHeading}></div>`+html;
    }
    proofs+=b.proofs?.length||0;
    html+=renderProofs(b.proofs,{id,key,tag:b.tag||s.tag,label:label,renderer:r});
    return `<section id="${id}" class="passage ${b.kind}${b.continues?' prose-continues':''}" data-example="${key}" data-source-label="${esc(label)}" data-source-tag="${b.tag||s.tag}" aria-label="${esc(label)}">${html}</section>`;
   }).join('');
   const chapter=catalog.chaptersBySlug.get(s.chapter);
   const chapterHeading=unit.chapterHeadings
    ?s.stage?`<h2 class="source-chapter-title">${esc(s.stage)}</h2>`
     :`<p class="source-chapter-reminder">${esc(chapter.number+'. '+chapter.title)}</p>`
    :s.chapterTitle&&index>0&&s.chapter!==unit.sections[index-1].chapter?`<p class="eyebrow">${esc(s.chapterTitle)}</p>`:'';
   const sectionNumber=`§${s.number}`;
   const number=unit.highlightSections&&marked(s.tag)?dependencyLabel(s.tag,sectionNumber):sectionNumber;
   return `<section class="source-section" id="${s.tag}" data-source-sha256="${s.sha256}"><header class="source-section-header">${chapterHeading}${sourceHeading(sectionHeading,`${number} ${esc(s.title)}`,s)}</header>${content}</section>`;
  }).join('');
  if(!unit.readingTitle)stats.push({slug:unit.slug,sections:unit.sections.length,proofs,statements,formulas:r.mathCount});
  const first=Object.keys(data)[0],firstSource=unit.sections[0];
  const toc=renderOutline(unit.sections);
  const chapterNav=(unit.core?coreUnits:manifest.units).map(u=>`<a href="../${u.slug}/" ${u.slug===unit.slug?'aria-current="page"':''}>${u.number}. ${esc(u.title)}</a>`).join('');
  const outlineLink=unit.readingTitle?'<a class="back-link" href="../#readings-title">← Selected readings</a>':`<a class="back-link" href="../${schemeTree.url}">← Sections for defining schemes</a>`;
  const outlineType=unit.readingTitle?'Selected reading':`Chapter ${unit.number} · ${unit.core?'Definition path':'Reference collection'}`;
  const description=unit.deck|| (unit.core?'Sections leading through schemes and Proj to projective varieties.':'Complete original sections from the reference collection.');
  const targetLinks=unit.target
   ?`<p class="dependency-guide"><a href="#${unit.target}">${esc(unit.targetLabel)}</a>${(unit.prerequisites||[]).map(slug=>{
    const prerequisite=readings.find(reading=>reading.slug===slug);
    return `<br><a href="../${prerequisite.slug}/">Prerequisite · ${esc(prerequisite.readingTitle)}</a>`;
   }).join('')}</p>`:'';
  const dependencyLink=tree?`<p class="dependency-guide"><a href="../${tree.url}#dependency-tree">Dependency graph</a><br>Select a yellow label to open its graph here.</p>`:'';
  const leanSection={scheme:'lean-graph',curves:'curves'}[unit.slug];
  const leanLink=leanSection?`<p class="dependency-guide"><a href="../lean-dependencies/#${leanSection}">${unit.slug==='scheme'?'Lean dependency graph':'Lean dependency comparison'}</a></p>`:'';
  const html=head(unit.readingTitle||unit.title,'../',unit.chapterHeadings?description:`The Stacks Project, Chapter ${unit.number}: ${unit.title}. ${description}`)+header('../',true)+`<div class="reading-progress" aria-hidden="true"><span></span></div><div class="reader-layout"><nav class="reading-outline" id="reading-outline" aria-label="Reading contents">${outlineLink}<p class="eyebrow">${outlineType}</p><div class="margin-reading-controls"><button id="toggle-proofs" type="button" aria-pressed="false">Show all proofs</button><button class="mobile-example" type="button" data-show-example>Example ↗</button></div>${targetLinks}${dependencyLink}${leanLink}${toc}${unit.readingTitle?'':`<details class="chapter-navigation"><summary>Other chapters</summary>${chapterNav}</details>`}${unit.core&&!unit.readingTitle?`<a href="../${unit.sections[0].chapter}/">Full chapter selection ↗</a>`: ''}<div class="outline-note"><span class="eyebrow">Separate commentary</span><p>Concrete examples</p><button type="button" class="mobile-example" data-show-example>Open example</button></div></nav><main id="main" class="reader-main verbatim-main"><header class="reading-title"><h1>${esc(unit.chapterHeadings?unit.readingTitle:unit.title)}</h1></header>${sections}</main><aside id="example-dock" class="example-dock" data-example-layout="anchored" aria-label="Examples and analogies" tabindex="-1"><div class="example-sticky"><div class="example-header"><button id="close-example" type="button" aria-label="Close example">×</button></div><div class="example-current"><div class="example-step"><a id="example-stage-label" href="#${firstSource.tag}">§${firstSource.number} · ${esc(firstSource.title)}</a><span id="example-index"${data[first].html?'':' hidden'}>01</span></div><div id="example-content">${data[first].html}</div><div class="example-paging"${data[first].html?'':' hidden'}><button id="previous-example" type="button" aria-label="Previous example explanation">← Previous</button><button id="follow-reading" type="button" aria-pressed="true">Follow reading</button><button id="next-example" type="button" aria-label="Next example explanation">Next →</button></div></div></div></aside></div>${footer('../')}${jumpToPassage}<script type="application/json" id="example-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`;
  readerPages.push({slug:unit.slug,html,tree});

 }
 for(const graph of graphs){
  if(graph.lean)continue;
  for(const tag of Object.keys(graph.nodes)){
   const order=[graph.reading.slug,...(graph.reading.prerequisiteSlugs||[])];
   const location=order.map(slug=>locations.get(slug).get(tag)).find(Boolean);
   if(!location)throw Error('Missing selected prerequisite '+tag+' for '+graph.url);
   if(location)graph.locations.set(tag,location);
  }
 }
 const graphScript=(base='../../')=>`<script type="module" src="${base}dependency-graph.js?v=${assetVersion}"></script>`;
 const graphMath=createRenderer(root).math;
 const graphHTML=(tree,prefix='',base='../../',currentSlug)=>renderDependencyGraph(tree,referencesByTag,base,prefix,currentSlug,graphMath);
 const owners=new Map(readings.flatMap(reading=>reading.sections.map(section=>[section.tag,{reading,section}])));
 const auditedGraph=tree=>{
  const nodes={},locations=new Map();
  const entries=Object.entries(tree.audit.passages);
  for(const [tag,entry] of entries){
   const owner=owners.get(entry.section),ref=referencesByTag.get(tag);
   if(!owner||!ref)throw Error('Missing audited passage metadata: '+tag);
   const title=ref.kind==='definition'
    ?graphLabels.definitions[tag]||ref.term||tree.nodes[tag]?.title||owner.section.title
    :tree.nodes[tag]?.title||ref.sourceTitle||graphLabels.namedResults[tag]||(ref.kind==='section'?owner.section.title:'');
   nodes[tag]={title,uses:[]};
   locations.set(tag,{slug:owner.reading.slug,readingTitle:owner.reading.readingTitle,section:owner.section});
  }
  // Keep every audited path to the target. Add other direct dependencies
  // wherever they preserve the top-down order of the diagram.
  for(const [tag] of entries){
   const parent=tree.audit.paths[tag].at(-1);
   if(parent)nodes[parent].uses.push(tag);
  }
  const reaches=(from,to)=>{
   const pending=[from],visited=new Set();
   while(pending.length){
    const tag=pending.pop();
    if(tag===to)return true;
    if(visited.has(tag))continue;
    visited.add(tag);
    pending.push(...nodes[tag].uses);
   }
   return false;
  };
  for(const [tag,entry] of entries){
   for(const {tag:used} of entry.dependencies){
    if(!nodes[tag].uses.includes(used)&&!reaches(used,tag))nodes[tag].uses.push(used);
   }
  }
  // An empty audited section passage can stand in for statements inside it.
  // Draw that section as a frame and link directly to what the audit selected.
  const emptyTextHash=createHash('sha256').digest('hex');
  const relays=new Map(entries.filter(([tag,entry])=>tag!==tree.rootTag&&tag===entry.section&&
   entry.text_sha256===emptyTextHash&&nodes[tag].uses.some(used=>tree.audit.passages[used].section===tag))
   .map(([tag])=>[tag,nodes[tag].uses]));
  const expand=tag=>relays.has(tag)?relays.get(tag).flatMap(expand):[tag];
  for(const [tag,node] of Object.entries(nodes)){
   node.frameOnly=relays.has(tag);
   node.uses=node.frameOnly?[]:[...new Set(node.uses.flatMap(expand))];
  }
  return {...tree,nodes,locations};
 };
 for(const {slug,html,tree} of readerPages){
  const inset=tree?`<dialog id="dependency-dialog" class="dependency-dialog" aria-labelledby="dependency-dialog-title">
   <header><h2 id="dependency-dialog-title">Dependency graph</h2><form method="dialog"><button type="submit" autofocus>Close</button></form></header>
   <p class="graph-hint">Drag to explore, or select Fit graph to see the whole diagram.</p>
   ${graphHTML(readingSlugs.has(slug)&&!tree.lean?auditedGraph(tree):tree,'inset-','../',slug)}
  </dialog>${graphScript('../')}`:'';
  const dir=path.join(dist,slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),html+inset+(readingSlugs.has(slug)?`<script type="module" src="../math-lazy.js?v=${assetVersion}"></script>`:'')+'</body></html>');
 }
 for(const graph of graphs.filter(graph=>graph.reading!==coreReading)){
  const reading=graph.reading,description=reading.graphDescription||reading.deck;
  const title=`Dependency graph for ${reading.readingTitle}`;
  const page=head(title,'../../',description)+header('../../')+
   `<main id="main" class="prose-page"><p class="eyebrow">Selected reading</p><h1 id="dependency-tree">Dependency graph</h1><p class="lead">${esc(description)}</p><p>Arrows point from prerequisites to the results that use them. Select a numbered node to open its passage, or drag a node to rearrange the graph.</p><p><a href="../../${reading.slug}/">← ${esc(reading.readingTitle)}</a> · <a href="../../${coreHref}">Prerequisite · ${esc(coreReading.readingTitle)}</a></p>${graphHTML(graph)}</main>`+graphScript()+footer('../../')+'</body></html>';
  const dir=path.join(dist,graph.url);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),page);
 }
 const referenceStats=stats.filter(entry=>!entry.slug.startsWith('core-'));
 const totalProofs=referenceStats.reduce((a,s)=>a+s.proofs,0),totalStatements=referenceStats.reduce((a,s)=>a+s.statements,0);
 const coreAudit=audit.readings[coreReading.slug],requiredTags=new Set(coreAudit.required_tags);
 const additional=new Map(coreAudit.excluded_references.filter(edge=>!requiredTags.has(edge.to_tag))
  .map(edge=>[edge.to_tag,{tag:edge.to_tag,reason:edge.reason}]));
 const index=head(coreReading.readingTitle,'../../','Original Stacks sections from schemes and Proj to projective varieties.')+header('../../')+`<main id="main" class="path-page home"><section class="path-intro"><p class="eyebrow">Original texts · Companion examples</p><h1>${esc(coreReading.readingTitle)}</h1><p class="lead">Follow schemes, Proj, and projective space to the definition of a projective variety.</p><div class="reading-meta"><span>${coreSections.length} sections on the path</span><span>${pathUnits.length} original chapters</span></div><a class="text-link" href="../../${coreHref}">Read the complete path ↗</a><p><a href="#dependency-tree">Dependency graph</a> · <a href="#path-chapters">Browse by chapter</a> · <a href="../../${coreHref}#01IJ">Definition 26.9.1</a> · <a href="../../${coreHref}#${coreReading.target}">${esc(coreReading.targetLabel)}</a></p></section><section id="dependency-tree" class="path-scope"><h2>Dependency graph</h2><p>Arrows point from prerequisites to the results that use them. Select a numbered node to open its passage, or drag a node to rearrange the graph.</p>${graphHTML(schemeTree)}</section><section class="reading-library" id="path-chapters"><div class="section-line"><h2>Selected chapters</h2><span>Complete source sections</span></div>${unitList('../../',pathUnits,u=>`../../${coreHref}#${u.sections[0].tag}`)}</section><details id="scope" class="path-scope collection-scope"><summary>Scope, prerequisites, and source selection</summary><p>The path assumes sets and basic undergraduate algebra. It reaches schemes and the construction of Proj, then projective space and projective varieties in Definition 33.26.1(2). The target is the projective-variety clause: the definitions of other types of varieties remain as context and do not generate prerequisites. The route includes integral schemes, finite type and separated morphisms, and the projective-morphism characterization used in that clause. The source sections are printed in full, including any further results they contain.</p><p>Sections are selected by the Axiom and Mathlib declaration trace mapped to the corresponding Stacks passages. The ${coreSections.length} sections appear in their original order.</p><p>Cross-references to other results lead to the reference collection or to Stacks. The original titles, numbering, text, proofs, and source links are retained. Proofs start collapsed.</p><p>The side column is Math Expo commentary. Examples range from elementary algebra and finite spaces to holomorphic functions and germs.</p><details class="reference-audit"><summary>Additional references and why they remain source links (${additional.size})</summary><ul>${[...additional.values()].map(r=>`<li><a href="https://stacks.math.columbia.edu/tag/${r.tag}" target="_blank" rel="noopener">Stacks ${r.tag}</a> — ${esc(r.reason)}</li>`).join('')}</ul></details></details><section class="path-scope"><h2>Source and attribution</h2><p>Mathematical text by The Stacks Project Authors. Separate commentary and reader presentation by Math Expo. Source revision <a href="${repository}/tree/${manifest.commit}"><code>${manifest.commit.slice(0,12)}</code></a>.</p><p><a href="../../about/">Attribution, license, and modification history</a> · <a href="../../source/readings.json">Reading selections</a> · <a href="../../source/dependency-audit.json">Prerequisite audit and paths from the target</a></p><details class="source-inventory"><summary>Selected source sections</summary>${pathUnits.map(u=>`<h3>${u.number}. ${esc(u.title)}</h3><ul class="source-section-list">${u.sections.map(section=>`<li><a href="../../${coreHref}#${section.tag}">${section.number}. ${esc(section.title)}</a></li>`).join('')}</ul>`).join('')}</details><details id="references" class="source-inventory"><summary>Full reference collection (${allSections.length} sections)</summary><p>The full chapter selections include supporting proofs, examples, and later results.</p>${unitList('../../',manifest.units)}</details></section></main>`+graphScript()+footer('../../')+'</body></html>';
 const schemeTreeDir=path.join(dist,schemeTree.url);
 fs.mkdirSync(schemeTreeDir,{recursive:true});
 fs.writeFileSync(path.join(schemeTreeDir,'index.html'),index);
 const pathRedirect=head('Stacks Reader','../','This page has moved.')+
  `<main id="main" class="prose-page"><a href="../">Continue to the Stacks Reader</a></main><script>location.replace('../');</script></body></html>`;
 const legacyPath=path.join(dist,'path');
 fs.mkdirSync(legacyPath,{recursive:true});
 fs.writeFileSync(path.join(legacyPath,'index.html'),pathRedirect);
 return {sections:allSections.length,proofs:totalProofs,statements:totalStatements,chapterStats:referenceStats,coreSections:coreSections.length,coreChapters:pathUnits.length,coreHref,readings,catalog};
}
