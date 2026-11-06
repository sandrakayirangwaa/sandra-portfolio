'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '@/data/profile';
import LiveSignature from './LiveSignature';
import { reducedMotion, useIsoLayoutEffect } from './motion';

export default function Landing({ onLeaving, onEnter, onGo }: { onLeaving: () => void; onEnter: () => void; onGo: (route: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const left = useRef(false);

  const enter = (after?: () => void) => {
    if (left.current || !root.current) return;
    left.current = true;
    if (reducedMotion()) { onEnter(); after?.(); return; }
    onLeaving();
    gsap.to(root.current, { yPercent: -100, duration: 1.05, ease: 'expo.inOut', onComplete: () => { onEnter(); } });
    after?.();
  };

  useIsoLayoutEffect(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.landing-line > span', { yPercent: 112, duration: 1, ease: 'expo.out', stagger: 0.14, delay: 0.1 });
      gsap.from('.landing-meta', { autoAlpha: 0, duration: 0.6, delay: 0.7 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 8) enter(); };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !(e.target as HTMLElement).closest('a,button')) { e.preventDefault(); enter(); }
    };
    let y = 0;
    const onStart = (e: TouchEvent) => { y = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => { if (y - e.touches[0].clientY > 30) enter(); };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="landing" ref={root} aria-label="Introduction">
      <header className="landing-top landing-meta">
        <nav aria-label="Quick links">
          <button onClick={() => enter(() => onGo('work'))}>Work</button>
          <button onClick={() => enter(() => onGo('about'))}>About</button>
          <a href={profile.cv} target="_blank" rel="noreferrer">My CV</a>
        </nav>
        <button className="landing-enter" onClick={() => enter()}>Enter the site</button>
      </header>
      <LiveSignature className="landing-sig" />
      <h1 className="landing-title">
        <span className="landing-line"><span>{profile.fullName}</span></span>
        <span className="landing-line"><span>{profile.title}</span></span>
      </h1>
      <footer className="landing-foot landing-meta">
        <nav aria-label="Profiles">
          {profile.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}
        </nav>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
}
