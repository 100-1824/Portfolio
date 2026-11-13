'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { navLinks, profile } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { scrollToTarget } from './SmoothScroll';
import { ArrowUpRight } from './ui/Icons';
import { useBooted } from '@/lib/useBooted';

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 2 28 9v14l-12 7L4 23V9l12-7Z" stroke="#3DF5C4" strokeWidth="1.5" />
        <path d="M11 11v6a5 5 0 0 0 10 0v-6" stroke="#E8F0F7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="22.5" r="1.4" fill="#3DF5C4" />
      </svg>
      <span className="font-mono text-[13px] tracking-wide text-fg">
        umair<span className="text-mint">.sec</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const booted = useBooted();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });

  // Active-section tracking
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToTarget(href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={booted ? { y: hidden ? -110 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: booted && !scrolled ? 0.6 : 0 }}
        className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          className={cn(
            'mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full pl-4 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-out-expo sm:pl-5',
            scrolled || open
              ? 'glass shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]'
              : 'border border-transparent bg-transparent'
          )}
          aria-label="Primary"
        >
          <a href="#top" onClick={go('#top')} aria-label="Back to top" data-cursor="hover">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300',
                      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-mint/20 bg-mint/[0.08]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="mr-2 hidden items-center gap-2 font-mono text-[11px] text-fg-muted xl:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-mint" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              Available
            </span>
            <a
              href="#contact"
              onClick={go('#contact')}
              className="group hidden h-10 items-center gap-2 rounded-full bg-fg px-4 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-mint sm:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:rotate-45" width={15} height={15} />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            >
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-out-expo',
                  open ? 'rotate-45' : '-translate-y-[3px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-out-expo',
                  open ? '-rotate-45' : 'translate-y-[3px]'
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <div className="absolute inset-0 bg-grid opacity-30 mask-radial" />
            <nav className="container-x relative flex h-full flex-col justify-center gap-2 pt-16" aria-label="Mobile">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={go(l.href)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.05 }}
                  className="flex items-baseline gap-4 border-b border-line py-4 font-display text-4xl font-semibold tracking-tight text-fg"
                >
                  <span className="font-mono text-xs text-mint">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 font-mono text-xs text-fg-muted"
              >
                {profile.email}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
