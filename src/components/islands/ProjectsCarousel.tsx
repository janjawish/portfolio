import { useEffect, useRef, useState, type CSSProperties } from 'react';
import FlexCarousel from '@/components/reactbits/FlexCarousel/FlexCarousel';
import { defilerDe } from '@/lib/smoothScroll';
import { useEffectsLevel } from '@/lib/effects';
import './ProjectsCarousel.css';

export type CarouselLink = { href: string; label: string };
export type CarouselProject = { src: string; alt: string; title: string; subtitle: string; href: string; links?: CarouselLink[] };

function ProjectActions({ project, compact = false }: { project: CarouselProject; compact?: boolean }) {
  return (
    <div className={`projects-carousel__actions${compact ? ' projects-carousel__actions--compact' : ''}`}>
      {project.links?.map((l) => (
        <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label} <span className="arrow" aria-hidden="true">↗</span>
          <span className="visually-hidden"> (nouvel onglet)</span>
        </a>
      ))}
      <a className="btn btn--solid" href={project.href}>
        {compact ? 'Ouvrir le projet' : <>Ouvrir « {project.title} »</>} <span className="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/**
 * Projets phares dans le « Flex Carousel » de React Bits, piloté par le défilement de la page :
 * la scène se fixe au milieu de l'écran, chaque portion de défilement fait avancer d'un projet,
 * puis la page reprend son cours après le dernier. Un clic sur la carte active ouvre la fiche.
 */
export default function ProjectsCarousel({ items }: { items: CarouselProject[] }) {
  const level = useEffectsLevel();
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 760px)');
    const on = () => setMobile(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - sticky.offsetHeight;
      const p = travel > 0 ? (top - rect.top) / travel : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [level]);

  const current = items[active] ?? items[0];

  // Mode allégé : rangée de cartes à faire défiler latéralement, sans WebGL ni piste de défilement.
  if (level === 'lite')
    return (
      <ul className="projects-lite" role="list" aria-label="Projets phares">
        {items.map((it) => (
          <li key={it.href}>
            <a className="projects-lite__card" href={it.href}>
              <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
              <span className="projects-lite__title">{it.title}</span>
              <span className="projects-lite__sub">{it.subtitle}</span>
            </a>
            {it.links?.length ? <ProjectActions project={it} compact /> : null}
          </li>
        ))}
      </ul>
    );

  return (
    <div ref={trackRef} className="projects-carousel" style={{ '--pc-count': items.length } as CSSProperties}>
      <div ref={stickyRef} className="projects-carousel__sticky">
        {level !== 'full' ? (
          <div className="projects-carousel__stage projects-carousel__stage--placeholder flex-carousel" aria-hidden="true" />
        ) : (
        <FlexCarousel
          items={items.map(({ src, alt, title, subtitle }) => ({ src, alt, title, subtitle }))}
          preset="ribbon"
          intro="rise"
          fit="landscape"
          cardHeight={mobile ? 0.62 : 0.56}
          gap={mobile ? 10 : 16}
          radius={18}
          captions
          captureWheel={false}
          focusOnClick={false}
          ariaLabel="Projets phares"
          ofLabel="sur"
          progress={progress}
          onScrub={(deltaCards, immediate) => {
            // Glisser ou défilement latéral : on fait défiler la page d'autant de « pas » que de cartes.
            const track = trackRef.current;
            const sticky = stickyRef.current;
            if (!track || !sticky || items.length < 2) return;
            const step = (track.offsetHeight - sticky.offsetHeight) / (items.length - 1);
            defilerDe(deltaCards * step, immediate);
          }}
          onChange={(i) => setActive(i)}
          onSelect={(i) => {
            const target = items[i];
            if (i === active && target) window.location.assign(target.href);
          }}
          className="projects-carousel__stage"
        />
        )}
        <div className="projects-carousel__meta">
          <div className="projects-carousel__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} />
          </div>
          {current && <ProjectActions project={current} />}
        </div>
      </div>
    </div>
  );
}
