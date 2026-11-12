import { useEffect, useRef, useCallback } from 'react';
import { mulberry32 } from '../lib/rng';
import { flowerHTML, soilPath } from './Sunflower';
import { useReducedMotion } from '../hooks/useReducedMotion';

const f = (n: number) => +n.toFixed(1);
const f2 = (n: number) => Math.round(n * 100) / 100;

export interface FieldConfig {
  seed: number;
  spread?: number;
  scale?: number;
  soil: string;
  mound: string;
  height: (W: number, parentH: number) => number;
  near: (W: number) => number;
  far: (W: number) => number;
}

export function renderSunflowerField(
  host: HTMLDivElement,
  opts: FieldConfig,
  isFinished: boolean,
  isStarted: boolean,
  reduce: boolean
): number {
  const W = host.clientWidth || window.innerWidth;
  if (!W) return 0;

  const vsmall = W < 420;
  const small = W < 600;
  const mid = W < 1000;
  const parentH =
    host.parentElement && host.parentElement.clientHeight > 100
      ? host.parentElement.clientHeight
      : window.innerHeight;
  const Hf = opts.height(W, parentH);
  host.style.height = Hf + 'px';

  const rd = mulberry32(opts.seed);
  // Tamanho proporcional e harmonioso para telas pequenas e grandes
  const base = (vsmall ? 23 : small ? 26 : mid ? 32 : 38) * (opts.scale ?? 1);

  const farList: string[] = [];
  const nearList: string[] = [];

  function add(
    list: string[],
    x: number,
    R: number,
    gy: number,
    lo: number,
    hi: number,
    isFar: boolean
  ) {
    const avail = Math.max(40, gy - R * 1.15 - 10);
    const h = avail * (lo + rd() * (hi - lo));
    const lean = (rd() - 0.5) * R * 1.1;
    // Flores nascem rapidamente a partir do centro
    const fd =
      (Math.abs(x - W / 2) / (W / 2)) * (opts.spread ?? 1.2) +
      rd() * 0.4 +
      (isFar ? 0.2 : 0);
    list.push(
      flowerHTML({
        R,
        h,
        lean,
        rd,
        far: isFar,
        fd,
        pos: true,
        left: x,
        bottom: Hf - gy,
      })
    );
  }

  const nF = opts.far(W);
  const nN = opts.near(W);

  // Fileira de trás (mais alta na terra)
  for (let i = 0; i < nF; i++) {
    add(
      farList,
      (i + 0.5 + (rd() - 0.5) * 0.7) * (W / nF),
      base * 0.65 * (0.85 + rd() * 0.35),
      Hf - (vsmall ? 38 : small ? 45 : 55),
      0.48,
      0.88,
      true
    );
  }

  // Fileira da frente (viva, solo da frente)
  for (let i = 0; i < nN; i++) {
    add(
      nearList,
      (i + 0.5 + (rd() - 0.5) * 0.6) * (W / nN),
      base * (0.9 + rd() * 0.3),
      Hf - (vsmall ? 26 : small ? 32 : 40),
      0.55,
      0.98,
      false
    );
  }

  // Monte de terra intermediário
  const backSvg = `<svg class="ground g-back" viewBox="0 0 ${W} 70" preserveAspectRatio="none" aria-hidden="true"><path d="${soilPath(W, 10, 70, rd, 5)}" fill="${opts.mound}"/></svg>`;

  // Lâminas de grama sutis
  const nb = Math.round(W / 14);
  let blades = '';
  for (let i = 0; i < nb; i++) {
    const bx = rd() * W;
    const bh = 8 + rd() * 16;
    const bl = (rd() - 0.5) * 8;
    blades += `<path class="blade" d="M${f(bx)} 32Q${f(bx + bl * 0.3)} ${f(32 - bh * 0.6)} ${f(bx + bl)} ${f(32 - bh)}" fill="none" stroke="${rd() < 0.5 ? '#4f7a33' : '#3d6027'}" stroke-width="${f(1.4 + rd() * 1.0)}" stroke-linecap="round" style="--gd:${f2(0.2 + rd() * 2.5)}s"/>`;
  }

  // Terra da frente com borda ondulada
  const frontSvg = `<svg class="ground g-front" viewBox="0 0 ${W} 75" preserveAspectRatio="none" aria-hidden="true"><path d="${soilPath(W, 28, 75, rd, 4)}" fill="${opts.soil}"/>${blades}</svg>`;

  host.innerHTML = farList.join('') + backSvg + nearList.join('') + frontSvg;
  host.classList.remove('done', 'go');

  if (reduce || isFinished) {
    host.classList.add('done', 'go');
  } else if (isStarted) {
    host.classList.add('go');
  }

  return W;
}

interface SunflowerFieldProps {
  config: FieldConfig;
  isGo?: boolean;
  observeStart?: boolean;
  className?: string;
  id?: string;
}

/**
 * Monta o campo de girassóis dentro de um div com alta performance.
 */
export function SunflowerField({
  config,
  isGo = false,
  observeStart = false,
  className = '',
  id,
}: SunflowerFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const finishedRef = useRef(false);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWRef = useRef(0);
  const reduce = useReducedMotion();

  const mount = useCallback(() => {
    if (!hostRef.current) return;
    lastWRef.current = renderSunflowerField(
      hostRef.current,
      config,
      finishedRef.current,
      startedRef.current,
      reduce
    );
  }, [config, reduce]);

  const startField = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (hostRef.current) {
      hostRef.current.classList.add('go');
    }

    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(() => {
      finishedRef.current = true;
      if (hostRef.current) {
        hostRef.current.classList.add('done');
      }
    }, 5500);
  }, []);

  useEffect(() => {
    mount();

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (!hostRef.current) return;
        const w = hostRef.current.clientWidth || window.innerWidth;
        if (Math.abs(w - lastWRef.current) > 40) {
          mount();
        }
      }, 250);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(rt);
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, [mount]);

  useEffect(() => {
    if (reduce || isGo) {
      startField();
    }
  }, [isGo, reduce, startField]);

  useEffect(() => {
    if (reduce || !observeStart) return;

    const el = hostRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      startField();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            startField();
            io.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [observeStart, reduce, startField]);

  return (
    <div
      ref={hostRef}
      className={`field ${className}`}
      id={id}
      aria-hidden="true"
    />
  );
}
