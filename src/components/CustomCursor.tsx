'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Two-part cursor: a precise dot + a lagging reticle that expands over
 * interactive targets. Only active on fine pointers without reduced motion.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100, scale = 1, target = 1;
    let raf = 0;
    let visible = false;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx;
        ry = my;
        dot.current?.style.setProperty('opacity', '1');
        ring.current?.style.setProperty('opacity', '1');
      }
      const el = (e.target as HTMLElement)?.closest?.('a, button, [data-cursor="hover"], input, textarea, label');
      target = el ? (el.matches('input, textarea') ? 0.6 : 2.1) : 1;
      ring.current?.classList.toggle('is-hover', !!el && !el.matches('input, textarea'));
    };
    const leave = () => {
      visible = false;
      dot.current?.style.setProperty('opacity', '0');
      ring.current?.style.setProperty('opacity', '0');
    };
    const down = () => (target *= 0.8);
    const up = () => (target /= 0.8);

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (target - scale) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-9 w-9 rounded-full border border-mint/60 opacity-0 transition-[opacity,background-color,border-color] duration-300 [&.is-hover]:border-mint [&.is-hover]:bg-mint/10"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] h-1.5 w-1.5 rounded-full bg-mint opacity-0 shadow-[0_0_12px_rgba(61,245,196,0.9)] transition-opacity duration-300"
      />
    </>
  );
}
