
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
    const art = document.createElement('article'); art.className='card glass-soft'; art.dataset.id = p.id; art.dataset.category = p.category;
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

  // Photo -> Finder (déjà ok)
  if (p.category === 'photo' && ((p.albums && p.albums.length) || (p.photos && p.photos.length))) {
    return openPhotoFinder(p);
  }

  // NEW: tout le reste -> fenêtre déplaçable (multi-instances)
  return openGenericProjectWindow(p);
}


function openModal(p){
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  const modal = document.createElement('div'); modal.className='modal glass-window';
  const titlebar = document.createElement('div'); titlebar.className='titlebar';
  const traffic = document.createElement('div'); traffic.className='traffic';
  ['red','yellow','green'].forEach(c=>{
    const dot=document.createElement('span'); dot.className='dot '+c;
    if(c==='red'){ dot.style.cursor='pointer'; dot.title='Fermer'; dot.addEventListener('click', close); }
    traffic.appendChild(dot);
  });
  const title = document.createElement('div'); title.className='title'; title.textContent = p.title;
  const closeX = document.createElement('div');
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
} else if (p.videoId) {
  const ifr = document.createElement('iframe');
  ifr.src = youtubeEmbed(p.videoId);
  ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  ifr.setAttribute('allowfullscreen',''); // compat max
  ifr.setAttribute('playsinline','');     // iOS : pas de plein écran forcé
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
  if(p.links && p.links.repo){ const b=document.createElement('button'); b.className='btn'; b.style.marginLeft='.5rem'; b.textContent='Visiter'; b.addEventListener('click', ()=> window.open(p.links.repo,'_blank')); linksWrap.appendChild(b); }
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
    const art = document.createElement('article'); art.className='card glass-soft'; art.dataset.id=p.id;
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
    const wrap = document.createElement('div'); wrap.className='card glass-soft'; wrap.dataset.id='photo_'+i;
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
/* === Theme toggle — simple, mobile-safe, persistant === */
(function(){
  const KEY = 'theme';
  const root = document.documentElement;

  function getInitial(){
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // défaut = thème système
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }

  function apply(mode){
    if(mode === 'light') root.setAttribute('data-theme','light');
    else root.removeAttribute('data-theme'); // sombre par défaut
    localStorage.setItem(KEY, mode);
    const btn = document.getElementById('themeToggle');
    if(btn){
      const on = (mode === 'light'); // ON = clair
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-checked', String(on));
      btn.title = on ? 'Thème clair — cliquer pour sombre' : 'Thème sombre — cliquer pour clair';
    }
  }

  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once:true });
  }

  ready(() => {
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    apply(getInitial()); // état initial (évite tout flash)
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
    }, { passive:true });
  });
})();



// 3d
// ===== Générateur de texte 3D propre (extrusion via couches Z) =====
(function(){
  const root = document.getElementById('jj3d');
  if(!root) return;

  const text = root.dataset.text || 'JAN JAWISH';
  const depth = parseInt(getComputedStyle(root).getPropertyValue('--depth')) || 28;
  const step  = getComputedStyle(root).getPropertyValue('--step') || '2px';
  const hue   = parseInt(getComputedStyle(root).getPropertyValue('--hue')) || 210;

  // crée les couches (du fond vers l’avant)
  for(let i=0;i<depth;i++){
    const layer = document.createElement('span');
    layer.className = 'layer';
    layer.textContent = text;

    // position Z
    layer.style.transform = `translateZ(${i}px) translateZ(calc(${i} * (${step})) )`;

    // ombrage (plus sombre au fond, plus saturé)
    const k = i / (depth-1);          // 0 → fond, 1 → proche face
    const light = Math.round(12 + k*35);     // 12% → 47%
    const sat   = Math.round(18 + k*32);     // 18% → 50%
    layer.style.color = `hsl(${hue} ${sat}% ${light}%)`;

    root.appendChild(layer);
  }

  // pose le texte sur la face avant
  const face = root.querySelector('.face');
  face.textContent = text;

  // (optionnel) activer un léger tilt : ajouter .interactive dans le HTML si voulu
  if(root.classList.contains('interactive')){
    let raf;
    function tilt(e){
      const r = root.getBoundingClientRect();
      const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) - (r.left + r.width/2);
      const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) - (r.top + r.height/2);
      const rx = (y / r.height) * -10;
      const ry = (x / r.width)  *  14;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{ root.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; });
    }
    function reset(){ root.style.transform = 'none'; }
    root.addEventListener('pointermove', tilt, {passive:true});
    root.addEventListener('pointerleave', reset);
    root.addEventListener('touchmove', tilt, {passive:true});
    root.addEventListener('touchend', reset);
  }
})();



