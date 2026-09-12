import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Package, TrendingUp, Phone } from 'lucide-react';
import { mockSellers } from '@/lib/mockData';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const seller = mockSellers.find((s) => s.id === id);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProducts({ sellerId: id, pageSize: 12 }).then((result) => {
      setProducts(result.items);
      setIsLoading(false);
    });
  }, [id]);

  if (!seller) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-2 text-lg font-bold text-ink">فروشنده پیدا نشد</h1>
        <Button onClick={() => navigate('/sellers')}>بازگشت به فروشندگان</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="glass-card mb-8 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-right">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white">
          {seller.storeName[0]}
        </span>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-ink">{seller.storeName}</h1>
          <p className="mt-1 text-sm leading-6 text-ink-muted">{seller.description}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-subtle sm:justify-start">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {seller.rating.toLocaleString('fa-IR')} امتیاز
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" /> {seller.productCount.toLocaleString('fa-IR')} محصول
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> {seller.totalSales.toLocaleString('fa-IR')} فروش
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {seller.phone}
            </span>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-base font-bold text-ink">محصولات این فروشنده</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="این فروشنده هنوز محصولی ثبت نکرده است" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
