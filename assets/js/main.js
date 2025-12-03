// ===== Hardening UX: bloque clic droit, drag & drop, et raccourcis DevTools/Source =====
(function hardenUI(){
  // 1) Bloque le menu contextuel partout
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  }, { capture: true });

  // 2) Bloque drag & drop (global) + drag d'images
  ['dragstart','dragover','drop'].forEach(ev => {
    document.addEventListener(ev, (e) => {
      // Autorise le drag interne si tu utilises un drag custom ? -> sinon tout bloquer :
      e.preventDefault();
    }, { capture: true });
  });

  // 2.bis) S’assure que toutes les <img> existantes ou futures ne sont pas draggables
  const markUndraggable = (root=document) => {
    root.querySelectorAll('img, svg, picture').forEach(el => el.setAttribute('draggable', 'false'));
  };
  markUndraggable();
  new MutationObserver((mut) => {
    for (const m of mut) {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (n.nodeType === 1) { // ELEMENT_NODE
          if (n.matches?.('img, svg, picture')) n.setAttribute('draggable','false');
          markUndraggable(n);
        }
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // 3) Bloque principaux raccourcis DevTools / Voir le code / Enregistrer / Imprimer…
  //    (Mac + Windows/Linux)
  const isMac = navigator.platform.toUpperCase().includes('MAC');
  const key = (e) => e.key?.toLowerCase();

  document.addEventListener('keydown', (e) => {
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    const shift = e.shiftKey;
    const alt = e.altKey;
    const k = key(e);

    // F12 (DevTools)
    if (k === 'f12') { e.preventDefault(); e.stopPropagation(); return; }

    // DevTools courants
    if (ctrl && shift && (k === 'i' || k === 'j' || k === 'c' || k === 'k')) { e.preventDefault(); e.stopPropagation(); return; }
    if (ctrl && alt && k === 'i') { e.preventDefault(); e.stopPropagation(); return; }

    // Voir le code source
    if (ctrl && k === 'u') { e.preventDefault(); e.stopPropagation(); return; }

    // Enregistrer / Imprimer / Vue source “enregistrer sous…”
    if (ctrl && (k === 's' || k === 'p')) { e.preventDefault(); e.stopPropagation(); return; }

    // Ouvrir fichier (évite un download intempestif)
    if (ctrl && k === 'o') { e.preventDefault(); e.stopPropagation(); return; }

    // Zoom clavier (optionnel) — décommente si tu veux empêcher le zoom navigateur
    // if ((ctrl && (k === '+' || k === '=' || k === '-' || k === '0')) || (e.metaKey && (k === '+' || k === '=' || k === '-' || k === '0'))) {
    //   e.preventDefault(); e.stopPropagation(); return;
    // }
  }, { capture: true });

  // 4) Petits pièges courants : double-clic sélection, etc. (optionnel)
  // document.addEventListener('selectstart', e => e.preventDefault(), { capture: true });

  // 5) DevTools : on ne peut pas les bloquer, mais on peut éviter d’exposer des infos sensibles en console
  // console.log = console.info = console.warn = console.error = () => {};
})();


// ===== Sound manager (global) =====
window.Sound = (() => {
  let muted = localStorage.getItem('soundMuted') === '1';
  const listeners = new Set();
  const isMuted   = () => muted;
  const setMuted  = (v) => { muted = !!v; localStorage.setItem('soundMuted', muted ? '1' : '0'); listeners.forEach(fn => fn(muted)); };
  const onChange  = (fn) => (listeners.add(fn), () => listeners.delete(fn));
  return { isMuted, setMuted, onChange };
})();

// ===== UI: bouton mute/unmute =====
(function addSoundToggle(){
  const btn = document.createElement('button');
  btn.className = 'sound-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label','Basculer le son');
  const svgOn  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  const svgOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 2-20 20"/></svg>';

  function render(muted = Sound.isMuted()){
    btn.innerHTML = muted ? svgOff : svgOn;
    btn.title = muted ? 'Son coupé' : 'Son activé';
    btn.setAttribute('aria-pressed', String(!muted));
  }
  btn.addEventListener('click', () => Sound.setMuted(!Sound.isMuted()));
  Sound.onChange(render);
  render();
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
})();


