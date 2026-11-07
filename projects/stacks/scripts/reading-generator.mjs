import fs from 'node:fs';
import path from 'node:path';
import {createRenderer,escapeHTML as esc} from '../src/latex.mjs';
import {separateSourceNotes,renderProofs,sourceRecord,sourcePanel,sourceDataScript} from '../src/source-column.mjs';
import {notesFor} from '../src/scheme-notes.mjs';
import {loadReadingCatalog,loadReadings,loadReferenceReadings} from '../src/readings.mjs';
import {renderDependencyGraph} from '../src/dependency-graph.mjs';
import {renderOutline} from '../src/reading-outline.mjs';
export function buildReadings({root,dist,head,header,footer,renderExampleCard,assetVersion}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
 const catalog=loadReadingCatalog(root);
 const readings=loadReadings(root,catalog);
 const referenceReadings=loadReferenceReadings(root,catalog);
 const coreReading=readings.find(reading=>reading.role==='foundation');
 if(!coreReading)throw Error('Missing foundation reading');
 const graphs=readings.filter(reading=>reading.graph).map(reading=>({
  nodes:JSON.parse(fs.readFileSync(path.join(root,'src',reading.graph+'-dependencies.json'),'utf8')),
  rootTag:reading.target,url:`dependencies/${reading.slug}/`,reading,locations:new Map()
 }));
 const graphsBySlug=new Map(graphs.map(graph=>[graph.reading.slug,graph]));
 const schemeTree=graphsBySlug.get(coreReading.slug);
 const readingSlugs=new Set(readings.map(reading=>reading.slug));
 const locations=new Map(readings.map(reading=>[reading.slug,new Map()]));
 const dependencyNumber=(graph,tag,number,label)=>
  `<a class="dependency-number" data-dependency-tag="${esc(tag)}" aria-haspopup="dialog" href="../../${graph.url}#${esc(tag)}" aria-label="${esc(label)} dependencies">${esc(number)}</a>`;
 const references=catalog.references;
 const referencesByTag=new Map(Object.values(references).map(ref=>[ref.tag,ref]));
 const allSections=manifest.units.flatMap(u=>u.sections),stats=[],readerPages=[];
 const repository='https://github.com/stacks/stacks-project';
 const coreReasons=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-core.json'),'utf8'));
 const coreSections=coreReading.sections;
 const coreTags=new Set(coreSections.map(section=>section.tag));
 const coreUnits=manifest.units.flatMap(unit=>{
  const sections=unit.sections.filter(section=>coreTags.has(section.tag));
  return sections.length?[{...unit,slug:`core-${unit.slug}`,sections,core:true}]:[];
 });
 const coreHref=`read/${coreReading.slug}/`;
 const routesFor=reading=>Object.fromEntries(reading.sections.flatMap(section=>{
  const tex=fs.readFileSync(path.join(root,'upstream/sections',`${section.slug}.tex`),'utf8');
  return [...tex.matchAll(/\\label\{([^}]+)\}/g)].map(match=>[`${section.chapter}-${match[1]}`,reading.slug]);
 }));
 const routesByReading=new Map(readings.map(reading=>[reading.slug,routesFor(reading)]));
 const unitList=(base,units,href=u=>`${base}read/${u.slug}/`)=>units.map(u=>`<a class="reading-entry" href="${href(u)}"><span class="reading-number">${u.number}</span><div><p class="eyebrow">The Stacks Project · Chapter ${u.number}</p><h3>${esc(u.title)}</h3><div class="reading-meta"><span>${u.sections.length} complete sections</span><span>§${u.sections.map(s=>s.number).join(', ')}</span></div></div><span class="entry-arrow" aria-hidden="true">↗</span></a>`).join('');
 for(const unit of [...manifest.units,...coreUnits,...readings,...referenceReadings]){
  const tree=graphsBySlug.get(unit.slug)||(unit.core?schemeTree:null);
  const prerequisiteRoutes=Object.assign({},...(unit.core&&!unit.readingTitle
   ?[coreReading.slug]:unit.prerequisiteSlugs||[]).map(slug=>routesByReading.get(slug)));
  const locate=(tag,section)=>{
   if(readingSlugs.has(unit.slug)&&graphs.some(graph=>graph.nodes[tag]))locations.get(unit.slug).set(tag,{slug:unit.slug,readingTitle:unit.readingTitle,section});
  };
  const sectionHeading=unit.chapterHeadings?'h3':'h2';
  const statementHeading=unit.chapterHeadings?'h4':'h3';
  const r=createRenderer(root,{sections:unit.sections,routes:prerequisiteRoutes}),data={},sources={};let proofs=0,statements=0;
  const rich=s=>s.replace(/\\\[([\s\S]*?)\\\]/g,(_,t)=>r.math(t,true)).replace(/\\\(([\s\S]*?)\\\)/g,(_,t)=>r.math(t));
  const sections=unit.sections.map((s,index)=>{
   const blocks=r.section(s),sourceNotes=[];
   locate(s.tag,s);
   const content=blocks.map((b,bi)=>{
    const notes=notesFor(s.tag,b.tag),key=notes.tag;
    if(!data[key]){
     const html=notes.examples.map((item,index)=>
      renderExampleCard(item,index?key+'-extra-'+index:key,notes.examples.length===1,false,r)
     ).join('');
     data[key]={html};
    }
    const label=b.kind==='prose'?`§${s.number} · ${s.title}`:`${b.kind[0].toUpperCase()+b.kind.slice(1)} ${b.number}`;
    const id=b.tag||s.slug+'-'+bi;
    let html=`<div class="source-body">${separateSourceNotes(b.html,sourceNotes)}</div>`;
    if(b.kind!=='prose'){
     locate(b.tag,s);
     let heading=esc(label);
     if(tree?.nodes[b.tag]){
      const kind=b.kind[0].toUpperCase()+b.kind.slice(1);
      heading=`${esc(kind)} ${dependencyNumber(tree,b.tag,b.number,label)}`;
     }
     statements++;html=`<div class="statement-heading"><${statementHeading}>${heading}${b.title?' · '+rich(b.title):''}</${statementHeading}></div>`+html;
    }
    proofs+=b.proofs?.length||0;
    html+=renderProofs(b.proofs,{id,key,tag:b.tag||s.tag,label:label,notes:sourceNotes,renderer:r});
    return `<section id="${id}" class="passage ${b.kind}" data-example="${key}" data-source-label="${esc(label)}" data-source-tag="${b.tag||s.tag}" aria-label="${esc(label)}">${html}</section>`;
   }).join('');
   sources[s.tag]=sourceRecord(root,s,manifest,sourceNotes);
   const chapterHeading=unit.chapterHeadings
    ?s.stage?`<h2 class="source-chapter-title">${esc(s.stage)}</h2>`:''
    :s.chapterTitle&&index>0&&s.chapter!==unit.sections[index-1].chapter?`<p class="eyebrow">${esc(s.chapterTitle)}</p>`:'';
   const number=unit.highlightSections&&tree?.nodes[s.tag]
    ?dependencyNumber(tree,s.tag,s.number,`Section ${s.number}`):s.number;
   return `<section class="source-section" id="${s.tag}" data-source-sha256="${s.sha256}"><header class="source-section-header">${chapterHeading}<${sectionHeading}>${number}. ${esc(s.title)}</${sectionHeading}></header>${content}</section>`;
  }).join('');
  if(!unit.readingTitle)stats.push({slug:unit.slug,sections:unit.sections.length,proofs,statements,formulas:r.mathCount});
  const first=Object.keys(data)[0],firstSource=unit.sections[0];
  const toc=renderOutline(unit.sections);
  const chapterNav=(unit.core?coreUnits:manifest.units).map(u=>`<a href="../${u.slug}/" ${u.slug===unit.slug?'aria-current="page"':''}>${u.number}. ${esc(u.title)}</a>`).join('');
  const outlineLink=unit.readingTitle?'<a class="back-link" href="../../#readings-title">← Selected readings</a>':`<a class="back-link" href="../../${schemeTree.url}">← Sections for defining schemes</a>`;
  const outlineType=unit.readingTitle?'Selected reading':`Chapter ${unit.number} · ${unit.core?'Definition path':'Reference collection'}`;
  const description=unit.deck|| (unit.core?'Sections on the path to the definition of schemes.':'Complete original sections from the reference collection.');
  const targetLinks=unit.target
   ?`<p class="dependency-guide"><a href="#${unit.target}">${esc(unit.targetLabel)}</a>${(unit.prerequisites||[]).map(slug=>{
    const prerequisite=readings.find(reading=>reading.slug===slug);
    return `<br><a href="../${prerequisite.slug}/">Prerequisite · ${esc(prerequisite.readingTitle)}</a>`;
   }).join('')}</p>`:'';
  const dependencyLink=tree?`<p class="dependency-guide"><a href="../../${tree.url}#dependency-tree">Dependency graph</a><br>Select a yellow number to open the graph here.</p>`:'';
  const html=head(unit.readingTitle||unit.title,'../../',unit.chapterHeadings?description:`The Stacks Project, Chapter ${unit.number}: ${unit.title}. ${description}`)+header('../../',true)+`<div class="reading-progress" aria-hidden="true"><span></span></div><div class="reader-layout"><nav class="reading-outline" id="reading-outline" aria-label="Reading contents">${outlineLink}<p class="eyebrow">${outlineType}</p><div class="margin-reading-controls"><button id="toggle-proofs" type="button" aria-pressed="false">Show all proofs</button><button class="mobile-example" type="button" data-show-example>Example ↗</button></div>${targetLinks}${dependencyLink}${toc}${unit.readingTitle?'':`<details class="chapter-navigation"><summary>Other chapters</summary>${chapterNav}</details>`}${unit.core&&!unit.readingTitle?`<a href="../${unit.sections[0].chapter}/">Full chapter selection ↗</a>`: ''}<div class="outline-note"><span class="eyebrow">Separate commentary</span><p>Concrete examples</p><button type="button" class="mobile-example" data-show-example>Open example</button></div></nav><main id="main" class="reader-main verbatim-main"><header class="reading-title"><h1>${esc(unit.chapterHeadings?unit.readingTitle:unit.title)}</h1></header>${sections}</main><aside id="example-dock" class="example-dock" aria-label="Examples and analogies" tabindex="-1"><div class="example-sticky"><div class="example-header"><button id="close-example" type="button" aria-label="Close example">×</button></div>${sourcePanel(sources[firstSource.tag])}<div class="example-current"><div class="example-step"><a id="example-stage-label" href="#${firstSource.tag}">§${firstSource.number} · ${esc(firstSource.title)}</a><span id="example-index"${data[first].html?'':' hidden'}>01</span></div><div id="example-content">${data[first].html}</div><div class="example-paging"${data[first].html?'':' hidden'}><button id="previous-example" type="button" aria-label="Previous example explanation">← Previous</button><button id="follow-reading" type="button" aria-pressed="true">Follow reading</button><button id="next-example" type="button" aria-label="Next example explanation">Next →</button></div></div></div></aside></div><script type="application/json" id="example-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`+sourceDataScript(sources)+footer('../../');
  readerPages.push({slug:unit.slug,html,tree});

 }
 for(const graph of graphs){
  for(const tag of Object.keys(graph.nodes)){
   const order=[graph.reading.slug,...(graph.reading.prerequisiteSlugs||[])];
   const location=order.map(slug=>locations.get(slug).get(tag)).find(Boolean);
   if(!location)throw Error('Missing selected prerequisite '+tag+' for '+graph.url);
   if(location)graph.locations.set(tag,location);
  }
 }
 const graphScript=`<script defer src="../../dependency-graph.js?v=${assetVersion}"></script>`;
 const graphHTML=(tree,prefix)=>renderDependencyGraph(tree,referencesByTag,'../../',prefix);
 for(const {slug,html,tree} of readerPages){
  const inset=tree?`<dialog class="dependency-dialog" aria-labelledby="dependency-dialog-title">
   <header><h2 id="dependency-dialog-title">Dependency graph</h2><form method="dialog"><button type="submit" autofocus>Close</button></form></header>
   <p class="graph-hint">Drag the background to pan. Zoom out to see more, or select a tag to jump to its passage.</p>
   ${graphHTML(tree,'inset-')}
  </dialog>${graphScript}`:'';
  const dir=path.join(dist,'read',slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),html+inset+'</body></html>');
 }
 for(const graph of graphs.filter(graph=>graph.reading!==coreReading)){
  const reading=graph.reading,description=reading.graphDescription||reading.deck;
  const title=`Dependency graph for ${reading.readingTitle}`;
  const page=head(title,'../../',description)+header('../../')+
   `<main id="main" class="prose-page"><p class="eyebrow">Selected reading</p><h1 id="dependency-tree">Dependency graph</h1><p class="lead">${esc(description)}</p><p>Arrows point from prerequisites to the results that use them. Select a tag to open its passage, or drag a node to rearrange the graph.</p><p><a href="../../read/${reading.slug}/">← ${esc(reading.readingTitle)}</a> · <a href="../../${coreHref}">Prerequisite · Path to schemes</a></p>${graphHTML(graph)}</main>`+graphScript+footer('../../')+'</body></html>';
  const dir=path.join(dist,graph.url);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),page);
 }
 for(const directory of ['read','dependencies']){
  const legacyDir=path.join(dist,directory,'twists-and-genus');
  const reading=readings.find(reading=>reading.target==='0BYD');
  const destination=`../${reading.slug}/`;
  const label=directory==='read'?reading.readingTitle:'Dependency graph for the plane-curve genus formula';
  const html=head(label,'../../','This page has moved.')+
   `<main id="main" class="prose-page"><a href="${destination}">${esc(label)}</a></main><script>location.replace(${JSON.stringify(destination)}+location.search+location.hash);</script></body></html>`;
  fs.mkdirSync(legacyDir,{recursive:true});
  fs.writeFileSync(path.join(legacyDir,'index.html'),html);
 }

 const referenceStats=stats.filter(entry=>!entry.slug.startsWith('core-'));
 const totalProofs=referenceStats.reduce((a,s)=>a+s.proofs,0),totalStatements=referenceStats.reduce((a,s)=>a+s.statements,0);
 const additional=new Map(manifest.source_reference_audit.flatMap(s=>s.references.filter(r=>!r.included).map(r=>[r.label,r])));
 const index=head('The Stacks Project — Sections for defining schemes','../../','A path through the original Stacks definitions and construction of schemes.')+header('../../')+`<main id="main" class="path-page home"><section class="path-intro"><p class="eyebrow">Original texts · Companion examples</p><h1>The Stacks Project</h1><p class="lead">Follow the definitions and construction leading to schemes, with examples in the margin.</p><div class="reading-meta"><span>${coreSections.length} sections on the path</span><span>${coreUnits.length} original chapters</span></div><a class="text-link" href="../../${coreHref}">Read the complete path ↗</a><p><a href="#dependency-tree">Dependency graph</a> · <a href="#path-chapters">Browse by chapter</a> · <a href="../../${coreHref}#01IJ">Definition 26.9.1</a></p></section><section id="dependency-tree" class="path-scope"><h2>Dependency graph</h2><p>Arrows point from prerequisites to the results that use them. Select a tag to open its passage, or drag a node to rearrange the graph.</p>${graphHTML(schemeTree)}</section><section class="reading-library" id="path-chapters"><div class="section-line"><h2>Path to the definition</h2><span>Complete source sections</span></div>${unitList('../../',coreUnits,u=>`../../${coreHref}#${u.sections[0].tag}`)}</section><details id="scope" class="path-scope collection-scope"><summary>Scope, prerequisites, and source selection</summary><p>The path assumes sets and basic undergraduate algebra. It follows the definitions and the construction of the structure sheaf in Stacks §26.5 through to Definition 26.9.1. Each section has a role in that route. The source sections are printed in full, including any further results they contain.</p><p>The construction uses quasi-compactness of standard opens. This follows from the localization description of standard opens and quasi-compactness of spectra, both in §10.17. The citation in §26.5 to the more general result in §10.29 stays available in the reference collection.</p><p>Cross-references to other results lead to the reference collection or to Stacks. The original titles, numbering, text, proofs, and source links are retained. Proofs start collapsed.</p><p>The side column is Math Expo commentary. Examples range from elementary algebra and finite spaces to holomorphic functions and germs.</p><details class="reference-audit"><summary>Additional references and why they remain source links (${additional.size})</summary><ul>${[...additional.values()].map(r=>`<li><a href="https://stacks.math.columbia.edu/tag/${r.tag}" target="_blank" rel="noopener">Stacks ${r.tag}</a> — ${esc(r.reason)}</li>`).join('')}</ul></details></details><section class="path-scope"><h2>Source and attribution</h2><p>Mathematical text by The Stacks Project Authors. Separate commentary and reader presentation by Math Expo. Source revision <a href="${repository}/tree/${manifest.commit}"><code>${manifest.commit.slice(0,12)}</code></a>.</p><p><a href="../../about/">Attribution, license, and modification history</a> · <a href="../../source/scheme-path.json">Selection, source hashes, and reference audit</a></p><details class="source-inventory"><summary>Why each section is on the path</summary>${coreUnits.map(u=>`<h3>${u.number}. ${esc(u.title)}</h3><ul class="source-section-list">${u.sections.map(section=>`<li><a href="../../${coreHref}#${section.tag}">${section.number}. ${esc(section.title)}</a><br>${esc(coreReasons[section.number])}</li>`).join('')}</ul>`).join('')}</details><details id="references" class="source-inventory"><summary>Full reference collection (${allSections.length} sections)</summary><p>The full chapter selections include supporting proofs, examples, and later results.</p>${unitList('../../',manifest.units)}</details></section></main>`+graphScript+footer('../../')+'</body></html>';
 const schemeTreeDir=path.join(dist,schemeTree.url);
 fs.mkdirSync(schemeTreeDir,{recursive:true});
 fs.writeFileSync(path.join(schemeTreeDir,'index.html'),index);
 const pathRedirect=head('Stacks Reader','../','This page has moved.')+
  `<main id="main" class="prose-page"><a href="../">Continue to the Stacks Reader</a></main><script>location.replace('../');</script></body></html>`;
 const legacyPath=path.join(dist,'path');
 fs.mkdirSync(legacyPath,{recursive:true});
 fs.writeFileSync(path.join(legacyPath,'index.html'),pathRedirect);
 for(const [slug,legacy] of Object.entries(manifest.legacy_routes)){
  const href=`../${legacy.default_route}/#${legacy.default_tag}`;
  const html=head('Original chapter and section titles','../../','This reading now uses the original Stacks chapter organization.')+`<main id="main" class="prose-page"><p>This reading now uses the original Stacks chapter titles.</p><a href="${href}">Continue to the original chapter and section</a></main><script>const route=${JSON.stringify(legacy)};const hash=location.hash.slice(1);const tag=hash.replace(/^proof-/,'');location.replace('../'+(route.anchors[tag]||route.default_route)+'/'+(hash?'#'+hash:'#'+route.default_tag));</script></body></html>`;
  fs.mkdirSync(path.join(dist,'read',slug),{recursive:true});fs.writeFileSync(path.join(dist,'read',slug,'index.html'),html);
 }
 return {sections:allSections.length,proofs:totalProofs,statements:totalStatements,chapterStats:referenceStats,coreSections:coreSections.length,coreChapters:coreUnits.length,coreHref,readings};
}
