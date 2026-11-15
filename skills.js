/* Turn each skill's comma list into chips so the open row can animate them in. */
(() => {
 document.querySelectorAll('.ms-skill').forEach(row=>{
  const p=row.querySelector(':scope>p');
  if(!p||row.querySelector('.ms-skill-chips'))return;
  const parts=p.textContent.split(/,\s*(?![^()]*\))/).map(s=>s.trim()).filter(Boolean);
  if(parts.length<2)return;
  const ul=document.createElement('ul');ul.className='ms-skill-chips';
  ul.setAttribute('aria-label',row.querySelector('summary').textContent);
  parts.forEach((t,i)=>{const li=document.createElement('li');li.className='ms-gooey-action';li.textContent=t;li.style.setProperty('--i',i);ul.appendChild(li);});
  p.replaceWith(ul);
 });
})();
