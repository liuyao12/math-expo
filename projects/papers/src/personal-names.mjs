export function surname(person){return person.surname??person.name.split(' ').at(-1);}
const escapePattern=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

// The text, its casing, and its possessive remain intact; CSS supplies small caps.
export function nameLabel(person,label=person.name){
 const aliases=[surname(person),...(person.id==='galileo'?['Galileo']:[]),...(person.id==='gauss'?['Gauß']:[])];
 const re=new RegExp(`(?<![\\p{L}\\p{N}_])(${aliases.map(escapePattern).join('|')})(?![\\p{L}\\p{N}_])`,'gu');
 // Labels can contain emphasis, but tags and TeX are never rewritten.
 return label.split(/(<[^>]*>|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g).map(part=>part.startsWith('<')||part.startsWith('\\(')||part.startsWith('\\[')?part:part.replace(re,'<span class="person-surname">$1</span>')).join('');
}

export function personalReference(person,label,base,work){
 if(work&&!work.authors.includes(person.id))throw Error(`Named reference ${person.id} is not an author of ${work.id}`);
 const target=work?`${work.id}/`:`people/${person.id}/`;
 const title=work?`${person.name} · ${work.title}`:`All works by ${person.name}`;
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 return `<a class="entity-link person-link" data-person="${person.id}"${work?` data-reference-work="${work.id}"`:''} href="${base}${target}" title="${esc(title)}">${nameLabel(person,label)}</a>`;
}

export function nameRegistry(people,base){
 const owners=new Map();
 for(const p of people){const key=surname(p);owners.set(key,(owners.get(key)??0)+1);}
 return people.map(p=>({id:p.id,name:p.name,surname:surname(p),aliases:[...(owners.get(surname(p))===1?[surname(p)]:[]),...(p.id==='galileo'?['Galileo']:[]),...(p.id==='gauss'?['Gauß']:[])],href:`${base}people/${p.id}/`}));
}
