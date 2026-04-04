'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const ROLES = [
  'Cybersecurity Specialist',
  'AI/ML Engineer',
  'Full-Stack Developer',
  'DevOps Engineer',
];

function TypingRole() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const role = ROLES[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < role.length) {
      timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === role.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  useEffect(() => {
    const i = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(i);
  }, []);

  return (
    <span className="text-accent">
      {displayed}
      <span
        className={`inline-block w-0.5 h-[1em] bg-accent ml-0.5 align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  );
}

// Magnetic button hook
function useMagnetic() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, sx, sy, handleMouseMove, handleMouseLeave };
}

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const mag1 = useMagnetic();
  const mag2 = useMagnetic();

  // Name char-by-char type-in
  const name = 'Umair Ahmad';
  const [nameDisplayed, setNameDisplayed] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setNameDisplayed(name);
      setShowSubtitle(true);
      setShowCtas(true);
      setShowSocials(true);
      setShowScroll(true);
      return;
    }
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setNameDisplayed(name.slice(0, i + 1));
        i++;
        if (i === name.length) clearInterval(interval);
      }, 60);
    }, 300);

    const t2 = setTimeout(() => setShowSubtitle(true), 800);
    const t3 = setTimeout(() => setShowCtas(true), 1200);
    const t4 = setTimeout(() => setShowSocials(true), 1500);
    const t5 = setTimeout(() => setShowScroll(true), 2000);
    return () => [t, t2, t3, t4, t5].forEach(clearTimeout);
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Primary purple orb — large, top-left */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #a855f725 0%, transparent 70%)' }}
          animate={prefersReduced ? {} : { x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        {/* Pink accent orb — bottom-right */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #ec489920 0%, transparent 70%)' }}
          animate={prefersReduced ? {} : { x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Cyan accent orb — mid-right */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, #38BDF818 0%, transparent 70%)' }}
          animate={prefersReduced ? {} : { x: [0, 20, -30, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        {/* Small rose orb — top-right for depth */}
        <motion.div
          className="absolute top-1/3 right-1/5 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, #f43f5e18 0%, transparent 70%)' }}
          animate={prefersReduced ? {} : { x: [0, -15, 25, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #a855f730 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Terminal label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="font-mono text-xs text-accent/60 tracking-widest uppercase">
            {'> portfolio.init()'}
          </span>
        </motion.div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading mb-4 leading-tight">
          <span className="gradient-text">{nameDisplayed}</span>
          {nameDisplayed.length < name.length && (
            <span className="inline-block w-1 h-[0.9em] bg-accent ml-1 align-middle animate-pulse" />
          )}
        </h1>

        {/* Role typing */}
        {showSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold mb-8 h-12 flex items-center justify-center"
          >
            <TypingRole />
          </motion.div>
        )}

        {/* Tagline */}
        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10"
          >
            BS Software Engineering · COMSATS Wah · Islamabad, Pakistan
          </motion.p>
        )}

        {/* CTAs */}
        {showCtas && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <motion.div
              ref={mag1.ref}
              style={{ x: mag1.sx, y: mag1.sy }}
              onMouseMove={mag1.handleMouseMove}
              onMouseLeave={mag1.handleMouseLeave}
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View Projects
              </a>
            </motion.div>

            <motion.div
              ref={mag2.ref}
              style={{ x: mag2.sx, y: mag2.sy }}
              onMouseMove={mag2.handleMouseMove}
              onMouseLeave={mag2.handleMouseLeave}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary-500/40 text-white font-semibold text-sm hover:bg-primary-500/10 hover:border-primary-500 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        )}

        {/* Social Links */}
        {showSocials && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
            className="flex items-center justify-center gap-5"
          >
            <a
              href="https://github.com/100-1824"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile of Umair Ahmad"
              className="group p-3 rounded-xl border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/umair1824"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile of Umair Ahmad"
              className="group p-3 rounded-xl border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:18umair24@gmail.com"
              aria-label="Email Umair Ahmad"
              className="group p-3 rounded-xl border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 font-mono">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-accent" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
