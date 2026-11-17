import BorderGlow from '@/components/reactbits/BorderGlow/BorderGlow';
import './SkillCards.css';

export type SkillCard = { id: string; index: string; title: string; short: string; tools: string[]; href: string };

/** Grille des dix domaines de compétences, chaque carte sur un « Border Glow » (React Bits). */
export default function SkillCards({ skills, compact = false }: { skills: SkillCard[]; compact?: boolean }) {
  return (
    <ul className={`skill-cards${compact ? ' skill-cards--compact' : ''}`} role="list">
      {skills.map((s) => (
        <li key={s.id} className="skill-cards__item">
          <BorderGlow
            backgroundColor="#17181C"
            glowColor="234 28 62"
            colors={['#858BB9', '#A9AED6', '#F5F3EE']}
            borderRadius={22}
            glowRadius={36}
            glowIntensity={0.85}
            edgeSensitivity={28}
            coneSpread={22}
            fillOpacity={0.35}
            className="skill-cards__glow"
          >
            <a className="skill-cards__link" href={s.href}>
              <span className="skill-cards__index">{s.index}</span>
              <span className="skill-cards__title">{s.title}</span>
              <span className="skill-cards__short">{s.short}</span>
              {!compact && (
                <span className="skill-cards__tools">
                  {s.tools.slice(0, 4).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </span>
              )}
              <span className="skill-cards__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </BorderGlow>
        </li>
      ))}
    </ul>
  );
}
