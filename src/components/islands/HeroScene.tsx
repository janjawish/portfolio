import { useEffect, useRef, useState } from 'react';
import Prism from '@/components/reactbits/Prism/Prism';
import { RefractedText } from '@/components/reactdrops/refracted-text';
import { prewarmRefractedShaders } from '@/components/reactdrops/refracted-text/refracted-renderer';
import { debloquer, defilerVers } from '@/lib/smoothScroll';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import { useEffectsLevel } from '@/lib/effects';
import './HeroScene.css';

/**
 * Fond et titre du hero : un prisme (React Bits « Prism ») décompose la lumière comme
 * Jan relie plusieurs expertises ; le nom est rendu en verre réfracté (ReactDrops « Refracted Text »).
 * Le <h1> textuel reste dans le DOM pour le référencement et les lecteurs d'écran.
 */

const FONT = "'Bricolage Grotesque Variable', sans-serif";
const PALETTE = ['#F5F3EE', '#858BB9', '#3d4170', '#A9AED6'];

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

export function HeroBackground() {
  const level = useEffectsLevel();
  const mobile = useMedia('(max-width: 760px)');
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  // Le prisme apparaît en fondu dès qu'il est monté : c'est le premier temps de l'intro.
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className={`hero-prism${on ? ' is-on' : ''}${level === 'lite' ? ' hero-prism--lite' : ''}`} aria-hidden="true">
      {/* Mode allégé : halo statique en CSS à la place du prisme WebGL. */}
      {level === 'full' && <Prism
        animationType="rotate"
        colors={PALETTE}
        glow={mobile ? 0.8 : 0.9}
        noise={0}
        saturation={1.4}
        colorFrequency={1}
        scale={mobile ? 1.45 : 1.75}
        height={3.4}
        baseWidth={5.4}
        offset={{ x: 0, y: mobile ? 70 : -40 }}
        timeScale={reduce ? 0 : 0.32}
        hoverStrength={1.2}
        inertia={0.04}
        interactive={!mobile && !reduce}
        resolution={mobile ? 0.45 : 0.5}
        dpr={1}
      />}
    </div>
  );
}

/** Durée minimale pendant laquelle le prisme est vu seul, avant la montée du nom (ms). */
const PRISM_SOLO = 2000;

/** Fin de l'intro : le reste de l'accueil apparaît et le défilement est rétabli. */
function endIntro() {
  const d = document.documentElement;
  if (!d.classList.contains('intro')) return;
  d.classList.remove('intro');
  debloquer();
  window.dispatchEvent(new Event('jj:intro-done'));
}

export function HeroTitle() {
  const level = useEffectsLevel();
  const [mobile, setMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hold, setHold] = useState(true);
  const readyCount = useRef(0);
  const introRef = useRef(false);

  // 1. Pendant que le prisme s'affiche seul : compilation du verre hors du fil principal + police.
  useEffect(() => {
    // Mode allégé : pas de verre, le nom s'affiche en texte (voir Hero.astro) et l'intro s'arrête.
    if (level === 'lite') {
      setMounted(false);
      document.documentElement.classList.remove('hero-art-ready');
      endIntro();
      return;
    }
    if (level !== 'full') return;
    let cancelled = false;
    const d = document.documentElement;
    introRef.current = d.classList.contains('intro');
    if (introRef.current) window.scrollTo(0, 0);
    setMobile(window.matchMedia('(max-width: 760px)').matches);
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduce(r);
    if (!introRef.current) setHold(false);
    const font = document.fonts ? document.fonts.load(`800 342px ${FONT}`, 'JAN JAWISH').catch(() => []) : Promise.resolve();
    Promise.all([prewarmRefractedShaders(), font]).then(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
      d.classList.remove('hero-art-ready');
    };
  }, [level]);

  // 2. Masques prêts : le verre remplace le nom texte ; après le temps « prisme seul », les lettres montent.
  const onReady = () => {
    readyCount.current += 1;
    if (readyCount.current < (mobile ? 2 : 1)) return;
    document.documentElement.classList.add('hero-art-ready');
    if (!introRef.current) return;
    const begun = (window as Window & { __introStart?: number }).__introStart ?? 0;
    const wait = Math.max(0, PRISM_SOLO - (performance.now() - begun));
    window.setTimeout(() => {
      setHold(false);
      // 3. Le reste de la page apparaît pendant la fin de la montée des lettres.
      window.setTimeout(endIntro, (mobile ? 1.1 : 1.2) * 1000);
    }, wait);
  };

  const common = { decorative: true, fontFamily: FONT, fontWeight: 800, extraBold: 1.2, theme: 'dark' as const, reveal: !reduce, holdReveal: hold, onReady };
  return (
    <div className={`hero-title-art${mounted ? ' is-ready' : ''}`}>
      {mounted &&
        level === 'full' &&
        (mobile ? (
          <>
            <RefractedText {...common} maxPixelRatio={1.25} cornerRounding={0} text="JAN" fontSize="clamp(64px, 26vw, 170px)" stagger={0.4} liftDuration={1.4} intensity={1.1} />
            <RefractedText {...common} maxPixelRatio={1.25} cornerRounding={0} text="JAWISH" fontSize="clamp(40px, 13.4vw, 110px)" stagger={0.45} liftDuration={1.5} intensity={1.1} />
          </>
        ) : (
          <RefractedText
            {...common}
            maxPixelRatio={1.5}
            text="JAN JAWISH"
            fontSize="clamp(70px, 9.4vw, 172px)"
            stagger={0.5}
            liftDuration={1.6}
            intensity={1.15}
            dispersion={1.15}
            colorIntensity={0.9}
          />
        ))}
    </div>
  );
}

export function HeroCta() {
  const level = useEffectsLevel();
  const discover = () => {
    const target = document.getElementById('decouvrir');
    defilerVers(target);
    (target?.querySelector('h2') as HTMLElement | null)?.focus({ preventScroll: true });
  };
  // Bouton simple tant que le niveau d'effets n'est pas connu, et en mode allégé.
  if (level !== 'full')
    return (
      <button type="button" className="btn btn--glass btn--lg" onClick={discover} aria-label="Découvrir Jan : faire défiler jusqu’à la présentation">
        Découvrir Jan
      </button>
    );
  return (
    <SpecularButton
      size="lg"
      radius={30}
      tint="#858BB9"
      tintOpacity={0.12}
      textColor="#F5F3EE"
      lineColor="#F5F3EE"
      baseColor="#3a3d55"
      idleIntensity={0.45}
      glow={0.9}
      speed={0.3}
      aria-label="Découvrir Jan : faire défiler jusqu’à la présentation"
      onClick={discover}
    >
      Découvrir Jan
    </SpecularButton>
  );
}
