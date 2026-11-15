/* Staggered credential entrance. Content remains visible without JavaScript. */
(() => {
 document.querySelectorAll('#academic,#certifications').forEach(section=>{
 const items=[...section.querySelectorAll('[data-credential-reveal]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
 },{threshold:.12});
 section.classList.add('ms-academic-motion');
 items.forEach(item=>observer.observe(item));
 section.addEventListener('focusin',event=>{
  const item=event.target.closest('[data-credential-reveal]');
  if(item){item.classList.add('is-visible');observer.unobserve(item);}
 });
 reduced.addEventListener('change',()=>{
  if(reduced.matches){observer.disconnect();items.forEach(item=>item.classList.add('is-visible'));}
 });
 });
})();
