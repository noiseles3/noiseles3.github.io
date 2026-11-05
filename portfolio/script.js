(() => {
 'use strict';
 const projects = window.PORTFOLIO_PROJECTS;
 const $ = (selector, root = document) => root.querySelector(selector);
 const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
 const paths = {
 menu:'M4 6h16M4 12h16M4 18h16', search:'m21 21-5-5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
 home:'m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
 grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
 bookmark:'M6 3h12v18l-6-4-6 4Z',code:'m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',send:'m22 2-7 20-4-9-9-4ZM22 2 11 13',
 game:'M7 7h10c3 0 5 7 4 10-1 4-5-1-6-2H9c-1 1-5 6-6 2C2 14 4 7 7 7ZM6 11v5m-2.5-2.5h5M16 11h.01M19 14h.01',
 bolt:'m13 2-9 12h7l-1 8L21 9h-8Z',user:'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 message:'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 3V11.5a10 10 0 1 1 20 0Z',check:'m5 12 4 4L19 6',arrow:'M5 12h14m-6-6 6 6-6 6',
 sun:'M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
 moon:'M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10Z',shuffle:'M3 4h3c5 0 7 16 12 16h3m-4-4 4 4-4 4M3 20h3c2 0 3-3 5-6m2-4c2-4 3-6 5-6h3m-4-4 4 4-4 4',
 sort:'M4 6h16M4 12h11M4 18h6',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',info:'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 close:'m6 6 12 12M6 18 18 6',play:'m9 5 11 7-11 7Z',share:'M12 16V2m-5 5 5-5 5 5M5 10H3v12h18V10h-2',dice:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01',
 puzzle:'M3 3h6a3 3 0 1 1 6 0h6v6a3 3 0 1 0 0 6v6h-6a3 3 0 1 0-6 0H3v-6a3 3 0 1 0 0-6Z'
 };
 function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.code}"/></svg>`;}
 function hydrate(root = document){$$('[data-icon]',root).forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
 function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}}
 function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Private browsing: state remains in memory. */}}
 const storedSaved = read('iz-saved',[]);
 const saved = new Set(Array.isArray(storedSaved) ? storedSaved.filter(id=>projects.some(p=>p.id===id)) : []);
 let category='all', query='', view='home', sort='featured', toastTimer, previousFocus=null, activeProject=null, closeHash='';
 const dialog=$('#project-dialog');
 const categoryNames={all:'Все проекты',telegram:'Telegram и Mini Apps',games:'Разработка игр',web:'Веб и приложения',automation:'Автоматизация',creative:'Креатив'};
 const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const art = p => {
  if(p.image)return `<img class="thumb-image" src="${p.image}" alt="Превью проекта ${p.title}" loading="lazy" width="640" height="360">`;
  switch(p.art){
   case 'games':return `<div class="game-tiles" aria-hidden="true"><div class="game-tile">${icon('user')}</div><div class="game-tile">?</div><div class="game-tile">${icon('dice')}</div><div class="game-tile">×</div><div class="game-tile">${icon('puzzle')}</div><div class="game-tile">♠</div></div>`;
   case 'spade':return '<div class="spade-art" aria-hidden="true">♠</div><span class="spade-word">Le Spade</span>';
   case 'case':return '<span class="case-word">CASE<br>DROP.</span><img class="case-art" src="demos/case-drop-farm/assets/caseboxes/box19.webp" alt="Игровой кейс" loading="lazy">';
   case 'meteor':return '<div class="meteor-tail"></div><div class="meteor-planet"></div><span class="thumb-large-word">METEOR<br>RUSH ↗</span>';
   case 'cafe':return '<div class="cafe-card"><small>МОЯ КОМАНДА</small><strong>CafeCrew.</strong><div class="cafe-bars"><i></i><i></i><i></i><i></i><i></i></div></div><span class="thumb-large-word">Смены.<br>Без суеты.</span>';
   case 'bot':return '<div class="bot-bubbles"><div class="bot-bubble"><strong>Нужен Telegram-бот</strong>Mini App · разработка · новый заказ</div><div class="bot-bubble">Нашёл кое-что подходящее ↗</div></div>';
   case 'monitor':return '<div class="monitor-ui"><div class="monitor-row"><i></i><span>Новое объявление</span><b>НОВОЕ</b></div><div class="monitor-row"><i></i><span>По вашей подборке</span><b>↗</b></div><div class="monitor-row"><i></i><span>Уже в Telegram</span><b>✓</b></div></div>';
   case 'slots':return '<div class="reels-art" aria-hidden="true"><span>7</span><span>7</span><span>7</span></div>';
   case 'coin':return '<div class="coin-art" aria-hidden="true">♠</div>';
   case 'forest':return '<div class="forest-art" aria-hidden="true"><i class="tree"></i><i class="tree"></i><i class="tree"></i><i class="firefly"></i><i class="firefly"></i></div><span class="forest-word">Отзвук</span>';
   default:return '';
  }
 };
 function thumbnail(p,overlay=true){return `<div class="thumbnail thumb-${p.art}${p.image?' has-image':''}"><div class="thumb-top"><b>${p.title}</b><span>${p.category==='telegram'?'MINI APP':p.category==='games'?'PLAY & EXPLORE':p.category==='creative'?'EXPERIMENT':'BUILD & CREATE'}</span></div>${art(p)}<span class="thumb-tag">${p.demo?'↗ ЖИВОЕ ДЕМО':p.kind}</span>${overlay?`<div class="thumb-play"><span>${icon(p.demo?'play':'arrow')}</span></div>`:''}</div>`;}
 function savedButton(p){const isSaved=saved.has(p.id);return `<button class="save-button${isSaved?' saved':''}" data-save="${p.id}" aria-label="${isSaved?'Убрать из избранного':'Сохранить в избранное'}: ${p.title}" aria-pressed="${isSaved}">${icon('bookmark')}</button>`;}
 function render(){
  const searching=query.trim().toLocaleLowerCase('ru');
  let list=projects.filter(p=>(category==='all'||p.category===category)&&(view!=='saved'||saved.has(p.id))&&(!searching||[p.title,p.subtitle,p.description,p.kind,...p.tags].join(' ').toLocaleLowerCase('ru').includes(searching)));
  if(sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title,'ru'));
  if(sort==='demo')list.sort((a,b)=>Number(Boolean(b.demo))-Number(Boolean(a.demo)));
  $('#projects-grid').innerHTML=list.map(p=>`<article class="project-card"><button class="thumbnail-button" data-project="${p.id}" aria-label="Подробнее о проекте ${p.title}">${thumbnail(p)}</button><div class="project-info"><span class="project-avatar" aria-hidden="true">${p.monogram}</span><div class="project-text"><h3><button class="project-title" data-project="${p.id}">${p.title}</button></h3><p class="project-subtitle">${p.description}</p><div class="project-tech">${p.tags.slice(0,2).map((t,i)=>`${i?'<i></i>':''}<span>${t}</span>`).join('')}</div></div></div><button class="project-details" data-project="${p.id}">Подробнее о проекте →</button></article>`).join('');
  $('#empty-state').hidden=list.length>0;
  $('#projects-title').innerHTML=view==='saved'?'Моя подборка<span class="lime">.</span>':category!=='all'?`${categoryNames[category]}<span class="lime">.</span>`:'Мои проекты';
  $('#results-caption').textContent=searching?`Найдено: ${list.length} · Поиск: «${query}»`:view==='saved'?`Сохранено: ${list.length} · Эта подборка хранится в вашем браузере.`:category!=='all'?`В подборке: ${list.length} · Выбирайте проект и заглядывайте внутрь.`:'Нажмите на проект, чтобы узнать подробнее.';
  $('#saved-count').textContent=saved.size;
  $$('.filter').forEach(btn=>{const selected=btn.dataset.filter===category;btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',selected);});
  $$('[data-category]').forEach(btn=>btn.classList.toggle('active',view!=='saved'&&category===btn.dataset.category));
 }
 function setSection(next,scroll=false){
  view=next;
  const section=['about','contact'].includes(view)?view:'projects';
  $$('.content-section').forEach(el=>el.hidden=el.id!==section);
  $$('[data-tab]').forEach(el=>{const active=el.dataset.tab===section;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current');});
  $$('[data-nav]').forEach(el=>{const active=el.dataset.nav===view;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current');});
  if(section==='projects')render();
  closeMenu();
  if(scroll)requestAnimationFrame(()=>$(next==='home'?'#home':`#${section}`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
 }
 function navigate(target){if(location.hash===`#${target}`)route(true);else location.hash=target;}
 function route(scroll=false){
  const hash=location.hash.slice(1);
  if(hash.startsWith('project=')){
   const p=projects.find(p=>p.id===hash.slice(8));
   if(p){if($('#projects').hidden)setSection('projects');showProject(p,false);return;}
  }
  if(dialog.open){dialog.close();activeProject=null;}
  const next=['home','projects','saved','about','contact'].includes(hash)?hash:'home';
  if(next==='home'){category='all';query='';$('#search-input').value='';}
  setSection(next,scroll);
 }
 function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
 function toggleSaved(id){
  const focused=document.activeElement;const inDialog=dialog.contains(focused);
  if(saved.has(id)){saved.delete(id);toast('Проект убран из избранного');}else{saved.add(id);toast('Проект сохранён в избранное');}
  write('iz-saved',[...saved]);render();
  if(activeProject){const holder=$('.dialog-title-row .save-button');if(holder)holder.outerHTML=savedButton(activeProject);}
  const replacement=$(inDialog?`.dialog-title-row [data-save="${id}"]`:`.project-card [data-save="${id}"]`);
  if(replacement)replacement.focus({preventScroll:true});
  else if(view==='saved')$('#projects-title').setAttribute('tabindex','-1'),$('#projects-title').focus({preventScroll:true});
 }
 function showProject(p,push=true){
  if(!dialog.open){previousFocus=document.activeElement;closeHash=location.hash.startsWith('#project=')?'#projects':location.hash;}
  activeProject=p;
  $('#dialog-content').innerHTML=`<div class="dialog-visual">${thumbnail(p,false)}</div><div class="dialog-main"><div class="dialog-eyebrow">${p.kind}</div><div class="dialog-title-row"><h2 id="dialog-title">${p.title}</h2>${savedButton(p)}</div><p>${p.description}</p><div class="stack-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><h3>Что внутри</h3><ul class="feature-list">${p.features.map(f=>`<li>${icon('check')}<span>${f}</span></li>`).join('')}</ul><p class="dialog-note">${p.note}</p><div class="dialog-actions">${p.demo?`<a class="button primary" href="${p.demo}" target="_blank" rel="noopener">${icon('play')}Открыть демо ${icon('arrow')}</a>`:`<button class="button primary" data-discuss>${icon('message')}Обсудить похожий проект</button>`}<button class="button secondary" data-share="${p.id}">${icon('share')}Ссылка на проект</button></div></div>`;
  if(!dialog.open)dialog.showModal();
  if(push)history.replaceState(null,'',`#project=${p.id}`);
  $('#dialog-close').focus({preventScroll:true});
 }
 function closeProject(){if(!dialog.open)return;dialog.close();activeProject=null;if(location.hash.startsWith('#project='))history.replaceState(null,'',closeHash||'#projects');if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});}
 async function share(id){
  const url=new URL(location.href);url.hash=`project=${id}`;
  try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(url.href);toast('Ссылка на проект скопирована');}
  catch{const input=document.createElement('input');input.value=url.href;input.setAttribute('aria-label','Ссылка на проект');input.style.cssText='position:fixed;bottom:20px;left:20px;width:calc(100% - 40px);z-index:200;padding:14px';(dialog.open?dialog:document.body).append(input);input.focus();input.select();toast('Скопируйте выделенную ссылку');input.addEventListener('blur',()=>input.remove(),{once:true});}
 }
 function closeMenu(){document.body.classList.remove('menu-open');$('#menu-toggle').setAttribute('aria-expanded','false');}
 hydrate();
 const storedTheme=read('iz-theme','dark');
 function theme(value){document.documentElement.dataset.theme=value;$('#theme-toggle').innerHTML=icon(value==='dark'?'sun':'moon');$('#theme-toggle').setAttribute('aria-label',value==='dark'?'Включить светлую тему':'Включить тёмную тему');$('meta[name="theme-color"]').content=value==='dark'?'#101110':'#f7f8f4';write('iz-theme',value);}
 theme(storedTheme==='light'?'light':'dark');
 $('#theme-toggle').addEventListener('click',()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
 ['#project-count','#profile-count','#tab-count'].forEach(id=>$(id).textContent=projects.length);
 document.addEventListener('click',event=>{
  const project=event.target.closest('[data-project]');if(project){showProject(projects.find(p=>p.id===project.dataset.project));return;}
  const save=event.target.closest('[data-save]');if(save){toggleSaved(save.dataset.save);return;}
  const shareButton=event.target.closest('[data-share]');if(shareButton){share(shareButton.dataset.share);return;}
  if(event.target.closest('[data-discuss]')){const title=activeProject.title;closeProject();navigate('contact');if(!$('#brief-message').value)$('#brief-message').value=`Интересует проект, похожий на «${title}». Моя идея: `;return;}
  const filter=event.target.closest('[data-filter], [data-category]');if(filter){category=filter.dataset.filter||filter.dataset.category;query='';$('#search-input').value='';if(view==='about'||view==='contact')navigate('projects');else{render();closeMenu();if(filter.dataset.category)$('#projects').scrollIntoView({block:'start'});}return;}
  const link=event.target.closest('a[href^="#"]');if(link&&link.hash===location.hash){event.preventDefault();route(true);}
 });
 $('#search-input').addEventListener('input',event=>{query=event.target.value;if(['about','contact'].includes(view)){history.replaceState(null,'','#projects');setSection('projects');}render();});
 $('#search-form').addEventListener('submit',event=>{event.preventDefault();if(view==='saved')view='projects';setSection('projects',true);history.replaceState(null,'','#projects');});
 $('#sort-select').addEventListener('change',event=>{sort=event.target.value;render();});
 $('#reset-filters').addEventListener('click',()=>{category='all';query='';$('#search-input').value='';if(view==='saved')navigate('projects');else render();});
 $('#about-more').addEventListener('click',()=>navigate('about'));
 $('#random-project').addEventListener('click',()=>showProject(projects[Math.floor(Math.random()*projects.length)]));
 $('#dialog-close').addEventListener('click',closeProject);
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeProject();}});
 $('#menu-toggle').addEventListener('click',()=>{if(matchMedia('(max-width:760px)').matches){const open=document.body.classList.toggle('menu-open');$('#menu-toggle').setAttribute('aria-expanded',open);}else{const collapsed=document.body.classList.toggle('sidebar-collapsed');$('#menu-toggle').setAttribute('aria-expanded',!collapsed);}});
 $('#sidebar-shade').addEventListener('click',closeMenu);
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();if(event.key==='/'&&!dialog.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('#search-input').focus();}});
 window.addEventListener('hashchange',()=>route(true));
 $('#brief-form').addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(event.currentTarget);
  const body=`БРИФ ПРОЕКТА\nПортфолио Игоря Заскокина\n\nИмя: ${data.get('name').trim()}\nКонтакт: ${data.get('contact').trim()}\nТип: ${data.get('type')}\n\nИдея проекта:\n${data.get('message').trim()}\n\nСоздан локально. Этот бриф никуда не отправлялся.\n`;
  const url=URL.createObjectURL(new Blob(['\uFEFF',body],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='brief-project.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Бриф готов. Файл скачивается.');
 });
 route(false);
})();
