'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { projects, type Project, type ProjectCategory } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import SectionHeading from './ui/SectionHeading';
import { ArrowUpRight, Close, GitHub } from './ui/Icons';
import { useSpotlight } from './ui/useSpotlight';

const FILTERS: ('All' | ProjectCategory)[] = ['All', 'Cybersecurity', 'AI-ML', 'Web Dev', 'Systems'];

function ProjectCard({ p, index, onOpen, wide }: { p: Project; index: number; onOpen: () => void; wide?: boolean }) {
  const reduce = useReducedMotion();
  const onMove = useSpotlight();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const imgX = useTransform(sry, (v) => v * -1.2);
  const imgY = useTransform(srx, (v) => v * 1.2);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.05 }}
      className={cn('[perspective:1400px]', wide && 'md:col-span-2')}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={(e) => {
          onMove(e);
          if (reduce || e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx.set(((e.clientY - r.top) / r.height - 0.5) * -6);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        data-cursor="hover"
        aria-label={`Open case file: ${p.title}`}
        className={cn(
          'spotlight group relative block w-full overflow-hidden rounded-2xl border border-line bg-ink-2 text-left',
          wide ? 'md:grid md:grid-cols-[1.35fr_1fr]' : ''
        )}
      >
        <div className={cn('relative overflow-hidden', wide ? 'aspect-[16/10] md:aspect-auto md:min-h-[440px]' : 'aspect-[16/10]')}>
          <motion.div style={{ x: imgX, y: imgY }} className="absolute -inset-4">
            <Image
              src={p.image}
              alt={`${p.title} — cover artwork`}
              fill
              sizes={wide ? '(max-width: 768px) 100vw, 760px' : '(max-width: 768px) 100vw, 640px'}
              className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.05]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2/90 via-transparent to-transparent md:from-ink-2/60" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="chip !border-white/10 !bg-ink/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
              {p.category}
            </span>
          </div>
          {p.metric && (
            <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-3xl font-semibold leading-none text-mint">{p.metric.value}</p>
              <p className="mt-1 font-mono text-[10px] tracking-widest text-fg-muted">{p.metric.label.toUpperCase()}</p>
            </div>
          )}
        </div>

        <div className={cn('relative z-[3] flex flex-col p-6 md:p-7', wide && 'md:p-10')}>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.24em] text-fg-dim">
              CASE / {String(index + 1).padStart(2, '0')}
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-mint/50 group-hover:bg-mint group-hover:text-ink">
              <ArrowUpRight width={16} height={16} />
            </span>
          </div>
          <h3 className={cn('font-display font-semibold leading-tight tracking-tight text-fg', wide ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl')}>
            {p.title}
          </h3>
          <p className={cn('mt-3 leading-relaxed text-fg-muted', wide ? 'text-base' : 'text-sm line-clamp-3')}>
            {p.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-1.5 md:mt-auto md:pt-6">
            {p.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.button>
    </motion.article>
  );
}

function CaseModal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-line bg-ink-2 sm:rounded-3xl"
        data-lenis-prevent
      >
        <div className="relative aspect-[16/8] w-full overflow-hidden">
          <Image src={p.image} alt="" fill sizes="(max-width: 900px) 100vw, 900px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close case file"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/70 text-fg backdrop-blur transition-colors hover:bg-mint hover:text-ink"
          >
            <Close />
          </button>
        </div>
        <div className="p-6 sm:p-10">
          <p className="eyebrow mb-3" style={{ color: p.accent }}>
            {p.category} · Case file
          </p>
          <h3 id="case-title" className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {p.title}
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{p.longDescription}</p>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-4">Key outcomes</p>
              <ul className="space-y-3">
                {p.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASE_OUT }}
                    className="flex gap-3 text-[15px] leading-relaxed text-fg"
                  >
                    <span className="mt-2.5 h-1 w-3 shrink-0 bg-mint" />
                    {h}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Stack</p>
              <ul className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              {(p.githubUrl || p.liveUrl) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="chip !py-2 !text-fg hover:!border-mint/50">
                      <GitHub width={14} height={14} /> Source
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="chip !py-2 !text-fg hover:!border-mint/50">
                      <ArrowUpRight width={14} height={14} /> Live
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const list = projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <section id="work" className="relative overflow-x-clip py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-mint/[0.04] blur-[140px]" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            className="!mb-0"
            index="03"
            label="Selected operations"
            title={'Case files from\nthe field.'}
          />
          <LayoutGroup id="filters">
            <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1 rounded-full border border-line bg-white/[0.02] p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'relative rounded-full px-4 py-2 font-mono text-[12px] transition-colors duration-300',
                    filter === f ? 'text-ink' : 'text-fg-muted hover:text-fg'
                  )}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-mint"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <motion.div layout className="mt-14 grid gap-5 md:grid-cols-2 md:mt-20">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} wide={i === 0 || (i === list.length - 1 && i % 2 === 1)} onOpen={() => setOpen(p)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{open && <CaseModal p={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}
