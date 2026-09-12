import { Link } from 'react-router-dom';
import { Star, Package, TrendingUp } from 'lucide-react';
import { mockSellers } from '@/lib/mockData';

export default function Sellers() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-xl font-bold text-ink sm:text-2xl">فروشندگان</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockSellers.map((seller) => (
          <Link key={seller.id} to={`/seller/${seller.id}`} className="glass-card p-5 transition-colors hover:border-brand-500/50">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
                {seller.storeName[0]}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{seller.storeName}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {seller.rating.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
            <p className="mb-3 line-clamp-2 text-xs leading-6 text-ink-muted">{seller.description}</p>
            <div className="flex items-center gap-4 text-xs text-ink-subtle">
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" /> {seller.productCount.toLocaleString('fa-IR')} محصول
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> {seller.totalSales.toLocaleString('fa-IR')} فروش
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
