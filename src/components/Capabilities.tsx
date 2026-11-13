'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { skillCategories } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import SectionHeading from './ui/SectionHeading';
import { useSpotlight } from './ui/useSpotlight';

// Bento placement for 6 cards on a 6-col grid
const SPAN = [
  'md:col-span-4 md:row-span-2',
  'md:col-span-2 md:row-span-2',
  'md:col-span-3 lg:col-span-2',
  'md:col-span-3 lg:col-span-2',
  'md:col-span-3 lg:col-span-1',
  'md:col-span-3 lg:col-span-1',
];

export default function Capabilities() {
  const onMove = useSpotlight();

  return (
    <section id="capabilities" className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Capabilities"
          title={'An arsenal built for\nboth sides of the wire.'}
          intro="Offensive testing to find the weakness, machine learning to detect it at scale, and the infrastructure skills to ship the fix."
        />

        <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {skillCategories.map((cat, i) => {
            const big = i === 0;
            const small = i >= 4;
            return (
              <motion.article
                key={cat.id}
                onPointerMove={onMove}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: (i % 3) * 0.08 }}
                className={cn(
                  'spotlight group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2',
                  SPAN[i]
                )}
                style={{ ['--accent' as string]: cat.color }}
              >
                <div
                  className={cn(
                    'relative overflow-hidden',
                    big ? 'h-64 md:h-[340px]' : small ? 'h-32' : 'h-44'
                  )}
                >
                  <Image
                    src={cat.image}
                    alt={`${cat.title} illustration`}
                    fill
                    sizes={big ? '(max-width: 768px) 100vw, 860px' : '(max-width: 768px) 100vw, 430px'}
                    className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />
                </div>

                <div className="relative z-[3] flex flex-1 flex-col p-6 pt-2">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
                    <span className="font-mono text-[10px] tracking-[0.24em] text-fg-dim">
                      0{i + 1} / 0{skillCategories.length}
                    </span>
                  </div>
                  <h3 className={cn('font-display font-semibold tracking-tight text-fg', big ? 'text-3xl' : 'text-xl')}>
                    {cat.title}
                  </h3>
                  {!small && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{cat.blurb}</p>}
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {cat.skills.map((s) => (
                      <li
                        key={s}
                        className="chip transition-colors duration-300 group-hover:border-white/15 group-hover:text-fg"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
