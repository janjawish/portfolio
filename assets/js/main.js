
/* JJ Portfolio v4 — core interactions */

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* Centered segmented nav — use <button data-href> to avoid URL preview */
function initSegmentedNav(){
  const seg = $('#segNav'); if(!seg) return;
  const slider = seg.querySelector('.seg-slider');
  const items = $$('.seg-item', seg);

  let active = items.find(i => i.classList.contains('active')) || null;

  function moveTo(el, show=true){
    const rect = el.getBoundingClientRect();
    const base = seg.getBoundingClientRect();
    slider.style.width = rect.width + 'px';
    slider.style.transform = `translateX(${rect.left - base.left}px)`;
    slider.style.opacity = show ? 1 : 0;
  }
  function hide(){ if(!active) slider.style.opacity = 0; else moveTo(active, true); }
  if(active){ moveTo(active, true); } else { slider.style.opacity = 0; }

  items.forEach(it=>{
    it.addEventListener('mouseenter', ()=> moveTo(it, true));
    it.addEventListener('focus', ()=> moveTo(it, true));
    it.addEventListener('click', ()=> {
      active = it; moveTo(active, true);
      const href = it.dataset.href; if(href){ window.location.href = href; }
    });
  });
  seg.addEventListener('mouseleave', hide);
  window.addEventListener('resize', ()=> { (active ? moveTo(active, true) : hide()); });
}

/* Quick selection reveal only after scroll (IntersectionObserver on hero) */
function initQuickReveal(){
  const hero = $('.hero'); const section = $('#quick-section');
  if(!hero || !section) return;
  const io = new IntersectionObserver(([entry])=>{
    if(!entry.isIntersecting) section.classList.add('revealed');
  }, { rootMargin: '-20% 0px -60% 0px' });
  io.observe(hero);
}

