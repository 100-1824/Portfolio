'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { drawLine, blurIn, blurInStagger } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { experience } from '@/data';

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="experience" ref={ref} className="py-24 px-4 max-w-5xl mx-auto">
      <SectionLabel text="experience.log()" />
      <motion.h2
        variants={blurIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        Experience &amp; Education
      </motion.h2>

      <div className="relative">
        {/* Animated vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-px overflow-hidden">
          <motion.div
            variants={drawLine}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="w-full h-full"
            style={{ background: 'linear-gradient(180deg, #a855f7 0%, #ec4899 35%, #38bdf8 70%, #10b981 100%)' }}
          />
        </div>

        <motion.div
          variants={blurInStagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {experience.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                variants={blurIn}
                className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Pulsing dot on timeline */}
                <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 mt-5">
                  {/* Emanating rings */}
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 2.8, 1], opacity: [0.7, 0, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: ring * 0.7,
                        ease: 'easeOut',
                      }}
                      style={{ background: item.accent }}
                    />
                  ))}
                  {/* Core dot */}
                  <div
                    className="relative w-3.5 h-3.5 rounded-full border-2 border-bg"
                    style={{ background: item.accent, boxShadow: `0 0 16px ${item.accent}90` }}
                  />
                </div>

                {/* Card */}
                <div className={`ml-6 md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                  <ExperienceCard item={item} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceCard({ item }: { item: typeof experience[0] }) {
  const [hovered, setHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 overflow-hidden cursor-default shimmer-card"
      style={{
        borderLeftColor: item.accent,
        borderLeftWidth: 2,
        boxShadow: hovered ? `0 20px 50px ${item.accent}20, 0 0 0 1px ${item.accent}15` : undefined,
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Glare */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Type badge */}
      <span
        className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded-full border"
        style={{ color: item.accent, borderColor: `${item.accent}40`, background: `${item.accent}10` }}
      >
        {item.type === 'work' ? '⚡ work' : '🎓 edu'}
      </span>

      <div className="relative">
        <div className="mb-4">
          <h3 className="font-heading font-bold text-white text-base">{item.role}</h3>
          <p className="text-sm font-semibold mt-0.5" style={{ color: item.accent }}>{item.org}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-gray-500">{item.location}</p>
            <span className="text-xs font-mono text-gray-600 px-2 py-0.5 rounded-md bg-white/5 border border-white/8">
              {item.period}
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {item.bullets.map((b, bi) => (
            <motion.li
              key={bi}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: bi * 0.08 }}
              className="text-sm text-gray-400 flex items-start gap-2"
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: `${item.accent}80` }}>▸</span>
              {b}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
