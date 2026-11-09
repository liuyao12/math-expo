import fs from 'node:fs';
import path from 'node:path';
import {escapeHTML as esc} from './latex.mjs';

// These environments are explicitly nonprinting in the upstream preamble.
// Keep them in the source pane, separate from the verbatim printed text.
export function separateSourceNotes(html,notes){
 return html.replace(/<details class="source-note"[\s\S]*?<\/details>/g,note=>{notes.push(note);return '';});
}
export function renderProofs(proofs,{id,key,tag,label,notes,renderer}){
 return (proofs||[]).map((proof,index)=>{
  const proofId=index?`proof-${id}-${index+1}`:`proof-${id}`;
  const title=proof.title||'Proof.';
  return `<details class="proof"><summary><span class="proof-label-closed">${esc(title)}</span><span class="proof-label-open">${esc(title)}</span><span class="proof-chevron" aria-hidden="true">+</span></summary><div class="proof-body" id="${proofId}" data-example="${key}" data-proof="true" data-source-label="Proof of ${esc(label)}" data-source-tag="${tag}"><div class="source-body">${separateSourceNotes(proof.html,notes)}</div><span class="proof-end" aria-label="End of proof">${renderer.math('\\square')}</span></div></details>`;
 }).join('');
}
export function sourceRecord(root,section,manifest,notes){
 const tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
 const repository=manifest.repository||'https://github.com/stacks/stacks-project';
 const lines=section.source_start_line?`#L${section.source_start_line}-L${section.source_end_line}`:'';
 return {title:`${section.number}. ${section.title}`,tag:section.tag,
  original:`https://stacks.math.columbia.edu/tag/${section.tag}`,
  pinned:`${repository}/blob/${manifest.commit}/${section.chapter}.tex${lines}`,
  download:`../source/sections/${section.slug}.tex`,notesHtml:notes.join(''),
  html:`<h4>${section.number}. ${esc(section.title)}</h4><div class="margin-source-links"><a href="${repository}/blob/${manifest.commit}/${section.chapter}.tex${lines}" target="_blank" rel="noopener">Pinned source ↗</a><a href="../source/sections/${section.slug}.tex" download>Download LaTeX</a></div>${notes.join('')}<details class="source-tex"><summary>Verbatim LaTeX source</summary><pre><code>${esc(tex)}</code></pre></details>`};
}
export const sourceHeading=(level,title,record)=>`<div class="source-heading-row"><${level}>${title}</${level}><a class="source-link" href="${esc(record.original)}" target="_blank" rel="noopener" aria-label="Original Stacks section: ${esc(record.title)}">Original section ↗</a></div>`;
export const sourcePanel=record=>`<div class="margin-source-reference"><details id="reading-source" class="margin-source"><summary>Source &amp; attribution</summary><div id="source-content">${record.html}</div><p class="source-attribution">The Stacks Project Authors · <a href="../about/">Edition and license</a></p></details></div>`;
export const sourceDataScript=data=>`<script type="application/json" id="source-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`;
