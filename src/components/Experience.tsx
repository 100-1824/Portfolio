'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experience } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import SectionHeading from './ui/SectionHeading';
import { Briefcase, Cap } from './ui/Icons';
import { useSpotlight } from './ui/useSpotlight';

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const onMove = useSpotlight();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <section id="experience" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          index="04"
          label="Service record"
          title={'Where I’ve been\non duty.'}
          intro="Hands-on roles across vulnerability assessment, applied machine learning and production infrastructure."
        />

        <ol ref={ref} className="relative ml-3 md:ml-[calc(220px+2.5rem)]">
          {/* rail */}
          <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-line" aria-hidden />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-mint via-mint to-signal-blue shadow-[0_0_10px_rgba(61,245,196,0.8)]"
          />

          {experience.map((e, i) => {
            const Icon = e.type === 'education' ? Cap : Briefcase;
            return (
              <li key={e.id} className="relative pb-14 pl-10 last:pb-0 md:pl-14">
                {/* node */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 1, margin: '0px 0px -30% 0px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="absolute -left-[7px] top-2 grid h-[15px] w-[15px] place-items-center rounded-full border border-mint bg-ink"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-mint" />
                  {e.current && <span className="absolute inset-0 animate-ping2 rounded-full border border-mint" />}
                </motion.span>

                {/* period — left column on desktop */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, ease: EASE_OUT }}
                  className="mb-3 font-mono text-[12px] tracking-wider text-fg-muted md:absolute md:-left-[calc(220px+2.5rem)] md:top-1 md:mb-0 md:w-[220px] md:text-right"
                >
                  {e.period}
                  {e.current && (
                    <span className="ml-2 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] text-mint">NOW</span>
                  )}
                </motion.p>

                <motion.div
                  onPointerMove={onMove}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.05 }}
                  className="spotlight group rounded-2xl border border-line bg-ink-2 p-6 md:p-8"
                >
                  <div className="relative z-[3] flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">{e.role}</h3>
                      <p className="mt-1 text-[15px] text-fg-muted">
                        {e.org} <span className="text-fg-dim">· {e.location}</span>
                      </p>
                    </div>
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line"
                      style={{ color: e.accent, background: `${e.accent}12` }}
                    >
                      <Icon width={20} height={20} />
                    </span>
                  </div>
                  <ul className="relative z-[3] mt-6 space-y-2.5">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
                        <span className="mt-[11px] h-px w-3 shrink-0" style={{ background: e.accent }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <span className="sr-only">Entry {i + 1}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
