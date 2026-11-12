/**
 * Sunflower.ts — gera o HTML de um girassol SVG individual.
 * Transposta fiel da prévia: fórmulas artesanais, folhas escaláveis e miolo em Fibonacci.
 */

const f = (n: number) => +n.toFixed(1);
const f2 = (n: number) => Math.round(n * 100) / 100;

const LEAF = 'M0 0C10 -17 40 -20 62 -3C42 10 14 10 0 0Z';

function petalPath(R: number, rd: () => number, len: number): string {
  const a = R * 0.34;
  const L = R * len;
  const w = R * (0.27 + rd() * 0.06);
  const j = () => (rd() - 0.5) * R * 0.05;
  return (
    'M0 ' +
    f(-a) +
    'C' +
    f(w + j()) +
    ' ' +
    f(-a - (L - a) * 0.28) +
    ' ' +
    f(w * 0.75 + j()) +
    ' ' +
    f(-a - (L - a) * 0.8) +
    ' ' +
    f(j()) +
    ' ' +
    f(-L) +
    'C' +
    f(-w * 0.75 + j()) +
    ' ' +
    f(-a - (L - a) * 0.8) +
    ' ' +
    f(-w + j()) +
    ' ' +
    f(-a - (L - a) * 0.28) +
    ' 0 ' +
    f(-a) +
    'Z'
  );
}

function headHTML(R: number, rd: () => number, far: boolean, hd: number): string {
  const n = far ? 12 : 14;
  const step = 360 / n;
  const back = far ? 'url(#gfb)' : 'url(#gpb)';
  const front = far ? 'url(#gff)' : 'url(#gpf)';
  const stroke = far ? '#6b4a10' : '#a86d0d';

  let s = `<circle class="bud" r="${f(R * 0.34)}" fill="${far ? '#52713d' : '#79a64e'}" style="--bd:${f2(hd - 0.25)}s"/>`;

  // Pétalas da camada de trás
  for (let i = 0; i < n; i++) {
    const a = i * step + step / 2 + (rd() - 0.5) * 8;
    s += `<g transform="rotate(${f(a)})"><g class="pt" style="--pd:${f2(hd + i * 0.03)}s"><path d="${petalPath(R, rd, 1)}" fill="${back}" stroke="${stroke}" stroke-width="1" stroke-opacity=".75" vector-effect="non-scaling-stroke"/></g></g>`;
  }

  // Pétalas da camada da frente
  for (let i = 0; i < n; i++) {
    const a = i * step + (rd() - 0.5) * 8;
    s += `<g transform="rotate(${f(a)})"><g class="pt" style="--pd:${f2(hd + 0.18 + i * 0.03)}s"><path d="${petalPath(R, rd, 0.9)}" fill="${front}" stroke="${stroke}" stroke-width="1" stroke-opacity=".8" vector-effect="non-scaling-stroke"/><path d="M0 ${f(-R * 0.45)}L${f((rd() - 0.5) * R * 0.05)} ${f(-R * 0.78)}" fill="none" stroke="${stroke}" stroke-width="1" stroke-opacity=".45" vector-effect="non-scaling-stroke"/></g></g>`;
  }

  // Miolo com gradiente radial
  s += `<circle class="core" r="${f(R * 0.4)}" fill="url(#gcore)" stroke="#2f1b0a" stroke-width="1" vector-effect="non-scaling-stroke" style="--cd:${f2(hd + 0.55)}s"/>`;

  // 22 sementes em espiral de Fibonacci
  s += `<g class="seeds" style="--ed:${f2(hd + 0.85)}s">`;
  for (let k = 1; k <= 22; k++) {
    const rr = R * 0.37 * Math.sqrt(k / 22);
    const th = k * 2.39996;
    s += `<circle cx="${f(rr * Math.cos(th))}" cy="${f(rr * Math.sin(th))}" r="${f(R * (k % 3 ? 0.03 : 0.022))}" fill="${k % 3 ? '#2a1809' : '#9a6a2c'}"/>`;
  }
  s += '</g>';

  return s;
}

export interface FlowerOptions {
  R: number;
  h: number;
  lean: number;
  rd: () => number;
  far: boolean;
  fd: number;
  pos: boolean;
  left?: number;
  bottom?: number;
  cls?: string;
  sw?: number;
  swd?: number;
}

