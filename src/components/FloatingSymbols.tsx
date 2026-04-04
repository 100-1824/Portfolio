'use client';

import { motion, useReducedMotion } from 'framer-motion';

const PARTICLES = [
  // code symbols — purple/cyan
  { sym: '{}',   color: '#a855f7', size: 'text-sm'  },
  { sym: '//',   color: '#38bdf8', size: 'text-xs'  },
  { sym: '<>',   color: '#ec4899', size: 'text-sm'  },
  { sym: '=>',   color: '#a855f7', size: 'text-xs'  },
  { sym: '0x',   color: '#10b981', size: 'text-xs'  },
  { sym: '#!/',  color: '#38bdf8', size: 'text-xs'  },
  { sym: '&&',   color: '#f97316', size: 'text-sm'  },
  { sym: '||',   color: '#a855f7', size: 'text-xs'  },
  { sym: '[]',   color: '#38bdf8', size: 'text-sm'  },
  { sym: '**',   color: '#ec4899', size: 'text-xs'  },
  { sym: '~~',   color: '#10b981', size: 'text-xs'  },
  { sym: '::',   color: '#a855f7', size: 'text-sm'  },
  // geometric shapes — subtle accent
  { sym: '◆',    color: '#a855f7', size: 'text-xs'  },
  { sym: '●',    color: '#ec4899', size: 'text-[8px]' },
  { sym: '▲',    color: '#38bdf8', size: 'text-[8px]' },
  { sym: '■',    color: '#10b981', size: 'text-[8px]' },
  { sym: '◇',    color: '#f97316', size: 'text-xs'  },
  { sym: '▸',    color: '#a855f7', size: 'text-xs'  },
  // binary / hex fragments
  { sym: '10',   color: '#38bdf8', size: 'text-[10px]' },
  { sym: 'ff',   color: '#a855f7', size: 'text-[10px]' },
  { sym: '01',   color: '#ec4899', size: 'text-[10px]' },
  { sym: 'NaN',  color: '#10b981', size: 'text-[9px]'  },
];

export default function FloatingSymbols() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => {
        const xPos     = (i * 73 + 17) % 98;      // spread across width
        const delay    = (i * 1.3 + 0.5) % 18;   // stagger start times
        const duration = 20 + (i * 2.7) % 16;    // varied speeds
        const rotate   = i % 3 === 0 ? 360 : i % 3 === 1 ? -180 : 0;

        return (
          <motion.span
            key={p.sym + i}
            className={`absolute font-mono select-none ${p.size}`}
            style={{ color: p.color, willChange: 'transform', opacity: 0 }}
            initial={{ y: '108vh', x: `${xPos}vw`, opacity: 0, rotate: 0 }}
            animate={{
              y: '-12vh',
              opacity: [0, 0.07, 0.07, 0],
              rotate,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
              opacity: { times: [0, 0.08, 0.92, 1], duration },
              rotate:  { duration, ease: 'linear' },
            }}
          >
            {p.sym}
          </motion.span>
        );
      })}
    </div>
  );
}
