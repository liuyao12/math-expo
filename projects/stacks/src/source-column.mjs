import {escapeHTML as esc} from './latex.mjs';

// These environments are explicitly nonprinting in the upstream preamble.
// Readers can find them in the complete LaTeX download.
export function printedSource(html){
 return html.replace(/<details class="source-note"[\s\S]*?<\/details>/g,'');
}
export function renderProofs(proofs,{id,key,tag,label,renderer}){
 return (proofs||[]).map((proof,index)=>{
  const proofId=index?`proof-${id}-${index+1}`:`proof-${id}`;
  const title=proof.title||'Proof.';
  return `<details class="proof"><summary><span class="disclosure-chevron" aria-hidden="true"></span><span>${esc(title)}</span></summary><div class="proof-body" tabindex="0" role="region" aria-label="Proof of ${esc(label)}" id="${proofId}" data-example="${key}" data-proof="true" data-source-label="Proof of ${esc(label)}" data-source-tag="${tag}"><div class="source-body">${printedSource(proof.html)}</div><span class="proof-end" aria-label="End of proof">${renderer.math('\\square')}</span></div></details>`;
 }).join('');
}
export function sourceHeading(level,title,section){
 const label=esc(`${section.number}. ${section.title}`);
 return `<div class="source-heading-row"><${level}>${title}</${level}><div class="section-source-links"><a class="source-link" href="https://stacks.math.columbia.edu/tag/${esc(section.tag)}" target="_blank" rel="noopener" aria-label="Original Stacks section: ${label}">Original section ↗</a><a class="source-link" href="../source/sections/${esc(section.slug)}.tex" download aria-label="Download LaTeX: ${label}">LaTeX ↓</a></div></div>`;
}