// ===== Perf kit: lazy loader + pause offscreen media =====
const Perf = (() => {
  // IntersectionObserver commun
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // Hydrate sources
        if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
        if (el.dataset.poster) { el.poster = el.dataset.poster; el.removeAttribute('data-poster'); }
        if (el.dataset.srcdoc) { el.srcdoc = el.dataset.srcdoc; el.removeAttribute('data-srcdoc'); }

        // <source> dans <picture>/<video>
        el.querySelectorAll?.('source[data-srcset]').forEach(s => {
          s.srcset = s.dataset.srcset; s.removeAttribute('data-srcset');
        });

        // Lecture auto des vidéos visibles
        if (el.tagName === 'VIDEO' && el.autoplay) {
          el.play().catch(()=>{});
        }
        io.unobserve(el);
      } else {
        // Pause quand hors écran
        if (el.tagName === 'VIDEO') el.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  // Marquer un élément à lazy-loader
  function lazy(el){ io.observe(el); return el; }

  // Petite aide pour créer <picture> responsive (si variantes dispos)
  function picture({alt='', base='', widths=[480,768,1280,1920], ext='jpg', webp=true, avif=true}) {
    // base = "assets/img/photo-1" -> cherchera photo-1-480.jpg etc.
    const pic = document.createElement('picture');
    const mkSrcset = (e) => widths.map(w => `${base}-${w}.${e} ${w}w`).join(', ');
    if (avif) { const s = document.createElement('source'); s.type='image/avif'; s.dataset.srcset = mkSrcset('avif'); pic.appendChild(s); }
    if (webp) { const s = document.createElement('source'); s.type='image/webp'; s.dataset.srcset = mkSrcset('webp'); pic.appendChild(s); }
    const img = document.createElement('img');
    img.alt = alt; img.loading='lazy'; img.decoding='async';
    img.dataset.src = `${base}-${widths[1]}.${ext}`; // medium par défaut
    img.sizes = '(max-width: 900px) 90vw, 60vw';
    pic.appendChild(img);
    return lazy(pic);
  }

  // Drag throttle (rAF)
  function withRaf(fn){
    let ticking = false, lastArgs=null;
    return function(...args){
      lastArgs = args;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; fn.apply(this, lastArgs); });
    };
  }

  return { lazy, picture, withRaf };
})();



// ===== Click sound: only on real buttons & window controls =====
// ===== Click sound: only on real buttons & window controls (mute-aware) =====
(function setupButtonClickSound(){
  const CLICK_URL = 'assets/sound/click.mp3';

  // Small audio pool so rapid clicks don't cut off
  const POOL_SIZE = 6;
  const pool = Array.from({ length: POOL_SIZE }, () => {
    const a = new Audio(CLICK_URL);
    a.preload = 'auto';
    a.playsInline = true;
    a.volume = 0.55; // tweak if needed
    return a;
  });

  let idx = 0, lastTs = 0;
  function play() {
    // Respect global mute toggle if present
    if (window.Sound?.isMuted && window.Sound.isMuted()) return;

    const now = performance.now();
    if (now - lastTs < 110) return; // avoid double-fire (bubbling)
    lastTs = now;

    const a = pool[idx = (idx + 1) % POOL_SIZE];
    try { a.pause(); a.currentTime = 0; a.play().catch(()=>{}); } catch {}
  }

  // What counts as a "button" on your site
  const SELECTOR = [
    'button',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    '[role="button"]',
    '.btn',         // tes boutons stylés
    '.btn-ext',     // bouton lien "Voir le site"
    '.macwin .dot.close',
    '.macwin .dot.min',
    '.macwin .dot.max'
  ].join(',');

  // pointerdown -> mouse/touch/pen; capture to beat bubbling
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest(SELECTOR);
    if (!el) return;
    if (el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true') return;
    if (el.dataset.clickSilent === '1') return; // opt-out per element
    play();
  }, { capture: true, passive: true });

  // Also play when user activates via keyboard (Enter/Space)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = document.activeElement;
    if (!el) return;
    if (el.matches(SELECTOR) && el.getAttribute('aria-disabled') !== 'true' && !el.matches(':disabled')) {
      if (el.dataset.clickSilent === '1') return;
      play();
    }
  }, true);

  // (optional) expose for debugging
  window.__playClick = play;
})();





