(() => {
  'use strict';
  const A=[[1,2],[3,4],[5,6]],B=[[2,1,0],[0,1,2]];
  window.MATRIX_PRODUCT_EXAMPLE={A,B,result:[[5,8],[13,16]]};
  window.mountMatrixProductDemo=(holder,{math})=>{
    const notation=window.MATRIX_NOTATION;
    holder.innerHTML='<span class="margin-label">WATCH EACH ENTRY FORM</span><div class="figure matrix-product"><h3>A column meets a row.</h3><p class="figure-sub">The same factors. The same result.</p><div class="matrix-inputs"></div><div class="matrix-source-legend"><span class="source-column"></span><span class="source-row"></span></div><div class="matrix-entry-label"></div><div class="matrix-entry-equation"></div><div class="matrix-result-row"><span class="matrix-result-name"></span><div class="matrix-result"></div></div><div class="figure-controls"><button type="button" class="matrix-next">Next entry</button><button type="button" class="matrix-play" aria-pressed="false">Play all entries</button></div><p class="figure-caption matrix-instructions"></p><p class="sr-only matrix-live" aria-live="polite"></p></div>';
    const root=holder.querySelector('.matrix-product'),inputs=root.querySelector('.matrix-inputs'),result=root.querySelector('.matrix-result'),equation=root.querySelector('.matrix-entry-equation');
    const resultName=root.querySelector('.matrix-result-name'),entryLabel=root.querySelector('.matrix-entry-label');
    const operator=document.createElement('span');operator.className='matrix-operator';
    const factors={};
    for(const [name,values] of Object.entries({A,B})){
      const node=document.createElement('div');node.className='matrix-factor factor-'+name;
      node.innerHTML='<div class="matrix-factor-name"></div><div class="matrix-array"></div><div class="matrix-dimensions"></div>';
      math(node.querySelector('.matrix-factor-name'),name);
      const tex='\\begin{pmatrix}'+values.map((row,m)=>row.map((value,n)=>'\\htmlClass{matrix-entry cell-'+name+'-'+m+'-'+n+'}{'+value+'}').join('&')).join('\\\\')+'\\end{pmatrix}';
      math(node.querySelector('.matrix-array'),tex,true);factors[name]=node;
    }
    const C=window.MATRIX_NOTATION.multiply(A,B,'reading');
    const resultTex='\\begin{pmatrix}'+C.map((row,m)=>row.map((value,n)=>'\\htmlClass{matrix-entry result-entry result-'+m+'-'+n+'}{'+value+'}').join('&')).join('\\\\')+'\\end{pmatrix}';
    math(result,resultTex,true);
    let selected=0,version=0,playRun=0,playing=false,dead=false;
    const revealed=new Set(['0:0']),flights=new Set();
    const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const current=()=>({n:selected%2,m:Math.floor(selected/2)});
    const copy=()=>{
      const reading=notation.mode==='reading';
      root.querySelector('.source-column').textContent=reading?'Left column':'Right column';
      root.querySelector('.source-row').textContent=reading?'Right row':'Left row';
      root.querySelector('.matrix-instructions').textContent=reading?'Choose a column from the left factor and a row from the right. Their dot product goes across to the chosen column and down to the chosen row.':'Choose a row from the left factor and a column from the right. Their dot product goes in the chosen row and column.';
      math(resultName,reading?'C=AB=':'C=BA=');
      for(const [name,values] of Object.entries({A,B})){
        math(factors[name].querySelector('.matrix-dimensions'),reading?values[0].length+'\\times'+values.length:values.length+'\\times'+values[0].length);
      }
    };
    function order(animate){
      const before=Object.fromEntries(Object.entries(factors).map(([name,node])=>[name,node.getBoundingClientRect()]));
      const reading=notation.mode==='reading';
      inputs.replaceChildren(reading?factors.A:factors.B,operator,reading?factors.B:factors.A);
      math(operator,'\\,');copy();
      if(animate&&!reduced())for(const [name,node] of Object.entries(factors)){
        const after=node.getBoundingClientRect(),dx=before[name].left-after.left,dy=before[name].top-after.top;
        node.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
    }
    function highlight(){
      const {n,m}=current();
      root.dataset.entryColumn=String(n);root.dataset.entryRow=String(m);
      root.querySelectorAll('.matrix-entry').forEach(node=>node.classList.remove('entry-column','entry-row','entry-result'));
      for(let k=0;k<3;k++){
        root.querySelector('.cell-A-'+k+'-'+n).classList.add('entry-column');
        root.querySelector('.cell-B-'+m+'-'+k).classList.add('entry-row');
      }
      root.querySelectorAll('.result-entry').forEach(node=>node.classList.add('is-pending'));
      revealed.forEach(key=>root.querySelector('.result-'+key.replace(':','-'))?.classList.remove('is-pending'));
      root.querySelector('.result-'+m+'-'+n).classList.add('entry-result');
      const index=notation.mode==='reading'?'[AB]_{'+(n+1)+','+(m+1)+'}':'(BA)_{'+(m+1)+','+(n+1)+'}';
      math(entryLabel,index);
    }
    function terms(hidden){
      const {n,m}=current(),reading=notation.mode==='reading';equation.replaceChildren();
      const targets=[];
      for(let k=0;k<3;k++){
        if(k){const plus=document.createElement('span');math(plus,'+');equation.appendChild(plus);}
        const term=document.createElement('span');term.className='matrix-term';
        const left=document.createElement('span'),times=document.createElement('span'),right=document.createElement('span');
        left.className='matrix-operand';right.className='matrix-operand';
        const items=reading?[{name:'A',row:k,col:n,value:A[k][n]},{name:'B',row:m,col:k,value:B[m][k]}]:[{name:'B',row:m,col:k,value:B[m][k]},{name:'A',row:k,col:n,value:A[k][n]}];
        math(left,String(items[0].value));math(times,'\\cdot');math(right,String(items[1].value));
        left.style.opacity=hidden?'0':'1';right.style.opacity=hidden?'0':'1';
        term.append(left,times,right);equation.appendChild(term);
        targets.push({node:left,...items[0],delay:k*90},{node:right,...items[1],delay:k*90});
      }
      const equal=document.createElement('span'),total=document.createElement('span');
      total.className='matrix-total';math(equal,'=');math(total,String(C[m][n]));total.style.opacity=hidden?'0':'1';
      equation.append(equal,total);return {targets,total};
    }
    function clearFlights(){for(const node of flights)node.remove();flights.clear();}
    function fly(from,to,value,color,delay=0){
      const origin=from.getBoundingClientRect(),destination=to.getBoundingClientRect(),box=root.getBoundingClientRect();
      const node=document.createElement('span');node.className='matrix-flying';
      math(node,String(value));node.style.left=(origin.left-box.left)+'px';node.style.top=(origin.top-box.top)+'px';node.style.color=color;root.appendChild(node);flights.add(node);
      const animation=node.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+(destination.left-origin.left)+'px,'+(destination.top-origin.top)+'px)',opacity:1}],{duration:600,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
      animation.finished.then(()=>{node.remove();flights.delete(node);}).catch(()=>{node.remove();flights.delete(node);});
    }
    async function step(index,animate=true){
      selected=index;const ticket=++version;clearFlights();highlight();
      const {targets,total}=terms(animate&&!reduced());
      const {n,m}=current();
      if(animate&&!reduced()){
        for(const target of targets)fly(root.querySelector('.cell-'+target.name+'-'+target.row+'-'+target.col),target.node,target.value,target.name==='A'?'#396fa2':'#b36a35',target.delay);
        await pause(820);if(ticket!==version||dead)return;
        targets.forEach(target=>target.node.style.opacity='1');total.style.opacity='1';
        const destination=root.querySelector('.result-'+m+'-'+n);
        fly(total,destination,C[m][n],'#3c7555');await pause(620);if(ticket!==version||dead)return;
      }
      revealed.add(m+':'+n);highlight();terms(false);
      root.querySelector('.matrix-live').textContent='Entry '+(notation.mode==='reading'?(n+1)+', '+(m+1):(m+1)+', '+(n+1))+' is '+C[m][n]+'.';
    }
    function stop(){playing=false;version++;playRun++;clearFlights();root.querySelector('.matrix-play').textContent='Play all entries';root.querySelector('.matrix-play').setAttribute('aria-pressed','false');}
    root.querySelector('.matrix-next').addEventListener('click',()=>{stop();step((selected+1)%4);});
    root.querySelector('.matrix-play').addEventListener('click',async()=>{
      if(playing){stop();highlight();terms(false);return;}
      playing=true;const run=++playRun;revealed.clear();const button=root.querySelector('.matrix-play');button.textContent='Pause';button.setAttribute('aria-pressed','true');
      for(let i=0;i<4&&playing&&!dead&&run===playRun;i++){await step(i);await pause(reduced()?180:300);}
      if(!dead&&run===playRun)stop();
    });
    const conventionChanged=()=>{stop();order(true);highlight();terms(false);};
    document.addEventListener('matrixconventionchange',conventionChanged);
    order(false);highlight();terms(false);
    return ()=>{dead=true;stop();document.removeEventListener('matrixconventionchange',conventionChanged);};
  };
})();
