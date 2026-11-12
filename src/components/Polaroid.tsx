import { useRef, useEffect, useCallback } from 'react';
import type { PhotoConfig } from '../config/siteConfig';

const PALETTES = [
  ['#f6d58a', '#e9906a', '#fff1c2', '#c9774f', '#a85a3d'],
  ['#c4dfae', '#6f9d63', '#f9f3c9', '#4f7d4c', '#3a6040'],
  ['#f4c3bb', '#bd7185', '#fff0e6', '#9c5368', '#7b3f52'],
  ['#b4d0e6', '#6a8fba', '#fdf6dc', '#4f7199', '#3b587a'],
  ['#f7e3a6', '#cfa748', '#fffbe6', '#a98332', '#876520'],
  ['#dcc3e6', '#9473b5', '#fff3d8', '#745396', '#5a3f78'],
];

function placeholder(i: number): string {
  const p = PALETTES[i % PALETTES.length];
  const cx = 300 + ((i % 3) - 1) * 90;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="${cx}" cy="230" r="86" fill="${p[2]}" opacity=".85"/><path d="M0 430Q150 360 300 420T600 400V600H0Z" fill="${p[3]}" opacity=".9"/><path d="M0 500Q200 440 380 490T600 470V600H0Z" fill="${p[4]}"/><text x="300" y="548" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#fff" opacity=".92" letter-spacing="4">FOTO ${String(i + 1).padStart(2, '0')}</text><text x="300" y="578" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#fff" opacity=".8" letter-spacing="2">imagem temporaria</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

interface PolaroidProps {
  photo: PhotoConfig;
  index: number;
}

export function Polaroid({ photo, index }: PolaroidProps) {
  const figRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const fallbackSrc = useCallback(() => placeholder(index), [index]);

  const handleError = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.onerror = null;
      imgRef.current.src = fallbackSrc();
    }
  }, [fallbackSrc]);

  // IntersectionObserver for polaroid reveal
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tapeAngle = photo.tape !== undefined ? photo.tape : index % 2 ? 3 : -3;

  return (
    <figure
      ref={figRef}
      className="polaroid"
      data-side={photo.side || 'center'}
      style={
        {
          '--tilt': `${photo.tilt || 0}deg`,
          '--lift': `${photo.lift || 0}px`,
          '--tape': `${tapeAngle}deg`,
        } as React.CSSProperties
      }
    >
      <span className="tape" aria-hidden="true" />
      <div className="frame">
        <img
          ref={imgRef}
          src={photo.src || fallbackSrc()}
          alt={photo.alt || photo.caption || ''}
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
      </div>
      <figcaption>
        <span className="cap">{photo.caption || ''}</span>
        <time>{photo.date || ''}</time>
      </figcaption>
    </figure>
  );
}
