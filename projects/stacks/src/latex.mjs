import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

export const escapeHTML = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function createRenderer(root, options={}) {
  const context={};
  vm.runInNewContext(fs.readFileSync(path.join(root,'public/vendor/katex/katex.min.js'),'utf8'),context);
  const references=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/manifest.json'),'utf8'));
  const routeManifest=JSON.parse(fs.readFileSync(path.join(root,'upstream/scheme-path.json'),'utf8'));
  const selectedSections=options.sections||manifest.sections;
  const selected=new Set(selectedSections.map(s=>s.chapter+'-'+s.label));
  for(const section of selectedSections) {
    const tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
    for(const match of tex.matchAll(/\\label\{([^}]+)\}/g))selected.add(section.chapter+'-'+match[1]);
  }
  let mathCount=0;
  const macros={ '\\Spec':'\\operatorname{Spec}', '\\Mor':'\\operatorname{Mor}', '\\Sh':'\\mathit{Sh}', '\\Sch':'\\mathit{Sch}' };
  for(const name of ['Hom','Ob','colim','Ker','Coker','Coim','Im','Ext'])macros['\\'+name]='\\operatorname{'+name+'}';
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
  let diagramId=0;
  function atom(s,pos){
    while(/\s/.test(s[pos]||'')&&pos<s.length)pos++;
    if(s[pos]==='{')return braces(s,pos);
    const token=s.slice(pos).match(/^\\[A-Za-z]+|^./s)?.[0]||'';
    return [token,pos+token.length];
  }
  function diagram(tex){
    const start=tex.indexOf('\\xymatrix');
    const [content,end]=braces(tex,tex.indexOf('{',start));
    if(tex.slice(0,start).trim()||tex.slice(end).trim())throw Error('Mixed diagram and formula: '+tex);
    const rows=splitMatrix(content),cols=Math.max(...rows.map(r=>r.length));
    const nodes=[],edges=[],twoCells=[];
    for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){
      let cell=rows[r][c];
      cell=cell.replace(/\\rtwocell\^([^_]+)_([^\{]+)\{([^}]+)\}/g,(_,f,g,t)=>{twoCells.push({r,c,label:t});return `\\ar@/^/[r]^{${f}}\\ar@/_/[r]_{${g}}`;});
      let text='',cursor=0,m;
      const re=/\\ar(?:@(?:<[^>]*>|\{[^}]*\}|\/[^/]*\/))?\[([^\]]+)\]/g;
      while((m=re.exec(cell))){
        text+=cell.slice(cursor,m.index);let pos=re.lastIndex,labels=[];
        while(/\s/.test(cell[pos]||'')&&pos<cell.length)pos++;
        while(cell[pos]==='_'||cell[pos]==='^'){
          const side=cell[pos++],[label,next]=atom(cell,pos);labels.push({side,label});pos=next;
        }
        const dir=m[1],dr=[...dir].reduce((n,ch)=>n+(ch==='d'?1:ch==='u'?-1:0),0),dc=[...dir].reduce((n,ch)=>n+(ch==='r'?1:ch==='l'?-1:0),0);
        edges.push({r,c,dr,dc,labels,style:m[0]});cursor=pos;re.lastIndex=pos;
      }
      text+=cell.slice(cursor);
      if(text.includes('\\ar')||text.includes('\\rtwocell'))throw Error('Unsupported diagram arrow: '+text);
      if(text.trim())nodes.push(`<div class="diagram-node" style="left:${(c+.5)/cols*100}%;top:${(r+.5)/rows.length*100}%">${math(text)}</div>`);
    }
    const id='diagram-arrow-'+(++diagramId),labels=[];
    let paths=edges.map(e=>{
      let x1=(e.c+.5)*185,y1=(e.r+.5)*120,x2=(e.c+e.dc+.5)*185,y2=(e.r+e.dr+.5)*120;
      const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
      const inset=42; x1+=dx/len*inset;y1+=dy/len*inset;x2-=dx/len*inset;y2-=dy/len*inset;
      let bend=e.style.includes('@/^/')?-32:e.style.includes('@/_/')?32:0;
      const offset=e.style.includes('@<')?(e.style.includes('@<-')?7:-7):0;
      x1+=nx*offset;y1+=ny*offset;x2+=nx*offset;y2+=ny*offset;
      const cx=(x1+x2)/2+nx*bend,cy=(y1+y2)/2+ny*bend;
      for(const label of e.labels){const side=label.side==='^'?-1:1;
        labels.push(`<div class="diagram-label" style="left:${((x1+x2)/2+nx*(bend/2+side*18))/cols/185*100}%;top:${((y1+y2)/2+ny*(bend/2+side*18))/rows.length/120*100}%">${math(label.label)}</div>`);
      }
      const equal=e.style.includes('@{=}'),two=e.style.includes('@{=>}'),dash=e.style.includes('-->')?'7 4':e.style.includes('..>')?'2 4':'';
      const line=(off=0)=>`<path d="M${x1+nx*off},${y1+ny*off} Q${cx+nx*off},${cy+ny*off} ${x2+nx*off},${y2+ny*off}" fill="none" stroke="currentColor" stroke-width="1.1" ${dash?`stroke-dasharray="${dash}"`:''} ${equal?'':`marker-end="url(#${id})"`}/>`;
      return equal||two?line(-2)+line(2):line();
    }).join('');
    for(const cell of twoCells){
      const x=(cell.c+1)*185,y=(cell.r+.5)*120;
      paths+=`<path d="M${x-2},${y-12} L${x-2},${y+12} M${x+2},${y-12} L${x+2},${y+12} M${x-7},${y+6} L${x},${y+13} L${x+7},${y+6}" fill="none" stroke="currentColor" stroke-width="1.1"/>`;
      labels.push(`<div class="diagram-label" style="left:${(x+16)/cols/185*100}%;top:${y/rows.length/120*100}%">${math(cell.label)}</div>`);
    }
    return `<div class="math-display"><div class="commutative-diagram" role="group" aria-label="Commutative diagram" style="width:${cols*185}px;height:${rows.length*120}px"><svg aria-hidden="true" viewBox="0 0 ${cols*185} ${rows.length*120}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor"/></marker></defs>${paths}</svg>${nodes.join('')}${labels.join('')}</div></div>`;
  }
  function math(tex,display=false){
    mathCount++;
    if(tex.includes('\\xymatrix')){
      let out='',rest=tex;while(rest.includes('\\xymatrix')){
        const start=rest.indexOf('\\xymatrix'),open=rest.indexOf('{',start),[,end]=braces(rest,open);
        const before=rest.slice(0,start).replace(/\\quad/g,'').trim();if(before)out+=math(before,true);
        out+=diagram(rest.slice(start,end));rest=rest.slice(end);
      }
      rest=rest.replace(/\\quad/g,'').trim();if(rest)out+=math(rest,true);return '<div class="diagram-group">'+out+'</div>';
    }
    tex=tex.trim().replace(/\\begin\{eqnarray\*\}/g,'\\begin{aligned}').replace(/\\end\{eqnarray\*\}/g,'\\end{aligned}').replace(/&\s*(=|\\mapsto)\s*&/g,'& $1 ');
    const rendered=context.katex.renderToString(tex,{throwOnError:true,displayMode:display,macros,strict:'ignore',output:'htmlAndMathml'});
    return display?`<div class="math-display">${rendered}</div>`:`<span class="math-inline" data-tex="${escapeHTML(tex)}">${rendered}</span>`;
  }
  function reference(label,chapter){
    const full=references[label]?label:chapter+'-'+label;
    const ref=references[full];if(!ref)throw Error('Unresolved source reference '+full);
    const route=routeManifest.routes[full];
    const href=selected.has(full)?'#'+ref.tag:route?'../'+route+'/#'+ref.tag:'https://stacks.math.columbia.edu/tag/'+ref.tag;
    return `<a class="source-ref" href="${href}" ${selected.has(full)||route?'':'target="_blank" rel="noopener"'} title="Stacks tag ${ref.tag}">${ref.number}</a>`;
  }
  function anchors(tex,chapter){return tex.replace(/\\label\{([^}]+)\}/g,(_,label)=>{
    const ref=references[chapter+'-'+label];return ref?`<span class="source-anchor" id="${ref.tag}"></span>`:'';
  });}
  function inline(tex,chapter){
    const tokens=[];const hold=html=>'@@TOKEN'+(tokens.push(html)-1)+'@@';
    tex=tex.replace(/\$([^$]+)\$/gs,(_,s)=>hold(math(s)));
    for(const cmd of ['footnote','textit','textbf','emph','text']){
      let pos;while((pos=tex.indexOf('\\'+cmd+'{'))>=0){const [content,end]=braces(tex,pos+cmd.length+1);
        const rendered=inline(content,chapter);const html=cmd==='footnote'?`<span class="source-footnote">[${rendered}]</span>`:cmd==='textbf'?`<strong>${rendered}</strong>`:cmd==='text'?rendered:`<em>${rendered}</em>`;
        tex=tex.slice(0,pos)+hold(html)+tex.slice(end);
      }
    }

    tex=tex.replace(/\\cite(?:\[([^\]]+)\])?\{([^}]+)\}/g,(_,note,key)=>hold(`<a href="https://stacks.math.columbia.edu/bibliography#${escapeHTML(key)}" target="_blank" rel="noopener">[${escapeHTML(key)}${note?', '+escapeHTML(note):''}]</a>`));
    tex=tex.replace(/\\ref\{([^}]+)\}/g,(_,label)=>hold(reference(label,chapter)));
    tex=tex.replace(/\\label\{([^}]+)\}/g,(_,label)=>hold(anchors('\\label{'+label+'}',chapter)));
    tex=escapeHTML(tex).replace(/\{\\(?:it|em) ([^{}]+)\}/g,'<em>$1</em>').replace(/\{\\bf ([^{}]+)\}/g,'<strong>$1</strong>');
    tex=tex.replace(/\\textit\{([^{}]+)\}/g,'<em>$1</em>').replace(/\\(?:noindent|medskip|smallskip|bigskip)\b/g,'').replace(/\\%/g,'%').replace(/\\&/g,'&amp;').replace(/\\ /g,' ').replaceAll('~',' ').replaceAll('``','“').replaceAll("''",'”').replaceAll('---','—').replaceAll('--','–').replace(/\s+/g,' ').trim();
    while(/@@TOKEN(\d+)@@/.test(tex))tex=tex.replace(/@@TOKEN(\d+)@@/g,(_,i)=>tokens[+i]);return tex;
  }
  function environmentEnd(tex,start,name){
    const open='\\begin{'+name+'}',close='\\end{'+name+'}';let level=1,pos=start;
    while(level){const a=tex.indexOf(open,pos),b=tex.indexOf(close,pos);if(b<0)throw Error('Unclosed '+name);if(a>=0&&a<b){level++;pos=a+open.length;}else{level--;pos=b+close.length;}}
    return [tex.slice(start,pos-close.length),pos];
  }
  function body(tex,chapter){
    tex=tex.replace(/\\begin\{(slogan|history|reference)\}[\s\S]*?\\end\{\1\}/g,'').replace(/\\medskip\s*\\noindent/g,'\n\n');
    let html='',cursor=0;const pattern=/\$\$|\\begin\{(enumerate|itemize|align\*|eqnarray\*|equation)\}/g;let match;
    const prose=s=>s.split(/\n\s*\n/).map(p=>inline(p,chapter)).filter(Boolean).map(p=>'<p>'+p+'</p>').join('');
    while((match=pattern.exec(tex))){
      html+=prose(tex.slice(cursor,match.index));
      if(match[0]==='$$'){
        const end=tex.indexOf('$$',pattern.lastIndex);if(end<0)throw Error('Unclosed display math');
        const formula=tex.slice(pattern.lastIndex,end);html+=anchors([...formula.matchAll(/\\label\{[^}]+\}/g)].map(m=>m[0]).join(''),chapter)+math(formula.replace(/\\label\{[^}]+\}/g,''),true);cursor=end+2;
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
          const tag=name==='enumerate'?'ol':'ul';html+=`<${tag}>`+items.map(i=>{const custom=i.match(/^\[([^\]]+)\]/);return '<li'+(custom?' class="custom-item"><span class="item-label">'+escapeHTML(custom[1])+'</span>':'>')+body(custom?i.slice(custom[0].length):i,chapter)+'</li>';}).join('')+`</${tag}>`;
        }else {html+=anchors([...content.matchAll(/\\label\{[^}]+\}/g)].map(m=>m[0]).join(''),chapter);const formula=content.replace(/\\label\{[^}]+\}/g,'');html+=math(name==='equation'?formula:'\\begin{'+name+'}'+formula+'\\end{'+name+'}',true);}
        cursor=end;
      }
      pattern.lastIndex=cursor;
    }
    return html+prose(tex.slice(cursor));
  }
  function section(section){
    let tex=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8').replace(/(?<!\\)%[^\n]*/g,'');
    tex=tex.replace(/\\begin\{(slogan|history|reference)\}[\s\S]*?\\end\{\1\}/g,'');
    tex=tex.replace(/^\\section\{[^\n]+\}\s*\\label\{[^}]+\}/,'').trim();
    const blocks=[];let cursor=0;const pattern=/\\begin\{(definition|lemma|example|theorem|proposition|corollary|remark|proof)\}(?:\[([^\]]+)\])?/g;let match;
    const pushProse=s=>{if(s.trim())blocks.push({kind:'prose',html:body(s,section.chapter)});};
    while((match=pattern.exec(tex))){
      pushProse(tex.slice(cursor,match.index));
      const [content,end]=environmentEnd(tex,pattern.lastIndex,match[1]);
      if(match[1]==='proof'){
        const target=blocks.at(-1);if(!target||target.kind==='prose')throw Error('Unattached proof');target.proof=body(content,section.chapter);
      }else{
        const label=content.match(/\\label\{([^}]+)\}/)?.[1];
        const ref=references[section.chapter+'-'+label];if(!ref)throw Error('Missing tag for '+label);
        blocks.push({kind:match[1],label,title:match[2]||'',...ref,html:body(content.replace('\\label{'+label+'}',''),section.chapter)});
      }
      cursor=end;pattern.lastIndex=end;
    }
    pushProse(tex.slice(cursor));return blocks;
  }
  return {math,body,inline,section,manifest,get mathCount(){return mathCount;}};
}
