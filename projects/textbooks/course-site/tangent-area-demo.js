// Coordinate forms read vectors; their wedges read oriented parallelograms.
(() => {
  'use strict';
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const scale=(a,k)=>a.map(x=>x*k);
  const p=[1,1,1].map(x=>x/Math.sqrt(3)),q=[1,-1,0].map(x=>x/Math.sqrt(2)),r=[1,1,-2].map(x=>x/Math.sqrt(6));
  const vector=coordinates=>add(scale(q,coordinates[0]),scale(r,coordinates[1]));
  const pairs=[[0,1],[1,2],[2,0]],names=['x','y','z'];
  const wedge=(u,v,i,j)=>u[i]*v[j]-u[j]*v[i];
  function patch(w,epsilon){
    if(epsilon===0)return w.slice();
    // Stable form of (normalize(p + epsilon*w) - p)/epsilon for tangent w.
    const n=Math.sqrt(1+epsilon*epsilon*dot(w,w));
    return add(scale(w,1/n),scale(p,-epsilon*dot(w,w)/(n*(n+1))));
  }
  const readings=[
    ...names.map((name,axis)=>({degree:1,axis,tex:'\\mathrm d'+name,aria:'Read the '+name+' coordinate'})),
    ...pairs.map(([i,j])=>({degree:2,axes:[i,j],tex:'\\mathrm d'+names[i]+'\\wedge\\mathrm d'+names[j],aria:'Measure signed '+names[i]+names[j]+' projected area'}))
  ];
  function measure(u,v,reading){
    return reading.degree===1?[u[reading.axis],v[reading.axis]]:[wedge(u,v,...reading.axes)];
  }
  const formulas={
    u:'u',v:'v',origin:'0',high:'1',zero:'0',low:'-1',
    positive:'\\text{positive}',negative:'\\text{negative}',
    p:'p=\\frac1{\\sqrt3}[1,1,1]',
    plane:'T_pS^2',epsilon:'\\epsilon',
    area:'(u,v).(\\mathrm dx\\wedge\\mathrm dy)'
  };
  const valueTex=value=>Math.abs(value)<.0005?'0':value.toFixed(3);
  const evaluationTex=(reading,slot)=>reading.degree===1?(slot===0?'u':'v')+'.('+reading.tex+')':'(u,v).('+reading.tex+')';
  const rowTex=(name,v)=>name+'=['+v.map(valueTex).join(',')+']';
  window.TANGENT_AREA={p,q,r,vector,wedge,patch,readings,measure,formulas,evaluationTex,rowTex,valueTex};

  window.mountTangentAreaDemo=(holder,{math})=>{
    holder.innerHTML='<figure class="figure tangent-area-example">'+
      '<h3>The tangent plane is a measuring space.</h3>'+
      '<p class="area-intro">Watch a magnified surface patch flatten into its tangent plane. Drag either arrowhead to change the tangent vectors.</p>'+
      '<label class="area-zoom-label">Zoom from the surface patch to its tangent plane<input class="area-zoom" type="range" min="0" max="100" value="100" step="1"></label>'+
      '<div class="area-zoom-readout"></div>'+
      '<div class="area-reading-choices" role="group" aria-label="Choose a coordinate or area measurement">'+
      readings.map((reading,i)=>'<button type="button" data-reading="'+i+'" aria-pressed="'+(i===3)+'" aria-label="'+reading.aria+'"><span></span></button>').join('')+'</div>'+
      '<div class="area-experiment">'+
      '<div class="area-plane-stage"><canvas width="800" height="720" tabindex="0" role="img" aria-label="An oriented parallelogram in a tangent plane, spanned by two draggable tangent vectors. Drag either arrowhead. Arrow keys move the last selected vector.">'+
      '</canvas><span class="area-vector-label" data-vector="u"></span><span class="area-vector-label" data-vector="v"></span><span class="area-origin"></span></div>'+
      '<div class="area-thermometers"></div></div>'+
      '<div class="area-evaluation"></div>'+
      '<div class="area-vector-values"><div data-vector-value="u"></div><div data-vector-value="v"></div></div>'+
      '<div class="figure-controls"><button type="button" class="area-play"></button><button type="button" class="area-swap">Swap vectors</button><button type="button" class="area-align">Make parallel</button><button type="button" class="area-replay">Replay zoom</button></div>'+
      '<figcaption class="figure-caption">Red is a positive reading; blue is a negative reading. A wedge reads signed projected area. Swapping the vectors reverses its sign, and parallel vectors give zero. This is a window into the unbounded tangent plane. Arrow keys move the last selected vector.</figcaption></figure>';
    const root=holder.querySelector('.tangent-area-example'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
    ctx.scale(2,2);
    const zoomInput=root.querySelector('.area-zoom'),play=root.querySelector('.area-play'),buttons=[...root.querySelectorAll('[data-reading]')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const normal=add(scale(p,.75),add(scale(q,.5),scale(r,.35))),norm=Math.hypot(...normal);
    const n=scale(normal,1/norm),yaw=Math.atan2(n[1],n[0]),pitch=Math.asin(n[2]);
    const {horizontal,vertical}=window.SPHERE_TANGENT.cameraFrame(yaw,pitch);
    const project=w=>[200+85*dot(w,horizontal),180-85*dot(w,vertical)];
    let coordinates=[[.9,.1],[.12,.9]],selected=3,zoom=1,playing=!reduced.matches,visible=false,dead=false,raf=0,last=0,lastMath=-Infinity,dragging=null,lastVector=1;
    if(playing)zoom=0;
    buttons.forEach((button,i)=>math(button.firstElementChild,readings[i].tex));
    math(root.querySelector('[data-vector=u]'),'u');math(root.querySelector('[data-vector=v]'),'v');math(root.querySelector('.area-origin'),'0');
    function path(points,fill,stroke,width=1,dash=[]){
      ctx.beginPath();points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
      if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
    }
    function arrow(v,color){
      const a=project([0,0,0]),b=project(v),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
      path([[0,0,0],v],null,color,2.4);
      if(length>1){
        const ux=dx/length,uy=dy/length;
        ctx.beginPath();ctx.moveTo(...b);ctx.lineTo(b[0]-7*ux+3*uy,b[1]-7*uy-3*ux);ctx.lineTo(b[0]-7*ux-3*uy,b[1]-7*uy+3*ux);ctx.closePath();ctx.fillStyle=color;ctx.fill();
      }
      ctx.beginPath();ctx.arc(...b,4.8,0,Math.PI*2);ctx.fillStyle='#fafaf4';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=color;ctx.stroke();
    }
    function makeMeters(){
      const count=readings[selected].degree===1?2:1;
      root.querySelector('.area-thermometers').innerHTML=Array.from({length:count},(_,i)=>'<div class="area-meter"><div class="area-meter-input"></div><div class="area-meter-track"><span class="area-meter-fill"></span><span class="area-meter-zero"></span><span class="area-meter-tick area-meter-high"></span><span class="area-meter-tick area-meter-mid"></span><span class="area-meter-tick area-meter-low"></span></div><div class="area-meter-value"></div></div>').join('');
      root.querySelectorAll('.area-meter').forEach((meter,i)=>{
        math(meter.querySelector('.area-meter-input'),readings[selected].degree===1?(i===0?'u':'v'):'(u,v)');
        for(const [className,tex] of [['high','1'],['mid','0'],['low','-1']])math(meter.querySelector('.area-meter-'+className),tex);
      });
    }
    function draw(timestamp=0,forceMath=false){
      const [u,v]=coordinates.map(vector),reading=readings[selected],values=measure(u,v,reading),area=wedge(u,v,...(reading.axes||[0,1]));
      root.dataset.u=JSON.stringify(u);root.dataset.v=JSON.stringify(v);root.dataset.reading=String(selected);root.dataset.values=JSON.stringify(values);root.dataset.zoom=String(zoom);
      ctx.clearRect(0,0,400,360);
      const epsilon=.85*(1-zoom)**2;
      const corner=[[-1.5,-1.5],[1.5,-1.5],[1.5,1.5],[-1.5,1.5]].map(vector);
      path(corner,'#e8eddf','#c1cdb6');
      for(let a=-1.5;a<=1.51;a+=.3)for(const swap of [false,true]){
        const line=Array.from({length:31},(_,i)=>{
          const b=-1.5+i*.1,w=vector(swap?[b,a]:[a,b]);return patch(w,epsilon);
        });
        path(line,null,epsilon>.002?'#8eac82':'#bccbb1',epsilon>.002?.9:.7);
      }
      if(reading.degree===1){
        for(const value of [-1,-.5,0,.5,1]){
          const a=q[reading.axis],b=r[reading.axis],den=a*a+b*b;
          if(den<1e-10)continue;
          const center=scale(add(scale(q,a),scale(r,b)),value/den),direction=add(scale(q,-b),scale(r,a));
          path([add(center,scale(direction,-1.5)),add(center,scale(direction,1.5))],null,'#97a98c',.8,[3,3]);
        }
      }
      const positive=area>=0;
      path([[0,0,0],u,add(u,v),v],reading.degree===1?'#cfdcc833':positive?'#c77a6a33':'#5b88ad33',reading.degree===1?'#9eae92':positive?'#b86655':'#4e7fa6',1.2);
      path([u,add(u,v),v],null,'#8c9d80',1,[3,3]);
      arrow(u,'#497654');arrow(v,'#865b98');
      const origin=project([0,0,0]);ctx.beginPath();ctx.arc(...origin,2.5,0,2*Math.PI);ctx.fillStyle='#42623f';ctx.fill();
      for(const [name,w] of [['u',u],['v',v],['origin',[0,0,0]]]){
        const node=name==='origin'?root.querySelector('.area-origin'):root.querySelector('[data-vector='+name+']'),[x,y]=project(w);
        node.style.left=(100*x/400)+'%';node.style.top=(100*(y-10)/360)+'%';
      }
      root.querySelectorAll('.area-meter').forEach((meter,i)=>{
        const value=values[i],fill=meter.querySelector('.area-meter-fill');
        fill.style.height=(Math.min(1,Math.abs(value))*50)+'%';fill.style.top=(value>=0?50-Math.min(1,value)*50:50)+'%';fill.style.background=value>=0?'#ba554c':'#447aa8';
        meter.dataset.value=String(value);
      });
      zoomInput.value=String(Math.round(100*zoom));
      if(!document.documentElement.classList.contains('notation-moving')&&(forceMath||timestamp-lastMath>180)){
        math(root.querySelector('.area-zoom-readout'),zoom===1?'T_pS^2\\quad\\text{the linear model}':'\\epsilon='+epsilon.toFixed(3)+'\\quad\\text{zooming in}');
        math(root.querySelector('.area-evaluation'),reading.degree===1?reading.tex+':w\\longmapsto w_'+names[reading.axis]:evaluationTex(reading,0));
        root.querySelectorAll('.area-meter-value').forEach((node,i)=>math(node,valueTex(values[i])));
        math(root.querySelector('[data-vector-value=u]'),rowTex('u',u));math(root.querySelector('[data-vector-value=v]'),rowTex('v',v));
        lastMath=timestamp;
      }
    }
    function active(){return playing&&visible&&!document.hidden&&!dead&&!dragging;}
    function tick(timestamp){
      raf=0;if(!active()){last=0;return;}
      const dt=last?Math.min(.1,(timestamp-last)/1000):0;last=timestamp;
      if(zoom<1)zoom=Math.min(1,zoom+dt/3);
      else coordinates=coordinates.map(([x,y],i)=>{
        const a=dt*(i===0?.22:.67),c=Math.cos(a),s=Math.sin(a);return [c*x-s*y,s*x+c*y];
      });
      draw(timestamp);raf=requestAnimationFrame(tick);
    }
    function schedule(){
      root.dataset.playing=String(playing);play.textContent=playing?'Pause animation':'Play animation';play.setAttribute('aria-pressed',String(playing));
      if(active()&&!raf){last=0;raf=requestAnimationFrame(tick);}
      else if(!active()&&raf){cancelAnimationFrame(raf);raf=0;last=0;}
    }
    function stop(){playing=false;schedule();}
    function toggle(){playing=!playing;schedule();if(!playing)draw(performance.now(),true);}
    function choose(event){
      selected=Number(event.currentTarget.dataset.reading);
      buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));
      makeMeters();draw(performance.now(),true);
    }
    function swap(){stop();coordinates.reverse();draw(performance.now(),true);}
    function align(){stop();coordinates[1]=coordinates[0].map(x=>.8*x);draw(performance.now(),true);}
    function replay(){zoom=0;playing=true;schedule();draw(performance.now(),true);}
    function zoomChange(){stop();zoom=Number(zoomInput.value)/100;draw(performance.now(),true);}
    function moveVector(i,x,y){
      const a=85*dot(q,horizontal),b=85*dot(r,horizontal),c=-85*dot(q,vertical),d=-85*dot(r,vertical),det=a*d-b*c;
      let value=[(d*(x-200)-b*(y-180))/det,(-c*(x-200)+a*(y-180))/det],length=Math.hypot(...value);
      if(length>1)value=value.map(x=>x/length);
      coordinates[i]=value;draw(performance.now());
    }
    function down(event){
      if(dragging||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
      const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*400/rect.width,y=(event.clientY-rect.top)*360/rect.height;
      const distances=coordinates.map(c=>{const p=project(vector(c));return Math.hypot(x-p[0],y-p[1]);}),i=distances[0]<distances[1]?0:1;
      if(distances[i]>(event.pointerType==='touch'?25:18)*400/rect.width)return;
      const head=project(vector(coordinates[i]));
      event.preventDefault();stop();canvas.focus({preventScroll:true});lastVector=i;dragging={id:event.pointerId,i,offset:[x-head[0],y-head[1]]};
      canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';draw(performance.now(),true);
    }
    function move(event){
      if(!dragging||event.pointerId!==dragging.id)return;
      event.preventDefault();const rect=canvas.getBoundingClientRect();
      moveVector(dragging.i,(event.clientX-rect.left)*400/rect.width-dragging.offset[0],(event.clientY-rect.top)*360/rect.height-dragging.offset[1]);
    }
    function up(event){
      if(!dragging||(event.pointerId!==undefined&&event.pointerId!==dragging.id))return;
      const id=dragging.id;dragging=null;if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);canvas.style.cursor='';draw(performance.now(),true);schedule();
    }
    function key(event){
      const steps={ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]},change=steps[event.key];
      if(!change)return;event.preventDefault();stop();const p=project(vector(coordinates[lastVector]));moveVector(lastVector,p[0]+change[0],p[1]+change[1]);draw(performance.now(),true);
    }
    function motion(){if(reduced.matches){playing=false;zoom=1;draw(performance.now(),true);}schedule();}
    function settled(){draw(performance.now(),true);}
    const controls=[['.area-play',toggle],['.area-swap',swap],['.area-align',align],['.area-replay',replay]];
    controls.forEach(([selector,handler])=>root.querySelector(selector).addEventListener('click',handler));
    buttons.forEach(button=>button.addEventListener('click',choose));zoomInput.addEventListener('input',zoomChange);
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);canvas.addEventListener('keydown',key);
    window.addEventListener('blur',up);document.addEventListener('visibilitychange',schedule);document.addEventListener('matrixconventionsettled',settled);reduced.addEventListener('change',motion);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'80px'});observer.observe(root);
    makeMeters();draw(0,true);schedule();
    return ()=>{
      dead=true;cancelAnimationFrame(raf);observer.disconnect();
      controls.forEach(([selector,handler])=>root.querySelector(selector).removeEventListener('click',handler));
      buttons.forEach(button=>button.removeEventListener('click',choose));zoomInput.removeEventListener('input',zoomChange);
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);canvas.removeEventListener('keydown',key);
      window.removeEventListener('blur',up);document.removeEventListener('visibilitychange',schedule);document.removeEventListener('matrixconventionsettled',settled);reduced.removeEventListener('change',motion);
    };
  };
})();
