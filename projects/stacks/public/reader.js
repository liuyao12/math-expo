(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const proofs=$$('details.proof'),all=$('#toggle-proofs');
  const updateProofControl=()=>{if(!all)return;const open=proofs.length>0&&proofs.every(p=>p.open);all.textContent=open?'Hide all proofs':'Show all proofs';all.setAttribute('aria-pressed',String(open));};
  all?.addEventListener('click',()=>{const open=!proofs.every(p=>p.open);proofs.forEach(p=>p.open=open);updateProofControl();});
  proofs.forEach(p=>p.addEventListener('toggle',updateProofControl));
  const revealTarget=()=>{let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(!target)return;const p=target.closest('details.proof');if(p)p.open=true;};
  window.addEventListener('hashchange',revealTarget);revealTarget();
  const outline=$('#reading-outline'),outlineButton=$('.contents-toggle');
  const outlineOverlay=matchMedia('(max-width:1000px)');
  const readingTools=$('.reading-tools');
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
  const syncOutline=()=>{
    if(!outline)return;
    const open=outlineOverlay.matches?outline.classList.contains('is-open'):!outline.classList.contains('is-collapsed');
    outlineButton.setAttribute('aria-expanded',String(open));
    if(open)revealOutline();
    else if(outline.contains(document.activeElement))outlineButton.focus({preventScroll:true});
  };
  const closeOutline=()=>{
    if(!outlineOverlay.matches||!outline?.classList.contains('is-open'))return;
    outline.classList.remove('is-open');
    syncOutline();
  };
  const toggleDesktopOutline=()=>{
    const main=$('#main');
    const {left,width}=main.getBoundingClientRect();
    const headerBottom=outlineButton.closest('.reader-header').getBoundingClientRect().bottom;
    // Keep a visible block in place as the wider or narrower column reflows.
    let anchor;
    for(let y=headerBottom+12;y<Math.min(headerBottom+200,innerHeight);y+=16){
      const hit=document.elementFromPoint(left+width*.35,y)?.closest('p,li,.math-display,summary,.statement-heading,.source-section-header');
      if(hit&&main.contains(hit)){anchor=hit;break;}
    }
    const top=anchor?.getBoundingClientRect().top;
    outline.classList.toggle('is-collapsed');
    if(anchor)scrollBy({top:anchor.getBoundingClientRect().top-top,behavior:'instant'});
  };
  outlineButton?.addEventListener('click',()=>{
    if(outlineOverlay.matches)outline.classList.toggle('is-open');
    else toggleDesktopOutline();
    syncOutline();
  });
  outlineOverlay.addEventListener('change',syncOutline);
  syncOutline();
  outline?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeOutline));
  readingTools?.addEventListener('click',event=>{if(event.target.closest('a'))readingTools.open=false;});
  document.addEventListener('pointerdown',event=>{if(readingTools?.open&&!readingTools.contains(event.target))readingTools.open=false;});
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
      if(readingTools?.open){
        readingTools.open=false;
        readingTools.querySelector('summary').focus({preventScroll:true});
      }
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
  const annotationModule=new URL('hypothesis-notes.js',document.currentScript.src);
  annotationModule.search=new URL(document.currentScript.src).search;
  let current='local-functions',follow=true,selectionPinned=false,data={},passages=[],keys=[],lastReading=current,lastReadingContext=null,activeContext=null;
  function initExamples(){
    data=JSON.parse(dataNode.textContent);
    keys=Object.keys(data).filter(key=>data[key].html||data[key].proofHtml);
    current=Object.keys(data)[0];lastReading=current;passages=$$('.passage[data-example]');
    const exampleContent=$('#example-content');
    const annotationKeys=new Map(),annotationHTML=new Map();
    let mountAnnotations;
    const openCards=new Map();
    const tools=dock.querySelector('.example-sticky');
    const mobile=()=>matchMedia('(max-width:760px)').matches;
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
    if(dock.dataset.exampleLayout==='anchored'){
      const main=$('#main');
      const viewportReading=main.classList.contains('viewport-reading');
      const flow=document.createElement('div');
      flow.className='example-flow';
      const makeNote=(key,anchor,peg,html)=>{
        const section=anchor.closest('.source-section')||anchor;
        const band=document.createElement('div');
        band.className='example-band';band.dataset.exampleAnchor=key;
        band.hidden=true;
        const note=document.createElement('div');
        note.className='floating-example example-current';
        const label=document.createElement('div');label.className='example-step';
        const link=document.createElement('a');link.href='#'+anchor.id;
        link.textContent=anchor.closest('.passage')?.dataset.sourceLabel||anchor.dataset.sourceLabel||peg.textContent.trim();
        label.append(link);note.append(label);
        band.append(note);
        return {key,anchor,peg,section,band,note,html,mounted:false};
      };
      const notes=keys.flatMap(key=>{
        const anchor=document.getElementById(key);
        if(!anchor||!main.contains(anchor)||!data[key].html)return [];
        const peg=anchor.classList.contains('source-section')
          ?anchor.querySelector('.source-heading-row > :is(h2,h3)')||anchor
          :anchor.querySelector('.statement-heading')||anchor;
        return [makeNote(key,anchor,peg,data[key].html)];
      });
      const textOrder=(a,b)=>a===b?0:a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1;
      notes.sort((a,b)=>textOrder(a.anchor,b.anchor));
      flow.append(...notes.map(note=>note.band));dock.append(flow);
      mountAnnotations=rows=>{
        const byAnchor=new Map(notes.map(note=>[note.anchor,note]));
        const grouped=new Map();
        for(const {id,block,card} of rows){
          const passage=block.closest('.passage');
          const sourceAnchor=block.matches('.passage:not(.prose) > .source-body')?passage:block;
          let entry=byAnchor.get(sourceAnchor);
          if(!entry){
            if(!sourceAnchor.id)sourceAnchor.id='hypothesis-paragraph-'+id;
            const key=sourceAnchor.id;
            entry=makeNote(key,sourceAnchor,block,'');
            byAnchor.set(sourceAnchor,entry);
            notes.push(entry);
            data[key]??={html:''};
            annotationKeys.set(sourceAnchor,key);
            const candidates=contexts.get(entry.section);
            if(candidates)candidates.push(sourceAnchor);
          }
          const noteCard=card(entry.key);
          noteCard.open=!entry.html&&!entry.note.querySelector('.example-disclosure');
          const html=noteCard.outerHTML;
          if(entry.mounted)entry.note.append(noteCard);
          else entry.html+=html;
          if(!grouped.has(entry.key))grouped.set(entry.key,[]);
          grouped.get(entry.key).push(html);
        }
        for(const [key,cards] of grouped)annotationHTML.set(key,cards.join(''));
        for(const candidates of contexts.values())candidates.sort(textOrder);
        notes.sort((a,b)=>textOrder(a.anchor,b.anchor));
        flow.append(...notes.map(note=>note.band));
        update();
        setExample(current,false,activeContext);
        scheduleExampleLayout();
      };
      main.addEventListener('scroll',scheduleExampleLayout,{capture:true,passive:true});
      dock.classList.add('has-floating-examples');
      let stickyTop=99,bands=[];
      layoutAnchors=()=>{
        if(mobile())return;
        const previousBands=bands;
        const nearbySections=new Map();
        const nearby=notes.filter(({section})=>{
          if(!viewportReading)return true;
          if(!nearbySections.has(section)){
            const {top,bottom}=section.getBoundingClientRect();
            nearbySections.set(section,bottom>=-innerHeight&&top<=2*innerHeight&&
              (section.firstElementChild.checkVisibility?.({contentVisibilityAuto:true})??true));
          }
          return nearbySections.get(section);
        });
        for(const entry of nearby){
          if(!entry.mounted){
            entry.note.insertAdjacentHTML('beforeend',entry.html);
            for(const card of entry.note.querySelectorAll('[data-example-card]')){
              const open=openCards.get(card.dataset.exampleCard);
              if(open!==undefined)card.open=open;
            }
            entry.mounted=true;
          }
          entry.band.hidden=false;
        }
        const origin=flow.getBoundingClientRect().top;
        flow.style.left=getComputedStyle(dock).paddingLeft;
        stickyTop=99+tools.getBoundingClientRect().height+12;
        const available=Math.max(0,innerHeight-stickyTop-16);
        flow.style.setProperty('--example-top',stickyTop+'px');
        flow.style.setProperty('--example-viewport',available+'px');
        const measured=nearby.filter(({peg})=>{
          if(peg.closest('details:not([open])')||!peg.getClientRects().length)return false;
          const proof=peg.closest('.proof-body');
          if(!proof)return true;
          const bounds=proof.getBoundingClientRect(),position=peg.getBoundingClientRect();
          return position.top<bounds.bottom&&position.bottom>bounds.top;
        }).map(entry=>({
          ...entry,
          top:entry.peg.getBoundingClientRect().top,
          chrome:groupChrome(entry.note),
        }));
        const titles=entry=>[...entry.note.querySelectorAll('.example-disclosure .example-title')].map(title=>title.textContent.trim()).join('\n');
        const visible=measured.filter((entry,index)=>{
          const next=measured[index+1];
          // Prefer the definition's group to an adjacent duplicate at its section introduction.
          const repeated=next&&entry.anchor===entry.section&&next.section===entry.section&&next.top-entry.top<entry.chrome+12&&titles(entry)===titles(next);
          return !repeated;
        });
        const visibleBands=new Set(visible.map(({band})=>band));
        for(const {band} of [...previousBands,...nearby])band.hidden=!visibleBands.has(band);
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
      if(viewportReading){
        addEventListener('scroll',scheduleExampleLayout,{passive:true});
        main.addEventListener('contentvisibilityautostatechange',scheduleExampleLayout,true);
      }
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
      const authored=proof&&data[key].proofHtml?data[key].proofHtml:data[key].html;
      const html=authored+(annotationHTML.get(key)||'');
      const contentChanged=renderedExampleHTML!==html;
      const index=keys.indexOf(key);
      $('.example-paging').hidden=!html||index<0;
      $('#example-index').hidden=!html||index<0;
      if(contentChanged){
        for(const card of exampleContent.querySelectorAll('[data-example-card]'))openCards.set(card.dataset.exampleCard,card.open);
        exampleContent.innerHTML=html;
        renderedExampleHTML=html;
        for(const card of exampleContent.querySelectorAll('[data-example-card]')){
          const open=openCards.get(card.dataset.exampleCard);
          if(open!==undefined)card.open=open;
        }
      }
      $('#example-index').textContent=String(index+1).padStart(2,'0');
      $('#example-stage-label').textContent=context?.dataset.sourceLabel||context?.closest('.passage')?.dataset.sourceLabel||'§26.2 · Locally ringed spaces';
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
      let low=0,high=sections.length-1;
      while(low<high){
        const middle=Math.ceil((low+high)/2);
        if(sections[middle].getBoundingClientRect().top<innerHeight*.38)low=middle;
        else high=middle-1;
      }
      const section=sections[low];
      const candidates=contexts.get(section)||[];
      let active=candidates[0];
      for(const passage of candidates){
        if(passage.closest('details:not([open])')||!passage.getClientRects().length)continue;
        if(passage.getBoundingClientRect().top>readingLine)break;
        active=passage;
      }
      if(active&&!dock.classList.contains('is-open')){lastReading=annotationKeys.get(active)||active.dataset.example;lastReadingContext=active;if(follow&&(lastReading!==current||activeContext!==active))setExample(lastReading,false,active);}
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
    layoutExamples();
    if(mountAnnotations)import(annotationModule.href)
      .then(({loadHypothesisNotes})=>loadHypothesisNotes($('#main')))
      .then(rows=>{if(rows.length)mountAnnotations(rows);})
      .catch(()=>{ /* Keep the editorial margin usable when Hypothesis is unavailable. */ });
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
