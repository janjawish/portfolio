import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import { respond, SUGGESTIONS, type Answer, type KB } from '@/lib/assistant-engine';
import './Assistant.css';
import { useEffectsLevel } from '@/lib/effects';

// Strands (React Bits, WebGL) sert de bouton d'ouverture ; il est chargé après le rendu de la page.
const Strands = lazy(() => import('@/components/reactbits/Strands/Strands'));
const STRANDS_COLORS = ['#F5F3EE', '#A9AED6', '#858BB9', '#5b6090', '#3d4170'];

type Message = { id: number; from: 'user' | 'bot'; answer?: Answer; text?: string };

const WELCOME: Answer = {
  text: [
    'Bonjour ! Je suis l’assistant du portfolio de Jan Jawish.',
    'Je réponds localement, uniquement à partir des informations vérifiées publiées sur ce site. Aucune donnée n’est envoyée à un service externe.',
  ],
  links: [],
};

export default function Assistant() {
  const level = useEffectsLevel();
  const [open, setOpen] = useState(false);
  const [kb, setKb] = useState<KB | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'bot', answer: WELCOME }]);
  const [value, setValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const [reduce, setReduce] = useState(false);
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const seq = useRef(1);

  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

  // L'orbe WebGL compile un shader coûteux : il ne démarre qu'une fois la page chargée et au repos
  // (ou dès que l'on survole / focalise le bouton). En attendant, un orbe statique en CSS le remplace.
  const [orbLive, setOrbLive] = useState(false);
  useEffect(() => {
    if (orbLive) return;
    let timer = 0;
    let idle = 0;
    const go = () => {
      timer = window.setTimeout(() => {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) idle = ric(() => setOrbLive(true), { timeout: 2000 });
        else setOrbLive(true);
      }, 3500);
    };
    // Sur l'accueil, on attend aussi la fin de l'intro (le hero passe en premier).
    const ready = () => {
      if (document.documentElement.classList.contains('intro')) window.addEventListener('jj:intro-done', go, { once: true });
      else go();
    };
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
    return () => {
      window.removeEventListener('load', ready);
      window.removeEventListener('jj:intro-done', go);
      window.clearTimeout(timer);
      (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idle);
    };
  }, [orbLive]);

  // Charge la base de connaissances à la première ouverture.
  useEffect(() => {
    if (!open || kb) return;
    fetch('/assistant.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: KB) => setKb(data))
      .catch(() => setLoadError(true));
  }, [open, kb]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, thinking, reduce]);

  const ask = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q || !kb) return;
      setMessages((m) => [...m, { id: seq.current++, from: 'user', text: q }]);
      setValue('');
      setThinking(true);
      // Courte pause visuelle (l'orbe réagit) ; la réponse est calculée localement et immédiatement.
      const answer = respond(kb, q);
      window.setTimeout(
        () => {
          setMessages((m) => [...m, { id: seq.current++, from: 'bot', answer }]);
          setThinking(false);
        },
        reduce ? 0 : 420,
      );
    },
    [kb, reduce],
  );

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    ask(value);
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`asst-launcher${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fermer l’assistant' : 'Ouvrir l’assistant : une question sur Jan ?'}
        onClick={() => setOpen((o) => !o)}
        onPointerEnter={() => setOrbLive(true)}
        onFocus={() => setOrbLive(true)}
      >
        <span className="asst-launcher__orb" aria-hidden="true">
          {reduce || !orbLive || level !== 'full' ? (
            <span className="asst__orb-fallback" />
          ) : (
            <Suspense fallback={<span className="asst__orb-fallback" />}>
              <Strands
                colors={STRANDS_COLORS}
                count={4}
                speed={thinking ? 2.6 : 2}
                amplitude={thinking ? 1.8 : 1.6}
                waviness={1.6}
                energy={1}
                listening={thinking}
                glow={1}
                glass
                intro
                interactive
                clickPulse
                maxDevicePixelRatio={1.5}
              />
            </Suspense>
          )}
        </span>
      </button>

      {open && (
        <section id={panelId} className="asst" role="dialog" aria-modal="false" aria-labelledby={`${panelId}-title`}>
          <header className="asst__head">
            <div className="asst__titles">
              <h2 id={`${panelId}-title`} className="asst__title">
                Assistant de Jan
              </h2>
              <p className="asst__sub">Réponses locales, vérifiées · sans IA externe</p>
            </div>
            <button
              type="button"
              className="asst__close"
              aria-label="Fermer l’assistant"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              ✕
            </button>
          </header>

          <div ref={logRef} className="asst__log" data-lenis-prevent role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((m) =>
              m.from === 'user' ? (
                <p key={m.id} className="asst__msg asst__msg--user">
                  <span className="visually-hidden">Vous : </span>
                  {m.text}
                </p>
              ) : (
                <div key={m.id} className="asst__msg asst__msg--bot">
                  <span className="visually-hidden">Assistant : </span>
                  {m.answer?.text.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                  {m.answer && m.answer.links.length > 0 && (
                    <ul className="asst__links" role="list">
                      {m.answer.links.map((l) => (
                        <li key={l.href + l.label}>
                          <a href={l.href} target={l.href.endsWith('.pdf') ? '_blank' : undefined} rel={l.href.endsWith('.pdf') ? 'noopener' : undefined}>
                            {l.label} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
            )}
            {thinking && (
              <p className="asst__typing" aria-label="L’assistant prépare une réponse">
                <span />
                <span />
                <span />
              </p>
            )}
            {loadError && <p className="asst__msg asst__msg--bot">Impossible de charger les informations de l’assistant. Vous pouvez écrire à Jan depuis la page Contact.</p>}
          </div>

          <div className="asst__suggest" aria-label="Suggestions de questions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="asst__chip" disabled={!kb || thinking} onClick={() => ask(s)}>
                {s}
              </button>
            ))}
          </div>

          <form className="asst__form" onSubmit={onSubmit}>
            <label htmlFor={`${panelId}-input`} className="visually-hidden">
              Votre question
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={kb ? 'Posez une question sur Jan…' : 'Chargement…'}
              autoComplete="off"
              maxLength={240}
              disabled={!kb}
            />
            <button type="submit" className="asst__send" disabled={!kb || !value.trim() || thinking} aria-label="Envoyer la question">
              ↑
            </button>
          </form>
        </section>
      )}
    </>
  );
}
