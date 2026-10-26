// Structured titles use <cite>; the two recurring title strings are also marked
// in prose. Tags, attributes, math, code, and already italic text are untouched.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const titleHTML=title=>`<cite class="work-title">${escape(title)}</cite>`;
export function italicizeTitles(html){
 const blocked=new Set(['script','style','textarea','title','code','pre','math','svg','i','em','cite']);
 const active=[];
 const tokens=/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|<!--[\s\S]*?-->|<[^>]*>/g;
 const pattern=/\b(?:Papers on Topology: Analysis Situs and Its Five Supplements|Analysis [Ss]it[uû]s)\b/g;
 let out='',pos=0;
 for(const match of html.matchAll(tokens)){
  let prose=html.slice(pos,match.index);out+=active.length?prose:prose.replace(pattern,s=>`<cite class="work-title">${s}</cite>`);
  const token=match[0];out+=token;pos=match.index+token.length;
  const tag=token.match(/^<\s*(\/?)\s*([a-zA-Z][\w:-]*)/);
  if(tag){const name=tag[2].toLowerCase();if(blocked.has(name)){if(tag[1]){let i=active.lastIndexOf(name);if(i>=0)active.splice(i);}else if(!/\/\s*>$/.test(token))active.push(name);}}
 }
 let tail=html.slice(pos);return out+(active.length?tail:tail.replace(pattern,s=>`<cite class="work-title">${s}</cite>`));
}
