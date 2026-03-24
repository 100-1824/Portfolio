'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { staggerContainer, tiltIn } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { projects, Project } from '@/data';

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
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
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
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              active === f
                ? 'bg-accent text-bg border-accent shadow-lg shadow-accent/25'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        key={active}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setHovered(false);
  };

  return (
    <motion.div
      variants={tiltIn}
      transition={{ delay: index * 0.1 }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: hovered ? `0 25px 60px ${project.accent}20` : undefined,
          borderColor: hovered ? `${project.accent}40` : undefined,
          transition: 'box-shadow 0.3s, border-color 0.3s',
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden cursor-default h-full"
      >
        {/* Gradient header */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${project.accent}, ${project.accent}60)` }}
        />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 flex items-end p-6"
        >
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
              >
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all"
                style={{ background: project.accent, color: '#0F172A' }}
              >
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        <div className="p-6">
          {/* Category badge */}
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border mb-3 inline-block"
            style={{ color: project.accent, borderColor: `${project.accent}40`, background: `${project.accent}10` }}
          >
            {project.category}
          </span>

          <h3 className="font-heading font-bold text-white text-lg mb-2 leading-snug">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-2.5 py-0.5 rounded-md text-xs font-mono border border-white/10 text-gray-400"
                style={hovered ? { color: project.accent, borderColor: `${project.accent}40`, background: `${project.accent}08` } : undefined}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
