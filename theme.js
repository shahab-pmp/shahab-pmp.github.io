/* Apply the saved theme before styles paint; wire the accessible header control when ready. */
(() => {
 'use strict';
 const key='shahab-portfolio-theme',root=document.documentElement;
 const normalize=value=>value==='light'?'light':'dark';
 const syncButton=()=>{
  const button=document.querySelector('[data-theme-toggle]');
  if(!button)return;
  const light=root.dataset.theme==='light';
  button.setAttribute('aria-pressed',String(light));
  button.title=light?'Switch to dark theme':'Switch to light theme';
 };
 const apply=(value,persist=false)=>{
  const theme=normalize(value);
  root.dataset.theme=theme;
  root.style.colorScheme=theme;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=theme==='light'?'#F7FAF8':'#090D0F';
  if(persist){try{localStorage.setItem(key,theme);}catch{}}
  syncButton();
 };
 let initial='dark';
 try{initial=normalize(localStorage.getItem(key));}catch{}
 apply(initial);
 const ready=()=>{
  const button=document.querySelector('[data-theme-toggle]');
  if(!button)return;
  syncButton();
  button.addEventListener('click',()=>apply(root.dataset.theme==='dark'?'light':'dark',true));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
 else ready();
 addEventListener('storage',event=>{if(event.key===key)apply(event.newValue);});
})();
