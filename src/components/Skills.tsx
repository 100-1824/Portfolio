'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, staggerItem, pillFade, staggerFast } from '@/lib/animations';
import SectionLabel from './ui/SectionLabel';
import { skillCategories } from '@/data';

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="skills" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <SectionLabel text="skills.map()" />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold font-heading mb-16"
      >
        What I Work With
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillCategories.map((cat) => (
          <SkillCard key={cat.id} category={cat} />
        ))}
      </motion.div>
    </section>
  );
}

function SkillCard({ category }: { category: typeof skillCategories[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 cursor-default overflow-hidden"
      style={{
        boxShadow: hovered ? `0 20px 60px ${category.color}20` : undefined,
        borderColor: hovered ? `${category.color}40` : undefined,
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {/* Glow bg on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at top left, ${category.color}10 0%, transparent 60%)` }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-5">
        <motion.span
          animate={hovered ? { rotate: 10 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          {category.icon}
        </motion.span>
        <h3 className="font-heading font-bold text-white text-lg">{category.title}</h3>
      </div>

      {/* Pills */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate={hovered ? 'visible' : 'hidden'}
        className="flex flex-wrap gap-2"
      >
        {/* Always show pills, but animate them when card is first hovered */}
        {category.skills.map((skill) => (
          <SkillPill key={skill} skill={skill} color={category.color} hovered={hovered} />
        ))}
      </motion.div>

      {/* Static pills for no-hover state */}
      {!hovered && (
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-gray-400"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SkillPill({ skill, color, hovered }: { skill: string; color: string; hovered: boolean }) {
  return (
    <motion.span
      variants={pillFade}
      className="px-3 py-1 rounded-full text-xs font-mono border transition-all duration-200"
      style={{
        borderColor: `${color}60`,
        color: color,
        backgroundColor: `${color}15`,
        boxShadow: hovered ? `0 0 8px ${color}30` : undefined,
      }}
    >
      {skill}
    </motion.span>
  );
}
