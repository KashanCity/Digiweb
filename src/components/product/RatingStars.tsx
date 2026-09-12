import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(dimension, i < Math.round(rating) ? 'fill-warning text-warning' : 'text-surface-border')}
        />
      ))}
    </div>
  );
}
