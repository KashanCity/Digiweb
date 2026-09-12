import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { listMyOrders } from '@/services/orderService';
import type { Order } from '@/types';

function StatCard({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { productIds } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    listMyOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [user]);

  const processingCount = orders.filter((o) => ['pending', 'paid', 'processing', 'shipped'].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-ink">
        خوش آمدی، {user?.name} 👋
      </h1>
      <p className="mb-6 text-sm text-ink-muted">خلاصه‌ای از فعالیت‌های حساب کاربری‌تان.</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Package} label="کل سفارش‌ها" value={orders.length.toLocaleString('fa-IR')} />
        <StatCard icon={Clock} label="در حال پردازش" value={processingCount.toLocaleString('fa-IR')} />
        <StatCard icon={CheckCircle2} label="تکمیل‌شده" value={completedCount.toLocaleString('fa-IR')} />
        <StatCard icon={Heart} label="علاقه‌مندی‌ها" value={productIds.length.toLocaleString('fa-IR')} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/dashboard/orders" className="text-sm text-brand-300 hover:underline">
          مشاهده سفارش‌ها ←
        </Link>
        <Link to="/shop" className="text-sm text-brand-300 hover:underline">
          ادامه خرید ←
        </Link>
      </div>
    </div>
  );
}
