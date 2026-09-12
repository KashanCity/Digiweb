import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listSellerOrders, type SellerOrderRow } from '@/services/orderService';
import { formatPrice, formatDate } from '@/utils/format';
import { SalesChart } from '@/components/ui/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SellerEarnings() {
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

  const deliveredRows = rows.filter((r) => r.status === 'delivered');
  const totalEarnings = deliveredRows.reduce((sum, r) => sum + r.sellerSubtotal, 0);
  const pendingEarnings = rows
    .filter((r) => ['pending', 'paid', 'processing', 'shipped'].includes(r.status))
    .reduce((sum, r) => sum + r.sellerSubtotal, 0);

  // نمودار زیر جهت نمایش رابط کاربری ساخته شده است.
  // در اتصال نهایی، باید بر اساس تاریخ واقعی سفارش‌های Delivered تجمیع شود.
  const chartData = [
    { label: 'هفته ۱', amount: totalEarnings * 0.15 },
    { label: 'هفته ۲', amount: totalEarnings * 0.2 },
    { label: 'هفته ۳', amount: totalEarnings * 0.25 },
    { label: 'هفته ۴', amount: totalEarnings * 0.4 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">درآمد</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="glass-card flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-ink">{formatPrice(totalEarnings)}</p>
            <p className="text-xs text-ink-muted">درآمد نهایی‌شده</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-ink">{formatPrice(pendingEarnings)}</p>
            <p className="text-xs text-ink-muted">در انتظار تسویه</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-ink">{rows.length.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-ink-muted">کل سفارش‌ها</p>
          </div>
        </div>
      </div>

      <div className="glass-card mt-6 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">روند درآمد ماه اخیر</h2>
        <SalesChart data={chartData} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink">سفارش‌های تسویه‌شده</h2>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : deliveredRows.length === 0 ? (
          <EmptyState title="هنوز سفارش تسویه‌شده‌ای ندارید" />
        ) : (
          <div className="space-y-2">
            {deliveredRows.map((row) => (
              <div key={row.orderId} className="glass-card flex items-center justify-between p-3">
                <span className="text-sm text-ink-muted">#{row.orderId.slice(-6)} · {formatDate(row.createdAt)}</span>
                <span className="text-sm font-semibold text-ink">{formatPrice(row.sellerSubtotal)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
