import { useEffect, useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { listAllReviews, deleteReview } from '@/services/reviewService';
import type { Review } from '@/types';
import { useToast } from '@/context/ToastContext';
import { RatingStars } from '@/components/product/RatingStars';
import { formatDate } from '@/utils/format';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listAllReviews()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('نظر حذف شد', 'success');
    } catch {
      showToast('خطا در حذف نظر', 'error');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">مدیریت نظرات</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="نظری ثبت نشده است" />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card flex items-start justify-between gap-3 p-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{review.userName}</span>
                  <span className="text-xs text-ink-subtle">{formatDate(review.createdAt)}</span>
                </div>
                <RatingStars rating={review.rating} />
                <p className="mt-2 text-sm leading-6 text-ink-muted">{review.comment}</p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
