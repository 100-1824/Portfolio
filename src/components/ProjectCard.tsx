'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { tiltIn } from '@/lib/animations';
import { Project } from '@/data';

// Tag → category color mapping
// Frontend: blue-cyan | Backend: purple-pink | DevOps: green | ML/Security: orange-red
const TAG_PALETTE: Record<string, { text: string; bg: string; border: string }> = {
  // Frontend
  JavaScript:   { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  TypeScript:   { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  'HTML/CSS':   { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  Bootstrap:    { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  React:        { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  'Next.js':    { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  '3D Viz':     { text: '#22d3ee', bg: '#22d3ee12', border: '#22d3ee35' },
  // Backend
  PHP:          { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  Laravel:      { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  Flask:        { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  Python:       { text: '#ec4899', bg: '#ec489912', border: '#ec489935' },
  MongoDB:      { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  MySQL:        { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  PRAW:         { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  'REST APIs':  { text: '#a855f7', bg: '#a855f712', border: '#a855f735' },
  // DevOps
  Docker:       { text: '#10b981', bg: '#10b98112', border: '#10b98135' },
  Kubernetes:   { text: '#10b981', bg: '#10b98112', border: '#10b98135' },
  Git:          { text: '#10b981', bg: '#10b98112', border: '#10b98135' },
  AWS:          { text: '#10b981', bg: '#10b98112', border: '#10b98135' },
  'CI/CD':      { text: '#10b981', bg: '#10b98112', border: '#10b98135' },
  // ML / Security
  'Deep Learning': { text: '#f97316', bg: '#f9731612', border: '#f9731635' },
  Suricata:     { text: '#ef4444', bg: '#ef444412', border: '#ef444435' },
  ML:           { text: '#f97316', bg: '#f9731612', border: '#f9731635' },
  CNN:          { text: '#f97316', bg: '#f9731612', border: '#f9731635' },
  LSTM:         { text: '#f97316', bg: '#f9731612', border: '#f9731635' },
  Gemini:       { text: '#f97316', bg: '#f9731612', border: '#f9731635' },
};

const DEFAULT_TAG = { text: '#94a3b8', bg: '#94a3b812', border: '#94a3b835' };

function getTagStyle(tag: string) {
  return TAG_PALETTE[tag] ?? DEFAULT_TAG;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
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
        {/* Gradient accent bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, ${project.accent}, ${project.accent}60, transparent)` }}
        />

        {/* Hover overlay with CTAs */}
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
            style={{
              color: project.accent,
              borderColor: `${project.accent}40`,
              background: `${project.accent}10`,
            }}
          >
            {project.category}
          </span>

          <h3 className="font-heading font-bold text-white text-lg mb-2 leading-snug">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.description}</p>

          {/* Tags with category colors */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => {
              const style = getTagStyle(tag);
              return (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.08 }}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono border transition-all duration-200"
                  style={{
                    color: style.text,
                    backgroundColor: style.bg,
                    borderColor: style.border,
                    boxShadow: hovered ? `0 0 8px ${style.text}25` : undefined,
                  }}
                >
                  {tag}
                </motion.span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
