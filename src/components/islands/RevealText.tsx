import ScrollReveal from '@/components/reactbits/ScrollReveal/ScrollReveal';
import './Motion.css';
import { useEffectsLevel } from '@/lib/effects';

/**
 * Texte révélé au défilement (React Bits « Scroll Reveal »).
 * Réglages choisis par Jan (15/11/2026) : highlight, stagger 0.5, smoothing 1.2, baseOffset 25, blurStrength 7,
 * le reste aux valeurs par défaut du composant. Le surlignage passe par l'iris du site plutôt que l'orange de la démo.
 */
export function RevealText({
  text,
  as = 'p',
  className = '',
}: {
  text: string;
  as?: 'h2' | 'h3' | 'p';
  className?: string;
}) {
  const level = useEffectsLevel();
  if (level === 'lite') {
    const Tag = as;
    return (
      <div className={`reveal-text ${className}`}>
        <Tag className="reveal-text__inner">{text}</Tag>
      </div>
    );
  }
  return (
    <ScrollReveal
      as={as}
      mode="scrub"
      splitBy="words"
      effect="fade"
      highlightColor="#A9AED6"
      stagger={0.5}
      smoothing={1.2}
      baseOffset={25}
      blurStrength={7}
      enableBlur
      baseOpacity={0.1}
      baseRotation={3}
      duration={0.8}
      containerClassName={`reveal-text ${className}`}
      textClassName="reveal-text__inner"
      rotationEnd="bottom bottom"
      wordAnimationEnd="bottom bottom"
    >
      {text}
    </ScrollReveal>
  );
}
