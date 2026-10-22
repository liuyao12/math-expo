(() => {
  const options={delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:true};
  const typeset=node=>window.renderMathInElement?.(node,options);
  typeset(document.body);
  // Fragment links must land after equations and local fonts finish layout.
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
  const links=[...document.querySelectorAll('.reading-nav a')];
  if(links.length&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){links.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
    },{rootMargin:'-8% 0px -65% 0px',threshold:0});
    for(const a of links){const section=document.querySelector(a.hash);if(section)observer.observe(section);}
  }
  const search=document.querySelector('#work-search');
  if(search){
    const items=[...document.querySelectorAll('[data-search-item]')];
    const access=document.querySelector('#work-access');
    function filterWorks(){
      const words=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      const mode=access?.value??'all';
      let count=0;
      for(const item of items){
        const matchesAccess=mode==='all'||(mode==='english'&&item.dataset.english==='true')||(mode==='edited'&&item.dataset.edited==='true');
        item.hidden=!matchesAccess||!words.every(word=>item.dataset.searchText.includes(word));
        if(!item.hidden)count++;
      }
      document.querySelector('#search-status').textContent=count?`${count} work ${count===1?'record':'records'}`:'No matching works. Try another title, author, or year.';
    }
    search.addEventListener('input',filterWorks);
    access?.addEventListener('change',filterWorks);
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
