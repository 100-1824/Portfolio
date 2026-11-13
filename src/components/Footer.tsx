'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { navLinks, profile } from '@/data';
import { Logo } from './Navbar';
import { scrollToTarget } from './SmoothScroll';
import { ArrowUpRight, GitHub, LinkedIn, Mail } from './ui/Icons';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const o = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-ink-2/50 pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
              Security engineer focused on intrusion detection, infrastructure hardening and secure software.
              {' '}
              {profile.location}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Index</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(l.href);
                    }}
                    className="text-sm text-fg-muted transition-colors hover:text-mint"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4">Elsewhere</p>
            <ul className="space-y-2">
              {[
                { l: 'GitHub', h: profile.github, I: GitHub },
                { l: 'LinkedIn', h: profile.linkedin, I: LinkedIn },
                { l: 'Email', h: `mailto:${profile.email}`, I: Mail },
              ].map(({ l, h, I }) => (
                <li key={l}>
                  <a
                    href={h}
                    target={h.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <I width={14} height={14} /> {l}
                    <ArrowUpRight width={12} height={12} className="opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line py-6 font-mono text-[11px] text-fg-dim sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <button onClick={() => scrollToTarget(0)} className="text-left transition-colors hover:text-mint sm:text-right">
            ↑ Back to top
          </button>
        </div>
      </div>

      <motion.p
        aria-hidden
        style={{ y, opacity: o }}
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[19vw] font-semibold leading-[0.8] tracking-tightest text-outline"
      >
        UMAIR AHMAD
      </motion.p>
    </footer>
  );
}
