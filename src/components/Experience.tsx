'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { drawLine } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { experience } from '@/data';

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="experience" ref={ref} className="py-24 px-4 max-w-5xl mx-auto">
      <SectionLabel text="experience.log()" />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        Experience & Education
      </motion.h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px overflow-hidden">
          <motion.div
            variants={drawLine}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="w-full h-full bg-gradient-to-b from-accent via-secondary to-purple-500"
          />
        </div>

        <div className="space-y-12">
          {experience.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot on timeline */}
                <div
                  className="relative z-10 flex-shrink-0 ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 mt-5"
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-bg shadow-lg"
                    style={{ background: item.accent, boxShadow: `0 0 12px ${item.accent}80` }}
                  />
                </div>

                {/* Card */}
                <div className={`ml-6 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-white/20 transition-colors"
                    style={{ borderLeftColor: item.accent, borderLeftWidth: 2 }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-white">{item.role}</h3>
                        <p className="text-sm font-medium" style={{ color: item.accent }}>
                          {item.org}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                      </div>
                      <span className="text-xs font-mono text-gray-500 whitespace-nowrap px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        {item.period}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.bullets.map((b, bi) => (
                        <li key={bi} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-accent/60 mt-0.5 flex-shrink-0">▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
