'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { profile, projects } from '@/data/profile';
import Landing from './Landing';
import { AboutPanel, ContactPanel, HomePanel, WorkPanel } from './Panels';
import { reducedMotion, useIsoLayoutEffect } from './motion';

const PANELS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;
type PanelId = (typeof PANELS)[number]['id'];

const CLOSED_RIGHT = 'inset(0% 0% 0% 100%)';
const CLOSED_LEFT = 'inset(0% 100% 0% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';

function parse(hash: string): { panel: PanelId; study: string | null; route: boolean } {
  const h = hash.replace(/^#/, '');
  if (projects.some((p) => p.slug === h)) return { panel: 'work', study: h, route: true };
  if (PANELS.some((p) => p.id === h)) return { panel: h as PanelId, study: null, route: true };
  return { panel: 'home', study: null, route: false };
}

export default function Portfolio() {
  const [panel, setPanel] = useState<PanelId>('home');
  const [shown, setShown] = useState<PanelId>('home');
  const [study, setStudy] = useState<string | null>(null);
  const [landing, setLanding] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const dockMark = useRef<HTMLSpanElement>(null);
  const wipe = useRef<gsap.core.Timeline | null>(null);
  const firstRead = useRef(true);
  const shownRef = useRef<PanelId>('home');
  const wantedRef = useRef<PanelId>('home');
  const index = PANELS.findIndex((p) => p.id === panel);

  const go = useCallback((route: string) => { window.location.hash = route; }, []);

  useIsoLayoutEffect(() => {
    const read = () => {
      const r = parse(window.location.hash);
      wantedRef.current = r.panel;
      setPanel(r.panel);
      setStudy(r.study);
      if (firstRead.current) { setShown(r.panel); shownRef.current = r.panel; firstRead.current = false; }
      if (r.route) setLanding(false);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  // A green curtain crosses the screen. The page changes while it covers everything.
  useEffect(() => {
    // Skip the first render's stale value when the page opens on a direct link.
    if (panel !== wantedRef.current || panel === shownRef.current) return;
    const swap = () => { shownRef.current = panel; setShown(panel); };
    if (reducedMotion() || !curtain.current) { swap(); return; }
    const forward = PANELS.findIndex((p) => p.id === shownRef.current) < index;
    wipe.current?.kill();
    wipe.current = gsap.timeline()
      .fromTo(curtain.current, { clipPath: forward ? CLOSED_RIGHT : CLOSED_LEFT }, { clipPath: OPEN, duration: 0.55, ease: 'expo.inOut' })
      .call(swap)
      .to(curtain.current, { clipPath: forward ? CLOSED_LEFT : CLOSED_RIGHT, duration: 0.55, ease: 'expo.inOut' }, '+=0.04');
  }, [panel, index]);

  const placeMark = useCallback((animate: boolean) => {
    const el = dockMark.current;
    if (!el) return;
    const x = el.parentElement!.clientWidth / PANELS.length * index;
    if (animate && !reducedMotion()) gsap.to(el, { x, duration: 0.7, ease: 'expo.inOut', overwrite: true });
    else gsap.set(el, { x });
  }, [index]);

  useIsoLayoutEffect(() => { placeMark(true); }, [placeMark]);
  useEffect(() => {
    const on = () => placeMark(false);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [placeMark]);

  useIsoLayoutEffect(() => {
    if (!stage.current) return;
    const current = stage.current.querySelector<HTMLElement>(`[data-panel="${shown}"]`);
    if (!current) return;
    current.scrollTop = 0;
    if (reducedMotion() || (landing && !leaving)) return;
    const tween = gsap.fromTo(current.querySelectorAll('[data-rise]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.055, delay: leaving && landing ? 0.5 : 0.08, clearProps: 'all' });
    return () => { tween.progress(1).kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, study, leaving]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (landing || (e.target as HTMLElement).closest('input,textarea')) return;
      if (e.key === 'ArrowRight' && index < PANELS.length - 1) go(PANELS[index + 1].id);
      if (e.key === 'ArrowLeft' && index > 0) go(PANELS[index - 1].id);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index, go, landing]);

  const studyProject = projects.find((p) => p.slug === study) ?? null;

  return (
    <main>
      {landing && <Landing onLeaving={() => setLeaving(true)} onEnter={() => setLanding(false)} onGo={go} />}
      <div className="stage" ref={stage}>
        {PANELS.map((p) => (
          <section key={p.id} className={`panel panel-${p.id}${p.id === shown ? ' is-active' : ''}`} data-panel={p.id} aria-label={p.label} inert={p.id !== shown || undefined}>
            <div className="panel-inner">
              {p.id === 'home' && <HomePanel active={shown === 'home'} onGo={go} />}
              {p.id === 'work' && <WorkPanel onGo={go} study={studyProject} />}
              {p.id === 'about' && <AboutPanel active={shown === 'about'} />}
              {p.id === 'contact' && <ContactPanel active={shown === 'contact'} />}
            </div>
          </section>
        ))}
      </div>
      <div className="curtain" ref={curtain} aria-hidden="true" />
      <nav className="dock" aria-label="Sections">
        <span className="dock-mark" ref={dockMark} aria-hidden="true" />
        {PANELS.map((p, i) => (
          <button key={p.id} onClick={() => go(p.id)} className={p.id === panel ? 'is-on' : ''} aria-current={p.id === panel ? 'page' : undefined}>
            <small>{i + 1}</small>{p.label}
          </button>
        ))}
      </nav>
      <span className="sr-only">{profile.fullName}</span>
    </main>
  );
}
