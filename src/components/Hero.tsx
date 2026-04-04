'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
    <span className="gradient-text">
      {displayed}
      <span
        className={`inline-block w-0.5 h-[0.9em] bg-primary-400 ml-0.5 align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  );
}

function useMagnetic() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    if (Math.sqrt(dx * dx + dy * dy) < 100) { x.set(dx * 0.3); y.set(dy * 0.3); }
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, handleMouseMove, handleMouseLeave };
}

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mag1 = useMagnetic();
  const mag2 = useMagnetic();

  // ── Mouse parallax ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Smooth out cursor jitter
  const smoothX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 50, damping: 20 });
  // Different depth layers
  const orbX    = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const orbY    = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const midX    = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const midY    = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const frontX  = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const frontY  = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);
  // 3D tilt on the entire content block
  const tiltX   = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const tiltY   = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    rawY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  // ── Entrance sequence ───────────────────────────────────────────────────────
  const name = 'Umair Ahmad';
  const [nameDisplayed, setNameDisplayed] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setNameDisplayed(name); setShowSubtitle(true); setShowCtas(true);
      setShowSocials(true); setShowScroll(true); return;
    }
    let i = 0;
    const t  = setTimeout(() => {
      const iv = setInterval(() => {
        setNameDisplayed(name.slice(0, i + 1)); i++;
        if (i === name.length) clearInterval(iv);
      }, 60);
    }, 300);
    const t2 = setTimeout(() => setShowSubtitle(true), 900);
    const t3 = setTimeout(() => setShowCtas(true), 1300);
    const t4 = setTimeout(() => setShowSocials(true), 1600);
    const t5 = setTimeout(() => setShowScroll(true), 2100);
    return () => [t, t2, t3, t4, t5].forEach(clearTimeout);
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >

      {/* ── Aurora Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Deep base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05010f] via-[#0a0520] to-[#080215]" />

        {/* Large purple aurora — slowest parallax */}
        <motion.div
          className="absolute -top-32 -left-32 w-[800px] h-[800px] rounded-full"
          animate={prefersReduced ? {} : { scale: [1, 1.15, 0.92, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            x: prefersReduced ? 0 : orbX,
            y: prefersReduced ? 0 : orbY,
            background: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(109,40,217,0.2) 40%, transparent 70%)',
            filter: 'blur(72px)',
          }}
        />

        {/* Pink aurora — medium parallax */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full"
          animate={prefersReduced ? {} : { scale: [1, 0.88, 1.1, 1], opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            x: prefersReduced ? 0 : midX,
            y: prefersReduced ? 0 : midY,
            background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(244,114,182,0.15) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Cyan accent — fastest parallax */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full -translate-x-1/2"
          animate={prefersReduced ? {} : { scale: [1, 1.25, 0.88, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{
            x: prefersReduced ? 0 : frontX,
            y: prefersReduced ? 0 : frontY,
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Rose small orb */}
        <motion.div
          className="absolute top-[20%] right-[15%] w-[280px] h-[280px] rounded-full"
          animate={prefersReduced ? {} : { opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.7) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04] noise-texture pointer-events-none" />

        {/* Subtle scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
            backgroundSize: '100% 4px',
          }}
        />
      </div>

      {/* ── 3D Perspective Content ────────────────────────────────────────── */}
      <div style={{ perspective: '1200px' }} className="relative z-10 w-full">
        <motion.div
          style={prefersReduced ? {} : { rotateX: tiltX, rotateY: tiltY }}
          className="text-center px-4 max-w-5xl mx-auto"
        >

          {/* Terminal label */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary-500/20 bg-primary-500/5 font-mono text-xs text-primary-400/70 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              portfolio.init()
            </span>
          </motion.div>

          {/* Name — mid depth */}
          <motion.div style={prefersReduced ? {} : { x: midX, y: midY }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading mb-4 leading-tight tracking-tight">
              <span className="gradient-text">{nameDisplayed}</span>
              {nameDisplayed.length < name.length && (
                <span className="inline-block w-1 h-[0.85em] bg-primary-400 ml-1 align-middle animate-pulse" />
              )}
            </h1>
          </motion.div>

          {/* Role + tagline — front depth */}
          {showSubtitle && (
            <motion.div style={prefersReduced ? {} : { x: frontX, y: frontY }}>
              <motion.div
                initial={{ opacity: 0, filter: 'blur(16px)', y: 12 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold mb-6 h-12 flex items-center justify-center"
              >
                <TypingRole />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10"
              >
                BS Software Engineering · COMSATS Wah · Islamabad, Pakistan
              </motion.p>
            </motion.div>
          )}

          {/* CTAs */}
          {showCtas && (
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                  className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 4px 40px rgba(168,85,247,0.2)',
                  }}
                >
                  <span className="relative z-10 text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    View Projects
                  </span>
                  {/* Shimmer sweep on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-100%', skewX: '-15deg' }}
                    whileHover={{ x: '250%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', width: '40%' }}
                  />
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
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary-500/40 text-white font-semibold text-sm hover:bg-primary-500/10 hover:border-primary-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] active:scale-95 transition-all duration-300"
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
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 18 }}
              className="flex items-center justify-center gap-4"
            >
              {[
                {
                  href: 'https://github.com/100-1824',
                  label: 'GitHub',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ),
                },
                {
                  href: 'https://linkedin.com/in/umair1824',
                  label: 'LinkedIn',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  href: 'mailto:18umair24@gmail.com',
                  label: 'Email',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
              ].map(({ href, label, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className="group p-3 rounded-xl border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/10 hover:shadow-[0_0_16px_rgba(168,85,247,0.25)] transition-all duration-300"
                >
                  <span className="text-gray-400 group-hover:text-primary-400 transition-colors">{icon}</span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 font-mono tracking-widest uppercase">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-primary-400" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
