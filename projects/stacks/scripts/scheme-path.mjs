import fs from 'node:fs';
import path from 'node:path';
import {createRenderer,escapeHTML as esc} from '../src/latex.mjs';
import {separateSourceNotes,renderProofs,sourceRecord,sourcePanel,sourceDataScript} from '../src/source-column.mjs';
import {extraExamples,passageNote} from '../src/scheme-notes.mjs';
import {renderOutline} from '../src/reading-outline.mjs';
export function buildSchemePath({root,dist,head,header,footer,matchingHTML}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
 const selectedReadings=JSON.parse(fs.readFileSync(path.join(root,'upstream/selected-readings.json'),'utf8'));
 const theoremReading=selectedReadings.find(unit=>unit.target);
 const dependencyTree=(name,rootTag,url)=>({
  nodes:JSON.parse(fs.readFileSync(path.join(root,'src',name+'-dependencies.json'),'utf8')),
  rootTag,url,locations:new Map()
 });
 const genusTree=dependencyTree('genus',theoremReading.target,`dependencies/${theoremReading.slug}/`);
 const schemeTree=dependencyTree('scheme','01IJ','path/');
 const references=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
 const referencesByTag=new Map(Object.values(references).map(ref=>[ref.tag,ref]));
 const allSections=manifest.units.flatMap(u=>u.sections),stats=[];
 const repository='https://github.com/stacks/stacks-project';
 const coreReasons=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-core.json'),'utf8'));
 const coreSections=allSections.filter(section=>Object.hasOwn(coreReasons,section.number));
 if(coreSections.length!==Object.keys(coreReasons).length)throw Error('Unknown section in the scheme definition path');
 const coreUnits=manifest.units.flatMap(unit=>{
  const sections=coreSections.filter(section=>section.chapter===unit.slug);
  return sections.length?[{...unit,slug:`core-${unit.slug}`,sections,core:true}]:[];
 });
 const coreRoutes={};
 for(const unit of coreUnits){
  for(const section of unit.sections){
   const tex=fs.readFileSync(path.join(root,'upstream/sections',`${section.slug}.tex`),'utf8');
   for(const match of tex.matchAll(/\\label\{([^}]+)\}/g))coreRoutes[`${section.chapter}-${match[1]}`]=unit.slug;
  }
 }
 const unitList=(base,units)=>units.map(u=>`<a class="reading-entry" href="${base}read/${u.slug}/"><span class="reading-number">${u.number}</span><div><p class="eyebrow">The Stacks Project · Chapter ${u.number}</p><h3>${esc(u.title)}</h3><div class="reading-meta"><span>${u.sections.length} complete sections</span><span>§${u.sections.map(s=>s.number).join(', ')}</span></div></div><span class="entry-arrow" aria-hidden="true">↗</span></a>`).join('');
 for(const unit of [...manifest.units,...coreUnits,...selectedReadings]){
  const tree=unit.core?schemeTree:unit.target?genusTree:null;
  const r=createRenderer(root,{sections:unit.sections,routes:tree?coreRoutes:undefined}),data={},sources={};let proofs=0,statements=0;
  const outlineStatements=new Map();
  const rich=s=>s.replace(/\\\[([\s\S]*?)\\\]/g,(_,t)=>r.math(t,true)).replace(/\\\(([\s\S]*?)\\\)/g,(_,t)=>r.math(t));
  const sections=unit.sections.map((s,index)=>{
   const blocks=r.section(s),sourceNotes=[];
   const entries=[];
   outlineStatements.set(s.tag,entries);
   if(tree?.nodes[s.tag])tree.locations.set(s.tag,{slug:unit.slug,section:s});
   const content=blocks.map((b,bi)=>{
    const note=passageNote(s,b),key=note.scope==='statement'?s.slug+'-'+b.label:s.slug;
    if(!data[key]){
     const examples=[note,...(note.examples??extraExamples(s))];
     const extraPrefix=note.examples?key:s.slug;
     const html=examples.map((item,i)=>{
      const cardKey=i===0?key:extraPrefix+'-extra-'+i;
      return `<details class="example-disclosure" data-example-card="${esc(cardKey)}"${examples.length===1?' open':''}><summary><span class="example-chevron" aria-hidden="true"></span>${esc(item.title)}</summary>${matchingHTML(item,false,r)}</details>`;
     }).join('');
     data[key]={html};
    }
    const label=b.kind==='prose'?`§${s.number} · ${s.title}`:`${b.kind[0].toUpperCase()+b.kind.slice(1)} ${b.number}`;
    const id=b.tag||s.slug+'-'+bi;
    let html=`<div class="source-body">${separateSourceNotes(b.html,sourceNotes)}</div>`;
    if(b.kind!=='prose'){
     if(b.tag)entries.push({tag:b.tag,label});
     let heading=esc(label);
     if(tree?.nodes[b.tag]){
      tree.locations.set(b.tag,{slug:unit.slug,section:s});
      const kind=b.kind[0].toUpperCase()+b.kind.slice(1);
      heading=`${esc(kind)} <a class="dependency-number" href="../../${tree.url}#${esc(b.tag)}" aria-label="${esc(label)} dependencies">${esc(b.number)}</a>`;
     }
     statements++;html=`<div class="statement-heading"><h3>${heading}${b.title?' · '+rich(b.title):''}</h3></div>`+html;
    }
    proofs+=b.proofs?.length||0;
    html+=renderProofs(b.proofs,{id,key,tag:b.tag||s.tag,label:label,notes:sourceNotes,renderer:r});
    return `<section id="${id}" class="passage ${b.kind}" data-example="${key}" data-source-label="${esc(label)}" data-source-tag="${b.tag||s.tag}" aria-label="${esc(label)}">${html}</section>`;
   }).join('');
   sources[s.tag]=sourceRecord(root,s,manifest,sourceNotes);
   const chapterHeading=s.chapterTitle&&index>0&&s.chapter!==unit.sections[index-1].chapter
    ?`<p class="eyebrow">${esc(s.chapterTitle)}</p>`:'';
   return `<section class="source-section" id="${s.tag}" data-source-sha256="${s.sha256}"><header class="source-section-header">${chapterHeading}<h2>${s.number}. ${esc(s.title)}</h2></header>${content}</section>`;
  }).join('');
  if(!unit.readingTitle)stats.push({slug:unit.slug,sections:unit.sections.length,proofs,statements,formulas:r.mathCount});
  const first=Object.keys(data)[0],firstSource=unit.sections[0];
  const toc=renderOutline(unit.sections,outlineStatements);
  const chapterNav=(unit.core?coreUnits:manifest.units).map(u=>`<a href="../${u.slug}/" ${u.slug===unit.slug?'aria-current="page"':''}>${u.number}. ${esc(u.title)}</a>`).join('');
  const outlineLink=unit.readingTitle?'<a class="back-link" href="../../#readings-title">← Selected readings</a>':'<a class="back-link" href="../../path/">← Sections for defining schemes</a>';
  const outlineType=unit.readingTitle?'Selected reading':`Chapter ${unit.number} · ${unit.core?'Definition path':'Reference collection'}`;
  const description=unit.deck|| (unit.core?'Sections on the path to the definition of schemes.':'Complete original sections from the reference collection.');
  const theoremLinks=unit.target?`<p class="dependency-guide"><a href="#${unit.target}">Genus formula · Lemma ${referencesByTag.get(unit.target).number}</a><br><a href="../../path/">Prerequisite · Path to schemes</a></p>`:'';
  const dependencyLink=tree?`<p class="dependency-guide"><a href="../../${tree.url}#dependency-tree">Dependency tree</a><br>Yellow numbers lead to their place in the tree.</p>`:'';
  const html=head(unit.readingTitle||unit.title,'../../',`The Stacks Project, Chapter ${unit.number}: ${unit.title}. ${description}`)+header('../../',true)+`<div class="reading-progress" aria-hidden="true"><span></span></div><div class="reader-layout"><nav class="reading-outline" id="reading-outline" aria-label="Reading contents">${outlineLink}<p class="eyebrow">${outlineType}</p><div class="margin-reading-controls"><button id="toggle-proofs" type="button" aria-pressed="false">Show all proofs</button><button class="mobile-example" type="button" data-show-example>Example ↗</button></div>${theoremLinks}${dependencyLink}${toc}${unit.readingTitle?'':`<details class="chapter-navigation"><summary>Other chapters</summary>${chapterNav}</details>`}${unit.core?`<a href="../${unit.sections[0].chapter}/">Full chapter selection ↗</a>`: ''}<div class="outline-note"><span class="eyebrow">Separate commentary</span><p>Concrete examples</p><button type="button" class="mobile-example" data-show-example>Open example</button></div></nav><main id="main" class="reader-main verbatim-main"><header class="reading-title"><h1>${esc(unit.title)}</h1></header>${sections}</main><aside id="example-dock" class="example-dock" aria-label="Separate commentary with examples" tabindex="-1"><div class="example-sticky"><div class="example-header"><p class="eyebrow">Examples · Commentary</p><button id="close-example" type="button" aria-label="Close example">×</button></div><h2>Motivating examples</h2><p class="matching-guide">See what problem the current concept helps solve. Select a title to expand or collapse the example.</p>${sourcePanel(sources[firstSource.tag])}<div class="example-current"><div class="example-step"><a id="example-stage-label" href="#${firstSource.tag}">§${firstSource.number} · ${esc(firstSource.title)}</a><span id="example-index">01</span></div><div id="example-content">${data[first].html}</div><div class="example-paging"><button id="previous-example" type="button" aria-label="Previous example explanation">← Previous</button><button id="follow-reading" type="button" aria-pressed="true">Follow reading</button><button id="next-example" type="button" aria-label="Next example explanation">Next →</button></div></div></div></aside></div><script type="application/json" id="example-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`+sourceDataScript(sources)+footer('../../')+'</body></html>';
  fs.mkdirSync(path.join(dist,'read',unit.slug),{recursive:true});fs.writeFileSync(path.join(dist,'read',unit.slug,'index.html'),html);

 }
 const renderTree=(tree,base)=>{
  const visited=new Set(), ancestors=new Set();
  const renderNode=tag=>{
   const node=tree.nodes[tag], ref=referencesByTag.get(tag)||node;
   if(!node||!ref?.number)throw Error('Missing dependency metadata for '+tag);
   if(ancestors.has(tag))throw Error('Cyclic reading dependency at '+tag);
   const label=ref.kind[0].toUpperCase()+ref.kind.slice(1)+' '+ref.number;
   const title=`${esc(label)} · ${esc(node.title)}`;
   const location=tree.locations.get(tag);
   const route=location?`${base}read/${location.slug}/`:null;
   const href=route?`${route}#${tag}`:`https://stacks.math.columbia.edu/tag/${tag}`;
   const section=location?.section;
   const sectionLink=section&&section.tag!==tag
    ?` <span class="dependency-section"><a href="${route}#${section.tag}" aria-label="Go to section ${esc(section.number+' '+section.title)}">§${esc(section.number)}</a></span>`:'';
   const highlight=route&&ref.kind!=='section'?' dependency-number':'';
   const entry=`<a class="dependency-node${highlight}" href="${href}">${title}</a>${sectionLink}`;
   if(visited.has(tag))return `<li>${entry} <span class="dependency-section"><a class="dependency-repeat" href="#${esc(tag)}">See branch</a></span></li>`;
   visited.add(tag);
   ancestors.add(tag);
   const children=node.uses?.map(renderNode).join('')||'';
   ancestors.delete(tag);
   return `<li id="${esc(tag)}">${entry}${children?'<ul>'+children+'</ul>':''}</li>`;
  };
  const html=renderNode(tree.rootTag);
  if(visited.size!==Object.keys(tree.nodes).length)throw Error('Disconnected reading dependency in '+tree.url);
  return `<ul class="dependency-tree">${html}</ul>`;
 };
 for(const [tag,location] of schemeTree.locations){
  if(genusTree.nodes[tag]&&!genusTree.locations.has(tag))genusTree.locations.set(tag,location);
 }
 for(const tag of Object.keys(genusTree.nodes)){
  if(!genusTree.locations.has(tag))throw Error('Missing selected prerequisite '+tag);
 }
 const genusPage=head('Dependency tree for the plane-curve genus formula','../../','Selected prerequisites for the plane-curve genus formula.')+header('../../')+
  `<main id="main" class="prose-page"><p class="eyebrow">Selected reading</p><h1 id="dependency-tree">Dependency tree</h1><p class="lead">Follow the branches from the genus formula to the definitions and lemmas it uses.</p><p>Yellow entries open the statement in the reading. Section numbers open the start of the section. Shared entries link to their first appearance through “See branch.”</p><p><a href="../../read/${theoremReading.slug}/">← ${esc(theoremReading.readingTitle)}</a> · <a href="../../path/">Prerequisite · Path to schemes</a></p>${renderTree(genusTree,'../../')}</main>`+footer('../../')+'</body></html>';
 const genusTreeDir=path.join(dist,genusTree.url);
 fs.mkdirSync(genusTreeDir,{recursive:true});
 fs.writeFileSync(path.join(genusTreeDir,'index.html'),genusPage);

 const referenceStats=stats.filter(entry=>!entry.slug.startsWith('core-'));
 const totalProofs=referenceStats.reduce((a,s)=>a+s.proofs,0),totalStatements=referenceStats.reduce((a,s)=>a+s.statements,0);
 const additional=new Map(manifest.source_reference_audit.flatMap(s=>s.references.filter(r=>!r.included).map(r=>[r.label,r])));
 const index=head('The Stacks Project — Sections for defining schemes','../','A path through the original Stacks definitions and construction of schemes.')+header('../')+`<main id="main" class="path-page home"><section class="path-intro"><p class="eyebrow">Original texts · Companion examples</p><h1>The Stacks Project</h1><p class="lead">Follow the definitions and construction leading to schemes, with examples in the margin.</p><div class="reading-meta"><span>${coreSections.length} sections on the path</span><span>${coreUnits.length} original chapters</span></div><a class="text-link" href="../read/core-schemes/#01IJ">Definition 26.9.1 · Schemes ↗</a><p><a href="#dependency-tree">Dependency tree</a> · <a href="#path-chapters">Browse by chapter</a></p></section><section id="dependency-tree" class="path-scope"><h2>Dependency tree</h2><p>Follow the branches from the definition of a scheme to the constructions it uses. Yellow numbers in the reading link back to this tree. Choose a statement to read it or a section number to start at the beginning of its section.</p>${renderTree(schemeTree,'../')}</section><section class="reading-library" id="path-chapters"><div class="section-line"><h2>Path to the definition</h2><span>Complete source sections</span></div>${unitList('../',coreUnits)}</section><details id="scope" class="path-scope collection-scope"><summary>Scope, prerequisites, and source selection</summary><p>The path assumes sets and basic undergraduate algebra. It follows the definitions and the construction of the structure sheaf in Stacks §26.5 through to Definition 26.9.1. Each section has a role in that route. The source sections are printed in full, including any further results they contain.</p><p>The construction uses quasi-compactness of standard opens. This follows from the localization description of standard opens and quasi-compactness of spectra, both in §10.17. The citation in §26.5 to the more general result in §10.29 stays available in the reference collection.</p><p>Cross-references to other results lead to the reference collection or to Stacks. The original titles, numbering, text, proofs, and source links are retained. Proofs start collapsed.</p><p>The side column is Math Expo commentary. Examples range from elementary algebra and finite spaces to holomorphic functions and germs.</p><details class="reference-audit"><summary>Additional references and why they remain source links (${additional.size})</summary><ul>${[...additional.values()].map(r=>`<li><a href="https://stacks.math.columbia.edu/tag/${r.tag}" target="_blank" rel="noopener">Stacks ${r.tag}</a> — ${esc(r.reason)}</li>`).join('')}</ul></details></details><section class="path-scope"><h2>Source and attribution</h2><p>Mathematical text by The Stacks Project Authors. Separate commentary and reader presentation by Math Expo. Source revision <a href="${repository}/tree/${manifest.commit}"><code>${manifest.commit.slice(0,12)}</code></a>.</p><p><a href="../about/">Attribution, license, and modification history</a> · <a href="../source/scheme-path.json">Selection, source hashes, and reference audit</a></p><details class="source-inventory"><summary>Why each section is on the path</summary>${coreUnits.map(u=>`<h3>${u.number}. ${esc(u.title)}</h3><ul class="source-section-list">${u.sections.map(section=>`<li><a href="../read/${u.slug}/#${section.tag}">${section.number}. ${esc(section.title)}</a><br>${esc(coreReasons[section.number])}</li>`).join('')}</ul>`).join('')}</details><details id="references" class="source-inventory"><summary>Full reference collection (${allSections.length} sections)</summary><p>The full chapter selections include supporting proofs, examples, and later results.</p>${unitList('../',manifest.units)}</details></section></main>`+footer('../')+'</body></html>';
 fs.mkdirSync(path.join(dist,'path'),{recursive:true});fs.writeFileSync(path.join(dist,'path/index.html'),index);
 for(const [slug,legacy] of Object.entries(manifest.legacy_routes)){
  const href=`../${legacy.default_route}/#${legacy.default_tag}`;
  const html=head('Original chapter and section titles','../../','This reading now uses the original Stacks chapter organization.')+`<main id="main" class="prose-page"><p>This reading now uses the original Stacks chapter titles.</p><a href="${href}">Continue to the original chapter and section</a></main><script>const route=${JSON.stringify(legacy)};const hash=location.hash.slice(1);const tag=hash.replace(/^proof-/,'');location.replace('../'+(route.anchors[tag]||route.default_route)+'/'+(hash?'#'+hash:'#'+route.default_tag));</script></body></html>`;
  fs.mkdirSync(path.join(dist,'read',slug),{recursive:true});fs.writeFileSync(path.join(dist,'read',slug,'index.html'),html);
 }
 return {sections:allSections.length,proofs:totalProofs,statements:totalStatements,readings:referenceStats,coreSections:coreSections.length,coreChapters:coreUnits.length,theoremReading};
}
