/**
 * Niveau d'effets visuels : « full » (WebGL, animations riches) ou « lite » (contenu seul, effets légers).
 *
 * Depuis le 23/11/2026, à la demande de Jan, le mode allégé n'est plus déclenché par la lenteur de l'appareil :
 * il ne sert qu'aux navigateurs sans WebGL 2 (décision prise dans le <head> de BaseLayout).
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

