'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Project, Scenario } from '@/data/profile';
import { reducedMotion } from './motion';

/** The interactive path a signal takes through a project. Every route comes from data/profile.ts. */
export default function Flow({ flow }: { flow: Project['flow'] }) {
  const [tall, setTall] = useState(false);
  const [scenario, setScenario] = useState<Scenario>(flow.scenarios[0]);
  const [lit, setLit] = useState<string[]>(flow.scenarios[0].route);
  const [done, setDone] = useState(true);
  const packet = useRef<SVGCircleElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const on = () => setTall(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const pos = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    flow.steps.forEach((s) => { m[s.id] = tall ? { x: s.mx, y: s.my } : { x: s.x, y: s.y }; });
    return m;
  }, [flow, tall]);

  const run = (s: Scenario) => {
    tl.current?.kill();
    setScenario(s);
    if (reducedMotion() || !packet.current) { setLit(s.route); setDone(true); return; }
    setDone(false);
    setLit([s.route[0]]);
    const start = pos[s.route[0]];
    const line = gsap.timeline({ onComplete: () => setDone(true) });
    gsap.set(packet.current, { attr: { cx: start.x, cy: start.y }, autoAlpha: 1 });
    s.route.slice(1).forEach((id, i) => {
      line.to(packet.current, { attr: { cx: pos[id].x, cy: pos[id].y }, duration: 0.5, ease: 'power2.inOut' }, i * 0.56);
      line.call(() => setLit(s.route.slice(0, i + 2)), undefined, i * 0.56 + 0.46);
    });
    line.to(packet.current, { autoAlpha: 0, duration: 0.25 });
    tl.current = line;
  };

  useEffect(() => {
    if (reducedMotion()) return;
    const t = setTimeout(() => run(flow.scenarios[0]), 1250);
    return () => { clearTimeout(t); tl.current?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tall]);

  const [vw, vh] = tall ? flow.tall : flow.wide;
  const onRoute = (a: string, b: string) => {
    const r = scenario.route;
    return r.some((id, i) => (id === a && r[i + 1] === b)) && lit.includes(b);
  };
  const last = scenario.route[scenario.route.length - 1];

  return (
    <section className="flow" aria-label={flow.title}>
      <h3>{flow.title}</h3>
      {flow.scenarios.length > 1 && <p className="flow-prompt">Choose what enters the system.</p>}
      <div className="flow-buttons" role="group" aria-label="Scenarios">
        {flow.scenarios.map((s) => (
          <button key={s.id} className={s.id === scenario.id ? 'is-on' : ''} aria-pressed={s.id === scenario.id} onClick={() => run(s)}>{s.label}</button>
        ))}
      </div>
      <svg className="flow-map" viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={`${scenario.label}: ${scenario.end}`}>
        {flow.links.map(([a, b]) => (
          <line key={a + b} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} className={onRoute(a, b) ? 'is-lit' : ''} />
        ))}
        {flow.steps.map((s) => {
          const on = lit.includes(s.id);
          const end = done && s.id === last ? ` is-${scenario.outcome}` : '';
          return (
            <g key={s.id} className={`flow-node${on ? ' is-lit' : ''}${end}`} transform={`translate(${pos[s.id].x} ${pos[s.id].y})`}>
              <circle r={9} />
              {tall
                ? <text x={s.mx >= 200 ? -18 : 18} y={5} textAnchor={s.mx >= 200 ? 'end' : 'start'}>{s.label}</text>
                : s.side
                  ? <text x={18} y={5} textAnchor="start">{s.label}</text>
                  : <text y={s.below ? 32 : -20} textAnchor="middle">{s.label}</text>}
            </g>
          );
        })}
        <circle ref={packet} cx={0} cy={0} r={6} className="flow-packet" style={{ visibility: 'hidden' }} />
      </svg>
      <p className={`flow-result is-${scenario.outcome}`} aria-live="polite">{done ? scenario.end : ' '}</p>
      <p className="flow-note">{flow.note}</p>
    </section>
  );
}
