import { useEffect, useRef, useState } from 'react';
import StaggeredMenu from '@/components/reactbits/StaggeredMenu/StaggeredMenu';
import GooeyNav from '@/components/reactbits/GooeyNav/GooeyNav';
import { NAV, SOCIALS, SITE } from '@/data/site';
import { useEffectsLevel } from '@/lib/effects';
import './SiteHeader.css';

const ITEMS = [{ label: 'Accueil', href: '/' }, ...NAV];

function activeIndexFor(path: string) {
  const clean = path.replace(/\/$/, '') || '/';
  return ITEMS.findIndex((n) => clean === n.href || clean.startsWith(n.href + '/'));
}

/**
 * En-tête persistant : il reste monté d'une page à l'autre (Astro ClientRouter + transition:persist),
 * si bien que l'animation de la pastille Gooey Nav se joue jusqu'au bout pendant le changement de page.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // La navigation « gooey » (WebGL) n’est montée que sur grand écran, où elle est visible.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1180px)');
    const on = () => setDesktop(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  const navWrap = useRef<HTMLDivElement>(null);
  const level = useEffectsLevel();
  // Index de la page courante dans la navigation (-1 : page hors navigation, aucune pastille).
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const sync = () => setActive(activeIndexFor(window.location.pathname));
    sync();
    document.addEventListener('astro:page-load', sync);
    return () => document.removeEventListener('astro:page-load', sync);
  }, []);
  const idle = active < 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hors des pages de la navigation, aucun lien ne doit être annoncé comme page courante.
  useEffect(() => {
    if (!idle) return;
    navWrap.current?.querySelectorAll('[aria-current]').forEach((el) => el.removeAttribute('aria-current'));
  });

  const logo = (
    <a href="/" className="site-logo" aria-label="Jan Jawish, accueil">
      <span className="site-logo__name">Jan Jawish</span>
    </a>
  );

  return (
    <div className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="site-header__bar" aria-hidden="true" />
      <div ref={navWrap} className="site-header__nav">
        {/* Mode allégé : même barre, sans l'animation WebGL de la pastille. */}
        {desktop && level === 'lite' && (
          <nav aria-label="Navigation principale" className="lite-nav">
            <ul role="list">
              {ITEMS.map((n, i) => (
                <li key={n.href}>
                  <a href={n.href} aria-current={i === active ? 'page' : undefined} className={i === active ? 'is-active' : undefined} onClick={() => setActive(i)}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {desktop && level === 'full' && (
        <GooeyNav
          items={ITEMS.map((n) => ({ label: n.label, href: n.href }))}
          activeIndex={active >= 0 ? active : 0}
          className={idle ? 'is-idle' : ''}
          onChange={(i) => setActive(i)}
          theme="dark"
          color="#F5F3EE"
          activeTextColor="#0B0B0C"
          colors={['#858BB9', '#A8AAB5', '#F5F3EE']}
          size="sm"
          frame
          particleCount={10}
          gooeyness={0.8}
        />
        )}
      </div>
      <StaggeredMenu
        isFixed
        position="right"
        logo={logo}
        menuLabel="Menu"
        closeLabel="Fermer"
        socialsTitle="Réseaux"
        items={ITEMS.map((n) => ({
          label: n.label,
          ariaLabel: n.label,
          link: n.href,
        }))}
        socialItems={SOCIALS.map((s) => ({ label: s.label, link: s.href }))}
        displaySocials
        displayItemNumbering
        colors={['#3d4170', '#17181C']}
        accentColor="#858BB9"
        menuButtonColor="#F5F3EE"
        openMenuButtonColor="#F5F3EE"
        changeMenuColorOnOpen
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        footer={
          <div className="sm-extra">
            <a className="sm-extra__mail" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <a className="sm-extra__cv" href={SITE.cv} target="_blank" rel="noopener">
              Télécharger le CV
            </a>
          </div>
        }
      />
    </div>
  );
}
