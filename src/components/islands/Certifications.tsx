import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import type { Certification } from '@/data/site';
import './Certifications.css';

/** Certifications en cartes React Bits « Spotlight Card » : un halo iris suit le curseur (CSS seul, sans WebGL). */
export default function Certifications({ items, profileUrl }: { items: Certification[]; profileUrl: string }) {
  return (
    <ul className="certs" role="list">
      {items.map((c) => (
        <li key={c.title}>
          <SpotlightCard className="certs__card" spotlightColor="#A9AED6" intensity={0.22} spotlightSize={280} borderGlow={0.8} proximity={120} smoothing={0.35}>
            <p className="certs__issuer">{c.issuer}</p>
            <h3 className="certs__title">{c.title}</h3>
            <p className="certs__date">
              Obtenue en {c.date.toLowerCase()}
              {c.expires ? ` · valable jusqu’en ${c.expires.toLowerCase()}` : ''}
            </p>
            {c.credentialId && <p className="certs__id">Identifiant : {c.credentialId}</p>}
            <a className="certs__link" href={c.href ?? profileUrl} target="_blank" rel="noopener">
              Voir le certificat <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> {c.title} (nouvel onglet)</span>
            </a>
          </SpotlightCard>
        </li>
      ))}
    </ul>
  );
}