export function flowerHTML(o: FlowerOptions): string {
  const { R, h, lean, rd, far, fd = 0 } = o;
  const ls = R / 44;
  const reach = 64 * ls * 1.1;
  const bw = Math.ceil(2 * Math.max(R * 1.12, reach) + 2 * Math.abs(lean) + 16);
  const bh = Math.ceil(h + R * 1.15 + 10);
  // Duração fluida do caule: 1.4s base
  const dur = 1.4 + h / 360;
  const hd = fd + dur * 0.75;

  const stemCol = far ? '#4a6a39' : '#6c9a45';
  const leafFill = far ? '#52713d' : '#79a64e';
  const leafStroke = far ? '#2f4722' : '#3f5f27';

  const P = (t: number): [number, number] => {
    const u = 1 - t;
    return [
      3 * u * u * t * lean * 0.15 + 3 * u * t * t * lean * 0.95 + t * t * t * lean,
      -(3 * u * u * t * h * 0.35 + 3 * u * t * t * h * 0.7 + t * t * t * h),
    ];
  };

  const sideA = rd() < 0.5 ? -1 : 1;
  const leaves = [
    { t: 0.03, side: -1, sz: 0.4, dl: fd + 0.08 },
    { t: 0.03, side: 1, sz: 0.4, dl: fd + 0.16 },
    { t: 0.28 + rd() * 0.08, side: sideA, sz: 1.15, dl: undefined as number | undefined },
    { t: 0.5 + rd() * 0.08, side: -sideA, sz: 1, dl: undefined as number | undefined },
  ];

  const sw = o.sw ?? 1 + rd() * 1.2;
  const swd = o.swd ?? 4.5 + rd() * 3;

  let s = '';

  // Caule cúbico crescendo por stroke-dashoffset
  s += `<path class="stem" pathLength="1" d="M0 0C${f(lean * 0.15)} ${f(-h * 0.35)} ${f(lean * 0.95)} ${f(-h * 0.7)} ${f(lean)} ${f(-h)}" stroke="${stemCol}" stroke-width="${f(Math.max(2.2, R * 0.09))}" style="--sdel:${f2(fd)}s;--sdur:${f2(dur)}s"/>`;

  // Folhas surgindo conforme o caule passa
  leaves.forEach((l) => {
    const p = P(l.t);
    const dl = l.dl !== undefined ? l.dl : fd + dur * 0.75 * l.t + 0.15;
    const ang = -(26 + rd() * 16);
    s += `<g transform="translate(${f(p[0])} ${f(p[1])}) scale(${l.side} 1) rotate(${f(ang)}) scale(${f(ls * l.sz)})"><g class="leaf" style="--ld:${f2(dl)}s"><path d="${LEAF}" fill="${leafFill}" stroke="${leafStroke}" stroke-width="1" vector-effect="non-scaling-stroke"/><path d="M2 0Q30 -4 54 -3" fill="none" stroke="${leafStroke}" stroke-opacity=".6" stroke-width="1" vector-effect="non-scaling-stroke"/></g></g>`;
  });

  // Cabeça da flor
  const tilt = Math.atan2(lean, h) * 57.3 * 0.8 + (rd() - 0.5) * 5;
  s += `<g transform="translate(${f(lean)} ${f(-h)}) rotate(${f(tilt)})">${headHTML(R, rd, far, hd)}</g>`;

  const style =
    (o.pos
      ? `left:${f(o.left! - bw / 2)}px;bottom:${f(o.bottom!)}px;`
      : '') +
    `width:${bw}px;height:${bh}px;--sd:${f2(hd + 1.2)}s;--sw:${f(sw)}deg;--swd:${f(swd)}s`;

  return `<svg class="flower ${far ? 'far' : 'near'}${o.cls || ''}" style="${style}" viewBox="0 0 ${bw} ${bh}" aria-hidden="true"><g transform="translate(${f(bw / 2)} ${bh})">${s}</g></svg>`;
}

export function soilPath(
  W: number,
  top: number,
  H: number,
  rd: () => number,
  amp: number
): string {
  let d = 'M0 ' + H + 'L0 ' + top;
  for (let x = 0; x < W; x += 80) {
    d += 'Q' + (x + 40) + ' ' + f(top + (rd() - 0.5) * amp * 2) + ' ' + (x + 80) + ' ' + top;
  }
  return d + 'L' + (W + 80) + ' ' + H + 'Z';
}
