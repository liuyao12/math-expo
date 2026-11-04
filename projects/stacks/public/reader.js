(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const proofs=$$('details.proof'),all=$('#toggle-proofs');
  const updateProofControl=()=>{if(!all)return;const open=proofs.length>0&&proofs.every(p=>p.open);all.textContent=open?'Hide all proofs':'Show all proofs';all.setAttribute('aria-pressed',String(open));};
  all?.addEventListener('click',()=>{const open=!proofs.every(p=>p.open);proofs.forEach(p=>p.open=open);updateProofControl();});
  proofs.forEach(p=>p.addEventListener('toggle',updateProofControl));
  const revealTarget=()=>{let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(!target)return;const p=target.closest('details.proof');if(p)p.open=true;};
  window.addEventListener('hashchange',revealTarget);revealTarget();
  const search=$('#chapter-search');
  search?.addEventListener('input',()=>{const words=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;$$('.chapter-link').forEach(a=>{const show=words.every(w=>a.dataset.search.includes(w));a.hidden=!show;if(show)count++;});$('#chapter-count').textContent=count+' chapter'+(count===1?'':'s');$('#empty-search').hidden=count!==0;});
  const outline=$('#reading-outline'),outlineButton=$('.mobile-outline');
  const closeOutline=()=>{outline?.classList.remove('is-open');outlineButton?.setAttribute('aria-expanded','false');};
  outlineButton?.addEventListener('click',()=>{const open=outline.classList.toggle('is-open');outlineButton.setAttribute('aria-expanded',String(open));});
  outline?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeOutline));
  const dock=$('#example-dock');let previousFocus;
  const closeExample=()=>{dock?.classList.remove('is-open');dock?.removeAttribute('aria-modal');dock?.removeAttribute('role');document.body.style.overflow='';previousFocus?.focus();};
  $$('[data-show-example]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(matchMedia('(max-width:760px)').matches){previousFocus=a;dock.classList.add('is-open');dock.setAttribute('role','dialog');dock.setAttribute('aria-modal','true');document.body.style.overflow='hidden';$('#close-example').focus();drawAll();}else dock.focus({preventScroll:true});}));
  $('#close-example')?.addEventListener('click',closeExample);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeExample();closeOutline();}if(e.key==='Tab'&&dock?.classList.contains('is-open')){const controls=[...dock.querySelectorAll('button,input,a[href]')].filter(e=>!e.disabled),first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  const dataNode=$('#example-data');
  let current='local-functions',follow=true,data={},passages=[],keys=[],lastReading=current;
  if(dataNode){
    data=JSON.parse(dataNode.textContent);keys=Object.keys(data);passages=$$('.passage[data-example]');
    const setExample=(key,manual=false)=>{
      if(!data[key])return;current=key;
      if(manual)follow=false;
      $('#example-title').textContent=data[key].title;$('#example-content').innerHTML=data[key].html;
      $('#example-index').textContent=String(keys.indexOf(key)+1).padStart(2,'0');
      const section=passages.find(p=>p.dataset.example===key)?.closest('.source-section');
      $('#example-stage-label').textContent='Alongside §'+(section?.querySelector('.eyebrow').textContent.split('§')[1]||'26.2');
      $('#follow-reading').setAttribute('aria-pressed',String(follow));$('#follow-reading').textContent=follow?'Following reading':'Follow reading';
      $('#previous-example').disabled=keys.indexOf(key)===0;$('#next-example').disabled=keys.indexOf(key)===keys.length-1;
      dock.dataset.focus=data[key].focus;drawAll();
    };
    $('#previous-example').addEventListener('click',()=>setExample(keys[Math.max(0,keys.indexOf(current)-1)],true));
    $('#next-example').addEventListener('click',()=>setExample(keys[Math.min(keys.length-1,keys.indexOf(current)+1)],true));
    $('#follow-reading').addEventListener('click',()=>{follow=true;setExample(lastReading);});
    const sections=$$('.source-section');let scheduled=false;
    const update=()=>{scheduled=false;let active=passages[0];for(const p of passages){if(p.getBoundingClientRect().top<=innerHeight*.38)active=p;else break;}if(active){lastReading=active.dataset.example;if(follow&&lastReading!==current)setExample(lastReading);}
      let section=sections[0];for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.38)section=s;
      $$('[data-outline]').forEach(a=>{if(a.dataset.outline===section?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
      const denominator=document.documentElement.scrollHeight-innerHeight;const percent=denominator?Math.max(0,Math.min(1,scrollY/denominator)):0;$('.reading-progress span').style.width=percent*100+'%';
    };
    addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
    addEventListener('resize',update);setExample(current);update();
    window.addEventListener('beforeprint',()=>{proofs.forEach(p=>{p.dataset.printOpen=String(p.open);p.open=true;});});
    window.addEventListener('afterprint',()=>proofs.forEach(p=>p.open=p.dataset.printOpen==='true'));
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
  addEventListener('resize',drawAll);drawAll();document.fonts?.ready.then(drawAll);
})();
