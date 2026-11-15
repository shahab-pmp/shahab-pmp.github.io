(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = $('.ms-mobile-menu');
  const resources = $('.ms-resources');
  $$('.ms-mobile-menu a,.ms-resources a').forEach(a => a.addEventListener('click', () => { menu.open=false; resources.open=false; }));
  document.addEventListener('pointerdown', event => {
    [menu,resources].forEach(d => { if(d.open&&!d.contains(event.target)) d.open=false; });
  });
  document.addEventListener('keydown', event => {
    if(event.key!=='Escape') return;
    [menu,resources].forEach(d => { if(d.open){d.open=false;$('summary',d).focus();} });
  });
  $$('[data-experience-filter]').forEach(button => button.addEventListener('click', () => {
    const category=button.dataset.experienceFilter;
    $$('[data-experience-filter]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
    $$('[data-experience]').forEach(card => card.hidden=category!=='all'&&!card.dataset.experience.split(' ').includes(category));
  }));
  const rail=$('.ms-project-rail'),prev=$('[data-project-prev]'),next=$('[data-project-next]');
  const moveProjects=direction=>rail.scrollBy({left:direction*($('.ms-project-card',rail).getBoundingClientRect().width+24),behavior:reduced.matches?'auto':'smooth'});
  prev.addEventListener('click',()=>moveProjects(-1));next.addEventListener('click',()=>moveProjects(1));
  const railState=()=>{prev.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4;};
  rail.addEventListener('scroll',railState,{passive:true});window.addEventListener('resize',railState);railState();
  const dialog=$('.ms-search-dialog'),search=$('#portfolio-search'),results=$('.ms-search-results');
  const index=[{label:'Download resume',href:$('a[download]').getAttribute('href'),download:true}];
  $$('main h2,main h3,.ms-skill summary').forEach((heading,i)=>{
    if(!heading.id)heading.id='search-target-'+i;
    if(heading.closest('[data-company-back]'))return;
    const host=heading.closest('.ms-project-card,.ms-skill,[data-experience],section');
    index.push({label:heading.textContent.trim(),href:'#'+heading.id,keywords:host.textContent.toLowerCase()});
  });
  index.push({label:'Contact Muhammad Shahab',href:'#site-footer'});
  let searchTrigger;
  const renderSearch=()=>{
    const query=search.value.trim().toLowerCase();results.replaceChildren();
    const matches=index.filter(item=>!query||(item.label+' '+(item.keywords||'')).toLowerCase().includes(query)).slice(0,20);
    matches.forEach(item=>{
      const a=document.createElement('a');a.textContent=item.label;a.href=item.href;
      if(item.download)a.download='';
      a.addEventListener('click',()=>{
        dialog.close();
        if(item.href.startsWith('#')){
          const target=document.getElementById(item.href.slice(1));
          const company=target.closest('[data-experience]');
          if(company&&company.hidden)$('[data-experience-filter="all"]').click();
          if(company&&company.classList.contains('is-flipped'))company.dispatchEvent(new CustomEvent('show-responsibilities'));
          const details=target.closest('details');if(details)details.open=true;
          target.tabIndex=-1;
          requestAnimationFrame(()=>{target.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});target.focus({preventScroll:true});});
        }
      });
      results.append(a);
    });
    $('.ms-search-empty').hidden=matches.length>0;
  };
  const openSearch=trigger=>{menu.open=false;resources.open=false;searchTrigger=trigger;search.value='';renderSearch();dialog.showModal();search.focus();};
  $$('[data-open-search]').forEach(b=>b.addEventListener('click',()=>openSearch(b)));
  search.addEventListener('input',renderSearch);
  search.addEventListener('keydown',event=>{if(event.key==='ArrowDown'&&$('a',results)){event.preventDefault();$('a',results).focus();}});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{if(searchTrigger){const target=searchTrigger.getClientRects().length?searchTrigger:$('summary',menu);target.focus({preventScroll:true});}});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!dialog.open)openSearch($('[data-open-search]'));}});
  $('[data-copy-email]').addEventListener('click',async()=>{
    const status=$('[data-copy-feedback]');
    status.textContent='Copying email…';
    try{const copied=await Promise.race([navigator.clipboard.writeText('muhammadshahabpmp@gmail.com').then(()=>true),new Promise(resolve=>setTimeout(()=>resolve(false),1800))]);status.textContent=copied?'Email copied.':'Email: muhammadshahabpmp@gmail.com';}
    catch{status.textContent='Email: muhammadshahabpmp@gmail.com';}
  });
  const motion=$('[data-motion-region]'),motionButton=$('[data-motion-toggle]');
  motionButton.addEventListener('click',()=>{
    const paused=motion.classList.toggle('is-paused');motionButton.setAttribute('aria-pressed',String(paused));motionButton.querySelector('[data-motion-label]').textContent=paused?'Resume motion':'Pause motion';
  });
  if('IntersectionObserver'in window){
    new IntersectionObserver(entries=>entries.forEach(entry=>motion.classList.toggle('is-playing',entry.isIntersecting&&!reduced.matches))).observe(motion);
    const navLinks=$$('.ms-desktop-nav>a');
    new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});
    },{rootMargin:'-15% 0px -65% 0px'}).observe($('#experiences'));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-15% 0px -65% 0px'});
    $$('#recent-work,#beyond-work,#blog').forEach(section=>observer.observe(section));
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)motion.classList.remove('is-playing');});
})();
