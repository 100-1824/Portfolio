'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import ProjectsGrid from './ProjectsGrid';
import { blurIn } from '@/lib/animations';
import { projects } from '@/data';

const FILTERS = ['All', 'Cybersecurity', 'AI-ML', 'Web Dev'] as const;
type Filter = typeof FILTERS[number];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [active, setActive] = useState<Filter>('All');

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <SectionLabel text="projects.filter()" />
      <motion.h2
        variants={blurIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-4xl sm:text-5xl font-bold font-heading mb-10"
      >
        Things I&apos;ve Built
      </motion.h2>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              active === f
                ? 'text-white border-primary-500/60 shadow-lg shadow-primary-500/20'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
            style={active === f ? {
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.2))',
              borderColor: 'rgba(168,85,247,0.5)',
            } : undefined}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid — delegates to ProjectsGrid + ProjectCard */}
      <ProjectsGrid projects={filtered} filterKey={active} />
    </section>
  );
}
