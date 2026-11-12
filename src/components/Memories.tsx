import { useEffect, useRef } from 'react';
import siteConfig from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { Polaroid } from './Polaroid';
import { mulberry32 } from '../lib/rng';
import { flowerHTML } from './Sunflower';

/** Pequeno buquê de 3 girassóis estáticos e balançando acima do título */
function Sprigs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rd = mulberry32(5);
    const specs = [
      { R: 13, h: 32, lean: -4 },
      { R: 18, h: 48, lean: 0 },
      { R: 13, h: 36, lean: 4 },
    ];
    let html = '';
    specs.forEach((c) => {
      html += flowerHTML({
        R: c.R,
        h: c.h,
        lean: c.lean,
        rd,
        far: false,
        fd: 0,
        pos: false,
        cls: ' done',
        sw: 1.8,
        swd: 5.2,
      });
    });
    ref.current.innerHTML = html;
  }, []);

  return <div className="sprigs" id="sprigs" ref={ref} aria-hidden="true" />;
}

export function Memories() {
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  const ledeRef = useReveal<HTMLParagraphElement>();

  return (
    <section className="memories" id="memorias" aria-labelledby="memTitle">
      <div className="gutter head">
        <Sprigs />
        <p className="eyebrow reveal" ref={eyebrowRef} id="memEyebrow">
          {siteConfig.memories.eyebrow}
        </p>
        <h2 className="h2 reveal" ref={titleRef} id="memTitle">
          {siteConfig.memories.title}
        </h2>
        <p className="lede reveal" ref={ledeRef} id="memLede">
          {siteConfig.memories.lede}
        </p>
      </div>
      <div className="gutter">
        <div className="album" id="album">
          {siteConfig.memories.photos.map((photo, i) => (
            <Polaroid key={i} photo={photo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
