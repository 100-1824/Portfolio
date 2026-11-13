import type { Variants, Transition } from 'framer-motion';

/** Signature easing curves */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // expo-out: long silky tail
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const spring: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.8 };
export const softSpring = { stiffness: 120, damping: 20, mass: 0.6 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_OUT },
  },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const viewport = { once: true, amount: 0.25, margin: '0px 0px -8% 0px' } as const;
