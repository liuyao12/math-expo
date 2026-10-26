// Coordinate lists and postfix map evaluation are invariant.
// Canonical arrays are column representations; row mode transposes only matrices.
(() => {
  'use strict';
  const entries=[],table=new Map();
  const factor=(id,tex)=>'\\htmlClass{conv-factor conv-factor-'+id+'}{'+tex+'}';
  const equation=(key,tex)=>'\\htmlClass{conv-equation conv-key-'+key+'}{'+tex+'}';
  function marked(tex){
    const counts=new Map();
    return tex.replace(/\[[a-z]\](?:\^\{\\mathsf T\})?|(?<![\\a-zA-Z])[ABCDGMPQSXY](?:_\{?\\theta\}?)?(?:\^\{\\mathsf T\}|\^\{-1\})?/g,token=>{
      const id=hash(token.replace(/\^\{\\mathsf T\}/g,'')),n=counts.get(id)||0;counts.set(id,n+1);
      return factor(id+'-'+n,token);
    });
  }
  function add(column,row,key){
    const entry={column,row,key,markedColumn:marked(column),markedRow:marked(row)};
    entries.push(entry);table.set(column,entry);
  }
  add("X=[x]^{\\mathsf T}.","X=[x].","coordinate-representation");
  add("X=[x]^{\\mathsf T},\\qquad Y=[y]^{\\mathsf T}.","X=[x],\\qquad Y=[y].","coordinate-pair");
  add("C=[a]^{\\mathsf T},\\qquad D=[b]^{\\mathsf T}.","C=[a],\\qquad D=[b].","coefficient-pair");
  add("[v.L.d]^{\\mathsf T}=A[v.c]^{\\mathsf T}.","[v.L.d]=[v.c]A.","coordinate-map");
  add("[v.L.K.e]^{\\mathsf T}=BA[v.c]^{\\mathsf T}.","[v.L.K.e]=[v.c]AB.","coordinate-composition");
  add("v\\cdot w=X^{\\mathsf T}GY.","v\\cdot w=XGY^{\\mathsf T}.","metric");
  add("\\|v\\|^2=X^{\\mathsf T}GX.","\\|v\\|^2=XGX^{\\mathsf T}.","squared-length");
  add("G=A^{\\mathsf T}A.","G=AA^{\\mathsf T}.","gram");
  add("G'=S^{\\mathsf T}GS","G'=SGS^{\\mathsf T}","gram-change");
  add("A'=AS","A'=SA","direction-change");
  add("M'=S^{-1}MS","M'=SMS^{-1}","operator-change");
  add("GC=D.","CG=D.","normal-equations");
  add("Y=AC","Y=CA","synthesis");
  add("P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}.","P=A^{\\mathsf T}(AA^{\\mathsf T})^{-1}A.","projection");
  add("Y=PX=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}X.","Y=XP=XA^{\\mathsf T}(AA^{\\mathsf T})^{-1}A.","projection-action");
  add("BA","AB","composition");
  add("(BA)_{m,n}=\\sum_k B_{m,k}A_{k,n}.","(AB)_{n,m}=\\sum_k A_{n,k}B_{k,m}.",null);
  add("A\\in\\mathbb R^{k\\times n},\\qquad B\\in\\mathbb R^{m\\times k}.","A\\in\\mathbb R^{n\\times k},\\qquad B\\in\\mathbb R^{k\\times m}.",null);
  add("M_\\theta M_\\theta^{\\mathsf T}=I_2","M_\\theta^{\\mathsf T}M_\\theta=I_2","view-rows");
  add("\\Pi_\\theta=M_\\theta^{\\mathsf T}M_\\theta.","\\Pi_\\theta=M_\\theta M_\\theta^{\\mathsf T}.","view-projector");
  add("M=Q\\Lambda Q^{\\mathsf T},\\qquad Q^{\\mathsf T}Q=I.","M=Q^{\\mathsf T}\\Lambda Q,\\qquad QQ^{\\mathsf T}=I.","spectral");
  add("GC=D,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.","CG=D,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.","function-normal");
  add("\\begin{pmatrix}1&1\\\\1&2\\end{pmatrix}\\begin{pmatrix}-1\\\\2\\end{pmatrix}=\\begin{pmatrix}1\\\\3\\end{pmatrix}.","\\begin{pmatrix}-1\\\\2\\end{pmatrix}\\begin{pmatrix}1&1\\\\1&2\\end{pmatrix}=\\begin{pmatrix}1\\\\3\\end{pmatrix}.","numeric-gram");
  add("\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x_1\\\\x_2\\end{pmatrix}=\\begin{pmatrix}ax_1+bx_2\\\\cx_1+dx_2\\end{pmatrix}.","\\begin{pmatrix}x_1\\\\x_2\\end{pmatrix}\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=\\begin{pmatrix}ax_1+bx_2\\\\cx_1+dx_2\\end{pmatrix}.","matrix-action");
  add("[x.m_\\theta]^{\\mathsf T}=M_\\theta[x]^{\\mathsf T}","[x.m_\\theta]=[x]M_\\theta","screen-coordinates");
  const normalize=value=>value==='reading'?'row':value==='standard'?'column':value;
  const transpose=A=>A[0].map((_,j)=>A.map(row=>row[j]));
  function multiply(A,B) {
    if(!A.length||!B.length||!A[0].length||A.some(row=>row.length!==A[0].length)||B.some(row=>row.length!==B[0].length)||A[0].length!==B.length)throw Error('Incompatible matrix dimensions');
    return A.map(row=>B[0].map((_,j)=>row.reduce((sum,x,k)=>sum+x*B[k][j],0)));
  }
  function splitTopLevel(tex,separator){
    const result=[];let start=0,depth=0;
    for(let i=0;i<tex.length;i++){
      if(tex[i]==='{')depth++;else if(tex[i]==='}')depth--;
      if(depth===0&&tex.startsWith(separator,i)){result.push(tex.slice(start,i));start=i+separator.length;i+=separator.length-1;}
    }
    result.push(tex.slice(start));return result;
  }
  function hash(text){let value=2166136261;for(const ch of text)value=Math.imul(value^ch.charCodeAt(0),16777619);return (value>>>0).toString(36);}
  function arrays(tex,mode,decorate,display){
    const startToken='\\begin{pmatrix}',endToken='\\end{pmatrix}',counts=new Map();
    let result='',cursor=0;
    while(true){
      const start=tex.indexOf(startToken,cursor);if(start<0)break;
      const end=tex.indexOf(endToken,start);if(end<0)throw Error('Unclosed matrix');
      const content=tex.slice(start+startToken.length,end),id=hash(content),occurrence=counts.get(id)||0;counts.set(id,occurrence+1);
      const values=splitTopLevel(content,'\\\\').map(row=>splitTopLevel(row,'&'));
      if(values.some(row=>row.length!==values[0].length))throw Error('Ragged matrix');
      let cells=values.map((row,r)=>row.map((cell,c)=>decorate?'\\htmlClass{conv-cell conv-cell-'+id+'-'+occurrence+'-'+r+'-'+c+'}{'+cell+'}':cell));
      if(mode==='row')cells=transpose(cells);
      let rendered;
      if(!display){
        const rows=cells.map(row=>'\\left['+row.join(',')+'\\right]');
        rendered='\\left['+rows.join(',')+'\\right]';
      }else{const env='bmatrix';rendered='\\begin{'+env+'}'+cells.map(row=>row.join('&')).join('\\\\')+'\\end{'+env+'}';}
      result+=tex.slice(cursor,start)+rendered;cursor=end+endToken.length;
    }
    return result+tex.slice(cursor);
  }
  function convert(tex,convention='row',decorate=false,display=true) {
    const mode=normalize(convention),entry=table.get(tex);
    let result=entry?(mode==='row'?entry.row:entry.column):tex;
    if(decorate&&entry?.key)result=equation(entry.key,mode==='row'?entry.markedRow:entry.markedColumn);
    return postfixFunctions(arrays(result,mode,decorate,display));
  }
  // The finite set of elementary applications used in the chapter sketches.
  // Bare function names, such as the pair in an inner product, remain names.
  function postfixFunctions(tex){
    return tex.replace(/\\(sin|cos|tan)\s*(\(\(2j\+1\)x\)|[nN2]x|x|\\theta)/g,(_,name,arg)=>{
      const input=arg==='x'||arg==='\\theta'?arg:arg.startsWith('(')?arg:'('+arg+')';
      return '\\bigl('+input+'.\\'+name+'\\bigr)';
    }).replace(/\\Gamma\(([^()]*)\)/g,(_,arg)=>'\\bigl(('+arg+').\\Gamma\\bigr)');
  }
  let mode='row';
  try{
    const saved=localStorage.getItem('linear-algebra-vector-convention');
    const previous=localStorage.getItem('linear-algebra-matrix-convention');
    if(saved==='column'||(!saved&&previous==='standard'))mode='column';
  }catch{}
  const renderedSources=new Map(),trust=context=>context.command==='\\htmlClass';
  function preProcess(tex){
    const result=convert(tex,mode,true,Boolean(this?.displayMode));renderedSources.set(result,tex);return result;
  }
  function remember(root){
    root.querySelectorAll('.katex').forEach(node=>{
      if(node.dataset.sourceTex)return;
      const rendered=node.querySelector('annotation')?.textContent;
      if(rendered)node.dataset.sourceTex=renderedSources.get(rendered)||rendered;
    });
  }
  function render(node,tex,display=false){
    katex.render(preProcess.call({displayMode:display},tex),node,{displayMode:display,throwOnError:true,trust});remember(node);
  }
  function applyCopy(root=document){
    root.querySelectorAll('[data-row-copy]').forEach(node=>{node.textContent=mode==='row'?node.dataset.rowCopy:node.dataset.columnCopy;});
  }
  function controls(){
    if(typeof document==='undefined')return;
    document.documentElement.dataset.matrixConvention=mode;
    document.querySelectorAll('[data-convention-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.conventionMode===mode)));
    const status=document.getElementById('convention-status');if(status)status.textContent=mode==='row'?'Row matrices':'Column matrices';applyCopy();
  }
  function positions(){
    const result=new Map(),counts=new Map();
    document.querySelectorAll('.katex[data-source-tex]').forEach(mathNode=>{
      const source=mathNode.dataset.sourceTex,occurrence=counts.get(source)||0;counts.set(source,occurrence+1);
      const prefix=source+':'+occurrence+':';
      mathNode.querySelectorAll('.conv-cell,.conv-factor').forEach(node=>{
        if(node.matches('.conv-factor')&&node.querySelector('.conv-cell'))return;
        const id=Array.from(node.classList).find(c=>c.startsWith('conv-cell-')||c.startsWith('conv-factor-'));
        result.set(prefix+id,{node,rect:node.getBoundingClientRect()});
      });
    });return result;
  }
  let movements=[],finishTimer;
  function setMode(next){
    next=normalize(next);if(!['row','column'].includes(next)||next===mode)return;
    const old=positions();movements.forEach(animation=>animation.cancel());movements=[];clearTimeout(finishTimer);
    mode=next;try{localStorage.setItem('linear-algebra-vector-convention',mode);}catch{}
    document.querySelectorAll('.katex[data-source-tex]').forEach(node=>{
      const tex=node.dataset.sourceTex,display=node.parentElement.classList.contains('katex-display'),template=document.createElement('template');
      template.innerHTML=katex.renderToString(preProcess.call({displayMode:display},tex),{displayMode:display,throwOnError:true,trust});
      const replacement=template.content.firstElementChild;(display?node.parentElement:node).replaceWith(replacement);
      (replacement.matches('.katex')?replacement:replacement.querySelector('.katex')).dataset.sourceTex=tex;
    });
    controls();
    // Demos update their factor order before the final entry positions are measured.
    document.dispatchEvent(new CustomEvent('matrixconventionchange',{detail:{mode}}));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.documentElement.classList.add('notation-moving');
      positions().forEach((item,key)=>{
        const before=old.get(key);if(!before)return;
        const dx=before.rect.left-item.rect.left,dy=before.rect.top-item.rect.top;
        if(Math.abs(dx)+Math.abs(dy)>1)movements.push(item.node.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'}));
      });
      finishTimer=setTimeout(()=>{
        document.documentElement.classList.remove('notation-moving');
        document.dispatchEvent(new CustomEvent('matrixconventionsettled'));
      },680);
    }else document.documentElement.classList.remove('notation-moving');
  }
  window.MATRIX_NOTATION={get mode(){return mode;},entries,convert,multiply,transpose,represent:(A,convention=mode)=>normalize(convention)==='row'?transpose(A):A,preProcess,remember,render,applyCopy,trust,setMode};
  if(typeof document!=='undefined'){
    document.querySelectorAll('[data-convention-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.conventionMode)));controls();
  }
})();
