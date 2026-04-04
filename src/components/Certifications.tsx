'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { blurInStagger, blurIn } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { certifications } from '@/data';

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="certifications" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <SectionLabel text="certifications.verify()" />
      <motion.h2
        variants={blurIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        Certifications
      </motion.h2>

      <motion.div
        variants={blurInStagger}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid sm:grid-cols-2 gap-6 max-w-3xl"
      >
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </motion.div>
    </section>
  );
}

function CertCard({ cert }: { cert: typeof certifications[0] }) {
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
      variants={blurIn}
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 overflow-hidden cursor-default shimmer-card holo-border"
      style={{
        boxShadow: hovered ? `0 20px 50px ${cert.color}20, 0 0 0 1px ${cert.color}20` : undefined,
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Holographic glare */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.1) 0%, transparent 55%)`,
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${cert.color}50, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: hovered ? 0.7 : 0.3,
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Animated icon badge */}
        <motion.div
          animate={hovered ? { rotate: [0, -6, 6, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold font-heading flex-shrink-0"
          style={{ background: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}40`, boxShadow: hovered ? `0 0 20px ${cert.color}40` : undefined }}
        >
          {cert.icon}
        </motion.div>

        <div>
          <h3 className="font-heading font-bold text-white text-base leading-snug mb-1">{cert.title}</h3>
          <p className="text-sm text-gray-400">{cert.issuer}</p>
          <p className="text-xs font-mono mt-1" style={{ color: cert.color }}>{cert.year}</p>
        </div>
      </div>

      {/* Verified badge */}
      <div className="mt-4 flex items-center gap-2">
        <motion.div
          animate={hovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <svg className="w-3.5 h-3.5" style={{ color: cert.color }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <span className="text-xs font-mono" style={{ color: cert.color }}>Verified</span>
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-gray-600 hover:text-white transition-colors"
          >
            View ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}
