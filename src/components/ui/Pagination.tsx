import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition-colors hover:border-brand-400 hover:text-ink disabled:opacity-40"
        aria-label="صفحه بعد"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
            p === page ? 'bg-brand-gradient text-white' : 'text-ink-muted hover:bg-surface-overlay hover:text-ink',
          )}
        >
          {p.toLocaleString('fa-IR')}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition-colors hover:border-brand-400 hover:text-ink disabled:opacity-40"
        aria-label="صفحه قبل"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
