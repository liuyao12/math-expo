(() => {
  const options={delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:true};
  const typeset=node=>window.renderMathInElement?.(node,options);
  typeset(document.body);
  window.paperNames?.enhance(document.body);
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
  const logarithmIndex=document.querySelector('#logarithm-index');
  if(logarithmIndex){
    const updateLogarithm=()=>{
      const k=Number(logarithmIndex.value),n=2*k+1;
      const coefficient=n===1?'':n===-1?'-':String(n);
      const label=document.querySelector('#logarithm-index-value'),readout=document.querySelector('#logarithm-readout');
      label.textContent=`\\(k=${k}\\)`;
      readout.textContent=`\\(w=${coefficient}\\pi i,\\quad e^w=-1\\)`;
      for(const point of document.querySelectorAll('[data-logarithm-index]')){
        const selected=Number(point.dataset.logarithmIndex)===k;
        point.setAttribute('class',selected?'filled':'faint');point.setAttribute('r',selected?'5':'3');
      }
      logarithmIndex.setAttribute('aria-valuetext',`index ${k}; logarithm ${n} times pi i`);
      typeset(label);typeset(readout);
    };
    logarithmIndex.addEventListener('input',updateLogarithm);updateLogarithm();
  }
  const bridgeStep=document.querySelector('#bridge-route-step');
  if(bridgeStep){
    const route=JSON.parse(document.querySelector('#bridge-route-data').textContent);
    const updateBridgeStep=()=>{
      const step=Number(bridgeStep.value),count=document.querySelector('#bridge-route-count'),readout=document.querySelector('#bridge-route-readout');
      count.textContent=`\\(${step}/15\\)`;
      readout.textContent=step===0?'\\(\\text{start in }E\\)':`\\(${route.regions[step-1]}\\xrightarrow{${route.bridges[step-1]}}${route.regions[step]}\\)`;
      for(const crossing of document.querySelectorAll('.bridge-route [data-crossing]')){
        const index=route.bridges.indexOf(crossing.dataset.crossing);
        crossing.classList.toggle('is-used',index<step);
        crossing.classList.toggle('is-current',index===step-1);
      }
      bridgeStep.setAttribute('aria-valuetext',step===0?'Start in region E':`Crossing ${step} of 15: bridge ${route.bridges[step-1]}, from ${route.regions[step-1]} to ${route.regions[step]}`);
      typeset(count);typeset(readout);
    };
    bridgeStep.addEventListener('input',updateBridgeStep);updateBridgeStep();
  }
  const links=[...document.querySelectorAll('.reading-nav a[href^="#"]')];
  if(links.length&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){links.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
    },{rootMargin:'-8% 0px -65% 0px',threshold:0});
    for(const a of links){const section=document.getElementById(a.hash.slice(1));if(section)observer.observe(section);}
  }
  const form=document.querySelector('#catalogue-filters');
  if(form){
    const fields=Object.fromEntries(['q','from','to'].map(key=>[key,form.elements.namedItem(key)]));
    const groups=[...form.querySelectorAll('[data-facet]')].map(element=>({element,key:element.dataset.facet,expanded:false,inputs:[...element.querySelectorAll('input[type="checkbox"]')],button:element.querySelector('[data-expand]')}));
    const choices=Object.fromEntries(groups.map(g=>[g.key,g.inputs.map(input=>input.value)]));
    const items=[...document.querySelectorAll('[data-search-item]')].map(element=>({element,searchText:element.dataset.searchText,authors:element.dataset.authors.split(' '),id:element.dataset.work,title:element.dataset.title,authorSort:element.dataset.authorSort,chronologyOrder:Number(element.dataset.chronologyOrder),year:Number(element.dataset.year),language:element.dataset.language,english:element.dataset.english==='true',edited:element.dataset.edited==='true'}));
    const chips=document.querySelector('#active-filters'),disclosure=form.closest('details'),sort=document.querySelector('#work-sort'),results=document.querySelector('#work-results');
    if(window.matchMedia('(max-width:760px)').matches)disclosure.open=false;
    function restore(){
      const params=new URLSearchParams(location.search);
      sort.value=['oldest','newest','author','title'].includes(params.get('sort'))?params.get('sort'):'oldest';
      for(const [key,field] of Object.entries(fields))field.value=params.get(key)??'';
      for(const group of groups)for(const input of group.inputs)input.checked=params.getAll(group.key).includes(input.value);
    }
    function readFilters(){return {...Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,field.value.trim()])),...Object.fromEntries(groups.map(g=>[g.key,g.inputs.filter(input=>input.checked).map(input=>input.value)]))};}
    function updateChips(filters){
      chips.replaceChildren();
      const add=(key,value,label)=>{
        const button=document.createElement('button');button.type='button';button.className='filter-chip';button.dataset.remove=key;button.dataset.value=value;button.textContent=label;button.setAttribute('aria-label','Remove filter: '+label);
        const cross=document.createElement('span');cross.textContent='×';cross.setAttribute('aria-hidden','true');button.append(cross);chips.append(button);
      };
      if(filters.q)add('q',filters.q,'Search: '+filters.q);
      for(const group of groups)for(const input of group.inputs)if(input.checked)add(group.key,input.value,input.dataset.label);
      if(filters.from)add('from',filters.from,'From '+filters.from);
      if(filters.to)add('to',filters.to,'To '+filters.to);
      window.paperNames?.enhance(chips);
      chips.hidden=!chips.children.length;
      document.querySelector('#filter-selection-count').textContent=chips.children.length?'('+chips.children.length+')':'';
    }
    function updateFacets(filters){
      const counts=window.paperDiscovery.facetCounts(items,filters,choices);
      for(const group of groups){
        const available=group.inputs.filter(input=>counts[group.key][input.value]>0||input.checked);
        let alternatives=0;
        for(const input of group.inputs){
          const count=counts[group.key][input.value],row=input.closest('.facet-choice');
          row.querySelector('.facet-count').textContent=count;
          input.setAttribute('aria-label',input.dataset.label+' ('+count+(count===1?' work)':' works)'));
          row.classList.toggle('is-selected',input.checked);
          row.hidden=!available.includes(input)||(!input.checked&&!group.expanded&&alternatives++>=7);
        }
        group.element.hidden=!available.length;
        if(group.button){
          group.button.hidden=available.filter(input=>!input.checked).length<=7;
          group.button.textContent=group.expanded?'Show fewer':'Show all '+available.length;
          group.button.setAttribute('aria-expanded',String(group.expanded));
        }
      }
    }
    function filterWorks(sync=true){
      const filters=readFilters();let count=0;
      for(const item of items){item.element.hidden=!window.paperDiscovery.matchesWork(item,filters);if(!item.element.hidden)count++;}
      items.sort((a,b)=>window.paperDiscovery.compareWorks(a,b,sort.value));
      for(const item of items)results.append(item.element);
      document.querySelector('#search-status').textContent=count+' of '+items.length+' works';
      document.querySelector('#filter-apply').textContent='Show '+count+(count===1?' work':' works');
      document.querySelector('#works-heading').textContent=Object.values(filters).some(value=>value.length)?'Matching works':'All works';
      document.querySelector('#no-results').hidden=count!==0;
      updateFacets(filters);updateChips(filters);
      if(sync){
        const url=new URL(location.href);
        for(const key of [...Object.keys(fields),...groups.map(g=>g.key)]){
          url.searchParams.delete(key);
          for(const value of [].concat(filters[key]))if(value)url.searchParams.append(key,value);
        }
        if(sort.value==='oldest')url.searchParams.delete('sort');else url.searchParams.set('sort',sort.value);
        history.replaceState(null,'',url.pathname+url.search+url.hash);
      }
    }
    sort.addEventListener('change',()=>filterWorks());
    form.addEventListener('submit',event=>event.preventDefault());
    form.addEventListener('input',()=>filterWorks());
    form.addEventListener('change',()=>filterWorks());
    form.addEventListener('reset',event=>{event.preventDefault();sort.value='oldest';for(const field of Object.values(fields))field.value='';for(const group of groups){group.expanded=false;for(const input of group.inputs)input.checked=false;}filterWorks();});
    for(const group of groups)if(group.button)group.button.addEventListener('click',()=>{group.expanded=!group.expanded;updateFacets(readFilters());});
    chips.addEventListener('click',event=>{
      const button=event.target.closest('[data-remove]');if(!button)return;
      const position=[...chips.children].indexOf(button),key=button.dataset.remove;
      if(fields[key])fields[key].value='';else{const input=groups.find(g=>g.key===key)?.inputs.find(input=>input.value===button.dataset.value);if(input)input.checked=false;}
      filterWorks();(chips.children[Math.min(position,chips.children.length-1)]??fields.q).focus();
    });
    document.querySelector('#filter-apply').addEventListener('click',()=>{disclosure.open=false;document.querySelector('#works-heading').focus();});
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
