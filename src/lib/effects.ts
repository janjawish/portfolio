/**
 * Niveau d'effets visuels : « full » (WebGL, animations riches) ou « lite » (contenu seul, effets légers).
 *
 * - Décision initiale (script dans le <head> de BaseLayout, avant tout rendu) : préférence « économiser les données »,
 *   peu de mémoire ou de cœurs, absence de WebGL 2, ou décision mémorisée lors d'une visite précédente.
 * - Décision en cours de route (startFpsProbe) : si l'appareil n'arrive pas à afficher assez d'images par seconde
 *   pendant les premières secondes, on bascule en « lite », on le mémorise, et les composants retirent leurs effets.
 *
 * Les composants lisent le niveau avec useEffectsLevel() : « pending » au rendu serveur et au premier rendu client,
 * pour qu'aucun effet lourd ne démarre avant que la décision soit connue.
 */
import { useEffect, useState } from 'react';

export type EffectsLevel = 'pending' | 'full' | 'lite';
type JJWindow = Window & { __jjLite?: boolean };

const STORAGE_KEY = 'jj-effects';
const KEEP_DAYS = 14;

export function isLite(): boolean {
  return typeof window !== 'undefined' && !!(window as JJWindow).__jjLite;
}

/** Passe le site en mode allégé (définitivement pour cette visite, mémorisé quelques jours). */
export function setLite(reason: string) {
  const w = window as JJWindow;
  if (w.__jjLite) return;
  w.__jjLite = true;
  document.documentElement.classList.add('lite');
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ level: 'lite', until: Date.now() + KEEP_DAYS * 864e5, reason }));
  } catch {
    /* stockage indisponible : la décision vaut pour cette visite */
  }
  window.dispatchEvent(new CustomEvent('jj:effects', { detail: { level: 'lite', reason } }));
}

export function useEffectsLevel(): EffectsLevel {
  const [level, setLevel] = useState<EffectsLevel>('pending');
  useEffect(() => {
    const sync = () => setLevel(isLite() ? 'lite' : 'full');
    sync();
    window.addEventListener('jj:effects', sync);
    return () => window.removeEventListener('jj:effects', sync);
  }, []);
  return level;
}

/**
 * Mesure la fluidité réelle pendant les premières secondes (là où les effets sont les plus lourds).
 * Bascule en mode allégé si l'affichage descend sous ~24 images/s ou si la moitié des images dépasse 50 ms.
 */
export function startFpsProbe(durationMs = 4000) {
  if (isLite() || typeof requestAnimationFrame === 'undefined') return;
  let frames = 0;
  let slow = 0;
  let last = 0;
  let elapsed = 0;
  const tick = (now: number) => {
    if (isLite()) return;
    if (document.visibilityState !== 'visible') {
      last = 0; // onglet masqué : la mesure est suspendue
      requestAnimationFrame(tick);
      return;
    }
    if (last) {
      const dt = now - last;
      elapsed += Math.min(dt, 250);
      frames++;
      if (dt > 50) slow++;
    }
    last = now;
    if (elapsed < durationMs) {
      requestAnimationFrame(tick);
      return;
    }
    const fps = (frames * 1000) / elapsed;
    if (fps < 24 || slow > frames * 0.5) setLite(`fps ${fps.toFixed(1)}`);
  };
  requestAnimationFrame(tick);
}
