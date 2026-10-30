const root=document.querySelector('#root-lift-demo');
if(root){
 const version=new URL(import.meta.url).searchParams.get('v')??'1';
 const {squareRootLift}=await import('./surfaces-math.mjs?v='+encodeURIComponent(version));
 const $=id=>root.querySelector('#'+id),slider=$('root-lift-progress');
 let degrees=0,playing=false,last=0,frame=0,visible=true;
 const tex=(el,value)=>window.katex?window.katex.render(value,el,{throwOnError:false}):el.textContent=value;
 const clean=n=>Math.abs(n)<.0005?0:Number(n.toFixed(3));
 const complex=([re,im])=>{re=clean(re);im=clean(im);if(!im)return String(re);if(!re)return im+'i';return re+(im<0?'-':'+')+Math.abs(im)+'i';};
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 function draw(){
  const turns=degrees/360,p=squareRootLift(turns);slider.value=String(Math.round(degrees));root.dataset.turns=String(turns);root.dataset.sheet=String(p.sheet);
  function point(id,center,xy){const el=$(id);el.setAttribute('cx',String(center+47*xy[0]));el.setAttribute('cy',String(99-47*xy[1]));}
  function trail(id,center,half){const steps=Math.max(1,Math.ceil(degrees/3)),points=[];for(let i=0;i<=steps;i++){const a=p.theta*i/steps/(half?2:1);points.push((i?'L':'M')+(center+47*Math.cos(a)).toFixed(3)+' '+(99-47*Math.sin(a)).toFixed(3));}$(id).setAttribute('d',points.join(' '));}
  point('root-z-point',80,p.z);point('root-w-point',240,p.w);trail('root-z-trail',80,false);trail('root-w-trail',240,true);
  const d=Math.round(degrees),g=gcd(d,180),num=d/g,den=180/g;
  tex($('root-lift-angle'),!Number.isInteger(degrees)?'\\theta\\approx '+(degrees/180).toFixed(3)+'\\pi':d===0?'\\theta=0':'\\theta='+(den===1?(num===1?'':num):'\\tfrac{'+num+'}{'+den+'}')+'\\pi');
  tex($('root-lift-values'),'\\begin{gathered}z\\approx '+complex(p.z)+'\\\\w\\approx '+complex(p.w)+'\\\\\\text{Sheet }'+p.sheet+'\\quad\\text{of }2\\end{gathered}');
  $('root-lift-caption').textContent=Math.abs(degrees-360)<1e-9?'One circuit: the projected point has returned, but its square-root value has changed sign.':d===720?'Two circuits: both the surface point and its square-root value have returned.':d>360?'The second circuit continues from the other sheet; the square-root value stays continuous.':'The same projected input has two surface points above it, with opposite square-root values.';
  slider.setAttribute('aria-valuetext',(degrees/360).toFixed(2)+' circuits; sheet '+p.sheet+'; square root '+complex(p.w));
  if(!playing)$('root-lift-play').textContent=degrees>=720?'Replay two circuits':degrees>0?'Continue':'Play two circuits';$('root-lift-next').disabled=degrees>=720;root.dataset.motion=playing?'playing':'paused';
 }
 function stop(message='Paused · continue or move the slider.'){
  playing=false;cancelAnimationFrame(frame);$('root-lift-play').textContent=degrees>=720?'Replay two circuits':degrees>0?'Continue':'Play two circuits';root.dataset.motion='paused';$('root-lift-status').textContent=message;
 }
 function animate(time){
  if(!playing)return;if(last)degrees=Math.min(720,degrees+Math.min(80,time-last)*.09);last=time;draw();
  if(degrees>=720){stop('Complete · two circuits return to the starting value.');return;}frame=requestAnimationFrame(animate);
 }
 $('root-lift-play').addEventListener('click',()=>{if(playing){stop();return;}if(degrees>=720)degrees=0;playing=true;last=0;$('root-lift-play').textContent='Pause';$('root-lift-status').textContent='Following the square root continuously…';frame=requestAnimationFrame(animate);});
 slider.addEventListener('input',()=>{stop();degrees=Number(slider.value);draw();});
 $('root-lift-next').addEventListener('click',()=>{stop();degrees=Math.min(720,(Math.floor(degrees/360+1e-9)+1)*360);draw();$('root-lift-status').textContent=degrees===360?'One circuit reaches the opposite square root.':'Two circuits return to the initial square root.';});
 $('root-lift-reset').addEventListener('click',()=>{stop('Ready · move the slider or play.');degrees=0;draw();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&playing)stop('Paused while the illustration is out of view.');}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop('Paused while the page is hidden.');});
 draw();
}
