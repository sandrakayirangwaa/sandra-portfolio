'use client';
import { useEffect, useLayoutEffect } from 'react';

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
