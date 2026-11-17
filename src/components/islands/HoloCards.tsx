import { useEffect, useRef, useState } from 'react';
import HoloCard, { VERTEX, FRAGMENT } from '@/components/reactbits/HoloCard/HoloCard';
import { prewarmShader } from '@/lib/prewarmShader';
import { useEffectsLevel } from '@/lib/effects';
import './HoloCards.css';

export type HoloLink = { href: string; image: string; width: number; height: number; title: string; description: string; tags: readonly string[]; status: string };

/**
 * Cartes des portfolios spécialisés avec l'effet React Bits « Holo Card ».
 * Le visuel de chaque carte (src/assets/portfolios) est d'abord affiché tel quel ; Holo Card prend le relais
 * quand la carte approche de l'écran et que son shader a été compilé hors du fil principal.
 * Le texte reste présent en HTML (lecteurs d'écran, référencement).
 */
export default function HoloCards({ cards }: { cards: HoloLink[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const level = useEffectsLevel();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        prewarmShader(VERTEX, FRAGMENT).then(() => !cancelled && setLive(true));
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="holo-cards">
      {cards.map((c) => (
        <a key={c.href} className="holo-cards__link" href={c.href} target="_blank" rel="noopener" aria-label={`${c.title} : ${c.description} (nouvel onglet)`}>
          <span className="holo-cards__card" aria-hidden="true" style={{ aspectRatio: `${c.width} / ${c.height}` }}>
            {live && level === 'full' ? (
              <HoloCard
                image={c.image}
                alt=""
                preset="rainbow"
                intensity={0.4}
                scale={1}
                edgeSparkle={0.7}
                frame={2}
                glare={0.45}
                foilColor="#A9AED6"
                width={c.width}
                radius={22}
                tiltMax={10}
                hoverScale={1.02}
                idle
                shadow
                style={{ width: '100%' }}
              />
            ) : (
              <img className="holo-cards__still" src={c.image} alt="" width={c.width} height={c.height} loading="lazy" decoding="async" />
            )}
          </span>
          <span className="visually-hidden">
            {c.status}. {c.tags.join(', ')}.
          </span>
        </a>
      ))}
    </div>
  );
}
