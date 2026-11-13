import { cn } from '@/lib/utils';
import Magnetic from './Magnetic';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  external?: boolean;
  download?: boolean;
  className?: string;
};

/** Premium pill button: rolling label on hover, magnetic pull, mint glow. */
export default function Button({ href, children, variant = 'primary', icon, external, download, className }: Props) {
  const base =
    'group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-6 pr-2 text-sm font-medium transition-[box-shadow,background-color,border-color] duration-500 ease-out-expo';
  const styles =
    variant === 'primary'
      ? 'bg-mint text-ink shadow-[0_0_0_1px_rgba(61,245,196,0.4),0_10px_40px_-10px_rgba(61,245,196,0.6)] hover:shadow-[0_0_0_1px_rgba(61,245,196,0.8),0_16px_60px_-10px_rgba(61,245,196,0.9)]'
      : 'border border-line bg-white/[0.03] text-fg hover:border-white/20 hover:bg-white/[0.06]';

  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download || undefined}
        data-cursor="hover"
        className={cn(base, styles, className)}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
          >
            {children}
          </span>
        </span>
        <span
          className={cn(
            'grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]',
            variant === 'primary' ? 'bg-ink text-mint' : 'bg-white/10 text-fg'
          )}
        >
          {icon}
        </span>
      </a>
    </Magnetic>
  );
}
