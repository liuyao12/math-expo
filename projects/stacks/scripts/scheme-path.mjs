import fs from 'node:fs';
import path from 'node:path';
import {createRenderer,escapeHTML as esc} from '../src/latex.mjs';
import {separateSourceNotes,sourceRecord,sourcePanel,sourceDataScript} from '../src/source-column.mjs';
import {passageNote} from '../src/scheme-notes.mjs';
export function buildSchemePath({root,dist,head,header,footer,matchingHTML}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
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
 for(const unit of [...manifest.units,...coreUnits]){
  const r=createRenderer(root,{sections:unit.sections,routes:unit.core?coreRoutes:undefined}),notes={},data={},sources={};let proofs=0,statements=0;
  const rich=s=>s.replace(/\\\[([\s\S]*?)\\\]/g,(_,t)=>r.math(t,true)).replace(/\\\(([\s\S]*?)\\\)/g,(_,t)=>r.math(t));
  const sections=unit.sections.map(s=>{
   const blocks=r.section(s),sourceNotes=[];
   const content=blocks.map((b,bi)=>{
    const note=passageNote(s,b),key=note.scope==='statement'?s.slug+'-'+b.label:s.slug;
    if(!notes[key]){notes[key]=note;data[key]={title:note.title,html:matchingHTML(note,false,r),proofHtml:null,symbols:note.bindings.map(v=>v.symbol.replace(/[\s{}]/g,''))};}
    const label=b.kind==='prose'?`§${s.number} · ${s.title}`:`${b.kind[0].toUpperCase()+b.kind.slice(1)} ${b.number}`;
    const id=b.tag||s.slug+'-'+bi;
    let html=`<div class="source-body">${separateSourceNotes(b.html,sourceNotes)}</div>`;
    if(b.kind!=='prose'){
     statements++;html=`<div class="statement-heading"><h3>${esc(label)}${b.title?' · '+rich(b.title):''}</h3></div>`+html;
    }
    if(b.proof){proofs++;html+=`<details class="proof"><summary><span class="proof-label-closed">Proof.</span><span class="proof-label-open">Proof.</span><span class="proof-chevron" aria-hidden="true">+</span></summary><div class="proof-body" id="proof-${id}" data-example="${key}" data-proof="true" data-source-label="Proof of ${esc(label)}" data-source-tag="${b.tag||s.tag}"><div class="source-body">${separateSourceNotes(b.proof,sourceNotes)}</div><span class="proof-end" aria-label="End of proof">${r.math('\\square')}</span></div></details>`;}
    return `<section id="${id}" class="passage ${b.kind}" data-example="${key}" data-source-label="${esc(label)}" data-source-tag="${b.tag||s.tag}" aria-label="${esc(label)}">${html}</section>`;
   }).join('');
   sources[s.tag]=sourceRecord(root,s,manifest,sourceNotes);
   return `<section class="source-section" id="${s.tag}" data-source-sha256="${s.sha256}"><header class="source-section-header"><h2>${s.number}. ${esc(s.title)}</h2></header>${content}</section>`;
  }).join('');
  stats.push({slug:unit.slug,sections:unit.sections.length,proofs,statements,formulas:r.mathCount});
  const first=Object.keys(data)[0],firstSource=unit.sections[0];
  const toc=unit.sections.map(s=>`<a href="#${s.tag}" data-outline="${s.tag}"><span>${s.number}</span>${esc(s.title)}</a>`).join('');
  const chapterNav=(unit.core?coreUnits:manifest.units).map(u=>`<a href="../${u.slug}/" ${u.slug===unit.slug?'aria-current="page"':''}>${u.number}. ${esc(u.title)}</a>`).join('');
  const html=head(unit.title,'../../',`The Stacks Project, Chapter ${unit.number}: ${unit.title}. ${unit.core?'Sections on the path to the definition of schemes.':'Complete original sections from the reference collection.'}`)+header('../../',true)+`<div class="reading-progress" aria-hidden="true"><span></span></div><div class="reader-layout"><nav class="reading-outline" id="reading-outline" aria-label="Reading contents"><a class="back-link" href="../../path/">← Sections for defining schemes</a><p class="eyebrow">Chapter ${unit.number} · ${unit.core?'Definition path':'Reference collection'}</p><div class="margin-reading-controls"><button id="toggle-proofs" type="button" aria-pressed="false">Show all proofs</button><button class="mobile-example" type="button" data-show-example>Example ↗</button></div>${toc}<details class="chapter-navigation"><summary>Other chapters</summary>${chapterNav}</details>${unit.core?`<a href="../${unit.sections[0].chapter}/">Full chapter selection ↗</a>`: ''}<div class="outline-note"><span class="eyebrow">Separate commentary</span><p>Concrete examples</p><button type="button" class="mobile-example" data-show-example>Open example</button></div></nav><main id="main" class="reader-main verbatim-main"><header class="reading-title"><h1>${esc(unit.title)}</h1></header>${sections}</main><aside id="example-dock" class="example-dock" aria-label="Separate commentary with examples" tabindex="-1"><div class="example-sticky"><div class="example-header"><p class="eyebrow">Examples · Commentary</p><button id="close-example" type="button" aria-label="Close example">×</button></div><h2>A concrete example</h2><p class="matching-guide">The example follows the passage you are reading. Match the objects and see what the statement says in this case.</p>${sourcePanel(sources[firstSource.tag])}<div class="example-current"><div class="example-step"><a id="example-stage-label" href="#${firstSource.tag}">§${firstSource.number} · ${esc(firstSource.title)}</a><span id="example-index">01</span></div><h3 id="example-title">${esc(data[first].title)}</h3><div id="example-content">${data[first].html}</div><div class="example-paging"><button id="previous-example" type="button" aria-label="Previous example explanation">← Previous</button><button id="follow-reading" type="button" aria-pressed="true">Follow reading</button><button id="next-example" type="button" aria-label="Next example explanation">Next →</button></div></div></div></aside></div><script type="application/json" id="example-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`+sourceDataScript(sources)+footer('../../')+'</body></html>';
  fs.mkdirSync(path.join(dist,'read',unit.slug),{recursive:true});fs.writeFileSync(path.join(dist,'read',unit.slug,'index.html'),html);
 }
 const referenceStats=stats.filter(entry=>!entry.slug.startsWith('core-'));
 const totalProofs=referenceStats.reduce((a,s)=>a+s.proofs,0),totalStatements=referenceStats.reduce((a,s)=>a+s.statements,0);
 const additional=new Map(manifest.source_reference_audit.flatMap(s=>s.references.filter(r=>!r.included).map(r=>[r.label,r])));
 const index=head('The Stacks Project — Sections for defining schemes','../','A path through the original Stacks definitions and construction of schemes.')+header('../')+`<main id="main" class="path-page home"><section class="path-intro"><p class="eyebrow">Original texts · Companion examples</p><h1>The Stacks Project</h1><p class="lead">Follow the definitions and construction leading to schemes, with examples in the margin.</p><div class="reading-meta"><span>${coreSections.length} sections on the path</span><span>${coreUnits.length} original chapters</span></div><a class="text-link" href="../read/core-schemes/#01IJ">Definition 26.9.1 · Schemes ↗</a></section><section class="reading-library"><div class="section-line"><h2>Path to the definition</h2><span>Complete source sections</span></div>${unitList('../',coreUnits)}</section><details id="scope" class="path-scope collection-scope"><summary>Scope, prerequisites, and source selection</summary><p>The path assumes sets and basic undergraduate algebra. It follows the definitions and the construction of the structure sheaf in Stacks §26.5 through to Definition 26.9.1. Each section has a role in that route. The source sections are printed in full, including any further results they contain.</p><p>The construction uses quasi-compactness of standard opens. This follows from the localization description of standard opens and quasi-compactness of spectra, both in §10.17. The citation in §26.5 to the more general result in §10.29 stays available in the reference collection.</p><p>Cross-references to other results lead to the reference collection or to Stacks. The original titles, numbering, text, proofs, and source links are retained. Proofs start collapsed.</p><p>The side column is Math Expo commentary. Examples range from elementary algebra and finite spaces to holomorphic functions and germs.</p><details class="reference-audit"><summary>Additional references and why they remain source links (${additional.size})</summary><ul>${[...additional.values()].map(r=>`<li><a href="https://stacks.math.columbia.edu/tag/${r.tag}" target="_blank" rel="noopener">Stacks ${r.tag}</a> — ${esc(r.reason)}</li>`).join('')}</ul></details></details><section class="path-scope"><h2>Source and attribution</h2><p>Mathematical text by The Stacks Project Authors. Separate commentary and reader presentation by Math Expo. Source revision <a href="${repository}/tree/${manifest.commit}"><code>${manifest.commit.slice(0,12)}</code></a>.</p><p><a href="../about/">Attribution, license, and modification history</a> · <a href="../source/scheme-path.json">Selection, source hashes, and reference audit</a></p><details class="source-inventory"><summary>Why each section is on the path</summary>${coreUnits.map(u=>`<h3>${u.number}. ${esc(u.title)}</h3><ul class="source-section-list">${u.sections.map(section=>`<li><a href="../read/${u.slug}/#${section.tag}">${section.number}. ${esc(section.title)}</a><br>${esc(coreReasons[section.number])}</li>`).join('')}</ul>`).join('')}</details><details id="references" class="source-inventory"><summary>Full reference collection (${allSections.length} sections)</summary><p>The full chapter selections include supporting proofs, examples, and later results.</p>${unitList('../',manifest.units)}</details><h2>Gluing companion</h2><p><a href="../read/gluing/">Gluing local data</a> continues with the Riemann sphere alongside the original gluing sections.</p></section></main>`+footer('../')+'</body></html>';
 fs.mkdirSync(path.join(dist,'path'),{recursive:true});fs.writeFileSync(path.join(dist,'path/index.html'),index);
 for(const [slug,legacy] of Object.entries(manifest.legacy_routes)){
  const href=`../${legacy.default_route}/#${legacy.default_tag}`;
  const html=head('Original chapter and section titles','../../','This reading now uses the original Stacks chapter organization.')+`<main id="main" class="prose-page"><p>This reading now uses the original Stacks chapter titles.</p><a href="${href}">Continue to the original chapter and section</a></main><script>const route=${JSON.stringify(legacy)};const hash=location.hash.slice(1);const tag=hash.replace(/^proof-/,'');location.replace('../'+(route.anchors[tag]||route.default_route)+'/'+(hash?'#'+hash:'#'+route.default_tag));</script></body></html>`;
  fs.mkdirSync(path.join(dist,'read',slug),{recursive:true});fs.writeFileSync(path.join(dist,'read',slug,'index.html'),html);
 }
 return {sections:allSections.length,proofs:totalProofs,statements:totalStatements,readings:referenceStats,coreSections:coreSections.length,coreChapters:coreUnits.length};
}
