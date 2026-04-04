'use client';

import { motion } from 'framer-motion';

interface SkillBadgeProps {
  skill: string;
  color: string;
  /** Parent card is hovered — enables glow effect */
  parentHovered?: boolean;
}

export default function SkillBadge({ skill, color, parentHovered = false }: SkillBadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-block px-3 py-1 rounded-full text-xs font-mono border cursor-default select-none transition-all duration-200"
      style={{
        color,
        borderColor: `${color}60`,
        backgroundColor: `${color}15`,
        boxShadow: parentHovered ? `0 0 10px ${color}30` : undefined,
      }}
    >
      {skill}
    </motion.span>
  );
}
