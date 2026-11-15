/* Sticky headings retain their text only; descriptions stay in the opening view. */
(() => {
 const headings=[...document.querySelectorAll('.ms-section-title')];
 const FADE=260;
 let pending=false;
 const update=()=>{
  pending=false;
  headings.forEach(heading=>{
   const top=parseFloat(getComputedStyle(heading).top)||0;
   const section=heading.closest('section');
   const stuck=heading.getBoundingClientRect().top<=top+1 && section.getBoundingClientRect().top<0;
   heading.classList.toggle('is-heading-stuck',stuck);
   /* Fade the heading out slowly once it would start to ride over the next content. */
   const sectionTop=section.getBoundingClientRect().top;
   if(!stuck && heading.dataset.msOffset===undefined) heading.dataset.msOffset=heading.getBoundingClientRect().top-sectionTop;
   const offset=parseFloat(heading.dataset.msOffset)||0;
   const past=top-(sectionTop+offset);
   const fade=Math.min(1,Math.max(0,past/FADE));
   heading.style.opacity=fade>0?String(1-fade):'';
   heading.style.pointerEvents=fade>=1?'none':'';
  });
 };
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',()=>{headings.forEach(h=>delete h.dataset.msOffset);schedule();},{passive:true});
 document.fonts.ready.then(schedule);
 schedule();
})();
