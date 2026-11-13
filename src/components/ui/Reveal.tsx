'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { EASE_OUT, viewport } from '@/lib/motion';

/** Fade/lift/blur-in on scroll. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'p' | 'span' | 'section' | 'article';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={viewport}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Masked word-by-word headline reveal. Each word slides up from behind a clip.
 * Pass `animate` to trigger immediately (e.g. hero) instead of on scroll.
 */
export function SplitReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  as: Tag = 'h2',
  immediate = false,
}: {
  text: string;
  className?: string;
  wordClassName?: (word: string, i: number) => string | undefined;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const lines = text.split('\n');
  let idx = 0;
  const trigger = immediate
    ? { initial: reduce ? false : ('hidden' as const), animate: 'show' as const }
    : { initial: reduce ? false : ('hidden' as const), whileInView: 'show' as const, viewport };

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span
        aria-hidden
        className="block"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((word) => {
              const i = idx++;
              return (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                  <motion.span
                    className={`inline-block will-change-transform ${wordClassName?.(word, i) ?? ''}`}
                    variants={{
                      hidden: { y: '110%', rotate: 4 },
                      show: { y: '0%', rotate: 0, transition: { duration: 1.1, ease: EASE_OUT } },
                    }}
                  >
                    {word}
                  </motion.span>
                  {' '}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
