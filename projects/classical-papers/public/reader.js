(() => {
  const options={delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:true};
  const typeset=node=>window.renderMathInElement?.(node,options);
  typeset(document.body);
  const toggle=document.querySelector('#notes-toggle');
  toggle?.addEventListener('click',()=>{
    const hidden=document.body.classList.toggle('notes-hidden');
    toggle.setAttribute('aria-pressed',String(!hidden));
    toggle.textContent=hidden?'Show commentary':'Hide commentary';
  });
  const slider=document.querySelector('#metric-weight');
  if(slider){
    const value=document.querySelector('#metric-value');
    const readout=document.querySelector('#metric-readout');
    function update(){
      const a=Number(slider.value);
      document.querySelector('#unit-ellipse').setAttribute('ry',String(70/a));
      value.textContent=`\\(a=${a.toFixed(1)}\\)`;
      const length=Math.hypot(54/70,a*45/70);
      readout.textContent=`\\(\\lVert v\\rVert_g\\approx ${length.toFixed(2)}\\)`;
      typeset(value);typeset(readout);
    }
    slider.addEventListener('input',update);update();
  }
  const links=[...document.querySelectorAll('.reading-nav a')];
  if(links.length&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){links.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
    },{rootMargin:'-8% 0px -65% 0px',threshold:0});
    for(const a of links){const section=document.querySelector(a.hash);if(section)observer.observe(section);}
  }
})();