// nouveau photo avec finder
/* ============================================================
   Finder Photo façon mac : fenêtres verre, dossiers, retour,
   métadonnées (Année, Cadre, Mon rôle), multi-fenêtres
   ============================================================ */

let __winZ = 1000;
function createGlassWindow(title = 'Fenêtre') {
  const win = document.createElement('div');
  win.className = 'macwin glass';
  win.style.zIndex = ++__winZ;

  // barre titre + boutons
  const titlebar = document.createElement('div');
  titlebar.className = 'macwin-titlebar';

  const dots = document.createElement('div');
  dots.className = 'macwin-dots';
  const btnClose = document.createElement('button'); btnClose.className = 'dot close';
  const btnMin = document.createElement('button'); btnMin.className = 'dot min';
  const btnMax = document.createElement('button'); btnMax.className = 'dot max';
  dots.append(btnClose, btnMin, btnMax);

  const ttl = document.createElement('div');
  ttl.className = 'macwin-title';
  ttl.textContent = title;

  titlebar.append(dots, ttl);

  const toolbar = document.createElement('div');
  toolbar.className = 'finder-toolbar';

  const backBtn = document.createElement('button'); backBtn.className = 'finder-back';
  backBtn.textContent = '← Retour'; backBtn.disabled = true;

  const path = document.createElement('div'); path.className = 'finder-path'; path.textContent = 'Finder > Photos';

  toolbar.append(backBtn, path);

  const body = document.createElement('div');
  body.className = 'macwin-body';

  // layout 2 colonnes : contenu + panneau meta
  const content = document.createElement('div'); content.className = 'finder-content';
  const meta = document.createElement('aside'); meta.className = 'finder-meta';

  body.append(content, meta);
  win.append(titlebar, toolbar, body);
  document.body.appendChild(win);

  // drag window (simple)
  let drag = false, sx = 0, sy = 0, ox = 0, oy = 0;
  titlebar.addEventListener('mousedown', (e) => {
    drag = true; sx = e.clientX; sy = e.clientY;
    const rect = win.getBoundingClientRect(); ox = rect.left; oy = rect.top;
    win.style.zIndex = ++__winZ;
  });
  window.addEventListener('mousemove', (e) => {
    if (!drag) return;
    win.style.left = (ox + (e.clientX - sx)) + 'px';
    win.style.top  = (oy + (e.clientY - sy)) + 'px';
  });
  window.addEventListener('mouseup', () => drag = false);

  // close/min/max
  btnClose.addEventListener('click', () => win.remove());
  btnMin.addEventListener('click', () => win.classList.toggle('minimized'));
  btnMax.addEventListener('click', () => win.classList.toggle('maximized'));
  win.addEventListener('mousedown', () => win.style.zIndex = ++__winZ);

  return { win, titlebar, toolbar, backBtn, path, content, meta };
}

