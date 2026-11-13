import { toolbelt } from '@/data';

export default function Marquee() {
  const items = [...toolbelt, ...toolbelt];
  return (
    <div className="relative border-y border-line bg-ink-2/60 py-5" aria-label="Toolbelt">
      <div className="mask-fade-x flex overflow-hidden">
        <ul className="flex shrink-0 animate-marquee items-center gap-10 pr-10 pause-on-hover">
          {items.map((t, i) => (
            <li key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-sm text-fg-muted" aria-hidden={i >= toolbelt.length}>
              {t}
              <span className="h-1 w-1 rotate-45 bg-mint/60" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
