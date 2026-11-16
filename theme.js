/* Dark theme only. */
(() => {
 'use strict';
 const root=document.documentElement;
 root.dataset.theme='dark';
 root.style.colorScheme='dark';
 root.classList.remove('light');root.classList.add('dark');
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.content='#121212';
 try{localStorage.removeItem('shahab-portfolio-theme');}catch{}
})();
