import { useEffect, useState } from 'react';
import { Users, Store, Package, ShoppingBag, Wallet, Clock } from 'lucide-react';
import { listUsers } from '@/services/adminService';
import { listSellerRequests } from '@/services/sellerService';
import { listPendingProducts } from '@/services/productService';
import { listAllOrders } from '@/services/orderService';
import { formatPrice } from '@/utils/format';
import { SalesChart } from '@/components/ui/SalesChart';

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
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

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [pendingSellerCount, setPendingSellerCount] = useState(0);
  const [pendingProductCount, setPendingProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    listUsers().then((u) => setUserCount(u.length)).catch(() => setUserCount(0));
    listSellerRequests('approved').then((s) => setSellerCount(s.length)).catch(() => setSellerCount(0));
    listSellerRequests('pending').then((s) => setPendingSellerCount(s.length)).catch(() => setPendingSellerCount(0));
    listPendingProducts().then((p) => setPendingProductCount(p.length)).catch(() => setPendingProductCount(0));
    listAllOrders()
      .then((orders) => {
        setOrderCount(orders.length);
        setTotalSales(orders.reduce((sum, o) => sum + o.total, 0));
      })
      .catch(() => {
        setOrderCount(0);
        setTotalSales(0);
      });
  }, []);

  // نمودار نمونه برای نمایش رابط کاربری — در اتصال کامل از تجمیع سفارش‌های واقعی محاسبه شود
  const chartData = [
    { label: 'شنبه', amount: 1_200_000 },
    { label: 'یکشنبه', amount: 1_800_000 },
    { label: 'دوشنبه', amount: 900_000 },
    { label: 'سه‌شنبه', amount: 2_400_000 },
    { label: 'چهارشنبه', amount: 1_600_000 },
    { label: 'پنجشنبه', amount: 3_100_000 },
    { label: 'جمعه', amount: 2_000_000 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">داشبورد مدیریت</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Users} label="کاربران" value={userCount.toLocaleString('fa-IR')} />
        <StatCard icon={Store} label="فروشندگان تأییدشده" value={sellerCount.toLocaleString('fa-IR')} />
        <StatCard icon={ShoppingBag} label="کل سفارش‌ها" value={orderCount.toLocaleString('fa-IR')} />
        <StatCard icon={Wallet} label="فروش کل" value={formatPrice(totalSales)} />
        <StatCard icon={Clock} label="فروشندگی در انتظار" value={pendingSellerCount.toLocaleString('fa-IR')} />
        <StatCard icon={Package} label="محصولات در انتظار" value={pendingProductCount.toLocaleString('fa-IR')} />
      </div>

      <div className="glass-card mt-6 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">فروش هفته اخیر (کل پلتفرم)</h2>
        <SalesChart data={chartData} />
      </div>
    </div>
  );
}