// ===== Lockscreen macOS + Boot (one-shot per session) =====
(function macLockscreen(){
  try{
    if (sessionStorage.getItem('bootPlayed') === '1') return;

    // --- Overlays
    document.body.classList.add('no-scroll');

    const ls = document.createElement('div');
    ls.className = 'ls-overlay';
    ls.innerHTML = `
      <div class="ls-wallpaper">
        <!-- Option: vidéo de fond -->
        <video src="assets/img/videos/fond.mp4" autoplay muted loop playsinline></video>
      </div>
      <div class="ls-scrim"></div>

      <div class="ls-topbar">
        <div></div>
        <div class="right">
          <span class="ls-lang">Français</span>
          <!-- Wifi icon -->
          <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12a11 11 0 0 1 14 0"/><path d="M8.5 15.5a6 6 0 0 1 7 0"/><path d="M12 19h.01"/></svg>
          <!-- Power icon -->
          <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2v10"/><path d="M5.5 5.5a8 8 0 1 0 13 0"/></svg>
        </div>
      </div>

      <div class="ls-clock" aria-hidden="true">
        <div class="date" id="ls-date"></div>
        <div class="time" id="ls-time"></div>
      </div>

      <section class="ls-card" role="dialog" aria-labelledby="ls-name">
        <div class="ls-user">
          <img class="ls-avatar" src="assets/img/icons/apple_white.png" alt="">
          <div class="ls-name" id="ls-name">Utilisateur</div>
        </div>

        <form class="ls-form" id="ls-form" autocomplete="off">
          <input class="ls-input" id="ls-pass" type="password" placeholder="Mot de passe" required />
          <button class="ls-go" type="submit" aria-label="Valider">→</button>
        </form>

        <div class="ls-help">Saisissez votre mot de passe pour vous connecter</div>
      </section>
    `;
    document.body.appendChild(ls);

    const dateEl = ls.querySelector('#ls-date');
    const timeEl = ls.querySelector('#ls-time');
    const form   = ls.querySelector('#ls-form');
    const nameEl = ls.querySelector('#ls-name');

    // Si un nom a déjà été donné précédemment
    const savedName = sessionStorage.getItem('visitorName');
    if (savedName) nameEl.textContent = savedName;

    // --- Horloge
    const fmtDate = new Intl.DateTimeFormat('fr-FR', { weekday:'long', day:'numeric', month:'long' });
    const fmtTime = new Intl.DateTimeFormat('fr-FR', { hour:'2-digit', minute:'2-digit' });
    function updateClock(){
      const now = new Date();
      const d = fmtDate.format(now).replace(/^\w/, c => c.toUpperCase()); // cap 1re lettre
      dateEl.textContent = d;
      timeEl.textContent = fmtTime.format(now);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);

    // --- Audio (lu au submit → autorisé partout)
    const BOOT_SOUND_URL = 'assets/sound/apple.mp3';
    const chime = new Audio(BOOT_SOUND_URL);
    chime.preload = 'auto'; chime.volume = 0.9;

    // --- Submit => Boot (écran noir + son + barre), one-shot
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearInterval(timer);

      // Sauve un "nom" si l’utilisateur a modifié la carte (optionnel)
      sessionStorage.setItem('visitorName', nameEl.textContent || 'Utilisateur');

      // Phase 2
      await startBoot();
    });

    async function startBoot(){
      // remplace l'overlay lockscreen par l'écran noir boot
      ls.remove();

      const boot = document.createElement('div');
      boot.className = 'boot-dark';
      boot.innerHTML = `
        <div class="boot-pack">
          <img class="boot-apple" src="assets/img/icons/apple_white.png" alt="" />
          <div class="boot-bar"><span></span></div>
        </div>
      `;
      document.body.appendChild(boot);

    try { if (!window.Sound?.isMuted || !window.Sound.isMuted()) await chime.play(); } catch {}


      const bar = boot.querySelector('.boot-bar > span');
      const steps = [8,16,28,42,60,72,86,96,100];
      let i = 0;
      (function tick(){
        bar.style.width = steps[i] + '%';
        i++;
        if (i < steps.length){
          setTimeout(tick, [260,380,420,520,640,520,420,320][Math.min(i-1,7)]);
        } else {
          sessionStorage.setItem('bootPlayed','1');
          boot.style.transition = 'opacity .38s ease';
          boot.style.opacity = '0';
          setTimeout(() => {
            boot.remove();
            document.body.classList.remove('no-scroll');
          }, 420);
        }
      })();
    }
  }catch(e){ /* no-op */ }
})();




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
    const img = document.createElement('img'); img.alt = p.title; img.dataset.src = p.coverThumb || p.cover; // fallback
