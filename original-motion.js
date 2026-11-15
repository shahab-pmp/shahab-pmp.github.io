/* Motion reconstructed from the supplied reference's public component code; no original hydration or analytics. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=$('.ms-hero'),roleBox=$('.ms-roles'),roles=$$('[data-role]'),description=$('[data-role-description]');
  document.documentElement.classList.add('motion-ready');
  if(!reduced.matches){
    /* Intro: the compass logo arrives in front, its needle swings and settles, then the screen zooms into it and the site opens. */
    const loader=document.createElement('div');loader.className='ms-reference-loader';loader.setAttribute('aria-hidden','true');
    const stage=document.createElement('div');stage.className='ms-loader-stage';
    const source=$('.ms-brand .ms-navigator');
    if(source){const logo=source.cloneNode(true);logo.removeAttribute('width');logo.removeAttribute('height');logo.classList.add('ms-loader-logo');stage.append(logo);}
    const label=document.createElement('span');label.className='ms-loader-name';
    label.innerHTML='<span class="ms-loader-first">MUHAMMAD</span> <span class="ms-loader-last">SHAHAB</span>';
    stage.append(label);loader.append(stage);document.body.append(loader);
    document.documentElement.classList.add('ms-intro-running');
    setTimeout(()=>loader.classList.add('is-zoom'),2000);
    setTimeout(()=>{loader.remove();document.documentElement.classList.remove('ms-intro-running');},2900);
  }
  const sequence=[1,0,2],copy=[
    'PMP and CSM certified. 5+ years in software delivery.',
    'Scrum and SAFe facilitation across up to five teams.',
    'Scope, budgets, risks, and client sign-offs kept in view.'
  ];
  let position=1,heroVisible=true,roleHover=false,roleFocus=false,roleInterval,lastSwipe=0;
  roles.forEach(b=>{const inner=document.createElement('span');inner.className='ms-role-inner';while(b.firstChild)inner.append(b.firstChild);b.append(inner);});
  const selectRole=(next,direction='next',focus=false)=>{
    position=(next+sequence.length)%sequence.length;const active=sequence[position];
    const order=[sequence[(position+2)%3],active,sequence[(position+1)%3]];
    roleBox.classList.toggle('is-previous',direction==='previous');
    order.forEach(id=>roleBox.append(roles.find(b=>Number(b.dataset.role)===id)));
    roles.forEach(b=>{const yes=Number(b.dataset.role)===active;b.classList.toggle('is-selected',yes);b.setAttribute('aria-pressed',String(yes));b.tabIndex=yes?0:-1;
      const inner=$('.ms-role-inner',b);inner.style.animation='none';void inner.offsetWidth;inner.style.animation='';
    });
    description.textContent=copy[active];description.classList.remove('is-changing');void description.offsetWidth;description.classList.add('is-changing');
    if(focus)roles.find(b=>Number(b.dataset.role)===active).focus({preventScroll:true});
  };
  const cycle=(direction=1,focus=false)=>selectRole(position+direction,direction<0?'previous':'next',focus);
  roles.forEach(b=>b.addEventListener('click',()=>{
    if(performance.now()-lastSwipe<400)return;
    const next=sequence.indexOf(Number(b.dataset.role));if(next===position)cycle(1,true);else selectRole(next,next<position?'previous':'next',true);
  }));
  roleBox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();cycle(e.key==='ArrowRight'?1:-1,true);}});
  [roleBox,description].forEach(el=>{el.addEventListener('mouseenter',()=>roleHover=true);el.addEventListener('mouseleave',()=>roleHover=false);});
  roleBox.addEventListener('focusin',()=>roleFocus=true);roleBox.addEventListener('focusout',()=>setTimeout(()=>roleFocus=roleBox.contains(document.activeElement),0));
  let swipeStart;
  roleBox.addEventListener('pointerdown',e=>swipeStart={x:e.clientX,y:e.clientY});
  window.addEventListener('pointerup',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5){lastSwipe=performance.now();cycle(dx<0?1:-1);}});
  selectRole(1);
  roleInterval=setInterval(()=>{if(heroVisible&&!document.hidden&&!reduced.matches&&!roleHover&&!roleFocus)cycle();},4000);
  const heroAction=$('.ms-hero .ms-button');
  const actionText=[...heroAction.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
  [...heroAction.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>n.remove());
  const roll=document.createElement('span');roll.className='ms-cta-roll';
  const primaryLabel=document.createElement('span');primaryLabel.textContent=actionText;
  const repeatedLabel=document.createElement('span');repeatedLabel.textContent=actionText;repeatedLabel.setAttribute('aria-hidden','true');roll.append(primaryLabel,repeatedLabel);heroAction.append(roll);
  // Eyes: same radius clamp, 0.18 interpolation, blink window and idle states as the reference.
  const eyes=$('[data-eyes]'),eyeNodes=$$('.ms-eye',eyes),pupils=$$('.ms-pupil',eyes);
  const target=[{x:0,y:0},{x:0,y:0}],current=[{x:0,y:0},{x:0,y:0}];
  let lastActivity=Date.now(),raf=0,expression=0,expressionTimeout;
  const renderEyes=()=>{
    raf=0;if(!heroVisible||reduced.matches||document.hidden)return;
    let moving=false;
    pupils.forEach((p,i)=>{current[i].x+=(target[i].x-current[i].x)*.18;current[i].y+=(target[i].y-current[i].y)*.18;p.style.transform=`translate3d(${current[i].x.toFixed(2)}px,${current[i].y.toFixed(2)}px,0)`;if(Math.abs(current[i].x-target[i].x)+Math.abs(current[i].y-target[i].y)>.08)moving=true;});
    if(moving)raf=requestAnimationFrame(renderEyes);
  };
  const queueEyes=()=>{if(!raf)raf=requestAnimationFrame(renderEyes);};
  const wakeEyes=()=>{lastActivity=Date.now();if(eyes.classList.contains('is-sleeping')){eyes.classList.remove('is-sleeping');eyes.classList.add('is-waking');setTimeout(()=>eyes.classList.remove('is-waking'),350);}};
  const lookAt=(x,y)=>{
    if(reduced.matches||!heroVisible)return;wakeEyes();
    eyeNodes.forEach((eye,i)=>{const r=eye.getBoundingClientRect(),dx=x-r.left-r.width/2,dy=y-r.top-r.height/2,angle=Math.atan2(dy,dx),distance=Math.min(.14*Math.hypot(dx,dy),.36*r.width/2);target[i].x=Math.cos(angle)*distance;target[i].y=Math.sin(angle)*distance;});queueEyes();
  };
  window.addEventListener('pointermove',e=>lookAt(e.clientX,e.clientY),{passive:true});
  window.addEventListener('touchmove',e=>{if(e.touches[0])lookAt(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  const expressEyes=()=>{
    if(reduced.matches)return;
    if(eyes.classList.contains('is-sleeping')){wakeEyes();return;}
    wakeEyes();clearTimeout(expressionTimeout);eyes.classList.remove('is-winking','is-surprised');eyes.classList.add(expression++%2?'is-surprised':'is-winking');
    expressionTimeout=setTimeout(()=>eyes.classList.remove('is-winking','is-surprised'),700);
  };
  eyes.addEventListener('click',expressEyes);eyes.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();expressEyes();}});
  const scheduleBlink=()=>setTimeout(()=>{if(heroVisible&&!document.hidden&&!reduced.matches&&!eyes.classList.contains('is-sleeping')){eyes.classList.add('is-blinking');setTimeout(()=>eyes.classList.remove('is-blinking'),140);}scheduleBlink();},3500+Math.random()*4000);
  scheduleBlink();
  setInterval(()=>{
    if(!heroVisible||document.hidden||reduced.matches)return;
    const idle=Date.now()-lastActivity;
    if(idle>=8000){eyes.classList.add('is-sleeping');target.forEach(p=>{p.x=0;p.y=28;});queueEyes();}
    else if(idle>=3000){const positions=[[-22,-6],[22,-6],[0,-24],[-14,-16],[14,-16],[0,0]],point=positions[Math.floor(Math.random()*positions.length)];target.forEach(p=>{p.x=point[0];p.y=point[1];});queueEyes();}
  },1000);
  // Source card behavior: 1.2 second hover dwell, 700ms two-sided rotation, reset on leave.
  $$('[data-experience]').forEach((card,index)=>{
    const front=$('[data-company-front]',card),back=$('[data-company-back]',card);let hoverTimeout;
    front.hidden=false;back.hidden=false;back.id='company-projects-'+index;
    const flip=(state,focus=false)=>{
      card.classList.toggle('is-flipped',state);front.inert=state;back.inert=!state;front.setAttribute('aria-hidden',String(state));back.setAttribute('aria-hidden',String(!state));
      $$('[data-flip-company]',card).forEach(b=>{b.setAttribute('aria-controls',back.id);b.setAttribute('aria-expanded',String(state));});
      if(focus)$('[data-flip-company]',state?back:front).focus({preventScroll:true});
    };
    $$('[data-flip-company]',card).forEach(b=>b.addEventListener('click',()=>flip(!card.classList.contains('is-flipped'),true)));
    card.addEventListener('mouseenter',()=>{clearTimeout(hoverTimeout);if(!reduced.matches)hoverTimeout=setTimeout(()=>{if(!$('details[open]',card)&&!card.contains(document.activeElement))flip(true);},1200);});
    card.addEventListener('mouseleave',()=>{clearTimeout(hoverTimeout);if(!card.contains(document.activeElement))flip(false);});
    card.addEventListener('click',e=>{if(e.target.closest('a,button,summary,details')||getSelection().toString())return;flip(!card.classList.contains('is-flipped'));});
    card.addEventListener('show-responsibilities',()=>flip(false));flip(false);
  });
  // Seamless original project motion reuses the real cards, so every visible contribution control remains usable.
  const rail=$('.ms-project-rail'),realCards=$$('[data-project-real]',rail),pauseProjects=$('[data-project-pause]');
  let projectVisible=false,projectHover=false,projectPaused=false,projectFrame=0,projectLast=0,projectManualUntil=0,projectPosition=rail.scrollLeft;
  const projectTick=time=>{
    if(!projectVisible||reduced.matches||document.hidden){projectFrame=0;projectLast=0;return;}
    const delta=projectLast?Math.min(time-projectLast,40):0;projectLast=time;
    if(!projectHover&&!projectPaused&&!rail.contains(document.activeElement)&&!$('details[open]',rail)&&performance.now()>projectManualUntil){
      const loop=realCards.reduce((n,card)=>n+card.getBoundingClientRect().width+24,0);
      projectPosition+=delta*loop/35000;
      let first=rail.querySelector('[data-project-real]'),stride=first.getBoundingClientRect().width+24;
      while(projectPosition>=stride){rail.append(first);projectPosition-=stride;first=rail.querySelector('[data-project-real]');stride=first.getBoundingClientRect().width+24;}
      rail.scrollLeft=projectPosition;
    }else{projectPosition=rail.scrollLeft;}
    projectFrame=requestAnimationFrame(projectTick);
  };
  const startProjects=()=>{if(!projectFrame&&projectVisible&&!reduced.matches)projectFrame=requestAnimationFrame(projectTick);};
  rail.addEventListener('mouseenter',()=>projectHover=true);rail.addEventListener('mouseleave',()=>projectHover=false);
  rail.addEventListener('pointerdown',()=>projectManualUntil=performance.now()+6000);
  rail.addEventListener('wheel',()=>projectManualUntil=performance.now()+6000,{passive:true});
  rail.addEventListener('toggle',event=>{if(event.target.matches('details')&&event.target.open){const card=event.target.closest('[data-project-real]');if(card)card.scrollIntoView({block:'nearest',inline:'center',behavior:reduced.matches?'auto':'smooth'});}},true);

  $$('[data-project-prev],[data-project-next]').forEach(b=>b.addEventListener('click',()=>projectManualUntil=performance.now()+6000));
  pauseProjects.addEventListener('click',()=>{projectPaused=!projectPaused;if(!projectPaused){projectManualUntil=0;projectPosition=rail.scrollLeft;}pauseProjects.setAttribute('aria-pressed',String(projectPaused));pauseProjects.textContent=projectPaused?'Resume projects':'Pause projects';});
  if('IntersectionObserver'in window){
    new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)queueEyes();}).observe(hero);
    new IntersectionObserver(entries=>{projectVisible=entries[0].isIntersecting;startProjects();}).observe(rail);
  }
  // Original reference tool-icon drop: desktop entrance and name-click replay.
  const surprise=$('.ms-name-surprise');let stickerLayer,lastDrop=-Infinity;
  const stickerIcons=['ai','antigravity','chatgpt','clickup','cloude','consultancy-icon','content-icon','creative-and-brand-icon','doc','figma','github','google-meet','grammarly','mail','notion','pinterest','ps','slack','vscode'];
  const dropIcons=()=>{
    if(reduced.matches||performance.now()-lastDrop<1000)return;
    lastDrop=performance.now();if(stickerLayer)stickerLayer.remove();
    stickerLayer=document.createElement('div');stickerLayer.className='ms-sticker-layer';stickerLayer.setAttribute('aria-hidden','true');
    const shuffled=[...stickerIcons];
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    const spread=86/shuffled.length;
    shuffled.forEach((name,i)=>{
      const image=document.createElement('img');image.className='ms-falling-sticker';image.alt='';image.src=`assets/images/easteregg/${document.documentElement.dataset.theme==='light'?'light':'dark'}/${name}.svg?v=2`;
      const size=56+Math.floor(Math.random()*24);
      image.style.cssText=`left:${Math.max(5,Math.min(93,6+i*spread+.9*spread*(Math.random()-.5)))}%;width:${size}px;height:${size}px;--fall-duration:${2.3+Math.random()}s;--fall-delay:${Math.random()*.5}s;--sway:${(Math.random()-.5)*120}px;--rotate:${(Math.random()-.5)*60}deg`;
      stickerLayer.append(image);
    });
    document.body.append(stickerLayer);const layer=stickerLayer;setTimeout(()=>layer.remove(),4200);
  };
  surprise.addEventListener('click',dropIcons);
  window.addEventListener('trigger-emoji-drop',dropIcons);
  const resources=$('.ms-resources');let resourceTimer;
  resources.addEventListener('mouseenter',()=>{clearTimeout(resourceTimer);if(matchMedia('(hover:hover)').matches)resources.open=true;});
  resources.addEventListener('mouseleave',()=>{resourceTimer=setTimeout(()=>{if(!resources.contains(document.activeElement))resources.open=false;},160);});
  const copyButton=$('[data-copy-email]'),copyStatus=$('[data-copy-feedback]'),copyLabel=$('span',copyButton),copyIcon=$('svg',copyButton),originalIcon=copyIcon.innerHTML;let copyTimer;
  new MutationObserver(()=>{
    if(copyStatus.textContent!=='Email copied.')return;
    clearTimeout(copyTimer);copyLabel.textContent='Copied!';copyButton.classList.add('is-copied');copyIcon.innerHTML='<path d="M5 12l4 4L19 6"/>';
    copyTimer=setTimeout(()=>{copyLabel.textContent='Copy Email';copyButton.classList.remove('is-copied');copyIcon.innerHTML=originalIcon;},2000);
  }).observe(copyStatus,{childList:true,characterData:true,subtree:true});
  window.addEventListener('scroll',()=>$('.ms-header').classList.toggle('is-scrolled',scrollY>15),{passive:true});
  reduced.addEventListener('change',()=>{
    if(reduced.matches){if(raf)cancelAnimationFrame(raf);raf=0;if(projectFrame)cancelAnimationFrame(projectFrame);projectFrame=0;eyes.classList.remove('is-sleeping','is-winking','is-surprised','is-blinking');pupils.forEach(p=>p.style.transform='none');if(stickerLayer)stickerLayer.remove();}
    else{startProjects();queueEyes();}
  });
})();
