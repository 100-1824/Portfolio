'use client';

import { useCallback } from 'react';

/** Writes cursor position into --mx / --my so `.spotlight` can follow it. */
export function useSpotlight() {
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);
}