/* Projects grid rendering (cards clickable + open button) */
function renderProjects(filter='all', gridId='projects-grid'){
  const grid = document.getElementById(gridId);
  if(!grid || typeof PROJECTS === 'undefined') return;
  grid.innerHTML = '';
  const items = PROJECTS.filter(p => filter==='all' ? true : p.category===filter);
  items.forEach(p => {
    const art = document.createElement('article'); art.className='card'; art.dataset.id = p.id; art.dataset.category = p.category;
    const thumb = document.createElement('div'); thumb.className = 'thumb';
    const img = document.createElement('img'); img.alt = p.title; img.src = p.cover || 'assets/img/placeholder.svg'; thumb.appendChild(img);
    const content = document.createElement('div'); content.className = 'content';
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${(p.category||'').toUpperCase()} • ${p.year||''}`;
    const h3 = document.createElement('h3'); h3.textContent = p.title;
    const pEl = document.createElement('p'); pEl.textContent = p.summary || '';
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Ouvrir';
    btn.addEventListener('click',(e)=>{ e.stopPropagation(); openProject(p.id); });
    art.addEventListener('click', ()=> openProject(p.id));
    content.append(meta,h3,pEl,btn);
    art.append(thumb,content);
    grid.appendChild(art);
  });
}

function bindFilters(){
  $$('.filter-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      $$('.filter-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderProjects(b.dataset.filter);
    });
  });
}

function youtubeEmbed(id){ return `https://www.youtube.com/embed/${id}?rel=0&showinfo=0&modestbranding=1`; }

/* Open project with apple-like animation; special cases for 'graphique' (carousel) and 'photo' (fullscreen gallery) */
function openProject(projectId){
  const p = PROJECTS.find(x=>x.id===projectId);
  if(!p) return;
  if(p.category==='photo' && p.photos && p.photos.length){
    return openPhotoGallery(p);
  }
  openModal(p);
}

function openModal(p){
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  const modal = document.createElement('div'); modal.className='modal';
  const titlebar = document.createElement('div'); titlebar.className='titlebar';
  const traffic = document.createElement('div'); traffic.className='traffic';
  ['red','yellow','green'].forEach(c=>{
    const dot=document.createElement('span'); dot.className='dot '+c;
    if(c==='red'){ dot.style.cursor='pointer'; dot.title='Fermer'; dot.addEventListener('click', close); }
    traffic.appendChild(dot);
  });
  const title = document.createElement('div'); title.className='title'; title.textContent = p.title;
  const closeX = document.createElement('button'); closeX.className='close-x'; closeX.textContent='✕'; closeX.addEventListener('click', close);
  titlebar.append(traffic, title, closeX);

  const body = document.createElement('div'); body.className='modal-body';

  const media = document.createElement('div'); media.className='media';
  if(p.category==='graphique' && p.gallery && p.gallery.length){
    // Carousel
    const carousel = document.createElement('div'); carousel.className='carousel';
    const track = document.createElement('div'); track.className='carousel-track';
    p.gallery.forEach(src=>{
      const slide = document.createElement('div'); slide.className='carousel-slide';
      const img = document.createElement('img'); img.src = src; img.alt = p.title;
      slide.appendChild(img); track.appendChild(slide);
    });
    const prev = document.createElement('button'); prev.className='nav prev'; prev.textContent='‹';
    const next = document.createElement('button'); next.className='nav next'; next.textContent='›';
    let idx = 0;
    function update(){ track.style.transform = `translateX(${-idx*100}%)`; }
    prev.addEventListener('click', ()=>{ idx = (idx-1+ p.gallery.length)%p.gallery.length; update(); });
    next.addEventListener('click', ()=>{ idx = (idx+1)%p.gallery.length; update(); });
    carousel.append(track, prev, next);
    media.appendChild(carousel);
  } else if(p.videoId){
    const ifr=document.createElement('iframe');
    ifr.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    ifr.allowFullscreen=true; ifr.src=youtubeEmbed(p.videoId);
    media.appendChild(ifr);
  } else {
    const img=document.createElement('img'); img.src=p.cover || 'assets/img/placeholder.svg'; img.alt=p.title; media.appendChild(img);
  }

  const side = document.createElement('div'); side.className='side';
  const hMeta = document.createElement('h3'); hMeta.textContent='Détails';
  const ul = document.createElement('ul'); ul.className='list';
  const addLi = (label, value) => { if(!value) return; const li=document.createElement('li'); li.innerHTML=`<strong>${label} :</strong> ${value}`; ul.appendChild(li); };
  addLi('Catégorie', p.category); addLi('Année', p.year||''); addLi('Rôle', p.role||''); addLi('Stack', (p.stack||[]).join(' · ')); addLi('Contexte', p.context||''); addLi('Pitch', p.pitch||'');

  const linksWrap = document.createElement('div'); linksWrap.style.marginTop='.6rem';
  if(p.links && p.links.demo){ const b=document.createElement('button'); b.className='btn'; b.textContent='Voir le site'; b.addEventListener('click', ()=> window.open(p.links.demo,'_blank')); linksWrap.appendChild(b); }
  if(p.links && p.links.repo){ const b=document.createElement('button'); b.className='btn'; b.style.marginLeft='.5rem'; b.textContent='GitHub'; b.addEventListener('click', ()=> window.open(p.links.repo,'_blank')); linksWrap.appendChild(b); }
  if(p.links && p.links.video){ const b=document.createElement('button'); b.className='btn'; b.style.marginLeft='.5rem'; b.textContent='YouTube'; b.addEventListener('click', ()=> window.open(p.links.video,'_blank')); linksWrap.appendChild(b); }

  side.append(hMeta, ul, linksWrap);

  body.append(media, side);
  modal.append(titlebar, body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Disable background scroll
  const prevOverflow = document.documentElement.style.overflow || '';
  document.documentElement.style.overflow = 'hidden';

  // Close handlers + closing animation
  function close(){
    modal.classList.add('closing');
    backdrop.style.animation = 'fade-out .2s ease forwards';
    setTimeout(()=>{
      document.body.removeChild(backdrop);
      document.documentElement.style.overflow = prevOverflow;
    }, 200);
  }
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); }, { once:true });
}

/* Fullscreen photo gallery (non-clickable, scroll only) */
function openPhotoGallery(p){
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  const modal = document.createElement('div'); modal.className='modal fullscreen';
  const titlebar = document.createElement('div'); titlebar.className='titlebar';
  const traffic = document.createElement('div'); traffic.className='traffic';
  const closeDot = document.createElement('span'); closeDot.className='dot red'; closeDot.title='Fermer'; closeDot.style.cursor='pointer'; closeDot.addEventListener('click', close);
  traffic.append(closeDot, Object.assign(document.createElement('span'),{className:'dot yellow'}), Object.assign(document.createElement('span'),{className:'dot green'}));
  const title = document.createElement('div'); title.className='title'; title.textContent = p.title || 'Photographies';
  titlebar.append(traffic, title);

  const body = document.createElement('div'); body.className='modal-body';
  const grid = document.createElement('div'); grid.className='fs-grid';
  p.photos.forEach(src => {
    const cell = document.createElement('div'); cell.className='cell';
    const img = document.createElement('img'); img.src=src; img.alt='Photographie'; cell.appendChild(img);
    grid.appendChild(cell);
  });
  body.appendChild(grid);

  modal.append(titlebar, body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  const prevOverflow = document.documentElement.style.overflow || '';
  document.documentElement.style.overflow = 'hidden';

  function close(){
    modal.classList.add('closing');
    backdrop.style.animation = 'fade-out .2s ease forwards';
    setTimeout(()=>{
      document.body.removeChild(backdrop);
      document.documentElement.style.overflow = prevOverflow;
    }, 200);
  }
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); }, { once:true });
}

