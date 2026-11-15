/* Give every green button the same water-drop hover, whichever part of the page it is in. */
(() => {
 const GREENS=[[20,245,144],[13,225,127]];
 const isGreen=bg=>{
  const m=/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(bg);
  if(!m||(m[4]!==undefined&&parseFloat(m[4])<.9))return false;
  return GREENS.some(g=>Math.abs(g[0]-m[1])<14&&Math.abs(g[1]-m[2])<14&&Math.abs(g[2]-m[3])<14);
 };
 const SELECTOR='main *,footer *,header *';
 const scan=()=>{
  document.querySelectorAll(SELECTOR).forEach(el=>{
   if(el.classList.contains('ms-gooey-action')||el.closest('dialog'))return;
   if(el.classList.contains('ms-name-surprise')||el.tagName==='SVG'||el.tagName==='svg'||el.tagName==='IMG'||el.tagName==='path')return;
   if(el.children.length>5||el.offsetWidth>700)return;
   if(isGreen(getComputedStyle(el).backgroundColor))el.classList.add('ms-gooey-action');
  });
 };
 /* Picture-only green circles (How I Work icons) get a round wrapper that can carry the effect. */
 const wrapIcons=()=>document.querySelectorAll('.ms-process-card .shrink-0>img').forEach(img=>{
  if(img.parentElement.classList.contains('ms-gooey-icon'))return;
  const w=document.createElement('span');w.className='ms-gooey-icon ms-gooey-action';
  img.replaceWith(w);w.appendChild(img);
 });
 let t=0;
 const later=()=>{clearTimeout(t);t=setTimeout(scan,120);};
 addEventListener('load',()=>{wrapIcons();scan();setTimeout(scan,800);});
 document.addEventListener('click',later,true);
 document.addEventListener('pointerover',e=>{if(e.target.closest&&!e.target.closest('.ms-gooey-action'))later();},{passive:true});
 new MutationObserver(later).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
