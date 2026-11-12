import siteConfig from '../config/siteConfig';
import { SunflowerField, type FieldConfig } from './SunflowerField';
import { HeartIcon } from './HeartIcon';
import { useReveal } from '../hooks/useReveal';

const finaleFieldConfig: FieldConfig = {
  seed: 29,
  spread: 1.4,
  scale: 0.9,
  soil: '#15100a',
  mound: '#1c150d',
  // Campo final compacto e harmonioso
  height: (W) => (W < 420 ? 190 : W < 600 ? 220 : W < 1000 ? 270 : 320),
  near: (W) => (W < 420 ? 4 : W < 600 ? 6 : W < 1000 ? 8 : 11),
  far: (W) => (W < 420 ? 5 : W < 600 ? 7 : W < 1000 ? 10 : 12),
};

interface FinaleLineProps {
  text: string;
  isLast: boolean;
  delay: number;
}

function FinaleLine({ text, isLast, delay }: FinaleLineProps) {
  const lineRef = useReveal<HTMLParagraphElement>();

  return (
    <p
      className="reveal"
      ref={lineRef}
      style={{ '--rd': `${delay}s` } as React.CSSProperties}
    >
      {text}
      {isLast && (
        <>
          {' '}
          <HeartIcon />
        </>
      )}
    </p>
  );
}

export function Finale() {
  return (
    <section className="finale" id="final" aria-labelledby="finalTitle">
      <div className="gutter finale-text">
        <h2 className="sr-only" id="finalTitle">
          Mensagem final
        </h2>
        <div id="finalLines">
          {siteConfig.final.lines.map((line, idx) => (
            <FinaleLine
              key={idx}
              text={line}
              isLast={idx === siteConfig.final.lines.length - 1}
              delay={idx * 0.45}
            />
          ))}
        </div>
      </div>
      <SunflowerField
        config={finaleFieldConfig}
        className="field"
        id="finalField"
        observeStart={true}
      />
    </section>
  );
}
