import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thoughts on cybersecurity, AI/ML, and full-stack development by Umair Ahmad — Pakistan-based engineer and security researcher.',
};

export default function BlogPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 mask-radial" />
      <div className="relative max-w-2xl text-center">
        <p className="mb-4 font-mono text-sm text-mint">{'> blog.init()'}</p>
        <h1 className="mb-4 font-display text-5xl font-semibold tracking-tightest text-fg">Coming Soon</h1>
        <p className="mb-10 text-lg leading-relaxed text-fg-muted">
          Future posts will cover cybersecurity research, AI/ML experiments, and full-stack engineering
          &mdash; targeting keywords like{' '}
          <em>&ldquo;cybersecurity portfolio&rdquo;</em>, <em>&ldquo;DIDS intrusion detection&rdquo;</em>, and{' '}
          <em>&ldquo;Laravel developer Pakistan&rdquo;</em>.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-mint px-6 text-sm font-medium text-ink transition-shadow hover:shadow-[0_0_40px_rgba(61,245,196,0.5)]"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
