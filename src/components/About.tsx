'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { profile, stats } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import SectionHeading from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import HudCorners from './ui/HudCorners';
import Counter from './ui/Counter';
import { Briefcase, Cap, MapPin, Shield } from './ui/Icons';

const FACTS = [
  { icon: Briefcase, k: 'Current', v: 'Web Hosting Engineer @ COMSATS Internet Services' },
  { icon: Cap, k: 'Education', v: 'BS Software Engineering — COMSATS Wah' },
  { icon: Shield, k: 'Focus', v: 'Network defence · AI-driven detection · Secure SDLC' },
  { icon: MapPin, k: 'Based in', v: profile.location },
];

function Portrait() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const rad = useSpring(0, { stiffness: 120, damping: 20 });
  const smx = useSpring(mx, { stiffness: 200, damping: 30 });
  const smy = useSpring(my, { stiffness: 200, damping: 30 });
  const mask = useMotionTemplate`radial-gradient(circle ${rad}px at ${smx}% ${smy}%, #000 60%, transparent 100%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <div
      ref={ref}
      data-cursor="hover"
      onPointerEnter={() => rad.set(170)}
      onPointerLeave={() => rad.set(0)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-ink-3"
    >
      <motion.div style={{ y: imgY }} className="absolute -inset-[7%]">
        <Image
          src="/art/profile-formal-mono.webp"
          alt={`Portrait of ${profile.name}`}
          fill
          sizes="(max-width: 1024px) 90vw, 480px"
          className="object-cover object-[50%_35%] opacity-90 contrast-[1.05]"
        />
        <motion.div style={{ WebkitMaskImage: mask, maskImage: mask }} className="absolute inset-0">
          <Image src="/art/profile-formal.webp" alt="" fill sizes="(max-width: 1024px) 90vw, 480px" className="object-cover object-[50%_35%]" />
        </motion.div>
      </motion.div>

      {/* tint + scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-mint/5 mix-blend-normal" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 animate-scan bg-gradient-to-b from-transparent via-mint/[0.07] to-transparent" />

      <div className="absolute inset-4">
        <HudCorners size={18} />
      </div>
      <div className="absolute left-7 top-7 font-mono text-[10px] leading-relaxed tracking-widest text-fg/70">
        <p>OPERATOR // UA-1824</p>
        <p className="text-mint">CLEARANCE: ACTIVE</p>
      </div>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-fg">{profile.name}</p>
          <p className="font-mono text-[11px] text-fg-muted">{profile.title}</p>
        </div>
        <p className="hidden font-mono text-[10px] text-fg-dim sm:block">hover · decrypt</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Portrait />
        </Reveal>

        <div>
          <SectionHeading
            index="01"
            label="Operator profile"
            title={'Engineer by training,\ndefender by instinct.'}
          />

          <div className="space-y-6 text-lg leading-relaxed text-fg-muted">
            <Reveal>
              <p>
                I&apos;m <span className="text-fg">Umair Ahmad</span>, a security-focused software engineer from
                Islamabad. My work sits where offensive testing, machine learning and infrastructure meet —
                I find the cracks, then build the systems that close them.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                For my final-year project I built <span className="text-fg">DIDS</span>, a distributed
                intrusion detection system that pairs Suricata with CNN/LSTM models and a Double DQN agent to
                hit <span className="text-mint">99% detection accuracy</span>. Today I harden and operate
                production hosting environments at COMSATS Internet Services.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {FACTS.map(({ icon: Icon, k, v }, i) => (
              <Reveal key={k} delay={i * 0.06} className="bg-ink-2 p-6">
                <Icon className="mb-4 text-mint" width={20} height={20} />
                <p className="eyebrow mb-1.5">{k}</p>
                <p className="text-[15px] leading-snug text-fg">{v}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_OUT, delay: i * 0.08 }}
                className="border-l border-line pl-5"
              >
                <p className="font-display text-5xl font-semibold tracking-tightest text-fg">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[13px] text-fg-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
