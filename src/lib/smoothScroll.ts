/**
 * Défilement amorti (Lenis), synchronisé avec GSAP ScrollTrigger.
 * Réglages : un peu lourd, avec inertie. Rien n'est démarré si l'utilisateur préfère réduire les animations.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLite } from '@/lib/effects';

const OFFSET = -96;
let lenis: Lenis | null = null;
let started = false;

export function demarrerDefilement(): Lenis | null {
  if (started) return lenis;
  started = true;
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  // Mode allégé : défilement natif du navigateur (plus économe).
  if (isLite()) return null;
  lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.85, smoothWheel: true, allowNestedScroll: true });
  (window as Window & { __lenis?: Lenis }).__lenis = lenis;
  // Intro de l'accueil en cours : le défilement reste bloqué jusqu'à sa fin.
  if (document.documentElement.classList.contains('scroll-lock')) lenis.stop();
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Bascule en mode allégé en cours de visite : retour au défilement natif.
  window.addEventListener('jj:effects', () => {
    if (!lenis || !isLite()) return;
    lenis.destroy();
    lenis = null;
    (window as Window & { __lenis?: Lenis }).__lenis = undefined;
    document.documentElement.classList.remove('scroll-lock');
    ScrollTrigger.refresh();
  });
  return lenis;
}

export function getLenis() {
  return lenis;
}

/** Remonte en haut de page, sans animation (changement de page). */
export function remonter() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Défile jusqu'à un élément (ancres, sommaires), avec un décalage de 96 px pour l'en-tête. */
export function defilerVers(el: Element | null) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: OFFSET, duration: 1.1 });
  else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = el.getBoundingClientRect().top + window.scrollY + OFFSET;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
}

/** Décale le défilement de la page de `dy` pixels (gestes latéraux du carrousel). */
export function defilerDe(dy: number, immediate = false) {
  if (lenis) lenis.scrollTo(lenis.targetScroll + dy, { immediate, force: true });
  else window.scrollBy(0, dy);
}

/** Bloque / rétablit le défilement (intro de l'accueil). */
export function bloquer() {
  lenis?.stop();
  document.documentElement.classList.add('scroll-lock');
}
export function debloquer() {
  document.documentElement.classList.remove('scroll-lock');
  lenis?.start();
}