img.loading = 'lazy'; img.decoding = 'async';
Perf.lazy(img); thumb.appendChild(img);
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
/* === Easter egg GTA V → faux "1 mois Spotify" === */

// Code officiel qu'on attend (HOPTOIT = super saut)
const CHEAT_CODE = 'HOPTOIT';

function initCheatEasterEgg(){
  // Évite de le créer deux fois
  if (document.querySelector('.cheat-pill')) return;

  const pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'cheat-pill';
  pill.innerHTML = `
    <span class="cheat-dot"></span>
    <span>Cheat code GTA V</span>
  `;
  pill.title = 'Entrer un code de triche';

  pill.addEventListener('click', openCheatWindow);

  document.body.appendChild(pill);
}

function openCheatWindow(){
  // Si la fenêtre est déjà ouverte, on ne la recrée pas
  if (document.querySelector('.cheat-backdrop')) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop cheat-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal glass-window cheat-modal';

  modal.innerHTML = `
    <div class="titlebar">
      <div class="traffic">
        <span class="dot red" title="Fermer"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="title">Code de triche GTA V</div>
    </div>
    <div class="modal-body cheat-body">
      <div class="cheat-intro">
<div class="spotify-badge">
  <div class="spotify-logo">
    <img src="assets/img/spotify.png" alt="Logo Spotify">
  </div>
  <span>Spotify Premium*</span>
</div>


      <form class="cheat-form">
        <label class="cheat-label">
          <span>Code :</span>
          <input type="text" name="code" autocomplete="off" placeholder="SUPER SAUT" />
        </label>
        <button type="submit" class="btn">Valider</button>
      </form>

      <p class="cheat-hint">Indice : spawn avion sur GTA 5</p>
      <p class="cheat-error" aria-live="polite"></p>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const redDot = modal.querySelector('.dot.red');
  const form   = modal.querySelector('.cheat-form');
  const input  = modal.querySelector('input[name="code"]');
  const error  = modal.querySelector('.cheat-error');
  const body   = modal.querySelector('.cheat-body');

  function closeCheat(){
    modal.classList.add('closing');
    backdrop.style.animation = 'fade-out .2s ease forwards';
    setTimeout(() => {
      backdrop.remove();
    }, 220);
  }

  redDot.addEventListener('click', closeCheat);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeCheat();
  });

  document.addEventListener('keydown', function onEsc(e){
    if (e.key === 'Escape'){
      closeCheat();
      document.removeEventListener('keydown', onEsc);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.textContent = '';

    const value = (input.value || '')
      .toUpperCase()
      .replace(/\s+/g, ''); // enlève les espaces

    if (value !== CHEAT_CODE){
      error.textContent = 'Code incorrect… (indice : super saut 😉)';
      return;
    }

    launchSpotifyFake(body);
  });

  input.focus();
}

function launchSpotifyFake(container){
container.innerHTML = `
  <div class="cheat-stage">
    <div class="cheat-intro" style="text-align:center">
      <div class="spotify-hero">
        <img src="assets/img/spotify.png" alt="Logo Spotify">
      </div>
      <h2>🎉 Bravo !</h2>
      <p>Vous venez de débloquer <strong>1 mois de Spotify gratuit</strong>.</p>
    </div>

    <div class="cheat-loader">
      <div class="cheat-loader-bar"></div>
    </div>
    <p class="cheat-status">Patientez, on génère votre code…</p>
  </div>
`;
  spawnConfettiBurst();


  const bar    = container.querySelector('.cheat-loader-bar');
  const steps  = [18, 35, 52, 69, 84, 100];
  let i        = 0;

  const timer = setInterval(() => {
    bar.style.width = steps[i] + '%';
    i++;
    if (i >= steps.length){
      clearInterval(timer);
      setTimeout(() => showMonkey(container), 600);
    }
  }, 380);
}

function showMonkey(container){
  container.innerHTML = `
    <div class="cheat-stage monkey">
      <figure class="cheat-monkey-figure">
        <img src="assets/img/easter/gorilla-finger.png"
             alt="Un singe très poli qui vous fait un doigt">
      </figure>
      <h2>😈 Oups…</h2>
      <p>Désolé, pas de Spotify gratuit ici.</p>
      <p class="cheat-small">
        Mais tu as trouvé l’easter egg du site, et ça, c’est déjà stylé.
      </p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', ()=>{
  initSegmentedNav();
  initQuickReveal();
  renderProjects('all');
  bindFilters();
  renderPhotos();
  renderQuickSelection();
  initBackToTop();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // 👇 nouveau
  initCheatEasterEgg();
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
const onMove = Perf.withRaf((e)=>{ if(!drag) return; /* move */ });
window.addEventListener('mousemove', onMove);
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
    // 0) PDF (lecteur sans barres, thème verre)
  if (p.pdf){
    const wrap = document.createElement('div'); 
    wrap.className = 'pdf-wrap';

    const ifr = document.createElement('iframe');
    // cache l’UI du viewer + ajuste au conteneur (aucun scroll)
    const params = '#toolbar=0&navpanes=0&scrollbar=0&view=FitH';
    ifr.src = `${p.pdf}${params}`;
    ifr.loading = 'lazy';
    ifr.setAttribute('title', p.title || 'Document PDF');

    wrap.appendChild(ifr);
    return wrap;
  }

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
const origin = encodeURIComponent(location.origin);
ifr.src = `https://www.youtube.com/embed/${p.videoId}?rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
ifr.setAttribute('allowfullscreen','');
// important: ne PAS forcer "no-referrer"
ifr.referrerPolicy = 'strict-origin-when-cross-origin';
ifr.loading = 'lazy';
    wrap.appendChild(ifr); 
    return wrap;
  }
  if (p.embed){
    const wrap = document.createElement('div'); wrap.className = 'iframe-wrap';
    const ifr  = document.createElement('iframe');
    ifr.dataset.src = p.embed;
Perf.lazy(ifr); ifr.loading='lazy'; ifr.referrerPolicy='no-referrer';
    ifr.allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    wrap.appendChild(ifr); 
    return wrap;
  }

  // 3) Vidéos locales (MP4)
  if (p.video){
    const v = document.createElement('video');
v.preload = 'metadata';
v.dataset.src = p.video;
Perf.lazy(v);
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
    const img = document.createElement('img'); img.dataset.src = p.image || p.cover;
Perf.lazy(img); img.alt = p.title || 'image'; img.loading='lazy'; return img;
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
function spawnConfettiBurst(){
  const colors = ['#FFD93B','#FF6B6B','#6BCB77','#4D96FF','#FFFFFF'];
  const pieces = 80;

  for (let i = 0; i < pieces; i++){
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.backgroundColor = colors[i % colors.length];
    el.style.animationDelay = (Math.random() * 0.35) + 's';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1800);
  }
}
