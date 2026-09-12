import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { listAllOrders, updateOrderStatus } from '@/services/orderService';
import type { Order, OrderStatus } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/utils/format';
import { orderStatusLabels } from '@/utils/orderStatus';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

const statusOptions: { value: OrderStatus; label: string }[] = Object.entries(orderStatusLabels).map(
  ([value, label]) => ({ value: value as OrderStatus, label }),
);

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listAllOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      showToast('وضعیت سفارش به‌روزرسانی شد', 'success');
    } catch {
      showToast('خطا در به‌روزرسانی وضعیت', 'error');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">مدیریت سفارش‌ها</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="سفارشی ثبت نشده است" />
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="glass-card flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">#{order.id.slice(-6)}</p>
                <p className="text-xs text-ink-subtle">{formatDate(order.createdAt)} · {order.items.length.toLocaleString('fa-IR')} کالا</p>
              </div>
              <span className="text-sm font-bold text-ink">{formatPrice(order.total)}</span>
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                options={statusOptions}
                className="w-40"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
