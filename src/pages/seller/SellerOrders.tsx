import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listSellerOrders, type SellerOrderRow } from '@/services/orderService';
import { formatPrice, formatDate } from '@/utils/format';
import { orderStatusLabels, orderStatusTone } from '@/utils/orderStatus';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SellerOrders() {
  const { user } = useAuth();
  const [rows, setRows] = useState<SellerOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listSellerOrders(user.id)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">سفارش‌های فروشگاه</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="هنوز سفارشی دریافت نکرده‌اید" />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.orderId} className="glass-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">سفارش #{row.orderId.slice(-6)}</p>
                  <p className="text-xs text-ink-subtle">{formatDate(row.createdAt)}</p>
                </div>
                <Badge tone={orderStatusTone[row.status]}>{orderStatusLabels[row.status]}</Badge>
              </div>
              <div className="divide-y divide-surface-border">
                {row.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink-muted">{item.name} × {item.quantity.toLocaleString('fa-IR')}</span>
                    <span className="text-ink">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t border-surface-border pt-2 text-sm font-bold text-ink">
                <span>جمع سهم شما</span>
                <span>{formatPrice(row.sellerSubtotal)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
