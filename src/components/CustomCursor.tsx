'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Tight spring for dot
  const dotX = useSpring(mouseX, { stiffness: 500, damping: 32 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 32 });
  // Loose spring for ring trail
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 24 });
  // Very loose for ambient spotlight
  const glowX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    const setHover = (val: boolean) => () => setIsHovering(val);
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, [tabindex]').forEach((el) => {
        el.addEventListener('mouseenter', setHover(true));
        el.addEventListener('mouseleave', setHover(false));
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Initial + observe DOM mutations for dynamically added elements
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      observer.disconnect();
    };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Ambient spotlight — large, slow, sets the "mood lighting" */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[190] rounded-full"
        animate={{ opacity: isHovering ? 0.6 : 0.35 }}
        transition={{ duration: 0.4 }}
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Ring trail */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[195]"
        animate={{
          width:   isHovering ? 44 : isClicking ? 18 : 28,
          height:  isHovering ? 44 : isClicking ? 18 : 28,
          opacity: isHovering ? 0.9 : 0.5,
          borderColor: isHovering ? 'rgba(168,85,247,0.8)' : 'rgba(168,85,247,0.45)',
          boxShadow: isHovering ? '0 0 12px rgba(168,85,247,0.5)' : '0 0 0 0 transparent',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[200]"
        animate={{
          width:   isHovering ? 6 : isClicking ? 10 : 7,
          height:  isHovering ? 6 : isClicking ? 10 : 7,
          opacity: isHovering ? 0.6 : 1,
          background: isHovering
            ? 'linear-gradient(135deg, #a855f7, #ec4899)'
            : 'rgba(168,85,247,1)',
          boxShadow: '0 0 8px rgba(168,85,247,0.8)',
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
