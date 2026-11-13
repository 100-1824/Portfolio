'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-mint via-mint to-signal-blue shadow-[0_0_12px_rgba(61,245,196,0.8)]"
    />
  );
}
