'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { profile } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import { useBooted } from '@/lib/useBooted';
import NetworkCanvas from './NetworkCanvas';
import { scrollToTarget } from './SmoothScroll';
import Button from './ui/Button';
import { ArrowDown, ArrowRight, Download } from './ui/Icons';
import { SplitReveal } from './ui/Reveal';
import HudCorners from './ui/HudCorners';

function TypedRole() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = profile.roles[i];
    const t = setTimeout(
      () => {
        if (!del && txt.length < word.length) setTxt(word.slice(0, txt.length + 1));
        else if (!del) setDel(true);
        else if (txt.length) setTxt(word.slice(0, txt.length - 1));
        else {
          setDel(false);
          setI((n) => (n + 1) % profile.roles.length);
        }
      },
      !del && txt.length === word.length ? 2200 : del ? 28 : 55
    );
    return () => clearTimeout(t);
  }, [txt, del, i]);
  return (
    <span className="text-fg">
      {txt}
      <span className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-blink bg-mint" />
    </span>
  );
}

function useClock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour12: false });
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const EVENTS = [
  { sev: 'BLOCK', c: 'text-signal-red', msg: 'SQLi probe · /api/login' },
  { sev: 'ALERT', c: 'text-signal-amber', msg: 'Port scan · 10.4.2.0/24' },
  { sev: 'BLOCK', c: 'text-signal-red', msg: 'SSH brute-force · 41 attempts' },
  { sev: 'PASS', c: 'text-mint', msg: 'TLS handshake verified' },
  { sev: 'ALERT', c: 'text-signal-amber', msg: 'Anomalous DNS tunnel' },
];

