import { Link } from 'react-router-dom';
import { Star, Package, TrendingUp } from 'lucide-react';
import type { Seller } from '@/types';

export function TopSellersSection({ sellers }: { sellers: Seller[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">فروشندگان برتر</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            to={`/seller/${seller.id}`}
            className="glass-card flex items-center gap-4 p-5 transition-colors hover:border-brand-500/50"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
              {seller.storeName[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-ink">{seller.storeName}</h3>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {seller.rating.toLocaleString('fa-IR')}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" /> {seller.productCount.toLocaleString('fa-IR')} محصول
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> {seller.totalSales.toLocaleString('fa-IR')} فروش
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