function fillMeta(metaEl, project, selected = null, album = null) {
  const Y = album?.year ?? project.year ?? '';
  const C = album?.cadre ?? album?.context ?? project.cadre ?? project.context ?? '';
  const R = album?.role  ?? project.role  ?? '';

  metaEl.innerHTML = '';
  const box = document.createElement('div'); box.className = 'meta-box';
  const h = document.createElement('h4'); h.textContent = 'Mon parcours photographie';
  const year = document.createElement('p'); year.innerHTML = `<strong></strong> ${Y}`;
  const cadre = document.createElement('p'); cadre.innerHTML = `<strong></strong> ${C}`;
  const role  = document.createElement('p'); role.innerHTML  = `<strong></strong> ${R}`;
  box.append(h, year, cadre, role);

  if (selected) {
    const sel = document.createElement('div'); sel.className = 'meta-box';
    const hs = document.createElement('h4'); hs.textContent = 'Sélection';
    const name = document.createElement('p'); name.innerHTML = `<strong>Fichier :</strong> ${selected.name}`;
    sel.append(hs, name);
    box.append(sel);
  }
  metaEl.append(box);
}


function renderFolderView(ui, project) {
  ui.content.innerHTML = '';
  ui.uiState = { level: 'root' };
  ui.backBtn.disabled = true;
  ui.path.textContent = 'Finder > Photos';

  const albums = project.albums && project.albums.length
    ? project.albums
    : [{ id:'photos', title: project.title || 'Photos', photos: project.photos || [] }];

  const grid = document.createElement('div'); grid.className = 'folder-grid';

  albums.forEach(alb => {
    const item = document.createElement('button'); item.className = 'folder-item bare';
    const icon = document.createElement('img'); icon.src = 'assets/img/icons/file.png'; icon.alt = 'Dossier';
    const label = document.createElement('span'); label.className = 'folder-label'; label.textContent = alb.title || 'Dossier';
    item.append(icon, label);
    item.addEventListener('click', () => renderPhotosView(ui, project, alb));
    grid.append(item);
  });

  ui.content.append(grid);
  fillMeta(ui.meta, project);
}


function renderPhotosView(ui, project, album = null) {
  ui.content.innerHTML = '';
  ui.uiState = { level: 'photos', albumId: album?.id || null };
  ui.backBtn.disabled = false;
  ui.path.textContent = `Finder > Photos > ${album?.title || 'Galerie'}`;

  const photos = album?.photos || project.photos || [];
  const grid = document.createElement('div'); grid.className = 'photo-grid';

  photos.forEach((src, idx) => {
    const card = document.createElement('button'); card.className = 'photo-item';
    const img = document.createElement('img'); img.src = src; img.alt = `Photo ${idx+1}`;
    card.append(img);
    card.addEventListener('click', () => openImageOnlyWindow(src, `photo_${idx+1}.jpg`));
    grid.append(card);
  });

  ui.content.append(grid);
  fillMeta(ui.meta, project, null, album);

  ui.backBtn.onclick = () => renderFolderView(ui, project);
}


function openImageOnlyWindow(src, filename = 'photo.png') {
  const { win, titlebar, content, close, bringToFront } = createImageWindow(); // fenêtre minimaliste

  // Image
  const wrap = document.createElement('div');
  wrap.className = 'imgwrap';
  const img = document.createElement('img');
  img.src = src;
  img.alt = filename;
  wrap.appendChild(img);
  content.appendChild(wrap);

  // Taille auto à la charge de l'image (sans scroll, contain dans viewport)
  img.addEventListener('load', () => {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const pad = 24; // marge de respiration
    const maxW = vw - pad * 2;
    const maxH = vh - pad * 2 - 28; // 28px de barre (dots)
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);

    const w = Math.max(220, Math.floor(img.naturalWidth * scale));
    const h = Math.max(160, Math.floor(img.naturalHeight * scale));

    // taille + centrage
    win.style.width = w + 'px';
    win.style.height = (h + 28) + 'px'; // + barre
    win.style.left = Math.floor((vw - w) / 2) + 'px';
    win.style.top  = Math.floor((vh - (h + 28)) / 2) + 'px';
  });

  // double-click pour fermer (optionnel, plus rapide)
  titlebar.addEventListener('dblclick', () => close());
  win.addEventListener('mousedown', bringToFront);
}


