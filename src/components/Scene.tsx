import { useState, useEffect } from 'react';
import siteConfig from '../config/siteConfig';
import { SunflowerField, type FieldConfig } from './SunflowerField';

const sceneFieldConfig: FieldConfig = {
  seed: 11,
  spread: 1.1, // Nascem do centro para as pontas
  scale: 1.12,
  soil: '#15100a',
  mound: '#1b140c',
  // Flores mais altas e elevadas: preenchem o espaço inicial e sobem na tela
  height: (W, parentH) => {
    const H = parentH || (typeof window !== 'undefined' ? window.innerHeight : 800);
    const ratio = W < 420 ? 0.60 : W < 600 ? 0.62 : W < 1000 ? 0.67 : 0.70;
    const computed = Math.round(H * ratio);
    const minH = W < 420 ? 330 : W < 600 ? 370 : W < 1000 ? 480 : 560;
    const maxH = W < 420 ? 460 : W < 600 ? 520 : W < 1000 ? 700 : 820;
    return Math.max(minH, Math.min(maxH, computed));
  },
  near: (W) => (W < 420 ? 5 : W < 600 ? 7 : W < 1000 ? 10 : 13),
  far: (W) => (W < 420 ? 7 : W < 600 ? 9 : W < 1000 ? 12 : 15),
};

export function Scene() {
  const [isGo, setIsGo] = useState(false);

  useEffect(() => {
    // Pequeno intervalo (300ms) logo após abrir para ver o desabrochar das flores ao vivo
    const timer = setTimeout(() => {
      setIsGo(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className={`scene ${isGo ? 'go' : ''}`} id="scene">
      <div className="glow" aria-hidden="true" />
      <SunflowerField
        config={sceneFieldConfig}
        className="field"
        id="sceneField"
        isGo={isGo}
      />
      <div className="gutter">
        <h1 className="intro-line" id="introLine">
          {siteConfig.intro.line}
        </h1>
      </div>
      <p className="hint" id="hint">
        <span id="hintText">{siteConfig.intro.hint}</span>
        <i />
      </p>
    </header>
  );
}
