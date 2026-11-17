import { useEffect, useState, type ReactNode } from 'react';
import { useEffectsLevel } from '@/lib/effects';
import { TopographicFlow } from '@/components/reactdrops/topographic-flow';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';
import './Decor.css';

/** Fond « Topographic Flow » (ReactDrops) : courbes de niveau discrètes, sans grain. */
export function TopoBackdrop({ height = '100%' }: { height?: string | number }) {
  const level = useEffectsLevel();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  if (level !== 'full') return <div className="topo-backdrop" aria-hidden="true" />;
  return (
    <div className="topo-backdrop" aria-hidden="true">
      <TopographicFlow
        height={height}
        backgroundColor="#0B0B0C"
        lineColor="#23252e"
        accentColor="#4a4e72"
        lineStyle="solid"
        scale={420}
        density={6}
        speed={0.7}
        distortion={2}
        lineWidth={0.8}
        opacity={0.9}
        grain={0}
        hover={0.5}
        hoverEffect="rings"
        paused={reduce}
      />
    </div>
  );
}

/** Carte encadrée par « Star Border » (React Bits). */
export function StarCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <StarBorder
      as="div"
      className={`star-card ${className}`}
      color="#A9AED6"
      trailColor="#858BB9"
      duration={9}
      thickness={1}
      radius={24}
      stars={2}
      glow={0.6}
      sparkle={false}
      hover="none"
      clickPulse={false}
      backgroundColor="#17181C"
      textColor="#F5F3EE"
      borderColor="rgba(245, 243, 238, 0.1)"
    >
      {children}
    </StarBorder>
  );
}
