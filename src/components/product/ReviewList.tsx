import type { Review } from '@/types';
import { RatingStars } from '@/components/product/RatingStars';
import { formatDate } from '@/utils/format';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <EmptyState icon={MessageSquare} title="هنوز نظری ثبت نشده" description="اولین نفری باشید که درباره این محصول نظر می‌دهد." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="glass-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-overlay text-xs font-semibold text-ink">
                {review.userName[0]}
              </span>
              <span className="text-sm font-medium text-ink">{review.userName}</span>
            </div>
            <span className="text-xs text-ink-subtle">{formatDate(review.createdAt)}</span>
          </div>
          <RatingStars rating={review.rating} />
          <p className="mt-2 text-sm leading-6 text-ink-muted">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
