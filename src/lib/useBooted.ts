'use client';

import { useEffect, useState } from 'react';

/** True once the preloader has finished (or was skipped). */
export function useBooted() {
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const w = window as Window & { __uaBooted?: boolean };
    if (w.__uaBooted) {
      setBooted(true);
      return;
    }
    const on = () => setBooted(true);
    window.addEventListener('ua:booted', on);
    // safety net — never leave the hero hidden
    const t = setTimeout(on, 3500);
    return () => {
      window.removeEventListener('ua:booted', on);
      clearTimeout(t);
    };
  }, []);
  return booted;
}
