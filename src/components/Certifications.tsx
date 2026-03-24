'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { certifications } from '@/data';

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="certifications" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <SectionLabel text="certifications.verify()" />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        Certifications
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid sm:grid-cols-2 gap-6 max-w-3xl"
      >
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 overflow-hidden cursor-default"
          >
            {/* Glow */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle, ${cert.color}, transparent 70%)` }}
            />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold font-heading flex-shrink-0"
                style={{ background: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}40` }}
              >
                {cert.icon}
              </div>

              <div>
                <h3 className="font-heading font-bold text-white text-base leading-snug mb-1">
                  {cert.title}
                </h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
                <p className="text-xs font-mono mt-1" style={{ color: cert.color }}>
                  {cert.year}
                </p>
              </div>
            </div>

            {/* Verified badge */}
            <div className="mt-4 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" style={{ color: cert.color }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-mono" style={{ color: cert.color }}>Verified</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
