(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  let nextId=0;
  const number=x=>Math.abs(x)<.0005?'0':Number(x.toFixed(3)).toString();
  function element(tag,attrs,parent){
    const node=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);
    parent.appendChild(node);return node;
  }
  window.mountTileLatticeDemo=(holder,{math})=>{
    const id='tile-lattice-'+nextId++,model=window.HAT_TURTLE;
    holder.innerHTML='<span class="margin-label">ONE FIXED LIFT · A MOVING VIEW</span><div class="figure tile-lattice-figure"><h3>A lattice behind the outline.</h3><p class="figure-sub">Turn the viewing plane continuously between hat and turtle.</p><div class="tile-lattice-stage"><canvas aria-hidden="true"></canvas><svg class="tile-outline" role="img" aria-label="The fixed four-dimensional boundary and a finite sample of lattice points projected into the plane"></svg></div><div class="figure-controls tile-view-controls"><button type="button" data-angle="60" aria-pressed="true">Hat</button><button type="button" data-angle="30" aria-pressed="false">Turtle</button><button type="button" class="tile-play" aria-pressed="false">Play transition</button><button type="button" class="tile-rational">Other lattice view</button></div><label class="range-control" for="'+id+'-angle"><span class="range-label"><span>Viewing plane</span><output class="tile-angle-label"></output></span><input id="'+id+'-angle" class="tile-angle" type="range" min="30" max="60" value="60" step=".1"></label><div class="tile-matrix"><span class="tile-small-label">LIVE PROJECTION MATRIX</span><div class="tile-matrix-value"></div></div><details class="tile-lattice-settings" open><summary>Lattice points and depth</summary><div class="tile-checks"><label><input type="checkbox" class="tile-show-dots" checked> Show lattice dots</label><label><input type="checkbox" class="tile-fade" checked> Fade by perpendicular distance</label></div><label class="range-control" for="'+id+'-width"><span class="range-label"><span>Window radius</span><output class="tile-width-label"></output></span><input id="'+id+'-width" class="tile-window-width" type="range" min=".25" max="3" step=".05" value="1.7"></label><label class="range-control" for="'+id+'-offset"><span class="range-label"><span>Move the window perpendicularly</span><output class="tile-offset-label"></output></span><input id="'+id+'-offset" class="tile-window-offset" type="range" min="-3" max="3" step=".05" value="0"></label><label class="range-control" for="'+id+'-sample"><span class="range-label"><span>Lattice sample radius</span><output class="tile-sample-label"></output></span><input id="'+id+'-sample" class="tile-sample-radius" type="range" min="2" max="5" step="1" value="4"></label><span class="tile-small-label tile-hidden-label">PERPENDICULAR VIEW · THE TWO HIDDEN COORDINATES</span><canvas class="tile-internal-view" role="img" aria-label="Perpendicular coordinates of the lattice sample, with the movable round window and the tile vertices"></canvas><div class="tile-window-count"></div></details><p class="figure-caption tile-lattice-caption">A finite sample of the whole lattice. Darker dots lie nearer the center of the round window in the two perpendicular coordinates. The outline stays visible as a reference.</p><p class="tile-density-note"></p><p class="tile-source"><a href="https://liuyao12.github.io/geometric-tree-search/apps/hat-turtle-projection/?view=tile" target="_blank" rel="noopener">Explore the original construction ↗</a></p><span class="sr-only tile-animation-status" aria-live="polite"></span></div>';
    const root=holder.querySelector('.tile-lattice-figure'),stage=root.querySelector('.tile-lattice-stage');
    const canvas=stage.querySelector('canvas'),svg=stage.querySelector('svg'),internalCanvas=root.querySelector('.tile-internal-view');
    const angleInput=root.querySelector('.tile-angle'),widthInput=root.querySelector('.tile-window-width'),offsetInput=root.querySelector('.tile-window-offset'),sampleInput=root.querySelector('.tile-sample-radius');
    const showDots=root.querySelector('.tile-show-dots'),fade=root.querySelector('.tile-fade'),play=root.querySelector('.tile-play');
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
    let angle=60,frame=0,hold=0,loop=false,dead=false,lastMath=-Infinity,sample=model.sampleLattice(4);
    const all=Array.from({length:121},(_,i)=>model.project((30+i/4)*Math.PI/180)).flat();
    const maxX=Math.max(...all.map(v=>Math.abs(v[0]))),maxY=Math.max(...all.map(v=>Math.abs(v[1])));
    function sizeCanvas(node,w,h){
      const dpr=Math.min(devicePixelRatio||1,2),pw=Math.round(w*dpr),ph=Math.round(h*dpr);
      if(node.width!==pw||node.height!==ph){node.width=pw;node.height=ph;}
      const ctx=node.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return ctx;
    }
    function readouts(theta,count,force){
      const now=performance.now();
      if(!force&&now-lastMath<100)return;
      lastMath=now;
      const matrix=model.matrix(theta),tex='M_\\theta=\\begin{pmatrix}'+matrix.map(row=>row.map(number).join('&')).join('\\\\')+'\\end{pmatrix}';
      math(root.querySelector('.tile-matrix-value'),tex,true);
      math(root.querySelector('.tile-angle-label'),'\\theta='+number(angle)+'^{\\circ}');
      math(root.querySelector('.tile-width-label'),'h='+number(+widthInput.value));
      math(root.querySelector('.tile-offset-label'),'a='+number(+offsetInput.value));
      math(root.querySelector('.tile-sample-label'),'R='+sampleInput.value);
      math(root.querySelector('.tile-window-count'),'\\text{tile vertices in window: }'+count+'/14');
      root.querySelector('.tile-density-note').textContent=Math.abs(angle-60)<1e-7?'Hat view: a discrete lattice image.':Math.abs(angle-30)<1e-7?'Turtle view: a discrete lattice image.':Math.abs(angle-rationalAngle)<1e-7?'Another discrete lattice image, between hat and turtle.':'Rational slopes give lattice images; irrational slopes give dense images of the full infinite lattice.';
    }
    function draw(force=true){
      if(dead)return;
      const w=stage.getBoundingClientRect().width||300,h=Math.max(250,Math.min(330,w)),theta=angle*Math.PI/180;
      stage.style.height=h+'px';svg.setAttribute('viewBox','0 0 '+w+' '+h);
      const ctx=sizeCanvas(canvas,w,h),hiddenW=internalCanvas.getBoundingClientRect().width||w,hiddenH=130,hiddenCtx=sizeCanvas(internalCanvas,hiddenW,hiddenH);
      const scale=Math.min((w-70)/(2*maxX),(h-65)/(2*maxY)),screen=v=>[w/2+scale*v[0],h/2-scale*v[1]];
      const c=Math.cos(theta),s=Math.sin(theta),windowRadius=+widthInput.value,offset=+offsetInput.value;
      const hs=hiddenH/10,hiddenPoint=v=>[hiddenW/2+hs*v[0],hiddenH/2-hs*v[1]];
      hiddenCtx.strokeStyle='#dce0d3';hiddenCtx.beginPath();hiddenCtx.moveTo(0,hiddenH/2);hiddenCtx.lineTo(hiddenW,hiddenH/2);hiddenCtx.moveTo(hiddenW/2,0);hiddenCtx.lineTo(hiddenW/2,hiddenH);hiddenCtx.stroke();
      let visible=0;
      if(showDots.checked)for(const {relative:v} of sample){
        const x=c*v[0]+s*v[2],y=c*v[1]+s*v[3],a=-s*v[0]+c*v[2],b=-s*v[1]+c*v[3],distance=Math.hypot(a-offset,b);
        const alpha=fade.checked ? .72*Math.exp(-3*(distance/windowRadius)**2) : .18;
        const px=w/2+scale*x,py=h/2-scale*y;
        if(px>-3&&px<w+3&&py>-3&&py<h+3&&alpha>.003){
          ctx.fillStyle='rgba(57,103,141,'+alpha+')';ctx.beginPath();ctx.arc(px,py,fade.checked?1.75:1.35,0,Math.PI*2);ctx.fill();visible++;
        }
        const hp=hiddenPoint([a,b]);
        if(hp[0]>0&&hp[0]<hiddenW&&hp[1]>0&&hp[1]<hiddenH){hiddenCtx.fillStyle=distance<=windowRadius?'#537e681f':'#8d998b0b';hiddenCtx.fillRect(hp[0],hp[1],1,1);}
      }
      root.dataset.visibleDots=String(visible);root.dataset.sampleSize=String(sample.length);root.dataset.angle=String(angle);
      const hc=hiddenPoint([offset,0]);hiddenCtx.fillStyle='#68826514';hiddenCtx.strokeStyle='#688265';hiddenCtx.beginPath();hiddenCtx.arc(hc[0],hc[1],hs*windowRadius,0,Math.PI*2);hiddenCtx.fill();hiddenCtx.stroke();
      hiddenCtx.fillStyle='#688265';hiddenCtx.fillRect(hc[0]-2,hc[1]-2,4,4);
      svg.replaceChildren();const points=model.project(theta);
      element('polygon',{points:points.map(screen).map(v=>v.join(',')).join(' '),fill:'#e3e9dc','fill-opacity':.28},svg);
      let count=0;
      points.forEach((v,i)=>{
        const p=screen(v),next=screen(points[(i+1)%points.length]);
        element('line',{x1:p[0],y1:p[1],x2:next[0],y2:next[1],stroke:model.edgeFamily(i)==='first'?'#396fa2':'#b36a35','stroke-width':2.5},svg);
        element('circle',{cx:p[0],cy:p[1],r:i===10?4:2,fill:i===10?'#285746':'#394d3c'},svg);
        const internal=model.internal(model.centered[i],theta),hp=hiddenPoint(internal);
        const inside=Math.hypot(internal[0]-offset,internal[1])<=windowRadius;
        if(inside)count++;
        hiddenCtx.fillStyle=inside?'#285746':'#b36a35';hiddenCtx.beginPath();hiddenCtx.arc(hp[0],hp[1],2.2,0,Math.PI*2);hiddenCtx.fill();
      });
      root.dataset.tileVerticesInWindow=String(count);
      root.querySelector('.tile-lattice-caption').textContent=!showDots.checked
        ? 'Lattice dots are hidden. The outline and the perpendicular view of its vertices remain visible.'
        :fade.checked
          ? 'A finite sample of the lattice. Each dot fades with distance in the two perpendicular coordinates. Turn off depth fading and increase the sample to compare the whole projected lattice. The outline stays visible as a reference.'
          : 'All sampled lattice points have equal opacity. Increase the sample to see the crowding at a generic angle. Overlapping projected points may look darker. The round window is still shown below.';
      root.querySelectorAll('[data-angle]').forEach(button=>button.setAttribute('aria-pressed',String(Math.abs(+button.dataset.angle-angle)<1e-7)));
      root.querySelector('.tile-rational').setAttribute('aria-pressed',String(Math.abs(angle-rationalAngle)<1e-7));
      angleInput.setAttribute('aria-valuetext',number(angle)+' degrees');
      readouts(theta,count,force);
    }
    function stop(){
      cancelAnimationFrame(frame);clearTimeout(hold);frame=0;loop=false;
      play.textContent='Play transition';play.setAttribute('aria-pressed','false');root.dataset.animating='false';
    }
    function transition(target,repeating=false){
      cancelAnimationFrame(frame);clearTimeout(hold);
      const startAngle=angle,start=performance.now(),duration=Math.max(450,2300*Math.abs(target-angle)/30);
      root.dataset.animating='true';
      function tick(now){
        if(dead)return;
        const t=Math.min(1,(now-start)/duration),ease=(1-Math.cos(Math.PI*t))/2;
        angle=startAngle+(target-startAngle)*ease;angleInput.value=String(angle);draw(t===1);
        if(t<1)frame=requestAnimationFrame(tick);
        else{
          root.dataset.animating='false';root.querySelector('.tile-animation-status').textContent=number(angle)+' degree view.';
          if(repeating&&loop)hold=setTimeout(()=>transition(target===60?30:60,true),450);
        }
      }
      frame=requestAnimationFrame(tick);
    }
    const rationalAngle=Math.atan(Math.sqrt(3)/2)*180/Math.PI;
    root.querySelectorAll('[data-angle]').forEach(button=>button.addEventListener('click',()=>{stop();transition(+button.dataset.angle);}));
    root.querySelector('.tile-rational').addEventListener('click',()=>{stop();transition(rationalAngle);});
    play.addEventListener('click',()=>{
      if(loop){stop();draw();return;}
      loop=true;play.textContent='Pause transition';play.setAttribute('aria-pressed','true');transition(angle>45?30:60,true);
    });
    angleInput.addEventListener('input',()=>{stop();angle=+angleInput.value;draw();});
    for(const input of [widthInput,offsetInput,showDots,fade])input.addEventListener('input',()=>draw());
    sampleInput.addEventListener('input',()=>{sample=model.sampleLattice(+sampleInput.value);draw();});
    // Explicit play remains available with reduced motion; nothing plays automatically.
    const preferenceChanged=()=>{if(reducedMotion.matches){stop();draw();}};
    reducedMotion.addEventListener('change',preferenceChanged);
    const observer=new ResizeObserver(()=>draw());observer.observe(stage);draw();
    return ()=>{dead=true;stop();observer.disconnect();reducedMotion.removeEventListener('change',preferenceChanged);};
  };
})();
