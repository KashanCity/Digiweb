import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listMyOrders } from '@/services/orderService';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import { orderStatusLabels, orderStatusTone } from '@/utils/orderStatus';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listMyOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">سفارش‌های من</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="هنوز سفارشی ثبت نکرده‌اید"
          description="محصولات مورد نظرتان را از فروشگاه انتخاب و سفارش دهید."
          action={
            <Link to="/shop">
              <Button size="sm">مشاهده فروشگاه</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/order/${order.id}`} className="glass-card flex items-center justify-between gap-4 p-4 transition-colors hover:border-brand-500/50">
              <div>
                <p className="text-sm font-semibold text-ink">سفارش #{order.id.slice(-6)}</p>
                <p className="mt-1 text-xs text-ink-subtle">{formatDate(order.createdAt)} · {order.items.length.toLocaleString('fa-IR')} کالا</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={orderStatusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                <span className="text-sm font-bold text-ink">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
