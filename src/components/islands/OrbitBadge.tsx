import CircularText from '@/components/reactbits/CircularText/CircularText';
import './Motion.css';

/**
 * Badge typographique circulaire (React Bits « Circular Text »).
 * Réglages choisis par Jan (15/11/2026) : survol = ralentit, tour en 21 s, inclinaison au survol 7°, taille 190,
 * corps 26, angle de départ 180°. Couleurs de la démo (#a901ff / #b401ff) remplacées par l'iris du site.
 */
export function OrbitBadge({ text, color = '#A9AED6', ringColor = '#858BB9' }: { text: string; color?: string; ringColor?: string }) {
  return (
    <div className="orbit-badge" aria-hidden="true">
      <CircularText
        text={text}
        color={color}
        ringColor={ringColor}
        onHover="slowDown"
        spinDuration={21}
        hoverTilt={7}
        size={190}
        fontSize={26}
        fontWeight={500}
        startAngle={180}
        draggable
      />
    </div>
  );
}
