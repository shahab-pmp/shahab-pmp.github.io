/* Restore the old navigator needle's scroll direction and hover response. */
(() => {
 const logo=document.querySelector('.ms-brand .ms-navigator');
 if(!logo)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let queued=false;
 const update=()=>{
  queued=false;
  const range=document.documentElement.scrollHeight-innerHeight;
  logo.style.setProperty('--navigator-turn',reduced.matches?'0deg':(range>0?scrollY/range*360:0).toFixed(2)+'deg');
 };
 addEventListener('scroll',()=>{
  if(!queued&&!reduced.matches){queued=true;requestAnimationFrame(update);}
 },{passive:true});
 addEventListener('resize',update,{passive:true});
 reduced.addEventListener('change',update);
 update();
})();
