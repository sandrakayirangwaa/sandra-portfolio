'use client';
import { useEffect, useRef } from 'react';
import { strokes } from './Signature';
import { reducedMotion } from './motion';

type Pt = { x: number; y: number; w: number; at: number; stroke: number };

const WRITE = 3.6;
const HOLD = 3;
const FADE = 0.8;
const REST = 0.3;
const VIEW = { w: 281, h: 220 };

/** Walks each pen stroke. The pen slows on tight curves and the line swells and tapers like real ink. */
function samplePen(): Pt[] {
  const pts: Pt[] = [];
  let clock = 0;
  strokes.forEach((d, stroke) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    const len = path.getTotalLength();
    const n = Math.ceil(len / 1.3);
    const raw = Array.from({ length: n + 1 }, (_, i) => path.getPointAtLength((i / n) * len));
    raw.forEach((p, i) => {
      const a = raw[Math.max(0, i - 3)];
      const b = raw[Math.min(n, i + 3)];
      const turn = Math.abs(Math.atan2(b.y - p.y, b.x - p.x) - Math.atan2(p.y - a.y, p.x - a.x));
      const curve = Math.min(1, (turn > Math.PI ? Math.PI * 2 - turn : turn) * 1.2);
      clock += 1 + curve * 2.4;
      const edge = Math.min(1, Math.min(i, n - i) / 16);
      pts.push({ x: p.x, y: p.y, w: (0.9 + 1.5 * curve + 0.5 * Math.sin(i * 0.03 + stroke)) * (0.35 + 0.65 * edge), at: clock, stroke });
    });
    clock += 26;
  });
  const end = pts[pts.length - 1].at;
  pts.forEach((p) => { p.at = (p.at / end) * WRITE; });
  return pts;
}

export default function LiveSignature({ className, active = true, color = '#7ee0b0' }: { className?: string; active?: boolean; color?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const restart = useRef<() => void>(() => {});

  useEffect(() => {
    const wasOff = !activeRef.current;
    activeRef.current = active;
    if (active && wasOff) restart.current();
  }, [active]);

  useEffect(() => {
    const el = canvas.current;
    const g = el?.getContext('2d');
    if (!el || !g) return;
    const pts = samplePen();
    let w = 0, h = 0, dpr = 1, scale = 1, ox = 0, oy = 0, raf = 0, last = 0, cycle = 0;

    const size = () => {
      const b = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = b.width; h = b.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      scale = Math.min(w / (VIEW.w + 16), h / (VIEW.h + 16));
      ox = (w - VIEW.w * scale) / 2;
      oy = (h - VIEW.h * scale) / 2;
    };

    const draw = (n: number, alpha: number) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.globalAlpha = alpha;
      g.strokeStyle = color;
      g.lineCap = g.lineJoin = 'round';
      for (let i = 1; i < n; i++) {
        const a = pts[i - 1], b = pts[i];
        if (a.stroke !== b.stroke) continue;
        g.lineWidth = b.w * scale * 0.72;
        g.beginPath();
        g.moveTo(ox + a.x * scale, oy + a.y * scale);
        g.lineTo(ox + b.x * scale, oy + b.y * scale);
        g.stroke();
      }
    };

    restart.current = () => { cycle = 0; };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (!activeRef.current || document.hidden) return;
      cycle += dt;
      if (cycle < WRITE) {
        const n = pts.findIndex((p) => p.at > cycle);
        draw(n < 0 ? pts.length : n, 1);
      } else if (cycle < WRITE + HOLD) {
        draw(pts.length, 1);
      } else if (cycle < WRITE + HOLD + FADE) {
        draw(pts.length, 1 - (cycle - WRITE - HOLD) / FADE);
      } else {
        draw(0, 1);
        if (cycle > WRITE + HOLD + FADE + REST) cycle = 0;
      }
    };

    const onResize = () => { size(); if (reducedMotion()) draw(pts.length, 1); };
    size();
    window.addEventListener('resize', onResize);
    if (reducedMotion()) draw(pts.length, 1);
    else raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvas} className={className} role="img" aria-label="Sandra's signature being written" />;
}