/* Render quick selection (home) */
function renderQuickSelection(){
  const g = $('#quick-grid'); if(!g) return;
  const N = 6;
  const items = (typeof PROJECTS!=='undefined' ? PROJECTS.slice(0,N) : []);
  g.innerHTML='';
  items.forEach(p => {
    const art = document.createElement('article'); art.className='card'; art.dataset.id=p.id;
    const thumb = document.createElement('div'); thumb.className='thumb';
    const img = document.createElement('img'); img.src = p.cover || 'assets/img/placeholder.svg'; img.alt = p.title; thumb.appendChild(img);
    const content = document.createElement('div'); content.className='content';
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${(p.category||'').toUpperCase()} • ${p.year||''}`;
    const h3 = document.createElement('h3'); h3.textContent = p.title;
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Ouvrir';
    btn.addEventListener('click',(e)=>{ e.stopPropagation(); openProject(p.id); });
    art.addEventListener('click', ()=> openProject(p.id));
    content.append(meta,h3,btn);
    art.append(thumb,content);
    g.appendChild(art);
  });
}

/* Photo preview section (projets page) */
function renderPhotos(){
  const grid = $('#photos-grid'); if(!grid || typeof PHOTOS === 'undefined') return;
  grid.innerHTML='';
  PHOTOS.forEach((ph, i)=>{
    const wrap = document.createElement('div'); wrap.className='card'; wrap.dataset.id='photo_'+i;
    const t = document.createElement('div'); t.className='thumb';
    const img = document.createElement('img'); img.src = ph.src || 'assets/img/placeholder.svg'; img.alt = ph.title || 'Photo'; t.appendChild(img);
    const content = document.createElement('div'); content.className='content';
    const h3 = document.createElement('h3'); h3.textContent = ph.title || 'Photographie';
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Ouvrir';
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); openPhotoGallery({ title: 'Photographie', photos: PHOTOS.map(x=>x.src) }); });
    wrap.addEventListener('click', ()=> openPhotoGallery({ title:'Photographie', photos: PHOTOS.map(x=>x.src) }));
    content.append(h3, btn);
    wrap.append(t, content);
    grid.appendChild(wrap);
  });
}

/* Back-to-top */
function initBackToTop(){
  const btn = $('#backTop'); if(!btn) return;
  window.addEventListener('scroll', ()=>{ if(window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show'); });
  btn.addEventListener('click', (e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initSegmentedNav();
  initQuickReveal();
  renderProjects('all');        // for projets.html
  bindFilters();
  renderPhotos();               // preview section
  renderQuickSelection();       // home
  initBackToTop();
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
});
