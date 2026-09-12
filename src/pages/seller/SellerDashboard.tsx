import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listSellerProducts } from '@/services/productService';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { SalesChart } from '@/components/ui/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';

// نمودار زیر نمونه‌ای برای نمایش رابط کاربری است.
// در اتصال واقعی، این داده باید از تجمیع سفارش‌های ۷ روز اخیر فروشنده در Appwrite محاسبه شود.
const sampleWeeklySales = [
  { label: 'شنبه', amount: 420000 },
  { label: 'یکشنبه', amount: 680000 },
  { label: 'دوشنبه', amount: 350000 },
  { label: 'سه‌شنبه', amount: 890000 },
  { label: 'چهارشنبه', amount: 610000 },
  { label: 'پنجشنبه', amount: 1020000 },
  { label: 'جمعه', amount: 740000 },
];

function StatCard({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
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

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    listSellerProducts(user.id)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [user]);

  const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.salesCount * p.price, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">داشبورد فروشنده</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Wallet} label="درآمد کل" value={formatPrice(totalRevenue)} />
        <StatCard icon={ShoppingBag} label="تعداد فروش" value={totalSales.toLocaleString('fa-IR')} />
        <StatCard icon={Package} label="محصولات" value={products.length.toLocaleString('fa-IR')} />
        <StatCard icon={AlertTriangle} label="کم‌موجودی" value={lowStock.length.toLocaleString('fa-IR')} />
      </div>

      <div className="glass-card mt-6 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">فروش هفته اخیر</h2>
        <SalesChart data={sampleWeeklySales} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink">محصولات کم‌موجودی</h2>
        {lowStock.length === 0 ? (
          <EmptyState title="همه محصولات موجودی کافی دارند" />
        ) : (
          <div className="space-y-2">
            {lowStock.map((p) => (
              <Link key={p.id} to={`/seller/products/${p.id}/edit`} className="glass-card flex items-center justify-between p-3 transition-colors hover:border-warning/50">
                <span className="text-sm text-ink">{p.name}</span>
                <span className="text-xs text-warning">{p.stock.toLocaleString('fa-IR')} عدد باقی‌مانده</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
