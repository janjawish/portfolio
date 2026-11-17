import { useEffect, useState } from 'react';
import FuzzyText from '@/components/reactbits/FuzzyText/FuzzyText';

/** « 404 » brouillé (React Bits « Fuzzy Text ») - seul endroit du site où le texte se déforme, volontairement. */
export default function NotFoundArt() {
  const [size, setSize] = useState('clamp(6rem, 26vw, 18rem)');
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setSize(window.innerWidth < 640 ? '7.5rem' : 'clamp(8rem, 24vw, 18rem)');
  }, []);
  return (
    <div aria-hidden="true" className="nf-art">
      <FuzzyText
        fontSize={size}
        fontWeight={800}
        fontFamily="'Bricolage Grotesque Variable', sans-serif"
        color="#F5F3EE"
        baseIntensity={reduce ? 0 : 0.14}
        hoverIntensity={reduce ? 0 : 0.45}
        enableHover={!reduce}
        fuzzRange={26}
        colorSplit={0.6}
      >
        404
      </FuzzyText>
    </div>
  );
}
