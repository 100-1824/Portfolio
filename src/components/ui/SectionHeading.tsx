import { Reveal, SplitReveal } from './Reveal';
import { cn } from '@/lib/utils';

export default function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
  align = 'left',
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('mb-14 md:mb-20', align === 'center' && 'text-center', className)}>
      <Reveal>
        <div className={cn('mb-6 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="font-mono text-[11px] tracking-[0.28em] text-mint">{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-mint/70 to-transparent" />
          <span className="eyebrow">{label}</span>
        </div>
      </Reveal>
      <SplitReveal
        text={title}
        className="font-display text-[clamp(2.1rem,4.4vw,3.9rem)] font-semibold leading-[1.02] tracking-tightest text-fg"
        wordClassName={(w) => (w.endsWith('.') || w.startsWith('*') ? 'text-gradient' : undefined)}
      />
      {intro && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              'mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg',
              align === 'center' && 'mx-auto'
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
