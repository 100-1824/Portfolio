'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { tiltIn } from '@/lib/animations';
import { Project } from '@/data';

// Tag → category color mapping
const TAG_PALETTE: Record<string, { text: string; bg: string; border: string }> = {
  JavaScript:      { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  TypeScript:      { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  'HTML/CSS':      { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  Bootstrap:       { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  React:           { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  'Next.js':       { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  '3D Viz':        { text: '#22d3ee', bg: '#22d3ee10', border: '#22d3ee30' },
  PHP:             { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  Laravel:         { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  Flask:           { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  Python:          { text: '#ec4899', bg: '#ec489910', border: '#ec489930' },
  MongoDB:         { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  MySQL:           { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  PRAW:            { text: '#a855f7', bg: '#a855f710', border: '#a855f730' },
  Docker:          { text: '#10b981', bg: '#10b98110', border: '#10b98130' },
  Kubernetes:      { text: '#10b981', bg: '#10b98110', border: '#10b98130' },
  Git:             { text: '#10b981', bg: '#10b98110', border: '#10b98130' },
  AWS:             { text: '#10b981', bg: '#10b98110', border: '#10b98130' },
  'CI/CD':         { text: '#10b981', bg: '#10b98110', border: '#10b98130' },
  'Deep Learning': { text: '#f97316', bg: '#f9731610', border: '#f9731630' },
  Suricata:        { text: '#ef4444', bg: '#ef444410', border: '#ef444430' },
  ML:              { text: '#f97316', bg: '#f9731610', border: '#f9731630' },
  CNN:             { text: '#f97316', bg: '#f9731610', border: '#f9731630' },
  LSTM:            { text: '#f97316', bg: '#f9731610', border: '#f9731630' },
  Gemini:          { text: '#f97316', bg: '#f9731610', border: '#f9731630' },
};
const DEFAULT_TAG = { text: '#94a3b8', bg: '#94a3b810', border: '#94a3b830' };
const getTagStyle = (tag: string) => TAG_PALETTE[tag] ?? DEFAULT_TAG;

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // 3D tilt — enhanced
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [12, -12]);
  const rotateY = useTransform(mouseX, [0, 1], [-12, 12]);
  const sRotX = useSpring(rotateX, { stiffness: 250, damping: 25 });
  const sRotY = useSpring(rotateY, { stiffness: 250, damping: 25 });

  // Holographic glare position
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mouseX.set(nx);
    mouseY.set(ny);
    setGlare({ x: nx * 100, y: ny * 100 });
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
      style={{ perspective: 900 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden cursor-default h-full shimmer-card holo-border"
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformStyle: 'preserve-3d',
          boxShadow: hovered
            ? `0 30px 70px ${project.accent}25, 0 0 0 1px ${project.accent}20`
            : '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.35s',
        }}
      >
        {/* Gradient accent top bar */}
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, ${project.accent}80, ${project.accent}20, transparent)` }}
        />

        {/* Holographic glare — follows mouse within card */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`,
          }}
        />

        {/* Rainbow iridescence on hover */}
        <div
          className="absolute inset-0 pointer-events-none z-[9] transition-opacity duration-500"
          style={{
            opacity: hovered ? 0.07 : 0,
            background: `conic-gradient(from ${glare.x * 3.6}deg at ${glare.x}% ${glare.y}%, #a855f7, #ec4899, #38bdf8, #10b981, #f97316, #a855f7)`,
          }}
        />

        {/* Hover overlay with CTAs */}
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent z-20 flex items-end p-6"
        >
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
              >
                GitHub ↗
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
                Live Demo ↗
              </a>
            )}
          </div>
        </motion.div>

        <div className="p-6 relative z-[5]">
          {/* Category badge */}
          <span
            className="text-xs font-mono px-2.5 py-0.5 rounded-full border mb-4 inline-block"
            style={{ color: project.accent, borderColor: `${project.accent}40`, background: `${project.accent}10` }}
          >
            {project.category}
          </span>

          <h3 className="font-heading font-bold text-white text-lg mb-2.5 leading-snug">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.description}</p>

          {/* Tags with category colors */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => {
              const s = getTagStyle(tag);
              return (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.1, y: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono border cursor-default"
                  style={{
                    color: s.text,
                    backgroundColor: s.bg,
                    borderColor: s.border,
                    boxShadow: hovered ? `0 0 10px ${s.text}20` : undefined,
                    transition: 'box-shadow 0.3s',
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
