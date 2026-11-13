'use client';

import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { certifications, type Certification } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import SectionHeading from './ui/SectionHeading';
import { ArrowUpRight, Check } from './ui/Icons';

function CertCard({ c, i }: { c: Certification; i: number }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(255,255,255,0.10), transparent 40%), linear-gradient(115deg, transparent 30%, ${c.color}22 45%, transparent 60%)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: i * 0.1 }}
      className="[perspective:1200px]"
    >
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          gx.set(px * 100);
          gy.set(py * 100);
          if (reduce || e.pointerType !== 'mouse') return;
          ry.set((px - 0.5) * 12);
          rx.set((py - 0.5) * -12);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative h-full overflow-hidden rounded-3xl border border-line bg-ink-2"
        data-cursor="hover"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={c.image}
            alt={`${c.title} credential badge`}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
          />
          <motion.div style={{ background: sheen }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-2 to-transparent" />
        </div>
        <div className="relative p-6 pt-2 md:p-7 md:pt-2" style={{ transform: 'translateZ(30px)' }}>
          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-widest" style={{ color: c.color }}>
            <Check width={14} height={14} /> VERIFIED CREDENTIAL
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-fg md:text-2xl">{c.title}</h3>
          <p className="mt-1 text-sm text-fg-muted">
            {c.issuer}
            {c.year && <span className="text-fg-dim"> · {c.year}</span>}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{c.focus}</p>
          {c.verifyUrl && (
            <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="chip mt-5 !text-fg hover:!border-mint/50">
              Verify <ArrowUpRight width={12} height={12} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function Certifications() {
  return (
    <section id="credentials" className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 mask-radial" />
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Credentials"
          title={'Verified, not\njust claimed.'}
          intro="Industry certifications covering security fundamentals, operations and application security."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <CertCard key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
