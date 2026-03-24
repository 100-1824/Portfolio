import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thoughts on cybersecurity, AI/ML, and full-stack development by Umair Ahmad — Pakistan-based engineer and security researcher.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <p className="font-mono text-accent text-sm mb-4">{'> blog.init()'}</p>
        <h1 className="text-4xl font-bold font-heading mb-4">Coming Soon</h1>
        <p className="text-gray-400 text-lg mb-8">
          Future posts will cover cybersecurity research, AI/ML experiments, and full-stack engineering
          &mdash; targeting keywords like{' '}
          <em>&ldquo;cybersecurity portfolio&rdquo;</em>, <em>&ldquo;DIDS intrusion detection&rdquo;</em>, and{' '}
          <em>&ldquo;Laravel developer Pakistan&rdquo;</em>.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