function ThreatFeed() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), 2400);
    return () => clearInterval(id);
  }, []);
  const rows = [0, 1, 2].map((k) => EVENTS[(n + k) % EVENTS.length]);
  return (
    <div className="space-y-1.5">
      {rows.map((e, k) => (
        <motion.div
          key={`${n}-${k}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: k === 0 ? 1 : 0.55 - k * 0.12, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="flex items-center gap-2 font-mono text-[10.5px]"
        >
          <span className={`${e.c} w-10`}>{e.sev}</span>
          <span className="truncate text-fg-muted">{e.msg}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Sparkline() {
  const pts = [8, 12, 10, 16, 14, 20, 18, 24, 22, 27, 25, 30];
  const d = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 10} ${32 - y}`).join(' ');
  return (
    <svg viewBox="0 0 110 34" className="h-8 w-full" aria-hidden>
      <defs>
        <linearGradient id="sl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3DF5C4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3DF5C4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L110 34 L0 34Z`} fill="url(#sl)" />
      <motion.path
        d={d}
        fill="none"
        stroke="#3DF5C4"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: EASE_OUT, delay: 1.4 }}
      />
    </svg>
  );
}

export default function Hero() {
  const booted = useBooted();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const clock = useClock();

  // Scroll-out choreography
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const globeS = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.86]);

  // Cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const gx = useTransform(smx, (v) => v * 22);
  const gy = useTransform(smy, (v) => v * 22);
  const cx1 = useTransform(smx, (v) => v * -38);
  const cy1 = useTransform(smy, (v) => v * -38);
  const cx2 = useTransform(smx, (v) => v * 30);
  const cy2 = useTransform(smy, (v) => v * 30);

  const show = (d: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
    animate: booted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 1.2, ease: EASE_OUT, delay: d },
  });

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28"
    >
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <NetworkCanvas className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-mint/10 blur-[140px]" />
        <div className="absolute -right-20 top-0 h-[600px] w-[600px] rounded-full bg-signal-blue/10 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-x relative grid flex-1 items-center gap-10 pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <motion.div style={{ y: contentY, opacity: contentO }} className="relative z-10">
          <motion.div {...show(0.1)} className="mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.03] py-1.5 pl-2 pr-4 backdrop-blur">
            <span className="rounded-full bg-mint/15 px-2 py-0.5 font-mono text-[10px] tracking-widest text-mint">
              SECURE
            </span>
            <span className="font-mono text-[11px] tracking-wide text-fg-muted">
              {profile.name} — {profile.title}
            </span>
          </motion.div>

          {booted || reduce ? (
            <SplitReveal
              as="h1"
              immediate
              delay={0.2}
              stagger={0.07}
              text={'I break systems\nso attackers can’t.'}
              className="font-display text-[clamp(2.7rem,6vw,5.6rem)] font-semibold leading-[0.95] tracking-tightest text-fg"
              wordClassName={(w) => (w === 'attackers' || w === 'can’t.' ? 'text-gradient' : undefined)}
            />
          ) : (
            <h1 className="font-display text-[clamp(2.7rem,6vw,5.6rem)] font-semibold leading-[0.95] tracking-tightest text-transparent">
              I break systems
              <br />
              so attackers can’t.
            </h1>
          )}

          <motion.p {...show(0.75)} className="mt-8 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
            Security engineer building AI-driven intrusion detection, hardening production hosting
            infrastructure and shipping secure full-stack software — from {profile.location}.
          </motion.p>

          <motion.div {...show(0.9)} className="mt-6 font-mono text-sm text-fg-muted">
            <span className="text-mint">root@umair</span>
            <span className="text-fg-dim">:~$</span> whoami --role <TypedRole />
          </motion.div>

          <motion.div {...show(1.05)} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#work" icon={<ArrowRight width={16} height={16} />}>
              View operations
            </Button>
            <Button href={profile.resume} variant="ghost" download icon={<Download width={15} height={15} />}>
              Download résumé
            </Button>
          </motion.div>

          <motion.div {...show(1.2)} className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
            <span className="eyebrow">Credentials</span>
            {['ISC2 CC', 'Google Cybersecurity', 'SecOps CAP'].map((c) => (
              <span key={c} className="flex items-center gap-2 text-sm text-fg-muted">
                <span className="h-1 w-1 rotate-45 bg-mint" />
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Visual ───────────────────────────────────────────── */}
        <motion.div
          style={{ y: globeY, scale: globeS }}
          className="relative mx-auto aspect-square w-full max-w-[620px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
            animate={booted ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.3 }}
            style={{ x: gx, y: gy }}
            className="absolute inset-0"
          >
            <div className="absolute inset-[8%] rounded-full bg-mint/10 blur-[80px]" />
            <div className="absolute inset-0 animate-spin-slower">
              <Image
                src="/art/hero-globe.webp"
                alt="Wireframe globe with live threat-intelligence arcs connecting network nodes"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 620px"
                className="select-none object-contain"
              />
            </div>
            {/* scan sweep */}
            <div className="absolute inset-[16%] overflow-hidden rounded-full">
              <div className="absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-mint/10 to-transparent" />
            </div>
          </motion.div>

          {/* HUD card: detection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={booted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.2 }}
            style={{ x: cx1, y: cy1 }}
            className="absolute left-0 top-[8%] w-[170px] sm:-left-4 sm:top-[12%] sm:w-[200px]"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass hud-corners relative rounded-xl p-4"
            >
              <HudCorners size={8} />
              <p className="eyebrow !text-[9.5px]">DIDS · model accuracy</p>
              <p className="mt-1 font-display text-3xl font-semibold text-fg">
                99.0<span className="text-mint">%</span>
              </p>
              <Sparkline />
            </motion.div>
          </motion.div>

          {/* HUD card: threat feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={booted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.4 }}
            style={{ x: cx2, y: cy2 }}
            className="absolute bottom-[6%] right-0 w-[220px] sm:-right-2 sm:bottom-[10%] sm:w-[250px]"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="glass relative rounded-xl p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow !text-[9.5px]">Live sensor feed</p>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal-red">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-red" />
                  REC
                </span>
              </div>
              <ThreatFeed />
            </motion.div>
          </motion.div>

          {/* coordinates tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.6 }}
            className="absolute right-[6%] top-[4%] hidden font-mono text-[10px] leading-relaxed text-fg-dim sm:block"
          >
            <p>LAT 33.6844 N</p>
            <p>LON 73.0479 E</p>
            <p className="text-mint">PKT {clock}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget('#about');
        }}
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
        className="container-x relative mb-8 hidden items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-fg-muted md:flex"
      >
        <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line">
          <motion.span
            animate={reduce ? {} : { y: [-14, 14] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown width={14} height={14} />
          </motion.span>
        </span>
        SCROLL TO DECRYPT
      </motion.a>
    </section>
  );
}
