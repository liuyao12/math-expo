(() => {
  const options={delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:true};
  const typeset=node=>window.renderMathInElement?.(node,options);
  typeset(document.body);
  // Fragment links must land after equations and local fonts finish layout.
  // A source-note link reveals its text before the fragment scrolls to it.
  const revealSourceNote=()=>{
    const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(target?.matches('.source-footnotes details'))target.open=true;
  };
  revealSourceNote();
  window.addEventListener('hashchange',revealSourceNote);
  for(const link of document.querySelectorAll('.source-footnote-ref'))link.addEventListener('click',()=>{
    const target=document.getElementById(link.hash.slice(1));
    if(target)target.open=true;
  });
  const initialHash=location.hash;
  if(initialHash&&document.fonts){
    document.fonts.ready.then(()=>{
      if(location.hash!==initialHash)return;
      const target=document.getElementById(decodeURIComponent(initialHash.slice(1)));
      target?.scrollIntoView({block:'start',behavior:'instant'});
    });
  }
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
  const circleSlider=document.querySelector('#circle-angle');
  if(circleSlider){
    const label=document.querySelector('#circle-angle-value'),readout=document.querySelector('#circle-readout');
    const exact=[['0','1'],['\\pi/2','i'],['\\pi','-1'],['3\\pi/2','-i'],['2\\pi','1']];
    const updateCircle=()=>{
      const t=Number(circleSlider.value),v=t*Math.PI,x=150+70*Math.cos(v),y=95-70*Math.sin(v);
      document.querySelector('#circle-point').setAttribute('cx',String(x));
      document.querySelector('#circle-point').setAttribute('cy',String(y));
      document.querySelector('#circle-radius').setAttribute('d',`M150 95L${x} ${y}`);
      const q=Math.round(2*t),special=Math.abs(2*t-q)<1e-10;
      const angle=special?exact[q][0]:`${t.toFixed(2)}\\pi`;
      label.textContent=`\\(v=${angle}\\)`;
      if(special)readout.textContent=`\\(e^{i(${angle})}=${exact[q][1]}\\)`;
      else {
        const re=Math.cos(v),im=Math.sin(v);
        readout.textContent=`\\(e^{iv}\\approx ${re.toFixed(3)}${im<0?'-':'+'}${Math.abs(im).toFixed(3)}i\\)`;
      }
      circleSlider.setAttribute('aria-valuetext',`${t.toFixed(2)} times pi radians`);
      typeset(label);typeset(readout);
    };
    circleSlider.addEventListener('input',updateCircle);updateCircle();
  }
  const links=[...document.querySelectorAll('.reading-nav a')];
  if(links.length&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){links.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
    },{rootMargin:'-8% 0px -65% 0px',threshold:0});
    for(const a of links){const section=document.querySelector(a.hash);if(section)observer.observe(section);}
  }
  const form=document.querySelector('#catalogue-filters');
  if(form){
    const fields={q:form.querySelector('#work-search'),...Object.fromEntries(['author','language','decade','from','to','access'].map(key=>[key,form.elements.namedItem(key)]))};
    const items=[...document.querySelectorAll('[data-search-item]')].map(element=>({element,searchText:element.dataset.searchText,authors:element.dataset.authors.split(' '),year:Number(element.dataset.year),language:element.dataset.language,english:element.dataset.english==='true',edited:element.dataset.edited==='true'}));
    function restore(){
      const params=new URLSearchParams(location.search);
      for(const [key,field] of Object.entries(fields)){
        const value=params.get(key)??'';
        field.value=field.tagName==='SELECT'&&![...field.options].some(o=>o.value===value)?'':value;
      }
    }
    function filterWorks(sync=true){
      const filters=Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,field.value]));
      let count=0;
      for(const item of items){item.element.hidden=!window.paperDiscovery.matchesWork(item,filters);if(!item.element.hidden)count++;}
      document.querySelector('#search-status').textContent=`${count} of ${items.length} works`;
      document.querySelector('#no-results').hidden=count!==0;
      if(sync){
        const url=new URL(location.href);
        for(const [key,value] of Object.entries(filters)){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
        history.replaceState(null,'',url.pathname+url.search+url.hash);
      }
    }
    form.addEventListener('submit',event=>event.preventDefault());
    form.addEventListener('input',()=>filterWorks());
    form.addEventListener('change',()=>filterWorks());
    form.addEventListener('reset',()=>{for(const field of Object.values(fields))field.value='';filterWorks();});
    window.addEventListener('popstate',()=>{restore();filterWorks(false);});
    restore();filterWorks(false);
  }
  for(const button of document.querySelectorAll('[data-copy]')){
    button.addEventListener('click',async()=>{
      const field=document.getElementById(button.dataset.copy);
      const status=button.parentElement.querySelector('.copy-status');
      try{await navigator.clipboard.writeText(field.value);status.textContent='Copied.';}
      catch{field.focus();field.select();status.textContent='Text selected. Copy it with your keyboard.';}
    });
  }
})();