function openPhotoFinder(project) {
  const ui = createGlassWindow(project.title || 'Photographies');
  // >>> boost du flou pour cette fenêtre
  ui.win.classList.add('frost-strong');
  renderFolderView(ui, project);
}




/* =================== Gestion scroll-lock quand fenêtre ouverte =================== */
function updateBodyScrollLock() {
  const hasWindows = document.querySelectorAll('.macwin').length > 0;
  document.body.classList.toggle('no-scroll', hasWindows);
}

/* =================== Fenêtre minimaliste pour image only =================== */
let __z = 2000;

function createImageWindow() {
  const win = document.createElement('div');
  win.className = 'macwin imgwin';
  win.style.zIndex = ++__z;

  // Barre minimale : uniquement les 3 points, pas de titre
  const titlebar = document.createElement('div');
  titlebar.className = 'macwin-titlebar tiny';

  const dots = document.createElement('div');
  dots.className = 'macwin-dots';
  const btnClose = document.createElement('button'); btnClose.className = 'dot close';
  const btnMin = document.createElement('button'); btnMin.className = 'dot min';
  const btnMax = document.createElement('button'); btnMax.className = 'dot max';
  dots.append(btnClose, btnMin, btnMax);
  titlebar.appendChild(dots);

  const content = document.createElement('div');
  content.className = 'macwin-body imgonly';

  win.append(titlebar, content);
  document.body.appendChild(win);
  updateBodyScrollLock();

  // drag
  let dragging = false, sx=0, sy=0, ox=0, oy=0;
  titlebar.addEventListener('mousedown', (e) => {
    dragging = true; sx = e.clientX; sy = e.clientY;
    const r = win.getBoundingClientRect(); ox = r.left; oy = r.top;
    bringToFront();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    win.style.left = (ox + (e.clientX - sx)) + 'px';
    win.style.top  = (oy + (e.clientY - sy)) + 'px';
  });
  window.addEventListener('mouseup', () => dragging = false);

  // focus
  function bringToFront() { win.style.zIndex = ++__z; }
  win.addEventListener('mousedown', bringToFront);

  // actions
  function close() {
    win.remove();
    updateBodyScrollLock();
  }
  btnClose.addEventListener('click', close);
  btnMin.addEventListener('click', () => win.classList.toggle('minimized'));
  btnMax.addEventListener('click', () => win.classList.toggle('maximized'));

  return { win, titlebar, content, close, bringToFront };
}


/* ================= Fenêtre générique projet (multi-fenêtres) ================= */
function openGenericProjectWindow(project){
  const { win, titlebar, content } = createProjectWindowShell(project.title || 'Projet');

  const wrap = document.createElement('div'); wrap.className = 'proj-body';
  const media = document.createElement('div'); media.className = 'proj-media';
  const meta  = document.createElement('aside'); meta.className = 'proj-meta';

  const mediaNode = renderProjectMedia(project);
  if (mediaNode) media.appendChild(mediaNode);

  meta.innerHTML = `
    <div class="meta-box">
      <h4>Informations</h4>
      <p><strong>Année :</strong> ${project.year ?? ''}</p>
      ${project.client ? `<p><strong>Client :</strong> ${project.client}</p>` : ''}
      ${project.role ? `<p><strong>Mon rôle :</strong> ${project.role}</p>` : ''}
      ${project.context ? `<p><strong>Contexte :</strong> ${project.context}</p>` : ''}
      ${project.stack ? `<p><strong>Stack :</strong> ${(project.stack||[]).join(' · ')}</p>` : ''}
    </div>
    ${(project.links?.demo || project.links?.repo) ? `
      <div class="meta-box">
        ${project.links?.demo ? `<a class="btn-ext" href="${project.links.demo}" target="_blank" rel="noopener">Voir le site ↗</a>` : ''}
        ${project.links?.repo ? `<a class="btn-ext" style="margin-left:.5rem" href="${project.links.repo}" target="_blank" rel="noopener">Visiter ↗</a>` : ''}
      </div>` : ''}
  `;

  wrap.append(media, meta);
  content.append(wrap);
  centerWindow(win, 1080, 680);
}

