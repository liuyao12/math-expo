import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createHash} from 'node:crypto';

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
  const diagramFile=path.join(root,'src/diagrams.json');
  const sourceDiagrams=fs.existsSync(diagramFile)?JSON.parse(fs.readFileSync(diagramFile,'utf8')):{};
  let mathCount=0;
  const macros={ '\\Spec':'\\operatorname{Spec}', '\\Mor':'\\operatorname{Mor}', '\\Sh':'\\mathit{Sh}', '\\Sch':'\\mathit{Sch}' };
  macros['\\SheafHom']='\\mathop{\\mathcal{H}\\!\\mathit{om}}\\nolimits';
  for(const name of ['Hom','Ob','colim','Ker','Coker','Coim','Im','Ext','Pic'])macros['\\'+name]='\\operatorname{'+name+'}';
  const braces=(s,start)=>{
    if(s[start]!=='{')throw Error('Expected opening brace: '+s.slice(start,start+40));
    let depth=1,i=start+1;
    for(;i<s.length;i++){if(s[i]==='{'&&s[i-1]!=='\\')depth++;if(s[i]==='}'&&s[i-1]!=='\\')depth--;if(!depth)break;}
    if(depth)throw Error('Unclosed brace');
    return [s.slice(start+1,i),i+1];
  };
  function math(tex,display=false){
    mathCount++;
    if(tex.includes('\\xymatrix')&&options.diagramRenderer)return options.diagramRenderer(tex.trim());
    if(tex.includes('\\xymatrix')&&Object.keys(sourceDiagrams).length){
      const key=createHash('sha256').update(tex.trim()).digest('hex').slice(0,24),diagram=sourceDiagrams[key];
      if(!diagram)throw Error('Missing original-source diagram '+key+'; regenerate source diagrams.');
      return `<div class="math-display original-diagram"><img class="source-diagram" src="../../diagrams/${diagram.file}?v=${diagram.svg_sha256.slice(0,12)}" width="${Math.ceil(diagram.width*1.8)}" height="${Math.ceil(diagram.height*1.8)}" alt="Commutative diagram typeset from the original Stacks LaTeX" loading="lazy"></div>`;
    }
    if(tex.includes('\\xymatrix'))throw Error('Original-source diagram assets are required.');
    tex=tex.trim().replace(/\\begin\{eqnarray\*\}/g,'\\begin{aligned}').replace(/\\end\{eqnarray\*\}/g,'\\end{aligned}').replace(/&\s*(=|\\mapsto)\s*&/g,'& $1 ');
    const rendered=context.katex.renderToString(tex,{throwOnError:true,displayMode:display,macros,strict:'ignore',output:'htmlAndMathml'});
    return display?`<div class="math-display">${rendered}</div>`:`<span class="math-inline" data-tex="${escapeHTML(tex)}">${rendered}</span>`;
  }
  function reference(label,chapter){
    const full=references[label]?label:chapter+'-'+label;
    const ref=references[full];if(!ref)throw Error('Unresolved source reference '+full);
    const route=options.routes?.[full]||routeManifest.routes[full];
    const href=selected.has(full)?'#'+ref.tag:route?'../'+route+'/#'+ref.tag:'https://stacks.math.columbia.edu/tag/'+ref.tag;
    return `<a class="source-ref" href="${href}" ${selected.has(full)||route?'':'target="_blank" rel="noopener"'} title="Stacks tag ${ref.tag}">${ref.number}</a>`;
  }
  function anchors(tex,chapter){return tex.replace(/\\label\{([^}]+)\}/g,(_,label)=>{
    const ref=references[chapter+'-'+label];return ref?`<span class="source-anchor" id="${ref.tag}"></span>`:'';
  });}
  let inlineId=0;
  function inline(tex,chapter){
    const tokens=[],prefix='@@TOKEN'+(++inlineId)+'_';const tokenPattern=new RegExp(prefix+'(\\d+)@@','g');
    const hold=html=>prefix+(tokens.push(html)-1)+'@@';
    tex=tex.replace(/\$([^$]+)\$/gs,(_,s)=>hold(math(s)));
    for(const cmd of ['footnote','textit','textbf','emph','text']){
      let pos;while((pos=tex.indexOf('\\'+cmd+'{'))>=0){const [content,end]=braces(tex,pos+cmd.length+1);
        const rendered=inline(content,chapter);const html=cmd==='footnote'?`<span class="source-footnote">[${rendered}]</span>`:cmd==='textbf'?`<strong>${rendered}</strong>`:cmd==='text'?rendered:`<em>${rendered}</em>`;
        tex=tex.slice(0,pos)+hold(html)+tex.slice(end);
      }
    }

    tex=tex.replace(/\\cite(?:\[([^\]]+)\])?\{([^}]+)\}/g,(_,note,key)=>hold(`<a class="bibliography-ref" href="https://stacks.math.columbia.edu/bibliography#${escapeHTML(key)}" target="_blank" rel="noopener">[${escapeHTML(key)}${note?', '+escapeHTML(note):''}]</a>`));
    tex=tex.replace(/\\ref\{([^}]+)\}/g,(_,label)=>hold(reference(label,chapter)));
    tex=tex.replace(/\\label\{([^}]+)\}/g,(_,label)=>hold(anchors('\\label{'+label+'}',chapter)));
    tex=tex.replace(/\\'\{?([A-Za-z])\}?/g,(_,letter)=>(letter+'\u0301').normalize('NFC'));
    tex=escapeHTML(tex).replace(/\{\\(?:it|em) ([^{}]+)\}/g,'<em>$1</em>').replace(/\{\\bf ([^{}]+)\}/g,'<strong>$1</strong>');
    tex=tex.replace(/\\textit\{([^{}]+)\}/g,'<em>$1</em>').replace(/\\(?:noindent|medskip|smallskip|bigskip)\b/g,'').replace(/\\%/g,'%').replace(/\\&/g,'&amp;').replace(/\\ /g,' ').replaceAll('~',' ').replaceAll('``','“').replaceAll("''",'”').replaceAll('---','—').replaceAll('--','–').replace(/\s+/g,' ').trim();
    while(tex.includes(prefix))tex=tex.replace(tokenPattern,(_,i)=>tokens[+i]);return tex;
  }
  function environmentEnd(tex,start,name){
    const open='\\begin{'+name+'}',close='\\end{'+name+'}';let level=1,pos=start;
    while(level){const a=tex.indexOf(open,pos),b=tex.indexOf(close,pos);if(b<0)throw Error('Unclosed '+name);if(a>=0&&a<b){level++;pos=a+open.length;}else{level--;pos=b+close.length;}}
    return [tex.slice(start,pos-close.length),pos];
  }
  function body(tex,chapter){
    tex=tex.replace(/\\medskip\s*\\noindent/g,'\n\n');
    let html='',cursor=0;const pattern=/\$\$|\\begin\{(enumerate|itemize|align\*|eqnarray\*|equation|history|reference|slogan)\}/g;let match;
    const prose=s=>s.split(/\n\s*\n/).map(p=>inline(p,chapter)).filter(Boolean).map(p=>'<p>'+p+'</p>').join('');
    while((match=pattern.exec(tex))){
      html+=prose(tex.slice(cursor,match.index));
      if(match[0]==='$$'){
        const end=tex.indexOf('$$',pattern.lastIndex);if(end<0)throw Error('Unclosed display math');
        const formula=tex.slice(pattern.lastIndex,end);html+=anchors([...formula.matchAll(/\\label\{[^}]+\}/g)].map(m=>m[0]).join(''),chapter)+math(formula.replace(/\\label\{[^}]+\}/g,''),true);cursor=end+2;
      }else{
        const name=match[1],[content,end]=environmentEnd(tex,pattern.lastIndex,name);
        if(['history','reference','slogan'].includes(name)){
          html+=`<details class="source-note" data-source-note="${name}"><summary>Original source: ${name}</summary>${body(content,chapter)}</details>`;
        }else if(name==='enumerate'||name==='itemize'){
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
    tex=tex.replace(/^\\section\{[^\n]+\}\s*\\label\{[^}]+\}/,'').trim();
    const blocks=[];let cursor=0;const pattern=/\\begin\{(definition|lemma|example|theorem|proposition|corollary|remark|proof)\}(?:\[([^\]]+)\])?/g;let match;
    const pushProse=s=>{if(s.trim())blocks.push({kind:'prose',html:body(s,section.chapter)});};
    while((match=pattern.exec(tex))){
      pushProse(tex.slice(cursor,match.index));
      const [content,end]=environmentEnd(tex,pattern.lastIndex,match[1]);
      if(match[1]==='proof'){
        let target=blocks.at(-1);
        if(target?.kind==='prose'){const interstitial=blocks.pop();target=blocks.at(-1);if(!target||target.kind==='prose')throw Error('Unattached proof');target.html+=interstitial.html;}
        if(!target)throw Error('Unattached proof');target.proof=body(content,section.chapter);
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
