import { cn } from '@/lib/utils';

/** Four bracket corners, HUD-style. Parent must be `relative`. */
export default function HudCorners({ className, size = 14 }: { className?: string; size?: number }) {
  const s = { width: size, height: size };
  const c = cn('pointer-events-none absolute border-mint/70', className);
  return (
    <>
      <span style={s} className={cn(c, 'left-0 top-0 border-l border-t')} />
      <span style={s} className={cn(c, 'right-0 top-0 border-r border-t')} />
      <span style={s} className={cn(c, 'bottom-0 left-0 border-b border-l')} />
      <span style={s} className={cn(c, 'bottom-0 right-0 border-b border-r')} />
    </>
  );
}