/* ——— Shell fenêtré (déplaçable + multi-instances) ——— */
let __projZ = 3000;
function createProjectWindowShell(title='Projet'){
  const win = document.createElement('div');
  win.className = 'macwin glass';
  win.style.zIndex = ++__projZ;

  const titlebar = document.createElement('div'); titlebar.className = 'macwin-titlebar';
  const dots = document.createElement('div'); dots.className = 'macwin-dots';
  const c = document.createElement('button'); c.className = 'dot close';
  const m = document.createElement('button'); m.className = 'dot min';
  const x = document.createElement('button'); x.className = 'dot max';
  dots.append(c,m,x);

  const ttl = document.createElement('div'); ttl.className = 'macwin-title'; ttl.textContent = title;
  titlebar.append(dots, ttl);

  const content = document.createElement('div'); content.className = 'macwin-body proj';
  win.append(titlebar, content); document.body.appendChild(win);

  updateBodyScrollLock?.();

  // drag
  let drag=false,sx=0,sy=0,ox=0,oy=0;
  titlebar.addEventListener('mousedown', (e)=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=win.getBoundingClientRect(); ox=r.left; oy=r.top; bringToFront(); });
  window.addEventListener('mousemove', (e)=>{ if(!drag) return; win.style.left = (ox + e.clientX - sx) + 'px'; win.style.top = (oy + e.clientY - sy) + 'px'; });
  window.addEventListener('mouseup', ()=> drag=false);
  function bringToFront(){ win.style.zIndex = ++__projZ; }
  win.addEventListener('mousedown', bringToFront);

  // actions
  c.addEventListener('click', ()=>{ win.remove(); updateBodyScrollLock?.(); });
  m.addEventListener('click', ()=> win.classList.toggle('minimized'));
  x.addEventListener('click', ()=> win.classList.toggle('maximized'));

  return { win, titlebar, content };
}

