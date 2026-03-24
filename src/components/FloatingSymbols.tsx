'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const SYMBOLS = ['{}', '//', '<>', '=>', '0x', '#!/', '&&', '||', '[]', '**', '~~', '::'];

export default function FloatingSymbols() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {SYMBOLS.map((sym, i) => {
        const x = (i * 83) % 100;
        const delay = (i * 1.7) % 15;
        const duration = 18 + (i * 3.1) % 12;

        return (
          <motion.span
            key={sym + i}
            initial={{ y: '110vh', x: `${x}vw`, opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.05, 0.05, 0] }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
              opacity: { times: [0, 0.1, 0.9, 1] },
            }}
            className="absolute font-mono text-sm text-accent select-none"
            style={{ willChange: 'transform' }}
          >
            {sym}
          </motion.span>
        );
      })}
    </div>
  );
}
