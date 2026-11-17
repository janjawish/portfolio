import { useEffect, useRef, useState } from 'react';
import HalftoneReveal, { VERTEX, MASK, VIEW } from '@/components/reactbits/HalftoneReveal/HalftoneReveal';
import { prewarmShader } from '@/lib/prewarmShader';
import { useEffectsLevel } from '@/lib/effects';
import './PortraitReveal.css';

type Props = { src: string; full: string; width: number; height: number; alt: string; paper?: string; ink?: string; invert?: boolean };

/**
 * Portrait avec l'effet React Bits « Halftone Reveal », réglé léger : les points d'impression apparaissent
 * en douceur depuis le centre quand le portrait arrive à l'écran (l'image fixe se fond dans la trame pendant ce temps),
 * puis la vraie image se révèle sous le curseur.
 * L'image <img> reste dans la page (texte alternatif, référencement, affichage sans WebGL).
 */
/* Photo sur fond sombre : points clairs sur fond encre ; avec « invert », les zones claires reçoivent les points (rendu positif). */
export default function PortraitReveal({ src, full, width, height, alt, paper = '#0B0B0C', ink = '#F5F3EE', invert = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useEffectsLevel();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // L'effet se révèle au survol : sur écran tactile (sans survol), la photo reste affichée telle quelle.
    const touchOnly = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!el || touchOnly || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('WebGL2RenderingContext' in window)) return;
    let cancelled = false;
    // Les shaders se compilent hors du fil principal pendant l'approche du portrait…
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all([prewarmShader(VERTEX, MASK), prewarmShader(VERTEX, VIEW)]).then(() => {
          if (cancelled) return;
          // …et l'effet démarre quand le portrait est réellement visible (l'intro se joue sous les yeux).
          const show = new IntersectionObserver(
            ([e]) => {
              if (!e.isIntersecting || cancelled) return;
              show.disconnect();
              // Démarrage après le chargement complet de la page et un temps de repos du navigateur.
              const start = () => {
                const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
                const go = () => !cancelled && setLive(true);
                if (ric) ric(go, { timeout: 1500 });
                else window.setTimeout(go, 300);
              };
              if (document.readyState === 'complete') start();
              else window.addEventListener('load', start, { once: true });
            },
            { threshold: 0.35 },
          );
          show.observe(el);
        });
      },
      { rootMargin: '500px 0px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`portrait-reveal${live && level === 'full' ? ' is-live' : ''}`} style={{ aspectRatio: `${width} / ${height}`, background: paper }}>
      <img src={src} alt={alt} width={width} height={height} decoding="async" className="portrait-reveal__img" />
      {live && level === 'full' && (
        <div className="portrait-reveal__fx" aria-hidden="true">
          <HalftoneReveal
            src={full}
            fit="cover"
            mode="mono"
            shape="dot"
            cellSize={5}
            angle={45}
            dotScale={1}
            inkColor={ink}
            paperColor={paper}
            invert={invert}
            keyMatte={false}
            contrast={1.1}
            brightness={0}
            revealRadius={170}
            softness={0.8}
            linger={1.6}
            intro
          />
        </div>
      )}
    </div>
  );
}
