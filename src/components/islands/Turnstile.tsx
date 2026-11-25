import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';

/**
 * Widget Cloudflare Turnstile (anti-robot), rendu explicite.
 * Le jeton (à usage unique) est lu au moment de l'envoi via `getToken()`, puis `reset()`.
 * Aucun rendu si PUBLIC_TURNSTILE_SITE_KEY est vide.
 */

const SITE_KEY = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined)?.trim() || '';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
  getResponse: (id: string) => string | undefined;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = { getToken: () => string; reset: () => void };
export const turnstileEnabled = Boolean(SITE_KEY);

let loading: Promise<TurnstileApi> | null = null;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    s.onerror = () => {
      loading = null;
      reject(new Error('turnstile'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export default function Turnstile({ ref }: { ref?: Ref<TurnstileHandle> }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => (widget.current && window.turnstile?.getResponse(widget.current)) || '',
    reset: () => {
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY || !box.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current || widget.current) return;
        widget.current = api.render(box.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          appearance: 'interaction-only', // invisible sauf si Cloudflare a un doute
          action: 'contact',
        });
      })
      .catch(() => {
        /* script bloqué : l'intranet refusera l'envoi, le formulaire propose la messagerie */
      });
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={box} className="cf__turnstile" />;
}
