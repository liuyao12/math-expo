// A one-form is drawn by its level sets; only its metric representative is an arrow.
(() => {
  'use strict';
  const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const scale=(a,k)=>a.map(x=>k*x);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=a=>{const n=Math.hypot(...a);if(n<1e-12)throw Error('A sphere direction must be nonzero');return scale(a,1/n);};
  const extent=.68;
  const startAngle=Math.atan(Math.sqrt(2));
  const defaultView={yaw:Math.atan2(-3,4),pitch:Math.asin(2/Math.sqrt(29))};
  function cameraFrame(yaw,pitch){
    const c=Math.cos(pitch),s=Math.sin(pitch),a=Math.cos(yaw),b=Math.sin(yaw);
    return {normal:[c*a,c*b,s],horizontal:[-b,a,0],vertical:[-s*a,-s*b,c]};
  }
  const axes=['x','y','z'];
  const representatives=p=>p.map((coordinate,i)=>p.map((x,j)=>(i===j?1:0)-coordinate*x));
  function fromFrame(p,q,r){
    const gradients=representatives(p),gradient=gradients[0];
    const normal=scale(p,p[0]);
    const tangent=scale(add(q,r),.5);
    const weighted=gradients.map((g,i)=>scale(g,p[i]));
    const terms=p.map((x,i)=>x*tangent[i]);
    return {p,q,r,gradient,gradients,normal,tangent,value:tangent[0],values:tangent,weighted,terms,residual:dot(p,tangent)};
  }
  function state(angle){
    const c=Math.cos(angle),s=Math.sin(angle);
    const azimuth=Math.PI/4+.45*Math.sin(2*(angle-startAngle)),a=Math.cos(azimuth),b=Math.sin(azimuth);
    return fromFrame([c,s*a,s*b],[-s,c*a,c*b],[0,-b,a]);
  }
  function stateAtPoint(point,previousQ){
    const p=unit(point);
    const leastAxis=p.reduce((best,x,i)=>Math.abs(x)<Math.abs(p[best])?i:best,0);
    let reference=previousQ||axes.map((_,i)=>i===leastAxis?1:0);
    let q=add(reference,scale(p,-dot(reference,p)));
    if(Math.hypot(...q)<1e-7){
      reference=axes.map((_,i)=>i===leastAxis?1:0);
      q=add(reference,scale(p,-dot(reference,p)));
    }
    q=unit(q);
    return fromFrame(p,q,unit(cross(p,q)));
  }
  function unprojectPoint(u,v,frame,side=1){
    const radius=Math.hypot(u,v);
    if(radius>1){u/=radius;v/=radius;}
    const depth=radius>=1?0:(side<0?-1:1)*Math.sqrt(Math.max(0,1-u*u-v*v));
    return unit(add(add(scale(frame.horizontal,u),scale(frame.vertical,v)),scale(frame.normal,depth)));
  }
  function rotationBetweenFrames(from,to){
    const source=[from.p,from.q,from.r],target=[to.p,to.q,to.r];
    return axes.map((_,i)=>axes.map((_,j)=>source.reduce((sum,v,k)=>sum+target[k][i]*v[j],0)));
  }
  function rotatedState(angle,rotation){
    const base=state(angle),apply=v=>rotation.map(row=>dot(row,v));
    // The ambient coordinate axes stay fixed, so recompute their representatives.
    return fromFrame(apply(base.p),apply(base.q),apply(base.r));
  }
  function levelVectorsAt(model,value,axis=0){
    const {q,r}=model;
    const a=q[axis],b=r[axis],points=[];
    if(Math.hypot(a,b)<1e-10)return value===0?{wholePlane:true}:null;
    const include=(u,v)=>{
      if(Math.abs(u)>extent+1e-10||Math.abs(v)>extent+1e-10)return;
      if(!points.some(([x,y])=>Math.hypot(x-u,y-v)<1e-9))points.push([u,v]);
    };
    if(Math.abs(b)>1e-10)for(const u of [-extent,extent])include(u,(value-a*u)/b);
    if(Math.abs(a)>1e-10)for(const v of [-extent,extent])include((value-b*v)/a,v);
    if(points.length<2)return null;
    return {wholePlane:false,vectors:points.slice(0,2).map(([u,v])=>add(scale(q,u),scale(r,v)))};
  }
  const levelVectors=(angle,value,axis=0)=>levelVectorsAt(state(angle),value,axis);
  const formulas={
    point:'p',
    negative:'-\\frac12',
    zero:'0',
    positive:'\\frac12',
    ambient:'e_x=[1,0,0]',
    representative:'g_x=(\\mathrm dx_p)^\\sharp',
    representativeY:'g_y=(\\mathrm dy_p)^\\sharp',
    representativeZ:'g_z=(\\mathrm dz_p)^\\sharp',
    test:'v',
    chooseX:'\\mathrm dx_p',
    chooseY:'\\mathrm dy_p',
    chooseZ:'\\mathrm dz_p',
    coordinate:'\\mathrm dx_p:v\\longmapsto v_x',
    projection:'(\\mathrm dx_p)^\\sharp=e_x-(p.x)p.',
    pairing:'v.\\mathrm dx_p=\\langle v,(\\mathrm dx_p)^\\sharp\\rangle.',
    relation:'x\\,\\mathrm dx_p+y\\,\\mathrm dy_p+z\\,\\mathrm dz_p=0.',
    pointCoordinates:'p=[x,y,z]',
    evaluatedRelation:'xv_x+yv_y+zv_z=0.',
    raisedRelation:'xg_x+yg_y+zg_z=0.',
    weightedX:'xg_x',
    weightedY:'yg_y',
    weightedZ:'zg_z',
    zeroVector:'\\mathbf0'
  };
  const pointFormula=p=>'p=['+p.map(number).join(',')+']';
  const valueFormula=(value,axis=0)=>'v.\\mathrm d'+axes[axis]+'_p='+number(value);
  const relationFormula=terms=>terms.map(x=>'('+ (Math.abs(x)<.0005?'0':x.toFixed(3))+')').join('+')+'\\approx0';
  const coordinateFormula=axis=>'\\mathrm d'+axes[axis]+'_p:v\\longmapsto v_'+axes[axis];
  const projectionFormula=axis=>'g_'+axes[axis]+'=e_'+axes[axis]+'-(p.'+axes[axis]+')p.';
  const ambientFormula=axis=>'e_'+axes[axis]+'=['+axes.map((_,i)=>i===axis?1:0).join(',')+']';
  function number(x){return Math.abs(x)<.005?'0':x.toFixed(2);}
  window.SPHERE_TANGENT={state,stateAtPoint,unprojectPoint,rotationBetweenFrames,rotatedState,levelVectors,levelVectorsAt,representatives,extent,startAngle,defaultView,cameraFrame,formulas,pointFormula,valueFormula,relationFormula,coordinateFormula,projectionFormula,ambientFormula};

  window.mountSphereTangentDemo=(holder,{math})=>{
    holder.innerHTML='<figure class="figure sphere-tangent-example">'+
      '<h3>Three coordinates, one relation.</h3>'+
      '<p class="sphere-intro">The differentials read a tangent vector’s three ambient components. Choose a measurement to see its level lines.</p>'+
      '<div class="sphere-coordinate-choices" role="group" aria-label="Choose a tangent coordinate measurement">'+
      axes.map((axis,i)=>'<button type="button" data-axis="'+i+'" aria-pressed="'+(i===0)+'" aria-label="Show the '+axis+'-coordinate measurement"><span data-formula="choose'+axis.toUpperCase()+'"></span></button>').join('')+'</div>'+
      '<div class="sphere-selected-coordinate" data-formula="coordinate"></div>'+
      '<p class="sphere-view-help">Drag the point to place it and pause motion. Drag elsewhere to rotate the view. Arrow keys rotate; Shift + arrow keys move the point. Home resets the view.</p>'+
      '<div class="sphere-view-controls"><button type="button" class="sphere-play"></button><button type="button" class="sphere-face-plane" title="Pause motion and look straight at the current tangent plane">Face tangent plane</button><button type="button" class="sphere-reset-view">Reset view</button></div>'+
      '<div class="sphere-tangent-stage">'+
      '<canvas width="880" height="880" role="img" tabindex="0" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown Home" aria-label="Interactive sphere view. Drag the marked point to move it on the sphere and pause motion. Drag elsewhere to rotate the camera. Arrow keys rotate; Shift with arrow keys moves the point; Home resets the view. Colored arrows represent the three coordinate measurements, whose level lines can be selected."></canvas>'+
      '<span class="sphere-point-label" data-formula="point" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="-0.5" data-formula="negative" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="0" data-formula="zero" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="0.5" data-formula="positive" aria-hidden="true"></span></div>'+
      '<div class="sphere-legend"><span class="sphere-representative" data-formula="representative"></span><span class="sphere-representative-y" data-formula="representativeY"></span><span class="sphere-representative-z" data-formula="representativeZ"></span><span class="sphere-test" data-formula="test"></span></div>'+
      '<p class="sphere-ambient-note">Dashed ambient direction: <span data-formula="ambient"></span>.</p>'+
      '<p class="sphere-level-caption">The level lines label the tangent vectors by their coordinate value. The plane is drawn at the moving point; an arrow from that point depicts a tangent vector.</p>'+
      '<div class="sphere-coordinate-readout"><span class="sphere-readout-label">POINT AND TANGENT COORDINATES</span><div data-live="point"></div><div class="sphere-values"><span data-live="value-x"></span><span data-live="value-y"></span><span data-live="value-z"></span></div></div>'+
      '<div class="sphere-projection-formula" data-formula="projection"></div>'+
      '<div class="sphere-relation"><span class="sphere-readout-label">A RELATION BETWEEN THE COVECTORS</span><div data-formula="pointCoordinates"></div><div data-formula="relation"></div><p>Applied to the purple tangent vector:</p><div data-formula="evaluatedRelation"></div><p class="sphere-rounding-note">Rounded contributions:</p><div class="sphere-relation-numbers" data-live="relation"></div></div>'+
      '<div class="sphere-triangle"><span class="sphere-readout-label">THE SAME RELATION AFTER RAISING</span><div data-formula="raisedRelation"></div><canvas width="880" height="360" role="img" aria-label="The three weighted projected vectors are placed head to tail. The last returns to the starting point, showing that their vector sum is zero."></canvas><div class="sphere-weighted-legend"><span data-formula="weightedX"></span><span data-formula="weightedY"></span><span data-formula="weightedZ"></span></div><p>The weighted arrows close head to tail. They represent the covectors through the metric; the covectors themselves remain scalar measurements.</p></div>'+
      '<figcaption class="figure-caption">Since tangent vectors are perpendicular to the radius, their weighted coordinate measurements sum to zero. The globe is shown transparently. At a coordinate-axis pole the corresponding differential vanishes on the whole tangent plane.</figcaption></figure>';
    const root=holder.querySelector('.sphere-tangent-example');
    root.querySelectorAll('[data-formula]').forEach(node=>math(node,formulas[node.dataset.formula]));
    const canvas=root.querySelector('.sphere-tangent-stage canvas'),ctx=canvas.getContext('2d');
    ctx.scale(2,2);
    const triangle=root.querySelector('.sphere-triangle canvas'),triangleContext=triangle.getContext('2d');triangleContext.scale(2,2);
    const button=root.querySelector('.sphere-play'),pointLabel=root.querySelector('.sphere-point-label');
    const resetButton=root.querySelector('.sphere-reset-view'),faceButton=root.querySelector('.sphere-face-plane');
    const levelLabels=[...root.querySelectorAll('[data-level]')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let yaw=defaultView.yaw,pitch=defaultView.pitch;
    let {normal:camera,horizontal,vertical}=cameraFrame(yaw,pitch);
    const project=p=>[220+104*dot(p,horizontal),220-104*dot(p,vertical)];
    const colors={ink:'#3b5942',test:'#8a5f94'};
    const gradientColors=['#347ba5','#39816c','#ba7136'];
    const choices=[...root.querySelectorAll('[data-axis]')];
    let selected=0,angle=startAngle,phase=0,raf=0,last=0,lastMath=-Infinity,visible=false,disposed=false,playing=!reduced.matches,dragging=null,manualModel=null,orbitRotation=null;
    const currentState=()=>manualModel||(orbitRotation?rotatedState(angle,orbitRotation):state(angle));
    // Begin at the diagonal point used in the accompanying worked example.
    let low=0,high=Math.PI;
    for(let i=0;i<50;i++){const mid=(low+high)/2;if(mid-.28*Math.sin(2*mid)<startAngle)low=mid;else high=mid;}
    phase=(low+high)/2;
    function path(points,fill,stroke,width=1,dash=[]){
      ctx.beginPath();
      points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
      if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
    }
    function arrow(from,to,color,width=2){
      const a=project(from),b=project(to),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
      if(length<.4)return;
      path([from,to],null,color,width);
      if(length<3)return;
      const ux=dx/length,uy=dy/length,size=Math.min(7,length*.4);
      ctx.beginPath();ctx.moveTo(...b);
      ctx.lineTo(b[0]-size*ux+size*.4*uy,b[1]-size*uy-size*.4*ux);
      ctx.lineTo(b[0]-size*ux-size*.4*uy,b[1]-size*uy+size*.4*ux);
      ctx.closePath();ctx.fillStyle=color;ctx.fill();
    }
    function position(node,p,dx=0,dy=0){
      const [x,y]=project(p);node.style.left=(100*(x+dx)/440)+'%';node.style.top=(100*(y+dy)/440)+'%';
    }
    function drawTriangle(model){
      const {weighted,q,r}=model;
      const points=[[0,0,0],weighted[0],add(weighted[0],weighted[1])];
      const flat=points.map(v=>[dot(v,q),dot(v,r)]);
      const center=[0,1].map(i=>(Math.min(...flat.map(p=>p[i]))+Math.max(...flat.map(p=>p[i])))/2);
      const view=v=>[220+300*(dot(v,q)-center[0]),90-300*(dot(v,r)-center[1])];
      triangleContext.clearRect(0,0,440,180);
      points.forEach((from,i)=>{
        const to=add(from,weighted[i]),a=view(from),b=view(to),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
        triangleContext.beginPath();triangleContext.moveTo(...a);triangleContext.lineTo(...b);triangleContext.strokeStyle=gradientColors[i];triangleContext.lineWidth=2.4;triangleContext.stroke();
        if(length>3){
          const ux=dx/length,uy=dy/length,size=Math.min(7,length*.4);
          triangleContext.beginPath();triangleContext.moveTo(...b);triangleContext.lineTo(b[0]-size*ux+size*.4*uy,b[1]-size*uy-size*.4*ux);triangleContext.lineTo(b[0]-size*ux-size*.4*uy,b[1]-size*uy+size*.4*ux);triangleContext.closePath();triangleContext.fillStyle=gradientColors[i];triangleContext.fill();
        }
      });
      const origin=view([0,0,0]);triangleContext.beginPath();triangleContext.arc(...origin,3,0,2*Math.PI);triangleContext.fillStyle=colors.ink;triangleContext.fill();
    }
    function draw(timestamp=0,forceMath=false){
      const model=currentState(),{p,q,r,gradients,tangent,values,terms,residual}=model,gradient=gradients[selected];
      root.dataset.angle=String(angle);root.dataset.coordinate=String(values[selected]);root.dataset.axis=axes[selected];root.dataset.relationResidual=String(residual);
      root.dataset.viewYaw=String(yaw);root.dataset.viewPitch=String(pitch);
      root.dataset.point=JSON.stringify(p);root.dataset.tangent=JSON.stringify(tangent);
      ctx.clearRect(0,0,440,440);
      const globe=ctx.createRadialGradient(184,182,15,220,220,111);
      globe.addColorStop(0,'#f7f9f2');globe.addColorStop(1,'#dce6d3');
      ctx.beginPath();ctx.arc(220,220,104,0,Math.PI*2);ctx.fillStyle=globe;ctx.fill();ctx.strokeStyle='#b0c2a3';ctx.lineWidth=1;ctx.stroke();
      for(let axis=0;axis<3;axis++){
        for(let j=0;j<100;j++){
          const a=[0,0,0],b=[0,0,0];
          a[(axis+1)%3]=Math.cos(j*2*Math.PI/100);a[(axis+2)%3]=Math.sin(j*2*Math.PI/100);
          b[(axis+1)%3]=Math.cos((j+1)*2*Math.PI/100);b[(axis+2)%3]=Math.sin((j+1)*2*Math.PI/100);
          path([a,b],null,dot(a,camera)<0?'#ccd7c3':'#b5c5a9',.7);
        }
      }
      const onPlane=(u,v)=>add(p,add(scale(q,u),scale(r,v)));
      // Color the patch by the one-form value of the displacement, not by height.
      for(let i=0;i<12;i++)for(let j=0;j<12;j++){
        const a=-extent+2*extent*i/12,b=-extent+2*extent*(i+1)/12,c=-extent+2*extent*j/12,d=-extent+2*extent*(j+1)/12;
        const coordinate=(a+b)/2*q[selected]+(c+d)/2*r[selected],opacity=.10+.26*Math.abs(coordinate);
        const fill=Math.abs(coordinate)<.025?'rgba(222,230,214,.72)':coordinate>0?'rgba(75,135,174,'+opacity+')':'rgba(190,130,77,'+opacity+')';
        path([onPlane(a,c),onPlane(b,c),onPlane(b,d),onPlane(a,d)],fill);
      }
      path([onPlane(-extent,-extent),onPlane(extent,-extent),onPlane(extent,extent),onPlane(-extent,extent),onPlane(-extent,-extent)],null,'#8fa781',1.15);
      for(const c of [-.5,-.25,0,.25,.5]){
        const level=levelVectorsAt(model,c,selected);
        if(level&&!level.wholePlane)path(level.vectors.map(v=>add(p,v)),null,c===0?'#839b79':'#a6b59c',c===0?1.2:.8);
      }
      levelLabels.forEach(node=>{
        const level=levelVectorsAt(model,Number(node.dataset.level),selected);
        node.hidden=!level;
        if(level)position(node,level.wholePlane?p:add(p,level.vectors[1]),0,-7);
      });
      path([[0,0,0],scale(p,1.33)],null,'#8fa180',1,[4,4]);
      const ambientEnd=add(p,axes.map((_,i)=>i===selected?1:0)),projectionEnd=add(p,gradient);
      path([projectionEnd,ambientEnd],null,'#8b9587',1,[4,3]);
      // Never draw the covector as an arrow. This is its metric representative.
      path([p,ambientEnd],null,'#8b9587',1.3,[4,3]);
      gradients.forEach((g,i)=>{if(i!==selected)arrow(p,add(p,g),gradientColors[i],1.7);});
      arrow(p,projectionEnd,gradientColors[selected],2.8);
      arrow(p,add(p,tangent),colors.test,1.9);
      const [px,py]=project(p);
      ctx.beginPath();ctx.arc(px,py,10,0,Math.PI*2);ctx.strokeStyle='#537e55aa';ctx.lineWidth=1.2;ctx.stroke();
      ctx.beginPath();ctx.arc(px,py,6,0,Math.PI*2);ctx.fillStyle=colors.ink;ctx.fill();ctx.strokeStyle='#f7f9f2';ctx.lineWidth=1.5;ctx.stroke();
      position(pointLabel,p,-10,-14);
      drawTriangle(model);
      if(!document.documentElement.classList.contains('notation-moving')&&(forceMath||timestamp-lastMath>180)){
        math(root.querySelector('[data-live="point"]'),pointFormula(p));
        axes.forEach((axis,i)=>math(root.querySelector('[data-live="value-'+axis+'"]'),valueFormula(values[i],i)));
        math(root.querySelector('[data-live="relation"]'),relationFormula(terms));
        lastMath=timestamp;
      }
    }
    function active(){return playing&&visible&&!document.hidden&&!disposed&&!dragging;}
    function frame(timestamp){
      raf=0;
      if(!active()){last=0;return;}
      if(last)phase+=(timestamp-last)*2*Math.PI/22000;
      last=timestamp;angle=phase-.28*Math.sin(2*phase);draw(timestamp);
      raf=requestAnimationFrame(frame);
    }
    function schedule(){
      button.textContent=playing?'Pause animation':'Play animation';
      button.setAttribute('aria-pressed',String(playing));
      root.dataset.playing=String(playing);
      if(active()&&!raf){last=0;raf=requestAnimationFrame(frame);}
      else if(!active()&&raf){cancelAnimationFrame(raf);raf=0;last=0;}
    }
    function toggle(){
      if(!playing&&manualModel){
        orbitRotation=rotationBetweenFrames(state(angle),manualModel);manualModel=null;
      }
      playing=!playing;schedule();if(!playing)draw(performance.now(),true);
    }
    function setView(nextYaw,nextPitch,refreshMath=false){
      yaw=Math.atan2(Math.sin(nextYaw),Math.cos(nextYaw));
      pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,nextPitch));
      ({normal:camera,horizontal,vertical}=cameraFrame(yaw,pitch));
      draw(performance.now(),refreshMath);
    }
    function resetView(){setView(defaultView.yaw,defaultView.pitch);}
    function facePlane(){
      const {p}=currentState();
      playing=false;schedule();
      setView(Math.atan2(p[1],p[0]),Math.asin(p[2]),true);
    }
    function startDrag(event){
      if(dragging||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
      event.preventDefault();canvas.focus({preventScroll:true});
      const rect=canvas.getBoundingClientRect(),[px,py]=project(currentState().p);
      const local=[(event.clientX-rect.left)*440/rect.width,(event.clientY-rect.top)*440/rect.height];
      const hitRadius=(event.pointerType==='touch'?24:16)*440/rect.width;
      const mode=Math.hypot(local[0]-px,local[1]-py)<=hitRadius?'point':'view';
      dragging={id:event.pointerId,x:event.clientX,y:event.clientY,mode,offset:[local[0]-px,local[1]-py],side:dot(currentState().p,camera)<0?-1:1};
      if(mode==='point'){manualModel=currentState();playing=false;}
      root.dataset.dragMode=mode;canvas.style.cursor=mode==='point'?'move':'grabbing';
      canvas.setPointerCapture(event.pointerId);root.classList.add('is-dragging');schedule();
      draw(performance.now(),true);
    }
    function moveDrag(event){
      if(!dragging){hoverPoint(event);return;}
      if(dragging.id!==event.pointerId)return;
      event.preventDefault();
      const rect=canvas.getBoundingClientRect(),sensitivity=1.25*Math.PI/Math.max(1,Math.min(rect.width,rect.height));
      if(dragging.mode==='point'){
        const x=(event.clientX-rect.left)*440/rect.width-dragging.offset[0],y=(event.clientY-rect.top)*440/rect.height-dragging.offset[1];
        placePoint(x,y,dragging.side);return;
      }
      const dx=event.clientX-dragging.x,dy=event.clientY-dragging.y;
      dragging.x=event.clientX;dragging.y=event.clientY;
      setView(yaw-dx*sensitivity,pitch+dy*sensitivity);
    }
    function stopDrag(event){
      if(!dragging||(event.pointerId!==undefined&&event.pointerId!==dragging.id))return;
      const {id,mode}=dragging;dragging=null;root.classList.remove('is-dragging');root.dataset.dragMode='';canvas.style.cursor='';
      if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);
      schedule();
      if(mode==='point')draw(performance.now(),true);
    }
    function placePoint(x,y,side,refreshMath=false){
      const before=currentState();
      const p=unprojectPoint((x-220)/104,(220-y)/104,{normal:camera,horizontal,vertical},side);
      manualModel=stateAtPoint(p,before.q);
      draw(performance.now(),refreshMath);
    }
    function hoverPoint(event){
      const rect=canvas.getBoundingClientRect(),[x,y]=project(currentState().p);
      const dx=event.clientX-rect.left-x*rect.width/440,dy=event.clientY-rect.top-y*rect.height/440;
      canvas.style.cursor=Math.hypot(dx,dy)<=16?'move':'';
    }
    function leaveCanvas(){if(!dragging)canvas.style.cursor='';}
    function keyboardView(event){
      const step=Math.PI/24;
      const changes={ArrowLeft:[step,0],ArrowRight:[-step,0],ArrowUp:[0,-step],ArrowDown:[0,step]};
      if(event.key==='Home'){event.preventDefault();resetView();return;}
      const change=changes[event.key];if(!change)return;
      if(event.shiftKey){
        event.preventDefault();
        const {p}=currentState(),[x,y]=project(p),offsets={ArrowLeft:[-6,0],ArrowRight:[6,0],ArrowUp:[0,-6],ArrowDown:[0,6]};
        const [dx,dy]=offsets[event.key];
        playing=false;schedule();placePoint(x+dx,y+dy,dot(p,camera)<0?-1:1,true);return;
      }
      event.preventDefault();setView(yaw+change[0],pitch+change[1]);
    }
    function select(event){
      selected=Number(event.currentTarget.dataset.axis);
      choices.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.axis)===selected)));
      math(root.querySelector('[data-formula="coordinate"]'),coordinateFormula(selected));
      math(root.querySelector('[data-formula="projection"]'),projectionFormula(selected));
      math(root.querySelector('[data-formula="ambient"]'),ambientFormula(selected));
      draw(performance.now(),true);
    }
    function motionChange(){if(reduced.matches)playing=false;schedule();}
    function settled(){draw(performance.now(),true);}
    button.addEventListener('click',toggle);
    resetButton.addEventListener('click',resetView);faceButton.addEventListener('click',facePlane);
    canvas.addEventListener('pointerdown',startDrag);canvas.addEventListener('pointermove',moveDrag);
    canvas.addEventListener('pointerup',stopDrag);canvas.addEventListener('pointercancel',stopDrag);canvas.addEventListener('lostpointercapture',stopDrag);
    canvas.addEventListener('pointerleave',leaveCanvas);
    canvas.addEventListener('keydown',keyboardView);window.addEventListener('blur',stopDrag);
    choices.forEach(button=>button.addEventListener('click',select));
    reduced.addEventListener('change',motionChange);
    document.addEventListener('visibilitychange',schedule);
    document.addEventListener('matrixconventionsettled',settled);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'80px'});
    observer.observe(root);
    draw(0,true);schedule();
    return ()=>{
      disposed=true;cancelAnimationFrame(raf);observer.disconnect();
      reduced.removeEventListener('change',motionChange);
      document.removeEventListener('visibilitychange',schedule);
      document.removeEventListener('matrixconventionsettled',settled);
      button.removeEventListener('click',toggle);
      resetButton.removeEventListener('click',resetView);faceButton.removeEventListener('click',facePlane);
      canvas.removeEventListener('pointerdown',startDrag);canvas.removeEventListener('pointermove',moveDrag);
      canvas.removeEventListener('pointerup',stopDrag);canvas.removeEventListener('pointercancel',stopDrag);canvas.removeEventListener('lostpointercapture',stopDrag);
      canvas.removeEventListener('pointerleave',leaveCanvas);
      canvas.removeEventListener('keydown',keyboardView);window.removeEventListener('blur',stopDrag);
      choices.forEach(button=>button.removeEventListener('click',select));
    };
  };
})();