/* ——— Choix du média : image / vidéo / iframe ——— */
function renderProjectMedia(p){
// 1) Création graphique : carrousel avec flèches si plusieurs visuels
if ((p.category === 'graphique' || p.category === 'graphisme' || p.category === 'creation' || p.category === 'design') && p.gallery?.length){
  return p.gallery.length > 1
    ? renderGalleryCarousel(p.gallery, p.title)
    : renderGalleryScroller(p.gallery, p.title); // 1 seule image = simple affichage
}


  // 2) Vidéos hébergées (YouTube/Vimeo : via videoId ou embed)
  if (p.videoId){
    const wrap = document.createElement('div'); wrap.className = 'iframe-wrap';
    const ifr  = document.createElement('iframe');
    ifr.src = `https://www.youtube.com/embed/${p.videoId}?rel=0&modestbranding=1`;
    ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    ifr.setAttribute('allowfullscreen','');
    ifr.loading = 'lazy'; ifr.referrerPolicy = 'no-referrer';
    wrap.appendChild(ifr); 
    return wrap;
  }
  if (p.embed){
    const wrap = document.createElement('div'); wrap.className = 'iframe-wrap';
    const ifr  = document.createElement('iframe');
    ifr.src = p.embed; ifr.loading='lazy'; ifr.referrerPolicy='no-referrer';
    ifr.allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    wrap.appendChild(ifr); 
    return wrap;
  }

  // 3) Vidéos locales (MP4)
  if (p.video){
    const v = document.createElement('video');
    v.src = p.video;
    v.controls = true; 
    v.playsInline = true;
    v.preload = 'metadata';
    v.style.maxWidth = '100%';
    v.style.maxHeight = '100%';
    v.poster = p.cover || p.image || '';
    return v;
  }

  // 4) Visual (fallback)
  if (p.gallery?.length){
    const img = document.createElement('img'); img.src = p.gallery[0]; img.alt = p.title || 'image'; img.loading='lazy'; return img;
  }
  if (p.image || p.cover){
    const img = document.createElement('img'); img.src = p.image || p.cover; img.alt = p.title || 'image'; img.loading='lazy'; return img;
  }

  // 5) Lien externe
  if (p.links?.demo || p.links?.repo){
    const a=document.createElement('a'); a.href = p.links.demo || p.links.repo; a.target='_blank'; a.rel='noopener';
    a.className='btn-ext'; a.textContent='Ouvrir le projet ↗'; return a;
  }
  return null;
}
function renderGalleryScroller(images = [], title=''){
  const sc = document.createElement('div'); 
  sc.className = 'scroll-stack';
  images.forEach((src, i) => {
    const fig = document.createElement('figure'); fig.className = 'stack-item';
    const img = document.createElement('img'); img.src = src; img.alt = `${title || 'image'} ${i+1}`;
    fig.appendChild(img);
    sc.appendChild(fig);
  });
  return sc;
}
function renderGalleryCarousel(images = [], title = '') {
  const root = document.createElement('div');
  root.className = 'gallery-carousel';

  const img = document.createElement('img');
  img.alt = title || 'image';
  root.appendChild(img);

  const left  = document.createElement('button'); left.className  = 'nav-btn left';  left.setAttribute('aria-label','Précédent');  left.textContent = '‹';
  const right = document.createElement('button'); right.className = 'nav-btn right'; right.setAttribute('aria-label','Suivant');    right.textContent = '›';
  root.append(left, right);

  const dots = document.createElement('div'); dots.className = 'dots';
  images.forEach((_, i) => {
    const d = document.createElement('button'); d.className = 'dot'; d.setAttribute('aria-label',`Aller à l’image ${i+1}`);
    dots.appendChild(d);
  });
  root.appendChild(dots);

let index = 0;
let lastDir = 0; // -1 gauche, +1 droite

function animateIn(dir){
  img.classList.remove('slide-in-left','slide-in-right');
  // force reflow pour relancer l’anim
  void img.offsetWidth;
  img.classList.add(dir > 0 ? 'slide-in-right' : 'slide-in-left');
}

const update = () => {
  img.src = images[index];
  Array.from(dots.children).forEach((d,i)=> d.classList.toggle('active', i===index));
  const next = new Image(); next.src = images[(index+1)%images.length];
  if (lastDir !== 0) animateIn(lastDir);
};

const go = (dir) => { 
  lastDir = dir;
  index = (index + dir + images.length) % images.length; 
  update(); 
};


  left.addEventListener('click',  () => go(-1));
  right.addEventListener('click', () => go(+1));
dots.addEventListener('click', (e) => {
  if (e.target.classList.contains('dot')) {
    const newIndex = Array.from(dots.children).indexOf(e.target);
    if (newIndex === index) return;
    lastDir = newIndex > index ? +1 : -1;
    index = newIndex;
    update();
  }
});


  // clavier quand la fenêtre est focus
  root.tabIndex = 0;
  root.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(+1);
  });

  // swipe mobile
  let sx=0, sy=0;
  root.addEventListener('touchstart', (e)=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
  root.addEventListener('touchend', (e)=>{
    const dx = (e.changedTouches[0].clientX - sx);
    const dy = (e.changedTouches[0].clientY - sy);
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) go(dx<0?+1:-1);
  }, {passive:true});

  update();
  return root;
}


/* ——— Taille / centrage ——— */
function centerWindow(win, w=980, h=640){
  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight||0);
  w = Math.min(w, vw - 32); h = Math.min(h, vh - 32);
  win.style.width = w + 'px'; win.style.height = h + 'px';
  win.style.left = Math.floor((vw - w)/2) + 'px';
  win.style.top  = Math.floor((vh - h)/2) + 'px';
}
