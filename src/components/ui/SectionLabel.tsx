'use client';

import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <div ref={ref} className="flex items-center gap-2 mb-3">
      <span className="text-accent font-mono text-sm font-semibold">{'>'}</span>
      <span className="font-mono text-sm text-accent/80 tracking-widest uppercase">
        {displayed}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
}
