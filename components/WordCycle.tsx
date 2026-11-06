'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { profile } from '@/data/profile';
import { reducedMotion } from './motion';

/** "I build ..." with one quiet word change at a time. */
export default function WordCycle({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);
  const word = useRef<HTMLSpanElement>(null);
  const words = profile.builds;

  useEffect(() => {
    if (!active || reducedMotion()) return;
    const timer = setInterval(() => {
      if (!word.current) return;
      gsap.to(word.current, {
        yPercent: -110, duration: 0.42, ease: 'power3.in',
        onComplete: () => {
          setIndex((i) => (i + 1) % words.length);
          gsap.fromTo(word.current, { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: 'power3.out' });
        },
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [active, words.length]);

  return (
    <p className="word-cycle">
      <span className="sr-only">I build {words.join(', ')}.</span>
      <span aria-hidden="true">I build <span className="word-mask"><span ref={word}>{words[index]}</span></span></span>
    </p>
  );
}
