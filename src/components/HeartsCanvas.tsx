import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { mulberry32 } from '../lib/rng';

const HEART_PATH = new Path2D();
HEART_PATH.moveTo(0, 0.9);
HEART_PATH.bezierCurveTo(-1.15, 0.15, -0.85, -0.85, 0, -0.35);
HEART_PATH.bezierCurveTo(0.85, -0.85, 1.15, 0.15, 0, 0.9);

const COLORS = [
  '229,143,143', // Rosa suave
  '240,183,164', // Pêssego
  '255,214,150', // Creme dourado
  '233,185,73',  // Dourado
  '246,200,200', // Rosa claro
  '238,120,138', // Rosa vibrante
  '255,170,185', // Rosa amor
];

interface Heart {
  x: number;
  y: number;
  s: number;
  vy: number;
  amp: number;
  fr: number;
  ph: number;
  rot: number;
  rs: number;
  a: number;
  c: string;
  t: number;
}

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeHeart(W: number, H: number, initial: boolean): Heart {
  const s = rnd(7, 18) * (W < 600 ? 0.85 : 1);
  return {
    x: rnd(0, W),
    y: initial ? rnd(0, H) : rnd(-40, -10),
    s,
    vy: rnd(26, 75) * (0.6 + s / 28),
    amp: rnd(8, 34),
    fr: rnd(0.5, 1.4),
    ph: rnd(0, 6.28),
    rot: rnd(-0.5, 0.5),
    rs: rnd(-0.4, 0.4),
    a: rnd(0.35, 0.8),
    c: COLORS[Math.floor(rnd(0, COLORS.length))],
    t: 0,
  };
}

export function HeartsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let list: Heart[] = [];
    let target = 0;
    let last = 0;
    let running = false;
    let nextSpawn = 0;

    function drawOne(p: Heart, x: number) {
      ctx!.save();
      ctx!.translate(x, p.y);
      ctx!.rotate(p.rot * 0.5);
      ctx!.scale(p.s, p.s);
      ctx!.fillStyle = `rgba(${p.c},${p.a})`;
      ctx!.fill(HEART_PATH);
      ctx!.restore();
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, W, H);
      const r = mulberry32(7);
      for (let i = 0; i < 20; i++) {
        const p = makeHeart(W, H, true);
        p.x = r() * W;
        p.y = r() * H;
        drawOne(p, p.x);
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mais corações caindo para reforçar o clima romântico
      target = W < 600 ? 35 : 65;
      if (reduce) drawStatic();
    }

    function frame(ts: number) {
      if (!running) return;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;

      if (list.length < target && ts > nextSpawn) {
        list.push(makeHeart(W, H, false));
        nextSpawn = ts + (list.length < 15 ? 120 : 160);
      }

      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.t += dt;
        p.y += p.vy * dt;
        p.rot += p.rs * dt;

        if (p.y > H + 30) {
          list[i] = makeHeart(W, H, false);
        }

        drawOne(list[i], list[i].x + Math.sin(list[i].t * list[i].fr + list[i].ph) * list[i].amp);
      }

      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      nextSpawn = last + 50;

      // Já inicia com corações distribuídos na tela para não ficar vazio
      const initialCount = W < 600 ? 18 : 32;
      for (let i = 0; i < initialCount; i++) {
        list.push(makeHeart(W, H, true));
      }

      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);

    if (!reduce) {
      start();
      const onVisibility = () => {
        if (document.hidden) {
          running = false;
        } else {
          start();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        running = false;
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      id="hearts"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
