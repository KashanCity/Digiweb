import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '@/services/orderService';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import { orderStatusLabels, orderStatusTone, paymentStatusLabels } from '@/utils/orderStatus';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-2 text-lg font-bold text-ink">سفارش پیدا نشد</h1>
        <Button onClick={() => navigate('/dashboard/orders')}>بازگشت به سفارش‌ها</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-ink">سفارش #{order.id.slice(-6)}</h1>
          <p className="text-xs text-ink-subtle">{formatDate(order.createdAt)}</p>
        </div>
        <Badge tone={orderStatusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
      </div>

      <div className="glass-card mb-6 divide-y divide-surface-border">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{item.name}</p>
              <p className="text-xs text-ink-subtle">{item.quantity.toLocaleString('fa-IR')} عدد</p>
            </div>
            <span className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="glass-card mb-6 space-y-2 p-5 text-sm">
        <div className="flex justify-between text-ink-muted">
          <span>جمع جزء</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-success">
            <span>تخفیف</span>
            <span>−{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-muted">
          <span>هزینه ارسال</span>
          <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'رایگان'}</span>
        </div>
        <div className="flex justify-between border-t border-surface-border pt-2 text-base font-bold text-ink">
          <span>مبلغ نهایی</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="flex justify-between pt-1 text-xs text-ink-subtle">
          <span>وضعیت پرداخت</span>
          <span>{paymentStatusLabels[order.paymentStatus]}</span>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-2 text-sm font-semibold text-ink">آدرس ارسال</h2>
        <p className="text-sm leading-6 text-ink-muted">
          {order.address.fullName} · {order.address.phone}
          <br />
          {order.address.province}، {order.address.city}، {order.address.addressLine}
          <br />
          کد پستی: {order.address.postalCode}
        </p>
      </div>
    </div>
  );
}
