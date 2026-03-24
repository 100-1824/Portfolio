'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { stats } from '@/data';

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) { setCount(target); return; }
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target, prefersReduced]);

  return (
    <span ref={ref} className="text-4xl font-bold font-heading gradient-text">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <SectionLabel text="about.me" />
      <motion.h2
        variants={staggerItem}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        Who I Am
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Photo / Visual side */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          <div className="relative w-full max-w-sm mx-auto lg:mx-0">
            {/* Decorative rings */}
            <div className="absolute -inset-4 rounded-3xl border border-accent/20 rotate-3" />
            <div className="absolute -inset-2 rounded-3xl border border-secondary/20 -rotate-2" />

            {/* Profile photo */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 via-bg to-secondary/20 border border-white/10 aspect-square">
              <img
                src="/images/profile.jpeg"
                alt="Umair Ahmad"
                className="w-full h-full object-cover"
              />
              {/* Code decoration */}
              <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-accent/40 leading-relaxed bg-bg/60 backdrop-blur-sm rounded-lg p-2">
                <p>$ whoami</p>
                <p className="text-secondary/60">→ umair_ahmad</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio side */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="space-y-5 text-gray-300 leading-relaxed mb-10">
            <p>
              I&apos;m a <span className="text-white font-medium">BS Software Engineering</span> graduate from{' '}
              <span className="text-accent font-medium">COMSATS University Islamabad &mdash; Wah Campus</span>.
              Currently working as a <span className="text-secondary font-medium">Web Hosting Engineer</span> at{' '}
              COMSATS Internet Services, Technology Park, Islamabad.
            </p>
            <p>
              My work sits at the intersection of <span className="text-secondary font-medium">Cybersecurity</span>,{' '}
              <span className="text-accent font-medium">AI/ML</span>, and{' '}
              <span className="text-purple-400 font-medium">Full-Stack Development</span>. I&apos;ve built a cloud-based
              distributed IDS with 99% detection accuracy, interned at NASTP on defense ML systems, and conducted
              vulnerability assessments for enterprise clients.
            </p>
            <p>
              I thrive on hard problems &mdash; from crafting low-level packet captures to training deep learning pipelines
              to shipping polished web products. I bring both the hacker mindset and the engineer discipline.
            </p>
          </div>

          {/* Education badge */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-10">
            <div className="p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">BS Software Engineering</p>
              <p className="text-gray-400 text-xs">COMSATS University Islamabad — Wah Campus</p>
              <p className="text-accent/70 text-xs font-mono">2022 – 2026 &nbsp;·&nbsp; Graduated</p>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={staggerItem}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
                <p className="text-gray-400 text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
