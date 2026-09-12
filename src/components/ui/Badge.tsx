import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  neutral: 'bg-surface-overlay text-ink-muted border-surface-border',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium', toneClasses[tone])}>
      {children}
    </span>
  );
}
