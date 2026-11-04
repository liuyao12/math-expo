import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

export const escapeHTML = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function createRenderer(root) {
  const context={};
  vm.runInNewContext(fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.js'),'utf8'),context);
  const references=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/manifest.json'),'utf8'));
  const selected=new Set(manifest.sections.map(s=>s.chapter+'-'+s.label));
  for(const section of manifest.sections) {
    const tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
    for(const match of tex.matchAll(/\\label\{([^}]+)\}/g))selected.add(section.chapter+'-'+match[1]);
  }
  let mathCount=0;
  const macros={ '\\Spec':'\\operatorname{Spec}', '\\Mor':'\\operatorname{Mor}', '\\Sh':'\\mathit{Sh}', '\\Sch':'\\mathit{Sch}' };
  const braces=(s,start)=>{
    if(s[start]!=='{')throw Error('Expected opening brace: '+s.slice(start,start+40));
    let depth=1,i=start+1;
    for(;i<s.length;i++){if(s[i]==='{'&&s[i-1]!=='\\')depth++;if(s[i]==='}'&&s[i-1]!=='\\')depth--;if(!depth)break;}
    if(depth)throw Error('Unclosed brace');
    return [s.slice(start+1,i),i+1];
  };
  function splitMatrix(s){
    const rows=[[]];let buffer='',depth=0;
    for(let i=0;i<s.length;i++){
      const ch=s[i];
      if(ch==='{'&&s[i-1]!=='\\')depth++;
      if(ch==='}'&&s[i-1]!=='\\')depth--;
      if(!depth&&ch==='&'){rows.at(-1).push(buffer);buffer='';}
      else if(!depth&&ch==='\\'&&s[i+1]==='\\'){rows.at(-1).push(buffer);rows.push([]);buffer='';i++;}
      else buffer+=ch;
    }
    rows.at(-1).push(buffer);return rows;
  }
  function diagram(tex){
    const start=tex.indexOf('\\xymatrix');if(start<0)return tex;
    const [content]=braces(tex,tex.indexOf('{',start));
    const rows=splitMatrix(content),width=Math.max(...rows.map(r=>r.length));
    const grid=Array.from({length:rows.length*2-1},()=>Array(width*2-1).fill(''));
    for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){
      let cell=rows[r][c],rest='',cursor=0;
      const arrows=[];
      const pattern=/\\ar(?:@<[^>]*>)?\[([^\]]+)\]/g;
      let match;
      while((match=pattern.exec(cell))){
        rest+=cell.slice(cursor,match.index);
        let pos=pattern.lastIndex,label='';
        if(cell[pos]==='_'||cell[pos]==='^'){
          pos++;if(cell[pos]==='{'){const value=braces(cell,pos);label=value[0];pos=value[1];}
          else{label=cell[pos]||'';pos++;}
        }
        const dir=match[1],dr=[...dir].reduce((n,ch)=>n+(ch==='d'?1:ch==='u'?-1:0),0),dc=[...dir].reduce((n,ch)=>n+(ch==='r'?1:ch==='l'?-1:0),0);
        arrows.push({dr,dc,label});cursor=pos;pattern.lastIndex=pos;
      }
      grid[r*2][c*2]=(rest+cell.slice(cursor)).trim();
      for(const a of arrows){
        const rr=r*2+a.dr,cc=c*2+a.dc;
        let arrow;
        if(!a.dr)arrow=a.dc>0?`\\xrightarrow{${a.label}}`:`\\xleftarrow{${a.label}}`;
        else{
          const symbol=a.dc?(a.dr>0?(a.dc>0?'searrow':'swarrow'):(a.dc>0?'nearrow':'nwarrow')):(a.dr>0?'downarrow':'uparrow');
          arrow=a.label?`\\underset{${a.label}}{\\${symbol}}`:`\\${symbol}`;
        }
        if(grid[rr]?.[cc])grid[rr][cc]='\\rightrightarrows';else if(grid[rr])grid[rr][cc]=arrow;
      }
    }
    return '\\begin{array}{'+Array(width*2-1).fill('c').join('')+'}'+grid.map(r=>r.join('&')).join('\\\\[0.6em]')+'\\end{array}';
  }
  function math(tex,display=false){
    mathCount++;
    tex=diagram(tex.trim()).replace(/\\begin\{eqnarray\*\}/g,'\\begin{aligned}').replace(/\\end\{eqnarray\*\}/g,'\\end{aligned}').replace(/&\s*(=|\\mapsto)\s*&/g,'& $1 ');
    const rendered=context.katex.renderToString(tex,{throwOnError:true,displayMode:display,macros,strict:'ignore',output:'htmlAndMathml'});
    return display?`<div class="math-display">${rendered}</div>`:rendered;
  }
  function reference(label,chapter){
    const full=references[label]?label:chapter+'-'+label;
    const ref=references[full];if(!ref)throw Error('Unresolved source reference '+full);
    return `<a class="source-ref" href="${selected.has(full)?'#'+ref.tag:'https://stacks.math.columbia.edu/tag/'+ref.tag}" ${selected.has(full)?'':'target="_blank" rel="noopener"'} title="Stacks tag ${ref.tag}">${ref.number}</a>`;
  }
  function inline(tex,chapter){
    const tokens=[];const hold=html=>'@@TOKEN'+(tokens.push(html)-1)+'@@';
    tex=tex.replace(/\$([^$]+)\$/gs,(_,s)=>hold(math(s)));
    tex=tex.replace(/\\ref\{([^}]+)\}/g,(_,label)=>hold(reference(label,chapter)));
    tex=tex.replace(/\\label\{[^}]+\}/g,'');
    tex=escapeHTML(tex).replace(/\{\\it ([^{}]+)\}/g,'<em>$1</em>').replace(/\{\\bf ([^{}]+)\}/g,'<strong>$1</strong>');
    tex=tex.replace(/\\textit\{([^{}]+)\}/g,'<em>$1</em>').replace(/\\(?:noindent|medskip|smallskip|bigskip)\b/g,'').replace(/\\ /g,' ').replaceAll('~',' ').replaceAll('``','“').replaceAll("''",'”').replaceAll('---','—').replaceAll('--','–').replace(/\s+/g,' ').trim();
    tex=tex.replace(/@@TOKEN(\d+)@@/g,(_,i)=>tokens[+i]);return tex;
  }
  function environmentEnd(tex,start,name){
    const open='\\begin{'+name+'}',close='\\end{'+name+'}';let level=1,pos=start;
    while(level){const a=tex.indexOf(open,pos),b=tex.indexOf(close,pos);if(b<0)throw Error('Unclosed '+name);if(a>=0&&a<b){level++;pos=a+open.length;}else{level--;pos=b+close.length;}}
    return [tex.slice(start,pos-close.length),pos];
  }
  function body(tex,chapter){
    tex=tex.replace(/\\begin\{slogan\}[\s\S]*?\\end\{slogan\}/g,'').replace(/\\label\{[^}]+\}/g,'').replace(/\\medskip\s*\\noindent/g,'\n\n');
    let html='',cursor=0;const pattern=/\$\$|\\begin\{(enumerate|itemize|align\*|eqnarray\*)\}/g;let match;
    const prose=s=>s.split(/\n\s*\n/).map(p=>inline(p,chapter)).filter(Boolean).map(p=>'<p>'+p+'</p>').join('');
    while((match=pattern.exec(tex))){
      html+=prose(tex.slice(cursor,match.index));
      if(match[0]==='$$'){
        const end=tex.indexOf('$$',pattern.lastIndex);if(end<0)throw Error('Unclosed display math');
        html+=math(tex.slice(pattern.lastIndex,end),true);cursor=end+2;
      }else{
        const name=match[1],[content,end]=environmentEnd(tex,pattern.lastIndex,name);
        if(name==='enumerate'||name==='itemize'){
          const items=[];let part='',depth=0;
          const itemPattern=/\\begin\{(?:enumerate|itemize)\}|\\end\{(?:enumerate|itemize)\}|\\item\b/g;let m,last=0;
          while((m=itemPattern.exec(content))){
            if(m[0].startsWith('\\begin'))depth++;
            else if(m[0].startsWith('\\end'))depth--;
            else if(!depth){if(last)items.push(content.slice(last,m.index));last=itemPattern.lastIndex;}
          }
          if(last)items.push(content.slice(last));
          const tag=name==='enumerate'?'ol':'ul';html+=`<${tag}>`+items.map(i=>'<li>'+body(i,chapter)+'</li>').join('')+`</${tag}>`;
        }else html+=math('\\begin{'+name+'}'+content+'\\end{'+name+'}',true);
        cursor=end;
      }
      pattern.lastIndex=cursor;
    }
    return html+prose(tex.slice(cursor));
  }
  function section(section){
    let tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8').replace(/(?<!\\)%[^\n]*/g,'');
    tex=tex.replace(/^\\section\{[^\n]+\}\s*\\label\{[^}]+\}/,'').trim();
    const blocks=[];let cursor=0;const pattern=/\\begin\{(definition|lemma|example|proof)\}(?:\[([^\]]+)\])?/g;let match;
    const pushProse=s=>{if(s.trim())blocks.push({kind:'prose',html:body(s,section.chapter)});};
    while((match=pattern.exec(tex))){
      pushProse(tex.slice(cursor,match.index));
      const [content,end]=environmentEnd(tex,pattern.lastIndex,match[1]);
      if(match[1]==='proof'){
        const target=blocks.at(-1);if(!target||target.kind==='prose')throw Error('Unattached proof');target.proof=body(content,section.chapter);
      }else{
        const label=content.match(/\\label\{([^}]+)\}/)?.[1];
        const ref=references[section.chapter+'-'+label];if(!ref)throw Error('Missing tag for '+label);
        blocks.push({kind:match[1],label,title:match[2]||'',...ref,html:body(content,section.chapter)});
      }
      cursor=end;pattern.lastIndex=end;
    }
    pushProse(tex.slice(cursor));return blocks;
  }
  return {math,body,inline,section,manifest,get mathCount(){return mathCount;}};
}
