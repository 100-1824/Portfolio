'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight animated node network. Nodes drift, link when close, and
 * lean away from the cursor. Pauses when offscreen / tab hidden.
 */
export default function NetworkCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = 1, raf = 0, running = true;
    const mouse = { x: -9999, y: -9999 };
    type N = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean };
    let nodes: N[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
        hot: Math.random() < 0.05,
      }));
    };

    const LINK = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            const f = (1 - Math.sqrt(d2) / 160) * 0.6;
            n.x += (dx / (Math.sqrt(d2) + 0.01)) * f;
            n.y += (dy / (Math.sqrt(d2) + 0.01)) * f;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            const o = (1 - Math.sqrt(d) / LINK) * 0.22;
            ctx.strokeStyle = a.hot || b.hot ? `rgba(255,90,78,${o * 1.2})` : `rgba(61,245,196,${o})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.hot ? 'rgba(255,90,78,0.9)' : 'rgba(170,255,230,0.65)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hot ? n.r + 1 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const io = new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting && !document.hidden;
      if (running && !was) raf = requestAnimationFrame(draw);
    });
    const onVis = () => {
      const was = running;
      running = !document.hidden;
      if (running && !was) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    io.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
