// Physical matrix entries never transpose when the reading convention changes.
// In reading order A B means the conventional product B A.
(() => {
  'use strict';
  const entries = [];
  const table = new Map();
  const join = '\\,';
  const factor = (id,tex) => '\\htmlClass{conv-factor conv-factor-' + id + '}{' + tex + '}';
  const equation = (key,tex) => '\\htmlClass{conv-equation conv-key-' + key + '}{' + tex + '}';
  function add(standard,reading,key,markedStandard,markedReading) {
    const entry = {standard,reading,key,markedStandard,markedReading};
    entries.push(entry);table.set(standard,entry);
  }
  const f = factor;
  add('G=A^{\\mathsf T}A','G=A\\,A^{\\mathsf T}','gram',
    'G='+f('transpose','A^{\\mathsf T}')+f('basis','A'),
    'G='+f('basis','A')+join+f('transpose','A^{\\mathsf T}'));
  add("A'=AS","A'=S\\,A",'basis-change',
    "A'="+f('basis','A')+f('change','S'),
    "A'="+f('change','S')+join+f('basis','A'));
  add("G'=S^{\\mathsf T}GS","G'=S\\,G\\,S^{\\mathsf T}",'gram-change',
    "G'="+f('transpose','S^{\\mathsf T}')+f('gram','G')+f('change','S'),
    "G'="+f('change','S')+join+f('gram','G')+join+f('transpose','S^{\\mathsf T}'));
  add("M'=S^{-1}MS","M'=S\\,M\\,S^{-1}",'operator-change',
    "M'="+f('inverse','S^{-1}')+f('map','M')+f('change','S'),
    "M'="+f('change','S')+join+f('map','M')+join+f('inverse','S^{-1}'));
  add('P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}',
    'P=A^{\\mathsf T}\\,(A\\,A^{\\mathsf T})^{-1}\\,A','projection',
    'P='+f('basis','A')+f('inverse','(A^{\\mathsf T}A)^{-1}')+f('transpose','A^{\\mathsf T}'),
    'P='+f('transpose','A^{\\mathsf T}')+join+f('inverse','(A\\,A^{\\mathsf T})^{-1}')+join+f('basis','A'));
  add('v\\cdot w=c^{\\mathsf T}Gd,\\qquad \\|v\\|^2=c^{\\mathsf T}Gc.',
    'v\\cdot w=d\\,G\\,c^{\\mathsf T},\\qquad \\|v\\|^2=c\\,G\\,c^{\\mathsf T}.','metric',
    'v\\cdot w='+f('left-dual','c^{\\mathsf T}')+f('metric-left','G')+f('right-vector','d')+',\\qquad \\|v\\|^2='+f('norm-dual','c^{\\mathsf T}')+f('metric-right','G')+f('norm-vector','c')+'.',
    'v\\cdot w='+f('right-vector','d')+join+f('metric-left','G')+join+f('left-dual','c^{\\mathsf T}')+',\\qquad \\|v\\|^2='+f('norm-vector','c')+join+f('metric-right','G')+join+f('norm-dual','c^{\\mathsf T}')+'.');
  add('c^{\\mathsf T}Gc=4','c\\,G\\,c^{\\mathsf T}=4','metric-number',
    f('dual','c^{\\mathsf T}')+f('gram','G')+f('vector','c')+'=4',
    f('vector','c')+join+f('gram','G')+join+f('dual','c^{\\mathsf T}')+'=4');
  add('Gc=b,\\qquad b_i=u_i\\cdot v.','c\\,G=b,\\qquad b_i=u_i\\cdot v.','normal-equations',
    f('gram','G')+f('coordinates','c')+'=b,\\qquad b_i=u_i\\cdot v.',
    f('coordinates','c')+join+f('gram','G')+'=b,\\qquad b_i=u_i\\cdot v.');
  add('Gc=b,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.',
    'c\\,G=b,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.','function-normal',
    f('gram','G')+f('coordinates','c')+'=b,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.',
    f('coordinates','c')+join+f('gram','G')+'=b,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.');
  const numericG='\\begin{pmatrix}1&1\\\\1&2\\end{pmatrix}';
  const numericC='\\begin{pmatrix}-1\\\\2\\end{pmatrix}';
  const numericB='\\begin{pmatrix}1\\\\3\\end{pmatrix}';
  add(numericG+numericC+'='+numericB+'.',numericC+'\\,'+numericG+'='+numericB+'.','numeric-gram',
    f('gram',numericG)+f('coordinates',numericC)+'='+f('result',numericB)+'.',
    f('coordinates',numericC)+join+f('gram',numericG)+'='+f('result',numericB)+'.');
  add('M_\\theta M_\\theta^{\\mathsf T}=I_2','M_\\theta^{\\mathsf T}\\,M_\\theta=I_2','view-rows',
    f('view','M_\\theta')+f('transpose','M_\\theta^{\\mathsf T}')+'=I_2',
    f('transpose','M_\\theta^{\\mathsf T}')+join+f('view','M_\\theta')+'=I_2');
  add('\\Pi_\\theta=M_\\theta^{\\mathsf T}M_\\theta.','\\Pi_\\theta=M_\\theta\\,M_\\theta^{\\mathsf T}.','view-projector',
    '\\Pi_\\theta='+f('transpose','M_\\theta^{\\mathsf T}')+f('view','M_\\theta')+'.',
    '\\Pi_\\theta='+f('view','M_\\theta')+join+f('transpose','M_\\theta^{\\mathsf T}')+'.');
  add('M=Q\\Lambda Q^{\\mathsf T},\\qquad Q^{\\mathsf T}Q=I.',
    'M=Q^{\\mathsf T}\\,\\Lambda\\,Q,\\qquad Q\\,Q^{\\mathsf T}=I.','spectral',
    'M='+f('basis','Q')+f('diagonal','\\Lambda')+f('dual','Q^{\\mathsf T}')+',\\qquad '+f('orth-dual','Q^{\\mathsf T}')+f('orth-basis','Q')+'=I.',
    'M='+f('dual','Q^{\\mathsf T}')+join+f('diagonal','\\Lambda')+join+f('basis','Q')+',\\qquad '+f('orth-basis','Q')+join+f('orth-dual','Q^{\\mathsf T}')+'=I.');
  add('Gc=b','c\\,G=b','normal-short',f('gram','G')+f('vector','c')+'=b',f('vector','c')+join+f('gram','G')+'=b');
  add('BA','A\\,B','composition',f('second','B')+f('first','A'),f('first','A')+join+f('second','B'));
  add('(BA)_{m,n}=\\sum_k B_{m,k}A_{k,n}.','[AB]_{n,m}=\\sum_k A_{n,k}B_{k,m}.');
  add('A\\in\\mathbb R^{k\\times n},\\qquad B\\in\\mathbb R^{m\\times k}.',
    'A\\in\\mathbb R^{n\\times k},\\qquad B\\in\\mathbb R^{k\\times m}.');
  add('\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}.',
    '\\begin{pmatrix}x\\\\y\\end{pmatrix}\\,\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}.','column-action',
    f('map','\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}')+f('vector','\\begin{pmatrix}x\\\\y\\end{pmatrix}')+'='+f('result','\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}')+'.',
    f('vector','\\begin{pmatrix}x\\\\y\\end{pmatrix}')+join+f('map','\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}')+'='+f('result','\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}')+'.');
  add('P_B P_A v','v\\,P_A\\,P_B');
  add('P_A P_B v','v\\,P_B\\,P_A');
  add('(BA)v=B(Av)','(v\\,A)\\,B=v\\,(A\\,B)');
  add('(BA)v=B(Av).','(v\\,A)\\,B=v\\,(A\\,B).','composition-action',
    '('+f('second-left','B')+f('first-left','A')+')'+f('input-left','v')+'='+f('second-right','B')+'('+f('first-right','A')+f('input-right','v')+').',
    '('+f('input-left','v')+f('first-left','A')+')'+f('second-left','B')+'='+f('input-right','v')+'('+f('first-right','A')+f('second-right','B')+').');
  add('Pv=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}v.',
    'v\\,P=v\\,A^{\\mathsf T}(A\\,A^{\\mathsf T})^{-1}A.','projection-action',
    f('projection','P')+f('input-left','v')+'='+f('basis','A')+f('inverse','(A^{\\mathsf T}A)^{-1}')+f('transpose','A^{\\mathsf T}')+f('input-right','v')+'.',
    f('input-left','v')+f('projection','P')+'='+f('input-right','v')+f('transpose','A^{\\mathsf T}')+f('inverse','(A\\,A^{\\mathsf T})^{-1}')+f('basis','A')+'.');
  function readingStyle(tex) {
    return tex.replaceAll('{pmatrix}','{bmatrix}');
  }
  function convert(tex,convention='reading',decorate=false) {
    const entry=table.get(tex);
    if(entry) {
      const result=convention==='reading'?entry.reading:entry.standard;
      if(!decorate||!entry.key)return convention==='reading'?readingStyle(result):result;
      return equation(entry.key,convention==='reading'?readingStyle(entry.markedReading):entry.markedStandard);
    }
    if(convention==='standard')return tex;
    return readingStyle(tex.replaceAll('P_Nf','f\\,P_N')
      .replaceAll('T^mv','v\\,T^m')
      .replaceAll('(I-P)v','v\\,(I-P)')
      .replaceAll('(2P-I)v','v\\,(2P-I)')
      .replaceAll('Pv','v\\,P')
      .replaceAll('Rv','v\\,R')
      .replaceAll('Tv','v\\,T')
      .replaceAll('Tf','f\\,T')
      .replaceAll('Mv','v\\,M')
      .replace(/^PQ$/,'P\\,Q'));
  }
  function conventionalMultiply(A,B) {
    if(!A.length||!B.length||A[0].length!==B.length)throw Error('Incompatible matrix dimensions');
    return A.map(row=>B[0].map((_,j)=>row.reduce((sum,x,k)=>sum+x*B[k][j],0)));
  }
  const multiply=(A,B,convention='reading')=>convention==='reading'?conventionalMultiply(B,A):conventionalMultiply(A,B);
  let mode='reading';
  try { const saved=localStorage.getItem('linear-algebra-matrix-convention');if(saved==='standard')mode=saved; } catch {}
  const renderedSources=new Map();
  const trust=context=>context.command==='\\htmlClass';
  function preProcess(tex) {const result=convert(tex,mode,true);renderedSources.set(result,tex);return result;}
  function remember(root) {
    root.querySelectorAll('.katex').forEach(node=>{
      if(node.dataset.sourceTex)return;
      const rendered=node.querySelector('annotation')?.textContent;
      if(rendered)node.dataset.sourceTex=renderedSources.get(rendered)||rendered;
    });
  }
  function render(node,tex,display=false) {
    katex.render(preProcess(tex),node,{displayMode:display,throwOnError:true,trust});
    remember(node);
  }
  function applyCopy(root=document) {
    root.querySelectorAll('[data-reading-copy]').forEach(node=>{
      node.textContent=mode==='reading'?node.dataset.readingCopy:node.dataset.standardCopy;
    });
  }
  function controls() {
    if(typeof document==='undefined')return;
    document.documentElement.dataset.matrixConvention=mode;
    document.querySelectorAll('[data-convention-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.conventionMode===mode)));
    const status=document.getElementById('convention-status');
    if(status)status.textContent=mode==='reading'?'Input first · indices across, then down':'Matrix first · indices row, then column';
    applyCopy();
  }
  function positions() {
    const result=new Map(),counts=new Map();
    document.querySelectorAll('.conv-equation').forEach(node=>{
      const key=Array.from(node.classList).find(c=>c.startsWith('conv-key-'));
      const occurrence=counts.get(key)||0;counts.set(key,occurrence+1);
      node.querySelectorAll('.conv-factor').forEach(factorNode=>{
        const id=Array.from(factorNode.classList).find(c=>c.startsWith('conv-factor-'));
        result.set(key+':'+occurrence+':'+id,{node:factorNode,rect:factorNode.getBoundingClientRect()});
      });
    });return result;
  }
  let movements=[];
  function setMode(next) {
    if(!['reading','standard'].includes(next)||next===mode)return;
    const old=positions();movements.forEach(animation=>animation.cancel());movements=[];
    mode=next;try {localStorage.setItem('linear-algebra-matrix-convention',mode);}catch{}
    document.querySelectorAll('.katex[data-source-tex]').forEach(node=>{
      const tex=node.dataset.sourceTex,display=node.parentElement.classList.contains('katex-display');
      const template=document.createElement('template');
      template.innerHTML=katex.renderToString(preProcess(tex),{displayMode:display,throwOnError:true,trust});
      const replacement=template.content.firstElementChild;
      (display?node.parentElement:node).replaceWith(replacement);
      const mathNode=replacement.matches('.katex')?replacement:replacement.querySelector('.katex');
      mathNode.dataset.sourceTex=tex;
    });
    controls();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      positions().forEach((item,key)=>{
        const before=old.get(key);if(!before)return;
        const dx=before.rect.left-item.rect.left,dy=before.rect.top-item.rect.top;
        if(Math.abs(dx)+Math.abs(dy)>1)movements.push(item.node.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)'}));
      });
    }
    document.dispatchEvent(new CustomEvent('matrixconventionchange',{detail:{mode}}));
  }
  window.MATRIX_NOTATION={get mode(){return mode;},entries,convert,multiply,preProcess,remember,render,applyCopy,trust,setMode};
  if(typeof document!=='undefined'){
    document.querySelectorAll('[data-convention-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.conventionMode)));
    controls();
  }
})();
