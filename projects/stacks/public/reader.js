(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const proofs=$$('details.proof'),all=$('#toggle-proofs');
  const updateProofControl=()=>{if(!all)return;const open=proofs.length>0&&proofs.every(p=>p.open);all.textContent=open?'Hide all proofs':'Show all proofs';all.setAttribute('aria-pressed',String(open));};
  all?.addEventListener('click',()=>{const open=!proofs.every(p=>p.open);proofs.forEach(p=>p.open=open);updateProofControl();});
  proofs.forEach(p=>p.addEventListener('toggle',updateProofControl));
  const revealTarget=()=>{let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(!target)return;const p=target.closest('details.proof');if(p)p.open=true;};
  window.addEventListener('hashchange',revealTarget);revealTarget();
  const outline=$('#reading-outline'),outlineButton=$('.mobile-outline');
  const outlineLinks=new Map($$('.outline-tree a').map(link=>[link.hash.slice(1),link]));
  const outlineBranches=$$('.outline-toggle').map(button=>[button,document.getElementById(button.getAttribute('aria-controls'))]);
  let outlineSection;
  const setBranch=(button,list,open)=>{
    if(!open&&list.contains(document.activeElement))button.focus({preventScroll:true});
    button.setAttribute('aria-expanded',String(open));
    list.hidden=!open;
  };
  for(const [button,list] of outlineBranches)button.addEventListener('click',()=>setBranch(button,list,list.hidden));
  const revealOutline=()=>{
    if(!outlineSection?.getClientRects().length)return;
    const row=outlineSection.getBoundingClientRect(),pane=outline.getBoundingClientRect();
    if(row.top<pane.top)outline.scrollTop+=row.top-pane.top-8;
    if(row.bottom>pane.bottom)outline.scrollTop+=row.bottom-pane.bottom+8;
  };
  const followOutline=section=>{
    const sectionLink=outlineLinks.get(section?.id);
    if(!sectionLink||sectionLink===outlineSection)return;
    outlineSection?.removeAttribute('aria-current');
    outlineSection=sectionLink;
    outlineSection.setAttribute('aria-current','location');
    for(const [button,list] of outlineBranches)setBranch(button,list,list.contains(sectionLink));
    revealOutline();
  };
  const closeOutline=()=>{outline?.classList.remove('is-open');outlineButton?.setAttribute('aria-expanded','false');};
  outlineButton?.addEventListener('click',()=>{const open=outline.classList.toggle('is-open');outlineButton.setAttribute('aria-expanded',String(open));if(open)revealOutline();});
  outline?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeOutline));
  const dock=$('#example-dock');let previousFocus;
  const closeExample=()=>{dock?.classList.remove('is-open');dock?.removeAttribute('aria-modal');dock?.removeAttribute('role');document.body.style.overflow='';previousFocus?.focus({preventScroll:true});};
  const openExample=trigger=>{if(matchMedia('(max-width:760px)').matches){previousFocus=trigger;dock.classList.add('is-open');dock.setAttribute('role','dialog');dock.setAttribute('aria-modal','true');document.body.style.overflow='hidden';$('#close-example').focus({preventScroll:true});dock.dispatchEvent(new Event('examplepanelchange'));drawAll();}else dock.focus({preventScroll:true});};
  $$('[data-show-example]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openExample(a);}));
  $('#close-example')?.addEventListener('click',closeExample);
  $('#open-hypothesis')?.addEventListener('click',()=>{
    if(dock?.classList.contains('is-open'))closeExample();
    closeOutline();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      if(dock?.classList.contains('is-open'))closeExample();
      closeOutline();
    }
    if(event.key!=='Tab'||!dock?.classList.contains('is-open'))return;
    const controls=[...dock.querySelectorAll('button,input,a[href],summary,[tabindex="0"]')].filter(control=>{
      const closed=control.closest('details:not([open])');
      return !control.disabled&&control.getClientRects().length&&(!closed||closed.firstElementChild===control);
    });
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const dataNode=$('#example-data');
  let current='local-functions',follow=true,selectionPinned=false,data={},passages=[],keys=[],lastReading=current,lastReadingContext=null,activeContext=null;
  function initExamples(){
    data=JSON.parse(dataNode.textContent);
    keys=Object.keys(data).filter(key=>data[key].html||data[key].proofHtml);
    current=Object.keys(data)[0];lastReading=current;passages=$$('.passage[data-example]');
    const exampleContent=$('#example-content');
    const openCards=new Map();
    const tools=dock.querySelector('.example-sticky');
    const mobile=()=>matchMedia('(max-width:760px)').matches;
    const editorialCards='[data-example-card]';
    const hiddenEditorial=$('#hidden-editorial-examples');
    const preference='math-expo:scheme:hidden-editorial-examples';
    const hiddenCards=new Map();
    let emptyExample;
    if(hiddenEditorial){
      try{
        for(const [key,label] of JSON.parse(localStorage.getItem(preference)||'[]')){
          if(typeof key==='string'&&typeof label==='string')hiddenCards.set(key,label);
        }
      }catch{}
      emptyExample=document.createElement('p');
      emptyExample.textContent='The examples for this passage are hidden. Open Contents and choose Restore examples.';
      emptyExample.hidden=true;
      exampleContent.after(emptyExample);
    }
    const decorateEditorial=(container,passageLabel)=>{
      if(!hiddenEditorial)return;
      for(const card of container.querySelectorAll(editorialCards)){
        card.hidden=hiddenCards.has(card.dataset.exampleCard);
        card.dataset.editorialLabel=card.querySelector('summary').textContent.trim()+' · '+passageLabel;
        const hide=document.createElement('button');
        hide.type='button';
        hide.className='editorial-example-hide';
        hide.textContent='Hide this example';
        card.querySelector('.example-body').prepend(hide);
      }
    };
    const updateEmptyExample=()=>{
      if(!emptyExample)return;
      const cards=[...exampleContent.querySelectorAll(editorialCards)];
      emptyExample.hidden=!cards.length||cards.some(card=>!card.hidden);
    };
    // Reserve room for every heading before sizing the scrollable body.
    const groupChrome=group=>[...group.children].reduce((height,child)=>{
        if(child.hidden)return height;
        if(!child.matches('.example-disclosure'))return height+child.getBoundingClientRect().height;
        const style=getComputedStyle(child);
        return height+child.querySelector('summary').getBoundingClientRect().height+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
    },0);
    const fitGroup=(group,available,chrome=groupChrome(group))=>{
      group.style.setProperty('--example-body-room',Math.max(0,available-chrome)+'px');
    };
    const fitPanel=()=>{
      if(!exampleContent.getClientRects().length)return;
      const available=innerHeight-Math.max(mobile()?65:99,tools.getBoundingClientRect().top)-16;
      const contentBox=exampleContent.getBoundingClientRect();
      const outside=contentBox.top-tools.getBoundingClientRect().top+exampleContent.parentElement.getBoundingClientRect().bottom-contentBox.bottom+parseFloat(getComputedStyle(tools).paddingBottom);
      fitGroup(exampleContent,Math.max(0,available-outside));
    };
    let layoutAnchors=()=>{},fitFloating=()=>{},layoutPending=false;
    const fitVisibleExamples=()=>{if(mobile()||dock.dataset.exampleLayout!=='anchored')fitPanel();else fitFloating();};
    const layoutExamples=()=>{layoutPending=false;layoutAnchors();fitVisibleExamples();};
    const scheduleExampleLayout=()=>{if(!layoutPending){layoutPending=true;requestAnimationFrame(layoutExamples);}};
    if(hiddenEditorial){
      const list=hiddenEditorial.querySelector('ul');
      const refreshHiddenList=()=>{
        hiddenEditorial.hidden=!hiddenCards.size;
        list.replaceChildren(...[...hiddenCards].map(([key,label])=>{
          const item=document.createElement('li'),restore=document.createElement('button');
          restore.type='button';
          restore.dataset.restoreEditorial=key;
          restore.textContent='Restore '+label;
          item.append(restore);
          return item;
        }));
      };
      const updateHiddenCards=()=>{
        for(const card of dock.querySelectorAll(editorialCards))card.hidden=hiddenCards.has(card.dataset.exampleCard);
        try{localStorage.setItem(preference,JSON.stringify([...hiddenCards]));}catch{}
        refreshHiddenList();
        updateEmptyExample();
        scheduleExampleLayout();
      };
      dock.addEventListener('click',event=>{
        const card=event.target.closest('.editorial-example-hide')?.closest(editorialCards);
        if(!card)return;
        hiddenCards.set(card.dataset.exampleCard,card.dataset.editorialLabel);
        updateHiddenCards();
        const target=card.parentElement.querySelector('details:not([hidden]) > summary');
        if(target)target.focus({preventScroll:true});
        else if(dock.classList.contains('is-open'))$('#close-example').focus();
        else (outlineButton.getClientRects().length?outlineButton:hiddenEditorial.querySelector('summary')).focus({preventScroll:true});
      });
      list.addEventListener('click',event=>{
        const restore=event.target.closest('[data-restore-editorial]');
        if(!restore)return;
        hiddenCards.delete(restore.dataset.restoreEditorial);
        updateHiddenCards();
        if(hiddenEditorial.hidden)hiddenEditorial.open=false;
        (list.querySelector('button')||all).focus({preventScroll:true});
      });
      refreshHiddenList();
    }
    if(dock.dataset.exampleLayout==='anchored'){
      const main=$('#main');
      const flow=document.createElement('div');
      flow.className='example-flow';
      const notes=keys.map(key=>{
        const anchor=document.getElementById(key);
        if(!anchor||!main.contains(anchor)||!data[key].html)return null;
        const section=anchor.classList.contains('source-section');
        const peg=section
          ?anchor.querySelector('.source-heading-row > :is(h2,h3)')||anchor
          :anchor.querySelector('.statement-heading')||anchor;
        const owner=anchor.closest('.source-section')||anchor;
        const band=document.createElement('div');
        band.className='example-band';band.dataset.exampleAnchor=key;
        const note=document.createElement('div');
        note.className='floating-example example-current';
        const label=document.createElement('div');label.className='example-step';
        const link=document.createElement('a');link.href='#'+key;
        link.textContent=anchor.dataset.sourceLabel||peg.textContent.trim();
        label.append(link);note.append(label);
        note.insertAdjacentHTML('beforeend',data[key].html);
        decorateEditorial(note,link.textContent);
        band.append(note);
        return {anchor,peg,section:owner,band,note};
      }).filter(Boolean).sort((a,b)=>a.anchor.compareDocumentPosition(b.anchor)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
      flow.append(...notes.map(note=>note.band));dock.append(flow);
      dock.classList.add('has-floating-examples');
      let stickyTop=99,bands=[];
      layoutAnchors=()=>{
        if(mobile())return;
        for(const {band} of notes)band.hidden=false;
        const origin=flow.getBoundingClientRect().top;
        flow.style.left=getComputedStyle(dock).paddingLeft;
        stickyTop=99+tools.getBoundingClientRect().height+12;
        const available=Math.max(0,innerHeight-stickyTop-16);
        flow.style.setProperty('--example-top',stickyTop+'px');
        flow.style.setProperty('--example-viewport',available+'px');
        const measured=notes.map(entry=>({
          ...entry,
          top:entry.peg.getBoundingClientRect().top,
          chrome:groupChrome(entry.note),
        }));
        const titles=entry=>[...entry.note.querySelectorAll('.example-disclosure > summary')].map(summary=>summary.textContent.trim()).join('\n');
        const visible=measured.filter((entry,index)=>{
          const next=measured[index+1];
          // Prefer the definition's group to an adjacent duplicate at its section introduction.
          const repeated=next&&entry.anchor===entry.section&&next.section===entry.section&&next.top-entry.top<entry.chrome+12&&titles(entry)===titles(next);
          return !repeated&&(!hiddenEditorial||entry.note.querySelector('details.example-disclosure:not([hidden])'));
        });
        const visibleBands=new Set(visible.map(({band})=>band));
        for(const {band} of notes)band.hidden=!visibleBands.has(band);
        bands=window.MathExpoMargins.sectionSpans(visible).map(({band,note,chrome,top,height})=>{
          const room=Math.min(height,available);
          // A short band or viewport scrolls the whole card.
          const compact=room-chrome<32;
          note.classList.toggle('is-compact',compact);
          if(compact)note.tabIndex=0;
          else note.removeAttribute('tabindex');
          band.style.top=top-origin+'px';band.style.height=height+'px';
          band.style.setProperty('--example-span',height+'px');
          fitGroup(note,room,chrome);
          return {band,note,chrome,compact,height};
        });
      };
      fitFloating=()=>{
        const viewportEnd=innerHeight-16;
        for(const {band,note,chrome,compact,height} of bands){
          if(compact)continue;
          const {top,bottom}=band.getBoundingClientRect();
          if(bottom<0||top>=viewportEnd)continue;
          // Size to the viewport on entry. Sticky positioning handles departure at the band end.
          fitGroup(note,Math.min(height,viewportEnd-Math.max(stickyTop,top)),chrome);
        }
      };
      new ResizeObserver(scheduleExampleLayout).observe(main);
    }
    new ResizeObserver(scheduleExampleLayout).observe(tools);
    addEventListener('resize',scheduleExampleLayout);document.fonts?.ready.then(scheduleExampleLayout);
    dock.addEventListener('examplepanelchange',scheduleExampleLayout);
    const setCardOpen=(card,open)=>{
      for(const other of dock.querySelectorAll('[data-example-card]')){
        if(other.dataset.exampleGroup!==card.dataset.exampleGroup)continue;
        if(!open&&other.dataset.exampleCard!==card.dataset.exampleCard)continue;
        const selected=open&&other.dataset.exampleCard===card.dataset.exampleCard;
        openCards.set(other.dataset.exampleCard,selected);
        if(other.open!==selected)other.open=selected;
      }
      scheduleExampleLayout();
    };
    dock.addEventListener('click',event=>{
      const summary=event.target.closest('.example-disclosure > summary');
      if(!summary)return;
      event.preventDefault();setCardOpen(summary.parentElement,!summary.parentElement.open);
    });
    dock.addEventListener('toggle',event=>{
      if(event.target.matches('.example-disclosure[data-example-card]'))setCardOpen(event.target,event.target.open);
      else scheduleExampleLayout();
    },true);
    let renderedExampleHTML;
    const setExample=(key,manual=false,context=null)=>{
      if(!data[key])return;current=key;
      if(manual)follow=false;
      context=context||passages.find(p=>p.dataset.example===key);
      const proof=context?.dataset.proof==='true';
      const changed=activeContext!==context;
      activeContext=context;
      const html=proof&&data[key].proofHtml?data[key].proofHtml:data[key].html;
      const contentChanged=renderedExampleHTML!==html;
      $('.example-paging').hidden=!html;
      $('#example-index').hidden=!html;
      if(contentChanged){
        for(const card of exampleContent.querySelectorAll('[data-example-card]'))openCards.set(card.dataset.exampleCard,card.open);
        exampleContent.innerHTML=html;
        renderedExampleHTML=html;
        decorateEditorial(exampleContent,context?.dataset.sourceLabel||'');
        updateEmptyExample();
        for(const card of exampleContent.querySelectorAll('[data-example-card]')){
          const open=openCards.get(card.dataset.exampleCard);
          if(open!==undefined)card.open=open;
        }
      }
      $('#example-index').textContent=String(keys.indexOf(key)+1).padStart(2,'0');
      $('#example-stage-label').textContent=context?.dataset.sourceLabel||'§26.2 · Locally ringed spaces';
      $('#example-stage-label').href='#'+(context?.id||'local-functions-0');
      $('#follow-reading').setAttribute('aria-pressed',String(follow));$('#follow-reading').textContent=follow?'Following reading':'Follow reading';
      $('#previous-example').disabled=keys.indexOf(key)===0;$('#next-example').disabled=keys.indexOf(key)===keys.length-1;
      if(changed&&contentChanged)$('.example-sticky').scrollTop=0;
      scheduleExampleLayout();
    };
    $('#previous-example').addEventListener('click',()=>{selectionPinned=false;setExample(keys[Math.max(0,keys.indexOf(current)-1)],true);});
    $('#next-example').addEventListener('click',()=>{selectionPinned=false;setExample(keys[Math.min(keys.length-1,keys.indexOf(current)+1)],true);});
    $('#follow-reading').addEventListener('click',()=>{selectionPinned=false;follow=true;setExample(lastReading,false,lastReadingContext);});
    const sections=$$('.source-section');let scheduled=false;
    const contexts=new Map(sections.map(section=>[section,[...section.querySelectorAll('.passage[data-example],.proof-body[data-example]')]]));
    const update=()=>{scheduled=false;
      const denominator=document.documentElement.scrollHeight-innerHeight;
      const readingLine=innerHeight*(denominator-scrollY<=1?.55:.3);
      let section=sections[0];for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.38)section=s;
      const candidates=contexts.get(section)||[];
      let active=candidates[0];
      for(const passage of candidates){
        if(!passage.getClientRects().length)continue;
        if(passage.getBoundingClientRect().top>readingLine)break;
        active=passage;
      }
      if(active&&!dock.classList.contains('is-open')){lastReading=active.dataset.example;lastReadingContext=active;if(follow&&(lastReading!==current||activeContext!==active))setExample(lastReading,false,active);}
      followOutline(section);
      const percent=denominator?Math.max(0,Math.min(1,scrollY/denominator)):0;$('.reading-progress span').style.width=percent*100+'%';
      fitVisibleExamples();
    };
    addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
    addEventListener('resize',update);update();
    addEventListener('hashchange',()=>{
      if(dock.classList.contains('is-open'))closeExample();
      update();
    });
    if(!activeContext)setExample(current);
    proofs.forEach(p=>p.addEventListener('toggle',update));
    const resumeSelection=e=>{if(selectionPinned&&!e.defaultPrevented&&!e.target.closest?.('#example-dock')){selectionPinned=false;follow=true;update();}};
    addEventListener('wheel',resumeSelection,{passive:true});addEventListener('touchmove',resumeSelection,{passive:true});
    addEventListener('keydown',e=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key))resumeSelection(e);});
    outlineLinks.forEach(a=>a.addEventListener('click',resumeSelection));
    window.addEventListener('beforeprint',()=>{proofs.forEach(p=>{p.dataset.printOpen=String(p.open);p.open=true;});});
    window.addEventListener('afterprint',()=>proofs.forEach(p=>p.open=p.dataset.printOpen==='true'));
  }
  if(dataNode){
    // Let the linked passage paint before constructing the example rail.
    if(dock.dataset.exampleLayout==='anchored')requestAnimationFrame(()=>requestAnimationFrame(initExamples));
    else initExamples();
  }
  function drawSphere(canvas,radius=1,angle=0){
    if(!canvas)return;const box=canvas.getBoundingClientRect();if(!box.width)return;
    const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;canvas.width=w*dpr;canvas.height=h*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
    const cx=w*.5,cy=h*.39,R=Math.min(w*.31,h*.36),tilt=.39,yaw=-.38;
    const rotate=(x,y,z)=>{const X=x*Math.cos(yaw)-y*Math.sin(yaw),Y=x*Math.sin(yaw)+y*Math.cos(yaw);return [X,Y*Math.sin(tilt)-z*Math.cos(tilt),Y*Math.cos(tilt)+z*Math.sin(tilt)];};
    const project=v=>[cx+v[0]*R,cy+v[1]*R];
    const grad=ctx.createRadialGradient(cx-R*.4,cy-R*.4,R*.05,cx,cy,R);grad.addColorStop(0,'#fcfcf3');grad.addColorStop(.65,'#edf1df');grad.addColorStop(1,'#d9e2cd');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
    function curve(points,color,width=1){ctx.lineWidth=width;for(let i=1;i<points.length;i++){const p=points[i-1],q=points[i],a=project(p),b=project(q);ctx.strokeStyle=(p[2]+q[2])<0?color+'35':color;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}}
    for(let latitude=-60;latitude<=60;latitude+=30){const phi=latitude*Math.PI/180;curve(Array.from({length:101},(_,i)=>{const t=i*Math.PI*2/100;return rotate(Math.cos(phi)*Math.cos(t),Math.cos(phi)*Math.sin(t),Math.sin(phi));}),'#64836a',latitude===0?1.15:.7);}
    for(let longitude=0;longitude<180;longitude+=30){const t=longitude*Math.PI/180;curve(Array.from({length:101},(_,i)=>{const p=i*Math.PI*2/100;return rotate(Math.cos(p)*Math.cos(t),Math.cos(p)*Math.sin(t),Math.sin(p));}),'#64836a',.7);}
    ctx.strokeStyle='#42664b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
    const a=angle*Math.PI/180,re=radius*Math.cos(a),im=radius*Math.sin(a),den=1+radius*radius,point=rotate(2*re/den,2*im/den,(radius*radius-1)/den),p=project(point);
    const zero=project(rotate(0,0,-1)),inf=project(rotate(0,0,1));
    for(const q of [zero,inf]){ctx.fillStyle='#f7f6f1';ctx.strokeStyle='#285344';ctx.beginPath();ctx.arc(q[0],q[1],3.3,0,Math.PI*2);ctx.fill();ctx.stroke();}
    ctx.setLineDash([3,4]);ctx.strokeStyle='#a9654570';ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(w*.24,h*.88);ctx.moveTo(...p);ctx.lineTo(w*.77,h*.88);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#a65b39';ctx.beginPath();ctx.arc(p[0],p[1],4.6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f7f6f1';ctx.lineWidth=1.6;ctx.stroke();
    const plane=(x,sign)=>{const y=h*.89,rx=w*.14,ry=h*.05;ctx.fillStyle='#edece4';ctx.strokeStyle='#b8b9a8';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#b9bcae';ctx.beginPath();ctx.moveTo(x-rx*.7,y);ctx.lineTo(x+rx*.7,y);ctx.moveTo(x,y-ry*.8);ctx.lineTo(x,y+ry*.8);ctx.stroke();const mod=sign===1?radius:1/radius;ctx.fillStyle='#a65b39';ctx.beginPath();ctx.arc(x+Math.cos(a*sign)*rx*.7*mod/(1+mod),y-Math.sin(a*sign)*ry*.7*mod/(1+mod),2.5,0,Math.PI*2);ctx.fill();};plane(w*.24,1);plane(w*.77,-1);
  }
  function drawAll(){const radius=10**Number($('#point-radius')?.value||0),angle=Number($('#point-angle')?.value||0);drawSphere($('#sphere-canvas'),radius,angle);drawSphere($('#home-sphere'),1.6,40);}
  function coordinates(){const radius=10**Number($('#point-radius').value),angle=Number($('#point-angle').value)*Math.PI/180;const format=(re,im)=>{const f=n=>Math.abs(n)<.005?'0':n.toFixed(2).replace(/\.?0+$/,'');return f(re)+(im<-.005?'-':'+')+f(Math.abs(im))+'i';};const re=radius*Math.cos(angle),im=radius*Math.sin(angle);if(window.katex)$('#coordinate-readout').innerHTML=katex.renderToString('z='+format(re,im)+',\\quad w='+format(re/(radius*radius),-im/(radius*radius)),{throwOnError:true});drawAll();}
  $('#point-radius')?.addEventListener('input',coordinates);$('#point-angle')?.addEventListener('input',coordinates);$('#reset-point')?.addEventListener('click',()=>{$('#point-radius').value=0;$('#point-angle').value=0;coordinates();});
  $('#example-visual')?.addEventListener('toggle',drawAll);
  addEventListener('resize',drawAll);drawAll();document.fonts?.ready.then(drawAll);
})();
