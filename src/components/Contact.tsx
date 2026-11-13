'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { profile } from '@/data';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import SectionHeading from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, Check, GitHub, LinkedIn, Lock, Mail, WhatsApp } from './ui/Icons';

const CHANNELS = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: 'LinkedIn', value: 'in/umair1824', href: profile.linkedin, icon: LinkedIn },
  { label: 'GitHub', value: '100-1824', href: profile.github, icon: GitHub },
  { label: 'WhatsApp', value: profile.phone, href: profile.whatsapp, icon: WhatsApp },
];

type Field = 'name' | 'email' | 'message';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (key) emailjs.init(key);
  }, []);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: form.name, from_email: form.email, message: form.message }
      );
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const sending = status === 'sending';
  const input =
    'peer w-full rounded-xl border bg-ink/60 px-4 pb-3 pt-6 text-[15px] text-fg placeholder-transparent outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:border-mint/60 focus:bg-ink focus:shadow-[0_0_0_4px_rgba(61,245,196,0.08)] disabled:opacity-50';
  const label =
    'pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim transition-colors peer-focus:text-mint';

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute -right-60 top-10 -z-10 h-[900px] w-[900px] opacity-50 md:opacity-70">
        <div className="relative h-full w-full animate-spin-slow">
          <Image src="/art/contact-lock.webp" alt="" fill sizes="900px" className="object-contain" />
        </div>
      </div>

      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading
            index="06"
            label="Secure channel"
            title={'Let’s build something\nattackers hate.'}
            intro="Open to security engineering roles, pentest and hardening engagements, and AI-for-security collaborations."
          />

          <ul className="grid gap-3 sm:grid-cols-2">
            {CHANNELS.map(({ label: l, value, href, icon: Icon }, i) => (
              <Reveal as="li" key={l} delay={i * 0.06}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-ink-2/80 p-4 backdrop-blur transition-[border-color,background-color] duration-500 hover:border-mint/40 hover:bg-ink-3"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-fg-muted transition-colors duration-500 group-hover:bg-mint group-hover:text-ink">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block !text-[10px]">{l}</span>
                    <span className="block truncate text-sm text-fg">{value}</span>
                  </span>
                  <ArrowUpRight className="shrink-0 text-fg-dim transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-mint" width={16} height={16} />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="glass overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(61,245,196,0.25)]">
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-signal-red/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-signal-amber/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
              </span>
              <span className="flex flex-1 items-center justify-center gap-2 font-mono text-[11px] text-fg-muted">
                <Lock width={12} height={12} className="text-mint" /> secure-channel — e2e
              </span>
              <span className="w-12" />
            </div>

            <div className="relative p-6 md:p-8">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    className="flex min-h-[380px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                      className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-mint text-ink shadow-[0_0_60px_rgba(61,245,196,0.6)]"
                    >
                      <Check width={34} height={34} strokeWidth={2.5} />
                    </motion.span>
                    <p className="font-display text-2xl font-semibold text-fg">Transmission delivered.</p>
                    <p className="mt-2 font-mono text-sm text-fg-muted">Thanks — I&apos;ll get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="chip mt-8 !text-fg hover:!border-mint/50">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="mb-6 font-mono text-[12px] text-fg-muted">
                      <span className="text-mint">$</span> ./open-channel --to umair
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(['name', 'email'] as const).map((f) => (
                        <div key={f} className="relative">
                          <input
                            id={`c-${f}`}
                            type={f === 'email' ? 'email' : 'text'}
                            autoComplete={f}
                            placeholder={f}
                            value={form[f]}
                            disabled={sending}
                            aria-invalid={!!errors[f]}
                            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                            className={cn(input, errors[f] ? 'border-signal-red/60' : 'border-line')}
                          />
                          <label htmlFor={`c-${f}`} className={label}>
                            {f === 'name' ? 'Your name' : 'Email address'}
                          </label>
                          {errors[f] && <p className="mt-1.5 font-mono text-[11px] text-signal-red">{errors[f]}</p>}
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <textarea
                        id="c-message"
                        rows={6}
                        placeholder="message"
                        value={form.message}
                        disabled={sending}
                        aria-invalid={!!errors.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={cn(input, 'resize-none', errors.message ? 'border-signal-red/60' : 'border-line')}
                      />
                      <label htmlFor="c-message" className={label}>
                        Briefing — project, scope, timeline
                      </label>
                      {errors.message && (
                        <p className="mt-1.5 font-mono text-[11px] text-signal-red">{errors.message}</p>
                      )}
                    </div>

                    {status === 'error' && (
                      <p className="rounded-xl border border-signal-red/30 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
                        Failed to send. Email me directly at {profile.email}.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-mint font-medium text-ink transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(61,245,196,0.45)] disabled:cursor-wait disabled:opacity-80"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out-expo group-hover:translate-x-full" />
                      {sending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                          Encrypting &amp; sending…
                        </>
                      ) : (
                        <>
                          <Lock width={16} height={16} />
                          Send encrypted message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
