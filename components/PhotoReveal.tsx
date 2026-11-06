'use client';
import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { reducedMotion } from './motion';

type Grain = { sx: number; sy: number; x: number; y: number; color: string; delay: number };
const SIZE = 240;
const GRAINS = 2600;
const MOVE = 1.15;
const SETTLE = 0.45;

function cover(g: CanvasRenderingContext2D, img: HTMLImageElement) {
  const s = Math.min(img.width, img.height);
  g.drawImage(img, (img.width - s) / 2, Math.max(0, (img.height - s) * 0.2), s, s, 0, 0, SIZE, SIZE);
}

function initial(g: CanvasRenderingContext2D) {
  g.fillStyle = '#0c3b2e';
  g.fillRect(0, 0, SIZE, SIZE);
  g.fillStyle = '#f7c8d4';
  g.font = '150px Anton, Impact, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('S', SIZE / 2, SIZE / 2 + 8);
}

/** A round picture that gathers from scattered grains each time the About page opens. */
export default function PhotoReveal({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ready = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = canvas.current;
    const g = el?.getContext('2d');
    if (!el || !g) return;
    el.width = el.height = SIZE;
    const art = document.createElement('canvas');
    art.width = art.height = SIZE;
    const a = art.getContext('2d', { willReadFrequently: true })!;
    let raf = 0;
    let grains: Grain[] = [];
    const R = SIZE / 2;

    const round = () => { g.save(); g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.clip(); };

    const prepare = () => {
      const px = a.getImageData(0, 0, SIZE, SIZE).data;
      grains = Array.from({ length: GRAINS }, () => {
        const an = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * R;
        const x = R + Math.cos(an) * r, y = R + Math.sin(an) * r;
        const i = (Math.floor(y) * SIZE + Math.floor(x)) * 4;
        const sa = Math.random() * Math.PI * 2, sr = Math.sqrt(Math.random()) * R;
        return { sx: R + Math.cos(sa) * sr, sy: R + Math.sin(sa) * sr, x, y, color: `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`, delay: Math.random() * 0.35 };
      });
    };

    const still = () => { g.clearRect(0, 0, SIZE, SIZE); round(); g.drawImage(art, 0, 0); g.restore(); };

    const play = () => {
      cancelAnimationFrame(raf);
      if (reducedMotion()) { still(); return; }
      const start = performance.now() + 250;
      const frame = (now: number) => {
        const t = (now - start) / 1000;
        g.clearRect(0, 0, SIZE, SIZE);
        round();
        for (const p of grains) {
          const k = Math.max(0, Math.min(1, (t - p.delay) / MOVE));
          const e = 1 - Math.pow(1 - k, 3);
          g.fillStyle = p.color;
          g.fillRect(p.sx + (p.x - p.sx) * e, p.sy + (p.y - p.sy) * e, 3, 3);
        }
        const fade = Math.max(0, Math.min(1, (t - MOVE) / SETTLE));
        if (fade > 0) { g.globalAlpha = fade; g.drawImage(art, 0, 0); g.globalAlpha = 1; }
        g.restore();
        if (fade < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const finish = () => { prepare(); ready.current = play; still(); };
    if (profile.photo) {
      const img = new Image();
      img.onload = () => { cover(a, img); finish(); };
      img.src = profile.photo.src;
    } else {
      document.fonts.load('150px Anton').finally(() => { initial(a); finish(); });
    }
    return () => { cancelAnimationFrame(raf); ready.current = null; };
  }, []);

  useEffect(() => {
    if (!active) return;
    let tries = 0;
    const wait = setInterval(() => {
      if (ready.current) { clearInterval(wait); ready.current(); } else if (++tries > 40) clearInterval(wait);
    }, 50);
    return () => clearInterval(wait);
  }, [active]);

  return <canvas ref={canvas} className="photo-reveal" role="img" aria-label={profile.photo?.alt ?? 'Sandra’s initial'} />;
}
