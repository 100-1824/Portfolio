'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';

const LINES = [
  'establishing secure session',
  'verifying TLS 1.3 handshake',
  'loading operator profile',
  'arming intrusion sensors',
];

const KEY = 'ua-boot-seen';

/** Short terminal boot sequence shown once per browser session. */
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) {
      setShow(false);
      return;
    }
    document.documentElement.style.overflow = 'hidden';

    const total = 1700;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      setStep(Math.min(LINES.length, Math.floor(eased * (LINES.length + 0.6))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {}
        }, 280);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = '';
      (window as Window & { __uaBooted?: boolean }).__uaBooted = true;
      window.dispatchEvent(new Event('ua:booted'));
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[300] flex items-end bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1, ease: EASE_IN_OUT }}
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-radial" />
          <div className="container-x relative pb-12 md:pb-16">
            <div className="mb-10 space-y-2 font-mono text-[13px] text-fg-muted">
              {LINES.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={i < step ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="flex items-center gap-3"
                >
                  <span className="text-mint">&gt;</span>
                  <span>{l}</span>
                  <span className="mx-2 hidden h-px flex-1 border-b border-dashed border-line sm:block sm:max-w-[200px]" />
                  <span className="text-mint">[ ok ]</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-2">umair.sec / boot</p>
                <p className="font-display text-[clamp(3.5rem,14vw,11rem)] font-semibold leading-none tracking-tightest text-fg tabular-nums">
                  {pct}
                  <span className="text-mint">%</span>
                </p>
              </div>
            </div>
            <div className="mt-6 h-px w-full bg-line">
              <div
                className="h-px bg-mint shadow-[0_0_14px_rgba(61,245,196,0.9)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
